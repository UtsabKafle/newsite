(function () {
  'use strict';

  /* ===================================================================
     DATA
     =================================================================== */

  const SCENARIOS = {
    'watch-movie': {
      name: 'Watch a Movie',
      devicePaths: ['tablet-cloud'],
      servicePaths: ['cloud-streaming'],
      allActivePaths: ['tablet-cloud', 'cloud-streaming'],
      highlightDevice: 'tablet',
      highlightService: 'streaming',
      description: 'Your tablet connects to cloud streaming servers. Video content is delivered via adaptive bitrate streaming (HLS), ensuring smooth playback even with fluctuating connection speeds.',
      details: [
        { label: 'Device', value: 'Tablet', color: '#0959C8' },
        { label: 'Gateway', value: 'Cloud CDN', color: '#E2E8F0' },
        { label: 'Service', value: 'Streaming', color: '#F59E0B' },
        { label: 'Protocol', value: 'HTTPS / HLS', color: '#94A3B8' }
      ]
    },
    'backup-photos': {
      name: 'Backup Photos',
      devicePaths: ['phone-cloud'],
      servicePaths: ['cloud-storage'],
      allActivePaths: ['phone-cloud', 'cloud-storage'],
      highlightDevice: 'phone',
      highlightService: 'storage',
      description: 'Your phone automatically uploads photos to secure encrypted cloud storage. Files are synchronized across all your devices and can be accessed anytime, anywhere.',
      details: [
        { label: 'Device', value: 'Phone', color: '#0959C8' },
        { label: 'Gateway', value: 'Cloud Storage API', color: '#E2E8F0' },
        { label: 'Service', value: 'Storage', color: '#3B82F6' },
        { label: 'Cipher', value: 'TLS 1.3 / AES-256', color: '#94A3B8' }
      ]
    },
    'send-email': {
      name: 'Send Email',
      devicePaths: ['laptop-cloud'],
      servicePaths: ['cloud-email'],
      allActivePaths: ['laptop-cloud', 'cloud-email'],
      highlightDevice: 'laptop',
      highlightService: 'email',
      description: 'Your laptop sends messages through cloud-based email servers. The email is processed, filtered for spam and malware, then delivered securely to the recipient\u2019s inbox.',
      details: [
        { label: 'Device', value: 'Laptop', color: '#0959C8' },
        { label: 'Gateway', value: 'Mail Server', color: '#E2E8F0' },
        { label: 'Service', value: 'Email', color: '#10B981' },
        { label: 'Protocol', value: 'SMTP / IMAP / TLS', color: '#94A3B8' }
      ]
    },
    'use-ai': {
      name: 'Use AI Assistant',
      devicePaths: ['laptop-cloud'],
      servicePaths: ['cloud-aiml'],
      allActivePaths: ['laptop-cloud', 'cloud-aiml'],
      highlightDevice: 'laptop',
      highlightService: 'aiml',
      description: 'Your device sends queries to cloud-based AI/ML services. Large language models and neural networks analyze your request and generate intelligent responses in real-time.',
      details: [
        { label: 'Device', value: 'Laptop', color: '#0959C8' },
        { label: 'Gateway', value: 'AI Inference API', color: '#E2E8F0' },
        { label: 'Service', value: 'AI / ML', color: '#8B5CF6' },
        { label: 'Protocol', value: 'REST API / gRPC', color: '#94A3B8' }
      ]
    }
  };

  const SCENARIO_ORDER = ['watch-movie', 'backup-photos', 'send-email', 'use-ai'];
  const ALL_PATH_IDS = ['laptop-cloud', 'phone-cloud', 'tablet-cloud', 'cloud-storage', 'cloud-email', 'cloud-streaming', 'cloud-aiml'];
  const DOTS_PER_PATH = 5;
  const AUTO_DEMO_INTERVAL = 5500;

  /* ===================================================================
     STATE
     =================================================================== */

  const state = {
    currentScenario: null,
    isPlaying: false,
    isPaused: false,
    isAutoDemo: false,
    animFrameId: null,
    autoDemoTimer: null,
    autoDemoIndex: 0
  };

  /* ===================================================================
     DOM CACHE
     =================================================================== */

  const dom = {};

  function cacheDom() {
    dom.app = document.getElementById('app');
    dom.svg = document.getElementById('diagram');
    dom.cloud = document.getElementById('cloud-group');

    dom.scenarioBtns = document.querySelectorAll('.scenario-btn');
    dom.infoTitle = document.getElementById('info-title');
    dom.infoDescription = document.getElementById('info-description');
    dom.infoDetails = document.getElementById('info-details');
    dom.infoPanel = document.getElementById('info-panel');

    dom.btnPlay = document.getElementById('btn-play');
    dom.btnPause = document.getElementById('btn-pause');
    dom.btnReset = document.getElementById('btn-reset');
    dom.chkAuto = document.getElementById('chk-auto');
    dom.autoIndicator = document.getElementById('auto-indicator');

    dom.deviceGroups = document.querySelectorAll('.device-group');
    dom.serviceGroups = document.querySelectorAll('.service-group');

    dom.dotGroups = {};
    dom.paths = {};
    ALL_PATH_IDS.forEach(function (id) {
      dom.dotGroups[id] = document.getElementById('dots-' + id);
      dom.paths[id] = document.getElementById('path-' + id);
    });
  }

  /* ===================================================================
     DOT SYSTEM
     =================================================================== */

  const dotData = {};   // pathId -> array of { element, progress, speed }

  function initDots() {
    ALL_PATH_IDS.forEach(function (pathId) {
      var path = dom.paths[pathId];
      var group = dom.dotGroups[pathId];
      if (!path || !group) return;

      var length = Math.max(path.getTotalLength(), 1);
      var states = [];

      for (var i = 0; i < DOTS_PER_PATH; i++) {
        var dot = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        dot.setAttribute('r', '3.5');
        dot.setAttribute('fill', '#60A5FA');
        dot.setAttribute('opacity', '0');
        dot.classList.add('data-dot');
        group.appendChild(dot);

        var startPos = (length / DOTS_PER_PATH) * i;
        var pt = path.getPointAtLength(startPos);
        dot.setAttribute('cx', pt.x);
        dot.setAttribute('cy', pt.y);

        states.push({
          element: dot,
          progress: startPos,
          speed: 0.7 + Math.random() * 0.6
        });
      }

      dotData[pathId] = states;
    });
  }

  function showDots(pathIds) {
    pathIds.forEach(function (pathId) {
      var states = dotData[pathId];
      if (!states) return;
      states.forEach(function (s) {
        s.element.setAttribute('opacity', '1');
      });
    });
  }

  function hideDots(pathIds) {
    pathIds.forEach(function (pathId) {
      var states = dotData[pathId];
      if (!states) return;
      states.forEach(function (s) {
        s.element.setAttribute('opacity', '0');
      });
    });
  }

  function hideAllDots() {
    ALL_PATH_IDS.forEach(function (pathId) {
      hideDots([pathId]);
    });
  }

  function resetDotProgress(pathIds) {
    pathIds.forEach(function (pathId) {
      var path = dom.paths[pathId];
      var states = dotData[pathId];
      if (!path || !states) return;
      var length = Math.max(path.getTotalLength(), 1);
      states.forEach(function (s, i) {
        s.progress = (length / states.length) * i;
        var pt = path.getPointAtLength(s.progress);
        s.element.setAttribute('cx', pt.x);
        s.element.setAttribute('cy', pt.y);
      });
    });
  }

  /* ===================================================================
     HIGHLIGHT SYSTEM
     =================================================================== */

  function clearHighlights() {
    dom.deviceGroups.forEach(function (g) {
      g.classList.remove('active', 'inactive');
    });
    dom.serviceGroups.forEach(function (g) {
      g.classList.remove('active', 'inactive');
    });
    dom.cloud.classList.remove('active');
    ALL_PATH_IDS.forEach(function (id) {
      dom.paths[id].classList.remove('active', 'active-glow');
    });
  }

  function applyHighlights(data) {
    var deviceEl = document.querySelector('[data-device="' + data.highlightDevice + '"]');
    var serviceEl = document.querySelector('[data-service="' + data.highlightService + '"]');

    if (deviceEl) deviceEl.classList.add('active');
    if (serviceEl) serviceEl.classList.add('active');

    dom.deviceGroups.forEach(function (g) {
      if (g !== deviceEl) g.classList.add('inactive');
    });
    dom.serviceGroups.forEach(function (g) {
      if (g !== serviceEl) g.classList.add('inactive');
    });

    dom.cloud.classList.add('active');

    data.devicePaths.forEach(function (id) {
      var el = dom.paths[id];
      if (el) el.classList.add('active-glow');
    });
    data.servicePaths.forEach(function (id) {
      var el = dom.paths[id];
      if (el) el.classList.add('active-glow');
    });
  }

  /* ===================================================================
     INFO PANEL
     =================================================================== */

  function renderInfo(data) {
    dom.infoTitle.textContent = data.name;
    dom.infoDescription.textContent = data.description;

    dom.infoDetails.innerHTML = '';
    data.details.forEach(function (d, idx) {
      var item = document.createElement('div');
      item.className = 'detail-item';
      item.style.animationDelay = (idx * 0.08) + 's';
      item.classList.add('fade-in');
      item.innerHTML =
        '<span class="dot" style="background:' + d.color + '"></span>' +
        '<span class="detail-label">' + d.label + ':</span>' +
        '<span>' + d.value + '</span>';
      dom.infoDetails.appendChild(item);
    });
  }

  /* ===================================================================
     SCENARIO MANAGEMENT
     =================================================================== */

  function selectScenario(id, autoPlay) {
    if (state.currentScenario === id && !autoPlay) return;

    var data = SCENARIOS[id];
    if (!data) return;

    if (state.isPlaying) {
      stopAnimationLoop();
    }

    state.currentScenario = id;
    state.isPlaying = false;
    state.isPaused = false;

    hideAllDots();
    clearHighlights();
    applyHighlights(data);
    renderInfo(data);

    resetDotProgress(data.allActivePaths);

    updateScenarioButtons(id);

    if (autoPlay) {
      startAnimationLoop();
    }

    updateControlButtons();
  }

  function updateScenarioButtons(activeId) {
    dom.scenarioBtns.forEach(function (btn) {
      var sid = btn.getAttribute('data-scenario');
      btn.classList.toggle('active', sid === activeId);
    });
  }

  /* ===================================================================
     ANIMATION LOOP
     =================================================================== */

  function startAnimationLoop() {
    if (state.animFrameId) return;

    var data = SCENARIOS[state.currentScenario];
    if (!data) return;

    state.isPlaying = true;
    state.isPaused = false;

    showDots(data.allActivePaths);

    function tick() {
      if (!state.isPlaying) return;

      data.allActivePaths.forEach(function (pathId) {
        var path = dom.paths[pathId];
        var states = dotData[pathId];
        if (!path || !states) return;

        var length = Math.max(path.getTotalLength(), 1);

        states.forEach(function (s) {
          s.progress += s.speed;
          if (s.progress >= length) {
            s.progress -= length;
          }
          var pt = path.getPointAtLength(s.progress);
          s.element.setAttribute('cx', pt.x);
          s.element.setAttribute('cy', pt.y);
        });
      });

      state.animFrameId = requestAnimationFrame(tick);
    }

    state.animFrameId = requestAnimationFrame(tick);
    updateControlButtons();
  }

  function stopAnimationLoop() {
    if (state.animFrameId) {
      cancelAnimationFrame(state.animFrameId);
      state.animFrameId = null;
    }
    state.isPlaying = false;
    state.isPaused = false;
    updateControlButtons();
  }

  function pauseAnimationLoop() {
    if (state.animFrameId) {
      cancelAnimationFrame(state.animFrameId);
      state.animFrameId = null;
    }
    state.isPlaying = false;
    state.isPaused = true;
    updateControlButtons();
  }

  /* ===================================================================
     CONTROL ACTIONS
     =================================================================== */

  function playAction() {
    if (!state.currentScenario) {
      selectScenario(SCENARIO_ORDER[0]);
    }
    if (state.isPaused || !state.isPlaying) {
      startAnimationLoop();
    }
  }

  function pauseAction() {
    if (state.isPlaying) {
      pauseAnimationLoop();
    }
  }

  function resetAction() {
    if (state.isAutoDemo) {
      toggleAutoDemo();
    }
    if (state.animFrameId) {
      cancelAnimationFrame(state.animFrameId);
      state.animFrameId = null;
    }
    state.isPlaying = false;
    state.isPaused = false;

    hideAllDots();

    if (state.currentScenario) {
      var data = SCENARIOS[state.currentScenario];
      resetDotProgress(data.allActivePaths);
    }

    updateControlButtons();
  }

  function toggleAutoDemo() {
    state.isAutoDemo = !state.isAutoDemo;

    if (state.isAutoDemo) {
      if (state.animFrameId) {
        cancelAnimationFrame(state.animFrameId);
        state.animFrameId = null;
      }
      state.isPlaying = false;
      state.isPaused = false;

      state.autoDemoIndex = SCENARIO_ORDER.indexOf(state.currentScenario);
      if (state.autoDemoIndex === -1) state.autoDemoIndex = 0;

      cycleToNext();
      state.autoDemoTimer = setInterval(cycleToNext, AUTO_DEMO_INTERVAL);

      dom.autoIndicator.classList.remove('hidden');
      dom.autoIndicator.classList.add('visible');
    } else {
      if (state.autoDemoTimer) {
        clearInterval(state.autoDemoTimer);
        state.autoDemoTimer = null;
      }
      dom.autoIndicator.classList.remove('visible');
      dom.autoIndicator.classList.add('hidden');

      if (state.isPlaying) {
        stopAnimationLoop();
      }
    }

    updateControlButtons();
  }

  function cycleToNext() {
    var id = SCENARIO_ORDER[state.autoDemoIndex];
    state.autoDemoIndex = (state.autoDemoIndex + 1) % SCENARIO_ORDER.length;
    selectScenario(id, true);
  }

  /* ===================================================================
     CONTROL BUTTONS
     =================================================================== */

  function updateControlButtons() {
    dom.btnPlay.disabled = state.isPlaying;
    dom.btnPause.disabled = !state.isPlaying;

    if (state.isAutoDemo) {
      dom.btnPlay.disabled = true;
      dom.btnPause.disabled = true;
    }
  }

  /* ===================================================================
     EVENT BINDING
     =================================================================== */

  function bindEvents() {
    dom.scenarioBtns.forEach(function (btn) {
      btn.addEventListener('click', function () {
        var id = btn.getAttribute('data-scenario');
        if (state.isAutoDemo) {
          toggleAutoDemo();
        }
        selectScenario(id);
        if (state.isPlaying) {
          stopAnimationLoop();
        }
      });

      btn.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          btn.click();
        }
      });
    });

    dom.btnPlay.addEventListener('click', playAction);
    dom.btnPause.addEventListener('click', pauseAction);
    dom.btnReset.addEventListener('click', resetAction);

    dom.chkAuto.addEventListener('change', function () {
      toggleAutoDemo();
    });

    dom.chkAuto.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        dom.chkAuto.checked = !dom.chkAuto.checked;
        toggleAutoDemo();
      }
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === ' ' && e.target.tagName !== 'INPUT' && e.target.tagName !== 'BUTTON') {
        e.preventDefault();
        if (state.isPlaying) {
          pauseAction();
        } else {
          playAction();
        }
      }
      if (e.key === 'r' || e.key === 'R') {
        resetAction();
      }
      if (e.key === 'Escape' && state.isAutoDemo) {
        toggleAutoDemo();
      }
    });

    window.addEventListener('resize', function () {
      ALL_PATH_IDS.forEach(function (pathId) {
        var path = dom.paths[pathId];
        var states = dotData[pathId];
        if (!path || !states) return;
        var length = Math.max(path.getTotalLength(), 1);
        states.forEach(function (s) {
          if (s.progress >= length) {
            s.progress = length - 1;
          }
          var pt = path.getPointAtLength(s.progress);
          s.element.setAttribute('cx', pt.x);
          s.element.setAttribute('cy', pt.y);
        });
      });
    });
  }

  /* ===================================================================
     INIT
     =================================================================== */

  function init() {
    cacheDom();
    initDots();

    bindEvents();

    selectScenario(SCENARIO_ORDER[0]);
  }

  document.addEventListener('DOMContentLoaded', init);
})();
