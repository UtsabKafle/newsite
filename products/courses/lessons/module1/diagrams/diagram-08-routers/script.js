(function () {
  'use strict';

  /* ---- DOM refs ---- */
  const canvas = document.getElementById('networkCanvas');
  const ctx = canvas.getContext('2d');
  const container = document.getElementById('canvasContainer');
  const tooltipEl = document.getElementById('tooltip');
  const statusEl = document.getElementById('status');

  const routeBtns = {
    A: document.getElementById('routeA'),
    B: document.getElementById('routeB'),
    C: document.getElementById('routeC'),
  };
  const playBtn = document.getElementById('playBtn');
  const pauseBtn = document.getElementById('pauseBtn');
  const resetBtn = document.getElementById('resetBtn');

  /* ---- Constants ---- */
  const DPR = window.devicePixelRatio || 1;
  const ASPECT = 16 / 9;

  const COLORS = {
    bg: '#0a0e1a',
    nodeFill: '#111827',
    nodeBorder: '#1f2937',
    nodeText: '#f9fafb',
    muted: '#9ca3af',
    dim: '#6b7280',
    lineInactive: 'rgba(55,65,81,0.6)',
    glowA: 'rgba(9,89,200,0.35)',
    glowB: 'rgba(16,185,129,0.35)',
    glowC: 'rgba(245,158,11,0.35)',
    congested: '#EF4444',
    congestedGlow: 'rgba(239,68,68,0.5)',
    routeA: '#0959C8',
    routeB: '#10B981',
    routeC: '#F59E0B',
  };

  const ROUTE_COLORS = { A: COLORS.routeA, B: COLORS.routeB, C: COLORS.routeC };

  const NODES = [
    { name: 'Kathmandu', x: 0.12, y: 0.62, pps: '1.8M', desc: 'Router in Kathmandu — handles 1.8M packets/sec' },
    { name: 'Delhi',     x: 0.30, y: 0.28, pps: '2.0M', desc: 'Router in Delhi — handles 2.0M packets/sec' },
    { name: 'Dubai',     x: 0.50, y: 0.68, pps: '2.5M', desc: 'Router in Dubai — handles 2.5M packets/sec' },
    { name: 'London',    x: 0.70, y: 0.28, pps: '3.0M', desc: 'Router in London — handles 3.0M packets/sec' },
    { name: 'New York',  x: 0.88, y: 0.62, pps: '4.0M', desc: 'Router in New York — handles 4.0M packets/sec' },
  ];

  /* all pairs = full mesh (10 edges) */
  const MESH = [];
  for (let i = 0; i < NODES.length; i++) {
    for (let j = i + 1; j < NODES.length; j++) {
      MESH.push([i, j]);
    }
  }

  const ROUTES = {
    A: { path: [0, 1, 3, 4], color: COLORS.routeA, label: 'Route A' },
    B: { path: [0, 2, 3, 4], color: COLORS.routeB, label: 'Route B' },
    C: { path: [0, 1, 2, 4], color: COLORS.routeC, label: 'Route C' },
  };

  /* ---- State ---- */
  let W = 0;
  let H = 0;
  let currentRoute = null;        /* 'A' | 'B' | 'C' | null */
  let isPlaying = false;
  let packets = [];
  let congestedNode = null;       /* node index or null */
  let congestedTimer = null;
  let animId = null;
  let frame = 0;

  /* tooltip */
  let hoveredNode = null;
  let pinnedNode = null;

  /* ---- Canvas resize ---- */
  function resize() {
    const rect = container.getBoundingClientRect();
    const cw = rect.width;
    const ch = cw / ASPECT;

    canvas.style.width = cw + 'px';
    canvas.style.height = ch + 'px';
    canvas.width = cw * DPR;
    canvas.height = ch * DPR;
    W = cw;
    H = ch;
  }

  /* ---- Coordinates ---- */
  function nodeXY(node) {
    return { x: node.x * W, y: node.y * H };
  }

  function dist(ax, ay, bx, by) {
    const dx = ax - bx;
    const dy = ay - by;
    return Math.sqrt(dx * dx + dy * dy);
  }

  function lerp(a, b, t) {
    return a + (b - a) * t;
  }

  /* ---- Route helpers ---- */
  function routePath(key) {
    return ROUTES[key] ? ROUTES[key].path : null;
  }

  function routeSegments(key) {
    const p = routePath(key);
    if (!p) return 0;
    return p.length - 1;
  }

  /* get edges that belong to a route */
  function routeEdges(key) {
    const p = routePath(key);
    if (!p) return [];
    const edges = [];
    for (let i = 0; i < p.length - 1; i++) {
      edges.push([p[i], p[i + 1]]);
    }
    return edges;
  }

  /* ---- Packets ---- */
  function initPackets(routeKey) {
    const segs = routeSegments(routeKey);
    if (!segs) { packets = []; return; }
    const count = 4;
    packets = [];
    for (let i = 0; i < count; i++) {
      const t = (i / count) * segs;
      const seg = Math.min(Math.floor(t), segs - 1);
      const prog = t - seg;
      packets.push({ seg, prog, wait: 0 });
    }
  }

  function resetPackets() {
    initPackets(currentRoute);
  }

  function updatePackets() {
    if (!currentRoute || !isPlaying) return;
    const p = routePath(currentRoute);
    if (!p) return;
    const segs = routeSegments(currentRoute);

    for (const pk of packets) {
      if (pk.wait > 0) { pk.wait--; continue; }

      let speed = 0.006;
      const fromNode = p[pk.seg];
      const toNode = p[pk.seg + 1];
      if (fromNode === congestedNode || toNode === congestedNode) {
        speed = 0.0025;
      }
      /* extra slowdown when the segment itself involves congested node */
      if (congestedNode !== null) {
        const routeEdgesArr = routeEdges(currentRoute);
        for (let ei = 0; ei < routeEdgesArr.length; ei++) {
          const e = routeEdgesArr[ei];
          if ((e[0] === congestedNode || e[1] === congestedNode) &&
              e[0] === fromNode && e[1] === toNode) {
            speed = 0.0015;
            break;
          }
        }
      }

      pk.prog += speed;

      if (pk.prog >= 1) {
        pk.prog = 0;
        pk.seg++;
        if (pk.seg >= segs) {
          pk.seg = 0;
        } else {
          const arrivedAt = p[pk.seg];
          pk.wait = arrivedAt === congestedNode ? 80 : 25;
        }
      }
    }
  }

  /* ---- Congestion ---- */
  function pickCongestion() {
    /* pick from inner nodes 1-3, exclude start/end */
    const candidates = [1, 2, 3];
    if (candidates.length === 0) { congestedNode = null; return; }
    const idx = Math.floor(Math.random() * candidates.length);
    congestedNode = candidates[idx];
    updateStatus();
    if (congestedTimer) clearTimeout(congestedTimer);
    congestedTimer = setTimeout(() => {
      congestedNode = null;
      updateStatus();
      congestedTimer = setTimeout(pickCongestion, 5000 + Math.random() * 4000);
    }, 4000 + Math.random() * 3000);
  }

  function startCongestion() {
    if (congestedTimer) clearTimeout(congestedTimer);
    congestedTimer = setTimeout(pickCongestion, 3000 + Math.random() * 4000);
  }

  function stopCongestion() {
    if (congestedTimer) { clearTimeout(congestedTimer); congestedTimer = null; }
    congestedNode = null;
  }

  /* ---- Drawing ---- */
  function drawBackground() {
    ctx.fillStyle = COLORS.bg;
    ctx.fillRect(0, 0, W, H);

    /* subtle grid dots */
    ctx.fillStyle = 'rgba(255,255,255,0.02)';
    const step = 30;
    for (let x = 0; x < W; x += step) {
      for (let y = 0; y < H; y += step) {
        ctx.beginPath();
        ctx.arc(x, y, 1, 0, Math.PI * 2);
        ctx.fill();
      }
    }
  }

  function drawMesh() {
    const activeEdges = currentRoute ? routeEdges(currentRoute) : [];
    const activeSet = new Set();
    for (const e of activeEdges) {
      activeSet.add(e[0] + ',' + e[1]);
      activeSet.add(e[1] + ',' + e[0]);
    }

    for (const e of MESH) {
      const [i, j] = e;
      const a = nodeXY(NODES[i]);
      const b = nodeXY(NODES[j]);
      const isActive = activeSet.has(i + ',' + j);

      if (isActive) {
        const color = ROUTE_COLORS[currentRoute];
        ctx.beginPath();
        ctx.moveTo(a.x, a.y);
        ctx.lineTo(b.x, b.y);
        ctx.strokeStyle = color;
        ctx.lineWidth = 2.8;
        ctx.shadowColor = color;
        ctx.shadowBlur = 8;
        ctx.stroke();
        ctx.shadowBlur = 0;

        /* bright core */
        ctx.beginPath();
        ctx.moveTo(a.x, a.y);
        ctx.lineTo(b.x, b.y);
        ctx.strokeStyle = color;
        ctx.globalAlpha = 0.35;
        ctx.lineWidth = 6;
        ctx.stroke();
        ctx.globalAlpha = 1;

      } else {
        ctx.beginPath();
        ctx.moveTo(a.x, a.y);
        ctx.lineTo(b.x, b.y);
        ctx.strokeStyle = COLORS.lineInactive;
        ctx.lineWidth = 1.2;
        ctx.setLineDash([4, 4]);
        ctx.stroke();
        ctx.setLineDash([]);
      }
    }
  }

  function drawNodes() {
    for (let i = 0; i < NODES.length; i++) {
      const nd = NODES[i];
      const pos = nodeXY(nd);
      const r = 26;
      const isCong = i === congestedNode;

      /* outer glow when congested */
      if (isCong) {
        const pulse = 0.5 + 0.5 * Math.sin(frame * 0.06);
        const gr = ctx.createRadialGradient(pos.x, pos.y, r * 0.5, pos.x, pos.y, r * 2);
        gr.addColorStop(0, `rgba(239,68,68,${0.25 + pulse * 0.25})`);
        gr.addColorStop(1, 'rgba(239,68,68,0)');
        ctx.beginPath();
        ctx.arc(pos.x, pos.y, r * 2, 0, Math.PI * 2);
        ctx.fillStyle = gr;
        ctx.fill();
      }

      /* node body */
      const grad = ctx.createRadialGradient(pos.x - 6, pos.y - 6, 2, pos.x, pos.y, r);
      grad.addColorStop(0, isCong ? '#1f2937' : '#1e293b');
      grad.addColorStop(1, isCong ? '#111827' : '#111827');
      ctx.beginPath();
      ctx.arc(pos.x, pos.y, r, 0, Math.PI * 2);
      ctx.fillStyle = grad;

      /* border */
      let borderColor = isCong ? COLORS.congested : COLORS.nodeBorder;
      ctx.strokeStyle = borderColor;
      ctx.lineWidth = isCong ? 2.5 : 1.5;
      ctx.shadowColor = isCong ? COLORS.congestedGlow : 'transparent';
      ctx.shadowBlur = isCong ? 18 : 0;
      ctx.fill();
      ctx.stroke();
      ctx.shadowBlur = 0;

      /* inner ring for glass effect */
      ctx.beginPath();
      ctx.arc(pos.x, pos.y, r - 3, 0, Math.PI * 2);
      ctx.strokeStyle = isCong
        ? 'rgba(239,68,68,0.2)'
        : 'rgba(255,255,255,0.04)';
      ctx.lineWidth = 1;
      ctx.stroke();

      /* label */
      ctx.fillStyle = COLORS.nodeText;
      ctx.font = '600 11px "Poppins", sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(nd.name, pos.x, pos.y);

      /* data rate */
      ctx.fillStyle = isCong ? COLORS.congested : COLORS.dim;
      ctx.font = '8px "Inter", sans-serif';
      ctx.textBaseline = 'top';
      ctx.fillText(nd.pps + ' pkt/s', pos.x, pos.y + r + 5);

      /* warning icon for congestion */
      if (isCong) {
        const wx = pos.x;
        const wy = pos.y - r - 12;
        const pulse = 1 + 0.12 * Math.sin(frame * 0.08);
        const s = 7 * pulse;

        ctx.fillStyle = '#EF4444';
        ctx.beginPath();
        ctx.moveTo(wx, wy - s);
        ctx.lineTo(wx + s * 0.7, wy + s * 0.5);
        ctx.lineTo(wx - s * 0.7, wy + s * 0.5);
        ctx.closePath();
        ctx.fill();

        ctx.fillStyle = '#fff';
        ctx.font = `bold ${Math.round(7 * pulse)}px "Inter", sans-serif`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('!', wx, wy + s * 0.1);
      }
    }
  }

  function drawPackets() {
    if (!currentRoute) return;
    const p = routePath(currentRoute);
    if (!p) return;
    const color = ROUTE_COLORS[currentRoute];

    for (const pk of packets) {
      const from = nodeXY(NODES[p[pk.seg]]);
      const to = nodeXY(NODES[pk.seg + 1]);
      const x = lerp(from.x, to.x, pk.prog);
      const y = lerp(from.y, to.y, pk.prog);

      /* trail glow */
      const grd = ctx.createRadialGradient(x, y, 2, x, y, 14);
      grd.addColorStop(0, color);
      grd.addColorStop(0.4, color);
      grd.addColorStop(1, 'transparent');
      ctx.beginPath();
      ctx.arc(x, y, 14, 0, Math.PI * 2);
      ctx.fillStyle = grd;
      ctx.globalAlpha = 0.35;
      ctx.fill();
      ctx.globalAlpha = 1;

      /* packet body */
      ctx.shadowColor = color;
      ctx.shadowBlur = 12;
      ctx.beginPath();
      ctx.arc(x, y, 5, 0, Math.PI * 2);
      ctx.fillStyle = color;
      ctx.fill();
      ctx.shadowBlur = 0;

      /* bright core */
      ctx.beginPath();
      ctx.arc(x, y, 2.5, 0, Math.PI * 2);
      ctx.fillStyle = '#ffffff';
      ctx.fill();
    }
  }

  function drawRouteLabels() {
    if (!currentRoute) return;
    const p = routePath(currentRoute);
    if (!p) return;

    /* Draw a small label mid-way along each edge */
    const edges = routeEdges(currentRoute);
    const color = ROUTE_COLORS[currentRoute];
    ctx.font = '9px "Inter", sans-serif';
    ctx.fillStyle = color;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'bottom';
    ctx.globalAlpha = 0.6;

    for (const e of edges) {
      const a = nodeXY(NODES[e[0]]);
      const b = nodeXY(NODES[e[1]]);
      const mx = (a.x + b.x) / 2;
      const my = (a.y + b.y) / 2;
      ctx.fillText('●', mx, my - 4);
    }
    ctx.globalAlpha = 1;
  }

  function drawTitle() {
    ctx.fillStyle = 'rgba(255,255,255,0.04)';
    ctx.font = '600 48px "Poppins", sans-serif';
    ctx.textAlign = 'left';
    ctx.textBaseline = 'top';
    ctx.fillText('Mesh Network', 16, 12);
  }

  function draw() {
    frame++;
    drawBackground();
    drawMesh();
    drawNodes();
    drawPackets();
    drawRouteLabels();
  }

  /* ---- Status ---- */
  function updateStatus() {
    let msg = '';
    let cls = '';
    if (!currentRoute) {
      msg = 'Select a route to begin';
    } else {
      const rl = ROUTES[currentRoute].label;
      if (congestedNode !== null) {
        msg = '\u26A0 ' + NODES[congestedNode].name + ' congested — packets delayed';
        cls = 'congested';
      } else if (isPlaying) {
        msg = rl + ' — packets in transit';
        cls = 'active';
      } else {
        msg = rl + ' — paused';
        cls = 'active';
      }
    }
    statusEl.textContent = msg;
    statusEl.className = 'status ' + cls;
  }

  /* ---- Controls ---- */
  function selectRoute(key) {
    if (currentRoute === key) return;
    currentRoute = key;
    for (const k in routeBtns) {
      routeBtns[k].setAttribute('aria-checked', k === key ? 'true' : 'false');
    }
    initPackets(key);
    updateStatus();
  }

  function play() {
    if (!currentRoute) return;
    isPlaying = true;
    updateStatus();
  }

  function pause() {
    isPlaying = false;
    updateStatus();
  }

  function reset() {
    isPlaying = false;
    resetPackets();
    updateStatus();
  }

  /* ---- Tooltip ---- */
  function getNodeAt(mx, my) {
    const hitR = 26 + 6;
    for (let i = NODES.length - 1; i >= 0; i--) {
      const pos = nodeXY(NODES[i]);
      if (dist(mx, my, pos.x, pos.y) <= hitR) {
        return i;
      }
    }
    return null;
  }

  function showTooltip(nodeIdx, mx, my) {
    const nd = NODES[nodeIdx];
    tooltipEl.innerHTML =
      '<div class="tooltip-city">' + nd.name + '</div>' +
      '<div class="tooltip-data">' + nd.pps + ' packets/sec</div>' +
      '<div class="tooltip-desc">' + nd.desc + '</div>';
    tooltipEl.classList.add('visible');
    tooltipEl.setAttribute('aria-hidden', 'false');

    /* position relative to container */
    const rect = container.getBoundingClientRect();
    let tx = mx + 14;
    let ty = my - 10;
    const tw = tooltipEl.offsetWidth;
    const th = tooltipEl.offsetHeight;

    if (tx + tw > rect.width - 8) tx = mx - tw - 14;
    if (ty + th > rect.height - 8) ty = rect.height - th - 8;
    if (ty < 8) ty = 8;

    tooltipEl.style.left = tx + 'px';
    tooltipEl.style.top = ty + 'px';
  }

  function hideTooltip() {
    tooltipEl.classList.remove('visible');
    tooltipEl.setAttribute('aria-hidden', 'true');
    hoveredNode = null;
  }

  /* ---- Event handlers ---- */

  /* Route buttons */
  for (const key in routeBtns) {
    routeBtns[key].addEventListener('click', function () {
      selectRoute(key);
      if (isPlaying) { /* keep playing */ }
    });
    routeBtns[key].addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        selectRoute(key);
      }
    });
  }

  /* Play/Pause/Reset */
  playBtn.addEventListener('click', play);
  playBtn.addEventListener('keydown', function (e) {
    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); play(); }
  });
  pauseBtn.addEventListener('click', pause);
  pauseBtn.addEventListener('keydown', function (e) {
    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); pause(); }
  });
  resetBtn.addEventListener('click', reset);
  resetBtn.addEventListener('keydown', function (e) {
    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); reset(); }
  });

  /* Canvas mouse */
  canvas.addEventListener('mousemove', function (e) {
    if (pinnedNode !== null) return;
    const rect = container.getBoundingClientRect();
    const mx = e.clientX - rect.left;
    const my = e.clientY - rect.top;
    const idx = getNodeAt(mx, my);
    if (idx !== null) {
      if (idx !== hoveredNode) {
        hoveredNode = idx;
        showTooltip(idx, mx, my);
      } else {
        /* update position */
        showTooltip(idx, mx, my);
      }
      canvas.style.cursor = 'pointer';
    } else {
      if (hoveredNode !== null) {
        hideTooltip();
      }
      canvas.style.cursor = 'default';
    }
  });

  canvas.addEventListener('mouseleave', function () {
    if (pinnedNode === null) {
      hideTooltip();
    }
    canvas.style.cursor = 'default';
  });

  canvas.addEventListener('click', function (e) {
    const rect = container.getBoundingClientRect();
    const mx = e.clientX - rect.left;
    const my = e.clientY - rect.top;
    const idx = getNodeAt(mx, my);
    if (idx !== null) {
      if (pinnedNode === idx) {
        pinnedNode = null;
        hideTooltip();
      } else {
        pinnedNode = idx;
        showTooltip(idx, mx, my);
      }
    } else {
      pinnedNode = null;
      hideTooltip();
    }
  });

  /* Touch */
  canvas.addEventListener('touchstart', function (e) {
    e.preventDefault();
    const touch = e.touches[0];
    const rect = container.getBoundingClientRect();
    const mx = touch.clientX - rect.left;
    const my = touch.clientY - rect.top;
    const idx = getNodeAt(mx, my);
    if (idx !== null) {
      if (pinnedNode === idx) {
        pinnedNode = null;
        hideTooltip();
      } else {
        pinnedNode = idx;
        showTooltip(idx, mx, my);
      }
    } else {
      pinnedNode = null;
      hideTooltip();
    }
  }, { passive: false });

  /* Keyboard: Escape to close tooltip / Escape to close pinned */
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') {
      pinnedNode = null;
      hideTooltip();
    }
  });

  /* Resize */
  let resizeTimeout;
  window.addEventListener('resize', function () {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(function () {
      resize();
      pinnedNode = null;
      hideTooltip();
    }, 150);
  });

  /* ---- Animation loop ---- */
  function loop() {
    updatePackets();
    draw();
    animId = requestAnimationFrame(loop);
  }

  /* ---- Init ---- */
  function init() {
    resize();
    selectRoute('A');
    isPlaying = true;
    startCongestion();
    updateStatus();
    loop();
  }

  init();
})();
