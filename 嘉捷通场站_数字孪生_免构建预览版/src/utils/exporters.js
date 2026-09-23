import * as THREE from 'three';
import { GLTFExporter } from 'three/examples/jsm/exporters/GLTFExporter.js';
export function exportSceneToGLB(scene, filename = 'Jiajietong_Site.glb', onSuccess, onError) {
    const exporter = new GLTFExporter();
    // Create a clone to export only clean render meshes without helper lights
    const exportGroup = new THREE.Group();
    scene.children.forEach((child) => {
        // Exclude environment lights and reference image if requested
        if (child.name !== 'Environment_Lights' && child.name !== 'REF_Reference') {
            exportGroup.add(child.clone());
        }
    });
    exporter.parse(exportGroup, (gltf) => {
        if (gltf instanceof ArrayBuffer) {
            saveArrayBuffer(gltf, filename);
            if (onSuccess)
                onSuccess();
        }
        else {
            const output = JSON.stringify(gltf, null, 2);
            saveString(output, filename.replace('.glb', '.gltf'));
            if (onSuccess)
                onSuccess();
        }
    }, (error) => {
        console.error('Error exporting GLTF/GLB:', error);
        if (onError)
            onError(error);
    }, {
        binary: true,
        onlyVisible: true,
        maxTextureSize: 2048,
    });
}
export function exportSceneToOBJ(scene, filename = 'Jiajietong_Site.obj') {
    let output = `# Jiajietong Station Digital Twin 3D Model (Blender 4.x Specification)\n`;
    output += `# Units: Metric (1.0 = 1 Meter)\n`;
    output += `# Boundary: 120m x 100m\n\n`;
    let vertOffset = 1;
    scene.traverse((child) => {
        if (child.isMesh) {
            const mesh = child;
            if (mesh.parent?.name === 'Environment_Lights' || mesh.name.includes('REF_Reference')) {
                return;
            }
            output += `o ${mesh.name || 'Object'}\n`;
            const geometry = mesh.geometry.clone();
            geometry.applyMatrix4(mesh.matrixWorld);
            const positions = geometry.attributes.position;
            if (positions) {
                for (let i = 0; i < positions.count; i++) {
                    output += `v ${positions.getX(i).toFixed(4)} ${positions.getY(i).toFixed(4)} ${positions.getZ(i).toFixed(4)}\n`;
                }
                if (geometry.index) {
                    const index = geometry.index;
                    for (let i = 0; i < index.count; i += 3) {
                        output += `f ${index.getX(i) + vertOffset} ${index.getX(i + 1) + vertOffset} ${index.getX(i + 2) + vertOffset}\n`;
                    }
                }
                else {
                    for (let i = 0; i < positions.count; i += 3) {
                        output += `f ${i + vertOffset} ${i + 1 + vertOffset} ${i + 2 + vertOffset}\n`;
                    }
                }
                vertOffset += positions.count;
            }
        }
    });
    saveString(output, filename);
}
function saveArrayBuffer(buffer, filename) {
    const blob = new Blob([buffer], { type: 'application/octet-stream' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    link.click();
    URL.revokeObjectURL(link.href);
}
function saveString(text, filename) {
    const blob = new Blob([text], { type: 'text/plain' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    link.click();
    URL.revokeObjectURL(link.href);
}
