(function(){
  const canvas=document.getElementById('ramCanvas');
  const ctx=canvas.getContext('2d');
  const tooltip=document.getElementById('tooltip');
  const stepInd=document.getElementById('stepIndicator');
  const playBtn=document.getElementById('playBtn');
  const pauseBtn=document.getElementById('pauseBtn');
  const resetBtn=document.getElementById('resetBtn');
  const slotBtns=document.querySelectorAll('.slot-btn');

  const W=900,H=460;
  canvas.width=W;canvas.height=H;

  const slots=[
    {id:'A1',x:320,y:200,w:30,h:120,ch:'A',color:'#0959C8'},
    {id:'A2',x:370,y:200,w:30,h:120,ch:'A',color:'#0959C8'},
    {id:'B1',x:530,y:200,w:30,h:120,ch:'B',color:'#8a4ac8'},
    {id:'B2',x:580,y:200,w:30,h:120,ch:'B',color:'#8a4ac8'}
  ];

  let installed=[false,false,false,false];
  let highlightSlot=-1;
  let isPlaying=false;
  let animTimer=null;

  const slotInfo={
    A1:'Channel A — slot 1. Pair with A2 or B1 for single/dual channel depending on motherboard layout.',
    A2:'Channel A — slot 2. Often the second slot to populate in a 2-DIMM config.',
    B1:'Channel B — slot 3. Use with B2 for a second dual-channel pair. ',
    B2:'Channel B — slot 4. Last slot to populate. Works in pairs with B1.'
  };

  function drawMotherboard(){
    ctx.save();
    ctx.translate(450,230);

    ctx.fillStyle='#0d1220';ctx.strokeStyle='rgba(255,255,255,0.12)';ctx.lineWidth=2;
    roundRect(ctx,-280,-160,560,320,8);
    ctx.fill();ctx.stroke();

    ctx.strokeStyle='rgba(255,255,255,0.04)';ctx.lineWidth=1;
    for(let i=0;i<40;i++){
      ctx.strokeRect(-260+i*14,-140,7,280);
    }

    ctx.fillStyle='rgba(255,255,255,0.08)';ctx.font='10px Inter,sans-serif';ctx.textAlign='center';
    ctx.fillText('DIMM Slots',0,-130);

    ctx.fillStyle='rgba(255,255,255,0.04)';ctx.font='8px Inter,sans-serif';
    ctx.fillText('CPU Socket  \u2190',-200,-100);

    ctx.restore();
  }

  function drawSlot(s,i){
    ctx.save();
    const isActive=i===highlightSlot;
    const isInstalled=installed[i];
    const chColor=s.color;

    ctx.translate(s.x,s.y);

    ctx.fillStyle=isActive?chColor+'80':isInstalled?chColor+'50':chColor+'20';
    ctx.strokeStyle=isActive||isInstalled?chColor:'rgba(255,255,255,0.2)';
    ctx.lineWidth=isActive?3:1;
    ctx.shadowColor=isActive?'#0959C880':'transparent';
    ctx.shadowBlur=isActive?15:0;

    roundRect(ctx,-s.w/2,-s.h/2,s.w,s.h,4);
    ctx.fill();ctx.stroke();
    ctx.shadowBlur=0;

    ctx.fillStyle=isActive?'#fff':s.color;
    ctx.font=isActive?'bold 12px Inter,sans-serif':'10px Inter,sans-serif';
    ctx.textAlign='center';ctx.textBaseline='middle';
    ctx.fillText(s.id,0,0);

    if(isInstalled){
      ctx.strokeStyle=chColor+'80';ctx.lineWidth=2;
      ctx.beginPath();
      ctx.moveTo(-8,-20);ctx.lineTo(0,-10);ctx.lineTo(8,-30);
      ctx.stroke();
    }

    ctx.restore();
  }

  function drawRamStick(x,y,angle,color){
    ctx.save();
    ctx.translate(x,y);
    ctx.rotate(angle);
    ctx.fillStyle=color+'60';ctx.strokeStyle=color;ctx.lineWidth=2;
    ctx.shadowColor=color+'80';ctx.shadowBlur=12;
    roundRect(ctx,-10,-55,20,110,3);
    ctx.fill();ctx.stroke();
    ctx.shadowBlur=0;

    ctx.fillStyle='rgba(255,255,255,0.3)';ctx.font='7px Inter,sans-serif';
    ctx.textAlign='center';
    for(let i=0;i<8;i++){
      ctx.fillRect(-7,-40+i*10,14,2);
    }

    ctx.fillStyle='#fff';ctx.font='bold 8px Inter,sans-serif';
    ctx.fillText('DDR5',0,4);

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

  function render(animPhase){
    ctx.clearRect(0,0,W,H);
    ctx.fillStyle='#060910';ctx.fillRect(0,0,W,H);
    drawMotherboard();
    slots.forEach((s,i)=>drawSlot(s,i));

    if(animPhase===1){
      drawRamStick(200,160,0.15,'#0959C8');
    }
    if(animPhase===2){
      drawRamStick(200,160,0.15,'#0959C8');
      drawRamStick(610,160,-0.15,'#8a4ac8');
    }
  }

  function showTooltip(x,y,text,title){
    tooltip.style.display='block';
    tooltip.style.left=Math.min(x+15,W-260)+'px';
    tooltip.style.top=Math.min(y+15,H-120)+'px';
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
    for(let i=0;i<slots.length;i++){
      const s=slots[i];
      if(Math.abs(pos.x-s.x)<20 && Math.abs(pos.y-s.y)<65)return i;
    }
    return -1;
  }

  function handleClick(e){
    if(isPlaying)return;
    const pos=getCanvasPos(e);
    const idx=hitTest(pos);
    if(idx>=0){
      highlightSlot=idx;
      const s=slots[idx];
      showTooltip(s.x+20,s.y-30,slotInfo[s.id],'Slot '+s.id+' ('+s.ch+'h Channel)');
      slotBtns.forEach((b,i)=>b.classList.toggle('active',i===idx));
      stepInd.textContent='Slot '+s.id;
    }else{
      highlightSlot=-1;
      hideTooltip();
      slotBtns.forEach(b=>b.classList.remove('active'));
      stepInd.textContent='Ready';
    }
    render(0);
  }

  canvas.addEventListener('click',handleClick);
  canvas.addEventListener('touchstart',(e)=>{e.preventDefault();handleClick(e)},{passive:false});

  slotBtns.forEach((btn,i)=>{
    btn.addEventListener('click',()=>{
      if(isPlaying)return;
      highlightSlot=i;
      const s=slots[i];
      showTooltip(s.x+20,s.y-30,slotInfo[s.id],'Slot '+s.id+' ('+s.ch+'h Channel)');
      slotBtns.forEach(b=>b.classList.remove('active'));
      btn.classList.add('active');
      stepInd.textContent='Slot '+s.id;
      render(0);
    });
  });

  function playInstall(){
    if(isPlaying)return;
    isPlaying=true;
    playBtn.textContent='\u25B6 Running';
    playBtn.setAttribute('aria-label','RAM installation running');
    hideTooltip();
    slotBtns.forEach(b=>b.classList.remove('active'));
    installed=[false,false,false,false];
    stepInd.textContent='Installing A2...';
    render(1);

    setTimeout(()=>{
      installed[1]=true;
      stepInd.textContent='Installing B2...';
      render(1);
    },1500);

    setTimeout(()=>{
      installed[3]=true;
      stepInd.textContent='Dual-channel complete! A2 + B2 populated.';
      render(2);
    },3000);

    setTimeout(()=>{
      isPlaying=false;
      playBtn.textContent='\u25B6 Play';
      playBtn.setAttribute('aria-label','Animate dual-channel RAM installation');
    },4500);
  }

  function pauseInstall(){
    isPlaying=false;
    if(animTimer){clearTimeout(animTimer);animTimer=null}
    playBtn.textContent='\u25B6 Play';
    playBtn.setAttribute('aria-label','Animate dual-channel RAM installation');
  }

  function resetView(){
    pauseInstall();
    installed=[false,false,false,false];
    highlightSlot=-1;
    hideTooltip();
    slotBtns.forEach(b=>b.classList.remove('active'));
    stepInd.textContent='Ready';
    render(0);
  }

  playBtn.addEventListener('click',playInstall);
  pauseBtn.addEventListener('click',pauseInstall);
  resetBtn.addEventListener('click',resetView);

  document.addEventListener('keydown',(e)=>{
    if(e.key==='Escape'){highlightSlot=-1;hideTooltip();slotBtns.forEach(b=>b.classList.remove('active'));stepInd.textContent='Ready';render(0)}
  });

  resetView();
})();