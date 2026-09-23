import React from 'react';
import { ShieldCheck, Download, BookOpen, Box, } from 'lucide-react';
export const TopNavbar = ({ activeTab, onChangeTab, onOpenAcceptance, onOpenExport, currentStep, }) => {
    return (React.createElement("header", { className: "h-12 bg-slate-950 border-b border-slate-800 px-4 flex items-center justify-between select-none z-10" },
        React.createElement("div", { className: "flex items-center gap-3" },
            React.createElement("div", { className: "flex items-center justify-center w-8 h-8 rounded-lg bg-sky-600/20 border border-sky-500/40 text-sky-400" },
                React.createElement(Box, { className: "w-5 h-5" })),
            React.createElement("div", null,
                React.createElement("div", { className: "flex items-center gap-2" },
                    React.createElement("h1", { className: "text-sm font-bold text-slate-100 tracking-tight" }, "\u5609\u6377\u901A\u573A\u7AD9 3D \u6570\u5B57\u5B6A\u751F\u7CFB\u7EDF"),
                    React.createElement("span", { className: "text-[10px] px-2 py-0.5 rounded bg-sky-950 text-sky-300 border border-sky-800 font-mono" }, "Blender 4.x \u64CD\u4F5C\u8BBE\u8BA1\u6807\u51C6")),
                React.createElement("div", { className: "text-[10px] text-slate-400 hidden sm:block" }, "1:1 \u6BEB\u7C73\u7EA7\u516C\u5236\u7A7A\u95F4\u5EFA\u6A21 (120m \u00D7 100m) \u00B7 12 \u9636\u6BB5 54 \u6B65\u7CBE\u51C6\u63A8\u6F14"))),
        React.createElement("div", { className: "flex items-center gap-1 bg-slate-900 border border-slate-800 rounded-lg p-1 text-xs" },
            React.createElement("button", { onClick: () => onChangeTab('viewport'), className: `flex items-center gap-1.5 px-3 py-1 rounded transition-colors ${activeTab === 'viewport'
                    ? 'bg-sky-600 text-white font-semibold shadow-sm'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'}` },
                React.createElement(Box, { className: "w-3.5 h-3.5" }),
                React.createElement("span", null, "3D \u5B6A\u751F\u5DE5\u4F5C\u53F0")),
            React.createElement("button", { onClick: () => onChangeTab('manualDocs'), className: `flex items-center gap-1.5 px-3 py-1 rounded transition-colors ${activeTab === 'manualDocs'
                    ? 'bg-sky-600 text-white font-semibold shadow-sm'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'}` },
                React.createElement(BookOpen, { className: "w-3.5 h-3.5" }),
                React.createElement("span", null, "\u5B8C\u6574\u64CD\u4F5C\u624B\u518C (54 \u6B65)"))),
        React.createElement("div", { className: "flex items-center gap-2" },
            React.createElement("button", { onClick: onOpenAcceptance, className: "flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-950/70 hover:bg-emerald-900/80 border border-emerald-800/80 text-emerald-300 text-xs font-semibold shadow-sm transition-colors" },
                React.createElement(ShieldCheck, { className: "w-3.5 h-3.5 text-emerald-400" }),
                React.createElement("span", null, "\u9A8C\u6536\u5BF9\u7167"),
                React.createElement("span", { className: "w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse ml-0.5" })),
            React.createElement("button", { onClick: onOpenExport, className: "flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-sky-600 hover:bg-sky-500 text-white text-xs font-semibold shadow-md transition-colors" },
                React.createElement(Download, { className: "w-3.5 h-3.5" }),
                React.createElement("span", null, "\u5BFC\u51FA\u4EA4\u4ED8 (GLB)")))));
};
