window.ConsicaElements = window.ConsicaElements || {};

window.ConsicaElements.aiPreview = function (layout) {
  const isMobile = layout === 'mobile';
  const base = window.CONSICA_BASE || '';

  return `
    <div class="ai-preview-wrapper relative group flex items-center justify-center w-full ${isMobile ? 'scale-[0.43] my-[-150px]' : 'scale-[0.7] lg:scale-[0.8] xl:scale-[0.85]'} origin-center">
      <div class="w-[860px] h-[540px] glass-panel bg-section-tint rounded-2xl shadow-2xl overflow-hidden border border-theme relative flex flex-col shrink-0 transition-transform duration-500 hover:-translate-y-2 font-sans">
        
        <!-- Browser Header -->
        <div class="h-10 bg-section-tint border-b border-theme px-4 flex items-center justify-between shrink-0">
          <div class="flex items-center gap-1.5">
            <div class="w-3 h-3 rounded-full bg-[#FF5F57]"></div>
            <div class="w-3 h-3 rounded-full bg-[#FFBD2E]"></div>
            <div class="w-3 h-3 rounded-full bg-[#28C840]"></div>
          </div>
          <div class="flex items-center gap-2">
            <img src="${base}assets/images/logow.png" class="h-3.5 theme-show-dark opacity-85" alt="">
            <img src="${base}assets/images/logob.png" class="h-3.5 theme-show-light opacity-85" alt="">
            <span class="text-[11px] font-bold tracking-widest text-theme-muted uppercase">Consica AI System</span>
          </div>
          <div class="w-12"></div> <!-- Spacer -->
        </div>

        <!-- Main Content Area -->
        <div class="flex-1 relative overflow-hidden flex flex-col items-center" style="background: linear-gradient(to bottom, var(--surface-dark), var(--surface-darker));">
          <!-- Grid Background Effect -->
          <div class="absolute inset-0 opacity-10 dark:opacity-20 pointer-events-none" style="background-image: radial-gradient(circle at center, #1E3A8A 1px, transparent 1px); background-size: 24px 24px;"></div>
          
          <!-- Top Navbar -->
          <div class="w-full px-8 py-5 flex justify-between items-center relative z-10">
            <div class="flex items-center gap-2">
              <div class="w-6 h-6 rounded-full bg-gradient-to-br from-[#00C2FF] to-[#0055FF] flex items-center justify-center text-white">
                <svg class="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clip-rule="evenodd"></path></svg>
              </div>
              <span class="text-theme font-bold text-lg tracking-tight">Consica AI</span>
            </div>
            
            <div class="flex items-center gap-8 text-sm font-medium text-theme-soft">
              <span class="hover:text-theme cursor-pointer transition-colors">Features</span>
              <span class="hover:text-theme cursor-pointer transition-colors">Pricing</span>
              <span class="hover:text-theme cursor-pointer transition-colors">Resources</span>
              <span class="hover:text-theme cursor-pointer transition-colors">About</span>
            </div>
            
            <button class="bg-[#0959C8] hover:bg-[#0747A3] text-white px-5 py-2 rounded-lg text-sm font-bold shadow-[0_0_15px_rgba(9,89,200,0.3)] transition-all">Get started</button>
          </div>

          <!-- Hero Section -->
          <div class="flex flex-col items-center text-center mt-8 relative z-10 px-6">
            <h1 class="text-[42px] leading-[1.1] font-bold text-theme tracking-tight">Your AI assistant for<br>smarter productivity.</h1>
            <p class="text-theme-muted text-sm mt-5 max-w-lg leading-relaxed">Harness the power of AI to automate tasks, streamline workflows, and boost your team's efficiency — all in one simple platform.</p>
            
            <div class="flex items-center gap-4 mt-8">
              <button class="bg-gradient-to-b from-[#00A3FF] to-[#0055FF] text-white px-6 py-2.5 rounded-lg text-sm font-bold shadow-[0_0_30px_rgba(0,163,255,0.4)] hover:shadow-[0_0_40px_rgba(0,163,255,0.6)] transition-all">Get started</button>
              <button class="bg-section-tint border border-theme text-theme px-5 py-2.5 rounded-lg text-sm font-medium flex items-center gap-2 hover:bg-section-tint-hover transition-colors shadow-lg">
                <span class="w-4 h-4 rounded-full border border-theme flex items-center justify-center shrink-0">
                  <span class="w-1.5 h-1.5 bg-theme rounded-full"></span>
                </span>
                See It in Action
              </button>
            </div>
          </div>

          <!-- Networking Core Area -->
          <div class="w-full flex-1 mt-6 relative flex items-center justify-center pointer-events-none">
            
            <!-- Connection Lines -->
            <svg class="absolute inset-0 w-full h-full" style="z-index: 1;">
              <!-- Left Lines -->
              <path d="M430,150 L310,150 L310,95 L250,95" fill="none" stroke="rgba(0, 194, 255, 0.4)" stroke-width="2" />
              <path d="M430,150 L310,150 L310,205 L250,205" fill="none" stroke="rgba(0, 194, 255, 0.4)" stroke-width="2" />
              <!-- Right Lines -->
              <path d="M430,150 L550,150 L550,95 L610,95" fill="none" stroke="rgba(0, 194, 255, 0.4)" stroke-width="2" />
              <path d="M430,150 L550,150 L550,205 L610,205" fill="none" stroke="rgba(0, 194, 255, 0.4)" stroke-width="2" />
              
              <!-- Glowing Nodes -->
              <circle cx="250" cy="95" r="3" fill="#00C2FF" filter="drop-shadow(0 0 4px #00C2FF)" />
              <circle cx="250" cy="205" r="3" fill="#00C2FF" filter="drop-shadow(0 0 4px #00C2FF)" />
              <circle cx="610" cy="95" r="3" fill="#00C2FF" filter="drop-shadow(0 0 4px #00C2FF)" />
              <circle cx="610" cy="205" r="3" fill="#00C2FF" filter="drop-shadow(0 0 4px #00C2FF)" />
            </svg>

            <!-- Central Orb -->
            <div class="absolute top-[44%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-40 h-40 rounded-full z-10 flex items-center justify-center">
              <div class="absolute inset-0 bg-[#0055FF] rounded-full blur-[35px] opacity-30 dark:opacity-40 animate-pulse"></div>
              
              <!-- Outer faint ring -->
              <div class="w-36 h-36 rounded-full border border-[#00C2FF]/10 absolute animate-[spin_20s_linear_infinite]">
                 <div class="absolute top-0 left-1/2 w-full h-full border-t-2 border-[#00C2FF]/30 rounded-full -translate-x-1/2 blur-[2px]"></div>
              </div>

              <div class="w-30 h-30 rounded-full border border-[#00C2FF]/30 relative animate-[spin_10s_linear_infinite]">
                <div class="absolute top-0 left-1/2 w-full h-full border-t-2 border-[#00C2FF] rounded-full -translate-x-1/2 blur-[1px]"></div>
              </div>
              <div class="w-30 h-30 rounded-full border border-[#0055FF]/40 absolute animate-[spin_15s_linear_infinite_reverse] rotate-45">
                <div class="absolute bottom-0 right-0 w-full h-full border-b-2 border-[#00C2FF] rounded-full blur-[1px]"></div>
              </div>
              <div class="w-24 h-24 bg-gradient-to-br from-[#00C2FF]/80 to-[#0055FF] rounded-full absolute shadow-[0_0_40px_rgba(0,194,255,0.8)] flex items-center justify-center overflow-hidden">
                <div class="w-full h-full absolute inset-0 bg-white/10 mix-blend-overlay animate-pulse"></div>
                <!-- Inner swirling details -->
                <div class="w-full h-full absolute flex items-center justify-center animate-[spin_8s_linear_infinite]">
                  <div class="w-26 h-8 border-[1.5px] border-white/40 rounded-[100%] absolute rotate-[-30deg]"></div>
                  <div class="w-26 h-8 border border-white/20 rounded-[100%] absolute rotate-[30deg]"></div>
                  <div class="w-26 h-8 border border-[#00C2FF]/50 rounded-[100%] absolute rotate-[90deg]"></div>
                </div>
                <!-- Central bright core -->
                <div class="w-5 h-5 bg-white rounded-full absolute blur-[4px] opacity-80 animate-pulse"></div>
              </div>
            </div>            <!-- Left Panels -->
            <div class="absolute left-6 top-0 flex flex-col gap-6 z-20 w-[220px]">
              <!-- Task Lists -->
              <div class="glass-panel bg-section-tint border border-theme rounded-xl p-4 shadow-lg backdrop-blur-md relative overflow-hidden">
                <!-- Top glow line -->
                <div class="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-[#00C2FF]/50 to-transparent"></div>
                <h3 class="text-theme text-xs font-bold mb-3">Task Lists</h3>
                <div class="flex flex-col gap-2">
                  <div class="flex gap-2">
                    <div class="bg-[#1E3A8A]/15 dark:bg-[#1E3A8A]/40 border border-[#1E3A8A]/30 dark:border-[#1E3A8A] text-theme-soft text-[9px] px-2.5 py-1.5 rounded-full flex items-center gap-1.5 whitespace-nowrap">
                      Draft client proposal
                    </div>
                    <div class="bg-[#0055FF] text-white text-[9px] px-2.5 py-1.5 rounded-full flex items-center gap-1.5 font-medium whitespace-nowrap shadow-[0_0_10px_rgba(0,85,255,0.4)]">
                      <svg class="w-2.5 h-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7"></path></svg>
                      Update...
                    </div>
                  </div>
                  <div class="flex gap-2">
                    <div class="bg-section-tint border border-theme text-theme-muted text-[9px] px-2.5 py-1.5 rounded-full flex items-center gap-1.5 whitespace-nowrap">
                      Analytics report
                    </div>
                    <div class="bg-[#0055FF] text-white text-[9px] px-2.5 py-1.5 rounded-full flex items-center gap-1.5 font-medium whitespace-nowrap shadow-[0_0_10px_rgba(0,85,255,0.4)]">
                      <svg class="w-2.5 h-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7"></path></svg>
                      Schedule team m...
                    </div>
                  </div>
                </div>
              </div>
              
              <!-- Workflows -->
              <div class="glass-panel bg-section-tint border border-theme rounded-xl p-4 shadow-lg backdrop-blur-md relative overflow-hidden">
                <!-- Bottom glow line -->
                <div class="absolute bottom-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-[#00C2FF]/50 to-transparent"></div>
                <h3 class="text-theme text-xs font-bold mb-3">Workflows</h3>
                <div class="flex flex-col relative pl-4">
                  <!-- timeline line -->
                  <div class="absolute left-1.5 top-2 bottom-6 w-px bg-[#1E3A8A]"></div>
                  
                  <div class="flex items-center gap-2 mb-2 relative">
                    <div class="absolute -left-[11px] w-2.5 h-2.5 rounded-full bg-[#00C2FF] border-[3px] border-[#050B14] dark:border-[#050B14] shadow-[0_0_8px_rgba(0,194,255,0.8)]"></div>
                    <span class="text-theme-soft text-[10px] font-medium">Draft client proposal</span>
                  </div>
                  <div class="flex items-center gap-2 mb-3 relative opacity-50">
                    <div class="absolute -left-[10px] w-2 h-2 rounded-full border border-theme bg-[#050B14]"></div>
                    <span class="text-theme-muted text-[10px]">Manager review & approval</span>
                  </div>
                  <div class="bg-section-tint border border-theme text-theme-muted text-[9px] px-2.5 py-1.5 rounded text-left relative overflow-hidden">
                    Create a workflow to publish a...
                    <!-- Fake cursor pointer -->
                    <div class="absolute right-2 top-1/2 -translate-y-1/2 w-3 h-3 text-theme">
                      <svg viewBox="0 0 24 24" fill="currentColor"><path d="M7 2l12 11.2-5.8.5 3.3 7.3-2.2 1-3.2-7.4-4.4 4.5z"/></svg>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Right Panels -->
            <div class="absolute right-6 top-0 flex flex-col gap-6 z-20 w-[220px]">
              <!-- Analytics -->
              <div class="glass-panel bg-section-tint border border-theme rounded-xl p-4 shadow-lg backdrop-blur-md relative overflow-hidden">
                <!-- Top glow line -->
                <div class="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-[#00C2FF]/50 to-transparent"></div>
                <div class="flex justify-between items-center mb-3">
                  <h3 class="text-theme text-xs font-bold">Analytics</h3>
                  <div class="bg-[#10B981]/10 text-[#10B981] border border-[#10B981]/20 text-[7px] font-bold px-1.5 py-0.5 rounded flex items-center gap-0.5">
                    ↑ 60% <span class="text-theme-muted font-normal">from last month</span>
                  </div>
                </div>
                <!-- Chart -->
                <div class="flex items-end gap-2 h-12 mt-2 border-l border-b border-theme pb-1 pl-1 relative">
                  <!-- Axis labels fake -->
                  <div class="absolute -left-4 top-0 flex flex-col justify-between h-full text-[6px] text-theme-faint leading-none">
                    <span>100%</span><span>60%</span><span>40%</span><span>0%</span>
                  </div>
                  <!-- Bars -->
                  <div class="w-5 bg-gradient-to-t from-[#0055FF]/20 to-[#00C2FF]/40 rounded-t-sm h-[30%] ml-2"></div>
                  <div class="w-5 bg-gradient-to-t from-[#0055FF]/40 to-[#00C2FF]/60 rounded-t-sm h-[40%]"></div>
                  <div class="w-5 bg-gradient-to-t from-[#0055FF]/60 to-[#00C2FF]/80 rounded-t-sm h-[60%]"></div>
                  <div class="w-5 bg-gradient-to-t from-[#0055FF]/80 to-[#00C2FF] rounded-t-sm h-[100%] shadow-[0_0_10px_rgba(0,194,255,0.5)]"></div>
                  <div class="w-5 bg-gradient-to-t from-[#0055FF]/60 to-[#00C2FF]/80 rounded-t-sm h-[70%]"></div>
                </div>
                <!-- X axis labels -->
                <div class="flex justify-between text-[6px] text-theme-faint mt-1 pl-3 w-full">
                  <span>Apr</span><span>May</span><span>Jun</span><span>Jul</span><span>Aug</span>
                </div>
              </div>
              
              <!-- Insights -->
              <div class="glass-panel bg-section-tint border border-theme rounded-xl p-4 shadow-lg backdrop-blur-md relative overflow-hidden">
                <!-- Bottom glow line -->
                <div class="absolute bottom-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-[#00C2FF]/50 to-transparent"></div>
                <h3 class="text-theme text-xs font-bold mb-3">Insights</h3>
                <div class="flex flex-col gap-2">
                  <div class="bg-[#1E3A8A]/15 dark:bg-[#1E3A8A]/30 border border-[#1E3A8A]/30 dark:border-[#1E3A8A] text-theme-soft text-[9px] px-2.5 py-2 rounded flex items-center justify-between">
                    <span>Automate weekly reports</span>
                    <svg class="w-3 h-3 text-[#00C2FF]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path></svg>
                  </div>
                  <div class="flex gap-2 mt-1">
                    <div class="bg-section-tint border border-theme text-theme-muted text-[9px] px-2.5 py-1.5 rounded-full flex items-center gap-1.5 whitespace-nowrap">
                      Activity trend
                    </div>
                    <div class="bg-[#0055FF] text-white text-[9px] px-2.5 py-1.5 rounded-full flex items-center gap-1.5 font-medium whitespace-nowrap shadow-[0_0_10px_rgba(0,85,255,0.4)]">
                      <svg class="w-2.5 h-2.5" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clip-rule="evenodd"></path></svg>
                      Focus on top p...
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
};
