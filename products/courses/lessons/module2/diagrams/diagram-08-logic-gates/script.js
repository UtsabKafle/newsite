(function(){
  var TH='consica-diagram-theme';
var NODES={"and":{"x":130,"y":120,"fields":{"Purpose":"Outputs 1 when both inputs are 1","How It Works":"Two transistors in series: 0+0=0, 0+1=0, 1+0=0, 1+1=1.","Analogy":"Two switches in series","Fun Fact":"Built from just 2 transistors","Key Takeaway":"All conditions must be true"},"desc":"Logical conjunction gate.","icon":"&","color":"process"},"or":{"x":310,"y":120,"fields":{"Purpose":"Outputs 1 when any input is 1","How It Works":"Parallel circuit: 0+0=0, 0+1=1, 1+0=1, 1+1=1.","Analogy":"Parallel switches","Fun Fact":"Building block of adders","Key Takeaway":"At least one must be true"},"desc":"Logical disjunction gate.","icon":"≥1","color":"process"},"not":{"x":490,"y":120,"fields":{"Purpose":"Inverts input","How It Works":"One transistor + resistor: 0 becomes 1, 1 becomes 0.","Analogy":"Opposite switch","Fun Fact":"Made from 1 transistor","Key Takeaway":"Provides negation"},"desc":"Signal inverter gate.","icon":"!","color":"process"},"nand":{"x":670,"y":120,"fields":{"Purpose":"Outputs 0 when both inputs are 1","How It Works":"AND + NOT. Universal gate - any gate from NANDs.","Analogy":"AND with flipped output","Fun Fact":"Most common gate in chips","Key Takeaway":"Universal building block"},"desc":"AND followed by NOT.","icon":"&̄","color":"process"},"nor":{"x":250,"y":370,"fields":{"Purpose":"Outputs 1 when both inputs are 0","How It Works":"OR + NOT. Also universal: 0+0=1, 0+1=0, 1+0=0, 1+1=0.","Analogy":"OR with inverted output","Fun Fact":"Also universal","Key Takeaway":"All inputs must be 0"},"desc":"OR followed by NOT.","icon":"≥1̄","color":"process"},"xor":{"x":510,"y":370,"fields":{"Purpose":"Outputs 1 when inputs differ","How It Works":"Inequality detector: 0+0=0, 0+1=1, 1+0=1, 1+1=0.","Analogy":"Are these different?","Fun Fact":"Core of binary adders","Key Takeaway":"Detects inequality"},"desc":"Exclusive OR gate.","icon":"=1","color":"process"}};
var CONNS=[{"from":"and","to":"or","label":"NAND"},{"from":"or","to":"not","label":"NOR"},{"from":"not","to":"nand","label":"XOR"},{"from":"nand","to":"nor","label":"AND→OR"},{"from":"nor","to":"xor","label":"NOT→NAND"}];
var CHALLENGES=[{"q":"AND outputs 1 when:","opts":["Any 1","Both 1","Both 0","Never"],"ans":1},{"q":"Which is universal?","opts":["AND","OR","NAND","XOR"],"ans":2},{"q":"NOT gate:","opts":["Outputs both","Inverts","Adds","Multiplies"],"ans":1},{"q":"XOR outputs 1 when:","opts":["Same","Different","Both 1","Both 0"],"ans":1},{"q":"NOR 0+0 = ?","opts":["0","1","Error","Undefined"],"ans":1}];

  var CUSTOM_ANIMATE=null;

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
      setupZoomPan();
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
    CONNS.forEach(function(c,i){
      var from=NODES[c.from],to=NODES[c.to];
      if(!from||!to)return;
      var offY=(from.y===to.y)?-50:-40;
      var midX=(from.x+to.x)/2;
      var midY=(from.y+to.y)/2+offY;
      var path=document.createElementNS('http://www.w3.org/2000/svg','path');
      path.setAttribute('d','M'+from.x+' '+from.y+' Q'+midX+' '+midY+' '+to.x+' '+to.y);
      path.setAttribute('class','connection');
      path.setAttribute('stroke','var(--accent2)');
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
      svg.appendChild(dot);
    });
  }

  function selectNode(id){
    ctx.selectedId=id;
    var n=NODES[id];
    if(!n)return;
    document.getElementById('info-title').textContent=(n.icon||'')+' '+id.charAt(0).toUpperCase()+id.slice(1);
    var content=document.getElementById('info-content');
    var html='<p style="margin-bottom:10px;color:var(--text2)">'+n.desc+'</p>';
    if(n.fields)Object.keys(n.fields).forEach(function(k){
      html+='<p><strong>'+k+':</strong> '+n.fields[k]+'</p>';
    });
    content.innerHTML=html;
    infoPanel.setAttribute('aria-hidden','false');
    svg.querySelectorAll('.node-bg').forEach(function(b){b.setAttribute('filter','none');});
    var sel=svg.querySelector('.node-group[data-id="'+id+'"] .node-bg');
    if(sel){sel.setAttribute('filter','url(#glow)');}
  }

  function closeInfo(){
    infoPanel.setAttribute('aria-hidden','true');
    ctx.selectedId=null;
    svg.querySelectorAll('.node-bg').forEach(function(b){b.setAttribute('filter','none');});
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
            var my=parseFloat(d.dataset.my)||(fn.y+tn.y)/2-40;
            var u=1-p;
            d.setAttribute('cx',u*u*fn.x+2*u*p*mx+p*p*tn.x);
            d.setAttribute('cy',u*u*fn.y+2*u*p*my+p*p*tn.y);
            d.style.opacity='1';
            d.setAttribute('r','4');
          });
          var ids=Object.keys(NODES);
          var idx=Math.floor(ctx.t*0.5)%ids.length;
          svg.querySelectorAll('.node-bg').forEach(function(bg,i){
            bg.setAttribute('fill',i===idx?'var(--surface2)':'var(--surface)');
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
      res.innerHTML+='<br>Great job!';
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

  
  function setupZoomPan(){
    var zoom=1,panX=0,panY=0,drg=false,sx,sy,spx,spy;
    var svgEl=svg;
    var zoomG=document.createElementNS('http://www.w3.org/2000/svg','g');
    zoomG.setAttribute('id','zoom-group');
    var ch=[];
    for(var i=0;i<svgEl.children.length;i++){var kid=svgEl.children[i];if(kid.tagName!=='defs'&&kid.id!=='zoom-group')ch.push(kid)}
    ch.forEach(function(k){zoomG.appendChild(k)});
    svgEl.appendChild(zoomG);
    function apply(){zoomG.setAttribute('transform','translate('+panX+','+panY+') scale('+zoom+')');document.getElementById('zoom-display').textContent=Math.round(zoom*100)+'%'}
    svgEl.addEventListener('wheel',function(e){e.preventDefault();var r=svgEl.getBoundingClientRect(),mx=e.clientX-r.left,my=e.clientY-r.top,oz=zoom;zoom*=e.deltaY<0?1.1:0.9;zoom=Math.max(0.5,Math.min(4,zoom));panX=mx-(mx-panX)*zoom/oz;panY=my-(my-panY)*zoom/oz;apply()},{passive:false})
    svgEl.addEventListener('mousedown',function(e){if(e.button!==0)return;if(e.target.closest('.node-group,.ctrl-btn,.icon-btn,.connection,.challenge-option,.challenge-submit'))return;drg=true;sx=e.clientX;sy=e.clientY;spx=panX;spy=panY;zoomG.classList.add('panning')})
    document.addEventListener('mousemove',function(e){if(!drg)return;panX=spx+(e.clientX-sx);panY=spy+(e.clientY-sy);apply()})
    document.addEventListener('mouseup',function(){if(drg){drg=false;zoomG.classList.remove('panning')}})
    var touches=null;
    svgEl.addEventListener('touchstart',function(e){if(e.touches.length===1){drg=true;sx=e.touches[0].clientX;sy=e.touches[0].clientY;spx=panX;spy=panY}else if(e.touches.length===2){touches=[{x:e.touches[0].clientX,y:e.touches[0].clientY},{x:e.touches[1].clientX,y:e.touches[1].clientY}]}},{passive:true})
    svgEl.addEventListener('touchmove',function(e){if(e.touches.length===1&&drg){panX=spx+(e.touches[0].clientX-sx);panY=spy+(e.touches[0].clientY-sy);apply()}else if(e.touches.length===2&&touches){var p1=e.touches[0],p2=e.touches[1];var od=Math.hypot(touches[0].x-touches[1].x,touches[0].y-touches[1].y);var nd=Math.hypot(p1.clientX-p2.clientX,p1.clientY-p2.clientY);var oz=zoom;zoom*=nd/od;zoom=Math.max(0.5,Math.min(4,zoom));apply();touches=[{x:p1.clientX,y:p1.clientY},{x:p2.clientX,y:p2.clientY}]}},{passive:true})
    svgEl.addEventListener('touchend',function(){drg=false;touches=null})
    document.getElementById('zoom-in').addEventListener('click',function(){zoom=Math.min(4,zoom*1.3);apply()})
    document.getElementById('zoom-out').addEventListener('click',function(){zoom=Math.max(0.5,zoom/1.3);apply()})
    document.getElementById('zoom-reset').addEventListener('click',function(){zoom=1;panX=0;panY=0;apply()})
  }

  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);
  else init();
})();