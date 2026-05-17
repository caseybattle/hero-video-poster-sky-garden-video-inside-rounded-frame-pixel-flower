# Blender MCP Setup

## Status
Configured and smoke-tested on 2026-05-17.

## Source
- Repository: https://github.com/ahujasid/blender-mcp
- Package command: `blender-mcp`

## Installed Paths
- Blender executable:
  `C:\Users\casba\AppData\Local\Programs\Blender-4.5.5\Blender Foundation\Blender 4.5\blender.exe`
- BlenderMCP repo:
  `C:\Users\casba\.codex\mcp-servers\blender-mcp`
- Blender add-on copy:
  `C:\Users\casba\AppData\Roaming\Blender Foundation\Blender\4.5\scripts\addons\blender_mcp.py`

## Codex MCP Config
Added `[mcp_servers.blender]` to:
- `C:\Users\casba\.codex-desktop-clean\config.toml`
- `C:\Users\casba\.codex\config.toml`

Backups:
- `C:\Users\casba\.codex-desktop-clean\config.toml.bak-blender-mcp-20260517`
- `C:\Users\casba\.codex\config.toml.bak-blender-mcp-20260517`

The config uses:
`C:\Users\casba\.local\bin\uv.exe --native-tls tool run blender-mcp`

`--native-tls` is required on this machine because default PyPI TLS validation failed.

## Start Blender For MCP
From this project folder:

```powershell
.\scripts\start-blender-mcp.ps1
```

This opens Blender and starts the BlenderMCP socket server on:
`localhost:9876`

## Smoke Test Result
PASS

Blender started the add-on, opened `localhost:9876`, accepted a test connection, then shut down cleanly.

## Required Next Step
Restart Codex Desktop so the new Blender MCP server is loaded into the active tool list.

## Security Note
BlenderMCP can execute Python inside Blender. Only use it in trusted workspaces and save important Blender files before agent-driven changes.
