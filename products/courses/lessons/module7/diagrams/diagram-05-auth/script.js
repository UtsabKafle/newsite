(function(){'use strict';
const STORE='consica-theme';
function initTheme(){const t=localStorage.getItem(STORE)||(window.matchMedia('(prefers-color-scheme:light)').matches?'light':'dark');document.documentElement.setAttribute('data-theme',t);return t}
let theme=initTheme();
const NODES=[
{id:'register',label:'Registration',x:30,y:25,desc:'User creates an account with credentials.',detail:'Users provide identity info (email, password, name). Passwords are hashed and stored. Account verification via email may follow.',color:'#22c55e'},
{id:'login',label:'Login',x:30,y:115,desc:'User authenticates with stored credentials.',detail:'The login step verifies identity by comparing provided credentials (password hash) against stored values. Session begins.',color:'#3b82f6'},
{id:'mfa',label:'MFA',x:30,y:205,desc:'Multi-Factor Authentication adds extra verification.',detail:'MFA requires additional proof: TOTP codes, SMS, biometrics, or hardware keys. Drastically reduces account compromise risk.',color:'#f59e0b'},
{id:'token',label:'Token',x:30,y:295,desc:'Signed token issued for session management.',detail:'JWT or session token is issued after successful auth. The token contains claims (user ID, role, expiry) and is cryptographically signed.',color:'#8b5cf6'},
{id:'access',label:'Access Control',x:30,y:385,desc:'Authorization checks what resources user can access.',detail:'Authorization uses RBAC or ABAC to determine permissions. The token claims are evaluated against resource access policies.',color:'#ec4899'}
];
const CONNS=[[0,1],[1,2],[2,3],[3,4]];
const CHALLENGES=[
{q:'What is the purpose of MFA?',o:['Faster login','Extra verification layer','Password recovery','Account deletion'],a:1},
{q:'A JWT token contains:',o:['User photo','Claims and signature','Browser history','IP address only'],a:1},
{q:'RBAC stands for:',o:['Role-Based Access Control','Random Byte Access Code','Redundant Backup Auth Check','Request-Based Auth Config'],a:0},
{q:'What does hashing a password do?',o:['Encrypts for decryption','One-way transformation','Compresses the password','Sends to server'],a:1},
{q:'Authorization determines:',o:['Who the user is','What resources user can use','How fast the login is','Where the user is located'],a:1}
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
  defs.innerHTML='<linearGradient id="bg05" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#0f1729"/><stop offset="100%" stop-color="#0a0e17"/></linearGradient><filter id="glow05"><feGaussianBlur stdDeviation="3"/><feMerge><feMergeNode/><feMergeNode in="SourceGraphic"/></feMerge></filter><marker id="arr05" markerWidth="8" markerHeight="8" refX="4" refY="4" orient="auto"><path d="M0,0 L8,4 L0,8 Z" fill="rgba(255,255,255,.3)"/></marker>';
  let rect=document.createElementNS(ns,'rect');rect.setAttribute('width',W);rect.setAttribute('height',H);rect.setAttribute('fill','url(#bg05)');svg.appendChild(rect);svg.appendChild(defs);
  let title=document.createElementNS(ns,'text');title.setAttribute('x',m);title.setAttribute('y',22);title.setAttribute('fill','rgba(255,255,255,.6)');title.setAttribute('font-size','11');title.setAttribute('font-weight','600');title.setAttribute('letter-spacing','2');title.textContent='AUTHENTICATION & AUTHORIZATION FLOW';svg.appendChild(title);
  let track=document.createElementNS(ns,'rect');track.setAttribute('x',220);track.setAttribute('y',35);track.setAttribute('width',540);track.setAttribute('height',440);track.setAttribute('fill','rgba(255,255,255,.02)');track.setAttribute('rx','12');svg.appendChild(track);
  let trackLbl=document.createElementNS(ns,'text');trackLbl.setAttribute('x',490);trackLbl.setAttribute('y',52);trackLbl.setAttribute('text-anchor','middle');trackLbl.setAttribute('fill','rgba(255,255,255,.2)');trackLbl.setAttribute('font-size','9');trackLbl.setAttribute('font-weight','600');trackLbl.textContent='IDENTITY & ACCESS MANAGEMENT PIPELINE';svg.appendChild(trackLbl);
  NODES.forEach((n,i)=>{
    let g=document.createElementNS(ns,'g');g.setAttribute('id','node-'+n.id);g.setAttribute('role','button');g.setAttribute('tabindex','0');g.setAttribute('aria-label',n.label);g.style.cursor='pointer';
    let r=document.createElementNS(ns,'rect');r.setAttribute('x',n.x);r.setAttribute('y',n.y);r.setAttribute('width',170);r.setAttribute('height',65);r.setAttribute('rx','10');r.setAttribute('fill',n.color+'20');r.setAttribute('stroke',n.color);r.setAttribute('stroke-width','2');r.setAttribute('filter','url(#glow05)');g.appendChild(r);
    let step=document.createElementNS(ns,'circle');step.setAttribute('cx',n.x+20);step.setAttribute('cy',n.y+20);step.setAttribute('r','13');step.setAttribute('fill',n.color+'40');step.setAttribute('stroke',n.color);step.setAttribute('stroke-width','1.5');g.appendChild(step);
    let num=document.createElementNS(ns,'text');num.setAttribute('x',n.x+20);num.setAttribute('y',n.y+25);num.setAttribute('text-anchor','middle');num.setAttribute('fill','#e2e8f0');num.setAttribute('font-size','11');num.setAttribute('font-weight','700');num.textContent=i+1;g.appendChild(num);
    let lbl=document.createElementNS(ns,'text');lbl.setAttribute('x',n.x+90);lbl.setAttribute('y',n.y+28);lbl.setAttribute('text-anchor','middle');lbl.setAttribute('fill','#e2e8f0');lbl.setAttribute('font-size','13');lbl.setAttribute('font-weight','600');lbl.textContent=n.label;g.appendChild(lbl);
    let dsc=document.createElementNS(ns,'text');dsc.setAttribute('x',n.x+90);dsc.setAttribute('y',n.y+48);dsc.setAttribute('text-anchor','middle');dsc.setAttribute('fill','#94a3b8');dsc.setAttribute('font-size','9');dsc.textContent=n.desc.length>36?n.desc.slice(0,36)+'...':n.desc;g.appendChild(dsc);
    let idx=i;g.addEventListener('click',function(){selectNode(idx);});g.addEventListener('keydown',function(e){if(e.key==='Enter'||e.key===' '){e.preventDefault();selectNode(idx);}});
    svg.appendChild(g);
  });
  CONNS.forEach(([f,t])=>{
    let x1=NODES[f].x+170,y1=NODES[f].y+32,x2=NODES[t].x,y2=NODES[t].y+32;
    let arr=document.createElementNS(ns,'path');arr.setAttribute('d','M'+(x1+5)+','+y1+' L'+(x2-5)+','+y2);arr.setAttribute('stroke','rgba(255,255,255,.12)');arr.setAttribute('stroke-width','2');arr.setAttribute('fill','none');arr.setAttribute('marker-end','url(#arr05)');
    if(f===0){let gate=document.createElementNS(ns,'rect');gate.setAttribute('x',225);gate.setAttribute('y',y1-18);gate.setAttribute('width',180);gate.setAttribute('height',36);gate.setAttribute('rx','6');gate.setAttribute('fill','rgba(34,197,94,.1)');gate.setAttribute('stroke','rgba(34,197,94,.3)');gate.setAttribute('stroke-width','1');svg.appendChild(gate);let gt=document.createElementNS(ns,'text');gt.setAttribute('x',315);gt.setAttribute('y',y1+5);gt.setAttribute('text-anchor','middle');gt.setAttribute('fill','rgba(34,197,94,.6)');gt.setAttribute('font-size','10');gt.setAttribute('font-weight','600');gt.textContent='CREDENTIAL VALIDATION';svg.appendChild(gt);}
    if(f===2){let gate2=document.createElementNS(ns,'rect');gate2.setAttribute('x',225);gate2.setAttribute('y',y1-18);gate2.setAttribute('width',180);gate2.setAttribute('height',36);gate2.setAttribute('rx','6');gate2.setAttribute('fill','rgba(245,158,11,.1)');gate2.setAttribute('stroke','rgba(245,158,11,.3)');gate2.setAttribute('stroke-width','1');svg.appendChild(gate2);let gt2=document.createElementNS(ns,'text');gt2.setAttribute('x',315);gt2.setAttribute('y',y1+5);gt2.setAttribute('text-anchor','middle');gt2.setAttribute('fill','rgba(245,158,11,.6)');gt2.setAttribute('font-size','10');gt2.setAttribute('font-weight','600');gt2.textContent='MFA CHALLENGE';svg.appendChild(gt2);}
    svg.appendChild(arr);
  });
  svgC.appendChild(svg);
}
function selectNode(i){selNode=i;explored.add(i);const n=NODES[i];
  infoT.textContent=n.label;infoD.textContent=n.desc;
  const d=[{k:'Protocol',v:['User creation form','Password hash compare','TOTP / FIDO2 / SMS','JWT / OAuth 2.0','RBAC / ABAC'][i]},{k:'Security',v:['Input validation','Rate limiting','Brute-force protection','Signature verification','Policy enforcement'][i]},{k:'User Data',v:['Hashed password','Session cookie','TOTP seed','Claims (role, ID)','Permissions'][i]}];
  infoDet.innerHTML=d.map(x=>'<p><strong>'+x.k+':</strong> '+x.v+'</p>').join('')+'<p><strong>Description:</strong> '+n.detail+'</p>';
  infoP.hidden=false;updateNodes();checkCompletion();
}
function updateNodes(){NODES.forEach((n,i)=>{let g=document.getElementById('node-'+n.id);if(!g)return;let r=g.querySelector('rect');if(i===selNode){r.setAttribute('stroke','#22c55e');r.setAttribute('stroke-width','3');}else if(explored.has(i)){r.setAttribute('stroke',n.color);r.setAttribute('stroke-width','2');r.setAttribute('opacity','0.8');}else{r.setAttribute('stroke',n.color);r.setAttribute('stroke-width','2');r.setAttribute('opacity','0.6');}});}
function buildChallenges(){challC.innerHTML='';CHALLENGES.forEach((q,i)=>{let div=document.createElement('div');div.className='challenge-q';let txt=document.createElement('p');txt.className='challenge-q-text';txt.textContent=(i+1)+'. '+q.q;div.appendChild(txt);let opts=document.createElement('div');opts.className='challenge-options';q.o.forEach((o,j)=>{let opt=document.createElement('div');opt.className='challenge-option';opt.dataset.qi=i;opt.dataset.oi=j;let inp=document.createElement('input');inp.type='radio';inp.name='cq'+i;inp.value=j;inp.id='cq'+i+'_'+j;let lbl=document.createElement('label');lbl.htmlFor='cq'+i+'_'+j;lbl.textContent=o;opt.appendChild(inp);opt.appendChild(lbl);opt.addEventListener('click',function(){if(!challengeSubmitted)inp.checked=true;});opts.appendChild(opt);});div.appendChild(opts);challC.appendChild(div);});}
function checkChallenges(){challengeSubmitted=true;let correct=0;CHALLENGES.forEach((q,i)=>{let sel=document.querySelector('input[name="cq'+i+'"]:checked');document.querySelectorAll('.challenge-option[data-qi="'+i+'"]').forEach((o,j)=>{o.classList.remove('correct','incorrect');if(j===q.a)o.classList.add('correct');if(sel&&parseInt(sel.value)===j&&j!==q.a)o.classList.add('incorrect');});if(sel&&parseInt(sel.value)===q.a)correct++;});let pct=Math.round(correct/CHALLENGES.length*100);challR.hidden=false;challR.className='challenge-result';if(pct===100)challR.classList.add('success');else if(pct>=60)challR.classList.add('partial');else challR.classList.add('fail');challR.textContent='Score: '+correct+'/'+CHALLENGES.length+' ('+pct+'%)';challS.disabled=true;checkCompletion();}
function checkCompletion(){if(explored.size>=NODES.length&&challengeSubmitted){compN.textContent=explored.size;compSc.textContent=Math.round(document.querySelectorAll('.challenge-option.correct').length/CHALLENGES.length*100||0);compO.hidden=false;}}
function animLoop(t){rafId=requestAnimationFrame(animLoop);if(!running)return;if(!lastT)lastT=t;let dt=(t-lastT)/1000*speed;lastT=t;animT+=dt;let dots=svgC.querySelectorAll('.anim05');dots.forEach(d=>d.remove());CONNS.forEach(([f,t2],ci)=>{let cycle=(animT*0.4+ci*0.25)%1;let x1=NODES[f].x+170,y1=NODES[f].y+32,x2=NODES[t2].x,y2=NODES[t2].y+32;let x=x1+(x2-x1)*cycle,y=y1+(y2-y1)*cycle;let dot=document.createElementNS(ns,'circle');dot.setAttribute('cx',x);dot.setAttribute('cy',y);dot.setAttribute('r','3');dot.setAttribute('class','anim05');dot.setAttribute('fill','#22c55e');dot.setAttribute('opacity','0.8');svgC.querySelector('svg').appendChild(dot);});}
document.addEventListener('DOMContentLoaded',function(){try{buildSVG();buildChallenges();skel.hidden=true;app.hidden=false;themeBtn.textContent=theme==='light'?'🌙':'☀️';themeBtn.addEventListener('click',function(){theme=theme==='dark'?'light':'dark';document.documentElement.setAttribute('data-theme',theme);localStorage.setItem(STORE,theme);themeBtn.textContent=theme==='light'?'🌙':'☀️';});speedS.addEventListener('input',function(){speed=parseFloat(this.value);speedV.textContent=this.value+'×';});infoClose.addEventListener('click',function(){infoP.hidden=true;selNode=null;updateNodes();});challS.addEventListener('click',checkChallenges);lastT=0;rafId=requestAnimationFrame(animLoop);}catch(e){skel.hidden=true;errB.hidden=false;errM.textContent=e.message||'Failed to load diagram.';}});
window.addEventListener('beforeunload',function(){if(rafId)cancelAnimationFrame(rafId);});
})();
