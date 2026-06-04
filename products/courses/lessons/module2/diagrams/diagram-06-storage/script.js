(function() {
  'use strict';

  // Canvas setup
  const hddCanvas = document.getElementById('hddCanvas');
  const ssdCanvas = document.getElementById('ssdCanvas');
  const hddCtx = hddCanvas.getContext('2d');
  const ssdCtx = ssdCanvas.getContext('2d');

  const dpr = window.devicePixelRatio || 1;
  const w = 240, h = 240;
  hddCanvas.width = w * dpr; hddCanvas.height = h * dpr;
  hddCanvas.style.width = w + 'px'; hddCanvas.style.height = h + 'px';
  hddCtx.scale(dpr, dpr);
  ssdCanvas.width = w * dpr; ssdCanvas.height = h * dpr;
  ssdCanvas.style.width = w + 'px'; ssdCanvas.style.height = h + 'px';
  ssdCtx.scale(dpr, dpr);

  // State
  let isPlaying = false;
  let animFrame = null;
  let hddAngle = 0;
  let ssdActiveCells = [];
  let dataTransferProgress = 0;

  // HDD drawing
  function drawHDD(angle, isActive) {
    const ctx = hddCtx;
    ctx.clearRect(0, 0, w, h);

    // Background
    ctx.fillStyle = '#0D111F';
    ctx.beginPath();
    ctx.roundRect(0, 0, w, h, 12);
    ctx.fill();

    // Platter
    ctx.save();
    ctx.translate(120, 120);
    ctx.rotate(angle);

    // Platter disc
    const gradient = ctx.createRadialGradient(0, 0, 10, 0, 0, 75);
    gradient.addColorStop(0, '#2a3a6a');
    gradient.addColorStop(0.5, '#1a2a4a');
    gradient.addColorStop(1, '#0f1a30');
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(0, 0, 75, 0, Math.PI * 2);
    ctx.fill();

    // Tracks
    ctx.strokeStyle = 'rgba(255,255,255,0.1)';
    ctx.lineWidth = 0.5;
    for (let r = 20; r <= 70; r += 12) {
      ctx.beginPath();
      ctx.arc(0, 0, r, 0, Math.PI * 2);
      ctx.stroke();
    }

    // Spindle
    ctx.fillStyle = '#4a6a9a';
    ctx.beginPath();
    ctx.arc(0, 0, 8, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#6a8aba';
    ctx.beginPath();
    ctx.arc(0, 0, 3, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();

    // Read/write arm
    ctx.save();
    const armAngle = Math.sin(angle * 2) * 0.4;
    ctx.translate(120, 120);

    // Arm pivot
    ctx.fillStyle = '#8a9aba';
    ctx.beginPath();
    ctx.arc(-65, 75, 6, 0, Math.PI * 2);
    ctx.fill();

    // Arm
    ctx.strokeStyle = isActive ? '#ff8c5a' : '#7a8aaa';
    ctx.lineWidth = 4;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(-65, 75);
    const armTipX = 55 * Math.cos(armAngle);
    const armTipY = 55 * Math.sin(armAngle);
    ctx.lineTo(-65 + armTipX, 75 + armTipY);
    ctx.stroke();

    // Head
    ctx.fillStyle = isActive ? '#ff6b35' : '#5a7a9a';
    ctx.beginPath();
    ctx.arc(-65 + armTipX, 75 + armTipY, 5, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();

    // Activity indicator
    if (isActive) {
      ctx.fillStyle = 'rgba(255,107,53,0.15)';
      ctx.beginPath();
      ctx.arc(120, 120, 85, 0, Math.PI * 2);
      ctx.fill();
    }

    // Label
    ctx.fillStyle = 'rgba(255,255,255,0.3)';
    ctx.font = '9px Inter, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('Spinning Platter', 120, 225);
  }

  // SSD drawing
  function drawSSD(activeCells) {
    const ctx = ssdCtx;
    ctx.clearRect(0, 0, w, h);

    ctx.fillStyle = '#0D111F';
    ctx.beginPath();
    ctx.roundRect(0, 0, w, h, 12);
    ctx.fill();

    // Chip grid
    const cols = 6, rows = 6;
    const cellW = 28, cellH = 28;
    const gap = 6;
    const startX = (w - (cols * cellW + (cols - 1) * gap)) / 2;
    const startY = (h - (rows * cellH + (rows - 1) * gap)) / 2 - 10;

    let idx = 0;
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const x = startX + c * (cellW + gap);
        const y = startY + r * (cellH + gap);
        const isOn = activeCells.includes(idx);

        ctx.fillStyle = isOn
          ? '#0959C8'
          : 'rgba(255,255,255,0.04)';
        ctx.beginPath();
        ctx.roundRect(x, y, cellW, cellH, 4);
        ctx.fill();

        if (isOn) {
          ctx.shadowColor = '#0959C8';
          ctx.shadowBlur = 8;
          ctx.fill();
          ctx.shadowBlur = 0;
        }

        ctx.strokeStyle = isOn ? 'rgba(9,89,200,0.5)' : 'rgba(255,255,255,0.06)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.roundRect(x, y, cellW, cellH, 4);
        ctx.stroke();

        idx++;
      }
    }

    // Controller chip
    ctx.fillStyle = '#1a2a4a';
    ctx.beginPath();
    ctx.roundRect(startX + cellW + gap, startY + rows * (cellH + gap) + 10, cellW * 2 + gap, 20, 4);
    ctx.fill();
    ctx.fillStyle = 'rgba(255,255,255,0.3)';
    ctx.font = '7px Inter, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('Controller', startX + cellW + gap + (cellW * 2 + gap) / 2, startY + rows * (cellH + gap) + 24);

    ctx.fillStyle = 'rgba(255,255,255,0.3)';
    ctx.font = '9px Inter, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('Flash Memory Cells', 120, 225);
  }

  // Data transfer animation
  let animTime = 0;
  function updateAnimation() {
    if (!isPlaying) return;

    animTime += 0.03;
    hddAngle += 0.04 + (isPlaying ? 0.02 : 0);

    // SSD active cells random pattern
    const isActiveHDD = Math.sin(animTime * 2) > 0;
    const isActiveSSD = Math.sin(animTime * 3) > 0;

    if (isActiveSSD) {
      ssdActiveCells = [];
      const count = 2 + Math.floor(Math.random() * 6);
      for (let i = 0; i < count; i++) {
        ssdActiveCells.push(Math.floor(Math.random() * 36));
      }
    } else {
      ssdActiveCells = [];
    }

    // Update speed bars
    const hddSpeed = isActiveHDD ? 160 : 80;
    const ssdSpeed = isActiveSSD ? 3500 : 500;
    const hddPct = Math.min(100, (hddSpeed / 3500) * 100);
    const ssdPct = Math.min(100, (ssdSpeed / 3500) * 100);

    document.getElementById('hddSpeedFill').style.width = hddPct + '%';
    document.getElementById('ssdSpeedFill').style.width = ssdPct + '%';
    document.getElementById('hddSpeedVal').textContent = (isActiveHDD ? '160' : '80') + ' MB/s';
    document.getElementById('ssdSpeedVal').textContent = (isActiveSSD ? '3500' : '500') + ' MB/s';

    drawHDD(hddAngle, isActiveHDD);
    drawSSD(ssdActiveCells);

    animFrame = requestAnimationFrame(updateAnimation);
  }

  // Info panel
  function showInfo(text) {
    document.getElementById('infoText').textContent = text;
  }

  // Drive click handlers
  const hddSection = document.getElementById('hddSection');
  const ssdSection = document.getElementById('ssdSection');
  let selectedDrive = null;

  function selectDrive(drive) {
    if (selectedDrive === drive) {
      selectedDrive = null;
      hddSection.style.borderColor = '';
      ssdSection.style.borderColor = '';
      showInfo('Click on a drive or press Enter to see detailed information.');
      return;
    }
    selectedDrive = drive;
    hddSection.style.borderColor = drive === 'hdd' ? 'var(--brand-blue)' : '';
    ssdSection.style.borderColor = drive === 'ssd' ? 'var(--brand-blue)' : '';

    if (drive === 'hdd') {
      showInfo('HDD (Hard Disk Drive): 2 TB capacity, 160 MB/s read, 150 MB/s write. Uses spinning magnetic platters and a mechanical read/write arm. More fragile due to moving parts. Better cost per GB for large storage.');
    } else {
      showInfo('SSD (Solid State Drive): 1 TB capacity, 3500 MB/s read, 3000 MB/s write. Uses NAND flash memory cells with no moving parts. Much faster, more durable, but higher cost per GB.');
    }
  }

  hddSection.addEventListener('click', function() { selectDrive('hdd'); });
  hddSection.addEventListener('keydown', function(e) { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); selectDrive('hdd'); }});
  ssdSection.addEventListener('click', function() { selectDrive('ssd'); });
  ssdSection.addEventListener('keydown', function(e) { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); selectDrive('ssd'); }});

  // Controls
  document.getElementById('playBtn').addEventListener('click', function() {
    if (isPlaying) return;
    isPlaying = true;
    if (!animFrame) updateAnimation();
  });

  document.getElementById('pauseBtn').addEventListener('click', function() {
    isPlaying = false;
    if (animFrame) {
      cancelAnimationFrame(animFrame);
      animFrame = null;
    }
  });

  document.getElementById('resetBtn').addEventListener('click', function() {
    isPlaying = false;
    if (animFrame) {
      cancelAnimationFrame(animFrame);
      animFrame = null;
    }
    animTime = 0;
    hddAngle = 0;
    ssdActiveCells = [];
    selectedDrive = null;
    hddSection.style.borderColor = '';
    ssdSection.style.borderColor = '';
    document.getElementById('hddSpeedFill').style.width = '16%';
    document.getElementById('ssdSpeedFill').style.width = '100%';
    document.getElementById('hddSpeedVal').textContent = '160 MB/s';
    document.getElementById('ssdSpeedVal').textContent = '3500 MB/s';
    showInfo('Click on a drive or press Enter to see detailed information.');
    drawHDD(0, false);
    drawSSD([]);
  });

  // Keyboard support for controls
  const ctrlBtns = document.querySelectorAll('.ctrl-btn');
  ctrlBtns.forEach(btn => {
    btn.addEventListener('keydown', function(e) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        this.click();
      }
    });
  });

  // roundRect polyfill for older browsers
  if (!CanvasRenderingContext2D.prototype.roundRect) {
    CanvasRenderingContext2D.prototype.roundRect = function(x, y, w, h, r) {
      if (r > w / 2) r = w / 2;
      if (r > h / 2) r = h / 2;
      this.moveTo(x + r, y);
      this.arcTo(x + w, y, x + w, y + h, r);
      this.arcTo(x + w, y + h, x, y + h, r);
      this.arcTo(x, y + h, x, y, r);
      this.arcTo(x, y, x + w, y, r);
      return this;
    };
  }

  // Initial draw
  drawHDD(0, false);
  drawSSD([]);
})();
