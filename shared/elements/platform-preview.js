window.ConsicaElements = (function() {
  function platformPreview(layout) {
    const isMobile = layout === 'mobile';
    const base = window.CONSICA_BASE || '';
    
    const avatars = [
      { color: 'bg-indigo-500', char: '👤' },
      { color: 'bg-amber-500', char: '👨‍💻' },
      { color: 'bg-rose-500', char: '👩‍🎨' },
      { color: 'bg-sky-500', char: '🦸' },
      { color: 'bg-emerald-500', char: '🕵️' }
    ];

    return `
    <div class="platform-preview-wrapper relative group">
      <!-- Decorative geometric shapes -->
      <div class="absolute -top-6 -left-6 w-8 h-8 bg-emerald-400/20 rounded-lg rotate-12 animate-float"></div>
      <div class="absolute top-1/4 -left-12 w-10 h-1 border-2 border-emerald-400/20 rounded-full -rotate-45 animate-float-delay"></div>
      
      <!-- Main Browser Frame -->
      <div class="glass-panel overflow-hidden shadow-2xl border-theme" style="background: var(--glass-bg); backdrop-blur: 20px;">
        <!-- Browser Header -->
        <div class="h-10 bg-section-tint border-b border-theme px-4 flex items-center justify-between">
          <div class="flex items-center gap-1.5">
            <div class="w-2.5 h-2.5 rounded-full bg-[#FF5F57]"></div>
            <div class="w-2.5 h-2.5 rounded-full bg-[#FFBD2E]"></div>
            <div class="w-2.5 h-2.5 rounded-full bg-[#28C840]"></div>
          </div>
          <div class="flex items-center gap-2">
            <img src="${base}assets/images/logow.png" class="h-3.5 theme-show-dark opacity-80" alt="">
            <img src="${base}assets/images/logob.png" class="h-3.5 theme-show-light opacity-80" alt="">
            <span class="text-[10px] font-bold tracking-widest text-theme-muted uppercase">Consica Platform</span>
          </div>
          <div class="w-12"></div> <!-- Spacer -->
        </div>

        <div class="flex h-[440px] ${isMobile ? 'h-[320px]' : ''}">
          <!-- Sidebar -->
          <div class="w-[35%] bg-section-tint border-r border-theme p-4 flex flex-col gap-6">
            <div class="mb-2 opacity-80 flex items-center gap-2">
              <div class="w-2 h-2 rounded-full bg-brand-500"></div>
              <span class="text-[9px] font-bold text-theme-soft uppercase tracking-tighter">System Console</span>
            </div>
            ${avatars.map((a, i) => `
              <div class="flex items-center gap-3 opacity-0 animate-slide-in-right" style="animation-delay: ${0.2 + i * 0.1}s; animation-fill-mode: forwards;">
                <div class="w-8 h-8 ${isMobile ? 'w-6 h-6' : ''} rounded-full ${a.color} flex items-center justify-center text-xs shadow-lg ring-1 ring-white/10">
                  ${a.char}
                </div>
                <div class="h-1.5 bg-theme-faint rounded-full flex-1 max-w-[60px]" style="background: var(--text-faint);"></div>
              </div>
            `).join('')}
          </div>

          <!-- Main Area -->
          <div class="flex-1 p-4 flex flex-col gap-4">
            <!-- Top Cards -->
            <div class="grid grid-cols-2 gap-4 h-[40%]">
              <div class="glass-panel bg-section-tint flex items-center justify-center group/card hover:bg-section-tint-hover transition-colors cursor-pointer border-theme">
                <div class="w-8 h-8 rounded-full border border-theme flex items-center justify-center text-theme-muted group-hover/card:text-brand-300 transition-colors">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/></svg>
                </div>
              </div>
              <div class="glass-panel bg-section-tint flex items-center justify-center group/card hover:bg-section-tint-hover transition-colors cursor-pointer border-theme">
                <div class="w-8 h-8 rounded-full bg-theme-faint flex items-center justify-center text-theme-soft group-hover/card:text-brand-300 transition-colors translate-x-0.5">
                  <svg class="w-3 h-3 fill-current" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
                </div>
              </div>
            </div>

            <!-- Bottom Integration Area -->
            <div class="flex-1 glass-panel bg-section-tint p-4 relative overflow-hidden border-theme">
              <!-- Animated background lines -->
              <div class="absolute top-4 right-4 w-20 h-1.5 bg-rose-400/20 rounded-full blur-[1px]"></div>
              <div class="absolute bottom-1/2 right-12 w-16 h-1.5 bg-amber-400/20 rounded-full blur-[1px]"></div>
              <div class="absolute top-1/2 left-4 w-24 h-1.5 bg-emerald-400/20 rounded-full blur-[1px]"></div>

              <div class="flex flex-col gap-4">
                <!-- Python Chip (Using local asset) -->
                <div class="bg-white px-3 py-2 rounded-xl flex items-center gap-3 w-fit shadow-xl scale-95 hover:scale-100 transition-transform cursor-pointer border border-slate-100">
                  <img src="${base}assets/icons/python.svg" class="w-4 h-4" alt="Python">
                  <span class="text-[10px] font-bold text-slate-800">Python Core</span>
                </div>
                
                <!-- TensorFlow Chip (Using local asset) -->
                <div class="bg-white px-3 py-2 rounded-xl flex items-center gap-3 w-fit self-end shadow-xl scale-95 hover:scale-100 transition-transform cursor-pointer translate-y-2 border border-slate-100">
                  <img src="${base}assets/icons/tensorflow.svg" class="w-4 h-4" alt="TensorFlow">
                  <span class="text-[10px] font-bold text-slate-800">TensorFlow ML</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    `;
  }

  return {
    platformPreview
  };
})();
