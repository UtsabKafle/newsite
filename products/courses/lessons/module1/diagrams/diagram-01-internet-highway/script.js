(function () {
  'use strict';

  var nodes = [
    { id: 'home',      label: 'Home',       x: 80,   y: 60 },
    { id: 'school',    label: 'School',     x: 420,  y: 36 },
    { id: 'business',  label: 'Business',   x: 780,  y: 60 },
    { id: 'datacenter',label: 'Data Center',x: 420,  y: 264 },
    { id: 'phone',     label: 'Phone',      x: 120,  y: 468 },
    { id: 'tablet',    label: 'Tablet',     x: 720,  y: 468 },
  ];

  var nodeMap = {};
  nodes.forEach(function (n) { nodeMap[n.id] = n; });

  var edgeDefs = [
    { from: 'home',      to: 'school',     d: 'M80,60 Q250,36 420,36' },
    { from: 'school',    to: 'business',   d: 'M420,36 Q600,36 780,60' },
    { from: 'home',      to: 'datacenter', d: 'M80,60 Q80,162 420,264' },
    { from: 'school',    to: 'datacenter', d: 'M420,36 L420,264' },
    { from: 'business',  to: 'datacenter', d: 'M780,60 Q780,162 420,264' },
    { from: 'home',      to: 'phone',      d: 'M80,60 Q40,264 120,468' },
    { from: 'school',    to: 'phone',      d: 'M420,36 Q270,252 120,468' },
    { from: 'datacenter',to: 'phone',      d: 'M420,264 Q270,366 120,468' },
    { from: 'datacenter',to: 'tablet',     d: 'M420,264 Q570,366 720,468' },
    { from: 'business',  to: 'tablet',     d: 'M780,60 Q820,264 720,468' },
    { from: 'phone',     to: 'tablet',     d: 'M120,468 Q420,504 720,468' },
    { from: 'home',      to: 'business',   d: 'M80,60 Q430,130 780,60' },
    { from: 'school',    to: 'tablet',     d: 'M420,36 Q570,252 720,468' },
    { from: 'business',  to: 'phone',      d: 'M780,60 Q700,252 120,468' },
  ];

  var edges = [];
  var packets = [];
  var packetIdCounter = 0;
  var playing = false;
  var paused = false;
  var animId = null;
  var lastSpawn = 0;
  var spawnInterval = 1200;
  var speedMultiplier = 1;
  var totalPacketsSent = 0;
  var isReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  var mapSvg = document.getElementById('mapSvg');
  var roadsLayer = document.getElementById('roadsLayer');
  var packetsLayer = document.getElementById('packetsLayer');
  var playBtn = document.getElementById('playBtn');
  var pauseBtn = document.getElementById('pauseBtn');
  var resetBtn = document.getElementById('resetBtn');
  var statusText = document.getElementById('statusText');
  var statusDot = document.getElementById('statusDot');
  var packetCountEl = document.getElementById('packetCount');
  var activeCountEl = document.getElementById('activeCount');
  var speedSlider = document.getElementById('speedSlider');
  var speedValue = document.getElementById('speedValue');

  function buildRoads() {
    edgeDefs.forEach(function (ed, i) {
      var id = 'edge-' + i;
      var glow = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      glow.setAttribute('d', ed.d);
      glow.setAttribute('class', 'road-path-glow');
      glow.setAttribute('id', id + '-glow');
      roadsLayer.appendChild(glow);

      var road = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      road.setAttribute('d', ed.d);
      road.setAttribute('class', 'road-path');
      road.setAttribute('id', id);
      roadsLayer.appendChild(road);

      var dash = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      dash.setAttribute('d', ed.d);
      dash.setAttribute('class', 'road-dash');
      dash.setAttribute('id', id + '-dash');
      roadsLayer.appendChild(dash);

      edges.push({
        id: id,
        from: ed.from,
        to: ed.to,
        d: ed.d,
        path: road,
        length: road.getTotalLength(),
      });
    });
  }

  function getRandomEdge() {
    return edges[Math.floor(Math.random() * edges.length)];
  }

  function getNodeEl(id) {
    return document.getElementById('node-' + id);
  }

  function glowNode(id, type) {
    var el = getNodeEl(id);
    if (!el) return;
    el.classList.remove('send', 'receive');
    void el.offsetWidth;
    el.classList.add(type || 'receive');
    setTimeout(function () {
      el.classList.remove('send', 'receive');
    }, type === 'send' ? 600 : 400);
  }

  function spawnPacket() {
    if (!playing || paused || isReducedMotion) return;
    var edge = getRandomEdge();
    var fromNode = nodeMap[edge.from];
    var toNode = nodeMap[edge.to];
    var color = getNodeColor(edge.from);
    var id = 'pkt-' + (packetIdCounter++);

    var g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    g.setAttribute('id', id);
    g.setAttribute('class', 'packet');

    var trail = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    trail.setAttribute('class', 'packet-trail');
    trail.setAttribute('stroke', color);
    g.appendChild(trail);

    var dot = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    dot.setAttribute('class', 'packet-dot');
    dot.setAttribute('fill', color);
    g.appendChild(dot);

    packetsLayer.appendChild(g);

    glowNode(edge.from, 'send');

    packets.push({
      id: id,
      edge: edge,
      progress: 0,
      speed: 0.002 + Math.random() * 0.003,
      g: g,
      dot: dot,
      trail: trail,
      from: edge.from,
      to: edge.to,
      color: color,
      fromLabel: fromNode.label,
      toLabel: toNode.label,
    });

    totalPacketsSent++;
    updateStats();
    updateStatus('Packet traveling from <strong>' + fromNode.label + '</strong> to <strong>' + toNode.label + '</strong>');
  }

  function getNodeColor(id) {
    var map = {
      home: '#FF6B6B',
      school: '#FFD93D',
      business: '#6BCB77',
      datacenter: '#4D96FF',
      phone: '#C084FC',
      tablet: '#F472B6',
    };
    return map[id] || '#4FC3F7';
  }

  function removePacket(pkt) {
    if (pkt.g && pkt.g.parentNode) {
      pkt.g.parentNode.removeChild(pkt.g);
    }
    glowNode(pkt.to, 'receive');
    var idx = packets.indexOf(pkt);
    if (idx !== -1) packets.splice(idx, 1);
    updateStats();
  }

  function clearAllPackets() {
    packets.forEach(function (pkt) {
      if (pkt.g && pkt.g.parentNode) {
        pkt.g.parentNode.removeChild(pkt.g);
      }
    });
    packets = [];
    totalPacketsSent = 0;
    updateStats();
    updateStatus('Press <strong>Play</strong> to see data packets travel across the Internet Highway');
  }

  function animate(timestamp) {
    if (!playing) return;

    if (!paused) {
      if (!lastSpawn) lastSpawn = timestamp;
      var effectiveInterval = spawnInterval / speedMultiplier;
      if (timestamp - lastSpawn >= effectiveInterval) {
        spawnPacket();
        lastSpawn = timestamp;
      }

      var done = [];
      for (var i = 0; i < packets.length; i++) {
        var pkt = packets[i];
        pkt.progress += pkt.speed * speedMultiplier;
        if (pkt.progress >= 1) {
          pkt.progress = 1;
          done.push(pkt);
        }
        var len = pkt.edge.length;
        var pt = pkt.edge.path.getPointAtLength(pkt.progress * len);
        pkt.dot.setAttribute('cx', pt.x);
        pkt.dot.setAttribute('cy', pt.y);

        var trailLen = Math.min(40, pkt.progress * len);
        var trailStart = Math.max(0, pkt.progress * len - trailLen);
        var trailD = '';
        if (pkt.progress > 0.01) {
          try {
            var pt2 = pkt.edge.path.getPointAtLength(trailStart);
            trailD = 'M' + pt2.x + ',' + pt2.y + ' L' + pt.x + ',' + pt.y;
          } catch (e) {
            trailD = 'M' + pt.x + ',' + pt.y + ' L' + pt.x + ',' + pt.y;
          }
        } else {
          trailD = 'M' + pt.x + ',' + pt.y + ' L' + pt.x + ',' + pt.y;
        }
        pkt.trail.setAttribute('d', trailD);
      }

      done.forEach(function (pkt) {
        removePacket(pkt);
      });

      if (packets.length === 0 && done.length > 0) {
        updateStatus('All packets delivered. Sending more...');
      }

      updateStats();
    }

    animId = requestAnimationFrame(animate);
  }

  function start() {
    if (playing) return;
    playing = true;
    paused = false;
    lastSpawn = 0;
    playBtn.disabled = true;
    pauseBtn.disabled = false;
    statusDot.className = 'status-dot active';
    if (packets.length === 0) {
      spawnPacket();
    }
    animId = requestAnimationFrame(animate);
  }

  function pause() {
    if (!playing) return;
    paused = !paused;
    if (paused) {
      pauseBtn.innerHTML = '<svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18"><polygon points="5 3 19 12 5 21 5 3"/></svg><span>Resume</span>';
      statusDot.className = 'status-dot paused';
      updateStatus('Paused — <strong>' + packets.length + '</strong> packet(s) in transit');
    } else {
      pauseBtn.innerHTML = '<svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18"><rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/></svg><span>Pause</span>';
      statusDot.className = 'status-dot active';
      lastSpawn = 0;
      updateStatus('Resumed');
    }
  }

  function reset() {
    playing = false;
    paused = false;
    if (animId) {
      cancelAnimationFrame(animId);
      animId = null;
    }
    playBtn.disabled = false;
    pauseBtn.disabled = true;
    pauseBtn.innerHTML = '<svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18"><rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/></svg><span>Pause</span>';
    statusDot.className = 'status-dot';
    clearAllPackets();
    lastSpawn = 0;
  }

  function updateStatus(msg) {
    statusText.innerHTML = msg;
  }

  function updateStats() {
    packetCountEl.textContent = totalPacketsSent;
    activeCountEl.textContent = packets.length;
  }

  function handleSpeedChange() {
    speedMultiplier = parseFloat(speedSlider.value);
    speedValue.textContent = speedMultiplier.toFixed(speedMultiplier % 1 === 0 ? 0 : 2).replace('.00', '') + 'x';
  }

  function reduceMotionChange(e) {
    isReducedMotion = e.matches;
    if (isReducedMotion) reset();
  }

  playBtn.addEventListener('click', start);
  pauseBtn.addEventListener('click', pause);
  resetBtn.addEventListener('click', reset);
  speedSlider.addEventListener('input', handleSpeedChange);

  var motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
  motionQuery.addEventListener('change', reduceMotionChange);
  isReducedMotion = motionQuery.matches;

  buildRoads();
  handleSpeedChange();
  updateStats();
  pauseBtn.disabled = true;

})();
