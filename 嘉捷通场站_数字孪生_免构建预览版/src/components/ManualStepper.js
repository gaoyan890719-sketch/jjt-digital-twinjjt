import React, { useState, useEffect } from 'react';
import { MANUAL_STAGES } from '../data/manualData.js';
import { Play, Pause, ChevronLeft, ChevronRight, RotateCcw, Sparkles, Command, BookOpen, } from 'lucide-react';
export const ManualStepper = ({ currentStep, onSetStep, isPlaying, onTogglePlay, }) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [playSpeed, setPlaySpeed] = useState(1800); // ms per step
    // Flatten all 54 steps
    const allSteps = MANUAL_STAGES.flatMap((stage) => stage.steps);
    const currentStepData = allSteps.find((s) => s.stepNumber === currentStep) || allSteps[0];
    const currentStage = MANUAL_STAGES.find((st) => st.stageNumber === currentStepData.stageNumber);
    // Auto-play timer
    useEffect(() => {
        if (!isPlaying)
            return;
        const timer = setInterval(() => {
            onSetStep(currentStep < 54 ? currentStep + 1 : 1);
        }, playSpeed);
        return () => clearInterval(timer);
    }, [isPlaying, currentStep, playSpeed, onSetStep]);
    const handlePrev = () => {
        if (currentStep > 1)
            onSetStep(currentStep - 1);
    };
    const handleNext = () => {
        if (currentStep < 54)
            onSetStep(currentStep + 1);
    };
    // Filtered steps for quick jump
    const filteredSteps = searchQuery.trim()
        ? allSteps.filter((s) => s.title.includes(searchQuery) ||
            s.instruction.includes(searchQuery) ||
            s.stageTitle.includes(searchQuery))
        : [];
    return (React.createElement("div", { className: "flex flex-col bg-slate-900 border-t border-slate-800 text-slate-100 select-none shadow-2xl" },
        React.createElement("div", { className: "flex flex-wrap items-center justify-between px-4 py-2 border-b border-slate-800/80 bg-slate-950/70 gap-2" },
            React.createElement("div", { className: "flex items-center gap-3" },
                React.createElement("div", { className: "flex items-center gap-1.5 px-2.5 py-1 bg-sky-950 border border-sky-800/80 rounded-md" },
                    React.createElement(BookOpen, { className: "w-3.5 h-3.5 text-sky-400" }),
                    React.createElement("span", { className: "text-xs font-semibold text-sky-200" },
                        "\u9636\u6BB5 ",
                        currentStepData.stageNumber,
                        " / 12")),
                React.createElement("div", { className: "text-xs text-slate-300 font-medium hidden sm:inline-block" }, currentStage?.title),
                React.createElement("span", { className: "text-xs text-slate-500 font-mono" },
                    "[ \u6B65\u9AA4 ",
                    currentStep,
                    " / 54 ]")),
            React.createElement("div", { className: "flex items-center gap-2" },
                React.createElement("select", { value: currentStepData.stageNumber, onChange: (e) => {
                        const stageNum = parseInt(e.target.value);
                        const targetStage = MANUAL_STAGES.find((s) => s.stageNumber === stageNum);
                        if (targetStage && targetStage.steps.length > 0) {
                            onSetStep(targetStage.steps[0].stepNumber);
                        }
                    }, className: "bg-slate-900 border border-slate-700 text-slate-200 text-xs rounded px-2 py-1 outline-none focus:border-sky-500 cursor-pointer" }, MANUAL_STAGES.map((st) => (React.createElement("option", { key: st.stageNumber, value: st.stageNumber },
                    "\u9636\u6BB5 ",
                    st.stageNumber,
                    ": ",
                    st.title.split('：')[1] || st.title))))),
            React.createElement("div", { className: "flex items-center gap-2" },
                React.createElement("div", { className: "flex items-center gap-1 text-[11px] text-slate-400 bg-slate-900 border border-slate-800 rounded px-1.5 py-0.5" },
                    React.createElement("span", null, "\u6F14\u793A\u901F\u5EA6:"),
                    React.createElement("button", { onClick: () => setPlaySpeed(2400), className: `px-1 rounded ${playSpeed === 2400 ? 'text-sky-400 font-bold' : ''}` }, "1x"),
                    React.createElement("button", { onClick: () => setPlaySpeed(1400), className: `px-1 rounded ${playSpeed === 1400 ? 'text-sky-400 font-bold' : ''}` }, "1.5x"),
                    React.createElement("button", { onClick: () => setPlaySpeed(800), className: `px-1 rounded ${playSpeed === 800 ? 'text-sky-400 font-bold' : ''}` }, "2x")),
                React.createElement("button", { onClick: handlePrev, disabled: currentStep === 1, className: "p-1.5 rounded bg-slate-800 hover:bg-slate-700 disabled:opacity-40 disabled:hover:bg-slate-800 text-slate-200 transition-colors", title: "\u4E0A\u4E00\u6B65 (Previous Step)" },
                    React.createElement(ChevronLeft, { className: "w-4 h-4" })),
                React.createElement("button", { onClick: onTogglePlay, className: `flex items-center gap-1.5 px-3 py-1 rounded text-xs font-semibold transition-all ${isPlaying
                        ? 'bg-amber-600 hover:bg-amber-500 text-white shadow-lg shadow-amber-900/30'
                        : 'bg-sky-600 hover:bg-sky-500 text-white shadow-lg shadow-sky-900/30'}` }, isPlaying ? (React.createElement(React.Fragment, null,
                    React.createElement(Pause, { className: "w-3.5 h-3.5" }),
                    React.createElement("span", null, "\u6682\u505C\u6F14\u64AD"))) : (React.createElement(React.Fragment, null,
                    React.createElement(Play, { className: "w-3.5 h-3.5 fill-current" }),
                    React.createElement("span", null, "\u81EA\u52A8\u9010\u6B65\u63A8\u6F14")))),
                React.createElement("button", { onClick: handleNext, disabled: currentStep === 54, className: "p-1.5 rounded bg-slate-800 hover:bg-slate-700 disabled:opacity-40 disabled:hover:bg-slate-800 text-slate-200 transition-colors", title: "\u4E0B\u4E00\u6B65 (Next Step)" },
                    React.createElement(ChevronRight, { className: "w-4 h-4" })),
                React.createElement("button", { onClick: () => onSetStep(1), className: "p-1.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-slate-200 transition-colors", title: "\u91CD\u7F6E\u5230\u7B2C\u4E00\u6B65" },
                    React.createElement(RotateCcw, { className: "w-3.5 h-3.5" })))),
        React.createElement("div", { className: "px-4 py-1.5 bg-slate-950 flex items-center gap-3" },
            React.createElement("input", { type: "range", min: "1", max: "54", value: currentStep, onChange: (e) => onSetStep(parseInt(e.target.value)), className: "flex-1 h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-sky-500 hover:accent-sky-400" }),
            React.createElement("span", { className: "text-[11px] font-mono text-sky-400 w-12 text-right" },
                Math.round((currentStep / 54) * 100),
                "%")),
        React.createElement("div", { className: "p-4 grid grid-cols-1 lg:grid-cols-12 gap-4 items-center" },
            React.createElement("div", { className: "lg:col-span-8 space-y-2" },
                React.createElement("div", { className: "flex flex-wrap items-center gap-2" },
                    React.createElement("span", { className: "px-2 py-0.5 rounded bg-sky-500/20 text-sky-300 border border-sky-500/30 text-xs font-mono font-bold" },
                        "\u7B2C ",
                        currentStepData.stepNumber,
                        " \u6B65"),
                    React.createElement("h3", { className: "text-sm font-bold text-slate-100 flex items-center gap-1.5" },
                        React.createElement("span", null, currentStepData.title)),
                    currentStepData.collectionId && (React.createElement("span", { className: "text-[10px] bg-slate-800 text-slate-300 px-2 py-0.5 rounded font-mono" },
                        "\u76EE\u6807\u96C6\u5408: ",
                        currentStepData.collectionId))),
                React.createElement("p", { className: "text-xs text-slate-300 leading-relaxed font-sans" }, currentStepData.instruction),
                currentStepData.tips && (React.createElement("div", { className: "text-[11px] text-amber-300/90 bg-amber-950/30 border border-amber-900/40 px-2.5 py-1 rounded flex items-center gap-1.5" },
                    React.createElement(Sparkles, { className: "w-3.5 h-3.5 text-amber-400 shrink-0" }),
                    React.createElement("span", null, currentStepData.tips)))),
            React.createElement("div", { className: "lg:col-span-4 bg-slate-950/80 p-2.5 rounded-lg border border-slate-800 space-y-2 text-xs" },
                currentStepData.shortcuts && currentStepData.shortcuts.length > 0 && (React.createElement("div", null,
                    React.createElement("div", { className: "text-[10px] text-slate-400 flex items-center gap-1 mb-1" },
                        React.createElement(Command, { className: "w-3 h-3 text-sky-400" }),
                        React.createElement("span", null, "Blender \u952E\u76D8\u5FEB\u6377\u952E:")),
                    React.createElement("div", { className: "flex flex-wrap gap-1" }, currentStepData.shortcuts.map((sc, i) => (React.createElement("kbd", { key: i, className: "px-2 py-0.5 bg-slate-800 border border-slate-700 text-sky-300 font-mono text-[11px] rounded shadow-sm" }, sc)))))),
                currentStepData.menuPath && (React.createElement("div", null,
                    React.createElement("div", { className: "text-[10px] text-slate-400 mb-0.5" }, "\u83DC\u5355\u4F4D\u7F6E:"),
                    React.createElement("div", { className: "font-mono text-[11px] text-slate-200 bg-slate-900 px-2 py-0.5 rounded border border-slate-800" }, currentStepData.menuPath))),
                currentStepData.parameters && currentStepData.parameters.length > 0 && (React.createElement("div", { className: "space-y-1 pt-1 border-t border-slate-800/80" },
                    React.createElement("div", { className: "text-[10px] text-slate-400" }, "\u64CD\u4F5C\u8F93\u5165\u53C2\u6570:"),
                    React.createElement("div", { className: "grid grid-cols-2 gap-1 text-[10px] font-mono" }, currentStepData.parameters.map((p, i) => (React.createElement("div", { key: i, className: "bg-slate-900 px-1.5 py-0.5 rounded border border-slate-800 flex justify-between" },
                        React.createElement("span", { className: "text-slate-400" },
                            p.label,
                            ":"),
                        React.createElement("span", { className: "text-emerald-300 font-semibold" }, p.value)))))))))));
};
