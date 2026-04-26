@echo off
REM ===================================================================
REM  Double-click this file ONCE to enable auto-deploy:
REM    1. Generates an SSH deploy keypair
REM    2. SSHes into the VPS, authorises the key, installs cron poller
REM    3. Sets GitHub repo secrets (VPS_HOST / VPS_USER / VPS_SSH_KEY)
REM    4. Triggers a test workflow run
REM
REM  After this, every `git push` to main lands automatically on
REM  https://synergybusiness.ae and https://admin.synergybusiness.ae
REM
REM  Prereqs:
REM    - GO.bat has finished a successful initial install on the VPS
REM    - You can SSH into the VPS as root (have the password handy)
REM    - Optional but recommended: gh CLI installed (https://cli.github.com)
REM ===================================================================
powershell.exe -NoProfile -ExecutionPolicy Bypass -File "%~dp0scripts\sync.ps1" %*
echo.
echo Press any key to close...
pause >nul
