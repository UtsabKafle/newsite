(function () {
  'use strict';
  var STEPS = [
    { num: 1, title: 'Browser asks DNS', detail: 'Where is this website?', emoji: '\uD83D\uDD0D', explanation: 'Your browser contacts a DNS (Domain Name System) server to translate "www.consicaacademy.com" into a machine-readable IP address. Think of it as looking up a phone number in the internet\'s phonebook.' },
    { num: 2, title: 'DNS returns IP address', detail: 'The address is found', emoji: '\uD83D\uDCCD', explanation: 'The DNS server responds with the unique IP address (e.g., 192.0.2.1) where the Consica Academy website lives. Now your browser knows exactly where to go.' },
    { num: 3, title: 'Browser sends request', detail: 'To the server\'s IP address', emoji: '\uD83D\uDCE4', explanation: 'Your browser sends an HTTP GET request to the server\'s IP address, asking for the webpage files. This request contains your browser type, accepted languages, and more.' },
    { num: 4, title: 'Packets travel through routers', detail: 'Across the network', emoji: '\uD83D\uDCE6', explanation: 'The request is broken into small data packets that travel through multiple routers across the internet. Each packet may take a different path, but they all arrive at the same destination.' },
    { num: 5, title: 'Server receives request', detail: 'The server gets the message', emoji: '\uD83D\uDCE8', explanation: 'The Consica Academy server receives your request and processes it. It identifies which files are needed \u2014 the HTML page, CSS styles, JavaScript code, and any images or media.' },
    { num: 6, title: 'Server sends webpage files', detail: 'HTML, CSS, images', emoji: '\uD83D\uDCC4', explanation: 'The server sends back all the webpage files as packets. The HTML provides structure, CSS adds styling, JavaScript adds interactivity, and images make it visually rich.' },
    { num: 7, title: 'Browser rebuilds files', detail: 'Assembles the webpage', emoji: '\uD83D\uDD27', explanation: 'Your browser receives all the packets, reassembles them in the correct order, and begins rendering. It parses the HTML, applies CSS rules, and executes JavaScript \u2014 all in milliseconds.' },
    { num: 8, title: 'Webpage appears on screen', detail: 'You see the page!', emoji: '\uD83C\uDF89', explanation: 'The fully rendered Consica Academy webpage appears on your screen! You can now read, click, and explore. The entire journey from DNS lookup to full display takes less than a second.' }
  ];
  var state = { currentStep: -1, isPlaying: false, isComplete: false, timerId: null, arrowPaths: [] };
  var els = {};
  function cacheDom() {
    els.stepsGrid = document.getElementById('stepsGrid'); els.arrowsOverlay = document.getElementById('arrowsOverlay'); els.diagramWrapper = document.getElementById('diagramWrapper');
    els.progressFill = document.getElementById('progressFill'); els.progressText = document.getElementById('progressText'); els.timeDisplay = document.getElementById('timeDisplay');
    els.playBtn = document.getElementById('playBtn'); els.pauseBtn = document.getElementById('pauseBtn'); els.resetBtn = document.getElementById('resetBtn');
    els.completionBanner = document.getElementById('completionBanner'); els.totalTime = document.getElementById('totalTime'); els.ariaLive = document.getElementById('ariaLive');
    els.detailModal = document.getElementById('detailModal'); els.modalBackdrop = document.getElementById('modalBackdrop'); els.modalClose = document.getElementById('modalClose');
    els.modalEmoji = document.getElementById('modalEmoji'); els.modalTitle = document.getElementById('modalTitle'); els.modalStepNum = document.getElementById('modalStepNum');
    els.modalDetail = document.getElementById('modalDetail'); els.modalExplanation = document.getElementById('modalExplanation');
  }
  function renderSteps() {
    var html = '';
    for (var i = 0; i < STEPS.length; i++) { var s = STEPS[i]; html += '<div class="step-card state-pending" data-step="' + s.num + '" data-index="' + i + '" tabindex="0" role="button" aria-label="Step ' + s.num + ': ' + s.title + '. ' + s.detail + '"><div class="step-top"><span class="step-number">' + s.num + '</span><span class="step-emoji" aria-hidden="true">' + s.emoji + '</span></div><div class="step-title">' + s.title + '</div><div class="step-detail">' + s.detail + '</div></div>'; }
    els.stepsGrid.innerHTML = html; bindCardClicks();
  }
  function getCardPositions() { var wr = els.diagramWrapper.getBoundingClientRect(); var cards = els.stepsGrid.querySelectorAll('.step-card'); var pos = []; for (var i = 0; i < cards.length; i++) { var r = cards[i].getBoundingClientRect(); pos.push({ left: r.left - wr.left, right: r.right - wr.left, top: r.top - wr.top, bottom: r.bottom - wr.top, cx: r.left + r.width / 2 - wr.left, cy: r.top + r.height / 2 - wr.top }); } return pos; }
  function getDesktopConns() { var c = []; for (var i = 0; i < 3; i++) c.push({ startIdx: i, endIdx: i + 1, type: 'right' }); c.push({ startIdx: 3, endIdx: 4, type: 'down' }); for (var i = 4; i < 7; i++) c.push({ startIdx: i, endIdx: i + 1, type: 'left' }); return c; }
  function arrowCoords(pos, conn) { var gap = 7; var s = pos[conn.startIdx]; var e = pos[conn.endIdx]; if (conn.type === 'right') return { x1: s.right - gap, y1: s.cy, x2: e.left + gap, y2: e.cy }; if (conn.type === 'down') return { x1: s.cx, y1: s.bottom - gap, x2: e.cx, y2: e.top + gap }; if (conn.type === 'left') return { x1: s.left - gap, y1: s.cy, x2: e.right + gap, y2: e.cy }; return { x1: 0, y1: 0, x2: 0, y2: 0 }; }
  function clearArrows() { var old = els.arrowsOverlay.querySelectorAll('.arrow-path'); for (var i = 0; i < old.length; i++) old[i].remove(); state.arrowPaths = []; }
  function createArrowPath(d, connIdx) { var path = document.createElementNS('http://www.w3.org/2000/svg', 'path'); path.setAttribute('d', d); path.setAttribute('class', 'arrow-path'); path.setAttribute('data-conn-index', connIdx); return path; }
  function buildArrows() {
    clearArrows(); var pos = getCardPositions();
    if (window.innerWidth < 768) { for (var i = 0; i < pos.length - 1; i++) { var d = 'M ' + pos[i].cx + ',' + (pos[i].bottom - 6) + ' L ' + pos[i + 1].cx + ',' + (pos[i + 1].top + 6); var path = createArrowPath(d, i); els.arrowsOverlay.appendChild(path); state.arrowPaths.push(path); } }
    else { var conns = getDesktopConns(); for (var i = 0; i < conns.length; i++) { var c = arrowCoords(pos, conns[i]); var d = 'M ' + c.x1 + ',' + c.y1 + ' L ' + c.x2 + ',' + c.y2; var path = createArrowPath(d, i); els.arrowsOverlay.appendChild(path); state.arrowPaths.push(path); } }
    applyArrowStyles();
  }
  function applyArrowStyles() { for (var i = 0; i < state.arrowPaths.length; i++) { var path = state.arrowPaths[i]; path.style.transition = 'none'; var targetStep = arrowTargetStep(i); var len = path.getTotalLength(); path.style.strokeDasharray = len; if (targetStep < state.currentStep) { path.style.strokeDashoffset = 0; path.setAttribute('marker-end', 'url(#arrow-completed)'); path.setAttribute('class', 'arrow-path state-completed'); } else if (targetStep === state.currentStep) { path.style.strokeDashoffset = 0; path.setAttribute('marker-end', 'url(#arrow-active)'); path.setAttribute('class', 'arrow-path state-active'); } else { path.style.strokeDashoffset = len; path.setAttribute('marker-end', 'url(#arrow-pending)'); path.setAttribute('class', 'arrow-path state-pending'); } } }
  function arrowTargetStep(arrowIdx) { if (window.innerWidth < 768) return arrowIdx + 1; var conns = getDesktopConns(); if (arrowIdx < conns.length) return conns[arrowIdx].endIdx; return -1; }
  function animateArrowForward(arrowIdx) { var path; for (var i = 0; i < state.arrowPaths.length; i++) { if (parseInt(state.arrowPaths[i].getAttribute('data-conn-index'), 10) === arrowIdx) { path = state.arrowPaths[i]; break; } } if (!path) return; var len = path.getTotalLength(); path.style.strokeDasharray = len; path.style.strokeDashoffset = len; path.setAttribute('class', 'arrow-path state-active'); path.setAttribute('marker-end', 'url(#arrow-active)'); path.getBoundingClientRect(); path.style.transition = 'stroke-dashoffset 0.5s cubic-bezier(0.4, 0, 0.2, 1)'; path.style.strokeDashoffset = 0; }
  function getArrowIdxForStep(stepIdx) { if (stepIdx <= 0) return -1; if (window.innerWidth < 768) return stepIdx - 1; var conns = getDesktopConns(); for (var i = 0; i < conns.length; i++) { if (conns[i].endIdx === stepIdx) return i; } return -1; }
  function goToStep(stepIdx) {
    if (stepIdx < -1 || stepIdx >= STEPS.length) return; state.currentStep = stepIdx;
    var cards = els.stepsGrid.querySelectorAll('.step-card');
    for (var i = 0; i < cards.length; i++) { cards[i].classList.remove('state-pending', 'state-active', 'state-completed'); if (i < stepIdx) cards[i].classList.add('state-completed'); else if (i === stepIdx) cards[i].classList.add('state-active'); else cards[i].classList.add('state-pending'); }
    applyArrowStyles();
    var done = stepIdx + 1; if (stepIdx < 0) done = 0; var pct = (done / STEPS.length) * 100; els.progressFill.style.width = pct + '%'; els.progressFill.setAttribute('aria-valuenow', done); els.progressText.textContent = done + ' / ' + STEPS.length + ' Steps';
    if (stepIdx >= 0 && stepIdx < STEPS.length) { els.ariaLive.textContent = 'Step ' + STEPS[stepIdx].num + ': ' + STEPS[stepIdx].title + '. ' + STEPS[stepIdx].detail; }
    if (stepIdx === STEPS.length - 1) { state.isComplete = true; els.completionBanner.removeAttribute('hidden'); els.completionBanner.style.display = 'block'; els.totalTime.textContent = (0.7 + Math.random() * 0.2).toFixed(1); stopAutoPlay(); } else { state.isComplete = false; els.completionBanner.setAttribute('hidden', ''); els.completionBanner.style.display = 'none'; }
    updateTimeDisplay();
  }
  function updateTimeDisplay() { if (state.currentStep < 0) { els.timeDisplay.textContent = ''; return; } var elapsed = (state.currentStep + 1) * 1.5; var total = STEPS.length * 1.5; els.timeDisplay.textContent = '\u23F1\uFE0F ' + (state.currentStep === STEPS.length - 1 ? total.toFixed(1) : elapsed.toFixed(1)) + 's / ' + total.toFixed(1) + 's'; }
  function startAutoPlay() { if (state.isPlaying) return; state.isPlaying = true; els.playBtn.disabled = true; els.pauseBtn.disabled = false; if (state.isComplete || state.currentStep >= STEPS.length - 1) resetJourney(); if (state.currentStep < 0) goToStep(0); scheduleNext(); }
  function scheduleNext() { if (!state.isPlaying) return; var next = state.currentStep + 1; if (next >= STEPS.length) { stopAutoPlay(); return; } var aidx = getArrowIdxForStep(next); if (aidx >= 0) animateArrowForward(aidx); state.timerId = setTimeout(function () { if (!state.isPlaying) return; goToStep(next); if (state.isPlaying && next < STEPS.length - 1) scheduleNext(); }, 1500); }
  function pauseAutoPlay() { if (!state.isPlaying) return; state.isPlaying = false; if (state.timerId) { clearTimeout(state.timerId); state.timerId = null; } els.playBtn.disabled = false; els.pauseBtn.disabled = true; }
  function stopAutoPlay() { state.isPlaying = false; if (state.timerId) { clearTimeout(state.timerId); state.timerId = null; } els.playBtn.disabled = true; els.pauseBtn.disabled = true; }
  function resetJourney() { stopAutoPlay(); state.isComplete = false; state.currentStep = -1; var cards = els.stepsGrid.querySelectorAll('.step-card'); for (var i = 0; i < cards.length; i++) { cards[i].classList.remove('state-active', 'state-completed'); cards[i].classList.add('state-pending'); } els.progressFill.style.width = '0%'; els.progressText.textContent = '0 / ' + STEPS.length + ' Steps'; els.completionBanner.setAttribute('hidden', ''); els.completionBanner.style.display = 'none'; els.timeDisplay.textContent = ''; els.ariaLive.textContent = 'Journey reset.'; els.playBtn.disabled = false; els.pauseBtn.disabled = true; applyArrowStyles(); }
  var lastFocusedCard = null;
  function openDetailModal(stepIdx) { if (stepIdx < 0 || stepIdx >= STEPS.length) return; var s = STEPS[stepIdx]; els.modalEmoji.textContent = s.emoji; els.modalTitle.textContent = s.title; els.modalStepNum.textContent = 'Step ' + s.num + ' of ' + STEPS.length; els.modalDetail.textContent = '\u201C' + s.detail + '\u201D'; els.modalExplanation.textContent = s.explanation; els.detailModal.removeAttribute('hidden'); setTimeout(function () { els.modalClose.focus(); }, 50); document.body.style.overflow = 'hidden'; }
  function closeDetailModal() { els.detailModal.setAttribute('hidden', ''); document.body.style.overflow = ''; if (lastFocusedCard) { lastFocusedCard.focus(); lastFocusedCard = null; } }
  function bindCardClicks() { var cards = els.stepsGrid.querySelectorAll('.step-card'); for (var i = 0; i < cards.length; i++) { cards[i].addEventListener('click', function (e) { var card = e.currentTarget; var idx = parseInt(card.getAttribute('data-index'), 10); if (isNaN(idx)) return; if (state.isPlaying) pauseAutoPlay(); lastFocusedCard = card; openDetailModal(idx); goToStep(idx); var aidx = getArrowIdxForStep(idx); if (aidx >= 0) animateArrowForward(aidx); }); } }
  function bindEvents() {
    els.playBtn.addEventListener('click', startAutoPlay); els.pauseBtn.addEventListener('click', pauseAutoPlay); els.resetBtn.addEventListener('click', resetJourney);
    els.modalBackdrop.addEventListener('click', function (e) { if (e.target === els.modalBackdrop) closeDetailModal(); });
    els.modalClose.addEventListener('click', closeDetailModal);
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && !els.detailModal.hasAttribute('hidden')) closeDetailModal(); if ((e.key === ' ' || e.key === 'Enter') && e.target.classList.contains('step-card')) { e.preventDefault(); e.target.click(); } });
    var rt; window.addEventListener('resize', function () { if (rt) clearTimeout(rt); rt = setTimeout(function () { if (state.arrowPaths.length > 0) buildArrows(); }, 200); });
  }
  function init() { cacheDom(); renderSteps(); buildArrows(); resetJourney(); bindEvents(); }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();