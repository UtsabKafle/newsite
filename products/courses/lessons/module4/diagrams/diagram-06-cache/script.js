(function(){
'use strict';
var $=function(s,c){return(c||document).querySelector(s)};
var $$=function(s,c){return Array.from((c||document).querySelectorAll(s))};
var ce=function(t,a,c){var e=document.createElement(t);if(a)Object.entries(a).forEach(function(kv){var k=kv[0],v=kv[1];if(k==='className')e.className=v;else if(k==='style'&&typeof v==='object')Object.assign(e.style,v);else if(k==='dataset')Object.assign(e.dataset,v);else e.setAttribute(k,v)});if(c)c.forEach(function(x){if(typeof x==='string')e.appendChild(document.createTextNode(x));else if(x)e.appendChild(x)});return e};
var levels=[{id:'l1',name:'L1 Cache',color:'#3b82f6',size:'32-64KB',latency:'~1ns',desc:'Split into L1i (instructions) and L1d (data) caches. Operates at full CPU core speed.',analogy:'Like a pocket notebook for essential info.',detail:'L1 is direct-mapped or 4-8 way set-associative. Write-through or write-back policy. 1-3 cycle latency. Built from SRAM on the same die.'},{id:'l2',name:'L2 Cache',color:'#10b981',size:'256-512KB',latency:'~3ns',desc:'Unified per-core cache that catches L1 misses. Larger but slower than L1.',analogy:'Like a desk drawer with more supplies.',detail:'8-16 way set-associative. Write-back policy. Acts as victim cache for L1 evictions. Per-core in modern CPUs.'},{id:'l3',name:'L3 Cache',color:'#eab308',size:'8-32MB',latency:'~10ns',desc:'Shared across all cores. Reduces inter-core latency and serves L2 misses.',analogy:'Like a shared library for all departments.',detail:'Last-level cache before RAM. Inclusive or non-inclusive policy. Coherence protocols keep data consistent.'},{id:'ram',name:'System RAM',color:'#f43f5e',size:'8-64GB',latency:'~50ns',desc:'Main memory (DDR4/DDR5). Much larger but orders of magnitude slower than CPU cache.',analogy:'Like a warehouse archive.',detail:'DRAM is cheaper per GB than SRAM. Requires refresh cycles. Managed by integrated memory controller.'}];
var quizData={questions:[{q:'Which cache level is split into instruction and data sections?',options:['L1','L2','L3','RAM'],answer:0},{q:'What is the typical latency of L1 cache?',options:['1ns','3ns','10ns','50ns'],answer:0},{q:'L3 cache is unique because it is:',options:['Per-core','Shared across all cores','Volatile','Read-only'],answer:1},{q:'What is the typical size of L2 cache per core?',options:['32-64KB','256-512KB','8-32MB','8-64GB'],answer:1},{q:'Why is cache necessary?',options:['To store files','To reduce memory latency','To cool the CPU','To connect peripherals'],answer:1},{q:'What technology is L1/L2/L3 cache built from?',options:['DRAM','SRAM','Flash','ROM'],answer:1}],maxAttempts:2};
var state={speed:1,rafId:null,t:0,selectedId:null,challengeDone:false,challengeIdx:0,quizResults:[],hitAnim:false,hitCount:0};
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

// Draw cache pyramid
function drawViz(container){
  container.innerHTML='';
  var svg=ce('svg',{className:'viz-svg',viewBox:'0 0 800 500',preserveAspectRatio:'xMidYMid meet'});
  svg.appendChild(ce('rect',{x:0,y:0,width:800,height:500,fill:'#0a0e17'}));
  // Animated data request line
  var heights=[120,180,260,360];
  var widths=[200,320,460,600];
  levels.forEach(function(l,i){
    var g=ce('g',{className:'node',dataset:{id:l.id}});
    var y=40,w=widths[i],h=heights[i],x=(800-w)/2;
    g.appendChild(ce('rect',{className:'node-bg',x:x,y:y,width:w,height:h,rx:8,fill:'rgba(255,255,255,0.02)',stroke:l.color,'stroke-width':1.5}));
    g.appendChild(ce('text',{x:400,y:y+40,'text-anchor':'middle',fill:l.color,'font-size':'14','font-weight':'700','font-family':'Inter,sans-serif'},[l.name]));
    g.appendChild(ce('text',{x:400,y:y+62,'text-anchor':'middle',fill:'#94a3b8','font-size':'12','font-family':'Inter,sans-serif'},['Size: '+l.size]));
    g.appendChild(ce('text',{x:400,y:y+82,'text-anchor':'middle',fill:'#64748b','font-size':'12','font-family':'Inter,sans-serif'},['Latency: '+l.latency]));
    // Arrow down
    if(i<levels.length-1){
      var y2=40+heights[i+1];
      svg.appendChild(ce('line',{className:'conn-line',x1:400,y1:y+h,x2:400,y2:y2-10,stroke:'rgba(255,255,255,0.1)','stroke-width':1.5,opacity:0.4}));
      svg.appendChild(ce('polygon',{points:'394,'+(y2-20)+' 400,'+(y2-10)+' 406,'+(y2-20),fill:'rgba(255,255,255,0.1)',opacity:0.4}));
    }
    g.addEventListener('click',function(){showInfo(l)});
    svg.appendChild(g)});
  // Hit/miss indicator
  var hitBar=ce('g',{id:'hit-bar'});
  hitBar.appendChild(ce('text',{x:400,y:20,'text-anchor':'middle',fill:'#64748b','font-size':'11','font-family':'Inter,sans-serif'},['🔥 Cache Hit Rate: <tspan id="hit-rate">95</tspan>%']));
  svg.appendChild(hitBar);
  container.appendChild(svg)}

function animateNodes(t){
  // Animate data request traveling
  var phase=(t*0.5)%1;
  var heights=[120,180,260,360];
  var yPos=40+phase*320;
  var svg=dom.viz.querySelector('svg');
  if(!svg)return;
  var old=svg.querySelectorAll('.data-dot');
  old.forEach(function(o){o.remove()});
  var dot=ce('circle',{className:'data-dot',cx:400,cy:yPos,r:6,fill:'#3b82f6',opacity:0.8});
  svg.appendChild(dot);
  // Sequential node highlight
  var idx=Math.floor(t*0.3)%levels.length;
  $$('.node .node-bg').forEach(function(el,i){
    var l=levels[i];
    if(i===idx){el.setAttribute('stroke-width','2.5');el.setAttribute('fill',l.color+'15')}
    else{el.setAttribute('stroke-width','1.5');el.setAttribute('fill','rgba(255,255,255,0.02)')}})}

function init(){
  initDOM();setTheme(getTheme());
  if(dom.theme)dom.theme.addEventListener('click',function(){setTheme(getTheme()==='light'?'dark':'light')});
  if(dom.speed)dom.speed.addEventListener('input',function(){state.speed=parseFloat(this.value);if(dom.speedLabel)dom.speedLabel.textContent=state.speed.toFixed(2)+'×'});
  if(dom.infoClose)dom.infoClose.addEventListener('click',function(){dom.info.hidden=true;state.selectedId=null});
  if(dom.completionReset)dom.completionReset.addEventListener('click',function(){dom.completion.hidden=true;state.challengeDone=false;state.challengeIdx=0;state.quizResults=[];renderChallenge()});
  if(dom.help)dom.help.addEventListener('click',function(){showInfo({name:'How to use',desc:'Explore the cache hierarchy pyramid. Data requests travel from L1 (top) down to RAM (bottom). Each level has different size and speed. Click for details.',analogy:'',detail:''})});
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
