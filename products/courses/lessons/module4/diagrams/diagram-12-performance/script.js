(function(){
'use strict';
var $=function(s,c){return(c||document).querySelector(s)};
var $$=function(s,c){return Array.from((c||document).querySelectorAll(s))};
var ce=function(t,a,c){var e=document.createElement(t);if(a)Object.entries(a).forEach(function(kv){var k=kv[0],v=kv[1];if(k==='className')e.className=v;else if(k==='style'&&typeof v==='object')Object.assign(e.style,v);else if(k==='dataset')Object.assign(e.dataset,v);else e.setAttribute(k,v)});if(c)c.forEach(function(x){if(typeof x==='string')e.appendChild(document.createTextNode(x));else if(x)e.appendChild(x)});return e};
var metrics=[{id:'ipc',name:'IPC',color:'#3b82f6',val:'2.8',unit:'Inst/Cycle',desc:'Instructions Per Cycle measures CPU efficiency. Higher IPC means more work per clock cycle.',analogy:'Like passengers per bus trip.',detail:'IPC depends on pipeline design, cache, branch prediction. Zen 5 has ~15% higher IPC than Zen 4. SPEC benchmarks measure IPC across workloads.'},{id:'freq',name:'Frequency',color:'#10b981',val:'5.2',unit:'GHz',desc:'Clock speed in billions of cycles per second. Directly impacts single-threaded performance.',analogy:'Like engine RPM.',detail:'Boost clock varies by workload and cooling. Single-core boost often higher than all-core. Silicon quality determines max frequency. Power scales super-linearly.'},{id:'cache',name:'Cache Miss',color:'#eab308',val:'3',unit:'%',desc:'Percentage of cache lookups that miss and must go to slower memory. Lower is better.',analogy:'Like missing a tool in your pocket and needing to go to the toolbox.',detail:'L1 miss rate ~5-10%, L2 ~3%, L3 ~1%. Each miss adds significant latency. Prefetching reduces misses. Working set size and access patterns affect miss rate.'},{id:'thermal',name:'Temp',color:'#f43f5e',val:'72',unit:'°C',desc:'CPU temperature under load. Higher temperatures reduce boost capability and longevity.',analogy:'Like engine temperature gauge.',detail:'Modern CPUs target ~90-100°C max. Thermal throttling reduces frequency above threshold. Better cooling enables higher sustained performance. Paste quality matters.'},{id:'tflops',name:'TFLOPS',color:'#a855f7',val:'1.8',unit:'TFLOPS',desc:'Trillions of floating-point operations per second. Measures raw compute capability.',analogy:'Like horsepower for a car engine.',detail:'Theoretical peak = cores × freq × FLOPs/cycle. Real-world performance is lower. AI/ML workloads heavily use FP math. GPU TFLOPS far exceed CPU TFLOPS.'},{id:'power',name:'Power',color:'#f97316',val:'95',unit:'W',desc:'Thermal Design Power. Heat the cooling system must dissipate under typical load.',analogy:'Like a light bulb\'s wattage.',detail:'PL1 = sustained, PL2 = boost limit. Power draw spikes under heavy loads. Undervolting reduces power with minimal performance loss. Efficiency improves with smaller nodes.'}];
var quizData={questions:[{q:'What does IPC stand for?',options:['Instructions Per Clock','Inter-Process Communication','Integrated Power Control','Instruction Pointer Cache'],answer:0},{q:'What happens when CPU temperature exceeds threshold?',options:['Blue screen','Thermal throttling','Automatic shutdown','Performance boost'],answer:1},{q:'Cache miss rate is lower for which level?',options:['L1','L2','L3','All the same'],answer:0},{q:'What does TDP measure?',options:['Maximum power draw','Heatsink size','Heat to dissipate','Fan speed'],answer:2},{q:'Which metric measures raw floating-point compute?',options:['IPC','GHz','TFLOPS','TDP'],answer:2},{q:'Modern CPUs target what maximum temperature?',options:['60°C','80°C','90-100°C','120°C'],answer:2}],maxAttempts:2};
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

// Draw performance dashboard
function drawViz(container){
  container.innerHTML='';
  var svg=ce('svg',{className:'viz-svg',viewBox:'0 0 800 500',preserveAspectRatio:'xMidYMid meet'});
  svg.appendChild(ce('rect',{x:0,y:0,width:800,height:500,fill:'#0a0e17'}));
  svg.appendChild(ce('text',{x:400,y:25,'text-anchor':'middle',fill:'#64748b','font-size':'11','font-weight':'700','font-family':'Inter,sans-serif',opacity:0.6},['PERFORMANCE METRICS DASHBOARD']));
  metrics.forEach(function(m,i){
    var g=ce('g',{className:'node',dataset:{id:m.id}});
    var x=15+i*130,y=50;
    g.appendChild(ce('rect',{className:'node-bg',x:x,y:y,width:120,height:200,rx:8,fill:'rgba(255,255,255,0.02)',stroke:m.color,'stroke-width':1.5}));
    g.appendChild(ce('text',{x:x+60,y:y+25,'text-anchor':'middle',fill:m.color,'font-size':'11','font-weight':'700','font-family':'Inter,sans-serif'},[m.name]));
    // Value display
    g.appendChild(ce('text',{x:x+60,y:y+75,'text-anchor':'middle',fill:'#fff','font-size':'28','font-weight':'800','font-family':'monospace'},[m.val]));
    g.appendChild(ce('text',{x:x+60,y:y+95,'text-anchor':'middle',fill:'#64748b','font-size':'9','font-family':'Inter,sans-serif'},[m.unit]));
    // Mini gauge bar
    var pct=0;
    if(m.id==='ipc')pct=70;
    else if(m.id==='freq')pct=85;
    else if(m.id==='cache')pct=95;
    else if(m.id==='thermal')pct=25;
    else if(m.id==='tflops')pct=50;
    else pct=40;
    g.appendChild(ce('rect',{x:x+15,y:y+115,width:90,height:8,rx:4,fill:'rgba(255,255,255,0.05)'}));
    g.appendChild(ce('rect',{className:'gauge-fill',x:x+15,y:y+115,width:90*pct/100,height:8,rx:4,fill:m.color,opacity:0.7})).setAttribute('data-pct',pct);
    // Description snippet
    g.appendChild(ce('text',{x:x+60,y:y+150,'text-anchor':'middle',fill:'#94a3b8','font-size':'7','font-family':'Inter,sans-serif'},[m.desc.split('.')[0]]));
    g.addEventListener('click',function(){showInfo(m)});
    svg.appendChild(g)});
  container.appendChild(svg)}

function animateNodes(t){
  var idx=Math.floor(t*0.3)%metrics.length;
  $$('.node .node-bg').forEach(function(el,i){
    var m=metrics[i];
    if(i===idx){el.setAttribute('stroke-width','2.5');el.setAttribute('fill',m.color+'15')}
    else{el.setAttribute('stroke-width','1.5');el.setAttribute('fill','rgba(255,255,255,0.02)')}});
  // Animate gauge values
  $$('.gauge-fill').forEach(function(g,i){
    var base=parseFloat(g.getAttribute('data-pct')||50);
    var wave=Math.sin(t*0.5+i)*5;
    var w=Math.max(5,Math.min(90,(base+wave)*90/100));
    g.setAttribute('width',w);
  })}

function init(){
  initDOM();setTheme(getTheme());
  if(dom.theme)dom.theme.addEventListener('click',function(){setTheme(getTheme()==='light'?'dark':'light')});
  if(dom.speed)dom.speed.addEventListener('input',function(){state.speed=parseFloat(this.value);if(dom.speedLabel)dom.speedLabel.textContent=state.speed.toFixed(2)+'×'});
  if(dom.infoClose)dom.infoClose.addEventListener('click',function(){dom.info.hidden=true;state.selectedId=null});
  if(dom.completionReset)dom.completionReset.addEventListener('click',function(){dom.completion.hidden=true;state.challengeDone=false;state.challengeIdx=0;state.quizResults=[];renderChallenge()});
  if(dom.help)dom.help.addEventListener('click',function(){showInfo({name:'How to use',desc:'Explore the CPU performance dashboard. Each gauge shows a key metric with animated values. Click any gauge for detailed explanation of the performance factor.',analogy:'',detail:''})});
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
