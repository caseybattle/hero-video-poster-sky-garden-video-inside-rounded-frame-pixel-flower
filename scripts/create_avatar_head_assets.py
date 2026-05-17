from __future__ import annotations

import math
from collections import deque
from pathlib import Path

import bpy
import numpy as np


ROOT = Path(__file__).resolve().parents[1]
SOURCE_IMAGE = ROOT.parent / "ChatGPT Image May 17, 2026, 01_00_20 PM.png"
OUT_DIR = ROOT / "outputs" / "casey_3d_character"
PUBLIC_DIR = ROOT / "public"

HEAD_TEXTURE = PUBLIC_DIR / "casey-head-cutout.png"
SKY_TEXTURE = PUBLIC_DIR / "casey-sky-background.png"
BLEND_PATH = OUT_DIR / "avatar-head.blend"
GLB_PATH = OUT_DIR / "avatar-head.glb"
PUBLIC_GLB = PUBLIC_DIR / "avatar-head.glb"
RENDER_PATH = OUT_DIR / "avatar-head-render.png"


def load_pixels(image_path: Path) -> tuple[np.ndarray, int, int]:
    image = bpy.data.images.load(str(image_path), check_existing=False)
    width, height = image.size
    pixels = np.array(image.pixels[:], dtype=np.float32).reshape((height, width, 4))
    pixels = np.flipud(pixels)
    return pixels, width, height


def is_background_like(rgb: np.ndarray) -> np.ndarray:
    r = rgb[..., 0]
    g = rgb[..., 1]
    b = rgb[..., 2]
    maxc = np.max(rgb, axis=-1)
    minc = np.min(rgb, axis=-1)
    saturation = maxc - minc
    blue_sky = (b > 0.48) & (g > 0.32) & (b > r + 0.07)
    white_cloud = (r > 0.58) & (g > 0.58) & (b > 0.58) & (saturation < 0.28)
    return blue_sky | white_cloud


def connected_background_mask(rgb: np.ndarray) -> np.ndarray:
    height, width, _ = rgb.shape
    candidates = is_background_like(rgb)
    visited = np.zeros((height, width), dtype=bool)
    queue: deque[tuple[int, int]] = deque()

    def add(y: int, x: int) -> None:
        if not visited[y, x] and candidates[y, x]:
            visited[y, x] = True
            queue.append((y, x))

    for x in range(width):
        add(0, x)
        add(height - 1, x)
    for y in range(height):
        add(y, 0)
        add(y, width - 1)

    while queue:
        y, x = queue.popleft()
        for ny, nx in ((y - 1, x), (y + 1, x), (y, x - 1), (y, x + 1)):
            if 0 <= ny < height and 0 <= nx < width:
                add(ny, nx)

    return visited


def soften_alpha(foreground: np.ndarray) -> np.ndarray:
    alpha = foreground.astype(np.float32)
    for _ in range(3):
        padded = np.pad(alpha, 1, mode="edge")
        alpha = (
            padded[1:-1, 1:-1] * 4
            + padded[:-2, 1:-1]
            + padded[2:, 1:-1]
            + padded[1:-1, :-2]
            + padded[1:-1, 2:]
        ) / 8
    return np.clip(alpha, 0, 1)


def save_png(path: Path, pixels: np.ndarray) -> None:
    height, width, _ = pixels.shape
    image = bpy.data.images.new(path.stem, width, height, alpha=True)
    flipped = np.flipud(np.clip(pixels, 0, 1)).astype(np.float32).reshape(-1)
    image.pixels.foreach_set(flipped)
    image.filepath_raw = str(path)
    image.file_format = "PNG"
    image.save()


def make_procedural_sky(width: int, height: int) -> np.ndarray:
    yy, xx = np.mgrid[0:height, 0:width]
    y = yy / max(1, height - 1)
    top = np.array([0.02, 0.43, 0.86], dtype=np.float32)
    bottom = np.array([0.38, 0.72, 1.0], dtype=np.float32)
    rgb = top * (1 - y[..., None]) + bottom * y[..., None]

    cloud_specs = [
        (0.12, 0.32, 0.22, 0.09, 0.74),
        (0.22, 0.63, 0.17, 0.08, 0.58),
        (0.84, 0.28, 0.24, 0.11, 0.74),
        (0.78, 0.74, 0.20, 0.09, 0.62),
        (0.42, 0.86, 0.30, 0.10, 0.52),
    ]
    cloud = np.zeros((height, width), dtype=np.float32)
    for cx, cy, sx, sy, strength in cloud_specs:
        for offset, weight in [(-0.34, 0.6), (-0.15, 0.9), (0.04, 1.0), (0.23, 0.75), (0.39, 0.48)]:
            lx = (xx / width - (cx + offset * sx)) / sx
            ly = (yy / height - (cy + 0.18 * math.sin(offset * 7) * sy)) / sy
            cloud += strength * weight * np.exp(-(lx * lx * 2.6 + ly * ly * 5.2))

    cloud = np.clip(cloud, 0, 0.88)
    for _ in range(18):
        padded = np.pad(cloud, 1, mode="edge")
        cloud = (
            padded[1:-1, 1:-1] * 4
            + padded[:-2, 1:-1]
            + padded[2:, 1:-1]
            + padded[1:-1, :-2]
            + padded[1:-1, 2:]
        ) / 8

    cloud_color = np.array([0.96, 0.96, 0.98], dtype=np.float32)
    rgb = rgb * (1 - cloud[..., None]) + cloud_color * cloud[..., None]
    rgba = np.dstack([rgb, np.ones((height, width), dtype=np.float32)])
    return rgba


