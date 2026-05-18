window.ConsicaElements = window.ConsicaElements || {};

window.ConsicaElements.enterprisePreview = function (layout) {
  const isMobile = layout === 'mobile';
  const base = window.CONSICA_BASE || '';

  return `
    <div class="enterprise-preview-wrapper relative group flex items-center justify-center w-full ${isMobile ? 'scale-[0.43] my-[-150px]' : 'scale-[0.7] lg:scale-[0.8] xl:scale-[0.85]'} origin-center">
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
            <span class="text-[11px] font-bold tracking-widest text-theme-muted uppercase">Consica Enterprise</span>
          </div>
          <div class="w-12"></div> <!-- Spacer -->
        </div>

        <!-- Inner Layout -->
        <div class="flex-1 flex overflow-hidden text-theme" style="background: var(--glass-bg);">
          
          <!-- Left Sidebar -->
          <div class="w-[170px] border-r border-theme flex flex-col justify-between p-4 shrink-0 bg-section-tint">
            <div>
              <!-- Logo -->
              <div class="flex items-center gap-1.5 mb-8">
                <img src="${base}assets/images/logow.png" class="h-3.5 theme-show-dark opacity-95" alt="">
                <img src="${base}assets/images/logob.png" class="h-3.5 theme-show-light opacity-95" alt="">
                <span class="font-bold text-sm tracking-tight">Consica Enterprise</span>
              </div>

              <!-- Nav Menu -->
              <div class="flex flex-col gap-1">
                <div class="flex items-center gap-2.5 px-3 py-1.5 rounded-xl bg-[#635BFF]/10 dark:bg-[#635BFF]/20 text-[#635BFF] dark:text-[#8D86FF] font-bold text-[11px] cursor-pointer">
                  <span>📊</span> Dashboard
                </div>
                <div class="flex items-center gap-2.5 px-3 py-1.5 rounded-xl hover:bg-section-tint-hover text-theme-soft text-[11px] cursor-pointer transition-colors">
                  <span>👥</span> Recruitment
                </div>
                <div class="flex items-center gap-2.5 px-3 py-1.5 rounded-xl hover:bg-section-tint-hover text-theme-soft text-[11px] cursor-pointer transition-colors">
                  <span>💬</span> Interview
                </div>
                <div class="flex items-center gap-2.5 px-3 py-1.5 rounded-xl hover:bg-section-tint-hover text-theme-soft text-[11px] cursor-pointer transition-colors">
                  <span>🚀</span> Onboarding
                </div>
                <div class="flex items-center gap-2.5 px-3 py-1.5 rounded-xl hover:bg-section-tint-hover text-theme-soft text-[11px] cursor-pointer transition-colors">
                  <span>📝</span> Interview Task
                </div>
                <div class="flex items-center gap-2.5 px-3 py-1.5 rounded-xl hover:bg-section-tint-hover text-theme-soft text-[11px] cursor-pointer transition-colors">
                  <span>📅</span> Appointments
                </div>
                <div class="flex items-center gap-2.5 px-3 py-1.5 rounded-xl hover:bg-section-tint-hover text-theme-soft text-[11px] cursor-pointer transition-colors">
                  <span>🎓</span> Training
                </div>
              </div>
            </div>

            <!-- Logout -->
            <div class="border-t border-theme pt-2 flex items-center justify-between text-[11px] text-theme-muted hover:text-theme cursor-pointer transition-colors font-bold">
              <span>Log Out</span>
              <span>🚪</span>
            </div>
          </div>

          <!-- Middle Content Area -->
          <div class="flex-1 flex flex-col overflow-y-auto p-4 gap-4">
            
            <!-- Search bar & Add button -->
            <div class="flex justify-between items-center shrink-0">
              <div class="relative w-64">
                <input type="text" placeholder="Search something..." class="w-full bg-section-tint border border-theme rounded-xl px-3 py-1.5 text-xs text-theme placeholder-theme-muted focus:outline-none">
                <span class="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-theme-muted">🔍</span>
              </div>
              <button class="bg-[#635BFF] hover:bg-[#5249E0] text-white text-xs font-bold px-4 py-1.5 rounded-xl shadow-[0_0_15px_rgba(99,91,255,0.3)] flex items-center gap-1.5 transition-all">
                Add New <span>▾</span>
              </button>
            </div>

            <!-- Banner Card -->
            <div class="bg-gradient-to-r from-[#635BFF] to-[#3B82F6] rounded-2xl p-4 text-white relative overflow-hidden shrink-0 flex justify-between items-center shadow-md">
              <div class="flex-1 z-10">
                <h2 class="text-lg font-extrabold tracking-tight">Good Morning Sara</h2>
                <p class="text-[10px] opacity-80 mt-1 max-w-[240px] leading-relaxed">You have 75 new applications. It is a lot of work for today! So let's start.</p>
                <button class="bg-white text-[#635BFF] text-[9px] font-black uppercase tracking-wider px-3.5 py-1.5 rounded-xl mt-3 hover:bg-opacity-90 transition-all shadow-sm">Review It</button>
              </div>
              <div class="w-32 h-24 relative flex items-center justify-center z-10 shrink-0">
                <!-- SVG Vector of Woman Working -->
                <svg viewBox="0 0 120 120" class="w-full h-full">
                  <path fill="white" opacity="0.1" d="M60 10c27.6 0 50 22.4 50 50s-22.4 50-50 50S10 87.6 10 60 32.4 10 60 10z"/>
                  <!-- Leaves background -->
                  <path fill="white" opacity="0.2" d="M100 40c0-10-10-10-10 0s10 10 10 0zM90 70c0-8-8-8-8 0s8 8 8 0zM20 50c0-8 8-8 8 0s-8 8-8 0z"/>
                  <!-- Illustration of girl -->
                  <circle cx="65" cy="40" r="12" fill="#FFE5D9"/>
                  <!-- Hair -->
                  <path d="M53 38c0-8 6-12 12-12s12 4 12 12c1 0 3 1 3 3s-2 3-3 3h-21c-1 0-3-1-3-3s2-3 3-3z" fill="#1E293B"/>
                  <!-- Clothes -->
                  <path d="M45 75c0-12 8-20 20-20s20 8 20 20v25H45V75z" fill="#1F2937"/>
                  <!-- Laptop -->
                  <rect x="52" y="65" width="26" height="18" rx="2" fill="#E2E8F0"/>
                  <line x1="52" y1="83" x2="78" y2="83" stroke="#94A3B8" stroke-width="2"/>
                </svg>
              </div>
            </div>

            <!-- "You Need to Hire" Category Cards -->
            <div class="shrink-0 flex flex-col gap-2">
              <div class="flex justify-between items-center">
                <h3 class="text-xs font-bold text-theme">You Need to hire</h3>
                <span class="text-[9px] text-[#635BFF] font-extrabold cursor-pointer">View All</span>
              </div>
              <div class="grid grid-cols-5 gap-2.5">
                <!-- Card 1 -->
                <div class="glass-panel bg-section-tint border border-theme rounded-2xl p-2.5 flex flex-col items-center text-center shadow-sm relative overflow-hidden cursor-pointer hover:border-[#635BFF]/30 transition-all">
                  <span class="w-7 h-7 rounded-xl bg-blue-500/10 text-blue-500 flex items-center justify-center text-xs">🎨</span>
                  <h4 class="text-[9px] font-bold text-theme mt-1.5 leading-none">Content designers</h4>
                  <span class="text-[8px] text-theme-muted mt-0.5">(5 Candidates)</span>
                </div>
                <!-- Card 2 -->
                <div class="glass-panel bg-section-tint border border-theme rounded-2xl p-2.5 flex flex-col items-center text-center shadow-sm relative overflow-hidden cursor-pointer hover:border-[#635BFF]/30 transition-all">
                  <span class="w-7 h-7 rounded-xl bg-orange-500/10 text-orange-500 flex items-center justify-center text-xs">💻</span>
                  <h4 class="text-[9px] font-bold text-theme mt-1.5 leading-none">PHP Developers</h4>
                  <span class="text-[8px] text-theme-muted mt-0.5">(8 Candidates)</span>
                </div>
                <!-- Card 3 -->
                <div class="glass-panel bg-section-tint border border-theme rounded-2xl p-2.5 flex flex-col items-center text-center shadow-sm relative overflow-hidden cursor-pointer hover:border-[#635BFF]/30 transition-all">
                  <span class="w-7 h-7 rounded-xl bg-red-500/10 text-red-500 flex items-center justify-center text-xs">📐</span>
                  <h4 class="text-[9px] font-bold text-theme mt-1.5 leading-none">UI/UX Designer</h4>
                  <span class="text-[8px] text-theme-muted mt-0.5">(5 Candidates)</span>
                </div>
                <!-- Card 4 -->
                <div class="glass-panel bg-section-tint border border-theme rounded-2xl p-2.5 flex flex-col items-center text-center shadow-sm relative overflow-hidden cursor-pointer hover:border-[#635BFF]/30 transition-all">
                  <span class="w-7 h-7 rounded-xl bg-[#10B981]/10 text-[#10B981] flex items-center justify-center text-xs"></span>
                  <h4 class="text-[9px] font-bold text-theme mt-1.5 leading-none">iOS Developer</h4>
                  <span class="text-[8px] text-theme-muted mt-0.5">(10 Candidates)</span>
                </div>
                <!-- Card 5 -->
                <div class="glass-panel bg-section-tint border border-theme rounded-2xl p-2.5 flex flex-col items-center text-center shadow-sm relative overflow-hidden cursor-pointer hover:border-[#635BFF]/30 transition-all">
                  <span class="w-7 h-7 rounded-xl bg-purple-500/10 text-purple-500 flex items-center justify-center text-xs">🤖</span>
                  <h4 class="text-[9px] font-bold text-theme mt-1.5 leading-none">Android Developer</h4>
                  <span class="text-[8px] text-theme-muted mt-0.5">(10 Candidates)</span>
                </div>
              </div>
            </div>

            <!-- Recruitment Progress Table -->
            <div class="flex-1 flex flex-col gap-2 min-h-0">
              <div class="flex justify-between items-center shrink-0">
                <h3 class="text-xs font-bold text-theme">Recruitment Progress</h3>
                <span class="text-[9px] text-[#635BFF] font-extrabold cursor-pointer">View All</span>
              </div>
              
              <div class="flex-1 overflow-hidden scrollbar-none max-h-[160px] flex flex-col">
                <div class="animate-scroll-enterprise-progress">
                  <table class="w-full text-left text-[10px]">
                    <thead>
                      <tr class="text-theme-muted border-b border-theme font-semibold uppercase tracking-wider">
                        <th class="py-1">Full Name</th>
                        <th class="py-1">Designation</th>
                        <th class="py-1">Status</th>
                      </tr>
                    </thead>
                    <tbody class="divide-y divide-theme/20">
                      <tr>
                        <td class="py-1.5 font-semibold text-theme">John Doe</td>
                        <td class="py-1.5 text-theme-soft">UI/UX Designer</td>
                        <td class="py-1.5 flex items-center gap-1.5"><span class="w-1.5 h-1.5 rounded-full bg-blue-500"></span> Tech Interview</td>
                      </tr>
                      <tr>
                        <td class="py-1.5 font-semibold text-theme">Sam Emmanuel</td>
                        <td class="py-1.5 text-theme-soft">UI/UX Designer</td>
                        <td class="py-1.5 flex items-center gap-1.5"><span class="w-1.5 h-1.5 rounded-full bg-orange-500"></span> Task</td>
                      </tr>
                      <tr class="bg-[#635BFF]/10 dark:bg-[#635BFF]/20 rounded-xl relative">
                        <td class="py-1.5 pl-2 font-bold text-[#635BFF] dark:text-[#8D86FF]">John Samuel</td>
                        <td class="py-1.5 font-semibold text-theme">PHP Developer</td>
                        <td class="py-1.5 flex items-center gap-1.5 font-bold"><span class="w-1.5 h-1.5 rounded-full bg-[#10B981] shadow"></span> Resume Review</td>
                      </tr>
                      <tr>
                        <td class="py-1.5 font-semibold text-theme">Sam Emmanuel</td>
                        <td class="py-1.5 text-theme-soft">UI/UX Designer</td>
                        <td class="py-1.5 flex items-center gap-1.5"><span class="w-1.5 h-1.5 rounded-full bg-orange-500"></span> Task</td>
                      </tr>
                      <tr>
                        <td class="py-1.5 font-semibold text-theme">John Doe</td>
                        <td class="py-1.5 text-theme-soft">Content Designer</td>
                        <td class="py-1.5 flex items-center gap-1.5"><span class="w-1.5 h-1.5 rounded-full bg-red-500"></span> Final Interview</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

          </div>

          <!-- Right Sidebar (Profile & Schedule) -->
          <div class="w-[190px] border-l border-theme flex flex-col p-4 shrink-0 bg-section-tint gap-4">
            <!-- Header (Actions & Profile) -->
            <div class="flex justify-between items-center shrink-0">
              <div class="flex gap-2">
                <button class="w-7 h-7 rounded-full border border-theme flex items-center justify-center text-theme-muted hover:bg-section-tint-hover text-xs">⚙️</button>
                <button class="w-7 h-7 rounded-full border border-theme flex items-center justify-center text-theme-muted relative hover:bg-section-tint-hover text-xs">
                  🔔 <span class="absolute -top-0.5 -right-0.5 bg-red-500 w-1.5 h-1.5 rounded-full"></span>
                </button>
              </div>
              <div class="flex items-center gap-2">
                <div class="text-right">
                  <h4 class="text-[10px] font-bold text-theme leading-none">Amy Adhikari</h4>
                  <span class="text-[7px] text-theme-muted font-semibold mt-0.5 block cursor-pointer">View profile</span>
                </div>
                <div class="w-7 h-7 rounded-full bg-orange-100 overflow-hidden border border-theme shadow-sm flex items-center justify-center">
                  <svg viewBox="0 0 64 64" class="w-full h-full text-orange-600"><circle cx="32" cy="22" r="10" fill="#FFE5D9"/><path fill="#FFE5D9" d="M12 44c0-8 8-14 18-14s18 6 18 14H12z"/></svg>
                </div>
              </div>
            </div>

            <!-- Schedule Calendar -->
            <div class="flex flex-col gap-2 shrink-0">
              <div class="flex justify-between items-center">
                <h3 class="text-xs font-bold text-theme">Schedule Calendar</h3>
                <span class="text-[8px] text-theme-muted font-bold cursor-pointer">📅 May</span>
              </div>
              <div class="grid grid-cols-5 gap-1.5 text-center">
                <div class="bg-section-tint border border-theme rounded-xl p-1 flex flex-col items-center">
                  <span class="text-[6px] text-theme-muted uppercase font-bold">Mon</span>
                  <span class="text-[10px] font-bold text-theme">22</span>
                </div>
                <div class="bg-section-tint border border-theme rounded-xl p-1 flex flex-col items-center">
                  <span class="text-[6px] text-theme-muted uppercase font-bold">Tue</span>
                  <span class="text-[10px] font-bold text-theme">23</span>
                </div>
                <div class="bg-[#635BFF] text-white border border-[#635BFF] rounded-xl p-1 flex flex-col items-center shadow-md">
                  <span class="text-[6px] opacity-80 uppercase font-bold">Wed</span>
                  <span class="text-[10px] font-black">24</span>
                </div>
                <div class="bg-section-tint border border-theme rounded-xl p-1 flex flex-col items-center">
                  <span class="text-[6px] text-theme-muted uppercase font-bold">Thu</span>
                  <span class="text-[10px] font-bold text-theme">25</span>
                </div>
                <div class="bg-section-tint border border-theme rounded-xl p-1 flex flex-col items-center">
                  <span class="text-[6px] text-theme-muted uppercase font-bold">Fri</span>
                  <span class="text-[10px] font-bold text-theme">26</span>
                </div>
              </div>
            </div>

            <!-- New Applicants list -->
            <div class="flex flex-col gap-2 shrink-0">
              <div class="flex justify-between items-center">
                <h3 class="text-xs font-bold text-theme">New Applicants</h3>
                <span class="text-[8px] text-theme-muted font-bold cursor-pointer">View All</span>
              </div>
              <div class="flex flex-col gap-1.5 max-h-[140px] overflow-hidden scrollbar-none">
                <div class="flex flex-col gap-1.5 animate-scroll-enterprise-applicants">
                  <!-- Applicant 1 -->
                  <div class="glass-panel bg-section-tint border border-theme rounded-xl p-1.5 flex items-center justify-between shadow-sm relative overflow-hidden">
                    <div class="flex items-center gap-1.5">
                      <div class="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center border border-theme overflow-hidden shadow-sm shrink-0">
                        <span class="text-xs leading-none">👨</span>
                      </div>
                      <div>
                        <h4 class="text-[9px] font-bold text-theme leading-none">Mike Tyson</h4>
                        <span class="text-[6px] text-theme-muted mt-0.5 block leading-none">Applied for: iOS Developer</span>
                      </div>
                    </div>
                    <div class="flex gap-1 shrink-0">
                      <button class="w-4 h-4 rounded-full bg-[#635BFF]/10 text-[#635BFF] flex items-center justify-center text-[8px]">💬</button>
                      <button class="w-4 h-4 rounded-full bg-[#635BFF]/10 text-[#635BFF] flex items-center justify-center text-[8px]">📞</button>
                    </div>
                  </div>
                  <!-- Applicant 2 -->
                  <div class="glass-panel bg-section-tint border border-theme rounded-xl p-1.5 flex items-center justify-between shadow-sm relative overflow-hidden">
                    <div class="flex items-center gap-1.5">
                      <div class="w-6 h-6 rounded-full bg-orange-100 flex items-center justify-center border border-theme overflow-hidden shadow-sm shrink-0">
                        <span class="text-xs leading-none">👩</span>
                      </div>
                      <div>
                        <h4 class="text-[9px] font-bold text-theme leading-none">Zara Thomas</h4>
                        <span class="text-[6px] text-theme-muted mt-0.5 block leading-none">Applied for: Content Designer</span>
                      </div>
                    </div>
                    <div class="flex gap-1 shrink-0">
                      <button class="w-4 h-4 rounded-full bg-[#635BFF]/10 text-[#635BFF] flex items-center justify-center text-[8px]">💬</button>
                      <button class="w-4 h-4 rounded-full bg-[#635BFF]/10 text-[#635BFF] flex items-center justify-center text-[8px]">📞</button>
                    </div>
                  </div>
                  <!-- Applicant 3 -->
                  <div class="glass-panel bg-section-tint border border-theme rounded-xl p-1.5 flex items-center justify-between shadow-sm relative overflow-hidden">
                    <div class="flex items-center gap-1.5">
                      <div class="w-6 h-6 rounded-full bg-emerald-100 flex items-center justify-center border border-theme overflow-hidden shadow-sm shrink-0">
                        <span class="text-xs leading-none">👱‍♀️</span>
                      </div>
                      <div>
                        <h4 class="text-[9px] font-bold text-theme leading-none">Emma Watson</h4>
                        <span class="text-[6px] text-theme-muted mt-0.5 block leading-none">Applied for: Android Developer</span>
                      </div>
                    </div>
                    <div class="flex gap-1 shrink-0">
                      <button class="w-4 h-4 rounded-full bg-[#635BFF]/10 text-[#635BFF] flex items-center justify-center text-[8px]">💬</button>
                      <button class="w-4 h-4 rounded-full bg-[#635BFF]/10 text-[#635BFF] flex items-center justify-center text-[8px]">📞</button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Ready For Training -->
            <div class="flex flex-col gap-2 shrink-0">
              <div class="flex justify-between items-center">
                <h3 class="text-xs font-bold text-theme">Ready For Training</h3>
                <span class="text-[8px] text-theme-muted font-bold cursor-pointer">View All</span>
              </div>
              <div class="grid grid-cols-3 gap-1.5">
                <!-- Trainee 1 -->
                <div class="glass-panel bg-section-tint border border-theme rounded-xl p-1 flex flex-col items-center text-center shadow-sm relative overflow-hidden">
                  <div class="w-5 h-5 rounded-full bg-purple-100 overflow-hidden border border-theme flex items-center justify-center shrink-0 shadow-sm">
                    <span class="text-[9px] leading-none">👱</span>
                  </div>
                  <h4 class="text-[7px] font-bold text-theme mt-1 leading-none">Mike Tyson</h4>
                  <button class="bg-[#635BFF] text-white text-[5px] font-bold px-1 py-0.5 rounded-md mt-1.5 shadow-sm">Start Training</button>
                </div>
                <!-- Trainee 2 -->
                <div class="glass-panel bg-section-tint border border-theme rounded-xl p-1 flex flex-col items-center text-center shadow-sm relative overflow-hidden">
                  <div class="w-5 h-5 rounded-full bg-emerald-100 overflow-hidden border border-theme flex items-center justify-center shrink-0 shadow-sm">
                    <span class="text-[9px] leading-none">👨</span>
                  </div>
                  <h4 class="text-[7px] font-bold text-theme mt-1 leading-none">Samuel John</h4>
                  <button class="bg-[#635BFF] text-white text-[5px] font-bold px-1 py-0.5 rounded-md mt-1.5 shadow-sm">Start Training</button>
                </div>
                <!-- Trainee 3 -->
                <div class="glass-panel bg-section-tint border border-theme rounded-xl p-1 flex flex-col items-center text-center shadow-sm relative overflow-hidden">
                  <div class="w-5 h-5 rounded-full bg-pink-100 overflow-hidden border border-theme flex items-center justify-center shrink-0 shadow-sm">
                    <span class="text-[9px] leading-none">👩</span>
                  </div>
                  <h4 class="text-[7px] font-bold text-theme mt-1 leading-none">Jiya George</h4>
                  <button class="bg-[#635BFF] text-white text-[5px] font-bold px-1 py-0.5 rounded-md mt-1.5 shadow-sm">Start Training</button>
                </div>
              </div>
            </div>

          </div>

        </div>

      </div>
    </div>
  `;
};
