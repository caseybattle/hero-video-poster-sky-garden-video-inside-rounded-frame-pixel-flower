from __future__ import annotations

import json
import sys
from pathlib import Path

import bpy


path = Path(sys.argv[-1])
bpy.ops.object.select_all(action="SELECT")
bpy.ops.object.delete()
bpy.ops.import_scene.gltf(filepath=str(path))

meshes = [obj for obj in bpy.context.scene.objects if obj.type == "MESH"]
materials = sorted({slot.material.name for obj in meshes for slot in obj.material_slots if slot.material})
textures = []
for image in bpy.data.images:
    if image.filepath:
        textures.append({"name": image.name, "size": list(image.size)})

if meshes:
    min_v = [float("inf")] * 3
    max_v = [float("-inf")] * 3
    for obj in meshes:
        for corner in obj.bound_box:
            world = obj.matrix_world @ bpy.mathutils.Vector(corner) if hasattr(bpy, "mathutils") else None
    import mathutils

    for obj in meshes:
        for corner in obj.bound_box:
            world = obj.matrix_world @ mathutils.Vector(corner)
            for i in range(3):
                min_v[i] = min(min_v[i], world[i])
                max_v[i] = max(max_v[i], world[i])
    size = [max_v[i] - min_v[i] for i in range(3)]
else:
    size = [0, 0, 0]

print(
    json.dumps(
        {
            "file": str(path),
            "meshes": len(meshes),
            "materials": materials[:20],
            "textureCount": len(textures),
            "textures": textures[:12],
            "bboxSize": size,
        },
        indent=2,
    )
)
