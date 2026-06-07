(function(){
  var TH="consica-diagram-theme";
  var NODES={"keyboard":{"x":130,"y":120,"fields":{"Purpose":"Enters text, numbers, commands","How It Works":"Matrix circuit detects key presses and sends scan codes via USB or Bluetooth.","Analogy":"Like a typewriter with digital codes","Fun Fact":"QWERTY was designed in 1873","Key Takeaway":"Keyboards send scan codes, not letters"},"desc":"Primary text input device."},"mouse":{"x":400,"y":120,"fields":{"Purpose":"Controls cursor and clicks","How It Works":"Optical sensor captures surface images to detect motion; DPI sets sensitivity.","Analogy":"Like pointing at objects","Fun Fact":"First mouse was wood with one button","Key Takeaway":"Reports relative motion to the OS"},"desc":"Pointing device for cursor control."},"scanner":{"x":670,"y":120,"fields":{"Purpose":"Digitizes physical documents","How It Works":"Bright light and sensors capture reflected light from document.","Analogy":"Like a photo of each strip","Fun Fact":"First commercial scanner scanned 5cm wide","Key Takeaway":"Measures reflected light at millions of points"},"desc":"Converts documents to digital images."},"microphone":{"x":200,"y":340,"fields":{"Purpose":"Converts sound to electrical signals","How It Works":"Diaphragm vibrates, moving coil in magnetic field to generate voltage.","Analogy":"Reverse speaker","Fun Fact":"Carbon mic from 1878 was first","Key Takeaway":"Transducers convert acoustic to electrical energy"},"desc":"Captures sound for recording or communication."},"camera":{"x":470,"y":340,"fields":{"Purpose":"Captures images from light","How It Works":"Photodiodes on CMOS sensor convert photon energy to charge.","Analogy":"Millions of tiny solar panels","Fun Fact":"First digital camera weighed 4kg, 0.01MP","Key Takeaway":"Converts light intensity to pixel values"},"desc":"Records still images and video."},"touchscreen":{"x":650,"y":340,"fields":{"Purpose":"Detects touch on display","How It Works":"Electrostatic field projected across glass; finger distorts field for position.","Analogy":"Electric field web","Fun Fact":"First touchscreen smartphone was 2007","Key Takeaway":"Combines input and output in one surface"},"desc":"Touch-sensitive display surface."}};
  var CONNS=[{from:"keyboard",to:"mouse"},{from:"mouse",to:"scanner"},{from:"scanner",to:"microphone"},{from:"microphone",to:"camera"},{from:"camera",to:"touchscreen"}];
  var CHALLENGES=[{q:"Which device uses a matrix circuit for keys?",opts:["Mouse","Keyboard","Touchscreen","Scanner"],ans:1},{q:"How do optical mice track movement?",opts:["Laser reflection","Ball rotation","Sound waves","Radio"],ans:0},{q:"Which converts sound to signals?",opts:["Camera","Scanner","Microphone","Touchscreen"],ans:2},{q:"What does a camera sensor measure?",opts:["Temperature","Pressure","Light intensity","Sound"],ans:2},{q:"Capacitive touchscreens detect:",opts:["Pressure","Heat","Field distortion","Magnetism"],ans:2}];
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

