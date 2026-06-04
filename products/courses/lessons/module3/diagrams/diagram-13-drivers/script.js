(function () {
  'use strict';

  var state = { currentCat: '', step: -1, playing: false, timer: null, progTimer: null, progress: 0 };
  var playBtn, pauseBtn, resetBtn, statusText;
  var detailTitle, detailDesc, notifPopup, notifTitle, notifText;
  var categories = {}, progressEls = {}, progFill = {}, progText = {};

  var CAT_ORDER = ['display', 'network', 'sound', 'storage', 'chipset', 'usb', 'input'];
  var CAT_NAMES = {
    display: 'Display Adapters',
    network: 'Network Adapters',
    sound: 'Sound, video and game controllers',
    storage: 'Storage Controllers',
    chipset: 'System &amp; Chipset',
    usb: 'Universal Serial Bus (USB)',
    input: 'Keyboards &amp; Mice'
  };
  var CAT_SHORT = {
    display: 'Display Adapters',
    network: 'Network Adapters',
    sound: 'Sound Controllers',
    storage: 'Storage Controllers',
    chipset: 'Chipset',
    usb: 'USB Controllers',
    input: 'Input Devices'
  };

  var CAT_INFO = {
    display: 'Driver: NVIDIA GeForce Game Ready or AMD Adrenalin. Handles 2D/3D rendering, video playback, and GPU compute tasks. Essential for gaming and creative work.',
    network: 'Driver: Intel Ethernet / Wi-Fi adapter driver. Enables wired and wireless network connectivity. Without it, you cannot access the internet or LAN.',
    sound: 'Driver: Realtek / Intel Audio driver. Provides audio output through speakers/headphones and input through microphones. Includes HD Audio Manager.',
    storage: 'Driver: Intel RST (Rapid Storage Technology) or NVMe driver. Manages SATA and NVMe storage controllers for proper drive detection and performance.',
    chipset: 'Driver: Intel Chipset Driver or AMD Chipset Driver. Enables proper communication between CPU, RAM, PCIe, USB, and other system components.',
    usb: 'Driver: USB 3.0 eXtensible Host Controller. Enables USB ports to work at full speed and supports power management for connected devices.',
    input: 'Driver: HID (Human Interface Device) drivers. Supports keyboards, mice, touchpads, and other input devices. Usually handled automatically by Windows.'
  };

  function init() {
    playBtn = document.getElementById('playBtn');
    pauseBtn = document.getElementById('pauseBtn');
    resetBtn = document.getElementById('resetBtn');
    statusText = document.getElementById('statusText');
    detailTitle = document.getElementById('detailTitle');
    detailDesc = document.getElementById('detailDesc');
    notifPopup = document.getElementById('notifPopup');
    notifTitle = document.getElementById('notifTitle');
    notifText = document.getElementById('notifText');

    CAT_ORDER.forEach(function (cat) {
      categories[cat] = document.getElementById('cat-' + cat);
      progressEls[cat] = document.getElementById('progress-' + cat);
      progFill[cat] = document.getElementById('prog-' + cat + '-fill');
      progText[cat] = document.getElementById('prog-' + cat + '-text');

      categories[cat].addEventListener('click', function () { selectCategory(cat); });
      categories[cat].addEventListener('keydown', function (e) {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); selectCategory(cat); }
      });
      categories[cat].setAttribute('tabindex', '0');
      categories[cat].setAttribute('role', 'button');
      categories[cat].setAttribute('aria-label', 'View driver for ' + CAT_NAMES[cat]);
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

    resetAll();
    updateButtons();
  }

  function selectCategory(cat) {
    if (state.playing) return;
    state.currentCat = cat;
    CAT_ORDER.forEach(function (c) {
      categories[c].classList.toggle('active', c === cat);
    });
    detailTitle.textContent = CAT_NAMES[cat];
    detailDesc.textContent = CAT_INFO[cat];
    statusText.innerHTML = '<strong>' + CAT_SHORT[cat] + ':</strong> ' + CAT_INFO[cat].split('.')[0] + '.';
    updateButtons();
  }

  function showNotification(cat) {
    notifTitle.textContent = CAT_SHORT[cat] + ' driver installed';
    notifText.textContent = CAT_SHORT[cat] + ' driver installed successfully';
    notifPopup.classList.add('visible');
    setTimeout(function () {
      notifPopup.classList.remove('visible');
    }, 2000);
  }

  function animateProgress(cat, callback) {
    var p = 0;
    progressEls[cat].removeAttribute('display');
    var interval = setInterval(function () {
      p += Math.random() * 15 + 5;
      if (p >= 100) {
        p = 100;
        clearInterval(interval);
        progFill[cat].setAttribute('width', '96');
        progText[cat].textContent = '100%';
        setTimeout(function () {
          progressEls[cat].setAttribute('display', 'none');
          categories[cat].classList.remove('active');
          categories[cat].classList.add('done');
          showNotification(cat);
          if (callback) callback();
        }, 400);
      }
      progFill[cat].setAttribute('width', Math.round(p * 0.96));
      progText[cat].textContent = Math.round(p) + '%';
    }, 100);
    return interval;
  }

  function advanceStep() {
    if (state.progTimer) { clearInterval(state.progTimer); state.progTimer = null; }
    state.step++;
    if (state.step >= CAT_ORDER.length) {
      if (state.timer) { clearInterval(state.timer); state.timer = null; }
      state.playing = false;
      statusText.innerHTML = '<strong>All drivers installed!</strong> System is ready';
      updateButtons();
      return;
    }
    var cat = CAT_ORDER[state.step];
    selectCategory(cat);
    state.progTimer = animateProgress(cat, function () {
      if (state.playing && state.step < CAT_ORDER.length - 1) {
        // Timer already set to advance
      }
    });
    statusText.innerHTML = '<strong>Installing:</strong> ' + CAT_SHORT[cat] + ' driver...';
    updateButtons();
  }

  function play() {
    if (state.playing) return;
    state.playing = true;
    state.step = -1;
    resetAll();
    statusText.innerHTML = '<strong>Starting driver installation...</strong>';
    state.timer = setInterval(advanceStep, 2500);
    advanceStep();
    updateButtons();
  }

  function pause() {
    if (!state.playing) return;
    state.playing = false;
    if (state.timer) { clearInterval(state.timer); state.timer = null; }
    if (state.progTimer) { clearInterval(state.progTimer); state.progTimer = null; }
    statusText.innerHTML = '<strong>Paused</strong> — installation in progress';
    updateButtons();
  }

  function resetAll() {
    CAT_ORDER.forEach(function (cat) {
      categories[cat].classList.remove('active', 'done');
      progressEls[cat].setAttribute('display', 'none');
      if (progFill[cat]) progFill[cat].setAttribute('width', '0');
      if (progText[cat]) progText[cat].textContent = '0%';
    });
    notifPopup.classList.remove('visible');
    detailTitle.textContent = 'Select a driver category';
    detailDesc.textContent = 'Click any category on the left to see which driver is needed and what it does.';
  }

  function reset() {
    if (state.timer) { clearInterval(state.timer); state.timer = null; }
    if (state.progTimer) { clearInterval(state.progTimer); state.progTimer = null; }
    state.playing = false;
    state.step = -1;
    resetAll();
    statusText.innerHTML = 'Press <strong>Play</strong> to install all drivers sequentially';
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
