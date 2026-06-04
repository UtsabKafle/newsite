(function(){'use strict';
var components = [
  {id:"fiber",name:"Fiber Optic Connection",category:"Network",icon:"cable",shape:"pill",x:30,y:24,w:110,h:52,purpose:"Provides high-speed, high-bandwidth connectivity using light through glass fibers",description:"Fiber optic cables transmit data as pulses of laser light through strands of glass, offering the fastest and most reliable Internet connections.",why:"Fiber is the gold standard for Internet speed and reliability",analogy:"Like a superhighway compared to a winding country road",funFact:"Fiber optic cables can carry data for over 40 miles without signal degradation",takeaway:"Fiber provides symmetrical upload and download speeds, unlike cable or DSL",mistake:"Fiber isn\\'t available everywhere—it\\'s expensive to deploy and mainly in urban areas",descriptionDetailed:"Fiber uses single-mode or multi-mode glass fibers with laser transceivers. FTTH (Fiber to the Home) delivers gigabit speeds directly. Fiber is immune to electromagnetic interference and has much lower latency than copper."},
  {id:"satellite",name:"Satellite Internet",category:"Network",icon:"satellite",shape:"circle",x:180,y:24,w:110,h:52,purpose:"Provides Internet access from space, reaching remote and rural areas worldwide",description:"Satellite Internet transmits data between ground stations and orbiting satellites, with low-Earth orbit constellations reducing latency significantly.",why:"Satellites bring Internet to places where laying cables is impossible",analogy:"Like a cell tower in space, beaming signals down to Earth",funFact:"Starlink has over 5,000 satellites in low Earth orbit providing global coverage",takeaway:"Satellite Internet is critical for bridging the digital divide in rural areas",mistake:"Older satellite Internet had terrible latency (600ms+)—new LEO satellites reduced it to 20-40ms",descriptionDetailed:"Geostationary satellites orbit at 35,000km with high latency, while LEO satellites at 550km offer near-terrestrial latency. User terminals are phased-array antennas that track satellites as they move."},
  {id:"cellular",name:"Cellular Network",category:"Network",icon:"cell-tower",shape:"hexagon",x:330,y:24,w:110,h:52,purpose:"Provides mobile Internet access through a network of cell towers",description:"Cellular networks divide areas into cells, each served by a tower, handing off connections as users move between coverage areas.",why:"Cellular Internet enables connectivity on the go without wires",analogy:"Like a honeycomb pattern where each cell has its own tower that passes you to the next",funFact:"5G networks can achieve speeds over 10 Gbps in ideal conditions",takeaway:"Cellular networks provide mobile Internet but can be affected by signal strength and congestion",mistake:"More bars don\\'t always mean faster speeds—they just mean a stronger signal to the tower",descriptionDetailed:"Cellular technology evolved from 1G to 5G. Each cell tower connects to a mobile switching center and then to the Internet backbone."},
  {id:"backup",name:"Backup Connection",category:"Network",icon:"router",shape:"rounded-rect",x:105,y:120,w:110,h:52,purpose:"Provides alternative Internet access if the primary connection fails",description:"A backup connection—often cellular or a secondary ISP—automatically takes over if the main connection goes down, ensuring continuous service.",why:"Backup connections prevent downtime when primary infrastructure fails",analogy:"Like a spare tire that gets you back on the road after a flat",funFact:"Many businesses use SD-WAN to automatically switch between multiple connections",takeaway:"Redundant connections are essential for business continuity and critical services",mistake:"A backup connection doesn\\'t need to be as fast as the primary—just functional enough",descriptionDetailed:"Backup connections can be active-active or active-passive. Failover is automatic via protocols like BGP or VRRP. SD-WAN solutions can intelligently route traffic across multiple connections."},
  {id:"mesh",name:"Mesh Network",category:"Network",icon:"network",shape:"rounded-rect",x:255,y:120,w:110,h:52,purpose:"Creates a resilient network where every node relays data for others",description:"In a mesh network, each device connects to multiple others, so data can be rerouted around failed or congested nodes.",why:"Mesh networks have no single point of failure—if one node goes down, others compensate",analogy:"Like a spider web where cutting one strand doesn\\'t collapse the whole structure",funFact:"The Internet itself is designed as a giant mesh network",takeaway:"Mesh networking provides exceptional reliability through path redundancy",mistake:"Mesh networks are not the same as Wi-Fi mesh systems used in homes",descriptionDetailed:"Full mesh networks connect every node to every other node. Routing protocols automatically discover available paths and route around failures."}
];
var connections = [{from:"fiber",to:"satellite"},{from:"satellite",to:"cellular"},{from:"cellular",to:"backup"},{from:"backup",to:"mesh"}];
var steps = [{label:"Step 1: Fiber Optic Connection",status:"Exploring: Fiber Optic Connection - Provides high-speed, high-bandwidth connectivity using light through glass fibers"},{label:"Step 2: Satellite Internet",status:"Exploring: Satellite Internet - Provides Internet access from space, reaching remote and rural areas worldwide"},{label:"Step 3: Cellular Network",status:"Exploring: Cellular Network - Provides mobile Internet access through a network of cell towers"},{label:"Step 4: Backup Connection",status:"Exploring: Backup Connection - Provides alternative Internet access if the primary connection fails"},{label:"Step 5: Mesh Network",status:"Exploring: Mesh Network - Creates a resilient network where every node relays data for others"}];
var tour = [{title:"Fiber Optic Connection",description:"Provides high-speed, high-bandwidth connectivity using light through glass fibers",componentId:"fiber"},{title:"Satellite Internet",description:"Provides Internet access from space, reaching remote and rural areas worldwide",componentId:"satellite"},{title:"Cellular Network",description:"Provides mobile Internet access through a network of cell towers",componentId:"cellular"},{title:"Backup Connection",description:"Provides alternative Internet access if the primary connection fails",componentId:"backup"},{title:"Mesh Network",description:"Creates a resilient network where every node relays data for others",componentId:"mesh"}];

deferInit(function(){
  new DiagramEngine({
    title: 'Route Redundancy',
    subtitle: 'How Internet Works',
    desc: 'See how fiber, satellite, cellular, and backup paths ensure connectivity.',
    components: components,
    connections: connections,
    steps: steps,
    tour: tour,
    packetFlow: [
      {label:'Primary Route',color:'#22c55e'},
      {label:'Satellite',color:'#60a5fa'},
      {label:'Cellular',color:'#c084fc'},
      {label:'Failover',color:'#f59e0b'}
    ],

    render: function(container, engine) {
      engine.buildVisual(container);
      engine._setStatus('Click any component to learn more');
    },

    animate: function(engine) {
      var svg = engine.el.visual.querySelector('svg');
      if (!svg || engine.selectedId || !engine.playing) return;
      var comps = svg.querySelectorAll('.component');
      var idx = Math.floor(engine.t * 0.5) % comps.length;
      comps.forEach(function(el, i) {
        var bg = el.querySelector('.component-bg');
        if (!bg) return;
        var shape = bg.querySelector(':scope > :first-child');
        if(!shape)return;
        shape.setAttribute('fill', i === idx ? '#1e2d50' : '#1a2235');
        shape.setAttribute('stroke', i === idx ? '#0959C8' : '#2a3a55');
      });
    },

    onReplay: function(engine) {
      engine.t = 0;
    }
  });
});
})();