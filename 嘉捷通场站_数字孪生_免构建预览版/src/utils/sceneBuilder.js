import * as THREE from 'three';
// Helper to create texture for Blueprint reference - 100% Matching "2. 顶视图（正交）"
function createBlueprintTexture() {
    const canvas = document.createElement('canvas');
    canvas.width = 2048;
    canvas.height = 2048;
    const ctx = canvas.getContext('2d');
    // World coordinates (-60 to +60 in X and Z) mapping to Canvas pixels (0 to 2048)
    const toPx = (x) => ((x + 60) / 120) * 2048;
    const toPz = (z) => ((z + 60) / 120) * 2048;
    const toPw = (w) => (w / 120) * 2048;
    const toPh = (h) => (h / 120) * 2048;
    // 1. Lush Green Terrain Background (Base lawn from image.png)
    const grassGrad = ctx.createLinearGradient(0, 0, 0, 2048);
    grassGrad.addColorStop(0, '#5f9136');
    grassGrad.addColorStop(0.5, '#689d3c');
    grassGrad.addColorStop(1, '#578631');
    ctx.fillStyle = grassGrad;
    ctx.fillRect(0, 0, 2048, 2048);
    // Subtle organic lawn variations
    ctx.fillStyle = 'rgba(74, 120, 38, 0.25)';
    for (let i = 0; i < 40; i++) {
        const rx = (i * 137.5) % 2048;
        const ry = (i * 269.3) % 2048;
        ctx.beginPath();
        ctx.ellipse(rx, ry, 60 + (i % 5) * 20, 40 + (i % 7) * 15, (i * 0.4), 0, Math.PI * 2);
        ctx.fill();
    }
    // Engineering grid lines (every 10m soft guide)
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
    ctx.lineWidth = 1;
    for (let m = -60; m <= 60; m += 10) {
        ctx.beginPath();
        ctx.moveTo(toPx(m), 0);
        ctx.lineTo(toPx(m), 2048);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(0, toPz(m));
        ctx.lineTo(2048, toPz(m));
        ctx.stroke();
    }
    // 2. Scenic Water Canal across middle (East-West, Z: -10.5 to -1.5)
    const canalZ1 = toPz(-10.5);
    const canalZ2 = toPz(-1.5);
    const canalH = canalZ2 - canalZ1;
    // Water body
    const waterGrad = ctx.createLinearGradient(0, canalZ1, 0, canalZ2);
    waterGrad.addColorStop(0, '#1c71ad');
    waterGrad.addColorStop(0.5, '#298cd9');
    waterGrad.addColorStop(1, '#1b6b9e');
    ctx.fillStyle = waterGrad;
    ctx.fillRect(0, canalZ1, 2048, canalH);
    // Soft water ripple lines
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.25)';
    ctx.lineWidth = 2;
    for (let w = 0; w < 16; w++) {
        const wy = canalZ1 + 15 + (w * 9) % canalH;
        ctx.beginPath();
        ctx.moveTo((w * 130) % 2000, wy);
        ctx.bezierCurveTo((w * 130 + 100) % 2000, wy - 3, (w * 130 + 200) % 2000, wy + 3, (w * 130 + 350) % 2000, wy);
        ctx.stroke();
    }
    // Canal Stone Revetment Banks
    ctx.fillStyle = '#94a3b8';
    ctx.fillRect(0, canalZ1 - toPh(0.6), 2048, toPh(0.6));
    ctx.fillRect(0, canalZ2, 2048, toPh(0.6));
    // 3. Road System (West Boulevard & South Boulevard)
    const roadColor = '#334155';
    ctx.fillStyle = roadColor;
    // West Boulevard (North-South, X: -54 to -44, W=10m)
    ctx.fillRect(toPx(-54), 0, toPw(10), 2048);
    // South Boulevard (East-West, Z: 28 to 38, W=10m)
    ctx.fillRect(toPx(-44), toPz(28), toPw(104), toPh(10));
    // Internal connection roads & park loops
    // Road around west factories
    ctx.fillRect(toPx(-44), toPz(-2), toPw(18), toPh(4)); // North branch
    ctx.fillRect(toPx(-27), toPz(-2), toPw(4), toPh(30)); // East branch of west factory
    // Loop around North Parking and Mega Factories
    ctx.fillRect(toPx(-20), toPz(-56), toPw(68), toPh(4)); // Far north loop
    ctx.fillRect(toPx(7), toPz(-56), toPw(4), toPh(45)); // Road between parking & factories
    ctx.fillRect(toPx(-20), toPz(-18), toPw(30), toPh(4)); // Road south of parking
    ctx.fillRect(toPx(43), toPz(-56), toPw(4), toPh(45)); // East factory access road
    ctx.fillRect(toPx(48), toPz(-56), toPw(8), toPh(116)); // Far east boulevard
    // Turning fillets & junction curves
    ctx.beginPath();
    ctx.arc(toPx(-44), toPz(28), toPw(3), Math.PI, Math.PI * 1.5);
    ctx.fill();
    // West Boulevard Bridge over Canal (X: -54 to -44, Z: -10.5 to -1.5)
    ctx.fillStyle = '#64748b';
    ctx.fillRect(toPx(-54), canalZ1, toPw(10), canalH);
    ctx.fillStyle = '#cbd5e1';
    ctx.fillRect(toPx(-54), canalZ1, toPw(0.8), canalH); // West barrier
    ctx.fillRect(toPx(-44.8), canalZ1, toPw(0.8), canalH); // East barrier
    // Road Markings: Double yellow center lines on West Boulevard
    ctx.strokeStyle = '#facc15';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(toPx(-49.2), 0);
    ctx.lineTo(toPx(-49.2), 2048);
    ctx.moveTo(toPx(-48.8), 0);
    ctx.lineTo(toPx(-48.8), 2048);
    ctx.stroke();
    // Road Markings: White dashed center line on South Boulevard
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 3;
    ctx.setLineDash([16, 12]);
    ctx.beginPath();
    ctx.moveTo(toPx(-44), toPz(33));
    ctx.lineTo(toPx(60), toPz(33));
    ctx.stroke();
    ctx.setLineDash([]);
    // Road Markings: White edge lines
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.7)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(toPx(-53.4), 0);
    ctx.lineTo(toPx(-53.4), 2048);
    ctx.moveTo(toPx(-44.6), 0);
    ctx.lineTo(toPx(-44.6), 2048);
    ctx.moveTo(toPx(-44), toPz(28.6));
    ctx.lineTo(toPx(60), toPz(28.6));
    ctx.moveTo(toPx(-44), toPz(37.4));
    ctx.lineTo(toPx(60), toPz(37.4));
    ctx.stroke();
    // Crosswalk at West-South Intersection
    ctx.fillStyle = '#ffffff';
    for (let z = 29; z <= 37; z += 1.2) {
        ctx.fillRect(toPx(-43), toPz(z), toPw(2.5), toPh(0.6));
    }
    // 4. North Central Parking Lot (X: -18 to 7, Z: -52 to -20)
    ctx.fillStyle = '#475569';
    ctx.fillRect(toPx(-18), toPz(-52), toPw(25), toPh(32));
    // Parking Landscaped Green Islands (3 strips)
    ctx.fillStyle = '#5f9136';
    [-14, -6, 2].forEach((ix) => {
        ctx.fillRect(toPx(ix), toPz(-48), toPw(2), toPh(24));
    });
    // White Parking Bay Markings
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 2;
    [-16, -11, -8, -3, 0, 5].forEach((colX) => {
        for (let pz = -48; pz <= -26; pz += 2.8) {
            ctx.strokeRect(toPx(colX), toPz(pz), toPw(2.5), toPh(2.6));
        }
    });
    // 5. West 3 Parallel Factories (X: -42 to -28)
    const factoryMatColor = '#f8fafc';
    const drawBuildingTop = (x, z, w, h, name) => {
        // Drop shadow
        ctx.fillStyle = 'rgba(0, 0, 0, 0.28)';
        ctx.fillRect(toPx(x) + 4, toPz(z) + 6, toPw(w), toPh(h));
        // Main roof
        ctx.fillStyle = factoryMatColor;
        ctx.fillRect(toPx(x), toPz(z), toPw(w), toPh(h));
        // Parapet edge
        ctx.strokeStyle = '#cbd5e1';
        ctx.lineWidth = 2;
        ctx.strokeRect(toPx(x), toPz(z), toPw(w), toPh(h));
        // Roof ridge/vent line
        ctx.strokeStyle = '#94a3b8';
        ctx.beginPath();
        ctx.moveTo(toPx(x), toPz(z + h / 2));
        ctx.lineTo(toPx(x + w), toPz(z + h / 2));
        ctx.stroke();
    };
    drawBuildingTop(-42, 0, 14, 6, 'West_Factory_North');
    drawBuildingTop(-42, 9, 14, 6, 'West_Factory_Mid');
    drawBuildingTop(-42, 18, 14, 6, 'West_Factory_South');
    // 6. Substation & ESS Equipment Yard (X: -24 to 15, Z: -1 to 26)
    // Concrete Ground Pad
    ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
    ctx.fillRect(toPx(-24) + 6, toPz(-1) + 6, toPw(39), toPh(27));
    ctx.fillStyle = '#e2e8f0';
    ctx.fillRect(toPx(-24), toPz(-1), toPw(39), toPh(27));
    ctx.strokeStyle = '#cbd5e1';
    ctx.lineWidth = 3;
    ctx.strokeRect(toPx(-24), toPz(-1), toPw(39), toPh(27));
    // Concrete grid expansion joints
    ctx.strokeStyle = '#94a3b8';
    ctx.lineWidth = 1;
    for (let gx = -24; gx <= 15; gx += 6) {
        ctx.beginPath();
        ctx.moveTo(toPx(gx), toPz(-1));
        ctx.lineTo(toPx(gx), toPz(26));
        ctx.stroke();
    }
    for (let gz = -1; gz <= 26; gz += 5) {
        ctx.beginPath();
        ctx.moveTo(toPx(-24), toPz(gz));
        ctx.lineTo(toPx(15), toPz(gz));
        ctx.stroke();
    }
    // West Control Long Building (X: -26 to -21.5, Z: 0 to 22)
    ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
    ctx.fillRect(toPx(-26) + 4, toPz(0) + 4, toPw(4.5), toPh(22));
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(toPx(-26), toPz(0), toPw(4.5), toPh(22));
    ctx.strokeStyle = '#94a3b8';
    ctx.strokeRect(toPx(-26), toPz(0), toPw(4.5), toPh(22));
    // Blue continuous skylight strip
    ctx.fillStyle = '#38bdf8';
    ctx.fillRect(toPx(-24.5), toPz(2), toPw(1.6), toPh(18));
    // South Gatehouse / Guardroom (X: -10 to -5, Z: 26 to 29)
    ctx.fillStyle = '#f8fafc';
    ctx.fillRect(toPx(-10), toPz(26), toPw(5), toPh(3));
    ctx.strokeStyle = '#94a3b8';
    ctx.strokeRect(toPx(-10), toPz(26), toPw(5), toPh(3));
    // High Voltage Glowing Cable Trench Network (Cyan)
    ctx.strokeStyle = '#00e5ff';
    ctx.lineWidth = 3;
    ctx.shadowColor = '#00e5ff';
    ctx.shadowBlur = 10;
    // Trunk line from transformers to inverters
    [-18, -8, 2, 11].forEach((tx) => {
        ctx.beginPath();
        ctx.moveTo(toPx(tx), toPz(20));
        ctx.lineTo(toPx(tx), toPz(10.5));
        ctx.stroke();
    });
    // Cross trunk line to ESS row
    ctx.beginPath();
    ctx.moveTo(toPx(-20), toPz(6));
    ctx.lineTo(toPx(12), toPz(6));
    ctx.moveTo(toPx(-18), toPz(10.5));
    ctx.lineTo(toPx(-18), toPz(6));
    ctx.moveTo(toPx(11), toPz(10.5));
    ctx.lineTo(toPx(11), toPz(6));
    ctx.stroke();
    ctx.shadowBlur = 0; // reset
    // 4 Main Transformers (South row: Z = 20, X = -18, -8, 2, 11)
    [-18, -8, 2, 11].forEach((tx) => {
        // Transformer oil catchment gravel pit border
        ctx.fillStyle = '#334155';
        ctx.fillRect(toPx(tx - 2.4), toPz(20 - 1.8), toPw(4.8), toPh(3.6));
        // Main tank body
        ctx.fillStyle = '#475569';
        ctx.fillRect(toPx(tx - 1.6), toPz(20 - 1.2), toPw(3.2), toPh(2.4));
        // Left & Right radiator fin arrays
        ctx.fillStyle = '#1e293b';
        ctx.fillRect(toPx(tx - 2.3), toPz(20 - 1.2), toPw(0.6), toPh(2.4));
        ctx.fillRect(toPx(tx + 1.7), toPz(20 - 1.2), toPw(0.6), toPh(2.4));
        // Oil conservator horizontal tank (pipe)
        ctx.fillStyle = '#94a3b8';
        ctx.fillRect(toPx(tx - 1.2), toPz(20 - 1.6), toPw(2.4), toPh(0.5));
        // Porcelain bushings dots
        ctx.fillStyle = '#b45309';
        [-0.8, 0, 0.8].forEach((bx) => {
            ctx.beginPath();
            ctx.arc(toPx(tx + bx), toPz(20 - 0.5), 4, 0, Math.PI * 2);
            ctx.fill();
        });
    });
    // 4 Grid Connection Cabinets (Mid row: Z = 10.5, X = -18, -8, 2, 11) - 10kV Switchgear Reference Style
    [-18, -8, 2, 11].forEach((gx) => {
        // Cabinet Body (1.4m W x 1.5m D)
        ctx.fillStyle = '#f1f5f9';
        ctx.fillRect(toPx(gx - 0.7), toPz(10.5 - 0.75), toPw(1.4), toPh(1.5));
        ctx.strokeStyle = '#475569';
        ctx.lineWidth = 1.5;
        ctx.strokeRect(toPx(gx - 0.7), toPz(10.5 - 0.75), toPw(1.4), toPh(1.5));
        // 2 Top Lifting Eye-Bolts
        ctx.fillStyle = '#94a3b8';
        ctx.beginPath();
        ctx.arc(toPx(gx - 0.55), toPz(10.5 + 0.65), 3.5, 0, Math.PI * 2);
        ctx.arc(toPx(gx + 0.55), toPz(10.5 + 0.65), 3.5, 0, Math.PI * 2);
        ctx.fill();
        // Yellow 10kV indicator on front
        ctx.fillStyle = '#facc15';
        ctx.fillRect(toPx(gx - 0.65), toPz(10.5 + 0.62), toPw(0.35), toPh(0.1));
    });
    // 16 SERMATEC Modular ESS Liquid-Cooled Battery Cabinets (双排布置，每排 8 台: 北排 Z = 1.6, 南排 Z = 5.2)
    const essColXs = [-19.5, -15.2, -10.9, -6.6, -2.3, 2.0, 6.3, 10.6];
    const essRows = [1.6, 5.2];
    essRows.forEach((rowZ) => {
        essColXs.forEach((ex) => {
            ctx.fillStyle = '#f1f5f9';
            ctx.fillRect(toPx(ex - 0.62), toPz(rowZ - 0.72), toPw(1.25), toPh(1.45));
            ctx.strokeStyle = '#475569';
            ctx.lineWidth = 1.2;
            ctx.strokeRect(toPx(ex - 0.62), toPz(rowZ - 0.72), toPw(1.25), toPh(1.45));
            // Front door seam & warning marker
            ctx.fillStyle = '#facc15';
            ctx.fillRect(toPx(ex - 0.15), toPz(rowZ + 0.58), toPw(0.3), toPh(0.08));
            // Dual top lifting eye-bolts
            ctx.fillStyle = '#94a3b8';
            ctx.fillRect(toPx(ex - 0.48), toPz(rowZ - 0.65), toPw(0.1), toPh(0.1));
            ctx.fillRect(toPx(ex + 0.38), toPz(rowZ - 0.65), toPw(0.1), toPh(0.1));
        });
    });
    // 7. East Landscape Park Area (X: 16 to 55, Z: -1 to 26)
    // Tree canopy circles
    ctx.fillStyle = '#3f7027';
    const eastTrees = [
        [18, 5], [24, 2], [32, 4], [40, 8], [46, 3],
        [20, 12], [28, 20], [36, 15], [42, 22], [50, 18],
        [32, 25], [38, 24], [46, 25]
    ];
    eastTrees.forEach(([tx, tz]) => {
        ctx.beginPath();
        ctx.arc(toPx(tx), toPz(tz), 16 + (tx % 5) * 2, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#4e8532';
        ctx.beginPath();
        ctx.arc(toPx(tx) - 3, toPz(tz) - 3, 11, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#3f7027';
    });
    // Two Landscape Pavilion/Ancillary Houses on East Lawn
    drawBuildingTop(22, 14, 7, 4, 'East_Landscape_House_01');
    drawBuildingTop(46, 8, 4, 9, 'East_Landscape_House_02');
    // 8. North District Buildings (Above Canal, Z < -10)
    // Northwest Main Office Complex (X: -42 to -25, Z: -52 to -20)
    drawBuildingTop(-40, -50, 16, 26, 'Build_Office_Northwest');
    // Entrance canopy
    ctx.fillStyle = '#38bdf8';
    ctx.fillRect(toPx(-32), toPz(-22), toPw(8), toPh(3));
    // Northeast Twin Mega Modern Factories (X: 11 to 42)
    // Mega Factory North (Z: -54 to -36, 31m x 18m)
    ctx.fillStyle = 'rgba(0, 0, 0, 0.28)';
    ctx.fillRect(toPx(11) + 6, toPz(-54) + 6, toPw(31), toPh(18));
    ctx.fillStyle = '#f1f5f9';
    ctx.fillRect(toPx(11), toPz(-54), toPw(31), toPh(18));
    // Dual-tone modern industrial roof panels
    ctx.fillStyle = '#bae6fd';
    ctx.fillRect(toPx(11), toPz(-54), toPw(15.5), toPh(18));
    ctx.strokeStyle = '#94a3b8';
    ctx.lineWidth = 2;
    ctx.strokeRect(toPx(11), toPz(-54), toPw(31), toPh(18));
    // Mega Factory South (Z: -32 to -14, 31m x 18m)
    ctx.fillStyle = 'rgba(0, 0, 0, 0.28)';
    ctx.fillRect(toPx(11) + 6, toPz(-32) + 6, toPw(31), toPh(18));
    ctx.fillStyle = '#f1f5f9';
    ctx.fillRect(toPx(11), toPz(-32), toPw(31), toPh(18));
    ctx.fillStyle = '#bae6fd';
    ctx.fillRect(toPx(11), toPz(-32), toPw(15.5), toPh(18));
    ctx.strokeStyle = '#94a3b8';
    ctx.lineWidth = 2;
    ctx.strokeRect(toPx(11), toPz(-32), toPw(31), toPh(18));
    // Far East Warehouse (X: 45 to 56, Z: -48 to -18)
    drawBuildingTop(45, -46, 10, 26, 'Far_East_Warehouse');
    // 9. South District Buildings (Below South Boulevard, Z > 38)
    // Southeast Mega Warehouse/Factory (X: 11 to 54, Z: 42 to 58)
    drawBuildingTop(12, 42, 42, 16, 'South_East_Mega_Warehouse');
    // Southwest parking & ancillary building
    drawBuildingTop(-38, 44, 12, 8, 'South_West_Facility');
    // 10. EXACT MATCH OVERLAY BADGES (From User Uploaded Screenshot)
    // Top-left: Blue Badge "2. 顶视图（正交）"
    ctx.fillStyle = '#0052cc';
    const badgeW = 340;
    const badgeH = 72;
    const badgeR = 12;
    const bx = 36;
    const by = 36;
    ctx.beginPath();
    ctx.roundRect(bx, by, badgeW, badgeH, [0, badgeR, badgeR, 0]);
    ctx.fill();
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 36px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "PingFang SC", sans-serif';
    ctx.fillText('2. 顶视图（正交）', bx + 28, by + 50);
    // Bottom-left: White Pill Badge "用于精确布局/尺寸参考"
    ctx.fillStyle = 'rgba(255, 255, 255, 0.94)';
    ctx.shadowColor = 'rgba(0, 0, 0, 0.3)';
    ctx.shadowBlur = 12;
    const capW = 380;
    const capH = 64;
    const capR = 10;
    const cx = 36;
    const cy = 2048 - 36 - capH;
    ctx.beginPath();
    ctx.roundRect(cx, cy, capW, capH, capR);
    ctx.fill();
    ctx.shadowBlur = 0; // reset
    ctx.fillStyle = '#1e293b';
    ctx.font = 'bold 28px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "PingFang SC", sans-serif';
    ctx.fillText('用于精确布局/尺寸参考', cx + 24, cy + 44);
    // North Compass Arrow & Metric Scale (Top Right Corner)
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 22px monospace';
    ctx.fillText('NORTH ↑ (北)', 1860, 60);
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(1860, 80);
    ctx.lineTo(1980, 80);
    ctx.moveTo(1860, 74);
    ctx.lineTo(1860, 86);
    ctx.moveTo(1920, 76);
    ctx.lineTo(1920, 84);
    ctx.moveTo(1980, 74);
    ctx.lineTo(1980, 86);
    ctx.stroke();
    ctx.font = '16px monospace';
    ctx.fillText('0    10m   20m', 1860, 104);
    const texture = new THREE.CanvasTexture(canvas);
    texture.wrapS = THREE.ClampToEdgeWrapping;
    texture.wrapT = THREE.ClampToEdgeWrapping;
    texture.needsUpdate = true;
    return texture;
}
// Tree texture generator for cross-quad low-poly tree
function createTreeCanvasTexture() {
    const canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 384;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, 256, 384);
    // Trunk
    ctx.fillStyle = '#452c16';
    ctx.fillRect(116, 260, 24, 124);
    // Foliage layers (pine / rounded green tree)
    const grad = ctx.createLinearGradient(0, 40, 0, 280);
    grad.addColorStop(0, '#4ade80');
    grad.addColorStop(0.4, '#22c55e');
    grad.addColorStop(1, '#15803d');
    ctx.fillStyle = grad;
    // Canopy top
    ctx.beginPath();
    ctx.arc(128, 90, 65, 0, Math.PI * 2);
    ctx.fill();
    // Canopy mid
    ctx.beginPath();
    ctx.arc(128, 160, 90, 0, Math.PI * 2);
    ctx.fill();
    // Canopy bottom
    ctx.beginPath();
    ctx.arc(128, 230, 105, 0, Math.PI * 2);
    ctx.fill();
    // Leaf details
    ctx.fillStyle = 'rgba(255, 255, 255, 0.15)';
    for (let i = 0; i < 20; i++) {
        const rx = 50 + Math.random() * 150;
        const ry = 60 + Math.random() * 170;
        ctx.beginPath();
        ctx.arc(rx, ry, 12 + Math.random() * 14, 0, Math.PI * 2);
        ctx.fill();
    }
    const texture = new THREE.CanvasTexture(canvas);
    return texture;
}
// 10kV Switchgear Top Door Texture (Relay protection, 10kV badge, meters, buttons & socket)
function createSwitchgearTopDoorTexture() {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext('2d');
    // Light grey/white sheet metal body background (RAL 7035)
    ctx.fillStyle = '#f1f5f9';
    ctx.fillRect(0, 0, 512, 512);
    // Outer door bevel frame
    ctx.strokeStyle = '#cbd5e1';
    ctx.lineWidth = 6;
    ctx.strokeRect(4, 4, 504, 504);
    // 1. Top Left: Yellow "10kV" Badge
    ctx.fillStyle = '#facc15';
    ctx.fillRect(26, 30, 105, 56);
    ctx.strokeStyle = '#000000';
    ctx.lineWidth = 4;
    ctx.strokeRect(26, 30, 105, 56);
    ctx.fillStyle = '#000000';
    ctx.font = 'bold 38px "Segoe UI", Arial, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('10kV', 78, 58);
    // 2. Center Top: Microprocessor Digital Protection Relay Unit (微机综合保护测控装置)
    ctx.fillStyle = '#334155';
    ctx.fillRect(145, 38, 124, 60);
    ctx.strokeStyle = '#64748b';
    ctx.lineWidth = 3;
    ctx.strokeRect(145, 38, 124, 60);
    // LCD screen
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(152, 45, 72, 46);
    ctx.fillStyle = '#0284c7';
    ctx.fillRect(156, 49, 64, 38);
    // Keypad button matrix
    ctx.fillStyle = '#cbd5e1';
    for (let r = 0; r < 4; r++) {
        for (let c = 0; c < 2; c++) {
            ctx.beginPath();
            ctx.arc(238 + c * 15, 52 + r * 11, 3.5, 0, Math.PI * 2);
            ctx.fill();
        }
    }
    // 3. Right Top: Secondary Power Monitor / Digital Meter
    ctx.fillStyle = '#334155';
    ctx.fillRect(320, 42, 68, 52);
    ctx.strokeStyle = '#64748b';
    ctx.lineWidth = 2.5;
    ctx.strokeRect(320, 42, 68, 52);
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(326, 48, 56, 30);
    // 4 small control buttons
    ctx.fillStyle = '#cbd5e1';
    for (let i = 0; i < 4; i++) {
        ctx.beginPath();
        ctx.arc(333 + i * 14, 86, 2.5, 0, Math.PI * 2);
        ctx.fill();
    }
    // 4. Middle Left: 3x3 Test/Pilot Ports Array
    for (let c = 0; c < 3; c++) {
        for (let r = 0; r < 3; r++) {
            const cx = 95 + c * 36;
            const cy = 160 + r * 26;
            ctx.fillStyle = '#64748b';
            ctx.beginPath();
            ctx.arc(cx, cy, 9, 0, Math.PI * 2);
            ctx.fill();
            ctx.fillStyle = '#0f172a';
            ctx.beginPath();
            ctx.arc(cx, cy, 5.5, 0, Math.PI * 2);
            ctx.fill();
            ctx.strokeStyle = '#94a3b8';
            ctx.lineWidth = 1.5;
            ctx.beginPath();
            ctx.arc(cx, cy, 9, 0, Math.PI * 2);
            ctx.stroke();
        }
    }
    // 5. Middle Right: 4 Red Pilot Lamps / Buttons with chrome bezels
    for (let i = 0; i < 4; i++) {
        const bx = 260 + i * 52;
        const by = 172;
        // Chrome bezel
        ctx.fillStyle = '#94a3b8';
        ctx.beginPath();
        ctx.arc(bx, by, 17, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#475569';
        ctx.lineWidth = 2;
        ctx.stroke();
        // Red indicator dome
        const redGrad = ctx.createRadialGradient(bx - 4, by - 4, 2, bx, by, 14);
        redGrad.addColorStop(0, '#f87171');
        redGrad.addColorStop(0.65, '#dc2626');
        redGrad.addColorStop(1, '#7f1d1d');
        ctx.fillStyle = redGrad;
        ctx.beginPath();
        ctx.arc(bx, by, 14, 0, Math.PI * 2);
        ctx.fill();
    }
    // 6. Center Lower: Large Manual Operation Bezel Socket / Rotary Handle Socket
    const sockX = 256;
    const sockY = 310;
    ctx.fillStyle = '#cbd5e1';
    ctx.beginPath();
    ctx.arc(sockX, sockY, 40, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#94a3b8';
    ctx.lineWidth = 4;
    ctx.stroke();
    ctx.fillStyle = '#475569';
    ctx.beginPath();
    ctx.arc(sockX, sockY, 30, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#0f172a';
    ctx.beginPath();
    ctx.arc(sockX, sockY, 20, 0, Math.PI * 2);
    ctx.fill();
    const tex = new THREE.CanvasTexture(canvas);
    tex.colorSpace = THREE.SRGBColorSpace;
    return tex;
}
// 10kV Switchgear Bottom Door Texture (Switchgear nameplate, inspection window, & high voltage hazard triangle)
function createSwitchgearBottomDoorTexture() {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext('2d');
    // Light grey sheet metal background (RAL 7035)
    ctx.fillStyle = '#f1f5f9';
    ctx.fillRect(0, 0, 512, 512);
    // Outer bevel frame
    ctx.strokeStyle = '#cbd5e1';
    ctx.lineWidth = 6;
    ctx.strokeRect(4, 4, 504, 504);
    // 1. Top Left: Yellow "开关柜" Badge
    ctx.fillStyle = '#facc15';
    ctx.fillRect(26, 30, 116, 56);
    ctx.strokeStyle = '#000000';
    ctx.lineWidth = 4;
    ctx.strokeRect(26, 30, 116, 56);
    ctx.fillStyle = '#000000';
    ctx.font = 'bold 34px "PingFang SC", "Microsoft YaHei", sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('开关柜', 84, 58);
    // 2. Top Center/Right: Vertical Inspection Window
    const winX = 216;
    const winY = 40;
    const winW = 86;
    const winH = 135;
    ctx.fillStyle = '#e2e8f0';
    ctx.fillRect(winX - 5, winY - 5, winW + 10, winH + 10);
    ctx.strokeStyle = '#94a3b8';
    ctx.lineWidth = 3;
    ctx.strokeRect(winX - 5, winY - 5, winW + 10, winH + 10);
    // Tinted glass & internal view
    ctx.fillStyle = '#1e293b';
    ctx.fillRect(winX, winY, winW, winH);
    ctx.fillStyle = '#334155';
    ctx.fillRect(winX + 10, winY + 20, 38, 95);
    // Glass reflection sheen
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.22)';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(winX + 8, winY + 120);
    ctx.lineTo(winX + 76, winY + 15);
    ctx.stroke();
    // 3. Center / Lower: High Voltage Warning Triangle with Red Lightning Bolt
    const triCenterX = 256;
    const triCenterY = 325;
    const triSize = 160;
    const h = (Math.sqrt(3) / 2) * triSize;
    const p1 = { x: triCenterX, y: triCenterY - h * (2 / 3) };
    const p2 = { x: triCenterX - triSize / 2, y: triCenterY + h / 3 };
    const p3 = { x: triCenterX + triSize / 2, y: triCenterY + h / 3 };
    // Fill yellow
    ctx.fillStyle = '#facc15';
    ctx.beginPath();
    ctx.moveTo(p1.x, p1.y);
    ctx.lineTo(p2.x, p2.y);
    ctx.lineTo(p3.x, p3.y);
    ctx.closePath();
    ctx.fill();
    // Solid black outer border
    ctx.strokeStyle = '#000000';
    ctx.lineWidth = 4.5;
    ctx.stroke();
    // Inner black dashed border
    ctx.save();
    ctx.strokeStyle = '#000000';
    ctx.lineWidth = 3;
    ctx.setLineDash([8, 5]);
    const margin = 14;
    const ip1 = { x: triCenterX, y: p1.y + margin + 4 };
    const ip2 = { x: triCenterX - (triSize - margin * 2.3) / 2, y: p2.y - margin };
    const ip3 = { x: triCenterX + (triSize - margin * 2.3) / 2, y: p3.y - margin };
    ctx.beginPath();
    ctx.moveTo(ip1.x, ip1.y);
    ctx.lineTo(ip2.x, ip2.y);
    ctx.lineTo(ip3.x, ip3.y);
    ctx.closePath();
    ctx.stroke();
    ctx.restore();
    // Red Lightning Bolt (⚡) in center
    ctx.fillStyle = '#dc2626';
    ctx.beginPath();
    ctx.moveTo(triCenterX + 4, triCenterY - 48);
    ctx.lineTo(triCenterX - 20, triCenterY - 6);
    ctx.lineTo(triCenterX - 2, triCenterY - 6);
    ctx.lineTo(triCenterX - 16, triCenterY + 30);
    ctx.lineTo(triCenterX + 18, triCenterY - 12);
    ctx.lineTo(triCenterX + 2, triCenterY - 12);
    ctx.closePath();
    ctx.fill();
    // Exclamation dot below lightning bolt
    ctx.fillStyle = '#000000';
    ctx.beginPath();
    ctx.arc(triCenterX, triCenterY + 42, 5.5, 0, Math.PI * 2);
    ctx.fill();
    const tex = new THREE.CanvasTexture(canvas);
    tex.colorSpace = THREE.SRGBColorSpace;
    return tex;
}
// Texture generator for SERMATEC Modular ESS Liquid-Cooled Battery Cabinet (Image 2 & 3 reference)
function createSermatecEssDoorTexture() {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 1024;
    const ctx = canvas.getContext('2d');
    if (!ctx)
        return new THREE.CanvasTexture(canvas);
    // 1. Base Powder-Coated Sheet Metal Panel (RAL 7035 light grey / white)
    ctx.fillStyle = '#f1f5f9';
    ctx.fillRect(0, 0, 512, 1024);
    // Outer bevel frame stroke
    ctx.strokeStyle = '#cbd5e1';
    ctx.lineWidth = 6;
    ctx.strokeRect(3, 3, 506, 1018);
    // Subtle inner shadow / seam
    ctx.strokeStyle = '#e2e8f0';
    ctx.lineWidth = 2;
    ctx.strokeRect(10, 10, 492, 1004);
    // ----------------------------------------------------
    // UPPER DOOR (y: 0 to 540) - Control, BMS, Logo, Indicators
    // ----------------------------------------------------
    // Brand Logo: SERMATEC (Top Left: x=42, y=85)
    ctx.save();
    ctx.font = '900 36px "Arial Black", "Arial", sans-serif';
    ctx.textBaseline = 'middle';
    // "SERMAT" in bold deep corporate blue
    ctx.fillStyle = '#1d4ed8';
    ctx.fillText('SERMAT', 42, 85);
    const sermatWidth = ctx.measureText('SERMAT').width;
    // "EC" in electric cyan blue with stylized tech accent
    ctx.fillStyle = '#0284c7';
    ctx.fillText('EC', 42 + sermatWidth, 85);
    // Cyan tech dot accent
    ctx.fillStyle = '#00e5ff';
    ctx.beginPath();
    ctx.arc(42 + sermatWidth - 3, 72, 4, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
    // Circular Pressure-Relief / Explosion-Proof Vents (Image 2 & 3: two metal disc covers with ear tabs)
    const drawReliefCover = (cx, cy, radius) => {
        ctx.save();
        // Drop shadow
        ctx.fillStyle = 'rgba(0, 0, 0, 0.12)';
        ctx.beginPath();
        ctx.arc(cx + 2, cy + 3, radius + 2, 0, Math.PI * 2);
        ctx.fill();
        // Two mounting ear tabs at angle 11 o'clock and 5 o'clock
        [-2.3, 0.85].forEach((ang) => {
            const earX = cx + Math.cos(ang) * (radius + 8);
            const earY = cy + Math.sin(ang) * (radius + 8);
            ctx.fillStyle = '#e2e8f0';
            ctx.beginPath();
            ctx.arc(earX, earY, 8, 0, Math.PI * 2);
            ctx.fill();
            ctx.strokeStyle = '#94a3b8';
            ctx.lineWidth = 2;
            ctx.stroke();
            // Bolt screw dot
            ctx.fillStyle = '#334155';
            ctx.beginPath();
            ctx.arc(earX, earY, 3, 0, Math.PI * 2);
            ctx.fill();
        });
        // Disc Body gradient
        const discGrad = ctx.createRadialGradient(cx - radius * 0.3, cy - radius * 0.3, radius * 0.1, cx, cy, radius);
        discGrad.addColorStop(0, '#ffffff');
        discGrad.addColorStop(0.7, '#e2e8f0');
        discGrad.addColorStop(1, '#cbd5e1');
        ctx.fillStyle = discGrad;
        ctx.beginPath();
        ctx.arc(cx, cy, radius, 0, Math.PI * 2);
        ctx.fill();
        // Outer rim stroke
        ctx.strokeStyle = '#94a3b8';
        ctx.lineWidth = 2.5;
        ctx.stroke();
        // Inner concentric ring
        ctx.strokeStyle = '#cbd5e1';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.arc(cx, cy, radius * 0.72, 0, Math.PI * 2);
        ctx.stroke();
        ctx.restore();
    };
    // Top-right explosion-proof relief cover
    drawReliefCover(390, 95, 38);
    // Bottom-right explosion-proof relief cover (above seam)
    drawReliefCover(390, 485, 38);
    // Status Indicator Lights Column (电源, 运行, 蜂鸣器)
    const indicators = [
        { y: 200, color: '#f8fafc', ring: '#94a3b8', glow: '#ffffff', zh: '电源', en: 'POWER' },
        { y: 255, color: '#22c55e', ring: '#16a34a', glow: '#4ade80', zh: '运行', en: 'RUNNING' },
        { y: 310, color: '#ef4444', ring: '#b91c1c', glow: '#f87171', zh: '蜂鸣器', en: 'BUZZER' },
    ];
    indicators.forEach((ind) => {
        ctx.save();
        // Metal bezel ring
        ctx.fillStyle = '#94a3b8';
        ctx.beginPath();
        ctx.arc(390, ind.y, 12, 0, Math.PI * 2);
        ctx.fill();
        // Inner glowing lamp
        const lampGrad = ctx.createRadialGradient(388, ind.y - 2, 2, 390, ind.y, 9);
        lampGrad.addColorStop(0, ind.glow);
        lampGrad.addColorStop(1, ind.color);
        ctx.fillStyle = lampGrad;
        ctx.beginPath();
        ctx.arc(390, ind.y, 9, 0, Math.PI * 2);
        ctx.fill();
        // Text labels below
        ctx.textAlign = 'center';
        ctx.textBaseline = 'top';
        ctx.fillStyle = '#334155';
        ctx.font = 'bold 11px sans-serif';
        ctx.fillText(ind.zh, 390, ind.y + 14);
        ctx.font = '9px sans-serif';
        ctx.fillStyle = '#64748b';
        ctx.fillText(ind.en, 390, ind.y + 27);
        ctx.restore();
    });
    // Emergency Mushroom Stop Button (急停 / EMERGENCY STOP)
    ctx.save();
    const eStopY = 395;
    // Protective shroud
    ctx.fillStyle = '#1e293b';
    ctx.beginPath();
    ctx.arc(390, eStopY, 24, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#0f172a';
    ctx.lineWidth = 2;
    ctx.stroke();
    // Red mushroom button dome
    const eStopGrad = ctx.createRadialGradient(386, eStopY - 4, 3, 390, eStopY, 18);
    eStopGrad.addColorStop(0, '#f87171');
    eStopGrad.addColorStop(0.7, '#dc2626');
    eStopGrad.addColorStop(1, '#991b1b');
    ctx.fillStyle = eStopGrad;
    ctx.beginPath();
    ctx.arc(390, eStopY, 18, 0, Math.PI * 2);
    ctx.fill();
    // Text labels below
    ctx.textAlign = 'center';
    ctx.textBaseline = 'top';
    ctx.fillStyle = '#334155';
    ctx.font = 'bold 11px sans-serif';
    ctx.fillText('急停', 390, eStopY + 27);
    ctx.font = '9px sans-serif';
    ctx.fillStyle = '#64748b';
    ctx.fillText('EMERGENCY  STOP', 390, eStopY + 40);
    ctx.restore();
    // ----------------------------------------------------
    // HORIZONTAL SEAM BETWEEN UPPER AND LOWER DOORS (y = 540)
    // ----------------------------------------------------
    ctx.fillStyle = '#1e293b';
    ctx.fillRect(4, 538, 504, 5);
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(4, 543, 504, 2);
    // ----------------------------------------------------
    // LOWER DOOR (y: 545 to 1024) - High-Density Louvers & Warning
    // ----------------------------------------------------
    // Large Louver Intake Grille Matrix (16 rows x 11 slots matching Image 2 & 3)
    const louverRows = 16;
    const louverCols = 11;
    const startX = 52;
    const startY = 585;
    const slotW = 28;
    const slotH = 9;
    const slotGapX = 8.5;
    const slotGapY = 7.5;
    ctx.fillStyle = '#0f172a';
    for (let r = 0; r < louverRows; r++) {
        const rowY = startY + r * (slotH + slotGapY);
        for (let c = 0; c < louverCols; c++) {
            const colX = startX + c * (slotW + slotGapX);
            ctx.beginPath();
            ctx.roundRect(colX, rowY, slotW, slotH, 3);
            ctx.fill();
        }
    }
    // High Voltage Warning Sign (黄色三角防触电警示标) below louvers
    const triCenterX = 256;
    const triCenterY = 932;
    const triSize = 90;
    const h = (Math.sqrt(3) / 2) * triSize;
    ctx.save();
    // Yellow triangle background
    ctx.fillStyle = '#facc15';
    ctx.beginPath();
    ctx.moveTo(triCenterX, triCenterY - h * 0.6);
    ctx.lineTo(triCenterX - triSize / 2, triCenterY + h * 0.4);
    ctx.lineTo(triCenterX + triSize / 2, triCenterY + h * 0.4);
    ctx.closePath();
    ctx.fill();
    // Bold black border
    ctx.strokeStyle = '#000000';
    ctx.lineWidth = 5;
    ctx.lineJoin = 'round';
    ctx.stroke();
    // Black Lightning Bolt (⚡)
    ctx.fillStyle = '#000000';
    ctx.beginPath();
    ctx.moveTo(triCenterX + 1, triCenterY - 22);
    ctx.lineTo(triCenterX - 11, triCenterY + 2);
    ctx.lineTo(triCenterX - 1, triCenterY + 2);
    ctx.lineTo(triCenterX - 6, triCenterY + 24);
    ctx.lineTo(triCenterX + 12, triCenterY - 1);
    ctx.lineTo(triCenterX + 2, triCenterY - 1);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
    const tex = new THREE.CanvasTexture(canvas);
    tex.colorSpace = THREE.SRGBColorSpace;
    return tex;
}
// Attach object metadata for inspector
function tagObject(mesh, meta, trisEstimate) {
    let tris = trisEstimate || 0;
    if (!tris && mesh.geometry) {
        const geom = mesh.geometry;
        if (geom.index) {
            tris = geom.index.count / 3;
        }
        else if (geom.attributes.position) {
            tris = geom.attributes.position.count / 3;
        }
    }
    const fullMeta = {
        ...meta,
        tris: Math.round(tris),
    };
    mesh.userData = fullMeta;
    return fullMeta;
}
export function buildStationScene() {
    const scene = new THREE.Scene();
    scene.background = new THREE.Color('#0b1120');
    const objectsMeta = [];
    const collectionsGroups = new Map();
    const streetLightsLamps = [];
    const collectionIds = [
        'REF_Reference',
        '00_Terrain',
        '01_Roads',
        '02_Buildings',
        '03_Wall_Gate',
        '04_Vegetation',
        '05_StreetFurniture',
    ];
    collectionIds.forEach((id) => {
        const group = new THREE.Group();
        group.name = id;
        scene.add(group);
        collectionsGroups.set(id, group);
    });
    const refGroup = collectionsGroups.get('REF_Reference');
    const terrainGroup = collectionsGroups.get('00_Terrain');
    const roadsGroup = collectionsGroups.get('01_Roads');
    const buildingsGroup = collectionsGroups.get('02_Buildings');
    const wallGroup = collectionsGroups.get('03_Wall_Gate');
    const vegGroup = collectionsGroups.get('04_Vegetation');
    const streetGroup = collectionsGroups.get('05_StreetFurniture');
    // ==========================================
    // STAGE 2: REF_Reference Reference Blueprint (120m x 120m, Y=0.015)
    // ==========================================
    const refGeo = new THREE.PlaneGeometry(120, 120);
    refGeo.rotateX(-Math.PI / 2); // Lay flat on XZ ground
    const refMat = new THREE.MeshBasicMaterial({
        map: createBlueprintTexture(),
        transparent: true,
        opacity: 0.6,
        depthWrite: false,
        side: THREE.DoubleSide,
    });
    const referencePlane = new THREE.Mesh(refGeo, refMat);
    referencePlane.position.set(0, 0.015, 0);
    referencePlane.name = 'REF_Reference_Image';
    refGroup.add(referencePlane);
    objectsMeta.push(tagObject(referencePlane, {
        id: 'ref-plane',
        name: 'REF_Reference_Image',
        collection: 'REF_Reference',
        type: 'Reference Plane',
        dimensions: { x: 120, y: 0.015, z: 120 },
        position: { x: 0, y: 0.015, z: 0 },
        materialName: 'REF_Blueprint_Mat',
        materialColor: '#38bdf8',
        roughness: 1.0,
        description: '嘉捷通场站白模 3D 顶视图底样，尺寸 120m × 120m，高保真对齐参考航拍图',
    }));
    // ==========================================
    // STAGE 3: 00_Terrain Ground_Site (120m x 120m x 0.2m, top at Y=0)
    // ==========================================
    const groundGeo = new THREE.BoxGeometry(120, 0.2, 120);
    const groundMat = new THREE.MeshStandardMaterial({
        color: '#65a30d', // Natural vibrant site green lawn tone
        roughness: 0.9,
        metalness: 0.02,
    });
    const groundMesh = new THREE.Mesh(groundGeo, groundMat);
    groundMesh.position.set(0, -0.1, 0); // Top surface at Y=0
    groundMesh.receiveShadow = true;
    groundMesh.name = 'Ground_Site';
    terrainGroup.add(groundMesh);
    objectsMeta.push(tagObject(groundMesh, {
        id: 'ground-site',
        name: 'Ground_Site',
        collection: '00_Terrain',
        type: 'Mesh / Cube',
        dimensions: { x: 120, y: 0.2, z: 120 },
        position: { x: 0, y: -0.1, z: 0 },
        materialName: 'Mat_Site_Grass_Ground',
        materialColor: '#65A30D',
        roughness: 0.9,
        description: '场站主生态草坪基底底板 (120m × 120m × 0.2m)，表面定标在 Y=0',
    }));
    // ==========================================
    // STAGE 4: 01_Roads Realistic Boulevard & Loop Network (Height 0.04m, #334155)
    // Matching reference image:
    // - West Boulevard (X = -49, width 10m, Z: -60 to 60)
    // - South Boulevard (Z = 33, width 10m, X: -44 to 60)
    // - Factory access roads, North loop, and Central Parking Lot
    // ==========================================
    const roadMat = new THREE.MeshStandardMaterial({
        color: '#334155', // Rich asphalt slate
        roughness: 0.92,
        metalness: 0.08,
    });
    const markWhiteMat = new THREE.MeshBasicMaterial({ color: '#ffffff' });
    const markYellowMat = new THREE.MeshBasicMaterial({ color: '#facc15' });
    // 1. West Boulevard (X = -49, width 10m, full length 120m)
    const westBlvdGeo = new THREE.BoxGeometry(10, 0.04, 120);
    const westBlvdMesh = new THREE.Mesh(westBlvdGeo, roadMat);
    westBlvdMesh.position.set(-49, 0.02, 0);
    westBlvdMesh.receiveShadow = true;
    westBlvdMesh.name = 'Road_West_Boulevard';
    roadsGroup.add(westBlvdMesh);
    // West Boulevard Double Yellow Center Line
    const yLineGeo = new THREE.BoxGeometry(0.15, 0.01, 120);
    const yLine1 = new THREE.Mesh(yLineGeo, markYellowMat);
    yLine1.position.set(-49 - 0.2, 0.045, 0);
    roadsGroup.add(yLine1);
    const yLine2 = new THREE.Mesh(yLineGeo, markYellowMat);
    yLine2.position.set(-49 + 0.2, 0.045, 0);
    roadsGroup.add(yLine2);
    // West Boulevard Outer White Edge Lines
    const wEdgeGeo = new THREE.BoxGeometry(0.18, 0.01, 120);
    const wEdgeL = new THREE.Mesh(wEdgeGeo, markWhiteMat);
    wEdgeL.position.set(-49 - 4.5, 0.045, 0);
    roadsGroup.add(wEdgeL);
    const wEdgeR = new THREE.Mesh(wEdgeGeo, markWhiteMat);
    wEdgeR.position.set(-49 + 4.5, 0.045, 0);
    roadsGroup.add(wEdgeR);
    // 2. South Boulevard (Z = 33, width 10m, length 104m, X: -44 to 60)
    const southBlvdGeo = new THREE.BoxGeometry(104, 0.04, 10);
    const southBlvdMesh = new THREE.Mesh(southBlvdGeo, roadMat);
    southBlvdMesh.position.set(8, 0.02, 33);
    southBlvdMesh.receiveShadow = true;
    southBlvdMesh.name = 'Road_South_Boulevard';
    roadsGroup.add(southBlvdMesh);
    // South Boulevard White Dashed Center Line
    const dashGeo = new THREE.BoxGeometry(3.0, 0.01, 0.2);
    for (let dx = -40; dx <= 55; dx += 6.0) {
        const dash = new THREE.Mesh(dashGeo, markWhiteMat);
        dash.position.set(dx, 0.045, 33);
        roadsGroup.add(dash);
    }
    // 3. West Factories Loop Lane (North: Z = -2, East: X = -27)
    const westBranchN = new THREE.Mesh(new THREE.BoxGeometry(18, 0.04, 7), roadMat);
    westBranchN.position.set(-35, 0.02, -2);
    westBranchN.receiveShadow = true;
    roadsGroup.add(westBranchN);
    const westBranchE = new THREE.Mesh(new THREE.BoxGeometry(6, 0.04, 32), roadMat);
    westBranchE.position.set(-27, 0.02, 13);
    westBranchE.receiveShadow = true;
    roadsGroup.add(westBranchE);
    // 4. North Loop Roads connecting Parking Lot & Mega Factories
    const northRoad1 = new THREE.Mesh(new THREE.BoxGeometry(60, 0.04, 6), roadMat);
    northRoad1.position.set(16, 0.02, -56);
    northRoad1.receiveShadow = true;
    roadsGroup.add(northRoad1);
    const northRoad2 = new THREE.Mesh(new THREE.BoxGeometry(60, 0.04, 6), roadMat);
    northRoad2.position.set(16, 0.02, -18);
    northRoad2.receiveShadow = true;
    roadsGroup.add(northRoad2);
    const northLinkE = new THREE.Mesh(new THREE.BoxGeometry(6, 0.04, 44), roadMat);
    northLinkE.position.set(43, 0.02, -37);
    northLinkE.receiveShadow = true;
    roadsGroup.add(northLinkE);
    const northLinkW = new THREE.Mesh(new THREE.BoxGeometry(6, 0.04, 44), roadMat);
    northLinkW.position.set(7, 0.02, -37);
    northLinkW.receiveShadow = true;
    roadsGroup.add(northLinkW);
    // 5. Far East Logistics Lane (X = 51, Z: -18 to 28)
    const eastLane = new THREE.Mesh(new THREE.BoxGeometry(6, 0.04, 46), roadMat);
    eastLane.position.set(51, 0.02, 5);
    eastLane.receiveShadow = true;
    roadsGroup.add(eastLane);
    objectsMeta.push({
        id: 'road-blvd-network',
        name: 'Road_Network_Main (西/南干道与场区环线)',
        collection: '01_Roads',
        type: 'Mesh / Road Boulevard Network',
        dimensions: { x: 120, y: 0.04, z: 120 },
        position: { x: 0, y: 0.02, z: 0 },
        materialName: 'Mat_Asphalt_Road & Traffic Markings',
        materialColor: '#334155',
        roughness: 0.92,
        tris: 120,
        description: '场站 10m 宽西侧迎宾大道与南侧干道，配置双黄实线、白虚线标线及各厂房物流通道',
    });
    // ==========================================
    // STAGE 6: 01_Roads Central North Parking Lot (25m x 32m) with 3 Green Divider Islands
    // ==========================================
    const parkingGeo = new THREE.BoxGeometry(25, 0.02, 32);
    const parkingMesh = new THREE.Mesh(parkingGeo, roadMat);
    parkingMesh.position.set(-5.5, 0.015, -36);
    parkingMesh.receiveShadow = true;
    parkingMesh.name = 'Parking_Central_North';
    roadsGroup.add(parkingMesh);
    // 3 Green planter divider islands
    const islandMat = new THREE.MeshStandardMaterial({ color: '#4ade80', roughness: 0.8 });
    const curbMat = new THREE.MeshStandardMaterial({ color: '#e2e8f0', roughness: 0.6 });
    [-13, -5.5, 2].forEach((ix) => {
        const curb = new THREE.Mesh(new THREE.BoxGeometry(1.6, 0.1, 26), curbMat);
        curb.position.set(ix, 0.05, -36);
        roadsGroup.add(curb);
        const island = new THREE.Mesh(new THREE.BoxGeometry(1.3, 0.12, 25.6), islandMat);
        island.position.set(ix, 0.06, -36);
        roadsGroup.add(island);
    });
    // Parking lines array (white stalls)
    const lineMat = new THREE.MeshBasicMaterial({ color: '#ffffff' });
    const pStallGeo = new THREE.BoxGeometry(2.4, 0.01, 4.8);
    const parkingLinesGroup = new THREE.Group();
    parkingLinesGroup.name = 'ParkingLines_Array';
    roadsGroup.add(parkingLinesGroup);
    // Grid of parking lines
    [-9.5, -1.8].forEach((gx) => {
        for (let rz = -46; rz <= -26; rz += 2.8) {
            const line = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.01, 4.6), lineMat);
            line.position.set(gx, 0.03, rz);
            parkingLinesGroup.add(line);
        }
    });
    objectsMeta.push(tagObject(parkingMesh, {
        id: 'parking-central-north',
        name: 'Parking_Central_North (中央生态智慧停车场)',
        collection: '01_Roads',
        type: 'Mesh / Landscaped Parking Lot',
        dimensions: { x: 25, y: 0.02, z: 32 },
        position: { x: -5.5, y: 0.015, z: -36 },
        materialName: 'Mat_Asphalt_Road & Green Curbs',
        materialColor: '#334155',
        roughness: 0.92,
        description: '北侧中央停车场 (25m × 32m)，配置 3 组绿化隔离岛与标准停车位阵列',
    }));
    // ==========================================
    // STAGE 5: 03_Wall_Gate Perimeter Walls (2.5m height, 0.24m thickness)
    // ==========================================
    const wallMat = new THREE.MeshStandardMaterial({
        color: '#e0e0e0',
        roughness: 0.8,
    });
    // North wall: 120m long at Z = -50
    const wallNorthGeo = new THREE.BoxGeometry(120, 2.5, 0.24);
    const wallNorth = new THREE.Mesh(wallNorthGeo, wallMat);
    wallNorth.position.set(0, 1.25, -50);
    wallNorth.castShadow = true;
    wallNorth.name = 'Wall_North';
    wallGroup.add(wallNorth);
    objectsMeta.push(tagObject(wallNorth, {
        id: 'wall-north',
        name: 'Wall_North',
        collection: '03_Wall_Gate',
        type: 'Mesh / Wall',
        dimensions: { x: 120, y: 2.5, z: 0.24 },
        position: { x: 0, y: 1.25, z: -50 },
        materialName: 'Mat_Wall_White',
        materialColor: '#E0E0E0',
        roughness: 0.8,
        description: '北侧封闭围墙 (长 120m，高 2.5m，厚 0.24m)',
    }));
    // East wall: 100m long at X = 60
    const wallEastGeo = new THREE.BoxGeometry(0.24, 2.5, 100);
    const wallEast = new THREE.Mesh(wallEastGeo, wallMat);
    wallEast.position.set(60, 1.25, 0);
    wallEast.castShadow = true;
    wallEast.name = 'Wall_East';
    wallGroup.add(wallEast);
    objectsMeta.push(tagObject(wallEast, {
        id: 'wall-east',
        name: 'Wall_East',
        collection: '03_Wall_Gate',
        type: 'Mesh / Wall',
        dimensions: { x: 0.24, y: 2.5, z: 100 },
        position: { x: 60, y: 1.25, z: 0 },
        materialName: 'Mat_Wall_White',
        materialColor: '#E0E0E0',
        roughness: 0.8,
        description: '东侧围墙 (长 100m，高 2.5m，厚 0.24m)',
    }));
    // West wall: 100m long at X = -60
    const wallWestGeo = new THREE.BoxGeometry(0.24, 2.5, 100);
    const wallWest = new THREE.Mesh(wallWestGeo, wallMat);
    wallWest.position.set(-60, 1.25, 0);
    wallWest.castShadow = true;
    wallWest.name = 'Wall_West';
    wallGroup.add(wallWest);
    objectsMeta.push(tagObject(wallWest, {
        id: 'wall-west',
        name: 'Wall_West',
        collection: '03_Wall_Gate',
        type: 'Mesh / Wall',
        dimensions: { x: 0.24, y: 2.5, z: 100 },
        position: { x: -60, y: 1.25, z: 0 },
        materialName: 'Mat_Wall_White',
        materialColor: '#E0E0E0',
        roughness: 0.8,
        description: '西侧围墙 (长 100m，高 2.5m，厚 0.24m)',
    }));
    // South wall with 10m gap in middle (X: -5 to +5)
    // South West piece: length 55m (-60 to -5), center X = -32.5
    const wallSWGeo = new THREE.BoxGeometry(55, 2.5, 0.24);
    const wallSW = new THREE.Mesh(wallSWGeo, wallMat);
    wallSW.position.set(-32.5, 1.25, 50);
    wallSW.castShadow = true;
    wallSW.name = 'Wall_South_West';
    wallGroup.add(wallSW);
    // South East piece: length 55m (+5 to 60), center X = 32.5
    const wallSEGeo = new THREE.BoxGeometry(55, 2.5, 0.24);
    const wallSE = new THREE.Mesh(wallSEGeo, wallMat);
    wallSE.position.set(32.5, 1.25, 50);
    wallSE.castShadow = true;
    wallSE.name = 'Wall_South_East';
    wallGroup.add(wallSE);
    objectsMeta.push({
        id: 'wall-south',
        name: 'Wall_South (含 10m 大门缺口)',
        collection: '03_Wall_Gate',
        type: 'Mesh / Wall with Cutout',
        dimensions: { x: 120, y: 2.5, z: 0.24 },
        position: { x: 0, y: 1.25, z: 50 },
        materialName: 'Mat_Wall_White',
        materialColor: '#E0E0E0',
        roughness: 0.8,
        tris: 48,
        description: '南侧主围墙，正中扣除 10m 进出大门通行缺口',
    });
    // Gate Posts: GatePost_East & West (0.6m x 0.6m x 3.0m)
    const postGeo = new THREE.BoxGeometry(0.6, 3.0, 0.6);
    const postMat = new THREE.MeshStandardMaterial({ color: '#475569', roughness: 0.5 });
    const postEast = new THREE.Mesh(postGeo, postMat);
    postEast.position.set(5.3, 1.5, 50);
    postEast.name = 'GatePost_East';
    wallGroup.add(postEast);
    const postWest = new THREE.Mesh(postGeo, postMat);
    postWest.position.set(-5.3, 1.5, 50);
    postWest.name = 'GatePost_West';
    wallGroup.add(postWest);
    // Electric barrier gate (10m x 0.15m x 1.2m)
    const gateArmGeo = new THREE.BoxGeometry(10.0, 0.2, 0.1);
    const gateArmMat = new THREE.MeshStandardMaterial({ color: '#ef4444', roughness: 0.4 });
    const gateArm = new THREE.Mesh(gateArmGeo, gateArmMat);
    gateArm.position.set(0, 1.2, 50);
    gateArm.name = 'Electric_Barrier_Gate';
    wallGroup.add(gateArm);
    objectsMeta.push({
        id: 'gate-structure',
        name: 'GatePost & Barrier Gate',
        collection: '03_Wall_Gate',
        type: 'Station Gate Assembly',
        dimensions: { x: 11.2, y: 3.0, z: 0.6 },
        position: { x: 0, y: 1.5, z: 50 },
        materialName: 'Mat_Gate_Metal',
        materialColor: '#475569',
        roughness: 0.5,
        tris: 36,
        description: '东/西侧花岗岩立柱与 10m 电动红白防撞道闸',
    });
    // ==========================================
    // STAGE 7: 02_Buildings Main Office Building (Build_Office_Main)
    // 30m x 15m x 10m, Folded geometry, Glass curtain, windows, entrance, roof overhang
    // ==========================================
    const officeGroup = new THREE.Group();
    officeGroup.name = 'Build_Office_Main';
    officeGroup.position.set(-32, 0, -37); // Northwest corner as per aerial reference image
    buildingsGroup.add(officeGroup);
    // Main folded building mass (2 parts: Front main block 22m x 15m x 10m + East wing 10m x 12m x 9m)
    const officeWallMat = new THREE.MeshStandardMaterial({
        color: '#e2e8f0',
        roughness: 0.75,
    });
    const glassMat = new THREE.MeshStandardMaterial({
        color: '#38bdf8',
        roughness: 0.1,
        metalness: 0.9,
        transparent: true,
        opacity: 0.85,
    });
    const roofMat = new THREE.MeshStandardMaterial({
        color: '#555555',
        roughness: 0.6,
    });
    const entrancePortalMat = new THREE.MeshStandardMaterial({
        color: '#2a2a2a',
        roughness: 0.5,
    });
    // Base Block A: 20m (X) x 10m (Y) x 15m (Z)
    const blockAGeo = new THREE.BoxGeometry(20, 10, 15);
    const blockA = new THREE.Mesh(blockAGeo, officeWallMat);
    blockA.position.set(-5, 5, 0);
    blockA.castShadow = true;
    blockA.receiveShadow = true;
    officeGroup.add(blockA);
    // Setback Block B (Folded wing): 12m x 9m x 11m
    const blockBGeo = new THREE.BoxGeometry(12, 9, 11);
    const blockB = new THREE.Mesh(blockBGeo, officeWallMat);
    blockB.position.set(10, 4.5, -2);
    blockB.castShadow = true;
    blockB.receiveShadow = true;
    officeGroup.add(blockB);
    // Roof Overhang & Single Pitch Parapet
    const roofAGeo = new THREE.BoxGeometry(21.5, 0.6, 16.5);
    const roofA = new THREE.Mesh(roofAGeo, roofMat);
    roofA.position.set(-5, 10.3, 0);
    roofA.castShadow = true;
    officeGroup.add(roofA);
    const roofBGeo = new THREE.BoxGeometry(13, 0.5, 12);
    const roofB = new THREE.Mesh(roofBGeo, roofMat);
    roofB.position.set(10, 9.25, -2);
    roofB.castShadow = true;
    officeGroup.add(roofB);
    // Glass Curtain Wall on south-facing facade (Step 33)
    const glassWallGeo = new THREE.BoxGeometry(12, 7.5, 0.4);
    const glassWall = new THREE.Mesh(glassWallGeo, glassMat);
    glassWall.position.set(-4, 5.5, 7.55);
    officeGroup.add(glassWall);
    // Mullions grid for glass curtain wall
    const mullionMat = new THREE.MeshStandardMaterial({ color: '#1e293b', roughness: 0.3 });
    for (let m = -5; m <= 5; m += 2.5) {
        const vMullion = new THREE.Mesh(new THREE.BoxGeometry(0.1, 7.5, 0.45), mullionMat);
        vMullion.position.set(-4 + m, 5.5, 7.56);
        officeGroup.add(vMullion);
    }
    for (let h = 3; h <= 8; h += 2.5) {
        const hMullion = new THREE.Mesh(new THREE.BoxGeometry(12, 0.1, 0.45), mullionMat);
        hMullion.position.set(-4, h, 7.56);
        officeGroup.add(hMullion);
    }
    // Windows array on other facades (Step 34: 1.5m x 1.2m glass windows)
    const winGeo = new THREE.BoxGeometry(1.5, 1.2, 0.1);
    for (let floor = 1; floor <= 3; floor++) {
        const yPos = floor * 2.8;
        for (let w = -4; w <= 3; w += 2.5) {
            const winE = new THREE.Mesh(winGeo, glassMat);
            winE.position.set(16.05, yPos, w);
            winE.rotateY(Math.PI / 2);
            officeGroup.add(winE);
        }
        for (let w = -12; w <= -1; w += 3.2) {
            const winN = new THREE.Mesh(winGeo, glassMat);
            winN.position.set(w, yPos, -7.55);
            officeGroup.add(winN);
        }
    }
    // Main Entrance Portal (Step 35: 4m x 3m recessed, dark #2A2A2A)
    const portalGeo = new THREE.BoxGeometry(4.5, 3.2, 1.2);
    const portal = new THREE.Mesh(portalGeo, entrancePortalMat);
    portal.position.set(6, 1.6, 7.6);
    portal.castShadow = true;
    officeGroup.add(portal);
    const doorGlassGeo = new THREE.BoxGeometry(3.6, 2.4, 0.2);
    const doorGlass = new THREE.Mesh(doorGlassGeo, glassMat);
    doorGlass.position.set(6, 1.4, 8.1);
    officeGroup.add(doorGlass);
    objectsMeta.push({
        id: 'build-office-main',
        name: 'Build_Office_Main',
        collection: '02_Buildings',
        type: 'Complex Mesh / Building',
        dimensions: { x: 30, y: 10, z: 15 },
        position: { x: -32, y: 5, z: -37 },
        materialName: 'Multi-Material (White Wall, Glass Blue #4A90D9, Dark Portal #2A2A2A)',
        materialColor: '#38BDF8',
        roughness: 0.1,
        metallic: 0.9,
        tris: 420,
        description: '西北主综合办公楼：折线造型、高透反射玻璃幕墙、采光窗洞与挑檐斜顶',
    });
    // Northeast Twin Mega Factories (Matching reference image)
    const indusWallMat = new THREE.MeshStandardMaterial({ color: '#f1f5f9', roughness: 0.7 });
    const indusRoofMat = new THREE.MeshStandardMaterial({ color: '#94a3b8', roughness: 0.6 });
    const twinFactoryData = [
        { id: 'build-mega-n', name: 'Build_Mega_Factory_North', x: 26.5, z: -45 },
        { id: 'build-mega-s', name: 'Build_Mega_Factory_South', x: 26.5, z: -23 },
    ];
    twinFactoryData.forEach((fac) => {
        const fGroup = new THREE.Group();
        fGroup.position.set(fac.x, 0, fac.z);
        fGroup.name = fac.name;
        buildingsGroup.add(fGroup);
        const fBody = new THREE.Mesh(new THREE.BoxGeometry(31, 8, 18), indusWallMat);
        fBody.position.set(0, 4, 0);
        fBody.castShadow = true;
        fBody.receiveShadow = true;
        fGroup.add(fBody);
        const fRoof = new THREE.Mesh(new THREE.BoxGeometry(31.8, 0.4, 18.6), indusRoofMat);
        fRoof.position.set(0, 8.2, 0);
        fGroup.add(fRoof);
        // Skylight strip on roof
        const fSky = new THREE.Mesh(new THREE.BoxGeometry(26, 0.15, 4), glassMat);
        fSky.position.set(0, 8.45, 0);
        fGroup.add(fSky);
    });
    // Far East Warehouse (10m x 26m x 5.5m at X = 50, Z = -32)
    const eastWh = new THREE.Mesh(new THREE.BoxGeometry(10, 5.5, 26), indusWallMat);
    eastWh.position.set(50, 2.75, -32);
    eastWh.castShadow = true;
    eastWh.name = 'Build_Warehouse_East';
    buildingsGroup.add(eastWh);
    // Southeast Mega Factory (42m x 16m x 7.5m at X = 32.5, Z = 49)
    const seFac = new THREE.Mesh(new THREE.BoxGeometry(42, 7.5, 16), indusWallMat);
    seFac.position.set(32.5, 3.75, 49);
    seFac.castShadow = true;
    seFac.name = 'Build_Factory_South_East';
    buildingsGroup.add(seFac);
    // West 3 Parallel Standard Industrial Workshops (14m x 6m x 5.5m at X = -35)
    [3, 13, 23].forEach((wz, wi) => {
        const wFac = new THREE.Mesh(new THREE.BoxGeometry(14, 5.5, 6), indusWallMat);
        wFac.position.set(-35, 2.75, wz);
        wFac.castShadow = true;
        wFac.name = `Build_Workshop_West_0${wi + 1}`;
        buildingsGroup.add(wFac);
        // Industrial rollup door
        const door = new THREE.Mesh(new THREE.BoxGeometry(0.1, 3.5, 3.2), new THREE.MeshStandardMaterial({ color: '#64748b' }));
        door.position.set(-27.9, 1.75, wz);
        buildingsGroup.add(door);
    });
    // East Landscape Park Pavilion Houses (X = 22, Z = 14 and X = 46, Z = 8)
    const pav1 = new THREE.Mesh(new THREE.BoxGeometry(7, 3.5, 4.5), indusWallMat);
    pav1.position.set(22, 1.75, 14);
    pav1.castShadow = true;
    pav1.name = 'Build_Park_Pavilion_01';
    buildingsGroup.add(pav1);
    const pav2 = new THREE.Mesh(new THREE.BoxGeometry(4.5, 3.5, 9), indusWallMat);
    pav2.position.set(46, 1.75, 8);
    pav2.castShadow = true;
    pav2.name = 'Build_Park_Pavilion_02';
    buildingsGroup.add(pav2);
    // ==========================================
    // STAGE 8: 02_Buildings Substation & ESS Battery Station System (Reference Image Layout)
    // - 1 Modular Concrete Equipment Yard Pad (46m x 40m x 0.12m)
    // - 4 Units 35kV/10kV Outdoor Step-up Transformers (Oil-immersed with radiators, bushings, conservators)
    // - 4 Units 1250kW Grid-Connection & Inverter Cabinets (Yellow warning signage, HMI screens, cable chambers)
    // - 14 Units Modular Outdoor ESS Battery Cabinets (3 Rows: 6 Back + 5 Mid + 3 Front)
    // - Glowing Cyan Bus / Cable Trench Network (35kV/10kV illuminated power collector)
    // - Auxiliary Buildings (Long Control Room with Skylight + South Utility Cabin)
    // - North Perimeter Scenic Water Canal (Stone banks & water surface)
    // ==========================================
    // Equipment Yard Foundation Pad (39m x 27m x 0.12m) at X = -4.5, Z = 12.5 (Matching reference image)
    const yardPadMat = new THREE.MeshStandardMaterial({
        color: '#e2e8f0',
        roughness: 0.85,
        metalness: 0.1,
    });
    const yardPadGeo = new THREE.BoxGeometry(39, 0.12, 27);
    const yardPad = new THREE.Mesh(yardPadGeo, yardPadMat);
    yardPad.position.set(-4.5, 0.06, 12.5);
    yardPad.receiveShadow = true;
    yardPad.name = 'Equipment_Yard_Pad';
    buildingsGroup.add(yardPad);
    // Yard concrete expansion joint seams (grid lines)
    const seamMat = new THREE.MeshBasicMaterial({ color: '#94a3b8' });
    for (let sx = -22; sx <= 14; sx += 6) {
        const seamX = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.01, 26.6), seamMat);
        seamX.position.set(sx, 0.125, 12.5);
        buildingsGroup.add(seamX);
    }
    for (let sz = 1; sz <= 24; sz += 5) {
        const seamZ = new THREE.Mesh(new THREE.BoxGeometry(38.6, 0.01, 0.04), seamMat);
        seamZ.position.set(-4.5, 0.125, sz);
        buildingsGroup.add(seamZ);
    }
    objectsMeta.push(tagObject(yardPad, {
        id: 'equipment-yard-pad',
        name: 'Equipment_Yard_Pad (变电与储能设备混凝土地坪)',
        collection: '02_Buildings',
        type: 'Industrial Concrete Pad',
        dimensions: { x: 39, y: 0.12, z: 27 },
        position: { x: -4.5, y: 0.06, z: 12.5 },
        materialName: 'Mat_Reinforced_Concrete',
        materialColor: '#E2E8F0',
        roughness: 0.85,
        description: '39m × 27m 重型抗振混凝土设备基底地坪，表面配置抗滑耐磨涂层与分缝接缝',
    }));
    // ----------------------------------------------------
    // 1. Four Units 35kV/10kV Step-up Main Transformers (南侧前排 4 座主变压器)
    // ----------------------------------------------------
    const transformerPositions = [
        { id: 'substation-xfmr-01', name: 'Substation_Transformer_01 (1# 主变 35kV)', x: -18, z: 20 },
        { id: 'substation-xfmr-02', name: 'Substation_Transformer_02 (2# 主变 35kV)', x: -8, z: 20 },
        { id: 'substation-xfmr-03', name: 'Substation_Transformer_03 (3# 主变 35kV)', x: 2, z: 20 },
        { id: 'substation-xfmr-04', name: 'Substation_Transformer_04 (4# 主变 35kV)', x: 11, z: 20 },
    ];
    // Transformer shared materials
    const xfmrTankMat = new THREE.MeshStandardMaterial({
        color: '#64748b', // industrial slate steel
        roughness: 0.45,
        metalness: 0.65,
    });
    const xfmrFinMat = new THREE.MeshStandardMaterial({
        color: '#475569',
        roughness: 0.5,
        metalness: 0.5,
    });
    const xfmrConservatorMat = new THREE.MeshStandardMaterial({
        color: '#94a3b8',
        roughness: 0.4,
        metalness: 0.6,
    });
    const xfmrBushingMat = new THREE.MeshStandardMaterial({
        color: '#b45309', // terracotta ceramic insulator
        roughness: 0.3,
    });
    const xfmrTerminalMat = new THREE.MeshStandardMaterial({
        color: '#f59e0b', // brass/copper terminal
        roughness: 0.2,
        metalness: 0.9,
    });
    const warningPlateMat = new THREE.MeshBasicMaterial({ color: '#facc15' });
    transformerPositions.forEach((tp, idx) => {
        const xfmrGroup = new THREE.Group();
        xfmrGroup.position.set(tp.x, 0.12, tp.z);
        xfmrGroup.name = tp.name;
        buildingsGroup.add(xfmrGroup);
        // Structural steel chassis skid / I-beam base
        const baseGeo = new THREE.BoxGeometry(4.2, 0.25, 3.4);
        const baseMesh = new THREE.Mesh(baseGeo, new THREE.MeshStandardMaterial({ color: '#1e293b', roughness: 0.6 }));
        baseMesh.position.set(0, 0.125, 0);
        xfmrGroup.add(baseMesh);
        // Main transformer tank core: 2.8m (W) x 2.2m (H) x 2.2m (D)
        const tankGeo = new THREE.BoxGeometry(2.8, 2.2, 2.2);
        const tankMesh = new THREE.Mesh(tankGeo, xfmrTankMat);
        tankMesh.position.set(0, 1.35, 0);
        tankMesh.castShadow = true;
        tankMesh.receiveShadow = true;
        xfmrGroup.add(tankMesh);
        // Left and Right Radiator Fin Banks (片状散热器排组)
        [-1.75, 1.75].forEach((finX) => {
            const radiatorBank = new THREE.Group();
            radiatorBank.position.set(finX, 1.35, 0);
            // 5 vertical cooling fins
            for (let f = -0.8; f <= 0.8; f += 0.4) {
                const fin = new THREE.Mesh(new THREE.BoxGeometry(0.55, 1.8, 0.08), xfmrFinMat);
                fin.position.set(0, 0, f);
                radiatorBank.add(fin);
            }
            // Top and bottom manifold oil pipes
            const topPipe = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 2.0, 8), xfmrTankMat);
            topPipe.rotation.x = Math.PI / 2;
            topPipe.position.set(0, 0.9, 0);
            radiatorBank.add(topPipe);
            const botPipe = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 2.0, 8), xfmrTankMat);
            botPipe.rotation.x = Math.PI / 2;
            botPipe.position.set(0, -0.9, 0);
            radiatorBank.add(botPipe);
            xfmrGroup.add(radiatorBank);
        });
        // Horizontal Oil Conservator Tank (储油柜/油枕)
        const conservatorGeo = new THREE.CylinderGeometry(0.32, 0.32, 2.6, 12);
        conservatorGeo.rotateZ(Math.PI / 2);
        const conservatorMesh = new THREE.Mesh(conservatorGeo, xfmrConservatorMat);
        conservatorMesh.position.set(0, 2.85, -0.6);
        conservatorMesh.castShadow = true;
        xfmrGroup.add(conservatorMesh);
        // Connecting pipe to tank
        const cPipe = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, 0.5, 8), xfmrTankMat);
        cPipe.position.set(0, 2.55, -0.6);
        xfmrGroup.add(cPipe);
        // High & Low Voltage Ceramic Bushings (高压/低压瓷套管阵列)
        [-0.9, -0.3, 0.3, 0.9].forEach((bx) => {
            const bGroup = new THREE.Group();
            bGroup.position.set(bx, 2.45, 0.4);
            const insulator = new THREE.Mesh(new THREE.CylinderGeometry(0.09, 0.13, 0.7, 8), xfmrBushingMat);
            insulator.position.y = 0.35;
            bGroup.add(insulator);
            const terminal = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 0.2, 8), xfmrTerminalMat);
            terminal.position.y = 0.8;
            bGroup.add(terminal);
            xfmrGroup.add(bGroup);
        });
        [-0.6, 0, 0.6].forEach((bx) => {
            const bGroup = new THREE.Group();
            bGroup.position.set(bx, 2.45, -0.2);
            const insulator = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.1, 0.5, 8), xfmrBushingMat);
            insulator.position.y = 0.25;
            bGroup.add(insulator);
            const terminal = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 0.15, 8), xfmrTerminalMat);
            terminal.position.y = 0.58;
            bGroup.add(terminal);
            xfmrGroup.add(bGroup);
        });
        // Yellow warning triangle nameplate on front
        const plate = new THREE.Mesh(new THREE.PlaneGeometry(0.5, 0.4), warningPlateMat);
        plate.position.set(0, 1.4, 1.11);
        xfmrGroup.add(plate);
        const xfmrMeta = {
            id: tp.id,
            name: tp.name,
            collection: '02_Buildings',
            type: 'Outdoor Power Transformer (35kV/10kV)',
            dimensions: { x: 4.4, y: 3.6, z: 3.4 },
            position: { x: tp.x, y: 1.8, z: tp.z },
            materialName: 'Mat_Transformer_Steel & Ceramic Bushings',
            materialColor: '#64748B',
            roughness: 0.45,
            metallic: 0.65,
            tris: 180,
            description: `${idx + 1}# 35kV/10kV 12500kVA (12.5MVA) 三相油浸式全密封电力变压器，配置两侧片状散热器排、高压瓷套管与储油柜`,
        };
        xfmrGroup.userData = xfmrMeta;
        tankMesh.userData = xfmrMeta;
        objectsMeta.push(xfmrMeta);
    });
    // ----------------------------------------------------
    // 2. Four Units 10kV Grid-Connection Switchgear Cabinets (中排 4 台 10kV 高压并网开关柜)
    // EXACT MATCH TO USER REFERENCE IMAGES:
    // - Top Door: 10kV yellow badge, digital protection relay screen, meter, 3x3 pilot ports, 4 red buttons, crank socket
    // - Middle Door: Clear glass window with recessed chamber, 6 curved black cables fanning out to 6 termination blocks, side linkage levers
    // - Bottom Door: "开关柜" yellow badge, vertical inspection window, high voltage warning triangle with red lightning bolt
    // - Base: Recessed plinth with left/right forklift pockets and center grounding terminal
    // - Top: Dual lifting eyebolts
    // ----------------------------------------------------
    const gridCabinetPositions = [
        { id: 'grid-cab-01', name: 'Grid_Cabinet_01 (1# 10kV高压并网开关柜)', x: -18, z: 10.5 },
        { id: 'grid-cab-02', name: 'Grid_Cabinet_02 (2# 10kV高压并网开关柜)', x: -8, z: 10.5 },
        { id: 'grid-cab-03', name: 'Grid_Cabinet_03 (3# 10kV高压并网开关柜)', x: 2, z: 10.5 },
        { id: 'grid-cab-04', name: 'Grid_Cabinet_04 (4# 10kV高压并网开关柜)', x: 11, z: 10.5 },
    ];
    // Procedural Textures from Canvas
    const topDoorTex = createSwitchgearTopDoorTexture();
    const bottomDoorTex = createSwitchgearBottomDoorTexture();
    // Shared Materials
    const sgBodyMat = new THREE.MeshStandardMaterial({
        color: '#f1f5f9',
        roughness: 0.35,
        metalness: 0.25,
    });
    const sgPlinthMat = new THREE.MeshStandardMaterial({
        color: '#94a3b8',
        roughness: 0.7,
        metalness: 0.2,
    });
    const sgTopDoorMat = new THREE.MeshStandardMaterial({
        map: topDoorTex,
        roughness: 0.35,
        metalness: 0.2,
    });
    const sgBottomDoorMat = new THREE.MeshStandardMaterial({
        map: bottomDoorTex,
        roughness: 0.35,
        metalness: 0.2,
    });
    const sgGlassMat = new THREE.MeshStandardMaterial({
        color: '#ffffff',
        transparent: true,
        opacity: 0.35,
        roughness: 0.1,
        metalness: 0.1,
    });
    const sgChamberMat = new THREE.MeshStandardMaterial({
        color: '#64748b',
        roughness: 0.6,
    });
    const sgCableMat = new THREE.MeshStandardMaterial({
        color: '#18181b',
        roughness: 0.45,
    });
    const sgTermMat = new THREE.MeshStandardMaterial({
        color: '#f8fafc',
        roughness: 0.25,
    });
    const sgHandleMat = new THREE.MeshStandardMaterial({
        color: '#1e293b',
        roughness: 0.35,
    });
    const sgMetalMat = new THREE.MeshStandardMaterial({
        color: '#e2e8f0',
        metalness: 0.8,
        roughness: 0.25,
    });
    const sgRedButtonMat = new THREE.MeshStandardMaterial({
        color: '#dc2626',
        roughness: 0.2,
        metalness: 0.1,
    });
    const sgDarkRecessMat = new THREE.MeshBasicMaterial({ color: '#0f172a' });
    // Reusable door handle builder
    const createHandleMesh = () => {
        const hGroup = new THREE.Group();
        // Grip
        const grip = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.22, 0.035), sgHandleMat);
        hGroup.add(grip);
        // Keyhole lock
        const lock = new THREE.Mesh(new THREE.CylinderGeometry(0.009, 0.009, 0.012, 16), sgMetalMat);
        lock.rotation.x = Math.PI / 2;
        lock.position.set(0, -0.06, 0.018);
        hGroup.add(lock);
        return hGroup;
    };
    // Reusable lifting eye-bolt builder
    const createLiftingLugMesh = () => {
        const lugGroup = new THREE.Group();
        const base = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.015, 0.06), sgMetalMat);
        lugGroup.add(base);
        const ring = new THREE.Mesh(new THREE.TorusGeometry(0.045, 0.01, 10, 20), sgMetalMat);
        ring.position.set(0, 0.05, 0);
        lugGroup.add(ring);
        return lugGroup;
    };
    gridCabinetPositions.forEach((gp, idx) => {
        const cabGroup = new THREE.Group();
        cabGroup.position.set(gp.x, 0.12, gp.z);
        cabGroup.name = gp.name;
        buildingsGroup.add(cabGroup);
        // 1. Concrete Base Plinth (1.4m W x 0.16m H x 1.5m D)
        const plinth = new THREE.Mesh(new THREE.BoxGeometry(1.4, 0.16, 1.5), sgPlinthMat);
        plinth.position.set(0, 0.08, 0);
        cabGroup.add(plinth);
        // Forklift / ventilation pockets in plinth
        const pocketL = new THREE.Mesh(new THREE.BoxGeometry(0.36, 0.08, 0.05), sgDarkRecessMat);
        pocketL.position.set(-0.38, 0.08, 0.752);
        cabGroup.add(pocketL);
        const pocketR = new THREE.Mesh(new THREE.BoxGeometry(0.36, 0.08, 0.05), sgDarkRecessMat);
        pocketR.position.set(0.38, 0.08, 0.752);
        cabGroup.add(pocketR);
        // Grounding earthing stud
        const groundPlate = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.06, 0.04), sgMetalMat);
        groundPlate.position.set(0, 0.06, 0.752);
        cabGroup.add(groundPlate);
        const groundBolt = new THREE.Mesh(new THREE.CylinderGeometry(0.012, 0.012, 0.02, 8), new THREE.MeshStandardMaterial({ color: '#b45309', roughness: 0.3, metalness: 0.7 }));
        groundBolt.rotation.x = Math.PI / 2;
        groundBolt.position.set(0, 0.06, 0.774);
        cabGroup.add(groundBolt);
        // 2. Main Switchgear Cabinet Body: 1.4m (W) x 2.69m (H) x 1.5m (D)
        const body = new THREE.Mesh(new THREE.BoxGeometry(1.4, 2.69, 1.5), sgBodyMat);
        body.position.set(0, 1.505, 0);
        body.castShadow = true;
        body.receiveShadow = true;
        cabGroup.add(body);
        // 3. Top Roof Overhang Plate (1.44m x 0.04m x 1.54m)
        const roof = new THREE.Mesh(new THREE.BoxGeometry(1.44, 0.04, 1.54), sgBodyMat);
        roof.position.set(0, 2.87, 0);
        cabGroup.add(roof);
        // Top Lifting Eyebolts (吊耳)
        const lugL = createLiftingLugMesh();
        lugL.position.set(-0.56, 2.89, 0.65);
        cabGroup.add(lugL);
        const lugR = createLiftingLugMesh();
        lugR.position.set(0.56, 2.89, 0.65);
        cabGroup.add(lugR);
        // 4. Horizontal Door Seam Separators (Dark shadow gaps)
        const seam1 = new THREE.Mesh(new THREE.BoxGeometry(1.38, 0.015, 0.02), sgDarkRecessMat);
        seam1.position.set(0, 1.02, 0.753);
        cabGroup.add(seam1);
        const seam2 = new THREE.Mesh(new THREE.BoxGeometry(1.38, 0.015, 0.02), sgDarkRecessMat);
        seam2.position.set(0, 1.96, 0.753);
        cabGroup.add(seam2);
        // 5. Top Door Compartment (Y: 1.98 to 2.85, height 0.87m)
        // Relay protection, 10kV badge, meters, buttons & rotary handle
        const topDoor = new THREE.Mesh(new THREE.PlaneGeometry(1.36, 0.87), sgTopDoorMat);
        topDoor.position.set(0, 2.415, 0.752);
        cabGroup.add(topDoor);
        // 4 Real 3D Red Push-Buttons protruding from panel
        [-0.03, 0.10, 0.23, 0.36].forEach((bx) => {
            const bezel = new THREE.Mesh(new THREE.CylinderGeometry(0.028, 0.028, 0.01, 16), sgMetalMat);
            bezel.rotation.x = Math.PI / 2;
            bezel.position.set(bx, 2.42, 0.758);
            cabGroup.add(bezel);
            const btn = new THREE.Mesh(new THREE.CylinderGeometry(0.022, 0.022, 0.012, 16), sgRedButtonMat);
            btn.rotation.x = Math.PI / 2;
            btn.position.set(bx, 2.42, 0.764);
            cabGroup.add(btn);
        });
        // 3D Circular Manual Operating Handle Socket
        const crankBezel = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.07, 0.012, 24), sgMetalMat);
        crankBezel.rotation.x = Math.PI / 2;
        crankBezel.position.set(0, 2.21, 0.758);
        cabGroup.add(crankBezel);
        const crankHole = new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.035, 0.015, 16), sgDarkRecessMat);
        crankHole.rotation.x = Math.PI / 2;
        crankHole.position.set(0, 2.21, 0.762);
        cabGroup.add(crankHole);
        // Top Door Handle on Left
        const handleTop = createHandleMesh();
        handleTop.position.set(-0.58, 2.42, 0.768);
        cabGroup.add(handleTop);
        // 6. Middle Door Compartment (Y: 1.04 to 1.96, height 0.92m)
        // Observation chamber with 6 fanned cables, termination blocks & linkage levers
        // Door border frame around window
        const frameTop = new THREE.Mesh(new THREE.BoxGeometry(1.36, 0.12, 0.02), sgBodyMat);
        frameTop.position.set(0, 1.90, 0.752);
        cabGroup.add(frameTop);
        const frameBottom = new THREE.Mesh(new THREE.BoxGeometry(1.36, 0.12, 0.02), sgBodyMat);
        frameBottom.position.set(0, 1.08, 0.752);
        cabGroup.add(frameBottom);
        const frameLeft = new THREE.Mesh(new THREE.BoxGeometry(0.20, 0.70, 0.02), sgBodyMat);
        frameLeft.position.set(-0.58, 1.49, 0.752);
        cabGroup.add(frameLeft);
        const frameRight = new THREE.Mesh(new THREE.BoxGeometry(0.20, 0.70, 0.02), sgBodyMat);
        frameRight.position.set(0.58, 1.49, 0.752);
        cabGroup.add(frameRight);
        // Transparent Glass Pane
        const windowGlass = new THREE.Mesh(new THREE.BoxGeometry(0.96, 0.68, 0.008), sgGlassMat);
        windowGlass.position.set(0, 1.49, 0.752);
        cabGroup.add(windowGlass);
        // Middle Door Handle on Left
        const handleMid = createHandleMesh();
        handleMid.position.set(-0.58, 1.49, 0.768);
        cabGroup.add(handleMid);
        // Recessed Observation Chamber Interior (Depth 0.44m inwards)
        const chamberBack = new THREE.Mesh(new THREE.BoxGeometry(0.96, 0.86, 0.02), sgChamberMat);
        chamberBack.position.set(0, 1.49, 0.32);
        cabGroup.add(chamberBack);
        const chamberFloor = new THREE.Mesh(new THREE.BoxGeometry(0.96, 0.02, 0.44), sgChamberMat);
        chamberFloor.position.set(0, 1.05, 0.54);
        cabGroup.add(chamberFloor);
        const chamberCeil = new THREE.Mesh(new THREE.BoxGeometry(0.96, 0.02, 0.44), sgChamberMat);
        chamberCeil.position.set(0, 1.93, 0.54);
        cabGroup.add(chamberCeil);
        const chamberWallL = new THREE.Mesh(new THREE.BoxGeometry(0.02, 0.86, 0.44), sgChamberMat);
        chamberWallL.position.set(-0.48, 1.49, 0.54);
        cabGroup.add(chamberWallL);
        const chamberWallR = new THREE.Mesh(new THREE.BoxGeometry(0.02, 0.86, 0.44), sgChamberMat);
        chamberWallR.position.set(0.48, 1.49, 0.54);
        cabGroup.add(chamberWallR);
        // Chamber Top Cable Clamp / Rubber Collar
        const cableClamp = new THREE.Mesh(new THREE.CylinderGeometry(0.065, 0.065, 0.08, 16), sgCableMat);
        cableClamp.position.set(0, 1.84, 0.48);
        cabGroup.add(cableClamp);
        const feederTrunk = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 0.10, 16), sgCableMat);
        feederTrunk.position.set(0, 1.91, 0.48);
        cabGroup.add(feederTrunk);
        // 6 Insulator Termination Blocks on Chamber Floor
        const termXs = [-0.27, -0.16, -0.05, 0.05, 0.16, 0.27];
        termXs.forEach((tx) => {
            // Block
            const block = new THREE.Mesh(new THREE.BoxGeometry(0.085, 0.14, 0.10), sgTermMat);
            block.position.set(tx, 1.13, 0.48);
            cabGroup.add(block);
            // Metal contact clip on top
            const clip = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.03, 0.04), sgMetalMat);
            clip.position.set(tx, 1.21, 0.48);
            cabGroup.add(clip);
            // 6 Curved Black Power Cables (Symmetrical Fan Out from top clamp into blocks)
            const curve = new THREE.CatmullRomCurve3([
                new THREE.Vector3(tx * 0.14, 1.83, 0.48),
                new THREE.Vector3(tx * 0.48, 1.62, 0.51),
                new THREE.Vector3(tx * 0.88, 1.36, 0.49),
                new THREE.Vector3(tx, 1.22, 0.48),
            ]);
            const cableTube = new THREE.Mesh(new THREE.TubeGeometry(curve, 18, 0.013, 8, false), sgCableMat);
            cabGroup.add(cableTube);
        });
        // Left & Right Mechanical Guide Linkage Levers
        [-0.38, 0.38].forEach((lx, lIdx) => {
            // Slotted vertical track
            const rail = new THREE.Mesh(new THREE.BoxGeometry(0.035, 0.42, 0.02), sgMetalMat);
            rail.position.set(lx, 1.55, 0.45);
            cabGroup.add(rail);
            // Diagonal linkage arm
            const arm = new THREE.Mesh(new THREE.BoxGeometry(0.02, 0.20, 0.015), sgMetalMat);
            arm.rotation.z = lIdx === 0 ? 0.6 : -0.6;
            arm.position.set(lx + (lIdx === 0 ? 0.05 : -0.05), 1.60, 0.47);
            cabGroup.add(arm);
        });
        // 7. Bottom Door Compartment (Y: 0.16 to 1.02, height 0.86m)
        // "开关柜" yellow badge, vertical inspection window, & high voltage warning triangle
        const bottomDoor = new THREE.Mesh(new THREE.PlaneGeometry(1.36, 0.86), sgBottomDoorMat);
        bottomDoor.position.set(0, 0.58, 0.752);
        cabGroup.add(bottomDoor);
        // Bottom Door Handle on Left
        const handleBottom = createHandleMesh();
        handleBottom.position.set(-0.58, 0.58, 0.768);
        cabGroup.add(handleBottom);
        const gridMeta = {
            id: gp.id,
            name: gp.name,
            collection: '02_Buildings',
            type: '10kV 高压并网开关柜 (KYN28A-12)',
            dimensions: { x: 1.4, y: 2.85, z: 1.5 },
            position: { x: gp.x, y: 1.45, z: gp.z },
            materialName: 'Mat_Switchgear_10kV (RAL 7035)',
            materialColor: '#F1F5F9',
            roughness: 0.35,
            metallic: 0.25,
            tris: 420,
            description: `${idx + 1}# 10kV 高压开关柜 / 逆变并网一体柜 (参考图定制款)，三段门式结构：上部 10kV 继保测控室、中部透明钢化玻璃断路器观察窗(内含6路大截面电缆分流接线端子与导向联锁机构)、下部 10kV 开关室带防触电黄色三角警示标`,
        };
        cabGroup.userData = gridMeta;
        body.userData = gridMeta;
        objectsMeta.push(gridMeta);
    });
    // 8 column X positions uniformly spaced
    const essColXs = [-19.5, -15.2, -10.9, -6.6, -2.3, 2.0, 6.3, 10.6];
    const essCabinets = [];
    // Row 1: North Row (后排 1#~8#) at Z = 1.6
    essColXs.forEach((x, i) => {
        const num = i + 1;
        const numStr = num < 10 ? `0${num}` : `${num}`;
        essCabinets.push({
            id: `ess-cab-${numStr}`,
            name: `ESS_Cabinet_${numStr} (北排 ${num}# SERMATEC 储能柜)`,
            rowName: '北排储能机组 (后排)',
            x,
            z: 1.6,
        });
    });
    // Row 2: South Row (前排 9#~16#) at Z = 5.2
    essColXs.forEach((x, i) => {
        const num = i + 9;
        const numStr = num < 10 ? `0${num}` : `${num}`;
        essCabinets.push({
            id: `ess-cab-${numStr}`,
            name: `ESS_Cabinet_${numStr} (南排 ${num}# SERMATEC 储能柜)`,
            rowName: '南排储能机组 (前排)',
            x,
            z: 5.2,
        });
    });
    // SERMATEC ESS Materials
    const sermatecDoorTex = createSermatecEssDoorTexture();
    const sermatecDoorMat = new THREE.MeshStandardMaterial({
        map: sermatecDoorTex,
        roughness: 0.35,
        metalness: 0.15,
    });
    const sermatecBodyMat = new THREE.MeshStandardMaterial({
        color: '#f1f5f9', // RAL 7035 light grey/white
        roughness: 0.35,
        metalness: 0.2,
    });
    const sermatecPlinthMat = new THREE.MeshStandardMaterial({
        color: '#cbd5e1',
        roughness: 0.8,
    });
    const sermatecDarkMat = new THREE.MeshStandardMaterial({
        color: '#1e293b',
        roughness: 0.6,
    });
    const sermatecMetalMat = new THREE.MeshStandardMaterial({
        color: '#94a3b8',
        roughness: 0.3,
        metalness: 0.8,
    });
    const sermatecRedBtnMat = new THREE.MeshStandardMaterial({
        color: '#dc2626',
        roughness: 0.3,
        metalness: 0.2,
    });
    essCabinets.forEach((ess) => {
        const essGroup = new THREE.Group();
        essGroup.position.set(ess.x, 0.12, ess.z);
        essGroup.name = ess.name;
        buildingsGroup.add(essGroup);
        // 1. Concrete Base Plinth (1.25m W x 0.16m H x 1.45m D)
        const plinth = new THREE.Mesh(new THREE.BoxGeometry(1.25, 0.16, 1.45), sermatecPlinthMat);
        plinth.position.set(0, 0.08, 0);
        essGroup.add(plinth);
        // Forklift pockets on front of plinth
        const pocketL = new THREE.Mesh(new THREE.BoxGeometry(0.28, 0.07, 0.04), sermatecDarkMat);
        pocketL.position.set(-0.32, 0.08, 0.726);
        essGroup.add(pocketL);
        const pocketR = new THREE.Mesh(new THREE.BoxGeometry(0.28, 0.07, 0.04), sermatecDarkMat);
        pocketR.position.set(0.32, 0.08, 0.726);
        essGroup.add(pocketR);
        // Grounding earthing terminal plate & bolt
        const groundPlate = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.05, 0.03), sermatecMetalMat);
        groundPlate.position.set(0, 0.06, 0.726);
        essGroup.add(groundPlate);
        const groundBolt = new THREE.Mesh(new THREE.CylinderGeometry(0.01, 0.01, 0.02, 8), new THREE.MeshStandardMaterial({ color: '#b45309', roughness: 0.3, metalness: 0.7 }));
        groundBolt.rotation.x = Math.PI / 2;
        groundBolt.position.set(0, 0.06, 0.742);
        essGroup.add(groundBolt);
        // 2. Main SERMATEC Cabinet Body (1.25m W x 2.45m H x 1.45m D)
        const cabinetBody = new THREE.Mesh(new THREE.BoxGeometry(1.25, 2.45, 1.45), sermatecBodyMat);
        cabinetBody.position.set(0, 1.385, 0);
        cabinetBody.castShadow = true;
        cabinetBody.receiveShadow = true;
        essGroup.add(cabinetBody);
        // 3. Top Roof Overhang Plate with Bevel (1.27m x 0.04m x 1.47m)
        const topRoof = new THREE.Mesh(new THREE.BoxGeometry(1.27, 0.04, 1.47), sermatecBodyMat);
        topRoof.position.set(0, 2.63, 0);
        essGroup.add(topRoof);
        // 4 Lifting Eyebolts (吊耳: 2 front corners, 2 rear corners)
        const lugFL = createLiftingLugMesh();
        lugFL.position.set(-0.48, 2.65, 0.62);
        essGroup.add(lugFL);
        const lugFR = createLiftingLugMesh();
        lugFR.position.set(0.48, 2.65, 0.62);
        essGroup.add(lugFR);
        const lugRL = createLiftingLugMesh();
        lugRL.position.set(-0.48, 2.65, -0.62);
        essGroup.add(lugRL);
        const lugRR = createLiftingLugMesh();
        lugRR.position.set(0.48, 2.65, -0.62);
        essGroup.add(lugRR);
        // 4. Front Door Panel with High-Resolution SERMATEC Graphics
        const frontDoor = new THREE.Mesh(new THREE.PlaneGeometry(1.23, 2.43), sermatecDoorMat);
        frontDoor.position.set(0, 1.385, 0.727);
        essGroup.add(frontDoor);
        // 5. 3D Industrial Door Handles on Left Door Edge (Upper & Lower)
        const handleUpper = createHandleMesh();
        handleUpper.position.set(-0.52, 1.88, 0.738);
        essGroup.add(handleUpper);
        const handleLower = createHandleMesh();
        handleLower.position.set(-0.52, 0.82, 0.738);
        essGroup.add(handleLower);
        // 6. 3D Emergency Stop Mushroom Button Protrusion
        const eStopBezel = new THREE.Mesh(new THREE.CylinderGeometry(0.032, 0.032, 0.01, 20), sermatecDarkMat);
        eStopBezel.rotation.x = Math.PI / 2;
        eStopBezel.position.set(0.24, 1.68, 0.732);
        essGroup.add(eStopBezel);
        const eStopMushroom = new THREE.Mesh(new THREE.CylinderGeometry(0.024, 0.024, 0.015, 20), sermatecRedBtnMat);
        eStopMushroom.rotation.x = Math.PI / 2;
        eStopMushroom.position.set(0.24, 1.68, 0.74);
        essGroup.add(eStopMushroom);
        // 7. 3D Circular Explosion-Proof Pressure Relief Flanges
        const discTop = new THREE.Mesh(new THREE.CylinderGeometry(0.055, 0.055, 0.008, 24), sermatecMetalMat);
        discTop.rotation.x = Math.PI / 2;
        discTop.position.set(0.24, 2.34, 0.731);
        essGroup.add(discTop);
        const discBot = new THREE.Mesh(new THREE.CylinderGeometry(0.055, 0.055, 0.008, 24), sermatecMetalMat);
        discBot.rotation.x = Math.PI / 2;
        discBot.position.set(0.24, 1.46, 0.731);
        essGroup.add(discBot);
        const essMeta = {
            id: ess.id,
            name: ess.name,
            collection: '02_Buildings',
            type: 'SERMATEC 模块化室外液冷储能电池柜 (215kWh/372kWh)',
            dimensions: { x: 1.25, y: 2.65, z: 1.45 },
            position: { x: ess.x, y: 1.385, z: ess.z },
            materialName: 'Mat_SERMATEC_LiquidCool (RAL 7035)',
            materialColor: '#F1F5F9',
            roughness: 0.35,
            metallic: 0.2,
            tris: 168,
            description: `${ess.name} - SERMATEC 模块化室外液冷储能电池柜 (${ess.rowName})，上下双门结构：上门配置 SERMATEC 品牌标识、双圆形防爆泄压阀盖、三色状态指示灯(电源/运行/蜂鸣器)及急停按钮；下门配置 16 行密集冲孔散热百叶窗与防触电黄色闪电警示标；底座配置双叉车转运槽与接地铜排，顶置起重吊耳。`,
        };
        essGroup.userData = essMeta;
        cabinetBody.userData = essMeta;
        objectsMeta.push(essMeta);
    });
    // ----------------------------------------------------
    // 4. Glowing Cyan Power Bus & Cable Trench Network (双排储能发光汇流电缆沟网络)
    // Perfectly matching the electric blue lines in the reference image
    // ----------------------------------------------------
    const trenchGroup = new THREE.Group();
    trenchGroup.name = 'Cable_Trench_Network';
    buildingsGroup.add(trenchGroup);
    const cyanEmissiveMat = new THREE.MeshStandardMaterial({
        color: '#00e5ff',
        emissive: '#00b4d8',
        emissiveIntensity: 0.95,
        roughness: 0.1,
        metalness: 0.8,
    });
    // 4 Feeders connecting Transformers (Z = 20) straight to Grid Cabinets (Z = 10.5)
    // Only keep the bright cyan emissive power line (no dark outer slab casing)
    const feederSegments = [
        { x1: -18, z1: 20, x2: -18, z2: 10.5 },
        { x1: -8, z1: 20, x2: -8, z2: 10.5 },
        { x1: 2, z1: 20, x2: 2, z2: 10.5 },
        { x1: 11, z1: 20, x2: 11, z2: 10.5 },
    ];
    feederSegments.forEach((seg) => {
        const len = Math.abs(seg.z1 - seg.z2);
        const midZ = (seg.z1 + seg.z2) / 2;
        const glowLine = new THREE.Mesh(new THREE.BoxGeometry(0.22, 0.02, len), cyanEmissiveMat);
        glowLine.position.set(seg.x1, 0.14, midZ);
        trenchGroup.add(glowLine);
    });
    // Dual-Row Collector Trench Network:
    // - Trunk Line 1 at Z = 6.8 (in front of South Row 2)
    // - Trunk Line 2 at Z = 3.4 (aisle between North Row 1 and South Row 2)
    // - Feeders from 4 Grid Cabinets to Trunk Line 1
    // - 8 Longitudinal feeder trenches traversing both rows from Z = 1.6 to Z = 6.8
    const branchLines = [
        // Main collector cross trunk line 1 at Z = 6.8 (X: -20.5 to 11.5)
        { x1: -20.5, z1: 6.8, x2: 11.5, z2: 6.8 },
        // Middle cross trunk line 2 at Z = 3.4 (X: -20.5 to 11.5)
        { x1: -20.5, z1: 3.4, x2: 11.5, z2: 3.4 },
        // Feeders from grid cabinets (Z = 10.5) to trunk line 1 (Z = 6.8)
        { x1: -18, z1: 10.5, x2: -18, z2: 6.8 },
        { x1: -8, z1: 10.5, x2: -8, z2: 6.8 },
        { x1: 2, z1: 10.5, x2: 2, z2: 6.8 },
        { x1: 11, z1: 10.5, x2: 11, z2: 6.8 },
        // 8 Longitudinal branches linking North Row (Z = 1.6) through South Row (Z = 5.2) to Trunk 1 (Z = 6.8)
        ...essColXs.map((x) => ({ x1: x, z1: 1.6, x2: x, z2: 6.8 })),
    ];
    branchLines.forEach((b) => {
        const dx = b.x2 - b.x1;
        const dz = b.z2 - b.z1;
        const len = Math.sqrt(dx * dx + dz * dz);
        const midX = (b.x1 + b.x2) / 2;
        const midZ = (b.z1 + b.z2) / 2;
        const angle = Math.atan2(dx, dz);
        const line = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.02, len), cyanEmissiveMat);
        line.position.set(midX, 0.14, midZ);
        line.rotation.y = angle;
        trenchGroup.add(line);
    });
    objectsMeta.push({
        id: 'cable-trench-network',
        name: 'Cable_Trench_Network (35kV 发光汇流电缆沟网络)',
        collection: '02_Buildings',
        type: 'Electrical Power Bus & Trench',
        dimensions: { x: 34, y: 0.15, z: 20 },
        position: { x: -4.5, y: 0.14, z: 12.5 },
        materialName: 'Mat_Cyan_Luminous_Bus & Trench Slab',
        materialColor: '#00E5FF',
        roughness: 0.1,
        metallic: 0.8,
        tris: 96,
        description: '电站 35kV/10kV 环形高压汇流与并网电缆管沟，呈高亮霓虹蓝发光线条贯通变压器、并网柜与储能机组排',
    });
    // ----------------------------------------------------
    // 5. Auxiliary Buildings (Matching Reference Image)
    // - West side: Long white control building with blue skylight roof (22m x 4.5m x 4m at X = -24, Z = 11)
    // - South gatehouse: (5m x 3.5m x 3m at X = -8, Z = 27)
    // ----------------------------------------------------
    const auxWallMat = new THREE.MeshStandardMaterial({ color: '#f1f5f9', roughness: 0.7 });
    const auxRoofMat = new THREE.MeshStandardMaterial({ color: '#e2e8f0', roughness: 0.6 });
    const skylightMat = new THREE.MeshStandardMaterial({
        color: '#38bdf8',
        roughness: 0.15,
        metalness: 0.85,
        transparent: true,
        opacity: 0.85,
    });
    // Long Control Building on West Side of Equipment Yard (X = -24, Z = 11)
    const ctrlBuilding = new THREE.Group();
    ctrlBuilding.position.set(-24, 0, 11);
    ctrlBuilding.name = 'Build_Control_Main';
    buildingsGroup.add(ctrlBuilding);
    // Main white box: 4.5m (W) x 4.0m (H) x 22m (L)
    const ctrlBody = new THREE.Mesh(new THREE.BoxGeometry(4.5, 4.0, 22), auxWallMat);
    ctrlBody.position.set(0, 2.0, 0);
    ctrlBody.castShadow = true;
    ctrlBody.receiveShadow = true;
    ctrlBuilding.add(ctrlBody);
    // Overhanging roof
    const ctrlRoof = new THREE.Mesh(new THREE.BoxGeometry(5.0, 0.3, 22.6), auxRoofMat);
    ctrlRoof.position.set(0, 4.15, 0);
    ctrlBuilding.add(ctrlRoof);
    // Blue Skylight Glass Panel Array on Roof
    const skylight = new THREE.Mesh(new THREE.BoxGeometry(2.8, 0.1, 18), skylightMat);
    skylight.position.set(0, 4.35, 0);
    ctrlBuilding.add(skylight);
    objectsMeta.push(tagObject(ctrlBody, {
        id: 'build-control-main',
        name: 'Build_Control_Main (场站控制与中继综合配电室)',
        collection: '02_Buildings',
        type: 'Modular Industrial Building',
        dimensions: { x: 5.0, y: 4.3, z: 22.6 },
        position: { x: -24, y: 2.15, z: 11 },
        materialName: 'Mat_Insulated_Panel & Blue Skylight',
        materialColor: '#F1F5F9',
        roughness: 0.7,
        description: '设备区西侧长条形中控综合用房，配备屋顶双坡采光天窗与集中监控机房',
    }));
    // South Gatehouse / Guardroom (X = -8, Z = 27)
    const gatehouse = new THREE.Mesh(new THREE.BoxGeometry(5, 3.0, 3.5), auxWallMat);
    gatehouse.position.set(-8, 1.5, 27);
    gatehouse.castShadow = true;
    gatehouse.name = 'Build_Gatehouse_South';
    buildingsGroup.add(gatehouse);
    const gatehouseRoof = new THREE.Mesh(new THREE.BoxGeometry(5.4, 0.25, 3.9), skylightMat);
    gatehouseRoof.position.set(-8, 3.12, 27);
    buildingsGroup.add(gatehouseRoof);
    // Southwest Ancillary Building (12m x 8m x 4m at X = -38, Z = 48)
    const swAncillary = new THREE.Mesh(new THREE.BoxGeometry(12, 4.0, 8.0), auxWallMat);
    swAncillary.position.set(-38, 2.0, 48);
    swAncillary.castShadow = true;
    swAncillary.name = 'Build_Ancillary_Southwest';
    buildingsGroup.add(swAncillary);
    // ----------------------------------------------------
    // 6. Scenic Water Canal & Boulevard Bridge (Dividing North & South Quarters)
    // Water surface + Stone retaining riverbanks + Bridge on West Boulevard
    // ----------------------------------------------------
    const waterGroup = new THREE.Group();
    waterGroup.name = 'Scenic_Water_Canal';
    terrainGroup.add(waterGroup);
    const waterMat = new THREE.MeshStandardMaterial({
        color: '#0284c7', // vibrant natural blue water
        roughness: 0.08,
        metalness: 0.85,
        transparent: true,
        opacity: 0.9,
    });
    const canalBankMat = new THREE.MeshStandardMaterial({
        color: '#94a3b8',
        roughness: 0.8,
    });
    // Water plane: 120m long x 9m wide at Z = -6
    const waterPlane = new THREE.Mesh(new THREE.PlaneGeometry(120, 9), waterMat);
    waterPlane.rotateX(-Math.PI / 2);
    waterPlane.position.set(0, -0.05, -6);
    waterGroup.add(waterPlane);
    // South & North stone revetment banks (at Z = -1.5 and Z = -10.5)
    const bankSouth = new THREE.Mesh(new THREE.BoxGeometry(120, 0.4, 0.6), canalBankMat);
    bankSouth.position.set(0, 0.1, -1.5);
    waterGroup.add(bankSouth);
    const bankNorth = new THREE.Mesh(new THREE.BoxGeometry(120, 0.4, 0.6), canalBankMat);
    bankNorth.position.set(0, 0.1, -10.5);
    waterGroup.add(bankNorth);
    // Boulevard Bridge spanning across the canal on West Boulevard (X = -49, Z = -6)
    const bridgeDeck = new THREE.Mesh(new THREE.BoxGeometry(10, 0.35, 9.6), new THREE.MeshStandardMaterial({ color: '#334155', roughness: 0.8 }));
    bridgeDeck.position.set(-49, 0.18, -6);
    bridgeDeck.receiveShadow = true;
    waterGroup.add(bridgeDeck);
    // Bridge railings (East & West curbs)
    const railingGeo = new THREE.BoxGeometry(0.3, 0.8, 9.6);
    const railingMat = new THREE.MeshStandardMaterial({ color: '#f8fafc', roughness: 0.4 });
    const railWest = new THREE.Mesh(railingGeo, railingMat);
    railWest.position.set(-53.8, 0.6, -6);
    waterGroup.add(railWest);
    const railEast = new THREE.Mesh(railingGeo, railingMat);
    railEast.position.set(-44.2, 0.6, -6);
    waterGroup.add(railEast);
    // ==========================================
    // STAGE 9: 04_Vegetation Cross-Plane Trees, Lawns, Hedges
    // ==========================================
    const treeTex = createTreeCanvasTexture();
    const treeMat = new THREE.MeshStandardMaterial({
        map: treeTex,
        color: '#3d7a3d',
        roughness: 0.9,
        transparent: true,
        alphaTest: 0.1,
        side: THREE.DoubleSide,
    });
    // Cross Quad tree geometry (Step 40: 4m height, 3m width, crossed at 90°)
    function createCrossTreeMesh() {
        const treeGroup = new THREE.Group();
        const plane1Geo = new THREE.PlaneGeometry(3, 4);
        plane1Geo.translate(0, 2, 0); // bottom at 0
        const m1 = new THREE.Mesh(plane1Geo, treeMat);
        m1.castShadow = true;
        const plane2Geo = new THREE.PlaneGeometry(3, 4);
        plane2Geo.translate(0, 2, 0);
        plane2Geo.rotateY(Math.PI / 2);
        const m2 = new THREE.Mesh(plane2Geo, treeMat);
        m2.castShadow = true;
        treeGroup.add(m1, m2);
        return treeGroup;
    }
    // Place 38 trees along perimeter, roadsides, lawns with random rotation and scale 0.8~1.2
    const treePositions = [
        // North wall row
        [-52, -45], [-42, -45], [-32, -45], [-20, -45], [-8, -45], [5, -45], [18, -45], [30, -45], [42, -45], [52, -45],
        // South wall row (avoiding gate)
        [-52, 45], [-40, 45], [-25, 45], [-14, 45], [14, 45], [25, 45], [40, 45], [52, 45],
        // West wall row
        [-55, -35], [-55, -20], [-55, -5], [-55, 12], [-55, 28],
        // East wall row
        [55, -35], [55, -20], [55, -5], [55, 12], [55, 28],
        // Around Office building & Lawns
        [32, -22], [35, -5], [34, 8], [2, -20], [18, 5], [-32, 22],
        // Parking buffer & East Lawn
        [18, 15], [10, 28], [38, 30], [38, 12]
    ];
    treePositions.forEach((pos, idx) => {
        const tree = createCrossTreeMesh();
        // Step 42: Random rotation 0~90° and scale 0.8~1.2
        const rot = (idx * 37) % 360;
        const sc = 0.85 + ((idx * 17) % 35) / 100;
        tree.position.set(pos[0], 0, pos[1]);
        tree.rotation.y = (rot * Math.PI) / 180;
        tree.scale.set(sc, sc, sc);
        vegGroup.add(tree);
    });
    objectsMeta.push({
        id: 'tree-cross-batch',
        name: 'Tree_Cross_A (十字面片低模树 × 38)',
        collection: '04_Vegetation',
        type: 'Instanced Cross-Quad Trees',
        dimensions: { x: 3.0, y: 4.0, z: 3.0 },
        position: { x: 0, y: 2, z: 0 },
        materialName: 'Mat_Foliage_Cross',
        materialColor: '#3D7A3D',
        roughness: 0.9,
        tris: 38 * 4,
        description: '38 株 4m 高十字交叉低模面片树，沿路与周边随机离散旋转偏角与比例',
    });
    // Lawns (Step 43: #6AA84F, elevation +0.01m)
    const lawnMat = new THREE.MeshStandardMaterial({
        color: '#6aa84f',
        roughness: 0.9,
    });
    const lawn1Geo = new THREE.PlaneGeometry(26, 18);
    lawn1Geo.rotateX(-Math.PI / 2);
    const lawn1 = new THREE.Mesh(lawn1Geo, lawnMat);
    lawn1.position.set(22, 0.01, -26);
    vegGroup.add(lawn1);
    const lawn2Geo = new THREE.PlaneGeometry(16, 14);
    lawn2Geo.rotateX(-Math.PI / 2);
    const lawn2 = new THREE.Mesh(lawn2Geo, lawnMat);
    lawn2.position.set(-15, 0.01, 15);
    vegGroup.add(lawn2);
    // Hedges (Step 44: 3m x 0.5m x 0.6m, #3D7A3D)
    const hedgeGeo = new THREE.BoxGeometry(3, 0.6, 0.5);
    const hedgeMat = new THREE.MeshStandardMaterial({ color: '#2d5a27', roughness: 0.9 });
    for (let h = -40; h <= 40; h += 3.5) {
        if (Math.abs(h) > 6) { // leave south entrance open
            const hedgeS = new THREE.Mesh(hedgeGeo, hedgeMat);
            hedgeS.position.set(h, 0.3, 48);
            vegGroup.add(hedgeS);
        }
    }
    // ==========================================
    // STAGE 10: 05_StreetFurniture StreetLights (6m height, 6-sided cylinder)
    // Spaced every 20m along roads
    // ==========================================
    const poleGeo = new THREE.CylinderGeometry(0.06, 0.08, 6.0, 6); // 6-sided low-poly as required in step 45
    poleGeo.translate(0, 3, 0); // Base at ground
    const poleMat = new THREE.MeshStandardMaterial({ color: '#64748b', roughness: 0.5, metalness: 0.7 });
    const lampHeadGeo = new THREE.BoxGeometry(0.3, 0.1, 0.4);
    const lampHeadMat = new THREE.MeshStandardMaterial({ color: '#1e293b', roughness: 0.4 });
    const bulbMat = new THREE.MeshBasicMaterial({ color: '#fef08a' }); // Glow light bulb
    // 14 streetlights along the loop road
    const lightPositions = [
        [-46, -34, 0], [-23, -34, 0], [0, -34, 0], [23, -34, 0], [46, -34, 0],
        [-46, 34, Math.PI], [-23, 34, Math.PI], [23, 34, Math.PI], [46, 34, Math.PI],
        [-46, -17, Math.PI / 2], [-46, 17, Math.PI / 2],
        [46, -17, -Math.PI / 2], [46, 17, -Math.PI / 2],
        [4, 45, -Math.PI / 2]
    ];
    lightPositions.forEach((lpos, idx) => {
        const lightFixture = new THREE.Group();
        lightFixture.position.set(lpos[0], 0, lpos[1]);
        lightFixture.rotation.y = lpos[2];
        const pole = new THREE.Mesh(poleGeo, poleMat);
        pole.castShadow = true;
        lightFixture.add(pole);
        const head = new THREE.Mesh(lampHeadGeo, lampHeadMat);
        head.position.set(0, 6.0, 0.4);
        lightFixture.add(head);
        const bulb = new THREE.Mesh(new THREE.BoxGeometry(0.25, 0.04, 0.35), bulbMat);
        bulb.position.set(0, 5.94, 0.4);
        bulb.name = `StreetLight_Bulb_${idx}`;
        lightFixture.add(bulb);
        streetLightsLamps.push(bulb);
        streetGroup.add(lightFixture);
    });
    objectsMeta.push({
        id: 'street-lights',
        name: 'StreetLight_01 ~ 14 (6边形省面路灯)',
        collection: '05_StreetFurniture',
        type: 'Mesh / 6-Sided Low-Poly Pole (14 Units)',
        dimensions: { x: 0.3, y: 6.0, z: 0.8 },
        position: { x: 0, y: 3.0, z: 0 },
        materialName: 'Mat_Galvanized_Steel & Luminous Bulb',
        materialColor: '#64748B',
        roughness: 0.5,
        metallic: 0.7,
        tris: 14 * 24,
        description: '14 盏 6 边形圆柱节能路灯，每 20m 沿路排布，配可调节夜视照度点光源',
    });
    // ==========================================
    // Lighting Setup (Sunlight + Ambient + Accent)
    // ==========================================
    const lightsGroup = new THREE.Group();
    lightsGroup.name = 'Environment_Lights';
    scene.add(lightsGroup);
    const ambientLight = new THREE.AmbientLight('#ffffff', 0.85);
    ambientLight.name = 'Ambient_Light';
    lightsGroup.add(ambientLight);
    const sunLight = new THREE.DirectionalLight('#fffbeb', 1.6);
    sunLight.position.set(70, 90, 60);
    sunLight.castShadow = true;
    sunLight.shadow.mapSize.width = 2048;
    sunLight.shadow.mapSize.height = 2048;
    sunLight.shadow.camera.near = 10;
    sunLight.shadow.camera.far = 250;
    sunLight.shadow.camera.left = -75;
    sunLight.shadow.camera.right = 75;
    sunLight.shadow.camera.top = 75;
    sunLight.shadow.camera.bottom = -75;
    sunLight.shadow.bias = -0.0005;
    sunLight.name = 'Sun_Light';
    lightsGroup.add(sunLight);
    // Soft sky hemis light
    const hemiLight = new THREE.HemisphereLight('#bae6fd', '#334155', 0.6);
    hemiLight.name = 'Hemi_Light';
    lightsGroup.add(hemiLight);
    return {
        scene,
        objectsMeta,
        collectionsGroups,
        lightsGroup,
        streetLightsLamps,
        referencePlane,
    };
}
