(function(){
'use strict';
var D=document,W=window,$=function(s,p){return(p||D).querySelector(s)},
$$=function(s,p){return Array.from((p||D).querySelectorAll(s))},
NS='http://www.w3.org/2000/svg',CA=cancelAnimationFrame,RA=requestAnimationFrame;

/* --- DATA --- */
var NODES=[{"id": "source", "name": "Source Network", "cat": "Network", "icon": "💻", "x": 60, "y": 140, "desc": "The source network contains the device initiating communication, with traffic leaving through its default gateway.", "how": "Devices on this network communicate directly using ARP for local traffic, and send packets to their default gateway for external destinations.", "why": "The source is where all routed traffic begins its journey", "analogy": "Like a neighborhood where a delivery truck starts its route", "fun": "Traffic between two devices on the same network never needs a router", "take": "Routing is only needed when traffic crosses network boundaries"}, {"id": "router", "name": "Network Router", "cat": "Network", "icon": "📡", "x": 220, "y": 60, "desc": "The router examines each packets destination IP, consults its routing table, and forwards the packet to the next hop.", "how": "The router performs a longest prefix match on the destination IP against its routing table containing direct, static, and dynamic routes.", "why": "Routers are the decision-makers that direct traffic across networks", "analogy": "Like a GPS navigation system that chooses which road to take", "fun": "Routers can update their routing tables dynamically using BGP and OSPF", "take": "Routers make forwarding decisions one hop at a time"}, {"id": "switch", "name": "Network Switch", "cat": "Network", "icon": "🔁", "x": 220, "y": 200, "desc": "The switch learns MAC addresses and forwards Ethernet frames only to the specific port that needs them.", "how": "Switches build a MAC address table by examining source MAC addresses on incoming frames and forwarding based on destination MAC.", "why": "Switches enable efficient communication between many devices on a LAN", "analogy": "Like a smart mail sorter in an office that puts letters in the right persons mailbox", "fun": "Switches operate at Layer 2, while routers operate at Layer 3 of the OSI model", "take": "Switches create direct, efficient paths within a network"}, {"id": "firewall", "name": "Network Firewall", "cat": "Security", "icon": "🛡️", "x": 430, "y": 60, "desc": "The firewall inspects packets entering or leaving the network and allows or blocks them based on rules.", "how": "Firewalls can be stateful (tracking connection state) or stateless, and next-generation firewalls add deep packet inspection and intrusion prevention.", "why": "Firewalls are the first line of defense against network attacks", "analogy": "Like a security guard who checks IDs at the building entrance", "fun": "Firewalls have been protecting networks since the late 1980s", "take": "Firewalls use rules to permit or deny traffic based on multiple criteria"}, {"id": "destination", "name": "Destination Network", "cat": "Network", "icon": "🖥️", "x": 620, "y": 140, "desc": "The destination networks router receives the incoming packet and forwards it to the specific device.", "how": "The destination networks router strips the packet from the WAN interface and forwards it to the internal network via the switch.", "why": "The destination network is where the data finally arrives and is consumed", "analogy": "Like the delivery address where a package is dropped off and opened", "fun": "The destination networks router also serves as a firewall for incoming traffic", "take": "Reaching the destination network isnt the end the packet still needs to reach the specific device"}];
var CONNECTIONS=[{"from": "source", "to": "router", "type": "fiber"}, {"from": "router", "to": "switch", "type": "fiber"}, {"from": "switch", "to": "firewall", "type": "fiber"}, {"from": "firewall", "to": "destination", "type": "fiber"}];
var ROUTES={"A": {"name": "Network Path", "color": "#3b82f6", "path": ["source", "router", "switch", "firewall", "destination"]}};
var CHALLENGES=[{"q": "At which OSI layer does a router operate?", "opts": ["Layer 1 (Physical)", "Layer 2 (Data Link)", "Layer 3 (Network)", "Layer 7 (Application)"], "ans": 2, "exp": "Routers operate at Layer 3 (Network layer) making forwarding decisions based on IP addresses."}, {"q": "At which OSI layer does a switch operate?", "opts": ["Layer 1", "Layer 2", "Layer 3", "Layer 4"], "ans": 1, "exp": "Switches operate at Layer 2 (Data Link layer) forwarding based on MAC addresses."}, {"q": "What does a switch use to forward frames?", "opts": ["IP addresses", "MAC addresses", "Domain names", "Port numbers"], "ans": 1, "exp": "Switches use MAC addresses to forward Ethernet frames to the correct port."}, {"q": "What is the primary purpose of a firewall?", "opts": ["Route packets", "Filter traffic based on security rules", "Connect networks", "Amplify signals"], "ans": 1, "exp": "Firewalls inspect packets and allow or block them based on configured security rules."}, {"q": "What is a stateful firewall?", "opts": ["Blocks all traffic", "Tracks connection state to make filtering decisions", "Only filters based on IP", "Works at Layer 2"], "ans": 1, "exp": "Stateful firewalls track the state of active connections to make informed filtering decisions."}, {"q": "What is a next-generation firewall (NGFW)?", "opts": ["A faster router", "Adds deep packet inspection and IPS", "A software firewall", "A DNS filter"], "ans": 1, "exp": "NGFWs combine traditional packet filtering with deep packet inspection and intrusion prevention."}, {"q": "What routing protocol is commonly used within an autonomous system?", "opts": ["BGP", "OSPF", "RIP", "EIGRP"], "ans": 1, "exp": "OSPF (Open Shortest Path First) is commonly used as an Interior Gateway Protocol within an AS."}, {"q": "What does ARP do?", "opts": ["Resolves domain names", "Maps IP addresses to MAC addresses", "Routes packets", "Encrypts data"], "ans": 1, "exp": "ARP (Address Resolution Protocol) maps IP addresses to MAC addresses on a local network."}, {"q": "When does traffic not need routing?", "opts": ["When it goes to the Internet", "When it stays within the same network", "When it uses HTTPS", "When its UDP"], "ans": 1, "exp": "Traffic between devices on the same network is switched, not routed."}, {"q": "What does a firewall use to match traffic against rules?", "opts": ["File names", "IP, port, and protocol", "User names", "Website content"], "ans": 1, "exp": "Firewalls filter traffic based on criteria like source/destination IP, port numbers, and protocol."}];

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

/* --- INIT --- */
try{
  buildVisual();buildConnections();buildTrafficDots();
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