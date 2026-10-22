@echo off
title AutoPro Garage - Local Site
cd /d "%~dp0"

echo.
echo  ================================================
echo    AutoPro Garage - opening your local site
echo  ================================================
echo.
echo  The site runs in the background on this computer
echo  and starts by itself when you log in to Windows.
echo  You can close this window at any time.
echo.

schtasks /run /tn "AutoPro Garage Local Site" >nul 2>&1
if errorlevel 1 goto fallback

echo  Waiting for the site (up to 2 minutes if it has only just started)...
powershell -NoProfile -ExecutionPolicy Bypass -Command "for($i=0;$i -lt 60;$i++){ try { Invoke-WebRequest http://localhost:3000 -UseBasicParsing -TimeoutSec 60 | Out-Null; exit 0 } catch { Start-Sleep -Seconds 2 } }; exit 1"
if errorlevel 1 goto failed

start "" http://localhost:3000
echo  Opened http://localhost:3000
timeout /t 4 >nul
goto :eof

:failed
echo.
echo  The site did not come up. Details are in:
echo    %~dp0logs\local-site.log
echo.
pause
goto :eof

:fallback
rem Background task missing - run in this window instead, as before.
echo  Background task not found - running the site in this window.
echo  Keep this window open while you use the site.
echo.
start "" /b cmd /c "timeout /t 15 /nobreak >nul && start http://localhost:3000"
call npm run dev
echo.
echo  The site has stopped. You can close this window.
pause >nul
