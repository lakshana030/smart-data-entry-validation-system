@echo off
title Smart Data Entry Validation System
echo =======================================================
echo 🚀 Starting Smart Data Entry Validation System Server...
echo =======================================================
echo.
echo 🌐 Opening your default browser to http://localhost:5000/
echo.

:: Open the browser
start http://localhost:5000/

:: Start the application
npm run dev

:: Keep the window open if the server stops or crashes
pause
