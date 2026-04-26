@echo off
REM Double-click this, or run: scripts\go.bat from CMD/PowerShell.
REM Wraps go.ps1 so you don't have to fight Windows' execution policy.
powershell.exe -NoProfile -ExecutionPolicy Bypass -File "%~dp0go.ps1" %*
if errorlevel 1 (
    echo.
    echo Press any key to close...
    pause >nul
)
