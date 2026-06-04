(function(){
  const canvas=document.getElementById('safetyCanvas');
  const ctx=canvas.getContext('2d');
  const tooltip=document.getElementById('tooltip');
  const stepInd=document.getElementById('stepIndicator');
  const playBtn=document.getElementById('playBtn');
  const pauseBtn=document.getElementById('pauseBtn');
  const resetBtn=document.getElementById('resetBtn');
  const toolTags=document.getElementById('toolTags');

  const W=900,H=520;
  canvas.width=W;canvas.height=H;

  const tools=[
    {id:'screwdriver',name:'Phillips Screwdriver (#1, #2)',desc:'Used for most PC screws. #1 for small drives, #2 for motherboard and case.',
     x:150,y:120,w:40,h:160,color:'#8899aa'},
    {id:'wriststrap',name:'Anti-Static Wrist Strap',desc:'Grounds your body to prevent ESD damage to sensitive components.',
     x:300,y:100,w:60,h:60,color:'#cc8833'},
    {id:'paste',name:'Thermal Paste',desc:'Applied between CPU and heatsink for efficient heat transfer.',
     x:450,y:130,w:50,h:50,color:'#aaaaaa'},
    {id:'cableties',name:'Cable Ties',desc:'Organize and secure cables inside the case for better airflow.',
     x:570,y:120,w:50,h:70,color:'#336699'},
    {id:'psutester',name:'PSU Tester',desc:'Tests power supply voltages to ensure they are within safe ranges before installing.',
     x:690,y:110,w:60,h:70,color:'#885533'},
    {id:'tweezers',name:'Tweezers',desc:'Helpful for placing jumpers, screws in tight spaces, or handling small connectors.',
     x:810,y:130,w:30,h:90,color:'#667788'},
    {id:'esd',name:'ESD Warning',desc:'Electrostatic Discharge can destroy components. Always ground yourself before touching parts.',
     x:450,y:300,w:80,h:60,color:'#cc3333'}
  ];

  let activeIndex=-1;
  let isPlaying=false;
  let cycleTimer=null;
  let resetState=true;

  function drawScrewdriver(t){
    ctx.save();ctx.translate(t.x,t.y);
    ctx.fillStyle=t.color;ctx.strokeStyle=t.color+'80';ctx.lineWidth=2;
    ctx.shadowColor=t.color+'60';ctx.shadowBlur=10;
    roundRect(ctx,-5,-t.h/2,10,t.h,3);
    ctx.fill();ctx.stroke();
    ctx.shadowBlur=0;
    ctx.fillStyle='#ccd';ctx.font='bold 10px Inter,sans-serif';ctx.textAlign='center';
    ctx.fillText(t.name.split('(')[0].trim(),0,-t.h/2-8);
    ctx.restore();
  }

  function drawRectTool(t){
    ctx.save();ctx.translate(t.x,t.y);
    ctx.fillStyle=t.color+'50';ctx.strokeStyle=t.color;ctx.lineWidth=2;
    ctx.shadowColor=t.color+'80';ctx.shadowBlur=10;
    roundRect(ctx,-t.w/2,-t.h/2,t.w,t.h,6);
    ctx.fill();ctx.stroke();
    ctx.shadowBlur=0;
    ctx.fillStyle='#fff';ctx.font='bold 9px Inter,sans-serif';ctx.textAlign='center';
    const lines=wrapText(t.name,14);
    lines.forEach((l,i)=>ctx.fillText(l,0,i*12-6));
    ctx.restore();
  }

  function drawESD(t){
    ctx.save();ctx.translate(t.x,t.y);
    ctx.fillStyle='#cc333340';ctx.strokeStyle='#cc3333';ctx.lineWidth=3;
    ctx.shadowColor='#cc333380';ctx.shadowBlur=20;
    ctx.beginPath();ctx.arc(0,0,35,0,Math.PI*2);ctx.fill();ctx.stroke();
    ctx.shadowBlur=0;
    ctx.fillStyle='#cc3333';ctx.font='bold 22px Inter,sans-serif';ctx.textAlign='center';
    ctx.fillText('\u26A1',0,-4);
    ctx.font='bold 8px Inter,sans-serif';
    ctx.fillStyle='#fff';ctx.fillText('ESD',0,22);
    ctx.fillStyle='#cc3333';ctx.font='7px Inter,sans-serif';
    ctx.fillText('DANGER',0,32);
    ctx.restore();
  }

  function wrapText(str,maxLen){
    if(str.length<=maxLen)return [str];
    const words=str.split(' ');
    const lines=[];let line='';
    words.forEach(w=>{
      if((line+' '+w).trim().length<=maxLen){line+=(line?' ':'')+w}
      else{lines.push(line);line=w}
    });
    if(line)lines.push(line);
    return lines;
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

    ctx.save();
    ctx.strokeStyle='rgba(255,255,255,0.05)';ctx.lineWidth=1;
    ctx.setLineDash([5,5]);
    ctx.strokeRect(40,60,820,100);
    ctx.strokeRect(40,200,820,160);
    ctx.restore();

    ctx.fillStyle='rgba(255,255,255,0.08)';ctx.font='10px Inter,sans-serif';
    ctx.fillText('TOOLS',20,55);
    ctx.fillText('WORK AREA',20,195);

    ctx.save();
    ctx.translate(100,240);
    ctx.fillStyle='#1a1e2a';ctx.strokeStyle='rgba(255,255,255,0.1)';ctx.lineWidth=1;
    roundRect(ctx,-60,-60,120,120,6);
    ctx.fill();ctx.stroke();
    ctx.fillStyle='rgba(255,255,255,0.06)';ctx.font='9px Inter,sans-serif';ctx.textAlign='center';
    ctx.fillText('WORKBENCH',0,4);
    ctx.restore();

    ctx.save();
    ctx.translate(450,220);
    ctx.fillStyle='#1a1e2a';ctx.strokeStyle='rgba(255,255,255,0.08)';ctx.lineWidth=1;
    roundRect(ctx,-90,-40,180,80,8);
    ctx.fill();ctx.stroke();
    ctx.fillStyle='rgba(255,255,255,0.15)';ctx.font='10px Inter,sans-serif';ctx.textAlign='center';
    ctx.fillText('Anti-Static Mat',0,-26);
    ctx.fillStyle='rgba(255,255,255,0.05)';ctx.font='8px Inter,sans-serif';
    ctx.fillText('Place components here',0,-12);
    ctx.restore();

    drawScrewdriver(tools[0]);
    drawRectTool(tools[1]);
    drawRectTool(tools[2]);
    drawRectTool(tools[3]);
    drawRectTool(tools[4]);
    drawRectTool(tools[5]);
    drawESD(tools[6]);

    if(activeIndex>=0){
      const t=tools[activeIndex];
      ctx.save();
      ctx.strokeStyle='#0959C8';ctx.lineWidth=3;
      ctx.shadowColor='#0959C880';ctx.shadowBlur=20;
      if(t.id==='esd'){ctx.strokeRect(t.x-42,t.y-42,84,84)}
      else if(t.id==='screwdriver'){ctx.strokeRect(t.x-15,t.y-85,30,170)}
      else{ctx.strokeRect(t.x-t.w/2-6,t.y-t.h/2-6,t.w+12,t.h+12)}
      ctx.restore();
    }
  }

  function buildTags(){
    tools.forEach((t,i)=>{
      const btn=document.createElement('button');
      btn.textContent=t.name.split('(')[0].trim();
      btn.dataset.index=i;
      btn.setAttribute('aria-label',`Select ${t.name}`);
      btn.addEventListener('click',()=>selectTool(i));
      toolTags.appendChild(btn);
    });
  }

  function selectTool(idx){
    if(isPlaying)return;
    if(activeIndex===idx){
      activeIndex=-1;
      hideTooltip();
      updateTagHighlights();
      render();
      stepInd.textContent='Ready';
      return;
    }
    activeIndex=idx;
    const t=tools[idx];
    showTooltip(t.x+40,t.y-40,t);
    updateTagHighlights();
    stepInd.textContent=t.name;
    render();
  }

  function updateTagHighlights(){
    document.querySelectorAll('.tool-tags button').forEach((btn,i)=>{
      btn.classList.toggle('active',i===activeIndex);
    });
  }

  function showTooltip(x,y,comp){
    tooltip.style.display='block';
    tooltip.style.left=Math.min(x+10,W-260)+'px';
    tooltip.style.top=Math.min(y+10,H-120)+'px';
    tooltip.innerHTML=`<span class="tt-name">${comp.name}</span><span class="tt-desc">${comp.desc}</span>`;
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
    for(let i=tools.length-1;i>=0;i--){
      const t=tools[i];
      let halfX=30,halfY=30;
      if(t.id==='screwdriver'){halfX=20;halfY=85}
      else if(t.id==='esd'){halfX=42;halfY=42}
      else{halfX=t.w/2+6;halfY=t.h/2+6}
      if(Math.abs(pos.x-t.x)<halfX && Math.abs(pos.y-t.y)<halfY)return i;
    }
    return -1;
  }

  function handleClick(e){
    if(isPlaying)return;
    const pos=getCanvasPos(e);
    const idx=hitTest(pos);
    if(idx>=0)selectTool(idx);
    else{activeIndex=-1;hideTooltip();updateTagHighlights();stepInd.textContent='Ready';render()}
  }

  canvas.addEventListener('click',handleClick);
  canvas.addEventListener('touchstart',(e)=>{e.preventDefault();handleClick(e)},{passive:false});

  function playCycle(){
    if(isPlaying)return;
    isPlaying=true;
    playBtn.textContent='\u25B6 Running';
    playBtn.setAttribute('aria-label','Auto-cycling through tools');
    resetState=false;
    let idx=0;
    function step(){
      if(!isPlaying)return;
      activeIndex=idx;
      showTooltip(tools[idx].x+40,tools[idx].y-40,tools[idx]);
      updateTagHighlights();
      stepInd.textContent=tools[idx].name;
      render();
      idx=(idx+1)%tools.length;
      cycleTimer=setTimeout(step,2000);
    }
    step();
  }

  function pauseCycle(){
    isPlaying=false;
    if(cycleTimer){clearTimeout(cycleTimer);cycleTimer=null}
    playBtn.textContent='\u25B6 Play';
    playBtn.setAttribute('aria-label','Auto-cycle through tools');
  }

  function resetView(){
    pauseCycle();
    activeIndex=-1;
    hideTooltip();
    updateTagHighlights();
    stepInd.textContent='Ready';
    resetState=true;
    render();
  }

  playBtn.addEventListener('click',playCycle);
  pauseBtn.addEventListener('click',pauseCycle);
  resetBtn.addEventListener('click',resetView);

  document.addEventListener('keydown',(e)=>{
    if(e.key==='Escape'){activeIndex=-1;hideTooltip();updateTagHighlights();stepInd.textContent='Ready';render()}
  });

  buildTags();
  resetView();
})();