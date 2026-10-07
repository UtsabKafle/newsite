(() => {
  const root = document.documentElement;
  const menu = document.querySelector('.menu-toggle');
  const nav = document.querySelector('#site-nav');
  const themeToggle = document.querySelector('.theme-toggle');
  const year = document.querySelector('#current-year');

  const applyTheme = (theme) => {
    root.dataset.theme = theme;
    localStorage.setItem('consica-theme', theme);
    if (themeToggle) {
      themeToggle.textContent = theme === 'dark' ? '◐' : '☼';
      themeToggle.setAttribute('aria-label', theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme');
    }
  };

  const savedTheme = localStorage.getItem('consica-theme');
  const preferredTheme = window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
  applyTheme(savedTheme || preferredTheme);

  themeToggle?.addEventListener('click', () => {
    applyTheme(root.dataset.theme === 'dark' ? 'light' : 'dark');
  });

  const closeMenu = () => {
    nav?.classList.remove('is-open');
    menu?.setAttribute('aria-expanded', 'false');
  };

  menu?.addEventListener('click', () => {
    const isOpen = nav.classList.toggle('is-open');
    menu.setAttribute('aria-expanded', String(isOpen));
  });

  nav?.querySelectorAll('a').forEach((link) => link.addEventListener('click', closeMenu));
  window.addEventListener('resize', () => {
    if (window.innerWidth > 700) closeMenu();
  });

  if (year) year.textContent = new Date().getFullYear();
})();
