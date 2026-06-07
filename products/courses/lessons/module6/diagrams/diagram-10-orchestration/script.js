(function(){'use strict';
var componentData=[{id:"cluster",label:"Cluster",x:50,y:8,purpose:"Orchestration platform",desc:"Group of nodes running containerized apps",how:"Kubernetes master manages worker nodes",why:"Automated deployment scaling management",analogy:"Air traffic control system",ffact:"Kubernetes is Greek for helmsman",take:"Cluster abstracts individual machines",mistake:"Running everything in one cluster",cat:"Infra"},{id:"node",label:"Worker Node",x:25,y:32,purpose:"Compute capacity",desc:"Physical or VM running pods",how:"Kubelet + container runtime + kube-proxy",why:"Run container workloads",analogy:"An airport gate",ffact:"A node can run 100+ pods",take:"Add nodes for horizontal scaling",mistake:"Under-provisioning nodes causes OOM",cat:"Infra"},{id:"pod",label:"Pod",x:50,y:32,purpose:"Smallest deployable unit",desc:"One or more containers sharing network",how:"kubectl run or Deployment YAML",why:"Run application instances",analogy:"A single passenger with luggage",ffact:"Pods are ephemeral and can be rescheduled",take:"Use Deployments not raw pods",mistake:"Putting multiple containers in one pod unnecessarily",cat:"Workload"},{id:"service",label:"Service",x:75,y:32,purpose:"Stable network endpoint",desc:"Load-balances traffic to pods",how:"kubectl expose or Service YAML",why:"Pods are ephemeral services are stable",analogy:"Airline counter desk",ffact:"Services use label selectors to find pods",take:"Use ClusterIP for internal traffic",mistake:"Not using services for pod communication",cat:"Network"},{id:"ingress",label:"Ingress",x:50,y:56,purpose:"External access",desc:"HTTP/HTTPS routing to services",how:"Ingress controller + rules",why:"Expose apps to outside world",analogy:"Airport terminal entrance",ffact:"Ingress controllers like Nginx Ingress are popular",take:"Use Ingress for HTTP routing",mistake:"Opening NodePort directly to internet",cat:"Network"},{id:"configmap",label:"ConfigMap",x:50,y:78,purpose:"Configuration data",desc:"Key-value pairs injected into pods",how:"kubectl create configmap",why:"Decouple config from code",analogy:"Cabin crew instructions",ffact:"Secrets are similar but base64 encoded",take:"Store config not secrets in ConfigMap",mistake:"Hardcoding config in container image",cat:"Config"}];
var mcqData=[{q:"What is a Pod in Kubernetes?",o:["Smallest deployable unit","A physical server","A virtual network","A storage volume"],a:0},{q:"What does a Service provide?",o:["Stable network endpoint","Compute resources","Container runtime","Log storage"],a:0},{q:"What does Kubernetes mean in Greek?",o:["Helmsman","Container","Cloud","Manager"],a:0},{q:"What manages worker nodes?",o:["Kubelet","Docker","kubectl","Service"],a:0},{q:"What is an Ingress used for?",o:["HTTP routing to services","Running containers","Storing logs","Monitoring nodes"],a:0}];
var cfg={title:'Orchestration (Kubernetes)',subtitle:'Container Orchestration',desc:'See how Kubernetes manages pods services ingress and nodes in a cluster.',module:6,components:componentData,mcqs:mcqData};
var app,container,infoPanel,infoTitle,infoContent,infoClose,completionOverlay,completionTitle,completionScore,completionMessage,completionClose,challengeContainer,submitBtn,speedSlider,speedLabel,themeBtn,skeleton,errorBoundary;
var activeNode=null,speed=1,theme='dark',animId=null,tick=0;
function $(id){return document.getElementById(id)}
function qs(s,p){return(p||document).querySelector(s)}
function qsa(s,p){return(p||document).querySelectorAll(s)}
function init(){try{
skeleton=$('skeleton');errorBoundary=$('error-boundary');app=$('app');container=$('svg-container');infoPanel=$('info-panel');
infoTitle=$('info-title');infoContent=$('info-content');infoClose=$('info-close');
completionOverlay=$('completion-overlay');completionTitle=$('completion-title');completionScore=$('completion-score');completionMessage=$('completion-message');completionClose=$('completion-close');
challengeContainer=$('challenge-container');submitBtn=$('submit-challenge');speedSlider=$('speed-slider');speedLabel=$('speed-label');themeBtn=$('theme-toggle');
try{theme=localStorage.getItem('diagram-theme')||'dark'}catch(e){}
document.documentElement.setAttribute('data-theme',theme);
themeBtn.textContent=theme==='light'?'\u2600':'\ud83c\udf19';
speedSlider.addEventListener('input',function(){speed=Math.pow(2,(this.value-4)/4);speedLabel.textContent=speed.toFixed(2)+'x';});
renderSVG();startRAF();setupEvents();buildChallenge();
skeleton.style.display='none';app.hidden=false;
document.addEventListener('keydown',function(e){if(e.key==='Escape'){if(!infoPanel.hidden)hideInfo();if(!completionOverlay.hidden)completionOverlay.hidden=true;}});
}catch(e){$('error-message').textContent=e&&e.message?e.message:'Error loading diagram';skeleton.style.display='none';errorBoundary.hidden=false;}}
function renderSVG(){var comps=cfg.components;var pad=10,cw=800,ch=440;var svg=document.createElementNS('http://www.w3.org/2000/svg','svg');
svg.setAttribute('viewBox','0 0 '+cw+' '+ch);svg.setAttribute('width','100%');svg.setAttribute('height','auto');svg.setAttribute('role','img');svg.setAttribute('aria-label',cfg.title);
var bg=document.createElementNS('http://www.w3.org/2000/svg','rect');bg.setAttribute('width',cw);bg.setAttribute('height',ch);bg.setAttribute('fill',theme==='light'?'#f0f2f5':'#141b2d');bg.setAttribute('rx','8');svg.appendChild(bg);
// Connections
for(var i=0;i<comps.length-1;i++){var n1=comps[i],n2=comps[i+1];if(n2.x===n1.x){continue;}
var x1=n1.x/100*cw+pad,y1=n1.y/100*ch+30,x2=n2.x/100*cw+pad,y2=n2.y/100*ch+30;
var line=document.createElementNS('http://www.w3.org/2000/svg','line');line.setAttribute('x1',x1);line.setAttribute('y1',y1);line.setAttribute('x2',x2);line.setAttribute('y2',y2);line.setAttribute('stroke',theme==='light'?'#cbd5e1':'#2a3a55');line.setAttribute('stroke-width','2');line.setAttribute('stroke-dasharray','6,4');svg.appendChild(line);
var ang=Math.atan2(y2-y1,x2-x1);var ax=x2-16*Math.cos(ang),ay=y2-16*Math.sin(ang);
var arr=document.createElementNS('http://www.w3.org/2000/svg','polygon');var s=6;arr.setAttribute('points',(ax-s*Math.cos(ang-0.5))+','+(ay-s*Math.sin(ang-0.5))+' '+x2+','+y2+' '+(ax-s*Math.cos(ang+0.5))+','+(ay-s*Math.sin(ang+0.5)));arr.setAttribute('fill',theme==='light'?'#cbd5e1':'#2a3a55');svg.appendChild(arr);}
// Nodes
comps.forEach(function(comp,i){var g=document.createElementNS('http://www.w3.org/2000/svg','g');g.setAttribute('class','node');g.setAttribute('data-id',i);g.setAttribute('role','button');g.setAttribute('tabindex','0');g.setAttribute('aria-label',comp.label+': '+comp.purpose);g.style.cursor='pointer';
var cx=comp.x/100*cw+pad,cy=comp.y/100*ch+30;
// Category badge
var badge=document.createElementNS('http://www.w3.org/2000/svg','rect');badge.setAttribute('x',cx-40);badge.setAttribute('y',cy-12);badge.setAttribute('width',80);badge.setAttribute('height',22);badge.setAttribute('rx','11');badge.setAttribute('fill',theme==='light'?'#e8f1fc':'rgba(9,89,200,0.2)');g.appendChild(badge);
var bt=document.createElementNS('http://www.w3.org/2000/svg','text');bt.setAttribute('x',cx);bt.setAttribute('y',cy+5);bt.setAttribute('fill','var(--brand)');bt.setAttribute('font-size','10');bt.setAttribute('font-weight','600');bt.setAttribute('text-anchor','middle');bt.setAttribute('font-family',"'Inter',sans-serif");bt.textContent=comp.cat;g.appendChild(bt);
// Node box
var box=document.createElementNS('http://www.w3.org/2000/svg','rect');box.setAttribute('x',cx-65);box.setAttribute('y',cy+18);box.setAttribute('width',130);box.setAttribute('height',48);box.setAttribute('rx','8');box.setAttribute('fill',theme==='light'?'#fff':'#1a2235');box.setAttribute('stroke',theme==='light'?'#cbd5e1':'#2a3a55');box.setAttribute('stroke-width','1.5');g.appendChild(box);
var lb=document.createElementNS('http://www.w3.org/2000/svg','text');lb.setAttribute('x',cx);lb.setAttribute('y',cy+48);lb.setAttribute('fill',theme==='light'?'#0a0e17':'#e9e8f0');lb.setAttribute('font-size','12');lb.setAttribute('font-weight','500');lb.setAttribute('text-anchor','middle');lb.setAttribute('font-family',"'Inter',sans-serif");lb.textContent=comp.label;g.appendChild(lb);
var idlb=document.createElementNS('http://www.w3.org/2000/svg','text');idlb.setAttribute('x',cx);idlb.setAttribute('y',cy+35);idlb.setAttribute('fill','#64748b');idlb.setAttribute('font-size','9');idlb.setAttribute('text-anchor','middle');idlb.setAttribute('font-family',"'Inter',sans-serif");idlb.textContent='#'+(i+1);g.appendChild(idlb);
// Flow dot
var dot=document.createElementNS('http://www.w3.org/2000/svg','circle');dot.setAttribute('cx',cx);dot.setAttribute('cy',cy+16);dot.setAttribute('r','5');dot.setAttribute('fill','var(--brand)');dot.setAttribute('class','pulse-dot');dot.setAttribute('data-index',i);g.appendChild(dot);
svg.appendChild(g);
g.addEventListener('click',function(idx){return function(){showNodeInfo(idx);}}(i));
g.addEventListener('keydown',function(idx){return function(e){if(e.key==='Enter'||e.key===' '){e.preventDefault();showNodeInfo(idx);}}}(i));});
container.appendChild(svg);}
function showNodeInfo(idx){var comp=cfg.components[idx];if(!comp)return;
var h='<span class="info-tag">'+comp.cat+'</span>';
h+='<p><strong>Purpose:</strong> '+comp.purpose+'</p>';
h+='<p><strong>Description:</strong> '+comp.desc+'</p>';
h+='<p><strong>How It Works:</strong> '+comp.how+'</p>';
h+='<p><strong>Why:</strong> '+comp.why+'</p>';
h+='<p><strong>Analogy:</strong> '+comp.analogy+'</p>';
h+='<p><strong>Fun Fact:</strong> '+comp.ffact+'</p>';
h+='<p><strong>Takeaway:</strong> '+comp.take+'</p>';
h+='<p><strong>Common Mistake:</strong> '+comp.mistake+'</p>';
infoTitle.textContent=comp.label;infoContent.innerHTML=h;infoPanel.hidden=false;infoPanel.removeAttribute('aria-hidden');activeNode=idx;
container.querySelectorAll('.node').forEach(function(n,i){n.classList.toggle('node-active',i===idx);});infoPanel.scrollTop=0;infoClose.focus();}
function hideInfo(){infoPanel.hidden=true;infoPanel.setAttribute('aria-hidden','true');activeNode=null;container.querySelectorAll('.node').forEach(function(n){n.classList.remove('node-active');});}
function setupEvents(){infoClose.addEventListener('click',hideInfo);themeBtn.addEventListener('click',toggleTheme);
completionClose.addEventListener('click',function(){completionOverlay.hidden=true;});
completionOverlay.addEventListener('click',function(e){if(e.target===completionOverlay)completionOverlay.hidden=true;});
submitBtn.addEventListener('click',gradeChallenge);}
function toggleTheme(){theme=theme==='light'?'dark':'light';document.documentElement.setAttribute('data-theme',theme);themeBtn.textContent=theme==='light'?'\u2600':'\ud83c\udf19';try{localStorage.setItem('diagram-theme',theme);}catch(e){}container.innerHTML='';renderSVG();}
function startRAF(){var lastTime=0;function loop(ts){if(!lastTime)lastTime=ts;var dt=(ts-lastTime)/1000;lastTime=ts;tick+=dt*speed;animateRAF();animId=requestAnimationFrame(loop);}animId=requestAnimationFrame(loop);}
function animateRAF(){var dots=container.querySelectorAll('.pulse-dot');var phase=Math.sin(tick*2)*3+4;dots.forEach(function(d,i){d.setAttribute('r',Math.abs(phase+Math.sin(tick+i)*2).toFixed(1));});}
function buildChallenge(){var mcqs=cfg.mcqs;if(!mcqs||!mcqs.length)return;var h='';mcqs.forEach(function(q,qi){h+='<div class="challenge-q"><h4>'+(qi+1)+'. '+q.q+'</h4><div class="challenge-options">';q.o.forEach(function(o,oi){h+='<label><input type="radio" name="q'+qi+'" value="'+oi+'" data-q="'+qi+'"><span>'+o+'</span></label>';});h+='</div></div>';});challengeContainer.innerHTML=h;}
function gradeChallenge(){var mcqs=cfg.mcqs;var correct=0,total=mcqs.length;mcqs.forEach(function(q,qi){var selected=qs('input[name="q'+qi+'"]:checked');var labels=qsa('.challenge-q')[qi].querySelectorAll('label');labels.forEach(function(l,oi){l.classList.remove('correct-answer','wrong-answer');if(oi===q.a)l.classList.add('correct-answer');if(selected&&parseInt(selected.value)===oi&&oi!==q.a)l.classList.add('wrong-answer');});if(selected&&parseInt(selected.value)===q.a)correct++;});
submitBtn.disabled=true;submitBtn.textContent='Completed';var pct=Math.round(correct/total*100);
completionScore.textContent=correct+'/'+total+' ('+pct+'%)';
completionTitle.textContent=pct>=80?'Excellent Work!':pct>=50?'Good Effort!':'Keep Practicing!';
completionMessage.textContent=pct>=80?'You really understand this topic!':pct>=50?'You are on the right track!':'Review the nodes above and try again.';
completionOverlay.hidden=false;completionClose.focus();}
function destroy(){if(animId)cancelAnimationFrame(animId);animId=null;}
if(document.readyState==='loading'){document.addEventListener('DOMContentLoaded',init);}else{init();}})();