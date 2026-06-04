/* ===== Configuration ===== */
const ROUTE_COLORS = {
  1: { color: '#10b981', glow: 'rgba(16,185,129,0.4)', name: 'Primary' },
  2: { color: '#0959C8', glow: 'rgba(9,89,200,0.4)',   name: 'Backup' },
  3: { color: '#f59e0b', glow: 'rgba(245,158,11,0.4)', name: 'Secondary' },
};

const ROUTE_NODES = {
  1: ['router-a', 'router-b'],
  2: ['router-c', 'router-d'],
  3: ['router-e', 'router-f'],
};

const ROUTE_PATHS = {
  1: ['source', 'router-a', 'router-b', 'destination'],
  2: ['source', 'router-c', 'router-d', 'destination'],
  3: ['source', 'router-e', 'router-f', 'destination'],
};

const PACKET_COUNT      = 3;
const PACKET_SPEED      = 0.7;
const FAILOVER_DELAY_MS = 1200;

/* ===== State ===== */
const state = {
  activeRoute: 1,
  brokenRoutes: new Set(),
  isTransitioning: false,
  isPaused: false,
  isAutoDemo: false,
  autoDemoStep: null,
  failoverCount: 0,
  uptime: 0,
  uptimeInterval: null,
  animFrameId: null,
  lastTime: 0,
  packets: { 1: [], 2: [], 3: [] },
};

/* ===== DOM References ===== */
const diagram   = document.getElementById('diagram');
const svgLayer  = document.getElementById('svgLayer');
const tooltip   = document.getElementById('tooltip');

const statusDot    = document.getElementById('statusDot');
const statusText   = document.getElementById('statusText');
const failoverSpan = document.getElementById('failoverCount');
const uptimeSpan   = document.getElementById('uptimeDisplay');

const break1Btn     = document.getElementById('break1');
const break2Btn     = document.getElementById('break2');
const restoreBtn    = document.getElementById('restoreAll');
const autoDemoBtn   = document.getElementById('autoDemo');
const pauseBtn      = document.getElementById('togglePause');
const resetBtn      = document.getElementById('resetBtn');

/* ===== SVG Setup ===== */
function getNodePositions() {
  const dRect = diagram.getBoundingClientRect();
  const ids   = ['source','router-a','router-b','router-c','router-d','router-e','router-f','destination'];
  const pos   = {};
  for (const id of ids) {
    const el = document.getElementById('node-' + id);
    if (!el) continue;
    const r = el.getBoundingClientRect();
    pos[id] = {
      x: r.left + r.width / 2 - dRect.left,
      y: r.top  + r.height / 2 - dRect.top,
    };
  }
  return pos;
}

function setSvgSize() {
  const w = diagram.clientWidth;
  const h = diagram.clientHeight;
  svgLayer.setAttribute('viewBox', '0 0 ' + w + ' ' + h);
  svgLayer.setAttribute('width',  w);
  svgLayer.setAttribute('height', h);
}

/* ===== Draw Lines ===== */
function drawLines() {
  const pos   = getNodePositions();
  const groups = svgLayer.querySelectorAll('.route-group');
  for (const g of groups) g.remove();

  for (let r = 1; r <= 3; r++) {
    const path = ROUTE_PATHS[r];
    const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    g.setAttribute('class', 'route-group');
    g.setAttribute('data-route', r);

    for (let i = 0; i < path.length - 1; i++) {
      const p1 = pos[path[i]];
      const p2 = pos[path[i + 1]];
      if (!p1 || !p2) continue;

      const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
      line.setAttribute('class', 'route-line');
      line.setAttribute('data-route', String(r));
      line.setAttribute('data-segment', String(i));
      line.setAttribute('x1', p1.x);
      line.setAttribute('y1', p1.y);
      line.setAttribute('x2', p2.x);
      line.setAttribute('y2', p2.y);
      line.style.setProperty('--glow-color', ROUTE_COLORS[r].glow);
      line.style.stroke = ROUTE_COLORS[r].color;
      g.appendChild(line);
    }
    svgLayer.appendChild(g);
  }

  applyLineStates();
}

function applyLineStates() {
  const lines = svgLayer.querySelectorAll('.route-line');

  for (const l of lines) {
    const rid = parseInt(l.getAttribute('data-route'), 10);

    l.classList.remove('active','inactive','broken','transitioning');

    if (state.brokenRoutes.has(rid)) {
      l.classList.add('broken');
    } else if (rid === state.activeRoute) {
      l.classList.add('active');
    } else {
      l.classList.add('inactive');
    }
  }
}

