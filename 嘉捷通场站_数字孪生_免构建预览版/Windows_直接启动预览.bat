@echo off
chcp 65001 >nul
cd /d "%~dp0"
where node >nul 2>nul && (node server.mjs & goto :eof)
where py >nul 2>nul && (start "" http://localhost:8080 & py -3 -m http.server 8080 & goto :eof)
where python >nul 2>nul && (start "" http://localhost:8080 & python -m http.server 8080 & goto :eof)
echo [错误] 请安装 Node.js 或 Python 后再启动。
pause