def make_assets() -> tuple[np.ndarray, int, int]:
    rgba, width, height = load_pixels(SOURCE_IMAGE)
    rgb = rgba[..., :3]
    background = connected_background_mask(rgb)
    foreground = ~background
    alpha = soften_alpha(foreground)

    head = rgba.copy()
    head[..., 3] = alpha
    save_png(HEAD_TEXTURE, head)

    save_png(SKY_TEXTURE, make_procedural_sky(width, height))
    return alpha, width, height


def clear_scene() -> None:
    bpy.ops.object.select_all(action="SELECT")
    bpy.ops.object.delete()


def create_head_material() -> bpy.types.Material:
    material = bpy.data.materials.new("Casey exact head texture")
    material.use_nodes = True
    material.blend_method = "BLEND"
    material.use_screen_refraction = True
    material.show_transparent_back = True
    bsdf = material.node_tree.nodes.get("Principled BSDF")
    tex = material.node_tree.nodes.new("ShaderNodeTexImage")
    tex.image = bpy.data.images.load(str(HEAD_TEXTURE), check_existing=True)
    material.node_tree.links.new(tex.outputs["Color"], bsdf.inputs["Base Color"])
    material.node_tree.links.new(tex.outputs["Alpha"], bsdf.inputs["Alpha"])
    bsdf.inputs["Roughness"].default_value = 0.52
    return material


def create_curved_head(width: int, height: int) -> bpy.types.Object:
    aspect = width / height
    mesh_width = 4.8
    mesh_height = mesh_width / aspect
    cols = 96
    rows = 64
    verts: list[tuple[float, float, float]] = []
    uvs: list[tuple[float, float]] = []

    for row in range(rows + 1):
        v = row / rows
        z = (0.5 - v) * mesh_height
        for col in range(cols + 1):
            u = col / cols
            x_flat = (u - 0.5) * mesh_width
            theta = (u - 0.5) * math.radians(42)
            radius = mesh_width / math.radians(42)
            x = math.sin(theta) * radius
            y = -0.36 * (1 - math.cos(theta))
            verts.append((x, y, z))
            uvs.append((u, 1 - v))

    faces: list[tuple[int, int, int, int]] = []
    for row in range(rows):
        for col in range(cols):
            a = row * (cols + 1) + col
            faces.append((a, a + 1, a + cols + 2, a + cols + 1))

    mesh = bpy.data.meshes.new("casey_head_curved_mesh")
    mesh.from_pydata(verts, [], faces)
    mesh.update()
    uv_layer = mesh.uv_layers.new(name="UVMap")
    for poly in mesh.polygons:
        for loop_index in poly.loop_indices:
            uv_layer.data[loop_index].uv = uvs[mesh.loops[loop_index].vertex_index]

    obj = bpy.data.objects.new("Casey exact-image curved head", mesh)
    bpy.context.collection.objects.link(obj)
    obj.data.materials.append(create_head_material())
    bpy.context.view_layer.objects.active = obj
    obj.select_set(True)
    bpy.ops.object.shade_smooth()
    return obj


def add_lighting_and_camera() -> None:
    bpy.ops.object.light_add(type="AREA", location=(0, -4.2, 4))
    key = bpy.context.object
    key.name = "large softbox"
    key.data.energy = 500
    key.data.size = 5

    bpy.ops.object.camera_add(location=(0, -7, 0), rotation=(math.radians(90), 0, 0))
    bpy.context.scene.camera = bpy.context.object
    bpy.context.scene.render.resolution_x = 1200
    bpy.context.scene.render.resolution_y = 1200
    bpy.context.scene.eevee.taa_render_samples = 64


def export_model() -> None:
    clear_scene()
    make_assets()
    head = create_curved_head(1680, 921)
    add_lighting_and_camera()
    bpy.ops.wm.save_as_mainfile(filepath=str(BLEND_PATH))
    bpy.ops.object.select_all(action="DESELECT")
    head.select_set(True)
    bpy.context.view_layer.objects.active = head
    bpy.ops.export_scene.gltf(
        filepath=str(GLB_PATH),
        export_format="GLB",
        use_selection=True,
        export_apply=True,
    )
    bpy.ops.render.render(write_still=True)
    bpy.data.images["Render Result"].save_render(filepath=str(RENDER_PATH))
    PUBLIC_GLB.write_bytes(GLB_PATH.read_bytes())
    print(f"Wrote {PUBLIC_GLB}")


if __name__ == "__main__":
    OUT_DIR.mkdir(parents=True, exist_ok=True)
    PUBLIC_DIR.mkdir(parents=True, exist_ok=True)
    export_model()
