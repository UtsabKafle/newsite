(function(){'use strict';
var components = [
  {id:"core",name:"CPU Core",category:"Processing",x:50,y:50,w:100,h:50,purpose:"Executes program instructions independently, enabling parallel processing",description:"Each core is an independent processing unit that can fetch, decode, and execute instructions separately, allowing multiple tasks to run simultaneously.",why:"Multiple cores enable multitasking and parallel processing for better performance",analogy:"Like having multiple chefs in a kitchen, each cooking a different dish",funFact:"Some CPUs now have over 100 cores for server workloads",takeaway:"More cores improve performance for multi-threaded applications",mistake:"A dual-core CPU isn\\'t necessarily slower than a quad-core for single-threaded tasks",descriptionDetailed:"Each core has its own L1/L2 cache, ALU, and control unit. Cores share L3 cache and memory controller. Hyper-Threading makes one physical core appear as two logical cores to the OS. Core count scaling depends on software multi-threading."},
  {id:"cache",name:"CPU Cache",category:"Memory",x:200,y:50,w:100,h:50,purpose:"Ultra-fast on-chip memory that stores frequently accessed data",description:"CPU cache is small, high-speed SRAM memory located on the CPU die that holds copies of recently used data and instructions from main memory.",why:"Cache reduces the performance penalty of accessing slow main memory",analogy:"Like a small bedside table holding tonight\\'s reading instead of walking to the library",funFact:"L1 cache operates at the same speed as the CPU core",takeaway:"Larger cache typically improves performance but costs more to manufacture",mistake:"Cache is not the same as RAM—it\\'s much faster, smaller, and built into the CPU",descriptionDetailed:"Modern CPUs have three cache levels: L1 (32-64KB per core, ~1ns), L2 (256-512KB per core, ~3ns), L3 (4-32MB shared, ~10ns). Cache uses SRAM which is faster but more expensive than DRAM. Cache coherence protocols keep data consistent across cores."},
  {id:"bus",name:"CPU Bus Interface",category:"Processing",x:200,y:150,w:100,h:50,purpose:"Connects the CPU to the rest of the system through data and control pathways",description:"The bus interface manages communication between the CPU, memory controller, PCIe controller, and chipset through high-speed interconnects.",why:"The bus interface is the CPU\\'s connection to all external components",analogy:"Like a city\\'s bridges and tunnels connecting different districts",funFact:"AMD\\'s Infinity Fabric interconnect runs at speeds up to 64 GB/s",takeaway:"The bus interface speed affects how fast data moves between CPU and peripherals",mistake:"The internal CPU bus is much faster than the external system bus",descriptionDetailed:"Modern CPUs use direct interconnects like Intel\\'s Ring Bus or Mesh architecture, and AMD\\'s Infinity Fabric. These connect cores, cache, memory controller, and I/O. PCIe lanes connect directly to the CPU for GPU and NVMe storage."},
  {id:"memory",name:"Memory Controller",category:"Memory",x:50,y:150,w:100,h:50,purpose:"Manages read/write operations to system RAM",description:"The integrated memory controller (IMC) is built into the CPU and controls communication with DDR4/DDR5 RAM modules, handling timings and data rates.",why:"Integrating the memory controller into the CPU reduces latency significantly",analogy:"Like a dispatcher who directs all incoming and outgoing messages",funFact:"The memory controller was on the motherboard chipset until AMD integrated it in 2003",takeaway:"The memory controller determines supported RAM types and maximum capacity",mistake:"The memory controller doesn\\'t add storage—it manages access to RAM",descriptionDetailed:"The IMC supports specific DDR generations and speeds. It manages dual/quad channel configurations. Each channel has its own 64-bit data path. The IMC also handles memory timing, refresh, and voltage control."},
  {id:"io",name:"I/O Controller",category:"Processing",x:50,y:250,w:100,h:50,purpose:"Manages data transfer between the CPU and peripheral devices",description:"The I/O controller handles communication with devices like storage, USB, network, and expansion cards through PCIe lanes and DMI buses.",why:"The I/O controller manages all data entering and leaving the CPU",analogy:"Like an airport control tower managing all incoming and outgoing flights",funFact:"Modern CPUs have up to 28 PCIe lanes connected directly to the CPU",takeaway:"I/O bandwidth affects real-world performance for storage and data-intensive tasks",mistake:"All PCIe lanes aren\\'t identical—some connect to the CPU, others to the chipset",descriptionDetailed:"Direct CPU PCIe lanes connect to GPU and NVMe drives for lowest latency. DMI bus connects CPU to chipset for other I/O. USB, SATA, and legacy devices go through the chipset."},
  {id:"frequency",name:"Clock Frequency",category:"Processing",x:200,y:250,w:100,h:50,purpose:"Determines how many instructions the CPU can execute per second",description:"Clock frequency, measured in GHz, sets the number of clock cycles per second, with each cycle enabling one or more instruction steps.",why:"Higher frequency generally means faster CPU performance",analogy:"Like a metronome that sets the tempo for a musician",funFact:"The first PC CPU (Intel 8086) ran at 5 MHz—modern CPUs run at over 5,000 MHz",takeaway:"Frequency is measured in GHz, but isn\\'t the only factor determining CPU speed",mistake:"A higher clock speed doesn\\'t always mean better performance—architecture matters as much",descriptionDetailed:"Frequency is determined by the base clock multiplied by a multiplier. All cores may not achieve the same maximum frequency. Turbo Boost automatically increases frequency when thermal and power limits allow. Overclocking increases frequency beyond stock settings."}
];
var connections = [{from:"core",to:"cache"},{from:"cache",to:"bus"},{from:"bus",to:"memory"},{from:"memory",to:"io"},{from:"io",to:"frequency"}];
var steps = [{id:"core",label:"Step 1: CPU Core",status:"Exploring: CPU Core - Executes program instructions independently, enabling parallel processing"},{id:"cache",label:"Step 2: CPU Cache",status:"Exploring: CPU Cache - Ultra-fast on-chip memory that stores frequently accessed data"},{id:"bus",label:"Step 3: CPU Bus Interface",status:"Exploring: CPU Bus Interface - Connects the CPU to the rest of the system through data and control pathways"},{id:"memory",label:"Step 4: Memory Controller",status:"Exploring: Memory Controller - Manages read/write operations to system RAM"},{id:"io",label:"Step 5: I/O Controller",status:"Exploring: I/O Controller - Manages data transfer between the CPU and peripheral devices"},{id:"frequency",label:"Step 6: Clock Frequency",status:"Exploring: Clock Frequency - Determines how many instructions the CPU can execute per second"}];
var tour = [{title:"CPU Core",description:"Executes program instructions independently, enabling parallel processing",componentId:"core"},{title:"CPU Cache",description:"Ultra-fast on-chip memory that stores frequently accessed data",componentId:"cache"},{title:"CPU Bus Interface",description:"Connects the CPU to the rest of the system through data and control pathways",componentId:"bus"},{title:"Memory Controller",description:"Manages read/write operations to system RAM",componentId:"memory"},{title:"I/O Controller",description:"Manages data transfer between the CPU and peripheral devices",componentId:"io"},{title:"Clock Frequency",description:"Determines how many instructions the CPU can execute per second",componentId:"frequency"}];

function initCpuChallenge(container, engine) {
  var isZoomed = false;
  var currentTarget = "core0"; // "die", "core0"
  var challengeCompleted = false;

  container.innerHTML = `
    <div class="sim-interactive-area" style="padding: 16px; display: flex; flex-direction: column; gap: 12px; width: 100%;">
      <div style="display:flex; justify-content:space-between; align-items:center;">
        <div style="font-size: 14px; font-weight:700; color: #60a5fa;">CPU Core Microarchitecture Zoom Lab</div>
        <button class="act-btn" id="btn-zoom-out" style="padding:4px 10px; font-size:11px;" disabled>🔍 Zoom Out</button>
      </div>
      <p style="font-size: 11px; color:#cbd5e1; margin-bottom: 4px;">Click on <strong>CPU Core 0</strong> to zoom into its silicon layout. Once zoomed, click on the mathematical processor engine to solve the challenge.</p>
      
      <div style="display: flex; gap: 16px; flex-direction: row; flex-wrap: wrap; justify-content: center; align-items: flex-start; width: 100%;">
        <!-- SVG Die -->
        <div style="flex: 1.2; min-width: 280px; max-width: 450px;">
          <svg id="cpu-die-svg" viewBox="0 0 600 500" style="width:100%; height:auto; background:#0b0f19; border:2px solid rgba(255,255,255,0.06); border-radius:12px; box-shadow:0 8px 30px rgba(0,0,0,0.5);">
            <!-- CPU Interconnect ring bus -->
            <rect x="30" y="30" width="540" height="440" fill="none" stroke="#2563eb" stroke-dasharray="8 8" opacity="0.3" stroke-width="2"></rect>

            <!-- L3 Cache Shared -->
            <g id="die-l3" style="cursor:default;">
              <rect x="40" y="290" width="520" height="70" rx="6" fill="#141c2e" stroke="#a855f7" stroke-width="1.5"></rect>
              <text x="300" y="330" text-anchor="middle" fill="#a855f7" font-size="14" font-weight="700" font-family="sans-serif">SHARED L3 CACHE (32 MB)</text>
            </g>

            <!-- Memory Controller -->
            <g id="die-imc" style="cursor:default;">
              <rect x="40" y="380" width="250" height="70" rx="6" fill="#141c2e" stroke="#10b981" stroke-width="1.5"></rect>
              <text x="165" y="420" text-anchor="middle" fill="#10b981" font-size="12" font-weight="700" font-family="sans-serif">INTEGRATED MEMORY CONTROLLER</text>
            </g>

            <!-- I/O Interface -->
            <g id="die-io" style="cursor:default;">
              <rect x="310" y="380" width="250" height="70" rx="6" fill="#141c2e" stroke="#eab308" stroke-width="1.5"></rect>
              <text x="435" y="420" text-anchor="middle" fill="#eab308" font-size="12" font-weight="700" font-family="sans-serif">SYSTEM I/O BUS CONTROLLER</text>
            </g>

            <!-- CPU Core 1 -->
            <g id="die-core1" style="cursor:default;">
              <rect x="330" y="40" width="230" height="230" rx="8" fill="#141c2e" stroke="#2563eb" stroke-width="1.5"></rect>
              <text x="445" y="150" text-anchor="middle" fill="#60a5fa" font-size="16" font-weight="700" font-family="sans-serif">CPU CORE 1</text>
              <text x="445" y="180" text-anchor="middle" fill="#4b5563" font-size="11" font-family="sans-serif">(Inactive / Idle State)</text>
            </g>

            <!-- CPU Core 0 (Clickable & Zoomable) -->
            <g id="die-core0" style="cursor:pointer;">
              <!-- Outer boundary -->
              <rect x="40" y="40" width="230" height="230" rx="8" fill="#1e293b" stroke="#3b82f6" stroke-width="2" id="rect-core0" style="transition:all 0.3s;"></rect>
              
              <!-- Zoomed Out Text -->
              <g id="core0-title-text">
                <text x="155" y="145" text-anchor="middle" fill="#60a5fa" font-size="16" font-weight="700" font-family="sans-serif">CPU CORE 0</text>
                <text x="155" y="175" text-anchor="middle" fill="#64748b" font-size="10" font-weight="600" font-family="sans-serif">CLICK TO ZOOM INNER STRUCTURE</text>
              </g>

              <!-- Zoomed In Detailed Silicon Submodules -->
              <g id="core0-details" opacity="0" style="pointer-events:none;">
                <!-- Control Unit (CU) -->
                <g class="sub-silicon-block" data-sub-id="cu" style="cursor:pointer; pointer-events:inherit;">
                  <rect x="50" y="55" width="95" height="95" rx="4" fill="#0f172a" stroke="#60a5fa" stroke-width="1.5" class="sub-rect-cu"></rect>
                  <text x="97" y="100" text-anchor="middle" fill="#60a5fa" font-size="10" font-weight="700" font-family="sans-serif">CONTROL UNIT</text>
                  <text x="97" y="115" text-anchor="middle" fill="#475569" font-size="8" font-family="sans-serif">Decodes Instructions</text>
                </g>

                <!-- Arithmetic Logic Unit (ALU) -->
                <g class="sub-silicon-block" data-sub-id="alu" style="cursor:pointer; pointer-events:inherit;">
                  <rect x="160" y="55" width="95" height="95" rx="4" fill="#0f172a" stroke="#f43f5e" stroke-width="1.5" class="sub-rect-alu"></rect>
                  <text x="207" y="100" text-anchor="middle" fill="#f43f5e" font-size="10" font-weight="700" font-family="sans-serif">ALU ENGINE</text>
                  <text x="207" y="115" text-anchor="middle" fill="#475569" font-size="8" font-family="sans-serif">Math & Logic Operations</text>
                </g>

                <!-- Registers -->
                <g class="sub-silicon-block" data-sub-id="registers" style="cursor:pointer; pointer-events:inherit;">
                  <rect x="50" y="165" width="95" height="95" rx="4" fill="#0f172a" stroke="#eab308" stroke-width="1.5" class="sub-rect-registers"></rect>
                  <text x="97" y="210" text-anchor="middle" fill="#eab308" font-size="10" font-weight="700" font-family="sans-serif">REGISTERS</text>
                  <text x="97" y="225" text-anchor="middle" fill="#475569" font-size="8" font-family="sans-serif">Register Files (R0-R7)</text>
                </g>

                <!-- L1/L2 Cache SRAM -->
                <g class="sub-silicon-block" data-sub-id="cache" style="cursor:pointer; pointer-events:inherit;">
                  <rect x="160" y="165" width="95" height="95" rx="4" fill="#0f172a" stroke="#a855f7" stroke-width="1.5" class="sub-rect-cache"></rect>
                  <text x="207" y="210" text-anchor="middle" fill="#a855f7" font-size="10" font-weight="700" font-family="sans-serif">L1/L2 CACHE</text>
                  <text x="207" y="225" text-anchor="middle" fill="#475569" font-size="8" font-family="sans-serif">SRAM Cache (L1 D+I)</text>
                </g>
              </g>
            </g>
          </svg>
        </div>

        <!-- Sidebar -->
        <div style="flex: 1; min-width: 240px; display:flex; flex-direction:column; gap:12px;">
          <div class="glass-panel" style="padding:12px; min-height:140px; display:flex; flex-direction:column; gap:6px;">
            <span style="font-size:10px; font-weight:bold; color:#64748b; text-transform:uppercase;">Simulation Instructions</span>
            <div id="cpu-prompt-text" style="font-size:12px; color:#e2e8f0; line-height:1.4;">
              Click on **CPU Core 0** inside the CPU Die layout diagram to zoom in and check its inner micro-architecture layout structure.
            </div>
          </div>
          
          <div class="glass-panel" style="padding:12px; background:rgba(0,0,0,0.25); min-height:60px; font-size:11px;">
            <div id="cpu-feedback" style="color:#94a3b8; font-weight:500;">Ready to execute.</div>
          </div>
        </div>
      </div>
    </div>
  `;

  var svg = container.querySelector('#cpu-die-svg');
  var core0 = container.querySelector('#die-core0');
  var zoomBtn = container.querySelector('#btn-zoom-out');
  var promptText = container.querySelector('#cpu-prompt-text');
  var feedback = container.querySelector('#cpu-feedback');
  var core0Details = container.querySelector('#core0-details');
  var core0Title = container.querySelector('#core0-title-text');
  var subBlocks = container.querySelectorAll('.sub-silicon-block');

  core0.addEventListener('click', function(e) {
    if (!isZoomed) {
      zoomIn();
    }
  });

  zoomBtn.addEventListener('click', function() {
    zoomOut();
  });

  subBlocks.forEach(function(sb) {
    sb.addEventListener('click', function(e) {
      e.stopPropagation(); // Prevent re-triggering core0 click
      if (!isZoomed) return;
      var subId = this.dataset.subId;
      evaluateClick(subId);
    });
  });

  function zoomIn() {
    isZoomed = true;
    currentTarget = "core0";
    zoomBtn.disabled = false;
    
    // Smooth transition
    animateViewBox(40, 40, 230, 230);
    
    // Toggle details visibility
    core0Details.setAttribute('opacity', '1');
    core0Details.style.pointerEvents = 'inherit';
    core0Title.setAttribute('opacity', '0');

    promptText.innerHTML = `
      🔍 <strong>Zoomed into Core 0:</strong><br>
      You are executing a binary mathematical instruction (e.g. <code>ADD R1, R2</code>).<br><br>
      Identify and click the <strong>Arithmetic Logic Unit (ALU)</strong> block responsible for calculating integer addition operations.
    `;
    feedback.style.color = '#3b82f6';
    feedback.textContent = `Inspecting Core 0 details: Control Unit, ALU, Registers, Cache.`;
    engine._setStatus('Zoomed into Core 0 details');
  }

  function zoomOut() {
    isZoomed = false;
    currentTarget = "die";
    zoomBtn.disabled = true;
    
    // Smooth transition back
    animateViewBox(0, 0, 600, 500);
    
    // Toggle details visibility back
    core0Details.setAttribute('opacity', '0');
    core0Details.style.pointerEvents = 'none';
    core0Title.setAttribute('opacity', '1');

    promptText.innerHTML = `
      Click on <strong>CPU Core 0</strong> inside the CPU Die layout diagram to zoom in and check its inner micro-architecture layout structure.
    `;
    feedback.style.color = '#94a3b8';
    feedback.textContent = `Zoomed out to main CPU Die view.`;
    engine._setStatus('Zoomed out to CPU Die');
    
    // Reset selections
    subBlocks.forEach(b => {
      var rect = b.querySelector('rect');
      rect.setAttribute('stroke-width', '1.5');
    });
  }

  function evaluateClick(subId) {
    if (challengeCompleted) return;

    subBlocks.forEach(b => {
      var rect = b.querySelector('rect');
      rect.setAttribute('stroke-width', '1.5');
    });

    var rect = container.querySelector(`.sub-rect-${subId}`);

    if (subId === 'alu') {
      challengeCompleted = true;
      if (rect) {
        rect.setAttribute('stroke-width', '3px');
        rect.setAttribute('stroke', '#10b981');
        rect.setAttribute('fill', 'rgba(16,185,129,0.1)');
      }
      feedback.style.color = '#10b981';
      feedback.innerHTML = `🎉 <strong>Correct!</strong> The ALU (Arithmetic Logic Unit) executes the binary calculation. Math instruction completed.`;
      engine._setStatus('CPU zoom challenge successfully complete');
      engine.markCompleted();
    } else {
      if (rect) {
        rect.setAttribute('stroke-width', '3px');
        rect.setAttribute('stroke', '#ef4444');
        setTimeout(() => {
          if (!challengeCompleted) {
            var colors = { cu: "#60a5fa", registers: "#eab308", cache: "#a855f7" };
            rect.setAttribute('stroke-width', '1.5');
            rect.setAttribute('stroke', colors[subId] || '#cbd5e1');
          }
        }, 1200);
      }
      feedback.style.color = '#ef4444';
      var expl = "Try again!";
      if (subId === 'cu') expl = "The Control Unit decodes assembly instructions and directs data paths, but does not perform binary math.";
      if (subId === 'registers') expl = "Registers provide ultra-fast temporary storage locations for data inputs, but they do not add values themselves.";
      if (subId === 'cache') expl = "Cache stores copies of memory lines for quick retrieval, not for executing CPU logic operations.";
      
      feedback.textContent = `❌ ${expl}`;
    }
  }

  function animateViewBox(targetX, targetY, targetW, targetH) {
    var current = svg.getAttribute('viewBox').split(' ').map(Number);
    var startX = current[0], startY = current[1], startW = current[2], startH = current[3];
    var duration = 400; // ms
    var start = null;
    
    function step(timestamp) {
      if (!start) start = timestamp;
      var elapsed = timestamp - start;
      var progress = Math.min(elapsed / duration, 1);
      // Easing function (easeOutCubic)
      var ease = 1 - Math.pow(1 - progress, 3);
      
      var x = startX + (targetX - startX) * ease;
      var y = startY + (targetY - startY) * ease;
      var w = startW + (targetW - startW) * ease;
      var h = startH + (targetH - startH) * ease;
      
      svg.setAttribute('viewBox', `${x} ${y} ${w} ${h}`);
      if (progress < 1) {
        requestAnimationFrame(step);
      }
    }
    requestAnimationFrame(step);
  }
}

deferInit(function(){
  new DiagramEngine({
    title: 'Cpu Intro',
    subtitle: 'CPU Components',
    desc: 'Explore the core components that make up a modern CPU.',
    module: 4,
    difficulty: 'Advanced',
    time: '10',
    objectives: 'Explore the core components that make up a modern CPU.',
    components: components,
    connections: connections,
    steps: steps,
    tour: tour,
    
    render: function(container, engine) {
      engine.buildVisual(container);
      engine._setStatus('Click any component to learn more');
    },
    
    customChallenge: function(container, engine) {
      initCpuChallenge(container, engine);
    },
    
    animate: function(engine) {},
    onReplay: function(engine) {
      engine.t = 0;
    }
  });
});
})();