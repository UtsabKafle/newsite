(function(){
  const canvas=document.getElementById('mbCanvas');
  const ctx=canvas.getContext('2d');
  const tooltip=document.getElementById('tooltip');
  const stepInd=document.getElementById('stepIndicator');
  const playBtn=document.getElementById('playBtn');
  const pauseBtn=document.getElementById('pauseBtn');
  const resetBtn=document.getElementById('resetBtn');
  const zoneList=document.getElementById('zoneList');

  const W=900,H=580;
  canvas.width=W;canvas.height=H;

  const zones=[
    {id:'cpu',name:'CPU Socket',desc:'LGA socket where the processor is installed. Handles all computations and data routing.',
     x:300,y:160,w:100,h:100,color:'#8a3a2a'},
    {id:'ram',name:'RAM Slots',desc:'DIMM slots for system memory. Usually installed in pairs for dual-channel mode.',
     x:460,y:120,w:120,h:40,color:'#2a5a8a'},
    {id:'pcie',name:'PCIe Slots',desc:'Expansion slots for GPU, network cards, and other add-on boards. x16 for GPU.',
     x:270,y:300,w:180,h:30,color:'#4a2a6a'},
    {id:'sata',name:'SATA Ports',desc:'Connects SATA storage drives (SSD/HDD). Usually 4-6 ports on a motherboard.',
     x:600,y:370,w:60,h:40,color:'#5a4a2a'},
    {id:'m2',name:'M.2 Slot',desc:'Direct NVMe SSD connection. Offers much faster speeds than SATA.',
     x:470,y:200,w:90,h:22,color:'#2a6a6a'},
    {id:'chipset',name:'Chipset',desc:'Manages data flow between CPU, memory, and peripherals. Often has a heatsink.',
     x:180,y:200,w:70,h:70,color:'#336699'},
    {id:'vrm',name:'VRM Area',desc:'Voltage Regulator Module — converts and stabilizes power for the CPU.',
     x:220,y:100,w:100,h:30,color:'#883366'},
    {id:'cmos',name:'CMOS Battery',desc:'CR2032 battery that keeps BIOS settings and the system clock when powered off.',
     x:550,y:280,w:30,h:30,color:'#667788'},
    {id:'io',name:'I/O Panel',desc:'Rear ports for USB, audio, Ethernet, video output. Pre-installed on the motherboard.',
     x:130,y:320,w:20,h:100,color:'#556677'},
    {id:'fan',name:'Fan Headers',desc:'Small connectors for case fans and CPU cooler fans. PWM-controlled for speed.',
     x:370,y:260,w:30,h:20,color:'#778855'},
    {id:'power',name:'Power Connectors',desc:'24-pin ATX main power and 8-pin CPU power from the PSU.',
     x:370,y:80,w:60,h:30,color:'#885544'}
  ];

  let activeIndex=-1;
  let isPlaying=false;
  let cycleTimer=null;

  function drawMB(){
    ctx.save();ctx.translate(450,300);
    ctx.fillStyle='#0d1220';ctx.strokeStyle='rgba(255,255,255,0.15)';ctx.lineWidth=2;
    roundRect(ctx,-200,-240,400,480,8);
    ctx.fill();ctx.stroke();
    ctx.restore();
  }

  function drawZone(z,i){
    ctx.save();
    const isActive=i===activeIndex;
    const cx=z.x,cy=z.y,w=z.w,h=z.h;

    ctx.fillStyle=isActive?z.color+'80':z.color+'30';
    ctx.strokeStyle=isActive?'#0959C8':z.color+'60';
    ctx.lineWidth=isActive?3:1;
    ctx.shadowColor=isActive?'#0959C880':'transparent';
    ctx.shadowBlur=isActive?20:0;

    roundRect(ctx,cx-w/2,cy-h/2,w,h,4);
    ctx.fill();ctx.stroke();
    ctx.shadowBlur=0;

    ctx.fillStyle=isActive?'#fff':z.color;
    ctx.font=isActive?'bold 11px Inter,sans-serif':'10px Inter,sans-serif';
    ctx.textAlign='center';ctx.textBaseline='middle';
    ctx.fillText(z.name,cx,cy);

    if(!isActive){
      ctx.fillStyle='rgba(255,255,255,0.2)';ctx.font='10px Inter,sans-serif';
      ctx.fillText('\u2192',cx+w/2+15,cy);
    }

    ctx.restore();
  }

  function roundRect(ctx,x,y,w,h,r){
    ctx.beginPath();
    ctx.moveTo(x+r,y);ctx.lineTo(x+w-r,y);
    ctx.quadraticCurveTo(x+w,y,x+w,y+r);
    ctx.lineTo(x+w,y+h-r);
    ctx.quadraticCurveTo(x+w,y+h,x+w-r,y+h);
    ctx.lineTo(x+r,y+h);
    ctx.quadraticCurveTo(x,y+h,x,y+h-r);
    ctx.lineTo(x,y+r);
    ctx.quadraticCurveTo(x,y,x+r,y);
    ctx.closePath();
  }

  function render(){
    ctx.clearRect(0,0,W,H);
    ctx.fillStyle='#060910';ctx.fillRect(0,0,W,H);
    drawMB();
    zones.forEach((z,i)=>drawZone(z,i));
  }

  function showTooltip(x,y,z){
    tooltip.style.display='block';
    tooltip.style.left=Math.min(x+15,W-260)+'px';
    tooltip.style.top=Math.min(y+15,H-120)+'px';
    tooltip.innerHTML=`<span class="tt-name">${z.name}</span><span class="tt-desc">${z.desc}</span>`;
    tooltip.setAttribute('aria-hidden','false');
  }

  function hideTooltip(){
    tooltip.style.display='none';
    tooltip.setAttribute('aria-hidden','true');
  }

  function selectZone(idx){
    if(isPlaying)return;
    if(activeIndex===idx){activeIndex=-1;hideTooltip();updateZones();stepInd.textContent='Ready';render();return}
    activeIndex=idx;
    const z=zones[idx];
    showTooltip(z.x-z.w/2,z.y-z.h/2-10,z);
    updateZones();
    stepInd.textContent=z.name;
    render();
  }

  function updateZones(){
    document.querySelectorAll('.zone-list button').forEach((btn,i)=>{
      btn.classList.toggle('active',i===activeIndex);
    });
  }

  function buildZoneList(){
    zones.forEach((z,i)=>{
      const btn=document.createElement('button');
      btn.textContent=z.name;
      btn.dataset.index=i;
      btn.setAttribute('aria-label',`Select ${z.name}`);
      btn.addEventListener('click',()=>selectZone(i));
      zoneList.appendChild(btn);
    });
  }

  function getCanvasPos(e){
    const rect=canvas.getBoundingClientRect();
    const scaleX=W/rect.width;
    const scaleY=H/rect.height;
    const clientX=e.clientX||(e.touches&&e.touches[0].clientX);
    const clientY=e.clientY||(e.touches&&e.touches[0].clientY);
    return {x:(clientX-rect.left)*scaleX,y:(clientY-rect.top)*scaleY};
  }

  function hitTest(pos){
    for(let i=zones.length-1;i>=0;i--){
      const z=zones[i];
      if(Math.abs(pos.x-z.x)<z.w/2+5 && Math.abs(pos.y-z.y)<z.h/2+5)return i;
    }
    return -1;
  }

  function handleClick(e){
    if(isPlaying)return;
    const pos=getCanvasPos(e);
    const idx=hitTest(pos);
    if(idx>=0)selectZone(idx);
    else{activeIndex=-1;hideTooltip();updateZones();stepInd.textContent='Ready';render()}
  }

  canvas.addEventListener('click',handleClick);
  canvas.addEventListener('touchstart',(e)=>{e.preventDefault();handleClick(e)},{passive:false});

  function playSequence(){
    if(isPlaying)return;
    isPlaying=true;
    playBtn.textContent='\u25B6 Running';
    playBtn.setAttribute('aria-label','Highlighting motherboard zones');
    let idx=0;
    function step(){
      if(!isPlaying)return;
      activeIndex=idx;
      const z=zones[idx];
      showTooltip(z.x-z.w/2,z.y-z.h/2-10,z);
      updateZones();
      stepInd.textContent=z.name;
      render();
      idx++;
      if(idx<zones.length)cycleTimer=setTimeout(step,1800);
      else{isPlaying=false;playBtn.textContent='\u25B6 Play';playBtn.setAttribute('aria-label','Sequentially highlight each motherboard zone')}
    }
    step();
  }

  function pauseSequence(){
    isPlaying=false;
    if(cycleTimer){clearTimeout(cycleTimer);cycleTimer=null}
    playBtn.textContent='\u25B6 Play';
    playBtn.setAttribute('aria-label','Sequentially highlight each motherboard zone');
  }

  function resetView(){
    pauseSequence();
    activeIndex=-1;
    hideTooltip();
    updateZones();
    stepInd.textContent='Ready';
    render();
  }

  playBtn.addEventListener('click',playSequence);
  pauseBtn.addEventListener('click',pauseSequence);
  resetBtn.addEventListener('click',resetView);

  document.addEventListener('keydown',(e)=>{
    if(e.key==='Escape'){activeIndex=-1;hideTooltip();updateZones();stepInd.textContent='Ready';render()}
  });

  buildZoneList();
  resetView();
})();