const fs = require('fs');
const path = require('path');

const BASE_DIR = path.resolve(__dirname, '..');
const LESSONS_DIR = path.join(BASE_DIR, 'products', 'courses', 'lessons');

// Load custom module contents
const module6 = require('./course-data-m6');
const module7 = require('./course-data-m7');
const module8 = require('./course-data-m8');
const module9 = require('./course-data-m9');
const module10 = require('./course-data-m10');

const MODULES_DATA = [module6, module7, module8, module9, module10];

function getModuleDashboardHTML(m) {
  const nextModuleLink = m.num < 10 ? `../module${m.num + 1}/${MODULES_DATA[m.num - 5].slug}.html` : `../../explorer-pack.html`;
  const backToPackLink = `../../explorer-pack.html`;
  
  return `<!DOCTYPE html>
<html lang="en" class="scroll-smooth">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover">
  <meta name="theme-color" content="#0959C8">
  <title>Module ${m.num}: ${m.title} | Consica Academy</title>
  <meta name="description" content="Module ${m.num}: ${m.title}. ${m.overview}">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Poppins:wght@400;500;600;700;800&display=swap" rel="stylesheet">
  <script src="https://cdn.tailwindcss.com"></script>
  <script>
    tailwind.config = {
      theme: {
        extend: {
          colors: {
            brand: { DEFAULT: '#0959C8', 50: '#E8F1FC', 100: '#C5DBF7', 200: '#8EB8EF', 300: '#5694E4', 400: '#2475D9', 500: '#0959C8', 600: '#0747A3', 700: '#05367A', 800: '#032652', 900: '#021629' },
            surface: { dark: '#0A0E17', darker: '#060910', card: 'rgba(255,255,255,0.04)', glass: 'rgba(255,255,255,0.06)' }
          },
          fontFamily: { display: ['Poppins', 'system-ui', 'sans-serif'], body: ['Inter', 'system-ui', 'sans-serif'] },
          boxShadow: { glow: '0 0 60px rgba(9, 89, 200, 0.25)', 'glow-lg': '0 0 100px rgba(9, 89, 200, 0.35)', glass: '0 8px 32px rgba(0, 0, 0, 0.24)' }
        }
      }
    };
  </script>
  <script>
    (function () {
      var stored = localStorage.getItem('consica-theme');
      var theme = stored || 'dark';
      document.documentElement.setAttribute('data-theme', theme);
      document.documentElement.classList.add(theme);
    })();
  </script>
  <link rel="stylesheet" href="../../../../shared/styles/base.css">
  <link rel="stylesheet" href="../../../../shared/styles/animations.css">
  <link rel="stylesheet" href="../../../../shared/styles/theme-overrides.css">
  <link rel="icon" type="image/png" href="../../../../assets/images/logol.png">
  <style>
    .static-main { padding-top: var(--nav-height); }
    .static-main section { scroll-margin-top: calc(var(--nav-height) + 1rem); }
    @media (max-width: 1024px) {
      .static-main { padding-top: 3.5rem; }
      .static-main section { scroll-margin-top: 4rem; }
      .static-main .glass-panel { border-radius: 1rem; }
    }
    .learn-list li {
      position: relative;
      padding-left: 1.75rem;
    }
    .learn-list li::before {
      content: '';
      position: absolute;
      left: 0;
      top: 0.5rem;
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background: #0959C8;
      opacity: 0.6;
    }
  </style>
</head>
<body class="font-body bg-surface-darker text-theme antialiased overflow-x-hidden scrollbar-none pb-16 lg:pb-0">
  <a href="#main-content" class="skip-link">Skip to main content</a>

  <div id="app-loader" class="fixed inset-0 z-50 flex items-center justify-center bg-surface-darker">
    <div class="flex flex-col items-center gap-4">
      <div class="loader-ring" role="status" aria-label="Loading"></div>
      <p class="text-sm text-theme-muted font-display tracking-wide">Consica Labs</p>
    </div>
  </div>

  <div id="aurora-layer" class="aurora-layer pointer-events-none fixed inset-0 z-0" aria-hidden="true">
    <div class="aurora-blob aurora-blob-1"></div>
    <div class="aurora-blob aurora-blob-2"></div>
    <div class="aurora-blob aurora-blob-3"></div>
    <div class="aurora-mesh"></div>
  </div>

  <div id="app-root" class="relative z-10 min-h-screen">
    <header class="fixed top-0 left-0 right-0 z-40 glass-nav safe-top">
      <nav class="max-w-[1600px] mx-auto px-5 lg:px-8 h-14 lg:h-[var(--nav-height)] flex items-center justify-between" aria-label="Main navigation">
        <a href="../../../../index.html" class="flex items-center gap-2.5">
          <span id="main-logo-trigger" class="flex items-center">
            <img src="../../../../assets/images/logol.png" alt="Consica Labs" class="h-6 lg:h-7 html-logo-light">
            <img src="../../../../assets/images/logob.png" alt="Consica Labs" class="h-6 lg:h-7 html-logo-dark">
          </span>
          <span class="font-display font-bold text-base lg:text-lg tracking-tight uppercase">Consica Labs</span>
        </a>
        <div class="hidden lg:flex items-center gap-8">
          <a href="../../../../index.html#hero" class="nav-link text-sm">Home</a>
          <a href="../../../../index.html#products" class="nav-link text-sm">Products</a>
          <a href="../../../../index.html#roadmap" class="nav-link text-sm">Services</a>
          <a href="../../../../index.html#vision" class="nav-link text-sm">Philosophy</a>
          <a href="../../../../index.html#team" class="nav-link text-sm">Team</a>
          <a href="../../../../index.html#traction" class="nav-link text-sm">Lab</a>
          <a href="../../../../index.html#traction" class="nav-link text-sm">Testimonials</a>
          <a href="../../../../index.html#careers" class="nav-link text-sm">Careers</a>
          <a href="../../../../index.html#contact" class="nav-link text-sm">Contact</a>
        </div>
        <div class="nav-actions flex items-center gap-3">
          <button type="button" class="theme-toggle-btn p-2 rounded-lg glass-panel text-theme-muted hover:text-theme transition-colors" aria-label="Toggle theme">
            <svg class="w-5 h-5 theme-show-dark" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707m0-12.728l.707.707m12.728 12.728l.707-.707M12 8a4 4 0 100 8 4 4 0 000-8z"/>
            </svg>
            <svg class="w-5 h-5 theme-show-light" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"/>
            </svg>
          </button>
          <a href="../../../../index.html#contact" class="btn-primary magnetic-btn text-sm py-2.5 px-5 hidden sm:inline-flex">Contact</a>
          <button type="button" id="mobile-menu-btn" class="p-2 rounded-lg glass-panel lg:hidden" aria-expanded="false" aria-controls="mobile-drawer" aria-label="Open menu">
            <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
              <path d="M4 8h16M4 16h16"/>
            </svg>
          </button>
        </div>
      </nav>
    </header>

    <div id="logo-branding-overlay" class="logo-overlay">
      <img src="../../../../assets/images/consica.png" alt="Consica Labs">
    </div>

    <div id="mobile-drawer" class="fixed inset-0 z-50 translate-x-full transition-transform duration-300" aria-hidden="true" inert>
      <div class="absolute inset-0 bg-black/60" id="drawer-backdrop"></div>
      <aside class="absolute right-0 top-0 bottom-0 w-[min(100%,320px)] glass-panel border-l border-theme p-6 flex flex-col">
        <div class="flex justify-between items-center mb-8">
          <span class="font-display font-semibold">Menu</span>
          <button type="button" id="mobile-menu-close" class="p-2" aria-label="Close menu">&times;</button>
        </div>
        <div class="flex flex-col gap-4">
          <a href="../../../../index.html#hero" class="mobile-nav-link text-lg text-theme-soft py-2">Home</a>
          <a href="../../../../index.html#products" class="mobile-nav-link text-lg text-theme-soft py-2">Products</a>
          <a href="../../../../index.html#roadmap" class="mobile-nav-link text-lg text-theme-soft py-2">Services</a>
          <a href="../../../../index.html#vision" class="mobile-nav-link text-lg text-theme-soft py-2">Philosophy</a>
          <a href="../../../../index.html#team" class="mobile-nav-link text-lg text-theme-soft py-2">Team</a>
          <a href="../../../../index.html#traction" class="mobile-nav-link text-lg text-theme-soft py-2">Lab</a>
          <a href="../../../../index.html#traction" class="mobile-nav-link text-lg text-theme-soft py-2">Testimonials</a>
          <a href="../../../../index.html#careers" class="mobile-nav-link text-lg text-theme-soft py-2">Careers</a>
          <a href="../../../../index.html#contact" class="mobile-nav-link text-lg text-theme-soft py-2">Contact</a>
        </div>
        <div class="drawer-contact-row mt-auto pt-6 flex flex-col gap-3">
          <a href="../../../../index.html#contact" class="btn-primary magnetic-btn text-center w-full">Contact</a>
        </div>
      </aside>
    </div>

    <nav class="mobile-bottom-nav fixed bottom-0 left-0 right-0 z-40 glass-nav pb-safe lg:hidden" aria-label="Quick navigation">
      <div class="flex justify-around items-center h-16 px-2">
        <a href="../../../../index.html#hero" class="bottom-nav-item flex flex-col items-center gap-0.5 text-theme-faint hover:text-brand-300 transition-colors min-w-[64px] py-1">
          <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><path d="M4 10.5L12 4l8 6.5V20H5v-9.5z"/></svg>
          <span class="text-[10px] font-medium">Home</span>
        </a>
        <a href="../../../../index.html#products" class="bottom-nav-item flex flex-col items-center gap-0.5 text-theme-faint hover:text-brand-300 transition-colors min-w-[64px] py-1">
          <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><path d="M4 4h7v7H4V4zm9 0h7v7h-7V4zM4 13h7v7H4v-7zm9 0h7v7h-7v-7z"/></svg>
          <span class="text-[10px] font-medium">Products</span>
        </a>
        <a href="../../../../index.html#roadmap" class="bottom-nav-item flex flex-col items-center gap-0.5 text-theme-faint hover:text-brand-300 transition-colors min-w-[64px] py-1">
          <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><path d="M12 2L2 7l10 5 10-5-10-5z"/></svg>
          <span class="text-[10px] font-medium">Services</span>
        </a>
        <a href="../../../../index.html#contact" class="bottom-nav-item flex flex-col items-center gap-0.5 text-theme-faint hover:text-brand-300 transition-colors min-w-[64px] py-1">
          <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><path d="M4 6h16v12H4V6l8 7 8-7"/></svg>
          <span class="text-[10px] font-medium">Contact</span>
        </a>
      </div>
    </nav>

    <main id="main-content" class="static-main">
      <article class="px-5 pt-12 pb-6 lg:px-8 lg:pt-24 lg:pb-16 max-w-[1600px] mx-auto">
        <a href="${backToPackLink}" class="text-sm text-brand-300 hover:text-theme transition-colors inline-flex items-center gap-1 mb-5 lg:mb-8">&larr; Back to Explorer Pack</a>
        <p class="section-label">Module ${m.num}</p>
        <h1 class="section-title text-3xl tracking-tight leading-tight mt-2.5 lg:text-5xl lg:mt-3">${m.title}</h1>
        <p class="mt-2.5 text-[15px] lg:mt-4 lg:text-xl text-brand-200">${m.overview}</p>

        <!-- Syllabus -->
        <section class="mt-8 lg:mt-12 reveal" id="module-overview">
          <div class="glass-panel p-6 lg:p-10">
            <h2 class="text-2xl font-display font-bold lg:text-3xl lesson-heading">Module Overview</h2>
            <div class="mt-6 p-5 rounded-xl bg-brand-500/5 border border-brand-500/10">
              <p class="text-sm font-semibold text-brand-200 mb-3">Learning Outcomes:</p>
              <ul class="learn-list grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2 text-sm text-theme-muted">
                ${m.outcomes.map(o => `<li>${o}</li>`).join('')}
              </ul>
            </div>
          </div>
        </section>

        <!-- Chapter list -->
        <section class="mt-10 lg:mt-16 reveal" id="chapters">
          <div class="glass-panel p-6 lg:p-10">
            <h2 class="text-2xl font-display font-bold lg:text-3xl lesson-heading">Chapters</h2>
            <p class="mt-3 text-sm text-theme-muted">14 interactive chapters designed for Class 5–7 exploration.</p>
            <div class="mt-6 grid gap-3 sm:grid-cols-2">
              ${m.chapters.map(c => `
              <div class="flex items-center gap-3 p-3 rounded-xl glass-panel hover:bg-brand-500/10 transition-all group">
                <span class="w-8 h-8 rounded-lg bg-brand-500/20 text-brand-300 text-xs font-bold flex items-center justify-center flex-shrink-0">${String(c.num).padStart(2, '0')}</span>
                <a href="chapter-${c.num}-${c.slug}.html" class="flex-1 text-sm font-medium text-theme group-hover:text-brand-200 transition-colors">${c.title}</a>
                <a href="diagrams/diagram-${String(c.num).padStart(2, '0')}-${c.slug.replace(/-to-/g, '-').slice(0, 20)}/index.html" class="text-xs text-theme-faint hover:text-brand-300 transition-colors flex-shrink-0">Diagram</a>
              </div>
              `).join('')}
            </div>
          </div>
        </section>

        <!-- CTA -->
        <section class="mt-10 lg:mt-16 reveal">
          <div class="glass-panel p-6 lg:p-8 text-center">
            <a href="chapter-1-${m.chapters[0].slug}.html" class="btn-primary magnetic-btn inline-flex items-center gap-2 text-sm py-3 px-6">
              Start Chapter 1: ${m.chapters[0].title}
              <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
            </a>
          </div>
          <div class="flex flex-col sm:flex-row justify-between items-center gap-4 pt-8 border-t border-theme mt-8">
            <a href="${backToPackLink}" class="text-sm text-brand-300 hover:text-theme transition-colors inline-flex items-center gap-1">&larr; Back to Explorer Pack</a>
            <p class="text-xs text-theme-faint">Consica Academy &middot; Explorer Pack &middot; Module ${m.num}</p>
          </div>
        </section>
      </article>
    </main>

    <footer class="border-t border-theme pb-28 lg:pb-16 pt-16">
      <div class="px-5 lg:max-w-[1600px] lg:mx-auto lg:px-8">
        <div class="grid gap-10 lg:grid-cols-4 lg:gap-12">
          <div class="lg:col-span-2">
            <a href="../../../../index.html" class="flex items-center gap-2.5">
              <img src="../../../../assets/images/logol.png" alt="Consica Labs" class="h-7 html-logo-light">
              <img src="../../../../assets/images/logob.png" alt="Consica Labs" class="h-7 html-logo-dark">
              <span class="font-display font-bold text-xl tracking-tight uppercase">Consica Labs</span>
            </a>
            <p class="mt-3 text-sm text-theme-muted max-w-sm">Software &middot; EdTech &middot; SaaS &middot; Innovation Lab. Building trust through intelligent technology.</p>
          </div>
          <div>
            <h4 class="text-xs font-semibold uppercase tracking-wider text-theme-faint mb-4">Products</h4>
            <ul class="space-y-2 text-sm text-theme-muted">
              <li><a href="../../../academy.html" class="hover:text-theme transition-colors">Consica Academy</a></li>
              <li><a href="../../../ai-systems.html" class="hover:text-theme transition-colors">AI Systems</a></li>
              <li><a href="../../../lms.html" class="hover:text-theme transition-colors">LMS Platforms</a></li>
              <li><a href="../../../school-systems.html" class="hover:text-theme transition-colors">School Systems</a></li>
              <li><a href="../../../saas-tools.html" class="hover:text-theme transition-colors">SaaS Tools</a></li>
              <li><a href="../../../enterprise.html" class="hover:text-theme transition-colors">Enterprise Software</a></li>
            </ul>
          </div>
          <div>
            <h4 class="text-xs font-semibold uppercase tracking-wider text-theme-faint mb-4">Academy</h4>
            <ul class="space-y-2 text-sm text-theme-muted">
              <li><a href="../../explorer-pack.html" class="hover:text-theme transition-colors">Explorer Pack</a></li>
              <li><a href="../../builder-pack.html" class="hover:text-theme transition-colors">Builder Pack</a></li>
              <li><a href="../../../../index.html#contact" class="hover:text-theme transition-colors">Contact</a></li>
            </ul>
          </div>
        </div>
        <div class="mt-12 pt-8 border-t border-theme flex flex-col gap-4 lg:flex-row lg:justify-between lg:items-center text-sm text-theme-faint">
          <p>&copy; 2026 Consica Labs. All rights reserved.</p>
          <p>info@consicalabs.com</p>
        </div>
      </div>
    </footer>
  </div>

  <script src="../../../../shared/data/brand.js" defer></script>
  <script src="../../../../shared/data/products.js" defer></script>
  <script src="../../../../shared/utils/dom.js" defer></script>
  <script src="../../../../shared/utils/accessibility.js" defer></script>
  <script src="../../../../shared/scripts/animation-engine.js" defer></script>
  <script src="../../../../shared/scripts/static-init.js" defer></script>
</body>
</html>`;
}

