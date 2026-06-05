(function(){'use strict';
var components = [
  {id:"case",name:"Computer Case",category:"Hardware",icon:"server",x:50,y:50,w:100,h:50,purpose:"Houses and protects all internal computer components",description:"The case provides a rigid frame where the motherboard, drives, and power supply mount, with airflow channels and front panel access.",why:"The case protects components and provides the structure for assembly",analogy:"Like the chassis of a car that holds everything together",funFact:"Cases come in form factors like ATX, Micro-ATX, and Mini-ITX",takeaway:"Choose a case that fits your motherboard size and has good airflow",mistake:"A bigger case doesn't always mean better cooling—airflow design matters more"},
  {id:"motherboard",name:"Motherboard",category:"Hardware",icon:"chip",x:200,y:50,w:100,h:50,purpose:"The main circuit board connecting all components",description:"The motherboard is a large PCB with sockets and slots for the CPU, RAM, storage, and expansion cards.",why:"The motherboard is the central nervous system of the computer",analogy:"Like the foundation and wiring of a house",funFact:"The first PC motherboard had only 24 chips",takeaway:"All components connect to the motherboard, which determines what hardware is compatible",mistake:"Not all CPUs fit all motherboards—check socket compatibility"},
  {id:"cpu",name:"CPU Processor",category:"Processing",icon:"cpu",x:200,y:150,w:100,h:50,purpose:"Executes instructions and performs calculations",description:"The CPU is the processor chip that interprets program instructions, performs arithmetic, and coordinates data flow through the system.",why:"The CPU is the brain of the computer where all processing happens",analogy:"Like the engine of a car that provides the power",funFact:"Modern CPUs contain billions of transistors on a chip the size of a fingernail",takeaway:"CPU choice determines overall system performance for most tasks",mistake:"A faster CPU alone doesn't guarantee better performance—RAM and storage also matter"},
  {id:"ram",name:"RAM Memory",category:"Memory",icon:"ram",x:50,y:150,w:100,h:50,purpose:"Provides temporary high-speed data storage for active programs",description:"RAM modules plug into motherboard slots and provide the working memory where the OS and applications run.",why:"RAM determines how many programs can run smoothly at once",analogy:"Like your desk space—more room lets you work with more documents simultaneously",funFact:"DDR5 RAM can transfer data at speeds up to 6400 MT/s",takeaway:"More RAM allows more multitasking and larger applications to run",mistake:"RAM is volatile—all data is lost when power is turned off"},
  {id:"storage",name:"Storage Drive",category:"Storage",icon:"hdd",x:50,y:250,w:100,h:50,purpose:"Permanently stores the OS, applications, and user files",description:"Storage drives—SSD or HDD—connect to the motherboard via SATA or M.2 and provide non-volatile data retention.",why:"Storage holds everything when the computer is off",analogy:"Like a filing cabinet that keeps documents even when you leave the room",funFact:"NVMe SSDs are up to 7x faster than SATA SSDs",takeaway:"Use an SSD for the OS and programs, HDD for bulk file storage",mistake:"Storage speed affects boot times and program loading more than processing speed"},
  {id:"psu",name:"Power Supply",category:"Hardware",icon:"power",x:200,y:250,w:100,h:50,purpose:"Converts wall AC power into regulated DC voltages for all components",description:"The PSU takes 120V/240V AC from the wall and converts it to +3.3V, +5V, and +12V DC power.",why:"The PSU provides the essential power every component needs to function",analogy:"Like the heart that pumps blood (power) to all parts of the body",funFact:"80 Plus certification indicates PSU efficiency, with Titanium being the best",takeaway:"A quality PSU is critical for system stability and component safety",mistake:"A higher wattage PSU doesn't always mean better—quality and efficiency matter more"}
];
var connections = [{from:"case",to:"motherboard"},{from:"motherboard",to:"cpu"},{from:"cpu",to:"ram"},{from:"ram",to:"storage"},{from:"storage",to:"psu"}];
var steps = [{id:"case",label:"Step 1: Case",status:"Install the computer case - the foundation of your build"},{id:"motherboard",label:"Step 2: Motherboard",status:"Install the motherboard into the case"},{id:"cpu",label:"Step 3: CPU",status:"Install the CPU processor onto the motherboard"},{id:"ram",label:"Step 4: RAM",status:"Install RAM modules into the motherboard slots"},{id:"storage",label:"Step 5: Storage",status:"Install the storage drive (SSD/HDD)"},{id:"psu",label:"Step 6: PSU",status:"Install the power supply unit and connect cables"}];
var tour = [{title:"Computer Case",description:"Start by preparing the case for assembly",componentId:"case"},{title:"Motherboard",description:"Mount the motherboard inside the case",componentId:"motherboard"},{title:"CPU Processor",description:"Carefully install the CPU in its socket",componentId:"cpu"},{title:"RAM Memory",description:"Insert RAM sticks into the correct slots",componentId:"ram"},{title:"Storage Drive",description:"Mount the SSD or HDD and connect it",componentId:"storage"},{title:"Power Supply",description:"Install the PSU and connect all power cables",componentId:"psu"}];

function _findComp(id){return components.find(function(c){return c.id===id})||null}

function buildDragDrop(container, engine){
  var stepOrder=['case','motherboard','cpu','ram','storage','psu'];
  var placed={};
  var allPlaced=false;
  var mode='beginner';
  var draggingEl=null;
  var touchId=null;

  container.innerHTML='';
  
  // Create wrapper layout
  var mainLayout=document.createElement('div');
  mainLayout.className='assembly-layout';
  mainLayout.style.cssText='display:flex; gap:16px; width:100%; flex-wrap:wrap; padding: 12px;';
  container.appendChild(mainLayout);

  // ── Workspace (left/top) ──
  var ws=document.createElement('div');
  ws.style.cssText='flex:1.4; min-width:280px; position:relative; background:linear-gradient(135deg,#0f1729,#0a0e17); border:1px solid rgba(255,255,255,0.06); border-radius:12px; padding:16px; display:flex; flex-direction:column; align-items:center; justify-content:center';
  var wsInner=document.createElement('div');
  wsInner.style.cssText='position:relative; width:100%; max-width:500px; aspect-ratio:4/3; background:rgba(15,23,42,0.6); border:2px dashed rgba(255,255,255,0.08); border-radius:12px; margin:0 auto; overflow:hidden;';
  ws.appendChild(wsInner);
  mainLayout.appendChild(ws);

  // ── Component palette (right/bottom) ──
  var palette=document.createElement('div');
  palette.className='assembly-palette';
  palette.style.cssText='flex:1; min-width:240px; display:flex; flex-direction:column; gap:10px; padding:12px; background:rgba(255,255,255,0.02); border:1px solid rgba(255,255,255,0.06); border-radius:8px;';
  var palTitle=document.createElement('div');
  palTitle.textContent='Component Toolbox';
  palTitle.style.cssText='font-size:11px; font-weight:600; text-transform:uppercase; letter-spacing:0.05em; color:#64748b; padding-bottom:6px; border-bottom:1px solid rgba(255,255,255,0.06)';
  palette.appendChild(palTitle);
  mainLayout.appendChild(palette);

  // ── Feedback Box ──
  var feedBox = document.createElement('div');
  feedBox.style.cssText = 'width:100%; padding:10px 14px; background:rgba(0,0,0,0.3); border:1px solid rgba(255,255,255,0.06); border-radius:8px; font-size:12px; color:#cbd5e1;';
  feedBox.id = 'assembly-feedback';
  feedBox.textContent = 'Drag Case to the workspace to begin the computer assembly.';
  container.appendChild(feedBox);

  // ── Drop Zones definitions matching real chassis layout ──
  var zoneDefs={
    case:{label:'Computer Case',x:5,y:5,w:90,h:90,desc:'Place the computer case here'},
    motherboard:{label:'Motherboard',x:12,y:12,w:50,h:60,desc:'Mount the motherboard into the case'},
    cpu:{label:'CPU Socket',x:20,y:20,w:14,h:18,desc:'Insert the CPU into the socket'},
    ram:{label:'RAM Slots',x:38,y:18,w:10,h:24,desc:'Insert RAM into the DIMM slots'},
    storage:{label:'Storage Bay',x:68,y:15,w:18,h:40,desc:'Mount the SSD/HDD in the drive bay'},
    psu:{label:'PSU Bay',x:15,y:76,w:36,h:16,desc:'Install the power supply unit'}
  };

  // Inject responsive stylesheet overrides
  if(!document.getElementById('dd-assembly-styles')){
    var style=document.createElement('style');
    style.id='dd-assembly-styles';
    style.textContent=`
      @media (max-width: 768px) {
        .assembly-layout {
          flex-direction: column !important;
        }
        .assembly-palette {
          width: 100% !important;
          max-height: none !important;
        }
      }
    `;
    document.head.appendChild(style);
  }

  // Draw empty zones in workspace
  function drawZones(){
    wsInner.innerHTML='';
    
    // Draw active target zone (only the current step is active)
    var nextToPlace = stepOrder.find(id => !placed[id]);
    
    // Draw placed background components first (to ensure correct layering)
    stepOrder.forEach(function(id) {
      if (!placed[id]) return;
      var z = zoneDefs[id];
      var el = document.createElement('div');
      
      // Make case background non-blocking so it doesn't cover other slots
      var isCase = (id === 'case');
      el.style.cssText = 'position:absolute; left:'+z.x+'%; top:'+z.y+'%; width:'+z.w+'%; height:'+z.h+'%; background:rgba(16,185,129,0.08); border:2px solid #10b981; border-radius:8px; display:flex; align-items:center; justify-content:center; flex-direction:column; box-shadow:0 0 10px rgba(16,185,129,0.1);' + (isCase ? 'pointer-events:none; z-index:1;' : 'z-index:2; cursor:pointer;');
      
      if (!isCase) {
        var nm = document.createElement('span');
        nm.textContent = _findComp(id) ? _findComp(id).name : '';
        nm.style.cssText = 'font-size:9px; color:#10b981; font-weight:600; text-align:center; pointer-events:none; line-height:1.2';
        el.appendChild(nm);
        var ck = document.createElement('span');
        ck.textContent = '✓';
        ck.style.cssText = 'font-size:12px; color:#10b981; pointer-events:none; font-weight:bold;';
        el.appendChild(ck);
        el.addEventListener('click', function() {
          if(_findComp(id)) engine.selectComponent(id);
        });
      } else {
        // Draw case skeleton graphics
        el.innerHTML = '<div style="position:absolute; bottom:4px; right:8px; font-size:9px; color:rgba(16,185,129,0.4); font-weight:700;">CHASSIS FRAME</div>';
      }
      wsInner.appendChild(el);
    });

    // Draw active zone outline (dashed box)
    if (nextToPlace) {
      var z = zoneDefs[nextToPlace];
      var zone = document.createElement('div');
      zone.dataset.zoneId = nextToPlace;
      zone.style.cssText = 'position:absolute; left:'+z.x+'%; top:'+z.y+'%; width:'+z.w+'%; height:'+z.h+'%; border:2px dashed #3b82f6; border-radius:6px; display:flex; align-items:center; justify-content:center; background:rgba(59,130,246,0.03); transition:all 0.3s; z-index:5;';
      
      var zlbl = document.createElement('span');
      zlbl.textContent = z.label;
      zlbl.style.cssText = 'font-size:9px; color:#3b82f6; font-weight:600; text-align:center; pointer-events:none; line-height:1.2';
      zone.appendChild(zlbl);
      
      // Drag & Drop event bindings
      zone.addEventListener('dragover', function(e) {
        e.preventDefault();
        this.style.borderColor = '#60a5fa';
        this.style.background = 'rgba(59,130,246,0.1)';
      });
      zone.addEventListener('dragleave', function() {
        this.style.borderColor = '#3b82f6';
        this.style.background = 'rgba(59,130,246,0.03)';
      });
      zone.addEventListener('drop', function(e) {
        e.preventDefault();
        var id = e.dataTransfer.getData('text/plain');
        tryHandleDrop(id, this.dataset.zoneId);
      });
      wsInner.appendChild(zone);
    }
  }

  // ── Build component palette ──
  function buildPalette(){
    while (palette.children.length > 1) palette.removeChild(palette.lastChild);

    stepOrder.forEach(function(id) {
      if (placed[id]) return;
      var comp = _findComp(id);
      if (!comp) return;
      
      var card = document.createElement('div');
      card.draggable = true;
      card.dataset.compId = id;
      card.style.cssText = 'padding:10px 12px; background:rgba(255,255,255,0.03); border:1px solid rgba(255,255,255,0.08); border-radius:6px; cursor:grab; transition:all 0.2s; user-select:none; display:flex; flex-direction:column; gap:2px;';
      card.innerHTML = `<div style="font-size:12px; font-weight:600; color:#e2e8f0;">${comp.name}</div><div style="font-size:9px; color:#64748b;">${comp.category}</div>`;
      
      card.addEventListener('dragstart', function(e) {
        draggingEl = this;
        e.dataTransfer.setData('text/plain', id);
        this.style.opacity = '0.4';
      });
      card.addEventListener('dragend', function() {
        this.style.opacity = '1';
        draggingEl = null;
      });
      
      // Mobile/Tablet Touch support
      card.addEventListener('touchstart', function(e) {
        var touch = e.touches[0];
        touchId = id;
        this.style.opacity = '0.4';
        
        var ghost = document.createElement('div');
        ghost.id = 'drag-ghost';
        ghost.textContent = comp.name;
        ghost.style.cssText = 'position:fixed; pointer-events:none; z-index:9999; padding:8px 14px; background:#0959C8; color:#fff; border-radius:6px; font-size:12px; font-weight:600; box-shadow:0 8px 24px rgba(0,0,0,0.4); transform:translate(-50%,-50%)';
        document.body.appendChild(ghost);
        moveGhost(touch.clientX, touch.clientY);
      }, { passive: true });

      card.addEventListener('touchmove', function(e) {
        var touch = e.touches[0];
        moveGhost(touch.clientX, touch.clientY);
      }, { passive: true });

      card.addEventListener('touchend', function(e) {
        this.style.opacity = '1';
        var ghost = document.getElementById('drag-ghost');
        if (ghost) ghost.remove();
        
        var touch = e.changedTouches[0];
        var target = document.elementFromPoint(touch.clientX, touch.clientY);
        if (target) {
          var zone = target.closest('[data-zone-id]');
          if (zone) {
            tryHandleDrop(touchId, zone.dataset.zoneId);
          }
        }
        touchId = null;
      });
      
      palette.appendChild(card);
    });

    var pCount = Object.keys(placed).length;
    var prog = document.createElement('div');
    prog.style.cssText = 'font-size:10px; color:#64748b; padding-top:8px; border-top:1px solid rgba(255,255,255,0.06); text-align:center; font-weight:600;';
    prog.textContent = `Progress: ${pCount} / ${stepOrder.length} Assembled`;
    palette.appendChild(prog);
  }

  function moveGhost(x, y){
    var ghost = document.getElementById('drag-ghost');
    if (ghost) {
      ghost.style.left = x + 'px';
      ghost.style.top = y + 'px';
    }
  }

  function tryHandleDrop(compId, zoneId) {
    if (!compId) return;
    
    // Check strict assembly order
    var targetIdx = stepOrder.indexOf(compId);
    for (var i = 0; i < targetIdx; i++) {
      if (!placed[stepOrder[i]]) {
        var prevName = _findComp(stepOrder[i]).name;
        feedBox.style.color = '#ef4444';
        feedBox.textContent = `❌ Assembly Order Error: You must install the ${prevName} before installing the ${_findComp(compId).name}.`;
        engine._setStatus(`Assembly error: missing ${prevName}`);
        return;
      }
    }

    if (compId !== zoneId) {
      feedBox.style.color = '#ef4444';
      feedBox.textContent = `❌ Fit Error: The ${_findComp(compId).name} does not belong in the ${zoneDefs[zoneId].label} slot.`;
      return;
    }

    placed[compId] = true;
    engine.selectComponent(compId);
    
    var nextItem = stepOrder[targetIdx + 1];
    feedBox.style.color = '#10b981';
    if (nextItem) {
      feedBox.textContent = `✓ Placed ${_findComp(compId).name}. Next step: Install the ${_findComp(nextItem).name}.`;
    } else {
      feedBox.textContent = `✓ All parts installed! Click the Power button below to boot the system.`;
      allPlaced = true;
      showPowerBtn();
    }
    
    drawZones();
    buildPalette();
  }

  function showPowerBtn() {
    if (container.querySelector('#btn-power-on')) return;
    var btn = document.createElement('button');
    btn.id = 'btn-power-on';
    btn.textContent = '⚡ POWER ON SYSTEM';
    btn.style.cssText = 'margin:12px auto; padding:12px 30px; font-size:13px; font-weight:700; background:linear-gradient(135deg,#10b981,#059669); color:#fff; border:none; border-radius:8px; cursor:pointer; box-shadow:0 0 20px rgba(16,185,129,0.3); font-family:inherit; transition: all 0.3s;';
    btn.addEventListener('click', function() {
      bootSystem(this);
    });
    container.appendChild(btn);
  }

  function bootSystem(btn) {
    btn.disabled = true;
    btn.style.opacity = '0.7';
    feedBox.style.color = '#3b82f6';
    feedBox.textContent = 'Initializing BIOS and checking hardware connection components...';
    
    var stages = [
      'Initializing BIOS chip set... OK',
      'Running Power-On Self Test (POST)... Check OK',
      'RAM Check: 16 GB DDR5 detected... OK',
      'Storage Check: NVMe SSD detected... OK',
      'Loading Windows/Linux Bootloader...',
      'System Ready!'
    ];

    var idx = 0;
    var interval = setInterval(function() {
      if (idx < stages.length) {
        feedBox.textContent = `> ${stages[idx]}`;
        engine._setStatus(stages[idx]);
        idx++;
      } else {
        clearInterval(interval);
        feedBox.style.color = '#10b981';
        feedBox.innerHTML = `<strong>🎉 Success!</strong> Computer assembled and booted successfully! Course checkpoint completed.`;
        engine._setStatus('PC assembly simulation successfully finished');
        engine.markCompleted();
      }
    }, 1000);
  }

  // Draw initial state
  drawZones();
  buildPalette();
}

deferInit(function(){
  new DiagramEngine({
    title: 'Computer Assembly',
    subtitle: 'Drag & Drop - Build Your Computer',
    desc: 'Build a computer step by step by selecting and installing components.',
    module: 3,
    difficulty: 'Intermediate',
    time: '10',
    objectives: 'Build a computer by selecting and installing each component.',
    components: components,
    connections: connections,
    steps: steps,
    tour: tour,
    
    render: function(container, engine) {
      engine.buildVisual(container);
      engine._setStatus('Click any component to explore');
    },
    
    customChallenge: function(container, engine) {
      buildDragDrop(container, engine);
    },

    animate: function(engine) {},
    onReplay: function(engine) {}
  });
});
})();
