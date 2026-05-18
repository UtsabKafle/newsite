(function () {
  const LAYOUT = 'tablet';

  function nav() {
    const links = ConsicaBrand.nav
      .slice(0, 6)
      .map((n) => `<a href="#${n.id}" class="nav-link text-sm">${n.label}</a>`)
      .join('');
    return `
    <header class="fixed top-0 left-0 right-0 z-40 glass-nav" role="banner">
      <nav class="max-w-[1600px] mx-auto px-6 h-16 flex items-center justify-between" aria-label="Main navigation">
        <a href="${(window.CONSICA_BASE || '') + 'index.html'}" class="flex items-center gap-2.5">
          ${ConsicaDOM.logoHTML('h-7')}
          <span class="font-display font-bold text-lg tracking-tight uppercase">${ConsicaBrand.name}</span>
        </a>
        <div class="hidden md:flex items-center gap-6">${links}</div>
        <div class="nav-actions">
          ${ConsicaTheme.buttonMarkup()}
          <a href="#contact" class="btn-primary magnetic-btn text-sm py-2 px-4">Contact</a>
        </div>
      </nav>
    </header>`;
  }

  function renderProduct(id) {
    const root = document.getElementById('app-root');
    root.innerHTML = `
      ${nav()}
      <main id="main-content" class="tablet-main">
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
      <main id="main-content" class="tablet-main">
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
