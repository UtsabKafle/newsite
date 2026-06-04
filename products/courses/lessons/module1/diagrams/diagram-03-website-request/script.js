(function () {
  'use strict';

  var STEP_DURATION = 3000;
  var URL_TEXT = 'https://www.example.com';
  var URL_TYPING_INTERVAL = 90;

  var steps = [
    {
      id: 'type-url',
      title: 'Type URL',
      detailTitle: 'You type the website address',
      shortDesc: 'You type the website address into the browser&rsquo;s address bar and press Enter.',
      longDesc: 'When you type a URL like <strong>https://www.example.com</strong> into your browser&rsquo;s address bar and press Enter, the browser first parses the URL to identify the protocol (HTTPS), the domain name (example.com), and the path (/). It checks its local cache for a matching page and, if none is found, begins preparing a network request. The browser also checks for HSTS (HTTP Strict Transport Security) to ensure a secure connection is used. This simple act of typing a URL sets off a chain of events that spans multiple systems across the globe.',
    },
    {
      id: 'dns-lookup',
      title: 'DNS Lookup',
      detailTitle: 'The browser looks up the server IP',
      shortDesc: 'The browser asks a DNS server to translate the domain name into an IP address.',
      longDesc: 'The browser sends a DNS (Domain Name System) query to resolve <strong>example.com</strong> into a machine-readable IP address like <strong>93.184.216.34</strong>. This query travels through multiple DNS servers: first the browser&rsquo;s cache, then the OS cache, then a recursive resolver (often your ISP&rsquo;s), then root name servers, TLD servers, and finally the authoritative name server for the domain. Each level either returns a cached result or passes the query deeper. Without DNS, you&rsquo;d have to memorize IP addresses for every website you visit.',
    },
    {
      id: 'connect',
      title: 'Connect to Server',
      detailTitle: 'A TCP connection is established',
      shortDesc: 'The browser and server perform a TCP three-way handshake to establish a connection.',
      longDesc: 'A <strong>TCP three-way handshake</strong> takes place between your browser and the server. The browser sends a SYN (synchronize) packet, the server responds with SYN-ACK (synchronize-acknowledge), and the browser sends an ACK (acknowledge) back. If HTTPS is used (as it is for most sites today), a <strong>TLS handshake</strong> also occurs after the TCP handshake, negotiating encryption keys so that all data sent between you and the server is encrypted and secure. This ensures that no one in between can read or tamper with the data.',
    },
    {
      id: 'request',
      title: 'Request Page',
      detailTitle: 'The browser requests the webpage',
      shortDesc: 'The browser sends an HTTP GET request to the server asking for the webpage content.',
      longDesc: 'The browser sends an <strong>HTTP GET request</strong> to the server, specifying the resource it wants (e.g., <strong>GET / HTTP/1.1</strong>). The request includes headers that tell the server about the browser, accepted content types, language preferences, caching instructions, and cookies. For example, the <code>User-Agent</code> header identifies the browser, the <code>Accept</code> header lists which content types it can handle, and <code>Cookie</code> headers send any stored session data. The server uses this information to tailor its response.',
    },
    {
      id: 'respond',
      title: 'Server Responds',
      detailTitle: 'The server sends back the data',
      shortDesc: 'The server processes the request and sends back an HTTP response with the page data.',
      longDesc: 'The server processes the request and sends back an <strong>HTTP response</strong> with a status code (e.g., <strong>200 OK</strong>) and the requested content. The response includes headers like <code>Content-Type</code> (telling the browser it&rsquo;s HTML), <code>Content-Length</code> (the size of the data), <code>Cache-Control</code> (caching instructions), and <code>Set-Cookie</code> (if the server wants to store cookies). The body contains the actual HTML of the page. For a modern webpage, this initial HTML often references additional resources like CSS, JavaScript, and images, triggering more requests.',
    },
    {
      id: 'render',
      title: 'Browser Renders',
      detailTitle: 'The browser displays the page',
      shortDesc: 'The browser parses the HTML, builds the DOM, and renders the visual page.',
      longDesc: 'The browser parses the HTML and constructs the <strong>DOM (Document Object Model)</strong> tree. It also fetches and processes linked CSS stylesheets to build the <strong>CSSOM (CSS Object Model)</strong>. These two trees are combined into the <strong>render tree</strong>, which determines the visual layout of each element. The browser then performs <strong>layout</strong> (calculating positions and sizes) and <strong>painting</strong> (drawing pixels to the screen). JavaScript is executed as it is encountered, which may modify the DOM and trigger re-layouts. Once all resources are loaded and painted, you see the fully rendered webpage.',
    },
  ];

  var state = {
    currentStep: -1,
    isPlaying: false,
    isPaused: false,
    completed: false,
    timerId: null,
    stepStartTime: 0,
    elapsedInStep: 0,
  };

  var els = {};
  var urlChars = [];
  var urlTypingTimer = null;
  var urlIndex = 0;
  var isReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function cacheElements() {
    els.playBtn = document.getElementById('playBtn');
    els.pauseBtn = document.getElementById('pauseBtn');
    els.resetBtn = document.getElementById('resetBtn');
    els.progressFill = document.getElementById('progressFill');
    els.stepCounter = document.getElementById('stepCounter');
    els.browserUrl = document.getElementById('browserUrl');
    els.browserCursor = document.getElementById('browserCursor');
    els.detailPanel = document.getElementById('detailPanel');
    els.detailStepLabel = document.getElementById('detailStepLabel');
    els.detailTitle = document.getElementById('detailTitle');
    els.detailText = document.getElementById('detailText');
    els.detailDismiss = document.getElementById('detailDismiss');

    els.stepNodes = [];
    els.stepArrows = [];
    for (var i = 0; i < 6; i++) {
      els.stepNodes[i] = document.getElementById('step' + i);
    }
    var arrows = document.querySelectorAll('.step-arrow');
    for (var j = 0; j < arrows.length; j++) {
      els.stepArrows[j] = arrows[j];
    }
    els.progressMarkers = document.querySelectorAll('.progress-marker');
  }

  function init() {
    cacheElements();
    bindEvents();
    setDetail('Welcome', 'Press <strong>Play</strong> to watch the step-by-step process of what happens when you visit a website. You can also click any step to learn more.', '');
    resetUI();
  }

  function bindEvents() {
    els.playBtn.addEventListener('click', play);
    els.pauseBtn.addEventListener('click', togglePause);
    els.resetBtn.addEventListener('click', reset);

    for (var i = 0; i < els.stepNodes.length; i++) {
      els.stepNodes[i].addEventListener('click', makeStepClickHandler(i));
      els.stepNodes[i].addEventListener('keydown', makeStepKeydownHandler(i));
    }

    els.detailDismiss.addEventListener('click', dismissDetail);
    els.detailDismiss.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        dismissDetail();
      }
    });

    var motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    motionQuery.addEventListener('change', function (e) {
      isReducedMotion = e.matches;
      if (isReducedMotion) reset();
    });
  }

  function makeStepClickHandler(index) {
    return function () {
      handleStepClick(index);
    };
  }

  function makeStepKeydownHandler(index) {
    return function (e) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        handleStepClick(index);
      }
    };
  }

  function handleStepClick(index) {
    if (state.isPlaying && !state.isPaused) {
      togglePause();
    }
    showStepDetail(index);
  }

  function showStepDetail(index) {
    var step = steps[index];
    var label = 'Step ' + (index + 1) + ' of 6';
    setDetail(step.detailTitle, step.longDesc, label);
    highlightDetailPanel(true);

    for (var i = 0; i < els.stepNodes.length; i++) {
      els.stepNodes[i].classList.remove('active');
    }
    els.stepNodes[index].classList.add('active');
  }

  function setDetail(title, text, stepLabel) {
    els.detailTitle.textContent = title;
    els.detailText.innerHTML = text;
    if (stepLabel) {
      els.detailStepLabel.textContent = stepLabel;
    }
  }

  function highlightDetailPanel(show) {
    els.detailPanel.classList.toggle('active-detail', show);
    els.detailDismiss.classList.toggle('visible', show);
  }

  function dismissDetail() {
    highlightDetailPanel(false);
    if (!state.isPlaying && state.currentStep === -1) {
      setDetail('Welcome', 'Press <strong>Play</strong> to watch the step-by-step process of what happens when you visit a website. You can also click any step to learn more.', '');
    } else if (!state.isPlaying && state.currentStep >= 0) {
      var step = steps[state.currentStep];
      var label = 'Step ' + (state.currentStep + 1) + ' of 6';
      setDetail(step.detailTitle, step.longDesc, label);
    }
    for (var i = 0; i < els.stepNodes.length; i++) {
      if (state.currentStep === i) {
        els.stepNodes[i].classList.add('active');
      } else {
        els.stepNodes[i].classList.remove('active');
      }
    }
  }

  function play() {
    if (state.isPlaying) return;
    if (state.completed) {
      resetInternal();
      resetUI();
    }

    state.isPlaying = true;
    state.isPaused = false;
    state.completed = false;

    els.playBtn.disabled = true;
    els.pauseBtn.disabled = false;

    if (state.currentStep === -1) {
      advanceToStep(0);
    } else {
      state.stepStartTime = performance.now() - state.elapsedInStep;
      scheduleStepAdvance();
    }
  }

  function togglePause() {
    if (!state.isPlaying) return;
    state.isPaused = !state.isPaused;

    if (state.isPaused) {
      if (state.timerId) {
        clearTimeout(state.timerId);
        state.timerId = null;
      }
      state.elapsedInStep = performance.now() - state.stepStartTime;
      if (state.currentStep === 0 && urlTypingTimer) {
        clearInterval(urlTypingTimer);
        urlTypingTimer = null;
      }
      els.pauseBtn.innerHTML = '<svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18"><polygon points="5 3 19 12 5 21 5 3"/></svg><span>Resume</span>';
    } else {
      state.stepStartTime = performance.now() - state.elapsedInStep;
      scheduleStepAdvance();
      if (state.currentStep === 0) {
        resumeUrlTyping();
      }
      els.pauseBtn.innerHTML = '<svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18"><rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/></svg><span>Pause</span>';
    }
  }

  function advanceToStep(index) {
    state.currentStep = index;
    state.stepStartTime = performance.now();
    state.elapsedInStep = 0;

    updateStepUI(index);

    if (index === 0) {
      startUrlTyping();
    }

    if (index < 6) {
      scheduleStepAdvance();
    }
  }

  function scheduleStepAdvance() {
    if (state.timerId) {
      clearTimeout(state.timerId);
    }
    state.timerId = setTimeout(function () {
      if (state.isPlaying && !state.isPaused) {
        var next = state.currentStep + 1;
        if (next < 6) {
          advanceToStep(next);
        } else {
          completeAnimation();
        }
      }
    }, STEP_DURATION);
  }

  function completeAnimation() {
    state.completed = true;
    state.isPlaying = false;
    els.playBtn.disabled = false;
    els.pauseBtn.disabled = true;
    els.pauseBtn.innerHTML = '<svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18"><rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/></svg><span>Pause</span>';

    for (var i = 0; i < els.stepNodes.length; i++) {
      els.stepNodes[i].classList.remove('active');
      els.stepNodes[i].classList.add('completed');
    }
    for (var j = 0; j < els.stepArrows.length; j++) {
      els.stepArrows[j].classList.remove('active');
      els.stepArrows[j].classList.add('completed');
    }
    for (var k = 0; k < els.progressMarkers.length; k++) {
      els.progressMarkers[k].classList.remove('active');
      els.progressMarkers[k].classList.add('complete');
    }

    els.progressFill.style.width = '100%';
    els.progressFill.setAttribute('aria-valuenow', 6);

    var lastStep = steps[steps.length - 1];
    var label = 'Step ' + steps.length + ' of 6';
    setDetail(lastStep.detailTitle, lastStep.longDesc, label);
    highlightDetailPanel(true);

    if (urlTypingTimer) {
      clearInterval(urlTypingTimer);
      urlTypingTimer = null;
    }
    els.browserCursor.classList.remove('visible');
  }

  function updateStepUI(index) {
    var step = steps[index];
    var label = 'Step ' + (index + 1) + ' of 6';

    for (var i = 0; i < els.stepNodes.length; i++) {
      els.stepNodes[i].classList.remove('active');
      if (i < index) {
        els.stepNodes[i].classList.add('completed');
      } else {
        els.stepNodes[i].classList.remove('completed');
      }
    }
    els.stepNodes[index].classList.add('active');
    els.stepNodes[index].classList.remove('completed');

    for (var j = 0; j < els.stepArrows.length; j++) {
      els.stepArrows[j].classList.remove('active', 'completed');
      if (j < index) {
        els.stepArrows[j].classList.add('completed');
      } else if (j === index) {
        els.stepArrows[j].classList.add('active');
      }
    }

    var progress = ((index + 1) / 6) * 100;
    if (progress > 100) progress = 100;
    els.progressFill.style.width = progress + '%';
    els.progressFill.setAttribute('aria-valuenow', index + 1);

    for (var k = 0; k < els.progressMarkers.length; k++) {
      els.progressMarkers[k].classList.remove('active', 'complete');
      if (k < index) {
        els.progressMarkers[k].classList.add('complete');
      } else if (k === index) {
        els.progressMarkers[k].classList.add('active');
      }
    }

    els.stepCounter.textContent = label;
    setDetail(step.detailTitle, step.shortDesc, label);
    highlightDetailPanel(true);

    if (index === 0) {
      els.browserCursor.classList.add('visible');
    } else {
      els.browserCursor.classList.remove('visible');
    }
  }

  function startUrlTyping() {
    urlIndex = 0;
    els.browserUrl.textContent = '';
    urlChars = URL_TEXT.split('');
    if (urlTypingTimer) {
      clearInterval(urlTypingTimer);
    }
    var delay = isReducedMotion ? 1 : URL_TYPING_INTERVAL;
    urlTypingTimer = setInterval(function () {
      if (state.isPaused) return;
      if (urlIndex < urlChars.length) {
        els.browserUrl.textContent += urlChars[urlIndex];
        urlIndex++;
      } else {
        clearInterval(urlTypingTimer);
        urlTypingTimer = null;
      }
    }, delay);
  }

  function resumeUrlTyping() {
    if (urlTypingTimer) {
      clearInterval(urlTypingTimer);
      urlTypingTimer = null;
    }
    var delay = isReducedMotion ? 1 : URL_TYPING_INTERVAL;
    urlTypingTimer = setInterval(function () {
      if (state.isPaused) return;
      if (urlIndex < urlChars.length) {
        els.browserUrl.textContent += urlChars[urlIndex];
        urlIndex++;
      } else {
        clearInterval(urlTypingTimer);
        urlTypingTimer = null;
      }
    }, delay);
  }

  function reset() {
    if (state.timerId) {
      clearTimeout(state.timerId);
      state.timerId = null;
    }
    if (urlTypingTimer) {
      clearInterval(urlTypingTimer);
      urlTypingTimer = null;
    }
    resetInternal();
    resetUI();
    els.playBtn.disabled = false;
    els.pauseBtn.disabled = true;
    els.pauseBtn.innerHTML = '<svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18"><rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/></svg><span>Pause</span>';
  }

  function resetInternal() {
    state.isPlaying = false;
    state.isPaused = false;
    state.completed = false;
    state.currentStep = -1;
    state.stepStartTime = 0;
    state.elapsedInStep = 0;
  }

  function resetUI() {
    els.progressFill.style.width = '0%';
    els.progressFill.setAttribute('aria-valuenow', 0);
    els.stepCounter.textContent = 'Step 0 of 6';

    els.browserUrl.textContent = '';
    els.browserCursor.classList.remove('visible');

    for (var i = 0; i < els.stepNodes.length; i++) {
      els.stepNodes[i].classList.remove('active', 'completed');
    }
    for (var j = 0; j < els.stepArrows.length; j++) {
      els.stepArrows[j].classList.remove('active', 'completed');
    }
    for (var k = 0; k < els.progressMarkers.length; k++) {
      els.progressMarkers[k].classList.remove('active', 'complete');
    }

    highlightDetailPanel(false);
    setDetail('Welcome', 'Press <strong>Play</strong> to watch the step-by-step process of what happens when you visit a website. You can also click any step to learn more.', '');
  }

  init();

})();
