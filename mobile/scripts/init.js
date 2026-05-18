(function () {
  const LAYOUT = 'mobile';

  function nav() {
    return `
    <header class="fixed top-0 left-0 right-0 z-40 glass-nav safe-top" role="banner">
      <nav class="px-5 h-14 flex items-center justify-between" aria-label="Main navigation">
        <a href="${(window.CONSICA_BASE || '') + 'index.html'}" class="flex items-center gap-2">
          <span id="main-logo-trigger" class="flex items-center">${ConsicaDOM.logoHTML('h-6')}</span>
          <span class="font-display font-bold text-base tracking-tight uppercase">Consica Labs</span>
        </a>
        <div class="nav-actions">
          ${ConsicaTheme.buttonMarkup()}
          <button type="button" id="mobile-menu-btn" class="p-2 rounded-lg glass-panel" aria-expanded="false" aria-controls="mobile-drawer" aria-label="Open menu">
            <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M4 8h16M4 16h16"/></svg>
          </button>
        </div>
      </nav>
    </header>
    <div id="logo-branding-overlay" class="logo-overlay">
      <img src="${(window.CONSICA_BASE || '')}assets/images/consica.png" alt="Consica Labs">
    </div>
    <div id="mobile-drawer" class="fixed inset-0 z-50 translate-x-full transition-transform duration-300" aria-hidden="true">
      <div class="absolute inset-0 bg-black/60" id="drawer-backdrop"></div>
      <aside class="absolute right-0 top-0 bottom-0 w-[min(100%,320px)] glass-panel border-l border-theme p-6 flex flex-col">
        <div class="flex justify-between items-center mb-8">
          <span class="font-display font-semibold">Menu</span>
          <button type="button" id="mobile-menu-close" class="p-2" aria-label="Close menu">✕</button>
        </div>
        <div class="flex flex-col gap-4">
          ${ConsicaBrand.nav.map((n) => `<a href="#${n.id}" class="mobile-nav-link text-lg text-theme-soft py-2">${n.label}</a>`).join('')}
        </div>
        <div class="drawer-contact-row">
          ${ConsicaTheme.buttonMarkup()}
          <a href="#contact" class="btn-primary magnetic-btn text-center">Contact</a>
        </div>
      </aside>
    </div>`;
  }

  function bottomNav() {
    const items = [
      { href: '#hero', label: 'Home', icon: 'M4 10.5L12 4l8 6.5V20H5v-9.5z' },
      { href: '#products', label: 'Products', icon: 'M4 4h7v7H4V4zm9 0h7v7h-7V4zM4 13h7v7H4v-7zm9 0h7v7h-7v-7z' },
      { href: '#services', label: 'Services', icon: 'M12 2L2 7l10 5 10-5-10-5z' },
      { href: '#contact', label: 'Contact', icon: 'M4 6h16v12H4V6l8 7 8-7' },
    ];
    return `
    <nav class="mobile-bottom-nav fixed bottom-0 left-0 right-0 z-40 glass-nav pb-safe" aria-label="Quick navigation">
      <div class="flex justify-around items-center h-16 px-2">
        ${items
          .map(
            (item) => `
          <a href="${item.href}" class="bottom-nav-item flex flex-col items-center gap-0.5 text-theme-faint hover:text-brand-300 transition-colors min-w-[64px] py-1">
            <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><path d="${item.icon}"/></svg>
            <span class="text-[10px] font-medium">${item.label}</span>
          </a>`
          )
          .join('')}
      </div>
    </nav>`;
  }

  function renderProduct(id) {
    const root = document.getElementById('app-root');
    root.innerHTML = `
      ${nav()}
      <main id="main-content" class="mobile-main pb-safe">
        ${ConsicaProductPage.render(LAYOUT, id)}
      </main>
      ${ConsicaSections.footer(LAYOUT)}
      ${bottomNav()}
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
      <main id="main-content" class="mobile-main pb-safe">
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
      ${bottomNav()}
    `;
    bindEvents(root);
  }

  function bindEvents(root) {
    if (window.ConsicaTheme) ConsicaTheme.bind(root);

    // Branded Logo Hover/Touch Interaction (Logo Icon Only)
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
    const drawer = document.getElementById('mobile-drawer');
    const openBtn = document.getElementById('mobile-menu-btn');
    const closeBtn = document.getElementById('mobile-menu-close');
    const backdrop = document.getElementById('drawer-backdrop');

    const openDrawer = () => {
      drawer.classList.remove('translate-x-full');
      drawer.setAttribute('aria-hidden', 'false');
      openBtn.setAttribute('aria-expanded', 'true');
      document.body.style.overflow = 'hidden';
    };
    const closeDrawer = () => {
      drawer.classList.add('translate-x-full');
      drawer.setAttribute('aria-hidden', 'true');
      openBtn.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    };

    openBtn?.addEventListener('click', openDrawer);
    closeBtn?.addEventListener('click', closeDrawer);
    backdrop?.addEventListener('click', closeDrawer);
    drawer?.querySelectorAll('.mobile-nav-link').forEach((l) => l.addEventListener('click', closeDrawer));

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

    let touchStartX = 0;
    document.addEventListener(
      'touchstart',
      (e) => {
        touchStartX = e.touches[0].clientX;
      },
      { passive: true }
    );
    document.addEventListener(
      'touchend',
      (e) => {
        const dx = e.changedTouches[0].clientX - touchStartX;
        if (dx < -60 && window.scrollY < 120) {
          document.getElementById('products')?.scrollIntoView({ behavior: 'smooth' });
        }
      },
      { passive: true }
    );

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
