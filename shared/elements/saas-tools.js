window.ConsicaElements = window.ConsicaElements || {};

window.ConsicaElements.saasToolsPreview = function (layout) {
  const isMobile = layout === 'mobile';
  const base = window.CONSICA_BASE || '';

  // Generate individual preview HTML instances in desktop configuration
  const academyHTML = window.ConsicaElements.academyPreview ? window.ConsicaElements.academyPreview('desktop') : '';
  const ecommerceHTML = window.ConsicaElements.ecommercePreview ? window.ConsicaElements.ecommercePreview('desktop') : '';
  const lmsHTML = window.ConsicaElements.lmsPreview ? window.ConsicaElements.lmsPreview('desktop') : '';
  const aiHTML = window.ConsicaElements.aiPreview ? window.ConsicaElements.aiPreview('desktop') : '';
  const smsHTML = window.ConsicaElements.smsPreview ? window.ConsicaElements.smsPreview('desktop') : '';
  const enterpriseHTML = window.ConsicaElements.enterprisePreview ? window.ConsicaElements.enterprisePreview('desktop') : '';

  return `
    <div class="saas-tools-wrapper relative group flex items-center justify-center w-full ${isMobile ? 'scale-[0.43] my-[-150px]' : 'scale-[0.7] lg:scale-[0.8] xl:scale-[0.85]'} origin-center">
      <!-- Outer Glass window (Exactly sized as sms-preview.js) -->
      <div class="w-[860px] h-[540px] glass-panel bg-section-tint rounded-2xl shadow-2xl overflow-hidden border border-theme relative flex flex-col shrink-0 font-sans transition-transform duration-500 hover:-translate-y-2">
        
        <!-- Browser Header -->
        <div class="h-10 bg-section-tint border-b border-theme px-4 flex items-center justify-between shrink-0">
          <div class="flex items-center gap-1.5">
            <div class="w-3 h-3 rounded-full bg-[#FF5F57]"></div>
            <div class="w-3 h-3 rounded-full bg-[#FFBD2E]"></div>
            <div class="w-3 h-3 rounded-full bg-[#28C840]"></div>
          </div>
          <div class="flex items-center gap-2">
            <img src="${base}assets/images/logow.png" class="h-3.5 theme-show-dark opacity-85" alt="Consica Logo">
            <img src="${base}assets/images/logob.png" class="h-3.5 theme-show-light opacity-85" alt="Consica Logo">
            <span class="text-[11px] font-black tracking-wider text-theme-muted uppercase">Consica Workspace Console</span>
          </div>
          <div class="w-12"></div> <!-- Spacer -->
        </div>

        <!-- Main Body Grid Layout -->
        <div class="flex-1 flex min-h-0 relative">
          
          <!-- Left Console Sidebar -->
          <div class="w-[180px] border-r border-theme flex flex-col p-4 shrink-0 bg-section-tint gap-4">
            <div class="flex items-center gap-2 px-1.5 py-1">
              <span class="text-sm">🌐</span>
              <div>
                <h3 class="text-[10px] font-black text-theme uppercase tracking-wider">Consica Central</h3>
                <span class="text-[7px] text-theme-muted font-bold">Workspace Hub</span>
              </div>
            </div>

            <!-- Navigation Links -->
            <nav class="flex flex-col gap-1 flex-1">
              <div class="flex items-center gap-2.5 px-3 py-2 rounded-xl bg-[#635BFF]/10 text-[#635BFF] dark:text-[#8D86FF] text-[10px] font-black cursor-pointer">
                <span>🖥️</span> Dashboard
              </div>
              <div class="flex items-center gap-2.5 px-3 py-2 rounded-xl text-theme-muted hover:bg-section-tint-hover text-[10px] font-bold cursor-pointer transition-colors">
                <span>🔌</span> Integrations
              </div>
              <div class="flex items-center gap-2.5 px-3 py-2 rounded-xl text-theme-muted hover:bg-section-tint-hover text-[10px] font-bold cursor-pointer transition-colors">
                <span>💳</span> Subscriptions
              </div>
              <div class="flex items-center gap-2.5 px-3 py-2 rounded-xl text-theme-muted hover:bg-section-tint-hover text-[10px] font-bold cursor-pointer transition-colors">
                <span>📈</span> Analytics
              </div>
              <div class="flex items-center gap-2.5 px-3 py-2 rounded-xl text-theme-muted hover:bg-section-tint-hover text-[10px] font-bold cursor-pointer transition-colors">
                <span>⚙️</span> Portal Settings
              </div>
            </nav>

            <!-- Bottom Console Status -->
            <div class="bg-section-tint border border-theme rounded-2xl p-2.5 flex flex-col gap-1.5">
              <div class="flex items-center gap-1.5">
                <span class="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                <span class="text-[8px] font-bold text-theme">System Ok</span>
              </div>
              <span class="text-[6px] text-theme-muted font-medium">All 6 instances are running optimally.</span>
            </div>
          </div>

          <!-- Right Content Area (Active SaaS Showcase Grid) -->
          <div class="flex-1 flex flex-col overflow-y-auto p-4 gap-4 scrollbar-none">
            <!-- Header bar inside main area -->
            <div class="flex justify-between items-center shrink-0">
              <div>
                <h2 class="text-sm font-black text-theme">Active SaaS Instances</h2>
                <p class="text-[8px] text-theme-muted">Manage and launch your connected enterprise applications</p>
              </div>
              <button class="bg-[#635BFF] hover:bg-[#5249E0] text-white text-[9px] font-black uppercase tracking-wider px-3.5 py-1.5 rounded-xl shadow-[0_0_15px_rgba(99,91,255,0.3)] transition-all">
                + Provision New App
              </button>
            </div>

            <!-- Grid of scaled down apps (3 columns, 2 rows) -->
            <div class="grid grid-cols-3 gap-3.5 pb-2">
              
              <!-- 1. Academy Instance -->
              <div class="relative overflow-hidden rounded-xl border border-theme bg-section-tint w-[202px] h-[132px] flex items-center justify-center cursor-pointer hover:border-[#635BFF]/45 transition-colors group">
                <div class="absolute scale-[0.22] origin-center pointer-events-none w-[860px] h-[540px] flex items-center justify-center">
                  ${academyHTML}
                </div>
                <!-- Permanent badge -->
                <div class="absolute bottom-1.5 left-1.5 backdrop-blur-md px-2 py-0.5 rounded-full border border-theme text-[7px] font-bold text-theme flex items-center gap-1 z-20 shadow-sm" style="background: var(--glass-bg);">
                  <span class="w-1 h-1 rounded-full bg-emerald-500"></span>
                  Academy
                </div>
                <!-- Hover overlay -->
                <div class="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-2 z-30">
                  <span class="text-[7px] font-bold text-[#8D86FF] uppercase tracking-widest">EdTech Path</span>
                  <h4 class="text-[9px] font-black text-white mt-0.5">Consica Academy</h4>
                  <span class="text-[7px] text-white/70 mt-1 flex items-center gap-1">Launch System ↗</span>
                </div>
              </div>

              <!-- 2. E-Commerce Instance -->
              <div class="relative overflow-hidden rounded-xl border border-theme bg-section-tint w-[202px] h-[132px] flex items-center justify-center cursor-pointer hover:border-[#635BFF]/45 transition-colors group">
                <div class="absolute scale-[0.22] origin-center pointer-events-none w-[860px] h-[540px] flex items-center justify-center">
                  ${ecommerceHTML}
                </div>
                <!-- Permanent badge -->
                <div class="absolute bottom-1.5 left-1.5 backdrop-blur-md px-2 py-0.5 rounded-full border border-theme text-[7px] font-bold text-theme flex items-center gap-1 z-20 shadow-sm" style="background: var(--glass-bg);">
                  <span class="w-1 h-1 rounded-full bg-emerald-500"></span>
                  E-Commerce
                </div>
                <!-- Hover overlay -->
                <div class="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-2 z-30">
                  <span class="text-[7px] font-bold text-[#8D86FF] uppercase tracking-widest">SaaS E-Shop</span>
                  <h4 class="text-[9px] font-black text-white mt-0.5">Consica Commerce</h4>
                  <span class="text-[7px] text-white/70 mt-1 flex items-center gap-1">Launch System ↗</span>
                </div>
              </div>

              <!-- 3. LMS Instance -->
              <div class="relative overflow-hidden rounded-xl border border-theme bg-section-tint w-[202px] h-[132px] flex items-center justify-center cursor-pointer hover:border-[#635BFF]/45 transition-colors group">
                <div class="absolute scale-[0.22] origin-center pointer-events-none w-[860px] h-[540px] flex items-center justify-center">
                  ${lmsHTML}
                </div>
                <!-- Permanent badge -->
                <div class="absolute bottom-1.5 left-1.5 backdrop-blur-md px-2 py-0.5 rounded-full border border-theme text-[7px] font-bold text-theme flex items-center gap-1 z-20 shadow-sm" style="background: var(--glass-bg);">
                  <span class="w-1 h-1 rounded-full bg-emerald-500"></span>
                  LMS Platforms
                </div>
                <!-- Hover overlay -->
                <div class="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-2 z-30">
                  <span class="text-[7px] font-bold text-[#8D86FF] uppercase tracking-widest">EdTech SaaS</span>
                  <h4 class="text-[9px] font-black text-white mt-0.5">LMS Platform</h4>
                  <span class="text-[7px] text-white/70 mt-1 flex items-center gap-1">Launch System ↗</span>
                </div>
              </div>

              <!-- 4. AI Instance -->
              <div class="relative overflow-hidden rounded-xl border border-theme bg-section-tint w-[202px] h-[132px] flex items-center justify-center cursor-pointer hover:border-[#635BFF]/45 transition-colors group">
                <div class="absolute scale-[0.22] origin-center pointer-events-none w-[860px] h-[540px] flex items-center justify-center">
                  ${aiHTML}
                </div>
                <!-- Permanent badge -->
                <div class="absolute bottom-1.5 left-1.5 backdrop-blur-md px-2 py-0.5 rounded-full border border-theme text-[7px] font-bold text-theme flex items-center gap-1 z-20 shadow-sm" style="background: var(--glass-bg);">
                  <span class="w-1 h-1 rounded-full bg-emerald-500"></span>
                  AI Systems
                </div>
                <!-- Hover overlay -->
                <div class="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-2 z-30">
                  <span class="text-[7px] font-bold text-[#8D86FF] uppercase tracking-widest">Cognitive ML</span>
                  <h4 class="text-[9px] font-black text-white mt-0.5">Consica AI</h4>
                  <span class="text-[7px] text-white/70 mt-1 flex items-center gap-1">Launch System ↗</span>
                </div>
              </div>

              <!-- 5. School Systems Instance -->
              <div class="relative overflow-hidden rounded-xl border border-theme bg-section-tint w-[202px] h-[132px] flex items-center justify-center cursor-pointer hover:border-[#635BFF]/45 transition-colors group">
                <div class="absolute scale-[0.22] origin-center pointer-events-none w-[860px] h-[540px] flex items-center justify-center">
                  ${smsHTML}
                </div>
                <!-- Permanent badge -->
                <div class="absolute bottom-1.5 left-1.5 backdrop-blur-md px-2 py-0.5 rounded-full border border-theme text-[7px] font-bold text-theme flex items-center gap-1 z-20 shadow-sm" style="background: var(--glass-bg);">
                  <span class="w-1 h-1 rounded-full bg-emerald-500"></span>
                  School Systems
                </div>
                <!-- Hover overlay -->
                <div class="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-2 z-30">
                  <span class="text-[7px] font-bold text-[#8D86FF] uppercase tracking-widest">Edu Operational</span>
                  <h4 class="text-[9px] font-black text-white mt-0.5">Consica SMS</h4>
                  <span class="text-[7px] text-white/70 mt-1 flex items-center gap-1">Launch System ↗</span>
                </div>
              </div>

              <!-- 6. Enterprise Instance -->
              <div class="relative overflow-hidden rounded-xl border border-theme bg-section-tint w-[202px] h-[132px] flex items-center justify-center cursor-pointer hover:border-[#635BFF]/45 transition-colors group">
                <div class="absolute scale-[0.22] origin-center pointer-events-none w-[860px] h-[540px] flex items-center justify-center">
                  ${enterpriseHTML}
                </div>
                <!-- Permanent badge -->
                <div class="absolute bottom-1.5 left-1.5 backdrop-blur-md px-2 py-0.5 rounded-full border border-theme text-[7px] font-bold text-theme flex items-center gap-1 z-20 shadow-sm" style="background: var(--glass-bg);">
                  <span class="w-1 h-1 rounded-full bg-emerald-500"></span>
                  Enterprise Software
                </div>
                <!-- Hover overlay -->
                <div class="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-2 z-30">
                  <span class="text-[7px] font-bold text-[#8D86FF] uppercase tracking-widest">Enterprise Suite</span>
                  <h4 class="text-[9px] font-black text-white mt-0.5">Consica HR Suite</h4>
                  <span class="text-[7px] text-white/70 mt-1 flex items-center gap-1">Launch System ↗</span>
                </div>
              </div>

            </div>
          </div>
          
        </div>
      </div>
    </div>
  `;
};
