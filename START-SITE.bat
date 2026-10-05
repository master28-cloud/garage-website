@echo off
title AutoPro Garage - Local Site
cd /d "%~dp0"

echo.
echo  ================================================
echo    AutoPro Garage - starting your local site
echo  ================================================
echo.
echo  This runs ONLY on this computer. Nothing is
echo  published to the internet.
echo.
echo  Your site will open automatically in a moment.
echo.
echo  To STOP the site: close this window.
echo.
echo  ------------------------------------------------
echo.

start "" /b cmd /c "timeout /t 12 /nobreak >nul && start http://localhost:3000"

call npm run dev

echo.
echo  The site has stopped. You can close this window.
pause >nul
