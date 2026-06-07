(function(){
'use strict';
var $=function(s,c){return(c||document).querySelector(s)};
var $$=function(s,c){return Array.from((c||document).querySelectorAll(s))};
var ce=function(t,a,c){var e=document.createElement(t);if(a)Object.entries(a).forEach(function(kv){var k=kv[0],v=kv[1];if(k==='className')e.className=v;else if(k==='style'&&typeof v==='object')Object.assign(e.style,v);else if(k==='dataset')Object.assign(e.dataset,v);else e.setAttribute(k,v)});if(c)c.forEach(function(x){if(typeof x==='string')e.appendChild(document.createTextNode(x));else if(x)e.appendChild(x)});return e};
var nodes=[{id:'core',name:'CPU Core 0',color:'#3b82f6',x:.15,y:.15,w:.3,h:.35,desc:'Independent processing unit with its own ALU, CU, and L1 cache. Executes instructions sequentially.',analogy:'Like a chef with a full kitchen station.',detail:'Each modern core can execute 4-6 instructions per cycle via superscalar execution. Cores share L3 cache but have private L1/L2.'},{id:'l1',name:'L1 Cache (I+D)',color:'#a855f7',x:.15,y:.55,w:.3,h:.2,desc:'Split into instruction (L1i) and data (L1d) caches, 32-64KB each per core.',analogy:'Like a chef\'s immediate prep station.',detail:'L1 operates at full CPU speed with 1-3 cycle latency. L1i is read-only; L1d uses write-back policy.'},{id:'l2',name:'L2 Cache',color:'#eab308',x:.5,y:.15,w:.35,h:.25,desc:'256-512KB per core, unified cache that catches L1 misses.',analogy:'Like a countertop pantry beside the kitchen.',detail:'L2 is 8-16 way set-associative with ~7-12 cycle latency. Acts as victim cache for L1 evictions.'},{id:'l3',name:'L3 Cache (Shared)',color:'#10b981',x:.5,y:.45,w:.35,h:.25,desc:'8-32MB shared across all cores to reduce inter-core latency.',analogy:'Like a shared warehouse for all kitchen stations.',detail:'L3 is the last-level cache before DRAM. ~30-50 cycle latency. Uses inclusive or non-inclusive policy.'},{id:'imc',name:'Memory Controller',color:'#f43f5e',x:.15,y:.8,w:.7,h:.15,desc:'Integrated IMC manages DDR4/DDR5 RAM with dual/quad channel configurations.',analogy:'Like a dispatcher directing supply trucks.',detail:'Supports specific DDR speeds and capacities. Each channel has independent 64-bit data path.'}];
var quizData={questions:[{q:'Which cache level is split into instruction and data sections?',options:['L1','L2','L3','All of the above'],answer:0},{q:'What does the integrated memory controller manage?',options:['CPU cooling','RAM communication','Graphics output','Network traffic'],answer:1},{q:'L3 cache is unique because it is:',options:['Per-core','Shared across cores','Read-only','Volatile'],answer:1},{q:'What is the typical latency of L1 cache access?',options:['1-3 cycles','7-12 cycles','30-50 cycles','100+ cycles'],answer:0},{q:'A CPU core contains which of the following?',options:['Only ALU','Only Control Unit','Both ALU and Control Unit','Neither'],answer:2},{q:'What technology allows one physical core to appear as two logical cores?',options:['Overclocking','Hyper-Threading','Multiplier','Cache'],answer:1}],maxAttempts:2};
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

// Draw SVG die visualization
function drawViz(container){
  container.innerHTML='';
  var svg=ce('svg',{className:'viz-svg',viewBox:'0 0 800 500',preserveAspectRatio:'xMidYMid meet'});
  var defs=ce('defs',{});
  defs.innerHTML='<linearGradient id="dbg" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#0f1729"/><stop offset="100%" stop-color="#0a0e17"/></linearGradient>';
  svg.appendChild(defs);
  svg.appendChild(ce('rect',{x:20,y:20,width:760,height:460,rx:20,fill:'url(#dbg)',stroke:'rgba(255,255,255,0.05)','stroke-width':2}));
  svg.appendChild(ce('rect',{x:40,y:40,width:720,height:420,rx:12,fill:'none',stroke:'#2563eb','stroke-dasharray':'8 8',opacity:0.2,'stroke-width':2}));
  nodes.forEach(function(n){
    var g=ce('g',{className:'node',dataset:{id:n.id}});
    var x=n.x*760+20,y=n.y*460+20,w=n.w*760,h=n.h*460;
    g.appendChild(ce('rect',{className:'node-bg',x:x,y:y,width:w,height:h,rx:8,fill:'rgba(255,255,255,0.02)',stroke:n.color,'stroke-width':1.5}));
    g.appendChild(ce('text',{className:'node-label',x:x+w/2,y:y+h/2,'text-anchor':'middle',fill:n.color,'font-size':'13','font-weight':'600','font-family':'Inter,sans-serif'},[n.name]));
    g.addEventListener('click',function(){showInfo(n)});
    svg.appendChild(g)});
  container.appendChild(svg)}

function animateNodes(t){
  var idx=Math.floor(t*0.3)%nodes.length;
  $$('.node .node-bg').forEach(function(el,i){
    var n=nodes[i];
    if(i===idx){el.setAttribute('stroke-width','2.5');el.setAttribute('fill',n.color+'15')}
    else{el.setAttribute('stroke-width','1.5');el.setAttribute('fill','rgba(255,255,255,0.02)')}})}

function init(){
  initDOM();setTheme(getTheme());
  if(dom.theme)dom.theme.addEventListener('click',function(){setTheme(getTheme()==='light'?'dark':'light')});
  if(dom.speed)dom.speed.addEventListener('input',function(){state.speed=parseFloat(this.value);if(dom.speedLabel)dom.speedLabel.textContent=state.speed.toFixed(2)+'×'});
  if(dom.infoClose)dom.infoClose.addEventListener('click',function(){dom.info.hidden=true;state.selectedId=null});
  if(dom.completionReset)dom.completionReset.addEventListener('click',function(){dom.completion.hidden=true;state.challengeDone=false;state.challengeIdx=0;state.quizResults=[];renderChallenge()});
  if(dom.help)dom.help.addEventListener('click',function(){showInfo({name:'How to use',desc:'Explore the CPU die layout. Click any component block to learn its function. Use the speed slider to control highlight animation. Complete the challenge to test your knowledge.',analogy:'',detail:''})});
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
