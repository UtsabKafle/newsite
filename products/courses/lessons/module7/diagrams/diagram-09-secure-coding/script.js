(function(){'use strict';
const STORE='consica-theme';
function initTheme(){const t=localStorage.getItem(STORE)||(window.matchMedia('(prefers-color-scheme:light)').matches?'light':'dark');document.documentElement.setAttribute('data-theme',t);return t}
let theme=initTheme();
const NODES=[
{id:'validation',label:'Input Validation',x:30,y:25,desc:'Validate all user input before processing.',detail:'Whitelist validation (allow known-good patterns) is preferred. Reject malformed, oversized, or unexpected data at the boundary.',color:'#22c55e'},
{id:'encoding',label:'Output Encoding',x:30,y:115,desc:'Encode data before rendering in output context.',detail:'Context-aware encoding (HTML, JS, CSS, URL) prevents injection attacks. Never trust data for display without encoding.',color:'#3b82f6'},
{id:'prepared',label:'Prepared Statements',x:30,y:205,desc:'Parameterized queries to prevent SQL injection.',detail:'Use parameterized queries with bound parameters. SQL and query structure are pre-compiled; user input is data, not executable.',color:'#8b5cf6'},
{id:'crypto',label:'Cryptographic Storage',x:30,y:295,desc:'Encrypt sensitive data at rest and in transit.',detail:'Use established crypto libraries (not custom). Hash passwords with bcrypt/argon2. Encrypt PII, tokens, and secrets.',color:'#f59e0b'},
{id:'logging',label:'Secure Logging',x:30,y:385,desc:'Log security events without exposing sensitive data.',detail:'Log authentication attempts, access violations, and errors. Never log passwords, tokens, or PII. Ensure logs are tamper-proof.',color:'#ec4899'}
];
const CONNS=[[0,1],[1,2],[2,3],[3,4]];
const CHALLENGES=[
{q:'What is input validation?',o:['Making input look nice','Checking data before processing','Encrypting user data','Formatting output'],a:1},
{q:'Output encoding prevents:',o:['SQL injection','XSS attacks','Buffer overflow','DDoS attacks'],a:1},
{q:'Prepared statements protect against:',o:['XSS','CSRF','SQL injection','SSRF'],a:2},
{q:'How should passwords be stored?',o:['Plain text','Encrypted with AES','Hashed with bcrypt','Base64 encoded'],a:2},
{q:'What should never appear in logs?',o:['Error codes','Timestamps','Passwords','IP addresses'],a:2}
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
  defs.innerHTML='<linearGradient id="bg09" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#0f1729"/><stop offset="100%" stop-color="#0a0e17"/></linearGradient><filter id="glow09"><feGaussianBlur stdDeviation="3"/><feMerge><feMergeNode/><feMergeNode in="SourceGraphic"/></feMerge></filter><marker id="arr09" markerWidth="8" markerHeight="8" refX="4" refY="4" orient="auto"><path d="M0,0 L8,4 L0,8 Z" fill="rgba(255,255,255,.3)"/></marker>';
  let rect=document.createElementNS(ns,'rect');rect.setAttribute('width',W);rect.setAttribute('height',H);rect.setAttribute('fill','url(#bg09)');svg.appendChild(rect);svg.appendChild(defs);
  let title=document.createElementNS(ns,'text');title.setAttribute('x',m);title.setAttribute('y',22);title.setAttribute('fill','rgba(255,255,255,.6)');title.setAttribute('font-size','11');title.setAttribute('font-weight','600');title.setAttribute('letter-spacing','2');title.textContent='SECURE CODING PRACTICES — SDLC CHECKLIST';svg.appendChild(title);
  let pipeline=document.createElementNS(ns,'rect');pipeline.setAttribute('x',215);pipeline.setAttribute('y',35);pipeline.setAttribute('width',550);pipeline.setAttribute('height',440);pipeline.setAttribute('fill','rgba(255,255,255,.02)');pipeline.setAttribute('rx','12');svg.appendChild(pipeline);
  ['INPUT','PROCESS','STORE','OUTPUT'].forEach((h,j)=>{
    let hx=[230,380,530,680][j];
    let ht=document.createElementNS(ns,'text');ht.setAttribute('x',hx);ht.setAttribute('y',52);ht.setAttribute('text-anchor','middle');ht.setAttribute('fill','rgba(255,255,255,.15)');ht.setAttribute('font-size','8');ht.setAttribute('font-weight','600');ht.setAttribute('letter-spacing','1');ht.textContent=h+' LAYER';svg.appendChild(ht);
  });
  NODES.forEach((n,i)=>{
    let g=document.createElementNS(ns,'g');g.setAttribute('id','node-'+n.id);g.setAttribute('role','button');g.setAttribute('tabindex','0');g.setAttribute('aria-label',n.label);g.style.cursor='pointer';
    let r=document.createElementNS(ns,'rect');r.setAttribute('x',n.x);r.setAttribute('y',n.y);r.setAttribute('width',175);r.setAttribute('height',65);r.setAttribute('rx','10');r.setAttribute('fill',n.color+'20');r.setAttribute('stroke',n.color);r.setAttribute('stroke-width','2');r.setAttribute('filter','url(#glow09)');g.appendChild(r);
    let codeIcon=document.createElementNS(ns,'rect');codeIcon.setAttribute('x',n.x+10);codeIcon.setAttribute('y',n.y+10);codeIcon.setAttribute('width',36);codeIcon.setAttribute('height',36);codeIcon.setAttribute('rx','6');codeIcon.setAttribute('fill',n.color+'30');codeIcon.setAttribute('stroke',n.color);codeIcon.setAttribute('stroke-width','1');g.appendChild(codeIcon);
    let codes=['✓','⟳','⚡','🔐','📋'];
    let ct=document.createElementNS(ns,'text');ct.setAttribute('x',n.x+28);ct.setAttribute('y',n.y+35);ct.setAttribute('text-anchor','middle');ct.setAttribute('fill','#e2e8f0');ct.setAttribute('font-size','16');ct.textContent=codes[i];g.appendChild(ct);
    let lbl=document.createElementNS(ns,'text');lbl.setAttribute('x',n.x+105);lbl.setAttribute('y',n.y+28);lbl.setAttribute('text-anchor','middle');lbl.setAttribute('fill','#e2e8f0');lbl.setAttribute('font-size','12');lbl.setAttribute('font-weight','600');lbl.textContent=n.label;g.appendChild(lbl);
    let dsc=document.createElementNS(ns,'text');dsc.setAttribute('x',n.x+105);dsc.setAttribute('y',n.y+47);dsc.setAttribute('text-anchor','middle');dsc.setAttribute('fill','#94a3b8');dsc.setAttribute('font-size','9');dsc.textContent=n.desc.length>36?n.desc.slice(0,36)+'...':n.desc;g.appendChild(dsc);
    let idx=i;g.addEventListener('click',function(){selectNode(idx);});g.addEventListener('keydown',function(e){if(e.key==='Enter'||e.key===' '){e.preventDefault();selectNode(idx);}});
    svg.appendChild(g);
    let codeSamples=['if(isValid(input)){ }','htmlEncode(user.name)','SELECT * FROM users WHERE id=?','bcrypt.hashSync(pw,12)','logger.warn("Failed login")'];
    let langs=['Pseudocode','Java/Python','SQL','Node.js','Python'];
    let sampleX=220;let sampleY=[42,132,222,312,402][i];
    let codeBg=document.createElementNS(ns,'rect');codeBg.setAttribute('x',sampleX);codeBg.setAttribute('y',sampleY);codeBg.setAttribute('width',525);codeBg.setAttribute('height',50);codeBg.setAttribute('rx','6');codeBg.setAttribute('fill','rgba(0,0,0,.3)');codeBg.setAttribute('stroke','rgba(255,255,255,.05)');codeBg.setAttribute('stroke-width','1');svg.appendChild(codeBg);
    let langTag=document.createElementNS(ns,'rect');langTag.setAttribute('x',sampleX+5);langTag.setAttribute('y',sampleY+5);langTag.setAttribute('width',60);langTag.setAttribute('height',16);langTag.setAttribute('rx','3');langTag.setAttribute('fill',n.color+'30');langTag.setAttribute('stroke',n.color);langTag.setAttribute('stroke-width','1');svg.appendChild(langTag);
    let lt=document.createElementNS(ns,'text');lt.setAttribute('x',sampleX+35);lt.setAttribute('y',sampleY+17);lt.setAttribute('text-anchor','middle');lt.setAttribute('fill','#e2e8f0');lt.setAttribute('font-size','8');lt.setAttribute('font-weight','600');lt.textContent=langs[i];svg.appendChild(lt);
    let codeT=document.createElementNS(ns,'text');codeT.setAttribute('x',sampleX+75);codeT.setAttribute('y',sampleY+34);codeT.setAttribute('fill','#22c55e');codeT.setAttribute('font-size','11');codeT.setAttribute('font-family','monospace');codeT.textContent=codeSamples[i];svg.appendChild(codeT);
  });
  svgC.appendChild(svg);
}
function selectNode(i){selNode=i;explored.add(i);const n=NODES[i];
  infoT.textContent=n.label;infoD.textContent=n.desc;
  const details=[{k:'Category',v:['Input Layer','Output Layer','Processing Layer','Storage Layer','Monitoring Layer'][i]},{k:'Threat Prevented',v:['Injection attacks','XSS','SQL injection','Data breach','Compliance failure'][i]},{k:'Best Practice',v:['Whitelist > blacklist','Context-aware encoding','Use ORM/parametrized','Use established libs','Never log secrets'][i]}];
  infoDet.innerHTML=details.map(d=>'<p><strong>'+d.k+':</strong> '+d.v+'</p>').join('')+'<p><strong>Description:</strong> '+n.detail+'</p>';
  infoP.hidden=false;updateNodes();checkCompletion();
}
function updateNodes(){NODES.forEach((n,i)=>{let g=document.getElementById('node-'+n.id);if(!g)return;let r=g.querySelector('rect');if(i===selNode){r.setAttribute('stroke','#22c55e');r.setAttribute('stroke-width','3');}else if(explored.has(i)){r.setAttribute('stroke',n.color);r.setAttribute('stroke-width','2');r.setAttribute('opacity','0.8');}else{r.setAttribute('stroke',n.color);r.setAttribute('stroke-width','2');r.setAttribute('opacity','0.6');}});}
function buildChallenges(){challC.innerHTML='';CHALLENGES.forEach((q,i)=>{let div=document.createElement('div');div.className='challenge-q';let txt=document.createElement('p');txt.className='challenge-q-text';txt.textContent=(i+1)+'. '+q.q;div.appendChild(txt);let opts=document.createElement('div');opts.className='challenge-options';q.o.forEach((o,j)=>{let opt=document.createElement('div');opt.className='challenge-option';opt.dataset.qi=i;opt.dataset.oi=j;let inp=document.createElement('input');inp.type='radio';inp.name='cq'+i;inp.value=j;inp.id='cq'+i+'_'+j;let lbl=document.createElement('label');lbl.htmlFor='cq'+i+'_'+j;lbl.textContent=o;opt.appendChild(inp);opt.appendChild(lbl);opt.addEventListener('click',function(){if(!challengeSubmitted)inp.checked=true;});opts.appendChild(opt);});div.appendChild(opts);challC.appendChild(div);});}
function checkChallenges(){challengeSubmitted=true;let correct=0;CHALLENGES.forEach((q,i)=>{let sel=document.querySelector('input[name="cq'+i+'"]:checked');document.querySelectorAll('.challenge-option[data-qi="'+i+'"]').forEach((o,j)=>{o.classList.remove('correct','incorrect');if(j===q.a)o.classList.add('correct');if(sel&&parseInt(sel.value)===j&&j!==q.a)o.classList.add('incorrect');});if(sel&&parseInt(sel.value)===q.a)correct++;});let pct=Math.round(correct/CHALLENGES.length*100);challR.hidden=false;challR.className='challenge-result';if(pct===100)challR.classList.add('success');else if(pct>=60)challR.classList.add('partial');else challR.classList.add('fail');challR.textContent='Score: '+correct+'/'+CHALLENGES.length+' ('+pct+'%)';challS.disabled=true;checkCompletion();}
function checkCompletion(){if(explored.size>=NODES.length&&challengeSubmitted){compN.textContent=explored.size;compSc.textContent=Math.round(document.querySelectorAll('.challenge-option.correct').length/CHALLENGES.length*100||0);compO.hidden=false;}}
function animLoop(t){rafId=requestAnimationFrame(animLoop);if(!running)return;if(!lastT)lastT=t;let dt=(t-lastT)/1000*speed;lastT=t;animT+=dt;let dots=svgC.querySelectorAll('.anim09');dots.forEach(d=>d.remove());CONNS.forEach(([f,t2],ci)=>{let cycle=(animT*0.35+ci*0.2)%1;let x1=NODES[f].x+175,y1=NODES[f].y+32,x2=NODES[t2].x,y2=NODES[t2].y+32;let x=x1+(x2-x1)*cycle,y=y1+(y2-y1)*cycle;let dot=document.createElementNS(ns,'circle');dot.setAttribute('cx',x);dot.setAttribute('cy',y);dot.setAttribute('r','3');dot.setAttribute('class','anim09');dot.setAttribute('fill','#22c55e');dot.setAttribute('opacity','0.7');svgC.querySelector('svg').appendChild(dot);});}
document.addEventListener('DOMContentLoaded',function(){try{buildSVG();buildChallenges();skel.hidden=true;app.hidden=false;themeBtn.textContent=theme==='light'?'🌙':'☀️';themeBtn.addEventListener('click',function(){theme=theme==='dark'?'light':'dark';document.documentElement.setAttribute('data-theme',theme);localStorage.setItem(STORE,theme);themeBtn.textContent=theme==='light'?'🌙':'☀️';});speedS.addEventListener('input',function(){speed=parseFloat(this.value);speedV.textContent=this.value+'×';});infoClose.addEventListener('click',function(){infoP.hidden=true;selNode=null;updateNodes();});challS.addEventListener('click',checkChallenges);lastT=0;rafId=requestAnimationFrame(animLoop);}catch(e){skel.hidden=true;errB.hidden=false;errM.textContent=e.message||'Failed to load diagram.';}});
window.addEventListener('beforeunload',function(){if(rafId)cancelAnimationFrame(rafId);});
})();
