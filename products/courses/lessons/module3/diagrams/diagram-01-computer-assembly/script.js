(function(){
  const canvas=document.getElementById('assemblyCanvas');
  const ctx=canvas.getContext('2d');
  const tooltip=document.getElementById('tooltip');
  const stepInd=document.getElementById('stepIndicator');
  const playBtn=document.getElementById('playBtn');
  const pauseBtn=document.getElementById('pauseBtn');
  const resetBtn=document.getElementById('resetBtn');

  const W=900,H=600;
  canvas.width=W;canvas.height=H;

  const components=[
    {id:'case',       name:'Case',        desc:'The chassis that houses and protects all internal components.',
     color:'#2a3a5c', ex:{x:450,y:80},   in:{x:450,y:300}, w:160,h:260},
    {id:'motherboard',name:'Motherboard',desc:'The main circuit board connecting all components together.',
     color:'#1a5a2a', ex:{x:80,y:80},    in:{x:450,y:300}, w:140,h:200},
    {id:'cpu',        name:'CPU',         desc:'The "brain" of the computer that processes instructions.',
     color:'#8a3a2a', ex:{x:750,y:80},   in:{x:450,y:220}, w:60,h:60, sz:30},
    {id:'ram',        name:'RAM',         desc:'Temporary memory for active programs and data.',
     color:'#2a5a8a', ex:{x:80,y:350},   in:{x:450,y:260}, w:80,h:18, sz:12},
    {id:'storage',    name:'Storage',     desc:'Permanent storage for files, OS, and applications.',
     color:'#5a4a2a', ex:{x:750,y:350},  in:{x:450,y:340}, w:90,h:50, sz:25},
    {id:'psu',        name:'PSU',         desc:'Power Supply Unit — converts AC power to usable DC voltages.',
     color:'#3a3a4a', ex:{x:80,y:500},   in:{x:450,y:450}, w:100,h:60, sz:30},
    {id:'gpu',        name:'GPU',         desc:'Graphics card that renders images and video output.',
     color:'#4a2a6a', ex:{x:750,y:500},  in:{x:450,y:280}, w:90,h:40, sz:20},
    {id:'cooling',    name:'Cooling',     desc:'Fan/heatsink assembly that dissipates CPU heat.',
     color:'#2a6a6a', ex:{x:450,y:550},  in:{x:450,y:180}, w:70,h:30, sz:15}
  ];

  let state=components.map(c=>({
    ...c,currentX:c.ex.x,currentY:c.ex.y,targetX:c.ex.x,targetY:c.ex.y
  }));
  let animId=null;
  let isPlaying=false;
  let currentStep=0;
  let progress=1;

  function drawCase(x,y,c){
    ctx.save();ctx.translate(x,y);
    ctx.fillStyle=c.color+'40';ctx.strokeStyle=c.color;ctx.lineWidth=2;
    ctx.shadowColor=c.color+'80';ctx.shadowBlur=20;
    const w=c.w,h=c.h;
    roundRect(ctx,-w/2,-h/2,w,h,6);
    ctx.fill();ctx.stroke();
    ctx.shadowBlur=0;
    ctx.fillStyle=c.color;ctx.font='bold 14px Inter,sans-serif';ctx.textAlign='center';
    ctx.fillText(c.name,0,4);
    ctx.restore();
  }

  function drawMotherboard(x,y,c){
    ctx.save();ctx.translate(x,y);
    ctx.fillStyle=c.color+'40';ctx.strokeStyle=c.color;ctx.lineWidth=2;
    ctx.shadowColor=c.color+'80';ctx.shadowBlur=15;
    const w=c.w,h=c.h;
    roundRect(ctx,-w/2,-h/2,w,h,4);
    ctx.fill();ctx.stroke();
    ctx.shadowBlur=0;
    ctx.fillStyle=c.color;ctx.font='bold 12px Inter,sans-serif';ctx.textAlign='center';
    ctx.fillText(c.name,0,4);
    ctx.restore();
  }

  function drawSmallPart(x,y,c){
    ctx.save();ctx.translate(x,y);
    ctx.fillStyle=c.color+'40';ctx.strokeStyle=c.color;ctx.lineWidth=2;
    ctx.shadowColor=c.color+'80';ctx.shadowBlur=12;
    const s=c.sz||20;
    roundRect(ctx,-s/2,-s/2,s,s,3);
    ctx.fill();ctx.stroke();
    ctx.shadowBlur=0;
    ctx.fillStyle=c.color;ctx.font='bold 10px Inter,sans-serif';ctx.textAlign='center';
    ctx.fillText(c.name,0,3);
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

    state.forEach(c=>{
      const draw= c.w>100 ? drawCase : c.w>60 ? drawMotherboard : drawSmallPart;
      draw(c.currentX,c.currentY,c);
    });

    state.forEach((c,i)=>{
      if(i===currentStep && isPlaying){
        ctx.save();
        ctx.strokeStyle='#0959C8';ctx.lineWidth=3;
        ctx.shadowColor='#0959C880';ctx.shadowBlur=20;
        const s=c.sz||20;
        ctx.strokeRect(c.currentX-30,c.currentY-20,60,40);
        ctx.restore();
      }
    });
  }

  function lerp(a,b,t){return a+(b-a)*t}

  function animate(){
    if(!isPlaying){render();return}

    let allDone=true;
    state.forEach((c,i)=>{
      if(i<=currentStep && i<components.length){
        if(Math.abs(c.currentX-c.targetX)>0.5 || Math.abs(c.currentY-c.targetY)>0.5){
          allDone=false;
          c.currentX=lerp(c.currentX,c.targetX,0.08);
          c.currentY=lerp(c.currentY,c.targetY,0.08);
        }else{
          c.currentX=c.targetX;
          c.currentY=c.targetY;
        }
      }
    });

    if(allDone && currentStep<components.length-1){
      currentStep++;
      components.forEach((c,i)=>{
        if(i<=currentStep){
          state[i].targetX=components[i].in.x;
          state[i].targetY=components[i].in.y;
        }
      });
      updateStep();
    }else if(allDone && currentStep>=components.length-1){
      isPlaying=false;
      playBtn.textContent='\u25B6 Play';
      playBtn.setAttribute('aria-label','Play assembly animation');
    }

    render();
    animId=requestAnimationFrame(animate);
  }

  function updateStep(){
    stepInd.textContent=`Step ${currentStep+1} / ${components.length}`;
  }

  function resetAnimation(){
    isPlaying=false;
    if(animId){cancelAnimationFrame(animId);animId=null}
    playBtn.textContent='\u25B6 Play';
    playBtn.setAttribute('aria-label','Play assembly animation');
    currentStep=0;
    state.forEach((c,i)=>{
      state[i].currentX=components[i].ex.x;
      state[i].currentY=components[i].ex.y;
      state[i].targetX=components[i].ex.x;
      state[i].targetY=components[i].ex.y;
    });
    updateStep();
    render();
  }

  function playAnimation(){
    if(isPlaying)return;
    isPlaying=true;
    playBtn.textContent='\u25B6 Running';
    playBtn.setAttribute('aria-label','Assembly animation running');
    components.forEach((c,i)=>{
      if(i<=currentStep){
        state[i].targetX=c.in.x;
        state[i].targetY=c.in.y;
      }
    });
    animate();
  }

  function pauseAnimation(){
    isPlaying=false;
    playBtn.textContent='\u25B6 Play';
    playBtn.setAttribute('aria-label','Play assembly animation');
  }

  function showTooltip(x,y,comp){
    tooltip.style.display='block';
    tooltip.style.left=Math.min(x+15,W-230)+'px';
    tooltip.style.top=Math.min(y+15,H-100)+'px';
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
    for(let i=state.length-1;i>=0;i--){
      const c=state[i];
      const s=c.sz||(c.w>100?Math.max(c.w,c.h)/2:c.w>60?Math.max(c.w,c.h)/2:30);
      const half=s;
      if(Math.abs(pos.x-c.currentX)<half+20 && Math.abs(pos.y-c.currentY)<half+20){
        return components[i];
      }
    }
    return null;
  }

  function handleClick(e){
    const pos=getCanvasPos(e);
    const hit=hitTest(pos);
    if(hit){
      showTooltip(pos.x,pos.y,hit);
      document.querySelectorAll('.comp-tag').forEach(t=>{
        t.classList.toggle('active',t.dataset.comp===hit.id);
      });
    }else{
      hideTooltip();
      document.querySelectorAll('.comp-tag').forEach(t=>t.classList.remove('active'));
    }
  }

  canvas.addEventListener('click',handleClick);
  canvas.addEventListener('touchstart',(e)=>{e.preventDefault();handleClick(e)},{passive:false});

  document.querySelectorAll('.comp-tag').forEach(btn=>{
    btn.addEventListener('click',()=>{
      const id=btn.dataset.comp;
      const comp=components.find(c=>c.id===id);
      if(comp){
        showTooltip(comp.in.x-30,comp.in.y-30,comp);
        document.querySelectorAll('.comp-tag').forEach(t=>t.classList.remove('active'));
        btn.classList.add('active');
      }
    });
  });

  playBtn.addEventListener('click',playAnimation);
  pauseBtn.addEventListener('click',pauseAnimation);
  resetBtn.addEventListener('click',resetAnimation);

  document.addEventListener('keydown',(e)=>{
    if(e.key==='Escape'){hideTooltip();document.querySelectorAll('.comp-tag').forEach(t=>t.classList.remove('active'))}
  });

  resetAnimation();

})();