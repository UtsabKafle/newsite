(function () {
  const playBtn = document.getElementById('playBtn');
  const pauseBtn = document.getElementById('pauseBtn');
  const resetBtn = document.getElementById('resetBtn');
  const statusBadge = document.getElementById('statusBadge');
  const healthScoreValue = document.getElementById('healthScoreValue');
  const healthRing = document.getElementById('healthRing');
  const cpuValue = document.getElementById('cpuValue');
  const memValue = document.getElementById('memValue');
  const diskValue = document.getElementById('diskValue');
  const batValue = document.getElementById('batValue');
  const cpuStatus = document.getElementById('cpuStatus');
  const memStatus = document.getElementById('memStatus');
  const diskStatus = document.getElementById('diskStatus');
  const batStatus = document.getElementById('batStatus');
  const issuesList = document.getElementById('issuesList');
  const scanFill = document.getElementById('scanFill');
  const scanTrack = document.getElementById('scanTrack');
  const scanLabel = document.getElementById('scanLabel');
  const canvases = document.querySelectorAll('.gauge-canvas');

  const R = 55, CX = 100, CY = 68;
  let isPlaying = false, isPaused = false;
  let animId = null, scanStep = 0;
  let scanValues = { cpu: 45, mem: 62, disk: 58, bat: 80 };
  let warningValues = { cpu: 78, mem: 88, disk: 92, bat: 15 };
  let useWarnings = false;

  const circumference = 2 * Math.PI * 52;

  const issuesDB = {
    normal: [
      { text: 'CPU temperature normal (45°C)', type: 'ok' },
      { text: 'Memory usage within limits (62%)', type: 'ok' },
      { text: 'Disk space adequate (58% used)', type: 'ok' },
      { text: 'Battery level good (80%)', type: 'ok' },
    ],
    warning: [
      { text: 'CPU running warm (78°C)', type: 'warning' },
      { text: 'Memory usage high (88%)', type: 'warning' },
      { text: 'Disk space low (92% used)', type: 'error' },
      { text: 'Battery level critical (15%)', type: 'error' },
    ]
  };

  function setStatus(text, cls) {
    statusBadge.textContent = text;
    statusBadge.className = 'status-badge' + (cls ? ' ' + cls : '');
  }

  function drawGauge(canvas, value, color) {
    const ctx = canvas.getContext('2d');
    const w = canvas.width, h = canvas.height;
    ctx.clearRect(0, 0, w, h);

    const angle = (value / 100) * Math.PI;
    const startAngle = Math.PI;
    const endAngle = Math.PI + angle;
    const bgEnd = Math.PI + Math.PI;

    ctx.beginPath();
    ctx.arc(CX, CY, R, startAngle, bgEnd);
    ctx.strokeStyle = 'rgba(255,255,255,0.06)';
    ctx.lineWidth = 10;
    ctx.lineCap = 'round';
    ctx.stroke();

    const grad = ctx.createLinearGradient(60, 20, 140, 110);
    if (color === 'safe') { grad.addColorStop(0, '#66bb6a'); grad.addColorStop(1, '#43a047'); }
    else if (color === 'warning') { grad.addColorStop(0, '#ffa726'); grad.addColorStop(1, '#ff9800'); }
    else if (color === 'danger') { grad.addColorStop(0, '#ef5350'); grad.addColorStop(1, '#e53935'); }
    else { grad.addColorStop(0, '#0959C8'); grad.addColorStop(1, '#4fc3f7'); }

    ctx.beginPath();
    ctx.arc(CX, CY, R, startAngle, endAngle);
    ctx.strokeStyle = grad;
    ctx.lineWidth = 10;
    ctx.lineCap = 'round';
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(CX, CY, R - 3, endAngle - 0.05, endAngle + 0.05);
    ctx.strokeStyle = 'rgba(255,255,255,0.3)';
    ctx.lineWidth = 4;
    ctx.stroke();
  }

  function getColor(value, type) {
    if (type === 'cpu') {
      if (value < 60) return 'safe';
      if (value < 80) return 'warning';
      return 'danger';
    }
    if (value < 70) return 'safe';
    if (value < 85) return 'warning';
    return 'danger';
  }

  function updateGauge(type, value) {
    let el, statusEl;
    if (type === 'cpu') { el = cpuValue; statusEl = cpuStatus; }
    else if (type === 'memory') { el = memValue; statusEl = memStatus; }
    else if (type === 'disk') { el = diskValue; statusEl = diskStatus; }
    else if (type === 'battery') { el = batValue; statusEl = batStatus; }
    if (!el) return;

    const unit = type === 'cpu' ? '°C' : '%';
    const displayVal = type === 'cpu' ? Math.round(value) : Math.round(value);
    el.textContent = displayVal + unit;

    const color = getColor(value, type);
    statusEl.textContent = color === 'safe' ? 'Normal' : color === 'warning' ? 'Warning' : 'Critical';
    statusEl.className = 'gauge-status ' + color;

    const idx = type === 'cpu' ? 0 : type === 'memory' ? 1 : type === 'disk' ? 2 : 3;
    const canvas = canvases[idx];
    if (canvas) drawGauge(canvas, value, color);
  }

  function updateAllGauges(vals) {
    updateGauge('cpu', vals.cpu);
    updateGauge('memory', vals.mem);
    updateGauge('disk', vals.disk);
    updateGauge('battery', vals.bat);
    updateHealthScore(vals);
  }

  function updateHealthScore(vals) {
    const cpuScore = Math.max(0, 100 - vals.cpu * 0.8);
    const memScore = Math.max(0, 100 - vals.mem * 0.6);
    const diskScore = Math.max(0, 100 - vals.disk * 0.5);
    const batScore = vals.bat;
    const score = Math.round((cpuScore + memScore + diskScore + batScore) / 4);
    healthScoreValue.textContent = score;
    const offset = circumference - (score / 100) * circumference;
    healthRing.style.strokeDashoffset = offset;
    if (score >= 70) healthRing.style.stroke = '#66bb6a';
    else if (score >= 50) healthRing.style.stroke = '#ffa726';
    else healthRing.style.stroke = '#ef5350';
  }

  function updateIssues(warn) {
    issuesList.innerHTML = '';
    const data = warn ? issuesDB.warning : issuesDB.normal;
    data.forEach(item => {
      const li = document.createElement('li');
      li.className = 'issue-item' + (item.type !== 'ok' ? ' ' + item.type : '');
      li.setAttribute('role', 'listitem');
      li.textContent = (item.type === 'warning' ? '⚠ ' : item.type === 'error' ? '✕ ' : '✓ ') + item.text;
      issuesList.appendChild(li);
    });
  }

  function scanStepFn() {
    if (!isPlaying || isPaused) return;
    const totalSteps = 20;
    if (scanStep > totalSteps) {
      isPlaying = false;
      playBtn.disabled = false;
      pauseBtn.disabled = true;
      scanFill.style.width = '100%';
      scanLabel.textContent = 'Scan complete.';
      setStatus('Complete', '');
      statusBadge.style.color = '#66bb6a';
      statusBadge.style.borderColor = '#66bb6a';
      updateIssues(useWarnings);
      return;
    }
    const progress = Math.min((scanStep / totalSteps) * 100, 100);
    scanFill.style.width = progress + '%';
    scanTrack.setAttribute('aria-valuenow', progress);

    const phases = [
      'Initializing sensors...',
      'Checking CPU temperature...',
      'Analyzing memory usage...',
      'Scanning disk space...',
      'Testing battery level...',
      'Evaluating system health...',
    ];
    const phaseIdx = Math.min(Math.floor(scanStep / 4), phases.length - 1);
    scanLabel.textContent = phases[phaseIdx];

    const vals = useWarnings ? warningValues : scanValues;
    const progressRatio = Math.min(scanStep / totalSteps, 1);
    const interp = (target) => Math.round(target * progressRatio);
    updateGauge('cpu', interp(vals.cpu) || 1);
    updateGauge('memory', interp(vals.mem) || 1);
    updateGauge('disk', interp(vals.disk) || 1);
    updateGauge('battery', interp(vals.bat) || 1);
    if (progressRatio > 0) updateHealthScore({
      cpu: interp(vals.cpu) || 1,
      mem: interp(vals.mem) || 1,
      disk: interp(vals.disk) || 1,
      bat: interp(vals.bat) || 1
    });

    scanStep++;
    animId = setTimeout(scanStepFn, 150);
  }

  function startScan() {
    if (isPlaying) {
      if (isPaused) {
        isPaused = false;
        pauseBtn.innerHTML = '<svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg><span>Pause</span>';
        setStatus('Scanning...', 'active');
        animId = setTimeout(scanStepFn, 100);
        return;
      }
      return;
    }
    isPlaying = true;
    isPaused = false;
    scanStep = 0;
    playBtn.disabled = true;
    pauseBtn.disabled = false;
    resetBtn.disabled = false;
    statusBadge.style.color = '';
    statusBadge.style.borderColor = '';
    setStatus('Scanning...', 'active');
    issuesList.innerHTML = '<li class="issue-item placeholder" role="listitem">Scanning system...</li>';
    scanFill.style.width = '0%';
    scanLabel.textContent = 'Starting...';
    animId = setTimeout(scanStepFn, 200);
  }

  function pauseScan() {
    if (!isPlaying) return;
    if (isPaused) {
      isPaused = false;
      pauseBtn.innerHTML = '<svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg><span>Pause</span>';
      setStatus('Scanning...', 'active');
      animId = setTimeout(scanStepFn, 100);
    } else {
      isPaused = true;
      pauseBtn.innerHTML = '<svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg><span>Resume</span>';
      setStatus('Paused', 'warning');
      if (animId) { clearTimeout(animId); animId = null; }
    }
  }

  function resetAll() {
    if (animId) { clearTimeout(animId); animId = null; }
    isPlaying = false;
    isPaused = false;
    scanStep = 0;
    playBtn.disabled = false;
    pauseBtn.disabled = true;
    resetBtn.disabled = true;
    pauseBtn.innerHTML = '<svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg><span>Pause</span>';
    statusBadge.style.color = '';
    statusBadge.style.borderColor = '';
    setStatus('Ready', '');
    scanFill.style.width = '0%';
    scanLabel.textContent = 'Waiting to scan...';
    issuesList.innerHTML = '<li class="issue-item placeholder" role="listitem">No issues detected. System healthy.</li>';
    updateAllGauges({ cpu: 0, mem: 0, disk: 0, bat: 0 });
    healthScoreValue.textContent = '--';
    healthRing.style.strokeDashoffset = circumference;
    healthRing.style.stroke = 'var(--brand)';
  }

  function toggleWarnings() {
    useWarnings = !useWarnings;
    if (!isPlaying) {
      updateAllGauges(useWarnings ? warningValues : scanValues);
      updateIssues(useWarnings);
      setStatus(useWarnings ? 'Warning mode' : 'Normal mode', useWarnings ? 'warning' : '');
    }
  }

  playBtn.addEventListener('click', startScan);
  pauseBtn.addEventListener('click', pauseScan);
  resetBtn.addEventListener('click', resetAll);
  resetBtn.disabled = true;

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') resetAll();
    if (e.key === 'w' || e.key === 'W') toggleWarnings();
  });

  canvases.forEach((c, i) => {
    c.width = 200; c.height = 120;
    drawGauge(c, 0, 'safe');
  });
  healthRing.style.strokeDasharray = circumference;

  const toggleWarnBtn = document.createElement('button');
  toggleWarnBtn.className = 'ctrl-btn';
  toggleWarnBtn.setAttribute('aria-label', 'Toggle warning mode');
  toggleWarnBtn.innerHTML = '<svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z"/></svg><span>Warnings</span>';
  toggleWarnBtn.addEventListener('click', toggleWarnings);
  document.querySelector('.controls').appendChild(toggleWarnBtn);
})();
