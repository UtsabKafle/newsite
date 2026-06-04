(function(){'use strict';
var components = [
  {id:"device",name:"Your Device",category:"End Point",icon:"laptop",shape:"rounded-rect",x:30,y:70,w:110,h:56,purpose:"Sends and receives data across the network",description:"Your phone, laptop, or tablet creates data packets and sends them through the network to reach websites and services.",why:"It\\'s where every Internet journey begins",analogy:"Like your home where you send and receive mail",funFact:"Over 15 billion devices are connected to the Internet worldwide",takeaway:"Every device on a network has a unique IP address",mistake:"Wi-Fi and the Internet are not the same thing",descriptionDetailed:"Your device initiates communication by creating data packets with source and destination IP addresses. The network interface card converts digital data into electrical or radio signals for transmission. Each device is identified by its MAC address at the hardware level and its IP address at the network level."},
  {id:"router",name:"Network Router",category:"Network",icon:"router",shape:"rounded-rect",x:160,y:70,w:110,h:56,purpose:"Directs data packets between networks to reach their destination",description:"Routers examine the destination IP of each packet and forward it along the most efficient path through the network.",why:"Routers make the Internet work by connecting millions of networks together",analogy:"Like a postal sorting office that directs mail to the correct city",funFact:"A core Internet router can process over 100 million packets per second",takeaway:"Routers use routing tables to determine where to send packets",mistake:"A router and a modem are different devices with different jobs",descriptionDetailed:"Routers operate at Layer 3 of the OSI model and use routing protocols like BGP and OSPF to build routing tables. When a packet arrives, the router looks up the destination IP in its forwarding table and determines the best next hop. Routers also perform NAT, firewall functions, and traffic prioritization."},
  {id:"isp",name:"Internet Service Provider",category:"Network",icon:"cloud",shape:"cloud-shape",x:290,y:70,w:110,h:56,purpose:"Provides the connection between your home network and the global Internet",description:"ISPs maintain the infrastructure that carries your data from your home router to anywhere on the Internet.",why:"Without ISPs, you couldn\\'t access anything beyond your local network",analogy:"Like a highway system that connects your town to the rest of the country",funFact:"Some ISPs use fiber optic cables that can carry data at the speed of light",takeaway:"Your ISP is your gateway to everything on the Internet",mistake:"Your ISP can see all the websites you visit unless you use encryption",descriptionDetailed:"ISPs operate at multiple tiers. Tier 1 ISPs form the Internet backbone by interconnecting with each other. Tier 2 ISPs purchase transit from Tier 1 and provide service to Tier 3 ISPs. Your home ISP is typically a Tier 2 or 3 provider that manages last-mile connectivity via fiber, cable, DSL, or satellite."},
  {id:"dns",name:"DNS Server",category:"Network",icon:"globe",shape:"rounded-rect",x:420,y:70,w:110,h:56,purpose:"Translates domain names into IP addresses that computers understand",description:"When you type a website name, DNS servers look up the matching IP address so your browser knows where to connect.",why:"DNS lets us use easy-to-remember names instead of numeric IP addresses",analogy:"Like a phone book that matches names to phone numbers",funFact:"DNS queries can travel to multiple servers around the world in milliseconds",takeaway:"Every time you visit a website, DNS is working behind the scenes",mistake:"DNS doesn\\'t load webpages—it just finds the address of the server",descriptionDetailed:"DNS resolution involves multiple steps: the recursive resolver checks its cache, queries the root server, then the TLD server (.com, .org), and finally the authoritative name server. Each level provides the address of the next server to query. DNSSEC adds cryptographic verification to prevent spoofing attacks."},
  {id:"server",name:"Web Server",category:"Software",icon:"server",shape:"rounded-rect",x:550,y:70,w:110,h:56,purpose:"Stores website files and delivers them to requesting devices",description:"Web servers store all the files that make up a website—HTML, images, videos—and send them when a browser requests them.",why:"Without servers, websites would have no place to live",analogy:"Like a library that stores books and lends them out when you ask",funFact:"A single web server can handle millions of requests per day",takeaway:"Servers are powerful computers designed to run 24/7 without stopping",mistake:"A server isn\\'t magic—it\\'s just a computer configured to share files",descriptionDetailed:"Web servers like Nginx and Apache listen for incoming HTTP/HTTPS requests on ports 80 and 443. When a request arrives, the server maps the URL to a file path, reads the file from disk or cache, and sends it back with appropriate HTTP headers. Modern servers also support load balancing, SSL termination, compression, and reverse proxying."},
  {id:"packet",name:"Data Packet",category:"Data",icon:"packet",shape:"diamond",x:680,y:70,w:110,h:56,purpose:"Carries small chunks of data across the Internet in a structured format",description:"Data is broken into small packets, each containing a piece of the message plus addressing info so it can be reassembled at the destination.",why:"Breaking data into packets makes the Internet faster and more reliable",analogy:"Like sending a long letter as a set of numbered postcards",funFact:"A typical web page request is split into dozens or hundreds of packets",takeaway:"Each packet can travel a different route and still arrive correctly",mistake:"Packets don\\'t always arrive in order—they get reassembled at the destination",descriptionDetailed:"Each packet has a header (source IP, destination IP, sequence number, TTL) and a payload (the data fragment). The maximum transmission unit varies by network type—Ethernet uses 1500 bytes. TCP ensures all packets arrive and are reassembled in the correct order, requesting retransmission for any lost packets."}
];
var connections = [{from:"device",to:"router"},{from:"router",to:"isp"},{from:"isp",to:"dns"},{from:"dns",to:"server"},{from:"server",to:"packet"}];
var steps = [{label:"Step 1: Your Device",status:"Exploring: Your Device - Sends and receives data across the network"},{label:"Step 2: Network Router",status:"Exploring: Network Router - Directs data packets between networks to reach their destination"},{label:"Step 3: Internet Service Provider",status:"Exploring: Internet Service Provider - Provides the connection between your home network and the global Internet"},{label:"Step 4: DNS Server",status:"Exploring: DNS Server - Translates domain names into IP addresses that computers understand"},{label:"Step 5: Web Server",status:"Exploring: Web Server - Stores website files and delivers them to requesting devices"},{label:"Step 6: Data Packet",status:"Exploring: Data Packet - Carries small chunks of data across the Internet in a structured format"}];
var tour = [{title:"Your Device",description:"Sends and receives data across the network",componentId:"device"},{title:"Network Router",description:"Directs data packets between networks to reach their destination",componentId:"router"},{title:"Internet Service Provider",description:"Provides the connection between your home network and the global Internet",componentId:"isp"},{title:"DNS Server",description:"Translates domain names into IP addresses that computers understand",componentId:"dns"},{title:"Web Server",description:"Stores website files and delivers them to requesting devices",componentId:"server"},{title:"Data Packet",description:"Carries small chunks of data across the Internet in a structured format",componentId:"packet"}];

deferInit(function(){
  new DiagramEngine({
    title: 'Internet Highway',
    subtitle: 'How Internet Works',
    desc: 'Follow a data packet\'s journey from your device across routers, ISPs, and DNS servers to its destination.',
    components: components,
    connections: connections,
    steps: steps,
    tour: tour,
    packetFlow: [
      {label:'Data Request',color:'#22c55e'},
      {label:'Forward',color:'#60a5fa'},
      {label:'DNS Query',color:'#c084fc'},
      {label:'IP Response',color:'#f59e0b'},
      {label:'Web Data',color:'#22c55e'}
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
