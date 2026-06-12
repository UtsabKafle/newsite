window.ConsicaAnimations = {
  reducedMotion: false,
  observers: [],

  init() {
    this.reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (this.reducedMotion) return;
    this.initReveal();
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

  // Stub methods to prevent external script reference errors
  initParallax() {},
  initCard3D() {},
  initMagneticButtons() {},
  initCursorGlow() {},
  initParticles() {},
  startAuroraShift() {},

  destroy() {
    this.observers.forEach((o) => o.disconnect());
  },
};
