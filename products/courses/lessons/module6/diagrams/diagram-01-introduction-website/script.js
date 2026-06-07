(function(){'use strict';
var NODES={{"device": {"x": 95.0, "y": 108.0, "w": 110, "h": 56, "desc": "Your computer or phone running a web browser.", "fields": {"Purpose": "Requests website pages", "How It Works": "Your computer or phone running a web browser.", "Why": "Initiates the webpage request", "Analogy": "Like a customer ordering food", "Fun Fact": "Mobile devices generate over 55% of global website traffic", "Key Takeaway": "Browsers are clients in the web ecosystem", "Common Mistake": "Browsers do not host websites"}, "name": "User Device"}, "network": {"x": 255.0, "y": 108.0, "w": 110, "h": 56, "desc": "The global network routing data packets.", "fields": {"Purpose": "Carries requests and files", "How It Works": "The global network routing data packets.", "Why": "Connects client to server", "Analogy": "Like roads carrying delivery trucks", "Fun Fact": "Data travels through fiber optic cables at 200,000 km/s", "Key Takeaway": "Network speed affects page load times", "Common Mistake": "The network does not generate webpage files"}, "name": "Internet Network"}, "server": {"x": 415.0, "y": 108.0, "w": 110, "h": 56, "desc": "A remote computer hosting HTML, CSS, and image assets.", "fields": {"Purpose": "Stores website files", "How It Works": "A remote computer hosting HTML, CSS, and image assets.", "Why": "Houses the website content", "Analogy": "Like a warehouse storing library books", "Fun Fact": "Some servers run for years without being restarted once", "Key Takeaway": "Webservers respond to client HTTP requests", "Common Mistake": "Servers are not magic; they are just computers optimized for reliability"}, "name": "Web Server"}, "assets": {"x": 575.0, "y": 108.0, "w": 110, "h": 56, "desc": "The code files and media downloaded to represent the page.", "fields": {"Purpose": "HTML, CSS, JS and media", "How It Works": "The code files and media downloaded to represent the page.", "Why": "Contains the website content", "Analogy": "Like construction plans and paint", "Fun Fact": "The average webpage download size is around 2.2 megabytes", "Key Takeaway": "Browsers assemble these files into a visual page", "Common Mistake": "Webpages are made of separate files, not just a single image"}, "name": "Web Files"}}};
var CONNS=[{"from": "device", "to": "network"}, {"from": "network", "to": "server"}, {"from": "server", "to": "assets"}];
var CHALLENGES=[{"q": "What is the purpose of User Device?", "opts": ["HTML, CSS, JS and media", "Stores website files", "Carries requests and files", "Requests website pages"], "ans": 3}, {"q": "What is the purpose of Internet Network?", "opts": ["Requests website pages", "Carries requests and files", "HTML, CSS, JS and media", "Stores website files"], "ans": 1}, {"q": "What is the purpose of Web Server?", "opts": ["Carries requests and files", "Requests website pages", "Stores website files", "HTML, CSS, JS and media"], "ans": 2}, {"q": "What is the purpose of Web Files?", "opts": ["Requests website pages", "HTML, CSS, JS and media", "Stores website files", "Carries requests and files"], "ans": 1}];
var TITLE="Introduction to Websites";
var DESC="Explore the core components and operations.";
var svg,infoPanel,overlay;
var ctx={t:0,playing:false,speed:1,selectedId:null,theme:'dark'};
var rafId,quizAnswered={},quizSubmitted=false;
function init(){
  try{
    var saved=localStorage.getItem('consica-diagram-theme');
    ctx.theme=saved||'dark';
    document.documentElement.setAttribute('data-theme',ctx.theme);
    setupDOM();buildSVG();setupEvents();buildChallenge();hideSkeleton();startLoop();
  }catch(e){showError(e);}
}
function setupDOM(){
  svg=document.getElementById('diagram-svg');
  infoPanel=document.getElementById('info-panel');
  overlay=document.getElementById('completion-overlay');
  document.getElementById('theme-toggle').addEventListener('click',function(){
    ctx.theme=ctx.theme==='dark'?'light':'dark';
    document.documentElement.setAttribute('data-theme',ctx.theme);
    localStorage.setItem('consica-diagram-theme',ctx.theme);
  });
  document.getElementById('play-btn').addEventListener('click',function(){
    ctx.playing=!ctx.playing;this.innerHTML=ctx.playing?'⏸ Pause':'▶ Play';
  });
  document.getElementById('reset-btn').addEventListener('click',function(){
    ctx.t=0;ctx.playing=false;
    document.getElementById('play-btn').innerHTML='▶ Play';
    if(svg)svg.querySelectorAll('.flow-dot').forEach(function(d){d.style.opacity='0';});
  });
  document.getElementById('info-close').addEventListener('click',closeInfo);
  document.getElementById('completion-close').addEventListener('click',function(){overlay.style.display='none';});
  document.getElementById('speed-slider').addEventListener('input',function(){
    ctx.speed=parseFloat(this.value);
    document.getElementById('speed-display').textContent=this.value+'x';
  });
  document.addEventListener('keydown',function(e){if(e.key==='Escape')closeInfo();});
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
    bg.setAttribute('x',n.x-n.w/2);
    bg.setAttribute('y',n.y-n.h/2);
    bg.setAttribute('width',n.w);
    bg.setAttribute('height',n.h);
    bg.setAttribute('rx','8');
    bg.setAttribute('fill','var(--surface,#1a2235)');
    bg.setAttribute('stroke','var(--border,#2a3a55)');
    bg.setAttribute('stroke-width','2');
    g.appendChild(bg);
    var txt=document.createElementNS('http://www.w3.org/2000/svg','text');
    txt.setAttribute('x',n.x);
    txt.setAttribute('y',n.y+4);
    txt.setAttribute('text-anchor','middle');
    txt.setAttribute('fill','var(--text,#e9e8f0)');
    txt.setAttribute('font-size','12');
    txt.setAttribute('font-weight','600');
    txt.textContent=n.name||id.charAt(0).toUpperCase()+id.slice(1);
    g.appendChild(txt);
    g.addEventListener('click',function(){selectNode(id);});
    g.addEventListener('keydown',function(e){
      if(e.key==='Enter'||e.key===' '){e.preventDefault();selectNode(id);}
    });
    svg.appendChild(g);
  });
  CONNS.forEach(function(c){
    var from=NODES[c.from],to=NODES[c.to];
    if(!from||!to)return;
    var line=document.createElementNS('http://www.w3.org/2000/svg','line');
    line.setAttribute('x1',from.x+from.w/2);
    line.setAttribute('y1',from.y);
    line.setAttribute('x2',to.x-to.w/2);
    line.setAttribute('y2',to.y);
    line.setAttribute('stroke','var(--accent2,#3b82f6)');
    line.setAttribute('stroke-width','2');
    line.setAttribute('marker-end','url(#arrowhead)');
    line.style.opacity='0.5';
    svg.insertBefore(line,svg.firstChild);
    var dot=document.createElementNS('http://www.w3.org/2000/svg','circle');
    dot.setAttribute('class','flow-dot');
    dot.setAttribute('r','4');
    dot.setAttribute('fill','var(--accent2,#3b82f6)');
    dot.style.opacity='0';
    dot.dataset.cx=from.x+from.w/2;dot.dataset.cy=from.y;
    dot.dataset.tx=to.x-to.w/2;dot.dataset.ty=to.y;
    svg.appendChild(dot);
  });
}
function selectNode(id){
  ctx.selectedId=id;
  var n=NODES[id];
  if(!n)return;
  document.getElementById('info-title').textContent=n.name||(id.charAt(0).toUpperCase()+id.slice(1));
  var html='<p style="margin-bottom:10px;color:var(--text2)">'+n.desc+'</p>';
  if(n.fields)Object.keys(n.fields).forEach(function(k){
    html+='<p><strong>'+k+':</strong> '+n.fields[k]+'</p>';
  });
  document.getElementById('info-content').innerHTML=html;
  infoPanel.setAttribute('aria-hidden','false');
  infoPanel.style.display='block';
  svg.querySelectorAll('.node-bg').forEach(function(b){b.setAttribute('stroke','var(--border,#2a3a55)');});
  var sel=svg.querySelector('.node-group[data-id="'+id+'"] .node-bg');
  if(sel)sel.setAttribute('stroke','var(--accent2,#3b82f6)');
}
function closeInfo(){
  infoPanel.setAttribute('aria-hidden','true');
  infoPanel.style.display='none';
  ctx.selectedId=null;
  svg.querySelectorAll('.node-bg').forEach(function(b){b.setAttribute('stroke','var(--border,#2a3a55)');});
}
function startLoop(){
  var last=0;
  function loop(time){
    rafId=requestAnimationFrame(loop);
    var dt=last?(time-last)/1000:0;last=time;
    if(ctx.playing&&ctx.t!==undefined){
      ctx.t+=dt*ctx.speed;
      svg.querySelectorAll('.flow-dot').forEach(function(d){
        var cx=parseFloat(d.dataset.cx)||0,cy=parseFloat(d.dataset.cy)||0;
        var tx=parseFloat(d.dataset.tx)||0,ty=parseFloat(d.dataset.ty)||0;
        var p=(ctx.t%3)/3;
        d.setAttribute('cx',cx+(tx-cx)*p);
        d.setAttribute('cy',cy+(ty-cy)*p);
        d.style.opacity='1';
      });
    }
    var ids=Object.keys(NODES);
    var idx=Math.floor(ctx.t*0.5)%ids.length;
    svg.querySelectorAll('.node-bg').forEach(function(bg,i){
      bg.setAttribute('fill',i===idx?'var(--surface2,#1e2d50)':'var(--surface,#1a2235)');
      bg.setAttribute('stroke',i===idx?'var(--accent2,#3b82f6)':'var(--border,#2a3a55)');
    });
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
    document.getElementById('completion-concepts').innerHTML='<strong>Key Concepts:</strong><br>'+Object.keys(NODES).map(function(id){return '- '+(NODES[id].name||id);}).join('<br>');
  }else{
    res.innerHTML+='<br>Review and try again.';
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
