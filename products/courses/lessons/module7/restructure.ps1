# PowerShell script to restructure all 14 module7 chapter files to match module5 template
$moduleDir = "C:\Users\badhi\OneDrive\Documents\GitHub\newsite\products\courses\lessons\module7"

$chapters = @(
    @{num="1"; title="What Is a Robot?"; subtitle="Understanding machines that sense, think, and act"; desc="Chapter 1: What Is a Robot?. Understanding machines that sense, think, and act"; def="A robot is a reprogrammable machine designed to perform tasks automatically by sensing its environment, processing that information, and taking action in the physical world."; diag="diagram-01-what-is-a-robot"; next="chapter-2-types-of-robots.html"; nextTitle="Types of Robots"; slug="robot"},
    @{num="2"; title="Types of Robots"; subtitle="Discovering robot designs across different environments"; desc="Chapter 2: Types of Robots. Discovering robot designs across different environments"; def="Robots are grouped into various classes based on their locomotion, size, and environment, including mobile wheel-bots, aerial drones, and industrial arm manipulators."; diag="diagram-02-types-of-robots"; next="chapter-3-robot-components.html"; nextTitle="Robot Components"; slug="types-of-robots"},
    @{num="3"; title="Robot Components"; subtitle="Understanding the structural frames and electrical buses"; desc="Chapter 3: Robot Components. Understanding the structural frames and electrical buses"; def="Robot components are the physical structures, links, buses, gears, batteries, and chips that make up a complete operational machine."; diag="diagram-03-robot-components"; next="chapter-4-introduction-to-sensors.html"; nextTitle="Introduction to Sensors"; slug="robot-components"},
    @{num="4"; title="Introduction to Sensors"; subtitle="Learning how machines translate physical states to voltage"; desc="Chapter 4: Introduction to Sensors. Learning how machines translate physical states to voltage"; def="Sensors are electronic devices that detect physical properties of the environment and convert them into electrical signals the controller can read."; diag="diagram-04-introduction-sensors"; next="chapter-5-touch-sensors.html"; nextTitle="Touch Sensors"; slug="introduction-to-sensors"},
    @{num="5"; title="Touch Sensors"; subtitle="Mapping switch inputs to collision boundaries"; desc="Chapter 5: Touch Sensors. Mapping switch inputs to collision boundaries"; def="Touch sensors are micro-switches or bumpers that close an electrical circuit when physical pressure is applied, signaling a collision."; diag="diagram-05-touch-sensors"; next="chapter-6-light-sensors.html"; nextTitle="Light Sensors"; slug="touch-sensors"},
    @{num="6"; title="Light Sensors"; subtitle="Measuring light values and adjusting speed variables"; desc="Chapter 6: Light Sensors. Measuring light values and adjusting speed variables"; def="Light sensors are resistors that change their electrical resistance based on the intensity of light falling on them."; diag="diagram-06-light-sensors"; next="chapter-7-distance-sensors.html"; nextTitle="Distance Sensors"; slug="light-sensors"},
    @{num="7"; title="Distance Sensors"; subtitle="Calculating echo sound delays to map distances"; desc="Chapter 7: Distance Sensors. Calculating echo sound delays to map distances"; def="Distance sensors use ultrasonic sound waves or infrared light beams to calculate the distance to a physical obstacle."; diag="diagram-07-distance-sensors"; next="chapter-8-robot-controllers.html"; nextTitle="Robot Controllers"; slug="distance-sensors"},
    @{num="8"; title="Robot Controllers"; subtitle="Exploring microcontrollers and code loop registers"; desc="Chapter 8: Robot Controllers. Exploring microcontrollers and code loop registers"; def="A robot controller is a small computer on a single integrated circuit containing a processor core, memory, and programmable inputs/outputs."; diag="diagram-08-robot-controllers"; next="chapter-9-robot-logic.html"; nextTitle="Robot Logic"; slug="robot-controllers"},
    @{num="9"; title="Robot Logic"; subtitle="Developing simple logic checks and conditions"; desc="Chapter 9: Robot Logic. Developing simple logic checks and conditions"; def="Robot logic is the set of conditional statements (if-then-else) that guide a robot's decisions based on sensor values."; diag="diagram-09-robot-logic"; next="chapter-10-motors-and-movement.html"; nextTitle="Motors and Movement"; slug="robot-logic"},
    @{num="10"; title="Motors and Movement"; subtitle="Driving motors and calibrating wheel steer angles"; desc="Chapter 10: Motors and Movement. Driving motors and calibrating wheel steer angles"; def="Motors convert electrical energy from the battery into rotational force, while gears reduce speed and increase torque for control."; diag="diagram-10-motors-and-movement"; next="chapter-11-automation-basics.html"; nextTitle="Automation Basics"; slug="motors-and-movement"},
    @{num="11"; title="Automation Basics"; subtitle="Assembling industrial automated sorting loops"; desc="Chapter 11: Automation Basics. Assembling industrial automated sorting loops"; def="Automation is the use of sensors, loops, and mechanical conveyors to perform repetitive industrial workflows without human intervention."; diag="diagram-11-automation-basics"; next="chapter-12-robot-decision-making.html"; nextTitle="Robot Decision Making"; slug="automation-basics"},
    @{num="12"; title="Robot Decision Making"; subtitle="Assembling decision logic trees to bypass hazards"; desc="Chapter 12: Robot Decision Making. Assembling decision logic trees to bypass hazards"; def="Robot decision making is the process of evaluating multiple sensor parameters to choose the safest navigation route."; diag="diagram-12-robot-decision-makin"; next="chapter-13-real-world-robotics.html"; nextTitle="Real World Robotics"; slug="robot-decision-making"},
    @{num="13"; title="Real World Robotics"; subtitle="Discovering industrial arms in factory workflows"; desc="Chapter 13: Real World Robotics. Discovering industrial arms in factory workflows"; def="Real-world robotics covers advanced industrial arms, surgical assistance bots, warehouse delivery nodes, and space exploration probes."; diag="diagram-13-real-world-robotics"; next="chapter-14-design-your-own-robot.html"; nextTitle="Design Your Own Robot"; slug="real-world-robotics"},
    @{num="14"; title="Design Your Own Robot"; subtitle="Assembling your custom robot chassis and controller"; desc="Chapter 14: Design Your Own Robot. Assembling your custom robot chassis and controller"; def="Designing a robot involves specifying a chassis size, picking sensors, defining motor power requirements, and coding the controller loop."; diag="diagram-14-design-your-own-robo"; next="how-robots-work.html"; nextTitle="Module Overview"; slug="design-your-own-robot"}
)

