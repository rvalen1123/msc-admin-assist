# Run this script to execute all frontend and backend tests

Write-Host "🧪 Starting backend tests..." -ForegroundColor Cyan
Set-Location -Path server
npm run test

Write-Host "📊 Generating backend test coverage..." -ForegroundColor Cyan
npm run test:cov

Write-Host "🧪 Starting frontend tests..." -ForegroundColor Cyan
Set-Location -Path ..
npm run test

Write-Host "📊 Generating frontend test coverage..." -ForegroundColor Cyan
npm run test:coverage

Write-Host "✅ All tests completed!" -ForegroundColor Green 