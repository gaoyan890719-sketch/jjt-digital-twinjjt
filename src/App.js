import React, { useState, useEffect, useCallback } from 'react';
import { MANUAL_STAGES } from './data/manualData.js';
import { TopNavbar } from './components/TopNavbar.js';
import { Viewport3D } from './components/Viewport3D.js';
import { OutlinerPanel } from './components/OutlinerPanel.js';
import { NPanelInspector } from './components/NPanelInspector.js';
import { ManualStepper } from './components/ManualStepper.js';
import { AcceptanceModal } from './components/AcceptanceModal.js';
import { ExportModal } from './components/ExportModal.js';
import { ManualDocsView } from './components/ManualDocsView.js';
import { exportSceneToGLB, exportSceneToOBJ } from './utils/exporters.js';
import { buildStationScene } from './utils/sceneBuilder.js';
export default function App() {
    const [activeTab, setActiveTab] = useState('viewport');
    const [currentStep, setCurrentStep] = useState(54); // Default to full completed model
    const [isPlaying, setIsPlaying] = useState(false);
    const [viewpointMode, setViewpointMode] = useState('isometric');
    const [referenceOpacity, setReferenceOpacity] = useState(0.55); // Step 9 requirement
    const [selectedObject, setSelectedObject] = useState(null);
    const [isAcceptanceOpen, setIsAcceptanceOpen] = useState(false);
    const [isExportOpen, setIsExportOpen] = useState(false);
    // Collections visibility map
    const [collectionsVisibility, setCollectionsVisibility] = useState({
        '00_Terrain': true,
        '01_Roads': true,
        '02_Buildings': true,
        '03_Wall_Gate': true,
        '04_Vegetation': true,
        '05_StreetFurniture': true,
        'REF_Reference': true,
    });
    // Cached objects metadata from scene
    const [objectsMeta, setObjectsMeta] = useState([]);
    // Statistics for Step 47
    const [statistics, setStatistics] = useState({
        verts: 3480,
        faces: 1820,
        tris: 2460,
        maxTrisLimit: 300000,
        objectsCount: 68,
        collectionsCount: 7,
    });
    // Initialize objects meta from scene builder
    useEffect(() => {
        const data = buildStationScene();
        setObjectsMeta(data.objectsMeta);
        // Select main office by default to demonstrate N-panel
        const office = data.objectsMeta.find((o) => o.id === 'build-office-main');
        if (office) {
            setSelectedObject(office);
        }
    }, []);
    const handleToggleCollection = useCallback((id) => {
        setCollectionsVisibility((prev) => ({
            ...prev,
            [id]: !prev[id],
        }));
    }, []);
    // Keyboard shortcut listeners (Num 7, Num 0, Num 1, Num 3, Space)
    useEffect(() => {
        const handleKeyDown = (e) => {
            // Don't intercept when user is typing in input
            if (e.target.tagName === 'INPUT')
                return;
            if (e.key === '7' || e.code === 'Numpad7') {
                setViewpointMode('top');
            }
            else if (e.key === '0' || e.code === 'Numpad0') {
                setViewpointMode('isometric');
            }
            else if (e.key === '1' || e.code === 'Numpad1') {
                setViewpointMode('front');
            }
            else if (e.key === '3' || e.code === 'Numpad3') {
                setViewpointMode('right');
            }
            else if (e.code === 'Space') {
                e.preventDefault();
                setIsPlaying((prev) => !prev);
            }
            else if (e.key === 'ArrowRight') {
                setCurrentStep((prev) => Math.min(54, prev + 1));
            }
            else if (e.key === 'ArrowLeft') {
                setCurrentStep((prev) => Math.max(1, prev - 1));
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, []);
    // Export handlers
    const handleExportGLB = () => {
        const data = buildStationScene();
        exportSceneToGLB(data.scene, 'Jiajietong_Site.glb');
    };
    const handleExportOBJ = () => {
        const data = buildStationScene();
        exportSceneToOBJ(data.scene, 'Jiajietong_Site.obj');
    };
    const handleDownloadManualMarkdown = () => {
        let md = `# 嘉捷通场站 3D 建模——逐步操作手册\n`;
        md += `## 照着点就行（Blender 4.x）\n\n`;
        md += `> 约定：\`快捷键\` 表示键盘按键；【菜单】表示鼠标点击位置。\n`;
        md += `> 所有操作按从上到下顺序执行，做完一步再做下一步。\n\n`;
        MANUAL_STAGES.forEach((st) => {
            md += `# ${st.title}\n\n`;
            st.steps.forEach((sp) => {
                md += `## 第 ${sp.stepNumber} 步：${sp.title}\n`;
                md += `- ${sp.instruction}\n`;
                if (sp.shortcuts)
                    md += `- 快捷键：${sp.shortcuts.join(', ')}\n`;
                if (sp.menuPath)
                    md += `- 菜单：${sp.menuPath}\n`;
                if (sp.parameters) {
                    sp.parameters.forEach((p) => {
                        md += `  - **${p.label}**: ${p.value}\n`;
                    });
                }
                if (sp.tips)
                    md += `- 提示：${sp.tips}\n`;
                md += `\n`;
            });
        });
        const blob = new Blob([md], { type: 'text/markdown;charset=utf-8' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = '嘉捷通场站3D建模手册_Blender4.md';
        link.click();
        URL.revokeObjectURL(link.href);
    };
    return (React.createElement("div", { className: "flex flex-col h-screen w-screen overflow-hidden bg-slate-950 font-sans text-slate-100" },
        React.createElement(TopNavbar, { activeTab: activeTab, onChangeTab: setActiveTab, onOpenAcceptance: () => setIsAcceptanceOpen(true), onOpenExport: () => setIsExportOpen(true), currentStep: currentStep }),
        activeTab === 'viewport' ? (React.createElement("div", { className: "flex-1 flex flex-col min-h-0 overflow-hidden" },
            React.createElement("div", { className: "flex-1 flex min-h-0 overflow-hidden" },
                React.createElement("div", { className: "w-64 shrink-0 hidden md:block" },
                    React.createElement(OutlinerPanel, { collectionsVisibility: collectionsVisibility, onToggleCollection: handleToggleCollection, referenceOpacity: referenceOpacity, onChangeReferenceOpacity: setReferenceOpacity, objectsMeta: objectsMeta, selectedObjectId: selectedObject?.id || null, onSelectObject: (obj) => setSelectedObject(obj) })),
                React.createElement("div", { className: "flex-1 relative min-w-0 min-h-0" },
                    React.createElement(Viewport3D, { currentStep: currentStep, collectionsVisibility: collectionsVisibility, referenceOpacity: referenceOpacity, selectedObjectId: selectedObject?.id || null, onSelectObject: (obj) => setSelectedObject(obj), viewpointMode: viewpointMode, onChangeViewpoint: setViewpointMode })),
                React.createElement("div", { className: "w-72 shrink-0 hidden lg:block" },
                    React.createElement(NPanelInspector, { selectedObject: selectedObject, statistics: statistics, currentStep: currentStep }))),
            React.createElement(ManualStepper, { currentStep: currentStep, onSetStep: (step) => {
                    setCurrentStep(step);
                    // auto open reference layer if step is in stage 2
                    if (step >= 5 && step <= 11) {
                        setCollectionsVisibility((prev) => ({ ...prev, REF_Reference: true }));
                    }
                }, isPlaying: isPlaying, onTogglePlay: () => setIsPlaying((prev) => !prev) }))) : (
        /* Full Manual Documentation View */
        React.createElement(ManualDocsView, { currentStep: currentStep, onJumpToStep: (step) => {
                setCurrentStep(step);
                setActiveTab('viewport');
            } })),
        React.createElement(AcceptanceModal, { isOpen: isAcceptanceOpen, onClose: () => setIsAcceptanceOpen(false), onSetCameraToAcceptanceView: () => {
                setViewpointMode('isometric');
                setIsAcceptanceOpen(false);
                setActiveTab('viewport');
            } }),
        React.createElement(ExportModal, { isOpen: isExportOpen, onClose: () => setIsExportOpen(false), onExportGLB: handleExportGLB, onExportOBJ: handleExportOBJ, onDownloadManualMarkdown: handleDownloadManualMarkdown })));
}
