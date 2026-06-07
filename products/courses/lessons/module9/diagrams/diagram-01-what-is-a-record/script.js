(function(){'use strict';
var theme=localStorage.getItem('consica-theme')||'dark';
document.documentElement.setAttribute('data-theme',theme);
var app,container,skeleton,errorBoundary,errorMsg,svgContainer,infoTitle,infoDesc,stepsList,playBtn,resetBtn,speedSlider,speedVal,themeBtn,challengeOverlay,challengeBody,challengeClose,completionOverlay,completionScore,completionClose,challengeBtn,rafId,animating=false,t=0,activeNode=null,nodes=[],connections=[],flowDots=[],speed=1,challengeState={questions:[],current:0,answers:{},submitted:false};

var components=[
{id:'ml',name:'Machine Learning',sublabel:'Learning from data',desc:'The core of modern AI - systems that learn patterns from data without explicit programming for every task.',purpose:'Enable computers to learn from experience',how:'Feed large datasets through algorithms that adjust internal parameters to minimize error',why:'Scales beyond human programming capacity',analogy:'Teaching a child through examples instead of rule books',funFact:'ML models consume over 80% of AI computing power worldwide',takeaway:'ML is the engine driving most AI breakthroughs',mistake:'ML does not imply true understanding - it finds statistical patterns'},
{id:'nlp',name:'NLP',sublabel:'Language understanding',desc:'Natural Language Processing enables machines to read, interpret, and generate human language with contextual awareness.',purpose:'Bridge human communication and machine understanding',how:'Tokenize text, embed words as vectors, process through transformer networks',why:'80% of world data is unstructured text',analogy:'A translator that learns idioms and context, not just dictionary words',funFact:'GPT-4 has over 1 trillion parameters for language understanding',takeaway:'NLP powers everything from search to chatbots',mistake:'NLP models can inherit and amplify biases in training text'},
{id:'vision',name:'Computer Vision',sublabel:'Visual understanding',desc:'Computer Vision teaches machines to interpret and understand the visual world through cameras and image data.',purpose:'Extract meaning from pixels and video',how:'Convolutional neural networks detect edges, shapes, then objects through hierarchical layers',why:'Visual data makes up 90% of internet traffic',analogy:'Teaching a machine to see like a human retina-to-brain pipeline',funFact:'Self-driving cars process 2+ million pixels per second',takeaway:'Vision AI detects what humans might miss',mistake:'Vision models struggle with adversarial examples - tiny pixel changes fool them'},
{id:'robotics',name:'Robotics',sublabel:'Physical interaction',desc:'Robotics combines AI with mechanical systems to create machines that perceive, decide, and act in the physical world.',purpose:'Automate physical tasks intelligently',how:'Sensor fusion + planning algorithms + control theory + ML for adaptation',why:'Automates dangerous or repetitive physical labor',analogy:'A brain (AI) connected to a body (motors, sensors)',funFact:'Boston Dynamics robots can backflip using AI balance algorithms',takeaway:'Robotics extends AI into the physical realm',mistake:'Real-world robotics is much harder than simulation - friction, wear, uncertainty'},
{id:'reasoning',name:'Reasoning & Planning',sublabel:'Logical decision-making',desc:'AI reasoning systems simulate logical deduction, planning sequences of actions, and making decisions under uncertainty.',purpose:'Make optimal decisions in complex environments',how:'Search algorithms, probabilistic inference, game theory, and reinforcement learning',why:'Bridges perception to action with strategic thinking',analogy:'A chess grandmaster thinking 20 moves ahead',funFact:'AlphaGo\'s Move 37 in game 2 against Lee Sedol was called "beautiful" by pros',takeaway:'Reasoning AI can outperform humans in constrained domains',mistake:'AI reasoning is brittle - small changes can break logical chains'},
{id:'genai',name:'Generative AI',sublabel:'Creating new content',desc:'Generative AI creates novel content - text, images, music, code - by learning the underlying distribution of training data.',purpose:'Produce original human-like content',how:'Large neural networks trained on massive datasets predict and generate sequences',why:'Enables creativity at unprecedented scale',analogy:'An artist who studied millions of paintings to create original works',funFact:'Stable Diffusion was trained on 2.3 billion images',takeaway:'Generative AI augments human creativity',mistake:'GenAI can hallucinate - generate plausible but false information'}
];

var connectionsData=[
{from:'ml',to:'nlp'},{from:'ml',to:'vision'},{from:'ml',to:'robotics'},{from:'ml',to:'reasoning'},{from:'ml',to:'genai'},
{nlp:'nlp',to:'genai'},{from:'vision',to:'genai'},{from:'reasoning',to:'robotics'}
];

var stepsData=[
{id:'ml',label:'Machine Learning - core engine learns patterns from data'},
{id:'nlp',label:'NLP - processes and generates human language'},
{id:'vision',label:'Computer Vision - interprets visual information'},
{id:'robotics',label:'Robotics - AI interacting with physical world'},
{id:'reasoning',label:'Reasoning - strategic decision-making and planning'},
{id:'genai',label:'Generative AI - creates original content from learned patterns'}
];

var challenges=[
{q:'What is the primary function of Machine Learning?',o:['To follow pre-programmed rules','To learn patterns from data without explicit programming','To store large amounts of information','To connect to the internet'],a:1},
{q:'Which AI subfield enables machines to understand human language?',o:['Computer Vision','Robotics','NLP','Generative AI'],a:2},
{q:'What does Computer Vision primarily work with?',o:['Text data','Audio signals','Pixels and images','Database records'],a:2},
{q:'What is a key limitation of AI reasoning systems?',o:['They are too slow','They are brittle - small changes can break logical chains','They cannot handle math','They require internet access'],a:1},
{q:'Generative AI models can sometimes produce plausible but false information. This is called:',
o:['Overfitting','Hallucination','Gradient descent','Tokenization'],a:1},
{q:'How does robotics combine with AI?',o:['It does not - they are separate fields','By adding AI planning and perception to physical systems','By making robots larger','By removing sensors'],a:1}
];

function init(){app=document.getElementById('app');container=document.getElementById('diagram-container');skeleton=document.getElementById('loading-skeleton');errorBoundary=document.getElementById('error-boundary');errorMsg=document.getElementById('error-message');svgContainer=document.getElementById('svg-container');infoTitle=document.getElementById('info-title');infoDesc=document.getElementById('info-desc');stepsList=document.getElementById('steps-list');playBtn=document.getElementById('play-btn');resetBtn=document.getElementById('reset-btn');speedSlider=document.getElementById('speed-slider');speedVal=document.getElementById('speed-value');themeBtn=document.getElementById('theme-toggle');challengeOverlay=document.getElementById('challenge-overlay');challengeBody=document.getElementById('challenge-body');challengeClose=document.getElementById('challenge-close');completionOverlay=document.getElementById('completion-overlay');completionScore=document.getElementById('completion-score');completionClose=document.getElementById('completion-close');challengeBtn=document.getElementById('challenge-btn');
try{buildDiagram();setupControls();setupChallenge();showContainer();}catch(e){showError(e.message||'Failed to build diagram');}}
function showContainer(){skeleton.classList.add('hidden');container.classList.remove('hidden');}
function showError(msg){skeleton.classList.add('hidden');errorBoundary.classList.remove('hidden');errorMsg.textContent=msg;}

function buildDiagram(){
var W=800,H=500,pad=40;
var svg=svgCreate('svg',{viewBox:'0 0 '+W+' '+H,role:'img','aria-label':'AI concept map showing Machine Learning as central hub connected to NLP, Computer Vision, Robotics, Reasoning, and Generative AI'});
svgContainer.appendChild(svg);
var defs=svgCreate('defs');
svg.appendChild(defs);
defs.innerHTML='<marker id="arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="8" markerHeight="8" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 z" fill="var(--conn-stroke)"/></marker>'
+'<marker id="arrowLight" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="8" markerHeight="8" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 z" fill="#94a3b8"/></marker>'
+'<filter id="glow"><feGaussianBlur stdDeviation="3" result="blur"/><feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge></filter>';

var positions={ml:{x:400,y:100},nlp:{x:180,y:220},vision:{x:620,y:220},robotics:{x:130,y:370},reasoning:{x:390,y:370},genai:{x:670,y:370}};
var sizes={w:150,h:52};

connectionsData.forEach(function(c){
var f=positions[c.from],t=positions[c.to];
var line=svgCreate('line',{x1:f.x,y1:f.y+sizes.h/2,x2:t.x,y2:t.y-sizes.h/2,class:'connection-line',stroke:'var(--conn-stroke)','marker-end':'url(#arrow)'});
svg.appendChild(line);
var cx=(f.x+t.x)/2,cy=(f.y+sizes.h/2+t.y-sizes.h/2)/2;
var fd=svgCreate('circle',{class:'flow-dot',cx:cx,cy:cy,r:0,fill:'var(--accent)'});
svg.appendChild(fd);
flowDots.push({el:fd,sx:f.x,sy:f.y+sizes.h/2,ex:t.x,ey:t.y-sizes.h/2});
});

components.forEach(function(cp){
var p=positions[cp.id];
var g=svgCreate('g',{class:'node-g',tabIndex:0,role:'button','aria-label':cp.name+': '+cp.sublabel,'aria-describedby':'info-desc'});
g.dataset.id=cp.id;
var rx=svgCreate('rect',{x:p.x-sizes.w/2,y:p.y-sizes.h/2,width:sizes.w,height:sizes.h,rx:10,class:'node-rect'});
g.appendChild(rx);
var lbl=svgCreate('text',{x:p.x,y:p.y-4,class:'node-label',fill:'var(--text)'});
lbl.textContent=cp.name;
g.appendChild(lbl);
var slbl=svgCreate('text',{x:p.x,y:p.y+14,class:'node-sublabel'});
slbl.textContent=cp.sublabel;
g.appendChild(slbl);
g.addEventListener('click',function(){selectNode(cp.id);});
g.addEventListener('keydown',function(e){if(e.key==='Enter'||e.key===' '){e.preventDefault();selectNode(cp.id);}});
svg.appendChild(g);
nodes.push({el:g,data:cp,pos:p});
});

function svgCreate(tag,attrs){var el=document.createElementNS('http://www.w3.org/2000/svg',tag);for(var k in attrs)el.setAttribute(k,attrs[k]);return el;}

var selected=false;
components.forEach(function(c){if(!selected){selectNode(c.id);selected=true;}});

renderSteps();
}

function selectNode(id){
activeNode=id;
var cp=getComp(id);
if(!cp)return;
nodes.forEach(function(n){var r=n.el.querySelector('.node-rect');if(r)r.classList.toggle('active',n.data.id===id);});
infoTitle.textContent=cp.name+' - '+cp.sublabel;
infoDesc.innerHTML='<strong>Purpose:</strong> '+cp.purpose+'<br><br><strong>How it works:</strong> '+cp.how+'<br><br><strong>Why it matters:</strong> '+cp.why+'<br><br><strong>Analogy:</strong> '+cp.analogy+(cp.funFact?'<br><br><strong>Fun fact:</strong> '+cp.funFact:'')+'<br><br><strong>Key takeaway:</strong> '+cp.takeaway+'<br><br><strong>Common mistake:</strong> '+cp.mistake;
var items=stepsList.querySelectorAll('li');
items.forEach(function(li){li.classList.toggle('active',li.dataset.id===id);});
}
function getComp(id){for(var i=0;i<components.length;i++){if(components[i].id===id)return components[i];}return null;}

function renderSteps(){
stepsList.innerHTML='';
components.forEach(function(c){
var li=document.createElement('li');
li.dataset.id=c.id;
li.textContent=c.name+' - '+c.sublabel;
li.tabIndex=0;
li.addEventListener('click',function(){selectNode(c.id);});
li.addEventListener('keydown',function(e){if(e.key==='Enter'||e.key===' '){e.preventDefault();selectNode(c.id);}});
stepsList.appendChild(li);
});
}

function animateDiagram(){
var start=performance.now();
var dots=flowDots;
function frame(now){
if(!animating){rafId=null;return;}
var dt=(now-start)/1000*speed;
t=(t+dt)%1;
dots.forEach(function(d){var p=t;d.el.setAttribute('cx',d.sx+(d.ex-d.sx)*p);d.el.setAttribute('cy',d.sy+(d.ey-d.sy)*p);d.el.setAttribute('r',4);});
rafId=requestAnimationFrame(frame);
}
rafId=requestAnimationFrame(frame);
}

function setupControls(){
themeBtn.addEventListener('click',function(){theme=theme==='dark'?'light':'dark';document.documentElement.setAttribute('data-theme',theme);localStorage.setItem('consica-theme',theme);});
playBtn.addEventListener('click',function(){animating=!animating;if(animating){playBtn.innerHTML='&#9646;&#9646;';animateDiagram();}else{playBtn.innerHTML='&#9654;';if(rafId){cancelAnimationFrame(rafId);rafId=null;}}});
resetBtn.addEventListener('click',function(){t=0;flowDots.forEach(function(d){d.el.setAttribute('r',0);});if(animating){animating=false;playBtn.innerHTML='&#9654;';if(rafId){cancelAnimationFrame(rafId);rafId=null;}}});
speedSlider.addEventListener('input',function(){speed=parseFloat(this.value);speedVal.textContent=speed+'x';});
speedSlider.addEventListener('keydown',function(e){var v=parseFloat(this.value);if(e.key==='ArrowRight'){this.value=Math.min(4,v+0.25);}else if(e.key==='ArrowLeft'){this.value=Math.max(0.25,v-0.25);}speed=parseFloat(this.value);speedVal.textContent=speed+'x';});
document.addEventListener('keydown',function(e){
if(e.key==='Escape'){challengeOverlay.classList.add('hidden');completionOverlay.classList.add('hidden');}
});
}

function setupChallenge(){
challengeBtn.addEventListener('click',function(){openChallenge();});
challengeClose.addEventListener('click',function(){challengeOverlay.classList.add('hidden');});
completionClose.addEventListener('click',function(){completionOverlay.classList.add('hidden');challengeOverlay.classList.add('hidden');});
}

function openChallenge(){
challengeState.questions=challenges.slice().sort(function(){return Math.random()-0.5;}).slice(0,5);
challengeState.current=0;challengeState.answers={};challengeState.submitted=false;
challengeOverlay.classList.remove('hidden');
renderQuestion();
}

function renderQuestion(){
var q=challengeState.questions[challengeState.current];
if(!q){finishChallenge();return;}
var html='<div class="question"><div class="question-text">'+(challengeState.current+1)+'. '+q.q+'</div><div class="options">';
q.o.forEach(function(opt,i){
var sel=challengeState.answers[challengeState.current]===i?' selected':'';
var cls=challengeState.submitted?(i===q.a?' correct':(challengeState.answers[challengeState.current]===i?' wrong':'')):'';
html+='<label class="option-label'+sel+cls+'"><input type="radio" name="q'+challengeState.current+'" value="'+i+'"'+(challengeState.submitted?' disabled':'')+(sel?' checked':'')+' onchange="('+selectOption.toString()+')('+challengeState.current+','+i+')">'+opt+'</label>';
});
html+='</div></div>';
html+='<div class="challenge-actions">';
if(!challengeState.submitted){
html+='<button class="btn-primary" onclick="('+submitChallenge.toString()+')()">Submit Answer</button>';
}else{
if(challengeState.current<challengeState.questions.length-1){
html+='<button class="btn-primary" onclick="('+nextQuestion.toString()+')()">Next Question</button>';
}else{
html+='<button class="btn-primary" onclick="('+finishChallenge.toString()+')()">See Results</button>';
}
}
html+='</div>';
challengeBody.innerHTML=html;
}
function selectOption(qIdx,optIdx){if(challengeState.submitted)return;challengeState.answers[qIdx]=optIdx;renderQuestion();}
function submitChallenge(){challengeState.submitted=true;renderQuestion();}
function nextQuestion(){challengeState.current++;challengeState.submitted=false;renderQuestion();}
function finishChallenge(){
var correct=0,total=challengeState.questions.length;
challengeState.questions.forEach(function(q,i){
if(challengeState.answers[i]===q.a)correct++;
});
completionScore.textContent='You scored '+correct+'/'+total;
completionOverlay.classList.remove('hidden');
}

var debounce;
window.addEventListener('resize',function(){clearTimeout(debounce);debounce=setTimeout(function(){},200);});

document.addEventListener('DOMContentLoaded',init);
if(document.readyState==='complete'||document.readyState==='interactive')init();
})();
