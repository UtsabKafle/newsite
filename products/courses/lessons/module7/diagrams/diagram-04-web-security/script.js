(function(){'use strict';
const STORE='consica-theme';
function initTheme(){const t=localStorage.getItem(STORE)||(window.matchMedia('(prefers-color-scheme:light)').matches?'light':'dark');document.documentElement.setAttribute('data-theme',t);return t}
let theme=initTheme();
const NODES=[
{id:'xss',label:'XSS',x:30,y:30,desc:'Cross-Site Scripting — injects malicious scripts.',detail:'Attackers inject client-side scripts into web pages viewed by others, bypassing access controls and stealing data.',color:'#ef4444'},
{id:'sqli',label:'SQL Injection',x:30,y:120,desc:'Injects malicious SQL queries via input fields.',detail:'Attackers manipulate SQL queries by inserting malicious code into input fields to access, modify, or delete database data.',color:'#f59e0b'},
{id:'csrf',label:'CSRF',x:30,y:210,desc:'Cross-Site Request Forgery — forces authenticated actions.',detail:'CSRF tricks users into executing unwanted actions on web applications where they are authenticated, like changing passwords.',color:'#8b5cf6'},
{id:'ssrf',label:'SSRF',x:30,y:300,desc:'Server-Side Request Forgery.',detail:'SSRF forces a server to make requests to internal systems, bypassing firewalls and accessing sensitive internal services.',color:'#3b82f6'},
{id:'idor',label:'IDOR',x:30,y:390,desc:'Insecure Direct Object Reference.',detail:'IDOR occurs when an application exposes internal object references (IDs, keys) allowing unauthorized access to data.',color:'#ec4899'}
];
const CONNS=[[0,1],[1,2],[2,3],[3,4]];
const CHALLENGES=[
{q:'What is the impact of XSS?',o:['Server crash','Stolen cookies/session data','Database deletion','Network slowdown'],a:1},
{q:'How can SQL Injection be prevented?',o:['More CSS','Parameterized queries','Faster servers','Longer passwords'],a:1},
{q:'CSRF attacks rely on:',o:['Server vulnerabilities','User authentication status','Firewall misconfiguration','DNS settings'],a:1},
{q:'SSRF targets:',o:['Client browsers','Internal server resources','External APIs only','Database indexes'],a:1},
{q:'IDOR is caused by:',o:['Weak passwords','Insecure object references','Missing encryption','Old browsers'],a:1}
];
let selNode=null,explored=new Set(),animT=0,lastT=0,rafId=null,running=true,challengeSubmitted=false;
const app=document.getElementById('app'),skel=document.getElementById('skeleton'),errB=document.getElementById('error-boundary'),errM=document.getElementById('error-msg');
const svgC=document.getElementById('svg-container'),infoP=document.getElementById('info-panel'),infoT=document.getElementById('info-title'),infoD=document.getElementById('info-desc'),infoDet=document.getElementById('info-details'),infoClose=document.getElementById('info-close');
const speedS=document.getElementById('speed-slider'),speedV=document.getElementById('speed-value'),themeBtn=document.getElementById('theme-toggle');
const challC=document.getElementById('challenge-container'),challS=document.getElementById('challenge-submit'),challR=document.getElementById('challenge-result');
const compO=document.getElementById('completion-overlay'),compN=document.getElementById('completion-nodes'),compSc=document.getElementById('completion-score');
let speed=1,ns='http://www.w3.org/2000/svg';
function buildSVG(){
  const W=800,H=500,m=30;
  let svg=document.createElementNS(ns,'svg');svg.setAttribute('viewBox','0 0 '+W+' '+H);svg.setAttribute('role','img');
  let defs=document.createElementNS(ns,'defs');
  defs.innerHTML='<linearGradient id="bg04" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#0f1729"/><stop offset="100%" stop-color="#0a0e17"/></linearGradient><filter id="glow04"><feGaussianBlur stdDeviation="3"/><feMerge><feMergeNode/><feMergeNode in="SourceGraphic"/></feMerge></filter><marker id="arr04" markerWidth="8" markerHeight="8" refX="4" refY="4" orient="auto"><path d="M0,0 L8,4 L0,8 Z" fill="rgba(255,255,255,.3)"/></marker>';
  let rect=document.createElementNS(ns,'rect');rect.setAttribute('width',W);rect.setAttribute('height',H);rect.setAttribute('fill','url(#bg04)');
  svg.appendChild(rect);svg.appendChild(defs);
  let title=document.createElementNS(ns,'text');title.setAttribute('x',m);title.setAttribute('y',22);title.setAttribute('fill','rgba(255,255,255,.6)');title.setAttribute('font-size','11');title.setAttribute('font-weight','600');title.setAttribute('letter-spacing','2');title.textContent='WEB ATTACK SURFACE — OWASP TOP VULNERABILITIES';svg.appendChild(title);
  let webRect=document.createElementNS(ns,'rect');webRect.setAttribute('x',220);webRect.setAttribute('y',35);webRect.setAttribute('width',540);webRect.setAttribute('height',440);webRect.setAttribute('fill','rgba(59,130,246,.04)');webRect.setAttribute('rx','12');webRect.setAttribute('stroke','rgba(59,130,246,.1)');webRect.setAttribute('stroke-width','1');svg.appendChild(webRect);
  let webLbl=document.createElementNS(ns,'text');webLbl.setAttribute('x',490);webLbl.setAttribute('y',52);webLbl.setAttribute('text-anchor','middle');webLbl.setAttribute('fill','rgba(59,130,246,.3)');webLbl.setAttribute('font-size','9');webLbl.setAttribute('font-weight','600');webLbl.setAttribute('letter-spacing','1');webLbl.textContent='WEB APPLICATION';svg.appendChild(webLbl);
  let layers=['Browser / Client','Server / API','Database'];let ly=[70,180,310];let lh=[95,115,110];
  layers.forEach((l,i)=>{
    let r=document.createElementNS(ns,'rect');r.setAttribute('x',240);r.setAttribute('y',ly[i]);r.setAttribute('width',500);r.setAttribute('height',lh[i]);r.setAttribute('fill','rgba(255,255,255,.02)');r.setAttribute('rx','6');r.setAttribute('stroke','rgba(255,255,255,.05)');r.setAttribute('stroke-width','1');svg.appendChild(r);
    let lb=document.createElementNS(ns,'text');lb.setAttribute('x',250);lb.setAttribute('y',ly[i]+14);lb.setAttribute('fill','rgba(255,255,255,.2)');lb.setAttribute('font-size','9');lb.setAttribute('font-weight','600');lb.textContent=l;svg.appendChild(lb);
  });
  NODES.forEach((n,i)=>{
    let g=document.createElementNS(ns,'g');g.setAttribute('id','node-'+n.id);g.setAttribute('role','button');g.setAttribute('tabindex','0');g.setAttribute('aria-label',n.label);g.style.cursor='pointer';
    let r=document.createElementNS(ns,'rect');r.setAttribute('x',n.x);r.setAttribute('y',n.y);r.setAttribute('width',170);r.setAttribute('height',65);r.setAttribute('rx','10');r.setAttribute('fill',n.color+'20');r.setAttribute('stroke',n.color);r.setAttribute('stroke-width','2');r.setAttribute('filter','url(#glow04)');g.appendChild(r);
    let tag=document.createElementNS(ns,'rect');tag.setAttribute('x',n.x+8);tag.setAttribute('y',n.y-8);tag.setAttribute('width',50);tag.setAttribute('height',18);tag.setAttribute('rx','4');tag.setAttribute('fill',n.color+'30');tag.setAttribute('stroke',n.color);tag.setAttribute('stroke-width','1');g.appendChild(tag);
    let tlabels=['Critical','High','Medium','High','Medium'];let tagT=document.createElementNS(ns,'text');tagT.setAttribute('x',n.x+33);tagT.setAttribute('y',n.y+5);tagT.setAttribute('text-anchor','middle');tagT.setAttribute('fill','#e2e8f0');tagT.setAttribute('font-size','8');tagT.setAttribute('font-weight','600');tagT.textContent=tlabels[i];g.appendChild(tagT);
    let lbl=document.createElementNS(ns,'text');lbl.setAttribute('x',n.x+90);lbl.setAttribute('y',n.y+28);lbl.setAttribute('text-anchor','middle');lbl.setAttribute('fill','#e2e8f0');lbl.setAttribute('font-size','13');lbl.setAttribute('font-weight','600');lbl.textContent=n.label;g.appendChild(lbl);
    let dsc=document.createElementNS(ns,'text');dsc.setAttribute('x',n.x+90);dsc.setAttribute('y',n.y+48);dsc.setAttribute('text-anchor','middle');dsc.setAttribute('fill','#94a3b8');dsc.setAttribute('font-size','9');dsc.textContent=n.desc.length>36?n.desc.slice(0,36)+'...':n.desc;g.appendChild(dsc);
    let idx=i;
    g.addEventListener('click',function(){selectNode(idx);});g.addEventListener('keydown',function(e){if(e.key==='Enter'||e.key===' '){e.preventDefault();selectNode(idx);}});
    svg.appendChild(g);
    let fromLayer=[0,1,2,1,1][i];let lx=240,ly2=[70,180,310][fromLayer];
    let arr=document.createElementNS(ns,'path');arr.setAttribute('d','M'+(n.x+170)+','+(n.y+32)+' L'+(lx+10)+','+(ly2+20));arr.setAttribute('stroke','rgba(255,255,255,.08)');arr.setAttribute('stroke-width','1');arr.setAttribute('fill','none');arr.setAttribute('stroke-dasharray','3,3');svg.appendChild(arr);
  });
  svgC.appendChild(svg);
}
function selectNode(i){selNode=i;explored.add(i);const n=NODES[i];
  infoT.textContent=n.label+' ('+['Stored/Reflected/DOM','In-band/Blind/Out-of-band','Same-Origin/Cross-Origin','Internal/External','Direct/Indirect'][i]+')';infoD.textContent=n.desc;
  const details=[{k:'Impact',v:['Session hijacking','Data breach','Unauthorized actions','Internal recon','Data exposure'][i]},{k:'Prevention',v:['Output encoding, CSP','Prepared statements','CSRF tokens','Input validation','Access control checks'][i]},{k:'OWASP Rank',v:[3,1,8,10,4][i]}];
  infoDet.innerHTML=details.map(d=>'<p><strong>'+d.k+':</strong> '+d.v+'</p>').join('')+'<p><strong>Description:</strong> '+n.detail+'</p>';
  infoP.hidden=false;updateNodes();checkCompletion();
}
function updateNodes(){NODES.forEach((n,i)=>{let g=document.getElementById('node-'+n.id);if(!g)return;let r=g.querySelector('rect');if(i===selNode){r.setAttribute('stroke','#22c55e');r.setAttribute('stroke-width','3');}else if(explored.has(i)){r.setAttribute('stroke',n.color);r.setAttribute('stroke-width','2');r.setAttribute('opacity','0.8');}else{r.setAttribute('stroke',n.color);r.setAttribute('stroke-width','2');r.setAttribute('opacity','0.6');}});}
function buildChallenges(){challC.innerHTML='';CHALLENGES.forEach((q,i)=>{let div=document.createElement('div');div.className='challenge-q';let txt=document.createElement('p');txt.className='challenge-q-text';txt.textContent=(i+1)+'. '+q.q;div.appendChild(txt);let opts=document.createElement('div');opts.className='challenge-options';q.o.forEach((o,j)=>{let opt=document.createElement('div');opt.className='challenge-option';opt.dataset.qi=i;opt.dataset.oi=j;let inp=document.createElement('input');inp.type='radio';inp.name='cq'+i;inp.value=j;inp.id='cq'+i+'_'+j;let lbl=document.createElement('label');lbl.htmlFor='cq'+i+'_'+j;lbl.textContent=o;opt.appendChild(inp);opt.appendChild(lbl);opt.addEventListener('click',function(){if(!challengeSubmitted)inp.checked=true;});opts.appendChild(opt);});div.appendChild(opts);challC.appendChild(div);});}
function checkChallenges(){challengeSubmitted=true;let correct=0;CHALLENGES.forEach((q,i)=>{let sel=document.querySelector('input[name="cq'+i+'"]:checked');document.querySelectorAll('.challenge-option[data-qi="'+i+'"]').forEach((o,j)=>{o.classList.remove('correct','incorrect');if(j===q.a)o.classList.add('correct');if(sel&&parseInt(sel.value)===j&&j!==q.a)o.classList.add('incorrect');});if(sel&&parseInt(sel.value)===q.a)correct++;});let pct=Math.round(correct/CHALLENGES.length*100);challR.hidden=false;challR.className='challenge-result';if(pct===100)challR.classList.add('success');else if(pct>=60)challR.classList.add('partial');else challR.classList.add('fail');challR.textContent='Score: '+correct+'/'+CHALLENGES.length+' ('+pct+'%)';challS.disabled=true;checkCompletion();}
function checkCompletion(){if(explored.size>=NODES.length&&challengeSubmitted){compN.textContent=explored.size;compSc.textContent=Math.round(document.querySelectorAll('.challenge-option.correct').length/CHALLENGES.length*100||0);compO.hidden=false;}}
function animLoop(t){rafId=requestAnimationFrame(animLoop);if(!running)return;if(!lastT)lastT=t;let dt=(t-lastT)/1000*speed;lastT=t;animT+=dt;let dots=svgC.querySelectorAll('.anim04');dots.forEach(d=>d.remove());CONNS.forEach(([f,t2],ci)=>{let cycle=(animT*0.3+ci*0.25)%1;let x1=NODES[f].x+170,y1=NODES[f].y+32,x2=NODES[t2].x,y2=NODES[t2].y+32;let x=x1+(x2-x1)*cycle,y=y1+(y2-y1)*cycle;let dot=document.createElementNS(ns,'circle');dot.setAttribute('cx',x);dot.setAttribute('cy',y);dot.setAttribute('r','3');dot.setAttribute('class','anim04');dot.setAttribute('fill','#ef4444');dot.setAttribute('opacity','0.7');svgC.querySelector('svg').appendChild(dot);});}
document.addEventListener('DOMContentLoaded',function(){try{buildSVG();buildChallenges();skel.hidden=true;app.hidden=false;themeBtn.textContent=theme==='light'?'🌙':'☀️';themeBtn.addEventListener('click',function(){theme=theme==='dark'?'light':'dark';document.documentElement.setAttribute('data-theme',theme);localStorage.setItem(STORE,theme);themeBtn.textContent=theme==='light'?'🌙':'☀️';});speedS.addEventListener('input',function(){speed=parseFloat(this.value);speedV.textContent=this.value+'×';});infoClose.addEventListener('click',function(){infoP.hidden=true;selNode=null;updateNodes();});challS.addEventListener('click',checkChallenges);lastT=0;rafId=requestAnimationFrame(animLoop);}catch(e){skel.hidden=true;errB.hidden=false;errM.textContent=e.message||'Failed to load diagram.';}});
window.addEventListener('beforeunload',function(){if(rafId)cancelAnimationFrame(rafId);});
})();
