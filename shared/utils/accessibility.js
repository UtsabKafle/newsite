window.ConsicaA11y = {
  init() {
    document.documentElement.classList.toggle(
      'reduce-motion',
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    );
    window.matchMedia('(prefers-reduced-motion: reduce)').addEventListener('change', (e) => {
      document.documentElement.classList.toggle('reduce-motion', e.matches);
    });
  },

  trapFocus(container) {
    const focusable = container.querySelectorAll(
      'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])'
    );
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    container.addEventListener('keydown', (e) => {
      if (e.key !== 'Tab') return;
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    });
  },
};

document.addEventListener('DOMContentLoaded', () => ConsicaA11y.init());
