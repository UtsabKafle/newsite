(function(){'use strict';
var components = [
  {id:"powercable",name:"Power Cables",category:"Hardware",x:50,y:50,w:100,h:50,purpose:"Delivers electrical power from the PSU to every component in the system",description:"Power cables include the 24-pin motherboard connector, 4+4 pin CPU power, PCIe cables for GPU, and SATA power for drives.",why:"Every component needs power to function—cables deliver it safely",analogy:"Like electrical wiring in a house that powers all appliances",funFact:"The 24-pin connector provides power, ground, and standby voltage",takeaway:"Route power cables behind the motherboard tray for a clean build",mistake:"Don\\'t daisy-chain too many SATA power connectors from one cable—it can overload",descriptionDetailed:"Connect the largest cables first (24-pin ATX), then CPU power, then GPU. Route cables behind the tray using cutouts near each connection point. Use Velcro straps to bundle cables and keep them organized."},
  {id:"data",name:"Data Cables",category:"Hardware",x:200,y:50,w:100,h:50,purpose:"Transfers data between storage drives and the motherboard",description:"SATA data cables connect HDDs and SATA SSDs to the motherboard, while M.2 drives connect directly without cables.",why:"Data cables enable communication between storage devices and the system",analogy:"Like network cables connecting computers in an office",funFact:"Narrow SATA cables are easier to route than older wide IDE cables",takeaway:"Use locking SATA cables to prevent accidental disconnection",mistake:"Don\\'t bend SATA cables sharply—it can damage internal wires",descriptionDetailed:"SATA data cables connect SATA drives directly to motherboard ports. Route them neatly alongside power cables. Avoid running data cables near sharp metal edges. M.2 drives install directly into the motherboard slot."},
  {id:"frontpanel",name:"Front Panel Connectors",category:"Hardware",x:200,y:150,w:100,h:50,purpose:"Connects the case\\'s front buttons and indicators to the motherboard",description:"Front panel connectors include the power button, reset button, power LED, HDD activity LED, and front audio/USB ports.",why:"Front panel connectors make the case\\'s external controls functional",analogy:"Like connecting a doorbell button to the chime inside",funFact:"Some modern motherboards use a single block connector instead of individual pins",takeaway:"Check the motherboard manual for the exact front panel pin layout—it varies",mistake:"LED connectors are polarity-sensitive—reversing them prevents them from lighting",descriptionDetailed:"PWR_SW and RST_SW are momentary switches (no polarity). HDD_LED and PWR_LED are polarity-sensitive (positive usually marked). Front audio and USB connectors plug into separate headers. Case-specific connections like USB-C require a compatible motherboard header."},
  {id:"fanheader",name:"Fan Headers",category:"Hardware",x:50,y:150,w:100,h:50,purpose:"Provides power and speed control for case and CPU fans",description:"Fan headers on the motherboard deliver power (12V), ground, and PWM control signals to coolers and case fans.",why:"Fan headers allow the motherboard to control fan speed based on temperature",analogy:"Like a thermostat that controls your HVAC system",funFact:"Most motherboards can deliver about 1A (12W) per fan header",takeaway:"Use CPU_FAN header for the CPU cooler and SYS_FAN headers for case fans",mistake:"Using CPU_FAN header for case fans can cause CPU fan error warnings",descriptionDetailed:"4-pin PWM headers allow variable speed control. 3-pin headers run at fixed speed or voltage control. Use splitters or hubs for multiple fans. Fan curves are configurable in the BIOS."},
  {id:"sata",name:"SATA Connections",category:"Hardware",x:50,y:250,w:100,h:50,purpose:"Connects storage drives for both data transfer and power",description:"SATA drives require two connections: a data cable to the motherboard and a power cable from the PSU, both using L-shaped keyed connectors.",why:"SATA connections are the standard interface for drives and some peripherals",analogy:"Like a two-part connection: one for communication, one for electricity",funFact:"The SATA standard originally supported hot-swapping of drives",takeaway:"Connect SATA data cable first, then SATA power—the order doesn\\'t matter",mistake:"SATA connectors can be inserted upside-down because the L-key prevents it",descriptionDetailed:"SATA data cables come in straight and right-angle variants. SATA power cables from the PSU are daisy-chained. Connect data cables to the fastest SATA ports (often SATA_1, SATA_2). Locking data cables have metal clips."},
  {id:"management",name:"Cable Management",category:"Hardware",x:200,y:250,w:100,h:50,purpose:"Organizes cables for optimal airflow and easy maintenance",description:"Cable management involves routing wires behind the motherboard tray, using zip ties or Velcro straps, and avoiding obstruction of airflow paths.",why:"Good cable management improves cooling, reduces clutter, and looks professional",analogy:"Like organizing electrical wiring in a building for safety and access",funFact:"A messy case with tangled cables can increase temps by 3-5C",takeaway:"Plan cable routing before starting—install cables in order of thickness",mistake:"Zip tie cables loosely—overtightening can damage insulation or bend pins",descriptionDetailed:"Route the 24-pin and EPS cables first (thickest). Use case cutouts near connection points. Bundle excess cable length behind the tray. Use Velcro straps for easy future modifications. Separate data and power cables to reduce electrical interference."}
];
var connections = [{from:"powercable",to:"data"},{from:"data",to:"frontpanel"},{from:"frontpanel",to:"fanheader"},{from:"fanheader",to:"sata"},{from:"sata",to:"management"}];
var steps = [{id:"powercable",label:"Step 1: Power Cables",status:"Exploring: Power Cables - Delivers electrical power from the PSU to every component in the system"},{id:"data",label:"Step 2: Data Cables",status:"Exploring: Data Cables - Transfers data between storage drives and the motherboard"},{id:"frontpanel",label:"Step 3: Front Panel Connectors",status:"Exploring: Front Panel Connectors - Connects the case\\'s front buttons and indicators to the motherboard"},{id:"fanheader",label:"Step 4: Fan Headers",status:"Exploring: Fan Headers - Provides power and speed control for case and CPU fans"},{id:"sata",label:"Step 5: SATA Connections",status:"Exploring: SATA Connections - Connects storage drives for both data transfer and power"},{id:"management",label:"Step 6: Cable Management",status:"Exploring: Cable Management - Organizes cables for optimal airflow and easy maintenance"}];
var tour = [{title:"Power Cables",description:"Delivers electrical power from the PSU to every component in the system",componentId:"powercable"},{title:"Data Cables",description:"Transfers data between storage drives and the motherboard",componentId:"data"},{title:"Front Panel Connectors",description:"Connects the case\\'s front buttons and indicators to the motherboard",componentId:"frontpanel"},{title:"Fan Headers",description:"Provides power and speed control for case and CPU fans",componentId:"fanheader"},{title:"SATA Connections",description:"Connects storage drives for both data transfer and power",componentId:"sata"},{title:"Cable Management",description:"Organizes cables for optimal airflow and easy maintenance",componentId:"management"}];

function initCableChallenge(container, engine) {
  var connected = {
    mb24: false,
    cpu8: false,
    gpu8: false,
    ssdpower: false,
    sata_data_mbside: false,
    sata_data_ssdside: false
  };

  var selectedCable = null;

  var cableOptions = [
    { id: "atx24", name: "24-Pin ATX Main Power Cable", desc: "Powers the motherboard core circuits", color: "#f97316", targets: ["mb24"] },
    { id: "eps8", name: "4+4 Pin EPS CPU Power Cable", desc: "Powers the CPU processor core", color: "#eab308", targets: ["cpu8"] },
    { id: "pcie8", name: "6+2 Pin PCIe GPU Power Cable", desc: "Powers the high-performance graphics card", color: "#ef4444", targets: ["gpu8"] },
    { id: "satapow", name: "SATA Power Cable", desc: "Powers storage SSDs and HDDs", color: "#10b981", targets: ["ssdpower"] },
    { id: "satadata", name: "SATA Data Cable", desc: "Connects storage data pins to motherboard ports", color: "#06b6d4", targets: ["mbsata", "ssddata"] }
  ];

  container.innerHTML = `
    <div class="sim-interactive-area" style="padding: 16px; display: flex; flex-direction: column; gap: 16px; width: 100%;">
      <div style="font-size: 14px; font-weight:700; color: #60a5fa; margin-bottom: 4px;">Hardware Cable Pinning Lab</div>
      <p style="font-size: 11px; color:#cbd5e1; margin-bottom: 8px;">Electrically connect all components. Select a cable from the list, then click the correct matching connector ports on the chassis components.</p>
      
      <div style="display: flex; gap: 20px; flex-direction: row; flex-wrap: wrap; justify-content: center; align-items: flex-start; width: 100%;">
        <!-- Visual Schematic -->
        <div style="flex: 1.2; min-width: 280px; max-width: 500px;">
          <svg id="cable-schematic-svg" viewBox="0 0 600 450" style="width:100%; height:auto; background:#0b0f19; border:2px solid rgba(255,255,255,0.06); border-radius:12px; box-shadow:0 8px 30px rgba(0,0,0,0.5);">
            <!-- Background Trace Lines -->
            <path d="M 50 100 L 150 100 L 150 150 M 450 100 L 450 200 L 350 200 M 100 400 L 100 350 L 200 350" stroke="#0959c8" stroke-width="1.5" opacity="0.3" fill="none"></path>

            <!-- Motherboard Outline -->
            <rect x="40" y="40" width="280" height="250" rx="8" fill="#141c2e" stroke="#2a3a55" stroke-width="2"></rect>
            <text x="180" y="60" text-anchor="middle" fill="#475569" font-size="10" font-weight="700" font-family="sans-serif">MOTHERBOARD (ATX)</text>

            <!-- CPU Area -->
            <rect x="90" y="80" width="70" height="70" fill="#1e293b" stroke="#374151" rx="4"></rect>
            <text x="125" y="120" text-anchor="middle" fill="#64748b" font-size="10" font-family="sans-serif">CPU SOCKET</text>

            <!-- Interactive Port Targets -->
            <!-- 24-Pin ATX Socket -->
            <g class="cable-port-target" data-port-id="mb24" style="cursor:pointer;">
              <rect x="290" y="90" width="18" height="90" rx="2" fill="#182030" stroke="#f97316" stroke-width="2" class="port-border-mb24" style="transition:all 0.3s;"></rect>
              <text x="280" y="140" text-anchor="end" fill="#94a3b8" font-size="9" font-weight="600" font-family="sans-serif">24-Pin ATX</text>
            </g>

            <!-- 8-Pin CPU Socket -->
            <g class="cable-port-target" data-port-id="cpu8" style="cursor:pointer;">
              <rect x="70" y="50" width="34" height="18" rx="2" fill="#182030" stroke="#eab308" stroke-width="2" class="port-border-cpu8" style="transition:all 0.3s;"></rect>
              <text x="87" y="78" text-anchor="middle" fill="#94a3b8" font-size="9" font-weight="600" font-family="sans-serif">8-Pin CPU</text>
            </g>

            <!-- MB SATA Data Port -->
            <g class="cable-port-target" data-port-id="mbsata" style="cursor:pointer;">
              <rect x="290" y="220" width="18" height="24" rx="2" fill="#182030" stroke="#3b82f6" stroke-width="2" class="port-border-mbsata" style="transition:all 0.3s;"></rect>
              <text x="280" y="235" text-anchor="end" fill="#94a3b8" font-size="9" font-weight="600" font-family="sans-serif">SATA Port</text>
            </g>

            <!-- GPU (PCIe Card) Outline -->
            <rect x="40" y="320" width="280" height="90" rx="6" fill="#111827" stroke="#2d3748" stroke-width="2"></rect>
            <text x="180" y="340" text-anchor="middle" fill="#475569" font-size="10" font-weight="700" font-family="sans-serif">PCIe GRAPHICS CARD</text>

            <!-- GPU 8-Pin PCIe Power -->
            <g class="cable-port-target" data-port-id="gpu8" style="cursor:pointer;">
              <rect x="290" y="350" width="18" height="34" rx="2" fill="#182030" stroke="#ef4444" stroke-width="2" class="port-border-gpu8" style="transition:all 0.3s;"></rect>
              <text x="280" y="370" text-anchor="end" fill="#94a3b8" font-size="9" font-weight="600" font-family="sans-serif">8-Pin PCIe</text>
            </g>

            <!-- SATA SSD Outline -->
            <rect x="420" y="220" width="140" height="190" rx="6" fill="#161e2e" stroke="#2e3a50" stroke-width="2"></rect>
            <text x="490" y="245" text-anchor="middle" fill="#475569" font-size="10" font-weight="700" font-family="sans-serif">SATA SSD DRIVE</text>

            <!-- SSD SATA Power Port -->
            <g class="cable-port-target" data-port-id="ssdpower" style="cursor:pointer;">
              <rect x="440" y="350" width="46" height="16" rx="2" fill="#182030" stroke="#10b981" stroke-width="2" class="port-border-ssdpower" style="transition:all 0.3s;"></rect>
              <text x="463" y="342" text-anchor="middle" fill="#94a3b8" font-size="9" font-weight="600" font-family="sans-serif">SATA Power</text>
            </g>

            <!-- SSD SATA Data Port -->
            <g class="cable-port-target" data-port-id="ssddata" style="cursor:pointer;">
              <rect x="500" y="350" width="34" height="16" rx="2" fill="#182030" stroke="#06b6d4" stroke-width="2" class="port-border-ssddata" style="transition:all 0.3s;"></rect>
              <text x="517" y="342" text-anchor="middle" fill="#94a3b8" font-size="9" font-weight="600" font-family="sans-serif">SATA Data</text>
            </g>

            <!-- Dynamic connections path drawer -->
            <g id="dynamic-cables-overlay"></g>
          </svg>
        </div>

        <!-- Cables Picker Sidebar -->
        <div style="flex: 1; min-width: 240px; display:flex; flex-direction:column; gap:12px;">
          <div class="glass-panel" style="padding:12px; display:flex; flex-direction:column; gap:8px;">
            <span style="font-size:10px; font-weight:bold; color:#64748b; text-transform:uppercase;">Select Cable to Connect</span>
            <div id="cables-selector-box" style="display:flex; flex-direction:column; gap:8px;"></div>
          </div>
          
          <div class="glass-panel" style="padding:12px; background:rgba(0,0,0,0.25); min-height:80px; font-size:11px;">
            <div id="cables-feedback" style="color:#94a3b8; font-weight:500;">Choose a power or data cable from the box, then hover and select a port on the visual diagram to connect.</div>
          </div>
        </div>
      </div>
    </div>
  `;

  var cablesBox = container.querySelector('#cables-selector-box');
  var feedback = container.querySelector('#cables-feedback');
  var portTargets = container.querySelectorAll('.cable-port-target');
  var overlay = container.querySelector('#dynamic-cables-overlay');

  // Load cable selectors
  function renderCableList() {
    cablesBox.innerHTML = '';
    cableOptions.forEach(function(cab) {
      // Check if completely connected
      var isDone = false;
      if (cab.id === 'satadata') {
        isDone = connected.sata_data_mbside && connected.sata_data_ssdside;
      } else {
        var t = cab.targets[0];
        isDone = connected[t];
      }

      var btn = document.createElement('button');
      btn.className = `act-btn ${selectedCable === cab.id ? 'active' : ''}`;
      btn.style.cssText = 'justify-content:space-between; width:100%;';
      btn.disabled = isDone;
      
      btn.innerHTML = `
        <div style="text-align:left;">
          <div style="font-size:12px; font-weight:700;">${cab.name}</div>
          <div style="font-size:9px; color:#64748b; font-weight:normal;">${cab.desc}</div>
        </div>
        <span style="font-size:12px; font-weight:bold; color:${isDone ? '#10b981' : '#3b82f6'}">
          ${isDone ? '✓ CONNECTED' : (selectedCable === cab.id ? 'PLUGGING...' : 'SELECT')}
        </span>
      `;

      if (!isDone) {
        btn.addEventListener('click', function() {
          selectCable(cab.id);
        });
      }

      cablesBox.appendChild(btn);
    });
  }

  function selectCable(id) {
    selectedCable = id;
    renderCableList();
    
    var cab = cableOptions.find(c => c.id === id);
    feedback.style.color = '#3b82f6';
    if (id === 'satadata') {
      if (!connected.sata_data_mbside) {
        feedback.textContent = `SATA Data Cable selected: Click the Motherboard SATA Port to plug in the first end.`;
      } else {
        feedback.textContent = `First end plugged into Motherboard: Click the SSD SATA Data Port to complete the connection.`;
      }
    } else {
      feedback.textContent = `Ready to connect: ${cab.name}. Click the corresponding matching socket on the hardware layout.`;
    }

    // Highlight candidate targets
    portTargets.forEach(t => {
      var pid = t.dataset.portId;
      var rect = t.querySelector('rect:first-of-type');
      if (cab.targets.includes(pid) && !isPortConnected(pid)) {
        rect.style.filter = `drop-shadow(0 0 8px ${cab.color})`;
        rect.setAttribute('stroke-width', '3px');
      } else {
        rect.style.filter = 'none';
        rect.setAttribute('stroke-width', '2px');
      }
    });
  }

  function isPortConnected(pid) {
    if (pid === 'mbsata') return connected.sata_data_mbside;
    if (pid === 'ssddata') return connected.sata_data_ssdside;
    return connected[pid];
  }

  portTargets.forEach(t => {
    t.addEventListener('click', function() {
      var pid = this.dataset.portId;
      if (!selectedCable) {
        feedback.style.color = '#ef4444';
        feedback.textContent = '❌ Selection Error: Choose a cable from the control list first before selecting a connection target!';
        return;
      }
      tryConnect(selectedCable, pid);
    });
  });

  function tryConnect(cableId, portId) {
    var cab = cableOptions.find(c => c.id === cableId);
    if (!cab.targets.includes(portId)) {
      // Wrong port connection
      feedback.style.color = '#ef4444';
      
      var explain = "Incompatible pin layout! Do not force it.";
      if (cableId === 'eps8' && portId === 'gpu8') {
        explain = "EPS CPU power connectors and PCIe graphics card power connectors have different pin keys and shapes. Forcing an EPS cable into a PCIe slot will trigger a motherboard power short-circuit!";
      } else if (cableId === 'pcie8' && portId === 'cpu8') {
        explain = "PCIe power connectors and CPU EPS connectors are physically keyed differently to prevent voltage line crossings. Do not mix them!";
      } else if (portId === 'mb24') {
        explain = "The 24-Pin ATX slot is the main motherboard power input. It only accepts the large 24-Pin main power harness.";
      }
      
      feedback.textContent = `❌ Cabling Error: ${explain}`;
      engine._setStatus(`Cabling mismatch: ${cableId} to ${portId}`);
      return;
    }

    if (cableId === 'satadata') {
      if (portId === 'mbsata') {
        connected.sata_data_mbside = true;
        feedback.style.color = '#10b981';
        feedback.textContent = `✓ One end connected to Motherboard SATA port. Now click the SSD SATA Data port to finish cabling.`;
        engine._setStatus(`Cabled SATA data motherboard end`);
        selectCable('satadata');
      } else if (portId === 'ssddata') {
        if (!connected.sata_data_mbside) {
          feedback.style.color = '#ef4444';
          feedback.textContent = `❌ Routing sequence: You must plug the SATA Data Cable into the Motherboard SATA port first!`;
          return;
        }
        connected.sata_data_ssdside = true;
        drawCablePath('mbsata', 'ssddata', cab.color);
        feedback.style.color = '#10b981';
        feedback.textContent = `✓ SATA Data Cable fully routed between Motherboard and SSD drive!`;
        engine._setStatus(`Fully cabled SATA data bus`);
        selectedCable = null;
        renderCableList();
        clearTargetHighlights();
        checkCablesCompletion();
      }
    } else {
      connected[portId] = true;
      drawCablePath(portId, null, cab.color);
      feedback.style.color = '#10b981';
      feedback.textContent = `✓ Connected ${cab.name} successfully!`;
      engine._setStatus(`Connected ${cableId}`);
      selectedCable = null;
      renderCableList();
      clearTargetHighlights();
      checkCablesCompletion();
    }
  }

  function clearTargetHighlights() {
    portTargets.forEach(t => {
      var rect = t.querySelector('rect:first-of-type');
      rect.style.filter = 'none';
      rect.setAttribute('stroke-width', '2px');
    });
  }

  function drawCablePath(portId, targetPortId, color) {
    var svgRect = container.querySelector('#cable-schematic-svg').getBoundingClientRect();
    var svg = container.querySelector('#cable-schematic-svg');

    // Get positions relative to SVG coordinate space
    var x1, y1, x2, y2;

    if (targetPortId) {
      // Cable connects port to port (e.g. SATA data)
      var p1 = getPortCoords(portId);
      var p2 = getPortCoords(targetPortId);
      x1 = p1.x; y1 = p1.y;
      x2 = p2.x; y2 = p2.y;
    } else {
      // Power cables connect from offscreen power supply (x=590, y=100)
      var p1 = getPortCoords(portId);
      x1 = 590; y1 = 100;
      x2 = p1.x; y2 = p1.y;
    }

    var path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    var mx = (x1 + x2) / 2;
    var my = (y1 + y2) / 2 + (targetPortId ? -40 : 50); // curve offset
    path.setAttribute('d', `M ${x1} ${y1} Q ${mx} ${my} ${x2} ${y2}`);
    path.setAttribute('stroke', color);
    path.setAttribute('stroke-width', '4');
    path.setAttribute('fill', 'none');
    path.setAttribute('opacity', '0.85');
    path.style.transition = 'all 0.3s;';
    overlay.appendChild(path);

    // Update port fill state to filled color
    var pRect = container.querySelector(`.port-border-${portId}`);
    if (pRect) pRect.setAttribute('fill', color);
    if (targetPortId) {
      var tRect = container.querySelector(`.port-border-${targetPortId}`);
      if (tRect) tRect.setAttribute('fill', color);
    }
  }

  function getPortCoords(portId) {
    var coords = {
      mb24: { x: 300, y: 135 },
      cpu8: { x: 87, y: 60 },
      mbsata: { x: 300, y: 232 },
      gpu8: { x: 300, y: 367 },
      ssdpower: { x: 463, y: 358 },
      ssddata: { x: 517, y: 358 }
    };
    return coords[portId] || { x: 0, y: 0 };
  }

  function checkCablesCompletion() {
    var allCabled = connected.mb24 && connected.cpu8 && connected.gpu8 && connected.ssdpower && connected.sata_data_mbside && connected.sata_data_ssdside;
    if (allCabled) {
      feedback.style.color = '#10b981';
      feedback.innerHTML = `🎉 <strong>Hardware Cabling Complete!</strong> Power lines and SATA data traces are securely pinned. System is ready for safe boot.`;
      engine._setStatus('Cable pinning simulation successfully complete');
      engine.markCompleted();
    }
  }

  // Load initial panel
  renderCableList();
}

deferInit(function(){
  new DiagramEngine({
    title: 'Cables',
    subtitle: 'Computer Assembly',
    desc: 'Match computer cables to their connectors and purposes.',
    module: 3,
    difficulty: 'Intermediate',
    time: '10',
    objectives: 'Match computer cables to their connectors and purposes.',
    components: components,
    connections: connections,
    steps: steps,
    tour: tour,
    
    render: function(container, engine) {
      engine.buildVisual(container);
      engine._setStatus('Click any component to explore');
    },
    
    customChallenge: function(container, engine) {
      initCableChallenge(container, engine);
    },
    
    animate: function() {},
    onReplay: function(engine) {
      engine.t = 0;
    }
  });
});
})();