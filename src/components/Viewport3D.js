import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { buildStationScene } from '../utils/sceneBuilder.js';
import { Compass, Sun, Moon, Layers, Box, } from 'lucide-react';
export const Viewport3D = ({ currentStep, collectionsVisibility, referenceOpacity, selectedObjectId, onSelectObject, viewpointMode, onChangeViewpoint, }) => {
    const mountRef = useRef(null);
    const sceneResultRef = useRef(null);
    const rendererRef = useRef(null);
    const cameraRef = useRef(null);
    const controlsRef = useRef(null);
    const selectionBoxRef = useRef(null);
    const [isNightMode, setIsNightMode] = useState(false);
    const [isWireframe, setIsWireframe] = useState(false);
    const [showRulerGrid, setShowRulerGrid] = useState(true);
    const [hoveredName, setHoveredName] = useState(null);
    // Initialize Three.js scene
    useEffect(() => {
        if (!mountRef.current)
            return;
        const container = mountRef.current;
        const width = container.clientWidth || 800;
        const height = container.clientHeight || 600;
        // Camera setup
        const camera = new THREE.PerspectiveCamera(45, width / height, 0.5, 1000);
        camera.position.set(75, 75, 75);
        cameraRef.current = camera;
        // Renderer
        const renderer = new THREE.WebGLRenderer({
            antialias: true,
            powerPreference: 'high-performance',
            alpha: false,
        });
        renderer.setSize(width, height);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        renderer.shadowMap.enabled = true;
        renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        renderer.toneMapping = THREE.ACESFilmicToneMapping;
        renderer.toneMappingExposure = 1.1;
        container.appendChild(renderer.domElement);
        rendererRef.current = renderer;
        // Controls
        const controls = new OrbitControls(camera, renderer.domElement);
        controls.enableDamping = true;
        controls.dampingFactor = 0.06;
        controls.maxPolarAngle = Math.PI / 2 - 0.01; // don't go below ground
        controls.minDistance = 5;
        controls.maxDistance = 260;
        controls.target.set(0, 0, 0);
        controlsRef.current = controls;
        // Build Scene
        const sceneData = buildStationScene();
        sceneResultRef.current = sceneData;
        // Metric Grid Overlay (120m x 100m indicator)
        const grid = new THREE.GridHelper(160, 32, '#38bdf8', '#1e293b');
        grid.position.y = -0.05;
        grid.name = 'Grid_Ruler';
        sceneData.scene.add(grid);
        // Selection box
        const dummyObj = new THREE.Object3D();
        sceneData.scene.add(dummyObj);
        const boxHelper = new THREE.BoxHelper(dummyObj, 0x38bdf8);
        boxHelper.visible = false;
        sceneData.scene.add(boxHelper);
        selectionBoxRef.current = boxHelper;
        // Raycaster for object picking
        const raycaster = new THREE.Raycaster();
        const mouse = new THREE.Vector2();
        // Helper to find interactive station object by traversing parents
        const findHitObject = (intersects) => {
            for (const hit of intersects) {
                if (hit.object.name === 'Grid_Ruler' || hit.object.parent?.name === 'Environment_Lights')
                    continue;
                let curr = hit.object;
                while (curr && curr !== sceneData.scene) {
                    if (curr.userData && curr.userData.name) {
                        return { object: curr, meta: curr.userData };
                    }
                    curr = curr.parent;
                }
            }
            return null;
        };
        const handlePointerMove = (e) => {
            const rect = renderer.domElement.getBoundingClientRect();
            mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
            mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
            raycaster.setFromCamera(mouse, camera);
            const intersects = raycaster.intersectObjects(sceneData.scene.children, true);
            const found = findHitObject(intersects);
            if (found) {
                setHoveredName(found.meta.name);
                renderer.domElement.style.cursor = 'pointer';
            }
            else {
                setHoveredName(null);
                renderer.domElement.style.cursor = 'default';
            }
        };
        const handleClick = (e) => {
            const rect = renderer.domElement.getBoundingClientRect();
            mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
            mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
            raycaster.setFromCamera(mouse, camera);
            const intersects = raycaster.intersectObjects(sceneData.scene.children, true);
            const found = findHitObject(intersects);
            if (found) {
                onSelectObject(found.meta);
                boxHelper.setFromObject(found.object);
                boxHelper.visible = true;
            }
        };
        renderer.domElement.addEventListener('mousemove', handlePointerMove);
        renderer.domElement.addEventListener('click', handleClick);
        // Animation loop
        let animationFrameId;
        const animate = () => {
            animationFrameId = requestAnimationFrame(animate);
            controls.update();
            renderer.render(sceneData.scene, camera);
        };
        animate();
        // Handle container resize
        const handleResize = () => {
            if (!container || !renderer || !camera)
                return;
            const w = container.clientWidth;
            const h = container.clientHeight;
            camera.aspect = w / h;
            camera.updateProjectionMatrix();
            renderer.setSize(w, h);
        };
        const resizeObserver = new ResizeObserver(handleResize);
        resizeObserver.observe(container);
        return () => {
            cancelAnimationFrame(animationFrameId);
            resizeObserver.disconnect();
            renderer.domElement.removeEventListener('mousemove', handlePointerMove);
            renderer.domElement.removeEventListener('click', handleClick);
            renderer.dispose();
            if (container.contains(renderer.domElement)) {
                container.removeChild(renderer.domElement);
            }
        };
    }, []);
    // Update collections visibility
    useEffect(() => {
        if (!sceneResultRef.current)
            return;
        const { collectionsGroups, referencePlane } = sceneResultRef.current;
        Object.keys(collectionsVisibility).forEach((cid) => {
            const group = collectionsGroups.get(cid);
            if (group) {
                group.visible = collectionsVisibility[cid];
            }
        });
        if (referencePlane.material instanceof THREE.MeshBasicMaterial) {
            referencePlane.material.opacity = referenceOpacity;
            referencePlane.visible = collectionsVisibility['REF_Reference'];
        }
    }, [collectionsVisibility, referenceOpacity]);
    // Update construction step filter (step 1 to 54)
    useEffect(() => {
        if (!sceneResultRef.current)
            return;
        const { collectionsGroups, referencePlane } = sceneResultRef.current;
        // If step < 5: nothing but empty coordinate system
        // Step 5-11: Reference layer active
        // Step 12-16: Terrain
        // Step 17-21: Roads
        // Step 22-25: Wall
        // Step 26-29: Parking
        // Step 30-36: Main Office
        // Step 37-39: Storage & Substation
        // Step 40-44: Vegetation
        // Step 45-46: Street lights & Gate
        // Step 47-54: Complete scene
        const terrain = collectionsGroups.get('00_Terrain');
        const roads = collectionsGroups.get('01_Roads');
        const buildings = collectionsGroups.get('02_Buildings');
        const wall = collectionsGroups.get('03_Wall_Gate');
        const veg = collectionsGroups.get('04_Vegetation');
        const street = collectionsGroups.get('05_StreetFurniture');
        if (currentStep >= 5 && currentStep < 51) {
            referencePlane.visible = collectionsVisibility['REF_Reference'];
        }
        else if (currentStep >= 51) {
            // Step 51 in manual: hide reference blueprint
            referencePlane.visible = collectionsVisibility['REF_Reference'];
        }
        else {
            referencePlane.visible = false;
        }
        if (referencePlane.material && 'opacity' in referencePlane.material) {
            referencePlane.material.opacity = referenceOpacity;
        }
        if (terrain)
            terrain.visible = currentStep >= 12 && collectionsVisibility['00_Terrain'];
        if (roads)
            roads.visible = currentStep >= 17 && collectionsVisibility['01_Roads'];
        if (wall)
            wall.visible = currentStep >= 22 && collectionsVisibility['03_Wall_Gate'];
        if (buildings)
            buildings.visible = currentStep >= 30 && collectionsVisibility['02_Buildings'];
        if (veg)
            veg.visible = currentStep >= 40 && collectionsVisibility['04_Vegetation'];
        if (street)
            street.visible = currentStep >= 45 && collectionsVisibility['05_StreetFurniture'];
    }, [currentStep, collectionsVisibility, referenceOpacity]);
    // Update Night / Day lighting
    useEffect(() => {
        if (!sceneResultRef.current)
            return;
        const { scene, lightsGroup, streetLightsLamps } = sceneResultRef.current;
        const sun = lightsGroup.getObjectByName('Sun_Light');
        const hemi = lightsGroup.getObjectByName('Hemi_Light');
        const amb = lightsGroup.getObjectByName('Ambient_Light');
        if (isNightMode) {
            scene.background = new THREE.Color('#030712');
            if (sun)
                sun.intensity = 0.15;
            if (hemi)
                hemi.intensity = 0.15;
            if (amb)
                amb.intensity = 0.25;
            streetLightsLamps.forEach((lamp) => {
                lamp.material.color.set('#fef08a');
            });
        }
        else {
            scene.background = new THREE.Color('#0b1120');
            if (sun)
                sun.intensity = 1.6;
            if (hemi)
                hemi.intensity = 0.6;
            if (amb)
                amb.intensity = 0.85;
            streetLightsLamps.forEach((lamp) => {
                lamp.material.color.set('#fef08a');
            });
        }
    }, [isNightMode]);
    // Update Wireframe mode
    useEffect(() => {
        if (!sceneResultRef.current)
            return;
        const { scene } = sceneResultRef.current;
        scene.traverse((child) => {
            if (child.isMesh) {
                const m = child.material;
                if (Array.isArray(m)) {
                    m.forEach((mat) => {
                        if (mat && 'wireframe' in mat) {
                            mat.wireframe = isWireframe;
                        }
                    });
                }
                else if (m && 'wireframe' in m) {
                    m.wireframe = isWireframe;
                }
            }
        });
    }, [isWireframe]);
    // Update ruler grid visibility
    useEffect(() => {
        if (!sceneResultRef.current)
            return;
        const grid = sceneResultRef.current.scene.getObjectByName('Grid_Ruler');
        if (grid)
            grid.visible = showRulerGrid;
    }, [showRulerGrid]);
    // Update Viewpoint
    useEffect(() => {
        if (!cameraRef.current || !controlsRef.current)
            return;
        const cam = cameraRef.current;
        const ctrl = controlsRef.current;
        switch (viewpointMode) {
            case 'top': // Num 7 in manual
                cam.position.set(0, 160, 0.0001);
                ctrl.target.set(0, 0, 0);
                break;
            case 'isometric': // Num 0 in manual (bird's eye 45 deg)
                cam.position.set(85, 75, 80);
                ctrl.target.set(0, 5, 0);
                break;
            case 'front': // Num 1 (South elevation looking north)
                cam.position.set(0, 10, 85);
                ctrl.target.set(0, 5, 0);
                break;
            case 'right': // Num 3 (East elevation looking west)
                cam.position.set(90, 10, 0);
                ctrl.target.set(0, 5, 0);
                break;
            case 'walk': // Eye level walk
                cam.position.set(0, 1.8, 48);
                ctrl.target.set(0, 2.0, 0);
                break;
            case 'substation': // Focus on Substation, Grid Cabinets & ESS area (Reference photo perspective)
                cam.position.set(16, 22, 38);
                ctrl.target.set(-4, 3, 12);
                break;
        }
        ctrl.update();
    }, [viewpointMode]);
    // Update selection box on external selectedObjectId
    useEffect(() => {
        if (!sceneResultRef.current || !selectionBoxRef.current)
            return;
        if (!selectedObjectId) {
            selectionBoxRef.current.visible = false;
            return;
        }
        const found = sceneResultRef.current.objectsMeta.find((o) => o.id === selectedObjectId);
        if (found) {
            const mesh = sceneResultRef.current.scene.getObjectByName(found.name);
            if (mesh) {
                selectionBoxRef.current.setFromObject(mesh);
                selectionBoxRef.current.visible = true;
            }
        }
    }, [selectedObjectId]);
    return (React.createElement("div", { className: "relative w-full h-full bg-slate-950 overflow-hidden select-none" },
        React.createElement("div", { ref: mountRef, className: "w-full h-full" }),
        React.createElement("div", { className: "absolute top-3 left-3 flex items-center gap-2 bg-slate-900/80 backdrop-blur-md border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-slate-300 pointer-events-auto" },
            React.createElement(Compass, { className: "w-4 h-4 text-sky-400 animate-pulse" }),
            React.createElement("span", { className: "font-semibold text-slate-100" }, "\u5317\u5411\u65B9\u4F4D (NORTH \u2191)"),
            React.createElement("span", { className: "text-slate-500" }, "|"),
            React.createElement("span", { className: "text-sky-300 font-mono" }, "120m \u00D7 120m \u573A\u5730\u6807\u9AD8 Z=0")),
        hoveredName && (React.createElement("div", { className: "absolute top-12 left-3 bg-sky-950/90 border border-sky-500/40 text-sky-200 px-3 py-1 rounded text-xs backdrop-blur-md shadow-lg font-mono" },
            "\u70B9\u51FB\u67E5\u770B\u6A21\u578B\u5BF9\u8C61: ",
            React.createElement("span", { className: "font-bold text-white" }, hoveredName))),
        React.createElement("div", { className: "absolute top-3 right-3 flex items-center gap-1.5 bg-slate-900/85 backdrop-blur-md border border-slate-800 rounded-lg p-1 text-xs text-slate-300 shadow-xl pointer-events-auto" },
            React.createElement("div", { className: "flex items-center gap-1 pr-1.5 border-r border-slate-800" },
                React.createElement("button", { onClick: () => onChangeViewpoint('top'), className: `px-2 py-1 rounded font-mono transition-colors ${viewpointMode === 'top'
                        ? 'bg-sky-600 text-white font-semibold'
                        : 'hover:bg-slate-800 text-slate-300'}`, title: "\u9876\u89C6\u6B63\u4EA4\u89C6\u89D2 [\u5C0F\u952E\u76D8 7]" }, "\u9876\u89C6 [7]"),
                React.createElement("button", { onClick: () => onChangeViewpoint('isometric'), className: `px-2 py-1 rounded font-mono transition-colors ${viewpointMode === 'isometric'
                        ? 'bg-sky-600 text-white font-semibold'
                        : 'hover:bg-slate-800 text-slate-300'}`, title: "\u659C\u4FEF\u89C6\u9E1F\u77B0\u89C6\u89D2 [\u5C0F\u952E\u76D8 0]" }, "\u9E1F\u77B0 [0]"),
                React.createElement("button", { onClick: () => onChangeViewpoint('front'), className: `px-2 py-1 rounded font-mono transition-colors ${viewpointMode === 'front'
                        ? 'bg-sky-600 text-white font-semibold'
                        : 'hover:bg-slate-800 text-slate-300'}`, title: "\u5357\u5411\u6B63\u7ACB\u9762 [\u5C0F\u952E\u76D8 1]" }, "\u6B63\u89C6 [1]"),
                React.createElement("button", { onClick: () => onChangeViewpoint('right'), className: `px-2 py-1 rounded font-mono transition-colors ${viewpointMode === 'right'
                        ? 'bg-sky-600 text-white font-semibold'
                        : 'hover:bg-slate-800 text-slate-300'}`, title: "\u4E1C\u5411\u4FA7\u7ACB\u9762 [\u5C0F\u952E\u76D8 3]" }, "\u4FA7\u89C6 [3]"),
                React.createElement("button", { onClick: () => onChangeViewpoint('walk'), className: `px-2 py-1 rounded font-mono transition-colors ${viewpointMode === 'walk'
                        ? 'bg-amber-500 text-slate-950 font-semibold'
                        : 'hover:bg-slate-800 text-slate-300'}`, title: "\u573A\u7AD9\u4EBA\u89C6\u6F2B\u6E38 (\u6807\u9AD8 1.8m)" }, "\u4EBA\u89C6"),
                React.createElement("button", { onClick: () => onChangeViewpoint('substation'), className: `px-2 py-1 rounded font-mono transition-colors ${viewpointMode === 'substation'
                        ? 'bg-emerald-600 text-white font-semibold shadow-sm'
                        : 'hover:bg-slate-800 text-emerald-400'}`, title: "\u805A\u7126\u53D8\u7535\u7AD9\u3001\u5E76\u7F51\u67DC\u4E0E\u50A8\u80FD\u67DC\u533A\u57DF [\u53C2\u8003\u5B9E\u666F\u56FE\u673A\u4F4D]" }, "\u7535\u7AD9\u673A\u4F4D")),
            React.createElement("button", { onClick: () => setIsNightMode(!isNightMode), className: `p-1.5 rounded transition-colors ${isNightMode ? 'bg-amber-500/20 text-amber-300' : 'hover:bg-slate-800 text-slate-400'}`, title: isNightMode ? '切换为日间日光' : '切换为夜间道路照明' }, isNightMode ? React.createElement(Moon, { className: "w-4 h-4" }) : React.createElement(Sun, { className: "w-4 h-4" })),
            React.createElement("button", { onClick: () => setIsWireframe(!isWireframe), className: `p-1.5 rounded transition-colors ${isWireframe ? 'bg-sky-500/20 text-sky-400' : 'hover:bg-slate-800 text-slate-400'}`, title: isWireframe ? '切换回实体着色 (Solid)' : '开启线框着色 (Wireframe)' },
                React.createElement(Box, { className: "w-4 h-4" })),
            React.createElement("button", { onClick: () => setShowRulerGrid(!showRulerGrid), className: `p-1.5 rounded transition-colors ${showRulerGrid ? 'bg-slate-800 text-sky-400' : 'hover:bg-slate-800 text-slate-400'}`, title: showRulerGrid ? '隐藏 120m 标尺网格' : '显示 120m 标尺网格' },
                React.createElement(Layers, { className: "w-4 h-4" }))),
        React.createElement("div", { className: "absolute bottom-3 left-3 flex items-center gap-3 bg-slate-900/85 backdrop-blur-md border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-slate-400 pointer-events-auto" },
            React.createElement("span", { className: "flex items-center gap-1.5 text-slate-300" },
                React.createElement("span", { className: "w-2 h-2 rounded-full bg-emerald-500 animate-pulse" }),
                "Blender 4.x \u5B9E\u65F6\u5DE5\u7A0B\u6E32\u67D3"),
            React.createElement("span", { className: "text-slate-600" }, "|"),
            React.createElement("span", { className: "font-mono text-slate-300" }, "\u516C\u5236\u7C73 (1Unit = 1.0m)"),
            React.createElement("span", { className: "text-slate-600" }, "|"),
            React.createElement("span", { className: "font-mono text-sky-400" }, "\u603B\u5360\u5730: 14,400 m\u00B2"))));
};
