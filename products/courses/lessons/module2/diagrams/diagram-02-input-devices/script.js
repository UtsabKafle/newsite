(function () {
  'use strict';

  var state = {
    currentDevice: null,
    playing: false,
    tourIndex: 0,
    tourProgress: 0,
    rafId: null,
    lastTime: null
  };

  var DEVICE_IDS = ['device-keyboard', 'device-mouse', 'device-microphone', 'device-touchscreen'];
  var DEVICE_INFOS = {
    'device-keyboard': {
      name: 'Keyboard',
      desc: 'A keyboard sends keystroke data to the computer. Each key press generates a unique scan code that the CPU interprets as a character or command.'
    },
    'device-mouse': {
      name: 'Mouse',
      desc: 'A mouse tracks movement and button clicks. Optical sensors detect surface motion, and the computer translates this into cursor movement on screen.'
    },
    'device-microphone': {
      name: 'Microphone',
      desc: 'A microphone converts sound waves into electrical signals. An ADC (Analog-to-Digital Converter) turns these signals into digital data the computer can process.'
    },
    'device-touchscreen': {
      name: 'Touchscreen',
      desc: 'A touchscreen detects touch location using capacitive or resistive sensing. It sends coordinates to the computer, which maps them to on-screen actions.'
    }
  };

  var deviceEls = {};
  var infoTitle, infoDesc, statusText, playBtn, pauseBtn, resetBtn;

  function init() {
    infoTitle = document.getElementById('infoTitle');
    infoDesc = document.getElementById('infoDesc');
    statusText = document.querySelector('.info-panel');
    playBtn = document.getElementById('playBtn');
    pauseBtn = document.getElementById('pauseBtn');
    resetBtn = document.getElementById('resetBtn');

    DEVICE_IDS.forEach(function (id) {
      var el = document.getElementById(id);
      deviceEls[id] = el;
      el.addEventListener('click', function () { selectDevice(id); });
      el.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); selectDevice(id); }
      });
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

    resetDeviceUI();
  }

  function selectDevice(id) {
    if (state.playing) pause();
    state.currentDevice = id;
    clearActive();
    deviceEls[id].classList.add('active');
    var info = DEVICE_INFOS[id];
    infoTitle.textContent = info.name;
    infoDesc.textContent = info.desc;
    updateButtons();
  }

  function clearActive() {
    DEVICE_IDS.forEach(function (id) {
      deviceEls[id].classList.remove('active');
    });
  }

  function play() {
    if (state.playing) return;
    state.playing = true;
    state.tourProgress = 0;
    state.tourIndex = 0;
    state.lastTime = null;
    selectDevice(DEVICE_IDS[0]);
    updateUI();
    state.rafId = requestAnimationFrame(tourLoop);
  }

  function pause() {
    if (!state.playing) return;
    state.playing = false;
    if (state.rafId) { cancelAnimationFrame(state.rafId); state.rafId = null; }
    updateUI();
  }

  function reset() {
    if (state.rafId) { cancelAnimationFrame(state.rafId); state.rafId = null; }
    state.playing = false;
    state.tourIndex = 0;
    state.tourProgress = 0;
    resetDeviceUI();
  }

  function resetDeviceUI() {
    clearActive();
    state.currentDevice = null;
    infoTitle.textContent = 'Select a Device';
    infoDesc.textContent = 'Click on any input device above to learn about it.';
    updateButtons();
  }

  var TOUR_DURATION = 3000;

  function tourLoop(timestamp) {
    if (!state.playing) return;
    if (state.lastTime === null) { state.lastTime = timestamp; state.rafId = requestAnimationFrame(tourLoop); return; }
    var dt = timestamp - state.lastTime;
    state.lastTime = timestamp;
    state.tourProgress += dt / TOUR_DURATION;
    if (state.tourProgress >= 1) {
      state.tourProgress = 0;
      state.tourIndex++;
      if (state.tourIndex >= DEVICE_IDS.length) {
        state.playing = false;
        resetDeviceUI();
        updateUI();
        return;
      }
      selectDevice(DEVICE_IDS[state.tourIndex]);
    }
    state.rafId = requestAnimationFrame(tourLoop);
  }

  function updateUI() {
    updateButtons();
  }

  function updateButtons() {
    playBtn.disabled = state.playing;
    pauseBtn.disabled = !state.playing;
    resetBtn.disabled = state.currentDevice === null && !state.playing;
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
