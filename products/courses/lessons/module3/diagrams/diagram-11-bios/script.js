(function () {
  'use strict';

  var state = { currentMenu: 'boot', playing: false, step: -1, timer: null };
  var playBtn, pauseBtn, resetBtn, statusText;
  var postBarFill, postText;
  var settingsTitle, menuItems = {};
  var moboHighlights = {};

  var MENU_DATA = {
    boot: {
      title: 'Boot Order',
      settings: [
        { label: 'Boot Option #1', value: 'NVMe SSD' },
        { label: 'Boot Option #2', value: 'SATA HDD' },
        { label: 'Boot Option #3', value: 'USB Drive' },
        { label: 'Fast Boot', value: 'Enabled', cls: 'settings-enabled' },
        { label: 'CSM (Compatibility)', value: 'Disabled', cls: 'settings-disabled' },
        { label: 'Boot Override', value: '[Select]', highlight: '#0959C8' }
      ],
      moboHighlight: 'mobo-storage',
      desc: 'Controls the order in which storage devices are checked for an operating system. Set your OS drive as #1 for fastest boot.'
    },
    cpu: {
      title: 'CPU Settings',
      settings: [
        { label: 'Intel Turbo Boost', value: 'Auto' },
        { label: 'Core Ratio', value: 'Auto' },
        { label: 'AVX Offset', value: '0' },
        { label: 'CPU Voltage', value: 'Auto' },
        { label: 'C-States', value: 'Enabled', cls: 'settings-enabled' },
        { label: 'Hyper-Threading', value: 'Enabled', cls: 'settings-enabled' }
      ],
      moboHighlight: 'mobo-cpu',
      desc: 'Configure CPU performance features. Leave on Auto for normal use; adjust for overclocking only with adequate cooling.'
    },
    ram: {
      title: 'Memory / XMP',
      settings: [
        { label: 'XMP Profile', value: 'Profile #1', cls: 'settings-enabled' },
        { label: 'DRAM Frequency', value: '3600 MHz' },
        { label: 'DRAM Voltage', value: '1.35V' },
        { label: 'CAS Latency', value: '18' },
        { label: 'Command Rate', value: '2T' },
        { label: 'Memory Remap', value: 'Enabled', cls: 'settings-enabled' }
      ],
      moboHighlight: 'mobo-ram',
      desc: 'Enable XMP (Extreme Memory Profile) to run RAM at its rated speed. Without XMP, RAM runs at default JEDEC speeds.'
    },
    fan: {
      title: 'Fan Control',
      settings: [
        { label: 'CPU Fan Profile', value: 'Standard' },
        { label: 'Chassis Fan 1', value: 'Silent' },
        { label: 'Chassis Fan 2', value: 'Standard' },
        { label: 'Chassis Fan 3', value: 'Standard' },
        { label: 'Pump Control', value: 'Full Speed', cls: 'settings-enabled' },
        { label: 'Fan Stop (Low Temp)', value: 'Disabled', cls: 'settings-disabled' }
      ],
      moboHighlight: 'mobo-fan',
      desc: 'Set fan speed curves. Standard balances noise and cooling. Silent prioritizes low noise. Full Speed for liquid pumps.'
    },
    secure: {
      title: 'Secure Boot',
      settings: [
        { label: 'Secure Boot State', value: 'Enabled', cls: 'settings-enabled' },
        { label: 'OS Type', value: 'Windows UEFI' },
        { label: 'Key Management', value: 'Standard' },
        { label: 'Platform Key (PK)', value: 'Loaded' },
        { label: 'Secure Boot Mode', value: 'Standard' },
        { label: 'Reset to Setup Mode', value: '[Clear Keys]', highlight: '#EF4444' }
      ],
      moboHighlight: 'mobo-chipset',
      desc: 'Secure Boot ensures only signed, trusted OS bootloaders can run. Required for Windows 11 and enhances boot security.'
    }
  };

  var MENU_ORDER = ['boot', 'cpu', 'ram', 'fan', 'secure'];
  var MENU_NAMES = { boot: 'Boot Order', cpu: 'CPU Settings', ram: 'RAM / XMP', fan: 'Fan Control', secure: 'Secure Boot' };

  function init() {
    playBtn = document.getElementById('playBtn');
    pauseBtn = document.getElementById('pauseBtn');
    resetBtn = document.getElementById('resetBtn');
    statusText = document.getElementById('statusText');
    postBarFill = document.getElementById('postBarFill');
    postText = document.getElementById('postText');
    settingsTitle = document.getElementById('settingsTitle');

    MENU_ORDER.forEach(function (key) {
      menuItems[key] = document.getElementById('menu-' + key);
      moboHighlights[key] = document.getElementById(MENU_DATA[key].moboHighlight);
      menuItems[key].addEventListener('click', function () { selectMenu(key); });
      menuItems[key].addEventListener('keydown', function (e) {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); selectMenu(key); }
      });
      menuItems[key].setAttribute('tabindex', '0');
      menuItems[key].setAttribute('role', 'button');
      menuItems[key].setAttribute('aria-label', 'Open ' + MENU_NAMES[key] + ' settings');
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

    selectMenu('boot');
    updateButtons();
  }

  function selectMenu(key) {
    if (state.playing) return;
    state.currentMenu = key;
    var data = MENU_DATA[key];
    if (!data) return;

    // Update menu highlights
    MENU_ORDER.forEach(function (k) {
      menuItems[k].classList.toggle('active', k === key);
      if (moboHighlights[k]) moboHighlights[k].classList.remove('visible');
    });
    if (moboHighlights[key]) moboHighlights[key].classList.add('visible');

    // Update settings panel
    settingsTitle.textContent = data.title;
    var panel = document.getElementById('settings-panel');
    var y = 114;
    data.settings.forEach(function (s) {
      // Clear existing
      // We'll just update text nodes
    });

    // Simple update by rebuilding text content
    var labels = panel.querySelectorAll('.settings-label');
    var values = panel.querySelectorAll('.settings-value, .settings-enabled, .settings-disabled');
    data.settings.forEach(function (s, i) {
      if (labels[i]) labels[i].textContent = s.label;
      if (values[i]) {
        values[i].textContent = s.value;
        values[i].setAttribute('class', s.cls || 'settings-value');
        if (s.highlight) values[i].setAttribute('fill', s.highlight);
      }
    });

    statusText.innerHTML = '<strong>' + data.title + ':</strong> ' + data.desc;
  }

  function advanceStep() {
    state.step++;
    if (state.step >= MENU_ORDER.length) {
      if (state.timer) { clearInterval(state.timer); state.timer = null; }
      state.playing = false;
      postBarFill.setAttribute('width', '936');
      postText.textContent = 'POST complete — System ready';
      statusText.innerHTML = '<strong>Setup complete!</strong> All BIOS settings configured';
      updateButtons();
      return;
    }
    var key = MENU_ORDER[state.step];
    selectMenu(key);
    var pct = ((state.step + 1) / MENU_ORDER.length) * 100;
    postBarFill.setAttribute('width', Math.round(pct * 9.36));
    postText.textContent = 'POST — ' + Math.round(pct) + '% complete — Configuring ' + MENU_NAMES[key];
    updateButtons();
  }

  function play() {
    if (state.playing) return;
    state.playing = true;
    state.step = -1;
    postBarFill.setAttribute('width', '0');
    statusText.innerHTML = '<strong>Auto-navigating BIOS setup...</strong>';
    advanceStep();
    state.timer = setInterval(advanceStep, 1800);
    updateButtons();
  }

  function pause() {
    if (!state.playing) return;
    state.playing = false;
    if (state.timer) { clearInterval(state.timer); state.timer = null; }
    statusText.innerHTML = '<strong>Paused</strong> — ' + (MENU_DATA[state.currentMenu] ? MENU_DATA[state.currentMenu].title : '');
    updateButtons();
  }

  function reset() {
    if (state.timer) { clearInterval(state.timer); state.timer = null; }
    state.playing = false;
    state.step = -1;
    postBarFill.setAttribute('width', '0');
    postText.textContent = 'POST — Press DEL/F2 to enter BIOS';
    selectMenu('boot');
    statusText.innerHTML = 'Press <strong>Play</strong> for auto-navigate first-boot setup';
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
