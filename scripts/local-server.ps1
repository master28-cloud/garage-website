# Keeps the local AutoPro site running on http://localhost:3000.
#
# Launched hidden at logon by the "AutoPro Garage Local Site" scheduled task, so
# it belongs to Windows rather than to whichever terminal or editor happened to
# start it - closing VS Code or a Claude Code session no longer takes it down.
# If the dev server exits for any reason it is restarted a few seconds later.
# Output: logs\local-site.log (rotated at 5 MB).

$root = Split-Path -Parent $PSScriptRoot
Set-Location -LiteralPath $root
[Environment]::CurrentDirectory = $root
$env:Path = [Environment]::GetEnvironmentVariable("Path", "Machine") + ";" +
            [Environment]::GetEnvironmentVariable("Path", "User")

$logs = Join-Path $root "logs"
New-Item -ItemType Directory -Force -Path $logs | Out-Null
$log = Join-Path $logs "local-site.log"

function Write-Log($msg) {
  "[$(Get-Date -Format s)] $msg" | Add-Content -LiteralPath $log -Encoding ASCII
}

while ($true) {
  # Port already served (a manual npm run dev, say): don't start a second copy.
  if (Get-NetTCPConnection -LocalPort 3000 -State Listen -ErrorAction SilentlyContinue) {
    Start-Sleep -Seconds 30
    continue
  }

  if ((Test-Path -LiteralPath $log) -and (Get-Item -LiteralPath $log).Length -gt 5MB) {
    Move-Item -LiteralPath $log -Destination (Join-Path $logs "local-site.old.log") -Force
  }

  Write-Log "starting dev server"
  # Relative path keeps the OneDrive folder's spaces out of cmd's quoting.
  cmd.exe /c "npm run dev >> logs\local-site.log 2>&1"
  Write-Log "dev server stopped (exit $LASTEXITCODE); restarting in 5s"
  Start-Sleep -Seconds 5
}
