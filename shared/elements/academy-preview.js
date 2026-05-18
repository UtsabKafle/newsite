window.ConsicaElements = window.ConsicaElements || {};

window.ConsicaElements.academyPreview = function (layout) {
  const isMobile = layout === 'mobile';

  return `
    <div class="academy-preview-wrapper relative group flex items-center justify-center gap-6 w-full ${isMobile ? 'scale-[0.55] my-[-110px]' : 'scale-100'} origin-center">
      <!-- Phone 1: Dashboard -->
      <div class="w-[260px] h-[520px] glass-panel bg-section-tint rounded-[2.5rem] shadow-2xl overflow-hidden border-[6px] border-theme relative flex flex-col shrink-0 transition-transform duration-500 hover:-translate-y-2">
        <!-- Header -->
        <div class="pt-8 px-5 flex justify-between items-center mb-4">
          <h2 class="font-bold text-theme text-lg">Hi, Amy!</h2>
          <div class="flex gap-3 text-theme-muted">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"></path></svg>
          </div>
        </div>

        <!-- Calendar -->
        <div class="flex justify-between px-5 mb-6 text-[10px] font-bold text-theme-muted">
          <span>S</span>
          <div class="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center -mt-1 shadow-md shadow-blue-500/30">M</div>
          <span>T</span>
          <span>W</span>
          <span>T</span>
          <span>F</span>
        </div>

        <!-- Content scrollable -->
        <div class="flex-1 overflow-hidden flex flex-col gap-5 relative">
          <!-- Popular -->
          <div class="pl-5">
            <div class="flex justify-between items-center mb-3 pr-5">
              <h3 class="font-bold text-theme text-sm">Popular</h3>
              <span class="text-[9px] text-brand-300 font-bold cursor-pointer">View all</span>
            </div>
            <div class="flex gap-3 overflow-visible">
              <!-- Card 1 -->
              <div class="w-28 shrink-0 bg-blue-500 rounded-xl p-3 text-white shadow-lg shadow-blue-500/30 relative overflow-hidden">
                <div class="absolute -top-4 -right-4 w-16 h-16 bg-white/10 rounded-full blur-md"></div>
                <div class="w-6 h-6 bg-white/20 rounded-lg flex items-center justify-center mb-3 backdrop-blur-sm">🎨</div>
                <h4 class="font-bold text-[10px] leading-tight mb-1">Design System<br>Developer</h4>
                <p class="text-[8px] text-blue-100 mb-3">12 Chapter</p>
                <div class="flex justify-between items-center bg-white/20 rounded-full pl-2 pr-1 py-1 backdrop-blur-sm cursor-pointer hover:bg-white/30 transition-colors">
                  <span class="text-[8px] font-bold">Join</span>
                  <div class="w-4 h-4 bg-white rounded-full flex items-center justify-center text-blue-500 text-[8px]">&rarr;</div>
                </div>
              </div>
              <!-- Card 2 -->
              <div class="w-28 shrink-0 bg-rose-400 rounded-xl p-3 text-white shadow-lg shadow-rose-400/30 relative overflow-hidden">
                <div class="absolute -bottom-4 -right-4 w-16 h-16 bg-white/20 rounded-full blur-md"></div>
                <div class="w-6 h-6 bg-white/20 rounded-lg flex items-center justify-center mb-3 backdrop-blur-sm">👥</div>
                <h4 class="font-bold text-[10px] leading-tight mb-1">Grow Your<br>Community</h4>
                <p class="text-[8px] text-rose-100 mb-3">12 Chapter</p>
                <div class="flex justify-between items-center bg-white/20 rounded-full pl-2 pr-1 py-1 backdrop-blur-sm cursor-pointer hover:bg-white/30 transition-colors">
                  <span class="text-[8px] font-bold">Join</span>
                  <div class="w-4 h-4 bg-white rounded-full flex items-center justify-center text-rose-400 text-[8px]">&rarr;</div>
                </div>
              </div>
              <!-- Card 3 -->
              <div class="w-28 shrink-0 bg-purple-500 rounded-xl p-3 text-white shadow-lg shadow-purple-500/30 relative overflow-hidden transform translate-x-1">
                <div class="absolute -top-4 -right-4 w-16 h-16 bg-white/10 rounded-full blur-md"></div>
                <div class="w-6 h-6 bg-white/20 rounded-lg flex items-center justify-center mb-3 backdrop-blur-sm">🎤</div>
                <h4 class="font-bold text-[10px] leading-tight mb-1">Basic Public<br>Speaking</h4>
                <p class="text-[8px] text-purple-100 mb-3">12 Chapter</p>
                <div class="flex justify-between items-center bg-white/20 rounded-full pl-2 pr-1 py-1 backdrop-blur-sm cursor-pointer hover:bg-white/30 transition-colors">
                  <span class="text-[8px] font-bold">Join</span>
                  <div class="w-4 h-4 bg-white rounded-full flex items-center justify-center text-purple-500 text-[8px]">&rarr;</div>
                </div>
              </div>
            </div>
          </div>

          <!-- Recent Class -->
          <div class="px-5 pb-5">
            <div class="flex justify-between items-center mb-3">
              <h3 class="font-bold text-theme text-sm">Recent Class</h3>
              <div class="flex gap-0.5 opacity-50">
                <div class="w-1 h-1 bg-current rounded-full text-theme-muted"></div>
                <div class="w-1 h-1 bg-current rounded-full text-theme-muted"></div>
              </div>
            </div>
            
            <div class="space-y-3">
              <!-- Item 1 -->
              <div class="glass-panel bg-section-tint rounded-xl p-3 shadow-sm flex items-center gap-3 border border-theme hover:shadow-md transition-shadow cursor-pointer">
                <div class="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center text-brand-300 shadow-inner">🎨</div>
                <div class="flex-1 min-w-0">
                  <p class="text-[8px] text-brand-300 font-bold uppercase tracking-wider mb-0.5">Design</p>
                  <h4 class="text-[10px] font-bold text-theme truncate">Design System Dev...</h4>
                  <p class="text-[8px] text-theme-muted">12 Chapter</p>
                </div>
                <div class="relative w-8 h-8 flex items-center justify-center shrink-0">
                  <svg class="w-full h-full -rotate-90" viewBox="0 0 36 36">
                    <path class="text-theme-muted opacity-20" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" stroke-width="3"></path>
                    <path class="text-brand-300" stroke-dasharray="80, 100" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" stroke-width="3"></path>
                  </svg>
                  <span class="absolute text-[8px] font-bold text-theme-soft">80</span>
                </div>
              </div>
              
              <!-- Item 2 -->
              <div class="glass-panel bg-section-tint rounded-xl p-3 shadow-sm flex items-center gap-3 border border-theme hover:shadow-md transition-shadow cursor-pointer">
                <div class="w-10 h-10 rounded-full bg-rose-500/10 flex items-center justify-center text-rose-400 shadow-inner">👨‍💻</div>
                <div class="flex-1 min-w-0">
                  <p class="text-[8px] text-rose-400 font-bold uppercase tracking-wider mb-0.5">Development</p>
                  <h4 class="text-[10px] font-bold text-theme truncate">Design System Dev...</h4>
                  <p class="text-[8px] text-theme-muted">12 Chapter</p>
                </div>
                <div class="relative w-8 h-8 flex items-center justify-center shrink-0">
                  <svg class="w-full h-full -rotate-90" viewBox="0 0 36 36">
                    <path class="text-theme-muted opacity-20" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" stroke-width="3"></path>
                    <path class="text-rose-400" stroke-dasharray="50, 100" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" stroke-width="3"></path>
                  </svg>
                  <span class="absolute text-[8px] font-bold text-theme-soft">50</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Bottom Nav -->
        <div class="glass-panel border-t border-theme border-l-0 border-r-0 border-b-0 pt-3 pb-6 px-8 flex justify-between items-center rounded-b-[2.1rem] relative z-10" style="background: var(--nav-glass);">
          <svg class="w-5 h-5 text-brand-300" fill="currentColor" viewBox="0 0 20 20"><path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z"></path></svg>
          <svg class="w-5 h-5 text-theme-muted hover:text-theme transition-colors cursor-pointer" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z"></path></svg>
          <svg class="w-5 h-5 text-theme-muted hover:text-theme transition-colors cursor-pointer" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
          <svg class="w-5 h-5 text-theme-muted hover:text-theme transition-colors cursor-pointer" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
        </div>
      </div>

      <!-- Phone 2: Analytics -->
      ${!isMobile ? `
      <div class="w-[260px] h-[520px] glass-panel bg-section-tint rounded-[2.5rem] shadow-2xl overflow-hidden border-[6px] border-theme relative flex flex-col shrink-0 transition-transform duration-500 hover:-translate-y-2 translate-y-4">
        <!-- Header -->
        <div class="pt-8 px-5 flex justify-between items-center mb-4">
          <div class="flex items-center gap-2 text-theme-muted">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
            <span class="text-[11px] font-medium">Search...</span>
          </div>
          <svg class="w-4 h-4 text-theme-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"></path></svg>
        </div>

        <!-- Calendar -->
        <div class="flex justify-between px-5 mb-6 text-[10px] font-bold text-theme-muted">
          <span>S</span>
          <div class="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center -mt-1 shadow-md shadow-blue-500/30">M</div>
          <span>T</span>
          <span>W</span>
          <span>T</span>
          <span>F</span>
        </div>

        <!-- Content -->
        <div class="flex-1 overflow-hidden flex flex-col gap-4 px-5 pb-5">
          <!-- Average Score -->
          <div class="glass-panel bg-section-tint rounded-2xl p-4 shadow-sm border border-theme flex items-center justify-between hover:shadow-md transition-shadow">
            <div>
              <h4 class="text-[10px] font-bold text-theme mb-1">Average Score</h4>
              <p class="text-2xl font-black text-brand-300 mb-1 tracking-tight">74.18</p>
              <p class="text-[8px] text-theme-muted font-medium">In 30 days</p>
            </div>
            <div class="relative w-12 h-12 flex items-center justify-center">
              <div class="absolute inset-0 rounded-full bg-brand-500/10 border border-theme opacity-50"></div>
              <svg class="w-full h-full -rotate-90 relative z-10" viewBox="0 0 36 36">
                <path class="text-brand-300 drop-shadow-md" stroke-dasharray="84, 100" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" stroke-width="4"></path>
              </svg>
              <span class="absolute text-[8px] font-bold text-brand-300 z-20">84%</span>
            </div>
          </div>

          <!-- Great Progress -->
          <div class="glass-panel bg-section-tint rounded-2xl p-4 shadow-sm border border-theme flex flex-col justify-between h-[88px] relative overflow-hidden hover:shadow-md transition-shadow">
            <div class="w-3/5">
              <h4 class="text-[10px] font-bold text-theme mb-1">Great Progress 🔥</h4>
              <p class="text-[8px] text-theme-muted font-medium leading-tight">You are completely on track, keep it up!</p>
            </div>
            <!-- Red Line Chart -->
            <div class="absolute bottom-3 right-3 w-16 h-10 flex items-end justify-end">
              <svg class="w-full h-full" viewBox="0 0 100 50" preserveAspectRatio="none">
                <!-- Soft red shadow under line -->
                <path d="M0,45 Q15,45 25,35 T50,35 T75,15 T100,10 L100,50 L0,50 Z" fill="rgba(244,63,94,0.1)"></path>
                <path d="M0,40 Q15,40 25,30 T50,30 T75,10 T100,5" fill="none" stroke="#F43F5E" stroke-width="2.5" stroke-linecap="round"></path>
                <circle cx="100" cy="5" r="3" fill="currentColor" class="text-theme" stroke="#F43F5E" stroke-width="2"></circle>
              </svg>
              <span class="absolute bottom-0 right-0 text-[8px] text-rose-400 font-bold glass-panel bg-section-tint rounded px-1 backdrop-blur-sm border border-theme">+27%</span>
            </div>
          </div>

          <!-- Activity Chart -->
          <div class="glass-panel bg-section-tint rounded-2xl p-4 shadow-sm border border-theme flex-1 flex flex-col relative overflow-hidden">
            <div class="flex justify-between items-center mb-4">
              <h4 class="text-[10px] font-bold text-theme">Activity</h4>
              <div class="flex gap-2 text-[8px] text-theme-muted font-bold">
                <span class="cursor-pointer hover:text-theme">Day</span>
                <span class="text-brand-300">Week</span>
                <span class="cursor-pointer hover:text-theme">Month</span>
              </div>
            </div>
            <div class="flex-1 relative w-full h-full mt-2">
               <!-- Simple CSS lines -->
               <div class="absolute inset-0 flex items-center justify-center">
                 <svg width="100%" height="100%" viewBox="0 0 100 50" preserveAspectRatio="none">
                   <!-- Shadow/area blue -->
                   <path d="M0,35 Q15,40 30,30 T60,35 T100,20 L100,50 L0,50 Z" fill="rgba(86,148,228,0.15)"></path>
                   <!-- Line 1 (theme) -->
                   <path d="M0,25 Q20,30 40,20 T80,25 T100,15" fill="none" class="stroke-theme-muted opacity-30" stroke-width="1.5"></path>
                   <!-- Line 2 (blue) -->
                   <path d="M0,35 Q15,40 30,30 T60,35 T100,20" fill="none" stroke="#5694E4" stroke-width="2" stroke-linecap="round"></path>
                   <!-- Data Point -->
                   <line x1="30" y1="30" x2="30" y2="50" class="stroke-theme-muted opacity-30" stroke-width="1" stroke-dasharray="2 2"></line>
                   <circle cx="30" cy="30" r="3" fill="currentColor" class="text-theme" stroke="#5694E4" stroke-width="2"></circle>
                 </svg>
               </div>
               <!-- Tooltip -->
               <div class="absolute top-0 left-[15%] glass-panel bg-section-tint shadow-lg rounded-lg px-2 py-1 flex flex-col items-center border border-theme animate-bounce" style="animation-duration: 3s;">
                 <span class="text-[7px] text-theme-soft font-medium">Score 🚀</span>
                 <span class="text-[9px] font-bold text-theme">72.34</span>
               </div>
            </div>
          </div>
        </div>

        <!-- Bottom Nav -->
        <div class="glass-panel border-t border-theme border-l-0 border-r-0 border-b-0 pt-3 pb-6 px-8 flex justify-between items-center rounded-b-[2.1rem] relative z-10" style="background: var(--nav-glass);">
          <svg class="w-5 h-5 text-theme-muted hover:text-theme transition-colors cursor-pointer" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path></svg>
          <div class="relative">
            <svg class="w-5 h-5 text-brand-300" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M3 3a1 1 0 000 2v8a2 2 0 002 2h2.586l-1.293 1.293a1 1 0 101.414 1.414L10 15.414l2.293 2.293a1 1 0 001.414-1.414L12.414 15H15a2 2 0 002-2V5a1 1 0 100-2H3zm11.707 4.707a1 1 0 00-1.414-1.414L10 9.586 8.707 8.293a1 1 0 00-1.414 0l-2 2a1 1 0 101.414 1.414L8 10.414l1.293 1.293a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path></svg>
          </div>
          <svg class="w-5 h-5 text-theme-muted hover:text-theme transition-colors cursor-pointer" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
          <svg class="w-5 h-5 text-theme-muted hover:text-theme transition-colors cursor-pointer" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
        </div>
      </div>
      ` : ''}
    </div>
  `;
}
