(function(){'use strict';
const STORE='consica-theme';
function initTheme(){const t=localStorage.getItem(STORE)||(window.matchMedia('(prefers-color-scheme:light)').matches?'light':'dark');document.documentElement.setAttribute('data-theme',t);return t}
let theme=initTheme();
const NODES=[
{id:'gdpr',label:'GDPR',x:15,y:25,desc:'EU data protection regulation for privacy.',detail:'GDPR grants individuals control over personal data. Requires consent, breach notification, data protection officers, and right to deletion.',color:'#3b82f6'},
{id:'hipaa',label:'HIPAA',x:15,y:115,desc:'US healthcare data privacy and security.',detail:'HIPAA protects medical records and health information. Requires safeguards for ePHI, breach notification, and business associate agreements.',color:'#22c55e'},
{id:'pci',label:'PCI-DSS',x:15,y:205,desc:'Payment card industry security standards.',detail:'PCI-DSS requires secure cardholder data handling: encryption, access control, regular testing, and network segmentation for payment systems.',color:'#f59e0b'},
{id:'soc2',label:'SOC 2',x:15,y:295,desc:'Service organization control for data security.',detail:'SOC 2 audits trust principles: security, availability, processing integrity, confidentiality, and privacy for service providers.',color:'#8b5cf6'},
{id:'iso27001',label:'ISO 27001',x:15,y:385,desc:'International standard for ISMS.',detail:'ISO 27001 specifies requirements for establishing, implementing, and maintaining an Information Security Management System (ISMS).',color:'#ec4899'}
];
const CHALLENGES=[
{q:'GDPR primarily protects:',o:['Financial data','Personal data of EU citizens','Healthcare records','Payment info'],a:1},
{q:'HIPAA applies to:',o:['All companies','Healthcare providers and insurers','Tech companies','Government agencies'],a:1},
{q:'PCI-DSS covers:',o:['Personal privacy','Cardholder data security','Healthcare privacy','Cloud security'],a:1},
{q:'SOC 2 audits are for:',o:['Manufacturing','Service organizations','Retail','Construction'],a:1},
{q:'ISO 27001 is about:',o:['Product quality','Information security management','Environmental standards','Food safety'],a:1}
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
  defs.innerHTML='<linearGradient id="bg11" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#0f1729"/><stop offset="100%" stop-color="#0a0e17"/></linearGradient><filter id="glow11"><feGaussianBlur stdDeviation="3"/><feMerge><feMergeNode/><feMergeNode in="SourceGraphic"/></feMerge></filter>';
  let rect=document.createElementNS(ns,'rect');rect.setAttribute('width',W);rect.setAttribute('height',H);rect.setAttribute('fill','url(#bg11)');svg.appendChild(rect);svg.appendChild(defs);
  let title=document.createElementNS(ns,'text');title.setAttribute('x',m);title.setAttribute('y',22);title.setAttribute('fill','rgba(255,255,255,.6)');title.setAttribute('font-size','11');title.setAttribute('font-weight','600');title.setAttribute('letter-spacing','2');title.textContent='COMPLIANCE FRAMEWORKS COMPARISON';svg.appendChild(title);
  let compareBg=document.createElementNS(ns,'rect');compareBg.setAttribute('x',200);compareBg.setAttribute('y',35);compareBg.setAttribute('width',565);compareBg.setAttribute('height',440);compareBg.setAttribute('fill','rgba(255,255,255,.02)');compareBg.setAttribute('rx','12');svg.appendChild(compareBg);
  let headers=['Scope','Key Requirements','Penalties'];let hx=[215,380,570];
  headers.forEach((h,j)=>{
    let ht=document.createElementNS(ns,'text');ht.setAttribute('x',hx[j]);ht.setAttribute('y',52);ht.setAttribute('text-anchor','middle');ht.setAttribute('fill','rgba(255,255,255,.2)');ht.setAttribute('font-size','9');ht.setAttribute('font-weight','600');ht.textContent=h;svg.appendChild(ht);
  });
  NODES.forEach((n,i)=>{
    let g=document.createElementNS(ns,'g');g.setAttribute('id','node-'+n.id);g.setAttribute('role','button');g.setAttribute('tabindex','0');g.setAttribute('aria-label',n.label);g.style.cursor='pointer';
    let r=document.createElementNS(ns,'rect');r.setAttribute('x',n.x);r.setAttribute('y',n.y);r.setAttribute('width',170);r.setAttribute('height',65);r.setAttribute('rx','10');r.setAttribute('fill',n.color+'20');r.setAttribute('stroke',n.color);r.setAttribute('stroke-width','2');r.setAttribute('filter','url(#glow11)');g.appendChild(r);
    let badge=document.createElementNS(ns,'rect');badge.setAttribute('x',n.x+8);badge.setAttribute('y',n.y-8);badge.setAttribute('width',[50,52,60,48,62][i]);badge.setAttribute('height',18);badge.setAttribute('rx','4');badge.setAttribute('fill',n.color+'30');badge.setAttribute('stroke',n.color);badge.setAttribute('stroke-width','1');g.appendChild(badge);
    let regions=['EU','USA','Global','USA','Global'];let bt=document.createElementNS(ns,'text');bt.setAttribute('x',n.x+8+[25,26,30,24,31][i]);bt.setAttribute('y',n.y+5);bt.setAttribute('text-anchor','middle');bt.setAttribute('fill','#e2e8f0');bt.setAttribute('font-size','8');bt.setAttribute('font-weight','600');bt.textContent=regions[i];g.appendChild(bt);
    let lbl=document.createElementNS(ns,'text');lbl.setAttribute('x',n.x+90);lbl.setAttribute('y',n.y+28);lbl.setAttribute('text-anchor','middle');lbl.setAttribute('fill','#e2e8f0');lbl.setAttribute('font-size','13');lbl.setAttribute('font-weight','600');lbl.textContent=n.label;g.appendChild(lbl);
    let dsc=document.createElementNS(ns,'text');dsc.setAttribute('x',n.x+90);dsc.setAttribute('y',n.y+48);dsc.setAttribute('text-anchor','middle');dsc.setAttribute('fill','#94a3b8');dsc.setAttribute('font-size','9');dsc.textContent=n.desc.length>36?n.desc.slice(0,36)+'...':n.desc;g.appendChild(dsc);
    let idx=i;g.addEventListener('click',function(){selectNode(idx);});g.addEventListener('keydown',function(e){if(e.key==='Enter'||e.key===' '){e.preventDefault();selectNode(idx);}});
    svg.appendChild(g);
    let scopes=['Personal data of EU citizens','Protected health info (ePHI)','Cardholder data','Service provider data','Any organization\'s ISMS'][i];
    let reqs=['Consent, DPO, breach notice','Privacy rule, security rule','Encryption, access control','Security, availability, conf.','Risk assessment, controls'][i];
    let penalties=['Up to 4% of revenue','Up to $1.5M/year','Up to $500K/month','Varies by auditor','Certification revoked'][i];
    let columns=[scopes,reqs,penalties];
    columns.forEach((col,j)=>{
      let cx=[215,380,570][j];let cy=[42,132,222,312,402][i];
      let cell=document.createElementNS(ns,'rect');cell.setAttribute('x',cx);cell.setAttribute('y',cy);cell.setAttribute('width',160);cell.setAttribute('height',50);cell.setAttribute('rx','4');cell.setAttribute('fill','rgba(255,255,255,.02)');cell.setAttribute('stroke','rgba(255,255,255,.04)');cell.setAttribute('stroke-width','1');svg.appendChild(cell);
      let ct=document.createElementNS(ns,'text');ct.setAttribute('x',cx+80);ct.setAttribute('y',cy+30);ct.setAttribute('text-anchor','middle');ct.setAttribute('fill','#94a3b8');ct.setAttribute('font-size','9');ct.textContent=col;svg.appendChild(ct);
    });
  });
  svgC.appendChild(svg);
}
function selectNode(i){selNode=i;explored.add(i);const n=NODES[i];
  infoT.textContent=n.label+' ('+['EU General Data Protection Regulation','Health Insurance Portability and Accountability Act','Payment Card Industry Data Security Standard','Service Organization Control 2','International Organization for Standardization 27001'][i]+')';infoD.textContent=n.desc;
  const details=[{k:'Region',v:['European Union','United States','Global','United States','Global'][i]},{k:'Year Enacted',v:[2018,1996,2004,2017,2005][i]},{k:'Authority',v:['EDPB','HHS OCR','PCI SSC','AICPA','ISO/IEC'][i]}];
  infoDet.innerHTML=details.map(d=>'<p><strong>'+d.k+':</strong> '+d.v+'</p>').join('')+'<p><strong>Description:</strong> '+n.detail+'</p>';
  infoP.hidden=false;updateNodes();checkCompletion();
}
function updateNodes(){NODES.forEach((n,i)=>{let g=document.getElementById('node-'+n.id);if(!g)return;let r=g.querySelector('rect');if(i===selNode){r.setAttribute('stroke','#22c55e');r.setAttribute('stroke-width','3');}else if(explored.has(i)){r.setAttribute('stroke',n.color);r.setAttribute('stroke-width','2');r.setAttribute('opacity','0.8');}else{r.setAttribute('stroke',n.color);r.setAttribute('stroke-width','2');r.setAttribute('opacity','0.6');}});}
function buildChallenges(){challC.innerHTML='';CHALLENGES.forEach((q,i)=>{let div=document.createElement('div');div.className='challenge-q';let txt=document.createElement('p');txt.className='challenge-q-text';txt.textContent=(i+1)+'. '+q.q;div.appendChild(txt);let opts=document.createElement('div');opts.className='challenge-options';q.o.forEach((o,j)=>{let opt=document.createElement('div');opt.className='challenge-option';opt.dataset.qi=i;opt.dataset.oi=j;let inp=document.createElement('input');inp.type='radio';inp.name='cq'+i;inp.value=j;inp.id='cq'+i+'_'+j;let lbl=document.createElement('label');lbl.htmlFor='cq'+i+'_'+j;lbl.textContent=o;opt.appendChild(inp);opt.appendChild(lbl);opt.addEventListener('click',function(){if(!challengeSubmitted)inp.checked=true;});opts.appendChild(opt);});div.appendChild(opts);challC.appendChild(div);});}
function checkChallenges(){challengeSubmitted=true;let correct=0;CHALLENGES.forEach((q,i)=>{let sel=document.querySelector('input[name="cq'+i+'"]:checked');document.querySelectorAll('.challenge-option[data-qi="'+i+'"]').forEach((o,j)=>{o.classList.remove('correct','incorrect');if(j===q.a)o.classList.add('correct');if(sel&&parseInt(sel.value)===j&&j!==q.a)o.classList.add('incorrect');});if(sel&&parseInt(sel.value)===q.a)correct++;});let pct=Math.round(correct/CHALLENGES.length*100);challR.hidden=false;challR.className='challenge-result';if(pct===100)challR.classList.add('success');else if(pct>=60)challR.classList.add('partial');else challR.classList.add('fail');challR.textContent='Score: '+correct+'/'+CHALLENGES.length+' ('+pct+'%)';challS.disabled=true;checkCompletion();}
function checkCompletion(){if(explored.size>=NODES.length&&challengeSubmitted){compN.textContent=explored.size;compSc.textContent=Math.round(document.querySelectorAll('.challenge-option.correct').length/CHALLENGES.length*100||0);compO.hidden=false;}}
function animLoop(t){rafId=requestAnimationFrame(animLoop);if(!running)return;if(!lastT)lastT=t;let dt=(t-lastT)/1000*speed;lastT=t;animT+=dt;let dots=svgC.querySelectorAll('.anim11');dots.forEach(d=>d.remove());NODES.forEach((n,i)=>{let cycle=(animT*0.25+i*0.2)%1;let dot=document.createElementNS(ns,'circle');dot.setAttribute('cx',n.x+Math.sin(cycle*Math.PI*2)*15+85);dot.setAttribute('cy',n.y+Math.cos(cycle*Math.PI*2)*10+32);dot.setAttribute('r','2.5');dot.setAttribute('class','anim11');dot.setAttribute('fill',n.color);dot.setAttribute('opacity','0.5');svgC.querySelector('svg').appendChild(dot);});}
document.addEventListener('DOMContentLoaded',function(){try{buildSVG();buildChallenges();skel.hidden=true;app.hidden=false;themeBtn.textContent=theme==='light'?'🌙':'☀️';themeBtn.addEventListener('click',function(){theme=theme==='dark'?'light':'dark';document.documentElement.setAttribute('data-theme',theme);localStorage.setItem(STORE,theme);themeBtn.textContent=theme==='light'?'🌙':'☀️';});speedS.addEventListener('input',function(){speed=parseFloat(this.value);speedV.textContent=this.value+'×';});infoClose.addEventListener('click',function(){infoP.hidden=true;selNode=null;updateNodes();});challS.addEventListener('click',checkChallenges);lastT=0;rafId=requestAnimationFrame(animLoop);}catch(e){skel.hidden=true;errB.hidden=false;errM.textContent=e.message||'Failed to load diagram.';}});
window.addEventListener('beforeunload',function(){if(rafId)cancelAnimationFrame(rafId);});
})();
