(function(){'use strict';
const STORE='consica-theme';
function initTheme(){const t=localStorage.getItem(STORE)||(window.matchMedia('(prefers-color-scheme:light)').matches?'light':'dark');document.documentElement.setAttribute('data-theme',t);return t}
let theme=initTheme();
const NODES=[
{id:'firewall',label:'Firewall',x:60,y:30,desc:'Filters traffic based on security rules.',detail:'Firewalls monitor and control incoming/outgoing network traffic based on predetermined security rules, forming the first defense line.',color:'#3b82f6'},
{id:'ids',label:'IDS / IPS',x:60,y:120,desc:'Detects and prevents intrusions.',detail:'Intrusion Detection Systems monitor traffic for suspicious activity. Intrusion Prevention Systems actively block threats.',color:'#8b5cf6'},
{id:'dmz',label:'DMZ',x:60,y:210,desc:'Demilitarized Zone for public-facing services.',detail:'A DMZ is a subnetwork exposing external-facing services to untrusted networks while keeping the internal LAN isolated.',color:'#f59e0b'},
{id:'vpn',label:'VPN',x:60,y:300,desc:'Encrypted tunnel for secure remote access.',detail:'VPNs create encrypted connections over public networks, protecting data confidentiality and providing remote access.',color:'#22c55e'},
{id:'nac',label:'Access Control',x:60,y:390,desc:'Network Access Control policies.',detail:'NAC restricts network access based on device identity, user role, and security compliance before granting entry.',color:'#ec4899'}
];
const CONNS=[[0,1],[1,2],[2,3],[3,4]];
const CHALLENGES=[
{q:'What does a firewall primarily do?',o:['Encrypt data','Filter network traffic','Store passwords','Manage users'],a:1},
{q:'What is the difference between IDS and IPS?',o:['IDS blocks, IPS detects','IDS detects, IPS blocks','No difference','Both are firewalls'],a:1},
{q:'DMZ is used for:',o:['Internal database storage','Public-facing services','Employee workstations','Backup servers'],a:1},
{q:'A VPN provides:',o:['Faster internet','Encrypted tunnel connection','Free Wi-Fi','Unlimited storage'],a:1},
{q:'Network Access Control (NAC) checks:',o:['Weather conditions','Device compliance','Email content','Browser history'],a:1}
];
let selNode=null,explored=new Set(),animT=0,lastT=0,rafId=null,running=true,challengeSubmitted=false;
const app=document.getElementById('app'),skel=document.getElementById('skeleton'),errB=document.getElementById('error-boundary'),errM=document.getElementById('error-msg');
const svgC=document.getElementById('svg-container'),infoP=document.getElementById('info-panel'),infoT=document.getElementById('info-title'),infoD=document.getElementById('info-desc'),infoDet=document.getElementById('info-details'),infoClose=document.getElementById('info-close');
const speedS=document.getElementById('speed-slider'),speedV=document.getElementById('speed-value'),themeBtn=document.getElementById('theme-toggle');
const challC=document.getElementById('challenge-container'),challS=document.getElementById('challenge-submit'),challR=document.getElementById('challenge-result');
const compO=document.getElementById('completion-overlay'),compN=document.getElementById('completion-nodes'),compSc=document.getElementById('completion-score');
let speed=1,ns='http://www.w3.org/2000/svg';
function buildSVG(){
  const W=800,H=500,m=30,gW=W-2*m;
  let svg=document.createElementNS(ns,'svg');
  svg.setAttribute('viewBox','0 0 '+W+' '+H);svg.setAttribute('role','img');
  let defs=document.createElementNS(ns,'defs');
  defs.innerHTML='<linearGradient id="bg03" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#0f1729"/><stop offset="100%" stop-color="#0a0e17"/></linearGradient><filter id="glow03"><feGaussianBlur stdDeviation="3"/><feMerge><feMergeNode/><feMergeNode in="SourceGraphic"/></feMerge></filter><marker id="arr03" markerWidth="8" markerHeight="8" refX="4" refY="4" orient="auto"><path d="M0,0 L8,4 L0,8 Z" fill="rgba(255,255,255,.3)"/></marker>';
  let rect=document.createElementNS(ns,'rect');
  rect.setAttribute('width',W);rect.setAttribute('height',H);rect.setAttribute('fill','url(#bg03)');
  svg.appendChild(rect);svg.appendChild(defs);
  let title=document.createElementNS(ns,'text');
  title.setAttribute('x',m);title.setAttribute('y',22);title.setAttribute('fill','rgba(255,255,255,.6)');
  title.setAttribute('font-size','11');title.setAttribute('font-weight','600');title.setAttribute('letter-spacing','2');
  title.textContent='NETWORK SECURITY LAYERS';
  svg.appendChild(title);
  let layers=['Internet / Untrusted','Perimeter Security','Internal Network'];let ly=[35,195,390];let lc=['rgba(239,68,68,.05)','rgba(139,92,246,.05)','rgba(34,197,94,.05)'];
  layers.forEach((l,i)=>{
    let r=document.createElementNS(ns,'rect');
    r.setAttribute('x',m+180);r.setAttribute('y',ly[i]);r.setAttribute('width',gW-180);r.setAttribute('height',130);
    r.setAttribute('fill',lc[i]);r.setAttribute('rx','8');r.setAttribute('stroke','rgba(255,255,255,.04)');r.setAttribute('stroke-width','1');
    svg.appendChild(r);
    let lb=document.createElementNS(ns,'text');
    lb.setAttribute('x',m+190);lb.setAttribute('y',ly[i]+16);lb.setAttribute('fill','rgba(255,255,255,.25)');
    lb.setAttribute('font-size','9');lb.setAttribute('font-weight','600');lb.setAttribute('letter-spacing','1');
    lb.textContent=l;svg.appendChild(lb);
  });
  NODES.forEach((n,i)=>{
    let g=document.createElementNS(ns,'g');
    g.setAttribute('id','node-'+n.id);g.setAttribute('role','button');g.setAttribute('tabindex','0');
    g.setAttribute('aria-label',n.label);g.style.cursor='pointer';
    let r=document.createElementNS(ns,'rect');
    r.setAttribute('x',n.x);r.setAttribute('y',n.y);r.setAttribute('width',150);r.setAttribute('height',65);
    r.setAttribute('rx','10');r.setAttribute('fill',n.color+'20');r.setAttribute('stroke',n.color);
    r.setAttribute('stroke-width','2');r.setAttribute('filter','url(#glow03)');
    g.appendChild(r);
    let icons=['🛡','🔍','🌐','🔒','🔑'];
    let it=document.createElementNS(ns,'text');
    it.setAttribute('x',n.x+22);it.setAttribute('y',n.y+40);it.setAttribute('text-anchor','middle');
    it.setAttribute('font-size','18');it.textContent=icons[i];
    g.appendChild(it);
    let lbl=document.createElementNS(ns,'text');
    lbl.setAttribute('x',n.x+82);lbl.setAttribute('y',n.y+28);lbl.setAttribute('text-anchor','middle');
    lbl.setAttribute('fill','#e2e8f0');lbl.setAttribute('font-size','12');lbl.setAttribute('font-weight','600');
    lbl.textContent=n.label;
    g.appendChild(lbl);
    let dsc=document.createElementNS(ns,'text');
    dsc.setAttribute('x',n.x+82);dsc.setAttribute('y',n.y+47);dsc.setAttribute('text-anchor','middle');
    dsc.setAttribute('fill','#94a3b8');dsc.setAttribute('font-size','9');
    dsc.textContent=n.desc.length>32?n.desc.slice(0,32)+'...':n.desc;
    g.appendChild(dsc);
    let idx=i;
    g.addEventListener('click',function(){selectNode(idx);});
    g.addEventListener('keydown',function(e){if(e.key==='Enter'||e.key===' '){e.preventDefault();selectNode(idx);}});
    svg.appendChild(g);
  });
  CONNS.forEach(([f,t],ci)=>{
    let x1=NODES[f].x+150,y1=NODES[f].y+32,x2=NODES[t].x+0,y2=NODES[t].y+32;
    let arr=document.createElementNS(ns,'path');
    arr.setAttribute('d','M'+(x1+5)+','+y1+' L'+(x2-5)+','+y2);
    arr.setAttribute('stroke','rgba(255,255,255,.12)');arr.setAttribute('stroke-width','2');
    arr.setAttribute('fill','none');arr.setAttribute('marker-end','url(#arr03)');
    svg.appendChild(arr);
  });
  svgC.appendChild(svg);
}
function selectNode(i){
  selNode=i;explored.add(i);
  const n=NODES[i];
  infoT.textContent=n.label;infoD.textContent=n.desc;
  const details=[{k:'Layer',v:['Perimeter','Detection','Network Seg','Remote Access','Policy'][i]},{k:'Protocol',v:['Packet filtering','Signature-based','Network isolation','IPSec/TLS','802.1X'][i]},{k:'Analogy',v:['Security guard','Security camera','Waiting room','Private tunnel','ID checkpoint'][i]}];
  infoDet.innerHTML=details.map(d=>'<p><strong>'+d.k+':</strong> '+d.v+'</p>').join('')+'<p><strong>Description:</strong> '+n.detail+'</p>';
  infoP.hidden=false;updateNodes();checkCompletion();
}
function updateNodes(){
  NODES.forEach((n,i)=>{
    let g=document.getElementById('node-'+n.id);
    if(!g)return;let r=g.querySelector('rect');
    if(i===selNode){r.setAttribute('stroke','#22c55e');r.setAttribute('stroke-width','3');}
    else if(explored.has(i)){r.setAttribute('stroke',n.color);r.setAttribute('stroke-width','2');r.setAttribute('opacity','0.8');}
    else{r.setAttribute('stroke',n.color);r.setAttribute('stroke-width','2');r.setAttribute('opacity','0.6');}
  });
}
function buildChallenges(){
  challC.innerHTML='';CHALLENGES.forEach((q,i)=>{
    let div=document.createElement('div');div.className='challenge-q';
    let txt=document.createElement('p');txt.className='challenge-q-text';txt.textContent=(i+1)+'. '+q.q;
    div.appendChild(txt);let opts=document.createElement('div');opts.className='challenge-options';
    q.o.forEach((o,j)=>{
      let opt=document.createElement('div');opt.className='challenge-option';opt.dataset.qi=i;opt.dataset.oi=j;
      let inp=document.createElement('input');inp.type='radio';inp.name='cq'+i;inp.value=j;inp.id='cq'+i+'_'+j;
      let lbl=document.createElement('label');lbl.htmlFor='cq'+i+'_'+j;lbl.textContent=o;
      opt.appendChild(inp);opt.appendChild(lbl);
      opt.addEventListener('click',function(){if(!challengeSubmitted)inp.checked=true;});
      opts.appendChild(opt);
    });div.appendChild(opts);challC.appendChild(div);
  });
}
function checkChallenges(){
  challengeSubmitted=true;let correct=0;
  CHALLENGES.forEach((q,i)=>{
    let sel=document.querySelector('input[name="cq'+i+'"]:checked');
    document.querySelectorAll('.challenge-option[data-qi="'+i+'"]').forEach((o,j)=>{o.classList.remove('correct','incorrect');if(j===q.a)o.classList.add('correct');if(sel&&parseInt(sel.value)===j&&j!==q.a)o.classList.add('incorrect');});
    if(sel&&parseInt(sel.value)===q.a)correct++;
  });
  let pct=Math.round(correct/CHALLENGES.length*100);
  challR.hidden=false;challR.className='challenge-result';
  if(pct===100)challR.classList.add('success');else if(pct>=60)challR.classList.add('partial');else challR.classList.add('fail');
  challR.textContent='Score: '+correct+'/'+CHALLENGES.length+' ('+pct+'%)';challS.disabled=true;
  checkCompletion();
}
function checkCompletion(){
  if(explored.size>=NODES.length&&challengeSubmitted){
    compN.textContent=explored.size;compSc.textContent=Math.round(document.querySelectorAll('.challenge-option.correct').length/CHALLENGES.length*100||0);
    compO.hidden=false;
  }
}
function animLoop(t){
  rafId=requestAnimationFrame(animLoop);
  if(!running)return;
  if(!lastT)lastT=t;let dt=(t-lastT)/1000*speed;lastT=t;animT+=dt;
  let dots=svgC.querySelectorAll('.anim03');dots.forEach(d=>d.remove());
  CONNS.forEach(([f,t],ci)=>{
    let cycle=(animT*0.35+ci*0.25)%1;
    let x1=NODES[f].x+150,y1=NODES[f].y+32,x2=NODES[t].x,y2=NODES[t].y+32;
    let lerpx=x1+(x2-x1)*cycle,lerpy=y1+(y2-y1)*cycle;
    let dot=document.createElementNS(ns,'circle');
    dot.setAttribute('cx',lerpx);dot.setAttribute('cy',lerpy);dot.setAttribute('r','3');
    dot.setAttribute('class','anim03');dot.setAttribute('fill','#3b82f6');dot.setAttribute('opacity','0.8');
    svgC.querySelector('svg').appendChild(dot);
  });
}
document.addEventListener('DOMContentLoaded',function(){
  try{
    buildSVG();buildChallenges();skel.hidden=true;app.hidden=false;
    themeBtn.textContent=theme==='light'?'🌙':'☀️';
    themeBtn.addEventListener('click',function(){theme=theme==='dark'?'light':'dark';document.documentElement.setAttribute('data-theme',theme);localStorage.setItem(STORE,theme);themeBtn.textContent=theme==='light'?'🌙':'☀️';});
    speedS.addEventListener('input',function(){speed=parseFloat(this.value);speedV.textContent=this.value+'×';});
    infoClose.addEventListener('click',function(){infoP.hidden=true;selNode=null;updateNodes();});
    challS.addEventListener('click',checkChallenges);lastT=0;rafId=requestAnimationFrame(animLoop);
  }catch(e){skel.hidden=true;errB.hidden=false;errM.textContent=e.message||'Failed to load diagram.';}
});
window.addEventListener('beforeunload',function(){if(rafId)cancelAnimationFrame(rafId);});
})();
