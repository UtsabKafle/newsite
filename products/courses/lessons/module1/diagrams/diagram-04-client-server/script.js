(function () {
  'use strict';
  var SCENARIOS = {
    youtube: { name: 'Watch a Video', request: 'GET /watch?v=dQw4w9WgXcQ HTTP/1.1\nHost: youtube.com\nRange: bytes=0-', response: 'HTTP/1.1 206 Partial Content\nContent-Type: video/mp4\n[Streaming video data \u2026 50 MB]', reqTitle: 'HTTP Request', resTitle: 'Video Stream', dataSize: '50 MB', sizePercent: 100, sizeNote: 'Large file', resultIcon: '\u25B6', resultText: '\uD83C\uDFAC Video is now streaming from the server!' },
    website: { name: 'Open a Website', request: 'GET /index.html HTTP/1.1\nHost: example.com\nAccept: text/html', response: 'HTTP/1.1 200 OK\nContent-Type: text/html\n<!DOCTYPE html>\n<html>\n<head>\n  <title>Example</title>\n</head>\n<body>\n  <h1>Hello World</h1>\n</body>\n</html>', reqTitle: 'HTTP Request', resTitle: 'HTML Response', dataSize: '2 KB', sizePercent: 4, sizeNote: 'Small file', resultIcon: '\u25B6', resultText: '\uD83C\uDF10 Website loaded successfully from the server!' },
    game: { name: 'Play a Game', request: 'POST /api/move HTTP/1.1\nContent-Type: application/json\n\n{"player":"hero1","action":"jump","x":120,"y":340}', response: 'HTTP/1.1 200 OK\nContent-Type: application/json\n\n{"status":"ok","score":1500,"level":"3-2","enemies":[{"id":"e1","x":200,"y":400}]}', reqTitle: 'Game Action', resTitle: 'State Update', dataSize: '1 KB', sizePercent: 2, sizeNote: 'Tiny packet', resultIcon: '\u25B6', resultText: '\uD83C\uDFAE Game action sent \u2014 server updated the game state!' }
  };
  var currentScenario = 'youtube';
  var isAnimating = false, isAutoDemo = false, autoDemoTimer = null, animationTimeouts = [];
  var $ = function (sel) { return document.querySelector(sel); };
  var $$ = function (sel) { return document.querySelectorAll(sel); };
  var els = {
    scenarioBtns: $$('.scenario-btn'), sendBtn: $('#btn-send'), autoBtn: $('#btn-auto'), resetBtn: $('#btn-reset'),
    requestLine: $('.request-arrow'), responseLine: $('.response-arrow'), reqPacket: $('.request-packet'), resPacket: $('.response-packet'),
    reqLabel: $('.req-label'), resLabel: $('.res-label'), reqDetail: $('.request-detail'), resDetail: $('.response-detail'),
    reqDetailBody: $('#request-detail-body'), resDetailBody: $('#response-detail-body'), serverBlock: $('.server-block'),
    clientIcon: $('.client-icon'), serverIcon: $('.server-icon'),
    dataReqTitle: $('#data-req-title'), dataResTitle: $('#data-res-title'), dataReqContent: $('#data-req-content'), dataResContent: $('#data-res-content'),
    sizeValue: $('#size-value'), sizeNote: $('#size-note'), sizeBarFill: $('#size-bar-fill'),
    statusSteps: $$('.status-step'), progressBar: $('#progress-bar'), resultBanner: $('#result-banner'), resultIcon: $('#result-icon'), resultText: $('#result-text')
  };
  function clearTimeouts() { animationTimeouts.forEach(function (t) { clearTimeout(t); }); animationTimeouts = []; }
  function setAnimating(val) { isAnimating = val; els.sendBtn.disabled = val; els.autoBtn.disabled = val; }
  function removeAllActive() {
    els.requestLine.classList.remove('active'); els.responseLine.classList.remove('active');
    els.reqPacket.classList.remove('active'); els.resPacket.classList.remove('active');
    els.reqLabel.classList.remove('active'); els.resLabel.classList.remove('active');
    els.serverBlock.classList.remove('processing');
    els.clientIcon.classList.remove('active-send', 'active-receive'); els.serverIcon.classList.remove('active-send', 'active-process', 'active-receive');
    els.reqDetail.className = 'device-detail request-detail idle'; els.resDetail.className = 'device-detail response-detail idle';
    els.resultBanner.className = 'result-banner'; els.progressBar.style.width = '0';
    els.statusSteps.forEach(function (s) { s.classList.remove('active', 'done'); });
  }
  function updateUIForScenario(scenarioId) {
    var data = SCENARIOS[scenarioId]; if (!data) return;
    els.reqDetailBody.innerHTML = '<code>' + data.request.replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/\n/g,'<br>') + '</code>';
    els.resDetailBody.innerHTML = '<code>' + data.response.replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/\n/g,'<br>') + '</code>';
    els.dataReqTitle.textContent = data.reqTitle; els.dataResTitle.textContent = data.resTitle;
    els.dataReqContent.textContent = data.request; els.dataResContent.textContent = data.response;
    els.sizeValue.textContent = data.dataSize; els.sizeNote.textContent = data.sizeNote; els.sizeBarFill.style.width = data.sizePercent + '%';
    els.resultIcon.textContent = '\u25B6'; els.resultText.textContent = data.name + ' \u2014 Ready. Click "Send Request" to see the cycle.';
  }
  function switchScenario(scenarioId) {
    if (isAnimating) return;
    currentScenario = scenarioId;
    els.scenarioBtns.forEach(function (btn) { var id = btn.getAttribute('data-scenario'); btn.classList.toggle('active', id === scenarioId); btn.setAttribute('aria-selected', id === scenarioId ? 'true' : 'false'); btn.setAttribute('tabindex', id === scenarioId ? '0' : '-1'); });
    removeAllActive(); updateUIForScenario(scenarioId);
  }
  function runAnimation() {
    if (isAnimating) return; setAnimating(true); removeAllActive();
    var data = SCENARIOS[currentScenario];
    els.requestLine.classList.add('active'); els.reqPacket.classList.add('active'); els.reqLabel.classList.add('active');
    els.clientIcon.classList.add('active-send'); els.reqDetail.className = 'device-detail request-detail sending';
    els.statusSteps[0].classList.add('active'); els.progressBar.style.width = '25%';
    els.resultIcon.textContent = '\u25B6'; els.resultText.textContent = '\u231B Sending request to server\u2026';
    animationTimeouts.push(setTimeout(function () { els.statusSteps[0].classList.remove('active'); els.statusSteps[0].classList.add('done'); els.statusSteps[1].classList.add('active'); els.progressBar.style.width = '50%'; els.clientIcon.classList.remove('active-send'); els.serverIcon.classList.add('active-process'); els.serverBlock.classList.add('processing'); els.reqDetail.className = 'device-detail request-detail idle'; els.resultText.textContent = '\u2699 Server is processing your request\u2026'; }, 900));
    animationTimeouts.push(setTimeout(function () { els.statusSteps[1].classList.remove('active'); els.statusSteps[1].classList.add('done'); els.statusSteps[2].classList.add('active'); els.progressBar.style.width = '75%'; els.serverBlock.classList.remove('processing'); els.serverIcon.classList.remove('active-process'); els.serverIcon.classList.add('active-receive'); els.responseLine.classList.add('active'); els.resPacket.classList.add('active'); els.resLabel.classList.add('active'); els.resDetail.className = 'device-detail response-detail receiving'; els.resultText.textContent = '\u231B Server is sending response back\u2026'; }, 1700));
    animationTimeouts.push(setTimeout(function () { els.statusSteps[2].classList.remove('active'); els.statusSteps[2].classList.add('done'); els.statusSteps[3].classList.add('done'); els.progressBar.style.width = '100%'; els.clientIcon.classList.remove('active-send'); els.clientIcon.classList.add('active-receive'); els.serverIcon.classList.remove('active-receive'); els.resDetail.className = 'device-detail response-detail idle'; els.resultBanner.className = 'result-banner success'; els.resultIcon.textContent = '\u2713'; els.resultText.textContent = '\u2705 ' + data.resultText; setAnimating(false); if (isAutoDemo) { autoDemoTimer = setTimeout(function () { cycleAutoDemo(); }, 2600); } }, 2600));
  }
  function cycleAutoDemo() { if (!isAutoDemo) return; var ids = Object.keys(SCENARIOS); var idx = ids.indexOf(currentScenario); var nextIdx = (idx + 1) % ids.length; switchScenario(ids[nextIdx]); animationTimeouts.push(setTimeout(function () { runAnimation(); }, 500)); }
  function startAutoDemo() { if (isAnimating) return; isAutoDemo = true; els.autoBtn.innerHTML = '<span class="ctrl-icon" aria-hidden="true">\u25A0</span><span class="ctrl-text">Stop Demo</span>'; els.autoBtn.classList.add('active'); runAnimation(); }
  function stopAutoDemo() { isAutoDemo = false; if (autoDemoTimer) { clearTimeout(autoDemoTimer); autoDemoTimer = null; } els.autoBtn.innerHTML = '<span class="ctrl-icon" aria-hidden="true">\u25B6\u25B6</span><span class="ctrl-text">Auto Demo</span>'; els.autoBtn.classList.remove('active'); }
  function resetAll() { stopAutoDemo(); clearTimeouts(); setAnimating(false); removeAllActive(); updateUIForScenario(currentScenario); els.resultBanner.className = 'result-banner'; els.resultIcon.textContent = '\u25B6'; els.resultText.textContent = '\uD83D\uDD04 ' + SCENARIOS[currentScenario].name + ' \u2014 Ready.'; }
  els.scenarioBtns.forEach(function (btn) {
    btn.addEventListener('click', function () { var id = btn.getAttribute('data-scenario'); if (id === currentScenario) return; if (isAutoDemo) stopAutoDemo(); switchScenario(id); });
    btn.addEventListener('keydown', function (e) { var btns = Array.from(els.scenarioBtns); var idx = btns.indexOf(btn); var dir = 0; if (e.key === 'ArrowRight' || e.key === 'ArrowDown') dir = 1; if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') dir = -1; if (dir === 0) return; e.preventDefault(); var next = btns[(idx + dir + btns.length) % btns.length]; next.focus(); next.click(); });
  });
  els.sendBtn.addEventListener('click', runAnimation);
  els.autoBtn.addEventListener('click', function () { if (isAutoDemo) { stopAutoDemo(); } else { if (isAnimating) return; startAutoDemo(); } });
  els.resetBtn.addEventListener('click', resetAll);
  switchScenario('youtube');
})();