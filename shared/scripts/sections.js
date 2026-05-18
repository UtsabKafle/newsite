window.ConsicaSections = (function () {
  const B = window.ConsicaBrand;
  const P = window.ConsicaProducts;
  const S = window.ConsicaServices;
  const T = window.ConsicaTechnologies;
  const Team = window.ConsicaTeam;
  const Testimonials = window.ConsicaTestimonials;

  function href(path) {
    return ConsicaDOM.productHref(path);
  }

  function iconProduct(id) {
    return ConsicaDOM.svgIconHTML(id, 'w-8 h-8 text-brand-300');
  }

  function footer(layout) {
    const compact = layout === 'mobile';
    return `
    <footer class="border-t border-theme ${compact ? 'pb-28' : 'pb-16'} pt-16">
      <div class="${layout === 'desktop' || layout === 'ultra' ? 'max-w-[1600px] mx-auto px-8' : 'px-5'}">
        <div class="grid ${compact ? 'gap-10' : 'md:grid-cols-4 gap-12'}">
          <div class="${compact ? '' : 'md:col-span-2'}">
            <a href="${(window.CONSICA_BASE || '') + 'index.html'}" class="flex items-center gap-2.5">
              ${ConsicaDOM.logoHTML('h-7')}
              <span class="font-display font-bold text-xl tracking-tight uppercase">${B.name}</span>
            </a>
            <p class="mt-3 text-sm text-theme-muted max-w-sm">Software · EdTech · SaaS · Innovation Lab. Building trust through intelligent technology.</p>
          </div>
          <div>
            <h4 class="text-xs font-semibold uppercase tracking-wider text-theme-faint mb-4">Products</h4>
            <ul class="space-y-2 text-sm text-theme-muted">
              ${P.slice(0, 4).map((p) => `<li><a href="${href(p.href)}" class="hover:text-theme transition-colors">${p.name}</a></li>`).join('')}
            </ul>
          </div>
          <div>
            <h4 class="text-xs font-semibold uppercase tracking-wider text-theme-faint mb-4">Company</h4>
            <ul class="space-y-2 text-sm text-theme-muted">
              <li><a href="#vision" class="hover:text-theme transition-colors">Vision</a></li>
              <li><a href="#team" class="hover:text-theme transition-colors">Team</a></li>
              <li><a href="#careers" class="hover:text-theme transition-colors">Careers</a></li>
              <li><a href="#contact" class="hover:text-theme transition-colors">Contact</a></li>
            </ul>
          </div>
        </div>
        <div class="mt-12 pt-8 border-t border-theme flex ${compact ? 'flex-col gap-4' : 'flex-row justify-between items-center'} text-sm text-theme-faint">
          <p>© ${new Date().getFullYear()} ${B.name}. All rights reserved.</p>
          <p>${B.email}</p>
        </div>
      </div>
    </footer>`;
  }

  function hero(layout) {
    const h = B.hero;
    const isMobile = layout === 'mobile';
    const isDesktop = layout === 'desktop' || layout === 'ultra';
    const isTablet = layout === 'tablet';
    return `
    <section id="hero" class="relative ${isMobile ? 'pt-12 pb-6 px-5' : isDesktop ? 'min-h-[750px] flex items-center pt-20 pb-12 px-8' : isTablet ? 'min-h-[600px] flex items-center pt-20 pb-12 px-6' : 'pt-20 pb-12 px-6'}" aria-labelledby="hero-heading">
      <div id="hero-particles" class="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true"></div>
      <div class="${isDesktop || isTablet ? 'max-w-[1600px] mx-auto w-full grid md:grid-cols-2 gap-12 lg:gap-16 items-center' : 'max-w-lg mx-auto'} relative z-10">
        <div class="reveal">
          <p class="section-label ${isMobile ? 'mb-2.5' : 'mb-4'}">${h.eyebrow}</p>
          <h1 id="hero-heading" class="section-title ${isMobile ? 'text-3xl tracking-tight leading-tight' : isDesktop ? 'text-6xl xl:text-7xl' : 'text-5xl'}">
            ${h.headline}<br><span class="gradient-text">${h.headlineAccent}</span>
          </h1>
          <p class="${isMobile ? 'mt-3.5 text-[14px] leading-relaxed' : 'mt-6 text-lg'} text-theme-muted max-w-xl">${h.subheadline}</p>
          <div class="${isMobile ? 'mt-6 flex flex-col gap-2.5' : 'mt-8 flex flex-wrap gap-4'}">
            <a href="${h.ctaPrimary.href}" class="btn-primary magnetic-btn text-center">${h.ctaPrimary.label}</a>
            <a href="${h.ctaSecondary.href}" class="btn-ghost magnetic-btn text-center">${h.ctaSecondary.label}</a>
          </div>
        </div>
        <!-- Platform Preview (Main Visual) -->
        <div class="relative reveal flex items-center justify-center ${isMobile ? 'mt-8' : 'min-h-[500px]'}" style="transition-delay: 0.15s">
          <div class="relative z-0 w-full opacity-0 animate-slide-zoom-in-left" style="animation-delay: 0.1s; animation-fill-mode: forwards;">
            ${ConsicaElements.platformPreview(layout)}
          </div>
        </div>
      </div>
      
      ${!isMobile ? `
      <!-- Scroll Indicator -->
      <div class="absolute -bottom-16 left-[49.5%] -translate-x-1/2 flex flex-col items-center gap-2 opacity-60 hover:opacity-100 transition-opacity cursor-pointer reveal z-20" style="transition-delay: 0.8s" onclick="document.getElementById('products').scrollIntoView({behavior:'smooth'})">
        <div class="w-5 h-8 border-2 border-theme-faint rounded-full relative">
          <div class="absolute top-1.5 left-1/2 -translate-x-1/2 w-1 h-1 bg-brand-500 rounded-full animate-mouse-wheel"></div>
        </div>
        <span class="text-[9px] font-bold tracking-[0.25em] text-theme-muted uppercase mt-1">Scroll</span>
      </div>` : ''}
    </section>`;
  }

  function products(layout) {
    const isMobile = layout === 'mobile';
    const isDesktop = layout === 'desktop' || layout === 'ultra';
    const pad = isMobile ? 'px-5 py-16' : layout === 'tablet' ? 'px-6 py-20' : 'px-8 pt-32 pb-20 max-w-[1600px] mx-auto';

    return `
    <section id="products" class="${pad} relative overflow-hidden" aria-labelledby="products-heading">
      <div class="grid ${isDesktop ? 'lg:grid-cols-[1.3fr,1fr] gap-12 lg:gap-20 items-center' : 'grid-cols-1 gap-12'} relative z-10">
        
        <!-- Left: Mobile UI Visual -->
        <div class="reveal flex justify-center items-center ${!isDesktop ? 'order-2' : 'lg:-ml-16 xl:-ml-24'}">
          <div class="relative w-full flex justify-center opacity-0 animate-slide-zoom-in-left ${isDesktop ? 'scale-[0.85] origin-left xl:scale-100 xl:origin-center' : ''}" style="animation-delay: 0.1s; animation-fill-mode: forwards;">
            
            <!-- Element 1: Academy -->
            <div class="absolute inset-0 flex justify-center items-center animate-product-loop-1">
              ${ConsicaElements.academyPreview ? ConsicaElements.academyPreview(layout) : ''}
            </div>
            
            <!-- Element 2: Ecommerce -->
            <div class="absolute inset-0 flex justify-center items-center animate-product-loop-2">
              ${ConsicaElements.ecommercePreview ? ConsicaElements.ecommercePreview(layout) : ''}
            </div>
            
            <!-- Element 3: LMS -->
            <div class="absolute inset-0 flex justify-center items-center animate-product-loop-3">
              ${ConsicaElements.lmsPreview ? ConsicaElements.lmsPreview(layout) : ''}
            </div>
            
            <!-- Element 4: AI -->
            <div class="absolute inset-0 flex justify-center items-center animate-product-loop-4">
              ${ConsicaElements.aiPreview ? ConsicaElements.aiPreview(layout) : ''}
            </div>

            <!-- Element 5: SMS -->
            <div class="absolute inset-0 flex justify-center items-center animate-product-loop-5">
              ${ConsicaElements.smsPreview ? ConsicaElements.smsPreview(layout) : ''}
            </div>

            <!-- Element 6: Enterprise -->
            <div class="absolute inset-0 flex justify-center items-center animate-product-loop-6">
              ${ConsicaElements.enterprisePreview ? ConsicaElements.enterprisePreview(layout) : ''}
            </div>

            <!-- Element 7: SaaS Tools Console -->
            <div class="absolute inset-0 flex justify-center items-center animate-product-loop-7">
              ${ConsicaElements.saasToolsPreview ? ConsicaElements.saasToolsPreview(layout) : ''}
            </div>

            <!-- Invisible spacer to maintain container dimensions -->
            <div class="invisible pointer-events-none w-[260px] ${isMobile ? 'h-[260px]' : 'h-[520px]'}" aria-hidden="true"></div>
            
          </div>
        </div>

        <!-- Right: Products Content -->
        <div class="${!isDesktop ? 'order-1 text-center' : 'text-left'}">
          <div class="reveal ${isMobile ? 'mb-6' : 'mb-10'}">
            <p class="section-label">Ecosystem</p>
            <h2 id="products-heading" class="section-title ${isMobile ? 'text-3xl tracking-tight leading-tight' : 'text-3xl'} ${isDesktop ? 'md:text-5xl' : 'md:text-4xl'} mt-3">Product universe</h2>
            <p class="${isMobile ? 'mt-3.5 text-[14px] leading-relaxed' : 'mt-4'} text-theme-muted max-w-xl ${!isDesktop ? 'mx-auto' : ''}">Interconnected platforms designed to scale from classroom to enterprise.</p>
          </div>
          
          <div class="grid ${isMobile ? 'grid-cols-1' : 'sm:grid-cols-2'} gap-4 lg:gap-5">
            ${P.map((p, i) => `
              <a href="${href(p.href)}" class="reveal card-3d glass-panel ${layout === 'mobile' ? 'p-3.5' : 'p-5'} block group hover:border-brand-400/25 transition-all text-left" style="transition-delay: ${i * 0.05}s">
                <div class="flex items-start justify-between">
                  <span class="${layout === 'mobile' ? 'scale-75 origin-left' : 'scale-90 origin-left'}">${iconProduct(p.icon)}</span>
                  <span class="${layout === 'mobile' ? 'text-[8px] px-1.5 py-0.5' : 'text-[10px] px-2 py-1'} font-bold tracking-wide text-brand-300 bg-brand-500/10 rounded-full">${p.category}</span>
                </div>
                <h3 class="${layout === 'mobile' ? 'mt-2 text-sm' : 'mt-3 text-base'} font-display font-semibold group-hover:text-brand-200 transition-colors">${p.name}</h3>
                <p class="${layout === 'mobile' ? 'mt-1 text-[11px] leading-normal' : 'mt-1.5 text-[13px] leading-relaxed'} text-theme-muted">${p.description}</p>
                <span class="inline-flex items-center gap-1 ${layout === 'mobile' ? 'mt-2 text-[11px]' : 'mt-3 text-[13px]'} text-brand-300 font-semibold">Explore →</span>
              </a>
            `).join('')}
          </div>
        </div>

      </div>
    </section>`;
  }

  function services(layout) {
    const isMobile = layout === 'mobile';
    const pad = isMobile ? 'px-5 py-12' : 'px-8 py-20 max-w-[1600px] mx-auto';
    const grid = isMobile ? 'grid-cols-2' : 'sm:grid-cols-2 lg:grid-cols-3';
    return `
    <section id="services" class="${pad}" aria-labelledby="services-heading">
      <div class="reveal ${isMobile ? 'mb-6' : 'mb-12'}">
        <p class="section-label">Capabilities</p>
        <h2 id="services-heading" class="section-title ${isMobile ? 'text-3xl tracking-tight leading-tight' : 'text-3xl md:text-4xl'} mt-3">What we build</h2>
      </div>
      <div class="grid ${grid} gap-4">
        ${S.map((s, i) => `
          <div class="reveal glass-panel ${layout === 'mobile' ? 'p-3 aspect-square flex flex-col justify-center items-center text-center gap-1.5' : 'p-5'} card-3d hover:bg-section-tint transition-colors" style="transition-delay: ${i * 0.03}s">
            <span class="block ${layout === 'mobile' ? 'mb-0' : 'mb-3'}">${ConsicaDOM.svgIconHTML(s.icon, layout === 'mobile' ? 'w-5 h-5 text-brand-300' : 'w-6 h-6 text-brand-300')}</span>
            <h3 class="${layout === 'mobile' ? 'text-[12px] font-bold tracking-tight leading-tight' : 'mt-3 font-display font-semibold'}">${s.name}</h3>
            <p class="${layout === 'mobile' ? 'text-[9.5px] leading-normal text-theme-muted line-clamp-3 px-1' : 'mt-1 text-sm text-theme-muted'}">${s.desc}</p>
          </div>
        `).join('')}
      </div>
    </section>`;
  }

  function technologies(layout) {
    const isMobile = layout === 'mobile';
    const pad = isMobile ? 'py-12' : 'py-16';
    const cardPad = isMobile ? 'px-4 py-3' : 'px-6 py-4';
    const cardWidth = isMobile ? 'min-w-[130px]' : 'min-w-[160px]';
    const cardGap = isMobile ? 'gap-2' : 'gap-3';
    const imgSize = isMobile ? 'w-8 h-8' : 'w-10 h-10';
    const titleSize = isMobile ? 'text-[13px]' : 'text-sm';
    const catSize = isMobile ? 'text-[10px]' : 'text-xs';

    return `
    <section id="technologies" class="${pad} overflow-hidden" aria-labelledby="tech-heading">
      <div class="max-w-[1600px] mx-auto px-8 reveal text-center ${isMobile ? 'mb-6' : 'mb-12'}">
        <p class="section-label">Stack</p>
        <h2 id="tech-heading" class="section-title ${isMobile ? 'text-3xl tracking-tight leading-tight' : 'text-3xl md:text-4xl'} mt-3">Technologies we master</h2>
      </div>
      
      <div class="marquee-container relative flex overflow-hidden group">
        <div class="marquee-content flex gap-4 animate-marquee-left">
          ${T.map((t) => `
            <div class="glass-panel !shadow-none ${cardPad} text-center ${cardWidth} flex flex-col items-center ${cardGap} shrink-0">
              <img src="${t.icon}" alt="${t.name}" class="${imgSize} object-contain" loading="lazy">
              <div>
                <p class="font-display font-medium ${titleSize}">${t.name}</p>
                <p class="${catSize} text-theme-faint mt-0.5">${t.category}</p>
              </div>
            </div>
          `).join('')}
          ${T.map((t) => `
            <div class="glass-panel !shadow-none ${cardPad} text-center ${cardWidth} flex flex-col items-center ${cardGap} shrink-0" aria-hidden="true">
              <img src="${t.icon}" alt="${t.name}" class="${imgSize} object-contain" loading="lazy">
              <div>
                <p class="font-display font-medium ${titleSize}">${t.name}</p>
                <p class="${catSize} text-theme-faint mt-0.5">${t.category}</p>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    </section>`;
  }

  function vision(layout) {
    const isMobile = layout === 'mobile';
    const pad = isMobile ? 'px-5 py-12' : 'px-8 py-20 max-w-[1600px] mx-auto';
    const v = B.vision;
    const cardPad = isMobile ? 'p-3.5' : 'p-6';
    const titleStyle = isMobile ? 'font-display font-bold text-[12px] tracking-tight leading-tight flex items-center gap-1.5' : 'font-display font-semibold text-lg flex items-center gap-2';
    const descStyle = isMobile ? 'mt-1.5 text-[9.5px] leading-normal text-theme-muted' : 'mt-2 text-sm text-theme-muted';
    const iconClassLg = isMobile ? 'w-5 h-5' : 'w-6 h-6';
    const iconClassSm = isMobile ? 'w-4 h-4 text-brand-300' : 'w-5 h-5 text-brand-300';

    return `
    <section id="vision" class="${pad}" aria-labelledby="vision-heading">
      <div class="reveal ${layout === 'desktop' ? 'grid lg:grid-cols-2 gap-16 items-center' : ''}">
        <div>
          <p class="section-label">Philosophy</p>
          <h2 id="vision-heading" class="section-title ${isMobile ? 'text-3xl tracking-tight leading-tight' : 'text-3xl md:text-5xl'} mt-3">${v.title}</h2>
          <p class="${isMobile ? 'mt-3.5 text-[14px] leading-relaxed' : 'mt-6 text-lg'} text-theme-muted leading-relaxed">${v.body}</p>
        </div>
        <div class="grid ${layout === 'mobile' ? 'grid-cols-1 mt-10' : 'grid-cols-2'} gap-4 ${layout !== 'mobile' ? '' : ''}">
          ${v.pillars.map((p, i) => `
            <div class="reveal glass-panel ${cardPad}" style="transition-delay: ${i * 0.08}s">
              <h3 class="${titleStyle}">
                ${p.title === 'Trust' ? `<svg class="${iconClassSm}" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg" fill="currentColor"><path d="M8.069 0c.262 0 .52.017.76.057a4.1 4.1 0 0 1 .697.154c.228.069.451.155.674.263.217.103.44.229.663.366.377.24.748.434 1.126.589a7.537 7.537 0 0 0 2.331.525c.406.029.823.046 1.257.046v4c0 .76-.097 1.48-.291 2.166a8.996 8.996 0 0 1-.789 1.943 10.312 10.312 0 0 1-1.188 1.725 15.091 15.091 0 0 1-1.492 1.532 17.57 17.57 0 0 1-1.703 1.325c-.594.412-1.194.795-1.794 1.143l-.24.143-.24-.143a27.093 27.093 0 0 1-1.806-1.143 15.58 15.58 0 0 1-1.703-1.325 15.082 15.082 0 0 1-1.491-1.532 10.947 10.947 0 0 1-1.194-1.725 9.753 9.753 0 0 1-.789-1.943A7.897 7.897 0 0 1 .571 6V2c.435 0 .852-.017 1.258-.046a8.16 8.16 0 0 0 1.188-.171c.383-.086.766-.2 1.143-.354A6.563 6.563 0 0 0 5.28.846C5.72.56 6.166.349 6.606.21A4.79 4.79 0 0 1 8.069 0zm6.502 2.983a9.566 9.566 0 0 1-2.234-.377 7.96 7.96 0 0 1-2.046-.943A4.263 4.263 0 0 0 9.23 1.16 3.885 3.885 0 0 0 8.074.994a3.99 3.99 0 0 0-1.165.166 3.946 3.946 0 0 0-1.058.503A7.926 7.926 0 0 1 3.8 2.61c-.709.206-1.451.332-2.229.378v3.017c0 .663.086 1.297.258 1.908a8.58 8.58 0 0 0 .72 1.743 9.604 9.604 0 0 0 1.08 1.572c.417.491.862.948 1.342 1.382.48.435.983.835 1.509 1.206.531.372 1.063.709 1.594 1.017a22.397 22.397 0 0 0 1.589-1.017 15.389 15.389 0 0 0 1.514-1.206c.48-.434.926-.891 1.343-1.382a9.596 9.596 0 0 0 1.08-1.572 8.258 8.258 0 0 0 .709-1.743 6.814 6.814 0 0 0 .262-1.908V2.983z"/><path fill-rule="evenodd" clip-rule="evenodd" d="M11.797 4.709l-.44-.378-.406.035-4.36 5.148-1.485-2.12-.4-.068-.463.331-.069.4 1.909 2.726.217.12.457.028.234-.102 4.835-5.715-.029-.405z"/></svg>` : ''}
                ${p.title === 'Innovation' ? `<svg class="${iconClassLg}" viewBox="0 0 511.999 511.999" xmlns="http://www.w3.org/2000/svg"><path fill="#B8C9D9" d="M289.2 511.719h-66.738c-8.158 0-15.121-5.904-16.457-13.953l-10.439-62.784c-8.071-2.732-16.001-6.012-23.723-9.825l-51.814 36.964c-6.637 4.72-15.718 3.992-21.485-1.786L51.39 413.177c-5.768-5.763-6.517-14.849-1.782-21.485l36.943-51.787c-3.802-7.702-7.071-15.647-9.776-23.767l-62.818-10.417C5.899 304.384 0 297.421 0 289.258v-66.738c0-8.163 5.899-15.126 13.958-16.462l62.818-10.417c2.705-8.12 5.974-16.065 9.776-23.767l-36.943-51.787c-4.736-6.637-3.987-15.724 1.782-21.485l47.154-47.159c5.768-5.778 14.849-6.507 21.485-1.786l51.814 36.964c7.723-3.813 15.652-7.093 23.723-9.825l10.439-62.784c1.335-8.05 8.298-13.954 16.455-13.954H289.2c8.147 0 15.11 5.887 16.457 13.926l10.537 62.818c8.114 2.749 16.022 6.023 23.659 9.803l51.781-36.949c6.626-4.72 15.707-3.992 21.475 1.771l47.273 47.159c5.778 5.768 6.539 14.876 1.782 21.519l-37.01 51.748c3.758 7.571 7.039 15.522 9.798 23.783l62.763 10.428c8.049 1.336 13.947 8.299 13.947 16.457v66.738c0 8.158-5.899 15.121-13.947 16.457l-62.784 10.433c-2.759 8.201-6.061 16.201-9.863 23.887c-3.563 7.207-11.796 10.841-19.509 8.652c-22.399-6.355-46.936-5.16-60.612-3.693c-1.466 13.719-2.651 38.285 3.693 60.617c2.195 7.739-1.445 15.946-8.657 19.514c-7.658 3.785-15.631 7.082-23.789 9.847l-10.537 62.822c-1.343 8.113-8.306 13.999-16.453 13.999zM255.831 166.904c-49.065 0-88.985 39.92-88.985 88.985s39.92 88.985 88.985 88.985c23.518 0 45.709-9.086 62.492-25.581 12.982-12.982 21.894-29.533 25.111-47.651 0.923-5.197 1.382-10.475 1.382-15.753 0-49.065-39.92-88.985-88.985-88.985z"/><path fill="#9EACBA" d="M497.715 206.063l-62.763-10.428c-2.759-8.261-6.04-16.212-9.798-23.783l37.008-51.748c4.757-6.643 3.998-15.75-1.782-21.519l-47.273-47.159c-5.768-5.763-14.849-6.49-21.475-1.771l-51.779 36.949c-7.636-3.78-15.545-7.055-23.659-9.803l-10.537-62.818c-1.347-8.039-8.31-13.926-16.457-13.926h-33.586v166.857c.073 0 .143-.011.217-.011 49.065 0 88.985 39.92 88.985 88.985 0 18.239-5.631 36.243-16.124 51.169-10.483 14.913-25.56 26.447-42.723 32.604-9.65 3.462-19.888 5.211-30.138 5.211-.073 0-.143-.011-.217-.011v166.857H289.2c8.147 0 15.11-5.887 16.457-13.926l10.537-62.822c8.158-2.764 16.131-6.061 23.789-9.847 7.212-3.568 10.852-11.775 8.657-19.514c-6.344-22.333-5.16-46.898-3.693-60.617 13.676-1.466 38.213-2.662 60.612 3.693 7.713 2.189 15.946-1.445 19.509-8.652 3.802-7.685 7.104-15.686 9.863-23.887l62.784-10.433c8.049-1.336 13.947-8.299 13.947-16.457v-66.739c.001-8.157-5.898-15.121-13.946-16.456z"/><path fill="#5FD382" d="M435.81 491.406c-29.111 0-68.097-5.648-93.906-31.534-11.504-11.378-20.063-26.585-25.364-45.117-11.155-39.327-3.802-81.88-2.922-86.605 1.289-7.032 7.446-13.169 14.469-14.474 4.704-.88 47.23-8.256 86.573 2.911 18.563 5.296 33.771 13.855 45.242 25.451 42.842 42.71 30.012 122.186 28.253 131.87-.934 6.99-6.224 12.741-13.295 14.137-7.237 1.424-23.324 4.487-44.766 4.487z"/><path fill="#36B39A" d="M495.314 511.942c-4.258 0-8.516-1.618-11.775-4.861l-87.551-87.442c-6.528-6.507-6.528-17.076-.022-23.593 6.507-6.528 17.065-6.539 23.593-.022l87.529 87.41c6.528 6.501 6.55 17.065.055 23.593-3.256 3.259-7.548 4.9-11.829 4.9z"/></svg>` : ''}
                ${p.title === 'Intelligence' ? `<svg class="${iconClassLg}" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd"><path d="M11.8971692,16.1935902 C12.7066657,16.1935902 13.3628923,16.8218264 13.3628923,17.5967951 C13.3628923,18.3717638 12.7066657,19 11.8971692,19 C11.0876727,19 10.4314462,18.3717638 10.4314462,17.5967951 C10.4314462,16.8218264 11.0876727,16.1935902 11.8971692,16.1935902 Z M13.934,14.374 L14.6550154,15.5766466 L15.4933292,15.5757549 C15.6911289,15.0247857 16.2371735,14.6288441 16.8798154,14.6288441 C17.6893119,14.6288441 18.3455385,15.2570803 18.3455385,16.032049 C18.3455385,16.8070177 17.6893119,17.4352539 16.8798154,17.4352539 C16.247239,17.4352539 15.7082576,17.0516182 15.5028787,16.514117 L14.5544615,16.513668 C14.2610787,16.5094707 13.9922108,16.3560813 13.8487385,16.1110522 L13.049,14.779 L10.744,14.779 L9.94603077,16.1108165 C9.80255106,16.3559556 9.53360917,16.5094369 9.24012308,16.513668 L8.29145971,16.514117 C8.08608083,17.0516182 7.54709949,17.4352539 6.91452308,17.4352539 C6.10502657,17.4352539 5.4488,16.8070177 5.4488,16.032049 C5.4488,15.2570803 6.10502657,14.6288441 6.91452308,14.6288441 C7.55716497,14.6288441 8.10320954,15.0247857 8.30100924,15.5757549 L9.1392,15.576411 L9.885,14.332 L8.732,12.417 L6.84749819,12.4178373 C6.66091037,12.921424 6.18246305,13.2927545 5.60688199,13.3454087 L5.46572308,13.3518322 C4.65622657,13.3518322 4,12.723596 4,11.9486273 C4,11.1736586 4.65622657,10.5454224 5.46572308,10.5454224 C6.10348455,10.5454224 6.64611031,10.935373 6.84764264,11.4798074 L8.66,11.48 L9.845,9.546 L9.13907692,8.36885825 L8.29629819,8.3691746 C8.09465111,8.9134052 7.55213223,9.30316955 6.91452308,9.30316955 C6.10502657,9.30316955 5.4488,8.67493332 5.4488,7.89996465 C5.4488,7.12499598 6.10502657,6.49675975 6.91452308,6.49675975 C7.55213223,6.49675975 8.09465111,6.8865241 8.29629819,7.4307547 L9.24012308,7.43160127 C9.53323556,7.43583333 9.80190777,7.58889536 9.9456,7.83351007 L10.716,9.117 L13.078,9.117 L13.8483077,7.83421704 C13.991944,7.58925611 14.2608161,7.43590443 14.5542154,7.43160127 L15.4980403,7.4307547 C15.6996873,6.8865241 16.2422062,6.49675975 16.8798154,6.49675975 C17.6893119,6.49675975 18.3455385,7.12499598 18.3455385,7.89996465 C18.3455385,8.67493332 17.6893119,9.30316955 16.8798154,9.30316955 C16.2422062,9.30316955 15.6996873,8.9134052 15.4980403,8.3691746 L14.6553846,8.3686226 L13.923,9.588 L15.063,11.48 L17.1523574,11.4798074 C17.3388426,10.9760223 17.8173884,10.6045137 18.393118,10.5518459 L18.5342769,10.5454224 C19.3437734,10.5454224 20,11.1736586 20,11.9486273 C20,12.723596 19.3437734,13.3518322 18.5342769,13.3518322 C17.8966678,13.3518322 17.3541489,12.9620679 17.1525018,12.4178373 L15.134,12.417 L13.934,14.374 Z M11.8971692,5 C12.7066657,5 13.3628923,5.62823623 13.3628923,6.4032049 C13.3628923,7.17817357 12.7066657,7.8064098 11.8971692,7.8064098 C11.0876727,7.8064098 10.4314462,7.17817357 10.4314462,6.4032049 C10.4314462,5.62823623 11.0876727,5 11.8971692,5 Z" fill="#4285F4" fill-rule="nonzero"></path></g></svg>` : ''}
                ${p.title === 'Scale' ? `<svg class="${iconClassSm}" viewBox="0 0 456.467 456.467" xmlns="http://www.w3.org/2000/svg" fill="currentColor"><path d="M312.065 72.775L221.841 163c-2.813 2.813-4.394 6.628-4.394 10.606s1.581 7.794 4.394 10.606l50.416 50.415c2.929 2.929 6.768 4.394 10.606 4.394s7.678-1.465 10.606-4.394l90.224-90.224 27.205 27.205c2.87 2.87 6.706 4.394 10.61 4.394 1.932 0 3.881-.373 5.737-1.142 5.605-2.322 9.26-7.791 9.26-13.858V34.963c0-8.284-6.716-15-15-15H295.467c-6.067 0-11.537 3.654-13.858 9.26-2.321 5.605-1.038 12.057 3.252 16.347l27.204 27.205zM452.432 232.755c-2.835-3.04-6.808-4.78-10.965-4.78h-70.282v.001c-7.689 0-14.102 5.796-14.9 13.443-6.742 64.557-61.482 115.048-127.793 115.048-70.85 0-128.491-57.641-128.491-128.491 0-66.311 50.491-121.051 115.048-127.793 7.632-.797 13.443-7.227 13.443-14.9V15c0-4.16-1.728-8.133-4.77-10.97C208.683 1.193 204.599-.25 200.449.036c-54.991 3.79-106.169 27.021-145.521 66.373C23.768 109.565.001 166.944.001 227.976c0 61.032 23.767 118.411 66.923 161.567 43.156 43.156 100.535 66.924 161.567 66.924s118.412-23.768 161.568-66.924c39.352-39.352 62.583-90.531 66.372-145.521.286-4.15-1.164-8.229-3.999-11.27z"/></svg>` : ''}
                ${p.title}
              </h3>
              <p class="${descStyle}">${p.desc}</p>
            </div>
          `).join('')}
        </div>
      </div>
    </section>`;
  }

  function team(layout) {
    const isMobile = layout === 'mobile';
    const pad = isMobile ? 'px-5 py-12' : 'px-8 py-20 max-w-[1600px] mx-auto';
    const cols = isMobile ? 'grid-cols-1' : 'sm:grid-cols-2 lg:grid-cols-4';
    const cardPad = isMobile ? 'pt-5 pb-4 px-4' : 'p-6';
    const avatarSize = isMobile ? 'w-12 h-12' : 'w-20 h-20';
    const avatarMargin = isMobile ? 'mb-2.5' : 'mb-4';
    const titleStyle = isMobile ? 'mt-2.5 font-display font-semibold text-[15px]' : 'mt-4 font-display font-semibold';
    const roleStyle = isMobile ? 'text-xs text-brand-300' : 'text-sm text-brand-300';
    const bioStyle = isMobile ? 'mt-2 text-[12.5px] leading-relaxed text-theme-muted' : 'mt-3 text-sm text-theme-muted';
    const initialsText = isMobile ? 'text-sm' : 'text-xl';

    return `
    <section id="team" class="${pad}" aria-labelledby="team-heading">
      <div class="reveal text-center ${isMobile ? 'mb-6' : 'mb-12'}">
        <p class="section-label">People</p>
        <h2 id="team-heading" class="section-title ${isMobile ? 'text-3xl tracking-tight leading-tight' : 'text-3xl md:text-4xl'} mt-3">Leadership & culture</h2>
        <p class="${isMobile ? 'mt-3 text-[14px] leading-relaxed' : 'mt-3'} text-theme-muted max-w-lg mx-auto">A team united by craft, curiosity, and the belief that technology should serve humanity.</p>
      </div>
      <div class="grid ${cols} gap-5">
        ${Team.map((m, i) => `
          <article class="reveal glass-panel ${cardPad} text-center" style="transition-delay: ${i * 0.06}s">
            <div class="${avatarMargin}">
              ${m.image ? `
                <div class="${avatarSize} mx-auto rounded-full overflow-hidden border-2 border-brand-500/20">
                  <img src="${(window.CONSICA_BASE || '') + m.image}" alt="${m.name}" class="w-full h-full object-cover">
                </div>
              ` : `
                <div class="${avatarSize} mx-auto rounded-full bg-brand-600 flex items-center justify-center font-display font-bold ${initialsText} text-white">${m.initials}</div>
              `}
            </div>
            <h3 class="${titleStyle}">${m.name}</h3>
            <p class="${roleStyle}">${m.role}</p>
            <p class="${bioStyle}">${m.bio}</p>
          </article>
        `).join('')}
      </div>
    </section>`;
  }

  function lab(layout) {
    const isMobile = layout === 'mobile';
    const pad = isMobile ? 'px-5 py-12' : 'px-8 py-20 max-w-[1600px] mx-auto';
    const l = B.lab;
    const cardPad = isMobile ? 'p-3.5' : 'p-5';
    const titleStyle = isMobile ? 'text-sm font-semibold' : 'text-base font-semibold';
    const badgeStyle = isMobile ? 'text-[8px] px-1.5 py-0.5' : 'text-xs px-2 py-1';
    const descStyle = isMobile ? 'mt-1.5 text-[11px] leading-normal text-theme-muted' : 'mt-2 text-sm text-theme-muted';

    return `
    <section id="lab" class="${pad} relative overflow-hidden" aria-labelledby="lab-heading">
      <div class="relative reveal">
        <p class="section-label">${l.title}</p>
        <h2 id="lab-heading" class="section-title ${isMobile ? 'text-3xl tracking-tight leading-tight' : 'text-3xl md:text-5xl'} mt-3">${l.subtitle}</h2>
        <p class="${isMobile ? 'mt-3.5 text-[14px] leading-relaxed' : 'mt-4'} text-theme-muted max-w-2xl">${l.body}</p>
        <div class="mt-10 grid ${layout === 'mobile' ? 'grid-cols-1' : 'md:grid-cols-2'} gap-4">
          ${l.experiments.map((e, i) => `
            <div class="glass-panel ${cardPad} border-l-2 border-brand-400 reveal" style="transition-delay: ${i * 0.05}s">
              <div class="flex justify-between items-start">
                <h3 class="font-display ${titleStyle}">${e.name}</h3>
                <span class="${badgeStyle} rounded-full bg-brand-500/15 text-brand-200">${e.status}</span>
              </div>
              <p class="${descStyle}">${e.desc}</p>
            </div>
          `).join('')}
        </div>
      </div>
    </section>`;
  }

  function testimonials(layout) {
    const isMobile = layout === 'mobile';
    const pad = isMobile ? 'px-5 py-12' : 'px-8 py-16 max-w-[1600px] mx-auto';
    const cardPad = isMobile ? 'p-3.5' : 'p-6';
    const quoteStyle = isMobile ? 'text-[12.5px] leading-relaxed text-theme-soft' : 'text-theme-soft leading-relaxed';
    const authorStyle = isMobile ? 'not-italic font-display font-semibold text-xs' : 'not-italic font-display font-semibold text-sm';
    const roleStyle = isMobile ? 'text-[10px] text-theme-faint mt-0.5' : 'text-xs text-theme-faint mt-0.5';
    const footerStyle = isMobile ? 'mt-2.5 pt-2.5 border-t border-theme' : 'mt-4 pt-4 border-t border-theme';

    return `
    <section id="testimonials" class="${pad}" aria-labelledby="testimonials-heading">
      <div class="reveal text-center ${isMobile ? 'mb-6' : 'mb-10'}">
        <p class="section-label">Trust</p>
        <h2 id="testimonials-heading" class="section-title ${isMobile ? 'text-3xl tracking-tight leading-tight' : 'text-3xl md:text-4xl'} mt-3">What partners say</h2>
      </div>
      <div class="${layout === 'mobile' ? 'space-y-4' : 'grid md:grid-cols-3 gap-5'}">
        ${Testimonials.map((t, i) => `
          <blockquote class="reveal glass-panel ${cardPad}" style="transition-delay: ${i * 0.08}s">
            <p class="${quoteStyle}">"${t.quote}"</p>
            <footer class="${footerStyle}">
              <cite class="${authorStyle}">${t.author}</cite>
              <p class="${roleStyle}">${t.role}</p>
            </footer>
          </blockquote>
        `).join('')}
      </div>
    </section>`;
  }

  function careers(layout) {
    const isMobile = layout === 'mobile';
    const pad = isMobile ? 'px-5 py-12' : 'px-8 py-20 max-w-[1600px] mx-auto';
    const c = B.careers;
    const cardPad = isMobile ? 'p-3.5' : 'p-5';
    const roleTitleStyle = isMobile ? 'text-sm font-semibold' : 'text-base font-semibold';
    const teamStyle = isMobile ? 'text-[11px] text-theme-muted mt-0.5' : 'text-sm text-theme-muted';
    const typeStyle = isMobile ? 'text-[10px] text-brand-300' : 'text-xs text-brand-300';
    const flexGap = isMobile ? 'gap-1.5' : 'gap-2';

    return `
    <section id="careers" class="${pad}" aria-labelledby="careers-heading">
      <div class="reveal">
        <p class="section-label">Join us</p>
        <h2 id="careers-heading" class="section-title ${isMobile ? 'text-3xl tracking-tight leading-tight' : 'text-3xl md:text-5xl'} mt-3">${c.title}</h2>
        <p class="${isMobile ? 'mt-3 text-[14px] leading-relaxed' : 'mt-3'} text-theme-muted">${c.subtitle}</p>
        <div class="flex flex-wrap gap-2 mt-6">
          ${c.perks.map((p) => `<span class="text-xs px-3 py-1.5 rounded-full glass-panel text-theme-soft">${p}</span>`).join('')}
        </div>
        <div class="mt-10 space-y-3">
          ${c.roles.map((r) => `
            <div class="glass-panel ${cardPad} flex ${layout === 'mobile' ? 'flex-col ' + flexGap : 'flex-row justify-between items-center'}">
              <div>
                <h3 class="font-display ${roleTitleStyle}">${r.title}</h3>
                <p class="${teamStyle}">${r.team}</p>
              </div>
              <span class="${typeStyle}">${r.type}</span>
            </div>
          `).join('')}
        </div>
        <a href="#contact" class="${isMobile ? 'btn-primary !py-2.5 !px-5 !text-xs !mt-6 inline-flex' : 'btn-primary magnetic-btn inline-flex mt-8'}">Apply now</a>
      </div>
    </section>`;
  }

  function contact(layout) {
    const isMobile = layout === 'mobile';
    const pad = isMobile ? 'px-5 py-12' : 'px-8 py-20 max-w-[1600px] mx-auto';
    const isDesktop = layout === 'desktop';
    const detailGap = isMobile ? 'space-y-5' : 'space-y-8';
    const detailLabelStyle = isMobile ? 'text-[10px] text-theme-faint uppercase tracking-widest font-bold' : 'text-xs text-theme-faint uppercase tracking-widest font-bold';
    const detailValueStyle = isMobile ? 'text-sm text-theme-soft mt-0.5 font-medium' : 'text-theme-soft mt-1 font-medium';
    const formHeadStyle = isMobile ? 'text-base font-semibold' : 'text-xl font-semibold';
    const formDescStyle = isMobile ? 'text-[12px] leading-relaxed mt-1.5 text-theme-muted' : 'text-theme-muted mt-2 text-sm';
    const btnStyle = isMobile ? 'btn-primary !py-2.5 !px-5 !text-xs !mt-4 w-full' : 'btn-primary magnetic-btn w-full';
    const formMargin = isMobile ? 'mb-6' : 'mb-8';

    return `
    <section id="contact" class="${pad}" aria-labelledby="contact-heading">
      <div class="reveal glass-panel ${isMobile ? 'p-5' : 'p-8 md:p-12'} ${isDesktop ? 'max-w-5xl' : 'max-w-3xl'} mx-auto relative overflow-hidden">
        <div class="grid ${isDesktop ? 'md:grid-cols-[1.2fr,auto,1.5fr] gap-16 items-center' : 'grid-cols-1 gap-12'}">
          <!-- Contact Details -->
          <div class="${isMobile ? 'space-y-6' : 'space-y-10'}">
            <div>
              <p class="section-label">Contact</p>
              <h2 id="contact-heading" class="section-title ${isMobile ? 'text-3xl tracking-tight leading-tight' : 'text-3xl md:text-4xl'} mt-3">Let's build together</h2>
              <p class="${isMobile ? 'mt-3.5 text-[14px] leading-relaxed' : 'mt-4'} text-theme-muted">Tell us about your project. We respond within one business day.</p>
            </div>
            
            <div class="${detailGap}">
              <div class="flex items-start gap-4">
                <div class="w-10 h-10 rounded-xl bg-brand-500/10 flex items-center justify-center shrink-0 border border-brand-500/20">
                  <svg class="w-5 h-5 text-brand-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 1 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                </div>
                <div>
                  <p class="${detailLabelStyle}">Location</p>
                  <p class="${detailValueStyle}">Shivasatakshi, Nepal</p>
                </div>
              </div>
              
              <div class="flex items-start gap-4">
                <div class="w-10 h-10 rounded-xl bg-brand-500/10 flex items-center justify-center shrink-0 border border-brand-500/20">
                  <svg class="w-5 h-5 text-brand-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.75 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
                </div>
                <div>
                  <p class="${detailLabelStyle}">WhatsApp</p>
                  <a href="https://wa.me/9816087568" class="${detailValueStyle} hover:text-brand-300 transition-colors block">9816087568</a>
                </div>
              </div>
              
              <div class="flex items-start gap-4">
                <div class="w-10 h-10 rounded-xl bg-brand-500/10 flex items-center justify-center shrink-0 border border-brand-500/20">
                  <svg class="w-5 h-5 text-brand-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
                </div>
                <div>
                  <p class="${detailLabelStyle}">Email</p>
                  <a href="mailto:info@consicalabs.com" class="${detailValueStyle} hover:text-brand-300 transition-colors block">info@consicalabs.com</a>
                </div>
              </div>
            </div>
          </div>

          <!-- Vertical Separator -->
          ${isDesktop ? `
          <div class="hidden md:block w-px self-stretch bg-gradient-to-b from-transparent via-brand-500/40 to-transparent"></div>
          ` : '<div class="h-px w-full bg-gradient-to-r from-transparent via-brand-500/20 to-transparent md:hidden"></div>'}

          <!-- Form -->
          <div class="relative">
            <div class="${formMargin}">
              <h3 class="font-display ${formHeadStyle}">Send a message</h3>
              <p class="${formDescStyle}">Fill out the form below and our team will get back to you shortly.</p>
            </div>
            <form class="space-y-4" id="contact-form" novalidate>
              <div class="${layout === 'mobile' ? 'space-y-4' : 'grid sm:grid-cols-2 gap-4'}">
                <div>
                  <label for="name" class="sr-only">Name</label>
                  <input id="name" name="name" type="text" required class="form-input" placeholder="Your name" autocomplete="name">
                </div>
                <div>
                  <label for="email" class="sr-only">Email</label>
                  <input id="email" name="email" type="email" required class="form-input" placeholder="Email address" autocomplete="email">
                </div>
              </div>
              <div>
                <label for="message" class="sr-only">Message</label>
                <textarea id="message" name="message" rows="5" required class="form-input resize-none" placeholder="Tell us about your project..."></textarea>
              </div>
              <button type="submit" class="${btnStyle}">Send message</button>
              <p id="form-status" class="text-sm text-brand-300 hidden mt-4" role="status"></p>
            </form>
          </div>
        </div>
      </div>
    </section>`;
  }

  return { hero, products, services, technologies, vision, team, lab, testimonials, careers, contact, footer, iconProduct };
})();
