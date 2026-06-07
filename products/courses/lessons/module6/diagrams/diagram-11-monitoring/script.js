(function(){'use strict';
var componentData=[{id:"cpu",label:"CPU Gauge",x:15,y:20,purpose:"Track CPU usage",desc:"Real-time processor utilization",how:"Prometheus node_exporter collects metrics",why:"Detect CPU bottlenecks",analogy:"Car tachometer",ffact:"CPU metrics use CFS quota tracking",take:"Alert on sustained high CPU",mistake:"Ignoring CPU trends",cat:"Metric"},{id:"memory",label:"Memory Gauge",x:40,y:20,purpose:"Track RAM usage",desc:"Memory consumption and pressure",how:"cAdvisor collects container memory",why:"OOM prevention",analogy:"Fuel gauge in a car",ffact:"Linux OOM killer terminates processes",take:"Set memory limits on containers",mistake:"No memory limits causes node issues",cat:"Metric"},{id:"requests",label:"Request Counter",x:65,y:20,purpose:"Track throughput",desc:"HTTP request rate per second",how:"Application metrics via /metrics endpoint",why:"Understand traffic patterns",analogy:"Turnstile counter at an event",ffact:"RED method: Rate Errors Duration",take:"Track request rates by endpoint",mistake:"Only tracking aggregate requests",cat:"Metric"},{id:"errors",label:"Error Rate",x:90,y:20,purpose:"Track failures",desc:"Percentage of failed requests",how:"Coded 5xx responses counted",why:"Detect service degradation",analogy:"Factory defect rate",ffact:"Alert on error rate increase >1%",take:"Log full error context for debugging",mistake:"Ignoring 4xx errors as client issues",cat:"Metric"},{id:"logs",label:"Log Stream",x:50,y:56,purpose:"Application logs",desc:"Real-time log aggregation",how:"Fluentd Logstash Loki collect logs",why:"Debug production issues",analogy:"Black box flight recorder",ffact:"Centralized logging is critical for debugging",take:"Use structured logging (JSON)",mistake:"Logging sensitive information",cat:"Tool"},{id:"alert",label:"Alert Manager",x:50,y:80,purpose:"Notify on issues",desc:"Configurable alert rules",how:"Prometheus Alertmanager + PagerDuty Slack",why:"Proactive incident response",analogy:"Fire alarm system",ffact:"Reduce alert fatigue with proper thresholds",take:"Set up runbooks for each alert",mistake:"Too many alerts desensitize the team",cat:"Tool"}];
var mcqData=[{q:"What does CPU monitoring track?",o:["Processor utilization","Memory usage","Disk space","Network speed"],a:0},{q:"What happens when container memory limit is exceeded?",o:["OOM killer terminates process","It slows down","It scales up","It logs a warning"],a:0},{q:"What does RED method stand for?",o:["Rate Errors Duration","Read Execute Delete","Rest Edit Deploy","Run Evaluate Debug"],a:0},{q:"What collects container metrics?",o:["cAdvisor","kubectl","Docker Compose","npm"],a:0},{q:"Why use structured logging?",o:["Easier to search and parse","Looks nicer","Uses less space","Runs faster"],a:0}];
var cfg={title:'Monitoring and Logging',subtitle:'Observability',desc:'Explore a live dashboard with CPU memory request and error gauges.',module:6,components:componentData,mcqs:mcqData};
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