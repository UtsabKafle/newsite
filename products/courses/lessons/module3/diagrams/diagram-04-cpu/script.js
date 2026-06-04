(function(){
  const canvas=document.getElementById('cpuCanvas');
  const ctx=canvas.getContext('2d');
  const tooltip=document.getElementById('tooltip');
  const stepInd=document.getElementById('stepIndicator');
  const playBtn=document.getElementById('playBtn');
  const pauseBtn=document.getElementById('pauseBtn');
  const resetBtn=document.getElementById('resetBtn');
  const stepBtns=document.querySelectorAll('.step-btn');

  const W=900,H=500;
  canvas.width=W;canvas.height=H;

  const steps=[
    {name:'Align',desc:'Rotate the CPU so the gold triangle (alignment arrow) on the corner matches the triangle on the socket. Never force the CPU into place.',
     label:'Step 1: Align the CPU corners'},
    {name:'Place',desc:'Gently lower the CPU straight down into the socket. The CPU should drop in with zero resistance. Do not tilt or slide it.',
     label:'Step 2: Place the CPU into socket'},
    {name:'Secure',desc:'Close the retention arm and lock the bracket. You should hear/feel a click. The CPU is now firmly secured in the socket.',
     label:'Step 3: Secure with retention arm'},
    {name:'Thermal Paste',desc:'Apply a pea-sized dot of thermal paste to the center of the CPU IHS. Mount the cooler evenly. The paste spreads under pressure.',
     label:'Step 4: Apply thermal paste'}
  ];

  let currentStep=0;
  let animProgress=0;
  let isPlaying=false;
  let animId=null;

  function drawSocket(){
    ctx.save();
    ctx.translate(450,260);
    ctx.fillStyle='#1a1e2a';ctx.strokeStyle='rgba(255,255,255,0.2)';ctx.lineWidth=2;
    roundRect(ctx,-65,-65,130,130,6);ctx.fill();ctx.stroke();

    ctx.strokeStyle='rgba(255,255,255,0.08)';ctx.lineWidth=1;
    for(let r=0;r<7;r++)for(let c=0;c<7;c++){
      ctx.strokeRect(-45+c*15,-45+r*15,12,12);
    }

    ctx.fillStyle='rgba(255,255,255,0.15)';ctx.font='12px Inter,sans-serif';ctx.textAlign='center';
    ctx.fillText('\u25B2',-40,-55);
    ctx.fillStyle='rgba(255,255,255,0.3)';ctx.font='8px Inter,sans-serif';
    ctx.fillText('align',-40,-66);

    ctx.strokeStyle='rgba(255,255,255,0.15)';ctx.lineWidth=1;ctx.setLineDash([3,3]);
    ctx.strokeRect(-48,-48,96,96);
    ctx.setLineDash([]);

    ctx.restore();
  }

  function drawCPU(progress){
    const px=450,py=260;
    const targetY=progress>=1?py:py-100+progress*100;
    const alpha=progress>=0.1?1:progress/0.1;

    ctx.save();
    ctx.translate(px,targetY);
    ctx.globalAlpha=alpha;
    ctx.fillStyle='#8a3a2a';ctx.strokeStyle='#aa5a4a';ctx.lineWidth=2;
    ctx.shadowColor='#8a3a2a80';ctx.shadowBlur=15;
    roundRect(ctx,-40,-40,80,80,4);ctx.fill();ctx.stroke();
    ctx.shadowBlur=0;

    ctx.fillStyle='#aa5a4a';ctx.font='bold 10px Inter,sans-serif';ctx.textAlign='center';
    ctx.fillText('CPU',0,2);
    ctx.fillStyle='rgba(255,255,255,0.5)';ctx.font='7px Inter,sans-serif';
    ctx.fillText('\u25B2 align',28,-28);

    if(progress>=1){
      ctx.strokeStyle='rgba(255,255,200,0.3)';ctx.lineWidth=1;
      ctx.strokeRect(-38,-38,76,76);
    }
    ctx.restore();
  }

  function drawRetentionArm(progress){
    if(progress<0.5)return;
    const p=(progress-0.5)/0.5;
    ctx.save();
    ctx.translate(450,200);
    ctx.strokeStyle='#8899aa';ctx.lineWidth=3;
    ctx.beginPath();
    ctx.arc(0,60,60,Math.PI*(1-p*0.4),Math.PI);
    ctx.stroke();
    ctx.restore();
  }

  function drawPaste(progress){
    if(progress<0.75)return;
    const p=(progress-0.75)/0.25;
    ctx.save();
    ctx.translate(450,260);
    ctx.globalAlpha=p;
    ctx.fillStyle='#aaa';ctx.shadowColor='#aaa80';ctx.shadowBlur=10;
    ctx.beginPath();ctx.arc(0,0,8*p,0,Math.PI*2);ctx.fill();
    ctx.shadowBlur=0;
    ctx.restore();
  }

  function drawLever(pos){
    ctx.save();
    ctx.translate(515,260);
    ctx.strokeStyle='#8899aa';ctx.lineWidth=3;
    const angle=pos*Math.PI/2;
    ctx.beginPath();
    ctx.moveTo(0,0);ctx.lineTo(15*Math.cos(angle-Math.PI/2),15*Math.sin(angle-Math.PI/2));
    ctx.stroke();
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

    ctx.fillStyle='rgba(255,255,255,0.03)';ctx.font='10px Inter,sans-serif';
    ctx.fillText('LGA Socket',60,40);
    ctx.fillText('CPU Chip',750,40);

    drawSocket();
    drawCPU(animProgress);
    drawRetentionArm(animProgress);
    drawPaste(animProgress);

    if(currentStep===2 && animProgress>=0.5){
      drawLever(1);
    }

    ctx.save();
    ctx.fillStyle='rgba(255,255,255,0.1)';ctx.font='bold 14px Inter,sans-serif';
    ctx.textAlign='center';
    ctx.fillText(steps[currentStep].name,450,450);
    ctx.restore();
  }

  function showTooltip(x,y,text){
    tooltip.style.display='block';
    tooltip.style.left=Math.min(x+15,W-270)+'px';
    tooltip.style.top=Math.min(y+15,H-110)+'px';
    tooltip.innerHTML=`<span class="tt-name">${steps[currentStep].name}</span><span class="tt-desc">${text}</span>`;
    tooltip.setAttribute('aria-hidden','false');
  }

  function hideTooltip(){
    tooltip.style.display='none';
    tooltip.setAttribute('aria-hidden','true');
  }

  function setStep(step){
    currentStep=Math.max(0,Math.min(step,3));
    animProgress=0;
    stepInd.textContent=steps[currentStep].label;
    document.querySelectorAll('.step-btn').forEach((b,i)=>{
      b.classList.toggle('active',i===currentStep);
    });
    render();
  }

  function animate(){
    if(!isPlaying)return;
    animProgress+=0.008;
    if(animProgress>=1){
      if(currentStep<3){
        currentStep++;
        animProgress=0;
        setStep(currentStep);
        document.querySelectorAll('.step-btn').forEach((b,i)=>{
          b.classList.toggle('active',i===currentStep);
        });
      }else{
        isPlaying=false;
        playBtn.textContent='\u25B6 Play';
        playBtn.setAttribute('aria-label','Run CPU installation animation');
        animProgress=1;
        render();
        return;
      }
    }
    render();
    animId=requestAnimationFrame(animate);
  }

  function play(){
    if(isPlaying)return;
    isPlaying=true;
    playBtn.textContent='\u25B6 Running';
    playBtn.setAttribute('aria-label','CPU installation running');
    animate();
  }

  function pause(){
    isPlaying=false;
    if(animId){cancelAnimationFrame(animId);animId=null}
    playBtn.textContent='\u25B6 Play';
    playBtn.setAttribute('aria-label','Run CPU installation animation');
  }

  function reset(){
    pause();
    currentStep=0;
    animProgress=0;
    setStep(0);
    document.querySelectorAll('.step-btn').forEach((b,i)=>b.classList.toggle('active',i===0));
    hideTooltip();
  }

  stepBtns.forEach((btn,i)=>{
    btn.addEventListener('click',()=>{
      pause();
      setStep(i);
      document.querySelectorAll('.step-btn').forEach((b,j)=>b.classList.toggle('active',j===i));
      showTooltip(300,300,steps[i].desc);
    });
  });

  canvas.addEventListener('click',()=>{
    pause();
    showTooltip(300,300,steps[currentStep].desc);
  });
  canvas.addEventListener('touchstart',(e)=>{e.preventDefault();canvas.click()},{passive:false});

  playBtn.addEventListener('click',play);
  pauseBtn.addEventListener('click',pause);
  resetBtn.addEventListener('click',reset);

  document.addEventListener('keydown',(e)=>{
    if(e.key==='Escape')hideTooltip();
  });

  setStep(0);
})();