# 嘉捷通数字孪生 · 免构建预览版

这个目录已经把原项目的 TS/TSX 和 Tailwind 样式预处理成浏览器可以直接加载的静态文件，**不需要 npm install / Vite 构建**。

## 本机打开
- Windows：双击 `Windows_直接启动预览.bat`
- macOS：运行 `macOS_直接启动预览.command`
- 浏览器地址：`http://localhost:8080`。若端口被占用，可在终端运行 `node server.mjs 8088`。

## 直接发布到网页
整个目录可直接作为静态站点目录上传到任意静态空间，例如 GitHub Pages、Netlify Drop、对象存储静态网站等；入口文件就是 `index.html`。

## 重要说明
这个“免构建版”为了做到体积小、无需安装依赖，React / Three.js / Lucide 通过 **版本锁定的 esm.unpkg.com CDN** 加载，因此首次访问需要联网。

如果你要做真正长期、可离线、完全不依赖第三方 CDN 的正式发布，请使用另外的 **“长期展示版_源码部署包”**，执行一次 `npm install && npm run build` 后把 `dist/` 发布出去。该构建结果会把依赖打包进本地静态文件。
