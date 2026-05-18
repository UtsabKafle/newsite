window.ConsicaDOM = {
  base() {
    return window.CONSICA_BASE || '';
  },

  path(relative) {
    return `${this.base()}${relative}`;
  },

  productHref(href) {
    const base = this.base();
    if (base === '../') return href.replace('products/', '');
    return `${base}${href}`;
  },
  el(tag, attrs = {}, children = []) {
    const node = document.createElement(tag);
    Object.entries(attrs).forEach(([k, v]) => {
      if (k === 'className') node.className = v;
      else if (k === 'html') node.innerHTML = v;
      else if (k === 'text') node.textContent = v;
      else if (k.startsWith('on') && typeof v === 'function') node.addEventListener(k.slice(2).toLowerCase(), v);
      else if (v != null) node.setAttribute(k, v);
    });
    const list = Array.isArray(children) ? children : [children];
    list.flat().forEach((c) => {
      if (c == null) return;
      if (typeof c === 'string') node.appendChild(document.createTextNode(c));
      else node.appendChild(c);
    });
    return node;
  },

  svgIcon(name, className = 'w-5 h-5') {
    const icons = {
      logo: '<path fill="currentColor" d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>',
      arrow: '<path fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" d="M5 12h14M12 5l7 7-7 7"/>',
      menu: '<path fill="none" stroke="currentColor" stroke-width="2" d="M4 8h16M4 16h16"/>',
      close: '<path fill="none" stroke="currentColor" stroke-width="2" d="M6 6l12 12M18 6L6 18"/>',
      home: '<path fill="none" stroke="currentColor" stroke-width="1.5" d="M4 10.5L12 4l8 6.5V20a1 1 0 01-1 1h-5v-6H10v6H5a1 1 0 01-1-1v-9.5z"/>',
      grid: '<rect x="3" y="3" width="7" height="7" rx="1" stroke="currentColor" fill="none" stroke-width="1.5"/><rect x="14" y="3" width="7" height="7" rx="1" stroke="currentColor" fill="none" stroke-width="1.5"/><rect x="3" y="14" width="7" height="7" rx="1" stroke="currentColor" fill="none" stroke-width="1.5"/><rect x="14" y="14" width="7" height="7" rx="1" stroke="currentColor" fill="none" stroke-width="1.5"/>',
      mail: '<path fill="none" stroke="currentColor" stroke-width="1.5" d="M4 6h16v12H4V6zm0 0l8 7 8-7"/>',
      graduation: '<path fill="none" stroke="currentColor" stroke-width="1.5" d="M22 10v6M2 10l10-5 10 5-10 5-10-5zM6 12v5c0 2 2 3 6 3s6-1 6-3v-5"/>',
      brain: '<path fill="none" stroke="currentColor" stroke-width="1.5" d="M9.5 14.5c-2.5 0-4.5-2-4.5-4.5s2-4.5 4.5-4.5 4.5 2 4.5 4.5M14.5 14.5c2.5 0 4.5-2 4.5-4.5s-2-4.5-4.5-4.5-4.5 2-4.5 4.5M12 8v8"/>',
      layers: '<path fill="none" stroke="currentColor" stroke-width="1.5" d="M2 17l10 5 10-5M2 12l10 5 10-5M12 2L2 7l10 5 10-5-10-5z"/>',
      school: '<path fill="none" stroke="currentColor" stroke-width="1.5" d="M3 21h18M5 21V7l7-3 7 3v14M9 21v-4h6v4M12 9v2M12 13v2"/>',
      cloud: '<path fill="none" stroke="currentColor" stroke-width="1.5" d="M17.5 19c2.5 0 4.5-2 4.5-4.5 0-2.3-1.7-4.2-4-4.5A7 7 0 105 13c0 .3 0 .7.1 1a4.5 4.5 0 004.4 5h8z"/>',
      building: '<path fill="none" stroke="currentColor" stroke-width="1.5" d="M3 21h18M9 21V3h6v18M5 21v-8h4m6 0h4v8M7 17h0M7 13h0M17 17h0M17 13h0"/>',
      ai: '<path fill="none" stroke="currentColor" stroke-width="1.5" d="M12 2v4m0 12v4M2 12h4m12 0h4M4.9 4.9l2.8 2.8m8.6 8.6l2.8 2.8M4.9 19.1l2.8-2.8m8.6-8.6l2.8-2.8M12 8a4 4 0 100 8 4 4 0 000-8z"/>',
      mobile: '<rect x="5" y="2" width="14" height="20" rx="2" stroke="currentColor" fill="none" stroke-width="1.5"/><path stroke="currentColor" d="M12 18h0"/>',
      web: '<circle cx="12" cy="12" r="10" stroke="currentColor" fill="none" stroke-width="1.5"/><path stroke="currentColor" stroke-width="1.5" d="M2 12h20M12 2a15 15 0 000 20M12 2a15 15 0 010 20"/>',
      design: '<path fill="none" stroke="currentColor" stroke-width="1.5" d="M12 19l7-7 3 3-7 7-3-3zM18 13l-1.5-1.5M14 17l-1.5-1.5M5 7L2 10l9 9 3-3L5 7zM2 3l5 5"/>',
      saas: '<path fill="none" stroke="currentColor" stroke-width="1.5" d="M12 15a3 3 0 100-6 3 3 0 000 6z"/><path fill="none" stroke="currentColor" stroke-width="1.5" d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-2 2 2 2 0 01-2-2v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83 0 2 2 0 010-2.83l.06-.06a1.65 1.65 0 00.33-1.82 1.65 1.65 0 00-1.51-1H3a2 2 0 01-2-2 2 2 0 012-2h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 010-2.83 2 2 0 012.83 0l.06.06a1.65 1.65 0 001.82.33H9a1.65 1.65 0 001-1.51V3a2 2 0 012-2 2 2 0 012 2v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 0 2 2 0 010 2.83l-.06.06a1.65 1.65 0 00-.33 1.82V9a1.65 1.65 0 001.51 1H21a2 2 0 012 2 2 2 0 01-2 2h-.09a1.65 1.65 0 00-1.51 1z"/>',
      typescript: '<path fill="currentColor" d="M1.1 1.1h21.8v21.8H1.1zM15.7 18.9c-.8 0-1.5-.2-2.1-.5-.6-.3-1-.8-1.3-1.5l1.6-.9c.4.8.9 1.1 1.7 1.1s1.3-.3 1.3-.9c0-.4-.3-.7-.9-.9l-1.1-.4c-.9-.3-1.6-.7-2-1.2-.4-.5-.6-1.2-.6-1.9 0-.9.3-1.6.9-2.2.6-.6 1.4-.9 2.5-.9 1.1 0 1.9.3 2.5.8.6.5.9 1.1 1.1 1.8l-1.6.7c-.2-.5-.4-.8-.7-1-.3-.2-.7-.4-1.2-.4-.7 0-1.2.3-1.2.8 0 .4.2.6.7.8l1.1.4c1 .3 1.7.7 2.1 1.2.4.5.7 1.2.7 2 0 1-.4 1.8-1 2.3-.8.6-1.7.9-2.6.9zM7.5 7.6h7.5v1.6H11.3v9.7H9.5v-9.7H7.5z"/>',
      python: '<path fill="currentColor" d="M11.9 2c-2.7 0-2.5 1.2-2.5 1.2l.1 1.2h2.5v.4H8.4S6 4.5 6 7.2s2.1 2.6 2.1 2.6l1.2-.1V8.5s-.1-1.3 1.3-1.3h2.5s1.2 0 1.2-1.2V3.4S14.5 2 11.9 2zM9.5 3.1a.4.4 0 110 .9.4.4 0 010-.9zm2.6 18.9c2.7 0 2.5-1.2 2.5-1.2l-.1-1.2h-2.5v-.4h3.6s2.4.4 2.4-2.3-2.1-2.6-2.1-2.6l-1.2.1v1.2s.1 1.3-1.3 1.3h-2.5s-1.2 0-1.2 1.2v2.6s-1.2 1.4 1.4 1.4zM14.5 20a.4.4 0 110-.9.4.4 0 010 .9z"/>',
      nodejs: '<path fill="currentColor" d="M12 2L3.5 7v10l8.5 5 8.5-5V7L12 2zm1 14.5h-2V14h2v2.5zm0-4h-2V7h2v5.5z"/>',
      postgresql: '<path fill="currentColor" d="M12 2c-5.5 0-10 4.5-10 10s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2zm0 18c-4.4 0-8-3.6-8-8s3.6-8 8-8 8 3.6 8 8-3.6 8-8 8zm-1-13h2v7h-2V7zm0 9h2v2h-2v-2z"/>',
      tensorflow: '<path fill="currentColor" d="M12 2L2 7l10 5 10-5-10-5zm0 13L2 10v7l10 5 10-5v-7l-10 5z"/>',
      openai: '<path fill="currentColor" d="M22.3 10.3c-.3-1.7-1.4-3.1-2.9-3.9-1.2-2.3-3.7-3.6-6.3-3.3-2-.9-4.4-.7-6.2.6-2.4-.2-4.8 1-5.9 3.2-1.8.7-3.1 2.2-3.6 4-.9 1.9-.7 4.1.6 5.8-.3 1.7.1 3.4 1.1 4.9 1.2 2.3 3.7 3.6 6.3 3.3 2 .9 4.4.7 6.2-.6 2.4.2 4.8-1 5.9-3.2 1.8-.7 3.1-2.2 3.6-4 .9-1.9.7-4.1-.6-5.8.3-1.7-.1-3.4-1.1-4.9zM12 18a6 6 0 110-12 6 6 0 010 12z"/>',
      aws: '<path fill="currentColor" d="M12 2L2 7l10 5 10-5-10-5zm0 13L2 10v7l10 5 10-5v-7l-10 5zM8 8l4 4 4-4"/>',
      docker: '<path fill="currentColor" d="M3 13.5h3v-3H3v3zm4 0h3v-3H7v3zm4 0h3v-3h-3v3zm4 0h3v-3h-3v3zm-8-4h3v-3H7v3zm4 0h3v-3h-3v3zm4 0h3v-3h-3v3zm-4-4h3v-3h-3v3zM1 15v1h22v-1c0-4-3-7-7-7h-1v1h1c3 0 6 2 6 6H2c0-4 3-6 6-6h1V8H8c-4 0-7 3-7 7z"/>',
      tailwind: '<path fill="currentColor" d="M12 6c-3 0-4.5 1.5-4.5 4.5s1.5 4.5 4.5 4.5 4.5-1.5 4.5-4.5S15 6 12 6zm0 10c-5 0-9 4-9 9h18c0-5-4-9-9-9z"/>',
      flutter: '<path fill="currentColor" d="M14.3 2.3L5 11.6l3.1 3.1 9.3-9.3-3.1-3.1zM8.1 14.7L5 17.8l9.3 9.3 3.1-3.1-9.3-9.3z"/>',
      graphql: '<path fill="currentColor" d="M12 2L3.5 7v10l8.5 5 8.5-5V7L12 2zm0 16a6 6 0 110-12 6 6 0 010 12z"/>',
      kubernetes: '<path fill="currentColor" d="M12 2l8.7 3.1L22 13l-4.4 8.2-11.2 0L2 13l1.3-7.9L12 2zm0 3.5L6.5 7.5l-.8 4.5 3.3 5h6l3.3-5-.8-4.5L12 5.5z"/>',
      education: '<path fill="none" stroke="currentColor" stroke-width="1.5" d="M12 5L2 9l10 4 10-4-10-4zM2 13l10 4 10-4M2 17l10 4 10-4"/>',
      enterprise: '<path fill="none" stroke="currentColor" stroke-width="1.5" d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>',
    };
    const wrap = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    wrap.setAttribute('class', className);
    wrap.setAttribute('viewBox', '0 0 24 24');
    wrap.setAttribute('aria-hidden', 'true');
    wrap.innerHTML = icons[name] || icons.logo;
    return wrap;
  },

  svgIconHTML(name, className = 'w-5 h-5') {
    return this.svgIcon(name, className).outerHTML;
  },

  logoHTML(className = 'h-8 w-auto') {
    const base = this.base();
    return `
      <img src="${base}assets/images/logow.png" alt="Consica Labs" class="theme-show-dark ${className}">
      <img src="${base}assets/images/logob.png" alt="Consica Labs" class="theme-show-light ${className}">
    `;
  },

  loadScript(src) {
    return new Promise((resolve, reject) => {
      const existing = document.querySelector(`script[src="${src}"]`);
      if (existing) {
        if (existing.dataset.loaded === 'true') return resolve();
        existing.addEventListener('load', resolve);
        existing.addEventListener('error', reject);
        return;
      }
      const s = document.createElement('script');
      s.src = src.startsWith('http') ? src : ConsicaDOM.path(src);
      s.defer = true;
      s.onload = () => {
        s.dataset.loaded = 'true';
        resolve();
      };
      s.onerror = reject;
      document.body.appendChild(s);
    });
  },

  loadStylesheet(href) {
    return new Promise((resolve, reject) => {
      if (document.querySelector(`link[href="${href}"]`)) return resolve();
      const l = document.createElement('link');
      l.rel = 'stylesheet';
      l.href = href.startsWith('http') ? href : ConsicaDOM.path(href);
      l.onload = resolve;
      l.onerror = reject;
      document.head.appendChild(l);
    });
  },
};
