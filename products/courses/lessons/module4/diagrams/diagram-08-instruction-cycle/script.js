(function(){
'use strict';
var $=function(s,c){return(c||document).querySelector(s)};
var $$=function(s,c){return Array.from((c||document).querySelectorAll(s))};
var ce=function(t,a,c){var e=document.createElement(t);if(a)Object.entries(a).forEach(function(kv){var k=kv[0],v=kv[1];if(k==='className')e.className=v;else if(k==='style'&&typeof v==='object')Object.assign(e.style,v);else if(k==='dataset')Object.assign(e.dataset,v);else e.setAttribute(k,v)});if(c)c.forEach(function(x){if(typeof x==='string')e.appendChild(document.createTextNode(x));else if(x)e.appendChild(x)});return e};
var stages=[{id:'fetch',name:'FETCH',color:'#3b82f6',desc:'Retrieves instruction from L1I cache using Program Counter address. Multiple instructions can be prefetched.',analogy:'Like a chef reading the next step from a recipe.',detail:'PC provides address. Instructions loaded from L1I (fast) or main memory (slow). Branch prediction guides which instructions to fetch. Fetched instructions go to a queue.'},{id:'decode',name:'DECODE',color:'#a855f7',desc:'Translates instruction opcode into micro-ops. Determines operation type, reads register operands, generates control signals.',analogy:'Like a translator converting a sentence into action steps.',detail:'Decoder breaks instruction into opcode, operands, and immediate values. Complex x86 instructions become 1-4 micro-ops. Register renaming happens here.'},{id:'exec',name:'EXECUTE',color:'#eab308',desc:'Performs the operation using ALU (arithmetic), FPU (floating point), or load/store unit (memory access).',analogy:'Like actually mixing ingredients after reading the recipe.',detail:'ALU performs the operation. Results produced in 1 cycle (add) to 5 cycles (mul). Branch instructions resolve here. Out-of-order execution may reorder instructions.'},{id:'mem',name:'MEMORY',color:'#10b981',desc:'Handles data cache access for loads and stores. Cache hit = fast; miss = main memory fetch (~100+ cycles).',analogy:'Like fetching ingredients from pantry or storing leftovers.',detail:'Load: data read from cache into MDR. Store: data written from registers to store buffer. Cache miss causes pipeline stall. Not all instructions need this stage.'},{id:'wb',name:'WRITEBACK',color:'#f43f5e',desc:'Commits ALU result to destination register. Makes result available to subsequent instructions.',analogy:'Like writing the answer down.',detail:'Results written to destination register. Forwarding sends results directly to dependent instructions. The write-back stage retires the instruction.'}];
var quizData={questions:[{q:'What is the first stage of the instruction cycle?',options:['Decode','Fetch','Execute','Writeback'],answer:1},{q:'What does the decode stage produce from instructions?',options:['Machine code','Micro-ops','Binary data','Cache lines'],answer:1},{q:'Which stage writes the result back to a register?',options:['Fetch','Decode','Execute','Writeback'],answer:3},{q:'What causes a pipeline stall in the memory stage?',options:['ALU overflow','Cache miss','Decoder error','Branch taken'],answer:1},{q:'Where does instruction prefetching happen?',options:['Decode stage','Fetch stage','Execute stage','Writeback stage'],answer:1},{q:'The instruction cycle is also known as:',options:['ALU cycle','Fetch-decode-execute cycle','Clock cycle','Memory cycle'],answer:1}],maxAttempts:2};
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

// Draw instruction cycle pipeline visualization
function drawViz(container){
  container.innerHTML='';
  var svg=ce('svg',{className:'viz-svg',viewBox:'0 0 800 500',preserveAspectRatio:'xMidYMid meet'});
  svg.appendChild(ce('rect',{x:0,y:0,width:800,height:500,fill:'#0a0e17'}));
  svg.appendChild(ce('text',{x:400,y:30,'text-anchor':'middle',fill:'#64748b','font-size':'12','font-weight':'600','font-family':'Inter,sans-serif',opacity:0.6},['INSTRUCTION CYCLE: FETCH → DECODE → EXECUTE → MEMORY → WRITEBACK']));
  stages.forEach(function(s,i){
    var g=ce('g',{className:'node',dataset:{id:s.id}});
    var x=30+i*150,y=70;
    // Stage block
    g.appendChild(ce('rect',{className:'node-bg',x:x,y:y,width:130,height:120,rx:8,fill:'rgba(255,255,255,0.02)',stroke:s.color,'stroke-width':1.5}));
    g.appendChild(ce('text',{x:x+65,y:y+30,'text-anchor':'middle',fill:s.color,'font-size':'13','font-weight':'700','font-family':'Inter,sans-serif'},[s.name]));
    g.appendChild(ce('text',{x:x+65,y:y+55,'text-anchor':'middle',fill:'#94a3b8','font-size':'9','font-family':'Inter,sans-serif'},[s.desc.split('.')[0]]));
    // Cycle counter
    g.appendChild(ce('text',{x:x+65,y:y+95,'text-anchor':'middle',fill:'#64748b','font-size':'9','font-family':'monospace'},['Cycle: <tspan class="cycle-num">0</tspan>']));
    g.addEventListener('click',function(){showInfo(s)});
    svg.appendChild(g);
    // Arrow
    if(i<stages.length-1){
      svg.appendChild(ce('line',{x1:x+130,y1:y+65,x2:x+150,y2:y+65,stroke:'#64748b','stroke-width':1.5,opacity:0.3,'marker-end':'url(#arr)'}));
    }});
  var defs=ce('defs',{});
  defs.innerHTML='<marker id="arr" viewBox="0 0 10 10" refX="10" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0,0 L10,5 L0,10" fill="#64748b"/></marker>';
  svg.insertBefore(defs,svg.firstChild);
  // Instruction in-flight display
  var instBox=ce('g',{id:'inst-box'});
  instBox.appendChild(ce('rect',{x:280,y:230,width:240,height:50,rx:6,fill:'rgba(59,130,246,0.05)',stroke:'#3b82f6','stroke-width':1}));
  instBox.appendChild(ce('text',{x:400,y:255,'text-anchor':'middle',fill:'#3b82f6','font-size':'12','font-weight':'600','font-family':'monospace'},['Current: <tspan id="curr-inst">ADD R1, R2</tspan>']));
  svg.appendChild(instBox);
  // Fun fact area
  svg.appendChild(ce('text',{x:400,y:320,'text-anchor':'middle',fill:'#64748b','font-size':'10','font-family':'Inter,sans-serif'},['💡 Each tick of the clock moves instructions one stage forward']));
  container.appendChild(svg)}

function animateNodes(t){
  var idx=Math.floor(t*0.4)%stages.length;
  $$('.node .node-bg').forEach(function(el,i){
    var s=stages[i];
    if(i===idx){el.setAttribute('stroke-width','2.5');el.setAttribute('fill',s.color+'20')}
    else{el.setAttribute('stroke-width','1.5');el.setAttribute('fill','rgba(255,255,255,0.02)')}});
  // Update cycle numbers
  $$('.cycle-num').forEach(function(el,i){el.textContent=Math.floor(t*0.4+i+1)})}

function init(){
  initDOM();setTheme(getTheme());
  if(dom.theme)dom.theme.addEventListener('click',function(){setTheme(getTheme()==='light'?'dark':'light')});
  if(dom.speed)dom.speed.addEventListener('input',function(){state.speed=parseFloat(this.value);if(dom.speedLabel)dom.speedLabel.textContent=state.speed.toFixed(2)+'×'});
  if(dom.infoClose)dom.infoClose.addEventListener('click',function(){dom.info.hidden=true;state.selectedId=null});
  if(dom.completionReset)dom.completionReset.addEventListener('click',function(){dom.completion.hidden=true;state.challengeDone=false;state.challengeIdx=0;state.quizResults=[];renderChallenge()});
  if(dom.help)dom.help.addEventListener('click',function(){showInfo({name:'How to use',desc:'Explore the instruction cycle pipeline. Instructions flow left to right through Fetch → Decode → Execute → Memory → Writeback. Click each stage for details. The highlighted stage advances with the animation.',analogy:'',detail:''})});
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
