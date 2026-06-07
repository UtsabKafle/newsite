(function(){
'use strict';
var $=function(s,c){return(c||document).querySelector(s)};
var $$=function(s,c){return Array.from((c||document).querySelectorAll(s))};
var ce=function(t,a,c){var e=document.createElement(t);if(a)Object.entries(a).forEach(function(kv){var k=kv[0],v=kv[1];if(k==='className')e.className=v;else if(k==='style'&&typeof v==='object')Object.assign(e.style,v);else if(k==='dataset')Object.assign(e.dataset,v);else e.setAttribute(k,v)});if(c)c.forEach(function(x){if(typeof x==='string')e.appendChild(document.createTextNode(x));else if(x)e.appendChild(x)});return e};
var archs=[{id:'cisc',name:'x86 (CISC)',color:'#3b82f6',example:'MOV EAX, [EBX+ECX*4]',desc:'Complex Instruction Set Computer. Variable-length instructions (1-15 bytes). Dominant in desktops, laptops, servers.',analogy:'Like a Swiss Army knife with many built-in tools.',detail:'CISC has complex addressing modes and instructions combining memory access with computation. Modern x86 CPUs internally convert to RISC-like micro-ops. Intel and AMD both use x86-64.'},{id:'risc',name:'ARM (RISC)',color:'#10b981',example:'LDR R0, [R1, #4]',desc:'Reduced Instruction Set Computer. Fixed 32-bit instructions. Dominant in mobile. Power-efficient design.',analogy:'Like a set of simple, dedicated tools.',detail:'RISC has load-store architecture (memory only via explicit loads/stores). Large uniform register files. Apple M-series uses ARM. Simpler decoding than x86.'},{id:'riscv',name:'RISC-V',color:'#eab308',example:'ld x5, 8(x6)',desc:'Open-source ISA gaining traction. Modular design with base integer ISA plus optional extensions.',analogy:'Like an open-source toolkit anyone can use and extend.',detail:'RISC-V is free and open. Base ISA is only 47 instructions. Extensions include M (multiply), F (float), V (vector). Growing ecosystem of cores and tools.'},{id:'simd',name:'SIMD (AVX/NEON)',color:'#a855f7',example:'VADDSD XMM0, XMM1',desc:'Single Instruction Multiple Data processes multiple data elements in parallel with one instruction.',analogy:'Like a cafeteria tray holding many plates at once.',detail:'SIMD enables parallel data processing for multimedia, scientific computing. x86 has SSE/AVX/AVX-512. ARM has NEON/SVE. Width has grown from 64-bit to 512-bit.'}];
var quizData={questions:[{q:'What variable length range do x86 instructions have?',options:['1-3 bytes','1-15 bytes','2-8 bytes','4-16 bytes'],answer:1},{q:'Which architecture uses a load-store design?',options:['x86 (CISC)','ARM (RISC)','Both','Neither'],answer:1},{q:'What is unique about RISC-V?',options:['It is proprietary','It is open-source','It is the fastest','It is the oldest'],answer:1},{q:'SIMD stands for:',options:['Single Instruction Multiple Data','Simple Integrated Module','Sequential Instruction Mode','Standard Interface'],answer:0},{q:'Which architecture is dominant in mobile devices?',options:['x86','ARM','RISC-V','MIPS'],answer:1},{q:'How many instructions are in the RISC-V base ISA?',options:['16','32','47','64'],answer:2}],maxAttempts:2};
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

// Draw instruction set comparison cards
function drawViz(container){
  container.innerHTML='';
  var svg=ce('svg',{className:'viz-svg',viewBox:'0 0 800 500',preserveAspectRatio:'xMidYMid meet'});
  svg.appendChild(ce('rect',{x:0,y:0,width:800,height:500,fill:'#0a0e17'}));
  svg.appendChild(ce('text',{x:400,y:25,'text-anchor':'middle',fill:'#64748b','font-size':'10','font-weight':'600','font-family':'Inter,sans-serif',opacity:0.6},['▼ ARCHITECTURE COMPARISON ▼']));
  archs.forEach(function(a,i){
    var g=ce('g',{className:'node',dataset:{id:a.id}});
    var x=15+i*196,y=40;
    g.appendChild(ce('rect',{className:'node-bg',x:x,y:y,width:180,height:200,rx:10,fill:'rgba(255,255,255,0.02)',stroke:a.color,'stroke-width':1.5}));
    g.appendChild(ce('text',{x:x+90,y:y+30,'text-anchor':'middle',fill:a.color,'font-size':'14','font-weight':'700','font-family':'Inter,sans-serif'},[a.name]));
    g.appendChild(ce('rect',{x:x+15,y:y+45,width:150,height:40,rx:4,fill:'rgba(255,255,255,0.03)',stroke:'rgba(255,255,255,0.06)','stroke-width':0.5}));
    g.appendChild(ce('text',{x:x+90,y:y+70,'text-anchor':'middle',fill:'#22c55e','font-size':'11','font-weight':'600','font-family':'monospace'},[a.example]));
    // Description
    var words=a.desc.split(' ');
    var lines=[];
    var cl='';
    words.forEach(function(w){if((cl+' '+w).length>25){lines.push(cl);cl=w}else cl=cl?(cl+' '+w):w});
    if(cl)lines.push(cl);
    lines=[lines.slice(0,2).join(' '),lines.slice(2,5).join(' '),lines.slice(5).join(' ')];
    lines.forEach(function(l,li){
      if(l)g.appendChild(ce('text',{x:x+90,y:y+105+li*16,'text-anchor':'middle',fill:'#94a3b8','font-size':'8','font-family':'Inter,sans-serif'},[l.trim()]));});
    g.addEventListener('click',function(){showInfo(a)});
    svg.appendChild(g)});
  container.appendChild(svg)}

function animateNodes(t){
  var idx=Math.floor(t*0.35)%archs.length;
  $$('.node .node-bg').forEach(function(el,i){
    var a=archs[i];
    if(i===idx){el.setAttribute('stroke-width','2.5');el.setAttribute('fill',a.color+'15')}
    else{el.setAttribute('stroke-width','1.5');el.setAttribute('fill','rgba(255,255,255,0.02)')}})}

function init(){
  initDOM();setTheme(getTheme());
  if(dom.theme)dom.theme.addEventListener('click',function(){setTheme(getTheme()==='light'?'dark':'light')});
  if(dom.speed)dom.speed.addEventListener('input',function(){state.speed=parseFloat(this.value);if(dom.speedLabel)dom.speedLabel.textContent=state.speed.toFixed(2)+'×'});
  if(dom.infoClose)dom.infoClose.addEventListener('click',function(){dom.info.hidden=true;state.selectedId=null});
  if(dom.completionReset)dom.completionReset.addEventListener('click',function(){dom.completion.hidden=true;state.challengeDone=false;state.challengeIdx=0;state.quizResults=[];renderChallenge()});
  if(dom.help)dom.help.addEventListener('click',function(){showInfo({name:'How to use',desc:'Explore different instruction set architectures. Each card shows the architecture name, an opcode example, and key characteristics. Click for detailed information.',analogy:'',detail:''})});
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