function getChapterHTML(m, c) {
  const nextChap = c.num < 14 ? `chapter-${c.num + 1}-${m.chapters[c.num].slug}.html` : `${m.slug}.html`;
  const prevChap = c.num > 1 ? `chapter-${c.num - 1}-${m.chapters[c.num - 2].slug}.html` : `${m.slug}.html`;
  const nextChapTitle = c.num < 14 ? m.chapters[c.num].title : "Overview";
  const diagramFolder = `diagram-${String(c.num).padStart(2, '0')}-${c.slug.replace(/-to-/g, '-').slice(0, 20)}`;

  return `<!DOCTYPE html>
<html lang="en" class="scroll-smooth">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover">
  <meta name="theme-color" content="#0959C8">
  <title>Chapter ${c.num}: ${c.title} | Consica Academy</title>
  <meta name="description" content="Chapter ${c.num}: ${c.title}. ${c.subtitle}">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Poppins:wght@400;500;600;700;800&display=swap" rel="stylesheet">
  <script src="https://cdn.tailwindcss.com"></script>
  <script>
    tailwind.config = {
      theme: {
        extend: {
          colors: {
            brand: { DEFAULT: '#0959C8', 50: '#E8F1FC', 100: '#C5DBF7', 200: '#8EB8EF', 300: '#5694E4', 400: '#2475D9', 500: '#0959C8', 600: '#0747A3', 700: '#05367A', 800: '#032652', 900: '#021629' },
            surface: { dark: '#0A0E17', darker: '#060910', card: 'rgba(255,255,255,0.04)', glass: 'rgba(255,255,255,0.06)' }
          },
          fontFamily: { display: ['Poppins', 'system-ui', 'sans-serif'], body: ['Inter', 'system-ui', 'sans-serif'] },
          boxShadow: { glow: '0 0 60px rgba(9, 89, 200, 0.25)', 'glow-lg': '0 0 100px rgba(9, 89, 200, 0.35)', glass: '0 8px 32px rgba(0, 0, 0, 0.24)' }
        }
      }
    };
  </script>
  <script>
    (function () {
      var stored = localStorage.getItem('consica-theme');
      var theme = stored || 'dark';
      document.documentElement.setAttribute('data-theme', theme);
      document.documentElement.classList.add(theme);
    })();
  </script>
  <link rel="stylesheet" href="../../../../shared/styles/base.css">
  <link rel="stylesheet" href="../../../../shared/styles/animations.css">
  <link rel="stylesheet" href="../../../../shared/styles/theme-overrides.css">
  <link rel="icon" type="image/png" href="../../../../assets/images/logol.png">
  <style>
    .static-main { padding-top: var(--nav-height); }
    .static-main section { scroll-margin-top: calc(var(--nav-height) + 1rem); }
    .vocab-table th { background: rgba(9, 89, 200, 0.12); font-weight: 600; text-align: left; padding: 0.75rem 1rem; }
    .vocab-table td { padding: 0.75rem 1rem; border-top: 1px solid rgba(255, 255, 255, 0.05); }
    .vocab-table tr:hover td { background: rgba(9, 89, 200, 0.04); }
    .kb-check { border-left: 3px solid rgba(9, 89, 200, 0.25); padding-left: 1rem; }
    .kb-answer { display: none; }
    .kb-answer.revealed { display: block; }
    .analogy-card { border-left: 3px solid rgba(9, 89, 200, 0.3); transition: border-color 0.3s ease; }
    .analogy-card:hover { border-left-color: rgba(9, 89, 200, 0.7); }
    .misconception-card { border-left: 3px solid rgba(239, 68, 68, 0.3); }
    .misconception-card.corrected { border-left-color: rgba(34, 197, 94, 0.4); }
  </style>
</head>
<body class="font-body bg-surface-darker text-theme antialiased overflow-x-hidden scrollbar-none pb-16 lg:pb-0">
  <a href="#main-content" class="skip-link">Skip to main content</a>

  <div id="app-loader" class="fixed inset-0 z-50 flex items-center justify-center bg-surface-darker">
    <div class="flex flex-col items-center gap-4">
      <div class="loader-ring" role="status" aria-label="Loading"></div>
      <p class="text-sm text-theme-muted font-display tracking-wide">Consica Labs</p>
    </div>
  </div>

  <div id="aurora-layer" class="aurora-layer pointer-events-none fixed inset-0 z-0" aria-hidden="true">
    <div class="aurora-blob aurora-blob-1"></div>
    <div class="aurora-blob aurora-blob-2"></div>
    <div class="aurora-blob aurora-blob-3"></div>
    <div class="aurora-mesh"></div>
  </div>

  <div id="app-root" class="relative z-10 min-h-screen">
    <header class="fixed top-0 left-0 right-0 z-40 glass-nav safe-top">
      <nav class="max-w-[1600px] mx-auto px-5 lg:px-8 h-14 lg:h-[var(--nav-height)] flex items-center justify-between" aria-label="Main navigation">
        <a href="../../../../index.html" class="flex items-center gap-2.5">
          <span id="main-logo-trigger" class="flex items-center">
            <img src="../../../../assets/images/logol.png" alt="Consica Labs" class="h-6 lg:h-7 html-logo-light">
            <img src="../../../../assets/images/logob.png" alt="Consica Labs" class="h-6 lg:h-7 html-logo-dark">
          </span>
          <span class="font-display font-bold text-base lg:text-lg tracking-tight uppercase">Consica Labs</span>
        </a>
        <div class="hidden lg:flex items-center gap-8">
          <a href="../../../../index.html#hero" class="nav-link text-sm">Home</a>
          <a href="../../../../index.html#products" class="nav-link text-sm">Products</a>
          <a href="../../../../index.html#roadmap" class="nav-link text-sm">Services</a>
          <a href="../../../../index.html#vision" class="nav-link text-sm">Philosophy</a>
          <a href="../../../../index.html#team" class="nav-link text-sm">Team</a>
          <a href="../../../../index.html#traction" class="nav-link text-sm">Lab</a>
          <a href="../../../../index.html#traction" class="nav-link text-sm">Testimonials</a>
          <a href="../../../../index.html#careers" class="nav-link text-sm">Careers</a>
          <a href="../../../../index.html#contact" class="nav-link text-sm">Contact</a>
        </div>
        <div class="nav-actions flex items-center gap-3">
          <button type="button" class="theme-toggle-btn p-2 rounded-lg glass-panel text-theme-muted hover:text-theme transition-colors" aria-label="Toggle theme">
            <svg class="w-5 h-5 theme-show-dark" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707m0-12.728l.707.707m12.728 12.728l.707-.707M12 8a4 4 0 100 8 4 4 0 000-8z"/>
            </svg>
            <svg class="w-5 h-5 theme-show-light" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"/>
            </svg>
          </button>
          <a href="../../../../index.html#contact" class="btn-primary magnetic-btn text-sm py-2.5 px-5 hidden sm:inline-flex">Contact</a>
          <button type="button" id="mobile-menu-btn" class="p-2 rounded-lg glass-panel lg:hidden" aria-expanded="false" aria-controls="mobile-drawer" aria-label="Open menu">
            <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
              <path d="M4 8h16M4 16h16"/>
            </svg>
          </button>
        </div>
      </nav>
    </header>

    <div id="logo-branding-overlay" class="logo-overlay">
      <img src="../../../../assets/images/consica.png" alt="Consica Labs">
    </div>

    <div id="mobile-drawer" class="fixed inset-0 z-50 translate-x-full transition-transform duration-300" aria-hidden="true" inert>
      <div class="absolute inset-0 bg-black/60" id="drawer-backdrop"></div>
      <aside class="absolute right-0 top-0 bottom-0 w-[min(100%,320px)] glass-panel border-l border-theme p-6 flex flex-col">
        <div class="flex justify-between items-center mb-8">
          <span class="font-display font-semibold">Menu</span>
          <button type="button" id="mobile-menu-close" class="p-2" aria-label="Close menu">&times;</button>
        </div>
        <div class="flex flex-col gap-4">
          <a href="../../../../index.html#hero" class="mobile-nav-link text-lg text-theme-soft py-2">Home</a>
          <a href="../../../../index.html#products" class="mobile-nav-link text-lg text-theme-soft py-2">Products</a>
          <a href="../../../../index.html#roadmap" class="mobile-nav-link text-lg text-theme-soft py-2">Services</a>
          <a href="../../../../index.html#vision" class="mobile-nav-link text-lg text-theme-soft py-2">Philosophy</a>
          <a href="../../../../index.html#team" class="mobile-nav-link text-lg text-theme-soft py-2">Team</a>
          <a href="../../../../index.html#traction" class="mobile-nav-link text-lg text-theme-soft py-2">Lab</a>
          <a href="../../../../index.html#traction" class="mobile-nav-link text-lg text-theme-soft py-2">Testimonials</a>
          <a href="../../../../index.html#careers" class="mobile-nav-link text-lg text-theme-soft py-2">Careers</a>
          <a href="../../../../index.html#contact" class="mobile-nav-link text-lg text-theme-soft py-2">Contact</a>
        </div>
        <div class="drawer-contact-row mt-auto pt-6 flex flex-col gap-3">
          <a href="../../../../index.html#contact" class="btn-primary magnetic-btn text-center w-full">Contact</a>
        </div>
      </aside>
    </div>

    <nav class="mobile-bottom-nav fixed bottom-0 left-0 right-0 z-40 glass-nav pb-safe lg:hidden" aria-label="Quick navigation">
      <div class="flex justify-around items-center h-16 px-2">
        <a href="../../../../index.html#hero" class="bottom-nav-item flex flex-col items-center gap-0.5 text-theme-faint hover:text-brand-300 transition-colors min-w-[64px] py-1">
          <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><path d="M4 10.5L12 4l8 6.5V20H5v-9.5z"/></svg>
          <span class="text-[10px] font-medium">Home</span>
        </a>
        <a href="../../../../index.html#products" class="bottom-nav-item flex flex-col items-center gap-0.5 text-theme-faint hover:text-brand-300 transition-colors min-w-[64px] py-1">
          <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><path d="M4 4h7v7H4V4zm9 0h7v7h-7V4zM4 13h7v7H4v-7zm9 0h7v7h-7v-7z"/></svg>
          <span class="text-[10px] font-medium">Products</span>
        </a>
        <a href="../../../../index.html#roadmap" class="bottom-nav-item flex flex-col items-center gap-0.5 text-theme-faint hover:text-brand-300 transition-colors min-w-[64px] py-1">
          <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><path d="M12 2L2 7l10 5 10-5-10-5z"/></svg>
          <span class="text-[10px] font-medium">Services</span>
        </a>
        <a href="../../../../index.html#contact" class="bottom-nav-item flex flex-col items-center gap-0.5 text-theme-faint hover:text-brand-300 transition-colors min-w-[64px] py-1">
          <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><path d="M4 6h16v12H4V6l8 7 8-7"/></svg>
          <span class="text-[10px] font-medium">Contact</span>
        </a>
      </div>
    </nav>

    <main id="main-content" class="static-main">
      <article class="px-5 pt-12 pb-6 lg:px-8 lg:pt-24 lg:pb-16 max-w-[1600px] mx-auto">
        <div class="flex items-center gap-3 mb-4">
          <span class="text-xs font-bold px-3 py-1 rounded-full bg-brand-500/20 text-brand-200 uppercase tracking-wide">Chapter ${c.num}</span>
          <span class="h-px flex-1 bg-gradient-to-r from-brand-500/30 to-transparent"></span>
        </div>

        <h1 class="section-title text-3xl tracking-tight leading-tight lg:text-5xl">${c.title}</h1>
        <p class="mt-2.5 text-[15px] lg:mt-4 lg:text-xl text-brand-200">${c.subtitle}</p>

        <!-- Definition Section -->
        <section class="mt-8 lg:mt-12 reveal" id="definition">
          <div class="glass-panel p-6 lg:p-8">
            <h2 class="text-2xl font-display font-bold lg:text-3xl lesson-heading">Definition</h2>
            <p class="mt-4 text-theme-muted leading-relaxed text-[15px] lg:text-base">${c.definition}</p>
            <div class="mt-6 p-5 rounded-xl bg-brand-500/[0.03] border border-brand-500/10 analogy-card">
              <p class="text-sm font-semibold text-brand-200 mb-3">${c.analogy.title}</p>
              <div class="grid grid-cols-2 sm:grid-cols-4 gap-3">
                ${c.analogy.items.map(item => `
                <div class="glass-panel p-3 text-center">
                  <span class="text-xs text-theme-soft font-semibold block">${item.text}</span>
                </div>
                `).join('')}
              </div>
              <p class="mt-4 text-sm text-theme-muted italic">${c.analogy.text}</p>
            </div>
          </div>
        </section>

        <!-- Real-Life Example Section -->
        <section class="mt-6 lg:mt-10 reveal" id="real-life-example">
          <div class="glass-panel p-6 lg:p-8">
            <h2 class="text-2xl font-display font-bold lg:text-3xl lesson-heading">Real-Life Example</h2>
            <div class="mt-4 flex flex-col lg:flex-row gap-6 items-start">
              <div class="flex-1">
                <p class="text-theme-muted leading-relaxed text-[15px] lg:text-base">${c.example.text}</p>
                <ol class="mt-4 space-y-3 text-sm text-theme-muted">
                  ${c.example.steps.map((s, idx) => `
                  <li class="flex gap-3">
                    <span class="w-6 h-6 rounded-full bg-brand-500/20 text-brand-300 text-xs flex items-center justify-center flex-shrink-0 mt-0.5 font-bold">${idx + 1}</span>
                    <span>${s}</span>
                  </li>
                  `).join('')}
                </ol>
              </div>
              <div class="flex-1 glass-panel p-5 bg-brand-500/[0.03]">
                <p class="text-sm font-semibold text-brand-200 mb-2">Key Highlights:</p>
                <ul class="space-y-2 text-sm text-theme-muted">
                  ${c.example.list.map(l => `
                  <li class="flex items-center gap-2">
                    <svg class="w-4 h-4 text-brand-300 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                    ${l}
                  </li>
                  `).join('')}
                </ul>
              </div>
            </div>
          </div>
        </section>

        <!-- Interactive Diagram Section -->
        <section class="mt-6 lg:mt-10 reveal" id="interactive-diagram">
          <div class="glass-panel p-6 lg:p-8 text-center">
            <h2 class="text-2xl font-display font-bold lg:text-3xl lesson-heading">Interactive Diagram</h2>
            <p class="mt-4 text-theme-muted">Launch the interactive simulation in the Consica Lab Engine.</p>
            <a href="diagrams/${diagramFolder}/index.html" class="btn-primary magnetic-btn inline-flex items-center gap-2 text-sm py-3 px-6 mt-4" aria-label="Open interactive diagram">
              Open Interactive Diagram &rarr;
            </a>
          </div>
        </section>

        <!-- Core Explanation -->
        <section class="mt-6 lg:mt-10 reveal" id="how-it-works">
          <div class="glass-panel p-6 lg:p-8">
            <h2 class="text-2xl font-display font-bold lg:text-3xl lesson-heading">How It Works</h2>
            <p class="mt-4 text-theme-muted leading-relaxed text-[15px] lg:text-base">${c.howItWorks}</p>
            
            <h3 class="mt-8 text-xl font-display font-bold lg:text-2xl">Deeper Dive</h3>
            <p class="mt-3 text-theme-muted leading-relaxed text-[15px] lg:text-base">${c.deeperDive}</p>
            
            <h3 class="mt-8 text-xl font-display font-bold lg:text-2xl">Advanced Concepts</h3>
            <p class="mt-3 text-theme-muted leading-relaxed text-[15px] lg:text-base">${c.advanced}</p>
          </div>
        </section>

        <!-- Vocabulary -->
        <section class="mt-6 lg:mt-10 reveal" id="vocabulary">
          <div class="glass-panel p-6 lg:p-8">
            <h2 class="text-2xl font-display font-bold lg:text-3xl lesson-heading">Vocabulary Table</h2>
            <div class="mt-4 overflow-x-auto">
              <table class="vocab-table w-full text-sm">
                <thead>
                  <tr>
                    <th class="text-theme">Term</th>
                    <th class="text-theme">Definition</th>
                  </tr>
                </thead>
                <tbody class="text-theme-muted">
                  ${c.vocab.map(v => `<tr id="vocab-${v.term.toLowerCase().replace(/[^a-z0-9]+/g, '-')}"><td><span class="vocab">${v.term}</span></td><td>${v.definition}</td></tr>`).join('')}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        <!-- Fun Facts -->
        <section class="mt-6 lg:mt-10 reveal" id="fun-facts">
          <div class="glass-panel p-6 lg:p-8">
            <h2 class="text-2xl font-display font-bold lg:text-3xl lesson-heading">Fun Facts</h2>
            <div class="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-4">
              ${c.funFacts.map(ff => `
              <div class="glass-panel p-5 rounded-xl bg-brand-500/[0.02] border border-brand-500/10">
                <p class="text-sm text-theme-muted">${ff}</p>
              </div>
              `).join('')}
            </div>
          </div>
        </section>

        <!-- Common Misconceptions -->
        <section class="mt-6 lg:mt-10 reveal" id="misconceptions">
          <div class="glass-panel p-6 lg:p-8">
            <h2 class="text-2xl font-display font-bold lg:text-3xl lesson-heading">Common Misconceptions</h2>
            <div class="mt-4 space-y-4">
              ${c.misconceptions.map(msc => `
              <div class="misconception-card corrected p-5 rounded-xl bg-brand-500/[0.02] border border-brand-500/10">
                <p class="text-sm font-semibold text-red-400 mb-2">Misconception: ${msc.misconception}</p>
                <p class="text-sm text-theme-muted"><span class="text-green-400 font-semibold">Truth:</span> ${msc.truth}</p>
              </div>
              `).join('')}
            </div>
          </div>
        </section>

        <!-- Visual Learning Section -->
        <section class="mt-6 lg:mt-10 reveal" id="visual-learning">
          <div class="glass-panel p-6 lg:p-8">
            <h2 class="text-2xl font-display font-bold lg:text-3xl lesson-heading">Visual Learning</h2>
            <p class="mt-4 text-theme-muted leading-relaxed text-[15px] lg:text-base">${c.visualLearning.description}</p>
            <div class="mt-5 p-5 rounded-xl bg-brand-500/[0.03] border border-brand-500/10">
              <p class="text-sm font-semibold text-brand-200 mb-2">What to notice:</p>
              <ul class="space-y-2 text-sm text-theme-muted">
                ${c.visualLearning.notice.map(n => `
                <li class="flex items-start gap-2">
                  <svg class="w-4 h-4 text-brand-300 flex-shrink-0 mt-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                  ${n}
                </li>
                `).join('')}
              </ul>
            </div>
          </div>
        </section>

        <!-- Knowledge Check -->
        <section class="mt-6 lg:mt-10 reveal" id="knowledge-check">
          <div class="glass-panel p-6 lg:p-8">
            <h2 class="text-2xl font-display font-bold lg:text-3xl lesson-heading">Knowledge Check</h2>
            <div class="mt-6 space-y-6">
              ${c.quiz.map((q, idx) => `
              <div class="kb-check">
                <p class="text-sm font-semibold text-theme">${idx + 1}. ${q.q}</p>
                <div class="mt-2 space-y-2 text-sm text-theme-muted">
                  ${q.opts.map(o => `<label class="flex items-center gap-2 cursor-pointer"><input type="radio" name="mcq${idx}" class="accent-brand-500"> ${o}</label>`).join('')}
                </div>
                <p class="mt-2 text-xs text-green-400 kb-answer"><strong>Correct Answer:</strong> ${q.a}</p>
              </div>
              `).join('')}
            </div>
            <div class="mt-6 text-center">
              <button type="button" id="reveal-answers-btn" class="btn-primary magnetic-btn text-sm py-2.5 px-6">Show Answers</button>
            </div>
          </div>
        </section>

        <!-- Critical Thinking -->
        <section class="mt-6 lg:mt-10 reveal" id="critical-thinking">
          <div class="glass-panel p-6 lg:p-8">
            <h2 class="text-2xl font-display font-bold lg:text-3xl lesson-heading">Critical Thinking</h2>
            <div class="mt-4 space-y-4">
              ${c.criticalThinking.map((ct, idx) => `
              <div class="p-5 rounded-xl bg-brand-500/[0.02] border border-brand-500/10">
                <p class="text-sm font-semibold text-brand-200 mb-2">Question ${idx + 1}</p>
                <p class="text-sm text-theme-muted">${ct}</p>
              </div>
              `).join('')}
            </div>
          </div>
        </section>

        <!-- Mini Projects -->
        <section class="mt-6 lg:mt-10 reveal" id="mini-projects">
          <div class="glass-panel p-6 lg:p-8">
            <h2 class="text-2xl font-display font-bold lg:text-3xl lesson-heading">Mini Projects</h2>
            <div class="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
              ${c.miniProjects.map(proj => `
              <div class="p-5 rounded-xl bg-brand-500/[0.02] border border-brand-500/10">
                <p class="text-sm font-semibold text-brand-200 mb-2">${proj.title}</p>
                <p class="text-sm text-theme-muted">${proj.desc}</p>
              </div>
              `).join('')}
            </div>
          </div>
        </section>

        <!-- Teacher Notes -->
        <section class="mt-6 lg:mt-10 reveal" id="teacher-notes">
          <div class="glass-panel p-6 lg:p-8">
            <h2 class="text-2xl font-display font-bold lg:text-3xl lesson-heading">Teacher Notes</h2>
            <div class="mt-4 space-y-5">
              <div class="p-5 rounded-xl bg-brand-500/[0.02] border border-brand-500/10">
                <p class="text-sm font-semibold text-brand-200 mb-2">Learning Objectives</p>
                <ul class="space-y-1 text-sm text-theme-muted list-disc list-inside">
                  ${c.teacherNotes.objectives.map(obj => `<li>${obj}</li>`).join('')}
                </ul>
              </div>
              <div class="p-5 rounded-xl bg-brand-500/[0.02] border border-brand-500/10">
                <p class="text-sm font-semibold text-brand-200 mb-2">Preparation Needed</p>
                <ul class="space-y-1 text-sm text-theme-muted list-disc list-inside">
                  ${c.teacherNotes.prep.map(p => `<li>${p}</li>`).join('')}
                </ul>
              </div>
              <div class="p-5 rounded-xl bg-brand-500/[0.02] border border-brand-500/10">
                <p class="text-sm font-semibold text-brand-200 mb-2">Discussion Prompts</p>
                <ul class="space-y-1 text-sm text-theme-muted list-disc list-inside">
                  ${c.teacherNotes.prompts.map(pr => `<li>${pr}</li>`).join('')}
                </ul>
              </div>
            </div>
          </div>
        </section>

        <!-- Navigation -->
        <section class="mt-12 lg:mt-20 reveal">
          <div class="glass-panel p-6 lg:p-8">
            <p class="text-xs font-semibold uppercase tracking-wider text-theme-faint text-center mb-4">Chapter Navigation</p>
            <div class="flex justify-center">
              <a href="${nextChap}" class="btn-primary magnetic-btn inline-flex items-center gap-2 text-sm py-3 px-6">
                Next: ${nextChapTitle}
                <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
              </a>
            </div>
          </div>
          <div class="flex flex-col sm:flex-row justify-between items-center gap-4 pt-8 border-t border-theme mt-8">
            <a href="${m.slug}.html" class="text-sm text-brand-300 hover:text-theme transition-colors inline-flex items-center gap-1">&larr; Back to Module Overview</a>
            <p class="text-xs text-theme-faint">Consica Academy &middot; Explorer Pack &middot; Module ${m.num} &middot; Chapter ${c.num}</p>
          </div>
        </section>
      </article>
    </main>

    <footer class="border-t border-theme pb-28 lg:pb-16 pt-16">
      <div class="px-5 lg:max-w-[1600px] lg:mx-auto lg:px-8">
        <div class="grid gap-10 lg:grid-cols-4 lg:gap-12">
          <div class="lg:col-span-2">
            <a href="../../../../index.html" class="flex items-center gap-2.5">
              <img src="../../../../assets/images/logol.png" alt="Consica Labs" class="h-7 html-logo-light">
              <img src="../../../../assets/images/logob.png" alt="Consica Labs" class="h-7 html-logo-dark">
              <span class="font-display font-bold text-xl tracking-tight uppercase">Consica Labs</span>
            </a>
            <p class="mt-3 text-sm text-theme-muted max-w-sm">Software &middot; EdTech &middot; SaaS &middot; Innovation Lab. Building trust through intelligent technology.</p>
          </div>
          <div>
            <h4 class="text-xs font-semibold uppercase tracking-wider text-theme-faint mb-4">Products</h4>
            <ul class="space-y-2 text-sm text-theme-muted">
              <li><a href="../../../academy.html" class="hover:text-theme transition-colors">Consica Academy</a></li>
              <li><a href="../../../ai-systems.html" class="hover:text-theme transition-colors">AI Systems</a></li>
              <li><a href="../../../lms.html" class="hover:text-theme transition-colors">LMS Platforms</a></li>
              <li><a href="../../../school-systems.html" class="hover:text-theme transition-colors">School Systems</a></li>
              <li><a href="../../../saas-tools.html" class="hover:text-theme transition-colors">SaaS Tools</a></li>
              <li><a href="../../../enterprise.html" class="hover:text-theme transition-colors">Enterprise Software</a></li>
            </ul>
          </div>
          <div>
            <h4 class="text-xs font-semibold uppercase tracking-wider text-theme-faint mb-4">Academy</h4>
            <ul class="space-y-2 text-sm text-theme-muted">
              <li><a href="../../explorer-pack.html" class="hover:text-theme transition-colors">Explorer Pack</a></li>
              <li><a href="../../builder-pack.html" class="hover:text-theme transition-colors">Builder Pack</a></li>
              <li><a href="../../../../index.html#contact" class="hover:text-theme transition-colors">Contact</a></li>
            </ul>
          </div>
        </div>
        <div class="mt-12 pt-8 border-t border-theme flex flex-col gap-4 lg:flex-row lg:justify-between lg:items-center text-sm text-theme-faint">
          <p>&copy; 2026 Consica Labs. All rights reserved.</p>
          <p>info@consicalabs.com</p>
        </div>
      </div>
    </footer>
  </div>

  <script src="../../../../shared/data/brand.js" defer></script>
  <script src="../../../../shared/data/products.js" defer></script>
  <script src="../../../../shared/utils/dom.js" defer></script>
  <script src="../../../../shared/utils/accessibility.js" defer></script>
  <script src="../../../../shared/scripts/animation-engine.js" defer></script>
  <script src="../../../../shared/scripts/static-init.js" defer></script>
  <script>
    (function() {
      var btn = document.getElementById('reveal-answers-btn');
      if (btn) {
        btn.addEventListener('click', function() {
          var answers = document.querySelectorAll('.kb-answer');
          var hidden = false;
          answers.forEach(function(a) { if (!a.classList.contains('revealed')) hidden = true; });
          answers.forEach(function(a) { a.classList.toggle('revealed', hidden); });
          btn.textContent = hidden ? 'Hide Answers' : 'Show Answers';
        });
      }
    })();
  </script>
</body>
</html>`;
}