/* ===== Packets ===== */
function createPacketElements() {
  for (let r = 1; r <= 3; r++) {
    for (const p of state.packets[r]) {
      if (p.el && p.el.parentNode) p.el.remove();
    }
    state.packets[r] = [];

    const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    g.setAttribute('data-route-packets', String(r));

    for (let i = 0; i < PACKET_COUNT; i++) {
      const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
      circle.setAttribute('class', 'packet');
      circle.setAttribute('r', 5);
      circle.setAttribute('data-packet', String(r) + '-' + i);
      circle.style.setProperty('--packet-color', ROUTE_COLORS[r].color);
      circle.style.setProperty('--packet-glow', ROUTE_COLORS[r].glow);
      circle.style.fill = ROUTE_COLORS[r].color;

      if (r !== state.activeRoute || state.brokenRoutes.has(r)) {
        circle.classList.add('hidden-packet');
      }

      g.appendChild(circle);

      state.packets[r].push({
        routeId: r,
        index: i,
        progress: (i / PACKET_COUNT) * (ROUTE_PATHS[r].length - 1),
        speed: PACKET_SPEED,
        el: circle,
      });
    }
    svgLayer.appendChild(g);
  }
}

function updatePackets(dt) {
  const positions = getNodePositions();

  for (let r = 1; r <= 3; r++) {
    const path      = ROUTE_PATHS[r];
    const segCount  = path.length - 1;
    const isActive  = (r === state.activeRoute && !state.brokenRoutes.has(r));

    for (const pkt of state.packets[r]) {
      if (isActive) {
        pkt.progress += pkt.speed * dt;
        if (pkt.progress >= segCount) pkt.progress = 0;

        const seg   = Math.min(Math.floor(pkt.progress), segCount - 1);
        const t     = pkt.progress - seg;
        const p1    = positions[path[seg]];
        const p2    = positions[path[seg + 1]];

        if (p1 && p2) {
          pkt.el.setAttribute('cx', p1.x + (p2.x - p1.x) * t);
          pkt.el.setAttribute('cy', p1.y + (p2.y - p1.y) * t);
        }
        pkt.el.classList.remove('hidden-packet');
      } else {
        pkt.el.classList.add('hidden-packet');
      }
    }
  }
}

/* ===== Animation Loop ===== */
function animate(time) {
  if (state.isPaused) {
    state.lastTime = 0;
    state.animFrameId = requestAnimationFrame(animate);
    return;
  }

  const dt = state.lastTime ? Math.min((time - state.lastTime) / 1000, 0.1) : 0;
  state.lastTime = time;

  updatePackets(dt);
  state.animFrameId = requestAnimationFrame(animate);
}

/* ===== Route Management ===== */
function activateRoute(routeId) {
  state.activeRoute = routeId;

  for (let r = 1; r <= 3; r++) {
    const nodes = ROUTE_NODES[r];
    for (const nid of nodes) {
      const el = document.getElementById('node-' + nid);
      if (!el) continue;
      el.classList.remove('active-route', 'standby');

      if (state.brokenRoutes.has(r)) {
        el.classList.add('failed');
      } else if (r === routeId) {
        el.classList.add('active-route');
        el.style.setProperty('--route-active-color', ROUTE_COLORS[r].color);
        el.style.setProperty('--route-active-glow', ROUTE_COLORS[r].glow);
      } else {
        el.classList.add('standby');
      }
    }
  }

  const routeLabels = document.querySelectorAll('.route-label');
  for (const lbl of routeLabels) lbl.classList.remove('active');
  const activeLabel = document.getElementById('routeLabel' + routeId);
  if (activeLabel) activeLabel.classList.add('active');

  const info = ROUTE_COLORS[routeId];
  statusDot.className = 'status-dot route-' + routeId + '-active';
  statusText.innerHTML = 'Route ' + routeId + ' (' + info.name + ') &mdash; Active';

  applyLineStates();
}

function findNextAvailableRoute() {
  for (let r = 1; r <= 3; r++) {
    if (!state.brokenRoutes.has(r)) return r;
  }
  return null;
}

