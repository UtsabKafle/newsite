(function(){
'use strict';
var $=function(s,c){return(c||document).querySelector(s)};
var $$=function(s,c){return Array.from((c||document).querySelectorAll(s))};
var ce=function(t,a,c){var e=document.createElement(t);if(a)Object.entries(a).forEach(function(kv){var k=kv[0],v=kv[1];if(k==='className')e.className=v;else if(k==='style'&&typeof v==='object')Object.assign(e.style,v);else if(k==='dataset')Object.assign(e.dataset,v);else e.setAttribute(k,v)});if(c)c.forEach(function(x){if(typeof x==='string')e.appendChild(document.createTextNode(x));else if(x)e.appendChild(x)});return e};
var stages=[{id:'if',name:'IF: Instruction Fetch',color:'#3b82f6',desc:'Fetches instructions from L1I cache using program counter. Can fetch 4-6 per cycle with branch prediction.',analogy:'Like first station on an assembly line providing base parts.',detail:'Accesses L1 instruction cache. Uses branch prediction for branches. Prefetching brings instructions before needed. Fetched instructions go to pre-decode buffer.'},{id:'id',name:'ID: Instruction Decode',color:'#a855f7',desc:'Decodes instructions into micro-ops. x86 CISC instructions split into 1-4 simpler RISC-like micro-ops.',analogy:'Like translating an order into specific kitchen instructions.',detail:'Instructions decoded from pre-decode buffer. Register renaming avoids false dependencies. Decoded instructions sent to issue queue.'},{id:'ex',name:'EX: Execute',color:'#eab308',desc:'Dispatches micro-ops to ALU, FPU, or load/store units. Out-of-order execution allowed.',analogy:'Like workers at different stations on an assembly line.',detail:'Multiple execution units operate in parallel. Results forwarded between stages to avoid hazards. Branch prediction resolves here.'},{id:'mem',name:'MEM: Memory Access',color:'#10b981',desc:'Accesses L1D cache for loads/stores. Cache hit = 3-5 cycles. Miss = main memory (~100 cycles).',analogy:'Like fetching materials from a warehouse.',detail:'Load/store unit manages address calculation. Store buffer holds pending writes. Cache miss stalls the pipeline.'},{id:'wb',name:'WB: Write Back',color:'#f43f5e',desc:'Commits results to register file. The instruction retires and architectural state updates.',analogy:'Like completing a task and recording the result.',detail:'Results written to destination register. Forwarding bypasses results to dependent instructions. Reorder buffer retires instructions in program order.'},{id:'haz',name:'⚠ Hazard Detection',color:'#f97316',desc:'Detects data hazards (RAW/WAR/WAW), control hazards (branches), and structural hazards (resource conflicts).',analogy:'Like traffic lights preventing collisions.',detail:'Data hazards solved by forwarding/bypassing. Control hazards solved by branch prediction. Structural hazards from limited resources. Stalls inserted when needed.'}];
var quizData={questions:[{q:'How many instructions can modern CPUs fetch per cycle?',options:['1','2-3','4-6','10+'],answer:2},{q:'What technique helps avoid data hazards?',options:['Caching','Forwarding/bypassing','Clock gating','Prefetching'],answer:1},{q:'What does a branch misprediction cause?',options:['Cache miss','Pipeline flush','ALU overflow','Register error'],answer:1},{q:'How are x86 CISC instructions handled in modern pipelines?',options:['Executed directly','Split into micro-ops','Converted to ARM','Skipped'],answer:1},{q:'What stage resolves branch instructions?',options:['Fetch','Decode','Execute','Writeback'],answer:2},{q:'What is a structural hazard?',options:['Data conflict','Resource conflict','Control conflict','Power conflict'],answer:1}],maxAttempts:2};
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

// Draw pipeline - instructions flowing through stages
function drawViz(container){
  container.innerHTML='';
  var svg=ce('svg',{className:'viz-svg',viewBox:'0 0 800 500',preserveAspectRatio:'xMidYMid meet'});
  svg.appendChild(ce('rect',{x:0,y:0,width:800,height:500,fill:'#0a0e17'}));
  stages.forEach(function(s,i){
    var g=ce('g',{className:'node',dataset:{id:s.id}});
    var x=10+i*132,y=80;
    g.appendChild(ce('rect',{className:'node-bg',x:x,y:y,width:122,height:200,rx:6,fill:'rgba(255,255,255,0.02)',stroke:s.color,'stroke-width':1.5}));
    g.appendChild(ce('text',{x:x+61,y:y+20,'text-anchor':'middle',fill:s.color,'font-size':'10','font-weight':'700','font-family':'Inter,sans-serif'},[s.name.split(':')[0]]));
    // Instructions slots
    for(var j=0;j<4;j++){
      var iy=y+35+j*42;
      g.appendChild(ce('rect',{x:x+8,y:iy,width:106,height:34,rx:4,fill:'rgba(255,255,255,0.03)',stroke:'rgba(255,255,255,0.06)','stroke-width':0.5}));
      g.appendChild(ce('text',{className:'inst-label',x:x+61,y:iy+22,'text-anchor':'middle',fill:'#64748b','font-size':'8','font-family':'monospace'},['Inst '+(j+1)]));
    }
    // Arrow
    if(i<stages.length-1){
      svg.appendChild(ce('line',{x1:x+122,y1:y+100,x2:x+132,y2:y+100,stroke:'#64748b','stroke-width':1,opacity:0.3,'marker-end':'url(#parr)'}));
    }
    g.addEventListener('click',function(){showInfo(s)});
    svg.appendChild(g)});
  var defs=ce('defs',{});
  defs.innerHTML='<marker id="parr" viewBox="0 0 10 10" refX="10" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0,0 L10,5 L0,10" fill="#64748b"/></marker>';
  svg.insertBefore(defs,svg.firstChild);
  // Title
  svg.appendChild(ce('text',{x:400,y:35,'text-anchor':'middle',fill:'#64748b','font-size':'12','font-weight':'600','font-family':'Inter,sans-serif',opacity:0.6},['PIPELINE STAGES — Instructions Flow Left to Right']));
  container.appendChild(svg)}

function animateNodes(t){
  var idx=Math.floor(t*0.35)%stages.length;
  // Animate instruction labels flowing
  var phase=t*2;
  $$('.inst-label').forEach(function(el,i){
    var stageIdx=Math.floor(i/4);
    var slotIdx=i%4;
    var instIdx=Math.floor(phase+slotIdx-stageIdx);
    var opcodes=['ADD','SUB','LD','ST','AND','OR','XOR','CMP'];
    el.textContent=opcodes[instIdx%opcodes.length]+' R'+((instIdx+1)%8);
  });
  $$('.node .node-bg').forEach(function(el,i){
    var s=stages[i];
    if(i===idx){el.setAttribute('stroke-width','2.5');el.setAttribute('fill',s.color+'15')}
    else{el.setAttribute('stroke-width','1.5');el.setAttribute('fill','rgba(255,255,255,0.02)')}})}

function init(){
  initDOM();setTheme(getTheme());
  if(dom.theme)dom.theme.addEventListener('click',function(){setTheme(getTheme()==='light'?'dark':'light')});
  if(dom.speed)dom.speed.addEventListener('input',function(){state.speed=parseFloat(this.value);if(dom.speedLabel)dom.speedLabel.textContent=state.speed.toFixed(2)+'×'});
  if(dom.infoClose)dom.infoClose.addEventListener('click',function(){dom.info.hidden=true;state.selectedId=null});
  if(dom.completionReset)dom.completionReset.addEventListener('click',function(){dom.completion.hidden=true;state.challengeDone=false;state.challengeIdx=0;state.quizResults=[];renderChallenge()});
  if(dom.help)dom.help.addEventListener('click',function(){showInfo({name:'How to use',desc:'Explore the 6-stage pipeline. Each stage processes instructions (shown inside). Instructions flow left to right with new ones entering every cycle. The hazard detector monitors for conflicts.',analogy:'',detail:''})});
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
