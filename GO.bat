@echo off
REM ===================================================================
REM  Double-click this file to deploy Synergy Business end-to-end:
REM    1. Push code to GitHub
REM    2. SSH into your VPS and run the installer
REM    3. Site goes live at https://synergybusiness.ae
REM
REM  All inputs are interactive — you only need:
REM    - Your VPS IP address
REM    - Your VPS root password (or SSH key set up)
REM    - A GitHub Personal Access Token (only if your repo is private)
REM ===================================================================
powershell.exe -NoProfile -ExecutionPolicy Bypass -File "%~dp0scripts\go.ps1" %*
echo.
echo Press any key to close...
pause >nul
