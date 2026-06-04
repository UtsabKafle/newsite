(function () {
  'use strict';

  var state = {
    activeDevice: null,
    playing: false,
    tourIndex: 0,
    tourProgress: 0,
    signalProgress: 0,
    rafId: null,
    lastTime: null
  };

  var DEVICE_IDS = ['monitor', 'speakers', 'printer', 'projector'];
  var DEVICE_INFOS = {
    monitor: { name: 'Monitor', desc: 'A monitor displays visual information from the computer. It receives a video signal (HDMI/DisplayPort) and renders it as pixels on the screen.', type: 'Visual Output' },
    speakers: { name: 'Speakers', desc: 'Speakers convert electrical audio signals into sound waves. A digital-to-analog converter (DAC) transforms the digital audio data into an analog signal.', type: 'Audio Output' },
    printer: { name: 'Printer', desc: 'A printer takes digital documents and produces physical copies. It receives print data and uses ink or toner to reproduce text and images on paper.', type: 'Hard Copy Output' },
    projector: { name: 'Projector', desc: 'A projector takes a video signal and projects it onto a large screen or wall. It uses lenses and bright light sources to magnify the image.', type: 'Visual Output' }
  };

  var DEVICE_COORDS = {
    monitor: { path: { x1: 220, y1: 240, x2: 330, y2: 240 } },
    speakers: { path: { x1: 220, y1: 240, x2: 520, y2: 240 } },
    printer: { path: { x1: 220, y1: 240, x2: 710, y2: 240 } },
    projector: { path: { x1: 220, y1: 240, x2: 900, y2: 240 } }
  };

  var deviceEls = {};
  var signalPaths = {};
  var signalParticle, calloutTitle, calloutDesc, calloutType, calloutDetail;
  var statusText, playBtn, pauseBtn, resetBtn;
  var allSignalPaths;

  function init() {
    statusText = document.getElementById('statusText');
    playBtn = document.getElementById('playBtn');
    pauseBtn = document.getElementById('pauseBtn');
    resetBtn = document.getElementById('resetBtn');
    signalParticle = document.getElementById('signal-particles').querySelector('.signal-particle');
    calloutTitle = document.getElementById('calloutTitle');
    calloutDesc = document.getElementById('calloutDesc');
    calloutType = document.getElementById('calloutType');
    calloutDetail = document.getElementById('calloutDetail');

    DEVICE_IDS.forEach(function (id) {
      var el = document.querySelector('[data-device="' + id + '"]');
      deviceEls[id] = el;
      el.addEventListener('click', function () { selectDevice(id); });
      el.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); selectDevice(id); }
      });
      signalPaths[id] = document.querySelector('.signal-path.' + id + '-path');
    });

    allSignalPaths = document.querySelectorAll('.signal-path');

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

  function selectDevice(id) {
    if (state.playing) { pause(); }
    state.activeDevice = id;
    clearActive();
    deviceEls[id].classList.add('active');
    var info = DEVICE_INFOS[id];
    calloutTitle.textContent = info.name;
    calloutDesc.textContent = info.desc;
    calloutType.textContent = info.type;
    state.signalProgress = 0;
    animateSignal(id);
    updateButtons();
  }

  function clearActive() {
    DEVICE_IDS.forEach(function (id) {
      deviceEls[id].classList.remove('active');
    });
    allSignalPaths.forEach(function (p) { p.classList.remove('active'); });
    signalParticle.classList.remove('active');
  }

  function animateSignal(id) {
    allSignalPaths.forEach(function (p) { p.classList.remove('active'); });
    signalParticle.classList.remove('active');
    var path = signalPaths[id];
    if (!path) return;
    path.classList.add('active');
    signalParticle.classList.add('active');
    var coords = DEVICE_COORDS[id].path;
    signalParticle.setAttribute('cx', coords.x2);
    signalParticle.setAttribute('cy', coords.y2);
  }

  function play() {
    if (state.playing) return;
    state.playing = true;
    state.tourIndex = 0;
    state.tourProgress = 0;
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
    state.activeDevice = null;
    state.signalProgress = 0;
    resetUI();
  }

  function resetUI() {
    clearActive();
    calloutTitle.textContent = 'Click an Output Device';
    calloutDesc.textContent = 'Click on any device to see how the computer sends it a signal.';
    calloutType.textContent = 'Output Device';
    statusText.innerHTML = 'Press <strong>Play</strong> to tour all output devices';
    updateButtons();
  }

  var TOUR_DURATION = 3500;

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
        resetUI();
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
    resetBtn.disabled = state.activeDevice === null && !state.playing;
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
