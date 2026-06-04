(function () {
  'use strict';

  // === State ===
  const state = {
    running: false,
    tick: 0,
    animFrameId: null,
    blinkInterval: null,
    pulseInterval: null,
    temperature: 68,
    powerUsage: 8.2,
    tflops: 96.0,
    logCount: 0,
  };

  // === DOM Refs ===
  const btnPlay = document.getElementById('btnPlay');
  const btnPause = document.getElementById('btnPause');
  const btnReset = document.getElementById('btnReset');
  const statServers = document.getElementById('statServers');
  const statTflops = document.getElementById('statTflops');
  const statTemp = document.getElementById('statTemp');
  const statPower = document.getElementById('statPower');
  const activityList = document.getElementById('activityList');
  const fanLeft = document.getElementById('fanLeft');
  const fanRight = document.getElementById('fanRight');
  const fiberPulses = document.querySelectorAll('.fiber-pulse');
  const racks = document.querySelectorAll('.rack');
  const floatTooltip = document.getElementById('floatingTooltip');

  // === Utilities ===
  function padTime (n) {
    return String(n).padStart(2, '0');
  }

  function getTimestamp () {
    const m = Math.floor(state.tick / 60);
    const s = state.tick % 60;
    return padTime(m) + ':' + padTime(s);
  }

  function addLog (message) {
    state.logCount++;
    const li = document.createElement('li');
    li.className = 'activity-item';
    li.innerHTML = '<span class="time">' + getTimestamp() + '</span> ' + message;
    activityList.prepend(li);
    // Keep max 20
    while (activityList.children.length > 20) {
      activityList.removeChild(activityList.lastChild);
    }
  }

  // === Stats Update ===
  function updateStats () {
    statServers.textContent = racks.length;
    statTflops.innerHTML = state.tflops.toFixed(1);
    statTemp.innerHTML = Math.round(state.temperature) + '<span class="unit">°F</span>';
    statPower.textContent = state.powerUsage.toFixed(1);
  }

  // === Rack LED randomization ===
  function randomizeLEDs () {
    racks.forEach(function (rack) {
      const delay = Math.random() * 3;
      const duration = 1.5 + Math.random() * 2.5;
      const inner = rack.querySelector('.rack-inner');
      if (inner) {
        inner.style.setProperty('animation-delay', delay + 's', 'important');
      }
    });
  }

  // === Pulse Waves on Racks ===
  function triggerRandomPulse () {
    if (!state.running) return;
    const count = 3 + Math.floor(Math.random() * 6);
    const shuffled = Array.from(racks).sort(function () { return Math.random() - 0.5; });
    for (let i = 0; i < count && i < shuffled.length; i++) {
      shuffled[i].classList.add('pulse');
      setTimeout(function (el) {
        el.classList.remove('pulse');
      }, 2000, shuffled[i]);
    }
  }

  // === Simulate environment ===
  function simulateTick () {
    if (!state.running) return;
    state.tick++;

    // Temperature drifts
    if (state.tick % 5 === 0) {
      state.temperature += (Math.random() - 0.45) * 0.3;
      state.temperature = Math.max(64, Math.min(82, state.temperature));
    }

    // Power usage drifts
    if (state.tick % 10 === 0) {
      state.powerUsage += (Math.random() - 0.5) * 0.2;
      state.powerUsage = Math.max(6.0, Math.min(10.5, state.powerUsage));
    }

    // TFLOPS usage
    if (state.tick % 8 === 0) {
      state.tflops += (Math.random() - 0.5) * 1.2;
      state.tflops = Math.max(40, Math.min(120, state.tflops));
    }

    updateStats();

    // Periodic log messages
    if (state.tick % 15 === 0) {
      const msgs = [
        'Data throughput spike — 42 Gbps',
        'Rack ' + (Math.floor(Math.random() * 40) + 1) + ' temp normal',
        'Cooling efficiency at ' + (85 + Math.floor(Math.random() * 15)) + '%',
        'Latency check: ' + (0.3 + Math.random() * 0.4).toFixed(2) + 'ms',
        'Redundant link active on floor ' + (Math.floor(Math.random() * 4) + 1),
        'Power draw stable at ' + state.powerUsage.toFixed(1) + ' MW',
        'Cache flush complete on rack cluster',
        'HVAC damper adjustment applied',
      ];
      addLog(msgs[Math.floor(Math.random() * msgs.length)]);
    }
  }

  // === Main Loop ===
  function mainLoop () {
    if (!state.running) return;
    simulateTick();
    state.animFrameId = requestAnimationFrame(mainLoop);
  }

  // === Controls ===
  function play () {
    if (state.running) return;
    state.running = true;
    btnPlay.disabled = true;
    btnPause.disabled = false;

    // Start fans
    fanLeft.classList.add('active');
    fanRight.classList.add('active');

    // Start fiber pulses
    fiberPulses.forEach(function (fp) { fp.classList.add('active'); });

    // Start random blink enhancements
    state.blinkInterval = setInterval(function () {
      if (!state.running) return;
      // Toggle some LEDs
      const count = 4 + Math.floor(Math.random() * 8);
      const shuffled = Array.from(racks).sort(function () { return Math.random() - 0.5; });
      for (let i = 0; i < count && i < shuffled.length; i++) {
        shuffled[i].classList.toggle('active');
        setTimeout(function (el) { if (state.running) el.classList.remove('active'); }, 800 + Math.random() * 1200, shuffled[i]);
      }
    }, 1200);

    // Start pulsing data waves
    state.pulseInterval = setInterval(triggerRandomPulse, 1800);
    triggerRandomPulse();

    addLog('Animation started');
    addLog('All systems online');
    state.animFrameId = requestAnimationFrame(mainLoop);
  }

  function pause () {
    if (!state.running) return;
    state.running = false;
    btnPlay.disabled = false;
    btnPause.disabled = true;

    if (state.animFrameId) {
      cancelAnimationFrame(state.animFrameId);
      state.animFrameId = null;
    }
    clearInterval(state.blinkInterval);
    clearInterval(state.pulseInterval);
    state.blinkInterval = null;
    state.pulseInterval = null;

    fanLeft.classList.remove('active');
    fanRight.classList.remove('active');
    fiberPulses.forEach(function (fp) { fp.classList.remove('active'); });

    addLog('Animation paused');
  }

  function reset () {
    pause();
    state.tick = 0;
    state.temperature = 68;
    state.powerUsage = 8.2;
    state.tflops = 96.0;
    updateStats();

    // Clear activity log
    activityList.innerHTML = '';
    addLog('System initialized');
    addLog('All 40 racks online');
    addLog('Cooling at 100%');

    // Clear all rack states
    racks.forEach(function (rack) {
      rack.classList.remove('active', 'pulse');
    });

    btnPlay.disabled = false;
    btnPause.disabled = true;
  }

  // === Tooltips ===
  function showTooltip (e, text) {
    if (!text) return;
    floatTooltip.textContent = text;
    floatTooltip.classList.add('visible');
    const x = e.clientX + 14;
    const y = e.clientY + 14;
    const tw = floatTooltip.offsetWidth;
    const th = floatTooltip.offsetHeight;
    const maxX = window.innerWidth - tw - 8;
    const maxY = window.innerHeight - th - 8;
    floatTooltip.style.left = Math.min(x, maxX) + 'px';
    floatTooltip.style.top = Math.min(y, maxY) + 'px';
  }

  function hideTooltip () {
    floatTooltip.classList.remove('visible');
  }

  // Rack tooltips
  racks.forEach(function (rack) {
    var tip = rack.getAttribute('data-tooltip');
    if (!tip) return;

    rack.addEventListener('mouseenter', function (e) {
      showTooltip(e, tip);
    });
    rack.addEventListener('mousemove', function (e) {
      showTooltip(e, tip);
    });
    rack.addEventListener('mouseleave', hideTooltip);

    // Keyboard: show on focus, hide on blur
    rack.addEventListener('focus', function () {
      var rect = rack.getBoundingClientRect();
      showTooltip({ clientX: rect.left, clientY: rect.top }, tip);
    });
    rack.addEventListener('blur', hideTooltip);

    // Click to show more detail in log
    rack.addEventListener('click', function () {
      var id = this.getAttribute('data-rack') || 'unknown';
      addLog('Inspected rack #' + id + ' — all systems nominal');
    });

    rack.setAttribute('tabindex', '0');
    rack.setAttribute('role', 'button');
    rack.setAttribute('aria-label', tip);
  });

  // === Keyboard shortcuts ===
  document.addEventListener('keydown', function (e) {
    if (e.key === ' ' || e.key === 'Space') {
      e.preventDefault();
      if (state.running) { pause(); } else { play(); }
    }
    if (e.key === 'r' || e.key === 'R') {
      e.preventDefault();
      reset();
    }
  });

  // === Init ===
  randomizeLEDs();
  reset();

  // === Button Events ===
  btnPlay.addEventListener('click', play);
  btnPause.addEventListener('click', pause);
  btnReset.addEventListener('click', reset);

})();
