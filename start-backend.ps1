# Backend Server Startup Script
Write-Host "🚀 Starting Backend Server..." -ForegroundColor Green
Write-Host "Backend will run on: http://localhost:5000" -ForegroundColor Cyan
Write-Host ""
Write-Host "Press Ctrl+C to stop the server" -ForegroundColor Yellow
Write-Host ""

Set-Location "$PSScriptRoot\backend"
npm run dev