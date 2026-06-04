(function () {
  'use strict';

  var state = { currentCable: '', step: -1, playing: false, timer: null };
  var playBtn, pauseBtn, resetBtn, statusText;
  var cableGroups = {};
  var CABLE_IDS = ['24pin', '8pin', 'sata-data', 'sata-power', 'front', 'usb', 'audio'];
  var CABLE_NAMES = {
    '24pin': '24-pin ATX (Main Power)',
    '8pin': '8-pin CPU Power',
    'sata-data': 'SATA Data',
    'sata-power': 'SATA Power',
    'front': 'Front Panel',
    'usb': 'USB Header',
    'audio': 'Audio Header'
  };

  function init() {
    playBtn = document.getElementById('playBtn');
    pauseBtn = document.getElementById('pauseBtn');
    resetBtn = document.getElementById('resetBtn');
    statusText = document.getElementById('statusText');

    CABLE_IDS.forEach(function (id) {
      var group = document.getElementById('cable-group-' + id);
      var cable = document.getElementById('cable-' + id);
      cableGroups[id] = { group: group, cable: cable };
      cable.addEventListener('click', function () { selectCable(id); });
      cable.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); selectCable(id); }
      });
      cable.setAttribute('tabindex', '0');
      cable.setAttribute('role', 'button');
      cable.setAttribute('aria-label', 'Highlight ' + CABLE_NAMES[id]);
    });

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

    updateButtons();
  }

  function selectCable(id) {
    if (state.playing) return;
    deselectAll();
    state.currentCable = id;
    var g = cableGroups[id];
    if (g) {
      g.cable.classList.add('active');
      g.group.classList.add('active');
    }
    statusText.innerHTML = '<strong>' + CABLE_NAMES[id] + '</strong> — click another cable or press Play';
    hideOthers(id);
  }

  function deselectAll() {
    state.currentCable = '';
    CABLE_IDS.forEach(function (id) {
      var g = cableGroups[id];
      if (g) {
        g.cable.classList.remove('active');
        g.group.classList.remove('active');
        g.cable.classList.remove('hidden');
      }
    });
  }

  function hideOthers(activeId) {
    CABLE_IDS.forEach(function (id) {
      if (id !== activeId) {
        var g = cableGroups[id];
        if (g) g.cable.classList.add('hidden');
      }
    });
  }

  function advanceStep() {
    state.step++;
    if (state.step >= CABLE_IDS.length) {
      if (state.timer) { clearInterval(state.timer); state.timer = null; }
      state.playing = false;
      statusText.innerHTML = '<strong>All cables connected!</strong> Clean cable management complete';
      updateButtons();
      return;
    }
    var id = CABLE_IDS[state.step];
    deselectAll();
    var g = cableGroups[id];
    if (g) {
      g.cable.classList.add('active');
      g.group.classList.add('active');
      hideOthers(id);
    }
    statusText.innerHTML = '<strong>Connecting:</strong> ' + CABLE_NAMES[id];
    updateButtons();
  }

  function play() {
    if (state.playing) return;
    state.playing = true;
    state.step = -1;
    deselectAll();
    CABLE_IDS.forEach(function (id) {
      var g = cableGroups[id];
      if (g) g.cable.classList.remove('hidden');
    });
    statusText.innerHTML = '<strong>Starting cable connection sequence...</strong>';
    advanceStep();
    state.timer = setInterval(advanceStep, 1200);
    updateButtons();
  }

  function pause() {
    if (!state.playing) return;
    state.playing = false;
    if (state.timer) { clearInterval(state.timer); state.timer = null; }
    var id = CABLE_IDS[state.step] || '';
    statusText.innerHTML = '<strong>Paused</strong> — ' + (id ? CABLE_NAMES[id] : 'ready');
    updateButtons();
  }

  function reset() {
    if (state.timer) { clearInterval(state.timer); state.timer = null; }
    state.playing = false;
    state.step = -1;
    deselectAll();
    CABLE_IDS.forEach(function (id) {
      var g = cableGroups[id];
      if (g) g.cable.classList.remove('hidden');
    });
    statusText.innerHTML = 'Press <strong>Play</strong> to see cables connect sequentially';
    updateButtons();
  }

  function updateButtons() {
    playBtn.disabled = state.playing;
    pauseBtn.disabled = !state.playing;
    resetBtn.disabled = state.step < 0 && !state.playing;
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