/* ===== Break / Restore ===== */
function breakRoute(routeId) {
  if (state.isTransitioning) return;
  if (state.brokenRoutes.has(routeId)) return;

  state.isTransitioning = true;
  state.brokenRoutes.add(routeId);

  const nodeIds = ROUTE_NODES[routeId];
  for (const nid of nodeIds) {
    const el = document.getElementById('node-' + nid);
    if (!el) continue;
    el.classList.remove('active-route');
    el.classList.add('failed');
  }

  statusDot.className = 'status-dot failed';

  if (routeId === state.activeRoute) {
    statusText.innerHTML = 'Route ' + routeId + ' &mdash; Link Failure!';
  }

  applyLineStates();

  updateUI();

  setTimeout(function () {
    if (state.brokenRoutes.has(routeId) && routeId === state.activeRoute) {
      const next = findNextAvailableRoute();
      if (next) {
        state.failoverCount++;
        failoverSpan.textContent = state.failoverCount;
        activateRoute(next);
      } else {
        statusDot.className = 'status-dot failed';
        statusText.innerHTML = 'All Routes Failed';
      }
    }
    state.isTransitioning = false;
    updateUI();
  }, FAILOVER_DELAY_MS);
}

function restoreAll() {
  if (state.isTransitioning) return;

  state.brokenRoutes.clear();
  state.failoverCount = 0;
  failoverSpan.textContent = '0';

  const allRouters = document.querySelectorAll('.node-router');
  for (const el of allRouters) {
    el.classList.remove('failed', 'standby', 'active-route');
  }

  activateRoute(1);
  updateUI();
}

/* ===== Auto Demo ===== */
function startAutoDemo() {
  if (state.isAutoDemo) return;
  state.isAutoDemo = true;
  autoDemoBtn.textContent = 'Stop Demo';
  autoDemoBtn.classList.add('active');
  if (state.isPaused) togglePause();

  function schedule(ms, fn) {
    if (!state.isAutoDemo) return;
    state.autoDemoStep = setTimeout(fn, ms);
  }

  function doCycle() {
    if (!state.isAutoDemo) return;
    restoreAll();
    schedule(1000, function () {
      breakRoute(1);
      schedule(2500, function () {
        breakRoute(2);
        schedule(2500, function () {
          restoreAll();
          schedule(2000, doCycle);
        });
      });
    });
  }

  restoreAll();
  schedule(800, doCycle);
}

function stopAutoDemo() {
  state.isAutoDemo = false;
  if (state.autoDemoStep) {
    clearTimeout(state.autoDemoStep);
    state.autoDemoStep = null;
  }
  autoDemoBtn.textContent = 'Auto Demo';
  autoDemoBtn.classList.remove('active');
}

/* ===== Pause / Resume ===== */
function togglePause() {
  state.isPaused = !state.isPaused;
  pauseBtn.textContent = state.isPaused ? 'Play' : 'Pause';
  if (!state.isPaused) {
    state.lastTime = 0;
  }
}

/* ===== Reset ===== */
function resetSimulation() {
  stopAutoDemo();
  if (state.isPaused) togglePause();

  state.isTransitioning = false;
  state.brokenRoutes.clear();
  state.failoverCount = 0;
  state.uptime = 0;

  failoverSpan.textContent = '0';
  uptimeSpan.textContent   = '0';

  if (state.uptimeInterval) {
    clearInterval(state.uptimeInterval);
    state.uptimeInterval = null;
  }

  const allRouters = document.querySelectorAll('.node-router');
  for (const el of allRouters) {
    el.classList.remove('failed', 'standby', 'active-route');
  }

  for (let r = 1; r <= 3; r++) {
    for (const pkt of state.packets[r]) {
      pkt.progress = (pkt.index / PACKET_COUNT) * (ROUTE_PATHS[r].length - 1);
    }
  }

  activateRoute(1);
  updateUI();
  startUptime();
}

/* ===== Uptime ===== */
function startUptime() {
  if (state.uptimeInterval) {
    clearInterval(state.uptimeInterval);
  }
  state.uptime = 0;
  uptimeSpan.textContent = '0';
  state.uptimeInterval = setInterval(function () {
    if (!state.isPaused) {
      state.uptime++;
      uptimeSpan.textContent = state.uptime;
    }
  }, 1000);
}

