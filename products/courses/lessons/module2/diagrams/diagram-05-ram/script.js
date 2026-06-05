(function(){'use strict';
var components = [
  {id:"dram",name:"DRAM Chip",category:"Memory",purpose:"Stores data as electrical charges in tiny capacitors that must be constantly refreshed",description:"Dynamic RAM stores each bit in a capacitor and transistor pair, where the capacitor holds a charge representing 1 or 0 but leaks over time.",why:"DRAM provides the main working memory that all programs run in",analogy:"Like a leaky bucket that needs constant refilling to keep its contents",funFact:"DRAM capacitors are so small that a single grain of salt could cover millions of them",takeaway:"DRAM is called dynamic because it must be refreshed thousands of times per second",mistake:"DRAM loses all data when power is turned off, unlike storage drives",descriptionDetailed:"Each DRAM cell has one transistor and one capacitor. The charge on the capacitor drains over milliseconds, so the memory controller must refresh every cell every 64ms. DRAM is organized in rows and columns accessed through RAS and CAS signals."},
  {id:"addressbus",name:"Memory Address Bus",category:"Memory",purpose:"Carries the memory address from the CPU to indicate which location to access",description:"The address bus is a set of wires that transmit the specific memory location the CPU wants to read from or write to.",why:"The address bus determines how much memory a CPU can address",analogy:"Like a postal address that tells the mail carrier which house to deliver to",funFact:"A 32-bit address bus can only address 4 GB of memory, which is why 64-bit CPUs were needed",takeaway:"The address bus width limits the maximum RAM the system can use",mistake:"The address bus doesn't carry data—it only carries the location for data",descriptionDetailed:"Each wire in the address bus carries one bit of the address. A 64-bit address bus allows 2^64 memory locations. The memory controller decodes the address into row and column signals for the DRAM array."},
  {id:"databus",name:"Data Bus",category:"Memory",purpose:"Transfers actual data between the CPU, memory, and peripherals",description:"The data bus carries the actual binary data being read from or written to memory, with its width determining how many bits transfer per cycle.",why:"The data bus width directly affects how much data can move per clock cycle",analogy:"Like the number of lanes on a highway determining how many cars can travel at once",funFact:"Modern CPUs have 64-bit data buses, transferring 8 bytes per memory access",takeaway:"A wider data bus means faster data transfer between CPU and RAM",mistake:"The data bus and address bus are separate—they carry different types of information",descriptionDetailed:"The data bus is bidirectional, allowing both reads and writes. Its width is typically equal to the CPU's word size. Modern systems use dual or quad memory channels to achieve wider total memory bandwidth."},
  {id:"controller",name:"Memory Controller",category:"Memory",purpose:"Manages read and write operations between the CPU and DRAM modules",description:"The memory controller interprets CPU memory requests, handles DRAM refresh cycles, and optimizes access patterns for performance.",why:"The memory controller is essential for reliable and efficient memory operation",analogy:"Like a librarian who manages book checkouts and returns, ensuring everything is organized",funFact:"Modern CPUs integrate the memory controller directly on the chip instead of on the motherboard chipset",takeaway:"The memory controller handles timing, refresh, and data routing between CPU and RAM",mistake:"The memory controller doesn't just route data—it also manages DRAM-specific protocols",descriptionDetailed:"The memory controller translates CPU requests into DRAM commands: activate row, read column, precharge. It schedules commands to maximize bandwidth through bank interleaving and open-page policies."},
  {id:"dimm",name:"DIMM Module",category:"Memory",purpose:"A physical circuit board that holds multiple DRAM chips and connects to the motherboard",description:"A Dual Inline Memory Module has DRAM chips soldered on both sides and an edge connector with contacts that plug into the motherboard slot.",why:"DIMMs package DRAM into standardized, replaceable modules",analogy:"Like a cartridge that holds multiple batteries together for easy installation",funFact:"The first DIMMs had 72 pins; modern DDR5 DIMMs have 288 pins",takeaway:"DIMMs are the physical form factor that makes RAM replaceable and upgradeable",mistake:"DDR3, DDR4, and DDR5 DIMMs are not interchangeable—they have different notch positions",descriptionDetailed:"A DIMM carries DRAM chips on a PCB with a 64-bit data bus (72-bit with ECC). The module has an SPD chip that tells the BIOS its timing and capacity. DDR transfers data on both rising and falling clock edges."}
];
var connections = [{from:"dram",to:"addressbus"},{from:"addressbus",to:"databus"},{from:"databus",to:"controller"},{from:"controller",to:"dimm"}];
var steps = [{id:"dram",label:"Step 1: DRAM Chip",status:"Exploring: DRAM Chip - Stores data as electrical charges in tiny capacitors that must be constantly refreshed"},{id:"addressbus",label:"Step 2: Memory Address Bus",status:"Exploring: Memory Address Bus - Carries the memory address from the CPU to indicate which location to access"},{id:"databus",label:"Step 3: Data Bus",status:"Exploring: Data Bus - Transfers actual data between the CPU, memory, and peripherals"},{id:"controller",label:"Step 4: Memory Controller",status:"Exploring: Memory Controller - Manages read and write operations between the CPU and DRAM modules"},{id:"dimm",label:"Step 5: DIMM Module",status:"Exploring: DIMM Module - A physical circuit board that holds multiple DRAM chips and connects to the motherboard"}];
var tour = [{title:"DRAM Chip",description:"Stores data as electrical charges in tiny capacitors that must be constantly refreshed",componentId:"dram"},{title:"Memory Address Bus",description:"Carries the memory address from the CPU to indicate which location to access",componentId:"addressbus"},{title:"Data Bus",description:"Transfers actual data between the CPU, memory, and peripherals",componentId:"databus"},{title:"Memory Controller",description:"Manages read and write operations between the CPU and DRAM modules",componentId:"controller"},{title:"DIMM Module",description:"A physical circuit board that holds multiple DRAM chips and connects to the motherboard",componentId:"dimm"}];

deferInit(function(){
  new DiagramEngine({
    title: 'Ram',
    subtitle: 'How Computers Work',
    desc: 'Learn how RAM provides fast temporary storage for active programs.',
    module: 2,
    difficulty: 'Beginner',
    time: '10',
    objectives: 'Learn how RAM provides fast temporary storage for programs.',
    components: components,
    connections: connections,
    steps: steps,
    tour: tour,

    render: function(container, engine) {
      engine.buildClickExplorer(container);
      engine._setStatus('Click any component to learn more');
    },

    animate: function(engine) {
      var svg = engine.el.visual.querySelector('svg');
      if (!svg || engine.selectedId || !engine.playing) return;
      var comps = svg.querySelectorAll('.component');
      var idx = Math.floor(engine.t * 0.5) % comps.length;
      comps.forEach(function(el, i) {
        var bg = el.querySelector('.component-bg');
        if (!bg) return;
        bg.setAttribute('fill', i === idx ? '#1e2d50' : '#1a2235');
        bg.setAttribute('stroke', i === idx ? '#0959C8' : '#2a3a55');
      });
    },

    customChallenge: function(container, engine) {
      // Memory Workspace Simulator
      container.innerHTML = `
        <div class="sim-interactive-area" style="padding: 16px;">
          <div style="font-size: 14px; font-weight:700; color: #60a5fa; margin-bottom: 4px;">Memory Workspace Lab (16 GB RAM Capacity)</div>
          <p style="font-size: 11px; color:#cbd5e1; margin-bottom: 12px;">Toggle active programs and witness memory consumption, memory warnings, and disk paging swap file creation.</p>
          
          <div style="display:flex; gap:16px; margin-bottom:12px; flex-wrap:wrap;">
            <!-- Control toggles -->
            <div class="glass-panel" style="flex:1; min-width:160px; padding:10px; display:flex; flex-direction:column; gap:6px;">
              <span style="font-size:10px; font-weight:bold; color:#64748b; text-transform:uppercase;">Program Control</span>
              <button class="act-btn ram-prog-toggle" data-size="2" data-name="Browser" style="justify-content:space-between;">🌐 Web Browser <span>2GB</span></button>
              <button class="act-btn ram-prog-toggle" data-size="6" data-name="Game" style="justify-content:space-between;">🎮 Gaming Client <span>6GB</span></button>
              <button class="act-btn ram-prog-toggle" data-size="8" data-name="VideoEdit" style="justify-content:space-between;">🎬 Video Editor <span>8GB</span></button>
              <button class="act-btn ram-prog-toggle" data-size="1" data-name="Chat" style="justify-content:space-between;">💬 Chat Client <span>1GB</span></button>
            </div>
            
            <!-- RAM Visualization Grid -->
            <div class="glass-panel" style="flex:1.2; min-width:180px; padding:10px; display:flex; flex-direction:column; align-items:center;">
              <span style="font-size:10px; font-weight:bold; color:#64748b; text-transform:uppercase; margin-bottom:8px;">RAM Allocation Grid</span>
              <div id="ram-allocation-grid" style="display:grid; grid-template-columns: repeat(4, 30px); gap:6px; margin-bottom:8px;">
                <!-- 16 blocks will be loaded here -->
              </div>
              <div id="ram-usage-text" style="font-size:11px; font-weight:bold; color:#cbd5e1;">Usage: 0 / 16 GB</div>
            </div>
          </div>
          
          <div class="glass-panel" style="padding:10px; background:rgba(0,0,0,0.3); border-radius:6px; min-height:60px; font-size:12px;">
            <div id="ram-sim-feedback" style="color:#cbd5e1; font-weight:500;">Open programs to see RAM fill up. Close them to free memory.</div>
          </div>
        </div>
      `;

      var grid = container.querySelector('#ram-allocation-grid');
      var usageText = container.querySelector('#ram-usage-text');
      var feedback = container.querySelector('#ram-sim-feedback');
      var btns = container.querySelectorAll('.ram-prog-toggle');

      var activePrograms = {};

      // Initialize 16 blocks
      for (var i = 0; i < 16; i++) {
        var block = document.createElement('div');
        block.dataset.blockIdx = i;
        block.style.cssText = "width:30px; height:24px; border-radius:4px; border:1px solid rgba(255,255,255,0.06); background:rgba(255,255,255,0.02); transition:all 0.3s;";
        grid.appendChild(block);
      }

      btns.forEach(function(btn) {
        btn.addEventListener('click', function() {
          var name = this.dataset.name;
          var size = parseInt(this.dataset.size);
          var active = this.classList.contains('active');

          if (active) {
            this.classList.remove('active');
            delete activePrograms[name];
          } else {
            this.classList.add('active');
            activePrograms[name] = size;
          }
          
          updateRamGrid();
        });
      });

      function updateRamGrid() {
        var totalUsed = 0;
        var blocks = container.querySelectorAll('[data-block-idx]');
        
        // Reset blocks
        blocks.forEach(b => {
          b.style.background = "rgba(255,255,255,0.02)";
          b.style.borderColor = "rgba(255,255,255,0.06)";
        });

        var colors = {
          Browser: "#3b82f6",
          Game: "#a855f7",
          VideoEdit: "#eab308",
          Chat: "#10b981"
        };

        var curIdx = 0;
        var swapNeeded = false;

        for (var name in activePrograms) {
          var size = activePrograms[name];
          var color = colors[name] || "#3b82f6";
          for (var i = 0; i < size; i++) {
            if (curIdx < 16) {
              var block = container.querySelector(`[data-block-idx="${curIdx}"]`);
              if (block) {
                block.style.background = color;
                block.style.borderColor = "rgba(255,255,255,0.1)";
              }
              curIdx++;
            } else {
              swapNeeded = true;
            }
          }
          totalUsed += size;
        }

        usageText.textContent = `Usage: ${totalUsed} / 16 GB`;

        if (swapNeeded) {
          usageText.style.color = "#ef4444";
          feedback.style.color = "#f59e0b";
          feedback.innerHTML = `⚠️ <strong>Memory Limit Exceeded!</strong> Operating system is creating a swap file on the SSD to store overflow pages. System performance is throttled!`;
          engine.markCompleted(); // Trigger achievement when they trigger paging
        } else if (totalUsed >= 14) {
          usageText.style.color = "#f59e0b";
          feedback.style.color = "#cbd5e1";
          feedback.textContent = `RAM is near peak allocation. Opening additional heavy apps will trigger disk swapping.`;
        } else {
          usageText.style.color = "#cbd5e1";
          feedback.style.color = "#cbd5e1";
          feedback.textContent = totalUsed > 0 ? "Memory allocation optimized. System operations running at native speed." : "Open programs to see RAM fill up.";
        }
      }
    },

    onReplay: function(engine) {
      engine.t = 0;
    }
  });
});
})();