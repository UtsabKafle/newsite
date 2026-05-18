window.ConsicaProductPage = {
  render(layout, productId) {
    const product = window.ConsicaProducts.find((p) => p.id === productId);
    if (!product) return '<p>Product not found.</p>';
    const isMobile = layout === 'mobile';
    const pad = isMobile ? 'px-5 pt-12 pb-6' : 'px-8 pt-24 pb-16 max-w-[1600px] mx-auto';
    return `
    <article class="${pad}">
      <a href="${(window.CONSICA_BASE || '') + 'index.html'}" class="text-sm text-brand-300 hover:text-theme transition-colors inline-flex items-center gap-1 ${isMobile ? 'mb-5' : 'mb-8'}">← Back to ecosystem</a>
      <p class="section-label">${product.category}</p>
      <h1 class="section-title ${isMobile ? 'text-3xl tracking-tight leading-tight mt-2.5' : 'text-4xl md:text-6xl mt-3'}">${product.name}</h1>
      <p class="${isMobile ? 'mt-2.5 text-[15px]' : 'mt-4 text-xl'} text-brand-200">${product.tagline}</p>
      <p class="${isMobile ? 'mt-3.5 text-[14px] leading-relaxed' : 'mt-6 text-lg'} text-theme-muted leading-relaxed">${product.description}</p>
      <div class="${isMobile ? 'mt-6 p-5' : 'mt-10 p-8'} glass-panel reveal">
        <h2 class="font-display font-semibold text-lg">Built for scale</h2>
        <p class="mt-3 text-theme-muted text-sm leading-relaxed">
          ${product.name} integrates seamlessly with the Consica Labs ecosystem — shared identity, unified analytics, and enterprise-grade security from day one.
        </p>
        <div class="${isMobile ? 'mt-6 flex flex-col gap-2.5' : 'mt-8 flex gap-4'}">
          <a href="${(window.CONSICA_BASE || '') + 'index.html#contact'}" class="btn-primary magnetic-btn text-center">${isMobile ? 'Request demo' : 'Request a demo'}</a>
          <a href="${(window.CONSICA_BASE || '') + 'index.html#products'}" class="btn-ghost text-center">View all products</a>
        </div>
      </div>

      ${product.details ? `
        <!-- Academy Specific Details -->
        <section class="${isMobile ? 'mt-12 space-y-12' : 'mt-20 space-y-24'}">
          
          <!-- Philosophy -->
          <div class="text-center max-w-5xl mx-auto reveal">
            <p class="section-label mb-2">${product.details.philosophy.title}</p>
            <h2 class="section-title ${isMobile ? 'text-3xl tracking-tight leading-tight mb-4' : 'text-3xl md:text-4xl mb-6'}">${product.details.philosophy.subtitle}</h2>
            <div class="grid ${isMobile ? 'grid-cols-1 gap-4 mt-6' : 'grid-cols-2 gap-6'} text-left">
              ${product.details.philosophy.points.map(p => `
                <div class="glass-panel ${isMobile ? 'p-4' : 'p-6'} border-l-4 border-brand-400">
                  <h4 class="font-display font-bold text-lg mb-1.5">${p.title}</h4>
                  <p class="text-sm text-theme-muted">${p.desc}</p>
                </div>
              `).join('')}
            </div>
          </div>

          <!-- Student Focus -->
          <div class="text-center max-w-6xl mx-auto reveal">
            <p class="section-label">${product.details.studentFocus.tagline}</p>
            <h2 class="section-title ${isMobile ? 'text-3xl tracking-tight leading-tight mt-3 mb-6' : 'text-3xl md:text-5xl mt-4 mb-12'}">Building confident builders</h2>
            <div class="grid ${isMobile ? 'grid-cols-1 gap-6' : 'grid-cols-3 gap-8'}">
              ${product.details.studentFocus.points.map(p => `
                <div class="space-y-3">
                  <div class="w-12 h-12 rounded-2xl bg-brand-500/10 flex items-center justify-center mx-auto border border-brand-500/20">
                    <svg class="w-6 h-6 text-brand-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>
                  </div>
                  <h3 class="font-display font-semibold text-lg">${p.title}</h3>
                  <p class="text-sm text-theme-faint leading-relaxed">${p.desc}</p>
                </div>
              `).join('')}
            </div>
          </div>

          <!-- Levels -->
          <div class="reveal">
            <h2 class="section-title ${isMobile ? 'text-2xl tracking-tight leading-tight mb-4' : 'text-2xl md:text-3xl mb-8'}">Learning paths for every stage</h2>
            <div class="grid ${isMobile ? 'grid-cols-1 gap-4' : 'sm:grid-cols-2 gap-6'}">
              ${product.details.levels.map(l => `
                <div class="glass-panel ${isMobile ? 'p-4' : 'p-6'} border-t-2 border-brand-500/20">
                  <p class="text-xs font-bold text-brand-300 uppercase tracking-widest mb-1">${l.title}</p>
                  <h3 class="font-display font-semibold text-lg mb-2">${l.subtitle}</h3>
                  <p class="text-sm text-theme-muted leading-relaxed">${l.desc}</p>
                </div>
              `).join('')}
            </div>
          </div>

          <!-- Structured Packs -->
          <div class="reveal">
            <h2 class="section-title ${isMobile ? 'text-2xl tracking-tight leading-tight mb-4' : 'text-2xl md:text-3xl mb-8'}">Structured Tech Packs</h2>
            <div class="grid ${isMobile ? 'grid-cols-1 gap-4' : 'grid-cols-2 gap-8'}">
              ${product.details.packs.map(p => `
                <div class="glass-panel ${isMobile ? 'p-5' : 'p-8'} relative overflow-hidden group">
                  <div class="absolute top-0 right-0 p-4">
                    <span class="text-[10px] font-bold px-2 py-1 rounded bg-brand-500/20 text-brand-200 uppercase">${p.level}</span>
                  </div>
                  <p class="section-label">${p.target}</p>
                  <h3 class="font-display font-bold ${isMobile ? 'text-xl mt-1.5' : 'text-2xl mt-2'} group-hover:text-brand-300 transition-colors">${p.name}</h3>
                  <p class="text-xs text-theme-faint mt-1">${p.modules}</p>
                  <p class="${isMobile ? 'mt-3 text-xs leading-normal' : 'mt-4 text-sm leading-relaxed'} text-theme-muted">${p.desc}</p>
                  <button class="${isMobile ? 'mt-4 text-xs' : 'mt-6 text-sm'} font-semibold text-brand-300 hover:text-white transition-colors">View full pack details →</button>
                </div>
              `).join('')}
            </div>
          </div>

          <!-- Teacher Training -->
          <div class="bg-brand-500/5 rounded-3xl ${isMobile ? 'p-5' : 'p-8 md:p-12'} border border-brand-500/10 reveal">
          <div class="max-w-5xl mx-auto">
              <h2 class="section-title ${isMobile ? 'text-2xl tracking-tight leading-tight mb-2' : 'text-2xl md:text-3xl mb-4'}">Empower the educators</h2>
              <p class="${isMobile ? 'text-sm mb-6' : 'text-theme-muted mb-10'} leading-relaxed">We train instructors in modern pedagogy, integration techniques, and technical toolsets to make digital education come alive.</p>
              <div class="grid ${isMobile ? 'grid-cols-1 gap-4' : 'grid-cols-2 gap-8'}">
                ${product.details.training.map(t => `
                  <div>
                    <h4 class="font-display font-semibold text-brand-200">${t.title}</h4>
                    <p class="text-sm text-theme-faint mt-1">${t.desc}</p>
                  </div>
                `).join('')}
              </div>
            </div>
          </div>

          <!-- Resources -->
          <div class="text-center max-w-6xl mx-auto pb-12 reveal">
            <p class="section-label">${product.details.resources.subtitle}</p>
            <h2 class="section-title ${isMobile ? 'text-3xl tracking-tight leading-tight mt-3 mb-4' : 'text-3xl md:text-4xl mt-4 mb-6'}">${product.details.resources.title}</h2>
            <p class="${isMobile ? 'text-sm mb-6' : 'text-theme-muted mb-12'}">${product.details.resources.description}</p>
            <div class="grid ${isMobile ? 'grid-cols-2 gap-3' : 'grid-cols-4 gap-4'}">
              ${product.details.resources.items.map(item => `
                <div class="glass-panel ${isMobile ? 'p-3.5' : 'p-4'} flex flex-col items-center gap-3">
                  <div class="w-10 h-10 rounded-xl bg-brand-500/10 flex items-center justify-center">
                    <svg class="w-5 h-5 text-brand-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 20V10M18 20V4M6 20v-4"/></svg>
                  </div>
                  <span class="text-xs font-semibold text-theme-soft">${item}</span>
                </div>
              `).join('')}
            </div>
          </div>
        </section>
      ` : ''}
      <section class="mt-16 reveal">
        <h2 class="font-display font-semibold text-lg mb-4">Related products</h2>
        <div class="grid ${isMobile ? 'grid-cols-1' : 'sm:grid-cols-2'} gap-4">
          ${window.ConsicaProducts.filter((p) => p.id !== productId).slice(0, 2).map((p) => `
            <a href="${ConsicaDOM.productHref(p.href)}" class="glass-panel p-4 block hover:border-brand-400/30 transition-colors">
              <p class="font-display font-medium">${p.name}</p>
              <p class="text-xs text-theme-faint mt-1">${p.category}</p>
            </a>
          `).join('')}
        </div>
      </section>
    </article>`;
  },

};
