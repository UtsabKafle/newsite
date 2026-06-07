(function(){'use strict';
const STORE='consica-theme';
function initTheme(){const t=localStorage.getItem(STORE)||(window.matchMedia('(prefers-color-scheme:light)').matches?'light':'dark');document.documentElement.setAttribute('data-theme',t);return t}
let theme=initTheme();
const NODES=[
{id:'malware',label:'Malware',x:50,y:30,desc:'Malicious software designed to damage or exploit systems.',detail:'Includes viruses, worms, trojans, ransomware, and spyware. Malware can steal data, encrypt files, or hijack resources.',color:'#ef4444'},
{id:'phishing',label:'Phishing',x:50,y:130,desc:'Deceptive messages tricking users into revealing sensitive info.',detail:'Attackers pose as legitimate entities via email, SMS, or fake websites. Often targets credentials, financial data, or personal info.',color:'#f59e0b'},
{id:'ddos',label:'DDoS Attacks',x:50,y:230,desc:'Overwhelming systems with traffic to cause denial of service.',detail:'Distributed networks of compromised devices flood targets with requests, making services unavailable to legitimate users.',color:'#8b5cf6'},
{id:'insider',label:'Insider Threats',x:50,y:330,desc:'Risks originating from within the organization.',detail:'Employees, contractors, or partners who misuse access — intentionally or accidentally — to cause harm or leak data.',color:'#3b82f6'},
{id:'zero-day',label:'Zero-Day Exploits',x:50,y:430,desc:'Attacks using unknown vulnerabilities before patches exist.',detail:'Developers have zero days to fix the flaw. These are among the most dangerous as no defense exists at discovery time.',color:'#ec4899'}
];
const CHALLENGES=[
{q:'What type of malware encrypts files and demands payment?',o:['Virus','Ransomware','Spyware','Trojan'],a:1},
{q:'Which attack overwhelms a server with traffic?',o:['Phishing','DDoS','MITM','SQL Injection'],a:1},
{q:'What is a zero-day exploit?',o:['Attack on day zero of month','Exploit of unknown vulnerability','Bug found in first hour','Attack using zero resources'],a:1},
{q:'Insider threats come from:',o:['Foreign governments','Inside the organization','Automated bots','Hardware failures'],a:1},
{q:'Phishing primarily targets:',o:['Network ports','Human psychology','Firewall rules','Encryption keys'],a:1}
];
let selNode=null,explored=new Set(),animT=0,lastT=0,rafId=null,running=true,challengeSubmitted=false;
const app=document.getElementById('app'),skel=document.getElementById('skeleton'),errB=document.getElementById('error-boundary'),errM=document.getElementById('error-msg');
const svgC=document.getElementById('svg-container'),infoP=document.getElementById('info-panel'),infoT=document.getElementById('info-title'),infoD=document.getElementById('info-desc'),infoDet=document.getElementById('info-details'),infoClose=document.getElementById('info-close');
const speedS=document.getElementById('speed-slider'),speedV=document.getElementById('speed-value'),themeBtn=document.getElementById('theme-toggle');
const challC=document.getElementById('challenge-container'),challS=document.getElementById('challenge-submit'),challR=document.getElementById('challenge-result');
const compO=document.getElementById('completion-overlay'),compN=document.getElementById('completion-nodes'),compSc=document.getElementById('completion-score');
let speed=1;
let ns='http://www.w3.org/2000/svg';
function buildSVG(){
  const W=800,H=520,m=30,gW=W-2*m,gH=H-2*m;
  let svg=document.createElementNS(ns,'svg');
  svg.setAttribute('viewBox','0 0 '+W+' '+H);svg.setAttribute('role','img');
  let defs=document.createElementNS(ns,'defs');
  defs.innerHTML='<linearGradient id="bgGrad01" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#0f1729"/><stop offset="100%" stop-color="#0a0e17"/></linearGradient><filter id="glow01"><feGaussianBlur stdDeviation="3" result="blur"/><feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge></filter><marker id="arrow01" markerWidth="8" markerHeight="8" refX="4" refY="4" orient="auto"><path d="M0,0 L8,4 L0,8 Z" fill="rgba(255,255,255,.3)"/></marker>';
  let rect=document.createElementNS(ns,'rect');
  rect.setAttribute('width',W);rect.setAttribute('height',H);rect.setAttribute('fill','url(#bgGrad01)');
  svg.appendChild(rect);svg.appendChild(defs);
  let title=document.createElementNS(ns,'text');
  title.setAttribute('x',m);title.setAttribute('y',22);title.setAttribute('fill','rgba(255,255,255,.6)');
  title.setAttribute('font-size','11');title.setAttribute('font-weight','600');
  title.setAttribute('text-transform','uppercase');title.setAttribute('letter-spacing','2');
  title.textContent='ATTACK SURFACE';
  svg.appendChild(title);
  let zones=[
    {x:50,y:35,w:160,h:490,label:'External Threats',color:'rgba(239,68,68,.08)'},
    {x:230,y:35,w:140,h:490,label:'Network Layer',color:'rgba(139,92,246,.08)'},
    {x:390,y:35,w:360,h:490,label:'Target Systems',color:'rgba(59,130,246,.08)'}
  ];
  zones.forEach(z=>{
    let r=document.createElementNS(ns,'rect');
    r.setAttribute('x',z.x);r.setAttribute('y',z.y);r.setAttribute('width',z.w);r.setAttribute('height',z.h);
    r.setAttribute('fill',z.color);r.setAttribute('rx','8');r.setAttribute('stroke','rgba(255,255,255,.05)');r.setAttribute('stroke-width','1');
    svg.appendChild(r);
    let l=document.createElementNS(ns,'text');
    l.setAttribute('x',z.x+z.w/2);l.setAttribute('y',z.y+16);l.setAttribute('text-anchor','middle');
    l.setAttribute('fill','rgba(255,255,255,.3)');l.setAttribute('font-size','9');l.setAttribute('font-weight','600');
    l.setAttribute('letter-spacing','1');l.textContent=z.label;
    svg.appendChild(l);
  });
  let path=document.createElementNS(ns,'path');
  path.setAttribute('d','M210,300 L230,300');path.setAttribute('stroke','rgba(255,255,255,.15)');
  path.setAttribute('stroke-width','2');path.setAttribute('marker-end','url(#arrow01)');
  path.setAttribute('stroke-dasharray','4,4');
  svg.appendChild(path);
  NODES.forEach((n,i)=>{
    let g=document.createElementNS(ns,'g');
    g.setAttribute('id','node-'+n.id);g.setAttribute('role','button');g.setAttribute('tabindex','0');
    g.setAttribute('aria-label',n.label);g.style.cursor='pointer';
    let ry=10;
    let r=document.createElementNS(ns,'rect');
    r.setAttribute('x',n.x);r.setAttribute('y',n.y);r.setAttribute('width',140);r.setAttribute('height',60);
    r.setAttribute('rx',ry);r.setAttribute('fill',n.color+'20');r.setAttribute('stroke',n.color);
    r.setAttribute('stroke-width','2');r.setAttribute('filter','url(#glow01)');
    g.appendChild(r);
    let icon=document.createElementNS(ns,'circle');
    icon.setAttribute('cx',n.x+30);icon.setAttribute('cy',n.y+30);icon.setAttribute('r',16);
    icon.setAttribute('fill',n.color+'40');icon.setAttribute('stroke',n.color);icon.setAttribute('stroke-width','1.5');
    g.appendChild(icon);
    let icons=['⚠','🎣','💥','🔑','🕳'];
    let it=document.createElementNS(ns,'text');
    it.setAttribute('x',n.x+30);it.setAttribute('y',n.y+35);it.setAttribute('text-anchor','middle');
    it.setAttribute('font-size','14');it.textContent=icons[i];
    g.appendChild(it);
    let lbl=document.createElementNS(ns,'text');
    lbl.setAttribute('x',n.x+70);lbl.setAttribute('y',n.y+24);lbl.setAttribute('text-anchor','middle');
    lbl.setAttribute('fill','#e2e8f0');lbl.setAttribute('font-size','12');lbl.setAttribute('font-weight','600');
    lbl.textContent=n.label;
    g.appendChild(lbl);
    let dsc=document.createElementNS(ns,'text');
    dsc.setAttribute('x',n.x+70);dsc.setAttribute('y',n.y+42);dsc.setAttribute('text-anchor','middle');
    dsc.setAttribute('fill','#94a3b8');dsc.setAttribute('font-size','9');
    dsc.textContent=n.desc.length>30?n.desc.slice(0,30)+'...':n.desc;
    g.appendChild(dsc);
    let idx=i;
    g.addEventListener('click',function(){selectNode(idx);});
    g.addEventListener('keydown',function(e){if(e.key==='Enter'||e.key===' '){e.preventDefault();selectNode(idx);}});
    svg.appendChild(g);
    if(i<NODES.length-1){
      let conn=document.createElementNS(ns,'path');
      let x1=n.x+140,y1=n.y+30,x2=NODES[i+1].x,y2=NODES[i+1].y+30;
      let mx=(x1+x2)/2;
      conn.setAttribute('d','M'+x1+','+y1+' Q'+mx+','+y1+' '+mx+','+((y1+y2)/2)+' Q'+mx+','+y2+' '+x2+','+y2);
      conn.setAttribute('stroke','rgba(255,255,255,.1)');conn.setAttribute('stroke-width','1.5');
      conn.setAttribute('fill','none');conn.setAttribute('stroke-dasharray','4,4');
      svg.appendChild(conn);
    }
  });
  svgC.appendChild(svg);
}
function selectNode(i){
  selNode=i;explored.add(i);
  const n=NODES[i];
  infoT.textContent=n.label;infoD.textContent=n.desc;
  infoDet.innerHTML='<p><strong>Type:</strong> '+n.label+'</p><p><strong>Risk Level:</strong> '+['Critical','High','Medium','High','Critical'][i]+'</p><p><strong>Description:</strong> '+n.detail+'</p><p><strong>Mitigation:</strong> '+['Keep software updated, use antivirus','Enable MFA, verify senders','Use CDN and rate limiting','Least privilege, monitor access','Regular patching, threat intel'][i]+'</p>';
  infoP.hidden=false;
  updateNodes();
  checkCompletion();
}
function updateNodes(){
  NODES.forEach((n,i)=>{
    let g=document.getElementById('node-'+n.id);
    if(!g)return;
    let r=g.querySelector('rect');
    if(i===selNode){r.setAttribute('stroke','#22c55e');r.setAttribute('stroke-width','3');}
    else if(explored.has(i)){r.setAttribute('stroke',n.color);r.setAttribute('stroke-width','2');r.setAttribute('opacity','0.8');}
    else{r.setAttribute('stroke',n.color);r.setAttribute('stroke-width','2');r.setAttribute('opacity','0.6');}
  });
}
function buildChallenges(){
  challC.innerHTML='';
  CHALLENGES.forEach((q,i)=>{
    let div=document.createElement('div');div.className='challenge-q';
    let txt=document.createElement('p');txt.className='challenge-q-text';txt.textContent=(i+1)+'. '+q.q;
    div.appendChild(txt);
    let opts=document.createElement('div');opts.className='challenge-options';
    q.o.forEach((o,j)=>{
      let opt=document.createElement('div');opt.className='challenge-option';opt.dataset.qi=i;opt.dataset.oi=j;
      let inp=document.createElement('input');inp.type='radio';inp.name='cq'+i;inp.value=j;inp.id='cq'+i+'_'+j;
      let lbl=document.createElement('label');lbl.htmlFor='cq'+i+'_'+j;lbl.textContent=o;
      opt.appendChild(inp);opt.appendChild(lbl);
      opt.addEventListener('click',function(){if(!challengeSubmitted){inp.checked=true;}});
      opts.appendChild(opt);
    });
    div.appendChild(opts);challC.appendChild(div);
  });
}
function checkChallenges(){
  challengeSubmitted=true;
  let correct=0;
  CHALLENGES.forEach((q,i)=>{
    let sel=document.querySelector('input[name="cq'+i+'"]:checked');
    let opts=document.querySelectorAll('.challenge-option[data-qi="'+i+'"]');
    opts.forEach((o,j)=>{
      o.classList.remove('correct','incorrect');
      if(j===q.a){o.classList.add('correct');}
      if(sel&&parseInt(sel.value)===j&&j!==q.a){o.classList.add('incorrect');}
    });
    if(sel&&parseInt(sel.value)===q.a)correct++;
  });
  let pct=Math.round(correct/CHALLENGES.length*100);
  challR.hidden=false;challR.className='challenge-result';
  if(pct===100)challR.classList.add('success');
  else if(pct>=60)challR.classList.add('partial');
  else challR.classList.add('fail');
  challR.textContent='Score: '+correct+'/'+CHALLENGES.length+' ('+pct+'%)';
  challS.disabled=true;
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
  if(!lastT)lastT=t;
  let dt=(t-lastT)/1000*speed;lastT=t;animT+=dt;
  let dots=svgC.querySelectorAll('.anim-dot');
  dots.forEach(d=>d.remove());
  NODES.forEach((n,i)=>{
    let cycle=(animT*0.5+i*0.3)%1;
    let cx=n.x+70,cy=n.y+30;
    let dot=document.createElementNS(ns,'circle');
    dot.setAttribute('cx',cx+Math.sin(cycle*Math.PI*2)*20);
    dot.setAttribute('cy',cy+Math.cos(cycle*Math.PI*2)*15);
    dot.setAttribute('r','3');dot.setAttribute('class','anim-dot');
    dot.setAttribute('fill',n.color);dot.setAttribute('opacity','0.7');
    svgC.querySelector('svg').appendChild(dot);
  });
}
document.addEventListener('DOMContentLoaded',function(){
  try{
    buildSVG();buildChallenges();skel.hidden=true;app.hidden=false;
    themeBtn.textContent=theme==='light'?'🌙':'☀️';
    themeBtn.addEventListener('click',function(){
      theme=theme==='dark'?'light':'dark';document.documentElement.setAttribute('data-theme',theme);localStorage.setItem(STORE,theme);
      themeBtn.textContent=theme==='light'?'🌙':'☀️';
    });
    speedS.addEventListener('input',function(){speed=parseFloat(this.value);speedV.textContent=this.value+'×';});
    infoClose.addEventListener('click',function(){infoP.hidden=true;selNode=null;updateNodes();});
    challS.addEventListener('click',checkChallenges);
    lastT=0;rafId=requestAnimationFrame(animLoop);
  }catch(e){skel.hidden=true;errB.hidden=false;errM.textContent=e.message||'Failed to load diagram.';}
});
window.addEventListener('beforeunload',function(){if(rafId)cancelAnimationFrame(rafId);});
})();
