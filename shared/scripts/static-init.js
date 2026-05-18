(function () {
  // 1. Theme Management
  function getTheme() {
    return localStorage.getItem('consica-theme') || (window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark');
  }

  function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    if (theme === 'light') {
      document.documentElement.classList.add('light');
      document.documentElement.classList.remove('dark');
    } else {
      document.documentElement.classList.add('dark');
      document.documentElement.classList.remove('light');
    }
    localStorage.setItem('consica-theme', theme);
  }

  function initTheme() {
    const current = getTheme();
    applyTheme(current);

    document.querySelectorAll('.theme-toggle-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const next = getTheme() === 'light' ? 'dark' : 'light';
        applyTheme(next);
      });
    });
  }

  // 2. Mobile Menu Drawer
  function initMobileDrawer() {
    const drawer = document.getElementById('mobile-drawer');
    const openBtn = document.getElementById('mobile-menu-btn');
    const closeBtn = document.getElementById('mobile-menu-close');
    const backdrop = document.getElementById('drawer-backdrop');

    if (!drawer || !openBtn) return;

    const openDrawer = () => {
      drawer.classList.remove('translate-x-full');
      drawer.setAttribute('aria-hidden', 'false');
      drawer.removeAttribute('inert');
      openBtn.setAttribute('aria-expanded', 'true');
      document.body.style.overflow = 'hidden';
    };

    const closeDrawer = () => {
      drawer.classList.add('translate-x-full');
      drawer.setAttribute('aria-hidden', 'true');
      drawer.setAttribute('inert', '');
      openBtn.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    };

    openBtn.addEventListener('click', openDrawer);
    closeBtn?.addEventListener('click', closeDrawer);
    backdrop?.addEventListener('click', closeDrawer);
    drawer.querySelectorAll('.mobile-nav-link').forEach(link => {
      link.addEventListener('click', closeDrawer);
    });
  }

  // 3. Branded Logo Hover Interaction
  function initLogoHover() {
    const logoTrigger = document.getElementById('main-logo-trigger');
    const overlay = document.getElementById('logo-branding-overlay');
    if (!logoTrigger || !overlay) return;

    const showOverlay = () => overlay.classList.add('active');
    const hideOverlay = () => overlay.classList.remove('active');

    logoTrigger.addEventListener('mouseenter', showOverlay);
    logoTrigger.addEventListener('mouseleave', hideOverlay);
    logoTrigger.addEventListener('touchstart', showOverlay, { passive: true });
    logoTrigger.addEventListener('touchend', hideOverlay, { passive: true });
  }

  // 4. Contact Form Handling
  function initContactForm() {
    const form = document.getElementById('contact-form');
    if (!form) return;

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const status = document.getElementById('form-status');
      if (status) {
        status.textContent = 'Thank you — we will be in touch shortly.';
        status.classList.remove('hidden');
      }
      form.reset();
    });
  }

  // 5. Smooth Anchor Scrolling
  function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(a => {
      a.addEventListener('click', (e) => {
        const targetId = a.getAttribute('href').slice(1);
        if (!targetId) return;
        const el = document.getElementById(targetId);
        if (el) {
          e.preventDefault();
          el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      });
    });
  }

  // 6. Inject Dashboard & Platform Previews Responsively
  function injectPreviews() {
    const isMobile = window.innerWidth <= 768;
    const layout = isMobile ? 'mobile' : 'desktop';

    // Hero Platform Preview
    const heroPreviewPlaceholder = document.getElementById('hero-preview-placeholder');
    if (heroPreviewPlaceholder && window.ConsicaElements?.platformPreview) {
      heroPreviewPlaceholder.innerHTML = window.ConsicaElements.platformPreview(layout);
    }

    // Ecosystem Previews (Loop elements)
    const placeholders = {
      'academy-preview-placeholder': 'academyPreview',
      'ecommerce-preview-placeholder': 'ecommercePreview',
      'lms-preview-placeholder': 'lmsPreview',
      'ai-preview-placeholder': 'aiPreview',
      'sms-preview-placeholder': 'smsPreview',
      'enterprise-preview-placeholder': 'enterprisePreview',
      'saas-preview-placeholder': 'saasToolsPreview'
    };

    for (const [id, funcName] of Object.entries(placeholders)) {
      const el = document.getElementById(id);
      if (el && window.ConsicaElements?.[funcName]) {
        el.innerHTML = window.ConsicaElements[funcName](layout);
      }
    }
  }

  // 7. Hide Page Loader once static elements are initialized
  function hidePageLoader() {
    const loader = document.getElementById('app-loader');
    if (loader) {
      loader.style.opacity = '0';
      loader.style.transition = 'opacity 0.4s ease';
      setTimeout(() => loader.remove(), 400);
    }
  }

  // Bootstrap Static Shell
  function bootstrap() {
    initTheme();
    initMobileDrawer();
    initLogoHover();
    initContactForm();
    initSmoothScroll();
    injectPreviews();
    
    // Initialize animations
    if (window.ConsicaAnimations?.init) {
      requestAnimationFrame(() => {
        window.ConsicaAnimations.init();
      });
    }

    hidePageLoader();
  }

  // Handle window resizing to adjust dashboards responsively
  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      injectPreviews();
    }, 300);
  });

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', bootstrap);
  } else {
    bootstrap();
  }
})();
