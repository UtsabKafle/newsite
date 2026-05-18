window.ConsicaElements = window.ConsicaElements || {};

window.ConsicaElements.smsPreview = function (layout) {
  const isMobile = layout === 'mobile';
  const base = window.CONSICA_BASE || '';

  return `
    <div class="sms-preview-wrapper relative group flex items-center justify-center w-full ${isMobile ? 'scale-[0.43] my-[-150px]' : 'scale-[0.7] lg:scale-[0.8] xl:scale-[0.85]'} origin-center">
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
            <span class="text-[11px] font-bold tracking-widest text-theme-muted uppercase">Consica SMS</span>
          </div>
          <div class="w-12"></div> <!-- Spacer -->
        </div>

        <!-- Inner Layout -->
        <div class="flex-1 flex overflow-hidden text-theme" style="background: var(--glass-bg);">
          <!-- Sidebar -->
          <div class="w-[170px] border-r border-theme flex flex-col justify-between p-4 shrink-0 bg-section-tint">
            <div>
              <!-- Logo -->
              <div class="flex items-center gap-1.5 mb-8">
                <img src="${base}assets/images/logow.png" class="h-3.5 theme-show-dark opacity-95" alt="">
                <img src="${base}assets/images/logob.png" class="h-3.5 theme-show-light opacity-95" alt="">
                <span class="font-bold text-sm tracking-tight">Consica SMS</span>
              </div>

              <!-- Nav Menu -->
              <div class="flex flex-col gap-1.5">
                <div class="flex items-center gap-3 px-3 py-2 rounded-xl bg-[#EF4444]/10 dark:bg-[#EF4444]/20 text-[#EF4444] font-semibold text-xs cursor-pointer">
                  <span>📁</span> Dashboard
                </div>
                <div class="flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-section-tint-hover text-theme-soft text-xs cursor-pointer transition-colors">
                  <span>📝</span> Marks
                </div>
                <div class="flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-section-tint-hover text-theme-soft text-xs cursor-pointer transition-colors">
                  <span>👥</span> Attendances
                </div>
                <div class="flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-section-tint-hover text-theme-soft text-xs cursor-pointer transition-colors">
                  <span>💬</span> Messages
                </div>
                <div class="flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-section-tint-hover text-theme-soft text-xs cursor-pointer transition-colors">
                  <span>📅</span> Timetable
                </div>
                <div class="flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-section-tint-hover text-theme-soft text-xs cursor-pointer transition-colors">
                  <span>📖</span> Homeworks
                </div>
                <div class="flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-section-tint-hover text-theme-soft text-xs cursor-pointer transition-colors">
                  <span>🔔</span> Alerts
                </div>
                <div class="flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-section-tint-hover text-theme-soft text-xs cursor-pointer transition-colors">
                  <span>⚙️</span> Settings
                </div>
              </div>
            </div>

            <!-- Reading Illustration -->
            <div class="mt-auto pt-4 flex flex-col items-center text-center bg-[#3B82F6]/5 rounded-2xl p-3 border border-[#3B82F6]/10 relative overflow-hidden">
              <div class="w-16 h-16 relative mb-2">
                <svg viewBox="0 0 64 64" class="w-full h-full text-[#3B82F6]"><path fill="currentColor" opacity="0.1" d="M32 0C14.3 0 0 14.3 0 32s14.3 32 32 32 32-14.3 32-32S49.7 0 32 0z"/><path fill="currentColor" d="M46 44H18c-1.1 0-2-.9-2-2V22c0-1.1.9-2 2-2h28c1.1 0 2 .9 2 2v20c0 1.1-.9 2-2 2z" opacity="0.2"/><path fill="currentColor" d="M40 38H24v-2h16v2zm4-6H20v-2h24v2zm0-6H20v-2h24v2z"/><circle cx="32" cy="12" r="4" fill="currentColor"/></svg>
              </div>
              <span class="text-[9px] text-theme-muted">Track your academic goals!</span>
            </div>
          </div>

          <!-- Main Content -->
          <div class="flex-1 flex flex-col overflow-y-auto p-4 gap-4">
            <!-- Header -->
            <div class="flex justify-between items-center shrink-0">
              <div>
                <h2 class="text-xl font-bold tracking-tight">Hello, <span class="text-[#3B82F6]">Amy</span>!</h2>
              </div>
              <div class="flex items-center gap-4">
                <span class="text-[10px] text-theme-muted font-medium">19 July 2020, Sunday</span>
                <div class="flex gap-2">
                  <button class="w-7 h-7 rounded-full border border-theme flex items-center justify-center text-theme-muted hover:bg-section-tint-hover transition-colors text-xs">🔍</button>
                  <button class="w-7 h-7 rounded-full border border-theme flex items-center justify-center text-theme-muted relative hover:bg-section-tint-hover transition-colors text-xs">
                    🔔
                    <span class="absolute -top-1 -right-1 bg-[#EF4444] text-white text-[7px] font-bold rounded-full w-3.5 h-3.5 flex items-center justify-center shadow">4</span>
                  </button>
                </div>
              </div>
            </div>

            <!-- Two Column Dashboard Grid -->
            <div class="flex-1 grid grid-cols-12 gap-4 min-h-0">
              <!-- Left Side: Timetable -->
              <div class="col-span-7 flex flex-col gap-3">
                <div class="flex justify-between items-center shrink-0">
                  <div>
                    <h3 class="text-xs font-bold text-theme">Timetable</h3>
                    <p class="text-[9px] text-theme-muted">Monday, 20 July 2020</p>
                  </div>
                  <div class="bg-section-tint border border-theme text-theme-soft text-[9px] px-2 py-0.5 rounded-lg flex items-center gap-1 cursor-pointer font-semibold shadow-sm">
                    📅 20-07-2020
                  </div>
                </div>

                <!-- Timetable Scroll List -->
                <div class="flex-1 overflow-hidden scrollbar-none max-h-[290px]">
                  <div class="flex flex-col gap-2 animate-scroll-sms-timetable">
                    <!-- Row: Geography -->
                    <div class="flex items-center gap-4">
                      <span class="text-[10px] text-theme-faint w-10 font-bold shrink-0">07:00</span>
                      <div class="flex-1 bg-purple-500/10 dark:bg-purple-500/20 border border-purple-500/20 dark:border-purple-500/40 rounded-2xl p-3 flex justify-between items-center shadow-sm">
                        <div class="flex items-center gap-3">
                          <span class="text-lg">🌍</span>
                          <div>
                            <h4 class="text-xs font-bold text-purple-600 dark:text-purple-400">Geography</h4>
                            <p class="text-[9px] text-theme-muted font-medium">07:30 — 08:15</p>
                          </div>
                        </div>
                        <span class="text-[10px] font-extrabold text-purple-600/70 dark:text-purple-400/70">Room 219</span>
                      </div>
                    </div>

                    <!-- Row: Physics -->
                    <div class="flex items-center gap-4">
                      <span class="text-[10px] text-theme-faint w-10 font-bold shrink-0">08:00</span>
                      <div class="flex-1 bg-orange-500/10 dark:bg-orange-500/20 border border-orange-500/20 dark:border-orange-500/40 rounded-2xl p-3 flex justify-between items-center shadow-sm">
                        <div class="flex items-center gap-3">
                          <span class="text-lg">⚛️</span>
                          <div>
                            <h4 class="text-xs font-bold text-orange-600 dark:text-orange-400">Physics</h4>
                            <p class="text-[9px] text-theme-muted font-medium">08:25 — 09:10</p>
                          </div>
                        </div>
                        <span class="text-[10px] font-extrabold text-orange-600/70 dark:text-orange-400/70">Room 128</span>
                      </div>
                    </div>

                    <!-- Row: Chemistry -->
                    <div class="flex items-center gap-4">
                      <span class="text-[10px] text-theme-faint w-10 font-bold shrink-0">10:00</span>
                      <div class="flex-1 bg-emerald-500/10 dark:bg-emerald-500/20 border border-emerald-500/20 dark:border-emerald-500/40 rounded-2xl p-3 flex justify-between items-center shadow-sm">
                        <div class="flex items-center gap-3">
                          <span class="text-lg">🧪</span>
                          <div>
                            <h4 class="text-xs font-bold text-emerald-600 dark:text-emerald-400">Chemistry</h4>
                            <p class="text-[9px] text-theme-muted font-medium">10:15 — 11:00</p>
                          </div>
                        </div>
                        <span class="text-[10px] font-extrabold text-emerald-600/70 dark:text-emerald-400/70">Room 10</span>
                      </div>
                    </div>

                    <!-- Row: P.E. -->
                    <div class="flex items-center gap-4">
                      <span class="text-[10px] text-theme-faint w-10 font-bold shrink-0">11:00</span>
                      <div class="flex-1 bg-yellow-500/10 dark:bg-yellow-500/20 border border-yellow-500/20 dark:border-yellow-500/40 rounded-2xl p-3 flex justify-between items-center shadow-sm">
                        <div class="flex items-center gap-3">
                          <span class="text-lg">⚽</span>
                          <div>
                            <h4 class="text-xs font-bold text-yellow-600 dark:text-yellow-400">Physical Education</h4>
                            <p class="text-[9px] text-theme-muted font-medium">11:15 — 12:00</p>
                          </div>
                        </div>
                        <span class="text-[10px] font-extrabold text-yellow-600/70 dark:text-yellow-400/70">Gym</span>
                      </div>
                    </div>

                    <!-- Row: Math -->
                    <div class="flex items-center gap-4">
                      <span class="text-[10px] text-theme-faint w-10 font-bold shrink-0">12:00</span>
                      <div class="flex-1 bg-sky-500/10 dark:bg-sky-500/20 border border-sky-500/20 dark:border-sky-500/40 rounded-2xl p-3 flex justify-between items-center shadow-sm">
                        <div class="flex items-center gap-3">
                          <span class="text-lg">📐</span>
                          <div>
                            <h4 class="text-xs font-bold text-sky-600 dark:text-sky-400">Math</h4>
                            <p class="text-[9px] text-theme-muted font-medium">12:10 — 12:55</p>
                          </div>
                        </div>
                        <span class="text-[10px] font-extrabold text-sky-600/70 dark:text-sky-400/70">Room 204</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Right Side: Latest Marks & Calendar -->
              <div class="col-span-5 flex flex-col gap-3">
                <!-- Latest Marks Card -->
                <div class="glass-panel bg-section-tint border border-theme rounded-2xl p-3 flex flex-col gap-2 shadow-sm">
                  <div>
                    <h3 class="text-xs font-bold text-theme">Latest marks</h3>
                    <p class="text-[8px] text-theme-muted">13.07.2020 — 20.07.2020</p>
                  </div>

                  <div class="flex items-center justify-between gap-2 py-1">
                    <button class="w-6 h-6 rounded-full border border-theme flex items-center justify-center text-xs text-theme-muted hover:bg-section-tint-hover">←</button>
                    
                    <div class="flex items-center gap-2">
                      <div class="w-10 h-10 rounded-full bg-gradient-to-br from-[#FF5F57] to-[#EF4444] flex items-center justify-center text-white font-extrabold text-sm shadow-md">5</div>
                      <div class="w-7 h-7 rounded-full bg-section-tint border border-theme flex items-center justify-center text-theme-muted text-[10px] font-bold">+3</div>
                      <div class="w-7 h-7 rounded-full bg-section-tint border border-theme flex items-center justify-center text-theme-muted text-[10px] font-bold">4</div>
                      <div class="w-7 h-7 rounded-full bg-section-tint border border-theme flex items-center justify-center text-theme-muted text-[10px] font-bold">6</div>
                    </div>

                    <button class="w-6 h-6 rounded-full border border-theme flex items-center justify-center text-xs text-theme-muted hover:bg-section-tint-hover">→</button>
                  </div>

                  <div class="text-center">
                    <span class="text-[10px] font-bold text-theme">Physics</span>
                    <p class="text-[8px] text-theme-muted">Test — UNIT 8</p>
                  </div>
                </div>

                <!-- Calendar Grid -->
                <div class="glass-panel bg-section-tint border border-theme rounded-2xl p-3 flex flex-col gap-2 shadow-sm">
                  <div class="flex justify-between items-center">
                    <h3 class="text-xs font-bold text-theme">Homeworks & Tests</h3>
                    <span class="text-[9px] text-[#3B82F6] font-extrabold">July 2020</span>
                  </div>

                  <!-- Days of the week -->
                  <div class="grid grid-cols-7 gap-1 text-center">
                    <span class="text-[8px] font-bold text-theme-muted">Mon</span>
                    <span class="text-[8px] font-bold text-theme-muted">Tue</span>
                    <span class="text-[8px] font-bold text-theme-muted">Wed</span>
                    <span class="text-[8px] font-bold text-theme-muted">Thu</span>
                    <span class="text-[8px] font-bold text-theme-muted">Fri</span>
                    <span class="text-[8px] font-bold text-theme-muted">Sat</span>
                    <span class="text-[8px] font-bold text-theme-muted">Sun</span>
                  </div>

                  <!-- Calendar Days -->
                  <div class="grid grid-cols-7 gap-1 text-center mt-1">
                    <span class="text-[9px] text-theme-faint font-medium">29</span>
                    <span class="text-[9px] text-theme-faint font-medium">30</span>
                    
                    <span class="text-[9px] font-medium text-theme">1</span>
                    <span class="text-[9px] font-medium text-theme">2</span>
                    <span class="text-[9px] font-medium text-theme">3</span>
                    <span class="text-[9px] font-medium text-theme">4</span>
                    <span class="text-[9px] font-medium text-theme">5</span>
                    <span class="text-[9px] font-medium text-theme">6</span>
                    
                    <div class="relative flex items-center justify-center">
                      <span class="w-5 h-5 rounded-full bg-[#3B82F6] text-white text-[9px] font-bold flex items-center justify-center shadow-md">7</span>
                    </div>

                    <span class="text-[9px] font-medium text-theme">8</span>
                    <span class="text-[9px] font-medium text-theme">9</span>
                    <span class="text-[9px] font-medium text-theme">10</span>
                    <span class="text-[9px] font-medium text-theme">11</span>
                    <span class="text-[9px] font-medium text-theme">12</span>
                    <span class="text-[9px] font-medium text-theme">13</span>
                    <span class="text-[9px] font-medium text-theme">14</span>
                    <span class="text-[9px] font-medium text-theme">15</span>
                    <span class="text-[9px] font-medium text-theme">16</span>
                    <span class="text-[9px] font-medium text-theme">17</span>

                    <div class="relative flex flex-col items-center justify-center">
                      <span class="w-5 h-5 rounded-full bg-orange-500 text-white text-[9px] font-bold flex items-center justify-center shadow-md">18</span>
                      <span class="absolute -bottom-0.5 flex gap-0.5">
                        <span class="w-0.5 h-0.5 rounded-full bg-[#3B82F6]"></span>
                        <span class="w-0.5 h-0.5 rounded-full bg-emerald-500"></span>
                      </span>
                    </div>

                    <span class="text-[9px] font-medium text-theme">19</span>
                    <span class="text-[9px] font-medium text-theme">20</span>
                    <span class="text-[9px] font-medium text-theme">21</span>
                    <span class="text-[9px] font-medium text-theme">22</span>
                    <span class="text-[9px] font-medium text-theme">23</span>
                    <span class="text-[9px] font-medium text-theme">24</span>
                    <span class="text-[9px] font-medium text-theme">25</span>
                    <span class="text-[9px] font-medium text-theme">26</span>
                    <span class="text-[9px] font-medium text-theme">27</span>
                    <span class="text-[9px] font-medium text-theme">28</span>
                    <span class="text-[9px] font-medium text-theme">29</span>
                    <span class="text-[9px] font-medium text-theme">30</span>

                    <div class="relative flex items-center justify-center">
                      <span class="w-5 h-5 rounded-full bg-emerald-500 text-white text-[9px] font-bold flex items-center justify-center shadow-md">31</span>
                    </div>
                  </div>

                  <!-- Legend -->
                  <div class="flex justify-center gap-3 mt-3 border-t border-theme pt-2 shrink-0">
                    <div class="flex items-center gap-1">
                      <span class="w-1.5 h-1.5 rounded-full bg-[#3B82F6]"></span>
                      <span class="text-[7px] text-theme-muted font-semibold uppercase">Homework</span>
                    </div>
                    <div class="flex items-center gap-1">
                      <span class="w-1.5 h-1.5 rounded-full bg-orange-500"></span>
                      <span class="text-[7px] text-theme-muted font-semibold uppercase">Exam</span>
                    </div>
                    <div class="flex items-center gap-1">
                      <span class="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                      <span class="text-[7px] text-theme-muted font-semibold uppercase">Test</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Right Student Profile Panel -->
          <div class="w-[190px] border-l border-theme flex flex-col p-4 shrink-0 bg-section-tint gap-4">
            <!-- Avatar -->
            <div class="flex flex-col items-center text-center mt-1">
              <div class="w-16 h-16 rounded-2xl bg-orange-100 overflow-hidden flex items-center justify-center border-2 border-orange-500/20 shadow">
                <svg viewBox="0 0 64 64" class="w-full h-full text-orange-600"><path fill="#FFF0E6" d="M12 40c0-10 8-18 18-18s18 8 18 18H12z"/><circle cx="32" cy="22" r="10" fill="#FFF0E6"/><path fill="#1E293B" d="M22 18c0-5 4-9 9-9s9 4 9 9c2 0 4 2 4 4s-2 4-4 4h-14c-2 0-4-2-4-4s2-4 4-4z"/><circle cx="28" cy="21" r="1.5" fill="#1E293B"/><circle cx="36" cy="21" r="1.5" fill="#1E293B"/><path stroke="#EF4444" stroke-width="1.5" stroke-linecap="round" d="M30 25s1 1 2 0"/></svg>
              </div>
              <h3 class="text-sm font-bold text-theme mt-3">Amy Adhikari</h3>
              <span class="text-[8px] font-extrabold tracking-widest text-orange-500 uppercase">Student</span>
            </div>

            <!-- Three Stat Cards -->
            <div class="flex flex-col gap-1.5">
              <!-- Card 1 -->
              <div class="glass-panel bg-section-tint border border-theme rounded-2xl p-2 flex items-center justify-between shadow-sm relative overflow-hidden">
                <div>
                  <span class="text-[8px] text-theme-muted font-semibold leading-none">Lucky number</span>
                  <h4 class="text-base font-bold text-theme leading-none mt-0.5">27</h4>
                </div>
                <span class="text-xl">🍀</span>
              </div>
              <!-- Card 2 -->
              <div class="glass-panel bg-section-tint border border-theme rounded-2xl p-2 flex items-center justify-between shadow-sm relative overflow-hidden">
                <div>
                  <span class="text-[8px] text-theme-muted font-semibold leading-none">Marks average</span>
                  <h4 class="text-base font-bold text-theme leading-none mt-0.5">4.82</h4>
                </div>
                <span class="text-xl">🏆</span>
              </div>
              <!-- Card 3 -->
              <div class="glass-panel bg-section-tint border border-theme rounded-2xl p-2 flex items-center justify-between shadow-sm relative overflow-hidden">
                <div>
                  <span class="text-[8px] text-theme-muted font-semibold leading-none">Place in class</span>
                  <h4 class="text-base font-bold text-theme leading-none mt-0.5">2</h4>
                </div>
                <span class="text-xl">🥇</span>
              </div>
            </div>

            <!-- Circular gauge -->
            <div class="flex flex-col items-center mt-1 relative">
              <span class="text-[8px] text-theme-muted font-bold mb-1.5 uppercase">Time to vacation</span>
              <div class="relative w-20 h-20 flex items-center justify-center">
                <svg class="w-full h-full transform -rotate-90">
                  <circle cx="40" cy="40" r="32" stroke="var(--glass-border)" stroke-width="4" fill="transparent" stroke-dasharray="201" stroke-dashoffset="50" stroke-linecap="round" />
                  <circle cx="40" cy="40" r="32" stroke="url(#vacationGrad)" stroke-width="5" fill="transparent" stroke-dasharray="201" stroke-dashoffset="85" stroke-linecap="round" />
                  <defs>
                    <linearGradient id="vacationGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stop-color="#FF5F57" />
                      <stop offset="100%" stop-color="#EF4444" />
                    </linearGradient>
                  </defs>
                </svg>
                <div class="absolute flex flex-col items-center text-center">
                  <span class="text-xs font-black text-theme leading-none">187</span>
                  <span class="text-[7px] text-theme-muted font-semibold leading-none mt-0.5">days</span>
                </div>
              </div>
            </div>

            <!-- Logout -->
            <div class="mt-auto border-t border-theme pt-2 flex items-center justify-between text-xs text-theme-muted hover:text-theme cursor-pointer transition-colors font-bold">
              <span>Log Out</span>
              <span>🚪</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  `;
};
