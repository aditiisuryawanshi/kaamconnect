@echo off
title RozgaarSetu Launcher
echo ==============================================
echo  Launching RozgaarSetu Full-Stack Platform
echo ==============================================

start "RozgaarSetu Backend" cmd /k "cd /d "%~dp0backend" && call venv\Scripts\activate.bat && python run.py"
start "RozgaarSetu Frontend" cmd /k "cd /d "%~dp0frontend" && npm run dev"

echo.
echo [SUCCESS] Backend and Frontend servers launched in dedicated windows!
echo - Backend API:  http://127.0.0.1:5000 (Health: http://127.0.0.1:5000/api/health)
echo - Frontend UI:   http://localhost:5173
echo.
timeout /t 5
