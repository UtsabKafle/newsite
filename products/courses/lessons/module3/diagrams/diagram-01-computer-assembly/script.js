(function(){'use strict';
var components = [
  {id:"case",name:"Computer Case",category:"Hardware",icon:"server",purpose:"Houses and protects all internal computer components",description:"The case provides a rigid frame where the motherboard, drives, and power supply mount, with airflow channels and front panel access.",why:"The case protects components and provides the structure for assembly",analogy:"Like the chassis of a car that holds everything together",funFact:"Cases come in form factors like ATX, Micro-ATX, and Mini-ITX",takeaway:"Choose a case that fits your motherboard size and has good airflow",mistake:"A bigger case doesn't always mean better cooling—airflow design matters more"},
  {id:"motherboard",name:"Motherboard",category:"Hardware",icon:"chip",purpose:"The main circuit board connecting all components",description:"The motherboard is a large PCB with sockets and slots for the CPU, RAM, storage, and expansion cards.",why:"The motherboard is the central nervous system of the computer",analogy:"Like the foundation and wiring of a house",funFact:"The first PC motherboard had only 24 chips",takeaway:"All components connect to the motherboard, which determines what hardware is compatible",mistake:"Not all CPUs fit all motherboards—check socket compatibility"},
  {id:"cpu",name:"CPU Processor",category:"Processing",icon:"cpu",purpose:"Executes instructions and performs calculations",description:"The CPU is the processor chip that interprets program instructions, performs arithmetic, and coordinates data flow through the system.",why:"The CPU is the brain of the computer where all processing happens",analogy:"Like the engine of a car that provides the power",funFact:"Modern CPUs contain billions of transistors on a chip the size of a fingernail",takeaway:"CPU choice determines overall system performance for most tasks",mistake:"A faster CPU alone doesn't guarantee better performance—RAM and storage also matter"},
  {id:"ram",name:"RAM Memory",category:"Memory",icon:"ram",purpose:"Provides temporary high-speed data storage for active programs",description:"RAM modules plug into motherboard slots and provide the working memory where the OS and applications run.",why:"RAM determines how many programs can run smoothly at once",analogy:"Like your desk space—more room lets you work with more documents simultaneously",funFact:"DDR5 RAM can transfer data at speeds up to 6400 MT/s",takeaway:"More RAM allows more multitasking and larger applications to run",mistake:"RAM is volatile—all data is lost when power is turned off"},
  {id:"storage",name:"Storage Drive",category:"Storage",icon:"hdd",purpose:"Permanently stores the OS, applications, and user files",description:"Storage drives—SSD or HDD—connect to the motherboard via SATA or M.2 and provide non-volatile data retention.",why:"Storage holds everything when the computer is off",analogy:"Like a filing cabinet that keeps documents even when you leave the room",funFact:"NVMe SSDs are up to 7x faster than SATA SSDs",takeaway:"Use an SSD for the OS and programs, HDD for bulk file storage",mistake:"Storage speed affects boot times and program loading more than processing speed"},
  {id:"psu",name:"Power Supply",category:"Hardware",icon:"power",purpose:"Converts wall AC power into regulated DC voltages for all components",description:"The PSU takes 120V/240V AC from the wall and converts it to +3.3V, +5V, and +12V DC power.",why:"The PSU provides the essential power every component needs to function",analogy:"Like the heart that pumps blood (power) to all parts of the body",funFact:"80 Plus certification indicates PSU efficiency, with Titanium being the best",takeaway:"A quality PSU is critical for system stability and component safety",mistake:"A higher wattage PSU doesn't always mean better—quality and efficiency matter more"}
];
var connections = [{from:"case",to:"motherboard"},{from:"motherboard",to:"cpu"},{from:"cpu",to:"ram"},{from:"ram",to:"storage"},{from:"storage",to:"psu"}];
var steps = [{label:"Step 1: Case",status:"Install the computer case - the foundation of your build"},{label:"Step 2: Motherboard",status:"Install the motherboard into the case"},{label:"Step 3: CPU",status:"Install the CPU processor onto the motherboard"},{label:"Step 4: RAM",status:"Install RAM modules into the motherboard slots"},{label:"Step 5: Storage",status:"Install the storage drive (SSD/HDD)"},{label:"Step 6: PSU",status:"Install the power supply unit and connect cables"}];
var tour = [{title:"Computer Case",description:"Start by preparing the case for assembly",componentId:"case"},{title:"Motherboard",description:"Mount the motherboard inside the case",componentId:"motherboard"},{title:"CPU Processor",description:"Carefully install the CPU in its socket",componentId:"cpu"},{title:"RAM Memory",description:"Insert RAM sticks into the correct slots",componentId:"ram"},{title:"Storage Drive",description:"Mount the SSD or HDD and connect it",componentId:"storage"},{title:"Power Supply",description:"Install the PSU and connect all power cables",componentId:"psu"}];

// ─── Drag & Drop Assembly Builder ───
function _findComp(id){return components.find(function(c){return c.id===id})||null}

function buildDragDrop(container, engine){
  var stepOrder=['case','motherboard','cpu','ram','storage','psu'];
  var placed={};
  var allPlaced=false;
  var mode=engine.cfg.mode||'beginner';
  var draggingEl=null;
  var dragOffsetX=0,dragOffsetY=0;
  var touchId=null;

  container.innerHTML='';
  container.style.display='flex';
  container.style.flexDirection='column';
  container.style.gap='16px';
  container.style.padding='12px';

  // ── Mode Selector ──
  var modeBar=document.createElement('div');
  modeBar.style.cssText='display:flex;gap:6px;align-items:center;flex-wrap:wrap;padding:10px 14px;background:var(--surface2,#111827);border-radius:8px;border:1px solid rgba(255,255,255,0.06)';
  var modeLabel=document.createElement('span');
  modeLabel.textContent='Mode:';
  modeLabel.style.cssText='font-size:11px;color:#64748b;font-weight:600;text-transform:uppercase;letter-spacing:0.05em';
  modeBar.appendChild(modeLabel);
  ['beginner','challenge','expert'].forEach(function(m){
    var btn=document.createElement('button');
    btn.textContent=m.charAt(0).toUpperCase()+m.slice(1);
    btn.dataset.mode=m;
    btn.style.cssText='padding:4px 12px;font-size:11px;border:1px solid rgba(255,255,255,0.1);border-radius:6px;background:'+(m===mode?'rgba(9,89,200,0.2)':'transparent')+';color:'+(m===mode?'#1a7cff':'#94a3b8')+';cursor:pointer;transition:all 0.2s;font-weight:500;font-family:inherit';
    btn.addEventListener('click',function(){
      engine._setStatus('Mode: '+m.charAt(0).toUpperCase()+m.slice(1));
      mode=m;
      modeBar.querySelectorAll('button[data-mode]').forEach(function(b){b.style.background='transparent';b.style.color='#94a3b8'});
      btn.style.background='rgba(9,89,200,0.2)';btn.style.color='#1a7cff';
      if(m==='expert')startTimer();
    });
    modeBar.appendChild(btn);
  });
  container.appendChild(modeBar);

  // ── Main build area ──
  var buildArea=document.createElement('div');
  buildArea.style.cssText='display:flex;gap:16px;flex:1;min-height:0';
  container.appendChild(buildArea);

  // ── Workspace (left) ──
  var ws=document.createElement('div');
  ws.style.cssText='flex:1;position:relative;background:linear-gradient(135deg,#0f1729,#0a0e17);border:1px solid rgba(255,255,255,0.06);border-radius:12px;padding:16px;min-height:320px;display:flex;flex-direction:column;align-items:center;justify-content:center';
  var wsInner=document.createElement('div');
  wsInner.style.cssText='position:relative;width:100%;max-width:520px;aspect-ratio:4/3;background:rgba(15,23,42,0.6);border:2px dashed rgba(255,255,255,0.08);border-radius:12px;margin:0 auto';
  ws.appendChild(wsInner);
  buildArea.appendChild(ws);

  // ── Component palette (right) ──
  var palette=document.createElement('div');
  palette.style.cssText='width:180px;flex-shrink:0;display:flex;flex-direction:column;gap:8px;padding:12px;background:var(--surface2,#111827);border:1px solid rgba(255,255,255,0.06);border-radius:8px;max-height:400px;overflow-y:auto';
  var palTitle=document.createElement('div');
  palTitle.textContent='Components';
  palTitle.style.cssText='font-size:11px;font-weight:600;text-transform:uppercase;letter-spacing:0.05em;color:#64748b;padding-bottom:6px;border-bottom:1px solid rgba(255,255,255,0.06)';
  palette.appendChild(palTitle);

  // ── Drop Zones ──
  var zoneDefs={
    case:{label:'Case',x:5,y:5,w:90,h:90,desc:'Place the computer case here',icon:'[ ]'},
    motherboard:{label:'Motherboard',x:5,y:5,w:90,h:75,desc:'Mount the motherboard into the case',icon:'[ ]'},
    cpu:{label:'CPU Socket',x:16,y:20,w:30,h:30,desc:'Insert the CPU into the socket',icon:'[ ]'},
    ram:{label:'RAM Slots',x:54,y:20,w:14,h:40,desc:'Insert RAM into the DIMM slots',icon:'| |'},
    storage:{label:'Storage Bay',x:5,y:70,w:40,h:20,desc:'Mount the SSD/HDD in the drive bay',icon:'[ ]'},
    psu:{label:'PSU Bay',x:54,y:68,w:38,h:22,desc:'Install the power supply unit',icon:'[ ]'}
  };

  // Recalculate zone positions relative to wsInner
  function getZonePos(id){
    var z=zoneDefs[id];if(!z)return null;
    var r=wsInner.getBoundingClientRect();
    var scale=r.width/100;
    return {x:r.left+z.x*scale,y:r.top+z.y*scale,w:z.w*scale,h:z.h*scale};
  }

  // Draw empty zones in workspace
  function drawZones(){
    wsInner.innerHTML='';
    wsInner.style.position='relative';
    // Motherboard outline
    var mb=document.createElement('div');
    mb.style.cssText='position:absolute;left:3%;top:3%;width:94%;height:94%;border:1px solid rgba(255,255,255,0.1);border-radius:8px;background:rgba(9,89,200,0.03)';
    wsInner.appendChild(mb);
    // Label
    var lbl=document.createElement('div');
    lbl.textContent='🖥 MOTHERBOARD';
    lbl.style.cssText='position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);font-size:10px;color:rgba(255,255,255,0.15);font-weight:600;letter-spacing:1px';
    wsInner.appendChild(lbl);

    stepOrder.forEach(function(id){
      if(placed[id])return;
      var z=zoneDefs[id];if(!z)return;
      var zone=document.createElement('div');
      zone.dataset.zoneId=id;
      zone.style.cssText='position:absolute;left:'+z.x+'%;top:'+z.y+'%;width:'+z.w+'%;height:'+z.h+'%;border:2px dashed rgba(96,165,250,0.3);border-radius:6px;display:flex;align-items:center;justify-content:center;transition:all 0.3s;cursor:default';
      var zlbl=document.createElement('span');
      zlbl.textContent=z.label;
      zlbl.style.cssText='font-size:8px;color:rgba(96,165,250,0.4);font-weight:500;text-align:center;pointer-events:none;line-height:1.2';
      zone.appendChild(zlbl);
      // Drop events
      zone.addEventListener('dragover',function(e){e.preventDefault();this.style.borderColor='rgba(96,165,250,0.8)';this.style.background='rgba(9,89,200,0.1)'});
      zone.addEventListener('dragleave',function(e){this.style.borderColor='rgba(96,165,250,0.3)';this.style.background='transparent'});
      zone.addEventListener('drop',function(e){e.preventDefault();this.style.borderColor='rgba(96,165,250,0.3)';this.style.background='transparent';tryHandleDrop(e,this.dataset.zoneId)});
      wsInner.appendChild(zone);
    });

    // Draw placed components
    Object.keys(placed).forEach(function(id){
      if(!placed[id])return;
      var z=zoneDefs[id];if(!z)return;
      var el=document.createElement('div');
      el.style.cssText='position:absolute;left:'+z.x+'%;top:'+z.y+'%;width:'+z.w+'%;height:'+z.h+'%;background:rgba(34,197,94,0.15);border:2px solid rgba(34,197,94,0.6);border-radius:6px;display:flex;align-items:center;justify-content:center;flex-direction:column;animation:popIn 0.3s ease';
      var nm=document.createElement('span');
      nm.textContent=_findComp(id)?_findComp(id).name:'';
      nm.style.cssText='font-size:9px;color:#22c55e;font-weight:600;text-align:center;pointer-events:none;line-height:1.2';
      el.appendChild(nm);
      var ck=document.createElement('span');
      ck.textContent='\u2713';
      ck.style.cssText='font-size:14px;color:#22c55e;pointer-events:none';
      el.appendChild(ck);
      el.addEventListener('click',function(){if(_findComp(id))engine.selectComponent(id)});
      wsInner.appendChild(el);
    });
  }

  // ── Build component palette ──
  function buildPalette(){
    // Remove old palette items (keep title)
    while(palette.children.length>1)palette.removeChild(palette.lastChild);

    stepOrder.forEach(function(id){
      if(placed[id])return;
      var comp=_findComp(id);if(!comp)return;
      var card=document.createElement('div');
      card.draggable=true;
      card.dataset.compId=id;
      card.style.cssText='padding:8px 10px;background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.08);border-radius:6px;cursor:grab;transition:all 0.2s;user-select:none';
      card.innerHTML='<div style="font-size:12px;font-weight:600;color:#e2e8f0">'+comp.name+'</div><div style="font-size:9px;color:#64748b;margin-top:2px">'+comp.category+'</div>';
      card.addEventListener('dragstart',function(e){
        draggingEl=this;
        e.dataTransfer.effectAllowed='move';
        e.dataTransfer.setData('text/plain',id);
        this.style.opacity='0.4';
      });
      card.addEventListener('dragend',function(e){
        this.style.opacity='1';
        draggingEl=null;
      });
      // Touch support
      card.addEventListener('touchstart',function(e){
        var touch=e.touches[0];
        dragOffsetX=touch.clientX;
        dragOffsetY=touch.clientY;
        touchId=id;
        this.style.opacity='0.4';
        // Create floating ghost
        var ghost=document.createElement('div');
        ghost.id='drag-ghost';
        ghost.textContent=comp.name;
        ghost.style.cssText='position:fixed;pointer-events:none;z-index:9999;padding:8px 14px;background:rgba(9,89,200,0.9);color:#fff;border-radius:6px;font-size:12px;font-weight:600;box-shadow:0 4px 20px rgba(0,0,0,0.3);transform:translate(-50%,-50%)';
        document.body.appendChild(ghost);
        moveGhost(touch.clientX,touch.clientY);
      },{passive:true});
      card.addEventListener('touchmove',function(e){
        e.preventDefault();
        var touch=e.touches[0];
        moveGhost(touch.clientX,touch.clientY);
      },{passive:false});
      card.addEventListener('touchend',function(e){
        this.style.opacity='1';
        var ghost=document.getElementById('drag-ghost');
        if(ghost)ghost.remove();
        var touch=e.changedTouches[0];
        // Find what element is under the finger
        var target=document.elementFromPoint(touch.clientX,touch.clientY);
        if(target){
          var zone=target.closest('[data-zone-id]');
          if(zone)tryHandleDrop(null,zone.dataset.zoneId,touchId);
        }
        touchId=null;
      });
      palette.appendChild(card);
    });

    // Progress + Reset
    var placedCount=Object.keys(placed).length;
    var prog=document.createElement('div');
    prog.style.cssText='font-size:10px;color:#64748b;padding:4px 0;text-align:center';
    prog.textContent=placedCount+'/'+stepOrder.length+' placed';
    palette.appendChild(prog);
  }

  function moveGhost(x,y){
    var ghost=document.getElementById('drag-ghost');
    if(ghost){ghost.style.left=x+'px';ghost.style.top=y+'px'}
  }

  function tryHandleDrop(e,zoneId,compId){
    compId=compId||draggingEl&&draggingEl.dataset.compId;
    if(!compId)return;
    if(placed[compId]){engine._setStatus('Already placed');return}
    if(compId!==zoneId){
      // Wrong zone
      var zone=wsInner.querySelector('[data-zone-id="'+zoneId+'"]');
      if(zone){
        zone.style.borderColor='rgba(239,68,68,0.8)';
        zone.style.background='rgba(239,68,68,0.1)';
        engine._setStatus('Try again: '+zoneDefs[zoneId].label+' doesn\'t need '+(_findComp(compId)?_findComp(compId).name:compId));
        setTimeout(function(){if(zone){zone.style.borderColor='rgba(96,165,250,0.3)';zone.style.background='transparent'}},1500);
        if(mode==='challenge')showHint(compId,zoneId);
      }
      return;
    }
    // Correct placement
    placed[compId]=true;
    engine.selectComponent(compId);
    engine._setStatus('Correct! '+(_findComp(compId)?_findComp(compId).name:compId)+' placed');

    // Remove from palette, update workspace
    var paletteCard=palette.querySelector('[data-comp-id="'+compId+'"]');
    if(paletteCard)paletteCard.remove();

    drawZones();
    buildPalette();

    // Check if all placed
    if(Object.keys(placed).length===stepOrder.length){
      allPlaced=true;
      engine._setStatus('All components placed! Power on the system');
      showPowerOnButton();
    }
  }

  function showHint(compId,wrongZoneId){
    // Show what goes where
    var hint=document.createElement('div');
    hint.textContent='Hint: Try placing '+(compId?compId:'this')+' in its matching zone';
    hint.style.cssText='position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);padding:12px 24px;background:#1e293b;border:1px solid rgba(234,179,8,0.5);border-radius:8px;color:#eab308;font-size:13px;font-weight:500;z-index:100;animation:fadeInOut 2s ease forwards';
    document.body.appendChild(hint);
    setTimeout(function(){if(hint.parentNode)hint.parentNode.removeChild(hint)},2000);
  }

  function showPowerOnButton(){
    var btn=document.createElement('button');
    btn.textContent='\u26a1 POWER ON';
    btn.style.cssText='margin:12px auto;padding:12px 32px;font-size:14px;font-weight:700;background:linear-gradient(135deg,#22c55e,#16a34a);color:#fff;border:none;border-radius:8px;cursor:pointer;box-shadow:0 0 30px rgba(34,197,94,0.4);animation:pulse 1.5s infinite;font-family:inherit';
    btn.addEventListener('click',function(){
      powerOnSequence(btn);
    });
    container.appendChild(btn);
  }

  function powerOnSequence(btn){
    if(btn)btn.disabled=true;
    engine._setStatus('Powering on...');
    // Boot sequence animation
    var stages=['BIOS Initializing...','POST Check...','Loading Bootloader...','Starting OS...','Login Screen'];
    var i=0;
    var bootEl=document.createElement('div');
    bootEl.style.cssText='text-align:center;padding:16px;font-size:13px;color:#22c55e;font-weight:500;font-family:monospace';
    container.appendChild(bootEl);
    var interval=setInterval(function(){
      if(i>=stages.length){
        clearInterval(interval);
        bootEl.textContent='\u2705 SYSTEM READY';
        bootEl.style.color='#22c55e';
        bootEl.style.fontSize='16px';
        engine._setStatus('Computer assembled and booted successfully!');
        // Boot complete animation - show CPU activity
        var bar=document.createElement('div');
        bar.style.cssText='height:4px;background:linear-gradient(90deg,#22c55e,#0959C8);border-radius:2px;animation:scanBar 2s ease infinite;margin-top:8px';
        bootEl.appendChild(bar);
      }else{
        bootEl.textContent='> '+stages[i];
        engine._setStatus(stages[i]);
        i++;
      }
    },800*engine.speed);
    // Speed-adjusted interval
    var origSpeed=engine.speed;
    var speedCheck=setInterval(function(){
      if(engine.speed!==origSpeed){
        clearInterval(interval);
        clearInterval(speedCheck);
        // Restart with new speed
        i=0;
        interval=setInterval(function(){
          if(i>=stages.length){
            clearInterval(interval);
            bootEl.textContent='\u2705 SYSTEM READY';
            bootEl.style.color='#22c55e';
            engine._setStatus('Computer assembled and booted successfully!');
          }else{
            bootEl.textContent='> '+stages[i];
            engine._setStatus(stages[i]);
            i++;
          }
        },800/engine.speed);
      }
    },500);
  }

  // ── Expert timer ──
  var timerInterval=null;
  var seconds=0;
  function startTimer(){
    if(timerInterval)clearInterval(timerInterval);
    seconds=0;
    var timerEl=document.getElementById('expert-timer')||function(){
      var t=document.createElement('div');
      t.id='expert-timer';
      t.style.cssText='font-size:12px;color:#64748b;font-weight:500;margin-left:auto;font-variant-numeric:tabular-nums';
      modeBar.appendChild(t);
      return t;
    }();
    timerEl.textContent='Time: 0s';
    timerInterval=setInterval(function(){
      seconds++;
      timerEl.textContent='Time: '+seconds+'s';
    },1000);
  }

  // ── Reset ──
  var resetBtn=document.createElement('button');
  resetBtn.textContent='\u21bb Reset';
  resetBtn.style.cssText='padding:6px 14px;font-size:11px;border:1px solid rgba(255,255,255,0.1);border-radius:6px;background:transparent;color:#94a3b8;cursor:pointer;transition:all 0.2s;font-family:inherit;margin-left:auto';
  resetBtn.addEventListener('click',function(){
    placed={};allPlaced=false;
    if(timerInterval){clearInterval(timerInterval);timerInterval=null}
    var timerEl=document.getElementById('expert-timer');
    if(timerEl)timerEl.remove();
    // Remove power-on button and boot sequence
    var powerBtns=container.querySelectorAll('button:not([data-mode]):not(.step-btn):not(.ctrl-btn)');
    powerBtns.forEach(function(b){if(b.textContent.includes('POWER')||b.textContent.includes('>'))b.remove()});
    var bootEls=container.querySelectorAll('[style*="font-family:monospace"]');
    bootEls.forEach(function(e){e.remove()});
    drawZones();
    buildPalette();
    engine._setStatus('Build reset. Start assembling!');
  });
  modeBar.appendChild(resetBtn);

  // ── Initial render ──
  drawZones();
  buildPalette();

  // ── Inject keyframes ──
  if(!document.getElementById('dd-keyframes')){
    var style=document.createElement('style');
    style.id='dd-keyframes';
    style.textContent='@keyframes popIn{0%{transform:scale(0.5);opacity:0}100%{transform:scale(1);opacity:1}}@keyframes fadeInOut{0%{opacity:0}20%{opacity:1}80%{opacity:1}100%{opacity:0}}@keyframes pulse{0%,100%{box-shadow:0 0 20px rgba(34,197,94,0.4)}50%{box-shadow:0 0 40px rgba(34,197,94,0.8)}}@keyframes scanBar{0%{width:0%}100%{width:100%}}';
    document.head.appendChild(style);
  }
}

// ─── Engine Init ───
deferInit(function(){
  new DiagramEngine({
    title: 'Computer Assembly',
    subtitle: 'Drag & Drop - Build Your Computer',
    desc: 'Build a computer step by step by selecting and installing components.',
    components: components,
    connections: connections,
    steps: steps,
    tour: tour,
    mode: 'beginner',

    render: function(container, engine) {
      buildDragDrop(container, engine);
    },

    animate: function(engine) {
      // Boot sequence animation handled in power-on
    },

    onReplay: function(engine) {}
  });
});
})();
