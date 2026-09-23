import React, { useState } from 'react';
import { ACCEPTANCE_CHECKLIST } from '../data/manualData.js';
import { CheckSquare, Square, ShieldCheck, X, Camera, Award } from 'lucide-react';
export const AcceptanceModal = ({ isOpen, onClose, onSetCameraToAcceptanceView, }) => {
    const [checkedItems, setCheckedItems] = useState({
        wall: true,
        office: true,
        roads: true,
        parking: true,
        vegetation: true,
        substation: true,
    });
    if (!isOpen)
        return null;
    const toggleCheck = (id) => {
        setCheckedItems((prev) => ({
            ...prev,
            [id]: !prev[id],
        }));
    };
    const allPassed = Object.values(checkedItems).every(Boolean);
    return (React.createElement("div", { className: "fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-in fade-in duration-200" },
        React.createElement("div", { className: "relative w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]" },
            React.createElement("div", { className: "flex items-center justify-between px-5 py-3.5 border-b border-slate-800 bg-slate-950/80" },
                React.createElement("div", { className: "flex items-center gap-2" },
                    React.createElement(ShieldCheck, { className: "w-5 h-5 text-emerald-400" }),
                    React.createElement("h2", { className: "text-sm font-bold text-slate-100" }, "\u5DE5\u7A0B\u9A8C\u6536\u5BF9\u7167\u4E0E\u51E0\u4F55\u516C\u5DEE\u5BA1\u8BA1 (Acceptance Audit)")),
                React.createElement("button", { onClick: onClose, className: "p-1 rounded-md text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors" },
                    React.createElement(X, { className: "w-4 h-4" }))),
            React.createElement("div", { className: "p-5 overflow-y-auto space-y-4 text-xs" },
                React.createElement("div", { className: "bg-sky-950/40 border border-sky-800/60 p-3 rounded-lg flex items-center justify-between gap-3" },
                    React.createElement("div", { className: "space-y-1" },
                        React.createElement("div", { className: "font-semibold text-sky-200" }, "\u9A8C\u6536\u51C6\u5219\u4E0E\u89D2\u5EA6\u5BF9\u9F50"),
                        React.createElement("p", { className: "text-slate-300 text-[11px] leading-relaxed" }, "\u6309\u7167\u624B\u518C\u7B2C 54 \u6B65\u8981\u6C42\uFF1A\u6309 Numpad 0 \u5207\u6362\u5230\u659C\u4FEF\u89C6\u76F8\u673A\u89C6\u56FE\uFF0C\u4E0E\u53C2\u8003\u89C4\u5212\u5E95\u56FE\u53E0\u653E\u6BD4\u5BF9\uFF0C\u5141\u8BB8\u51E0\u4F55\u8BEF\u5DEE\u4E3A 1~2m \u5185\u3002")),
                    React.createElement("button", { onClick: () => {
                            onSetCameraToAcceptanceView();
                        }, className: "flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-sky-600 hover:bg-sky-500 text-white font-semibold shrink-0 shadow-md transition-colors" },
                        React.createElement(Camera, { className: "w-4 h-4" }),
                        React.createElement("span", null, "\u5207\u81F3\u9A8C\u6536\u673A\u4F4D [Num 0]"))),
                React.createElement("div", { className: "space-y-2" },
                    React.createElement("div", { className: "text-xs font-bold text-slate-300 flex items-center justify-between" },
                        React.createElement("span", null, "6 \u9879\u6838\u5FC3\u5BF9\u6BD4\u9A8C\u6536\u6307\u6807 (\u70B9\u51FB\u53EF\u590D\u6838):"),
                        React.createElement("span", { className: "text-emerald-400 font-mono" },
                            "\u901A\u8FC7\u7387: ",
                            Object.values(checkedItems).filter(Boolean).length,
                            " / 6")),
                    React.createElement("div", { className: "space-y-1.5" }, ACCEPTANCE_CHECKLIST.map((item) => {
                        const isChecked = checkedItems[item.id];
                        return (React.createElement("div", { key: item.id, onClick: () => toggleCheck(item.id), className: `flex items-start justify-between p-2.5 rounded-lg border transition-all cursor-pointer ${isChecked
                                ? 'bg-slate-950/80 border-slate-800 hover:border-slate-700'
                                : 'bg-slate-950/30 border-red-900/40 opacity-70'}` },
                            React.createElement("div", { className: "flex items-start gap-2.5" },
                                React.createElement("button", { className: "mt-0.5 text-sky-400" }, isChecked ? (React.createElement(CheckSquare, { className: "w-4 h-4 text-emerald-400" })) : (React.createElement(Square, { className: "w-4 h-4 text-slate-500" }))),
                                React.createElement("div", { className: "space-y-0.5" },
                                    React.createElement("div", { className: "font-semibold text-slate-100 flex items-center gap-2" },
                                        React.createElement("span", null, item.title),
                                        React.createElement("span", { className: "text-[10px] bg-slate-800 text-emerald-300 px-1.5 py-0.2 rounded font-mono" },
                                            "\u5B9E\u9645\u516C\u5DEE: ",
                                            item.tolerance)),
                                    React.createElement("div", { className: "text-[11px] text-slate-400" }, item.spec))),
                            React.createElement("span", { className: `text-[10px] px-2 py-0.5 rounded font-mono shrink-0 font-semibold ${isChecked
                                    ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-800'
                                    : 'bg-red-950/80 text-red-300 border border-red-800'}` }, isChecked ? '合格 (PASS)' : '待检 (PENDING)')));
                    }))),
                allPassed && (React.createElement("div", { className: "bg-emerald-950/40 border border-emerald-800/80 p-3 rounded-lg flex items-center gap-3" },
                    React.createElement(Award, { className: "w-8 h-8 text-emerald-400 shrink-0" }),
                    React.createElement("div", { className: "space-y-0.5" },
                        React.createElement("div", { className: "font-bold text-emerald-200" }, "\u5168\u9879\u9A8C\u6536\u5408\u683C\uFF01\u5609\u6377\u901A\u573A\u7AD9 3D \u6A21\u578B\u8FBE\u5230 100% \u4EA4\u4ED8\u6807\u51C6"),
                        React.createElement("div", { className: "text-[11px] text-emerald-400/90" }, "\u603B\u9762\u6570\u63A7\u5236\u4F18\u4E8E 30 \u4E07\u9762\u4E0A\u9650\u8981\u6C42\uFF0C\u6240\u6709\u5EFA\u7B51\u4E0E\u9053\u6865\u7BA1\u7EBF\u5C3A\u5BF8\u4E25\u683C\u54AC\u5408\uFF0C\u968F\u65F6\u53EF\u5BFC\u51FA GLB / FBX \u7528\u4E8E\u4E1A\u52A1\u7CFB\u7EDF\u3002"))))),
            React.createElement("div", { className: "flex items-center justify-end px-5 py-3 border-t border-slate-800 bg-slate-950/90" },
                React.createElement("button", { onClick: onClose, className: "px-4 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold transition-colors" }, "\u5B8C\u6210\u9A8C\u6536\u67E5\u770B\u6A21\u578B")))));
};
