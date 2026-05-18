(function () {
  const DEVICE = { MOBILE: 'mobile', TABLET: 'tablet', DESKTOP: 'desktop', ULTRA: 'ultra' };

  function getDeviceType() {
    const w = window.innerWidth;
    if (w <= 768) return DEVICE.MOBILE;
    if (w <= 1024) return DEVICE.TABLET;
    if (w <= 1440) return DEVICE.DESKTOP;
    return DEVICE.ULTRA;
  }

  function mapToLoader(device) {
    if (device === DEVICE.ULTRA) return DEVICE.DESKTOP;
    return device;
  }

  const loaded = { scripts: new Set(), styles: new Set() };

  function asset(path) {
    return (window.CONSICA_BASE || '') + path;
  }

  async function loadDeviceUI(device) {
    const base = mapToLoader(device);
    const stylePath = asset(`${base}/styles/${base}.css`);
    const initPath = asset(`${base}/scripts/init.js`);

    if (!loaded.styles.has(stylePath)) {
      await ConsicaDOM.loadStylesheet(stylePath);
      loaded.styles.add(stylePath);
    }

    document.documentElement.dataset.device = device;
    document.documentElement.dataset.loader = base;

    const themePath = asset('shared/scripts/theme.js');
    if (!loaded.scripts.has(themePath)) {
      await ConsicaDOM.loadScript(themePath);
      loaded.scripts.add(themePath);
    }



    const dataScripts = [
      'shared/data/services.js',
      'shared/data/team.js',
      'shared/data/seo.js'
    ];
    for (const s of dataScripts) {
      const p = asset(s);
      if (!loaded.scripts.has(p)) {
        await ConsicaDOM.loadScript(p);
        loaded.scripts.add(p);
      }
    }

    const elementsPath = asset('shared/elements/platform-preview.js');
    if (!loaded.scripts.has(elementsPath)) {
      await ConsicaDOM.loadScript(elementsPath);
      loaded.scripts.add(elementsPath);
    }

    const academyPath = asset('shared/elements/academy-preview.js');
    if (!loaded.scripts.has(academyPath)) {
      await ConsicaDOM.loadScript(academyPath);
      loaded.scripts.add(academyPath);
    }

    const ecommercePath = asset('shared/elements/ecommerce-preview.js');
    if (!loaded.scripts.has(ecommercePath)) {
      await ConsicaDOM.loadScript(ecommercePath);
      loaded.scripts.add(ecommercePath);
    }

    const lmsPath = asset('shared/elements/lms-preview.js');
    if (!loaded.scripts.has(lmsPath)) {
      await ConsicaDOM.loadScript(lmsPath);
      loaded.scripts.add(lmsPath);
    }

    const aiPath = asset('shared/elements/ai-preview.js');
    if (!loaded.scripts.has(aiPath)) {
      await ConsicaDOM.loadScript(aiPath);
      loaded.scripts.add(aiPath);
    }

    const smsPath = asset('shared/elements/sms-preview.js');
    if (!loaded.scripts.has(smsPath)) {
      await ConsicaDOM.loadScript(smsPath);
      loaded.scripts.add(smsPath);
    }

    const enterprisePath = asset('shared/elements/enterprise-preview.js');
    if (!loaded.scripts.has(enterprisePath)) {
      await ConsicaDOM.loadScript(enterprisePath);
      loaded.scripts.add(enterprisePath);
    }

    const saasToolsPath = asset('shared/elements/saas-tools.js');
    if (!loaded.scripts.has(saasToolsPath)) {
      await ConsicaDOM.loadScript(saasToolsPath);
      loaded.scripts.add(saasToolsPath);
    }

    const sectionsPath = asset('shared/scripts/sections.js');
    if (!loaded.scripts.has(sectionsPath)) {
      await ConsicaDOM.loadScript(sectionsPath);
      loaded.scripts.add(sectionsPath);
    }

    if (window.CONSICA_PRODUCT_ID) {
      const productPath = asset('shared/scripts/product-page.js');
      if (!loaded.scripts.has(productPath)) {
        await ConsicaDOM.loadScript(productPath);
        loaded.scripts.add(productPath);
      }
    }

    if (!loaded.scripts.has(initPath)) {
      await ConsicaDOM.loadScript(initPath);
      loaded.scripts.add(initPath);
    }
    if (window.ConsicaDevice?.render) {
      await window.ConsicaDevice.render();
    }
    if (window.ConsicaTheme) ConsicaTheme.bind();
  }

  function hideLoader() {
    const loader = document.getElementById('app-loader');
    if (loader) {
      loader.style.opacity = '0';
      loader.style.transition = 'opacity 0.4s ease';
      setTimeout(() => loader.remove(), 400);
    }
  }

  let resizeTimer;
  let currentDevice = null;

  async function bootstrap() {
    const device = getDeviceType();
    currentDevice = device;
    const root = document.getElementById('app-root');
    if (!root) return;

    try {
      await loadDeviceUI(device);
      hideLoader();
      requestAnimationFrame(() => {
        if (window.ConsicaAnimations) ConsicaAnimations.init();
      });
    } catch (err) {
      console.error('[Consica] Device load failed:', err);
      root.innerHTML =
        '<div class="flex min-h-screen items-center justify-center p-8 text-center"><p class="text-theme-muted">Unable to load experience. Please refresh.</p></div>';
      hideLoader();
    }
  }

  window.getDeviceType = getDeviceType;
  window.ConsicaDeviceLoader = { bootstrap, loadDeviceUI, getDeviceType };

  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      const next = getDeviceType();
      const mapped = mapToLoader(next);
      const prevMapped = mapToLoader(currentDevice);
      if (mapped !== prevMapped) {
        currentDevice = next;
        window.location.reload();
      }
    }, 300);
  });

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', bootstrap);
  } else {
    bootstrap();
  }
})();
