import React, { useState } from 'react';
import { MANUAL_STAGES } from '../data/manualData.js';
import { BookOpen, Search, Command, ArrowRight } from 'lucide-react';
export const ManualDocsView = ({ currentStep, onJumpToStep, }) => {
    const [searchTerm, setSearchTerm] = useState('');
    return (React.createElement("div", { className: "flex-1 bg-slate-950 text-slate-200 overflow-y-auto p-6 select-text" },
        React.createElement("div", { className: "max-w-4xl mx-auto space-y-6" },
            React.createElement("div", { className: "border-b border-slate-800 pb-4 space-y-2" },
                React.createElement("div", { className: "inline-flex items-center gap-2 px-2.5 py-1 rounded bg-sky-950 border border-sky-800 text-sky-300 text-xs font-mono" },
                    React.createElement(BookOpen, { className: "w-3.5 h-3.5" }),
                    React.createElement("span", null, "Blender 4.x \u64CD\u4F5C\u8BBE\u8BA1\u89C4\u7A0B")),
                React.createElement("h2", { className: "text-2xl font-bold text-white tracking-tight" }, "\u5609\u6377\u901A\u573A\u7AD9 3D \u5EFA\u6A21\u2014\u2014\u9010\u6B65\u64CD\u4F5C\u624B\u518C"),
                React.createElement("p", { className: "text-xs text-slate-400 leading-relaxed" },
                    "\u7EA6\u5B9A\uFF1A",
                    React.createElement("kbd", { className: "px-1.5 py-0.5 bg-slate-800 rounded font-mono text-sky-300" }, "\u5FEB\u6377\u952E"),
                    " \u8868\u793A\u952E\u76D8\u6309\u952E\uFF1B \u3010\u83DC\u5355\u3011\u8868\u793A\u9F20\u6807\u70B9\u51FB\u4F4D\u7F6E\u3002\u6240\u6709\u64CD\u4F5C\u6309\u4ECE\u4E0A\u5230\u4E0B\u987A\u5E8F\u6267\u884C\uFF0C\u505A\u5B8C\u4E00\u6B65\u518D\u505A\u4E0B\u4E00\u6B65\u3002"),
                React.createElement("div", { className: "relative pt-2" },
                    React.createElement(Search, { className: "w-4 h-4 absolute left-3 top-5 text-slate-500" }),
                    React.createElement("input", { type: "text", placeholder: "\u641C\u7D22\u64CD\u4F5C\u6307\u4EE4\u3001\u5FEB\u6377\u952E\u3001\u6784\u4EF6\u53C2\u6570 (\u5982: \u56F4\u5899, \u73BB\u7483\u5E55\u5899, Array, 6m, GLB)...", value: searchTerm, onChange: (e) => setSearchTerm(e.target.value), className: "w-full bg-slate-900 border border-slate-800 rounded-lg pl-9 pr-4 py-2 text-xs text-slate-200 placeholder-slate-500 outline-none focus:border-sky-500" }))),
            React.createElement("div", { className: "space-y-8" }, MANUAL_STAGES.map((stage) => {
                const matchesSearch = !searchTerm.trim() ||
                    stage.title.includes(searchTerm) ||
                    stage.description.includes(searchTerm) ||
                    stage.steps.some((s) => s.title.includes(searchTerm) ||
                        s.instruction.includes(searchTerm) ||
                        s.shortcuts?.some((sc) => sc.includes(searchTerm)));
                if (!matchesSearch)
                    return null;
                return (React.createElement("div", { key: stage.stageNumber, className: "bg-slate-900/60 border border-slate-800 rounded-xl p-5 space-y-4 shadow-sm" },
                    React.createElement("div", { className: "flex items-center justify-between border-b border-slate-800/80 pb-3" },
                        React.createElement("div", null,
                            React.createElement("h3", { className: "text-base font-bold text-sky-400" }, stage.title),
                            React.createElement("p", { className: "text-xs text-slate-400 mt-0.5" }, stage.description)),
                        React.createElement("span", { className: "text-xs bg-slate-800 text-slate-400 px-2 py-0.5 rounded font-mono" },
                            stage.steps.length,
                            " \u4E2A\u6B65\u9AA4")),
                    React.createElement("div", { className: "space-y-3" }, stage.steps.map((step) => {
                        const stepMatches = !searchTerm.trim() ||
                            step.title.includes(searchTerm) ||
                            step.instruction.includes(searchTerm) ||
                            step.shortcuts?.some((sc) => sc.includes(searchTerm));
                        if (!stepMatches)
                            return null;
                        const isCurrent = step.stepNumber === currentStep;
                        return (React.createElement("div", { key: step.stepNumber, className: `p-3.5 rounded-lg border transition-all ${isCurrent
                                ? 'bg-sky-950/40 border-sky-500/60 shadow-md'
                                : 'bg-slate-950/60 border-slate-800/80 hover:border-slate-700'}` },
                            React.createElement("div", { className: "flex items-start justify-between gap-3" },
                                React.createElement("div", { className: "space-y-1.5 flex-1" },
                                    React.createElement("div", { className: "flex items-center gap-2" },
                                        React.createElement("span", { className: "px-1.5 py-0.5 bg-slate-800 text-sky-300 font-mono text-[10px] font-bold rounded" },
                                            "\u7B2C ",
                                            step.stepNumber,
                                            " \u6B65"),
                                        React.createElement("h4", { className: "text-xs font-bold text-slate-100" }, step.title),
                                        isCurrent && (React.createElement("span", { className: "text-[10px] bg-sky-500/20 text-sky-400 px-1.5 py-0.2 rounded border border-sky-500/30" }, "\u5F53\u524D\u6267\u884C\u4E2D"))),
                                    React.createElement("p", { className: "text-xs text-slate-300 leading-relaxed" }, step.instruction),
                                    React.createElement("div", { className: "flex flex-wrap items-center gap-2 pt-1" },
                                        step.shortcuts && step.shortcuts.length > 0 && (React.createElement("div", { className: "flex items-center gap-1" },
                                            React.createElement(Command, { className: "w-3 h-3 text-slate-500" }),
                                            step.shortcuts.map((sc, i) => (React.createElement("kbd", { key: i, className: "px-1.5 py-0.5 bg-slate-800 border border-slate-700 text-sky-300 font-mono text-[10px] rounded" }, sc))))),
                                        step.menuPath && (React.createElement("span", { className: "text-[10px] bg-slate-900 border border-slate-800 px-2 py-0.5 rounded text-slate-400 font-mono" }, step.menuPath)),
                                        step.collectionId && (React.createElement("span", { className: "text-[10px] bg-slate-900 border border-slate-800 px-2 py-0.5 rounded text-slate-400 font-mono" },
                                            "\u96C6\u5408: ",
                                            step.collectionId)))),
                                React.createElement("button", { onClick: () => onJumpToStep(step.stepNumber), className: "flex items-center gap-1 px-2.5 py-1.5 rounded bg-slate-800 hover:bg-sky-600 text-slate-300 hover:text-white text-xs font-semibold shrink-0 transition-colors" },
                                    React.createElement("span", null, "\u5728 3D \u4E2D\u6267\u884C"),
                                    React.createElement(ArrowRight, { className: "w-3 h-3" })))));
                    }))));
            })))));
};
