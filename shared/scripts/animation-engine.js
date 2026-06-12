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
      let ticking = false;
      card.addEventListener('mousemove', (e) => {
        if (this.reducedMotion) return;
        if (ticking) return;
        ticking = true;

        const rect = card.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width - 0.5;
        const y = (e.clientY - rect.top) / rect.height - 0.5;

        requestAnimationFrame(() => {
          card.style.transform = `perspective(800px) rotateY(${x * 8}deg) rotateX(${-y * 8}deg) translateZ(0)`;
          ticking = false;
        });
      });
      card.addEventListener('mouseleave', () => {
        requestAnimationFrame(() => {
          card.style.transform = 'perspective(800px) rotateY(0) rotateX(0) translateZ(0)';
        });
      });
    });
  },

  initMagneticButtons() {
    document.querySelectorAll('.magnetic-btn').forEach((btn) => {
      let ticking = false;
      btn.addEventListener('mousemove', (e) => {
        if (this.reducedMotion) return;
        if (ticking) return;
        ticking = true;

        const rect = btn.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;

        requestAnimationFrame(() => {
          btn.style.transform = `translate3d(${x * 0.15}px, ${y * 0.15}px, 0)`;
          ticking = false;
        });
      });
      btn.addEventListener('mouseleave', () => {
        requestAnimationFrame(() => {
          btn.style.transform = 'translate3d(0, 0, 0)';
        });
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
    let active = false;

    document.addEventListener('mousemove', (e) => {
      mx = e.clientX;
      my = e.clientY;
      if (!active) {
        active = true;
        animate();
      }
    });

    const animate = () => {
      const dx = mx - cx;
      const dy = my - cy;
      if (Math.abs(dx) < 0.1 && Math.abs(dy) < 0.1) {
        cx = mx;
        cy = my;
        glow.style.left = `${cx}px`;
        glow.style.top = `${cy}px`;
        active = false;
        return;
      }
      cx += dx * 0.08;
      cy += dy * 0.08;
      glow.style.left = `${cx}px`;
      glow.style.top = `${cy}px`;
      this.rafId = requestAnimationFrame(animate);
    };
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
      
      // Use GPU-accelerated CSS animations with randomized delay/duration for organic float
      p.style.animation = `float-particle ${3 + Math.random() * 3}s ease-in-out ${-Math.random() * 5}s infinite`;
      
      container.appendChild(p);
    }
  },

  startAuroraShift() {
    if (this.reducedMotion) return;
    const layer = document.getElementById('aurora-layer');
    if (!layer) return;
    
    let lastOpacity = null;
    const updateOpacity = () => {
      const opacity = Math.max(0.4, 1 - window.scrollY / 2000);
      if (opacity !== lastOpacity) {
        layer.style.opacity = String(opacity);
        lastOpacity = opacity;
      }
    };
    
    window.addEventListener('scroll', updateOpacity, { passive: true });
    updateOpacity();
  },

  destroy() {
    if (this.rafId) cancelAnimationFrame(this.rafId);
    this.observers.forEach((o) => o.disconnect());
  },
};
