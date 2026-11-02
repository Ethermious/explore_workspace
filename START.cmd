@echo off
setlocal
cd /d "%~dp0"
echo Explore Workspace - optional local web server
echo.
echo You can also double-click index.html without Python.
echo This serves ONLY this folder on 127.0.0.1:8765.
echo Open http://127.0.0.1:8765 in your browser.
echo Close this window or press Ctrl+C to stop.
echo.
where py >nul 2>nul
if not errorlevel 1 (
  py -3 -m http.server 8765 --bind 127.0.0.1
  goto done
)
where python >nul 2>nul
if not errorlevel 1 (
  python -m http.server 8765 --bind 127.0.0.1
  goto done
)
echo Python was not found. No installation was attempted.
echo Double-click index.html instead.
:done
pause
