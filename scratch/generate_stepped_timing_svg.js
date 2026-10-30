const fs = require('fs');
const path = require('path');

function generateTimingSvg() {
  const width = 1200;
  const height = 800;
  
  // Time markers (X positions)
  // 18:00 = 0m, 19:35 = 95m
  const tStart = 0;
  const tEnd = 95;
  const xOrigin = 220;
  const xEnd = 1140;
  const scaleX = (m) => xOrigin + (m / tEnd) * (xEnd - xOrigin);

  const times = [
    { m: 0, label: '18:00' },
    { m: 15, label: '18:15' },
    { m: 25, label: '18:25' },
    { m: 45, label: '18:45' },
    { m: 50, label: '18:50' },
    { m: 62, label: '19:02' },
    { m: 64, label: '19:04' },
    { m: 84, label: '19:24' },
    { m: 92, label: '19:32' },
    { m: 95, label: '19:35' }
  ];

  let svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" width="${width}" height="${height}">
  <style>
    .title { font-family: 'Arial', sans-serif; font-size: 16px; font-weight: bold; fill: #000000; }
    .subtitle { font-family: 'Arial', sans-serif; font-size: 12px; font-style: italic; fill: #333333; }
    .lane-title { font-family: 'Arial', sans-serif; font-size: 13px; font-weight: bold; fill: #000000; }
    .state-label { font-family: 'Arial', sans-serif; font-size: 10px; fill: #000000; }
    .time-label { font-family: 'Arial', sans-serif; font-size: 11px; font-weight: bold; fill: #000000; }
    .event-label { font-family: 'Arial', sans-serif; font-size: 9px; font-weight: bold; fill: #000000; }
    .grid-line { stroke: #dddddd; stroke-width: 1; stroke-dasharray: 3,3; }
    .axis-line { stroke: #000000; stroke-width: 1.5; }
    .waveform { stroke: #000000; stroke-width: 2.5; fill: none; stroke-linejoin: miter; }
    .event-impulse { stroke: #000000; stroke-width: 1.5; }
    .box-border { stroke: #000000; stroke-width: 1.5; fill: #ffffff; }
  </style>

  <!-- Background Canvas -->
  <rect x="0" y="0" width="${width}" height="${height}" fill="#ffffff" stroke="#000000" stroke-width="2" />

  <!-- Diagram Title Frame -->
  <text x="30" y="35" class="title">UML 2.5 Timing Diagram: Customer Dining &amp; Real-Time Order Lifecycle</text>
  <text x="30" y="55" class="subtitle">System: VikingsERP | State/Value Stepped Lifelines | Timeline: 18:00 – 19:35 (Assumed Illustrative Timing)</text>
  <line x1="30" y1="65" x2="1170" y2="65" stroke="#000000" stroke-width="1" />
`;

  // Draw Vertical Time Grid Lines across all lanes
  for (const t of times) {
    const x = scaleX(t.m);
    svg += `  <line x1="${x}" y1="80" x2="${x}" y2="720" class="grid-line" />\n`;
    svg += `  <text x="${x}" y="738" text-anchor="middle" class="time-label">${t.label}</text>\n`;
    svg += `  <line x1="${x}" y1="720" x2="${x}" y2="725" stroke="#000000" stroke-width="1.5" />\n`;
  }
  // Bottom horizontal time axis line
  svg += `  <line x1="${xOrigin}" y1="720" x2="${xEnd}" y2="720" class="axis-line" />\n`;
  svg += `  <text x="${xEnd + 10}" y="724" class="time-label">Time</text>\n`;

  // ==========================================
  // LIFELINE 1: Reservation: Reservation
  // ==========================================
  const l1Top = 90;
  const l1States = [
    { name: 'Completed', y: l1Top + 20 },
    { name: 'Seated', y: l1Top + 45 },
    { name: 'Called', y: l1Top + 70 },
    { name: 'Queued', y: l1Top + 95 },
    { name: 'Approved', y: l1Top + 120 },
    { name: 'Pending', y: l1Top + 145 },
    { name: 'None / Init', y: l1Top + 170 }
  ];

  svg += `
  <!-- Lifeline 1: Reservation -->
  <rect x="25" y="${l1Top}" width="180" height="180" class="box-border" />
  <text x="35" y="${l1Top + 25}" class="lane-title">res : Reservation</text>
  <text x="35" y="${l1Top + 42}" class="state-label">[State Lifeline]</text>
`;
  for (const s of l1States) {
    svg += `  <text x="200" y="${s.y + 4}" text-anchor="end" class="state-label">${s.name}</text>\n`;
    svg += `  <line x1="${xOrigin}" y1="${s.y}" x2="${xEnd}" y2="${s.y}" class="grid-line" />\n`;
  }

  // Waveform for Reservation:
  // 0m (18:00): Pending (y=145)
  // 15m (18:15): Approved (y=120)
  // 25m (18:25): Queued (y=95)
  // 45m (18:45): Called (y=70)
  // 50m (18:50): Seated (y=45)
  // 92m (19:32): Completed (y=20)
  // 95m (19:35): Completed
  const x0 = scaleX(0);
  const x15 = scaleX(15);
  const x25 = scaleX(25);
  const x45 = scaleX(45);
  const x50 = scaleX(50);
  const x92 = scaleX(92);
  const x95 = scaleX(95);

  const yPending = l1Top + 145;
  const yApproved = l1Top + 120;
  const yQueued = l1Top + 95;
  const yCalled = l1Top + 70;
  const ySeated = l1Top + 45;
  const yCompleted = l1Top + 20;

  const path1 = `M ${x0} ${yPending} ` +
    `L ${x15} ${yPending} L ${x15} ${yApproved} ` +
    `L ${x25} ${yApproved} L ${x25} ${yQueued} ` +
    `L ${x45} ${yQueued} L ${x45} ${yCalled} ` +
    `L ${x50} ${yCalled} L ${x50} ${ySeated} ` +
    `L ${x92} ${ySeated} L ${x92} ${yCompleted} ` +
    `L ${x95} ${yCompleted}`;

  svg += `  <path d="${path1}" class="waveform" />\n`;

  // ==========================================
  // LIFELINE 2: Order: Order
  // ==========================================
  const l2Top = 290;
  const l2States = [
    { name: 'Completed', y: l2Top + 20 },
    { name: 'Ready', y: l2Top + 45 },
    { name: 'Preparing', y: l2Top + 70 },
    { name: 'Pending', y: l2Top + 95 },
    { name: 'Idle / Cart', y: l2Top + 120 }
  ];

  svg += `
  <!-- Lifeline 2: Order -->
  <rect x="25" y="${l2Top}" width="180" height="130" class="box-border" />
  <text x="35" y="${l2Top + 25}" class="lane-title">ord : Order</text>
  <text x="35" y="${l2Top + 42}" class="state-label">[State Lifeline]</text>
`;
  for (const s of l2States) {
    svg += `  <text x="200" y="${s.y + 4}" text-anchor="end" class="state-label">${s.name}</text>\n`;
    svg += `  <line x1="${xOrigin}" y1="${s.y}" x2="${xEnd}" y2="${s.y}" class="grid-line" />\n`;
  }

  // Waveform for Order:
  // 0m to 62m: Idle / Cart (y=120)
  // 62m (19:02): Pending (y=95)
  // 64m (19:04): Preparing (y=70)
  // 84m (19:24): Ready (y=45)
  // 92m (19:32): Completed (y=20)
  // 95m (19:35): Completed
  const x62 = scaleX(62);
  const x64 = scaleX(64);
  const x84 = scaleX(84);

  const yOrdIdle = l2Top + 120;
  const yOrdPending = l2Top + 95;
  const yOrdPrep = l2Top + 70;
  const yOrdReady = l2Top + 45;
  const yOrdComp = l2Top + 20;

  const path2 = `M ${x0} ${yOrdIdle} ` +
    `L ${x62} ${yOrdIdle} L ${x62} ${yOrdPending} ` +
    `L ${x64} ${yOrdPending} L ${x64} ${yOrdPrep} ` +
    `L ${x84} ${yOrdPrep} L ${x84} ${yOrdReady} ` +
    `L ${x92} ${yOrdReady} L ${x92} ${yOrdComp} ` +
    `L ${x95} ${yOrdComp}`;

  svg += `  <path d="${path2}" class="waveform" />\n`;

  // ==========================================
  // LIFELINE 3: RestaurantTable (M3)
  // ==========================================
  const l3Top = 440;
  const l3States = [
    { name: 'Occupied', y: l3Top + 25 },
    { name: 'Available', y: l3Top + 65 }
  ];

  svg += `
  <!-- Lifeline 3: Table M3 -->
  <rect x="25" y="${l3Top}" width="180" height="85" class="box-border" />
  <text x="35" y="${l3Top + 25}" class="lane-title">tblM3 : RestaurantTable</text>
  <text x="35" y="${l3Top + 42}" class="state-label">[Discrete Value Lifeline]</text>
`;
  for (const s of l3States) {
    svg += `  <text x="200" y="${s.y + 4}" text-anchor="end" class="state-label">${s.name}</text>\n`;
    svg += `  <line x1="${xOrigin}" y1="${s.y}" x2="${xEnd}" y2="${s.y}" class="grid-line" />\n`;
  }

  // Waveform for Table M3:
  // 0m to 50m: Available (y=65)
  // 50m to 92m: Occupied (y=25)
  // 92m to 95m: Available (y=65)
  const yTblAvail = l3Top + 65;
  const yTblOcc = l3Top + 25;

  const path3 = `M ${x0} ${yTblAvail} ` +
    `L ${x50} ${yTblAvail} L ${x50} ${yTblOcc} ` +
    `L ${x92} ${yTblOcc} L ${x92} ${yTblAvail} ` +
    `L ${x95} ${yTblAvail}`;

  svg += `  <path d="${path3}" class="waveform" />\n`;

  // ==========================================
  // LIFELINE 4: Socket.IO Server Signals
  // ==========================================
  const l4Top = 545;
  svg += `
  <!-- Lifeline 4: Socket Events -->
  <rect x="25" y="${l4Top}" width="180" height="155" class="box-border" />
  <text x="35" y="${l4Top + 25}" class="lane-title">io : Socket.IO Events</text>
  <text x="35" y="${l4Top + 42}" class="state-label">[Signal Occurrence Lane]</text>
`;

  const socketEvents = [
    { m: 0, label: 'reservation:new', yOff: 30 },
    { m: 15, label: 'reservation:update', yOff: 50 },
    { m: 25, label: 'queue:update (enqueued)', yOff: 70 },
    { m: 45, label: 'queue:update (called)', yOff: 90 },
    { m: 50, label: 'seating:update', yOff: 110 },
    { m: 62, label: 'order:new', yOff: 30 },
    { m: 64, label: 'order:update (prep)', yOff: 50 },
    { m: 84, label: 'order:update (ready)', yOff: 70 },
    { m: 92, label: 'order:update (done)', yOff: 90 }
  ];

  // Base signal line
  const yBaseSignal = l4Top + 135;
  svg += `  <line x1="${xOrigin}" y1="${yBaseSignal}" x2="${xEnd}" y2="${yBaseSignal}" stroke="#000000" stroke-width="1.5" />\n`;

  for (const ev of socketEvents) {
    const x = scaleX(ev.m);
    const yTop = l4Top + ev.yOff;
    svg += `  <!-- Event: ${ev.label} at m=${ev.m} -->\n`;
    svg += `  <circle cx="${x}" cy="${yBaseSignal}" r="3.5" fill="#000000" />\n`;
    svg += `  <line x1="${x}" y1="${yBaseSignal}" x2="${x}" y2="${yTop + 10}" class="event-impulse" stroke-dasharray="2,2" />\n`;
    svg += `  <rect x="${x - 4}" y="${yTop - 12}" width="${ev.label.length * 6 + 10}" height="16" fill="#ffffff" stroke="#000000" stroke-width="1" />\n`;
    svg += `  <text x="${x + 2}" y="${yTop}" class="event-label">${ev.label}</text>\n`;
  }

  svg += `</svg>`;
  return svg;
}

const svgOut = generateTimingSvg();
const targetPath = path.resolve('docs/system-diagrams/16-timing-diagram/16-timing-diagram.svg');
fs.writeFileSync(targetPath, svgOut, 'utf8');
console.log(`Generated UML stepped waveform SVG: ${targetPath} (${svgOut.length} bytes)`);

