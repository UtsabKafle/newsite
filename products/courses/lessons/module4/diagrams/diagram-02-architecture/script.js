(function(){
'use strict';
var $=function(s,c){return(c||document).querySelector(s)};
var $$=function(s,c){return Array.from((c||document).querySelectorAll(s))};
var ce=function(t,a,c){var e=document.createElement(t);if(a)Object.entries(a).forEach(function(kv){var k=kv[0],v=kv[1];if(k==='className')e.className=v;else if(k==='style'&&typeof v==='object')Object.assign(e.style,v);else if(k==='dataset')Object.assign(e.dataset,v);else e.setAttribute(k,v)});if(c)c.forEach(function(x){if(typeof x==='string')e.appendChild(document.createTextNode(x));else if(x)e.appendChild(x)});return e};
var nodes=[{id:'cu',name:'Control Unit',color:'#3b82f6',x:.03,y:.08,w:.22,h:.25,desc:'Orchestrates instruction fetching, decoding, and execution sequencing via control signals.',analogy:'Like a conductor directing an orchestra.',detail:'Can be microprogrammed or hardwired. Generates timing and control signals. Uses instruction registers and program counter.'},{id:'alu',name:'Arithmetic Logic Unit',color:'#f43f5e',x:.28,y:.08,w:.22,h:.25,desc:'Performs arithmetic (add/sub/mul) and logical (AND/OR/XOR) operations on register data.',analogy:'Like a calculator built into the CPU.',detail:'Uses carry-lookahead adders. Accepts operands from registers, returns results plus status flags. 32 or 64 bit width.'},{id:'reg',name:'Register File',color:'#eab308',x:.53,y:.08,w:.22,h:.25,desc:'Fast storage locations (RAX, RBX, RCX, RDX, RSP, RBP, RSI, RDI) for active data.',analogy:'Like a stack of sticky notes on a desk.',detail:'x86-64 has 16 general-purpose registers plus XMM/YMM for SIMD. Register renaming enables out-of-order execution.'},{id:'l1c',name:'L1 Cache',color:'#a855f7',x:.78,y:.08,w:.19,h:.25,desc:'Split L1I and L1D caches, 32KB each, 1-3 cycle latency.',analogy:'Like a pocket notebook for quick reference.',detail:'Direct-mapped or set-associative (4-8 ways). Full CPU clock speed.'},{id:'l2c',name:'L2 Cache',color:'#10b981',x:.03,y:.38,w:.22,h:.2,desc:'256-512KB unified cache per core, 7-12 cycle latency.',analogy:'Like a desk drawer with frequently used files.',detail:'8-16 way set-associative. Write-back policy. Acts as victim cache for L1.'},{id:'l3c',name:'L3 Cache',color:'#06b6d4',x:.28,y:.38,w:.22,h:.2,desc:'8-32MB shared cache, 30-50 cycle latency.',analogy:'Like a shared library for all departments.',detail:'Inclusive or non-inclusive policy. Coherence protocols maintain data consistency.'},{id:'mc',name:'Memory Controller',color:'#f97316',x:.53,y:.38,w:.22,h:.2,desc:'Integrated IMC manages DDR4/DDR5 RAM with dual/quad channel.',analogy:'Like a traffic controller for data.',detail:'Each channel has 64-bit data path. Manages timing, refresh, voltage.'},{id:'io',name:'I/O & PCIe',color:'#22d3ee',x:.78,y:.38,w:.19,h:.2,desc:'Direct PCIe lanes for GPU/NVMe plus DMI to chipset.',analogy:'Like airport gates connecting to destinations.',detail:'Up to 28 direct PCIe lanes. DMI connects to chipset for legacy I/O.'}];
var quizData={questions:[{q:'Which component performs arithmetic operations?',options:['Control Unit','ALU','Register File','Memory Controller'],answer:1},{q:'How many general-purpose registers does x86-64 have?',options:['8','16','32','64'],answer:1},{q:'Which cache level is shared across all cores?',options:['L1','L2','L3','All'],answer:2},{q:'What connects the CPU directly to GPU and NVMe?',options:['DMI bus','PCIe lanes','SATA','USB'],answer:1},{q:'The Control Unit is best described as:',options:['A calculator','A conductor','A library','A highway'],answer:1},{q:'What technology enables out-of-order execution in modern CPUs?',options:['Cache','Register renaming','PCIe','Clock speed'],answer:1}],maxAttempts:2};
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

// Draw chip floorplan
function drawViz(container){
  container.innerHTML='';
  var svg=ce('svg',{className:'viz-svg',viewBox:'0 0 800 500',preserveAspectRatio:'xMidYMid meet'});
  var defs=ce('defs',{});
  defs.innerHTML='<linearGradient id="fbg" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#0a0e17"/><stop offset="100%" stop-color="#0f1729"/></linearGradient>';
  svg.appendChild(defs);
  svg.appendChild(ce('rect',{x:0,y:0,width:800,height:500,fill:'url(#fbg)'}));
  // Grid overlay
  for(var i=0;i<16;i++)svg.appendChild(ce('line',{x1:i*50,y1:0,x2:i*50,y2:500,stroke:'rgba(255,255,255,0.02)','stroke-width':1}));
  for(var i=0;i<10;i++)svg.appendChild(ce('line',{x1:0,y1:i*50,x2:800,y2:i*50,stroke:'rgba(255,255,255,0.02)','stroke-width':1}));
  // Data bus trunk
  svg.appendChild(ce('rect',{x:0,y:340,width:800,height:10,fill:'rgba(59,130,246,0.1)',stroke:'#3b82f6','stroke-width':0.5}));
  svg.appendChild(ce('rect',{x:0,y:355,width:800,height:4,fill:'rgba(59,130,246,0.05)'}));
  nodes.forEach(function(n){
    var g=ce('g',{className:'node',dataset:{id:n.id}});
    var x=n.x*800+4,y=n.y*500+4,w=n.w*800-8,h=n.h*500-8;
    g.appendChild(ce('rect',{className:'node-bg',x:x,y:y,width:w,height:h,rx:6,fill:'rgba(255,255,255,0.02)',stroke:n.color,'stroke-width':1.5}));
    g.appendChild(ce('text',{className:'node-label',x:x+w/2,y:y+h/2-4,'text-anchor':'middle',fill:n.color,'font-size':'11','font-weight':'600','font-family':'Inter,sans-serif'},[n.name]));
    g.addEventListener('click',function(){showInfo(n)});
    svg.appendChild(g)});
  container.appendChild(svg)}

function animateNodes(t){
  var idx=Math.floor(t*0.35)%nodes.length;
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
  if(dom.help)dom.help.addEventListener('click',function(){showInfo({name:'How to use',desc:'Explore the CPU architecture floorplan. Each block represents a functional unit. Click to learn. The data bus trunk connects all components.',analogy:'',detail:''})});
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
