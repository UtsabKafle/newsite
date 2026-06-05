(function(){'use strict';
var components = [
  {id:"socket",name:"CPU Socket",category:"Hardware",x:150,y:50,w:100,h:50,purpose:"Provides the physical and electrical interface for the CPU to connect to the motherboard",description:"The CPU socket is a precision connector with hundreds of pins or contacts that align with the CPU\\'s pads, establishing data and power connections.",why:"The socket determines which CPUs are compatible with a motherboard",analogy:"Like a specific power plug design that only matches certain devices",funFact:"Modern Intel LGA sockets have over 1,700 pins",takeaway:"Always match the CPU socket type when choosing a motherboard",mistake:"Forcing a CPU into the wrong socket can bend pins and destroy both components",descriptionDetailed:"LGA sockets have pins on the motherboard, PGA sockets have pins on the CPU. The socket lever secures the CPU in place with correct pressure. Different generations use different sockets (LGA1700, AM5, etc.)."},
  {id:"chipset",name:"Chipset",category:"Hardware",x:350,y:150,w:100,h:50,purpose:"Manages data flow between the CPU, memory, peripherals, and expansion slots",description:"The chipset is a set of chips that handles I/O operations, PCIe lane distribution, USB ports, SATA connections, and system management.",why:"The chipset determines the features and expansion capabilities of the motherboard",analogy:"Like a traffic control center managing data flow between city districts",funFact:"Modern chipsets like Z790 and X670E support PCIe 5.0 and DDR5",takeaway:"The chipset version determines available features like overclocking and PCIe lanes",mistake:"The chipset doesn\\'t affect CPU performance directly—it handles connectivity",descriptionDetailed:"The chipset connects to the CPU via DMI (Intel) or Infinity Fabric (AMD). It provides PCIe lanes for expansion slots, SATA ports, USB controllers, and networking. Northbridge functions (memory control) are now integrated into the CPU."},
  {id:"slots",name:"Expansion Slots",category:"Hardware",x:150,y:250,w:100,h:50,purpose:"Provides connections for add-in cards like GPUs, sound cards, and network adapters",description:"PCI Express slots come in x1, x4, x8, and x16 sizes, with the x16 slot typically used for the graphics card.",why:"Expansion slots allow customization and upgrading of computer capabilities",analogy:"Like docking ports that let you attach different tools to a vehicle",funFact:"The first PCIe 5.0 x16 slot provides 63 GB/s bandwidth",takeaway:"PCIe slots are backward compatible—a x16 card works in a x8 slot (at slower speed)",mistake:"Not all PCIe slots connect directly to the CPU—some go through the chipset",descriptionDetailed:"PCIe uses serial lanes that can be combined. The physical slot size indicates maximum lanes. PCIe versions (3.0, 4.0, 5.0) double bandwidth each generation."},
  {id:"headers",name:"Front Panel Headers",category:"Hardware",x:350,y:250,w:100,h:50,purpose:"Connects the case\\'s front panel buttons and indicators to the motherboard",description:"Headers are small pin connectors on the motherboard that attach to the case\\'s front panel—power button, reset, LEDs, and audio/USB ports.",why:"Headers make the case controls functional—power button, USB ports, and LEDs",analogy:"Like the nerve endings that connect a body\\'s interface to its brain",funFact:"Front panel header pin layouts are standardized but still confusing for new builders",takeaway:"Consult the motherboard manual for exact front panel header pin layout",mistake:"Plugging front panel connectors into the wrong pins can prevent booting",descriptionDetailed:"Common headers include PWR_SW (power button), RST_SW (reset), HDD_LED (drive activity), PWR_LED (power indicator), and front audio/USB. Polarity matters for LEDs but not for switches."},
  {id:"ports",name:"Rear I/O Ports",category:"Hardware",x:150,y:150,w:100,h:50,purpose:"Provides external connectivity for peripherals and networking",description:"The rear I/O panel includes USB ports, audio jacks, Ethernet, video outputs (HDMI, DisplayPort), and antenna mounts for Wi-Fi.",why:"Rear I/O ports are the computer\\'s interface with external devices",analogy:"Like the dashboard of a car with all the controls and displays",funFact:"USB-C on rear I/O can support Thunderbolt 4 on modern motherboards",takeaway:"Rear I/O ports are connected directly to the motherboard or chipset",mistake:"The rear I/O shield must be installed before the motherboard in the case",descriptionDetailed:"USB ports vary by generation (USB 2.0, 3.2, 4) and speed. Audio jacks support multi-channel output. Video outputs depend on whether the CPU has integrated graphics."},
  {id:"vrms",name:"Voltage Regulator Module (VRM)",category:"Hardware",x:350,y:50,w:100,h:50,purpose:"Converts the PSU\\'s voltage to the precise levels required by the CPU",description:"VRMs are power regulation circuits near the CPU socket that step down the +12V supply to the CPU\\'s required voltage (around 1.2-1.4V).",why:"VRMs ensure stable, clean power delivery to the CPU",analogy:"Like a water pressure regulator that ensures the right pressure for different appliances",funFact:"High-end motherboards can have 20+ VRM phases for ultra-stable power",takeaway:"Better VRMs allow stable overclocking and support higher-end CPUs",mistake:"VRMs generate significant heat—their cooling matters for system stability",descriptionDetailed:"VRMs use MOSFETs, chokes, and capacitors to filter and regulate voltage. More phases distribute the load and reduce ripple. VRM quality varies widely between budget and premium motherboards."}
];
var connections = [{from:"socket",to:"chipset"},{from:"chipset",to:"slots"},{from:"slots",to:"headers"},{from:"headers",to:"ports"},{from:"ports",to:"vrms"}];
var steps = [{id:"socket",label:"Step 1: CPU Socket",status:"Exploring: CPU Socket - Provides the physical and electrical interface for the CPU to connect to the motherboard"},{id:"chipset",label:"Step 2: Chipset",status:"Exploring: Chipset - Manages data flow between the CPU, memory, peripherals, and expansion slots"},{id:"slots",label:"Step 3: Expansion Slots",status:"Exploring: Expansion Slots - Provides connections for add-in cards like GPUs, sound cards, and network adapters"},{id:"headers",label:"Step 4: Front Panel Headers",status:"Exploring: Front Panel Headers - Connects the case\\'s front panel buttons and indicators to the motherboard"},{id:"ports",label:"Step 5: Rear I/O Ports",status:"Exploring: Rear I/O Ports - Provides external connectivity for peripherals and networking"},{id:"vrms",label:"Step 6: Voltage Regulator Module (VRM)",status:"Exploring: Voltage Regulator Module (VRM) - Converts the PSU\\'s voltage to the precise levels required by the CPU"}];
var tour = [{title:"CPU Socket",description:"Provides the physical and electrical interface for the CPU to connect to the motherboard",componentId:"socket"},{title:"Chipset",description:"Manages data flow between the CPU, memory, peripherals, and expansion slots",componentId:"chipset"},{title:"Expansion Slots",description:"Provides connections for add-in cards like GPUs, sound cards, and network adapters",componentId:"slots"},{title:"Front Panel Headers",description:"Connects the case\\'s front panel buttons and indicators to the motherboard",componentId:"headers"},{title:"Rear I/O Ports",description:"Provides external connectivity for peripherals and networking",componentId:"ports"},{title:"Voltage Regulator Module (VRM)",description:"Converts the PSU\\'s voltage to the precise levels required by the CPU",componentId:"vrms"}];

function initMotherboardChallenge(container, engine) {
  var placed = {
    socket: null,
    ram: null,
    m2: null,
    pcie: null
  };

  var options = {
    socket: [
      { name: "Intel Core i7-13700K (LGA1700)", correct: true, text: "Correct! The LGA1700 CPU matches the socket physical layout and pin array.", color: "#3b82f6" },
      { name: "AMD Ryzen 7 7700X (AM5)", correct: false, text: "Incompatible! AM5 CPUs use a different contact pattern and pin-shape, and do not fit Intel LGA1700 sockets. Forcing it will damage pins." }
    ],
    ram: [
      { name: "16GB DDR5 DIMM (6000MHz)", correct: true, text: "Correct! Modern DDR5 fits and aligns perfectly with the motherboard memory channels.", color: "#a855f7" },
      { name: "8GB DDR4 DIMM (3200MHz)", correct: false, text: "Incompatible! DDR4 modules have a different mechanical key notch position and cannot physically slide into DDR5 slots." }
    ],
    m2: [
      { name: "Samsung 990 Pro M.2 NVMe SSD", correct: true, text: "Correct! The M.2 card inserts at an angle and lays flat to be secured by the screw.", color: "#10b981" },
      { name: "Seagate BarraCuda 2TB 3.5\" HDD", correct: false, text: "Incompatible! A 3.5\" spinning disk hard drive requires SATA power/data cables and cannot plug into an M.2 socket." }
    ],
    pcie: [
      { name: "NVIDIA GeForce RTX 4070 (PCIe 4.0 x16)", correct: true, text: "Correct! The graphics card clicks securely into the full-length PCIe x16 slot for high speed data transfer.", color: "#eab308" },
      { name: "SATA Power Connector Cable", correct: false, text: "Incompatible! Cable connectors do not go into PCIe card slots. PCIe slots are reserved for add-in cards." }
    ]
  };

  var activeSlot = null;

  container.innerHTML = `
    <div class="sim-interactive-area" style="padding: 16px; display: flex; flex-direction: column; gap: 16px; width: 100%;">
      <div style="font-size: 14px; font-weight:700; color: #60a5fa; margin-bottom: 4px;">Motherboard Component Placement Lab</div>
      <p style="font-size: 11px; color:#cbd5e1; margin-bottom: 8px;">Assemble the computer motherboard. Click on the highlighted slots and choose compatible components to populate the motherboard.</p>
      
      <div style="display: flex; gap: 20px; flex-direction: row; flex-wrap: wrap; justify-content: center; align-items: flex-start; width: 100%;">
        <!-- Motherboard Visual (SVG) -->
        <div style="flex: 1.2; min-width: 280px; max-width: 500px;">
          <svg viewBox="0 0 600 500" style="width:100%; height:auto; background:#0b0f19; border:2px solid rgba(255,255,255,0.06); border-radius:12px; box-shadow: 0 8px 30px rgba(0,0,0,0.5);">
            <!-- Grid design lines -->
            <path d="M 50 100 L 150 100 L 150 150 M 450 100 L 450 200 L 350 200 M 100 400 L 100 350 L 200 350" stroke="#0959c8" stroke-width="1.5" opacity="0.3" fill="none"/>
            <path d="M 400 350 L 480 350 L 480 280" stroke="#0959c8" stroke-width="1.5" opacity="0.2" fill="none"/>

            <!-- Sockets & Slots -->
            <!-- CPU Socket -->
            <g class="mb-slot-group" data-target-slot="socket" style="cursor:pointer;">
              <rect x="140" y="80" width="120" height="120" rx="8" fill="#182030" stroke="#2e3a50" stroke-width="2" class="mb-rect-socket" style="transition: all 0.3s;"></rect>
              <rect x="145" y="85" width="110" height="110" rx="6" fill="none" stroke="#3b82f6" stroke-width="2" stroke-dasharray="4 4" opacity="0.8"></rect>
              <text x="200" y="135" text-anchor="middle" fill="#94a3b8" font-size="12" font-weight="600" font-family="sans-serif">CPU Socket</text>
              <text id="lbl-socket" x="200" y="155" text-anchor="middle" fill="#3b82f6" font-size="10" font-weight="700" font-family="sans-serif">SELECT</text>
            </g>

            <!-- RAM Slots -->
            <g class="mb-slot-group" data-target-slot="ram" style="cursor:pointer;">
              <rect x="300" y="80" width="80" height="120" rx="8" fill="#182030" stroke="#2e3a50" stroke-width="2" class="mb-rect-ram" style="transition: all 0.3s;"></rect>
              <line x1="320" y1="90" x2="320" y2="190" stroke="#475569" stroke-width="3"></line>
              <line x1="340" y1="90" x2="340" y2="190" stroke="#475569" stroke-width="3"></line>
              <line x1="360" y1="90" x2="360" y2="190" stroke="#475569" stroke-width="3"></line>
              <rect x="305" y="85" width="70" height="110" rx="6" fill="none" stroke="#a855f7" stroke-width="2" stroke-dasharray="4 4" opacity="0.8"></rect>
              <text x="340" y="135" text-anchor="middle" fill="#94a3b8" font-size="12" font-weight="600" font-family="sans-serif">RAM Slots</text>
              <text id="lbl-ram" x="340" y="155" text-anchor="middle" fill="#a855f7" font-size="10" font-weight="700" font-family="sans-serif">SELECT</text>
            </g>

            <!-- M.2 NVMe Slot -->
            <g class="mb-slot-group" data-target-slot="m2" style="cursor:pointer;">
              <rect x="140" y="230" width="240" height="40" rx="8" fill="#182030" stroke="#2e3a50" stroke-width="2" class="mb-rect-m2" style="transition: all 0.3s;"></rect>
              <rect x="145" y="235" width="230" height="30" rx="4" fill="none" stroke="#10b981" stroke-width="2" stroke-dasharray="4 4" opacity="0.8"></rect>
              <text x="260" y="254" text-anchor="middle" fill="#94a3b8" font-size="11" font-weight="600" font-family="sans-serif">M.2 NVMe Slot</text>
              <text id="lbl-m2" x="260" y="266" text-anchor="middle" fill="#10b981" font-size="9" font-weight="700" font-family="sans-serif">SELECT</text>
            </g>

            <!-- PCIe x16 Slot -->
            <g class="mb-slot-group" data-target-slot="pcie" style="cursor:pointer;">
              <rect x="100" y="300" width="380" height="46" rx="8" fill="#182030" stroke="#2e3a50" stroke-width="2" class="mb-rect-pcie" style="transition: all 0.3s;"></rect>
              <rect x="105" y="305" width="370" height="36" rx="6" fill="none" stroke="#eab308" stroke-width="2" stroke-dasharray="4 4" opacity="0.8"></rect>
              <text x="290" y="323" text-anchor="middle" fill="#94a3b8" font-size="12" font-weight="600" font-family="sans-serif">PCIe x16 Expansion Slot</text>
              <text id="lbl-pcie" x="290" y="337" text-anchor="middle" fill="#eab308" font-size="9" font-weight="700" font-family="sans-serif">SELECT</text>
            </g>
          </svg>
        </div>
        
        <!-- Component Installer Controls (right) -->
        <div style="flex: 1; min-width: 240px; display:flex; flex-direction:column; gap:12px;">
          <div class="glass-panel" id="mb-install-box" style="padding:12px; min-height:160px; display:flex; flex-direction:column; gap:8px;">
            <span style="font-size:10px; font-weight:bold; color:#64748b; text-transform:uppercase;" id="mb-install-title">Select a slot on the motherboard</span>
            <div id="mb-install-body" style="font-size:12px; color:#cbd5e1;">
              Click any slot on the left motherboard graphic to inspect choices and select the compatible computer component to install.
            </div>
            <div id="mb-install-options" style="display:flex; flex-direction:column; gap:8px; margin-top:8px;"></div>
          </div>
          
          <div class="glass-panel" style="padding:12px; background:rgba(0,0,0,0.25); font-size:11px; min-height:60px;">
            <div id="mb-feedback" style="color:#94a3b8; font-weight:500;">Ready to begin socket checking.</div>
          </div>
        </div>
      </div>
    </div>
  `;

  var installBox = container.querySelector('#mb-install-box');
  var installTitle = container.querySelector('#mb-install-title');
  var installBody = container.querySelector('#mb-install-body');
  var installOptions = container.querySelector('#mb-install-options');
  var feedback = container.querySelector('#mb-feedback');
  var slotGroups = container.querySelectorAll('.mb-slot-group');

  slotGroups.forEach(function(g) {
    g.addEventListener('click', function() {
      var slot = this.dataset.targetSlot;
      selectSlot(slot);
    });
  });

  function selectSlot(slot) {
    activeSlot = slot;
    slotGroups.forEach(g => {
      var rect = g.querySelector('rect:first-of-type');
      if (g.dataset.targetSlot === slot) {
        rect.setAttribute('stroke', '#3b82f6');
        rect.setAttribute('fill', '#1e293b');
      } else {
        var isPlaced = !!placed[g.dataset.targetSlot];
        rect.setAttribute('stroke', isPlaced ? '#10b981' : '#2e3a50');
        rect.setAttribute('fill', isPlaced ? 'rgba(16,185,129,0.05)' : '#182030');
      }
    });

    var slotNames = {
      socket: "CPU Socket",
      ram: "RAM Slots",
      m2: "M.2 NVMe Slot",
      pcie: "PCIe x16 Slot"
    };

    installTitle.textContent = `Configure Slot: ${slotNames[slot]}`;
    if (placed[slot]) {
      installBody.textContent = `Installed: ${placed[slot].name}`;
      installOptions.innerHTML = `
        <button class="act-btn" id="btn-mb-remove" style="border-color:#ef4444; color:#ef4444; justify-content:center;">Remove Component</button>
      `;
      container.querySelector('#btn-mb-remove').addEventListener('click', function() {
        removeComponent(slot);
      });
    } else {
      installBody.textContent = `Select the compatible hardware module for this slot:`;
      installOptions.innerHTML = '';
      
      var list = options[slot] || [];
      list.forEach(function(opt, idx) {
        var btn = document.createElement('button');
        btn.className = 'challenge-opt-btn';
        btn.textContent = opt.name;
        btn.style.padding = '10px';
        btn.style.fontSize = '12px';
        btn.addEventListener('click', function() {
          tryPlaceComponent(slot, opt);
        });
        installOptions.appendChild(btn);
      });
    }
  }

  function tryPlaceComponent(slot, opt) {
    var rect = container.querySelector(`.mb-rect-${slot}`);
    var textlbl = container.querySelector(`#lbl-${slot}`);
    
    if (opt.correct) {
      placed[slot] = opt;
      if (rect) {
        rect.setAttribute('fill', 'rgba(16,185,129,0.1)');
        rect.setAttribute('stroke', '#10b981');
      }
      if (textlbl) {
        textlbl.textContent = "INSTALLED";
        textlbl.setAttribute('fill', '#10b981');
      }
      
      feedback.style.color = '#10b981';
      feedback.innerHTML = `<strong>Success!</strong> ${opt.text}`;
      engine._setStatus(`Compatible component placed: ${opt.name}`);
      selectSlot(slot);
      checkBoardCompletion();
    } else {
      if (rect) {
        rect.setAttribute('stroke', '#ef4444');
        setTimeout(() => {
          if (!placed[slot]) {
            rect.setAttribute('stroke', '#2e3a50');
          }
        }, 1500);
      }
      feedback.style.color = '#ef4444';
      feedback.innerHTML = `<strong>Compatibility Error!</strong> ${opt.text}`;
      engine._setStatus(`Compatibility error: ${opt.name}`);
    }
  }

  function removeComponent(slot) {
    placed[slot] = null;
    var rect = container.querySelector(`.mb-rect-${slot}`);
    var textlbl = container.querySelector(`#lbl-${slot}`);
    if (rect) {
      rect.setAttribute('fill', '#182030');
      rect.setAttribute('stroke', '#2e3a50');
    }
    if (textlbl) {
      var colors = { socket: "#3b82f6", ram: "#a855f7", m2: "#10b981", pcie: "#eab308" };
      textlbl.textContent = "SELECT";
      textlbl.setAttribute('fill', colors[slot] || "#3b82f6");
    }
    feedback.style.color = '#94a3b8';
    feedback.textContent = `Removed hardware module from slot.`;
    engine._setStatus(`Removed module from slot: ${slot}`);
    selectSlot(slot);
  }

  function checkBoardCompletion() {
    var allFilled = Object.keys(placed).every(function(k) {
      return placed[k] !== null;
    });
    if (allFilled) {
      feedback.style.color = '#10b981';
      feedback.innerHTML = `🎉 <strong>Motherboard Configuration Match!</strong> All core components are electrically and physically compatible. System is ready for case insertion.`;
      engine._setStatus('Motherboard placement check successful!');
      engine.markCompleted();
    }
  }
}

deferInit(function(){
  new DiagramEngine({
    title: 'Motherboard',
    subtitle: 'Computer Assembly',
    desc: 'Explore the key components and connectors on a motherboard.',
    module: 3,
    difficulty: 'Intermediate',
    time: '10',
    objectives: 'Explore the key components and connectors on a motherboard.',
    components: components,
    connections: connections,
    steps: steps,
    tour: tour,
    
    render: function(container, engine) {
      engine.buildVisual(container);
      engine._setStatus('Click any component to explore');
    },
    
    customChallenge: function(container, engine) {
      initMotherboardChallenge(container, engine);
    },
    
    animate: function(engine) {},
    
    onReplay: function(engine) {
      engine.t = 0;
    }
  });
});
})();