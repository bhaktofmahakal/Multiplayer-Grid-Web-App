# Frontend Server Startup Script
Write-Host "🚀 Starting Frontend Server..." -ForegroundColor Green
Write-Host "Frontend will run on: http://localhost:3000" -ForegroundColor Cyan
Write-Host ""
Write-Host "Press Ctrl+C to stop the server" -ForegroundColor Yellow
Write-Host ""

Set-Location "$PSScriptRoot\frontend"
npm start