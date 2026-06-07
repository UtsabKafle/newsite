(function(){
'use strict';
var $=function(s,c){return(c||document).querySelector(s)};
var $$=function(s,c){return Array.from((c||document).querySelectorAll(s))};
var ce=function(t,a,c){var e=document.createElement(t);if(a)Object.entries(a).forEach(function(kv){var k=kv[0],v=kv[1];if(k==='className')e.className=v;else if(k==='style'&&typeof v==='object')Object.assign(e.style,v);else if(k==='dataset')Object.assign(e.dataset,v);else e.setAttribute(k,v)});if(c)c.forEach(function(x){if(typeof x==='string')e.appendChild(document.createTextNode(x));else if(x)e.appendChild(x)});return e};
var regs=[{id:'rax',name:'RAX (Accumulator)',color:'#3b82f6',val:'0x00FF',desc:'Primary accumulator for arithmetic operations and function return values.',analogy:'Like the display on a calculator showing current result.',detail:'In x86-64, RAX is 64 bits. Some instructions implicitly use RAX (MUL, DIV, I/O). Often the fastest register to access.'},{id:'rbx',name:'RBX (Base)',color:'#a855f7',val:'0x1A2B',desc:'Base register for memory addressing. Callee-saved across function calls.',analogy:'Like a reference bookmark.',detail:'RBX is one of the non-volatile registers that must be preserved by called functions. Often used as a pointer to base data structures.'},{id:'rcx',name:'RCX (Counter)',color:'#eab308',val:'0x0040',desc:'General-purpose counter for loop iterations and shift operations.',analogy:'Like a lap counter in a race.',detail:'RCX is used as the implicit counter for REP string instructions and loop operations. Also used for shift/rotate count.'},{id:'rdx',name:'RDX (Data)',color:'#10b981',val:'0x0080',desc:'Data register for I/O operations and multiply/divide high-order results.',analogy:'Like a scratch pad.',detail:'RDX stores the high-order 64 bits of a 128-bit multiply result. Used for I/O port addressing and as an extension of RAX.'},{id:'rsp',name:'RSP (Stack Ptr)',color:'#f43f5e',val:'0x7FFF',desc:'Stack pointer pointing to the top of the call stack.',analogy:'Like a stack of plates.',detail:'RSP is implicitly modified by PUSH, POP, CALL, and RET instructions. Always points to the last pushed item.'},{id:'rbp',name:'RBP (Base Ptr)',color:'#06b6d4',val:'0x8000',desc:'Base pointer for stack frame referencing local variables and parameters.',analogy:'Like a fixed reference point on a map.',detail:'RBP marks the beginning of a stack frame. Used by debuggers for stack trace generation. Optional with modern frame pointer omission.'},{id:'rsi',name:'RSI (Src Index)',color:'#f97316',val:'0x2000',desc:'Source index for string operations and memory copying.',analogy:'Like a reading cursor.',detail:'RSI is the implicit source address for string instructions like MOVS, LODS, and CMPS. Typically points to source data.'},{id:'rdi',name:'RDI (Dest Index)',color:'#22d3ee',val:'0x3000',desc:'Destination index for string operations and memory copying.',analogy:'Like a writing cursor.',detail:'RDI is the implicit destination address for string instructions. Represents where data is being written to.'}];
var quizData={questions:[{q:'Which register is used as the primary accumulator?',options:['RBX','RCX','RAX','RDX'],answer:2},{q:'What does RSP point to?',options:['Heap memory','Code section','Top of stack','Data segment'],answer:2},{q:'Which register is used as a loop counter?',options:['RAX','RCX','RDX','RBP'],answer:1},{q:'RSI and RDI are used for:',options:['Arithmetic','Stack operations','String/memory operations','Interrupts'],answer:2},{q:'How many bits wide are x86-64 general purpose registers?',options:['32','64','128','256'],answer:1},{q:'Which register marks the start of a stack frame?',options:['RSP','RBP','RAX','RSI'],answer:1}],maxAttempts:2};
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

// Draw register file
function drawViz(container){
  container.innerHTML='';
  var svg=ce('svg',{className:'viz-svg',viewBox:'0 0 800 500',preserveAspectRatio:'xMidYMid meet'});
  svg.appendChild(ce('rect',{x:0,y:0,width:800,height:500,fill:'#0a0e17'}));
  // Grid
  for(var i=0;i<8;i++){
    for(var j=0;j<4;j++){
      svg.appendChild(ce('rect',{x:40+i*92,y:60+j*110,width:82,height:100,rx:4,fill:'rgba(255,255,255,0.01)',stroke:'rgba(255,255,255,0.04)','stroke-width':1}));
    }
  }
  regs.forEach(function(r,i){
    var g=ce('g',{className:'node',dataset:{id:r.id}});
    var row=Math.floor(i/4),col=i%4;
    var x=40+col*92,y=60+row*110;
    g.appendChild(ce('rect',{className:'node-bg',x:x,y:y,width:82,height:100,rx:6,fill:'rgba(255,255,255,0.02)',stroke:r.color,'stroke-width':1.5}));
    g.appendChild(ce('text',{x:x+41,y:y+30,'text-anchor':'middle',fill:r.color,'font-size':'10','font-weight':'700','font-family':'monospace'},[r.name.split(' ')[0]]));
    g.appendChild(ce('text',{x:x+41,y:y+50,'text-anchor':'middle',fill:'#64748b','font-size':'8','font-family':'Inter,sans-serif'},[r.name.includes('(')?r.name.split('(')[1].replace(')',''):'']));
    g.appendChild(ce('text',{x:x+41,y:y+75,'text-anchor':'middle',fill:'#22c55e','font-size':'13','font-weight':'700','font-family':'monospace'},[r.val]));
    g.appendChild(ce('rect',{x:x+10,y:y+82,width:62,height:8,rx:2,fill:'rgba(34,197,94,0.1)',stroke:'rgba(34,197,94,0.2)','stroke-width':0.5}));
    g.addEventListener('click',function(){showInfo(r)});
    svg.appendChild(g)});
  container.appendChild(svg)}

function animateNodes(t){
  // Simulate value updates
  var idx=Math.floor(t*0.3)%regs.length;
  $$('.node-bg').forEach(function(el,i){
    var r=regs[i];
    if(i===idx){el.setAttribute('stroke-width','2.5');el.setAttribute('fill',r.color+'20')}
    else{el.setAttribute('stroke-width','1.5');el.setAttribute('fill','rgba(255,255,255,0.02)')}})}

function init(){
  initDOM();setTheme(getTheme());
  if(dom.theme)dom.theme.addEventListener('click',function(){setTheme(getTheme()==='light'?'dark':'light')});
  if(dom.speed)dom.speed.addEventListener('input',function(){state.speed=parseFloat(this.value);if(dom.speedLabel)dom.speedLabel.textContent=state.speed.toFixed(2)+'×'});
  if(dom.infoClose)dom.infoClose.addEventListener('click',function(){dom.info.hidden=true;state.selectedId=null});
  if(dom.completionReset)dom.completionReset.addEventListener('click',function(){dom.completion.hidden=true;state.challengeDone=false;state.challengeIdx=0;state.quizResults=[];renderChallenge()});
  if(dom.help)dom.help.addEventListener('click',function(){showInfo({name:'How to use',desc:'Explore the CPU register file. Each cell shows a register name, description, and current hex value. Click any register for details on its role.',analogy:'',detail:''})});
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
