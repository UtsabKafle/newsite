(function () {
  'use strict';
  var DEFAULT_DOMAIN = 'www.consicaacademy.com';
  var RESULT_IP = '192.0.2.1';
  var STEP_DELAY = 1400;
  var PACKET_DURATION = 500;
  var TOTAL_STEPS = 7;
  var stepInfo = {
    1: { title: 'Step 1: Browser Cache', heading: 'Browser checks its cache', body: 'Your browser stores recent DNS lookups locally in a temporary cache. If you have visited this domain recently, the IP address is already known and no lookup is needed \u2014 the page loads instantly. This is why your second visit to a site is often faster than the first.', status: 'Checking browser cache for a saved IP address\u2026', short: 'Checking local cache\u2026' },
    2: { title: 'Step 2: DNS Resolver', heading: 'DNS Resolver receives the query', body: 'Since the IP was not cached, your browser sends the domain name to a DNS Resolver (sometimes called a Recursive Resolver). This is typically provided by your Internet Service Provider (ISP) or a public DNS service like Google (8.8.8.8) or Cloudflare (1.1.1.1). The resolver is responsible for asking multiple DNS servers on your behalf.', status: 'Resolver received the query. Asking the Root DNS Server\u2026', short: 'Receiving your query\u2026' },
    3: { title: 'Step 3: Root DNS Server', heading: 'Root DNS Server', body: 'The DNS Resolver contacts one of 13 root server clusters (named A through M) that form the backbone of the global DNS system. Root servers don\u2019t know the exact IP address, but they know where to find the TLD (Top-Level Domain) servers. For your domain, the root server points to the .com TLD servers.', status: 'Root server found the .com TLD server. Forwarding\u2026', short: 'Looking up TLD records\u2026' },
    4: { title: 'Step 4: TLD Server (.com)', heading: 'TLD Server (.com)', body: 'The Top-Level Domain (TLD) server manages the .com extension. It maintains a registry of all domains ending in .com. When asked about consicaacademy.com, the TLD server checks its database and finds the nameservers responsible for this domain \u2014 these are the authoritative DNS servers.', status: '.com TLD server found the Authoritative Nameservers\u2026', short: 'Finding <span class="tld-highlight">.com</span> records\u2026' },
    5: { title: 'Step 5: Authoritative DNS Server', heading: 'Authoritative DNS Server', body: 'The Authoritative DNS Server is the final authority for the domain. It holds the actual DNS records \u2014 including the A record that maps the domain name to an IP address. When the resolver asks, the authoritative server responds with the exact IP address where the website is hosted.', status: 'Authoritative server found the A record. IP resolved\u2026', short: 'Retrieving IP address\u2026' },
    6: { title: 'Step 6: IP Address Found', heading: 'IP Address Found', body: 'The DNS Resolver now has the IP address! It sends this information back to your browser. The IP address ' + RESULT_IP + ' is the unique numeric identifier for the server hosting ' + DEFAULT_DOMAIN + '. The resolver may also cache this result so future lookups are instant.', status: 'IP address ' + RESULT_IP + ' resolved successfully!', short: 'Found IP: <span class="ip-display">' + RESULT_IP + '</span>' },
    7: { title: 'Step 7: Browser Connects', heading: 'Browser connects to the server', body: 'Armed with the IP address, your browser opens a direct connection to the web server at ' + RESULT_IP + '. It sends an HTTP request asking for the webpage. The server responds with the website data, and your browser renders the page you see. The DNS lookup is complete \u2014 all in under a second!', status: 'Browser connecting to server at ' + RESULT_IP + '\u2026', short: 'Establishing connection\u2026' }
  };
  var connections = [{ from: 1, to: 2 }, { from: 2, to: 3 }, { from: 3, to: 4 }, { from: 4, to: 5 }, { from: 5, to: 6 }, { from: 6, to: 7 }];
  var el = {};
  var state = { running: false, currentStep: 0, animTimer: null, packetRaf: null };
  function qs(sel) { return document.querySelector(sel); }
  function qsa(sel) { return document.querySelectorAll(sel); }
  function init() { cacheElements(); bindEvents(); drawConnections(); updateProgress(0); }
  function cacheElements() {
    el.domainInput = qs('#domainInput'); el.lookupBtn = qs('#lookupBtn'); el.resetBtn = qs('#resetBtn'); el.controlsForm = qs('#controlsForm'); el.diagramGrid = qs('#diagramGrid'); el.connectionsSvg = qs('#connectionsSvg'); el.packetsSvg = qs('#packetsSvg'); el.progressFill = qs('#progressFill'); el.stepCounter = qs('#stepCounter'); el.statusHeading = qs('#statusHeading'); el.statusBody = qs('#statusBody'); el.ipDisplay = qs('#ipDisplay'); el.infoSection = qs('#infoSection'); el.infoTitle = qs('#infoTitle'); el.infoBody = qs('#infoBody'); el.infoClose = qs('#infoClose'); el.statusCardIcon = qs('#statusCardIcon'); el.nodes = qsa('.step-node');
  }
  function bindEvents() {
    el.controlsForm.addEventListener('submit', function (e) { e.preventDefault(); startLookup(); });
    el.resetBtn.addEventListener('click', resetAll);
    el.domainInput.addEventListener('keydown', function (e) { if (e.key === 'Enter') { e.preventDefault(); startLookup(); } });
    el.nodes.forEach(function (node) {
      node.addEventListener('click', function () { showStepInfo(parseInt(node.getAttribute('data-step'), 10)); });
      node.addEventListener('keydown', function (e) { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); showStepInfo(parseInt(node.getAttribute('data-step'), 10)); } });
    });
    el.infoClose.addEventListener('click', function () { el.infoSection.hidden = true; });
    el.infoSection.addEventListener('keydown', function (e) { if (e.key === 'Escape') el.infoSection.hidden = true; });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && !el.infoSection.hidden) el.infoSection.hidden = true; });
    window.addEventListener('resize', debounce(function () { if (!state.running) drawConnections(); }, 250));
  }
  function startLookup() {
    if (state.running) return;
    var domain = el.domainInput.value.trim();
    if (!domain) { el.domainInput.value = DEFAULT_DOMAIN; domain = DEFAULT_DOMAIN; }
    resetAll(); state.running = true; el.lookupBtn.disabled = true; el.resetBtn.disabled = false;
    updateStatus('Starting DNS lookup for ' + domain + '\u2026', 'DNS Lookup'); enterStep(1);
  }
  function enterStep(stepId) {
    if (stepId > TOTAL_STEPS) { finishLookup(); return; }
    state.currentStep = stepId; var idx = stepId - 1;
    updateProgress(idx); setNodeCurrent(stepId); setNodeStatus(stepId, 'loading'); updateStatusBar(stepId);
    if (stepId === 6) el.ipDisplay.textContent = RESULT_IP;
    if (stepId === 7) updateStatus('Establishing secure connection\u2026', 'Browser Connects');
    state.animTimer = setTimeout(function () { if (!state.running) return; completeStep(stepId, stepId + 1); }, STEP_DELAY);
  }
  function completeStep(stepId, nextStep) {
    if (stepId >= 1) { setNodeComplete(stepId); setNodeStatus(stepId, 'check'); }
    if (nextStep > TOTAL_STEPS) { finishLookup(); return; }
    var conn = getConnection(stepId, nextStep);
    if (conn) { animatePacket(stepId, nextStep, function () { if (!state.running) return; markLineTraversed(stepId, nextStep); enterStep(nextStep); }); }
    else { enterStep(nextStep); }
  }
  function finishLookup() {
    state.running = false; el.lookupBtn.disabled = false; el.resetBtn.disabled = false;
    updateProgress(TOTAL_STEPS); updateStatus('DNS lookup complete! The browser connected to <strong>' + el.domainInput.value.trim() + '</strong> at <strong>' + RESULT_IP + '</strong>.', 'Complete \u2713');
  }
  function setNodeCurrent(stepId) {
    el.nodes.forEach(function (node) { var s = parseInt(node.getAttribute('data-step'), 10); node.classList.remove('is-current', 'is-complete', 'node-idle'); if (s === stepId) node.classList.add('is-current'); else if (s < stepId) node.classList.add('is-complete'); else node.classList.add('node-idle'); });
  }
  function setNodeComplete(stepId) {
    var node = qs('.step-node[data-step="' + stepId + '"]'); if (!node) return; node.classList.remove('is-current'); node.classList.add('is-complete');
  }
  function setNodeStatus(stepId, type) {
    var node = qs('.step-node[data-step="' + stepId + '"]'); if (!node) return; var icon = node.querySelector('.status-icon'); if (!icon) return; icon.className = 'status-icon status-' + type; icon.textContent = type === 'check' ? '\u2713' : type === 'cross' ? '\u2717' : '';
  }
  function getConnection(fromStep, toStep) { for (var i = 0; i < connections.length; i++) { if (connections[i].from === fromStep && connections[i].to === toStep) return connections[i]; } return null; }
  function markLineTraversed(fromStep, toStep) { var line = qs('.connection-line[data-from="' + fromStep + '"][data-to="' + toStep + '"]'); if (line) { line.classList.remove('is-active'); line.classList.add('is-traversed'); } }
  function drawConnections() {
    el.connectionsSvg.innerHTML = ''; el.packetsSvg.innerHTML = '';
    var stage = el.diagramGrid; var stageRect = stage.getBoundingClientRect();
    el.connectionsSvg.setAttribute('viewBox', '0 0 ' + stageRect.width + ' ' + stageRect.height);
    el.packetsSvg.setAttribute('viewBox', '0 0 ' + stageRect.width + ' ' + stageRect.height);
    connections.forEach(function (conn) {
      var fromNode = qs('.step-node[data-step="' + conn.from + '"]'); var toNode = qs('.step-node[data-step="' + conn.to + '"]'); if (!fromNode || !toNode) return;
      var fromRect = fromNode.getBoundingClientRect(); var toRect = toNode.getBoundingClientRect();
      var fx = fromRect.left - stageRect.left + fromRect.width / 2; var fy = fromRect.top - stageRect.top + fromRect.height / 2;
      var tx = toRect.left - stageRect.left + toRect.width / 2; var ty = toRect.top - stageRect.top + toRect.height / 2;
      var dx = tx - fx; var dy = ty - fy; var d;
      if (toNode.offsetLeft <= fromNode.offsetLeft) { var cx = fx + dx * 0.5; d = 'M' + fx + ',' + fy + ' Q' + cx + ',' + (fy + dy * 0.5) + ' ' + tx + ',' + ty; }
      else { d = 'M' + fx + ',' + fy + ' C' + (fx + dx * 0.3) + ',' + fy + ' ' + (tx - dx * 0.3) + ',' + ty + ' ' + tx + ',' + ty; }
      var path = document.createElementNS('http://www.w3.org/2000/svg', 'path'); path.setAttribute('d', d); path.setAttribute('class', 'connection-line'); path.setAttribute('data-from', conn.from); path.setAttribute('data-to', conn.to); el.connectionsSvg.appendChild(path);
    });
  }
  function animatePacket(fromStep, toStep, callback) {
    var linePath = qs('.connection-line[data-from="' + fromStep + '"][data-to="' + toStep + '"]'); if (!linePath) { if (callback) callback(); return; }
    linePath.classList.add('is-active');
    var ghostPath = document.createElementNS('http://www.w3.org/2000/svg', 'path'); ghostPath.setAttribute('d', linePath.getAttribute('d')); el.packetsSvg.appendChild(ghostPath);
    var length = ghostPath.getTotalLength(); var startTime = null;
    var defs = el.packetsSvg.querySelector('defs'); if (!defs) { defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs'); el.packetsSvg.appendChild(defs); }
    var filterId = 'glow-' + Date.now(); var filter = document.createElementNS('http://www.w3.org/2000/svg', 'filter'); filter.setAttribute('id', filterId);
    var blur = document.createElementNS('http://www.w3.org/2000/svg', 'feGaussianBlur'); blur.setAttribute('stdDeviation', '2.5'); blur.setAttribute('result', 'blur'); filter.appendChild(blur);
    var merge = document.createElementNS('http://www.w3.org/2000/svg', 'feMerge'); var mn1 = document.createElementNS('http://www.w3.org/2000/svg', 'feMergeNode'); mn1.setAttribute('in', 'blur'); var mn2 = document.createElementNS('http://www.w3.org/2000/svg', 'feMergeNode'); mn2.setAttribute('in', 'SourceGraphic'); merge.appendChild(mn1); merge.appendChild(mn2); filter.appendChild(merge); defs.appendChild(filter);
    var trail = document.createElementNS('http://www.w3.org/2000/svg', 'line'); trail.setAttribute('class', 'packet-trail'); el.packetsSvg.appendChild(trail);
    var packet = document.createElementNS('http://www.w3.org/2000/svg', 'circle'); packet.setAttribute('class', 'packet'); packet.setAttribute('r', '5'); packet.setAttribute('fill', '#0959C8'); packet.setAttribute('filter', 'url(#' + filterId + ')'); el.packetsSvg.appendChild(packet);
    function frame(timestamp) { if (!startTime) startTime = timestamp; var elapsed = timestamp - startTime; var progress = Math.min(elapsed / PACKET_DURATION, 1); var eased = easeInOutCubic(progress); var pos = ghostPath.getPointAtLength(eased * length); packet.setAttribute('cx', pos.x); packet.setAttribute('cy', pos.y); var trailLen = Math.min(40, length * 0.15); var trailEnd = Math.max(0, eased * length - trailLen); var trailStart = Math.max(0, trailEnd - trailLen); var p1 = ghostPath.getPointAtLength(trailStart); var p2 = ghostPath.getPointAtLength(trailEnd); trail.setAttribute('x1', p1.x); trail.setAttribute('y1', p1.y); trail.setAttribute('x2', p2.x); trail.setAttribute('y2', p2.y); if (progress < 1) { state.packetRaf = requestAnimationFrame(frame); } else { cleanup(); if (callback) callback(); } }
    function cleanup() { try { if (packet.parentNode) el.packetsSvg.removeChild(packet); if (trail.parentNode) el.packetsSvg.removeChild(trail); if (ghostPath.parentNode) el.packetsSvg.removeChild(ghostPath); if (filter.parentNode) defs.removeChild(filter); } catch (e) {} }
    state.packetRaf = requestAnimationFrame(frame);
  }
  function easeInOutCubic(t) { return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2; }
  function updateProgress(stepIndex) { var pct = stepIndex / TOTAL_STEPS * 100; el.progressFill.style.width = Math.min(pct, 100) + '%'; el.stepCounter.textContent = stepIndex; var dots = qsa('.progress-dot'); dots.forEach(function (dot, i) { dot.classList.toggle('is-active', i < stepIndex); }); }
  function updateStatusBar(stepId) {
    var info = stepInfo[stepId]; if (!info) return; el.statusHeading.textContent = info.heading; el.statusBody.innerHTML = info.status;
    var svg; if (stepId === 6) { svg = '<svg viewBox="0 0 24 24" width="24" height="24" aria-hidden="true"><circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" stroke-width="2"/><polyline points="8,12 11,15 16,9" fill="none" stroke="#22C55E" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/></svg>'; }
    else if (stepId === 7) { svg = '<svg viewBox="0 0 24 24" width="24" height="24" aria-hidden="true"><path d="M5 12h14M12 5l7 7-7 7" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>'; }
    else { svg = '<svg viewBox="0 0 24 24" width="24" height="24" aria-hidden="true"><circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" stroke-width="2"/><line x1="12" y1="8" x2="12" y2="16" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><line x1="8" y1="12" x2="16" y2="12" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>'; }
    el.statusCardIcon.innerHTML = svg;
  }
  function updateStatus(body, heading) { if (heading) el.statusHeading.textContent = heading; el.statusBody.innerHTML = body; }
  function showStepInfo(stepId) { var info = stepInfo[stepId]; if (!info) return; el.infoTitle.textContent = info.title; el.infoBody.innerHTML = '<strong>' + info.heading + '</strong><br><br>' + info.body; el.infoSection.hidden = false; el.infoSection.scrollIntoView({ behavior: 'smooth', block: 'nearest' }); el.infoClose.focus(); }
  function resetAll() {
    state.running = false; state.currentStep = 0;
    if (state.animTimer) { clearTimeout(state.animTimer); state.animTimer = null; }
    if (state.packetRaf) { cancelAnimationFrame(state.packetRaf); state.packetRaf = null; }
    el.lookupBtn.disabled = false; el.packetsSvg.innerHTML = ''; el.infoSection.hidden = true;
    el.nodes.forEach(function (node) { node.classList.remove('is-current', 'is-complete', 'is-error', 'node-idle'); });
    var lines = qsa('.connection-line'); lines.forEach(function (l) { l.classList.remove('is-active', 'is-traversed'); });
    el.nodes.forEach(function (node) { var icon = node.querySelector('.status-icon'); if (icon) { icon.className = 'status-icon status-pending'; icon.textContent = '?'; } });
    el.stepCounter.textContent = '0'; updateProgress(0); updateStatus('Type a domain name and click <strong>Lookup</strong> to see the DNS resolution process.', 'Ready'); el.ipDisplay.textContent = RESULT_IP; drawConnections();
  }
  function debounce(fn, ms) { var timer = null; return function () { var ctx = this, args = arguments; if (timer) clearTimeout(timer); timer = setTimeout(function () { fn.apply(ctx, args); timer = null; }, ms); }; }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();