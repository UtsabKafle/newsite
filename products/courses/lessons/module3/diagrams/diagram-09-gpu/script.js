(function () {
  'use strict';

  var state = { step: -1, playing: false, timer: null };
  var playBtn, pauseBtn, resetBtn, statusText, infoPanel, infoTitle, infoDesc;
  var stepEls = {}, gpuCard, powerCables;
  var STEP_COUNT = 5;

  var COMPONENT_INFO = {
    'motherboard': 'Motherboard — The main circuit board. The PCIe x16 slot is the primary interface for graphics cards, offering 16 lanes of high-speed data transfer.',
    'gpu': 'Graphics Card (GPU) — A dedicated processor for rendering images and video. Modern GPUs are powerful computing devices with their own memory (VRAM) and cooling.',
    'gpu-die': 'GPU Die — The actual processor chip at the heart of the graphics card. Contains billions of transistors that handle parallel rendering calculations.',
    'vram': 'VRAM (Video RAM) — Dedicated memory chips on the GPU that store textures, frame buffers, and other graphics data. GDDR6 and GDDR6X are current standards.',
    'cooler': 'Heatsink — A metal fin array with heat pipes that draws heat away from the GPU die. Most designs use copper heat pipes and aluminum fins for efficient thermal transfer.',
    'gpu-fans': 'Cooling Fans — Axial fans on the graphics card that push air through the heatsink fins. Many GPUs have a zero-RPM mode where fans stop at low temperatures.',
    'power-connectors': 'PCIe Power Connectors — 6-pin or 8-pin (6+2) connectors that supply additional power beyond what the PCIe slot provides. An 8-pin delivers up to 150W.'
  };

  var STEP_LABELS = [
    'Align GPU with PCIe slot',
    'Insert firmly until you hear a click',
    'Secure the bracket to the case with screws',
    'Connect PCIe power cables from the PSU',
    'Install the latest GPU drivers'
  ];

  function init() {
    playBtn = document.getElementById('playBtn');
    pauseBtn = document.getElementById('pauseBtn');
    resetBtn = document.getElementById('resetBtn');
    statusText = document.getElementById('statusText');
    infoPanel = document.getElementById('infoPanel');
    infoTitle = document.getElementById('infoTitle');
    infoDesc = document.getElementById('infoDesc');
    gpuCard = document.getElementById('gpu-card');
    powerCables = document.querySelectorAll('.power-cable');

    for (var i = 0; i < STEP_COUNT; i++) {
      stepEls[i] = document.getElementById('step' + i);
    }

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

    // Click components
    document.querySelectorAll('[data-component]').forEach(function (el) {
      el.addEventListener('click', function () {
        var key = el.getAttribute('data-component');
        showInfo(key);
      });
      el.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          var key = el.getAttribute('data-component');
          showInfo(key);
        }
      });
      if (!el.getAttribute('tabindex')) {
        el.setAttribute('tabindex', '0');
        el.setAttribute('role', 'button');
        el.setAttribute('aria-label', 'Show info for ' + el.getAttribute('data-component'));
      }
    });

    // Click install steps
    for (var j = 0; j < STEP_COUNT; j++) {
      stepEls[j].addEventListener('click', makeStepHandler(j));
      stepEls[j].setAttribute('tabindex', '0');
      stepEls[j].setAttribute('role', 'button');
      stepEls[j].setAttribute('aria-label', 'View step: ' + STEP_LABELS[j]);
    }

    updateUI();
  }

  function makeStepHandler(idx) {
    return function () {
      showStepInfo(idx);
    };
  }

  function showInfo(key) {
    var data = COMPONENT_INFO[key];
    if (!data) return;
    infoTitle.textContent = key.replace(/-/g, ' ').replace(/\b\w/g, function (c) { return c.toUpperCase(); });
    infoDesc.textContent = data;
    infoPanel.classList.add('visible');
  }

  function showStepInfo(idx) {
    infoTitle.textContent = 'Step ' + (idx + 1) + ': ' + STEP_LABELS[idx];
    infoDesc.textContent = getStepDetail(idx);
    infoPanel.classList.add('visible');
  }

  function getStepDetail(idx) {
    var details = [
      'Line up the GPU with the PCIe x16 slot on the motherboard. Make sure the bracket aligns with the case opening and the PCIe latch is open.',
      'Press down firmly and evenly on the GPU until the PCIe latch clicks into place. Do not rock or tilt the card.',
      'Use the included screws to fasten the GPU bracket to the case. This prevents sagging and ensures proper grounding.',
      'Attach the PCIe power cables from your power supply to the GPU. Use separate cables for each connector if possible, not daisy chains.',
      'Download the latest drivers from NVIDIA, AMD, or Intel. Run the installer and choose "Clean Installation" for best results.'
    ];
    return details[idx] || '';
  }

  function advanceStep() {
    state.step++;
    if (state.step >= STEP_COUNT) {
      state.step = STEP_COUNT - 1;
      if (state.playing) {
        clearInterval(state.timer);
        state.playing = false;
        statusText.innerHTML = '<strong>Installation complete!</strong> GPU is ready';
        updateButtons();
        return;
      }
    }
    updateUI();
  }

  function play() {
    if (state.playing) return;
    if (state.step >= STEP_COUNT - 1) {
      resetSteps();
    }
    state.playing = true;
    state.step = -1;
    infoPanel.classList.remove('visible');
    updateUI();
    state.timer = setInterval(function () {
      advanceStep();
    }, 1500);
    statusText.innerHTML = '<strong>Installing GPU...</strong>';
    updateButtons();
  }

  function pause() {
    if (!state.playing) return;
    state.playing = false;
    if (state.timer) { clearInterval(state.timer); state.timer = null; }
    statusText.innerHTML = '<strong>Paused</strong> — step ' + (state.step + 1) + ' of ' + STEP_COUNT;
    updateButtons();
  }

  function reset() {
    if (state.timer) { clearInterval(state.timer); state.timer = null; }
    state.playing = false;
    resetSteps();
    statusText.innerHTML = 'Press <strong>Play</strong> to see GPU installation animation';
    updateButtons();
  }

  function resetSteps() {
    state.step = -1;
    for (var i = 0; i < STEP_COUNT; i++) {
      stepEls[i].classList.remove('active', 'done');
    }
    gpuCard.style.transform = '';
    gpuCard.style.transition = '';
    powerCables.forEach(function (c) { c.classList.remove('active'); });
  }

  function updateUI() {
    for (var i = 0; i < STEP_COUNT; i++) {
      stepEls[i].classList.remove('active', 'done');
      if (i < state.step) stepEls[i].classList.add('done');
      if (i === state.step) stepEls[i].classList.add('active');
    }
    if (state.step >= 3) {
      powerCables.forEach(function (c) { c.classList.add('active'); });
    } else {
      powerCables.forEach(function (c) { c.classList.remove('active'); });
    }
    if (state.step >= 0) {
      statusText.innerHTML = '<strong>Step ' + (state.step + 1) + ':</strong> ' + STEP_LABELS[state.step];
    }
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
