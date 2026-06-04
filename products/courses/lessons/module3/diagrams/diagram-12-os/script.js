(function () {
  'use strict';

  var state = { stage: 0, playing: false, timer: null, copyInterval: null, copyProgress: 0 };
  var playBtn, pauseBtn, resetBtn, statusText;
  var stageContents = {}, stageNodes = {}, stageConns = {};
  var copyProgress, copyPercent, overallProgress, overallProgressText;
  var STAGE_COUNT = 8;

  var STAGE_NAMES = [
    'Boot from USB',
    'Language Select',
    'Install Now',
    'License Agreement',
    'Drive Selection',
    'Partitioning',
    'Copying Files',
    'Setup Complete'
  ];

  var STAGE_DETAILS = [
    'Insert the bootable USB drive and restart. Press the boot menu key (F12, F11, or ESC) and select the USB drive to start the installer.',
    'Choose your language, time/currency format, and keyboard layout. Click Next to proceed to the installation screen.',
    'Click "Install Now" to begin. If upgrading, select "Upgrade" to keep your files. For a fresh install, choose "Custom installation."',
    'Read and accept the Microsoft Software License Terms. You must accept to continue with the installation.',
    'Select the drive where Windows will be installed. An NVMe SSD is recommended for the OS drive for best performance.',
    'The installer creates System Reserved and Primary partitions automatically. Click Format to clean a drive, then Next.',
    'Windows copies installation files to the selected drive. This is the longest phase — typically 5-20 minutes depending on drive speed.',
    'The system restarts and finalizes settings. Windows will guide you through region, keyboard, and account setup on first boot.'
  ];

  function init() {
    playBtn = document.getElementById('playBtn');
    pauseBtn = document.getElementById('pauseBtn');
    resetBtn = document.getElementById('resetBtn');
    statusText = document.getElementById('statusText');
    copyProgress = document.getElementById('copyProgress');
    copyPercent = document.getElementById('copyPercent');
    overallProgress = document.getElementById('overallProgress');
    overallProgressText = document.getElementById('overallProgressText');

    for (var i = 0; i < STAGE_COUNT; i++) {
      stageContents[i] = document.getElementById('stage-' + i);
      stageNodes[i] = document.getElementById('stagenode-' + i);
      stageConns[i] = document.getElementById('stageconn-' + i);
      stageNodes[i].addEventListener('click', makeStageClick(i));
      stageNodes[i].addEventListener('keydown', function (e) {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          var idx = parseInt(this.id.replace('stagenode-', ''));
          goToStage(idx);
        }
      });
      stageNodes[i].setAttribute('tabindex', '0');
      stageNodes[i].setAttribute('role', 'button');
      stageNodes[i].setAttribute('aria-label', 'View stage: ' + STAGE_NAMES[i]);
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

    goToStage(0);
    updateButtons();
  }

  function makeStageClick(idx) {
    return function () { goToStage(idx); };
  }

  function goToStage(idx) {
    if (state.playing && idx !== state.stage) return;
    state.stage = idx;
    for (var i = 0; i < STAGE_COUNT; i++) {
      var content = stageContents[i];
      if (content) {
        if (i === idx) content.removeAttribute('display');
        else content.setAttribute('display', 'none');
      }
      if (stageNodes[i]) {
        stageNodes[i].classList.remove('active', 'done');
        if (i < idx) stageNodes[i].classList.add('done');
        if (i === idx) stageNodes[i].classList.add('active');
      }
      if (stageConns[i]) {
        stageConns[i].classList.toggle('done', i < idx);
      }
    }
    var pct = Math.round(((idx + 1) / STAGE_COUNT) * 100);
    overallProgress.setAttribute('width', Math.round(pct * 9.4));
    overallProgressText.textContent = pct + '% — ' + STAGE_NAMES[idx];
    statusText.innerHTML = '<strong>' + STAGE_NAMES[idx] + ':</strong> ' + STAGE_DETAILS[idx];
    updateButtons();
  }

  function advanceStage() {
    if (state.copyInterval) {
      clearInterval(state.copyInterval);
      state.copyInterval = null;
    }
    state.stage++;
    if (state.stage >= STAGE_COUNT) {
      if (state.timer) { clearInterval(state.timer); state.timer = null; }
      state.playing = false;
      overallProgress.setAttribute('width', '936');
      overallProgressText.textContent = '100% — Installation Complete';
      statusText.innerHTML = '<strong>Installation complete!</strong> Welcome to your new OS';
      updateButtons();
      return;
    }
    goToStage(state.stage);
    // If stage is Copying Files, animate progress
    if (state.stage === 6) {
      state.copyProgress = 0;
      state.copyInterval = setInterval(function () {
        state.copyProgress += Math.random() * 8 + 2;
        if (state.copyProgress >= 100) {
          state.copyProgress = 100;
          if (state.copyInterval) { clearInterval(state.copyInterval); state.copyInterval = null; }
        }
        copyProgress.setAttribute('width', Math.round(state.copyProgress * 2.8));
        copyPercent.textContent = Math.round(state.copyProgress) + '%';
      }, 200);
    }
    updateButtons();
  }

  function play() {
    if (state.playing) return;
    if (state.stage >= STAGE_COUNT - 1) {
      goToStage(0);
    }
    state.playing = true;
    state.stage = 0;
    goToStage(0);
    statusText.innerHTML = '<strong>Starting OS installation...</strong>';
    state.timer = setInterval(advanceStage, 2500);
    updateButtons();
  }

  function pause() {
    if (!state.playing) return;
    state.playing = false;
    if (state.timer) { clearInterval(state.timer); state.timer = null; }
    if (state.copyInterval) { clearInterval(state.copyInterval); state.copyInterval = null; }
    statusText.innerHTML = '<strong>Paused</strong> — ' + STAGE_NAMES[state.stage];
    updateButtons();
  }

  function reset() {
    if (state.timer) { clearInterval(state.timer); state.timer = null; }
    if (state.copyInterval) { clearInterval(state.copyInterval); state.copyInterval = null; }
    state.playing = false;
    state.copyProgress = 0;
    goToStage(0);
    copyProgress.setAttribute('width', '0');
    copyPercent.textContent = '0%';
    overallProgress.setAttribute('width', '0');
    overallProgressText.textContent = '0% — Ready';
    statusText.innerHTML = 'Press <strong>Play</strong> to run through OS installation';
    updateButtons();
  }

  function updateButtons() {
    playBtn.disabled = state.playing;
    pauseBtn.disabled = !state.playing;
    resetBtn.disabled = state.stage === 0 && !state.playing;
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
