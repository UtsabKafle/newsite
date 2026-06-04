(function () {
  const playBtn = document.getElementById('playBtn');
  const pauseBtn = document.getElementById('pauseBtn');
  const resetBtn = document.getElementById('resetBtn');
  const statusBadge = document.getElementById('statusBadge');
  const progressFill = document.getElementById('progressFill');
  const progressPercent = document.getElementById('progressPercent');
  const progressTrack = document.getElementById('progressTrack');
  const timelineFlow = document.getElementById('timelineFlow');
  const detailPanel = document.getElementById('detailPanel');
  const detailClose = document.getElementById('detailClose');
  const detailTitle = document.getElementById('detailTitle');
  const detailBody = document.getElementById('detailBody');

  const stages = document.querySelectorAll('.stage-card');
  const totalStages = stages.length;

  let currentStage = -1;
  let isPlaying = false;
  let isPaused = false;
  let timerId = null;
  let stageStartTime = 0;
  let accumulatedTime = 0;

  const stageDurations = [300, 800, 1200, 500, 1500, 1000, 700, 500];
  const totalDuration = stageDurations.reduce((a, b) => a + b, 0);

  function setStatus(text, active) {
    statusBadge.textContent = text;
    statusBadge.classList.toggle('active', !!active);
  }

  function updateProgress(stage) {
    if (stage < 0) {
      progressFill.style.width = '0%';
      progressPercent.textContent = '0%';
      progressTrack.setAttribute('aria-valuenow', '0');
      return;
    }
    let elapsed = 0;
    for (let i = 0; i < Math.min(stage + 1, stageDurations.length); i++) {
      elapsed += stageDurations[i];
    }
    const pct = Math.min(Math.round((elapsed / totalDuration) * 100), 100);
    progressFill.style.width = pct + '%';
    progressPercent.textContent = pct + '%';
    progressTrack.setAttribute('aria-valuenow', pct);
  }

  function clearActive() {
    stages.forEach(s => { s.classList.remove('active', 'completed'); });
  }

  function highlightStage(idx) {
    clearActive();
    if (idx < 0 || idx >= totalStages) return;
    stages[idx].classList.add('active');
    for (let i = 0; i < idx; i++) stages[i].classList.add('completed');

    const card = stages[idx];
    card.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
  }

  function showDetail(idx) {
    const card = stages[idx];
    if (!card) return;
    const title = card.querySelector('.stage-title')?.textContent || '';
    const desc = card.querySelector('.stage-desc')?.textContent || '';
    const icon = card.querySelector('.stage-icon')?.textContent || '';
    const time = card.querySelector('.stage-time')?.textContent || '';
    detailTitle.textContent = `${icon} ${title}`;
    detailBody.innerHTML = `<p>${desc}</p><p style="margin-top:8px;color:var(--brand);font-weight:600;">Estimated time: ${time}</p>`;
    detailPanel.hidden = false;
    detailClose.focus();
  }

  function hideDetail() {
    detailPanel.hidden = true;
  }

  stages.forEach((card, idx) => {
    card.addEventListener('click', function () {
      if (this.classList.contains('active') && !isPlaying) {
        showDetail(idx);
      } else if (!isPlaying) {
        clearActive();
        highlightStage(idx);
        updateProgress(idx);
        currentStage = idx;
        showDetail(idx);
      }
    });
    card.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        this.click();
      }
    });
  });

  detailClose.addEventListener('click', hideDetail);
  detailClose.addEventListener('keydown', function (e) {
    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); hideDetail(); }
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') { hideDetail(); if (isPlaying) stopBoot(); }
  });

  function resetBoot() {
    if (timerId) { clearTimeout(timerId); timerId = null; }
    isPlaying = false;
    isPaused = false;
    currentStage = -1;
    accumulatedTime = 0;
    clearActive();
    updateProgress(-1);
    setStatus('Ready', false);
    playBtn.disabled = false;
    pauseBtn.disabled = true;
    resetBtn.disabled = true;
    pauseBtn.innerHTML = '<svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg><span>Pause</span>';
  }

  function nextStage() {
    if (!isPlaying || isPaused) return;
    const next = currentStage + 1;
    if (next >= totalStages) {
      updateProgress(totalStages - 1);
      setStatus('Boot complete', true);
      statusBadge.style.color = '#66bb6a';
      statusBadge.style.borderColor = '#66bb6a';
      isPlaying = false;
      playBtn.disabled = false;
      pauseBtn.disabled = true;
      stages[totalStages - 1].classList.remove('active');
      stages[totalStages - 1].classList.add('completed');
      return;
    }
    highlightStage(next);
    updateProgress(next);
    currentStage = next;
    setStatus(stages[next].querySelector('.stage-title')?.textContent || '', true);
    stageStartTime = performance.now();
    const dur = stageDurations[next] || 500;
    timerId = setTimeout(nextStage, dur);
  }

  function startBoot() {
    if (isPlaying) {
      if (isPaused) {
        isPaused = false;
        pauseBtn.innerHTML = '<svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg><span>Pause</span>';
        setStatus(stages[currentStage]?.querySelector('.stage-title')?.textContent || 'Running...', true);
        const remaining = stageDurations[currentStage] - accumulatedTime;
        timerId = setTimeout(nextStage, Math.max(remaining, 50));
        return;
      }
      return;
    }
    isPlaying = true;
    isPaused = false;
    accumulatedTime = 0;
    playBtn.disabled = true;
    pauseBtn.disabled = false;
    resetBtn.disabled = false;
    statusBadge.style.color = '';
    statusBadge.style.borderColor = '';
    hideDetail();
    if (currentStage >= 0) {
      clearActive();
      updateProgress(-1);
    }
    currentStage = -1;
    setStatus('Starting...', true);
    timerId = setTimeout(nextStage, 100);
  }

  function stopBoot() {
    if (timerId) { clearTimeout(timerId); timerId = null; }
    isPlaying = false;
    isPaused = false;
    playBtn.disabled = false;
    pauseBtn.disabled = true;
    pauseBtn.innerHTML = '<svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg><span>Pause</span>';
    setStatus('Stopped', false);
  }

  function pauseBoot() {
    if (!isPlaying) return;
    if (isPaused) {
      isPaused = false;
      pauseBtn.innerHTML = '<svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg><span>Pause</span>';
      setStatus(stages[currentStage]?.querySelector('.stage-title')?.textContent || 'Running...', true);
      const remaining = stageDurations[currentStage] - accumulatedTime;
      timerId = setTimeout(nextStage, Math.max(remaining, 50));
    } else {
      isPaused = true;
      pauseBtn.innerHTML = '<svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg><span>Resume</span>';
      setStatus('Paused', true);
      if (timerId) {
        clearTimeout(timerId);
        timerId = null;
        accumulatedTime = performance.now() - stageStartTime;
      }
    }
  }

  playBtn.addEventListener('click', startBoot);
  pauseBtn.addEventListener('click', pauseBoot);
  resetBtn.addEventListener('click', resetBoot);
  resetBtn.disabled = true;
})();
