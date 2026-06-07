(function(){'use strict';
const STORE='consica-theme';
function initTheme(){const t=localStorage.getItem(STORE)||(window.matchMedia('(prefers-color-scheme:light)').matches?'light':'dark');document.documentElement.setAttribute('data-theme',t);return t}
let theme=initTheme();
const NODES=[
{id:'plaintext',label:'Plaintext',x:30,y:25,desc:'Readable original message before encryption.',detail:'Plaintext is the unencrypted data — text, files, or communication — in its original human-readable form.',color:'#22c55e'},
{id:'encrypt',label:'Encryption',x:30,y:115,desc:'Algorithm + Key transforms plaintext to ciphertext.',detail:'Encryption applies a mathematical algorithm and a secret key to scramble plaintext into unreadable ciphertext.',color:'#3b82f6'},
{id:'ciphertext',label:'Ciphertext',x:30,y:205,desc:'Scrambled unreadable output of encryption.',detail:'Ciphertext appears as random characters. Without the correct key, it cannot be decrypted back to plaintext.',color:'#f59e0b'},
{id:'decrypt',label:'Decryption',x:30,y:295,desc:'Reverse process using key to recover plaintext.',detail:'Decryption uses the matching algorithm and correct key to transform ciphertext back into original plaintext.',color:'#8b5cf6'},
{id:'keys',label:'Key Exchange',x:30,y:385,desc:'Secure distribution of encryption keys.',detail:'Symmetric uses one shared key; asymmetric uses public/private key pairs. Key management is critical for security.',color:'#ec4899'}
];
const CONNS=[[0,1],[1,2],[2,3],[3,4]];
const CHALLENGES=[
{q:'What is ciphertext?',o:['Readable data','Scrambled encrypted data','Encryption key','Decryption algorithm'],a:1},
{q:'Symmetric encryption uses:',o:['One shared key','Two different keys','No key','Three keys'],a:0},
{q:'Asymmetric encryption uses:',o:['One key','Public/private key pair','Only passwords','Biometrics'],a:1},
{q:'Which is a strong encryption algorithm?',o:['ROT13','AES-256','Base64','Caesar cipher'],a:1},
{q:'Key exchange solves the problem of:',o:['Data storage','Speed','Key distribution','File size'],a:2}
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
  defs.innerHTML='<linearGradient id="bg02" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#0f1729"/><stop offset="100%" stop-color="#0a0e17"/></linearGradient><filter id="glow02"><feGaussianBlur stdDeviation="3"/><feMerge><feMergeNode/><feMergeNode in="SourceGraphic"/></feMerge></filter><marker id="arr02" markerWidth="8" markerHeight="8" refX="4" refY="4" orient="auto"><path d="M0,0 L8,4 L0,8 Z" fill="rgba(255,255,255,.3)"/></marker>';
  let rect=document.createElementNS(ns,'rect');
  rect.setAttribute('width',W);rect.setAttribute('height',H);rect.setAttribute('fill','url(#bg02)');
  svg.appendChild(rect);svg.appendChild(defs);
  let title=document.createElementNS(ns,'text');
  title.setAttribute('x',m);title.setAttribute('y',22);title.setAttribute('fill','rgba(255,255,255,.6)');
  title.setAttribute('font-size','11');title.setAttribute('font-weight','600');title.setAttribute('letter-spacing','2');
  title.textContent='ENCRYPTION FLOW';
  svg.appendChild(title);
  let flowBg=document.createElementNS(ns,'rect');
  flowBg.setAttribute('x',m);flowBg.setAttribute('y',35);flowBg.setAttribute('width',gW);flowBg.setAttribute('height',440);
  flowBg.setAttribute('fill','rgba(255,255,255,.02)');flowBg.setAttribute('rx','12');
  svg.appendChild(flowBg);
  NODES.forEach((n,i)=>{
    let g=document.createElementNS(ns,'g');
    g.setAttribute('id','node-'+n.id);g.setAttribute('role','button');g.setAttribute('tabindex','0');
    g.setAttribute('aria-label',n.label);g.style.cursor='pointer';
    let r=document.createElementNS(ns,'rect');
    r.setAttribute('x',n.x);r.setAttribute('y',n.y);r.setAttribute('width',160);r.setAttribute('height',65);
    r.setAttribute('rx','10');r.setAttribute('fill',n.color+'20');r.setAttribute('stroke',n.color);
    r.setAttribute('stroke-width','2');r.setAttribute('filter','url(#glow02)');
    g.appendChild(r);
    let stepNum=document.createElementNS(ns,'circle');
    stepNum.setAttribute('cx',n.x+20);stepNum.setAttribute('cy',n.y+20);stepNum.setAttribute('r',13);
    stepNum.setAttribute('fill',n.color+'40');stepNum.setAttribute('stroke',n.color);stepNum.setAttribute('stroke-width','1.5');
    g.appendChild(stepNum);
    let numT=document.createElementNS(ns,'text');
    numT.setAttribute('x',n.x+20);numT.setAttribute('y',n.y+25);numT.setAttribute('text-anchor','middle');
    numT.setAttribute('fill','#e2e8f0');numT.setAttribute('font-size','11');numT.setAttribute('font-weight','700');
    numT.textContent=i+1;
    g.appendChild(numT);
    let lbl=document.createElementNS(ns,'text');
    lbl.setAttribute('x',n.x+90);lbl.setAttribute('y',n.y+28);lbl.setAttribute('text-anchor','middle');
    lbl.setAttribute('fill','#e2e8f0');lbl.setAttribute('font-size','13');lbl.setAttribute('font-weight','600');
    lbl.textContent=n.label;
    g.appendChild(lbl);
    let dsc=document.createElementNS(ns,'text');
    dsc.setAttribute('x',n.x+90);dsc.setAttribute('y',n.y+48);dsc.setAttribute('text-anchor','middle');
    dsc.setAttribute('fill','#94a3b8');dsc.setAttribute('font-size','9');
    dsc.textContent=n.desc.length>36?n.desc.slice(0,36)+'...':n.desc;
    g.appendChild(dsc);
    let idx=i;
    g.addEventListener('click',function(){selectNode(idx);});
    g.addEventListener('keydown',function(e){if(e.key==='Enter'||e.key===' '){e.preventDefault();selectNode(idx);}});
    svg.appendChild(g);
  });
  CONNS.forEach(([f,t])=>{
    let x1=NODES[f].x+160,y1=NODES[f].y+32,x2=NODES[t].x,y2=NODES[t].y+32;
    let conn=document.createElementNS(ns,'path');
    conn.setAttribute('d','M'+x1+','+y1+' C'+(x1+30)+','+y1+' '+(x2-30)+','+y2+' '+x2+','+y2);
    conn.setAttribute('stroke','rgba(255,255,255,.15)');conn.setAttribute('stroke-width','2');
    conn.setAttribute('fill','none');conn.setAttribute('marker-end','url(#arr02)');
    svg.appendChild(conn);
  });
  svgC.appendChild(svg);
}
function selectNode(i){
  selNode=i;explored.add(i);
  const n=NODES[i];
  infoT.textContent=n.label;infoD.textContent=n.desc;
  const details=[{k:'Strength',v:['N/A','AES-256','N/A','AES-256','RSA-4096'][i]},{k:'Key Type',v:['N/A','Symmetric/Asymmetric','N/A','Same as encrypt','Public/Private'][i]},{k:'Use Case',v:['Original data','Data in transit','Storage','Data retrieval','Secure handshake'][i]},{k:'Analogy',v:['A letter','Locking a box','A sealed box','Unlocking box','Making copies of keys'][i]}];
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
      opt.addEventListener('click',function(){if(!challengeSubmitted)inp.checked=true;});
      opts.appendChild(opt);
    });
    div.appendChild(opts);challC.appendChild(div);
  });
}
function checkChallenges(){
  challengeSubmitted=true;let correct=0;
  CHALLENGES.forEach((q,i)=>{
    let sel=document.querySelector('input[name="cq'+i+'"]:checked');
    let opts=document.querySelectorAll('.challenge-option[data-qi="'+i+'"]');
    opts.forEach((o,j)=>{o.classList.remove('correct','incorrect');if(j===q.a)o.classList.add('correct');if(sel&&parseInt(sel.value)===j&&j!==q.a)o.classList.add('incorrect');});
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
  if(!lastT)lastT=t;
  let dt=(t-lastT)/1000*speed;lastT=t;animT+=dt;
  let dots=svgC.querySelectorAll('.anim-dot02');dots.forEach(d=>d.remove());
  CONNS.forEach(([f,t],ci)=>{
    let cycle=(animT*0.4+ci*0.2)%1;
    let p1=NODES[f],p2=NODES[t];
    let x1=p1.x+160,y1=p1.y+32,x2=p2.x,y2=p2.y+32;
    let cx1=x1+30,cy1=y1,cx2=x2-30,cy2=y2;
    let t2=cycle;
    let x=(1-t2)*(1-t2)*(1-t2)*x1+3*(1-t2)*(1-t2)*t2*cx1+3*(1-t2)*t2*t2*cx2+t2*t2*t2*x2;
    let y=(1-t2)*(1-t2)*(1-t2)*y1+3*(1-t2)*(1-t2)*t2*cy1+3*(1-t2)*t2*t2*cy2+t2*t2*t2*y2;
    let dot=document.createElementNS(ns,'circle');
    dot.setAttribute('cx',x);dot.setAttribute('cy',y);dot.setAttribute('r','4');
    dot.setAttribute('class','anim-dot02');dot.setAttribute('fill','#22c55e');dot.setAttribute('opacity','0.8');
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
