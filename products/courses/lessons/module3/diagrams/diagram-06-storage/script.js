(function(){
  const canvas=document.getElementById('storageCanvas');
  const ctx=canvas.getContext('2d');
  const tooltip=document.getElementById('tooltip');
  const stepInd=document.getElementById('stepIndicator');
  const playBtn=document.getElementById('playBtn');
  const pauseBtn=document.getElementById('pauseBtn');
  const resetBtn=document.getElementById('resetBtn');
  const driveBtns=document.querySelectorAll('.drive-btn');

  const W=900,H=500;
  canvas.width=W;canvas.height=H;

  const drives=[
    {id:'m2',name:'M.2 NVMe SSD',desc:'Installs directly on the motherboard at a 30-degree angle. Push in, then screw down. No cables needed. Up to 7000MB/s.',
     x:450,y:180,w:160,h:60,color:'#2a6a6a',installDesc:'Insert at 30\u00b0 angle, push flat, secure with screw'},
    {id:'ssd',name:'2.5" SSD',desc:'Mounts in a drive bay. Connect SATA data cable (to motherboard) and SATA power (from PSU). Slim form factor.',
     x:450,y:330,w:80,h:50,color:'#0959C8',installDesc:'Slide into bay, connect SATA data + power cables'},
    {id:'hdd',name:'3.5" HDD',desc:'Larger mechanical drive for bulk storage. Same SATA connections as SSD. Handle gently \u2014 sensitive to shocks.',
     x:450,y:420,w:100,h:60,color:'#5a4a2a',installDesc:'Slide into 3.5" bay, connect SATA data + power, secure with screws'}
  ];

  let activeDrive=-1;
  let isPlaying=false;
  let cycleTimer=null;

  function drawM2(d,isActive){
    ctx.save();ctx.translate(d.x,d.y);
    ctx.fillStyle=isActive?d.color+'70':d.color+'20';
    ctx.strokeStyle=isActive?'#0959C8':d.color+'60';
    ctx.lineWidth=isActive?3:1;
    ctx.shadowColor=isActive?'#0959C880':'transparent';
    ctx.shadowBlur=isActive?15:0;

    ctx.beginPath();
    ctx.moveTo(-70,25);ctx.lineTo(-70,-25);
    ctx.lineTo(50,-25);ctx.lineTo(70,-10);
    ctx.lineTo(70,10);ctx.lineTo(50,25);
    ctx.closePath();
    ctx.fill();ctx.stroke();
    ctx.shadowBlur=0;

    ctx.fillStyle='#fff';ctx.font='bold 10px Inter,sans-serif';ctx.textAlign='center';
    ctx.fillText('M.2 NVMe',0,3);

    ctx.strokeStyle='rgba(255,255,255,0.15)';ctx.lineWidth=1;ctx.setLineDash([3,3]);
    ctx.beginPath();
    ctx.moveTo(-70,35);ctx.lineTo(70,35);
    ctx.stroke();
    ctx.fillStyle='rgba(255,255,255,0.2)';ctx.font='8px Inter,sans-serif';
    ctx.fillText('Motherboard',0,48);
    ctx.setLineDash([]);

    ctx.restore();
  }

  function drawDrive(d,isActive){
    ctx.save();ctx.translate(d.x,d.y);
    ctx.fillStyle=isActive?d.color+'70':d.color+'20';
    ctx.strokeStyle=isActive?'#0959C8':d.color+'60';
    ctx.lineWidth=isActive?3:1;
    ctx.shadowColor=isActive?'#0959C880':'transparent';
    ctx.shadowBlur=isActive?15:0;

    roundRect(ctx,-d.w/2,-d.h/2,d.w,d.h,4);
    ctx.fill();ctx.stroke();
    ctx.shadowBlur=0;

    ctx.fillStyle='#fff';ctx.font='bold 9px Inter,sans-serif';ctx.textAlign='center';
    ctx.fillText(d.name,0,3);

    ctx.restore();
  }

  function drawSataCables(x,y,color){
    ctx.save();ctx.translate(x,y);
    ctx.strokeStyle=color+'80';ctx.lineWidth=2;
    ctx.setLineDash([4,4]);
    ctx.beginPath();
    ctx.moveTo(0,0);ctx.quadraticCurveTo(30,-10,50,0);
    ctx.moveTo(0,5);ctx.quadraticCurveTo(30,15,50,5);
    ctx.stroke();
    ctx.fillStyle=color;ctx.font='7px Inter,sans-serif';
    ctx.fillText('SATA',-15,-3);
    ctx.setLineDash([]);
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

  function render(showM2,showSSD,showHDD){
    ctx.clearRect(0,0,W,H);
    ctx.fillStyle='#060910';ctx.fillRect(0,0,W,H);

    ctx.fillStyle='rgba(255,255,255,0.03)';ctx.font='10px Inter,sans-serif';
    ctx.fillText('M.2 Slot (on motherboard)',60,110);
    ctx.fillText('Drive Bay',60,280);

    ctx.strokeStyle='rgba(255,255,255,0.05)';ctx.lineWidth=1;ctx.setLineDash([4,4]);
    ctx.strokeRect(60,140,780,100);
    ctx.strokeRect(60,300,780,180);
    ctx.setLineDash([]);

    const isM2=activeDrive===0;
    if(showM2 || isM2)drawM2(drives[0],isM2);

    const isSSD=activeDrive===1;
    if(showSSD || isSSD){
      drives[1].y=340;
      drawDrive(drives[1],isSSD);
      drawSataCables(drives[1].x-30,drives[1].y-10,'#0959C8');
    }

    const isHDD=activeDrive===2;
    if(showHDD || isHDD){
      drives[2].y=430;
      drawDrive(drives[2],isHDD);
      drawSataCables(drives[2].x-35,drives[2].y-10,'#5a4a2a');
    }
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
    const regions=[
      {idx:0,x:450,y:180,w:160,h:60},
      {idx:1,x:450,y:340,w:80,h:50},
      {idx:2,x:450,y:430,w:100,h:60}
    ];
    for(let i=regions.length-1;i>=0;i--){
      const r=regions[i];
      if(Math.abs(pos.x-r.x)<r.w/2+10 && Math.abs(pos.y-r.y)<r.h/2+10)return r.idx;
    }
    return -1;
  }

  function selectDrive(idx){
    if(isPlaying)return;
    if(activeDrive===idx){
      activeDrive=-1;
      hideTooltip();
      updateButtons();
      stepInd.textContent='Ready';
      render(true,true,true);
      return;
    }
    activeDrive=idx;
    const d=drives[idx];
    showTooltip(d.x-60,d.y-50,d.installDesc,d.name);
    updateButtons();
    stepInd.textContent=d.name;
    render(true,true,true);
  }

  function updateButtons(){
    driveBtns.forEach((b,i)=>b.classList.toggle('active',i===activeDrive));
  }

  function handleClick(e){
    const pos=getCanvasPos(e);
    const idx=hitTest(pos);
    if(idx>=0)selectDrive(idx);
    else{activeDrive=-1;hideTooltip();updateButtons();stepInd.textContent='Ready';render(true,true,true)}
  }

  canvas.addEventListener('click',handleClick);
  canvas.addEventListener('touchstart',(e)=>{e.preventDefault();handleClick(e)},{passive:false});

  driveBtns.forEach((btn,i)=>{
    btn.addEventListener('click',()=>selectDrive(i));
  });

  function playCycle(){
    if(isPlaying)return;
    isPlaying=true;
    playBtn.textContent='\u25B6 Running';
    playBtn.setAttribute('aria-label','Cycling through drive installations');
    let idx=0;
    function step(){
      if(!isPlaying)return;
      activeDrive=idx;
      const d=drives[idx];
      showTooltip(d.x-60,d.y-50,d.installDesc,d.name);
      updateButtons();
      stepInd.textContent=d.name;
      if(idx===0)render(true,false,false);
      else if(idx===1)render(false,true,false);
      else render(false,false,true);
      idx=(idx+1)%drives.length;
      cycleTimer=setTimeout(step,2500);
    }
    step();
  }

  function pauseCycle(){
    isPlaying=false;
    if(cycleTimer){clearTimeout(cycleTimer);cycleTimer=null}
    playBtn.textContent='\u25B6 Play';
    playBtn.setAttribute('aria-label','Cycle through drive installations');
  }

  function resetView(){
    pauseCycle();
    activeDrive=-1;
    hideTooltip();
    updateButtons();
    stepInd.textContent='Ready';
    render(true,true,true);
  }

  playBtn.addEventListener('click',playCycle);
  pauseBtn.addEventListener('click',pauseCycle);
  resetBtn.addEventListener('click',resetView);

  document.addEventListener('keydown',(e)=>{
    if(e.key==='Escape'){activeDrive=-1;hideTooltip();updateButtons();stepInd.textContent='Ready';render(true,true,true)}
  });

  resetView();
})();