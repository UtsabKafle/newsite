(function(){'use strict';
const STORE='consica-theme';
function initTheme(){const t=localStorage.getItem(STORE)||(window.matchMedia('(prefers-color-scheme:light)').matches?'light':'dark');document.documentElement.setAttribute('data-theme',t);return t}
let theme=initTheme();
const NODES=[
{id:'phishing',label:'Phishing',x:30,y:25,desc:'Fraudulent emails/messages tricking users.',detail:'Phishing uses deceptive emails appearing from trusted sources to steal credentials or install malware via malicious links or attachments.',color:'#ef4444'},
{id:'pretexting',label:'Pretexting',x:30,y:115,desc:'Fabricated scenarios to extract information.',detail:'Attackers create a false identity or scenario (e.g., IT support call) to manipulate victims into revealing sensitive information.',color:'#f59e0b'},
{id:'baiting',label:'Baiting',x:30,y:205,desc:'Offering something enticing to deliver malware.',detail:'Baiting uses physical media (USB drives labeled "Confidential") or digital offers (free downloads) laced with malware.',color:'#8b5cf6'},
{id:'tailgating',label:'Tailgating',x:30,y:295,desc:'Unauthorized physical access by following authorized personnel.',detail:'Tailgating involves an attacker following an employee into a restricted area without proper authentication, exploiting trust.',color:'#3b82f6'},
{id:'quidproquo',label:'Quid Pro Quo',x:30,y:385,desc:'Exchanging service/info for sensitive data.',detail:'Attackers promise a benefit (tech support, gift card) in exchange for credentials or access. "I\'ll help you if you give me your password."',color:'#ec4899'}
];
const CONNS=[[0,1],[1,2],[2,3],[3,4]];
const CHALLENGES=[
{q:'What is the primary target of social engineering?',o:['Firewalls','Human psychology','Encryption keys','Network ports'],a:1},
{q:'Phishing attacks most commonly use:',o:['Physical USB drives','Deceptive emails','Phone calls only','Social media'],a:1},
{q:'Pretexting involves:',o:['Creating a fake scenario','Following someone','Using bait USB','Sending spam'],a:0},
{q:'Tailgating exploits:',o:['Network vulnerability','Physical trust/access','Email filters','Password strength'],a:1},
{q:'What makes social engineering effective?',o:['Technical complexity','Human trust and urgency','Advanced encryption','Fast networks'],a:1}
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
  defs.innerHTML='<linearGradient id="bg07" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#0f1729"/><stop offset="100%" stop-color="#0a0e17"/></linearGradient><filter id="glow07"><feGaussianBlur stdDeviation="3"/><feMerge><feMergeNode/><feMergeNode in="SourceGraphic"/></feMerge></filter><marker id="arr07" markerWidth="8" markerHeight="8" refX="4" refY="4" orient="auto"><path d="M0,0 L8,4 L0,8 Z" fill="rgba(255,255,255,.3)"/></marker>';
  let rect=document.createElementNS(ns,'rect');rect.setAttribute('width',W);rect.setAttribute('height',H);rect.setAttribute('fill','url(#bg07)');svg.appendChild(rect);svg.appendChild(defs);
  let title=document.createElementNS(ns,'text');title.setAttribute('x',m);title.setAttribute('y',22);title.setAttribute('fill','rgba(255,255,255,.6)');title.setAttribute('font-size','11');title.setAttribute('font-weight','600');title.setAttribute('letter-spacing','2');title.textContent='SOCIAL ENGINEERING ATTACK VECTORS — HUMAN HACKING';svg.appendChild(title);
  let emailRect=document.createElementNS(ns,'rect');emailRect.setAttribute('x',220);emailRect.setAttribute('y',35);emailRect.setAttribute('width',545);emailRect.setAttribute('height',440);emailRect.setAttribute('fill','rgba(255,255,255,.02)');emailRect.setAttribute('rx','12');emailRect.setAttribute('stroke','rgba(255,255,255,.05)');emailRect.setAttribute('stroke-width','1');svg.appendChild(emailRect);
  let emLbl=document.createElementNS(ns,'text');emLbl.setAttribute('x',492);emLbl.setAttribute('y',52);emLbl.setAttribute('text-anchor','middle');emLbl.setAttribute('fill','rgba(255,255,255,.2)');emLbl.setAttribute('font-size','9');emLbl.setAttribute('font-weight','600');emLbl.textContent='PHISHING EMAIL ANATOMY — RED FLAGS';svg.appendChild(emLbl);
  let flags=[{x:240,y:70,w:160,h:60,t:'🚩 Urgency','d':'\"Act immediately!\"'},{x:420,y:70,w:160,h:60,t:'🚩 Spoofed Sender','d':'fake@company.com'},{x:240,y:150,w:160,h:60,t:'🚩 Suspicious Link','d':'bit.ly/2x...'},{x:420,y:150,w:160,h:60,t:'🚩 Generic Greeting','d':'Dear Customer'},{x:240,y:230,w:160,h:60,t:'🚩 Request for Info','d':'Confirm password'},{x:420,y:230,w:160,h:60,t:'🚩 Poor Grammar','d:'};
  flags.forEach(f=>{
    let r=document.createElementNS(ns,'rect');r.setAttribute('x',f.x);r.setAttribute('y',f.y);r.setAttribute('width',f.w);r.setAttribute('height',f.h);r.setAttribute('rx','6');r.setAttribute('fill','rgba(239,68,68,.08)');r.setAttribute('stroke','rgba(239,68,68,.2)');r.setAttribute('stroke-width','1');svg.appendChild(r);
    let t=document.createElementNS(ns,'text');t.setAttribute('x',f.x+80);t.setAttribute('y',f.y+24);t.setAttribute('text-anchor','middle');t.setAttribute('fill','#ef4444');t.setAttribute('font-size','10');t.setAttribute('font-weight','600');t.textContent=f.t;svg.appendChild(t);
    let d=document.createElementNS(ns,'text');d.setAttribute('x',f.x+80);d.setAttribute('y',f.y+44);d.setAttribute('text-anchor','middle');d.setAttribute('fill','#94a3b8');d.setAttribute('font-size','9');d.textContent=f.d;svg.appendChild(d);
  });
  NODES.forEach((n,i)=>{
    let g=document.createElementNS(ns,'g');g.setAttribute('id','node-'+n.id);g.setAttribute('role','button');g.setAttribute('tabindex','0');g.setAttribute('aria-label',n.label);g.style.cursor='pointer';
    let r=document.createElementNS(ns,'rect');r.setAttribute('x',n.x);r.setAttribute('y',n.y);r.setAttribute('width',170);r.setAttribute('height',65);r.setAttribute('rx','10');r.setAttribute('fill',n.color+'20');r.setAttribute('stroke',n.color);r.setAttribute('stroke-width','2');r.setAttribute('filter','url(#glow07)');g.appendChild(r);
    let icons=['📧','🎭','🎣','🚶','🤝'];let it=document.createElementNS(ns,'text');it.setAttribute('x',n.x+22);it.setAttribute('y',n.y+42);it.setAttribute('text-anchor','middle');it.setAttribute('font-size','18');it.textContent=icons[i];g.appendChild(it);
    let lbl=document.createElementNS(ns,'text');lbl.setAttribute('x',n.x+95);lbl.setAttribute('y',n.y+28);lbl.setAttribute('text-anchor','middle');lbl.setAttribute('fill','#e2e8f0');lbl.setAttribute('font-size','13');lbl.setAttribute('font-weight','600');lbl.textContent=n.label;g.appendChild(lbl);
    let dsc=document.createElementNS(ns,'text');dsc.setAttribute('x',n.x+95);dsc.setAttribute('y',n.y+48);dsc.setAttribute('text-anchor','middle');dsc.setAttribute('fill','#94a3b8');dsc.setAttribute('font-size','9');dsc.textContent=n.desc.length>36?n.desc.slice(0,36)+'...':n.desc;g.appendChild(dsc);
    let idx=i;g.addEventListener('click',function(){selectNode(idx);});g.addEventListener('keydown',function(e){if(e.key==='Enter'||e.key===' '){e.preventDefault();selectNode(idx);}});
    svg.appendChild(g);
  });
  CONNS.forEach(([f,t])=>{
    let x1=NODES[f].x+170,y1=NODES[f].y+32,x2=NODES[t].x,y2=NODES[t].y+32;
    let arr=document.createElementNS(ns,'path');arr.setAttribute('d','M'+(x1+5)+','+y1+' L'+(x2-5)+','+y2);arr.setAttribute('stroke','rgba(255,255,255,.1)');arr.setAttribute('stroke-width','2');arr.setAttribute('fill','none');arr.setAttribute('marker-end','url(#arr07)');svg.appendChild(arr);
  });
  // Prevention tip
  let tipBg=document.createElementNS(ns,'rect');tipBg.setAttribute('x',240);tipBg.setAttribute('y',310);tipBg.setAttribute('width',500);tipBg.setAttribute('height',110);tipBg.setAttribute('fill','rgba(34,197,94,.04)');tipBg.setAttribute('rx','8');tipBg.setAttribute('stroke','rgba(34,197,94,.1)');tipBg.setAttribute('stroke-width','1');svg.appendChild(tipBg);
  let tipTitle=document.createElementNS(ns,'text');tipTitle.setAttribute('x',490);tipTitle.setAttribute('y',332);tipTitle.setAttribute('text-anchor','middle');tipTitle.setAttribute('fill','#22c55e');tipTitle.setAttribute('font-size','11');tipTitle.setAttribute('font-weight','700');tipTitle.textContent='🛡 HOW TO PROTECT YOURSELF';svg.appendChild(tipTitle);
  ['✓ Verify sender addresses','✓ Hover over links before clicking','✓ Never share passwords or OTPs','✓ Use multi-factor authentication','✓ Report suspicious messages'].forEach((tip,j)=>{
    let t=document.createElementNS(ns,'text');t.setAttribute('x',260);t.setAttribute('y',352+j*18);t.setAttribute('fill','rgba(255,255,255,.5)');t.setAttribute('font-size','9');t.textContent=tip;svg.appendChild(t);
  });
  svgC.appendChild(svg);
}
function selectNode(i){selNode=i;explored.add(i);const n=NODES[i];
  infoT.textContent=n.label;infoD.textContent=n.desc;
  const details=[{k:'Method',v:['Email impersonation','Scenario fabrication','Physical/digital lure','Physical following','Service exchange'][i]},{k:'Exploits',v:['Urgency/fear','Trust/authority','Curiosity/greed','Politeness','Reciprocity'][i]},{k:'Prevention',v:['Email filtering','Verify identity','Don\'t use unknown media','Challenge intruders','Never trade credentials'][i]}];
  infoDet.innerHTML=details.map(d=>'<p><strong>'+d.k+':</strong> '+d.v+'</p>').join('')+'<p><strong>Description:</strong> '+n.detail+'</p>';
  infoP.hidden=false;updateNodes();checkCompletion();
}
function updateNodes(){NODES.forEach((n,i)=>{let g=document.getElementById('node-'+n.id);if(!g)return;let r=g.querySelector('rect');if(i===selNode){r.setAttribute('stroke','#22c55e');r.setAttribute('stroke-width','3');}else if(explored.has(i)){r.setAttribute('stroke',n.color);r.setAttribute('stroke-width','2');r.setAttribute('opacity','0.8');}else{r.setAttribute('stroke',n.color);r.setAttribute('stroke-width','2');r.setAttribute('opacity','0.6');}});}
function buildChallenges(){challC.innerHTML='';CHALLENGES.forEach((q,i)=>{let div=document.createElement('div');div.className='challenge-q';let txt=document.createElement('p');txt.className='challenge-q-text';txt.textContent=(i+1)+'. '+q.q;div.appendChild(txt);let opts=document.createElement('div');opts.className='challenge-options';q.o.forEach((o,j)=>{let opt=document.createElement('div');opt.className='challenge-option';opt.dataset.qi=i;opt.dataset.oi=j;let inp=document.createElement('input');inp.type='radio';inp.name='cq'+i;inp.value=j;inp.id='cq'+i+'_'+j;let lbl=document.createElement('label');lbl.htmlFor='cq'+i+'_'+j;lbl.textContent=o;opt.appendChild(inp);opt.appendChild(lbl);opt.addEventListener('click',function(){if(!challengeSubmitted)inp.checked=true;});opts.appendChild(opt);});div.appendChild(opts);challC.appendChild(div);});}
function checkChallenges(){challengeSubmitted=true;let correct=0;CHALLENGES.forEach((q,i)=>{let sel=document.querySelector('input[name="cq'+i+'"]:checked');document.querySelectorAll('.challenge-option[data-qi="'+i+'"]').forEach((o,j)=>{o.classList.remove('correct','incorrect');if(j===q.a)o.classList.add('correct');if(sel&&parseInt(sel.value)===j&&j!==q.a)o.classList.add('incorrect');});if(sel&&parseInt(sel.value)===q.a)correct++;});let pct=Math.round(correct/CHALLENGES.length*100);challR.hidden=false;challR.className='challenge-result';if(pct===100)challR.classList.add('success');else if(pct>=60)challR.classList.add('partial');else challR.classList.add('fail');challR.textContent='Score: '+correct+'/'+CHALLENGES.length+' ('+pct+'%)';challS.disabled=true;checkCompletion();}
function checkCompletion(){if(explored.size>=NODES.length&&challengeSubmitted){compN.textContent=explored.size;compSc.textContent=Math.round(document.querySelectorAll('.challenge-option.correct').length/CHALLENGES.length*100||0);compO.hidden=false;}}
function animLoop(t){rafId=requestAnimationFrame(animLoop);if(!running)return;if(!lastT)lastT=t;let dt=(t-lastT)/1000*speed;lastT=t;animT+=dt;let dots=svgC.querySelectorAll('.anim07');dots.forEach(d=>d.remove());CONNS.forEach(([f,t2],ci)=>{let cycle=(animT*0.3+ci*0.25)%1;let x1=NODES[f].x+170,y1=NODES[f].y+32,x2=NODES[t2].x,y2=NODES[t2].y+32;let x=x1+(x2-x1)*cycle,y=y1+(y2-y1)*cycle;let dot=document.createElementNS(ns,'circle');dot.setAttribute('cx',x);dot.setAttribute('cy',y);dot.setAttribute('r','3');dot.setAttribute('class','anim07');dot.setAttribute('fill','#ef4444');dot.setAttribute('opacity','0.7');svgC.querySelector('svg').appendChild(dot);});}
document.addEventListener('DOMContentLoaded',function(){try{buildSVG();buildChallenges();skel.hidden=true;app.hidden=false;themeBtn.textContent=theme==='light'?'🌙':'☀️';themeBtn.addEventListener('click',function(){theme=theme==='dark'?'light':'dark';document.documentElement.setAttribute('data-theme',theme);localStorage.setItem(STORE,theme);themeBtn.textContent=theme==='light'?'🌙':'☀️';});speedS.addEventListener('input',function(){speed=parseFloat(this.value);speedV.textContent=this.value+'×';});infoClose.addEventListener('click',function(){infoP.hidden=true;selNode=null;updateNodes();});challS.addEventListener('click',checkChallenges);lastT=0;rafId=requestAnimationFrame(animLoop);}catch(e){skel.hidden=true;errB.hidden=false;errM.textContent=e.message||'Failed to load diagram.';}});
window.addEventListener('beforeunload',function(){if(rafId)cancelAnimationFrame(rafId);});
})();
