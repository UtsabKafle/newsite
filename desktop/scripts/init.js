(function () {
  const LAYOUT = 'desktop';

  function nav() {
    const links = ConsicaBrand.nav
      .map((n) => `<a href="#${n.id}" class="nav-link text-sm">${n.label}</a>`)
      .join('');
    return `
    <header class="fixed top-0 left-0 right-0 z-40 glass-nav" role="banner">
      <nav class="max-w-[1600px] mx-auto px-8 h-[var(--nav-height)] flex items-center justify-between" aria-label="Main navigation">
        <a href="${(window.CONSICA_BASE || '') + 'index.html'}" class="flex items-center gap-2.5">
          <span id="main-logo-trigger" class="flex items-center">${ConsicaDOM.logoHTML('h-7')}</span>
          <span class="font-display font-bold text-lg tracking-tight uppercase">${ConsicaBrand.name}</span>
        </a>
        <div class="hidden lg:flex items-center gap-8">${links}</div>
        <div class="nav-actions">
          ${ConsicaTheme.buttonMarkup()}
          <a href="#contact" class="btn-primary magnetic-btn text-sm py-2.5 px-5 hidden sm:inline-flex">Contact</a>
        </div>
      </nav>
    </header>
    <div id="logo-branding-overlay" class="logo-overlay">
      <img src="${(window.CONSICA_BASE || '')}assets/images/consica.png" alt="Consica Labs">
    </div>`;
  }

  function renderProduct(id) {
    const root = document.getElementById('app-root');
    root.innerHTML = `
      ${nav()}
      <main id="main-content" class="desktop-main">
        ${ConsicaProductPage.render(LAYOUT, id)}
      </main>
      ${ConsicaSections.footer(LAYOUT)}
    `;
    bindEvents(root);
  }

  function renderPage() {
    if (window.CONSICA_PRODUCT_ID) {
      renderProduct(window.CONSICA_PRODUCT_ID);
      return;
    }
    const S = ConsicaSections;
    const root = document.getElementById('app-root');
    root.innerHTML = `
      ${nav()}
      <main id="main-content" class="desktop-main">
        ${S.hero(LAYOUT)}
        ${S.products(LAYOUT)}
        ${S.services(LAYOUT)}
        ${S.technologies(LAYOUT)}
        ${S.vision(LAYOUT)}
        ${S.team(LAYOUT)}
        ${S.lab(LAYOUT)}
        ${S.testimonials(LAYOUT)}
        ${S.careers(LAYOUT)}
        ${S.contact(LAYOUT)}
      </main>
      ${S.footer(LAYOUT)}
    `;
    bindEvents(root);
  }

  function bindEvents(root) {
    if (window.ConsicaTheme) ConsicaTheme.bind(root);

    // Branded Logo Hover Interaction (Logo Icon Only)
    const logoTrigger = document.getElementById('main-logo-trigger');
    const overlay = document.getElementById('logo-branding-overlay');
    if (logoTrigger && overlay) {
      const showOverlay = () => overlay.classList.add('active');
      const hideOverlay = () => overlay.classList.remove('active');
      
      logoTrigger.addEventListener('mouseenter', showOverlay);
      logoTrigger.addEventListener('mouseleave', hideOverlay);
      logoTrigger.addEventListener('touchstart', showOverlay, { passive: true });
      logoTrigger.addEventListener('touchend', hideOverlay, { passive: true });
    }
    document.querySelectorAll('a[href^="#"]').forEach((a) => {
      a.addEventListener('click', (e) => {
        const id = a.getAttribute('href').slice(1);
        const el = document.getElementById(id);
        if (el) {
          e.preventDefault();
          el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      });
    });
    const form = document.getElementById('contact-form');
    if (form) {
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        const status = document.getElementById('form-status');
        status.textContent = 'Thank you — we will be in touch shortly.';
        status.classList.remove('hidden');
        form.reset();
      });
    }
  }

  window.ConsicaDevice = {
    layout: LAYOUT,
    render: async () => {
      renderPage();
    },
  };

})();
