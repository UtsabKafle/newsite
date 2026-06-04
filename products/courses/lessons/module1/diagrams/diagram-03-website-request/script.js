(function(){'use strict';
var components = [
  {id:"browser",name:"Web Browser",category:"Software",icon:"browser",shape:"circle",x:50,y:30,w:120,h:56,purpose:"Initiates and displays web content by sending requests and rendering responses",description:"The browser takes a URL you type, sends a request to fetch the page, then renders the HTML, CSS, and JavaScript into a visual display.",why:"The browser is your window into the World Wide Web",analogy:"Like a TV that tunes into channels and shows you the content",funFact:"The first web browser, WorldWideWeb, was also a page editor",takeaway:"Browsers translate code into the visual web pages you see",mistake:"The browser doesn\\'t fetch pages directly—it asks servers for them",descriptionDetailed:"The browser first performs a DNS lookup on the URL\\'s domain, then opens a TCP connection to the server. It sends an HTTP GET request and receives the response containing HTML, CSS, JavaScript, and media files. The browser\\'s rendering engine parses HTML into a DOM tree, applies CSS styles, executes JavaScript, and paints the final page."},
  {id:"dns",name:"DNS Server",category:"Network",icon:"globe",shape:"rounded-rect",x:210,y:30,w:120,h:56,purpose:"Translates the domain name in the URL into the server\\'s IP address",description:"When you type example.com, DNS servers find the matching IP address so your browser knows where to send the request.",why:"DNS allows us to use memorable names instead of numeric IPs",analogy:"Like looking up a friend\\'s address in your contacts list",funFact:"There are only 13 logical root DNS servers in the world",takeaway:"DNS is the first step in every web request after you press Enter",mistake:"DNS isn\\'t instant—it queries multiple servers in a hierarchy",descriptionDetailed:"The recursive resolver first checks its local cache, then queries the root server, then the TLD server (.com, .org), and finally the authoritative name server. Each level provides the address of the next server to query. The final answer is cached locally for faster future lookups."},
  {id:"server",name:"Web Server",category:"Software",icon:"server",shape:"cylinder",x:50,y:125,w:120,h:56,purpose:"Receives the browser\\'s request and responds with the requested webpage files",description:"The web server receives the HTTP request, locates the requested file, and sends it back to the browser with a status code.",why:"Servers do the heavy lifting of storing and delivering all web content",analogy:"Like a restaurant kitchen that prepares your meal after you order",funFact:"Apache web server has been running since 1995 and still powers 25% of websites",takeaway:"Every website you visit is stored on one or more servers somewhere in the world",mistake:"The server doesn\\'t send the whole website at once—it sends files one by one",descriptionDetailed:"The server parses the HTTP request method (GET, POST, etc.), headers, and URL path. It maps the path to a file in its document root, applies access controls, and returns the file with an HTTP status code (200 OK, 404 Not Found, etc.) and appropriate MIME type headers. Dynamic content may trigger server-side scripts."},
  {id:"isp",name:"Internet Service Provider",category:"Network",icon:"cloud",shape:"cloud-shape",x:210,y:125,w:120,h:56,purpose:"Carries your request from your router to the destination server across the Internet",description:"Your ISP routes your request through multiple network hops until it reaches the server hosting the website.",why:"ISPs build and maintain the physical infrastructure that connects everyone",analogy:"Like the postal service that carries your letter across the country",funFact:"Data can travel from New York to Sydney in under 200 milliseconds",takeaway:"Your request may pass through 10-20 different networks before reaching the server",mistake:"Your data doesn\\'t travel in a straight line—it hops between many routers",descriptionDetailed:"When data leaves your home, it traverses the ISP\\'s regional network, then connects to larger backbone networks at Internet Exchange Points. Tier 1 ISPs interconnect without payment, while lower tiers pay for transit. The path your data takes is determined by BGP routing protocols that consider path length, policies, and network health."},
  {id:"packet",name:"Data Packet",category:"Data",icon:"packet",shape:"diamond",x:50,y:220,w:120,h:56,purpose:"Transports the request and response data in small, manageable chunks",description:"Your web request is broken into packets that travel independently and are reassembled at the destination.",why:"Packet switching makes the Internet efficient and resilient to failures",analogy:"Like sending a puzzle in separate pieces that arrive and get put back together",funFact:"Each packet can take a completely different route to reach the same destination",takeaway:"The Internet is designed to handle lost packets by requesting retransmission",mistake:"Packets can arrive out of order—TCP puts them back in sequence",descriptionDetailed:"Each IP packet contains a header (20-60 bytes) and payload (up to 65535 bytes, but typically 1500 bytes for Ethernet). The header includes source/destination IP, TTL, protocol type, and checksum. TCP adds sequence numbers so the receiver can reorder packets and request retransmission of missing ones."},
  {id:"website",name:"Website Content",category:"Content",icon:"globe",shape:"rounded-rect",x:210,y:220,w:120,h:56,purpose:"The collection of files and data that make up the webpage being requested",description:"HTML structures the page, CSS styles it, JavaScript adds interactivity, and media files enrich the experience.",why:"Understanding how web content is assembled helps you build better websites",analogy:"Like a house built from blueprints (HTML), paint (CSS), and appliances (JavaScript)",funFact:"The average webpage is over 2 MB and makes 70+ separate requests",takeaway:"A modern website is a combination of many different file types working together",mistake:"The HTML file is just the starting point—browsers then fetch CSS, JS, images, and fonts"}
];
var connections = [{from:"browser",to:"dns"},{from:"dns",to:"server"},{from:"server",to:"isp"},{from:"isp",to:"packet"},{from:"packet",to:"website"}];
var steps = [{label:"Step 1: Web Browser",status:"Exploring: Web Browser - Initiates and displays web content by sending requests and rendering responses"},{label:"Step 2: DNS Server",status:"Exploring: DNS Server - Translates the domain name in the URL into the server\\'s IP address"},{label:"Step 3: Web Server",status:"Exploring: Web Server - Receives the browser\\'s request and responds with the requested webpage files"},{label:"Step 4: Internet Service Provider",status:"Exploring: Internet Service Provider - Carries your request from your router to the destination server across the Internet"},{label:"Step 5: Data Packet",status:"Exploring: Data Packet - Transports the request and response data in small, manageable chunks"},{label:"Step 6: Website Content",status:"Exploring: Website Content - The collection of files and data that make up the webpage being requested"}];
var tour = [{title:"Web Browser",description:"Initiates and displays web content by sending requests and rendering responses",componentId:"browser"},{title:"DNS Server",description:"Translates the domain name in the URL into the server\\'s IP address",componentId:"dns"},{title:"Web Server",description:"Receives the browser\\'s request and responds with the requested webpage files",componentId:"server"},{title:"Internet Service Provider",description:"Carries your request from your router to the destination server across the Internet",componentId:"isp"},{title:"Data Packet",description:"Transports the request and response data in small, manageable chunks",componentId:"packet"},{title:"Website Content",description:"The collection of files and data that make up the webpage being requested",componentId:"website"}];

deferInit(function(){
  new DiagramEngine({
    title: 'Website Request',
    subtitle: 'How Internet Works',
    desc: 'Trace what happens when you type a URL — from browser to DNS, server, and back.',
    components: components,
    connections: connections,
    steps: steps,
    tour: tour,
    packetFlow: [
      {label:'DNS Query',color:'#22c55e'},
      {label:'IP Found',color:'#60a5fa'},
      {label:'HTTP 200',color:'#c084fc'},
      {label:'Data Stream',color:'#f59e0b'},
      {label:'Render',color:'#22c55e'}
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
