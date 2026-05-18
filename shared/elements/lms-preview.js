window.ConsicaElements = window.ConsicaElements || {};

window.ConsicaElements.lmsPreview = function (layout) {
  const isMobile = layout === 'mobile';
  const base = window.CONSICA_BASE || '';

  return `
    <div class="lms-preview-wrapper relative group flex items-center justify-center w-full ${isMobile ? 'scale-[0.43] my-[-150px]' : 'scale-[0.7] lg:scale-[0.8] xl:scale-[0.85]'} origin-center">
      <div class="w-[860px] h-[540px] glass-panel bg-section-tint rounded-2xl shadow-2xl overflow-hidden border border-theme relative flex shrink-0 transition-transform duration-500 hover:-translate-y-2">
        <!-- Sidebar -->
        <div class="w-[72px] bg-[#635BFF] flex flex-col items-center py-6 shrink-0 relative z-20 shadow-[4px_0_24px_rgba(99,91,255,0.2)]">
          <!-- Logo -->
          <div class="w-10 h-8 text-white mb-10">
            <svg viewBox="0 0 24 24" fill="currentColor"><path d="M19.35 10.04C18.67 6.59 15.64 4 12 4 9.11 4 6.6 5.64 5.36 8.04 2.34 8.36 0 10.91 0 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96z"/></svg>
          </div>
          <!-- Icons -->
          <div class="flex flex-col gap-6 text-white/50 w-full items-center">
            <div class="w-full flex justify-center py-2 relative text-white">
              <div class="absolute left-0 top-0 bottom-0 w-1 bg-white rounded-r-md"></div>
              <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"></path></svg>
            </div>
            <!-- more icons -->
            <svg class="w-5 h-5 hover:text-white transition-colors cursor-pointer" fill="currentColor" viewBox="0 0 20 20"><path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z"/><path fill-rule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clip-rule="evenodd"/></svg>
            <svg class="w-5 h-5 hover:text-white transition-colors cursor-pointer" fill="currentColor" viewBox="0 0 20 20"><path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z"/></svg>
            <svg class="w-5 h-5 hover:text-white transition-colors cursor-pointer" fill="currentColor" viewBox="0 0 20 20"><path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z"/><path fill-rule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm9.707 5.707a1 1 0 00-1.414-1.414L9 12.586l-1.293-1.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/></svg>
            <svg class="w-5 h-5 hover:text-white transition-colors cursor-pointer" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clip-rule="evenodd"/></svg>
            <svg class="w-5 h-5 hover:text-white transition-colors cursor-pointer" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M3 3a1 1 0 000 2v8a2 2 0 002 2h2.586l-1.293 1.293a1 1 0 101.414 1.414L10 15.414l2.293 2.293a1 1 0 001.414-1.414L12.414 15H15a2 2 0 002-2V5a1 1 0 100-2H3zm11.707 4.707a1 1 0 00-1.414-1.414L10 9.586 8.707 8.293a1 1 0 00-1.414 0l-2 2a1 1 0 101.414 1.414L8 10.414l1.293 1.293a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/></svg>
            <svg class="w-5 h-5 hover:text-white transition-colors cursor-pointer" fill="currentColor" viewBox="0 0 20 20"><path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z"/></svg>
            <svg class="w-5 h-5 hover:text-white transition-colors cursor-pointer" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clip-rule="evenodd"/></svg>
          </div>
          <!-- Profile Bottom -->
          <div class="mt-auto flex flex-col gap-4 items-center w-full relative">
            <!-- Profile pic -->
            <div class="w-8 h-8 rounded-full bg-surface-darker overflow-hidden flex items-center justify-center p-0.5 shadow-sm border border-theme">
              <span class="text-xl leading-none">👨‍💼</span>
            </div>
            <svg class="w-5 h-5 text-white/50 hover:text-white transition-colors cursor-pointer" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path></svg>
          </div>
        </div>

        <!-- Main Content area -->
        <div class="flex-1 bg-transparent p-6 flex flex-col gap-5 relative overflow-hidden">
          
          <!-- Top Header -->
          <div class="flex justify-between items-center z-10">
            <div class="flex items-center gap-4">
              <h1 class="text-xl font-bold text-theme">Dashboard</h1>
              <div class="flex items-center gap-2 border-l border-theme pl-4">
                <img src="${base}assets/images/logow.png" class="h-4 theme-show-dark opacity-80" alt="">
                <img src="${base}assets/images/logob.png" class="h-4 theme-show-light opacity-80" alt="">
                <span class="text-[11px] font-bold tracking-widest text-theme-muted uppercase">Consica IMS</span>
              </div>
            </div>
            <div class="flex gap-3">
              <div class="glass-panel bg-section-tint px-3 py-1.5 rounded-lg border border-theme text-[10px] text-theme-muted font-medium flex items-center gap-2 cursor-pointer shadow-sm hover:bg-theme-faint">
                10-06-2020 
                <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path></svg>
              </div>
              <div class="glass-panel bg-section-tint px-3 py-1.5 rounded-lg border border-theme text-[10px] text-theme-muted font-medium flex items-center gap-2 cursor-pointer shadow-sm hover:bg-theme-faint">
                10-10-2020 
                <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path></svg>
              </div>
            </div>
          </div>

          <!-- 4 Top Cards -->
          <div class="grid grid-cols-4 gap-4 z-10">
            <!-- Card 1 -->
            <div class="bg-gradient-to-r from-[#A575F8] to-[#9255FD] rounded-[14px] p-3 text-white flex items-center gap-3 shadow-[0_8px_20px_rgba(146,85,253,0.3)] hover:-translate-y-1 transition-transform cursor-pointer">
              <div class="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm shrink-0">
                <svg class="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clip-rule="evenodd"></path></svg>
              </div>
              <div>
                <p class="text-sm font-bold">178+</p>
                <p class="text-[8px] text-white/80 font-medium tracking-wide uppercase">Save Products</p>
              </div>
            </div>
            <!-- Card 2 -->
            <div class="bg-gradient-to-r from-[#3B82F6] to-[#2563EB] rounded-[14px] p-3 text-white flex items-center gap-3 shadow-[0_8px_20px_rgba(37,99,235,0.3)] hover:-translate-y-1 transition-transform cursor-pointer">
              <div class="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm shrink-0">
                <svg class="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M5 4v3H4a2 2 0 00-2 2v3a2 2 0 002 2h1v2a2 2 0 002 2h6a2 2 0 002-2v-2h1a2 2 0 002-2V9a2 2 0 00-2-2h-1V4a2 2 0 00-2-2H7a2 2 0 00-2 2zm8 0H7v3h6V4zm0 8H7v4h6v-4z" clip-rule="evenodd"></path></svg>
              </div>
              <div>
                <p class="text-sm font-bold">20+</p>
                <p class="text-[8px] text-white/80 font-medium tracking-wide uppercase">Stock Products</p>
              </div>
            </div>
            <!-- Card 3 -->
            <div class="bg-gradient-to-r from-[#FF6B6B] to-[#FF4B4B] rounded-[14px] p-3 text-white flex items-center gap-3 shadow-[0_8px_20px_rgba(255,107,107,0.3)] hover:-translate-y-1 transition-transform cursor-pointer">
              <div class="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm shrink-0">
                <svg class="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M10 2a4 4 0 00-4 4v1H5a1 1 0 00-.994.89l-1 9A1 1 0 004 18h12a1 1 0 00.994-1.11l-1-9A1 1 0 0015 7h-1V6a4 4 0 00-4-4zm2 5V6a2 2 0 10-4 0v1h4zm-6 3a1 1 0 112 0 1 1 0 01-2 0zm7-1a1 1 0 100 2 1 1 0 000-2z" clip-rule="evenodd"></path></svg>
              </div>
              <div>
                <p class="text-sm font-bold">190+</p>
                <p class="text-[8px] text-white/80 font-medium tracking-wide uppercase">Sales Products</p>
              </div>
            </div>
            <!-- Card 4 -->
            <div class="bg-gradient-to-r from-[#FFB347] to-[#FF9800] rounded-[14px] p-3 text-white flex items-center gap-3 shadow-[0_8px_20px_rgba(255,152,0,0.3)] hover:-translate-y-1 transition-transform cursor-pointer">
              <div class="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm shrink-0">
                <svg class="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M6 6V5a3 3 0 013-3h2a3 3 0 013 3v1h2a2 2 0 012 2v3.57A22.952 22.952 0 0110 13a22.95 22.95 0 01-8-1.43V8a2 2 0 012-2h2zm2-1a1 1 0 011-1h2a1 1 0 011 1v1H8V5zm1 5a1 1 0 011-1h.01a1 1 0 110 2H10a1 1 0 01-1-1z" clip-rule="evenodd"></path><path d="M2 13.692V16a2 2 0 002 2h12a2 2 0 002-2v-2.308A24.974 24.974 0 0110 15c-2.796 0-5.487-.46-8-1.308z"></path></svg>
              </div>
              <div>
                <p class="text-sm font-bold">12+</p>
                <p class="text-[8px] text-white/80 font-medium tracking-wide uppercase">Job Application</p>
              </div>
            </div>
          </div>

          <!-- Middle Row -->
          <div class="flex gap-4 h-[180px] z-10">
            <!-- Left Chart -->
            <div class="flex-[2] glass-panel bg-section-tint rounded-xl border border-theme p-4 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow relative overflow-hidden">
              <div class="flex justify-between items-start z-10 relative">
                <div>
                  <h3 class="text-xs font-bold text-theme leading-tight">Dashboard</h3>
                  <p class="text-[9px] text-theme-muted">Overview of latest Month</p>
                </div>
                <div class="flex gap-2 text-[8px] font-bold">
                  <span class="text-theme-muted hover:text-theme cursor-pointer transition-colors">DAILY</span>
                  <span class="text-theme-muted hover:text-theme cursor-pointer transition-colors">WEEKLY</span>
                  <span class="text-[#00C2FF] border-b-2 border-[#00C2FF] pb-0.5">MONTHLY</span>
                  <span class="text-theme-muted hover:text-theme cursor-pointer transition-colors">YEARLY</span>
                </div>
                <div class="flex gap-2 text-[8px] text-theme-muted">
                  <div class="flex items-center gap-1"><span class="w-1.5 h-1.5 rounded-full bg-[#10B981]"></span> Online</div>
                  <div class="flex items-center gap-1"><span class="w-1.5 h-1.5 rounded-full bg-[#F59E0B]"></span> Store</div>
                </div>
              </div>

              <!-- Main Graph Stats -->
              <div class="flex z-10 relative h-full mt-2">
                <div class="w-[120px] flex flex-col justify-center gap-3 border-r border-theme/50 pr-3">
                  <div>
                    <h2 class="text-xl font-bold text-theme leading-none">$6468.96</h2>
                    <p class="text-[8px] text-theme-muted">Current Month Earnings</p>
                  </div>
                  <div>
                    <h2 class="text-lg font-bold text-theme leading-none">82</h2>
                    <p class="text-[8px] text-theme-muted">Current Month Sales</p>
                  </div>
                  <button class="bg-[#635BFF] text-white text-[9px] font-bold py-1.5 px-3 rounded-full shadow-md hover:bg-[#5249ea] w-max transition-colors">Last Month Summary</button>
                </div>
                
                <!-- The Chart -->
                <div class="flex-1 relative pl-3 flex flex-col h-full pt-1">
                  <!-- Chart Grid -->
                  <div class="absolute inset-0 pl-3 flex flex-col justify-between opacity-20 pointer-events-none">
                     <div class="border-b border-theme border-dashed w-full"></div>
                     <div class="border-b border-theme border-dashed w-full"></div>
                     <div class="border-b border-theme border-dashed w-full"></div>
                     <div class="border-b border-theme border-dashed w-full"></div>
                     <div class="border-b border-theme border-dashed w-full"></div>
                  </div>
                  <!-- Y Axis -->
                  <div class="absolute left-0 top-0 bottom-6 flex flex-col justify-between text-[7px] text-theme-muted font-medium w-4 items-end pr-1">
                    <span>35</span><span>30</span><span>20</span><span>15</span><span>10</span><span>05</span><span>00</span>
                  </div>
                  
                  <!-- SVG Graph Lines -->
                  <div class="absolute inset-y-0 right-0 left-5 bottom-6 pointer-events-none">
                     <svg class="w-full h-full" viewBox="0 0 200 100" preserveAspectRatio="none">
                       <!-- Gradient Fills -->
                       <defs>
                         <linearGradient id="fill1" x1="0" y1="0" x2="0" y2="1">
                           <stop offset="0%" stop-color="#9255FD" stop-opacity="0.3" />
                           <stop offset="100%" stop-color="#9255FD" stop-opacity="0" />
                         </linearGradient>
                         <linearGradient id="fill2" x1="0" y1="0" x2="0" y2="1">
                           <stop offset="0%" stop-color="#F59E0B" stop-opacity="0.2" />
                           <stop offset="100%" stop-color="#F59E0B" stop-opacity="0" />
                         </linearGradient>
                       </defs>
                       
                       <!-- Line 2 (Orange) -->
                       <path d="M0,80 Q10,70 20,60 T40,65 T60,40 T80,55 T100,50 T120,40 T140,55 T160,50 T180,45 T200,60 L200,100 L0,100 Z" fill="url(#fill2)"/>
                       <path d="M0,80 Q10,70 20,60 T40,65 T60,40 T80,55 T100,50 T120,40 T140,55 T160,50 T180,45 T200,60" fill="none" stroke="#F59E0B" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                       
                       <!-- Line 1 (Purple) -->
                       <path d="M0,90 Q15,60 30,50 T60,80 T90,70 T120,70 T150,30 T180,20 T200,70 L200,100 L0,100 Z" fill="url(#fill1)"/>
                       <path d="M0,90 Q15,60 30,50 T60,80 T90,70 T120,70 T150,30 T180,20 T200,70" fill="none" stroke="#9255FD" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                       
                       <!-- Points -->
                       <circle cx="90" cy="70" r="2.5" fill="currentColor" class="text-theme" stroke="#9255FD" stroke-width="1.5"/>
                     </svg>
                  </div>

                  <!-- X Axis -->
                  <div class="absolute bottom-0 left-5 right-0 flex justify-between text-[7px] text-theme-muted font-medium pt-1">
                    <span>Jan</span><span>Feb</span><span>Feb</span><span>Mar</span><span>Apr</span><span>May</span>
                  </div>
                </div>
              </div>
              
              <!-- Footer Row -->
              <div class="mt-2 pt-2 border-t border-theme/50 flex justify-between items-center z-10 relative">
                <div class="flex items-center gap-2">
                  <div class="w-6 h-6 rounded-full bg-rose-500/10 flex items-center justify-center text-rose-500"><svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"></path></svg></div>
                  <div><p class="text-[8px] text-theme-muted">Wallet Balance</p><p class="text-[10px] font-bold text-theme">$3,567.80</p></div>
                </div>
                <div class="flex items-center gap-2">
                  <div class="w-6 h-6 rounded-full bg-purple-500/10 flex items-center justify-center text-[#9255FD]"><svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg></div>
                  <div><p class="text-[8px] text-theme-muted">Referral Earning</p><p class="text-[10px] font-bold text-theme">$1589.53</p></div>
                </div>
                <div class="flex items-center gap-2">
                  <div class="w-6 h-6 rounded-full bg-blue-500/10 flex items-center justify-center text-[#3B82F6]"><svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path></svg></div>
                  <div><p class="text-[8px] text-theme-muted">Estimate Sales</p><p class="text-[10px] font-bold text-theme">$2651.50</p></div>
                </div>
                <div class="flex items-center gap-2">
                  <div class="w-6 h-6 rounded-full bg-[#00C2FF]/10 flex items-center justify-center text-[#00C2FF]"><svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z"></path></svg></div>
                  <div><p class="text-[8px] text-theme-muted">Earning</p><p class="text-[10px] font-bold text-theme">$53,567.54</p></div>
                </div>
              </div>
            </div>

            <!-- Right Chart -->
            <div class="flex-1 glass-panel bg-section-tint rounded-xl border border-theme p-4 shadow-sm flex flex-col items-center hover:shadow-md transition-shadow">
              <div class="flex justify-between items-center w-full mb-2">
                <h3 class="text-xs font-bold text-theme">Analytics</h3>
                <svg class="w-4 h-4 text-theme-muted cursor-pointer" fill="currentColor" viewBox="0 0 20 20"><path d="M6 10a2 2 0 11-4 0 2 2 0 014 0zM12 10a2 2 0 11-4 0 2 2 0 014 0zM16 12a2 2 0 100-4 2 2 0 000 4z"/></svg>
              </div>
              
              <!-- Donut Chart -->
              <div class="relative w-28 h-28 flex items-center justify-center my-auto">
                <svg viewBox="0 0 36 36" class="w-full h-full -rotate-90 drop-shadow-md">
                  <path class="text-theme-muted opacity-10" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" stroke-width="4"></path>
                  <path class="text-[#FFB347]" stroke-dasharray="100, 100" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" stroke-width="4" stroke-linecap="round"></path>
                  <path class="text-[#FF6B6B]" stroke-dasharray="65, 100" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" stroke-width="4" stroke-linecap="round"></path>
                  <path class="text-[#635BFF]" stroke-dasharray="35, 100" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" stroke-width="4" stroke-linecap="round"></path>
                </svg>
                <div class="absolute inset-0 flex flex-col items-center justify-center">
                  <span class="text-xl font-bold text-theme leading-none">80%</span>
                  <span class="text-[7px] text-theme-muted">Transactions</span>
                </div>
              </div>

              <!-- Legends -->
              <div class="flex gap-3 text-[8px] font-bold text-theme-muted mt-auto">
                <div class="flex items-center gap-1"><span class="w-1.5 h-1.5 rounded bg-[#635BFF]"></span> Sale</div>
                <div class="flex items-center gap-1"><span class="w-1.5 h-1.5 rounded bg-[#FFB347]"></span> Distribute</div>
                <div class="flex items-center gap-1"><span class="w-1.5 h-1.5 rounded bg-[#FF6B6B]"></span> Return</div>
              </div>
            </div>
          </div>

          <!-- Bottom Row -->
          <div class="flex gap-4 flex-1 z-10 min-h-0">
            <!-- Recent Activities -->
            <div class="w-[240px] glass-panel bg-section-tint rounded-xl border border-theme p-4 shadow-sm flex flex-col hover:shadow-md transition-shadow min-h-0 cursor-pointer">
              <h3 class="text-xs font-bold text-theme mb-3 shrink-0">Recent Activities</h3>
              
              <div class="flex-1 overflow-hidden scrollbar-none">
                <div class="space-y-4 animate-scroll-lms-activities">
                  <div class="flex items-start gap-3">
                    <span class="text-[8px] text-theme-muted w-[40px] shrink-0 pt-1 text-right">40 Mins Ago</span>
                    <div class="w-6 h-6 rounded-full bg-rose-500/10 flex items-center justify-center text-rose-500 shrink-0"><svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg></div>
                    <div>
                      <h4 class="text-[10px] font-bold text-theme">Task Updated</h4>
                      <p class="text-[8px] text-theme-muted">Nikolai Updated a Task</p>
                    </div>
                  </div>
                  
                  <div class="flex items-start gap-3 relative">
                    <div class="absolute left-[54px] top-[-10px] bottom-[20px] w-px bg-theme-muted/20"></div>
                    <span class="text-[8px] text-theme-muted w-[40px] shrink-0 pt-1 text-right">1 day ago</span>
                    <div class="w-6 h-6 rounded-full bg-purple-500/10 flex items-center justify-center text-[#9255FD] shrink-0 relative z-10"><svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg></div>
                    <div>
                      <h4 class="text-[10px] font-bold text-theme">Deal Added</h4>
                      <p class="text-[8px] text-theme-muted">Panshi Updated a Task</p>
                    </div>
                  </div>

                  <div class="flex items-start gap-3 relative">
                    <div class="absolute left-[54px] top-[-10px] bottom-[20px] w-px bg-theme-muted/20"></div>
                    <span class="text-[8px] text-theme-muted w-[40px] shrink-0 pt-1 text-right">40 Mins Ago</span>
                    <div class="w-6 h-6 rounded-full bg-[#00C2FF]/10 flex items-center justify-center text-[#00C2FF] shrink-0 relative z-10"><svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg></div>
                    <div>
                      <h4 class="text-[10px] font-bold text-theme">Published Article</h4>
                      <p class="text-[8px] text-theme-muted">Sanshi Updated a Article</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Order Status Table -->
            <div class="flex-1 glass-panel bg-section-tint rounded-xl border border-theme p-4 shadow-sm flex flex-col hover:shadow-md transition-shadow min-h-0">
              <div class="flex justify-between items-start mb-3 shrink-0">
                <div>
                  <h3 class="text-xs font-bold text-theme leading-tight">Order Status</h3>
                  <p class="text-[8px] text-theme-muted">Overview of latest month</p>
                </div>
                <div class="flex gap-2">
                  <button class="bg-[#FF6B6B] text-white text-[9px] font-bold py-1 px-3 rounded-md flex items-center gap-1 shadow-sm hover:bg-red-500 transition-colors">
                    <svg class="w-2.5 h-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path></svg> Add
                  </button>
                  <div class="glass-panel bg-section-tint w-6 h-6 rounded-md flex items-center justify-center text-theme-muted hover:text-theme cursor-pointer border border-theme"><svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg></div>
                  <div class="glass-panel bg-section-tint w-6 h-6 rounded-md flex items-center justify-center text-theme-muted hover:text-theme cursor-pointer border border-theme"><svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"></path></svg></div>
                  <div class="glass-panel bg-section-tint border border-theme rounded-md flex items-center px-2 py-0.5 ml-4">
                    <input type="text" placeholder="Search" class="bg-transparent border-none outline-none text-[9px] w-16 text-theme placeholder-theme-muted focus:ring-0">
                    <svg class="w-3 h-3 text-theme-muted cursor-pointer" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                  </div>
                </div>
              </div>

              <!-- Fixed Header Table -->
              <table class="w-full text-[9px] text-left shrink-0 table-fixed">
                <thead class="text-theme-muted font-bold border-b border-theme/50">
                  <tr>
                    <th class="pb-2 w-[18%]">INVOICE</th>
                    <th class="pb-2 w-[28%]">CUSTOMERS</th>
                    <th class="pb-2 w-[18%]">FROM</th>
                    <th class="pb-2 w-[18%]">PRICE</th>
                    <th class="pb-2 text-right w-[20%]">STATUS</th>
                  </tr>
                </thead>
              </table>

              <!-- Scrollable Table Body -->
              <div class="flex-1 overflow-y-auto scrollbar-none min-h-0 relative h-[85px] mt-1 pr-1">
                <div class="animate-scroll-lms-orders">
                  <table class="w-full text-[9px] text-left table-fixed">
                    <tbody class="text-theme font-medium">
                      <tr class="border-b border-theme/20 hover:bg-theme-faint transition-colors cursor-pointer">
                        <td class="py-2.5 w-[18%]">12386</td>
                        <td class="py-2.5 w-[28%]">Charly dues</td>
                        <td class="py-2.5 w-[18%]">Russia</td>
                        <td class="py-2.5 w-[18%]">$2,652</td>
                        <td class="py-2.5 text-right w-[20%]"><span class="bg-[#FF6B6B] text-white px-2 py-0.5 rounded shadow-sm text-[8px] font-bold">Process</span></td>
                      </tr>
                      <tr class="border-b border-theme/20 hover:bg-theme-faint transition-colors cursor-pointer">
                        <td class="py-2.5 w-[18%]">12387</td>
                        <td class="py-2.5 w-[28%]">Sarah Connor</td>
                        <td class="py-2.5 w-[18%]">USA</td>
                        <td class="py-2.5 w-[18%]">$1,850</td>
                        <td class="py-2.5 text-right w-[20%]"><span class="bg-[#9255FD] text-white px-2 py-0.5 rounded shadow-sm text-[8px] font-bold">Open</span></td>
                      </tr>
                      <tr class="border-b border-theme/20 hover:bg-theme-faint transition-colors cursor-pointer">
                        <td class="py-2.5 w-[18%]">12388</td>
                        <td class="py-2.5 w-[28%]">John Doe</td>
                        <td class="py-2.5 w-[18%]">UK</td>
                        <td class="py-2.5 w-[18%]">$3,200</td>
                        <td class="py-2.5 text-right w-[20%]"><span class="bg-emerald-500 text-white px-2 py-0.5 rounded shadow-sm text-[8px] font-bold">Success</span></td>
                      </tr>
                      <tr class="border-b border-theme/20 hover:bg-theme-faint transition-colors cursor-pointer">
                        <td class="py-2.5 w-[18%]">12389</td>
                        <td class="py-2.5 w-[28%]">Elena Rostova</td>
                        <td class="py-2.5 w-[18%]">Spain</td>
                        <td class="py-2.5 w-[18%]">$950</td>
                        <td class="py-2.5 text-right w-[20%]"><span class="bg-[#FF6B6B] text-white px-2 py-0.5 rounded shadow-sm text-[8px] font-bold">Process</span></td>
                      </tr>
                      <tr class="border-b border-theme/20 hover:bg-theme-faint transition-colors cursor-pointer">
                        <td class="py-2.5 w-[18%]">12390</td>
                        <td class="py-2.5 w-[28%]">Marcus Aurel</td>
                        <td class="py-2.5 w-[18%]">Germany</td>
                        <td class="py-2.5 w-[18%]">$4,120</td>
                        <td class="py-2.5 text-right w-[20%]"><span class="bg-[#9255FD] text-white px-2 py-0.5 rounded shadow-sm text-[8px] font-bold">Open</span></td>
                      </tr>
                      <tr class="border-b border-theme/20 hover:bg-theme-faint transition-colors cursor-pointer">
                        <td class="py-2.5 w-[18%]">12391</td>
                        <td class="py-2.5 w-[28%]">Yuki Tanaka</td>
                        <td class="py-2.5 w-[18%]">Japan</td>
                        <td class="py-2.5 w-[18%]">$2,980</td>
                        <td class="py-2.5 text-right w-[20%]"><span class="bg-emerald-500 text-white px-2 py-0.5 rounded shadow-sm text-[8px] font-bold">Success</span></td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
              
              <!-- Pagination -->
              <div class="flex justify-between items-center mt-2 shrink-0">
                <p class="text-[8px] text-theme-muted">Showing 1 to 20 entries</p>
                <div class="flex items-center gap-1 text-[8px] font-bold text-theme-muted">
                  <span class="cursor-pointer hover:text-theme">&lt;</span>
                  <span class="w-4 h-4 rounded-full bg-[#FF6B6B] text-white flex items-center justify-center shadow-sm cursor-pointer">1</span>
                  <span class="cursor-pointer hover:text-theme">2</span>
                  <span class="cursor-pointer hover:text-theme">3</span>
                  <span class="cursor-pointer hover:text-theme">4</span>
                  <span class="cursor-pointer hover:text-theme">5</span>
                  <span class="cursor-pointer hover:text-theme">6</span>
                  <span class="cursor-pointer hover:text-theme">&gt;</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
}
