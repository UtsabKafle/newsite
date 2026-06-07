(function(){
'use strict';
var $=function(s,c){return(c||document).querySelector(s)};
var $$=function(s,c){return Array.from((c||document).querySelectorAll(s))};
var ce=function(t,a,c){var e=document.createElement(t);if(a)Object.entries(a).forEach(function(kv){var k=kv[0],v=kv[1];if(k==='className')e.className=v;else if(k==='style'&&typeof v==='object')Object.assign(e.style,v);else if(k==='dataset')Object.assign(e.dataset,v);else e.setAttribute(k,v)});if(c)c.forEach(function(x){if(typeof x==='string')e.appendChild(document.createTextNode(x));else if(x)e.appendChild(x)});return e};
var techs=[{id:'chiplets',name:'Chiplet Architecture',color:'#3b82f6',desc:'CPU built from smaller dies connected via high-speed interconnects like Infinity Fabric. Improves yields and allows mixed process nodes.',analogy:'Like building a house from prefabricated rooms.',detail:'AMD Ryzen uses up to 8 CCDs + I/O die. Each die can use optimal process node. Smaller dies have fewer defects. Inter-die latency is higher than monolithic.'},{id:'3d',name:'3D Die Stacking',color:'#10b981',desc:'Stacking dies vertically with TSVs (through-silicon vias) for denser integration of compute, cache, and memory.',analogy:'Like building skyscrapers instead of spreading out.',detail:'AMD 3D V-Cache stacks 64MB SRAM on CPU die. TSVs connect layers vertically. Hybrid bonding creates dense interconnects. Thermal management is the major challenge.'},{id:'photon',name:'Photonic Computing',color:'#eab308',desc:'Uses light instead of electricity for data transmission. Enables ultra-fast, low-power interconnects.',analogy:'Like fiber optic cables replacing copper wires.',detail:'Silicon photonics integrates optical components on-chip. Light has no resistance or capacitance. Photonic interconnects could replace electrical buses. Still in research phase.'},{id:'quantum',name:'Quantum Computing',color:'#a855f7',desc:'Leverages qubits (superposition/entanglement) for computation exponentially faster than classical for specific problems.',analogy:'Like flipping all pages of a book at once instead of one by one.',detail:'Qubits exist in superposition of 0 and 1. Quantum entanglement links qubits. Error correction is a major challenge. Requires near-absolute-zero temperatures. Not replacing classical CPUs.'},{id:'graphene',name:'Graphene Transistors',color:'#06b6d4',desc:'Carbon-based transistors that could replace silicon. Higher electron mobility means faster switching at lower power.',analogy:'Like replacing a highway with a hyperloop.',detail:'Graphene has 100x higher electron mobility than silicon. Single-atom thick. No bandgap limits digital applications. Researchers are exploring bilayer graphene. Commercialization is years away.'}];
var quizData={questions:[{q:'What is the main advantage of chiplet architecture?',options:['Faster performance','Better manufacturing yields','Lower power','Smaller size'],answer:1},{q:'What technology enables 3D die stacking?',options:['PCIe','TSVs (Through-Silicon Vias)','USB','SATA'],answer:1},{q:'Photonic computing uses what instead of electricity?',options:['Sound','Light','Magnetism','Heat'],answer:1},{q:'What state do qubits exist in?',options:['Only 0','Only 1','Superposition','Binary'],answer:2},{q:'How much higher is graphene\'s electron mobility vs silicon?',options:['2x','10x','100x','1000x'],answer:2},{q:'Which company popularized chiplet architecture?',options:['Intel','AMD','ARM','NVIDIA'],answer:1}],maxAttempts:2};
var state={speed:1,rafId:null,t:0,selectedId:null,challengeDone:false,challengeIdx:0,quizResults:[]};
function getTheme(){return localStorage.getItem('consica-theme')||'dark'}
function setTheme(t){localStorage.setItem('consica-theme',t);document.documentElement.setAttribute('data-theme',t==='light'?'light':'')}
var dom={};
function initDOM(){dom={loading:$('#loading-skeleton'),error:$('#error-boundary'),container:$('#diagram-container'),viz:$('#visualization'),info:$('#info-panel'),infoTitle:$('#info-title'),infoDesc:$('#info-desc'),infoAnalogy:$('#info-analogy'),infoDetail:$('#info-detail'),infoClose:$('#info-close'),speed:$('#speed-slider'),speedLabel:$('#speed-label'),theme:$('#theme-toggle'),help:$('#help-btn'),challenge:$('#challenge-container'),completion:$('#completion-overlay'),completionMsg:$('#completion-msg'),completionReset:$('#completion-reset'),errMsg:$('#error-message')}}
function showError(m){if(dom.error){dom.error.hidden=false;if(dom.errMsg)dom.errMsg.textContent=m}if(dom.container)dom.container.hidden=true;if(dom.loading)dom.loading.hidden=true}
function showInfo(data){if(!dom.info)return;dom.infoTitle.textContent=data.name||'';dom.infoDesc.textContent=data.desc||'';dom.infoAnalogy.textContent=data.analogy?'💡 '+data.analogy:'';dom.infoDetail.textContent=data.detail||'';dom.info.hidden=false;state.selectedId=data.id||null}
function renderChallenge(){
  if(!dom.challenge||!quizData)return;
  if(state.challengeDone&&state.challengeIdx>=quizData.questions.length){showCompletion('All complete!');return}
  var qs=quizData.questions,idx=state.challengeIdx,total=qs.length,attempts=0,answered=false;
  var progress=ce('div',{className:'challenge-progress'});
  for(var i=0;i<total;i++){var dot=ce('div',{className:'challenge-dot'+(i===idx?' active':'')+(state.quizResults[i]===true?' done':'')+(state.quizResults[i]===false?' wrong':'')},[''+(i+1)]);progress.appendChild(dot)}
  var card=ce('div',{className:'quiz-card'});
  var qData=qs[idx];
  card.appendChild(ce('div',{className:'q-text'},[qData.q]));
  var opts=ce('div',{className:'quiz-options'});
  var resDiv=ce('div',{className:'challenge-result'});
  qData.options.forEach(function(opt,oi){
    var optEl=ce('div',{className:'quiz-option'},[ce('span',{className:'indicator'}),ce('span',{},[opt])]);
    optEl.addEventListener('click',function(){
      if(answered)return;answered=true;attempts++;
      var correct=oi===qData.answer;state.quizResults[idx]=correct;
      optEl.classList.add(correct?'correct':'wrong');
      optEl.querySelector('.indicator').textContent=correct?'✓':'✗';
      $$('.quiz-option',opts).forEach(function(o){o.style.pointerEvents='none'});
      if(correct){resDiv.className='challenge-result correct';resDiv.textContent='✓ Correct!'}
      else{resDiv.className='challenge-result wrong';resDiv.textContent=attempts<quizData.maxAttempts?'✗ Try again.':'✗ The answer was: '+qData.options[qData.answer]}
      opts.appendChild(resDiv);
      setTimeout(function(){
        if(correct||attempts>=quizData.maxAttempts){
          state.challengeIdx++;
          if(state.challengeIdx>=total){state.challengeDone=true;showCompletion('You completed all '+total+' questions!')}
          else renderChallenge()
        }else{answered=false;
          $$('.quiz-option',opts).forEach(function(o){o.style.pointerEvents='auto';o.classList.remove('wrong','correct');o.querySelector('.indicator').textContent=''});
          resDiv.className='challenge-result';resDiv.textContent=''}
      },correct?800:2000)
    });opts.appendChild(optEl)});
  card.appendChild(opts);dom.challenge.innerHTML='';dom.challenge.appendChild(progress);dom.challenge.appendChild(card)}
function showCompletion(msg){if(dom.completionMsg)dom.completionMsg.textContent=msg||'Mastered!';if(dom.completion)dom.completion.hidden=false}

// Draw future tech visualization
function drawViz(container){
  container.innerHTML='';
  var svg=ce('svg',{className:'viz-svg',viewBox:'0 0 800 500',preserveAspectRatio:'xMidYMid meet'});
  svg.appendChild(ce('rect',{x:0,y:0,width:800,height:500,fill:'#0a0e17'}));
  svg.appendChild(ce('text',{x:400,y:25,'text-anchor':'middle',fill:'#64748b','font-size':'11','font-weight':'700','font-family':'Inter,sans-serif',opacity:0.6},['FUTURE CPU TECHNOLOGIES — Horizon Map']));
  // Timeline base
  svg.appendChild(ce('line',{x1:50,y1:420,x2:750,y2:420,stroke:'rgba(255,255,255,0.1)','stroke-width':2}));
  var years=['2024','2026','2028','2030','2035'];
  years.forEach(function(y,i){svg.appendChild(ce('text',{x:50+i*175,y:445,'text-anchor':'middle',fill:'#64748b','font-size':'10','font-family':'Inter,sans-serif'},[y]));
    svg.appendChild(ce('line',{x1:50+i*175,y1:415,x2:50+i*175,y2:425,stroke:'rgba(255,255,255,0.1)','stroke-width':1}));});

  techs.forEach(function(t,i){
    var g=ce('g',{className:'node',dataset:{id:t.id}});
    var x=40+i*150,y=50+i*10;
    g.appendChild(ce('rect',{className:'node-bg',x:x,y:y,width:135,height:140,rx:10,fill:'rgba(255,255,255,0.02)',stroke:t.color,'stroke-width':1.5}));
    g.appendChild(ce('text',{x:x+67,y:y+25,'text-anchor':'middle',fill:t.color,'font-size':'12','font-weight':'700','font-family':'Inter,sans-serif'},[t.name]));
    // Icon area
    g.appendChild(ce('circle',{cx:x+67,cy:y+65,r:20,fill:'none',stroke:t.color,'stroke-width':1,opacity:0.3}));
    var icons={chiplets:'●','3d':'▣',photon:'◎',quantum:'⚛',graphene:'◆'};
    g.appendChild(ce('text',{x:x+67,y:y+72,'text-anchor':'middle',fill:t.color,'font-size':'18','font-family':'Inter,sans-serif'},[icons[t.id]||'○']));
    // Status
    g.appendChild(ce('text',{x:x+67,y:y+105,'text-anchor':'middle',fill:'#64748b','font-size':'8','font-family':'Inter,sans-serif'},[t.desc.split('.')[0]]));
    // Timeline connection
    var ty=60+i*10+140;
    svg.appendChild(ce('line',{x1:x+67,y1:ty,x2:50+i*175,y2:420,stroke:t.color,'stroke-width':1,opacity:0.2,'stroke-dasharray':'3 3'}));
    g.addEventListener('click',function(){showInfo(t)});
    svg.appendChild(g)});
  container.appendChild(svg)}

function animateNodes(t){
  var idx=Math.floor(t*0.3)%techs.length;
  // Floating animation for nodes
  $$('.node').forEach(function(el,i){
    var ty=50+i*10+Math.sin(t*0.5+i)*3;
    var rect=el.querySelector('.node-bg');
    if(rect)rect.setAttribute('y',ty);
    var txt=el.querySelectorAll('text');
    if(txt[0])txt[0].setAttribute('y',ty+25);
  });
  $$('.node .node-bg').forEach(function(el,i){
    var te=techs[i];
    if(i===idx){el.setAttribute('stroke-width','2.5');el.setAttribute('fill',te.color+'20')}
    else{el.setAttribute('stroke-width','1.5');el.setAttribute('fill','rgba(255,255,255,0.02)')}})}

function init(){
  initDOM();setTheme(getTheme());
  if(dom.theme)dom.theme.addEventListener('click',function(){setTheme(getTheme()==='light'?'dark':'light')});
  if(dom.speed)dom.speed.addEventListener('input',function(){state.speed=parseFloat(this.value);if(dom.speedLabel)dom.speedLabel.textContent=state.speed.toFixed(2)+'×'});
  if(dom.infoClose)dom.infoClose.addEventListener('click',function(){dom.info.hidden=true;state.selectedId=null});
  if(dom.completionReset)dom.completionReset.addEventListener('click',function(){dom.completion.hidden=true;state.challengeDone=false;state.challengeIdx=0;state.quizResults=[];renderChallenge()});
  if(dom.help)dom.help.addEventListener('click',function(){showInfo({name:'How to use',desc:'Explore future CPU technologies on a timeline horizon map. Each technology card shows name, icon, description, and timeline position. Nodes float to show advancing nature. Click for detailed info.',analogy:'',detail:''})});
  setTimeout(function(){
    if(dom.loading)dom.loading.hidden=true;
    if(dom.container)dom.container.hidden=false;
    drawViz(dom.viz);renderChallenge();
    var last=0;
    function frame(ts){if(!last)last=ts;var dt=(ts-last)/1000;last=ts;state.t+=dt*state.speed;animateNodes(state.t);state.rafId=requestAnimationFrame(frame)}
    state.rafId=requestAnimationFrame(frame)
  },800)}
init();
})();
