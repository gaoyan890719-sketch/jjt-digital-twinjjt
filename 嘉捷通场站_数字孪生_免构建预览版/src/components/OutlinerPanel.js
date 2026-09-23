import React from 'react';
import { COLLECTIONS_DATA } from '../data/manualData.js';
import { Eye, EyeOff, Folder, Layers, Sliders, ChevronDown, ChevronRight } from 'lucide-react';
export const OutlinerPanel = ({ collectionsVisibility, onToggleCollection, referenceOpacity, onChangeReferenceOpacity, objectsMeta, selectedObjectId, onSelectObject, }) => {
    const [expandedCollections, setExpandedCollections] = React.useState({
        '00_Terrain': true,
        '01_Roads': true,
        '02_Buildings': true,
        '03_Wall_Gate': false,
        '04_Vegetation': false,
        '05_StreetFurniture': false,
        'REF_Reference': true,
    });
    const toggleExpand = (id) => {
        setExpandedCollections((prev) => ({
            ...prev,
            [id]: !prev[id],
        }));
    };
    return (React.createElement("div", { className: "flex flex-col h-full bg-slate-900 border-l border-slate-800 text-slate-200 select-none overflow-hidden" },
        React.createElement("div", { className: "flex items-center justify-between px-3 py-2 border-b border-slate-800 bg-slate-900/90" },
            React.createElement("div", { className: "flex items-center gap-1.5 text-xs font-semibold tracking-wide text-slate-300" },
                React.createElement(Layers, { className: "w-3.5 h-3.5 text-sky-400" }),
                React.createElement("span", null, "\u5927\u7EB2\u89C6\u56FE (Outliner)")),
            React.createElement("span", { className: "text-[10px] bg-slate-800 text-slate-400 px-1.5 py-0.5 rounded font-mono" }, "7 \u4E2A\u6807\u51C6\u96C6\u5408")),
        React.createElement("div", { className: "flex-1 overflow-y-auto p-2 space-y-1 text-xs" }, COLLECTIONS_DATA.map((col) => {
            const isVisible = collectionsVisibility[col.id];
            const isExpanded = expandedCollections[col.id];
            const itemsInCol = objectsMeta.filter((o) => o.collection === col.id);
            return (React.createElement("div", { key: col.id, className: `rounded border transition-colors ${isVisible
                    ? 'bg-slate-950/60 border-slate-800/80'
                    : 'bg-slate-950/20 border-slate-900 opacity-60'}` },
                React.createElement("div", { className: "flex items-center justify-between px-2 py-1.5 group hover:bg-slate-800/50 rounded" },
                    React.createElement("div", { className: "flex items-center gap-1.5 cursor-pointer flex-1 min-w-0", onClick: () => toggleExpand(col.id) },
                        React.createElement("button", { className: "text-slate-500 hover:text-slate-300 p-0.5" }, isExpanded ? (React.createElement(ChevronDown, { className: "w-3 h-3" })) : (React.createElement(ChevronRight, { className: "w-3 h-3" }))),
                        React.createElement("span", { className: "w-2.5 h-2.5 rounded-sm shrink-0", style: { backgroundColor: col.color } }),
                        React.createElement("div", { className: "flex flex-col min-w-0" },
                            React.createElement("span", { className: "font-mono text-[11px] font-semibold text-slate-100 truncate" }, col.name),
                            React.createElement("span", { className: "text-[10px] text-slate-400 truncate" }, col.cnName))),
                    React.createElement("button", { onClick: (e) => {
                            e.stopPropagation();
                            onToggleCollection(col.id);
                        }, className: `p-1 rounded transition-colors ${isVisible
                            ? 'text-sky-400 hover:bg-slate-800'
                            : 'text-slate-600 hover:bg-slate-800'}`, title: isVisible ? '隐藏此集合 [眼睛图标]' : '显示此集合 [眼睛图标]' }, isVisible ? (React.createElement(Eye, { className: "w-3.5 h-3.5" })) : (React.createElement(EyeOff, { className: "w-3.5 h-3.5" })))),
                col.id === 'REF_Reference' && isVisible && isExpanded && (React.createElement("div", { className: "px-3 pb-2 pt-1 border-t border-slate-800/60 bg-slate-900/40" },
                    React.createElement("div", { className: "flex items-center justify-between text-[10px] text-slate-400 mb-1" },
                        React.createElement("span", { className: "flex items-center gap-1" },
                            React.createElement(Sliders, { className: "w-3 h-3 text-purple-400" }),
                            "\u5E95\u56FE\u4E0D\u900F\u660E\u5EA6 (\u7B2C 9 \u6B65\u8981\u6C42 0.5~0.6):"),
                        React.createElement("span", { className: "font-mono text-purple-300 font-bold" },
                            Math.round(referenceOpacity * 100),
                            "%")),
                    React.createElement("input", { type: "range", min: "0.0", max: "1.0", step: "0.05", value: referenceOpacity, onChange: (e) => onChangeReferenceOpacity(parseFloat(e.target.value)), className: "w-full h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-purple-500" }))),
                isExpanded && itemsInCol.length > 0 && (React.createElement("div", { className: "pl-6 pr-2 pb-1.5 space-y-0.5 border-t border-slate-800/40" }, itemsInCol.map((item) => {
                    const isSelected = selectedObjectId === item.id;
                    return (React.createElement("div", { key: item.id, onClick: () => onSelectObject(item), className: `flex items-center justify-between px-2 py-1 rounded cursor-pointer transition-colors ${isSelected
                            ? 'bg-sky-600/30 text-sky-200 border border-sky-500/40'
                            : 'hover:bg-slate-800/60 text-slate-300'}` },
                        React.createElement("div", { className: "flex items-center gap-1.5 truncate" },
                            React.createElement(Folder, { className: "w-2.5 h-2.5 text-slate-500" }),
                            React.createElement("span", { className: "font-mono text-[11px] truncate" }, item.name)),
                        React.createElement("span", { className: "text-[10px] text-slate-400 font-mono" },
                            item.tris,
                            " tris")));
                })))));
        })),
        React.createElement("div", { className: "p-2 border-t border-slate-800 bg-slate-950 text-[11px] text-slate-400 flex items-center justify-between" },
            React.createElement("span", null, "\u5168\u57DF\u5C42\u7EA7\u89C4\u8303"),
            React.createElement("span", { className: "text-emerald-400 font-mono" }, "\u7B26\u5408 Blender 4.x \u5DE5\u4E1A\u6807\u51C6"))));
};
