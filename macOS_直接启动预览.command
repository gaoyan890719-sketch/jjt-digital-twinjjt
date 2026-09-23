#!/bin/bash
cd "$(dirname "$0")"
if command -v node >/dev/null 2>&1; then node server.mjs
elif command -v python3 >/dev/null 2>&1; then open http://localhost:8080; python3 -m http.server 8080
else echo "请安装 Node.js 或 Python 3。"; read -n 1
fi
