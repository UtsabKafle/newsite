(function () {
  'use strict';

  var state = {
    phase: 0,
    progress: 0,
    playing: false,
    rafId: null,
    lastTime: null
  };

  var PHASE_NAMES = ['', 'Input', 'Process', 'Output'];
  var PHASE_DURATIONS = [0, 2500, 3000, 2500];

  var arrow1, arrow2, stageInput, stageProcess, stageOutput;
  var dataDot1, dataDot2, gear1, gear2;
  var soundWaves, statusText, playBtn, pauseBtn, resetBtn;
  var allArrows, allStages;

  function init() {
    statusText = document.getElementById('statusText');
    playBtn = document.getElementById('playBtn');
    pauseBtn = document.getElementById('pauseBtn');
    resetBtn = document.getElementById('resetBtn');

    arrow1 = document.getElementById('arrow1');
    arrow2 = document.getElementById('arrow2');
    stageInput = document.getElementById('stageInput');
    stageProcess = document.getElementById('stageProcess');
    stageOutput = document.getElementById('stageOutput');
    dataDot1 = arrow1.querySelector('.data-dot');
    dataDot2 = arrow2.querySelector('.data-dot');
    gear1 = document.querySelector('.gear1');
    gear2 = document.querySelector('.gear2');
    soundWaves = document.querySelectorAll('.sound-wave');
    allArrows = [arrow1, arrow2];
    allStages = [stageInput, stageProcess, stageOutput];

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

  function getPhaseDuration() {
    return PHASE_DURATIONS[state.phase] || 2500;
  }

  function play() {
    if (state.playing) return;
    if (state.phase > 3) { reset(); return; }
    state.playing = true;
    if (state.phase === 0) { state.phase = 1; state.progress = 0; state.lastTime = null; }
    state.lastTime = null;
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
    state.phase = 0;
    state.progress = 0;
    state.playing = false;
    state.lastTime = null;
    resetUI();
  }

  function resetUI() {
    allArrows.forEach(function (a) { a.classList.remove('active'); });
    allStages.forEach(function (s) { s.classList.remove('active', 'completed'); });
    soundWaves.forEach(function (w) { w.classList.remove('active'); });
    statusText.innerHTML = 'Press <strong>Play</strong> to start the IPO cycle';
    updateButtons();
  }

  function animLoop(timestamp) {
    if (!state.playing) return;
    if (state.lastTime === null) { state.lastTime = timestamp; state.rafId = requestAnimationFrame(animLoop); return; }
    var dt = timestamp - state.lastTime;
    state.lastTime = timestamp;
    var dur = getPhaseDuration();
    state.progress += dt / dur;
    if (state.progress >= 1) {
      state.progress = 1;
      updatePositions();
      advancePhase();
      return;
    }
    updatePositions();
    state.rafId = requestAnimationFrame(animLoop);
  }

  function advancePhase() {
    if (state.phase >= 3) {
      state.phase = 4;
      state.playing = false;
      updatePositions();
      updateUI();
      return;
    }
    state.phase++;
    state.progress = 0;
    state.lastTime = null;
    updatePositions();
    if (state.playing) {
      state.rafId = requestAnimationFrame(animLoop);
    }
    updateUI();
  }

  function updatePositions() {
    var p = state.progress;
    var phase = state.phase;

    allStages.forEach(function (s) { s.classList.remove('active', 'completed'); });
    allArrows.forEach(function (a) { a.classList.remove('active'); });

    if (phase === 0) { return; }

    var dotProgress1 = 0;
    var dotProgress2 = 0;
    var gearRotation1 = 0;
    var gearRotation2 = 0;

    if (phase === 1) {
      stageInput.classList.add('active');
      dotProgress1 = p;
      var eased1 = 1 - Math.pow(1 - p, 3);
      dataDot1.setAttribute('cx', 270 + eased1 * 105);
      dataDot1.setAttribute('cy', 240);
      arrow1.classList.add('active');
      if (p >= 0.95) { stageInput.classList.remove('active'); stageInput.classList.add('completed'); }
    } else if (phase === 2) {
      stageInput.classList.add('completed');
      stageProcess.classList.add('active');
      dataDot1.setAttribute('cx', 375);
      dataDot1.setAttribute('cy', 240);
      arrow1.classList.add('active');
      gearRotation1 = p * 360;
      gearRotation2 = -p * 360 * 0.7;
      if (p < 0.3) {
        var t2 = p / 0.3;
        dataDot2.setAttribute('cx', 620 + t2 * 105);
        dataDot2.setAttribute('cy', 240);
        arrow2.classList.add('active');
      } else {
        dataDot2.setAttribute('cx', 725);
        dataDot2.setAttribute('cy', 240);
        arrow2.classList.add('active');
      }
      if (p >= 0.95) { stageProcess.classList.remove('active'); stageProcess.classList.add('completed'); }
    } else if (phase === 3) {
      stageInput.classList.add('completed');
      stageProcess.classList.add('completed');
      stageOutput.classList.add('active');
      dataDot1.setAttribute('cx', 375);
      dataDot1.setAttribute('cy', 240);
      arrow1.classList.add('active');
      dataDot2.setAttribute('cx', 725);
      dataDot2.setAttribute('cy', 240);
      arrow2.classList.add('active');
      gearRotation1 = 360;
      gearRotation2 = -360 * 0.7;
      soundWaves.forEach(function (w) { w.classList.add('active'); });
      if (p >= 0.95) { stageOutput.classList.remove('active'); stageOutput.classList.add('completed'); }
    } else if (phase === 4) {
      allStages.forEach(function (s) { s.classList.add('completed'); });
      allArrows.forEach(function (a) { a.classList.remove('active'); });
      dataDot1.setAttribute('cx', 375);
      dataDot1.setAttribute('cy', 240);
      dataDot2.setAttribute('cx', 725);
      dataDot2.setAttribute('cy', 240);
      gearRotation1 = 360;
      gearRotation2 = -360 * 0.7;
      soundWaves.forEach(function (w) { w.classList.remove('active'); });
    }

    if (gear1) gear1.setAttribute('transform', 'translate(470,270) rotate(' + gearRotation1 + ')');
    if (gear2) gear2.setAttribute('transform', 'translate(530,260) rotate(' + gearRotation2 + ')');
  }

  function updateUI() {
    updateButtons();
    var labels = ['', 'Receiving Input...', 'Processing Data...', 'Sending Output...', 'IPO Cycle Complete!'];
    if (state.phase === 0) statusText.innerHTML = 'Press <strong>Play</strong> to start the IPO cycle';
    else if (state.phase === 4) statusText.textContent = labels[4];
    else if (state.playing) statusText.innerHTML = '<strong>' + labels[state.phase] + '</strong>';
    else statusText.innerHTML = '<strong>' + labels[state.phase] + '</strong> (paused)';
  }

  function updateButtons() {
    playBtn.disabled = state.playing || state.phase === 4;
    pauseBtn.disabled = !state.playing;
    resetBtn.disabled = state.phase === 0;
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
