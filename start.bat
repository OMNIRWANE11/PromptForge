@echo off
TITLE PromptForge Launcher
COLOR 0B
chcp 65001 >nul

echo =========================================================================
echo                   PROMPTFORGE TOKEN-EFFICIENCY PLATFORM
echo =========================================================================
echo.
echo [1/2] Launching PromptForge FastAPI Backend Server (Port 8000)...
start "PromptForge Backend (Port 8000)" cmd /k "chcp 65001 >nul && cd /d %~dp0 && python run.py"

echo [2/2] Launching PromptForge Vite Frontend Server (Port 5173)...
start "PromptForge Frontend (Port 5173)" cmd /k "chcp 65001 >nul && cd /d %~dp0frontend && npm run dev"

echo.
echo =========================================================================
echo Both servers have been launched in dedicated console windows!
echo.
echo 1. Backend API and App:     http://127.0.0.1:8000
echo 2. Frontend Dev Server:     http://localhost:5173
echo 3. Swagger Interactive API: http://127.0.0.1:8000/docs
echo.
echo NOTE: Keep both console windows open while using the application.
echo =========================================================================
pause
