@echo off
title SignVerse All-in-One Runner
echo ========================================================
echo           SignVerse All-in-One Local Runner
echo ========================================================
echo.
echo [1/3] Starting FastAPI Backend (Port 8001)...
start "SignVerse Backend (Port 8001)" cmd /k "cd /d %~dp0backend && .\venv\Scripts\python.exe -m uvicorn app.main:app --host 127.0.0.1 --port 8001 --reload"

timeout /t 2 /nobreak >nul

echo [2/3] Starting Vite Frontend (Port 5173)...
start "SignVerse Frontend (Port 5173)" cmd /k "cd /d %~dp0frontend && npm run dev"

timeout /t 3 /nobreak >nul

echo [3/3] Opening browser at http://localhost:5173...
start http://localhost:5173

echo.
echo ========================================================
echo Both Backend and Frontend are now running!
echo - Frontend: http://localhost:5173
echo - Backend:  http://127.0.0.1:8001
echo Close the individual terminal windows when you want to stop.
echo ========================================================
