(function () {
  const playBtn = document.getElementById('playBtn');
  const pauseBtn = document.getElementById('pauseBtn');
  const resetBtn = document.getElementById('resetBtn');
  const statusBadge = document.getElementById('statusBadge');
  const cards = document.querySelectorAll('.concept-card');
  const timelineFill = document.getElementById('timelineFill');
  const markers = document.querySelectorAll('.timeline-marker');
  const canvas = document.getElementById('particleCanvas');
  const ctx = canvas.getContext('2d');

  let isPlaying = false, isPaused = false;
  let animId = null;
  let particleAnimId = null;
  let particles = [];
  let timelineProgress = 0;
  let cardGlowIdx = -1;
  let animStep = 0;

  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resizeCanvas();
  window.addEventListener('resize', resizeCanvas);

  class Particle {
    constructor() { this.reset(); }
    reset() {
      this.x = Math.random() * canvas.width;
      this.y = Math.random() * canvas.height;
      this.size = Math.random() * 2.5 + 0.5;
      this.speedX = (Math.random() - 0.5) * 0.6;
      this.speedY = (Math.random() - 0.5) * 0.6;
      this.opacity = Math.random() * 0.5 + 0.1;
      this.hue = Math.random() > 0.5 ? 260 : 210;
    }
    update() {
      this.x += this.speedX;
      this.y += this.speedY;
      if (this.x < 0 || this.x > canvas.width) this.speedX *= -1;
      if (this.y < 0 || this.y > canvas.height) this.speedY *= -1;
    }
    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fillStyle = `hsla(${this.hue}, 80%, 70%, ${this.opacity})`;
      ctx.fill();
    }
  }

  const particleCount = 120;
  for (let i = 0; i < particleCount; i++) particles.push(new Particle());

  let mouseX = -1000, mouseY = -1000;
  document.addEventListener('mousemove', function (e) {
    mouseX = e.clientX;
    mouseY = e.clientY;
  });

  function animateParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => {
      p.update();
      p.draw();
    });
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 120) {
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `hsla(260, 70%, 70%, ${0.08 * (1 - dist / 120)})`;
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      }
    }
    particleAnimId = requestAnimationFrame(animateParticles);
  }
  particleAnimId = requestAnimationFrame(animateParticles);

  function setStatus(text, cls) {
    statusBadge.textContent = text;
    statusBadge.className = 'status-badge' + (cls ? ' ' + cls : '');
  }

  cards.forEach((card, idx) => {
    card.addEventListener('click', function () {
      const expanded = this.classList.toggle('expanded');
      const extra = this.querySelector('.card-extra');
      const isExpanded = this.getAttribute('aria-expanded') === 'true' ? false : true;
      this.setAttribute('aria-expanded', isExpanded);
      if (extra) extra.hidden = !isExpanded;
    });
    card.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        this.click();
      }
    });
  });

  function updateTimeline(pct) {
    timelineFill.style.width = Math.min(pct, 100) + '%';
    markers.forEach(m => {
      const year = m.dataset.year || '';
      if (year === '1940s' && pct > 5) m.classList.add('active');
      else if (year === '1970s' && pct > 20) m.classList.add('active');
      else if (year === '1990s' && pct > 38) m.classList.add('active');
      else if (year === '2020s' && pct > 54) m.classList.add('active');
      else if (year === '2030s' && pct > 72) m.classList.add('active');
      else if (year === '2050+' && pct > 90) m.classList.add('active');
    });
  }

  function glowCard(idx) {
    cards.forEach(c => c.classList.remove('glow'));
    if (idx >= 0 && idx < cards.length) {
      cards[idx].classList.add('glow');
      cards[idx].scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  }

  function runAnimation() {
    if (!isPlaying || isPaused) return;
    const duration = 120;
    if (animStep > duration) {
      stopAnimation();
      setStatus('Complete', 'active');
      statusBadge.style.color = '#7c4dff';
      statusBadge.style.borderColor = '#7c4dff';
      updateTimeline(100);
      return;
    }
    const pct = (animStep / duration) * 100;
    updateTimeline(pct);
    timelineProgress = pct;

    const cardCycle = Math.floor(animStep / 10);
    const glowCardIdx = cardCycle % cards.length;
    if (animStep % 10 === 0) glowCard(glowCardIdx);

    setStatus(`Evolving... ${Math.round(pct)}%`, 'active');
    animStep++;
    animId = setTimeout(runAnimation, 80);
  }

  function startPlay() {
    if (isPlaying) {
      if (isPaused) {
        isPaused = false;
        pauseBtn.innerHTML = '<svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg><span>Pause</span>';
        setStatus('Running...', 'active');
        animId = setTimeout(runAnimation, 80);
        return;
      }
      return;
    }
    isPlaying = true;
    isPaused = false;
    playBtn.disabled = true;
    pauseBtn.disabled = false;
    resetBtn.disabled = false;
    statusBadge.style.color = '';
    statusBadge.style.borderColor = '';
    setStatus('Starting...', 'active');
    if (animStep === 0) {
      cards.forEach(c => c.classList.remove('glow'));
      updateTimeline(0);
    }
    animId = setTimeout(runAnimation, 200);
  }

  function pauseAnimation() {
    if (!isPlaying) return;
    if (isPaused) {
      isPaused = false;
      pauseBtn.innerHTML = '<svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg><span>Pause</span>';
      setStatus('Running...', 'active');
      animId = setTimeout(runAnimation, 80);
    } else {
      isPaused = true;
      pauseBtn.innerHTML = '<svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg><span>Resume</span>';
      setStatus('Paused', '');
      if (animId) { clearTimeout(animId); animId = null; }
    }
  }

  function stopAnimation() {
    if (animId) { clearTimeout(animId); animId = null; }
    isPlaying = false;
    isPaused = false;
    playBtn.disabled = false;
    pauseBtn.disabled = true;
    pauseBtn.innerHTML = '<svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg><span>Pause</span>';
  }

  function resetAll() {
    stopAnimation();
    animStep = 0;
    timelineProgress = 0;
    playBtn.disabled = false;
    pauseBtn.disabled = true;
    resetBtn.disabled = true;
    pauseBtn.innerHTML = '<svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg><span>Pause</span>';
    statusBadge.style.color = '';
    statusBadge.style.borderColor = '';
    setStatus('Idle', '');
    updateTimeline(0);
    cards.forEach(c => c.classList.remove('glow', 'expanded'));
    cards.forEach(c => { c.setAttribute('aria-expanded', 'false'); const e = c.querySelector('.card-extra'); if (e) e.hidden = true; });
    markers.forEach(m => m.classList.remove('active'));
  }

  playBtn.addEventListener('click', startPlay);
  pauseBtn.addEventListener('click', pauseAnimation);
  resetBtn.addEventListener('click', resetAll);
  resetBtn.disabled = true;

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') resetAll();
  });

  window.addEventListener('beforeunload', function () {
    if (particleAnimId) cancelAnimationFrame(particleAnimId);
    if (animId) clearTimeout(animId);
  });
})();