function getDiagramIndexHTML(title) {
  const cssPath = "../../../../../../shared/styles/diagram-base.css";
  const jsPath = "../../../../../../shared/scripts/diagram-engine.js";
  
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width,initial-scale=1.0">
  <title>${title} — Interactive Diagram | Consica Labs</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Poppins:wght@600;700&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="${cssPath}">
  <link rel="stylesheet" href="styles.css">
</head>
<body>
  <script src="${jsPath}"></script>
  <script src="script.js"></script>
</body>
</html>`;
}

function getDiagramCSS() {
  return `/* diagram-specific styles */
.diagram-visual { background: linear-gradient(180deg, #0f1729, #0a0e17); }`;
}

function getCustomChallengeBlock(mNum, cNum, interactionType) {
  if (mNum === 6 && cNum === 4) {
    // HTML Document Structure Builder
    return `function initCustomInteractiveChallenge(container, engine) {
      container.innerHTML = '<div class="sim-interactive-area" style="padding: 16px; display:flex; flex-direction:column; gap:12px; width:100%;">' +
        '<div style="font-size:14px; font-weight:700; color:#60a5fa;">HTML Document Structure Builder</div>' +
        '<p style="font-size:11px; color:#cbd5e1;">Assemble a basic HTML document. Select the correct tag for each slot.</p>' +
        '<div class="glass-panel" style="padding:16px; display:flex; flex-direction:column; gap:8px; border-radius:8px; border:1px solid rgba(255,255,255,0.06); background:rgba(255,255,255,0.02);">' +
          '<div style="font-family:monospace; font-size:12px; display:flex; flex-direction:column; gap:8px; color:#a7f3d0;">' +
            '<div>&lt;!DOCTYPE html&gt;</div>' +
            '<div style="display:flex; align-items:center; gap:8px;">' +
              '<span>1.</span>' +
              '<select class="html-slot" id="slot-1" style="background:#1e293b; color:#fff; border:1px solid #475569; border-radius:4px; padding:2px 6px;">' +
                '<option value="">-- Select --</option>' +
                '<option value="html">&lt;html&gt;</option>' +
                '<option value="body">&lt;body&gt;</option>' +
                '<option value="head">&lt;head&gt;</option>' +
              '</select>' +
            '</div>' +
            '<div style="display:flex; align-items:center; gap:8px; margin-left:16px;">' +
              '<span>2.</span>' +
              '<select class="html-slot" id="slot-2" style="background:#1e293b; color:#fff; border:1px solid #475569; border-radius:4px; padding:2px 6px;">' +
                '<option value="">-- Select --</option>' +
                '<option value="head">&lt;head&gt;</option>' +
                '<option value="title">&lt;title&gt;</option>' +
                '<option value="body">&lt;body&gt;</option>' +
              '</select>' +
            '</div>' +
            '<div style="margin-left:32px; color:#64748b;">&lt;title&gt;My First Webpage&lt;/title&gt;</div>' +
            '<div style="margin-left:16px; color:#a7f3d0;">&lt;/head&gt;</div>' +
            '<div style="display:flex; align-items:center; gap:8px; margin-left:16px;">' +
              '<span>3.</span>' +
              '<select class="html-slot" id="slot-3" style="background:#1e293b; color:#fff; border:1px solid #475569; border-radius:4px; padding:2px 6px;">' +
                '<option value="">-- Select --</option>' +
                '<option value="body">&lt;body&gt;</option>' +
                '<option value="html">&lt;html&gt;</option>' +
                '<option value="h1">&lt;h1&gt;</option>' +
              '</select>' +
            '</div>' +
            '<div style="display:flex; align-items:center; gap:8px; margin-left:32px;">' +
              '<span>4.</span>' +
              '<select class="html-slot" id="slot-4" style="background:#1e293b; color:#fff; border:1px solid #475569; border-radius:4px; padding:2px 6px;">' +
                '<option value="">-- Select --</option>' +
                '<option value="h1">&lt;h1&gt;</option>' +
                '<option value="p">&lt;p&gt;</option>' +
                '<option value="head">&lt;head&gt;</option>' +
              '</select>' +
              '<span>Welcome to my website&lt;/h1&gt;</span>' +
            '</div>' +
            '<div style="margin-left:32px; color:#64748b;">&lt;p&gt;This is structured content!&lt;/p&gt;</div>' +
            '<div style="margin-left:16px; color:#a7f3d0;">&lt;/body&gt;</div>' +
            '<div style="color:#a7f3d0;">&lt;/html&gt;</div>' +
          '</div>' +
        '</div>' +
        '<div class="glass-panel" style="padding:12px; background:rgba(0,0,0,0.25); min-height:50px; font-size:11px; border-radius:8px; border:1px solid rgba(255,255,255,0.05);">' +
          '<div id="html-feedback" style="color:#94a3b8; font-weight:500;">Select the tags to build a correct HTML document layout.</div>' +
        '</div>' +
      '</div>';

      var s1 = container.querySelector("#slot-1");
      var s2 = container.querySelector("#slot-2");
      var s3 = container.querySelector("#slot-3");
      var s4 = container.querySelector("#slot-4");
      var fb = container.querySelector("#html-feedback");

      function validateHTML() {
        if (s1.value === "html" && s2.value === "head" && s3.value === "body" && s4.value === "h1") {
          fb.style.color = "#10b981";
          fb.innerHTML = "<strong>🎉 Success!</strong> Document structured correctly. Tim Berners-Lee would be proud!";
          engine.markCompleted();
        } else {
          fb.style.color = "#94a3b8";
          fb.textContent = "Keep trying! html wraps everything, head holds title, body holds visible elements.";
        }
      }

      s1.addEventListener("change", validateHTML);
      s2.addEventListener("change", validateHTML);
      s3.addEventListener("change", validateHTML);
      s4.addEventListener("change", validateHTML);
    }`;
  }
  
  if (mNum === 6 && cNum === 9) {
    // CSS Styling Laboratory
    return `function initCustomInteractiveChallenge(container, engine) {
      container.innerHTML = '<div class="sim-interactive-area" style="padding: 16px; display:flex; flex-direction:column; gap:12px; width:100%;">' +
        '<div style="font-size:14px; font-weight:700; color:#60a5fa;">CSS Sandbox Playground</div>' +
        '<p style="font-size:11px; color:#cbd5e1;">Style the preview box. Target: Text Color = Blue (#3b82f6), Padding = 20px, Border Radius = 10px.</p>' +
        '<div style="display:flex; gap:12px; flex-wrap:wrap; width:100%;">' +
          '<div style="flex:1; min-width:140px; display:flex; flex-direction:column; gap:8px;">' +
            '<div>' +
              '<span style="font-size:11px; color:#94a3b8;">Text Color:</span>' +
              '<div style="display:flex; gap:6px; margin-top:4px;">' +
                '<button class="color-btn" data-color="#ef4444" style="width:20px; height:20px; background:#ef4444; border:none; border-radius:50%; cursor:pointer;"></button>' +
                '<button class="color-btn" data-color="#10b981" style="width:20px; height:20px; background:#10b981; border:none; border-radius:50%; cursor:pointer;"></button>' +
                '<button class="color-btn" data-color="#3b82f6" style="width:20px; height:20px; background:#3b82f6; border:none; border-radius:50%; cursor:pointer;"></button>' +
              '</div>' +
            '</div>' +
            '<div style="display:flex; flex-direction:column; gap:2px;">' +
              '<div style="display:flex; justify-content:space-between; font-size:11px; color:#94a3b8;">' +
                '<span>Padding:</span>' +
                '<span id="lbl-pad">8px</span>' +
              '</div>' +
              '<input type="range" id="range-pad" min="0" max="40" value="8" style="width:100%; cursor:pointer;">' +
            '</div>' +
            '<div style="display:flex; flex-direction:column; gap:2px;">' +
              '<div style="display:flex; justify-content:space-between; font-size:11px; color:#94a3b8;">' +
                '<span>Border Radius:</span>' +
                '<span id="lbl-rad">2px</span>' +
              '</div>' +
              '<input type="range" id="range-rad" min="0" max="20" value="2" style="width:100%; cursor:pointer;">' +
            '</div>' +
          '</div>' +
          '<div style="flex:1; min-width:160px; display:flex; align-items:center; justify-content:center;">' +
            '<div id="css-preview" style="background:#1e293b; border:1px solid rgba(255,255,255,0.1); padding:8px; border-radius:2px; text-align:center; transition: all 0.2s;">' +
              '<h4 style="margin:0; font-size:14px; font-family:sans-serif; color:#fff;">CSS Preview</h4>' +
              '<p style="margin:4px 0 0 0; font-size:10px; color:#94a3b8;">Dynamic Box Model</p>' +
            '</div>' +
          '</div>' +
        '</div>' +
        '<div class="glass-panel" style="padding:12px; background:rgba(0,0,0,0.25); min-height:50px; font-size:11px; border-radius:8px; border:1px solid rgba(255,255,255,0.05);">' +
          '<div id="css-feedback" style="color:#94a3b8; font-weight:500;">Set color to blue, padding to 20px, and border-radius to 10px.</div>' +
        '</div>' +
      '</div>';

      var preview = container.querySelector("#css-preview");
      var rangePad = container.querySelector("#range-pad");
      var rangeRad = container.querySelector("#range-rad");
      var lblPad = container.querySelector("#lbl-pad");
      var lblRad = container.querySelector("#lbl-rad");
      var fb = container.querySelector("#css-feedback");
      var colorBtns = container.querySelectorAll(".color-btn");
      var selectedColor = "#ffffff";

      colorBtns.forEach(function(btn) {
        btn.addEventListener("click", function() {
          selectedColor = this.dataset.color;
          colorBtns.forEach(function(b) { b.style.outline = "none"; });
          this.style.outline = "2px solid #fff";
          updateCSS();
        });
      });

      rangePad.addEventListener("input", function() {
        lblPad.textContent = this.value + "px";
        updateCSS();
      });

      rangeRad.addEventListener("input", function() {
        lblRad.textContent = this.value + "px";
        updateCSS();
      });

      function updateCSS() {
        var pad = parseInt(rangePad.value);
        var rad = parseInt(rangeRad.value);
        preview.style.padding = pad + "px";
        preview.style.borderRadius = rad + "px";
        preview.querySelector("h4").style.color = selectedColor;

        if (selectedColor === "#3b82f6" && pad === 20 && rad === 10) {
          fb.style.color = "#10b981";
          fb.innerHTML = "<strong>🎉 Success!</strong> CSS styles matched target calibration. Challenge completed.";
          engine.markCompleted();
        } else {
          fb.style.color = "#cbd5e1";
          fb.textContent = "Current: Color=" + selectedColor + ", Padding=" + pad + "px, Radius=" + rad + "px. Keep tweaking!";
        }
      }
    }`;
  }

  if (mNum === 7 && cNum === 4) {
    // Sensor Explorer Lab
    return `function initCustomInteractiveChallenge(container, engine) {
      container.innerHTML = '<div class="sim-interactive-area" style="padding: 16px; display:flex; flex-direction:column; gap:12px; width:100%;">' +
        '<div style="font-size:14px; font-weight:700; color:#60a5fa;">Robot Sensor Calibration</div>' +
        '<p style="font-size:11px; color:#cbd5e1;">Test inputs to trigger safety stop. Set Distance &lt; 30cm OR Light &lt; 200 Lux.</p>' +
        '<div style="display:flex; flex-direction:column; gap:8px; width:100%;">' +
          '<div style="display:flex; flex-direction:column; gap:2px;">' +
            '<div style="display:flex; justify-content:space-between; font-size:11px; color:#94a3b8;">' +
              '<span>Distance to Obstacle:</span>' +
              '<span id="lbl-dist">80 cm</span>' +
            '</div>' +
            '<input type="range" id="range-dist" min="10" max="150" value="80" style="width:100%; cursor:pointer;">' +
          '</div>' +
          '<div style="display:flex; flex-direction:column; gap:2px;">' +
            '<div style="display:flex; justify-content:space-between; font-size:11px; color:#94a3b8;">' +
              '<span>Ambient Light Sensor:</span>' +
              '<span id="lbl-light">600 Lux</span>' +
            '</div>' +
            '<input type="range" id="range-light" min="0" max="1000" value="600" style="width:100%; cursor:pointer;">' +
          '</div>' +
          '<div class="glass-panel" style="padding:10px; display:flex; justify-content:space-between; align-items:center; border: 1px solid rgba(255,255,255,0.06); background: rgba(255,255,255,0.02); border-radius: 6px;">' +
            '<span style="font-size:11px; font-weight:bold; color:#cbd5e1;">Robot Motor Status:</span>' +
            '<span id="lbl-status" style="font-size:12px; font-weight:700; color:#10b981;">DRIVING</span>' +
          '</div>' +
        '</div>' +
        '<div class="glass-panel" style="padding:12px; background:rgba(0,0,0,0.25); min-height:50px; font-size:11px; border-radius:8px; border:1px solid rgba(255,255,255,0.05);">' +
          '<div id="sensor-feedback" style="color:#94a3b8; font-weight:500;">Dial distance down or dim the light to test the feedback loop.</div>' +
        '</div>' +
      '</div>';

      var rangeDist = container.querySelector("#range-dist");
      var rangeLight = container.querySelector("#range-light");
      var lblDist = container.querySelector("#lbl-dist");
      var lblLight = container.querySelector("#lbl-light");
      var lblStatus = container.querySelector("#lbl-status");
      var fb = container.querySelector("#sensor-feedback");

      function checkSensors() {
        var dist = parseInt(rangeDist.value);
        var light = parseInt(rangeLight.value);
        lblDist.textContent = dist + " cm";
        lblLight.textContent = light + " Lux";

        if (dist < 30 || light < 200) {
          lblStatus.textContent = "STOPPED (SAFE)";
          lblStatus.style.color = "#ef4444";
          fb.style.color = "#10b981";
          fb.innerHTML = "<strong>🎉 Success!</strong> Sensor feedback triggered the controller safety stop. Challenge completed.";
          engine.markCompleted();
        } else {
          lblStatus.textContent = "DRIVING";
          lblStatus.style.color = "#10b981";
          fb.style.color = "#cbd5e1";
          fb.textContent = "Keep dialing! Distance=" + dist + "cm, Light=" + light + "Lux. Safe bounds: Dist >= 30, Light >= 200.";
        }
      }

      rangeDist.addEventListener("input", checkSensors);
      rangeLight.addEventListener("input", checkSensors);
    }`;
  }

  if (mNum === 7 && cNum === 9) {
    // Robot Avoidance Logic
    return `function initCustomInteractiveChallenge(container, engine) {
      container.innerHTML = '<div class="sim-interactive-area" style="padding: 16px; display:flex; flex-direction:column; gap:12px; width:100%;">' +
        '<div style="font-size:14px; font-weight:700; color:#60a5fa;">Robot Logic Condition Builder</div>' +
        '<p style="font-size:11px; color:#cbd5e1;">Assemble the avoidance script. Check if obstacle is too close.</p>' +
        '<div class="glass-panel" style="padding:16px; display:flex; flex-direction:column; gap:12px; border-radius:8px; border:1px solid rgba(255,255,255,0.06); background:rgba(255,255,255,0.02); font-family:monospace; font-size:12px;">' +
          '<div style="display:flex; flex-wrap:wrap; align-items:center; gap:6px;">' +
            '<span style="color:#f59e0b; font-weight:bold;">IF</span>' +
            '<select id="sel-cond" style="background:#1e293b; color:#fff; border:1px solid #475569; border-radius:4px; padding:2px 6px;">' +
              '<option value="">-- Select Sensor Condition --</option>' +
              '<option value="dist">Distance &lt; 20cm</option>' +
              '<option value="light">Light &gt; 500 Lux</option>' +
            '</select>' +
          '</div>' +
          '<div style="display:flex; flex-wrap:wrap; align-items:center; gap:6px; margin-left:16px;">' +
            '<span style="color:#3b82f6; font-weight:bold;">THEN</span>' +
            '<select id="sel-then" style="background:#1e293b; color:#fff; border:1px solid #475569; border-radius:4px; padding:2px 6px;">' +
              '<option value="">-- Select Action --</option>' +
              '<option value="drive">Drive Straight</option>' +
              '<option value="reverse">Reverse & Turn</option>' +
            '</select>' +
          '</div>' +
          '<div style="display:flex; flex-wrap:wrap; align-items:center; gap:6px;">' +
            '<span style="color:#f59e0b; font-weight:bold;">ELSE</span>' +
          '</div>' +
          '<div style="display:flex; flex-wrap:wrap; align-items:center; gap:6px; margin-left:16px;">' +
            '<select id="sel-else" style="background:#1e293b; color:#fff; border:1px solid #475569; border-radius:4px; padding:2px 6px;">' +
              '<option value="">-- Select Action --</option>' +
              '<option value="drive">Drive Straight</option>' +
              '<option value="stop">Stop</option>' +
            '</select>' +
          '</div>' +
        '</div>' +
        '<div class="glass-panel" style="padding:12px; background:rgba(0,0,0,0.25); min-height:50px; font-size:11px; border-radius:8px; border:1px solid rgba(255,255,255,0.05);">' +
          '<div id="logic-feedback" style="color:#94a3b8; font-weight:500;">Select the logic operations to program the robot.</div>' +
        '</div>' +
      '</div>';

      var selCond = container.querySelector("#sel-cond");
      var selThen = container.querySelector("#sel-then");
      var selElse = container.querySelector("#sel-else");
      var fb = container.querySelector("#logic-feedback");

      function checkLogic() {
        if (selCond.value === "dist" && selThen.value === "reverse" && selElse.value === "drive") {
          fb.style.color = "#10b981";
          fb.innerHTML = "<strong>🎉 Success!</strong> Robot configured to steer away from obstacles. Challenge completed.";
          engine.markCompleted();
        } else {
          fb.style.color = "#cbd5e1";
          fb.textContent = "IF Distance < 20cm THEN Reverse & Turn ELSE Drive Straight.";
        }
      }

      selCond.addEventListener("change", checkLogic);
      selThen.addEventListener("change", checkLogic);
      selElse.addEventListener("change", checkLogic);
    }`;
  }

  if (mNum === 8 && cNum === 4) {
    // Scratch Motion Block Simulator
    return `function initCustomInteractiveChallenge(container, engine) {
      container.innerHTML = '<div class="sim-interactive-area" style="padding: 16px; display:flex; flex-direction:column; gap:12px; width:100%;">' +
        '<div style="font-size:14px; font-weight:700; color:#60a5fa;">Scratch Sprite Navigation</div>' +
        '<p style="font-size:11px; color:#cbd5e1;">Navigate the sprite to the Target Zone (X: 100, Y: -100).</p>' +
        '<div style="display:flex; gap:12px; flex-wrap:wrap; width:100%;">' +
          '<div style="flex:1.2; min-width:160px; display:flex; align-items:center; justify-content:center;">' +
            '<div style="position:relative; width:150px; height:150px; background:#0b0f19; border:2px solid rgba(255,255,255,0.1); border-radius:4px;">' +
              '<div style="position:absolute; left:50%; top:0; bottom:0; width:1px; background:rgba(255,255,255,0.15);"></div>' +
              '<div style="position:absolute; top:50%; left:0; right:0; height:1px; background:rgba(255,255,255,0.15);"></div>' +
              '<div style="position:absolute; right:10px; bottom:10px; width:30px; height:30px; border:2px dashed #10b981; border-radius:4px; background:rgba(16,185,129,0.1); display:flex; align-items:center; justify-content:center;">' +
                '<span style="font-size:8px; color:#10b981; font-weight:bold;">GOAL</span>' +
              '</div>' +
              '<div id="scratch-sprite" style="position:absolute; left:67px; top:67px; width:16px; height:16px; background:#ef4444; border-radius:50%; border:2px solid #fff; transition: all 0.3s; box-shadow:0 0 8px #ef4444;"></div>' +
            '</div>' +
          '</div>' +
          '<div style="flex:1; min-width:120px; display:flex; flex-direction:column; gap:6px;">' +
            '<div style="font-size:11px; color:#cbd5e1;">' +
              'X: <span id="val-x" style="font-weight:bold;">0</span><br>' +
              'Y: <span id="val-y" style="font-weight:bold;">0</span>' +
            '</div>' +
            '<button class="act-btn" id="btn-x-up" style="padding:4px; font-size:10px; cursor:pointer;">X by +50</button>' +
            '<button class="act-btn" id="btn-x-dn" style="padding:4px; font-size:10px; cursor:pointer;">X by -50</button>' +
            '<button class="act-btn" id="btn-y-up" style="padding:4px; font-size:10px; cursor:pointer;">Y by +50</button>' +
            '<button class="act-btn" id="btn-y-dn" style="padding:4px; font-size:10px; cursor:pointer;">Y by -50</button>' +
          '</div>' +
        '</div>' +
        '<div class="glass-panel" style="padding:12px; background:rgba(0,0,0,0.25); min-height:50px; font-size:11px; border-radius:8px; border:1px solid rgba(255,255,255,0.05);">' +
          '<div id="scratch-feedback" style="color:#94a3b8; font-weight:500;">Change sprite coordinates to reach target zone.</div>' +
        '</div>' +
      '</div>';

      var sprite = container.querySelector("#scratch-sprite");
      var valX = container.querySelector("#val-x");
      var valY = container.querySelector("#val-y");
      var fb = container.querySelector("#scratch-feedback");
      var cx = 0;
      var cy = 0;

      function move(dx, dy) {
        cx += dx; cy += dy;
        cx = Math.max(-100, Math.min(100, cx));
        cy = Math.max(-100, Math.min(100, cy));
        valX.textContent = cx;
        valY.textContent = cy;

        var leftPos = 67 + (cx / 100) * 55;
        var topPos = 67 - (cy / 100) * 55;
        sprite.style.left = leftPos + "px";
        sprite.style.top = topPos + "px";

        if (cx === 100 && cy === -100) {
          fb.style.color = "#10b981";
          fb.innerHTML = "<strong>🎉 Success!</strong> Sprite reached target coordinates. Motion loops executed!";
          engine.markCompleted();
        } else {
          fb.style.color = "#cbd5e1";
          fb.textContent = "Navigate to (X: 100, Y: -100).";
        }
      }

      container.querySelector("#btn-x-up").addEventListener("click", function() { move(50, 0); });
      container.querySelector("#btn-x-dn").addEventListener("click", function() { move(-50, 0); });
      container.querySelector("#btn-y-up").addEventListener("click", function() { move(0, 50); });
      container.querySelector("#btn-y-dn").addEventListener("click", function() { move(0, -50); });
    }`;
  }

  if (mNum === 9 && cNum === 5) {
    // SHA-256 Miner
    return `function initCustomInteractiveChallenge(container, engine) {
      container.innerHTML = '<div class="sim-interactive-area" style="padding: 16px; display:flex; flex-direction:column; gap:12px; width:100%;">' +
        '<div style="font-size:14px; font-weight:700; color:#60a5fa;">SHA-256 Block Hashing Lab</div>' +
        '<p style="font-size:11px; color:#cbd5e1;">Mine a block. Find a Nonce that makes the hash start with two zeros "00...".</p>' +
        '<div style="display:flex; flex-direction:column; gap:8px; width:100%;">' +
          '<div style="display:flex; align-items:center; gap:6px; font-size:11px; color:#94a3b8;">' +
            '<span>Block Data:</span>' +
            '<input type="text" id="miner-data" value="Hello" style="background:#1e293b; color:#fff; border:1px solid #475569; border-radius:4px; padding:2px 6px; flex:1; font-size:10px;">' +
          '</div>' +
          '<div style="display:flex; align-items:center; gap:6px; font-size:11px; color:#94a3b8;">' +
            '<span>Nonce:</span>' +
            '<input type="number" id="miner-nonce" value="0" style="background:#1e293b; color:#fff; border:1px solid #475569; border-radius:4px; padding:2px 6px; width:80px; font-size:10px;">' +
            '<button class="act-btn" id="btn-mine" style="padding: 4px 12px; font-weight:bold; cursor:pointer; font-size:10px; margin-left:6px;">MINE</button>' +
          '</div>' +
          '<div class="glass-panel" style="padding:10px; word-break:break-all; font-family:monospace; font-size:10px; border:1px solid rgba(255,255,255,0.06); background:rgba(0,0,0,0.25); border-radius:6px;">' +
            '<div>Hash:</div>' +
            '<div id="lbl-hash" style="color:#eab308; margin-top:2px;">-</div>' +
          '</div>' +
        '</div>' +
        '<div class="glass-panel" style="padding:12px; background:rgba(0,0,0,0.25); min-height:50px; font-size:11px; border-radius:8px; border:1px solid rgba(255,255,255,0.05);">' +
          '<div id="miner-feedback" style="color:#94a3b8; font-weight:500;">Enter a nonce or click MINE to search hashes starting with "00...".</div>' +
        '</div>' +
      '</div>';

      function calcSHA256(ascii) {
        var h = 0;
        for (var i = 0; i < ascii.length; i++) {
          h = (h << 5) - h + ascii.charCodeAt(i);
        }
        var hex = Math.abs(h).toString(16);
        return "00000000".substring(hex.length) + hex;
      }

      var minerData = container.querySelector("#miner-data");
      var minerNonce = container.querySelector("#miner-nonce");
      var lblHash = container.querySelector("#lbl-hash");
      var fb = container.querySelector("#miner-feedback");
      var btnMine = container.querySelector("#btn-mine");

      function updateHash() {
        var data = minerData.value;
        var nonce = minerNonce.value;
        var hash = calcSHA256(data + nonce);
        lblHash.textContent = hash;
        
        if (hash.startsWith("00")) {
          lblHash.style.color = "#10b981";
          fb.style.color = "#10b981";
          fb.innerHTML = "<strong>🎉 Block Mined!</strong> Nonce " + nonce + " solved hash. Challenge completed.";
          engine.markCompleted();
          return true;
        } else {
          lblHash.style.color = "#eab308";
          fb.style.color = "#cbd5e1";
          fb.textContent = 'Hash does not start with "00". Change nonce or click MINE.';
          return false;
        }
      }

      btnMine.addEventListener("click", function() {
        var n = 0;
        btnMine.disabled = true;
        btnMine.textContent = "MINING...";
        
        function mineStep() {
          minerNonce.value = n;
          var solved = updateHash();
          if (!solved && n < 1000) {
            n++;
            setTimeout(mineStep, 10);
          } else {
            btnMine.disabled = false;
            btnMine.textContent = "MINE";
          }
        }
        mineStep();
      });

      minerData.addEventListener("input", updateHash);
      minerNonce.addEventListener("input", updateHash);
      updateHash();
    }`;
  }

  if (mNum === 9 && cNum === 11) {
    // Blockchain Tamper-Proofing Simulator
    return `function initCustomInteractiveChallenge(container, engine) {
      container.innerHTML = '<div class="sim-interactive-area" style="padding: 16px; display:flex; flex-direction:column; gap:12px; width:100%;">' +
        '<div style="font-size:14px; font-weight:700; color:#60a5fa;">Chain Tamper-Proofing Simulator</div>' +
        '<p style="font-size:11px; color:#cbd5e1;">Edit Block 2\\'s data to break Block 3. Mine Block 2 and Block 3 to repair links.</p>' +
        '<div style="display:flex; flex-direction:column; gap:8px; width:100%;">' +
          '<div class="b-card" id="b1" style="background:#1e293b; padding:6px; border:1px solid #10b981; border-radius:4px; font-size:10px;">' +
            '<div style="font-weight:bold; color:#10b981;">Block 1</div>' +
            '<div>Data: <span style="font-family:monospace; color:#fff;">Tx: Alice -&gt; Bob $10</span></div>' +
            '<div>Prev: <span style="font-family:monospace; color:#64748b;">000000</span></div>' +
            '<div>Hash: <span style="font-family:monospace; color:#10b981;">00a1b2</span></div>' +
          '</div>' +
          '<div class="b-card" id="b2" style="background:#1e293b; padding:6px; border:1px solid #10b981; border-radius:4px; font-size:10px;">' +
            '<div style="display:flex; justify-content:space-between; align-items:center;">' +
              '<span style="font-weight:bold; color:#10b981;">Block 2</span>' +
              '<button class="act-btn" id="btn-mine-2" style="padding:2px 8px; font-size:9px; cursor:pointer;" disabled>MINE</button>' +
            '</div>' +
            '<div style="display:flex; align-items:center; gap:4px; margin-top:2px;">' +
              '<span>Data:</span>' +
              '<input type="text" id="b2-data" value="Tx: Bob -&gt; Charlie $5" style="background:#0f172a; color:#fff; border:1px solid #475569; border-radius:2px; padding:1px 4px; flex:1; font-size:9px;">' +
            '</div>' +
            '<div>Prev: <span style="font-family:monospace; color:#cbd5e1;">00a1b2</span></div>' +
            '<div>Hash: <span id="b2-hash" style="font-family:monospace; color:#10b981;">00c3d4</span></div>' +
          '</div>' +
          '<div class="b-card" id="b3" style="background:#1e293b; padding:6px; border:1px solid #10b981; border-radius:4px; font-size:10px;">' +
            '<div style="display:flex; justify-content:space-between; align-items:center;">' +
              '<span style="font-weight:bold; color:#10b981;" id="b3-title">Block 3</span>' +
              '<button class="act-btn" id="btn-mine-3" style="padding:2px 8px; font-size:9px; cursor:pointer;" disabled>MINE</button>' +
            '</div>' +
            '<div>Data: <span style="font-family:monospace; color:#fff;">Tx: Charlie -&gt; David $2</span></div>' +
            '<div>Prev: <span id="b3-prev" style="font-family:monospace; color:#10b981;">00c3d4</span></div>' +
            '<div>Hash: <span id="b3-hash" style="font-family:monospace; color:#10b981;">00e5f6</span></div>' +
          '</div>' +
        '</div>' +
        '<div class="glass-panel" style="padding:12px; background:rgba(0,0,0,0.25); min-height:50px; font-size:11px; border-radius:8px; border:1px solid rgba(255,255,255,0.05);">' +
          '<div id="tamper-feedback" style="color:#94a3b8; font-weight:500;">Edit Block 2\\'s text to trigger the tamper validation flag.</div>' +
        '</div>' +
      '</div>';

      var b2Data = container.querySelector("#b2-data");
      var b2Hash = container.querySelector("#b2-hash");
      var b3Prev = container.querySelector("#b3-prev");
      var b3Hash = container.querySelector("#b3-hash");
      var btnMine2 = container.querySelector("#btn-mine-2");
      var btnMine3 = container.querySelector("#btn-mine-3");
      var fb = container.querySelector("#tamper-feedback");
      var b2Card = container.querySelector("#b2");
      var b3Card = container.querySelector("#b3");

      function calcSHA256(ascii) {
        var h = 0;
        for (var i = 0; i < ascii.length; i++) h = (h << 5) - h + ascii.charCodeAt(i);
        var hex = Math.abs(h).toString(16);
        return "0000".substring(hex.length) + hex;
      }

      b2Data.addEventListener("input", function() {
        var val = b2Data.value;
        var hash = calcSHA256(val);
        b2Hash.textContent = hash;
        b2Card.style.borderColor = "#ef4444";
        b3Prev.style.color = "#ef4444";
        b3Card.style.borderColor = "#ef4444";
        fb.style.color = "#ef4444";
        fb.innerHTML = "<strong>⚠️ Warning!</strong> Chain link broken! Block 3 expects " + b3Prev.textContent + " but Block 2 is " + hash;
        btnMine2.disabled = false;
      });

      btnMine2.addEventListener("click", function() {
        b2Hash.textContent = "00m2f8";
        b2Card.style.borderColor = "#10b981";
        fb.style.color = "#eab308";
        fb.textContent = "Block 2 mined. Now click MINE on Block 3 to propagate the hash!";
        btnMine2.disabled = true;
        btnMine3.disabled = false;
      });

      btnMine3.addEventListener("click", function() {
        b3Prev.textContent = "00m2f8";
        b3Prev.style.color = "#10b981";
        b3Hash.textContent = "00m3k9";
        b3Card.style.borderColor = "#10b981";
        fb.style.color = "#10b981";
        fb.innerHTML = "<strong>🎉 Success!</strong> Hashing chain repaired and consensus synced. Immutability check complete.";
        btnMine3.disabled = true;
        engine.markCompleted();
      });
    }`;
  }

  // Fallback generic calibration challenge
  return `function initCustomInteractiveChallenge(container, engine) {
    var type = "${interactionType}";
    if (type === "builder" || type === "lab" || type === "flow" || type === "tree") {
      container.innerHTML = '<div class="sim-interactive-area" style="padding: 16px; display:flex; flex-direction:column; gap:12px; width:100%;">' +
        '<div style="font-size:14px; font-weight:700; color:#60a5fa;">Interactive Calibration Lab</div>' +
        '<p style="font-size:11px; color:#cbd5e1;">Calibrate values to complete the check. Select inputs to calculate system results.</p>' +
        '<div class="glass-panel" style="padding:12px; display:flex; flex-direction:column; gap:10px; border: 1px solid rgba(255,255,255,0.06); background: rgba(255,255,255,0.02); border-radius: 8px;">' +
          '<div style="display:flex; justify-content:space-between; align-items:center;">' +
            '<span style="font-size:12px; font-weight:bold; color:#cbd5e1;">System Status:</span>' +
            '<button class="act-btn" id="btn-lab-toggle" style="width:100px; justify-content:center; padding: 6px 12px; background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); border-radius: 4px; color:#cbd5e1; cursor:pointer;">OFF</button>' +
          '</div>' +
          '<div style="display:flex; flex-direction:column; gap:4px;">' +
            '<div style="display:flex; justify-content:space-between; font-size:11px; color:#94a3b8;">' +
              '<span>Calibration Meter:</span>' +
              '<span id="lbl-val">50%</span>' +
            '</div>' +
            '<input type="range" id="range-val" min="0" max="100" value="50" style="width:100%; cursor:pointer;">' +
          '</div>' +
        '</div>' +
        '<div class="glass-panel" style="padding:12px; background:rgba(0,0,0,0.25); min-height:60px; font-size:11px; border-radius:8px; border: 1px solid rgba(255,255,255,0.05);">' +
          '<div id="lab-feedback" style="color:#94a3b8; font-weight:500;">Set operational toggle to ON and adjust the meter to 100% to resolve.</div>' +
        '</div>' +
      '</div>';

      var btn = container.querySelector("#btn-lab-toggle");
      var range = container.querySelector("#range-val");
      var lbl = container.querySelector("#lbl-val");
      var fb = container.querySelector("#lab-feedback");
      var isOn = false;

      btn.addEventListener("click", function() {
        isOn = !isOn;
        this.textContent = isOn ? "ON" : "OFF";
        this.style.borderColor = isOn ? "#10b981" : "rgba(255,255,255,0.1)";
        this.style.color = isOn ? "#10b981" : "#cbd5e1";
        checkStatus();
      });

      range.addEventListener("input", function() {
        lbl.textContent = this.value + "%";
        checkStatus();
      });

      function checkStatus() {
        var val = parseInt(range.value);
        if (isOn && val === 100) {
          fb.style.color = "#10b981";
          fb.innerHTML = "<strong>🎉 Success!</strong> System calibrated successfully. Diagram challenge completed.";
          engine.markCompleted();
        } else if (isOn) {
          fb.style.color = "#3b82f6";
          fb.textContent = "Toggle is ON. Now dial the calibration slider to 100% to lock values.";
        } else {
          fb.style.color = "#94a3b8";
          fb.textContent = "Set operational toggle to ON and adjust the meter to 100% to resolve.";
        }
      }
    } else {
      engine.buildFallbackChallenge();
    }
  }`;
}

function getTermRegexPattern(term) {
  const escaped = term.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
  let bodyPattern;
  if (term.toLowerCase().endsWith('y')) {
    const stem = escaped.slice(0, -1);
    bodyPattern = `${stem}(y|ies|y's)`;
  } else if (term.toLowerCase().endsWith('s') || term.toLowerCase().endsWith('x') || term.toLowerCase().endsWith('z') || term.toLowerCase().endsWith('ch') || term.toLowerCase().endsWith('sh')) {
    bodyPattern = `${escaped}(es|'s)?`;
  } else {
    bodyPattern = `${escaped}(s|'s)?`;
  }
  return `(?<=^|\\W)(${bodyPattern})(?=$|\\W)`;
}

function highlightVocabulary(html, vocab) {
  const terms = vocab.map(v => v.term);
  terms.sort((a, b) => b.length - a.length);

  if (!html.includes('.vocab {')) {
    const vocabStyle = `\n    .vocab { color: #3b82f6; font-weight: 500; }`;
    if (html.includes('</style>')) {
      html = html.replace('</style>', `${vocabStyle}\n  </style>`);
    }
  }

  const parts = html.split(/(<[^>]+>)/g);
  const tagStack = [];
  const excludedTags = new Set([
    'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 
    'script', 'style', 'head', 'title', 'meta', 'link', 
    'button', 'select', 'option', 'textarea', 'thead'
  ]);

  for (let i = 0; i < parts.length; i++) {
    const part = parts[i];
    if (part.startsWith('<')) {
      const isClosing = part.startsWith('</');
      const isSelfClosing = part.endsWith('/>');
      const match = part.match(/^<\/?([a-zA-Z0-9:-]+)/);
      if (match) {
        const tagName = match[1].toLowerCase();
        if (!isSelfClosing) {
          if (isClosing) {
            const idx = tagStack.lastIndexOf(tagName);
            if (idx !== -1) tagStack.splice(idx);
          } else {
            tagStack.push(tagName);
          }
        }
      }
    } else {
      const hasExcluded = tagStack.some(t => excludedTags.has(t));
      if (!hasExcluded && part.trim().length > 0) {
        let text = part;
        const placeholders = {};
        let plIndex = 0;

        for (const term of terms) {
          const pattern = getTermRegexPattern(term);
          const regex = new RegExp(pattern, 'gi');
          
          text = text.replace(regex, (match) => {
            const plKey = `__VOCAB_PL_${plIndex}__`;
            const wordId = term.toLowerCase().replace(/[^a-z0-9]+/g, '-');
            placeholders[plKey] = `<span class="vocab cursor-pointer" onclick="scrollToVocabulary('${wordId}')">${match}</span>`;
            plIndex++;
            return plKey;
          });
        }

        for (const [plKey, replacement] of Object.entries(placeholders)) {
          text = text.replaceAll(plKey, replacement);
        }

        parts[i] = text;
      }
    }
  }
  return parts.join('');
}

function getDiagramScriptJS(m, c) {
  const diagramTitle = c.title;
  const interactionType = c.type;
  const components = c.diagram.components;
  const connections = c.diagram.connections;
  const steps = c.diagram.steps;
  const tour = c.diagram.tour;

  const enrichedComponents = components.map(comp => {
    const enriched = { ...comp };
    const matchingVocab = c.vocab.find(v => {
      const termLower = v.term.toLowerCase();
      const compNameLower = comp.name.toLowerCase();
      return compNameLower === termLower || 
             compNameLower.includes(`<${termLower}>`) || 
             compNameLower.includes(` ${termLower}`) ||
             compNameLower.startsWith(termLower);
    });

    if (matchingVocab) {
      enriched.vocabDefinition = matchingVocab.definition;
    }
    if (!enriched.howItWorks) enriched.howItWorks = comp.description;
    if (!enriched.deeperDive) enriched.deeperDive = comp.descriptionDetailed;
    if (!enriched.advancedConcept) enriched.advancedConcept = comp.funFact || comp.takeaway;

    return enriched;
  });
  
  return `(function(){'use strict';
var components = ${JSON.stringify(enrichedComponents)};
var connections = ${JSON.stringify(connections)};
var steps = ${JSON.stringify(steps)};
var tour = ${JSON.stringify(tour)};

${getCustomChallengeBlock(m.num, c.num, interactionType)}

deferInit(function(){
  new DiagramEngine({
    title: "${diagramTitle}",
    subtitle: "${m.title}",
    desc: "Explore the core components and operations.",
    module: ${m.num},
    difficulty: "Intermediate",
    time: "10",
    objectives: "Explore the core components and operations.",
    components: components,
    connections: connections,
    steps: steps,
    tour: tour,
    
    render: function(container, engine) {
      engine.buildVisual(container);
      engine._setStatus('Click any component to learn more');
    },
    
    customChallenge: function(container, engine) {
      initCustomInteractiveChallenge(container, engine);
    },
    
    animate: function(engine) {},
    onReplay: function(engine) {
      engine.t = 0;
    }
  });
});
})();`;
}

async function run() {
  console.log("Starting Courses Generation...");
  
  for (const m of MODULES_DATA) {
    const modDir = path.join(LESSONS_DIR, `module${m.num}`);
    const diagDir = path.join(modDir, 'diagrams');
    
    if (!fs.existsSync(modDir)) fs.mkdirSync(modDir, { recursive: true });
    if (!fs.existsSync(diagDir)) fs.mkdirSync(diagDir, { recursive: true });
    
    // 1. Write Module Dashboard
    const dashboardPath = path.join(modDir, `${m.slug}.html`);
    fs.writeFileSync(dashboardPath, getModuleDashboardHTML(m), 'utf8');
    console.log(`Wrote Dashboard: ${dashboardPath}`);
    
    // 2. Write Chapters & Diagrams
    for (const c of m.chapters) {
      const chapPath = path.join(modDir, `chapter-${c.num}-${c.slug}.html`);
      const rawHtml = getChapterHTML(m, c);
      const highlightedHtml = highlightVocabulary(rawHtml, c.vocab);
      fs.writeFileSync(chapPath, highlightedHtml, 'utf8');
      
      const diagramFolder = `diagram-${String(c.num).padStart(2, '0')}-${c.slug.replace(/-to-/g, '-').slice(0, 20)}`;
      const chapDiagDir = path.join(diagDir, diagramFolder);
      if (!fs.existsSync(chapDiagDir)) fs.mkdirSync(chapDiagDir, { recursive: true });
      
      fs.writeFileSync(path.join(chapDiagDir, 'index.html'), getDiagramIndexHTML(c.title), 'utf8');
      fs.writeFileSync(path.join(chapDiagDir, 'styles.css'), getDiagramCSS(), 'utf8');
      fs.writeFileSync(path.join(chapDiagDir, 'script.js'), getDiagramScriptJS(m, c), 'utf8');
    }
    console.log(`Successfully generated Module ${m.num} chapters and diagrams!`);
  }
  
  console.log("All Course Modules Generated Successfully!");
}

run().catch(err => {
  console.error("Error generating courses:", err);
  process.exit(1);
});
