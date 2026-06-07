(function(){'use strict';
const STORE='consica-theme';
function initTheme(){const t=localStorage.getItem(STORE)||(window.matchMedia('(prefers-color-scheme:light)').matches?'light':'dark');document.documentElement.setAttribute('data-theme',t);return t}
let theme=initTheme();
const NODES=[
{id:'weak',label:'Weak Passwords',x:20,y:25,desc:'Short, simple, easily guessable passwords.',detail:'Examples: "password123", "qwerty", "admin". Weak passwords can be cracked in seconds using dictionary attacks or brute force.',color:'#ef4444'},
{id:'entropy',label:'Password Entropy',x:20,y:115,desc:'Measure of password unpredictability.',detail:'Entropy in bits = log2(character set size ^ length). Higher entropy means more resistance to brute-force attacks.',color:'#f59e0b'},
{id:'hashing',label:'Password Hashing',x:20,y:205,desc:'One-way transformation for secure storage.',detail:'Passwords are hashed (not encrypted) using algorithms like bcrypt, argon2, or PBKDF2. Hashing is irreversible.',color:'#8b5cf6'},
{id:'manager',label:'Password Manager',x:20,y:295,desc:'Generates and stores complex passwords.',detail:'Password managers create and store strong unique passwords for every account, protected by a single master password.',color:'#3b82f6'},
{id:'mfa',label:'MFA + Passwords',x:20,y:385,desc:'Multi-factor authentication layers security.',detail:'Combining passwords with MFA (TOTP, SMS, biometrics) dramatically reduces compromise risk even if password is stolen.',color:'#22c55e'}
];
const CHALLENGES=[
{q:'What makes a password strong?',o:['Short and memorable','Length + complexity + uniqueness','Only numbers','Repeating characters'],a:1},
{q:'Password entropy measures:',o:['How fast it can be typed','Unpredictability and complexity','Storage size','Number of characters'],a:1},
{q:'Which is a secure hashing algorithm?',o:['MD5','SHA-1','bcrypt','Base64'],a:2},
{q:'A password manager:',o:['Stores passwords in plain text','Generates and encrypts passwords','Shares passwords publicly','Only works on one site'],a:1},
{q:'MFA adds security by:',o:['Making passwords longer','Requiring additional verification','Speeding up login','Removing passwords'],a:1}
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
  defs.innerHTML='<linearGradient id="bg08" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#0f1729"/><stop offset="100%" stop-color="#0a0e17"/></linearGradient><filter id="glow08"><feGaussianBlur stdDeviation="3"/><feMerge><feMergeNode/><feMergeNode in="SourceGraphic"/></feMerge></filter>';
  let rect=document.createElementNS(ns,'rect');rect.setAttribute('width',W);rect.setAttribute('height',H);rect.setAttribute('fill','url(#bg08)');svg.appendChild(rect);svg.appendChild(defs);
  let title=document.createElementNS(ns,'text');title.setAttribute('x',m);title.setAttribute('y',22);title.setAttribute('fill','rgba(255,255,255,.6)');title.setAttribute('font-size','11');title.setAttribute('font-weight','600');title.setAttribute('letter-spacing','2');title.textContent='PASSWORD SECURITY METRICS';svg.appendChild(title);
  let meterArea=document.createElementNS(ns,'rect');meterArea.setAttribute('x',205);meterArea.setAttribute('y',35);meterArea.setAttribute('width',560);meterArea.setAttribute('height',440);meterArea.setAttribute('fill','rgba(255,255,255,.02)');meterArea.setAttribute('rx','12');svg.appendChild(meterArea);
  let meterLabels=['Very Weak','Weak','Fair','Strong','Very Strong'];let mcolors=['#ef4444','#f59e0b','#eab308','#22c55e','#0959c8'];
  NODES.forEach((n,i)=>{
    let g=document.createElementNS(ns,'g');g.setAttribute('id','node-'+n.id);g.setAttribute('role','button');g.setAttribute('tabindex','0');g.setAttribute('aria-label',n.label);g.style.cursor='pointer';
    let r=document.createElementNS(ns,'rect');r.setAttribute('x',n.x);r.setAttribute('y',n.y);r.setAttribute('width',170);r.setAttribute('height',65);r.setAttribute('rx','10');r.setAttribute('fill',n.color+'20');r.setAttribute('stroke',n.color);r.setAttribute('stroke-width','2');r.setAttribute('filter','url(#glow08)');g.appendChild(r);
    let icons=['🔓','📊','🔐','🗄','🛡'];let it=document.createElementNS(ns,'text');it.setAttribute('x',n.x+22);it.setAttribute('y',n.y+42);it.setAttribute('text-anchor','middle');it.setAttribute('font-size','18');it.textContent=icons[i];g.appendChild(it);
    let lbl=document.createElementNS(ns,'text');lbl.setAttribute('x',n.x+95);lbl.setAttribute('y',n.y+28);lbl.setAttribute('text-anchor','middle');lbl.setAttribute('fill','#e2e8f0');lbl.setAttribute('font-size','13');lbl.setAttribute('font-weight','600');lbl.textContent=n.label;g.appendChild(lbl);
    let dsc=document.createElementNS(ns,'text');dsc.setAttribute('x',n.x+95);dsc.setAttribute('y',n.y+48);dsc.setAttribute('text-anchor','middle');dsc.setAttribute('fill','#94a3b8');dsc.setAttribute('font-size','9');dsc.textContent=n.desc.length>36?n.desc.slice(0,36)+'...':n.desc;g.appendChild(dsc);
    let idx=i;g.addEventListener('click',function(){selectNode(idx);});g.addEventListener('keydown',function(e){if(e.key==='Enter'||e.key===' '){e.preventDefault();selectNode(idx);}});
    svg.appendChild(g);
    let barX=225,barY=[42,132,222,312,402][i];
    let barBg=document.createElementNS(ns,'rect');barBg.setAttribute('x',barX);barBg.setAttribute('y',barY);barBg.setAttribute('width',510);barBg.setAttribute('height',28);barBg.setAttribute('rx','14');barBg.setAttribute('fill','rgba(255,255,255,.04)');barBg.setAttribute('stroke','rgba(255,255,255,.05)');barBg.setAttribute('stroke-width','1');svg.appendChild(barBg);
    let meterW=[60,160,270,390,490][i];
    let meterFill=document.createElementNS(ns,'rect');meterFill.setAttribute('x',barX+2);meterFill.setAttribute('y',barY+2);meterFill.setAttribute('width',meterW);meterFill.setAttribute('height',24);meterFill.setAttribute('rx','12');meterFill.setAttribute('fill',mcolors[i]+'40');meterFill.setAttribute('stroke',mcolors[i]);meterFill.setAttribute('stroke-width','1');svg.appendChild(meterFill);
    let mt=document.createElementNS(ns,'text');mt.setAttribute('x',barX+520);mt.setAttribute('y',barY+19);mt.setAttribute('text-anchor','end');mt.setAttribute('fill',mcolors[i]);mt.setAttribute('font-size','9');mt.setAttribute('font-weight','700');mt.textContent=meterLabels[i];svg.appendChild(mt);
    let examples=['password123 / qwerty','d0g #3! (20-bit entropy)','hAshed w!th bcrypt $2a$','37 chars, random gen','Pass + TOTP = secure'][i];
    let ex=document.createElementNS(ns,'text');ex.setAttribute('x',barX+8);ex.setAttribute('y',barY+18);ex.setAttribute('fill','#94a3b8');ex.setAttribute('font-size','9');ex.textContent=examples;svg.appendChild(ex);
  });
  let crackTimes=['Instantly (0s)','3 hours','—','Centuries','Never (w/ MFA)'];
  let positions=[68,158,248,338,428];
  crackTimes.forEach((t,i)=>{
    let ct=document.createElementNS(ns,'text');ct.setAttribute('x',740);ct.setAttribute('y',positions[i]+18);ct.setAttribute('text-anchor','end');ct.setAttribute('fill','rgba(255,255,255,.35)');ct.setAttribute('font-size','8');ct.setAttribute('font-weight','600');ct.textContent='⏱ '+t;svg.appendChild(ct);
  });
  svgC.appendChild(svg);
}
function selectNode(i){selNode=i;explored.add(i);const n=NODES[i];
  infoT.textContent=n.label;infoD.textContent=n.desc;
  const details=[{k:'Crack Time',v:['Instantly','Hours/days','—','Centuries','Never (w/ MFA)'][i]},{k:'Entropy',v:['<28 bits','28-35 bits','36-59 bits','60-100 bits','100+ bits'][i]},{k:'Recommendation',v:['Change immediately','Add symbols & numbers','Use bcrypt/argon2','Use a password manager','Enable MFA now'][i]}];
  infoDet.innerHTML=details.map(d=>'<p><strong>'+d.k+':</strong> '+d.v+'</p>').join('')+'<p><strong>Description:</strong> '+n.detail+'</p>';
  infoP.hidden=false;updateNodes();checkCompletion();
}
function updateNodes(){NODES.forEach((n,i)=>{let g=document.getElementById('node-'+n.id);if(!g)return;let r=g.querySelector('rect');if(i===selNode){r.setAttribute('stroke','#22c55e');r.setAttribute('stroke-width','3');}else if(explored.has(i)){r.setAttribute('stroke',n.color);r.setAttribute('stroke-width','2');r.setAttribute('opacity','0.8');}else{r.setAttribute('stroke',n.color);r.setAttribute('stroke-width','2');r.setAttribute('opacity','0.6');}});}
function buildChallenges(){challC.innerHTML='';CHALLENGES.forEach((q,i)=>{let div=document.createElement('div');div.className='challenge-q';let txt=document.createElement('p');txt.className='challenge-q-text';txt.textContent=(i+1)+'. '+q.q;div.appendChild(txt);let opts=document.createElement('div');opts.className='challenge-options';q.o.forEach((o,j)=>{let opt=document.createElement('div');opt.className='challenge-option';opt.dataset.qi=i;opt.dataset.oi=j;let inp=document.createElement('input');inp.type='radio';inp.name='cq'+i;inp.value=j;inp.id='cq'+i+'_'+j;let lbl=document.createElement('label');lbl.htmlFor='cq'+i+'_'+j;lbl.textContent=o;opt.appendChild(inp);opt.appendChild(lbl);opt.addEventListener('click',function(){if(!challengeSubmitted)inp.checked=true;});opts.appendChild(opt);});div.appendChild(opts);challC.appendChild(div);});}
function checkChallenges(){challengeSubmitted=true;let correct=0;CHALLENGES.forEach((q,i)=>{let sel=document.querySelector('input[name="cq'+i+'"]:checked');document.querySelectorAll('.challenge-option[data-qi="'+i+'"]').forEach((o,j)=>{o.classList.remove('correct','incorrect');if(j===q.a)o.classList.add('correct');if(sel&&parseInt(sel.value)===j&&j!==q.a)o.classList.add('incorrect');});if(sel&&parseInt(sel.value)===q.a)correct++;});let pct=Math.round(correct/CHALLENGES.length*100);challR.hidden=false;challR.className='challenge-result';if(pct===100)challR.classList.add('success');else if(pct>=60)challR.classList.add('partial');else challR.classList.add('fail');challR.textContent='Score: '+correct+'/'+CHALLENGES.length+' ('+pct+'%)';challS.disabled=true;checkCompletion();}
function checkCompletion(){if(explored.size>=NODES.length&&challengeSubmitted){compN.textContent=explored.size;compSc.textContent=Math.round(document.querySelectorAll('.challenge-option.correct').length/CHALLENGES.length*100||0);compO.hidden=false;}}
function animLoop(t){rafId=requestAnimationFrame(animLoop);if(!running)return;if(!lastT)lastT=t;let dt=(t-lastT)/1000*speed;lastT=t;animT+=dt;let meters=svgC.querySelectorAll('rect[width]:not([class])');/* pulse meter fills */
  let heights=[28,28,28,28,28];let colors=['#ef4444','#f59e0b','#eab308','#22c55e','#0959c8'];
  NODES.forEach((n,i)=>{let pulse=Math.sin(animT*2+i)*0.3+0.7;let meters2=svgC.querySelectorAll('rect');meters2.forEach(m=>{let w=m.getAttribute('width');if(w&&parseInt(w)>50&&parseInt(w)<500){let y=parseInt(m.getAttribute('y'));let expectedY=[44,134,224,314,404][i];if(Math.abs(y-expectedY)<5){m.setAttribute('opacity',pulse);}}});});
  let dots=svgC.querySelectorAll('.anim08');dots.forEach(d=>d.remove());
  NODES.forEach((n,i)=>{let cycle=(animT*0.2+i*0.2)%1;let dot=document.createElementNS(ns,'circle');dot.setAttribute('cx',200+cycle*500);dot.setAttribute('cy',[56,146,236,326,416][i]);dot.setAttribute('r','2');dot.setAttribute('class','anim08');dot.setAttribute('fill',colors[i]);dot.setAttribute('opacity','0.5');svgC.querySelector('svg').appendChild(dot);});}
document.addEventListener('DOMContentLoaded',function(){try{buildSVG();buildChallenges();skel.hidden=true;app.hidden=false;themeBtn.textContent=theme==='light'?'🌙':'☀️';themeBtn.addEventListener('click',function(){theme=theme==='dark'?'light':'dark';document.documentElement.setAttribute('data-theme',theme);localStorage.setItem(STORE,theme);themeBtn.textContent=theme==='light'?'🌙':'☀️';});speedS.addEventListener('input',function(){speed=parseFloat(this.value);speedV.textContent=this.value+'×';});infoClose.addEventListener('click',function(){infoP.hidden=true;selNode=null;updateNodes();});challS.addEventListener('click',checkChallenges);lastT=0;rafId=requestAnimationFrame(animLoop);}catch(e){skel.hidden=true;errB.hidden=false;errM.textContent=e.message||'Failed to load diagram.';}});
window.addEventListener('beforeunload',function(){if(rafId)cancelAnimationFrame(rafId);});
})();
