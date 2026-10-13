@echo off
title RozgaarSetu Frontend Server
cd /d "%~dp0frontend"
echo ==============================================
echo  Starting RozgaarSetu Frontend (Port 5173)
echo ==============================================
if exist node_modules (
    npm run dev
) else (
    echo [INFO] node_modules not found. Installing dependencies...
    npm install
    npm run dev
)
