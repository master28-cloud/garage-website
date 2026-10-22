@echo off
title AutoPro Garage - Stop Local Site
echo.
echo  Stopping the local AutoPro site...

schtasks /end /tn "AutoPro Garage Local Site" >nul 2>&1

rem Kill the keep-alive loop and everything it started, then anything still on port 3000.
powershell -NoProfile -ExecutionPolicy Bypass -Command "Get-CimInstance Win32_Process | Where-Object { $_.CommandLine -match 'local-server\.ps1' } | ForEach-Object { taskkill /PID $_.ProcessId /T /F | Out-Null }; Get-NetTCPConnection -LocalPort 3000 -State Listen -ErrorAction SilentlyContinue | ForEach-Object { taskkill /PID $_.OwningProcess /T /F | Out-Null }"

echo  Stopped. It starts again by itself next time you log in to
echo  Windows, or when you double-click START-SITE.bat.
echo.
timeout /t 5 >nul
