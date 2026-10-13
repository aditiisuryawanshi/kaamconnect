@echo off
title RozgaarSetu Backend Server
cd /d "%~dp0backend"
echo ==============================================
echo  Starting RozgaarSetu Backend (Port 5000)
echo ==============================================
if exist venv\Scripts\activate.bat (
    call venv\Scripts\activate.bat
    python run.py
) else (
    echo [ERROR] Virtual environment not found in backend\venv.
    echo Please run 'python -m venv venv' and 'pip install -r requirements.txt' inside backend folder.
    pause
)
