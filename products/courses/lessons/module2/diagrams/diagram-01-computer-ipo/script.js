(function(){
  var TH='consica-diagram-theme';
  var NODES={"input":{"x":100,"y":200,"fields":{"Purpose":"Accepts data and commands from the user or other systems","How It Works":"Input devices convert physical phenomena into electrical signals digitized by ADCs and sent via buses.","Analogy":"Like your ears and eyes gathering information for your brain","Fun Fact":"A keyboard registers keystrokes in under 16 ms","Key Takeaway":"All computer operations start with input"},"desc":"Input is how we get data into the computer. Keyboards, mice, and scanners convert physical actions into digital signals."},"process":{"x":350,"y":200,"fields":{"Purpose":"Performs calculations and logical operations on input data","How It Works":"The CPU fetches, decodes, and executes instructions from memory, synchronized by the clock at billions of cycles per second.","Analogy":"Like your brain thinking and making decisions","Fun Fact":"A modern CPU can perform over 10 billion calculations per second","Key Takeaway":"Processing transforms raw data into useful information"},"desc":"The CPU processes input data to produce meaningful output."},"output":{"x":600,"y":200,"fields":{"Purpose":"Presents processed data to the user","How It Works":"Output devices convert digital data into physical form: monitors use liquid crystals, speakers vibrate diaphragms.","Analogy":"Like your mouth speaking words your brain has formed","Fun Fact":"The first monitor could only display green text on black","Key Takeaway":"Output completes the communication loop"},"desc":"Output devices present processed data as visuals, sound, or print."},"storage":{"x":350,"y":380,"fields":{"Purpose":"Saves data permanently for future use","How It Works":"Uses magnetic (HDD) or flash (SSD) technology to retain data without power.","Analogy":"Like a notebook for remembering later","Fun Fact":"Modern SSDs can read data in under 0.1 ms","Key Takeaway":"Storage is non-volatile"},"desc":"Storage saves data permanently even after power-off."}};
  var CONNS=[{from:"input",to:"process"},{from:"process",to:"output"},{from:"output",to:"storage"},{from:"storage",to:"input"}];
  var CHALLENGES=[{q:"What is the first step in the IPO cycle?",opts:["Input","Processing","Output","Storage"],ans:0},{q:"Which component performs calculations?",opts:["Storage drive","CPU","Monitor","Keyboard"],ans:1},{q:"What does an output device do?",opts:["Accepts commands","Processes data","Presents processed data","Stores files"],ans:2},{q:"Storage is considered:",opts:["Volatile","Temporary","Non-volatile","Virtual"],ans:2},{q:"What is an input device?",opts:["Printer","Speaker","Keyboard","Monitor"],ans:2},{q:"What does the P in IPO stand for?",opts:["Programming","Processing","Printing","Powering"],ans:1}];
  var svg, infoPanel, overlay;
  var ctx = {t:0, playing:false, speed:1, selectedId:null, theme:'dark'};
  var rafId, quizAnswered = {}, quizSubmitted = false;

  function init(){
    try {
      var saved = localStorage.getItem(TH);
      ctx.theme = saved || 'dark';
      document.documentElement.setAttribute('data-theme', ctx.theme);
      setupDOM();
      buildSVG();
      setupEvents();
      buildChallenge();
      hideSkeleton();
      startLoop();
    } catch(e){ showError(e); }
  }

  function setupDOM(){
    svg = document.getElementById('diagram-svg');
    infoPanel = document.getElementById('info-panel');
    overlay = document.getElementById('completion-overlay');
    document.getElementById('theme-toggle').addEventListener('click', function(){
      ctx.theme = ctx.theme === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', ctx.theme);
      localStorage.setItem(TH, ctx.theme);
    });
    document.getElementById('play-btn').addEventListener('click', function(){
      ctx.playing = !ctx.playing;
      this.innerHTML = ctx.playing ? 'â¸ Pause' : 'â–¶ Play';
    });
    document.getElementById('reset-btn').addEventListener('click', function(){
      ctx.t = 0; ctx.playing = false;
      document.getElementById('play-btn').innerHTML = 'â–¶ Play';
      if(svg) svg.querySelectorAll('.flow-dot').forEach(function(d){ d.style.opacity = '0'; });
    });
    document.getElementById('info-close').addEventListener('click', closeInfo);
    document.getElementById('completion-close').addEventListener('click', function(){ overlay.style.display = 'none'; });
    document.getElementById('speed-slider').addEventListener('input', function(){
      ctx.speed = parseFloat(this.value);
      document.getElementById('speed-display').textContent = this.value + 'x';
    });
    document.addEventListener('keydown', function(e){ if(e.key === 'Escape') closeInfo(); });
  }

  function buildSVG(){
    var ids = Object.keys(NODES);
    ids.forEach(function(id){
      var n = NODES[id];
      var g = document.createElementNS('http://www.w3.org/2000/svg','g');
      g.setAttribute('class','node-group');
      g.setAttribute('data-id',id);
      g.setAttribute('tabindex','0');
      g.setAttribute('role','button');
      g.setAttribute('aria-label', n.fields?.[Object.keys(n.fields)[0]] || id);
      var bg = document.createElementNS('http://www.w3.org/2000/svg','rect');
      bg.setAttribute('class','node-bg');
      bg.setAttribute('x', n.x - 60);
      bg.setAttribute('y', n.y - 26);
      bg.setAttribute('width','120');
      bg.setAttribute('height','52');
      bg.setAttribute('rx','8');
      bg.setAttribute('fill','var(--surface,#1a2235)');
      bg.setAttribute('stroke','var(--border,#2a3a55)');
      bg.setAttribute('stroke-width','2');
      g.appendChild(bg);
      var txt = document.createElementNS('http://www.w3.org/2000/svg','text');
      txt.setAttribute('x', n.x);
      txt.setAttribute('y', n.y + 4);
      txt.setAttribute('text-anchor','middle');
      txt.setAttribute('fill','var(--text,#e9e8f0)');
      txt.setAttribute('font-size','12');
      txt.setAttribute('font-weight','600');
      txt.textContent = id.charAt(0).toUpperCase() + id.slice(1);
      g.appendChild(txt);
      g.addEventListener('click', function(){ selectNode(id); });
      g.addEventListener('keydown', function(e){ if(e.key==='Enter'||e.key===' '){ e.preventDefault(); selectNode(id); } });
      svg.appendChild(g);
    });
    CONNS.forEach(function(c){
      var from = NODES[c.from], to = NODES[c.to];
      if(!from || !to) return;
      var line = document.createElementNS('http://www.w3.org/2000/svg','line');
      line.setAttribute('x1', from.x + 60);
      line.setAttribute('y1', from.y);
      line.setAttribute('x2', to.x - 60);
      line.setAttribute('y2', to.y);
      line.setAttribute('stroke','var(--accent2,#3b82f6)');
      line.setAttribute('stroke-width','2');
      line.setAttribute('marker-end','url(#arrowhead)');
      line.style.opacity = '0.5';
      svg.insertBefore(line, svg.firstChild);
      var dot = document.createElementNS('http://www.w3.org/2000/svg','circle');
      dot.setAttribute('class','flow-dot');
      dot.setAttribute('r','4');
      dot.setAttribute('fill','var(--accent2,#3b82f6)');
      dot.style.opacity = '0';
      dot.dataset.cx = from.x + 60; dot.dataset.cy = from.y;
      dot.dataset.tx = to.x - 60; dot.dataset.ty = to.y;
      svg.appendChild(dot);
    });
  }

  function selectNode(id){
    ctx.selectedId = id;
    var n = NODES[id];
    if(!n) return;
    document.getElementById('info-title').textContent = id.charAt(0).toUpperCase() + id.slice(1);
    var content = document.getElementById('info-content');
    var html = '<p style="margin-bottom:10px;color:var(--text2)">' + n.desc + '</p>';
    if(n.fields) Object.keys(n.fields).forEach(function(k){
      html += '<p><strong>' + k + ':</strong> ' + n.fields[k] + '</p>';
    });
    content.innerHTML = html;
    infoPanel.setAttribute('aria-hidden','false');
    infoPanel.style.display = 'block';
    svg.querySelectorAll('.node-bg').forEach(function(b){ b.setAttribute('stroke','var(--border,#2a3a55)'); });
    var sel = svg.querySelector('.node-group[data-id="'+id+'"] .node-bg');
    if(sel) sel.setAttribute('stroke','var(--accent2,#3b82f6)');
  }

  function closeInfo(){
    infoPanel.setAttribute('aria-hidden','true');
    infoPanel.style.display = 'none';
    ctx.selectedId = null;
    svg.querySelectorAll('.node-bg').forEach(function(b){ b.setAttribute('stroke','var(--border,#2a3a55)'); });
  }

  function startLoop(){
    var last = 0;
    function loop(time){
      rafId = requestAnimationFrame(loop);
      var dt = last ? (time - last) / 1000 : 0; last = time;
      if(ctx.playing && ctx.t !== undefined){
        ctx.t += dt * ctx.speed;
        svg.querySelectorAll('.flow-dot').forEach(function(d){
          var cx=parseFloat(d.dataset.cx)||0, cy=parseFloat(d.dataset.cy)||0;
          var tx=parseFloat(d.dataset.tx)||0, ty=parseFloat(d.dataset.ty)||0;
          var p = (ctx.t % 3) / 3;
          d.setAttribute('cx', cx + (tx-cx)*p);
          d.setAttribute('cy', cy + (ty-cy)*p);
          d.style.opacity = '1';
        });
      }
      var ids = Object.keys(NODES);
      var idx = Math.floor(ctx.t * 0.5) % ids.length;
      svg.querySelectorAll('.node-bg').forEach(function(bg, i){
        bg.setAttribute('fill', i===idx ? 'var(--surface2,#1e2d50)' : 'var(--surface,#1a2235)');
        bg.setAttribute('stroke', i===idx ? 'var(--accent2,#3b82f6)' : 'var(--border,#2a3a55)');
      });
    }
    rafId = requestAnimationFrame(loop);
  }

  function buildChallenge(){
    var ctn = document.getElementById('challenge-container');
    ctn.innerHTML = '';
    quizAnswered = {}; quizSubmitted = false;
    CHALLENGES.forEach(function(c, i){
      var d = document.createElement('div'); d.className = 'challenge-question'; d.dataset.qi = i;
      var qt = document.createElement('div'); qt.className = 'challenge-q-text'; qt.textContent = (i+1)+'. '+c.q;
      d.appendChild(qt);
      var opts = document.createElement('div'); opts.className = 'challenge-options';
      c.opts.forEach(function(o, j){
        var lbl = document.createElement('label'); lbl.className = 'challenge-option';
        var r = document.createElement('input'); r.type = 'radio'; r.name = 'chq-'+i; r.value = j;
        r.addEventListener('change', function(){
          quizAnswered[i] = j;
          opts.querySelectorAll('.challenge-option').forEach(function(l){ l.classList.remove('selected'); });
          lbl.classList.add('selected');
        });
        lbl.appendChild(r); lbl.appendChild(document.createTextNode(' '+o));
        opts.appendChild(lbl);
      });
      d.appendChild(opts); ctn.appendChild(d);
    });
    var sb = document.createElement('button'); sb.className = 'challenge-submit'; sb.textContent = 'Submit Answers';
    sb.addEventListener('click', submitQuiz); ctn.appendChild(sb);
  }

  function submitQuiz(){
    if(quizSubmitted) return;
    var correct = 0;
    CHALLENGES.forEach(function(c, i){
      var opts = document.querySelector('.challenge-question[data-qi="'+i+'"] .challenge-options');
      var labels = opts.querySelectorAll('.challenge-option');
      labels.forEach(function(l, j){
        var r = l.querySelector('input'); r.disabled = true;
        if(j === c.ans) l.classList.add('correct');
        else if(r.checked) l.classList.add('wrong');
      });
      if(typeof quizAnswered[i] !== 'undefined' && quizAnswered[i] === c.ans) correct++;
    });
    quizSubmitted = true;
    var total = CHALLENGES.length;
    var pct = Math.round((correct/total)*100);
    var res = document.getElementById('challenge-result');
    res.style.display = 'block';
    res.innerHTML = '<strong>Score: '+correct+'/'+total+' ('+pct+'%)</strong>';
    if(pct >= 70){
      res.innerHTML += '<br>Great job!';
      overlay.style.display = 'flex';
      document.getElementById('completion-score').textContent = 'Score: '+correct+'/'+total;
      document.getElementById('completion-concepts').innerHTML = '<strong>Key Concepts:</strong><br>'+Object.keys(NODES).map(function(id){ return '- '+id; }).join('<br>');
    } else {
      res.innerHTML += '<br>Review and try again.';
    }
  }

  function setupEvents(){} function hideSkeleton(){
    var skel = document.getElementById('loading-skeleton');
    if(skel) { skel.style.display = 'none'; skel.setAttribute('aria-hidden','true'); }
    document.getElementById('diagram-container').style.display = 'block';
  }

  function showError(e){
    var eb = document.getElementById('error-boundary');
    eb.style.display = 'block';
    eb.textContent = 'Error: ' + (e.message || 'Unexpected error. Refresh please.');
    hideSkeleton();
  }

  if(document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();

