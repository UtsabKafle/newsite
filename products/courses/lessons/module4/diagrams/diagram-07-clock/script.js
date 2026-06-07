(function(){
'use strict';
var $=function(s,c){return(c||document).querySelector(s)};
var $$=function(s,c){return Array.from((c||document).querySelectorAll(s))};
var ce=function(t,a,c){var e=document.createElement(t);if(a)Object.entries(a).forEach(function(kv){var k=kv[0],v=kv[1];if(k==='className')e.className=v;else if(k==='style'&&typeof v==='object')Object.assign(e.style,v);else if(k==='dataset')Object.assign(e.dataset,v);else e.setAttribute(k,v)});if(c)c.forEach(function(x){if(typeof x==='string')e.appendChild(document.createTextNode(x));else if(x)e.appendChild(x)});return e};
var nodes=[{id:'osc',name:'Crystal Oscillator',color:'#3b82f6',desc:'Quartz crystal vibrates at precise frequency (25-100 MHz) when voltage applied, creating base clock signal.',analogy:'Like a pendulum setting the rhythm.',detail:'Accurate to 0.001%. Creates sine wave shaped into digital signal. BCLK is typically 100 MHz. Temperature affects frequency slightly.'},{id:'pll',name:'Phase-Locked Loop',color:'#a855f7',desc:'Multiplies base clock (100 MHz) by CPU multiplier to produce core frequency (e.g., 100MHz × 50 = 5.0 GHz).',analogy:'Like a gearbox multiplying RPM.',detail:'PLL compares base clock to divided output until they match. Multiplier changes dynamically for power saving. Each core can have its own PLL.'},{id:'div',name:'Clock Divider',color:'#eab308',desc:'Reduces core frequency for different buses: memory bus, PCIe, DMI, and other subsystems.',analogy:'Like reducing engine speed for different gears.',detail:'Divides core clock by integer ratios. Creates multiple clock domains. Allows power saving by slowing unused domains.'},{id:'wave',name:'Clock Signal Wave',color:'#22c55e',desc:'Square wave oscillating between high and low states. Each cycle synchronizes CPU operations.',analogy:'Like a heart beating to keep everything in rhythm.',detail:'Duty cycle is typically 50% (half high, half low). Rising edge triggers most operations. Modern CPUs use both edges for DDR.'},{id:'ghz',name:'GHz Rating',color:'#f43f5e',desc:'Billions of cycles per second. 5 GHz = 5 billion cycles/second. Each cycle enables one or more instruction steps.',analogy:'Like engine RPM for a car.',detail:'5 GHz CPU completes one cycle in 0.2 nanoseconds. Light travels only 6cm in that time. Frequency scaling hit power walls around 2005.'},{id:'mult',name:'CPU Multiplier',color:'#f97316',desc:'Ratio between base clock (BCLK) and core frequency. Unlocked multipliers allow overclocking.',analogy:'Like a gear ratio.',detail:'Modern CPUs have a base clock of 100 MHz. Multiplier of 50 = 5.0 GHz. Turbo Boost increases multiplier dynamically. Overclocking raises multiplier beyond stock.'}];
var quizData={questions:[{q:'What generates the base frequency for the CPU clock?',options:['Battery','Crystal oscillator','Power supply','Fan'],answer:1},{q:'What does PLL stand for?',options:['Power Level Limit','Phase-Locked Loop','Processor Load Level','Primary Logic Line'],answer:1},{q:'Typical base clock (BCLK) frequency on modern platforms is:',options:['25 MHz','100 MHz','1 GHz','5 GHz'],answer:1},{q:'A CPU running at 5.0 GHz with 100 MHz BCLK has a multiplier of:',options:['25','50','100','500'],answer:1},{q:'Why did CPU frequency scaling slow down around 2005?',options:['Technology limits','Power/heat walls','Software limits','Market demand'],answer:1},{q:'The clock signal duty cycle is typically:',options:['25%','50%','75%','100%'],answer:1}],maxAttempts:2};
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

// Draw clock signal visualization
function drawViz(container){
  container.innerHTML='';
  var svg=ce('svg',{className:'viz-svg',viewBox:'0 0 800 500',preserveAspectRatio:'xMidYMid meet'});
  svg.appendChild(ce('rect',{x:0,y:0,width:800,height:500,fill:'#0a0e17'}));
  // Oscilloscope-like grid
  for(var i=0;i<16;i++)svg.appendChild(ce('line',{x1:i*50,y1:0,x2:i*50,y2:500,stroke:'rgba(0,255,0,0.03)','stroke-width':1}));
  for(var i=0;i<10;i++)svg.appendChild(ce('line',{x1:0,y1:i*50,x2:800,y2:i*50,stroke:'rgba(0,255,0,0.03)','stroke-width':1}));
  // Clock wave path (animated via dynamic points)
  var wavePath=ce('path',{id:'clock-wave',fill:'none',stroke:'#22c55e','stroke-width':2,opacity:0.8});
  svg.appendChild(wavePath);
  // Frequency display
  svg.appendChild(ce('text',{x:400,y:50,'text-anchor':'middle',fill:'#22c55e','font-size':'16','font-weight':'700','font-family':'monospace'},['CLOCK SIGNAL ANALYZER']));
  svg.appendChild(ce('text',{x:400,y:75,'text-anchor':'middle',fill:'#64748b','font-size':'12','font-family':'monospace'},['Frequency: <tspan id="freq-display" fill="#22c55e">5.00</tspan> GHz']));
  // Component blocks at bottom
  var bx=60;
  nodes.forEach(function(n,i){
    if(n.id==='wave')return;
    var g=ce('g',{className:'node',dataset:{id:n.id}});
    var x=bx+i*150;var yy=360;
    g.appendChild(ce('rect',{className:'node-bg',x:x-45,y:yy,width:130,height:50,rx:6,fill:'rgba(255,255,255,0.02)',stroke:n.color,'stroke-width':1.5}));
    g.appendChild(ce('text',{x:x+20,y:390,'text-anchor':'middle',fill:n.color,'font-size':'10','font-weight':'600','font-family':'Inter,sans-serif'},[n.name]));
    g.addEventListener('click',function(){showInfo(n)});
    svg.appendChild(g);
    // Arrow
    if(i<nodes.length-1&&nodes[i+1].id!=='wave'){
      svg.appendChild(ce('line',{x1:x+85,y1:385,x2:x+95,y2:385,stroke:'#64748b','stroke-width':1,opacity:0.4,'marker-end':'url(#arrow)'}));
    }});
  var arrowDef=ce('defs',{});
  arrowDef.innerHTML='<marker id="arrow" viewBox="0 0 10 10" refX="10" refY="5" markerWidth="8" markerHeight="8" orient="auto"><path d="M0,0 L10,5 L0,10" fill="#64748b"/></marker>';
  svg.insertBefore(arrowDef,svg.firstChild);
  container.appendChild(svg)}

function animateNodes(t){
  var wave=dom.viz.querySelector('#clock-wave');
  if(wave){
    var pts='';
    var freq=5; // GHz
    var amplitude=120;
    var yCenter=230;
    var speed=t*0.5;
    for(var x=0;x<=800;x+=4){
      var y=yCenter+Math.sin((x/40+speed)*Math.PI*2)*amplitude;
      pts+=(x===0?'M':'L')+x+','+y;
    }
    wave.setAttribute('d',pts);
    var freqDisp=dom.viz.querySelector('#freq-display');
    if(freqDisp)freqDisp.textContent=(5*state.speed).toFixed(2);
  }
  var idx=Math.floor(t*0.3)%nodes.length;
  $$('.node .node-bg').forEach(function(el,i){
    var n=nodes[i];
    if(i===idx){el.setAttribute('stroke-width','2.5');el.setAttribute('fill',n.color+'20')}
    else{el.setAttribute('stroke-width','1.5');el.setAttribute('fill','rgba(255,255,255,0.02)')}})}

function init(){
  initDOM();setTheme(getTheme());
  if(dom.theme)dom.theme.addEventListener('click',function(){setTheme(getTheme()==='light'?'dark':'light')});
  if(dom.speed)dom.speed.addEventListener('input',function(){state.speed=parseFloat(this.value);if(dom.speedLabel)dom.speedLabel.textContent=state.speed.toFixed(2)+'×'});
  if(dom.infoClose)dom.infoClose.addEventListener('click',function(){dom.info.hidden=true;state.selectedId=null});
  if(dom.completionReset)dom.completionReset.addEventListener('click',function(){dom.completion.hidden=true;state.challengeDone=false;state.challengeIdx=0;state.quizResults=[];renderChallenge()});
  if(dom.help)dom.help.addEventListener('click',function(){showInfo({name:'How to use',desc:'Explore clock signal generation. The oscilloscope shows the clock wave. Component blocks below show the signal chain from oscillator to multiplier. Speed slider changes displayed frequency.',analogy:'',detail:''})});
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
