import math
import os
from pathlib import Path

import bpy
from mathutils import Vector

ROOT = Path(r"C:\Users\casba\Downloads\Casey 3-D portfolio")
OUT_DIR = ROOT / "outputs" / "casey_3d_character"
OUT_DIR.mkdir(parents=True, exist_ok=True)

RENDER_PATH = OUT_DIR / "casey_3d_bust_render.png"
BLEND_PATH = OUT_DIR / "casey_3d_bust.blend"
GLB_PATH = OUT_DIR / "casey_3d_bust.glb"


def clear_scene():
    bpy.ops.object.select_all(action="SELECT")
    bpy.ops.object.delete()


def material(name, color, roughness=0.35, metallic=0.0, alpha=1.0, transmission=0.0):
    mat = bpy.data.materials.new(name)
    mat.use_nodes = True
    bsdf = mat.node_tree.nodes.get("Principled BSDF")
    if bsdf:
        bsdf.inputs["Base Color"].default_value = color
        bsdf.inputs["Roughness"].default_value = roughness
        bsdf.inputs["Metallic"].default_value = metallic
        if "Alpha" in bsdf.inputs:
            bsdf.inputs["Alpha"].default_value = alpha
        if "Transmission Weight" in bsdf.inputs:
            bsdf.inputs["Transmission Weight"].default_value = transmission
    mat.blend_method = "BLEND" if alpha < 1 else "OPAQUE"
    mat.use_screen_refraction = alpha < 1
    return mat


def add_uv_sphere(name, loc, scale, mat, segments=96, rings=48):
    bpy.ops.mesh.primitive_uv_sphere_add(segments=segments, ring_count=rings, location=loc)
    obj = bpy.context.object
    obj.name = name
    obj.scale = scale
    if mat:
        obj.data.materials.append(mat)
    bpy.ops.object.shade_smooth()
    return obj


def add_cube(name, loc, scale, mat, bevel=0.0):
    bpy.ops.mesh.primitive_cube_add(location=loc)
    obj = bpy.context.object
    obj.name = name
    obj.scale = scale
    if mat:
        obj.data.materials.append(mat)
    if bevel:
        mod = obj.modifiers.new("Soft bevel", "BEVEL")
        mod.width = bevel
        mod.segments = 16
        obj.modifiers.new("Weighted normals", "WEIGHTED_NORMAL")
    return obj


def add_cylinder(name, loc, radius, depth, mat, vertices=64, rotation=(0, 0, 0)):
    bpy.ops.mesh.primitive_cylinder_add(vertices=vertices, radius=radius, depth=depth, location=loc, rotation=rotation)
    obj = bpy.context.object
    obj.name = name
    if mat:
        obj.data.materials.append(mat)
    bpy.ops.object.shade_smooth()
    return obj


def add_torus(name, loc, major, minor, mat, rotation=(0, 0, 0), scale=(1, 1, 1)):
    bpy.ops.mesh.primitive_torus_add(major_radius=major, minor_radius=minor, major_segments=128, minor_segments=16, location=loc, rotation=rotation)
    obj = bpy.context.object
    obj.name = name
    obj.scale = scale
    if mat:
        obj.data.materials.append(mat)
    bpy.ops.object.shade_smooth()
    return obj


def add_text(name, text, loc, size, mat):
    bpy.ops.object.text_add(location=loc, rotation=(math.radians(82), 0, 0))
    obj = bpy.context.object
    obj.name = name
    obj.data.body = text
    obj.data.align_x = "CENTER"
    obj.data.size = size
    obj.data.extrude = 0.01
    if mat:
        obj.data.materials.append(mat)
    return obj


def make_cloud(name, loc, scale, mat):
    parts = [
        ((0.0, 0.0, 0.0), (0.55, 0.24, 0.18)),
        ((0.42, 0.03, 0.02), (0.38, 0.18, 0.14)),
        ((-0.44, 0.02, 0.0), (0.42, 0.18, 0.14)),
        ((0.08, 0.08, 0.12), (0.34, 0.20, 0.18)),
    ]
    objs = []
    for i, (offset, part_scale) in enumerate(parts):
        loc_vec = Vector(loc) + Vector(offset)
        obj = add_uv_sphere(f"{name}_{i}", loc_vec, tuple(Vector(part_scale) * scale), mat, 32, 16)
        objs.append(obj)
    return objs


