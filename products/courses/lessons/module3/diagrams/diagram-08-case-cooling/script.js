(function () {
  'use strict';

  var state = { playing: false, particlesPaused: false };
  var playBtn, pauseBtn, resetBtn, statusText, infoPanel, infoTitle, infoDesc;
  var particles, arrows, fanGroups;

  var COMPONENT_INFO = {
    'cpu-cooler': 'CPU Air Cooler — A tower-style heatsink with fan that pulls cool air through the fins to dissipate heat from the CPU. Essential for keeping processor temperatures in check.',
    'psu': 'Power Supply Unit (PSU) — Converts AC power from the wall into DC power for all components. Mounted at the bottom of the case, it draws cool air from below and exhausts out the back.',
    'drives': 'Drive Cages — Hold storage drives like SSDs and HDDs. Proper placement ensures good airflow; empty cages should be removed or filled to avoid obstructing air paths.',
    'front-fans': 'Front Intake Fans — Draw cool outside air into the case. These are typically 120mm or 140mm fans positioned at the front panel to create positive air pressure.',
    'top-fans': 'Top Exhaust Fans — Remove rising hot air from the case. Working with the rear fan to create an efficient exhaust path, they help maintain cool internal temperatures.',
    'rear-fan': 'Rear Exhaust Fan — Pulls warm air out of the case, typically positioned near the CPU cooler. Works with front intakes to create a steady front-to-back airflow path.'
  };

  function init() {
    playBtn = document.getElementById('playBtn');
    pauseBtn = document.getElementById('pauseBtn');
    resetBtn = document.getElementById('resetBtn');
    statusText = document.getElementById('statusText');
    infoPanel = document.getElementById('infoPanel');
    infoTitle = document.getElementById('infoTitle');
    infoDesc = document.getElementById('infoDesc');

    particles = document.querySelectorAll('.air-particle animateMotion');
    arrows = document.querySelectorAll('.air-arrow');
    fanGroups = document.querySelectorAll('.component-group');

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

    // Click components for info
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

    updateButtons();
  }

  function showInfo(key) {
    var data = COMPONENT_INFO[key];
    if (!data) return;
    infoTitle.textContent = key.replace(/-/g, ' ').replace(/\b\w/g, function (c) { return c.toUpperCase(); });
    infoDesc.textContent = data;
    infoPanel.classList.add('visible');
    document.querySelectorAll('[data-component]').forEach(function (el) {
      el.classList.toggle('active', el.getAttribute('data-component') === key);
    });
    statusText.innerHTML = '<strong>Info:</strong> ' + infoTitle.textContent;
  }

  function hideInfo() {
    infoPanel.classList.remove('visible');
    document.querySelectorAll('[data-component]').forEach(function (el) {
      el.classList.remove('active');
    });
  }

  function play() {
    if (state.playing) return;
    state.playing = true;
    state.particlesPaused = false;
    // Resume SVG animations
    particles.forEach(function (p) {
      p.beginElement();
    });
    arrows.forEach(function (a) { a.classList.add('active'); });
    statusText.innerHTML = '<strong>Playing:</strong> Air flowing through the case';
    hideInfo();
    updateButtons();
  }

  function pause() {
    if (!state.playing) return;
    state.playing = false;
    state.particlesPaused = true;
    // Pause SVG animations
    particles.forEach(function (p) {
      try { p.pauseElement(); } catch (e) { /* not supported */ }
    });
    statusText.innerHTML = '<strong>Paused</strong> — airflow stopped';
    updateButtons();
  }

  function reset() {
    state.playing = false;
    state.particlesPaused = false;
    particles.forEach(function (p) {
      try { p.endElement(); } catch (e) { /* not supported */ }
    });
    arrows.forEach(function (a) { a.classList.remove('active'); });
    hideInfo();
    statusText.innerHTML = 'Press <strong>Play</strong> to see airflow through the case';
    updateButtons();
  }

  function updateButtons() {
    playBtn.disabled = state.playing;
    pauseBtn.disabled = !state.playing;
    resetBtn.disabled = !state.playing && !state.particlesPaused;
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
