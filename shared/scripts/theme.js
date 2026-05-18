(function () {
  const STORAGE_KEY = 'consica-theme';

  function getTheme() {
    return document.documentElement.getAttribute('data-theme') === 'light' ? 'light' : 'dark';
  }

  function updateMeta(theme) {
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute('content', theme === 'light' ? '#f8fafc' : '#0959C8');
  }

  function updateToggles() {
    const isLight = getTheme() === 'light';
    document.querySelectorAll('.theme-toggle').forEach((btn) => {
      btn.setAttribute('aria-pressed', String(isLight));
      btn.setAttribute('aria-label', isLight ? 'Switch to dark mode' : 'Switch to light mode');
      btn.classList.toggle('is-light', isLight);
    });
  }

  window.ConsicaTheme = {
    get: getTheme,

    set(theme) {
      const next = theme === 'light' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', next);
      if (next === 'dark') {
        document.documentElement.classList.add('dark');
        document.documentElement.classList.remove('light');
      } else {
        document.documentElement.classList.add('light');
        document.documentElement.classList.remove('dark');
      }
      localStorage.setItem(STORAGE_KEY, next);
      updateMeta(next);
      updateToggles();
    },

    toggle() {
      this.set(getTheme() === 'dark' ? 'light' : 'dark');
    },

    buttonMarkup() {
      return `
        <button type="button" class="theme-toggle" aria-pressed="false" aria-label="Switch to light mode">
          <span class="theme-toggle__track" aria-hidden="true">
            <span class="theme-toggle__thumb"></span>
          </span>
          <span class="theme-toggle__icon theme-toggle__icon--sun" aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"/></svg>
          </span>
          <span class="theme-toggle__icon theme-toggle__icon--moon" aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75"><path d="M21 14.5A8.5 8.5 0 1112.5 3a6.5 6.5 0 109.5 11.5z"/></svg>
          </span>
        </button>`;
    },

    bind(root) {
      const scope = root || document;
      scope.querySelectorAll('.theme-toggle').forEach((btn) => {
        if (btn.dataset.bound) return;
        btn.dataset.bound = 'true';
        btn.addEventListener('click', () => this.toggle());
      });
      updateToggles();
    },
  };
})();
