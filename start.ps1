# PromptForge PowerShell Server Launcher
Write-Host "=========================================================================" -ForegroundColor Cyan
Write-Host "                  PROMPTFORGE TOKEN-EFFICIENCY PLATFORM                  " -ForegroundColor Cyan
Write-Host "=========================================================================" -ForegroundColor Cyan
Write-Host ""

$root = $PSScriptRoot
if (-not $root) { $root = (Get-Location).Path }

Write-Host "[1/2] Launching PromptForge FastAPI Backend Server (Port 8000)..." -ForegroundColor Green
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$root'; python run.py"

Start-Sleep -Seconds 3

Write-Host "[2/2] Launching PromptForge Vite Frontend Server (Port 5173)..." -ForegroundColor Green
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$root\frontend'; npm run dev"

Write-Host ""
Write-Host "=========================================================================" -ForegroundColor Cyan
Write-Host "Both servers launched in dedicated PowerShell windows!" -ForegroundColor Green
Write-Host "  -> Backend API:           http://127.0.0.1:8000" -ForegroundColor Yellow
Write-Host "  -> Frontend Dev Server:   http://localhost:5173" -ForegroundColor Yellow
Write-Host "  -> Swagger Documentation: http://127.0.0.1:8000/docs" -ForegroundColor Yellow
Write-Host "=========================================================================" -ForegroundColor Cyan

