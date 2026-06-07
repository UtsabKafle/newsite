(function(){'use strict';
const STORE='consica-theme';
function initTheme(){const t=localStorage.getItem(STORE)||(window.matchMedia('(prefers-color-scheme:light)').matches?'light':'dark');document.documentElement.setAttribute('data-theme',t);return t}
let theme=initTheme();
const NODES=[
{id:'detect',label:'Detection',x:200,y:20,desc:'Identifying potential security incidents.',detail:'Detection involves monitoring systems, analyzing alerts, and identifying anomalies. Tools include SIEM, IDS, EDR, and threat intelligence feeds.',color:'#ef4444'},
{id:'contain',label:'Containment',x:200,y:110,desc:'Isolating the incident to prevent spread.',detail:'Short-term containment: disconnect affected systems. Long-term: apply patches, block IPs, segment networks to prevent lateral movement.',color:'#f59e0b'},
{id:'eradicate',label:'Eradication',x:200,y:200,desc:'Removing the threat from the environment.',detail:'Remove malware, close backdoors, delete compromised accounts, patch vulnerabilities. Verify complete removal before recovery.',color:'#8b5cf6'},
{id:'recover',label:'Recovery',x:200,y:290,desc:'Restoring normal operations safely.',detail:'Restore from clean backups, monitor closely for re-infection, validate system integrity, and gradually return to production.',color:'#3b82f6'},
{id:'lessons',label:'Lessons Learned',x:200,y:380,desc:'Post-incident review for improvement.',detail:'Document timeline, root cause, effectiveness of response. Update playbooks, improve detection rules, and conduct training.',color:'#22c55e'}
];
const CONNS=[[0,1],[1,2],[2,3],[3,4]];
const CHALLENGES=[
{q:'What is the first step in incident response?',o:['Recovery','Detection','Eradication','Lessons learned'],a:1},
{q:'Containment aims to:',o:['Fix the root cause','Prevent incident spread','Restore backups','Document findings'],a:1},
{q:'Eradication involves:',o:['Monitoring systems','Removing the threat','Restoring data','Writing reports'],a:1},
{q:'During recovery you should:',o:['Ignore the incident','Restore and monitor','Delete all logs','Reinfect systems'],a:1},
{q:'Lessons learned help:',o:['Increase attack surface','Improve future response','Hide evidence','Blame individuals'],a:1}
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
  defs.innerHTML='<linearGradient id="bg10" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#0f1729"/><stop offset="100%" stop-color="#0a0e17"/></linearGradient><filter id="glow10"><feGaussianBlur stdDeviation="3"/><feMerge><feMergeNode/><feMergeNode in="SourceGraphic"/></feMerge></filter><marker id="arr10" markerWidth="10" markerHeight="10" refX="5" refY="5" orient="auto"><path d="M0,0 L10,5 L0,10 Z" fill="rgba(255,255,255,.3)"/></marker>';
  let rect=document.createElementNS(ns,'rect');rect.setAttribute('width',W);rect.setAttribute('height',H);rect.setAttribute('fill','url(#bg10)');svg.appendChild(rect);svg.appendChild(defs);
  let title=document.createElementNS(ns,'text');title.setAttribute('x',m);title.setAttribute('y',22);title.setAttribute('fill','rgba(255,255,255,.6)');title.setAttribute('font-size','11');title.setAttribute('font-weight','600');title.setAttribute('letter-spacing','2');title.textContent='INCIDENT RESPONSE LIFECYCLE';svg.appendChild(title);
  let connPath=document.createElementNS(ns,'path');
  let points=NODES.map(n=>n.x+170+','+(n.y+32));let d='';
  for(let i=0;i<points.length-1;i++){let[x1,y1]=points[i].split(',');let[x2,y2]=points[i+1].split(',');d+='M'+x1+','+y1+' C'+(parseInt(x1)+40)+','+y1+' '+(parseInt(x2)-40)+','+y2+' '+x2+','+y2+' ';}
  connPath.setAttribute('d',d);connPath.setAttribute('stroke','rgba(255,255,255,.1)');connPath.setAttribute('stroke-width','2');connPath.setAttribute('fill','none');connPath.setAttribute('marker-end','url(#arr10)');svg.appendChild(connPath);
  // Timeline arc
  let arc=document.createElementNS(ns,'path');arc.setAttribute('d','M30,450 Q400,470 770,450');arc.setAttribute('stroke','rgba(255,255,255,.06)');arc.setAttribute('stroke-width','1');arc.setAttribute('fill','none');svg.appendChild(arc);
  ['0h','4h','12h','24h','48h+'].forEach((t,i)=>{let tx=document.createElementNS(ns,'text');tx.setAttribute('x',160*i+40);tx.setAttribute('y',462);tx.setAttribute('fill','rgba(255,255,255,.15)');tx.setAttribute('font-size','8');tx.setAttribute('font-weight','600');tx.textContent=t;svg.appendChild(tx);});
  NODES.forEach((n,i)=>{
    let g=document.createElementNS(ns,'g');g.setAttribute('id','node-'+n.id);g.setAttribute('role','button');g.setAttribute('tabindex','0');g.setAttribute('aria-label',n.label);g.style.cursor='pointer';
    let r=document.createElementNS(ns,'rect');r.setAttribute('x',n.x);r.setAttribute('y',n.y);r.setAttribute('width',180);r.setAttribute('height',65);r.setAttribute('rx','10');r.setAttribute('fill',n.color+'20');r.setAttribute('stroke',n.color);r.setAttribute('stroke-width','2');r.setAttribute('filter','url(#glow10)');g.appendChild(r);
    let phase=document.createElementNS(ns,'circle');phase.setAttribute('cx',n.x+25);phase.setAttribute('cy',n.y+25);phase.setAttribute('r','16');phase.setAttribute('fill',n.color+'30');phase.setAttribute('stroke',n.color);phase.setAttribute('stroke-width','1.5');g.appendChild(phase);
    let nlabels=[1,2,3,4,5];let pt=document.createElementNS(ns,'text');pt.setAttribute('x',n.x+25);pt.setAttribute('y',n.y+31);pt.setAttribute('text-anchor','middle');pt.setAttribute('fill','#e2e8f0');pt.setAttribute('font-size','14');pt.setAttribute('font-weight','700');pt.textContent=nlabels[i];g.appendChild(pt);
    let lbl=document.createElementNS(ns,'text');lbl.setAttribute('x',n.x+100);lbl.setAttribute('y',n.y+32);lbl.setAttribute('text-anchor','middle');lbl.setAttribute('fill','#e2e8f0');lbl.setAttribute('font-size','14');lbl.setAttribute('font-weight','600');lbl.textContent=n.label;g.appendChild(lbl);
    let dsc=document.createElementNS(ns,'text');dsc.setAttribute('x',n.x+100);dsc.setAttribute('y',n.y+50);dsc.setAttribute('text-anchor','middle');dsc.setAttribute('fill','#94a3b8');dsc.setAttribute('font-size','9');dsc.textContent=n.desc.length>36?n.desc.slice(0,36)+'...':n.desc;g.appendChild(dsc);
    let idx=i;g.addEventListener('click',function(){selectNode(idx);});g.addEventListener('keydown',function(e){if(e.key==='Enter'||e.key===' '){e.preventDefault();selectNode(idx);}});
    svg.appendChild(g);
    let tw=document.createElementNS(ns,'rect');tw.setAttribute('x',n.x);tw.setAttribute('y',n.y+72);tw.setAttribute('width',180);tw.setAttribute('height',22);tw.setAttribute('rx','4');tw.setAttribute('fill','rgba(255,255,255,.03)');tw.setAttribute('stroke','rgba(255,255,255,.05)');tw.setAttribute('stroke-width','1');svg.appendChild(tw);
    let twt=document.createElementNS(ns,'text');twt.setAttribute('x',n.x+90);twt.setAttribute('y',n.y+88);twt.setAttribute('text-anchor','middle');twt.setAttribute('fill','rgba(255,255,255,.25)');twt.setAttribute('font-size','8');twt.setAttribute('font-weight','600');twt.textContent=['PHASE 1','PHASE 2','PHASE 3','PHASE 4','PHASE 5'][i];svg.appendChild(twt);
  });
  svgC.appendChild(svg);
}
function selectNode(i){selNode=i;explored.add(i);const n=NODES[i];
  infoT.textContent='Phase '+(i+1)+': '+n.label;infoD.textContent=n.desc;
  const details=[{k:'Objective',v:['Identify the incident','Stop the breach','Remove the threat','Restore operations','Improve readiness'][i]},{k:'Key Actions',v:['Monitor, analyze, triage','Isolate, preserve evidence','Remove, patch, verify','Restore, validate, monitor','Document, update, train'][i]},{k:'Tools',v:['SIEM, IDS, EDR','Firewall, NAC','AV, vulnerability scanner','Backup, monitoring tools','Ticketing, docs'][i]}];
  infoDet.innerHTML=details.map(d=>'<p><strong>'+d.k+':</strong> '+d.v+'</p>').join('')+'<p><strong>Description:</strong> '+n.detail+'</p>';
  infoP.hidden=false;updateNodes();checkCompletion();
}
function updateNodes(){NODES.forEach((n,i)=>{let g=document.getElementById('node-'+n.id);if(!g)return;let r=g.querySelector('rect');if(i===selNode){r.setAttribute('stroke','#22c55e');r.setAttribute('stroke-width','3');}else if(explored.has(i)){r.setAttribute('stroke',n.color);r.setAttribute('stroke-width','2');r.setAttribute('opacity','0.8');}else{r.setAttribute('stroke',n.color);r.setAttribute('stroke-width','2');r.setAttribute('opacity','0.6');}});}
function buildChallenges(){challC.innerHTML='';CHALLENGES.forEach((q,i)=>{let div=document.createElement('div');div.className='challenge-q';let txt=document.createElement('p');txt.className='challenge-q-text';txt.textContent=(i+1)+'. '+q.q;div.appendChild(txt);let opts=document.createElement('div');opts.className='challenge-options';q.o.forEach((o,j)=>{let opt=document.createElement('div');opt.className='challenge-option';opt.dataset.qi=i;opt.dataset.oi=j;let inp=document.createElement('input');inp.type='radio';inp.name='cq'+i;inp.value=j;inp.id='cq'+i+'_'+j;let lbl=document.createElement('label');lbl.htmlFor='cq'+i+'_'+j;lbl.textContent=o;opt.appendChild(inp);opt.appendChild(lbl);opt.addEventListener('click',function(){if(!challengeSubmitted)inp.checked=true;});opts.appendChild(opt);});div.appendChild(opts);challC.appendChild(div);});}
function checkChallenges(){challengeSubmitted=true;let correct=0;CHALLENGES.forEach((q,i)=>{let sel=document.querySelector('input[name="cq'+i+'"]:checked');document.querySelectorAll('.challenge-option[data-qi="'+i+'"]').forEach((o,j)=>{o.classList.remove('correct','incorrect');if(j===q.a)o.classList.add('correct');if(sel&&parseInt(sel.value)===j&&j!==q.a)o.classList.add('incorrect');});if(sel&&parseInt(sel.value)===q.a)correct++;});let pct=Math.round(correct/CHALLENGES.length*100);challR.hidden=false;challR.className='challenge-result';if(pct===100)challR.classList.add('success');else if(pct>=60)challR.classList.add('partial');else challR.classList.add('fail');challR.textContent='Score: '+correct+'/'+CHALLENGES.length+' ('+pct+'%)';challS.disabled=true;checkCompletion();}
function checkCompletion(){if(explored.size>=NODES.length&&challengeSubmitted){compN.textContent=explored.size;compSc.textContent=Math.round(document.querySelectorAll('.challenge-option.correct').length/CHALLENGES.length*100||0);compO.hidden=false;}}
function animLoop(t){rafId=requestAnimationFrame(animLoop);if(!running)return;if(!lastT)lastT=t;let dt=(t-lastT)/1000*speed;lastT=t;animT+=dt;let dots=svgC.querySelectorAll('.anim10');dots.forEach(d=>d.remove());
  // Rotating indicator around lifecycle
  let cycle=animT*0.2%1;let total=NODES.length;let idx=Math.floor(cycle*total);let next=(idx+1)%total;
  let x1=NODES[idx].x+180,y1=NODES[idx].y+32,x2=NODES[next].x,y2=NODES[next].y+32;
  let lerp=cycle*total-idx;let x=x1+(x2-x1)*lerp,y=y1+(y2-y1)*lerp;
  let dot=document.createElementNS(ns,'circle');dot.setAttribute('cx',x);dot.setAttribute('cy',y);dot.setAttribute('r','5');dot.setAttribute('class','anim10');dot.setAttribute('fill','#22c55e');dot.setAttribute('opacity','0.9');svgC.querySelector('svg').appendChild(dot);
  // Pulse on each node
  NODES.forEach((n,i)=>{let p=(Math.sin(animT*3-i)*0.5+0.5)*0.4+0.1;let pd=document.createElementNS(ns,'circle');pd.setAttribute('cx',n.x+90);pd.setAttribute('cy',n.y+32);pd.setAttribute('r','20');pd.setAttribute('class','anim10');pd.setAttribute('fill','none');pd.setAttribute('stroke',n.color);pd.setAttribute('stroke-width','2');pd.setAttribute('opacity',p);svgC.querySelector('svg').appendChild(pd);});}
document.addEventListener('DOMContentLoaded',function(){try{buildSVG();buildChallenges();skel.hidden=true;app.hidden=false;themeBtn.textContent=theme==='light'?'🌙':'☀️';themeBtn.addEventListener('click',function(){theme=theme==='dark'?'light':'dark';document.documentElement.setAttribute('data-theme',theme);localStorage.setItem(STORE,theme);themeBtn.textContent=theme==='light'?'🌙':'☀️';});speedS.addEventListener('input',function(){speed=parseFloat(this.value);speedV.textContent=this.value+'×';});infoClose.addEventListener('click',function(){infoP.hidden=true;selNode=null;updateNodes();});challS.addEventListener('click',checkChallenges);lastT=0;rafId=requestAnimationFrame(animLoop);}catch(e){skel.hidden=true;errB.hidden=false;errM.textContent=e.message||'Failed to load diagram.';}});
window.addEventListener('beforeunload',function(){if(rafId)cancelAnimationFrame(rafId);});
})();
