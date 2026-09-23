import React, { useState } from 'react';
import { Download, FileCode, CheckCircle, FileText, X, Loader2 } from 'lucide-react';
export const ExportModal = ({ isOpen, onClose, onExportGLB, onExportOBJ, onDownloadManualMarkdown, }) => {
    const [exportingGLB, setExportingGLB] = useState(false);
    const [exportingOBJ, setExportingOBJ] = useState(false);
    const [downloadedMD, setDownloadedMD] = useState(false);
    if (!isOpen)
        return null;
    const handleGLB = () => {
        setExportingGLB(true);
        setTimeout(() => {
            onExportGLB();
            setExportingGLB(false);
        }, 400);
    };
    const handleOBJ = () => {
        setExportingOBJ(true);
        setTimeout(() => {
            onExportOBJ();
            setExportingOBJ(false);
        }, 400);
    };
    const handleMD = () => {
        onDownloadManualMarkdown();
        setDownloadedMD(true);
        setTimeout(() => setDownloadedMD(false), 2000);
    };
    return (React.createElement("div", { className: "fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-in fade-in duration-200" },
        React.createElement("div", { className: "relative w-full max-w-xl bg-slate-900 border border-slate-800 rounded-xl shadow-2xl overflow-hidden flex flex-col" },
            React.createElement("div", { className: "flex items-center justify-between px-5 py-3.5 border-b border-slate-800 bg-slate-950/80" },
                React.createElement("div", { className: "flex items-center gap-2" },
                    React.createElement(Download, { className: "w-5 h-5 text-sky-400" }),
                    React.createElement("h2", { className: "text-sm font-bold text-slate-100" }, "\u9636\u6BB5\u5341\u4E8C\uFF1A\u6A21\u578B\u4E0E\u8D44\u4EA7\u4EA4\u4ED8\u5BFC\u51FA (Export Center)")),
                React.createElement("button", { onClick: onClose, className: "p-1 rounded-md text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors" },
                    React.createElement(X, { className: "w-4 h-4" }))),
            React.createElement("div", { className: "p-5 space-y-4 text-xs" },
                React.createElement("p", { className: "text-slate-300 leading-relaxed" }, "\u6839\u636E\u624B\u518C\u7B2C 52 \u6B65\u4E0E\u7B2C 53 \u6B65\u89C4\u8303\uFF0C\u7CFB\u7EDF\u652F\u6301\u4E00\u952E\u5C06\u5F53\u524D 1:1 \u6BEB\u7C73\u7EA7\u5609\u6377\u901A\u573A\u7AD9\u6A21\u578B\u5BFC\u51FA\u4E3A\u5DE5\u4E1A\u7EA7\u4E09\u7EF4\u683C\u5F0F\uFF0C\u53EF\u76F4\u63A5\u65E0\u7F1D\u5BFC\u5165 Blender 4.x\u3001Unity\u3001Unreal Engine \u6216 Three.js \u5B6A\u751F\u5927\u5C4F\u3002"),
                React.createElement("div", { className: "space-y-3" },
                    React.createElement("div", { className: "flex items-center justify-between p-3.5 rounded-lg bg-slate-950/80 border border-slate-800 hover:border-slate-700 transition-all" },
                        React.createElement("div", { className: "space-y-0.5" },
                            React.createElement("div", { className: "font-bold text-slate-100 flex items-center gap-2" },
                                React.createElement("span", { className: "text-sky-400" }, "Jiajietong_Site.glb"),
                                React.createElement("span", { className: "text-[10px] bg-sky-950 text-sky-300 border border-sky-800 px-1.5 py-0.2 rounded font-mono" }, "\u7B2C 52 \u6B65\u63A8\u8350")),
                            React.createElement("div", { className: "text-[11px] text-slate-400" }, "glTF 2.0 \u4E8C\u8FDB\u5236\u6A21\u578B\uFF0C\u542B\u51E0\u4F55\u4F53\u3001UV\u3001\u6CD5\u7EBF\u3001\u9AD8\u53CD\u5C04\u73BB\u7483\u4E0E\u6750\u8D28\u4FE1\u606F\uFF0C\u4F53\u79EF\u5C0F\u5DE7")),
                        React.createElement("button", { onClick: handleGLB, disabled: exportingGLB, className: "flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-sky-600 hover:bg-sky-500 disabled:opacity-50 text-white font-semibold shadow-md transition-colors shrink-0" },
                            exportingGLB ? (React.createElement(Loader2, { className: "w-4 h-4 animate-spin" })) : (React.createElement(Download, { className: "w-4 h-4" })),
                            React.createElement("span", null, "\u5BFC\u51FA GLB"))),
                    React.createElement("div", { className: "flex items-center justify-between p-3.5 rounded-lg bg-slate-950/80 border border-slate-800 hover:border-slate-700 transition-all" },
                        React.createElement("div", { className: "space-y-0.5" },
                            React.createElement("div", { className: "font-bold text-slate-100 flex items-center gap-2" },
                                React.createElement("span", { className: "text-amber-400" }, "Jiajietong_Site.obj"),
                                React.createElement("span", { className: "text-[10px] bg-amber-950 text-amber-300 border border-amber-800 px-1.5 py-0.2 rounded font-mono" }, "\u7B2C 53 \u6B65\u901A\u7528\u683C\u5F0F")),
                            React.createElement("div", { className: "text-[11px] text-slate-400" }, "\u901A\u7528 Wavefront \u683C\u5F0F\uFF0C\u4FBF\u4E8E\u5BFC\u5165 3ds Max\u3001AutoCAD\u3001Rhino \u53CA\u8001\u7248\u672C\u8F6F\u4EF6")),
                        React.createElement("button", { onClick: handleOBJ, disabled: exportingOBJ, className: "flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-500 disabled:opacity-50 text-white font-semibold shadow-md transition-colors shrink-0" },
                            exportingOBJ ? (React.createElement(Loader2, { className: "w-4 h-4 animate-spin" })) : (React.createElement(FileCode, { className: "w-4 h-4" })),
                            React.createElement("span", null, "\u5BFC\u51FA OBJ"))),
                    React.createElement("div", { className: "flex items-center justify-between p-3.5 rounded-lg bg-slate-950/80 border border-slate-800 hover:border-slate-700 transition-all" },
                        React.createElement("div", { className: "space-y-0.5" },
                            React.createElement("div", { className: "font-bold text-slate-100 flex items-center gap-2" },
                                React.createElement("span", { className: "text-emerald-400" }, "\u5609\u6377\u901A\u573A\u7AD9 3D \u5EFA\u6A21\u624B\u518C (Markdown)"),
                                React.createElement("span", { className: "text-[10px] bg-emerald-950 text-emerald-300 border border-emerald-800 px-1.5 py-0.2 rounded font-mono" }, "\u5B8C\u6574 54 \u6B65\u89C4\u7EA6")),
                            React.createElement("div", { className: "text-[11px] text-slate-400" }, "\u5305\u542B 12 \u9636\u6BB5\u6240\u6709\u5FEB\u6377\u952E\u3001\u53C2\u6570\u3001\u5C3A\u5BF8\u4E0E\u9A8C\u6536\u6807\u51C6\u7684\u6807\u51C6\u6280\u672F\u624B\u518C")),
                        React.createElement("button", { onClick: handleMD, className: "flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-semibold shadow-md transition-colors shrink-0" },
                            downloadedMD ? (React.createElement(CheckCircle, { className: "w-4 h-4 text-white" })) : (React.createElement(FileText, { className: "w-4 h-4" })),
                            React.createElement("span", null, downloadedMD ? '已下载' : '下载手册'))))),
            React.createElement("div", { className: "flex items-center justify-end px-5 py-3 border-t border-slate-800 bg-slate-950/90" },
                React.createElement("button", { onClick: onClose, className: "px-4 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold transition-colors" }, "\u5173\u95ED")))));
};
