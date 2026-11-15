@echo off
setlocal
cd /d "%~dp0"

if not exist "node_modules" (
  echo Installing dependencies...
  call npm install --no-audit --no-fund
  if errorlevel 1 goto :error
)

echo Starting Stuzen Technologies website...
echo Open http://localhost:3000 in your browser.
echo Press Ctrl+C to stop the server.
echo.
call npm run dev
goto :eof

:error
echo.
echo Failed to install dependencies. Please check your Node.js installation.
pause