def main():
    clear_scene()

    skin = material("warm skin shader", (0.72, 0.38, 0.20, 1.0), 0.44)
    skin_highlight = material("skin highlight", (0.95, 0.63, 0.38, 1.0), 0.38)
    hair = material("close cropped dark hair", (0.025, 0.018, 0.014, 1.0), 0.58)
    goatee = material("goatee dark hair", (0.018, 0.011, 0.008, 1.0), 0.52)
    gold = material("polished gold frame", (1.0, 0.55, 0.11, 1.0), 0.18, metallic=1.0)
    lens = material("deep cobalt glass lenses", (0.0, 0.05, 0.78, 0.68), 0.04, metallic=0.0, alpha=0.72, transmission=0.05)
    blue = material("sky blue backdrop", (0.0, 0.42, 1.0, 1.0), 0.55)
    cloud = material("soft cloud white", (0.94, 0.93, 0.96, 1.0), 0.8)
    black = material("matte black", (0.006, 0.006, 0.006, 1.0), 0.7)
    white = material("cool white lettering", (0.86, 0.93, 0.98, 1.0), 0.35)

    head = add_uv_sphere("Casey stylized head", (0, 0, 1.55), (0.78, 0.63, 1.0), skin)
    head.modifiers.new("subtle sculpt smooth", "WEIGHTED_NORMAL")

    neck = add_cylinder("floating neck base", (0, 0, 0.52), 0.42, 1.05, skin, 96)
    chin = add_uv_sphere("defined chin", (0, -0.03, 0.82), (0.38, 0.32, 0.23), skin_highlight, 64, 24)
    nose = add_uv_sphere("nose bridge and tip", (0, -0.56, 1.55), (0.14, 0.18, 0.28), skin_highlight, 64, 24)
    nose.rotation_euler[0] = math.radians(-8)

    left_ear = add_uv_sphere("left ear", (-0.76, -0.02, 1.56), (0.12, 0.08, 0.28), skin, 48, 20)
    right_ear = add_uv_sphere("right ear", (0.76, -0.02, 1.56), (0.12, 0.08, 0.28), skin, 48, 20)

    hair_cap = add_uv_sphere("close fade hair cap", (0, 0.04, 2.23), (0.8, 0.64, 0.22), hair, 96, 24)
    hair_cap.rotation_euler[0] = math.radians(4)

    # Sunglasses: blue lenses plus gold rim/bridge/temples.
    left_lens = add_uv_sphere("left blue lens", (-0.29, -0.68, 1.67), (0.29, 0.035, 0.18), lens, 64, 20)
    right_lens = add_uv_sphere("right blue lens", (0.29, -0.68, 1.67), (0.29, 0.035, 0.18), lens, 64, 20)
    for obj in (left_lens, right_lens):
        obj.rotation_euler[0] = math.radians(90)

    for x in (-0.29, 0.29):
        add_torus(f"gold lens rim {x}", (x, -0.702, 1.67), 0.255, 0.017, gold, rotation=(math.radians(90), 0, 0), scale=(1.15, 0.72, 1))
    add_cube("gold bridge", (0, -0.7, 1.69), (0.15, 0.018, 0.028), gold, 0.012)
    add_cube("left gold temple", (-0.68, -0.66, 1.68), (0.23, 0.022, 0.026), gold, 0.012)
    add_cube("right gold temple", (0.68, -0.66, 1.68), (0.23, 0.022, 0.026), gold, 0.012)
    add_text("left temple mark", "T", (-0.74, -0.73, 1.76), 0.12, gold)
    add_text("right temple mark", "T", (0.74, -0.73, 1.76), 0.12, gold)

    upper_lip = add_uv_sphere("upper lip", (0, -0.6, 1.16), (0.28, 0.035, 0.035), skin_highlight, 48, 16)
    lower_lip = add_uv_sphere("lower lip", (0, -0.61, 1.07), (0.32, 0.04, 0.045), skin_highlight, 48, 16)
    moustache = add_uv_sphere("trim moustache", (0, -0.64, 1.26), (0.31, 0.035, 0.035), goatee, 48, 16)
    goatee_patch = add_uv_sphere("small goatee", (0, -0.63, 0.86), (0.18, 0.04, 0.16), goatee, 48, 16)
    chin_hair = add_uv_sphere("chin hair texture", (0, -0.61, 0.78), (0.25, 0.03, 0.08), goatee, 48, 16)

    # Stylized sky sphere behind the bust, matching the supplied portrait's blue/white atmosphere.
    bpy.ops.mesh.primitive_uv_sphere_add(segments=128, ring_count=64, location=(0, 1.45, 1.55))
    sky = bpy.context.object
    sky.name = "blue sky hero sphere"
    sky.scale = (3.0, 0.14, 1.65)
    sky.data.materials.append(blue)
    bpy.ops.object.shade_smooth()

    make_cloud("left cloud", (-1.65, 1.22, 1.9), 1.0, cloud)
    make_cloud("right cloud", (1.55, 1.2, 1.25), 0.92, cloud)
    make_cloud("top cloud", (0.9, 1.18, 2.55), 0.78, cloud)
    make_cloud("bottom cloud", (-0.5, 1.2, 0.65), 0.9, cloud)

    bpy.ops.object.light_add(type="AREA", location=(0, -3.0, 4.0))
    key = bpy.context.object
    key.name = "large softbox reflection"
    key.data.energy = 520
    key.data.size = 4.0

    bpy.ops.object.light_add(type="POINT", location=(-1.8, -1.8, 2.2))
    rim = bpy.context.object
    rim.name = "blue lens sparkle"
    rim.data.energy = 100
    rim.data.color = (0.35, 0.55, 1.0)

    bpy.ops.object.camera_add(location=(0, -6.8, 1.7), rotation=(math.radians(82), 0, 0))
    bpy.context.scene.camera = bpy.context.object
    bpy.context.object.name = "portrait render camera"

    bpy.context.scene.render.engine = "CYCLES"
    bpy.context.scene.cycles.samples = 96
    bpy.context.scene.view_settings.view_transform = "Filmic"
    bpy.context.scene.view_settings.look = "Medium High Contrast"
    bpy.context.scene.world.color = (0.006, 0.006, 0.006)
    bpy.context.scene.render.resolution_x = 1600
    bpy.context.scene.render.resolution_y = 1000
    bpy.context.scene.render.film_transparent = False

    bpy.ops.wm.save_as_mainfile(filepath=str(BLEND_PATH))
    bpy.ops.object.select_all(action="DESELECT")
    for obj in bpy.context.scene.objects:
        if obj.type in {"MESH", "CURVE", "FONT"} and not obj.hide_render:
            obj.select_set(True)
    bpy.ops.export_scene.gltf(filepath=str(GLB_PATH), export_format="GLB", use_selection=True)
    bpy.context.scene.render.filepath = str(RENDER_PATH)
    bpy.ops.render.render(write_still=True)

    print(f"CASEY_3D_RENDER={RENDER_PATH}")
    print(f"CASEY_3D_BLEND={BLEND_PATH}")
    print(f"CASEY_3D_GLB={GLB_PATH}")


if __name__ == "__main__":
    main()
