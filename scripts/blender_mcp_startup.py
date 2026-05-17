import os
import time

import bpy

PORT = int(os.environ.get("BLENDER_MCP_PORT", "9876"))

bpy.ops.preferences.addon_enable(module="blender_mcp")
bpy.context.scene.blendermcp_port = PORT

if hasattr(bpy.context.scene, "blendermcp_use_polyhaven"):
    bpy.context.scene.blendermcp_use_polyhaven = False

if not getattr(bpy.context.scene, "blendermcp_server_running", False):
    bpy.ops.blendermcp.start_server()

print(f"BLENDER_MCP_READY port={PORT}")

hold_seconds = float(os.environ.get("BLENDER_MCP_HOLD_SECONDS", "0"))
if hold_seconds > 0:
    time.sleep(hold_seconds)
