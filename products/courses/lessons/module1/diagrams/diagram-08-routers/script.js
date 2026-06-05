(function(){'use strict';
var components = [
  {id:"source",name:"Source Network",category:"Network",icon:"laptop",shape:"rounded-rect",x:30,y:24,w:110,h:56,purpose:"Originates traffic that needs to be routed to a different network",description:"The source network contains the device initiating communication, with traffic leaving through its default gateway router.",why:"The source is where all routed traffic begins its journey",analogy:"Like a neighborhood where a delivery truck starts its route",funFact:"Traffic between two devices on the same network never needs a router",takeaway:"Routing is only needed when traffic crosses network boundaries",mistake:"The source network router isn\\'t always the same as the default gateway",descriptionDetailed:"The source network is defined by its IP subnet and netmask. Devices on this network communicate directly using ARP for local traffic. For external destinations, the source sends packets to its default gateway, which begins the routing process."},
  {id:"router",name:"Network Router",category:"Network",icon:"router",shape:"hexagon",x:160,y:24,w:110,h:56,purpose:"Makes packet forwarding decisions based on destination IP and routing tables",description:"The router examines each packet\\'s destination IP, consults its routing table for the best path, and forwards the packet to the next hop.",why:"Routers are the decision-makers that direct traffic across networks",analogy:"Like a GPS navigation system that chooses which road to take",funFact:"Routers can update their routing tables dynamically using BGP and OSPF",takeaway:"Routers make forwarding decisions one hop at a time",mistake:"Routers don\\'t use maps of the whole Internet\u2014they just know the next hop",descriptionDetailed:"The router performs a longest prefix match on the destination IP against its routing table. The routing table contains directly connected networks, static routes, and dynamically learned routes."},
  {id:"switch",name:"Network Switch",category:"Network",icon:"switch",shape:"rounded-rect",x:30,y:120,w:110,h:56,purpose:"Forwards frames within the same local network using MAC addresses",description:"The switch learns which MAC addresses are connected to each port and forwards Ethernet frames only to the specific port that needs them.",why:"Switches enable efficient communication between many devices on a LAN",analogy:"Like a smart mail sorter in an office that puts letters in the right person\\'s mailbox",funFact:"Switches operate at Layer 2, while routers operate at Layer 3 of the OSI model",takeaway:"Switches create direct, efficient paths within a network",mistake:"Switches can\\'t route between different networks\u2014that\\'s the router\\'s job",descriptionDetailed:"Switches build a MAC address table by examining source MAC addresses on incoming frames. They forward frames using store-and-forward, cut-through, or fragment-free methods. Managed switches support VLANs and spanning tree protocol."},
  {id:"firewall",name:"Network Firewall",category:"Security",icon:"shield",shape:"rounded-rect",x:160,y:120,w:110,h:56,purpose:"Filters traffic based on security rules to block unauthorized access",description:"The firewall inspects packets entering or leaving the network and allows or blocks them based on rules like IP, port, and protocol.",why:"Firewalls are the first line of defense against network attacks",analogy:"Like a security guard who checks IDs at the building entrance",funFact:"Firewalls have been protecting networks since the late 1980s",takeaway:"Firewalls use rules to permit or deny traffic based on multiple criteria",mistake:"A firewall doesn\\'t stop all threats\u2014only those it\\'s configured to detect",descriptionDetailed:"Firewalls can be stateful (tracking connection state) or stateless (examining each packet independently). Next-generation firewalls add deep packet inspection and intrusion prevention."},
  {id:"destination",name:"Destination Network",category:"Network",icon:"monitor",shape:"rounded-rect",x:290,y:120,w:110,h:56,purpose:"Receives the routed traffic and delivers it to the target device",description:"The destination network\\'s router receives the incoming packet and forwards it to the specific device using the internal network infrastructure.",why:"The destination network is where the data finally arrives and is consumed",analogy:"Like the delivery address where a package is dropped off and opened",funFact:"The destination network\\'s router also serves as a firewall for incoming traffic",takeaway:"Reaching the destination network isn\\'t the end\u2014the packet still needs to reach the specific device",mistake:"Incoming traffic still passes through the destination\\'s firewall and switch before reaching the device",descriptionDetailed:"The destination network\\'s router strips the packet from the WAN interface and forwards it to the internal network. The switch delivers the Ethernet frame to the correct device based on the destination MAC address."}
];
var connections = [{from:"source",to:"router"},{from:"router",to:"switch"},{from:"switch",to:"firewall"},{from:"firewall",to:"destination"}];
var steps = [{label:"Step 1: Source Network",status:"Exploring: Source Network - Originates traffic that needs to be routed to a different network"},{label:"Step 2: Network Router",status:"Exploring: Network Router - Makes packet forwarding decisions based on destination IP and routing tables"},{label:"Step 3: Network Switch",status:"Exploring: Network Switch - Forwards frames within the same local network using MAC addresses"},{label:"Step 4: Network Firewall",status:"Exploring: Network Firewall - Filters traffic based on security rules to block unauthorized access"},{label:"Step 5: Destination Network",status:"Exploring: Destination Network - Receives the routed traffic and delivers it to the target device"}];
var tour = [{title:"Source Network",description:"Originates traffic that needs to be routed to a different network",componentId:"source"},{title:"Network Router",description:"Makes packet forwarding decisions based on destination IP and routing tables",componentId:"router"},{title:"Network Switch",description:"Forwards frames within the same local network using MAC addresses",componentId:"switch"},{title:"Network Firewall",description:"Filters traffic based on security rules to block unauthorized access",componentId:"firewall"},{title:"Destination Network",description:"Receives the routed traffic and delivers it to the target device",componentId:"destination"}];

deferInit(function(){
  new DiagramEngine({
    title: 'Routers',
    subtitle: 'How Internet Works',
    desc: 'See how routers, switches, and firewalls direct traffic across networks.',
    module: 1,
    difficulty: 'Beginner',
    time: '10',
    objectives: 'See how routers, switches, and firewalls manage network traffic.',
    components: components,
    connections: connections,
    steps: steps,
    tour: tour,
    packetFlow: [
      {label:'Data In',color:'#22c55e'},
      {label:'Forward',color:'#60a5fa'},
      {label:'Switch',color:'#c084fc'},
      {label:'Filter',color:'#f59e0b'}
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
