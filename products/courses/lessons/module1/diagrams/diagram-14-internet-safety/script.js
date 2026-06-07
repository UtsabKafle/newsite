(function(){
'use strict';
var D=document,W=window,$=function(s,p){return(p||D).querySelector(s)},
$$=function(s,p){return Array.from((p||D).querySelectorAll(s))},
NS='http://www.w3.org/2000/svg',CA=cancelAnimationFrame,RA=requestAnimationFrame;

/* --- DATA --- */
var NODES=[{"id": "firewall", "name": "Software Firewall", "cat": "Security", "icon": "🛡️", "x": 325, "y": 30, "desc": "A firewall examines data packets and blocks those that dont meet security rules.", "how": "Software firewalls inspect traffic at the application layer and can block programs from accessing the Internet using rules based on ports and protocols.", "why": "Firewalls are your first shield against hackers and malicious traffic", "analogy": "Like a bouncer at a club checking IDs and only letting authorized people in", "fun": "Windows has included a built-in firewall since XP SP2", "take": "A firewall is essential for blocking unauthorized access to your computer"}, {"id": "encryption", "name": "Encryption", "cat": "Security", "icon": "🔐", "x": 325, "y": 100, "desc": "Encryption scrambles data so only authorized parties can read it using cryptographic keys.", "how": "Symmetric encryption (AES) uses one key, while asymmetric (RSA) uses public-private key pairs. TLS uses both for secure web connections.", "why": "Encryption protects your private data even if its intercepted", "analogy": "Like writing a letter in a secret code that only the recipient can decode", "fun": "End-to-end encryption means even the service provider cant read your messages", "take": "Always look for HTTPS to ensure your data is encrypted in transit"}, {"id": "vpn", "name": "Virtual Private Network", "cat": "Security", "icon": "🛡️", "x": 125, "y": 215, "desc": "A VPN creates an encrypted tunnel between your device and a remote server, masking your IP.", "how": "VPNs create an encrypted tunnel using OpenVPN, WireGuard, or IPsec, encrypting all traffic and routing it through the VPN server.", "why": "VPNs protect your privacy on public Wi-Fi and hide your activity from your ISP", "analogy": "Like a private, enclosed walkway that protects you from view", "fun": "VPNs were originally invented to connect corporate offices securely", "take": "A VPN encrypts all your traffic but you must trust the VPN provider"}, {"id": "antivirus", "name": "Antivirus Software", "cat": "Security", "icon": "🔍", "x": 325, "y": 215, "desc": "Antivirus detects, prevents, and removes malicious software from your computer.", "how": "Antivirus uses signature-based detection, heuristic analysis, and machine learning with real-time protection scanning files when accessed.", "why": "Antivirus protects against malware that can steal data, encrypt files, or take over your system", "analogy": "Like an immune system that identifies and neutralizes invading pathogens", "fun": "The first antivirus was created in 1987 to fight the Brain virus", "take": "Antivirus is essential but safe browsing habits matter too"}, {"id": "auth", "name": "Authentication", "cat": "Security", "icon": "🔑", "x": 525, "y": 215, "desc": "Authentication verifies your identity using passwords, biometrics, or security keys.", "how": "Single-factor uses passwords, two-factor adds something you have (phone) or something you are (fingerprint).", "why": "Authentication prevents unauthorized access to your accounts and data", "analogy": "Like showing your ID card and entering a PIN to access a secure building", "fun": "The most common password is still 123456", "take": "Multi-factor authentication is the single most effective security measure"}, {"id": "backup", "name": "Data Backup", "cat": "Security", "icon": "🗄️", "x": 325, "y": 315, "desc": "Backups save copies of your files to recover from data loss or ransomware.", "how": "Backup strategies include full, incremental, and differential backups with deduplication and off-site cloud storage.", "why": "Backups are your last defense against ransomware, hardware failure, and accidental deletion", "analogy": "Like making photocopies of important documents and storing them in a safe place", "fun": "Ransomware attacks increased by 300 percent in recent years", "take": "Follow the 3-2-1 rule: 3 copies, 2 different media, 1 off-site"}];
var CONNECTIONS=[{"from": "firewall", "to": "encryption", "type": "fiber"}, {"from": "encryption", "to": "vpn", "type": "fiber"}, {"from": "vpn", "to": "antivirus", "type": "fiber"}, {"from": "antivirus", "to": "auth", "type": "cable"}, {"from": "auth", "to": "backup", "type": "fiber"}];
var ROUTES={"A": {"name": "Security Layer Path", "color": "#3b82f6", "path": ["firewall", "encryption", "vpn", "antivirus", "auth", "backup"]}};
var CHALLENGES=[{"q": "What is the primary purpose of a firewall?", "opts": ["Speed up Internet", "Block unauthorized access and malicious traffic", "Encrypt data", "Create backups"], "ans": 1, "exp": "Firewalls examine packets and block those that dont meet security rules to prevent unauthorized access."}, {"q": "What does encryption do to data?", "opts": ["Compresses it", "Scrambles it so only authorized parties can read it", "Deletes it", "Copies it"], "ans": 1, "exp": "Encryption transforms readable data into unreadable ciphertext that requires a key to decrypt."}, {"q": "What protocol ensures HTTPS traffic is encrypted?", "opts": ["HTTP", "SSL/TLS", "FTP", "SMTP"], "ans": 1, "exp": "HTTPS uses SSL/TLS (Transport Layer Security) to encrypt all traffic between browser and server."}, {"q": "What is End-to-End Encryption (E2EE)?", "opts": ["Only the endpoints can decrypt the data", "The server can read your messages", "Encryption at rest only", "Partial encryption"], "ans": 0, "exp": "With E2EE, even the service provider cannot read your messages only the sender and recipient."}, {"q": "What does a VPN hide from your ISP?", "opts": ["Nothing", "Your browsing activity and IP address", "Your passwords", "Your files"], "ans": 1, "exp": "A VPN encrypts all your traffic and masks your IP address, hiding your activity from your ISP."}, {"q": "What is multi-factor authentication?", "opts": ["Using multiple passwords", "Using two or more verification methods", "Having multiple accounts", "Using fingerprint only"], "ans": 1, "exp": "MFA uses two or more factors: something you know, something you have, or something you are."}, {"q": "What is the most common password according to studies?", "opts": ["password", "123456", "admin", "letmein"], "ans": 1, "exp": "The most common password is still 123456, used by millions of people worldwide."}, {"q": "What does antivirus software use to detect known malware?", "opts": ["Random scanning", "Signature databases and heuristic analysis", "User reports", "File size"], "ans": 1, "exp": "Antivirus uses signature databases of known malware and heuristic analysis to detect threats."}, {"q": "What is the 3-2-1 backup rule?", "opts": ["3 backups in 2 days, 1 location", "3 copies, 2 media types, 1 off-site", "3 files, 2 folders, 1 drive", "3 users, 2 admins, 1 backup"], "ans": 1, "exp": "3 copies of data on 2 different media types with 1 copy stored off-site."}, {"q": "What was the first antivirus program created to fight?", "opts": ["The ILOVEYOU worm", "The Brain virus", "The Melissa virus", "The Morris worm"], "ans": 1, "exp": "The first antivirus program was created in 1987 to fight the Brain virus."}];

/* --- STATE --- */
var S={
  selected:null,packetCount:0,sending:false,route:null,
  packets:[],traffic:[],particles:[],time:0,
  sentPackets:0,hasCompleted:false,
  speedMult:1,theme:'dark',challengeIdx:0,score:0,challengeDone:false
};
var rafId=null,lastTime=0,ts=0,DOM={};

/* --- UTILITIES --- */
function lerp(a,b,t){return a+(b-a)*t}
function bezier(ax,ay,bx,by,cx,cy,dx,dy,t){
  var mt=1-t,mt2=mt*mt,mt3=mt2*mt,t2=t*t,t3=t2*t;
  return {x:mt3*ax+3*mt2*t*bx+3*mt*t2*cx+t3*dx,y:mt3*ay+3*mt2*t*by+3*mt*t2*cy+t3*dy};
}
function rand(a,b){return a+Math.random()*(b-a)}
function randid(){return Math.floor(Math.random()*9000+1000)}
function esc(s){var d=D.createElement('div');d.textContent=s;return d.innerHTML}

/* --- SPEED --- */
function setSpeed(val){
  S.speedMult=0.25+(val/16)*3.75;
  $('#speedDisplay').textContent=S.speedMult.toFixed(2).replace(/\.?0+$/,'')+'\u00d7';
}

/* --- SVG BUILDERS --- */
function buildVisual(){
  var bg=$('#background');
  NODES.forEach(function(n){
    var g=D.createElementNS(NS,'g');
    g.setAttribute('class','node');g.dataset.id=n.id;
    g.setAttribute('role','button');g.setAttribute('tabindex','0');
    g.setAttribute('aria-label','Select '+n.name);
    var glow=D.createElementNS(NS,'circle');
    glow.setAttribute('cx',n.x);glow.setAttribute('cy',n.y-4);
    glow.setAttribute('r','22');glow.setAttribute('fill','url(#nodeGlow)');
    g.appendChild(glow);
    var bgEl=D.createElementNS(NS,'rect');
    bgEl.setAttribute('x',n.x-24);bgEl.setAttribute('y',n.y-24);
    bgEl.setAttribute('width','48');bgEl.setAttribute('height','48');
    bgEl.setAttribute('rx','12');bgEl.setAttribute('class','node-bg');
    g.appendChild(bgEl);
    var txt=D.createElementNS(NS,'text');
    txt.setAttribute('x',n.x);txt.setAttribute('y',n.y+1);
    txt.setAttribute('text-anchor','middle');txt.setAttribute('font-size','20');
    txt.setAttribute('class','node-icon');txt.textContent=n.icon;
    g.appendChild(txt);
    var lbl=D.createElementNS(NS,'text');
    lbl.setAttribute('x',n.x);lbl.setAttribute('y',n.y+34);
    lbl.setAttribute('class','node-label');lbl.textContent=n.name;
    g.appendChild(lbl);
    var slbl=D.createElementNS(NS,'text');
    slbl.setAttribute('x',n.x);slbl.setAttribute('y',n.y+46);
    slbl.setAttribute('class','node-sublabel');slbl.textContent=n.cat;
    g.appendChild(slbl);
    bg.appendChild(g);
  });
}

function buildConnections(){
  var cg=$('#connections');
  CONNECTIONS.forEach(function(c){
    var f=NODES.find(function(n){return n.id===c.from});
    var t=NODES.find(function(n){return n.id===c.to});
    if(!f||!t)return;
    var p=D.createElementNS(NS,'path');
    var mx=(f.x+t.x)/2,my=(f.y+t.y)/2;
    var cy=c.type==='cable'?Math.max(f.y,t.y)+20:my;
    p.setAttribute('d','M'+f.x+','+(f.y-4)+' Q'+mx+','+cy+' '+t.x+','+(t.y-4));
    p.setAttribute('class','connection '+c.type);
    cg.appendChild(p);
  });
}

function buildTrafficDots(){
  var tg=$('#trafficDots');
  CONNECTIONS.forEach(function(c,i){
    var f=NODES.find(function(n){return n.id===c.from});
    var t=NODES.find(function(n){return n.id===c.to});
    if(!f||!t)return;
    for(var j=0;j<3;j++){
      var d=D.createElementNS(NS,'circle');
      d.setAttribute('r','2');d.setAttribute('class','traffic-dot');
      d.setAttribute('data-conn',i);d.setAttribute('data-offset',j/3+Math.random()*0.1);
      d.setAttribute('fill',c.type==='fiber'?'#3b82f6':'#06b6d4');
      tg.appendChild(d);
    }
  });
}

/* --- PARTICLES --- */
var pCtx=null;
function initParticles(){
  var canvas=$('#particles'),ctx=canvas.getContext('2d');
  var mc=$('#mapWrap');
  function resize(){
    canvas.width=mc.offsetWidth;canvas.height=mc.offsetHeight;
  }
  resize();W.addEventListener('resize',resize,{passive:true});
  var count=Math.min(60,Math.floor(canvas.width*canvas.height/15000));
  S.particles=Array.from({length:count},function(){
    return{x:rand(0,canvas.width),y:rand(0,canvas.height),vx:rand(-0.3,0.3),vy:rand(-0.3,0.3),r:rand(0.5,1.5),o:rand(0.1,0.3)};
  });
  return ctx;
}
function drawParticles(ctx,time){
  if(!ctx)return;
  ctx.clearRect(0,0,ctx.canvas.width,ctx.canvas.height);
  S.particles.forEach(function(p){
    p.x+=p.vx*S.speedMult;p.y+=p.vy*S.speedMult;
    if(p.x<0)p.x=ctx.canvas.width;if(p.x>ctx.canvas.width)p.x=0;
    if(p.y<0)p.y=ctx.canvas.height;if(p.y>ctx.canvas.height)p.y=0;
    ctx.beginPath();ctx.arc(p.x,p.y,p.r,0,Math.PI*2);
    ctx.fillStyle='rgba(59,130,246,'+p.o*(0.8+0.2*Math.sin(time*0.001+p.x*0.01))+')';
    ctx.fill();
  });
}

/* --- TRAFFIC --- */
function getConnNodes(){
  return CONNECTIONS.map(function(c){
    var f=NODES.find(function(n){return n.id===c.from});
    var t=NODES.find(function(n){return n.id===c.to});
    return{from:f?{x:f.x,y:f.y-4}:{x:0,y:0},to:t?{x:t.x,y:t.y-4}:{x:0,y:0},type:c.type};
  });
}
function animateTraffic(time){
  var dots=$$('.traffic-dot');
  var conns=getConnNodes();
  dots.forEach(function(dot){
    var ci=parseInt(dot.dataset.conn);
    if(ci>=conns.length)return;
    var c=conns[ci],off=parseFloat(dot.dataset.offset);
    var t=(time*0.0001*S.speedMult+off)%1;
    dot.setAttribute('cx',lerp(c.from.x,c.to.x,t));
    dot.setAttribute('cy',lerp(c.from.y,c.to.y,t));
  });
}

/* --- PACKETS --- */
function getNodePos(id){
  var n=NODES.find(function(n){return n.id===id});
  return n?{x:n.x,y:n.y-4}:{x:0,y:0};
}
function getPathPoints(routeId){
  var r=ROUTES[routeId];
  if(!r||!r.path)return[];
  return r.path.map(function(id){return getNodePos(id)});
}
function sendPacket(){
  if(S.sending)return;
  var routes=Object.keys(ROUTES);
  var chosen=routes[Math.floor(Math.random()*routes.length)];
  S.route=ROUTES[chosen];
  var pts=getPathPoints(chosen);
  if(pts.length<2)return;
  S.sending=true;S.sentPackets++;
  var btn=$('#sendBtn');
  btn.disabled=true;
  btn.innerHTML='<span style="display:inline-block;animation:spin 0.8s linear infinite">\u26A1</span> Traveling...';
  var id=randid();
  var packet={
    id:id,points:pts,t:0,speed:(0.004+Math.random()*0.002)*S.speedMult,
    baseSpeed:0.004+Math.random()*0.002,routeName:S.route.name,
    color:S.route.color,forward:true,el:null,trailEls:[]
  };
  var pg=$('#packets');
  var g=D.createElementNS(NS,'g');
  for(var i=0;i<5;i++){
    var tr=D.createElementNS(NS,'circle');
    tr.setAttribute('r',2.5-i*0.4);tr.setAttribute('class','packet-trail');
    tr.setAttribute('opacity',0.2-i*0.035);tr.setAttribute('fill',packet.color);
    g.appendChild(tr);packet.trailEls.push(tr);
  }
  var dot=D.createElementNS(NS,'circle');
  dot.setAttribute('r','6');dot.setAttribute('class','packet');
  dot.setAttribute('fill',packet.color);dot.setAttribute('filter','url(#glow)');
  g.appendChild(dot);packet.el=dot;
  pg.appendChild(g);
  S.packets.push(packet);
  var ri=$('#routeInfo');
  ri.innerHTML='<span style="color:'+packet.color+';font-weight:700">Route:</span> '+esc(S.route.name);
  ri.classList.add('visible');
}
function hideTooltip(){var tt=$('#tooltip');tt.classList.remove('visible');}

/* --- PACKET ANIMATION --- */
function updatePackets(){
  var pg=$('#packets');
  S.packets.forEach(function(pkt,i){
    var pts=pkt.points;
    if(!pts||pts.length<2)return;
    pkt.t+=pkt.speed*S.speedMult;
    if(pkt.t>=1){
      if(pkt.forward){
        pkt.t=0;pkt.forward=false;
        pkt.points=[].concat(pts).reverse();
      }else{
        S.packets.splice(i,1);
        if(pkt.el&&pkt.el.parentNode)pg.removeChild(pkt.el.parentNode);
        S.sending=false;
        showCompletion();
        return;
      }
    }
    var t=pkt.t,segTotal=pts.length-1;
    var seg=Math.min(Math.floor(t*segTotal),segTotal-1);
    var segT=(t*segTotal)-seg;
    var p0=pts[Math.max(0,seg-1)],p1=pts[seg];
    var p2=pts[Math.min(segTotal,seg+1)],p3=pts[Math.min(segTotal,seg+2)];
    var cx=bezier(p0.x,p0.y,p1.x,p1.y,p2.x,p2.y,p3.x,p3.y,segT);
    pkt.trailEls.forEach(function(te,j){
      var trailT=Math.max(0,t-(j+1)*0.02);
      var seg2=Math.min(Math.floor(trailT*segTotal),segTotal-1);
      var segT2=(trailT*segTotal)-seg2;
      var idx=Math.max(0,+seg2-1);
      var p0t=pts[Math.min(idx,pts.length-1)];
      var p1t=pts[Math.min(seg2,pts.length-1)];
      var p2t=pts[Math.min(seg2+1,pts.length-1)];
      var p3t=pts[Math.min(seg2+2,pts.length-1)];
      var ct=bezier(p0t.x,p0t.y,p1t.x,p1t.y,p2t.x,p2t.y,p3t.x,p3t.y,segT2);
      te.setAttribute('cx',ct.x);te.setAttribute('cy',ct.y);
    });
    pkt.el.setAttribute('cx',cx.x);pkt.el.setAttribute('cy',cx.y);
  });
}

/* --- COMPLETION --- */
function showCompletion(){
  if(S.hasCompleted)return;
  S.hasCompleted=true;S.sending=false;
  hideTooltip();
  var btn=$('#sendBtn');
  btn.disabled=false;
  btn.innerHTML='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="14" height="14"><path d="M12 2v20M2 12h20"/></svg> Start Journey';
  var dist=Math.floor(rand(500,3000)),time=Math.floor(rand(20,200));
  var hops=S.route?S.route.path.length-1:5;
  $('#statDist').textContent=dist.toLocaleString();
  $('#statTime').textContent=time;
  $('#statHops').textContent=hops;
  var cp=$('#overlayPath');
  var path=S.route?S.route.path:Object.values(ROUTES)[0].path;
  var html='';
  path.forEach(function(id,i){
    var n=NODES.find(function(n){return n.id===id});
    if(i>0)html+='<span style="margin:0 2px;color:var(--text-faint)">\u2192</span>';
    html+='<span style="color:'+(i===0||i===path.length-1?'var(--success)':'var(--text)')+'">'+(n?esc(n.name):id)+'</span>';
  });
  cp.innerHTML=html;
  setTimeout(function(){$('#completionOverlay').removeAttribute('hidden')},300);
}
function hideCompletion(){
  S.hasCompleted=false;S.sentPackets=0;
  S.packets.forEach(function(p){if(p.el&&p.el.parentNode)p.el.parentNode.remove()});
  S.packets=[];
  $('#completionOverlay').setAttribute('hidden','');
}

/* --- INFO PANEL --- */
function showInfo(id){
  var n=NODES.find(function(n){return n.id===id});
  if(!n)return;
  var panel=$('#infoPanel');
  $('#panelCat').textContent=n.cat||'Component';
  $('#panelTitle').textContent=n.name;
  $('#panelDesc').textContent=n.desc||'';
  var html='';
  if(n.how)html+='<div class="panel-section"><div class="panel-section-label">How It Works</div><div class="panel-section-value">'+esc(n.how)+'</div></div>';
  if(n.why)html+='<div class="panel-section"><div class="panel-section-label">Why It Matters</div><div class="panel-section-value">'+esc(n.why)+'</div></div>';
  if(n.analogy)html+='<div class="panel-section"><div class="panel-section-label">Real-World Analogy</div><div class="panel-section-value">'+esc(n.analogy)+'</div></div>';
  if(n.fun)html+='<div class="panel-section"><div class="panel-section-label">Fun Fact</div><div class="panel-section-value">'+esc(n.fun)+'</div></div>';
  if(n.take)html+='<div class="panel-section"><div class="panel-section-label">Key Takeaway</div><div class="panel-section-value">'+esc(n.take)+'</div></div>';
  $('#panelSections').innerHTML=html;
  panel.classList.add('open');panel.setAttribute('aria-hidden','false');
  S.selected=id;
  $$('.node.selected').forEach(function(el){el.classList.remove('selected')});
  var nodeEl=$('[data-id="'+id+'"]');
  if(nodeEl)nodeEl.classList.add('selected');
}
function hideInfo(){
  var panel=$('#infoPanel');
  panel.classList.remove('open');panel.setAttribute('aria-hidden','true');
  S.selected=null;
  $$('.node.selected').forEach(function(el){el.classList.remove('selected')});
}

/* --- THEME --- */
function toggleTheme(){
  var html=D.documentElement;
  var current=html.getAttribute('data-theme');
  var next=current==='light'?'dark':'light';
  html.setAttribute('data-theme',next);
  S.theme=next;
  try{localStorage.setItem('consica-theme',next)}catch(e){}
  var btn=$('#themeBtn');
  btn.innerHTML=next==='dark'
    ?'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" width="14" height="14"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>'
    :'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" width="14" height="14"><circle cx="12" cy="12" r="5"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></svg>';
  btn.setAttribute('aria-label',next==='dark'?'Switch to light mode':'Switch to dark mode');
}
function initTheme(){
  var saved='dark';
  try{saved=localStorage.getItem('consica-theme')||'dark'}catch(e){}
  D.documentElement.setAttribute('data-theme',saved);
  S.theme=saved;
}

/* --- CHALLENGE --- */
function startChallenge(){
  S.challengeIdx=0;S.score=0;S.challengeDone=false;
  showQuestion();
}
function showQuestion(){
  var cc=$('#challengeContent');
  if(S.challengeIdx>=CHALLENGES.length||S.challengeDone){
    cc.innerHTML='<div class="challenge-body"><div class="challenge-score">Quiz Complete! You scored '+S.score+'/'+CHALLENGES.length+'</div><button class="challenge-retry" id="challengeRetry">Retry Quiz</button></div>';
    var rb=$('#challengeRetry');
    if(rb)rb.addEventListener('click',startChallenge);
    return;
  }
  var q=CHALLENGES[S.challengeIdx];
  var html='<div class="challenge-body"><div class="challenge-q">'+(S.challengeIdx+1)+'. '+esc(q.q)+'</div><div class="challenge-opts">';
  q.opts.forEach(function(o,i){
    html+='<button class="challenge-opt" data-idx="'+i+'">'+esc(o)+'</button>';
  });
  html+='</div><div id="challengeFb"></div></div>';
  cc.innerHTML=html;
  $$('.challenge-opt').forEach(function(btn){
    btn.addEventListener('click',function(){
      if(btn.disabled)return;
      var idx=parseInt(btn.dataset.idx);
      var correct=idx===CHALLENGES[S.challengeIdx].ans;
      $$('.challenge-opt').forEach(function(b){b.disabled=true});
      $$('.challenge-opt').forEach(function(b,i2){
        b.classList.add(i2===CHALLENGES[S.challengeIdx].ans?'correct':'wrong');
      });
      if(correct)S.score++;
      var fb=$('#challengeFb');
      fb.innerHTML='<div class="challenge-feedback '+(correct?'correct':'wrong')+'">'+(correct?'\u2713 Correct! ':'\u2717 Incorrect. ')+esc(CHALLENGES[S.challengeIdx].exp)+'</div>';
      fb.style.display='block';
      setTimeout(function(){
        S.challengeIdx++;
        showQuestion();
      },2000);
    });
  });
}

/* --- RESET --- */
function resetDiagram(){
  S.sending=false;
  S.packets.forEach(function(p){if(p.el&&p.el.parentNode)p.el.parentNode.remove()});
  S.packets=[];S.sentPackets=0;S.hasCompleted=false;S.selected=null;
  $('#routeInfo').classList.remove('visible');$('#routeInfo').innerHTML='';
  $$('.node.selected').forEach(function(el){el.classList.remove('selected')});
  hideCompletion();hideInfo();hideTooltip();
  var btn=$('#sendBtn');
  btn.disabled=false;
  btn.innerHTML='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="14" height="14"><path d="M12 2v20M2 12h20"/></svg> Start Journey';
}

/* --- ANIMATION LOOP --- */
function loop(time){
  ts=time||0;
  drawParticles(pCtx,time||0);
  animateTraffic(time||0);
  updatePackets();
  rafId=RA(loop);
}

/* --- EVENTS --- */
function bindEvents(){
  var mc=$('#mapWrap');
  mc.addEventListener('click',function(e){
    var g=e.target.closest('[data-id]');
    if(g){showInfo(g.dataset.id);return;}
    var nd=e.target.closest('.node');
    if(!nd)hideInfo();
  });
  mc.addEventListener('keydown',function(e){
    if(e.key==='Enter'||e.key===' '){
      var g=e.target.closest('[data-id]');
      if(g){e.preventDefault();showInfo(g.dataset.id);}
    }
  });
  $('#sendBtn').addEventListener('click',sendPacket);
  $('#panelClose').addEventListener('click',hideInfo);
  D.addEventListener('keydown',function(e){
    if(e.key==='Escape'){hideInfo();hideCompletion()}
  });
  $('#overlayClose').addEventListener('click',hideCompletion);
  $('#resetBtn').addEventListener('click',resetDiagram);
  var slider=$('#speedSlider');
  slider.addEventListener('input',function(){setSpeed(parseInt(this.value))});
  setSpeed(parseInt(slider.value));
  $('#themeBtn').addEventListener('click',toggleTheme);
  var panel=$('#infoPanel');
  var startY=0;
  panel.addEventListener('touchstart',function(e){startY=e.touches[0].clientY},{passive:true});
  panel.addEventListener('touchmove',function(e){
    var dy=e.touches[0].clientY-startY;
    if(dy>100)hideInfo();
  },{passive:true});
  startChallenge();
}

/* --- SKELETON FADE --- */
function hideSkeleton(){
  var skel=$('#skeleton');
  if(!skel)return;
  skel.style.opacity='0';
  setTimeout(function(){if(skel.parentNode)skel.parentNode.removeChild(skel)},350);
}


function initZoomPan(){
  var svg=$('#mapSvg'),wrap=$('#mapWrap');
  if(!svg||svg.querySelector('#zoom-group'))return;
  var zoomG=D.createElementNS(NS,'g');
  zoomG.setAttribute('id','zoom-group');
  var kids=[];
  for(var i=0;i<svg.children.length;i++){var kid=svg.children[i];if(kid.tagName!=='defs'&&kid.id!=='zoom-group'&&kid.tagName!=='rect')kids.push(kid)}
  for(var i=0;i<kids.length;i++)zoomG.appendChild(kids[i]);
  svg.appendChild(zoomG);
  var zoom=1,panX=0,panY=0,drg=false,sx,sy,spx,spy,zoom_listeners=[];
  function apply(){zoomG.setAttribute('transform','translate('+panX+','+panY+') scale('+zoom+')');var zd=document.getElementById('zoomDisplay');if(zd)zd.textContent=Math.round(zoom*100)+'%'}
  function wheelHandler(e){e.preventDefault();var r=svg.getBoundingClientRect(),mx=e.clientX-r.left,my=e.clientY-r.top,oz=zoom;zoom*=e.deltaY<0?1.1:0.9;zoom=Math.max(0.5,Math.min(4,zoom));panX=mx-(mx-panX)*zoom/oz;panY=my-(my-panY)*zoom/oz;apply()}
  function mdHandler(e){if(e.button!==0)return;if(e.target.closest('.node,.ctrl,.panel,.challenge-opt,.challenge-next,.overlay-btn,.btn-primary,.btn-sm,.btn-theme,.toggle-btn'))return;drg=true;sx=e.clientX;sy=e.clientY;spx=panX;spy=panY;zoomG.classList.add('panning')}
  function mmHandler(e){if(!drg)return;panX=spx+(e.clientX-sx);panY=spy+(e.clientY-sy);apply()}
  function muHandler(){if(drg){drg=false;zoomG.classList.remove('panning')}}
  var touches=null;
  function tsHandler(e){if(e.touches.length===1){drg=true;sx=e.touches[0].clientX;sy=e.touches[0].clientY;spx=panX;spy=panY}else if(e.touches.length===2){touches=[{x:e.touches[0].clientX,y:e.touches[0].clientY},{x:e.touches[1].clientX,y:e.touches[1].clientY}]}}
  function tmHandler(e){if(e.touches.length===1&&drg){panX=spx+(e.touches[0].clientX-sx);panY=spy+(e.touches[0].clientY-sy);apply()}else if(e.touches.length===2&&touches){var p1=e.touches[0],p2=e.touches[1];var od=Math.hypot(touches[0].x-touches[1].x,touches[0].y-touches[1].y);var nd=Math.hypot(p1.clientX-p2.clientX,p1.clientY-p2.clientY);var oz=zoom;zoom*=nd/od;zoom=Math.max(0.5,Math.min(4,zoom));apply();touches=[{x:p1.clientX,y:p1.clientY},{x:p2.clientX,y:p2.clientY}]}}
  function teHandler(){drg=false;touches=null}
  svg.addEventListener('wheel',wheelHandler,{passive:false});zoom_listeners.push({el:svg,type:'wheel',fn:wheelHandler});
  svg.addEventListener('mousedown',mdHandler);zoom_listeners.push({el:svg,type:'mousedown',fn:mdHandler});
  document.addEventListener('mousemove',mmHandler);zoom_listeners.push({el:document,type:'mousemove',fn:mmHandler});
  document.addEventListener('mouseup',muHandler);zoom_listeners.push({el:document,type:'mouseup',fn:muHandler});
  svg.addEventListener('touchstart',tsHandler,{passive:true});zoom_listeners.push({el:svg,type:'touchstart',fn:tsHandler});
  svg.addEventListener('touchmove',tmHandler,{passive:true});zoom_listeners.push({el:svg,type:'touchmove',fn:tmHandler});
  svg.addEventListener('touchend',teHandler);zoom_listeners.push({el:svg,type:'touchend',fn:teHandler});
  var zoomInBtn=document.getElementById('zoomIn');if(zoomInBtn)zoomInBtn.addEventListener('click',function(){zoom=Math.min(4,zoom*1.3);apply()});
  var zoomOutBtn=document.getElementById('zoomOut');if(zoomOutBtn)zoomOutBtn.addEventListener('click',function(){zoom=Math.max(0.5,zoom/1.3);apply()});
  var zoomResetBtn=document.getElementById('zoomReset');if(zoomResetBtn)zoomResetBtn.addEventListener('click',function(){zoom=1;panX=0;panY=0;apply()});
}

/* --- INIT --- */
try{
  buildVisual();buildConnections();buildTrafficDots();
    initZoomPan();
  var ml=$('#mapLabel');if(ml)ml.remove();
  pCtx=initParticles();
  initTheme();
  bindEvents();
  rafId=RA(loop);
  hideSkeleton();
}catch(e){
  console.error('Diagram init error:',e);
  var err=D.createElement('div');
  err.style.cssText='position:fixed;inset:0;z-index:99999;display:flex;align-items:center;justify-content:center;background:#0a0e1a;color:#ef4444;font-family:sans-serif;padding:40px;text-align:center';
  err.innerHTML='<div><h2 style="font-size:18px;margin-bottom:8px">Diagram Error</h2><p style="font-size:13px;color:#94a3b8">'+esc(e.message||'Unknown error')+'</p></div>';
  D.body.appendChild(err);
}

/* --- CLEANUP --- */
W.addEventListener('beforeunload',function(){if(rafId)CA(rafId)});
})();