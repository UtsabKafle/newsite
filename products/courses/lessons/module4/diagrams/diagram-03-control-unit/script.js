(function(){
'use strict';
var $=function(s,c){return(c||document).querySelector(s)};
var $$=function(s,c){return Array.from((c||document).querySelectorAll(s))};
var ce=function(t,a,c){var e=document.createElement(t);if(a)Object.entries(a).forEach(function(kv){var k=kv[0],v=kv[1];if(k==='className')e.className=v;else if(k==='style'&&typeof v==='object')Object.assign(e.style,v);else if(k==='dataset')Object.assign(e.dataset,v);else e.setAttribute(k,v)});if(c)c.forEach(function(x){if(typeof x==='string')e.appendChild(document.createTextNode(x));else if(x)e.appendChild(x)});return e};
var steps=[{id:'fet',name:'1. Instruction Fetch',color:'#3b82f6',desc:'Retrieves the next instruction from L1 instruction cache using the Program Counter (PC) as the address pointer.',analogy:'Like pulling the next page from a stack of instructions.',detail:'The fetcher reads memory at PC address. Can fetch multiple instructions per cycle (prefetch). Branch prediction helps guess which instructions to fetch next.'},{id:'dec',name:'2. Instruction Decode',color:'#a855f7',desc:'Translates instruction opcode into micro-operations the execution units can process.',analogy:'Like a translator converting a complex sentence into simple action steps.',detail:'Identifies opcode (operation) and operands (data locations). x86 instructions decode into 1-4 micro-ops. Modern decoders handle 4-6 instructions per cycle.'},{id:'seq',name:'3. Execution Sequence',color:'#eab308',desc:'Sends decoded micro-ops to available execution units (ALU, FPU, load/store) in order.',analogy:'Like a dispatcher assigning tasks to available workers.',detail:'Out-of-order execution allows younger instructions to execute before older ones if their operands are ready. The reorder buffer tracks dependencies and commits results in program order.'},{id:'ucode',name:'4. Microcode ROM',color:'#10b981',desc:'Low-level control instructions that handle complex CISC operations by breaking them into simpler steps.',analogy:'Like a recipe book for complex dishes.',detail:'Microcode is stored in a dedicated ROM on the CPU. Complex x86 instructions (like string operations) are implemented as microcode sequences. Allows bug fixes via microcode updates.'},{id:'iq',name:'5. Instruction Queue',color:'#f43f5e',desc:'Buffers fetched instructions to maintain a steady flow to the decoder, smoothing bursts.',analogy:'Like a waiting room before entering a theater.',detail:'The queue holds pre-fetched instructions. It absorbs fetch stalls. Typical depth is 12-20 entries. The decoder pulls from the queue at its own rate.'}];
var connections=[[0,1,2,3,4]];
var quizData={questions:[{q:'What does the instruction fetcher use to know which instruction to fetch?',options:['ALU result','Program Counter','Cache size','Clock speed'],answer:1},{q:'Why are x86 instructions more complex to decode than ARM instructions?',options:['They are longer','They are variable-length (1-15 bytes)','They have more registers','They are encrypted'],answer:1},{q:'What is microcode?',options:['Programming language','Low-level CPU control instructions','Type of cache','Memory controller'],answer:1},{q:'The instruction queue helps to:',options:['Execute instructions','Buffer fetched instructions','Decode instructions','Write results'],answer:1},{q:'What enables out-of-order execution?',options:['Cache','Reorder buffer','Clock speed','Voltage'],answer:1},{q:'Branch prediction helps the fetcher to:',options:['Execute branches','Guess which instructions to fetch','Decode faster','Save power'],answer:1}],maxAttempts:2};
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

// Draw flowchart-style control unit
function drawViz(container){
  container.innerHTML='';
  var svg=ce('svg',{className:'viz-svg',viewBox:'0 0 800 500',preserveAspectRatio:'xMidYMid meet'});
  var defs=ce('defs',{});
  defs.innerHTML='<marker id="arrow" viewBox="0 0 10 10" refX="10" refY="5" markerWidth="8" markerHeight="8" orient="auto"><path d="M0,0 L10,5 L0,10" fill="#64748b"/></marker>';
  svg.appendChild(defs);
  steps.forEach(function(s,i){
    var g=ce('g',{className:'node',dataset:{id:s.id}});
    var y=40+i*85;
    // Decision diamond for decoder, rectangle for others
    if(i===1){// Decode = diamond
      g.appendChild(ce('polygon',{className:'node-bg',points:'400,'+y+' 520,'+(y+40)+' 400,'+(y+80)+' 280,'+(y+40),fill:'rgba(255,255,255,0.02)',stroke:s.color,'stroke-width':1.5}));
      g.appendChild(ce('text',{className:'node-label',x:400,y:y+44,'text-anchor':'middle',fill:s.color,'font-size':'11','font-weight':'600','font-family':'Inter,sans-serif'},['DECODE']));
    }else{
      g.appendChild(ce('rect',{className:'node-bg',x:280,y:y,width:240,height:70,rx:8,fill:'rgba(255,255,255,0.02)',stroke:s.color,'stroke-width':1.5}));
      g.appendChild(ce('text',{className:'node-label',x:400,y:y+40,'text-anchor':'middle',fill:s.color,'font-size':'11','font-weight':'600','font-family':'Inter,sans-serif'},[s.name]));
    }
    // Connection arrow
    if(i<steps.length-1){
      var y2=40+(i+1)*85;
      svg.appendChild(ce('line',{x1:400,y1:y+70,x2:400,y2:y2,'stroke':'#64748b','stroke-width':1.5,opacity:0.4,'marker-end':'url(#arrow)'}));
    }
    g.addEventListener('click',function(){showInfo(s)});
    svg.appendChild(g)});
  container.appendChild(svg)}

function animateNodes(t){
  var idx=Math.floor(t*0.35)%steps.length;
  $$('.node-bg').forEach(function(el,i){
    var s=steps[i];
    if(i===idx){el.setAttribute('stroke-width','2.5');el.setAttribute('fill',s.color+'20');if(el.tagName==='POLYGON')el.setAttribute('fill',s.color+'25')}
    else{el.setAttribute('stroke-width','1.5');el.setAttribute('fill','rgba(255,255,255,0.02)')}})}

function init(){
  initDOM();setTheme(getTheme());
  if(dom.theme)dom.theme.addEventListener('click',function(){setTheme(getTheme()==='light'?'dark':'light')});
  if(dom.speed)dom.speed.addEventListener('input',function(){state.speed=parseFloat(this.value);if(dom.speedLabel)dom.speedLabel.textContent=state.speed.toFixed(2)+'×'});
  if(dom.infoClose)dom.infoClose.addEventListener('click',function(){dom.info.hidden=true;state.selectedId=null});
  if(dom.completionReset)dom.completionReset.addEventListener('click',function(){dom.completion.hidden=true;state.challengeDone=false;state.challengeIdx=0;state.quizResults=[];renderChallenge()});
  if(dom.help)dom.help.addEventListener('click',function(){showInfo({name:'How to use',desc:'Explore the Control Unit flowchart. Instructions flow from Fetch through Decode, Sequencing, Microcode ROM to the Instruction Queue. Click each step for details.',analogy:'',detail:''})});
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
