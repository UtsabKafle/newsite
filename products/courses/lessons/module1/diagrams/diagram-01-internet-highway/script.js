(function(){
'use strict';
var D=document,W=window,$=function(s,p){return(p||D).querySelector(s)},
$$=function(s,p){return Array.from((p||D).querySelectorAll(s))},
NS='http://www.w3.org/2000/svg',CA=cancelAnimationFrame,RA=requestAnimationFrame;

/* ═══════════════════════════════════════════
   DATA
   ═══════════════════════════════════════════ */
var NODES=[
{id:'home',name:'Home Computer',cat:'End Point',icon:'💻',x:120,y:340,
 desc:'Your phone, laptop, or tablet creates data packets.',
 how:'Your device initiates communication by creating data packets with source and destination IP addresses.',
 why:'Where every Internet journey begins',
 analogy:'Like your home where you send and receive mail',
 fun:'Over 15 billion devices are connected worldwide',
 take:'Every device has a unique IP address'},
{id:'router',name:'Home Router',cat:'Network Device',icon:'📡',x:190,y:370,
 desc:'Connects your home network to the Internet.',
 how:'Routers examine the destination IP of each packet and forward it along the most efficient path.',
 why:'Routers make the Internet work by connecting millions of networks',
 analogy:'Like a postal sorting office',
 fun:'A core router can process 100 million packets per second',
 take:'Routers use routing tables to determine packet paths'},
{id:'isp',name:'Internet Service Provider',cat:'Service Provider',icon:'🏢',x:270,y:400,
 desc:'Provides the connection between your home network and the global Internet.',
 how:'ISPs maintain the infrastructure that carries your data from your home router.',
 why:'Without ISPs, you couldn\'t access the wider Internet',
 analogy:'Like a highway system connecting towns',
 fun:'Some ISPs use fiber optic cables at the speed of light',
 take:'Your ISP is your gateway to the Internet'},
{id:'regional',name:'Regional Router',cat:'Network Infrastructure',icon:'🌐',x:360,y:360,
 desc:'Aggregates traffic from multiple ISPs and routes it across the continent.',
 how:'Regional routers handle large volumes of data between different ISPs and regions.',
 why:'They keep data moving efficiently across continents',
 analogy:'Like a major airport hub',
 fun:'Regional routers handle terabits of data per second',
 take:'Data often passes through multiple regional routers'},
{id:'backbone',name:'Backbone Router',cat:'Core Infrastructure',icon:'⚡',x:470,y:300,
 desc:'A core router on the Internet backbone that moves data between continents.',
 how:'Backbone routers form the Internet\'s central nervous system.',
 why:'Backbone routers are the superhighways of the Internet',
 analogy:'Like interstate highways',
 fun:'Backbone fiber runs thousands of kilometers undersea',
 take:'The backbone connects entire continents'},
{id:'undersea',name:'Undersea Cable',cat:'Infrastructure',icon:'🌊',x:630,y:380,
 desc:'Fiber optic cables on the ocean floor that carry data between continents.',
 how:'99% of international data travels through undersea cables.',
 why:'Undersea cables are the physical backbone of global Internet',
 analogy:'Like a super-fast underwater highway',
 fun:'There are over 400 active undersea cable systems',
 take:'Most Internet traffic goes through undersea cables'},
{id:'datacenter',name:'Data Center',cat:'Infrastructure',icon:'🏗️',x:740,y:310,
 desc:'A facility that houses servers and provides computing power.',
 how:'Data centers contain thousands of servers, storage systems, and networking equipment.',
 why:'Data centers are where the Internet lives',
 analogy:'Like a giant library of computers',
 fun:'A hyperscale data center can have 100,000+ servers',
 take:'Data centers consume enormous amounts of electricity'},
{id:'server',name:'Web Server',cat:'Software',icon:'🖥️',x:820,y:350,
 desc:'Stores website files and delivers them to requesting devices.',
 how:'Web servers store all files that make up a website and send them when a browser requests them.',
 why:'Without servers, websites would have nowhere to live',
 analogy:'Like a library that lends books',
 fun:'A single server can handle millions of daily requests',
 take:'Servers are designed to run 24/7 without stopping'}
];
var WEB_NODES=[
{id:'browser',name:'Browser',icon:'🌍',x:160,y:150,desc:'Your window to the web.'},
{id:'youtube',name:'YouTube',icon:'▶️',x:340,y:120,desc:'Video streaming platform.'},
{id:'wikipedia',name:'Wikipedia',icon:'📚',x:610,y:130,desc:'Online encyclopedia.'},
{id:'store',name:'Online Store',icon:'🛒',x:810,y:160,desc:'E-commerce platform.'},
{id:'search',name:'Search Engine',icon:'🔍',x:500,y:110,desc:'Indexes billions of web pages.'}
];
var CONNECTIONS=[
{from:'home',to:'router',type:'fiber'},{from:'router',to:'isp',type:'fiber'},
{from:'isp',to:'regional',type:'fiber'},{from:'regional',to:'backbone',type:'fiber'},
{from:'backbone',to:'undersea',type:'cable'},{from:'undersea',to:'datacenter',type:'cable'},
{from:'datacenter',to:'server',type:'fiber'},
{from:'isp',to:'datacenter',type:'satellite',alt:true},{from:'regional',to:'datacenter',type:'cable',alt:true}
];
var WEB_LINKS=[
{from:'browser',to:'search'},{from:'browser',to:'youtube'},{from:'browser',to:'wikipedia'},{from:'browser',to:'store'},
{from:'search',to:'wikipedia'},{from:'search',to:'store'},{from:'youtube',to:'datacenter'},{from:'wikipedia',to:'datacenter'},{from:'store',to:'datacenter'}
];
var ROUTES={
A:{name:'Atlantic Fiber Route',color:'#3b82f6',path:['home','router','isp','regional','backbone','undersea','datacenter','server']},
B:{name:'Satellite Express Route',color:'#a855f7',path:['home','router','isp','datacenter','server']},
C:{name:'Asia-Pacific Route',color:'#06b6d4',path:['home','router','isp','regional','datacenter','server']}
};
var CABLE_ROUTES=[
'M285,192 C330,165 380,155 420,150 C445,148 465,148 485,148',
'M290,195 C310,240 320,280 335,310 C345,325 352,330 358,330',
'M180,192 C320,185 480,183 620,185 C720,188 800,190 875,192',
'M485,148 C530,168 580,192 630,212 C655,222 670,228 680,232 C705,240 730,245 748,245 C765,252 780,265 790,278',
'M875,192 C860,225 840,255 815,275 C803,285 798,290 795,295 C815,315 845,335 875,348 C900,360 920,368 935,375'
];
var CONTINENTS={
na:'M55,98 C58,88 62,78 68,70 C74,62 82,56 92,52 C102,48 115,46 128,46 C141,46 155,48 168,52 C181,56 192,62 202,70 C212,78 218,88 222,98 C226,108 228,118 228,128 C228,138 226,148 222,158 C218,168 212,178 204,186 C196,194 186,200 176,204 C166,208 156,210 146,210 C136,210 126,208 118,204 C110,200 102,194 96,186 C90,178 86,168 84,158 C82,148 80,138 78,128 C76,118 72,108 66,100 C62,96 58,96 55,98 Z',
sa:'M220,280 C224,272 230,266 238,262 C246,258 256,256 266,258 C276,260 284,264 290,270 C296,276 300,284 302,294 C304,304 304,316 302,328 C300,340 296,352 290,364 C284,376 276,388 266,398 C256,408 246,416 236,422 C226,428 218,432 212,434 C206,436 202,436 200,434 C198,432 198,428 200,422 C202,416 206,408 210,398 C214,388 218,376 220,364 C222,352 224,340 224,328 C224,316 222,304 220,292 C218,284 218,280 220,280 Z',
eu:'M460,72 C468,62 480,56 494,54 C508,52 522,54 534,58 C546,62 556,68 564,76 C572,84 578,94 580,106 C582,118 580,130 574,140 C568,150 558,158 546,162 C534,166 520,168 506,166 C492,164 480,160 470,154 C460,148 454,140 450,130 C446,120 444,108 446,98 C448,88 452,80 460,72 Z',
af:'M450,160 C458,150 468,144 480,140 C492,136 504,134 516,136 C528,138 538,142 546,148 C554,154 560,162 564,172 C568,182 570,194 568,206 C566,218 562,230 556,242 C550,254 542,266 532,276 C522,286 510,294 498,300 C486,306 474,310 462,312 C450,314 440,314 432,312 C424,310 418,306 414,300 C410,294 408,286 408,276 C408,266 410,254 414,242 C418,230 422,218 426,206 C430,194 436,182 442,170 C446,164 448,160 450,160 Z',
as:'M490,55 C510,48 532,44 556,42 C580,40 606,40 632,44 C658,48 684,54 708,62 C732,70 752,80 768,92 C784,104 796,118 804,134 C812,150 816,168 814,186 C812,204 806,220 796,234 C786,248 772,258 754,264 C736,270 716,272 696,270 C676,268 656,262 636,254 C616,246 598,236 582,224 C566,212 554,198 546,182 C538,166 532,148 530,130 C528,112 522,92 514,76 C506,66 496,58 490,55 Z M860,110 C868,104 878,100 888,100 C898,100 908,104 916,110 C924,116 930,124 932,134 C934,144 932,154 926,162 C920,170 912,176 902,178 C892,180 882,178 874,174 C866,170 860,164 858,156 C856,148 856,138 858,128 C860,120 858,114 860,110 Z',
au:'M840,310 C848,304 858,300 870,298 C882,296 894,296 906,300 C918,304 928,310 936,318 C944,326 950,336 952,348 C954,360 954,372 950,382 C946,392 940,400 930,406 C920,412 908,416 896,416 C884,416 872,414 862,408 C852,402 844,394 838,384 C832,374 830,362 830,350 C830,338 832,326 836,318 C838,314 840,312 840,310 Z'
};
var ISLANDS=[
'M670,50 C680,45 692,42 702,44 C712,46 720,52 724,60 C728,68 730,78 728,88 C726,98 720,106 712,110 C704,114 694,115 686,112 C678,109 672,104 668,98 C664,92 662,84 664,76 C666,68 668,60 670,50 Z',
'M458,48 C462,44 468,42 474,42 C480,42 486,44 490,48 C494,52 496,58 496,64 C496,70 494,76 490,80 C486,84 480,86 474,86 C468,86 462,84 458,80 C454,76 452,70 452,64 C452,58 454,52 458,48 Z',
'M864,168 C868,164 874,162 880,162 C886,162 892,164 896,168 C900,172 902,178 902,184 C902,190 900,196 896,200 C892,204 886,206 880,206 C874,206 868,204 864,200 C860,196 858,190 858,184 C858,178 860,172 864,168 Z',
'M590,340 C594,336 600,334 606,334 C612,334 618,336 622,340 C626,344 628,350 628,356 C628,362 626,368 622,372 C618,376 612,378 606,378 C600,378 594,376 590,372 C586,368 584,362 584,356 C584,350 586,344 590,340 Z',
'M956,380 C960,376 966,374 972,374 C978,374 984,376 988,380 C992,384 994,390 994,396 C994,402 992,408 988,412 C984,416 978,418 972,418 C966,418 960,416 956,412 C952,408 950,402 950,396 C950,390 952,384 956,380 Z',
'M294,230 C298,226 304,224 310,224 C316,224 322,226 326,230 C330,234 332,240 332,246 C332,252 330,256 326,258 C322,260 316,260 310,258 C304,256 298,252 294,248 C290,244 288,238 288,234 C288,230 290,228 294,230 Z',
'M854,238 C858,234 864,232 870,232 C876,232 882,234 886,238 C890,242 892,248 892,254 C892,260 890,266 886,270 C882,274 876,276 870,276 C864,276 858,274 854,270 C850,266 848,260 848,254 C848,248 850,242 854,238 Z',
'M614,300 C618,296 624,294 630,294 C636,294 642,296 646,300 C650,304 652,310 652,316 C652,322 650,328 646,332 C642,336 636,338 630,338 C624,338 618,336 614,332 C610,328 608,322 608,316 C608,310 610,304 614,300 Z'
];
var CITIES=[
{name:'New York',x:290,y:190,note:'Internet Exchange Point'},{name:'London',x:490,y:148,note:'Major Data Hub'},
{name:'Tokyo',x:885,y:190,note:'Asia-Pacific Hub'},{name:'Sydney',x:930,y:370,note:'Oceania Gateway'},
{name:'São Paulo',x:360,y:330,note:'Latin American Hub'},{name:'Mumbai',x:715,y:235,note:'South Asia Gateway'},
{name:'Cape Town',x:555,y:358,note:'African Landing'},{name:'Singapore',x:790,y:278,note:'Southeast Asia Hub'},
{name:'Dubai',x:655,y:220,note:'Middle East Hub'},{name:'Los Angeles',x:175,y:195,note:'West Coast Gateway'}
];

/* ═══════════════════════════════════════════
   CHALLENGE QUESTIONS
   ═══════════════════════════════════════════ */
var CHALLENGES=[
{q:'What does a router do?',opts:['Directs data packets to their destination','Stores website files','Provides Internet access','Translates domain names'],ans:0,exp:'Routers examine the destination IP of each packet and forward it along the most efficient path.'},
{q:'What carries 99% of international Internet traffic?',opts:['Satellites','Undersea cables','Wireless towers','Radio signals'],ans:1,exp:'Undersea fiber optic cables carry 99% of international data traffic across oceans.'},
{q:'What is the role of an ISP?',opts:['Creates websites','Provides your connection to the Internet','Manufactures routers','Manages domain names'],ans:1,exp:'ISPs provide the infrastructure that connects your home network to the global Internet.'},
{q:'What happens to data when it travels across the Internet?',opts:['It stays as one large file','It is broken into packets','It is stored on every router','It gets deleted after reaching its destination'],ans:1,exp:'Data is broken into small packets, each containing addressing info so it can be reassembled at the destination.'},
{q:'Where are websites physically stored?',opts:['In the cloud','On web servers in data centers','On your computer','In routers'],ans:1,exp:'Web servers store all files that make up a website and deliver them when a browser requests them.'},
{q:'What does a DNS server do?',opts:['Routes packets','Translates domain names to IP addresses','Provides Internet service','Stores website files'],ans:1,exp:'DNS translates human-readable domain names (like google.com) into numeric IP addresses that computers understand.'},
{q:'What is the Internet backbone?',opts:['The wireless network','The core high-speed connections between major networks','Your home Wi-Fi','A type of cable'],ans:1,exp:'The backbone is formed by high-capacity fiber links connecting major routers and networks across continents.'},
{q:'How do packets know where to go?',opts:['They ask for directions','Each packet has a header with source and destination IP addresses','A central computer directs them','They follow the same path every time'],ans:1,exp:'Each packet has a header containing the source IP, destination IP, and sequence number for reassembly.'},
{q:'What is a data center?',opts:['A room with one computer','A facility housing thousands of servers','An office building','A type of router'],ans:1,exp:'Data centers contain thousands of servers, storage systems, and networking equipment to power Internet services.'},
{q:'What was the first computer "bug"?',opts:['A software error','A moth found in a relay','A broken wire','A programming mistake'],ans:1,exp:'The term "bug" was coined when a physical moth was found trapped in a relay of the Harvard Mark II computer in 1947.'}
];

/* ═══════════════════════════════════════════
   STATE
   ═══════════════════════════════════════════ */
var S={
  selected:null,packetCount:0,sending:false,route:null,
  packets:[],traffic:[],particles:[],time:0,
  webVisible:false,infraVisible:true,sentPackets:0,hasCompleted:false,
  speedMult:1,theme:'dark',challengeIdx:0,score:0,challengeDone:false
};
var rafId=null,lastTime=0,ts=0,DOM={};

/* ═══════════════════════════════════════════
   UTILITIES
   ═══════════════════════════════════════════ */
function lerp(a,b,t){return a+(b-a)*t}
function bezier(ax,ay,bx,by,cx,cy,dx,dy,t){
  var mt=1-t,mt2=mt*mt,mt3=mt2*mt,t2=t*t,t3=t2*t;
  return {x:mt3*ax+3*mt2*t*bx+3*mt*t2*cx+t3*dx,y:mt3*ay+3*mt2*t*by+3*mt*t2*cy+t3*dy};
}
function rand(a,b){return a+Math.random()*(b-a)}
function randid(){return Math.floor(Math.random()*9000+1000)}
function esc(s){var d=D.createElement('div');d.textContent=s;return d.innerHTML}
function qs(s){return D.querySelector(s)}
function qsa(s){return Array.from(D.querySelectorAll(s))}

/* ═══════════════════════════════════════════
   SPEED
   ═══════════════════════════════════════════ */
function setSpeed(val){
  S.speedMult=0.25+(val/16)*3.75;
  qs('#speedDisplay').textContent=S.speedMult.toFixed(2).replace(/\.?0+$/,'')+'×';
}

/* ═══════════════════════════════════════════
   SVG BUILDERS
   ═══════════════════════════════════════════ */
function buildMap(){
  var cg=qs('#continents');
  cg.setAttribute('transform','translate(0,61) scale(0.5)');
  COUNTRIES.forEach(function(c){
    var p=D.createElementNS(NS,'path');
    p.setAttribute('d',c.d);p.setAttribute('class','continent');
    cg.appendChild(p);
  });
}
function buildCities(){
  var mg=qs('#cities');
  CITIES.forEach(function(c){
    var g=D.createElementNS(NS,'g');
    var dot=D.createElementNS(NS,'circle');
    dot.setAttribute('cx',c.x);dot.setAttribute('cy',c.y);
    dot.setAttribute('r','2.5');dot.setAttribute('class','city-dot');
    g.appendChild(dot);
    var lbl=D.createElementNS(NS,'text');
    lbl.setAttribute('x',c.x);lbl.setAttribute('y',c.y+9);
    lbl.setAttribute('class','city-label');lbl.textContent=c.name;
    g.appendChild(lbl);
    mg.appendChild(g);
  });
}
function buildCables(){
  var rg=qs('#cables');
  CABLE_ROUTES.forEach(function(d){
    var p=D.createElementNS(NS,'path');
    p.setAttribute('d',d);p.setAttribute('class','cable');
    rg.appendChild(p);
  });
}
function buildNodes(){
  var ng=qs('#nodes');
  NODES.forEach(function(n){
    var g=D.createElementNS(NS,'g');
    g.setAttribute('class','node');g.dataset.id=n.id;
    g.setAttribute('role','button');g.setAttribute('tabindex','0');
    g.setAttribute('aria-label','Select '+n.name);
    var glow=D.createElementNS(NS,'circle');
    glow.setAttribute('cx',n.x);glow.setAttribute('cy',n.y-4);
    glow.setAttribute('r','22');glow.setAttribute('fill','url(#nodeGlow)');
    g.appendChild(glow);
    var bg=D.createElementNS(NS,'rect');
    bg.setAttribute('x',n.x-18);bg.setAttribute('y',n.y-22);
    bg.setAttribute('width','36');bg.setAttribute('height','36');
    bg.setAttribute('rx','10');bg.setAttribute('class','node-bg');
    g.appendChild(bg);
    var txt=D.createElementNS(NS,'text');
    txt.setAttribute('x',n.x);txt.setAttribute('y',n.y+1);
    txt.setAttribute('text-anchor','middle');txt.setAttribute('font-size','16');
    txt.setAttribute('class','node-icon');txt.textContent=n.icon;
    g.appendChild(txt);
    var lbl=D.createElementNS(NS,'text');
    lbl.setAttribute('x',n.x);lbl.setAttribute('y',n.y+28);
    lbl.setAttribute('class','node-label');lbl.textContent=n.name;
    g.appendChild(lbl);
    var slbl=D.createElementNS(NS,'text');
    slbl.setAttribute('x',n.x);slbl.setAttribute('y',n.y+40);
    slbl.setAttribute('class','node-sublabel');slbl.textContent=n.cat;
    g.appendChild(slbl);
    ng.appendChild(g);
  });
}
function buildWebNodes(){
  var wg=qs('#webLayer');
  WEB_NODES.forEach(function(n){
    var g=D.createElementNS(NS,'g');
    g.setAttribute('class','web-node');g.dataset.id=n.id;
    g.setAttribute('role','button');g.setAttribute('tabindex','0');
    g.setAttribute('aria-label','Select '+n.name);
    var bg=D.createElementNS(NS,'rect');
    bg.setAttribute('x',n.x-16);bg.setAttribute('y',n.y-18);
    bg.setAttribute('width','32');bg.setAttribute('height','32');
    bg.setAttribute('rx','8');bg.setAttribute('class','node-bg');
    g.appendChild(bg);
    var txt=D.createElementNS(NS,'text');
    txt.setAttribute('x',n.x);txt.setAttribute('y',n.y+1);
    txt.setAttribute('text-anchor','middle');txt.setAttribute('font-size','14');
    txt.setAttribute('class','node-icon');txt.textContent=n.icon;
    g.appendChild(txt);
    var lbl=D.createElementNS(NS,'text');
    lbl.setAttribute('x',n.x);lbl.setAttribute('y',n.y+24);
    lbl.setAttribute('class','node-label');lbl.setAttribute('font-size','8');
    lbl.textContent=n.name;
    g.appendChild(lbl);
    wg.appendChild(g);
  });
}
function buildConnections(){
  var cg=qs('#connections');
  CONNECTIONS.forEach(function(c){
    var f=NODES.find(function(n){return n.id===c.from});
    var t=NODES.find(function(n){return n.id===c.to});
    if(!f||!t)return;
    var p=D.createElementNS(NS,'path');
    var mx=(f.x+t.x)/2,my=(f.y+t.y)/2;
    var cy=c.type==='satellite'?Math.min(f.y,t.y)-40:c.type==='cable'?Math.max(f.y,t.y)+20:my;
    p.setAttribute('d','M'+f.x+','+(f.y-4)+' Q'+((f.x+t.x)/2)+','+cy+' '+t.x+','+(t.y-4));
    p.setAttribute('class','connection '+c.type);
    if(c.alt)p.setAttribute('opacity','0.25');
    cg.appendChild(p);
  });
}
function buildWebLinks(){
  var wg=qs('#webLayer');
  WEB_LINKS.forEach(function(l){
    var all=[].concat(NODES,WEB_NODES);
    var f=all.find(function(n){return n.id===l.from});
    var t=all.find(function(n){return n.id===l.to});
    if(!f||!t)return;
    var p=D.createElementNS(NS,'path');
    p.setAttribute('d','M'+f.x+','+(f.y-4)+' L'+t.x+','+(t.y-4));
    p.setAttribute('class','web-link');
    wg.appendChild(p);
  });
}
function buildTrafficDots(){
  var tg=qs('#trafficDots');
  CONNECTIONS.forEach(function(c,i){
    var f=NODES.find(function(n){return n.id===c.from});
    var t=NODES.find(function(n){return n.id===c.to});
    if(!f||!t)return;
    for(var j=0;j<3;j++){
      var d=D.createElementNS(NS,'circle');
      d.setAttribute('r','2');d.setAttribute('class','traffic-dot');
      d.setAttribute('data-conn',i);d.setAttribute('data-offset',j/3+Math.random()*0.1);
      d.setAttribute('fill',c.type==='fiber'?'#3b82f6':c.type==='cable'?'#06b6d4':'#a855f7');
      tg.appendChild(d);
    }
  });
}

/* ═══════════════════════════════════════════
   PARTICLES
   ═══════════════════════════════════════════ */
var pCtx=null;
function initParticles(){
  var canvas=qs('#particles'),ctx=canvas.getContext('2d');
  var mc=qs('#mapWrap');
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

/* ═══════════════════════════════════════════
   TRAFFIC
   ═══════════════════════════════════════════ */
function getConnNodes(){
  return CONNECTIONS.map(function(c){
    var f=NODES.find(function(n){return n.id===c.from});
    var t=NODES.find(function(n){return n.id===c.to});
    return{from:f?{x:f.x,y:f.y-4}:{x:0,y:0},to:t?{x:t.x,y:t.y-4}:{x:0,y:0},type:c.type};
  });
}
function animateTraffic(time){
  var dots=qsa('.traffic-dot');
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

/* ═══════════════════════════════════════════
   PACKETS
   ═══════════════════════════════════════════ */
function getNodePos(id){
  var n=NODES.find(function(n){return n.id===id});
  if(n)return{x:n.x,y:n.y-4};
  n=WEB_NODES.find(function(n){return n.id===id});
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
  var btn=qs('#sendBtn');
  btn.disabled=true;btn.innerHTML='<span style="display:inline-block;animation:spin 0.8s linear infinite">&#9696;</span> Traveling...';
  var id=randid();
  var packet={
    id:id,points:pts,t:0,speed:(0.004+Math.random()*0.002)*S.speedMult,
    baseSpeed:0.004+Math.random()*0.002,routeName:S.route.name,
    color:S.route.color,forward:true,el:null,trailEls:[]
  };
  var pg=qs('#packets');
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
  var ri=qs('#routeInfo');
  var html='<span style="color:'+packet.color+';font-weight:700">Route:</span> '+esc(S.route.name);
  ri.innerHTML=html;ri.classList.add('visible');
  updateTooltip(packet);
  showTooltip();
}
function updateTooltip(pkt){
  var tt=qs('#tooltip');
  tt.innerHTML='<div class="tooltip-label">Packet #'+pkt.id+'</div><div class="tooltip-val">'+esc(pkt.routeName)+'</div><div style="font-size:10px;color:var(--text-muted);margin-top:2px">Status: Traveling</div>';
  tt.classList.add('visible');
}
function showTooltip(){
  var pm=qs('#mapWrap');
  pm.addEventListener('mousemove',function(e){
    var tt=qs('#tooltip');
    if(tt.classList.contains('visible')){
      var x=e.clientX+14,y=e.clientY-10;
      var tw=tt.offsetWidth||200,th=tt.offsetHeight||60;
      if(x+tw>W.innerWidth-10)x=e.clientX-tw-14;
      if(y+th>W.innerHeight-10)y=e.clientY-th-10;
      if(y<10)y=10;
      tt.style.left=x+'px';tt.style.top=y+'px';
    }
  },{passive:true});
}
function hideTooltip(){var tt=qs('#tooltip');tt.classList.remove('visible');}

/* ═══════════════════════════════════════════
   PACKET ANIMATION
   ═══════════════════════════════════════════ */
function updatePackets(){
  var pg=qs('#packets');
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

/* ═══════════════════════════════════════════
   COMPLETION
   ═══════════════════════════════════════════ */
function showCompletion(){
  if(S.hasCompleted)return;
  S.hasCompleted=true;S.sending=false;
  hideTooltip();
  var btn=qs('#sendBtn');
  btn.disabled=false;btn.innerHTML='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="14" height="14"><path d="M12 2v20M2 12h20"/></svg> Send Packet';
  var dist=Math.floor(rand(15000,35000)),time=Math.floor(rand(80,250));
  var hops=S.route?S.route.path.length-1:6;
  qs('#statDist').textContent=dist.toLocaleString();
  qs('#statTime').textContent=time;
  qs('#statHops').textContent=hops;
  var cp=qs('#overlayPath');
  var path=S.route?S.route.path:ROUTES.A.path;
  var html='';
  path.forEach(function(id,i){
    var n=NODES.find(function(n){return n.id===id});
    if(i>0)html+='<span style="margin:0 2px;color:var(--text-faint)">→</span>';
    html+='<span style="color:'+(i===0||i===path.length-1?'var(--success)':'var(--text)')+'">'+(n?esc(n.name):id)+'</span>';
  });
  cp.innerHTML=html;
  setTimeout(function(){qs('#completionOverlay').removeAttribute('hidden')},300);
}
function hideCompletion(){
  S.hasCompleted=false;S.sentPackets=0;
  S.packets.forEach(function(p){if(p.el&&p.el.parentNode)p.el.parentNode.remove()});
  S.packets=[];
  qs('#completionOverlay').setAttribute('hidden','');
}

/* ═══════════════════════════════════════════
   INFO PANEL
   ═══════════════════════════════════════════ */
function showInfo(id){
  var all=[].concat(NODES,WEB_NODES);
  var n=all.find(function(n){return n.id===id});
  if(!n)return;
  var panel=qs('#infoPanel');
  qs('#panelCat').textContent=n.cat||'Web Application';
  qs('#panelTitle').textContent=n.name;
  qs('#panelDesc').textContent=n.desc||n.how||'';
  var html='';
  if(n.how)html+='<div class="panel-section"><div class="panel-section-label">How It Works</div><div class="panel-section-value">'+esc(n.how)+'</div></div>';
  if(n.why)html+='<div class="panel-section"><div class="panel-section-label">Why It Matters</div><div class="panel-section-value">'+esc(n.why)+'</div></div>';
  if(n.analogy)html+='<div class="panel-section"><div class="panel-section-label">Real-World Analogy</div><div class="panel-section-value">'+esc(n.analogy)+'</div></div>';
  if(n.fun)html+='<div class="panel-section"><div class="panel-section-label">Fun Fact</div><div class="panel-section-value">'+esc(n.fun)+'</div></div>';
  if(n.take)html+='<div class="panel-section"><div class="panel-section-label">Key Takeaway</div><div class="panel-section-value">'+esc(n.take)+'</div></div>';
  qs('#panelSections').innerHTML=html;
  panel.classList.add('open');panel.setAttribute('aria-hidden','false');
  S.selected=id;
  qsa('.node.selected,.web-node.selected').forEach(function(el){el.classList.remove('selected')});
  var nodeEl=qs('[data-id="'+id+'"]');
  if(nodeEl)nodeEl.classList.add('selected');
}
function hideInfo(){
  var panel=qs('#infoPanel');
  panel.classList.remove('open');panel.setAttribute('aria-hidden','true');
  S.selected=null;
  qsa('.node.selected,.web-node.selected').forEach(function(el){el.classList.remove('selected')});
}

/* ═══════════════════════════════════════════
   LAYER TOGGLE
   ═══════════════════════════════════════════ */
function setLayer(layer){
  var mc=qs('#mapWrap');
  var wl=qs('#webLayer');
  wl.style.opacity=layer==='internet'?'0':'1';
  wl.style.pointerEvents=layer==='internet'?'none':'all';
  var lb=qs('#layerBadge');
  if(layer==='internet'){lb.textContent='Internet Layer';lb.style.cssText='background:var(--brand-sub);color:var(--brand);border:1px solid rgba(59,130,246,0.2)'}
  else if(layer==='web'){lb.textContent='Web Layer';lb.style.cssText='background:rgba(16,185,129,0.1);color:var(--success);border:1px solid rgba(16,185,129,0.2)'}
  else{lb.textContent='All Layers';lb.style.cssText='background:rgba(245,158,11,0.1);color:var(--warn);border:1px solid rgba(245,158,11,0.2)'}
  qsa('.toggle-btn').forEach(function(b){
    b.classList.toggle('active',b.dataset.layer===layer);
    b.setAttribute('aria-checked',b.dataset.layer===layer?'true':'false');
  });
}

/* ═══════════════════════════════════════════
   THEME
   ═══════════════════════════════════════════ */
function toggleTheme(){
  var html=D.documentElement;
  var current=html.getAttribute('data-theme');
  var next=current==='light'?'dark':'light';
  html.setAttribute('data-theme',next);
  S.theme=next;
  try{localStorage.setItem('consica-theme',next)}catch(e){}
  var btn=qs('#themeBtn');
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

/* ═══════════════════════════════════════════
   CHALLENGE
   ═══════════════════════════════════════════ */
function startChallenge(){
  S.challengeIdx=0;S.score=0;S.challengeDone=false;
  showQuestion();
}
function showQuestion(){
  var cc=qs('#challengeContent');
  if(S.challengeIdx>=CHALLENGES.length||S.challengeDone){
    cc.innerHTML='<div class="challenge-body"><div class="challenge-score">Quiz Complete! You scored '+S.score+'/'+CHALLENGES.length+'</div><button class="challenge-retry" id="challengeRetry">Retry Quiz</button></div>';
    var rb=qs('#challengeRetry');
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
  qsa('.challenge-opt').forEach(function(btn){
    btn.addEventListener('click',function(){
      if(btn.disabled)return;
      var idx=parseInt(btn.dataset.idx);
      var correct=idx===CHALLENGES[S.challengeIdx].ans;
      qsa('.challenge-opt').forEach(function(b){b.disabled=true});
      qsa('.challenge-opt').forEach(function(b,i2){
        b.classList.add(i2===CHALLENGES[S.challengeIdx].ans?'correct':'wrong');
      });
      if(correct)S.score++;
      var fb=qs('#challengeFb');
      fb.innerHTML='<div class="challenge-feedback '+(correct?'correct':'wrong')+'">'+(correct?'✓ Correct! ':'✗ Incorrect. ')+esc(CHALLENGES[S.challengeIdx].exp)+'</div>';
      fb.style.display='block';
      setTimeout(function(){
        S.challengeIdx++;
        showQuestion();
      },2000);
    });
  });
}

/* ═══════════════════════════════════════════
   RESET
   ═══════════════════════════════════════════ */
function resetDiagram(){
  S.sending=false;
  S.packets.forEach(function(p){if(p.el&&p.el.parentNode)p.el.parentNode.remove()});
  S.packets=[];S.sentPackets=0;S.hasCompleted=false;S.selected=null;
  qs('#routeInfo').classList.remove('visible');qs('#routeInfo').innerHTML='';
  qsa('.node.selected,.web-node.selected').forEach(function(el){el.classList.remove('selected')});
  hideCompletion();hideInfo();hideTooltip();
  var btn=qs('#sendBtn');
  btn.disabled=false;btn.innerHTML='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="14" height="14"><path d="M12 2v20M2 12h20"/></svg> Send Packet';
}

/* ═══════════════════════════════════════════
   ANIMATION LOOP
   ═══════════════════════════════════════════ */
function loop(time){
  ts=time||0;
  drawParticles(pCtx,time||0);
  animateTraffic(time||0);
  updatePackets();
  rafId=RA(loop);
}

/* ═══════════════════════════════════════════
   EVENTS
   ═══════════════════════════════════════════ */
function bindEvents(){
  var mc=qs('#mapWrap');
  mc.addEventListener('click',function(e){
    var g=e.target.closest('[data-id]');
    if(g){showInfo(g.dataset.id);return;}
    var nd=e.target.closest('.node,.web-node');
    if(!nd)hideInfo();
  });
  mc.addEventListener('keydown',function(e){
    if(e.key==='Enter'||e.key===' '){
      var g=e.target.closest('[data-id]');
      if(g){e.preventDefault();showInfo(g.dataset.id);}
    }
  });
  qs('#sendBtn').addEventListener('click',sendPacket);
  qs('#panelClose').addEventListener('click',hideInfo);
  D.addEventListener('keydown',function(e){
    if(e.key==='Escape'){hideInfo();hideCompletion()}
  });
  qs('#overlayClose').addEventListener('click',hideCompletion);
  qs('#resetBtn').addEventListener('click',resetDiagram);
  qsa('.toggle-btn').forEach(function(b){
    b.addEventListener('click',function(){setLayer(b.dataset.layer)});
  });
  var slider=qs('#speedSlider');
  slider.addEventListener('input',function(){setSpeed(parseInt(this.value))});
  setSpeed(parseInt(slider.value));
  qs('#themeBtn').addEventListener('click',toggleTheme);
  var panel=qs('#infoPanel');
  var startY=0;
  panel.addEventListener('touchstart',function(e){startY=e.touches[0].clientY},{passive:true});
  panel.addEventListener('touchmove',function(e){
    var dy=e.touches[0].clientY-startY;
    if(dy>100)hideInfo();
  },{passive:true});
  startChallenge();
}

/* ═══════════════════════════════════════════
   SKELETON FADE
   ═══════════════════════════════════════════ */
function hideSkeleton(){
  var skel=qs('#skeleton');
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
  function mdHandler(e){if(e.button!==0)return;if(e.target.closest('.node,.ctrl,.panel,.challenge-opt,.challenge-next,.overlay-btn,.btn-primary,.btn-sm,.btn-theme,.toggle-btn'))return;e.preventDefault();drg=true;sx=e.clientX;sy=e.clientY;spx=panX;spy=panY;zoomG.classList.add('panning')}
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

/* ═══════════════════════════════════════════
   INIT
   ═══════════════════════════════════════════ */
try{
  DOM.map=qs('#mapWrap');
  buildMap();buildCables();buildConnections();buildNodes();buildCities();
  buildWebLinks();buildWebNodes();buildTrafficDots();
  initZoomPan();
  var ml=qs('#mapLabel');if(ml)ml.remove();
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

/* ═══════════════════════════════════════════
   CLEANUP
   ═══════════════════════════════════════════ */
W.addEventListener('beforeunload',function(){if(rafId)CA(rafId)});
})();
