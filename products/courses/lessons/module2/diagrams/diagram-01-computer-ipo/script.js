(function(){
  var TH='consica-diagram-theme';
  var NODES={input:{x:100,y:200,icon:'\u2328\uFE0F',color:'input',desc:'Input is how we get data into the computer. Keyboards, mice, and scanners convert physical actions into digital signals.',fields:{Purpose:'Accepts data and commands from the user or other systems','How It Works':'Input devices convert physical phenomena into electrical signals digitized by ADCs and sent via buses.','Analogy':'Like your ears and eyes gathering information for your brain','Fun Fact':'A keyboard registers keystrokes in under 16 ms','Key Takeaway':'All computer operations start with input'}},process:{x:350,y:200,icon:'\u2699\uFE0F',color:'process',desc:'The CPU processes input data to produce meaningful output.',fields:{Purpose:'Performs calculations and logical operations on input data','How It Works':'The CPU fetches, decodes, and executes instructions from memory, synchronized by the clock at billions of cycles per second.','Analogy':'Like your brain thinking and making decisions','Fun Fact':'A modern CPU can perform over 10 billion calculations per second','Key Takeaway':'Processing transforms raw data into useful information'}},output:{x:600,y:200,icon:'\uD83D\uDDA5\uFE0F',color:'output',desc:'Output devices present processed data as visuals, sound, or print.',fields:{Purpose:'Presents processed data to the user','How It Works':'Output devices convert digital data into physical form: monitors use liquid crystals, speakers vibrate diaphragms.','Analogy':'Like your mouth speaking words your brain has formed','Fun Fact':'The first monitor could only display green text on black','Key Takeaway':'Output completes the communication loop'}},storage:{x:350,y:380,icon:'\uD83D\uDCBE',color:'storage',desc:'Storage saves data permanently even after power-off.',fields:{Purpose:'Saves data permanently for future use','How It Works':'Uses magnetic (HDD) or flash (SSD) technology to retain data without power.','Analogy':'Like a notebook for remembering later','Fun Fact':'Modern SSDs can read data in under 0.1 ms','Key Takeaway':'Storage is non-volatile'}}};
  var CONNS=[{from:'input',to:'process',label:'Data'},{from:'process',to:'output',label:'Result'},{from:'output',to:'storage',label:'Save'},{from:'storage',to:'input',label:'Load'}];
  var CHALLENGES=[{q:'What is the first step in the IPO cycle?',opts:['Input','Processing','Output','Storage'],ans:0},{q:'Which component performs calculations?',opts:['Storage drive','CPU','Monitor','Keyboard'],ans:1},{q:'What does an output device do?',opts:['Accepts commands','Processes data','Presents processed data','Stores files'],ans:2},{q:'Storage is considered:',opts:['Volatile','Temporary','Non-volatile','Virtual'],ans:2},{q:'What is an input device?',opts:['Printer','Speaker','Keyboard','Monitor'],ans:2},{q:'What does the P in IPO stand for?',opts:['Programming','Processing','Printing','Powering'],ans:1}];
  var CUSTOM_ANIMATE=function(ctx,dt){
    var ids=['input','process','output','storage'];
    var t=ctx.t||0;
    var order=[0,1,2,3,0];
    var segLen=1.2;
    var totalLen=segLen*4;
    var phase=t%totalLen;
    var segIdx=Math.floor(phase/segLen);
    var segPos=(phase%segLen)/segLen;
    if(segIdx>=4)return;
    var from=order[segIdx];
    var to=order[(segIdx+1)%4];
    var fn=ids[from],tn=ids[to];
    var fNode=NODES[fn],tNode=NODES[tn];
    if(!fNode||!tNode)return;
    var sx=sx||fNode.x;var sy=sy||fNode.y;var ex=ex||tNode.x;var ey=ey||tNode.y;
    var midX=(fNode.x+tNode.x)/2;
    var midY=(fNode.y+tNode.y)/2;
    var cpx1=midX,cpY1=Math.min(fNode.y,tNode.y)-60;
    if(fn==='storage'&&tn==='input'){cpx1=midX;cpY1=Math.max(fNode.y,tNode.y)+60}
    var dots=svg.querySelectorAll('.flow-dot');
    if(!dots||dots.length<4)return;
    var d=dots[segIdx];
    if(!d)return;
    var i=segIdx;
    var p=segPos;
    var u=1-p;
    var x=u*u*u*fNode.x+3*u*u*p*cpx1+3*u*p*p*midX+p*p*p*tNode.x;
    var y=u*u*u*fNode.y+3*u*u*p*cpY1+3*u*p*p*midY+p*p*p*tNode.y;
    d.setAttribute('cx',x);
    d.setAttribute('cy',y);
    d.style.opacity='1';
    var colors=['var(--color-input)','var(--color-process)','var(--color-output)','var(--color-storage)'];
    d.setAttribute('fill',colors[segIdx]);
    d.setAttribute('r','5');
    for(var j=0;j<4;j++){if(j!==segIdx){var od=dots[j];if(od){od.style.opacity='0'}}}
  };

  var svg,infoPanel,overlay,tooltip,canvas,pCtx;
  var ctx={t:0,playing:true,speed:1,selectedId:null,theme:'dark'};
  var rafId,quizAnswered={},quizSubmitted=false;
  var particles=[],pW,pH;

  function init(){
    try{
      var saved=localStorage.getItem(TH);
      ctx.theme=saved||'dark';
      document.documentElement.setAttribute('data-theme',ctx.theme);
      setupDOM();
      initParticles();
      buildSVG();
      setupEvents();
      buildChallenge();
      hideSkeleton();
      startLoop();
    }catch(e){showError(e)}
  }

  function setupDOM(){
    svg=document.getElementById('diagram-svg');
    infoPanel=document.getElementById('info-panel');
    overlay=document.getElementById('completion-overlay');
    tooltip=document.getElementById('tooltip');
    canvas=document.getElementById('particle-canvas');
    document.getElementById('theme-toggle').addEventListener('click',function(){
      ctx.theme=ctx.theme==='dark'?'light':'dark';
      document.documentElement.setAttribute('data-theme',ctx.theme);
      localStorage.setItem(TH,ctx.theme);
    });
    document.getElementById('play-btn').addEventListener('click',function(){
      ctx.playing=!ctx.playing;
      this.innerHTML=ctx.playing?'\u23F8 Pause':'\u25B6 Play';
    });
    document.getElementById('reset-btn').addEventListener('click',function(){
      ctx.t=0;ctx.playing=true;
      document.getElementById('play-btn').innerHTML='\u23F8 Pause';
      svg.querySelectorAll('.flow-dot').forEach(function(d){d.style.opacity='0';});
    });
    document.getElementById('info-close').addEventListener('click',closeInfo);
    document.getElementById('completion-close').addEventListener('click',function(){overlay.style.display='none';});
    document.getElementById('speed-slider').addEventListener('input',function(){
      ctx.speed=parseFloat(this.value);
      document.getElementById('speed-display').textContent=this.value+'x';
    });
    document.addEventListener('keydown',function(e){if(e.key==='Escape')closeInfo();});
  }

  function initParticles(){
    if(!canvas)return;
    var rect=canvas.parentElement.getBoundingClientRect();
    canvas.width=rect.width||800;
    canvas.height=rect.height||400;
    pW=canvas.width;pH=canvas.height;
    pCtx=canvas.getContext('2d');
    var count=Math.min(50,Math.floor(pW*pH/8000));
    for(var i=0;i<count;i++){
      particles.push({
        x:Math.random()*pW,y:Math.random()*pH,
        vx:(Math.random()-0.5)*0.3,vy:(Math.random()-0.5)*0.3,
        r:Math.random()*1.5+0.5,o:Math.random()*0.3+0.1
      });
    }
    var observer=new ResizeObserver(function(){
      var r=canvas.parentElement.getBoundingClientRect();
      canvas.width=r.width||800;canvas.height=r.height||400;
      pW=canvas.width;pH=canvas.height;
    });
    observer.observe(canvas.parentElement);
  }

  function drawParticles(){
    if(!pCtx||!particles.length)return;
    pCtx.clearRect(0,0,pW,pH);
    var isLight=document.documentElement.getAttribute('data-theme')==='light';
    var baseColor=isLight?'59,130,246':'147,197,253';
    for(var i=0;i<particles.length;i++){
      var p=particles[i];
      p.x+=p.vx;p.y+=p.vy;
      if(p.x<0)p.x=pW;if(p.x>pW)p.x=0;
      if(p.y<0)p.y=pH;if(p.y>pH)p.y=0;
      pCtx.beginPath();
      pCtx.arc(p.x,p.y,p.r,0,Math.PI*2);
      pCtx.fillStyle='rgba('+baseColor+','+p.o+')';
      pCtx.fill();
    }
  }

  function buildSVG(){
    var ids=Object.keys(NODES);
    ids.forEach(function(id){
      var n=NODES[id];
      var g=document.createElementNS('http://www.w3.org/2000/svg','g');
      g.setAttribute('class','node-group');
      g.setAttribute('data-id',id);
      g.setAttribute('tabindex','0');
      g.setAttribute('role','button');
      g.setAttribute('aria-label',id);
      var bg=document.createElementNS('http://www.w3.org/2000/svg','rect');
      bg.setAttribute('class','node-bg');
      bg.setAttribute('x',n.x-54);
      bg.setAttribute('y',n.y-32);
      bg.setAttribute('width','108');
      bg.setAttribute('height','64');
      bg.setAttribute('rx','10');
      bg.setAttribute('fill','var(--surface)');
      bg.setAttribute('stroke','var(--border)');
      bg.setAttribute('stroke-width','2');
      if(n.color){
        bg.setAttribute('stroke','var(--color-'+n.color+')');
        bg.setAttribute('fill','var(--surface)');
      }
      g.appendChild(bg);
      if(n.icon){
        var ico=document.createElementNS('http://www.w3.org/2000/svg','text');
        ico.setAttribute('x',n.x);
        ico.setAttribute('y',n.y-6);
        ico.setAttribute('class','node-icon');
        ico.textContent=n.icon;
        g.appendChild(ico);
      }
      var txt=document.createElementNS('http://www.w3.org/2000/svg','text');
      txt.setAttribute('x',n.x);
      txt.setAttribute('y',n.y+14);
      txt.setAttribute('class','node-label');
      txt.textContent=id.charAt(0).toUpperCase()+id.slice(1);
      g.appendChild(txt);
      g.addEventListener('click',function(){selectNode(id);});
      g.addEventListener('keydown',function(e){if(e.key==='Enter'||e.key===' '){e.preventDefault();selectNode(id);}});
      g.addEventListener('mouseenter',function(e){showTooltip(e,id);});
      g.addEventListener('mouseleave',hideTooltip);
      g.addEventListener('mousemove',moveTooltip);
      svg.appendChild(g);
    });
    CONNS.forEach(function(c){
      var from=NODES[c.from],to=NODES[c.to];
      if(!from||!to)return;
      var dx=to.x-from.x,dy=to.y-from.y;
      var dist=Math.sqrt(dx*dx+dy*dy);
      var offX=0,offY=-40;
      if(from.y===to.y){offY=-50;offX=0}
      if(c.from==='storage'&&c.to==='input'){offY=50;offX=0}
      var midX=(from.x+to.x)/2+offX;
      var midY=(from.y+to.y)/2+offY;
      var path=document.createElementNS('http://www.w3.org/2000/svg','path');
      var dAttr='M'+from.x+' '+from.y+' Q'+midX+' '+midY+' '+to.x+' '+to.y;
      path.setAttribute('d',dAttr);
      path.setAttribute('class','connection');
      var colorVar='var(--accent2)';
      if(from.color&&to.color&&from.color===to.color){colorVar='var(--color-'+from.color+')'}
      path.setAttribute('stroke',colorVar);
      path.setAttribute('marker-end','url(#arrowhead)');
      path.style.opacity='0.4';
      svg.insertBefore(path,svg.firstChild);
      if(c.label){
        var lbl=document.createElementNS('http://www.w3.org/2000/svg','text');
        lbl.setAttribute('x',midX);
        lbl.setAttribute('y',midY+(offY<0?10:-12));
        lbl.setAttribute('class','connection-label');
        lbl.textContent=c.label;
        svg.appendChild(lbl);
      }
      var dot=document.createElementNS('http://www.w3.org/2000/svg','circle');
      dot.setAttribute('class','flow-dot');
      dot.setAttribute('r','4');
      dot.style.opacity='0';
      dot.dataset.fi=c.from;dot.dataset.ti=c.to;
      dot.dataset.mx=midX;dot.dataset.my=midY;
      dot.dataset.offX=offX;dot.dataset.offY=offY;
      svg.appendChild(dot);
    });
  }

  function selectNode(id){
    ctx.selectedId=id;
    var n=NODES[id];
    if(!n)return;
    document.getElementById('info-title').textContent=n.icon+' '+id.charAt(0).toUpperCase()+id.slice(1);
    var content=document.getElementById('info-content');
    var html='<p style="margin-bottom:10px;color:var(--text2)">'+n.desc+'</p>';
    if(n.fields)Object.keys(n.fields).forEach(function(k){
      html+='<p><strong>'+k+':</strong> '+n.fields[k]+'</p>';
    });
    content.innerHTML=html;
    infoPanel.setAttribute('aria-hidden','false');
    svg.querySelectorAll('.node-bg').forEach(function(b){b.setAttribute('stroke','var(--border)');b.setAttribute('filter','none');});
    var sel=svg.querySelector('.node-group[data-id="'+id+'"] .node-bg');
    if(sel){sel.setAttribute('stroke','var(--accent2)');sel.setAttribute('filter','url(#glow)');}
  }

  function closeInfo(){
    infoPanel.setAttribute('aria-hidden','true');
    ctx.selectedId=null;
    svg.querySelectorAll('.node-bg').forEach(function(b){
      var g=b.parentElement;
      if(g){var id=g.getAttribute('data-id');if(id&&NODES[id]&&NODES[id].color){b.setAttribute('stroke','var(--color-'+NODES[id].color+')')}else{b.setAttribute('stroke','var(--border)')}}
      b.setAttribute('filter','none');
    });
  }

  function showTooltip(e,id){
    var n=NODES[id];
    if(!n)return;
    tooltip.textContent=n.desc;
    tooltip.className='tooltip visible';
    moveTooltip(e);
  }

  function hideTooltip(){
    tooltip.className='tooltip';
  }

  function moveTooltip(e){
    var rect=document.getElementById('visual-container').getBoundingClientRect();
    var x=e.clientX-rect.left+12;
    var y=e.clientY-rect.top-10;
    if(x+200>rect.width)x=rect.width-210;
    if(y<5)y=5;
    tooltip.style.left=x+'px';
    tooltip.style.top=y+'px';
  }

  function startLoop(){
    var last=0;
    function loop(time){
      rafId=requestAnimationFrame(loop);
      var dt=last?(time-last)/1000:0;last=time;
      drawParticles();
      if(ctx.playing&&ctx.t!==undefined){
        ctx.t+=dt*ctx.speed;
        if(CUSTOM_ANIMATE){
          CUSTOM_ANIMATE(ctx,dt);
        }else{
          svg.querySelectorAll('.flow-dot').forEach(function(d){
            var fi=d.dataset.fi,ti=d.dataset.ti;
            var fn=NODES[fi],tn=NODES[ti];
            if(!fn||!tn)return;
            var p=(ctx.t%3)/3;
            var mx=parseFloat(d.dataset.mx)||(fn.x+tn.x)/2;
            var my=parseFloat(d.dataset.my)||(fn.y+tn.y)/2;
            var ox=parseFloat(d.dataset.offX)||0;
            var oy=parseFloat(d.dataset.offY)||0;
            var u=1-p;
            var x=u*u*fn.x+2*u*p*mx+p*p*tn.x;
            var y=u*u*fn.y+2*u*p*my+p*p*tn.y;
            d.setAttribute('cx',x);
            d.setAttribute('cy',y);
            d.style.opacity='1';
            d.setAttribute('r','4');
          });
          var ids=Object.keys(NODES);
          var idx=Math.floor(ctx.t*0.5)%ids.length;
          svg.querySelectorAll('.node-bg').forEach(function(bg,i){
            bg.setAttribute('fill',i===idx?'var(--surface2)':'var(--surface)');
            if(NODES[ids[i]]&&NODES[ids[i]].color){
              bg.setAttribute('stroke',i===idx?'var(--accent2)':'var(--color-'+NODES[ids[i]].color+')');
            }
          });
        }
      }
    }
    rafId=requestAnimationFrame(loop);
  }

  function buildChallenge(){
    var ctn=document.getElementById('challenge-container');
    ctn.innerHTML='';
    quizAnswered={};quizSubmitted=false;
    CHALLENGES.forEach(function(c,i){
      var d=document.createElement('div');d.className='challenge-question';d.dataset.qi=i;
      var qt=document.createElement('div');qt.className='challenge-q-text';qt.textContent=(i+1)+'. '+c.q;
      d.appendChild(qt);
      var opts=document.createElement('div');opts.className='challenge-options';
      c.opts.forEach(function(o,j){
        var lbl=document.createElement('label');lbl.className='challenge-option';
        var r=document.createElement('input');r.type='radio';r.name='chq-'+i;r.value=j;
        r.addEventListener('change',function(){
          quizAnswered[i]=j;
          opts.querySelectorAll('.challenge-option').forEach(function(l){l.classList.remove('selected');});
          lbl.classList.add('selected');
        });
        lbl.appendChild(r);lbl.appendChild(document.createTextNode(' '+o));
        opts.appendChild(lbl);
      });
      d.appendChild(opts);ctn.appendChild(d);
    });
    var sb=document.createElement('button');sb.className='challenge-submit';sb.textContent='Submit Answers';
    sb.addEventListener('click',submitQuiz);ctn.appendChild(sb);
  }

  function submitQuiz(){
    if(quizSubmitted)return;
    var correct=0;
    CHALLENGES.forEach(function(c,i){
      var opts=document.querySelector('.challenge-question[data-qi="'+i+'"] .challenge-options');
      var labels=opts.querySelectorAll('.challenge-option');
      labels.forEach(function(l,j){
        var r=l.querySelector('input');r.disabled=true;
        if(j===c.ans)l.classList.add('correct');
        else if(r.checked)l.classList.add('wrong');
      });
      if(typeof quizAnswered[i]!=='undefined'&&quizAnswered[i]===c.ans)correct++;
    });
    quizSubmitted=true;
    var total=CHALLENGES.length;
    var pct=Math.round((correct/total)*100);
    var res=document.getElementById('challenge-result');
    res.style.display='block';
    res.innerHTML='<strong>Score: '+correct+'/'+total+' ('+pct+'%)</strong>';
    if(pct>=70){
      res.innerHTML+='<br>Great job! You understand the IPO cycle.';
      overlay.style.display='flex';
      document.getElementById('completion-score').textContent='Score: '+correct+'/'+total;
      var concepts='<strong>Key Concepts:</strong>';
      Object.keys(NODES).forEach(function(id){
        var n=NODES[id];
        concepts+='<div class="concept-card"><strong>'+(n.icon||'')+' '+id.charAt(0).toUpperCase()+id.slice(1)+'</strong>'+(n.desc||'')+'</div>';
      });
      document.getElementById('completion-concepts').innerHTML=concepts;
    }else{
      res.innerHTML+='<br>Review the diagram and try again.';
    }
  }

  function setupEvents(){}
  function hideSkeleton(){
    var skel=document.getElementById('loading-skeleton');
    if(skel){skel.style.display='none';skel.setAttribute('aria-hidden','true');}
    document.getElementById('diagram-container').style.display='block';
  }

  function showError(e){
    var eb=document.getElementById('error-boundary');
    eb.style.display='block';
    eb.textContent='Error: '+(e.message||'Unexpected error. Refresh please.');
    hideSkeleton();
  }

  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);
  else init();
})();