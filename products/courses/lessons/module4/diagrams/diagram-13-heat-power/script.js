(function(){
'use strict';
var $=function(s,c){return(c||document).querySelector(s)};
var $$=function(s,c){return Array.from((c||document).querySelectorAll(s))};
var ce=function(t,a,c){var e=document.createElement(t);if(a)Object.entries(a).forEach(function(kv){var k=kv[0],v=kv[1];if(k==='className')e.className=v;else if(k==='style'&&typeof v==='object')Object.assign(e.style,v);else if(k==='dataset')Object.assign(e.dataset,v);else e.setAttribute(k,v)});if(c)c.forEach(function(x){if(typeof x==='string')e.appendChild(document.createTextNode(x));else if(x)e.appendChild(x)});return e};
var parts=[{id:'cpu',name:'CPU Die (Hotspot)',color:'#ef4444',temp:'95°C',desc:'The CPU die generates intense heat concentrated in small areas called hotspots (often near the ALUs).',analogy:'Like the flame at a gas stove burner.',detail:'Hotspots can reach 105°C before throttling. Thermal density exceeds nuclear reactors. Modern CPUs have thousands of temperature sensors. Heat is concentrated in ~5% of die area.'},{id:'tim1',name:'Thermal Paste (TIM)',color:'#f97316',temp:'~',desc:'Thermal Interface Material fills microscopic gaps between CPU and cooler to improve heat conduction.',analogy:'Like butter in a pan to improve contact.',detail:'Good TIM reduces temp by 5-10°C. Liquid metal TIM is conductive. Paste dries out over 2-3 years. Application method affects performance.'},{id:'heat',name:'Heatsink (Copper/Aluminum)',color:'#eab308',temp:'~',desc:'Metal block with fins that absorbs CPU heat and dissipates it to surrounding air via convection.',analogy:'Like a car radiator dissipating engine heat.',detail:'Copper conducts 400 W/mK vs aluminum 240 W/mK. Heat pipes use phase-change for efficient transfer. Surface area and airflow determine cooling capacity.'},{id:'fan',name:'Cooling Fan',color:'#3b82f6',temp:'~',desc:'Moves air across heatsink fins to carry away heat. Can be air or liquid cooling.',analogy:'Like wind cooling you on a hot day.',detail:'Fans are rated by CFM (cubic feet per minute). PWM fans adjust speed dynamically. Larger fans move more air at lower noise. Liquid cooling uses radiator + pump.'},{id:'throt',name:'Thermal Throttling',color:'#a855f7',temp:'100°C',desc:'CPU reduces frequency when temperature exceeds safe limits to prevent damage.',analogy:'Like a car governor limiting speed when engine overheats.',detail:'Throttling begins around 90-100°C. Frequency drops until temperature falls. Sustained throttling reduces performance by 20-40%. Better cooling prevents throttling.'}];
var quizData={questions:[{q:'What is a CPU hotspot?',options:['A Wi-Fi zone','Small area of intense heat','Overclocked region','Cooling vent'],answer:1},{q:'What does TIM stand for?',options:['Thermal Integration Module','Thermal Interface Material','Temperature Indicator Monitor','Time Interval Measurement'],answer:1},{q:'Which metal conducts heat better?',options:['Aluminum','Copper','Steel','Plastic'],answer:1},{q:'What happens during thermal throttling?',options:['CPU speeds up','CPU slows down','CPU shuts off','Fan stops'],answer:1},{q:'What is the typical maximum CPU temperature before throttling?',options:['70°C','80°C','90-100°C','120°C'],answer:2},{q:'What cooling method uses phase-change?',options:['Fan','Heat pipes','Thermal paste','Heatsink'],answer:1}],maxAttempts:2};
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

// Draw thermal cross-section
function drawViz(container){
  container.innerHTML='';
  var svg=ce('svg',{className:'viz-svg',viewBox:'0 0 800 500',preserveAspectRatio:'xMidYMid meet'});
  svg.appendChild(ce('rect',{x:0,y:0,width:800,height:500,fill:'#0a0e17'}));
  svg.appendChild(ce('text',{x:400,y:25,'text-anchor':'middle',fill:'#64748b','font-size':'11','font-weight':'700','font-family':'Inter,sans-serif',opacity:0.6},['CPU THERMAL CROSS-SECTION — Cooling Stack']));
  
  var layers=[{y:380,h:100,color:'#ef4444',alpha:0.15,label:'CPU DIE (Hotspot 95°C)',border:'#ef4444',id:'cpu'},
    {y:340,h:40,color:'#f97316',alpha:0.1,label:'Thermal Paste (TIM)',border:'#f97316',id:'tim1'},
    {y:220,h:120,color:'#eab308',alpha:0.08,label:'Heatsink Base + Heat Pipes',border:'#eab308',id:'heat'},
    {y:120,h:100,color:'#3b82f6',alpha:0.06,label:'Heatsink Fins + Airflow',border:'#3b82f6',id:'fan'},
    {y:60,h:60,color:'#a855f7',alpha:0.05,label:'Thermal Throttling Limit (100°C)',border:'#a855f7',id:'throt'}];

  layers.forEach(function(l,i){
    var g=ce('g',{className:'node',dataset:{id:l.id}});
    g.appendChild(ce('rect',{className:'node-bg',x:100,y:l.y,width:600,height:l.h,rx:6,fill:l.color+l.alpha.toString(16).slice(0,2),stroke:l.border,'stroke-width':1,opacity:0.6}));
    g.appendChild(ce('text',{x:110,y:l.y+l.h/2+4,'fill':l.border,'font-size':'11','font-weight':'600','font-family':'Inter,sans-serif'},[l.label]));
    g.addEventListener('click',function(){showInfo(parts.find(function(p){return p.id===l.id})||parts[0])});
    svg.appendChild(g)});
  // Heat arrows
  for(var i=0;i<5;i++){
    var ax=200+i*120,ay=390;
    svg.appendChild(ce('path',{d:'M'+ax+','+ay+' L'+(ax-10)+','+(ay-20)+' L'+(ax+10)+','+(ay-20)+' Z',fill:'rgba(239,68,68,0.3)'}));
    svg.appendChild(ce('path',{d:'M'+ax+','+(ay-30)+' L'+(ax-10)+','+(ay-40)+' L'+(ax+10)+','+(ay-40)+' Z',fill:'rgba(249,115,22,0.2)'}));
    svg.appendChild(ce('path',{d:'M'+ax+','+(ay-55)+' L'+(ax-10)+','+(ay-65)+' L'+(ax+10)+','+(ay-65)+' Z',fill:'rgba(59,130,246,0.15)'}));
  }
  container.appendChild(svg)}

function animateNodes(t){
  // Animate heat shimmer
  var svg=dom.viz.querySelector('svg');
  if(svg){
    var intensity=0.5+Math.sin(t*2)*0.3;
    var shimmer=svg.querySelectorAll('.node-bg');
    shimmer.forEach(function(el,i){
      var layer=layers[i];
      if(layer&&el.tagName==='RECT'){
        var baseAlpha=parseFloat((layer.alpha+0.05).toFixed(2));
        var a=baseAlpha*intensity;
        var hex=Math.floor(a*255).toString(16).padStart(2,'0');
        el.setAttribute('fill',layer.color+hex);
      }});
  }
  var idx=Math.floor(t*0.25)%parts.length;
  $$('.node .node-bg').forEach(function(el,i){
    var p=parts[i];
    if(i===idx){el.setAttribute('stroke-width','2');el.setAttribute('stroke','#fff')}
    else{el.setAttribute('stroke-width','1');if(p)el.setAttribute('stroke',p.color)}
  })}

function init(){
  initDOM();setTheme(getTheme());
  if(dom.theme)dom.theme.addEventListener('click',function(){setTheme(getTheme()==='light'?'dark':'light')});
  if(dom.speed)dom.speed.addEventListener('input',function(){state.speed=parseFloat(this.value);if(dom.speedLabel)dom.speedLabel.textContent=state.speed.toFixed(2)+'×'});
  if(dom.infoClose)dom.infoClose.addEventListener('click',function(){dom.info.hidden=true;state.selectedId=null});
  if(dom.completionReset)dom.completionReset.addEventListener('click',function(){dom.completion.hidden=true;state.challengeDone=false;state.challengeIdx=0;state.quizResults=[];renderChallenge()});
  if(dom.help)dom.help.addEventListener('click',function(){showInfo({name:'How to use',desc:'Explore CPU thermal management. The cross-section shows the cooling stack from die to heatsink. Heat arrows show heat rising. Click each layer for details. Animated heat shimmer shows thermal intensity.',analogy:'',detail:''})});
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
