(function(){'use strict';
try{
var components=[
{id:"ui",name:"User Interface",purpose:"The visual layer users interact with — buttons, screens, and controls",desc:"The user interface is what you see and interact with on your screen. It includes layout, colors, buttons, text, and all visual elements.",how:"UI frameworks render visual components using platform-specific APIs. Web browsers use HTML/CSS/JS, while mobile apps use SwiftUI or Jetpack Compose. User actions are captured as events and sent to the logic layer.",why:"The UI is the bridge between the user and the application's logic. Without it, users couldn't interact with the app's capabilities.",analogy:"Like the dashboard of a car — controls and displays you interact with to drive",fun:"The first graphical user interface was developed at Xerox PARC in 1973",takeaway:"The UI is the visible part of an app that users directly interact with. Good UI is intuitive, responsive, and accessible.",mistake:"UI isn't just about looks — it's about usability, accessibility, and clarity. A beautiful app that's hard to use fails its users."},
{id:"logic",name:"Application Logic",purpose:"The brain of the app — processes user actions, enforces rules, coordinates data",desc:"Application logic contains the rules, calculations, and decision-making code that makes the app function. It processes inputs and produces meaningful outputs.",how:"Logic is written in programming languages like JavaScript, Python, or Swift. It validates input, enforces business rules, manages state, and coordinates between UI and data layers using design patterns like MVC or clean architecture.",why:"Logic is what makes an app smart — it turns user actions into meaningful results and enforces the rules of the application.",analogy:"Like the engine of a car that processes fuel into motion",fun:"A typical mobile app contains between 10,000 and 100,000 lines of code",takeaway:"Application logic is the core intelligence that drives app behavior. Well-organized logic makes apps maintainable and testable.",mistake:"Logic isn't just if-statements — it includes validation, business rules, state management, error handling, and async coordination."},
{id:"data",name:"Data Storage",purpose:"Persists and retrieves information needed by the application",desc:"Data storage permanently saves application data — user profiles, settings, content, and transaction records — so it persists across sessions.",how:"Data is stored in databases (SQL or NoSQL), file systems, or cloud storage. The logic layer uses database drivers or ORMs to query, insert, update, and delete data through structured queries.",why:"Without persistent storage, all app data would be lost when you close it. Storage provides the memory that makes apps useful over time.",analogy:"Like a filing cabinet that keeps important documents organized and accessible",fun:"Modern apps often use 3-5 different database technologies simultaneously for different needs",takeaway:"Data storage provides the persistence that makes applications retain information across sessions and users.",mistake:"Storing everything in one database isn't always optimal — different types of data benefit from specialized storage solutions."},
{id:"network",name:"Network Layer",purpose:"Handles communication between the app and external services over the internet",desc:"The network layer manages all data transfer between the application and external servers, APIs, and services across the internet.",how:"The network layer uses protocols like HTTP/HTTPS, WebSockets, and TCP/IP. It handles DNS resolution, TLS encryption, connection pooling, retry logic, and data serialization/deserialization.",why:"Most modern apps need to communicate with remote servers to fetch data, sync state, and provide up-to-date information.",analogy:"Like a postal service that delivers letters and packages between different locations",fun:"The global internet transfers approximately 3 zettabytes of data per year",takeaway:"The network layer enables apps to communicate with the outside world — fetching data, syncing, and connecting services.",mistake:"Network requests are unreliable — always implement retry logic, timeouts, and graceful degradation for offline scenarios."},
{id:"user",name:"User",purpose:"The human who interacts with the application to accomplish tasks",desc:"Users are the reason applications exist. They interact with the UI to perform tasks, access information, and achieve their goals through the app.",how:"Users interact through touch, click, keyboard, voice, or gesture inputs. Their actions trigger events that flow through the UI → Logic → Data pipeline. User experience design optimizes this flow to be intuitive and efficient.",why:"Every design decision, feature, and line of code should ultimately serve the user's needs and goals.",analogy:"Like a driver who uses the car's controls to reach their destination",fun:"The average person checks their phone 96 times per day — that's once every 10 minutes",takeaway:"Users are the most important part of any application. Understanding user needs drives good design and development.",mistake:"Assuming users think like developers — users don't read manuals and expect intuitive, self-explanatory interfaces."},
{id:"api",name:"API Integration",purpose:"Connects the application to external services and third-party functionality",desc:"API integration enables apps to leverage external services — payment processing, maps, social media, AI, and more — without building them from scratch.",how:"The application sends HTTP requests to external API endpoints with authentication (API keys, OAuth). The API processes the request and returns data (typically JSON) that the app integrates into its own functionality.",why:"APIs let apps use specialized services built by others, dramatically accelerating development and adding powerful capabilities.",analogy:"Like plugging a USB drive into a computer — instant connection to additional functionality",fun:"Google alone provides over 200 different APIs for developers to integrate",takeaway:"API integration allows apps to extend their capabilities by leveraging specialized external services.",mistake:"APIs can change, go down, or have rate limits. Always handle API errors gracefully and have fallback plans."}
];
var nodes=[{id:"ui",x:300,y:70,w:130,h:56,color:"#0959C8",icon:"🖥"},{id:"logic",x:300,y:155,w:130,h:56,color:"#7c3aed",icon:"⚙"},{id:"data",x:300,y:240,w:130,h:56,color:"#059669",icon:"💾"},{id:"network",x:300,y:325,w:130,h:56,color:"#d97706",icon:"🌐"},{id:"user",x:100,y:110,w:110,h:48,color:"#0891b2",icon:"👤"},{id:"api",x:500,y:200,w:110,h:48,color:"#dc2626",icon:"🔗"}];
var connections=[{from:"user",to:"ui"},{from:"ui",to:"logic"},{from:"logic",to:"data"},{from:"data",to:"logic"},{from:"logic",to:"ui"},{from:"ui",to:"user"},{from:"api",to:"logic"},{from:"logic",to:"api"},{from:"network",to:"api"},{from:"api",to:"network"}];
var quiz=[
{q:"What is the primary purpose of the User Interface in an application?",opts:["To store user data securely","To provide the visual layer users interact with","To process business logic","To handle network requests"],ans:1},
{q:"Application logic is best described as:",opts:["The visual design of an app","The database structure","The brain of the app that processes actions and enforces rules","The network connection to servers"],ans:2},
{q:"What happens when you close an app that has no data persistence?",opts:["Your data is saved automatically","Your data is lost because there's no permanent storage","Your data is uploaded to the cloud","Your data is emailed to you"],ans:1},
{q:"Why do modern apps use API integration?",opts:["To make the app slower","To replace the database","To leverage external services without building them from scratch","To remove the user interface"],ans:2},
{q:"Which layer acts as the bridge between the user and the app's capabilities?",opts:["The Database","The Network Layer","The User Interface","The API Gateway"],ans:2},
{q:"What is a common mistake developers make about the UI layer?",opts:["Making it too colorful","Thinking UI is just about looks, not usability","Adding too many animations","Using too few colors"],ans:1}
];
var app=document.getElementById('app'),skeleton=document.getElementById('skeleton'),errorBoundary=document.getElementById('error-boundary'),errorMsg=document.getElementById('error-message'),container=document.getElementById('diagram-container'),infoPanel=document.getElementById('info-panel'),infoContent=document.getElementById('info-content'),speedSlider=document.getElementById('speed-slider'),speedVal=document.getElementById('speed-val'),playBtn=document.getElementById('play-btn'),challengeSection=document.getElementById('challenge-section'),challengeQuestions=document.getElementById('challenge-questions'),challengeResult=document.getElementById('challenge-result'),completionOverlay=document.getElementById('completion-overlay'),completionScore=document.getElementById('completion-score'),completionMsg=document.getElementById('completion-msg'),challengeBtn=document.getElementById('challenge-btn'),themeToggle=document.getElementById('theme-toggle');
var t=0,playing=true,selectedId=null,theme=localStorage.getItem('consica-theme')||'dark',speed=1;
var animId=null,svg=null,flowDots=[],pulseRings=[];

function setTheme(t){document.documentElement.setAttribute('data-theme',t==='light'?'light':'');localStorage.setItem('consica-theme',t);theme=t}
function toggleTheme(){setTheme(theme==='dark'?'light':'dark')}
setTheme(theme);

function buildSVG(){
var W=640,H=420,gap=16;
var ns='http://www.w3.org/2000/svg';
svg=document.createElementNS(ns,'svg');
svg.setAttribute('viewBox','0 0 '+W+' '+H);
svg.setAttribute('width','100%');
svg.setAttribute('height','100%');
svg.setAttribute('role','img');
svg.setAttribute('aria-label','App layers diagram with 6 interactive nodes');
var defs=document.createElementNS(ns,'defs');
defs.innerHTML='<marker id="arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0,0 L10,5 L0,10" fill="var(--accent2, #3b82f6)"/></marker><linearGradient id="bg-grad" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="var(--surface, #131b2e)"/><stop offset="100%" stop-color="var(--surface2, #1a2338)"/></linearGradient><filter id="glow"><feGaussianBlur stdDeviation="3" result="blur"/><feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge></filter>';
svg.appendChild(defs);
var bg=document.createElementNS(ns,'rect');
bg.setAttribute('width',W);bg.setAttribute('height',H);bg.setAttribute('fill','url(#bg-grad)');bg.setAttribute('rx','12');
svg.appendChild(bg);
var tiers=[
{label:"Presentation Layer",y:55,h:80,color:"rgba(9,89,200,.08)"},
{label:"Logic Layer",y:142,h:80,color:"rgba(124,58,237,.08)"},
{label:"Data Layer",y:228,h:80,color:"rgba(5,150,105,.08)"},
{label:"Network Layer",y:315,h:80,color:"rgba(217,119,6,.08)"}
];
tiers.forEach(function(tier){
var r=document.createElementNS(ns,'rect');
r.setAttribute('x',40);r.setAttribute('y',tier.y);r.setAttribute('width',W-80);r.setAttribute('height',tier.h);
r.setAttribute('fill',tier.color);r.setAttribute('rx','8');r.setAttribute('stroke','var(--border)');r.setAttribute('stroke-width','1');
svg.appendChild(r);
var lbl=document.createElementNS(ns,'text');
lbl.setAttribute('x',55);lbl.setAttribute('y',tier.y+20);
lbl.setAttribute('fill','var(--text2)');lbl.setAttribute('font-size','11');lbl.setAttribute('font-weight','600');
lbl.setAttribute('font-family',"'Inter',sans-serif");
lbl.textContent=tier.label;
svg.appendChild(lbl);
});
connections.forEach(function(c){
var from=nodes.find(function(n){return n.id===c.from});
var to=nodes.find(function(n){return n.id===c.to});
if(!from||!to)return;
var x1=from.x+from.w/2,y1=from.y+from.h/2,x2=to.x+to.w/2,y2=to.y+to.h/2;
var dx=x2-x1,dy=y2-y1;
var dist=Math.sqrt(dx*dx+dy*dy);
var mx=from.w/2+4,my=from.h/2+4;
var startX=x1+(dx/dist)*mx,startY=y1+(dy/dist)*my;
var endX=x2-(dx/dist)*mx,endY=y2-(dy/dist)*my;
var line=document.createElementNS(ns,'line');
line.setAttribute('x1',startX);line.setAttribute('y1',startY);
line.setAttribute('x2',endX);line.setAttribute('y2',endY);
line.setAttribute('stroke','var(--accent2)');line.setAttribute('stroke-width','2');
line.setAttribute('opacity','0.4');line.setAttribute('marker-end','url(#arrow)');
svg.appendChild(line);
var dot=document.createElementNS(ns,'circle');
dot.setAttribute('r','4');
dot.setAttribute('fill','var(--accent2)');
dot.setAttribute('opacity','0.8');
dot.setAttribute('class','flow-dot');
svg.appendChild(dot);
flowDots.push({el:dot,sx:startX,sy:startY,ex:endX,ey:endY,progress:Math.random()});
});
var nodeGroups=[];
nodes.forEach(function(n,idx){
var g=document.createElementNS(ns,'g');
g.setAttribute('class','node-clickable');
g.setAttribute('tabindex','0');
g.setAttribute('role','button');
g.setAttribute('aria-label',components.find(function(c){return c.id===n.id}).name);
g.setAttribute('data-id',n.id);
var rect=document.createElementNS(ns,'rect');
rect.setAttribute('x',n.x);rect.setAttribute('y',n.y);
rect.setAttribute('width',n.w);rect.setAttribute('height',n.h);
rect.setAttribute('rx','8');rect.setAttribute('fill',n.color);
rect.setAttribute('opacity','0.9');rect.setAttribute('class','node-bg');
g.appendChild(rect);
var icon=document.createElementNS(ns,'text');
icon.setAttribute('x',n.x+16);icon.setAttribute('y',n.y+n.h/2+6);
icon.setAttribute('font-size','20');icon.setAttribute('text-anchor','middle');
icon.textContent=n.icon;
g.appendChild(icon);
var lbl=document.createElementNS(ns,'text');
lbl.setAttribute('x',n.x+36);lbl.setAttribute('y',n.y+n.h/2+5);
lbl.setAttribute('fill','#fff');lbl.setAttribute('font-size','12');
lbl.setAttribute('font-weight','600');lbl.setAttribute('font-family',"'Inter',sans-serif");
lbl.setAttribute('class','node-label');
lbl.textContent=components.find(function(c){return c.id===n.id}).name;
g.appendChild(lbl);
g.addEventListener('click',function(){selectNode(n.id);});
g.addEventListener('keydown',function(e){if(e.key==='Enter'||e.key===' '){e.preventDefault();selectNode(n.id);}});
svg.appendChild(g);
nodeGroups.push(g);
});
container.innerHTML='';
container.appendChild(svg);
}
function selectNode(id){
selectedId=id;
var comp=components.find(function(c){return c.id===id});
if(!comp)return;
infoPanel.hidden=false;
var html='<h3>'+comp.name+'</h3>';
html+='<div class="info-tags"><span class="info-tag">Purpose</span></div>';
html+='<p><strong>🎯 Purpose:</strong> '+comp.purpose+'</p>';
html+='<h4>📝 Description</h4><p>'+comp.desc+'</p>';
html+='<h4>⚙️ How It Works</h4><p>'+comp.how+'</p>';
html+='<h4>💡 Why It Matters</h4><p>'+comp.why+'</p>';
html+='<h4>🔗 Analogy</h4><p>'+comp.analogy+'</p>';
html+='<h4>🎲 Fun Fact</h4><p>'+comp.fun+'</p>';
html+='<h4>✅ Key Takeaway</h4><p>'+comp.takeaway+'</p>';
html+='<h4>⚠️ Common Mistake</h4><p>'+comp.mistake+'</p>';
infoContent.innerHTML=html;
infoPanel.scrollIntoView({behavior:'smooth',block:'nearest'});
var groups=container.querySelectorAll('.node-clickable');
groups.forEach(function(g){
if(g.getAttribute('data-id')===id)g.classList.add('node-active');
else g.classList.remove('node-active');
});
}
function closeInfo(){infoPanel.hidden=true;selectedId=null;container.querySelectorAll('.node-active').forEach(function(g){g.classList.remove('node-active');});}
function togglePlay(){playing=!playing;playBtn.textContent=playing?'⏸ Pause':'▶ Play';playBtn.setAttribute('aria-label',playing?'Pause animation':'Play animation');}
speedSlider.addEventListener('input',function(){
var v=parseInt(speedSlider.value);
speed=0.25+((v/16)*3.75);
speedVal.textContent=speed.toFixed(2)+'×';
});

function animate(ts){
if(!ts)ts=0;
if(playing){
t+=0.016*speed;
flowDots.forEach(function(dot){
dot.progress+=0.008*speed;
if(dot.progress>1)dot.progress=0;
var p=dot.progress;
dot.el.setAttribute('cx',dot.sx+(dot.ex-dot.sx)*p);
dot.el.setAttribute('cy',dot.sy+(dot.ey-dot.sy)*p);
var pulse=pulseRings[flowDots.indexOf(dot)];
if(pulse){
var r=4+p*12;
pulse.setAttribute('r',r);
pulse.setAttribute('opacity',1-p);
}
});
}
animId=requestAnimationFrame(animate);
}

function buildChallenge(){
challengeQuestions.innerHTML='';
quiz.forEach(function(q,idx){
var b=document.createElement('div');
b.className='question-block';
b.innerHTML='<h3>'+(idx+1)+'. '+q.q+'</h3>';
q.opts.forEach(function(o,i){
b.innerHTML+='<div class="q-option"><input type="radio" name="q'+idx+'" id="q'+idx+'_'+i+'" value="'+i+'"><label for="q'+idx+'_'+i+'">'+o+'</label></div>';
});
challengeQuestions.appendChild(b);
});
challengeBtn.hidden=false;
}
function submitChallenge(){
var score=0,total=quiz.length;
quiz.forEach(function(q,idx){
var sel=document.querySelector('input[name="q'+idx+'"]:checked');
var blocks=document.querySelectorAll('.question-block');
var opts=blocks[idx].querySelectorAll('.q-option');
opts.forEach(function(o){o.classList.remove('correct','wrong');});
var fb=blocks[idx].querySelector('.q-feedback');
if(fb)fb.remove();
if(sel){
var val=parseInt(sel.value);
if(val===q.ans){
opts[q.ans].classList.add('correct');
score++;
}else{
opts[q.ans].classList.add('correct');
opts[val].classList.add('wrong');
}
}else{
opts[q.ans].classList.add('correct');
}
var fbDiv=document.createElement('div');
fbDiv.className='q-feedback '+(sel&&parseInt(sel.value)===q.ans?'correct':'wrong');
fbDiv.textContent=sel&&parseInt(sel.value)===q.ans?'✓ Correct!':'✗ The correct answer was option '+(q.ans+1);
blocks[idx].appendChild(fbDiv);
});
challengeResult.hidden=false;
var pct=Math.round(score/total*100);
challengeResult.innerHTML='<h3>Score: '+score+'/'+total+' ('+pct+'%)</h3><p>'+(pct>=80?'Great job! You have a solid understanding of app layers.':pct>=50?'Good start! Review the nodes above to strengthen your knowledge.':'Keep exploring! Click each node to learn more about app architecture.')+'</p>';
if(pct>=80){
completionOverlay.hidden=false;
completionScore.textContent='You scored '+score+'/'+total+' ('+pct+'%)';
completionMsg.textContent='You have a strong understanding of what makes an application work — from the UI to the database and everything in between!';
}
}
function closeCompletion(){completionOverlay.hidden=true;}
function showChallenge(){challengeSection.hidden=!challengeSection.hidden;if(!challengeSection.hidden)challengeSection.scrollIntoView({behavior:'smooth'});}

function init(){
buildSVG();
buildChallenge();
animId=requestAnimationFrame(animate);
challengeBtn.hidden=false;
setTimeout(function(){
skeleton.style.opacity='0';
skeleton.style.transition='opacity .4s';
setTimeout(function(){skeleton.hidden=true;},400);
app.hidden=false;
},600);
}
init();

window.addEventListener('unload',function(){
if(animId)cancelAnimationFrame(animId);
});
window.selectNode=selectNode;
window.closeInfo=closeInfo;
window.togglePlay=togglePlay;
window.toggleTheme=toggleTheme;
window.showChallenge=showChallenge;
window.submitChallenge=submitChallenge;
window.closeCompletion=closeCompletion;
}catch(e){
document.getElementById('skeleton').hidden=true;
var eb=document.getElementById('error-boundary');
eb.hidden=false;
document.getElementById('error-message').textContent=e.message||'Failed to initialize diagram';
console.error('Diagram init error:',e);
}
})();