# Common head/body boilerplate (lines 1-170 of module5 template)
$head = @'
<!DOCTYPE html>
<html lang="en" class="scroll-smooth">

<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover">
  <meta name="theme-color" content="#0959C8">
  <title>Chapter {NUM}: {TITLE} | Consica Academy</title>
  <meta name="description" content="{DESC}">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Poppins:wght@400;500;600;700;800&display=swap" rel="stylesheet">
  <script src="https://cdn.tailwindcss.com"></script>
  <script>
    tailwind.config = {
      theme: {
        extend: {
          colors: {
            brand: {
              DEFAULT: '#0959C8',
              50: '#E8F1FC', 100: '#C5DBF7', 200: '#8EB8EF', 300: '#5694E4',
              400: '#2475D9', 500: '#0959C8', 600: '#0747A3', 700: '#05367A',
              800: '#032652', 900: '#021629',
            },
            surface: { dark: '#0A0E17', darker: '#060910', card: 'rgba(255,255,255,0.04)', glass: 'rgba(255,255,255,0.06)' },
          },
          fontFamily: { display: ['Poppins', 'system-ui', 'sans-serif'], body: ['Inter', 'system-ui', 'sans-serif'] },
          boxShadow: { glow: '0 0 60px rgba(9, 89, 200, 0.25)', 'glow-lg': '0 0 100px rgba(9, 89, 200, 0.35)', glass: '0 8px 32px rgba(0, 0, 0, 0.24)' },
        },
      },
    };
  </script>
  <script>
    (function () {
      var stored = localStorage.getItem('consica-theme');
      var theme = stored || 'dark';
      if (!stored && window.matchMedia('(prefers-color-scheme: light)').matches) theme = 'light';
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
    .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
    .scrollbar-hide::-webkit-scrollbar { display: none; }
    .mobile-bottom-nav { box-shadow: 0 -8px 32px rgba(0, 0, 0, 0.35); }
    #mobile-drawer aside { backdrop-filter: blur(24px); -webkit-backdrop-filter: blur(24px); }
    .safe-top { padding-top: env(safe-area-inset-top, 0); }
    @media (hover: none) { .card-3d:hover { transform: none !important; } }
    .lesson-heading { scroll-margin-top: calc(var(--nav-height) + 1.5rem); }
    .vocab-table th { background: rgba(9, 89, 200, 0.12); font-weight: 600; text-align: left; padding: 0.75rem 1rem; }
    .vocab-table td { padding: 0.75rem 1rem; border-top: 1px solid rgba(255, 255, 255, 0.05); }
    .vocab-table tr:hover td { background: rgba(9, 89, 200, 0.04); }
    .kb-check { border-left: 3px solid rgba(9, 89, 200, 0.25); padding-left: 1rem; }
    .kb-check p { margin-bottom: 0.25rem; }
    .kb-answer { display: none; }
    .kb-answer.revealed { display: block; }
  
    .vocab { color: #3b82f6; font-weight: 500; }
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
          <a href="../../../../index.html#services" class="nav-link text-sm">Services</a>
          <a href="../../../../index.html#vision" class="nav-link text-sm">Philosophy</a>
          <a href="../../../../index.html#team" class="nav-link text-sm">Team</a>
          <a href="../../../../index.html#lab" class="nav-link text-sm">Lab</a>
          <a href="../../../../index.html#testimonials" class="nav-link text-sm">Testimonials</a>
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
            <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M4 8h16M4 16h16"/></svg>
          </button>
        </div>
      </nav>
    </header>

    <div id="logo-branding-overlay" class="logo-overlay"><img src="../../../../assets/images/consica.png" alt="Consica Labs"></div>

    <div id="mobile-drawer" class="fixed inset-0 z-50 translate-x-full transition-transform duration-300" aria-hidden="true" inert>
      <div class="absolute inset-0 bg-black/60" id="drawer-backdrop"></div>
      <aside class="absolute right-0 top-0 bottom-0 w-[min(100%,320px)] glass-panel border-l border-theme p-6 flex flex-col">
        <div class="flex justify-between items-center mb-8"><span class="font-display font-semibold">Menu</span><button type="button" id="mobile-menu-close" class="p-2" aria-label="Close menu">&times;</button></div>
        <div class="flex flex-col gap-4">
          <a href="../../../../index.html#hero" class="mobile-nav-link text-lg text-theme-soft py-2">Home</a>
          <a href="../../../../index.html#products" class="mobile-nav-link text-lg text-theme-soft py-2">Products</a>
          <a href="../../../../index.html#services" class="mobile-nav-link text-lg text-theme-soft py-2">Services</a>
          <a href="../../../../index.html#vision" class="mobile-nav-link text-lg text-theme-soft py-2">Philosophy</a>
          <a href="../../../../index.html#team" class="mobile-nav-link text-lg text-theme-soft py-2">Team</a>
          <a href="../../../../index.html#lab" class="mobile-nav-link text-lg text-theme-soft py-2">Lab</a>
          <a href="../../../../index.html#testimonials" class="mobile-nav-link text-lg text-theme-soft py-2">Testimonials</a>
          <a href="../../../../index.html#careers" class="mobile-nav-link text-lg text-theme-soft py-2">Careers</a>
          <a href="../../../../index.html#contact" class="mobile-nav-link text-lg text-theme-soft py-2">Contact</a>
        </div>
        <div class="drawer-contact-row mt-auto pt-6 flex flex-col gap-3"><a href="../../../../index.html#contact" class="btn-primary magnetic-btn text-center w-full">Contact</a></div>
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
        <a href="../../../../index.html#services" class="bottom-nav-item flex flex-col items-center gap-0.5 text-theme-faint hover:text-brand-300 transition-colors min-w-[64px] py-1">
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
          <span class="text-xs font-bold px-3 py-1 rounded-full bg-brand-500/20 text-brand-200 uppercase tracking-wide">Chapter {NUM}</span>
          <span class="h-px flex-1 bg-gradient-to-r from-brand-500/30 to-transparent"></span>
        </div>

        <h1 class="section-title text-3xl tracking-tight leading-tight lg:text-5xl">{TITLE}</h1>
        <p class="mt-2.5 text-[15px] lg:mt-4 lg:text-xl text-brand-200">{SUBTITLE}</p>

        <section class="mt-8 lg:mt-12 reveal" id="introduction">
          <div class="glass-panel p-6 lg:p-8">
            <h2 class="text-2xl font-display font-bold lg:text-3xl lesson-heading">Introduction</h2>
            <p class="mt-4 text-theme-muted leading-relaxed text-[15px] lg:text-base">
              {DEF}
            </p>
            <p class="mt-3 text-theme-muted leading-relaxed text-[15px] lg:text-base">
              This concept is essential to understanding how modern robots interpret and interact with the physical world. By converting real-world signals into data the controller can process, {TITLE_LOWER} bridges the gap between the physical and digital domains.
            </p>
            <p class="mt-3 text-theme-muted leading-relaxed text-[15px] lg:text-base">
              In this chapter, you'll explore what makes this technology tick, how it follows a consistent sense-think-act cycle, and what role it plays in building intelligent machines.
            </p>
          </div>
        </section>

        <section class="mt-6 lg:mt-10 reveal" id="how-it-works">
          <div class="glass-panel p-6 lg:p-8">
            <h2 class="text-2xl font-display font-bold lg:text-3xl lesson-heading">How It Works</h2>

            <div class="mt-4 p-5 rounded-xl bg-brand-500/[0.03] border border-brand-500/10">
              <p class="text-sm text-theme-muted">{TITLE} works by converting physical measurements into electrical signals that a microcontroller can interpret and act upon.</p>
            </div>

            <div class="mt-5 p-5 rounded-xl bg-brand-500/[0.03] border border-brand-500/10">
              <p class="text-sm font-semibold text-brand-200 mb-3">Everyday Object Analogy</p>
              <p class="text-sm text-theme-muted">Think of {TITLE_LOWER} like your sense of touch. When you touch a hot surface, your skin's nerves (sensors) send an electrical signal to your brain (controller). Your brain processes this input and tells your hand to pull away (actuator action). {TITLE} follows the same fundamental loop: sense, process, act.</p>
            </div>

            <h3 class="mt-8 text-xl font-display font-bold lg:text-2xl">The Sense-Think-Act Cycle</h3>
            <p class="mt-3 text-theme-muted leading-relaxed text-[15px] lg:text-base">
              Every robotic operation follows this three-step pattern:
            </p>
            <div class="mt-5 grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div class="glass-panel p-5 rounded-xl text-center border border-brand-500/10">
                <div class="w-12 h-12 rounded-xl bg-brand-500/10 flex items-center justify-center mx-auto mb-3">
                  <svg class="w-6 h-6 text-brand-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122"/></svg>
                </div>
                <h4 class="font-display font-semibold text-base text-brand-200">1. Sense</h4>
                <p class="mt-2 text-sm text-theme-muted">Sensors measure physical properties like light, distance, or pressure and convert them to voltage.</p>
              </div>
              <div class="glass-panel p-5 rounded-xl text-center border border-brand-500/10">
                <div class="w-12 h-12 rounded-xl bg-brand-500/10 flex items-center justify-center mx-auto mb-3">
                  <svg class="w-6 h-6 text-brand-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>
                </div>
                <h4 class="font-display font-semibold text-base text-brand-200">2. Think</h4>
                <p class="mt-2 text-sm text-theme-muted">The controller runs logic to interpret the sensor data and decide what action to take.</p>
              </div>
              <div class="glass-panel p-5 rounded-xl text-center border border-brand-500/10">
                <div class="w-12 h-12 rounded-xl bg-brand-500/10 flex items-center justify-center mx-auto mb-3">
                  <svg class="w-6 h-6 text-brand-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/></svg>
                </div>
                <h4 class="font-display font-semibold text-base text-brand-200">3. Act</h4>
                <p class="mt-2 text-sm text-theme-muted">The controller sends signals to actuators (motors) to move, turn, or manipulate the environment.</p>
              </div>
            </div>

            <h3 class="mt-8 text-xl font-display font-bold lg:text-2xl">Key Components</h3>
            <p class="mt-3 text-theme-muted leading-relaxed text-[15px] lg:text-base">
              {TITLE} relies on several subsystems working together:
            </p>
            <div class="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div class="glass-panel p-4 rounded-xl border border-brand-500/10">
                <p class="text-sm font-semibold text-brand-200 mb-1">Sensor Module</p>
                <p class="text-sm text-theme-muted">Detects physical changes and converts them to variable voltage signals for the controller.</p>
              </div>
              <div class="glass-panel p-4 rounded-xl border border-brand-500/10">
                <p class="text-sm font-semibold text-brand-200 mb-1">Microcontroller</p>
                <p class="text-sm text-theme-muted">The robot's brain that executes code to read sensor values, apply logic, and control outputs.</p>
              </div>
              <div class="glass-panel p-4 rounded-xl border border-brand-500/10">
                <p class="text-sm font-semibold text-brand-200 mb-1">Signal Conditioning</p>
                <p class="text-sm text-theme-muted">Filters and amplifiers that clean up raw sensor signals before the controller reads them.</p>
              </div>
              <div class="glass-panel p-4 rounded-xl border border-brand-500/10">
                <p class="text-sm font-semibold text-brand-200 mb-1">Actuator Interface</p>
                <p class="text-sm text-theme-muted">Motor drivers and power electronics that convert low-voltage control signals into high-power movement.</p>
              </div>
            </div>

            <h3 class="mt-8 text-xl font-display font-bold lg:text-2xl">Deeper Dive</h3>
            <p class="mt-3 text-theme-muted leading-relaxed text-[15px] lg:text-base">
              {TITLE} is not a single technology but a category of techniques and components. Different applications require different sensor types, sampling rates, and signal processing methods. A factory robot arm may check its touch sensors hundreds of times per second, while a Mars rover may run complex sensor fusion algorithms to navigate.
            </p>
            <p class="mt-3 text-theme-muted leading-relaxed text-[15px] lg:text-base">
              What separates a simple machine from a robot is this closed-loop interaction with the environment. A toaster just runs a timer; a robot constantly adjusts its behavior based on what its sensors detect. This feedback loop is what makes robots adaptive and intelligent.
            </p>
            <p class="mt-3 text-theme-muted leading-relaxed text-[15px] lg:text-base">
              When a robot's sensor reading falls outside expected ranges, the controller can trigger error-handling routines: stopping motors, sounding alarms, or switching to a safe mode. This self-monitoring capability is critical for safe autonomous operation.
            </p>

            <div class="mt-5 p-4 rounded-xl bg-brand-500/[0.03] border border-brand-500/10">
              <p class="text-sm font-semibold text-brand-200 mb-2">Key Insight</p>
              <p class="text-sm text-theme-muted">{TITLE} is the bridge between the physical and digital worlds. Without sensors, robots would be blind. Without controllers, they would be unable to make decisions. Without actuators, they could not act. All three must work together.</p>
            </div>
            <h3 class="mt-8 text-xl font-display font-bold lg:text-2xl">Advanced</h3>
            <p class="mt-3 text-theme-muted leading-relaxed text-[15px] lg:text-base">
              At a deeper level, {TITLE_LOWER} follows standards and patterns used by engineers worldwide. Pulse Width Modulation (PWM) controls motor speed. Analog-to-digital converters (ADCs) translate sensor voltages into numeric values. Communication protocols like I2C and SPI let controllers talk to multiple sensors and actuators.
            </p>
            <p class="mt-3 text-theme-muted leading-relaxed text-[15px] lg:text-base">
              Modern systems often use filtering algorithms like Kalman filters to smooth noisy sensor readings and estimate the robot's state more accurately. PID (Proportional-Integral-Derivative) controllers use feedback loops to maintain precise motor speeds and positions.
            </p>
            <p class="mt-3 text-theme-muted leading-relaxed text-[15px] lg:text-base">
              Scientists and engineers keep improving these systems every year, making them faster, safer, and more energy-efficient. The concepts in this chapter are the same building blocks used in autonomous vehicles, surgical robots, and space exploration probes around the world.
            </p></div>
        </section>

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
                  <tr id="vocab-{SLUG}"><td><span class="vocab cursor-pointer" onclick="scrollToVocabulary('{SLUG}')">{TITLE}</span></td><td>A core robotics concept that enables machines to sense, think, and act in the physical world.</td></tr>
                  <tr id="vocab-sensor"><td><span class="vocab cursor-pointer" onclick="scrollToVocabulary('sensor')">Sensor</span></td><td>A device that detects physical properties and converts them into electrical signals.</td></tr>
                  <tr id="vocab-controller"><td><span class="vocab cursor-pointer" onclick="scrollToVocabulary('controller')">Controller</span></td><td>The microcontroller or computer that processes sensor data and makes decisions.</td></tr>
                  <tr id="vocab-actuator"><td><span class="vocab cursor-pointer" onclick="scrollToVocabulary('actuator')">Actuator</span></td><td>A mechanism (such as a motor) that produces physical movement in response to control signals.</td></tr>
                  <tr id="vocab-voltage-signal"><td><span class="vocab cursor-pointer" onclick="scrollToVocabulary('voltage-signal')">Voltage Signal</span></td><td>An electrical representation of a physical measurement, varying in amplitude based on the detected value.</td></tr>
                  <tr id="vocab-microcontroller"><td><span class="vocab cursor-pointer" onclick="scrollToVocabulary('microcontroller')">Microcontroller</span></td><td>A compact integrated circuit designed to govern a specific operation in an embedded system.</td></tr>
                  <tr id="vocab-feedback-loop"><td><span class="vocab cursor-pointer" onclick="scrollToVocabulary('feedback-loop')">Feedback Loop</span></td><td>A continuous cycle where sensor readings influence actuator commands in real time.</td></tr>
                  <tr id="vocab-pwm"><td><span class="vocab cursor-pointer" onclick="scrollToVocabulary('pwm')">PWM (Pulse Width Modulation)</span></td><td>A technique for controlling motor speed by varying the duty cycle of a digital signal.</td></tr>
                </tbody>
              </table>
            </div>
          </div>
        </section>

        <section class="mt-6 lg:mt-10 reveal" id="fun-facts">
          <div class="glass-panel p-6 lg:p-8">
            <h2 class="text-2xl font-display font-bold lg:text-3xl lesson-heading">Fun Facts</h2>
            <div class="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div class="glass-panel p-5 rounded-xl bg-brand-500/[0.02] border border-brand-500/10">
                <div class="w-10 h-10 rounded-lg bg-brand-500/10 flex items-center justify-center mb-3">
                  <svg class="w-5 h-5 text-brand-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>
                </div>
                <p class="text-sm text-theme-muted">The word 'robot' comes from the Czech word 'robota', meaning 'forced labor'. It first appeared in a 1920 play by Karel Capek.</p>
              </div>
              <div class="glass-panel p-5 rounded-xl bg-brand-500/[0.02] border border-brand-500/10">
                <div class="w-10 h-10 rounded-lg bg-brand-500/10 flex items-center justify-center mb-3">
                  <svg class="w-5 h-5 text-brand-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>
                </div>
                <p class="text-sm text-theme-muted">The first industrial robot, Unimate, began work on a General Motors assembly line in 1961 lifting hot metal parts.</p>
              </div>
              <div class="glass-panel p-5 rounded-xl bg-brand-500/[0.02] border border-brand-500/10">
                <div class="w-10 h-10 rounded-lg bg-brand-500/10 flex items-center justify-center mb-3">
                  <svg class="w-5 h-5 text-brand-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>
                </div>
                <p class="text-sm text-theme-muted">NASA's Curiosity Rover has explored Mars autonomously since 2012, using sensors to navigate craters and sand traps.</p>
              </div>
              <div class="glass-panel p-5 rounded-xl bg-brand-500/[0.02] border border-brand-500/10">
                <div class="w-10 h-10 rounded-lg bg-brand-500/10 flex items-center justify-center mb-3">
                  <svg class="w-5 h-5 text-brand-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>
                </div>
                <p class="text-sm text-theme-muted">Over 80% of modern factories use robotic systems with sensors and controllers to automate precision manufacturing.</p>
              </div>
              <div class="glass-panel p-5 rounded-xl bg-brand-500/[0.02] border border-brand-500/10">
                <div class="w-10 h-10 rounded-lg bg-brand-500/10 flex items-center justify-center mb-3">
                  <svg class="w-5 h-5 text-brand-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>
                </div>
                <p class="text-sm text-theme-muted">Modern micro-sensors are so small they can fit inside a wristwatch, enabling wearable health monitoring and motion tracking.</p>
              </div>
            </div>
          </div>
        </section>

        <!-- Interactive Diagram -->
        <section class="mt-6 lg:mt-10 reveal" id="interactive-diagram">
          <div class="glass-panel p-6 lg:p-8 text-center">
            <h2 class="text-2xl font-display font-bold lg:text-3xl lesson-heading">Interactive Diagram</h2>
            <p class="mt-4 text-theme-muted">Launch the interactive diagram to see this in action.</p>
            <a href="diagrams/{DIAG}/index.html" class="btn-primary magnetic-btn inline-flex items-center gap-2 text-sm py-3 px-6 mt-4" aria-label="Open interactive diagram">
              Open Interactive Diagram
              <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
            </a>
          </div>
        </section>

        <section class="mt-6 lg:mt-10 reveal" id="knowledge-check">
          <div class="glass-panel p-6 lg:p-8">
            <h2 class="text-2xl font-display font-bold lg:text-3xl lesson-heading">Knowledge Check</h2>

            <div class="mt-6 space-y-6">

              <div class="kb-check">
                <p class="text-sm font-semibold text-theme">1. What are the three core actions in the robotic sense-think-act cycle?</p>
                <div class="mt-2 space-y-2 text-sm text-theme-muted">
                  <label class="flex items-center gap-2 cursor-pointer"><input type="radio" name="mcq1" class="accent-brand-500"> Speak, Write, Read</label>
                  <label class="flex items-center gap-2 cursor-pointer"><input type="radio" name="mcq1" class="accent-brand-500"> Sense, Think, Act</label>
                  <label class="flex items-center gap-2 cursor-pointer"><input type="radio" name="mcq1" class="accent-brand-500"> Plug, Turn, Run</label>
                  <label class="flex items-center gap-2 cursor-pointer"><input type="radio" name="mcq1" class="accent-brand-500"> Build, Connect, Deploy</label>
                </div>
                <p class="mt-2 text-xs text-green-400 kb-answer"><strong>Answer:</strong> Sense, Think, Act</p>
              </div>

              <div class="kb-check">
                <p class="text-sm font-semibold text-theme">2. Which component acts as a robot's brain?</p>
                <div class="mt-2 space-y-2 text-sm text-theme-muted">
                  <label class="flex items-center gap-2 cursor-pointer"><input type="radio" name="mcq2" class="accent-brand-500"> Sensor</label>
                  <label class="flex items-center gap-2 cursor-pointer"><input type="radio" name="mcq2" class="accent-brand-500"> Actuator</label>
                  <label class="flex items-center gap-2 cursor-pointer"><input type="radio" name="mcq2" class="accent-brand-500"> Controller / Microcontroller</label>
                  <label class="flex items-center gap-2 cursor-pointer"><input type="radio" name="mcq2" class="accent-brand-500"> Chassis</label>
                </div>
                <p class="mt-2 text-xs text-green-400 kb-answer"><strong>Answer:</strong> Controller / Microcontroller</p>
              </div>

              <div class="kb-check">
                <p class="text-sm font-semibold text-theme">3. What does a sensor do?</p>
                <div class="mt-2 space-y-2 text-sm text-theme-muted">
                  <label class="flex items-center gap-2 cursor-pointer"><input type="radio" name="mcq3" class="accent-brand-500"> It stores electricity</label>
                  <label class="flex items-center gap-2 cursor-pointer"><input type="radio" name="mcq3" class="accent-brand-500"> It converts physical properties into electrical signals</label>
                  <label class="flex items-center gap-2 cursor-pointer"><input type="radio" name="mcq3" class="accent-brand-500"> It moves the robot's wheels</label>
                  <label class="flex items-center gap-2 cursor-pointer"><input type="radio" name="mcq3" class="accent-brand-500"> It displays information on a screen</label>
                </div>
                <p class="mt-2 text-xs text-green-400 kb-answer"><strong>Answer:</strong> It converts physical properties into electrical signals</p>
              </div>

            </div>

            <div class="mt-6 text-center">
              <button type="button" id="reveal-answers-btn" class="btn-primary magnetic-btn text-sm py-2.5 px-6">Show Answers</button>
            </div>

            <script>
              (function() {
                var btn = document.getElementById('reveal-answers-btn');
                if (btn) {
                  btn.addEventListener('click', function() {
                    var answers = document.querySelectorAll('.kb-answer');
                    var hidden = false;
                    answers.forEach(function(a) {
                      if (!a.classList.contains('revealed')) hidden = true;
                    });
                    answers.forEach(function(a) {
                      a.classList.toggle('revealed', hidden);
                    });
                    btn.textContent = hidden ? 'Hide Answers' : 'Show Answers';
                  });
                }
              })();
            </script>
          </div>
        </section>

        <section class="mt-12 lg:mt-20 reveal">
          <div class="glass-panel p-6 lg:p-8">
            <p class="text-xs font-semibold uppercase tracking-wider text-theme-faint text-center mb-4">Chapter Navigation</p>
            <div class="flex justify-center">
              <a href="{NEXT}" class="btn-primary magnetic-btn inline-flex items-center gap-2 text-sm py-3 px-6">
                Next: Chapter {NUM_NEXT} &mdash; {NEXT_TITLE}
                <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
              </a>
            </div>
          </div>
          <div class="flex flex-col sm:flex-row justify-between items-center gap-4 pt-8 border-t border-theme">
            <a href="how-robots-work.html" class="text-sm text-brand-300 hover:text-theme transition-colors inline-flex items-center gap-1">&larr; Back to Module Overview</a>
            <p class="text-xs text-theme-faint">Consica Academy &middot; Explorer Pack &middot; Module 7 &middot; Chapter {NUM}</p>
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

</html>
'@

foreach ($ch in $chapters) {
    $num = $ch.num
    $nextNum = ($num -as [int]) + 1
    $content = $head
    $content = $content.Replace("{NUM}", $num)
    $content = $content.Replace("{NUM_NEXT}", $nextNum.ToString())
    $content = $content.Replace("{TITLE}", $ch.title)
    $content = $content.Replace("{TITLE_LOWER}", $ch.title.ToLower())
    $content = $content.Replace("{SUBTITLE}", $ch.subtitle)
    $content = $content.Replace("{DESC}", $ch.desc)
    $content = $content.Replace("{DEF}", $ch.def)
    $content = $content.Replace("{DIAG}", $ch.diag)
    $content = $content.Replace("{SLUG}", $ch.slug)
    $content = $content.Replace("{NEXT}", $ch.next)
    $content = $content.Replace("{NEXT_TITLE}", $ch.nextTitle)
    
    # Special case for last chapter
    if ($ch.next -eq "how-robots-work.html") {
        # For last chapter, next button goes to module overview
        $content = $content.Replace('Next: Chapter ' + $nextNum + ' &mdash; ' + $ch.nextTitle, 'Back to Module Overview')
        $content = $content.Replace('<a href="how-robots-work.html" class="btn-primary magnetic-btn inline-flex items-center gap-2 text-sm py-3 px-6">', '<a href="how-robots-work.html" class="btn-primary magnetic-btn inline-flex items-center gap-2 text-sm py-3 px-6">')
    }
    
    $filePath = Join-Path $moduleDir "chapter-$($num)-*.html"
    $existingFile = Get-ChildItem $filePath | Select-Object -First 1
    if ($existingFile) {
        $content | Set-Content -Path $existingFile.FullName -NoNewline
        Write-Output "Restructured: $($existingFile.Name)"
    }
}

Write-Output "All 14 chapter files have been restructured."
