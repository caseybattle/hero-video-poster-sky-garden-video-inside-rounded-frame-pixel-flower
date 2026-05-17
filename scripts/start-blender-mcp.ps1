$ErrorActionPreference = "Stop"

$BlenderExe = Join-Path $env:LOCALAPPDATA "Programs\Blender-4.5.5\Blender Foundation\Blender 4.5\blender.exe"
$AddonSource = Join-Path $env:USERPROFILE ".codex\mcp-servers\blender-mcp\addon.py"
$AddonDir = Join-Path $env:APPDATA "Blender Foundation\Blender\4.5\scripts\addons"
$AddonDest = Join-Path $AddonDir "blender_mcp.py"
$StartupScript = Join-Path $PSScriptRoot "blender_mcp_startup.py"
$Port = if ($env:BLENDER_MCP_PORT) { $env:BLENDER_MCP_PORT } else { "9876" }

if (!(Test-Path $BlenderExe)) {
  throw "Blender executable not found: $BlenderExe"
}

if (!(Test-Path $AddonSource)) {
  throw "BlenderMCP addon not found: $AddonSource"
}

New-Item -ItemType Directory -Force -Path $AddonDir | Out-Null
Copy-Item -LiteralPath $AddonSource -Destination $AddonDest -Force

$env:BLENDER_MCP_PORT = $Port
Start-Process -FilePath $BlenderExe -ArgumentList @("--python", "`"$StartupScript`"")

Write-Output "Started Blender with BlenderMCP on localhost:$Port"
