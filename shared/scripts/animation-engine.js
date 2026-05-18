window.ConsicaAnimations = {
  reducedMotion: false,
  rafId: null,
  observers: [],

  init() {
    this.reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (this.reducedMotion) return;
    this.initReveal();
    this.initParallax();
    this.initCard3D();
    this.initMagneticButtons();
    this.initCursorGlow();
    this.initParticles();
    this.startAuroraShift();
  },

  initReveal() {
    const els = document.querySelectorAll('.reveal');
    if (!els.length) return;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add('is-visible');
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    );
    els.forEach((el) => io.observe(el));
    this.observers.push(io);
  },

  initParallax() {
    const layers = document.querySelectorAll('[data-parallax]');
    if (!layers.length || this.reducedMotion) return;
    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        const y = window.scrollY;
        layers.forEach((el) => {
          const speed = parseFloat(el.dataset.parallax) || 0.3;
          el.style.transform = `translate3d(0, ${y * speed}px, 0)`;
        });
        ticking = false;
      });
    };
    window.addEventListener('scroll', onScroll, { passive: true });
  },

  initCard3D() {
    document.querySelectorAll('.card-3d').forEach((card) => {
      card.addEventListener('mousemove', (e) => {
        if (this.reducedMotion) return;
        const rect = card.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width - 0.5;
        const y = (e.clientY - rect.top) / rect.height - 0.5;
        card.style.transform = `perspective(800px) rotateY(${x * 8}deg) rotateX(${-y * 8}deg) translateZ(0)`;
      });
      card.addEventListener('mouseleave', () => {
        card.style.transform = 'perspective(800px) rotateY(0) rotateX(0) translateZ(0)';
      });
    });
  },

  initMagneticButtons() {
    document.querySelectorAll('.magnetic-btn').forEach((btn) => {
      btn.addEventListener('mousemove', (e) => {
        if (this.reducedMotion) return;
        const rect = btn.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        btn.style.transform = `translate3d(${x * 0.15}px, ${y * 0.15}px, 0)`;
      });
      btn.addEventListener('mouseleave', () => {
        btn.style.transform = 'translate3d(0, 0, 0)';
      });
    });
  },

  initCursorGlow() {
    const glow = document.getElementById('cursor-glow');
    if (!glow || window.innerWidth < 1025) return;
    let mx = 0;
    let my = 0;
    let cx = 0;
    let cy = 0;
    document.addEventListener('mousemove', (e) => {
      mx = e.clientX;
      my = e.clientY;
    });
    const animate = () => {
      cx += (mx - cx) * 0.08;
      cy += (my - cy) * 0.08;
      glow.style.left = `${cx}px`;
      glow.style.top = `${cy}px`;
      this.rafId = requestAnimationFrame(animate);
    };
    animate();
  },

  initParticles() {
    const container = document.getElementById('hero-particles');
    if (!container || this.reducedMotion) return;
    const count = window.innerWidth < 769 ? 12 : 24;
    for (let i = 0; i < count; i++) {
      const p = document.createElement('div');
      p.className = 'particle';
      p.style.left = `${Math.random() * 100}%`;
      p.style.top = `${Math.random() * 100}%`;
      p.style.opacity = `${0.2 + Math.random() * 0.5}`;
      container.appendChild(p);
    }
    let t = 0;
    const particles = container.querySelectorAll('.particle');
    const tick = () => {
      t += 0.01;
      particles.forEach((p, i) => {
        const y = Math.sin(t + i) * 8;
        p.style.transform = `translate3d(0, ${y}px, 0)`;
      });
      requestAnimationFrame(tick);
    };
    tick();
  },

  startAuroraShift() {
    if (this.reducedMotion) return;
    const layer = document.getElementById('aurora-layer');
    if (!layer) return;
    let scrollY = 0;
    window.addEventListener(
      'scroll',
      () => {
        scrollY = window.scrollY;
      },
      { passive: true }
    );
    const shift = () => {
      layer.style.opacity = String(Math.max(0.4, 1 - scrollY / 2000));
      requestAnimationFrame(shift);
    };
    shift();
  },

  destroy() {
    if (this.rafId) cancelAnimationFrame(this.rafId);
    this.observers.forEach((o) => o.disconnect());
  },
};
