(function(){
  const canvas=document.getElementById('psuCanvas');
  const ctx=canvas.getContext('2d');
  const tooltip=document.getElementById('tooltip');
  const stepInd=document.getElementById('stepIndicator');
  const playBtn=document.getElementById('playBtn');
  const pauseBtn=document.getElementById('pauseBtn');
  const resetBtn=document.getElementById('resetBtn');
  const cableBtns=document.querySelectorAll('.cable-btn');
  const meterFill=document.getElementById('meterFill');
  const loadValue=document.getElementById('loadValue');

  const W=900,H=520;
  canvas.width=W;canvas.height=H;

  const cables=[
    {id:'24pin',name:'24-pin ATX',desc:'Main motherboard power. The largest connector. Provides 3.3V, 5V, and 12V rails. Connects to the right-side edge of the motherboard.',
     px:150,py:260,cx:450,cy:400,color:'#336699',watts:100},
    {id:'8pin',name:'8-pin CPU',desc:'Dedicated CPU power (12V). Usually near the CPU socket on the top-left of the motherboard. Some boards need 4+4 or 8+4.',
     px:230,py:230,cx:370,cy:150,color:'#884466',watts:150},
    {id:'pcie',name:'6+2 PCIe',desc:'GPU power. The 6+2 design fits both 6-pin and 8-pin graphics card ports. Daisy-chained cables are common.',
     px:310,py:260,cx:550,cy:350,color:'#446688',watts:250},
    {id:'sata',name:'SATA Power',desc:'Flat L-shaped connector for SSDs and HDDs. Connects to the drive along with the SATA data cable.',
     px:390,py:280,cx:630,cy:420,color:'#668844',watts:30},
    {id:'molex',name:'Molex',desc:'Older 4-pin connector for fans, older drives, or adapters. Being phased out but still useful.',
     px:470,py:290,cx:700,cy:450,color:'#886644',watts:20}
  ];

  let activeCable=-1;
  let isPlaying=false;
  let cycleTimer=null;

  function drawPSU(){
    ctx.save();ctx.translate(150,280);
    ctx.fillStyle='#1a1e2a';ctx.strokeStyle='rgba(255,255,255,0.15)';ctx.lineWidth=2;
    roundRect(ctx,-70,-90,140,180,6);
    ctx.fill();ctx.stroke();

    ctx.fillStyle='rgba(255,255,255,0.06)';ctx.font='9px Inter,sans-serif';ctx.textAlign='center';
    ctx.fillText('MODULAR PSU',0,-70);

    const ports=['24-pin','CPU','PCIe','SATA','Molex'];
    ports.forEach((p,i)=>{
      ctx.fillStyle='rgba(255,255,255,0.08)';ctx.strokeStyle='rgba(255,255,255,0.12)';ctx.lineWidth=1;
      roundRect(ctx,-50+i*25,-20,20,40,2);
      ctx.fill();ctx.stroke();
      ctx.fillStyle='rgba(255,255,255,0.2)';ctx.font='6px Inter,sans-serif';
      ctx.fillText(p,-40+i*25,15);
    });

    ctx.fillStyle='rgba(255,255,255,0.05)';ctx.font='7px Inter,sans-serif';
    ctx.fillText('AC Input',0,70);
    ctx.fillStyle='rgba(255,255,255,0.08)';
    roundRect(ctx,-15,55,30,20,3);ctx.fill();
    ctx.fillStyle='rgba(255,255,255,0.1)';
    ctx.fillText('I',0,67);

    ctx.restore();
  }

  function drawCable(c,isActive,showConnection){
    ctx.save();
    const startX=c.px,endX=showConnection?c.cx:c.px+80;
    const startY=c.py,endY=showConnection?c.cy:c.py-10;

    ctx.strokeStyle=isActive?c.color:c.color+'60';
    ctx.lineWidth=isActive?4:2;
    ctx.shadowColor=isActive?c.color+'80':'transparent';
    ctx.shadowBlur=isActive?10:0;

    ctx.beginPath();
    ctx.moveTo(startX,startY);
    const cpX=(startX+endX)/2;
    const cpY=(startY+endY)/2-30;
    ctx.quadraticCurveTo(cpX,cpY,endX,endY);
    ctx.stroke();
    ctx.shadowBlur=0;

    if(isActive){
      ctx.fillStyle=c.color;ctx.font='bold 8px Inter,sans-serif';ctx.textAlign='center';
      ctx.fillText(c.id,cpX,cpY-5);
    }

    if(showConnection){
      ctx.fillStyle=c.color+'50';ctx.strokeStyle=c.color;ctx.lineWidth=1;
      roundRect(ctx,endX-12,endY-8,24,16,3);
      ctx.fill();ctx.stroke();
      ctx.fillStyle='#fff';ctx.font='6px Inter,sans-serif';ctx.textAlign='center';
      ctx.fillText(c.name.split(' ')[0],endX,endY+3);
    }

    ctx.restore();
  }

  function drawMotherboardOutline(){
    ctx.save();
    ctx.translate(500,260);
    ctx.fillStyle='#0d1220';ctx.strokeStyle='rgba(255,255,255,0.08)';ctx.lineWidth=1;
    roundRect(ctx,-150,-120,300,240,4);
    ctx.fill();ctx.stroke();

    ctx.fillStyle='rgba(255,255,255,0.04)';ctx.font='8px Inter,sans-serif';ctx.textAlign='center';
    ctx.fillText('MOTHERBOARD',0,-100);

    ctx.strokeStyle='rgba(255,255,255,0.05)';ctx.lineWidth=1;
    roundRect(ctx,-120,-90,80,80,3);ctx.stroke();
    ctx.fillStyle='rgba(255,255,255,0.06)';ctx.font='7px Inter,sans-serif';
    ctx.fillText('CPU socket',-80,-55);

    roundRect(ctx,-20,-50,100,35,3);ctx.stroke();
    ctx.fillText('RAM slots',30,-32);

    roundRect(ctx,-120,10,120,50,3);ctx.stroke();
    ctx.fillText('PCIe slots',-60,37);

    roundRect(ctx,30,70,60,35,3);ctx.stroke();
    ctx.fillText('SATA',60,90);

    roundRect(ctx,-50,-100,30,20,3);ctx.stroke();
    ctx.fillText('CPU pwr',-35,-95);

    roundRect(ctx,-130,80,40,60,3);ctx.stroke();
    ctx.save();ctx.translate(-130,110);ctx.rotate(-Math.PI/2);
    ctx.fillText('I/O panel',0,0);
    ctx.restore();

    ctx.fillStyle='rgba(255,255,255,0.1)';ctx.font='7px Inter,sans-serif';
    ctx.fillText('24-pin ATX',120,105);

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

  function render(showConnections){
    ctx.clearRect(0,0,W,H);
    ctx.fillStyle='#060910';ctx.fillRect(0,0,W,H);

    drawPSU();
    drawMotherboardOutline();

    cables.forEach((c,i)=>{
      drawCable(c,i===activeCable,showConnections||i===activeCable);
    });

    if(activeCable>=0){
      ctx.save();
      ctx.fillStyle='rgba(255,255,255,0.1)';ctx.font='bold 12px Inter,sans-serif';ctx.textAlign='center';
      ctx.fillText(cables[activeCable].name,450,500);
      ctx.restore();
    }
  }

  function updateMeter(watts){
    const pct=Math.min(100,(watts/850)*100);
    meterFill.style.width=pct+'%';
    loadValue.textContent=Math.round(watts)+' W';
  }

  function showTooltip(x,y,text,title){
    tooltip.style.display='block';
    tooltip.style.left=Math.min(x+15,W-270)+'px';
    tooltip.style.top=Math.min(y+15,H-130)+'px';
    tooltip.innerHTML=`<span class="tt-name">${title}</span><span class="tt-desc">${text}</span>`;
    tooltip.setAttribute('aria-hidden','false');
  }

  function hideTooltip(){
    tooltip.style.display='none';
    tooltip.setAttribute('aria-hidden','true');
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
    for(let i=0;i<cables.length;i++){
      const c=cables[i];
      if(Math.abs(pos.x-c.px)<80 && Math.abs(pos.y-c.py)<40)return i;
    }
    return -1;
  }

  function selectCable(idx){
    if(isPlaying)return;
    if(activeCable===idx){
      activeCable=-1;
      hideTooltip();
      updateButtons();
      stepInd.textContent='Ready';
      render(true);
      return;
    }
    activeCable=idx;
    const c=cables[idx];
    showTooltip(c.px-20,c.py-40,c.desc,c.name);
    updateButtons();
    stepInd.textContent=c.name;
    updateMeter(550);
    render(true);
  }

  function updateButtons(){
    cableBtns.forEach((b,i)=>b.classList.toggle('active',i===activeCable));
  }

  function handleClick(e){
    const pos=getCanvasPos(e);
    const idx=hitTest(pos);
    if(idx>=0)selectCable(idx);
    else{activeCable=-1;hideTooltip();updateButtons();stepInd.textContent='Ready';render(true)}
  }

  canvas.addEventListener('click',handleClick);
  canvas.addEventListener('touchstart',(e)=>{e.preventDefault();handleClick(e)},{passive:false});

  cableBtns.forEach((btn,i)=>{
    btn.addEventListener('click',()=>selectCable(i));
  });

  function playAnim(){
    if(isPlaying)return;
    isPlaying=true;
    playBtn.textContent='\u25B6 Running';
    playBtn.setAttribute('aria-label','Cable connection animation running');
    let idx=0;
    function step(){
      if(!isPlaying)return;
      activeCable=idx;
      const c=cables[idx];
      showTooltip(c.px-20,c.py-40,c.desc,c.name);
      updateButtons();
      stepInd.textContent=c.name;
      let totalWatts=0;
      for(let i=0;i<=idx;i++)totalWatts+=cables[i].watts;
      updateMeter(totalWatts);
      render(true);
      idx++;
      if(idx<cables.length)cycleTimer=setTimeout(step,2000);
      else{isPlaying=false;playBtn.textContent='\u25B6 Play';playBtn.setAttribute('aria-label','Animate cable connections')}
    }
    step();
  }

  function pauseAnim(){
    isPlaying=false;
    if(cycleTimer){clearTimeout(cycleTimer);cycleTimer=null}
    playBtn.textContent='\u25B6 Play';
    playBtn.setAttribute('aria-label','Animate cable connections');
  }

  function resetView(){
    pauseAnim();
    activeCable=-1;
    hideTooltip();
    updateButtons();
    stepInd.textContent='Ready';
    updateMeter(0);
    render(false);
  }

  playBtn.addEventListener('click',playAnim);
  pauseBtn.addEventListener('click',pauseAnim);
  resetBtn.addEventListener('click',resetView);

  document.addEventListener('keydown',(e)=>{
    if(e.key==='Escape'){activeCable=-1;hideTooltip();updateButtons();stepInd.textContent='Ready';render(true)}
  });

  resetView();
})();