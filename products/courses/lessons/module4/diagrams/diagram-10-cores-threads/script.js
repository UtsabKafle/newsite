(function(){
'use strict';
var $=function(s,c){return(c||document).querySelector(s)};
var $$=function(s,c){return Array.from((c||document).querySelectorAll(s))};
var ce=function(t,a,c){var e=document.createElement(t);if(a)Object.entries(a).forEach(function(kv){var k=kv[0],v=kv[1];if(k==='className')e.className=v;else if(k==='style'&&typeof v==='object')Object.assign(e.style,v);else if(k==='dataset')Object.assign(e.dataset,v);else e.setAttribute(k,v)});if(c)c.forEach(function(x){if(typeof x==='string')e.appendChild(document.createTextNode(x));else if(x)e.appendChild(x)});return e};
var cores=[{id:'c0',name:'Core 0',color:'#3b82f6',threads:2,desc:'First physical processing core. Runs its own instruction stream independently.',analogy:'Like having a separate chef in the kitchen.',detail:'Each core has its own control unit, ALU, L1/L2 cache. Core 0 is typically the bootstrap processor (BSP) at boot. Can run at different frequencies than other cores.'},{id:'c1',name:'Core 1',color:'#10b981',threads:1,desc:'Second core enabling true parallel execution of separate threads.',analogy:'Like a second checkout lane in a supermarket.',detail:'Functionally identical to Core 0. Has its own L1/L2. Shares L3 and memory controller. OS scheduler assigns threads to available cores.'},{id:'c2',name:'Core 2',color:'#eab308',threads:2,desc:'Third core adding more parallel processing capacity for multi-threaded workloads.',analogy:'Like adding more workers to an assembly line.',detail:'Core parking powers down idle cores to save energy. Modern CPUs can have 16+ cores (desktop) or 64+ (server).'},{id:'c3',name:'Core 3',color:'#f43f5e',threads:1,desc:'Fourth core completing a common quad-core configuration.',analogy:'Like four checkout lanes open simultaneously.',detail:'Quad-core was the enthusiast standard for years. More cores improve performance for well-parallelized workloads. Not all software scales perfectly with core count.'},{id:'smt',name:'SMT (Hyper-Threading)',color:'#a855f7',threads:0,desc:'Simultaneous Multithreading makes each physical core appear as 2 logical cores to the OS.',analogy:'Like one chef using both hands to cook two dishes.',detail:'SMT shares execution resources between two threads. Can improve throughput 15-30%. Requires OS support. Not all workloads benefit equally.'},{id:'sched',name:'Thread Scheduler',color:'#f97316',threads:0,desc:'OS component that assigns threads to available logical cores, balancing workload.',analogy:'Like a dispatcher assigning tasks to workers.',detail:'Modern schedulers use run queues per core. Consider cache affinity to keep threads on same core. Load balancing migrates threads between cores. SMT-aware scheduling prefers idle logical cores.'}];
var quizData={questions:[{q:'What does SMT stand for?',options:['System Management Tool','Simultaneous Multithreading','Shared Memory Technology','Single Mode Transfer'],answer:1},{q:'How many logical cores does SMT create per physical core?',options:['1','2','4','8'],answer:1},{q:'What is core parking?',options:['Core overheating','Powering down idle cores','Core locking','Cache clearing'],answer:1},{q:'Which core is typically the bootstrap processor?',options:['Core 0','Core 1','Core 2','Core 3'],answer:0},{q:'Typical SMT performance improvement is:',options:['5-10%','15-30%','50-80%','100%+'],answer:1},{q:'What does the OS thread scheduler consider?',options:['Cache affinity','Core color','Memory speed','Power supply'],answer:0}],maxAttempts:2};
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

// Draw multi-core visualization with threads
function drawViz(container){
  container.innerHTML='';
  var svg=ce('svg',{className:'viz-svg',viewBox:'0 0 800 500',preserveAspectRatio:'xMidYMid meet'});
  svg.appendChild(ce('rect',{x:0,y:0,width:800,height:500,fill:'#0a0e17'}));
  // Shared L3 at top
  svg.appendChild(ce('rect',{x:200,y:380,width:400,height:60,rx:6,fill:'rgba(16,185,129,0.05)',stroke:'#10b981','stroke-width':1}));
  svg.appendChild(ce('text',{x:400,y:415,'text-anchor':'middle',fill:'#10b981','font-size':'11','font-weight':'600','font-family':'Inter,sans-serif'},['SHARED L3 CACHE + MEMORY CONTROLLER']));
  svg.appendChild(ce('rect',{x:200,y:450,width:400,height:40,rx:6,fill:'rgba(249,115,22,0.05)',stroke:'#f97316','stroke-width':1}));
  svg.appendChild(ce('text',{x:400,y:475,'text-anchor':'middle',fill:'#f97316','font-size':'10','font-weight':'600','font-family':'Inter,sans-serif'},['THREAD SCHEDULER']));

  cores.forEach(function(c,i){
    var g=ce('g',{className:'node',dataset:{id:c.id}});
    var x=60+i*120,y=40;
    g.appendChild(ce('rect',{className:'node-bg',x:x,y:y,width:100,height:130,rx:8,fill:'rgba(255,255,255,0.02)',stroke:c.color,'stroke-width':1.5}));
    g.appendChild(ce('text',{x:x+50,y:y+25,'text-anchor':'middle',fill:c.color,'font-size':'11','font-weight':'700','font-family':'Inter,sans-serif'},[c.name]));
    // Thread indicators
    if(c.threads>0){
      for(var t=0;t<c.threads;t++){
        var ty=y+45+t*25;
        g.appendChild(ce('rect',{x:x+15,y:ty,width:70,height:18,rx:4,fill:'rgba(255,255,255,0.05)',stroke:'rgba(255,255,255,0.1)','stroke-width':0.5}));
        g.appendChild(ce('text',{x:x+50,y:ty+14,'text-anchor':'middle',fill:'#94a3b8','font-size':'8','font-family':'monospace'},['Thread '+(t+1)]));
      }
    } else {
      // For SMT and Scheduler
      if(i===4){
        g.appendChild(ce('text',{x:x+50,y:y+70,'text-anchor':'middle',fill:'#64748b','font-size':'8','font-family':'Inter,sans-serif'},['2x Logical per core']));
        g.appendChild(ce('text',{x:x+50,y:y+90,'text-anchor':'middle',fill:'#64748b','font-size':'8','font-family':'Inter,sans-serif'},['15-30% improvement']));
      }
    }
    // Connection to L3
    svg.insertBefore(ce('line',{x1:x+50,y1:y+130,x2:x+50,y2:380,stroke:c.color,'stroke-width':1,opacity:0.2}),svg.querySelector('.node'));
    g.addEventListener('click',function(){showInfo(c)});
    svg.appendChild(g)});
  // Interconnect bus
  svg.appendChild(ce('rect',{x:60,y:170,width:480,height:4,rx:2,fill:'rgba(59,130,246,0.15)'}));
  container.appendChild(svg)}

function animateNodes(t){
  var idx=Math.floor(t*0.3)%cores.length;
  // Animate thread activity
  $$('.node .node-bg').forEach(function(el,i){
    var c=cores[i];
    if(i===idx){el.setAttribute('stroke-width','2.5');el.setAttribute('fill',c.color+'20')}
    else{el.setAttribute('stroke-width','1.5');el.setAttribute('fill','rgba(255,255,255,0.02)')}})}

function init(){
  initDOM();setTheme(getTheme());
  if(dom.theme)dom.theme.addEventListener('click',function(){setTheme(getTheme()==='light'?'dark':'light')});
  if(dom.speed)dom.speed.addEventListener('input',function(){state.speed=parseFloat(this.value);if(dom.speedLabel)dom.speedLabel.textContent=state.speed.toFixed(2)+'×'});
  if(dom.infoClose)dom.infoClose.addEventListener('click',function(){dom.info.hidden=true;state.selectedId=null});
  if(dom.completionReset)dom.completionReset.addEventListener('click',function(){dom.completion.hidden=true;state.challengeDone=false;state.challengeIdx=0;state.quizResults=[];renderChallenge()});
  if(dom.help)dom.help.addEventListener('click',function(){showInfo({name:'How to use',desc:'Explore multi-core architecture. Each core has its own L1/L2 cache and can run threads. SMT creates 2 logical cores per physical core. The scheduler assigns threads.',analogy:'',detail:''})});
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