/* ===== UI Updates ===== */
function updateUI() {
  const allBroken = state.brokenRoutes.has(1) && state.brokenRoutes.has(2) && state.brokenRoutes.has(3);
  break1Btn.disabled  = state.brokenRoutes.has(1) || state.isAutoDemo;
  break2Btn.disabled  = state.brokenRoutes.has(2) || state.isAutoDemo;
  restoreBtn.disabled = (state.brokenRoutes.size === 0) || state.isAutoDemo;
}

/* ===== Tooltip ===== */
function showTooltip(e, nodeId, routeId) {
  const node = document.getElementById('node-' + nodeId);
  if (!node) return;

  const isRouter   = node.classList.contains('node-router');
  const isFailed   = node.classList.contains('failed');
  const isActive   = node.classList.contains('active-route');
  const isStandby  = node.classList.contains('standby');

  let title = nodeId.charAt(0).toUpperCase() + nodeId.slice(1).replace(/-/g, ' ');
  let status = 'Operational';
  let routeInfo = '';

  if (isFailed) {
    status = 'Failed';
  } else if (isActive) {
    status = 'Active';
  } else if (isStandby) {
    status = 'Standby';
  }

  if (routeId) {
    const info = ROUTE_COLORS[routeId];
    routeInfo = 'Route ' + routeId + ' (' + info.name + ')';
  }

  tooltip.innerHTML = ''
    + '<div class="tooltip-title">' + title + '</div>'
    + '<div class="tooltip-status">Status: <strong>' + status + '</strong></div>'
    + (routeInfo ? '<div class="tooltip-route">' + routeInfo + '</div>' : '');

  tooltip.style.left = (e.clientX + 14) + 'px';
  tooltip.style.top  = (e.clientY - 10) + 'px';
  tooltip.classList.add('visible');
  tooltip.setAttribute('aria-hidden', 'false');

  const tr = tooltip.getBoundingClientRect();
  if (tr.right > window.innerWidth) {
    tooltip.style.left = (e.clientX - tr.width - 14) + 'px';
  }
  if (tr.bottom > window.innerHeight) {
    tooltip.style.top = (e.clientY - tr.height - 10) + 'px';
  }
}

function hideTooltip() {
  tooltip.classList.remove('visible');
  tooltip.setAttribute('aria-hidden', 'true');
}

/* ===== Node Hover / Focus ===== */
function setupNodeInteractions() {
  const nodes = document.querySelectorAll('.node');
  for (const n of nodes) {
    const nodeId  = n.getAttribute('data-id');
    const routeId = parseInt(n.getAttribute('data-route'), 10) || null;

    n.addEventListener('mouseenter', function (e) { showTooltip(e, nodeId, routeId); });
    n.addEventListener('mouseleave', hideTooltip);
    n.addEventListener('mousemove', function (e) {
      if (tooltip.classList.contains('visible')) {
        tooltip.style.left = (e.clientX + 14) + 'px';
        tooltip.style.top  = (e.clientY - 10) + 'px';
      }
    });

    n.addEventListener('focus', function (e) {
      const rect = n.getBoundingClientRect();
      showTooltip({ clientX: rect.left, clientY: rect.top }, nodeId, routeId);
    });
    n.addEventListener('blur', hideTooltip);
    n.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') { n.blur(); hideTooltip(); }
    });
  }
}

/* ===== Event Listeners ===== */
break1Btn.addEventListener('click', function () { breakRoute(1); });
break2Btn.addEventListener('click', function () { breakRoute(2); });
restoreBtn.addEventListener('click', restoreAll);

autoDemoBtn.addEventListener('click', function () {
  if (state.isAutoDemo) { stopAutoDemo(); updateUI(); }
  else { startAutoDemo(); }
});

pauseBtn.addEventListener('click', togglePause);
resetBtn.addEventListener('click', resetSimulation);

document.addEventListener('keydown', function (e) {
  if (e.key === ' ' && e.target === document.body) {
    e.preventDefault();
    togglePause();
  }
});

/* ===== Resize ===== */
let resizeTimer = null;
window.addEventListener('resize', function () {
  if (resizeTimer) clearTimeout(resizeTimer);
  resizeTimer = setTimeout(function () {
    setSvgSize();
    drawLines();
  }, 150);
});

/* ===== Init ===== */
function init() {
  setSvgSize();
  drawLines();
  createPacketElements();
  setupNodeInteractions();
  activateRoute(1);
  startUptime();
  updateUI();

  state.animFrameId = requestAnimationFrame(animate);
}

document.addEventListener('DOMContentLoaded', init);
