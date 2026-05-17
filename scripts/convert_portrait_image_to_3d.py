import math
from pathlib import Path

import bpy

ROOT = Path(r"C:\Users\casba\Downloads\Casey 3-D portfolio")
OUT_DIR = ROOT / "outputs" / "casey_3d_character"
OUT_DIR.mkdir(parents=True, exist_ok=True)

SOURCE_IMAGE = Path(r"C:\Users\casba\Downloads\ChatGPT Image May 17, 2026, 01_00_20 PM.png")

FLAT_BLEND = OUT_DIR / "casey_exact_image_3d_card.blend"
FLAT_GLB = OUT_DIR / "casey_exact_image_3d_card.glb"
FLAT_RENDER = OUT_DIR / "casey_exact_image_3d_card_render.png"

CURVED_BLEND = OUT_DIR / "casey_exact_image_curved_3d.blend"
CURVED_GLB = OUT_DIR / "casey_exact_image_curved_3d.glb"
CURVED_RENDER = OUT_DIR / "casey_exact_image_curved_3d_render.png"


def clear_scene():
    bpy.ops.object.select_all(action="SELECT")
    bpy.ops.object.delete()


def make_image_material(name: str):
    mat = bpy.data.materials.new(name)
    mat.use_nodes = True
    nodes = mat.node_tree.nodes
    bsdf = nodes.get("Principled BSDF")
    tex = nodes.new("ShaderNodeTexImage")
    tex.image = bpy.data.images.load(str(SOURCE_IMAGE))
    tex.extension = "CLIP"
    mat.node_tree.links.new(tex.outputs["Color"], bsdf.inputs["Base Color"])
    bsdf.inputs["Roughness"].default_value = 0.42
    return mat


def make_solid_material(name: str, color):
    mat = bpy.data.materials.new(name)
    mat.use_nodes = True
    bsdf = mat.node_tree.nodes.get("Principled BSDF")
    bsdf.inputs["Base Color"].default_value = color
    bsdf.inputs["Roughness"].default_value = 0.55
    return mat


def add_image_plane(name: str, curved: bool):
    image = bpy.data.images.load(str(SOURCE_IMAGE), check_existing=True)
    width = 4.8
    height = width * image.size[1] / image.size[0]
    cols = 80 if curved else 1
    rows = 44 if curved else 1
    verts = []
    faces = []
    uvs = []

    for y in range(rows + 1):
        v = y / rows
        for x in range(cols + 1):
            u = x / cols
            px = (u - 0.5) * width
            pz = (0.5 - v) * height
            py = 0
            if curved:
                py = -0.28 * math.cos((u - 0.5) * math.pi) + 0.28
                pz += 0.05 * math.cos((v - 0.5) * math.pi * 2)
            verts.append((px, py, pz))
            uvs.append((u, 1 - v))

    for y in range(rows):
        for x in range(cols):
            a = y * (cols + 1) + x
            faces.append((a, a + 1, a + cols + 2, a + cols + 1))

    mesh = bpy.data.meshes.new(name + " mesh")
    mesh.from_pydata(verts, [], faces)
    mesh.update()

    obj = bpy.data.objects.new(name, mesh)
    bpy.context.collection.objects.link(obj)
    obj.data.materials.append(make_image_material("exact supplied portrait texture"))

    uv_layer = mesh.uv_layers.new(name="UVMap")
    for poly in mesh.polygons:
        for loop_index in poly.loop_indices:
            uv_layer.data[loop_index].uv = uvs[mesh.loops[loop_index].vertex_index]

    if curved:
        obj.modifiers.new("smooth image surface", "WEIGHTED_NORMAL")
    return obj, width, height


def add_backing(width: float, height: float, curved: bool):
    mat = make_solid_material("thin black card edge", (0.01, 0.01, 0.012, 1))
    bpy.ops.mesh.primitive_cube_add(location=(0, 0.065 if curved else 0.045, 0))
    obj = bpy.context.object
    obj.name = "thin 3D backing"
    obj.scale = (width / 2 + 0.035, 0.035, height / 2 + 0.035)
    obj.data.materials.append(mat)
    bevel = obj.modifiers.new("small bevel", "BEVEL")
    bevel.width = 0.035
    bevel.segments = 8
    obj.modifiers.new("weighted normals", "WEIGHTED_NORMAL")
    return obj


def setup_camera(width: float, height: float):
    bpy.ops.object.light_add(type="AREA", location=(0, -3.3, 3.0))
    light = bpy.context.object
    light.name = "soft studio light"
    light.data.energy = 420
    light.data.size = 4

    bpy.ops.object.camera_add(location=(0, -6.1, 0.12), rotation=(math.radians(89), 0, 0))
    camera = bpy.context.object
    bpy.context.scene.camera = camera
    camera.data.lens = 46

    bpy.context.scene.render.engine = "CYCLES"
    bpy.context.scene.cycles.samples = 96
    bpy.context.scene.render.resolution_x = 1600
    bpy.context.scene.render.resolution_y = round(1600 * height / width)
    bpy.context.scene.world.color = (0.015, 0.015, 0.017)
    bpy.context.scene.view_settings.view_transform = "Filmic"
    bpy.context.scene.view_settings.look = "Medium High Contrast"


def export_scene(blend_path: Path, glb_path: Path, render_path: Path, curved: bool):
    clear_scene()
    card, width, height = add_image_plane("exact supplied portrait 3D surface", curved)
    backing = add_backing(width, height, curved)
    setup_camera(width, height)

    bpy.ops.wm.save_as_mainfile(filepath=str(blend_path))
    bpy.ops.object.select_all(action="DESELECT")
    card.select_set(True)
    backing.select_set(True)
    bpy.context.view_layer.objects.active = card
    bpy.ops.export_scene.gltf(filepath=str(glb_path), export_format="GLB", use_selection=True)
    bpy.context.scene.render.filepath = str(render_path)
    bpy.ops.render.render(write_still=True)


def main():
    if not SOURCE_IMAGE.exists():
        raise FileNotFoundError(SOURCE_IMAGE)

    export_scene(FLAT_BLEND, FLAT_GLB, FLAT_RENDER, curved=False)
    export_scene(CURVED_BLEND, CURVED_GLB, CURVED_RENDER, curved=True)

    print(f"EXACT_IMAGE_FLAT_GLB={FLAT_GLB}")
    print(f"EXACT_IMAGE_FLAT_RENDER={FLAT_RENDER}")
    print(f"EXACT_IMAGE_CURVED_GLB={CURVED_GLB}")
    print(f"EXACT_IMAGE_CURVED_RENDER={CURVED_RENDER}")


if __name__ == "__main__":
    main()
