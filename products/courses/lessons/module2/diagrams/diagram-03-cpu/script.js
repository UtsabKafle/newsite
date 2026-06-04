(function () {
  'use strict';

  var state = {
    stage: 0,
    progress: 0,
    playing: false,
    rafId: null,
    lastTime: null,
    cycle: 1
  };

  var COMPONENTS = ['cu', 'alu', 'registers', 'cache'];
  var STAGE_DURATIONS = {
    'cu-bus': 1500,
    'cu-alu': 2000,
    'alu-registers': 2000,
    'registers-cache': 2000,
    'cache-bus': 1500
  };

  var STAGE_ORDER = ['cu-bus', 'cu-alu', 'alu-registers', 'registers-cache', 'cache-bus'];
  var STAGE_LABELS = {
    'cu-bus': 'Fetch: Data from Bus into Control Unit',
    'cu-alu': 'Decode &amp; Send: CU to ALU',
    'alu-registers': 'Execute: ALU to Registers',
    'registers-cache': 'Memory Access: Registers to Cache',
    'cache-bus': 'Writeback: Cache to Bus'
  };

  var componentEls = {};
  var dataPathEls = {};
  var dataPacket, pipelineHighlight;
  var statusText, cycleCounter, playBtn, pauseBtn, resetBtn;

  function init() {
    statusText = document.getElementById('statusText');
    cycleCounter = document.getElementById('cycleCounter');
    playBtn = document.getElementById('playBtn');
    pauseBtn = document.getElementById('pauseBtn');
    resetBtn = document.getElementById('resetBtn');
    dataPacket = document.getElementById('data-packet');

    COMPONENTS.forEach(function (c) {
      componentEls[c] = document.querySelector('[data-component="' + c + '"]');
    });

    var paths = document.querySelectorAll('.data-path');
    paths.forEach(function (p) {
      var cls = Array.from(p.classList).filter(function (c) { return c !== 'data-path'; })[0];
      dataPathEls[cls] = p;
    });

    pipelineHighlight = document.getElementById('pipelineHighlight');

    playBtn.addEventListener('click', play);
    pauseBtn.addEventListener('click', pause);
    resetBtn.addEventListener('click', reset);

    document.addEventListener('keydown', function (e) {
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
      if (e.key === ' ' || e.key === 'Spacebar') {
        e.preventDefault();
        if (state.playing) pause(); else play();
      }
    });

    resetUI();
  }

  function getStageDuration() {
    return STAGE_DURATIONS[STAGE_ORDER[state.stage]] || 2000;
  }

  function advanceStage() {
    if (state.stage >= STAGE_ORDER.length - 1) {
      state.stage = 0;
      state.progress = 0;
      state.cycle++;
      state.lastTime = null;
      updatePositions();
      if (state.playing) {
        state.rafId = requestAnimationFrame(animLoop);
      }
      updateUI();
      return;
    }
    state.stage++;
    state.progress = 0;
    state.lastTime = null;
    updatePositions();
    if (state.playing) {
      state.rafId = requestAnimationFrame(animLoop);
    }
    updateUI();
  }

  function play() {
    if (state.playing) return;
    state.playing = true;
    state.lastTime = null;
    if (state.stage === 0 && state.progress === 0) { state.cycle = 1; }
    updateUI();
    state.rafId = requestAnimationFrame(animLoop);
  }

  function pause() {
    if (!state.playing) return;
    state.playing = false;
    if (state.rafId) { cancelAnimationFrame(state.rafId); state.rafId = null; }
    updateUI();
  }

  function reset() {
    if (state.rafId) { cancelAnimationFrame(state.rafId); state.rafId = null; }
    state.stage = 0;
    state.progress = 0;
    state.playing = false;
    state.cycle = 1;
    state.lastTime = null;
    resetUI();
  }

  function resetUI() {
    COMPONENTS.forEach(function (c) { componentEls[c].classList.remove('active', 'completed'); });
    Object.keys(dataPathEls).forEach(function (k) { dataPathEls[k].classList.remove('active'); });
    dataPacket.classList.remove('active');
    if (pipelineHighlight) pipelineHighlight.setAttribute('transform', 'translate(0, 0)');
    statusText.innerHTML = 'Press <strong>Play</strong> to see data flow through the CPU';
    cycleCounter.textContent = '';
    updateButtons();
  }

  function animLoop(timestamp) {
    if (!state.playing) return;
    if (state.lastTime === null) { state.lastTime = timestamp; state.rafId = requestAnimationFrame(animLoop); return; }
    var dt = timestamp - state.lastTime;
    state.lastTime = timestamp;
    var dur = getStageDuration();
    state.progress += dt / dur;
    if (state.progress >= 1) {
      state.progress = 1;
      updatePositions();
      advanceStage();
      return;
    }
    updatePositions();
    state.rafId = requestAnimationFrame(animLoop);
  }

  var STAGE_PATHS = {
    'cu-bus': { from: 'bus', to: 'cu', path: ['cu-bus-path'] },
    'cu-alu': { from: 'cu', to: 'alu', path: ['cu-alu-path'] },
    'alu-registers': { from: 'alu', to: 'registers', path: ['alu-reg-path'] },
    'registers-cache': { from: 'registers', to: 'cache', path: ['reg-cache-path'] },
    'cache-bus': { from: 'cache', to: 'bus', path: ['cache-bus-path'] }
  };

  var STAGE_POSITIONS = {
    'cu-bus': { x: 140, y: 300 },
    'cu-alu': { x: 260, y: 140 },
    'alu-registers': { x: 500, y: 140 },
    'registers-cache': { x: 740, y: 140 },
    'cache-bus': { x: 860, y: 300 }
  };

  var PIPE_OFFSETS = { 'cu-bus': 0, 'cu-alu': 1, 'alu-registers': 2, 'registers-cache': 3, 'cache-bus': 4 };

  function updatePositions() {
    var stageName = STAGE_ORDER[state.stage];
    var p = state.progress;

    COMPONENTS.forEach(function (c) { componentEls[c].classList.remove('active', 'completed'); });
    Object.keys(dataPathEls).forEach(function (k) { dataPathEls[k].classList.remove('active'); });

    if (state.progress === 0 && state.stage === 0) {
      dataPacket.classList.remove('active');
      return;
    }

    dataPacket.classList.add('active');

    var stageInfo = STAGE_PATHS[stageName];
    var startPos = STAGE_POSITIONS[stageName];
    var nextStage = STAGE_ORDER[Math.min(state.stage + 1, STAGE_ORDER.length - 1)];
    var endPos = STAGE_POSITIONS[nextStage] || { x: 500, y: 140 };

    if (state.stage >= STAGE_ORDER.length - 1) {
      endPos = STAGE_POSITIONS['cu-bus'];
    }

    var ex = startPos.x + (endPos.x - startPos.x) * p;
    var ey = startPos.y + (endPos.y - startPos.y) * p;
    dataPacket.setAttribute('transform', 'translate(' + ex + ',' + ey + ')');

    stageInfo.path.forEach(function (pathKey) {
      if (dataPathEls[pathKey]) dataPathEls[pathKey].classList.add('active');
    });

    var activeComp = stageInfo.to;
    if (p > 0.5 && activeComp && componentEls[activeComp]) {
      componentEls[activeComp].classList.add('active');
    }
    var fromComp = stageInfo.from;
    if (fromComp && componentEls[fromComp]) {
      componentEls[fromComp].classList.add('completed');
    }

    if (pipelineHighlight) {
      var pipeIdx = PIPE_OFFSETS[stageName] || 0;
      var xOff = pipeIdx * 100;
      pipelineHighlight.setAttribute('transform', 'translate(' + xOff + ', 0)');
    }
  }

  function updateUI() {
    updateButtons();
    var stageName = STAGE_ORDER[state.stage];
    var label = STAGE_LABELS[stageName] || 'Processing...';
    if (state.stage === 0 && state.progress === 0 && !state.playing) {
      statusText.innerHTML = 'Press <strong>Play</strong> to see data flow through the CPU';
    } else if (state.playing) {
      statusText.innerHTML = '<strong>' + label + '</strong>';
    } else {
      statusText.innerHTML = '<strong>' + label + '</strong> (paused)';
    }
    cycleCounter.textContent = 'Cycle: ' + state.cycle;
  }

  function updateButtons() {
    playBtn.disabled = state.playing;
    pauseBtn.disabled = !state.playing;
    resetBtn.disabled = state.stage === 0 && state.progress === 0 && state.cycle === 1;
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
