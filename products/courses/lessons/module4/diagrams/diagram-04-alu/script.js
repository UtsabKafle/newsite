(function(){
'use strict';
var $=function(s,c){return(c||document).querySelector(s)};
var $$=function(s,c){return Array.from((c||document).querySelectorAll(s))};
var ce=function(t,a,c){var e=document.createElement(t);if(a)Object.entries(a).forEach(function(kv){var k=kv[0],v=kv[1];if(k==='className')e.className=v;else if(k==='style'&&typeof v==='object')Object.assign(e.style,v);else if(k==='dataset')Object.assign(e.dataset,v);else e.setAttribute(k,v)});if(c)c.forEach(function(x){if(typeof x==='string')e.appendChild(document.createTextNode(x));else if(x)e.appendChild(x)});return e};
// ALU nodes
var nodes=[{id:'add',name:'Adder',color:'#3b82f6',desc:'Performs addition using carry-lookahead logic. Addition is the foundation of most ALU operations.',analogy:'Like a basic adding machine.',detail:'Full adder takes A, B, carry-in → sum, carry-out. Carry-lookahead computes all carries in parallel. 64-bit adders chain these units. Addition takes 1 cycle.'},{id:'sub',name:'Subtractor',color:'#f43f5e',desc:'Performs subtraction via two\'s complement: A - B = A + (~B + 1). Reuses adder hardware.',analogy:'Like adding a negative number instead of subtracting.',detail:'The carry-in is set to 1 for subtraction. Control unit sets subtract mode flag. Overflow detection checks sign mismatch.'},{id:'mul',name:'Multiplier',color:'#eab308',desc:'Performs multiplication via Booth\'s algorithm and Wallace trees for efficient partial product addition.',analogy:'Like calculating 5×3 by adding 5 three times, but at hardware speed.',detail:'Booth\'s algorithm processes bit pairs to reduce partial products. Wallace trees add in parallel. Multiply takes 3-5 cycles.'},{id:'barrel',name:'Barrel Shifter',color:'#10b981',desc:'Shifts/rotates bits by any amount in one cycle using a logarithmic multiplexer network.',analogy:'Like moving items on a conveyor belt simultaneously.',detail:'A 64-bit barrel shifter uses 384 multiplexers. Supports logical, arithmetic, and rotate shifts. Also extracts bit fields.'},{id:'cmp',name:'Comparator',color:'#a855f7',desc:'Compares values and sets status flags (Zero, Carry, Overflow, Sign) for conditional branching.',analogy:'Like a balance scale.',detail:'Comparison is done by subtracting operands and discarding result. Flags: ZF (equal), CF (unsigned <), SF (negative), OF (overflow).'},{id:'flags',name:'Status Flags',color:'#06b6d4',desc:'Stores condition codes: Zero (Z), Carry (C), Overflow (O), Sign (S). Checked by conditional jumps.',analogy:'Like indicator lights on a dashboard.',detail:'x86 has 18 status/control flags. Most arithmetic instructions update flags. Flags are preserved across function calls by convention.'}];
var quizData={questions:[{q:'What is the foundation of most ALU arithmetic operations?',options:['Multiplication','Addition','Division','Bit shifting'],answer:1},{q:'How does a subtractor reuse adder hardware?',options:['By inverting inputs','Using two\'s complement','With a separate circuit','By dividing'],answer:1},{q:'What algorithm do modern multipliers use?',options:['Euclidean','Booth\'s algorithm','Newton-Raphson','Quick sort'],answer:1},{q:'How many multiplexers does a 64-bit barrel shifter require?',options:['64','128','384','512'],answer:2},{q:'Which flag indicates two values are equal after comparison?',options:['Carry Flag','Overflow Flag','Zero Flag','Sign Flag'],answer:2},{q:'How many status and control flags does x86 have?',options:['8','12','18','32'],answer:2}],maxAttempts:2};
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

// Draw ALU logic gate schematic
function drawViz(container){
  container.innerHTML='';
  var svg=ce('svg',{className:'viz-svg',viewBox:'0 0 800 500',preserveAspectRatio:'xMidYMid meet'});
  var defs=ce('defs',{});
  defs.innerHTML='<linearGradient id="alBg" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#0f1729"/><stop offset="100%" stop-color="#0a0e17"/></linearGradient>';
  svg.appendChild(defs);
  svg.appendChild(ce('rect',{x:0,y:0,width:800,height:500,fill:'url(#alBg)'}));
  // ALU central box
  svg.appendChild(ce('rect',{x:300,y:120,width:200,height:260,rx:4,fill:'rgba(59,130,246,0.05)',stroke:'#3b82f6','stroke-width':1,'stroke-dasharray':'4 4'}));
  svg.appendChild(ce('text',{x:400,y:255,'text-anchor':'middle',fill:'#3b82f6','font-size':'18','font-weight':'700','font-family':'Inter,sans-serif',opacity:0.3},['ALU']));
  // Components arranged around ALU
  var positions=[
    {x:130,y:150},{x:130,y:240},{x:130,y:330},
    {x:550,y:150},{x:550,y:240},{x:550,y:330}];
  nodes.forEach(function(n,i){
    var g=ce('g',{className:'node',dataset:{id:n.id}});
    var px=positions[i].x,py=positions[i].y;
    g.appendChild(ce('rect',{className:'node-bg',x:px,y:py,width:130,height:60,rx:8,fill:'rgba(255,255,255,0.02)',stroke:n.color,'stroke-width':1.5}));
    g.appendChild(ce('text',{className:'node-label',x:px+65,y:py+35,'text-anchor':'middle',fill:n.color,'font-size':'12','font-weight':'600','font-family':'Inter,sans-serif'},[n.name]));
    // Connection to ALU center
    var ex=px<300?px+130:px,ey=py+30,ex2=px<300?300:500,ey2=py+30;
    svg.insertBefore(ce('line',{x1:ex,y1:ey,x2:ex2,y2:ey2,stroke:n.color,'stroke-width':1,opacity:0.3}),svg.querySelector('.node'));
    if(px<300){
      svg.insertBefore(ce('polygon',{points:(ex2-8)+','+(ey2-4)+' '+ex2+','+ey2+' '+(ex2-8)+','+(ey2+4),fill:n.color,opacity:0.3}),svg.querySelector('.node'));
    } else {
      svg.insertBefore(ce('polygon',{points:(ex+8)+','+(ey-4)+' '+ex+','+ey+' '+(ex+8)+','+(ey+4),fill:n.color,opacity:0.3}),svg.querySelector('.node'));
    }
    g.addEventListener('click',function(){showInfo(n)});
    svg.appendChild(g)});
  // Input/output labels
  svg.appendChild(ce('text',{x:100,y:100,'text-anchor':'middle',fill:'#64748b','font-size':'10','font-family':'Inter,sans-serif'},['INPUT OPERANDS']));
  svg.appendChild(ce('text',{x:700,y:100,'text-anchor':'middle',fill:'#64748b','font-size':'10','font-family':'Inter,sans-serif'},['OUTPUT / FLAGS']));
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
  if(dom.help)dom.help.addEventListener('click',function(){showInfo({name:'How to use',desc:'Explore the ALU logic circuit diagram. Components connect to the central ALU engine. Click each circuit type to learn about binary operations.',analogy:'',detail:''})});
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
