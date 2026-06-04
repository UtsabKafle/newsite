(function(){'use strict';
var components = [
  {id:"client",name:"Client Application",category:"Software",icon:"monitor",shape:"rounded-rect",x:30,y:65,w:110,h:50,purpose:"Sends requests to the server and processes the response for the user",description:"The client?'a browser, mobile app, or desktop application?'formulates a request and waits for the server\\'s response.",why:"Clients are what users directly interact with to access services",analogy:"Like a customer at a restaurant placing an order with the waiter",funFact:"A client doesn\\'t need to know where the server is physically located",takeaway:"The client always initiates the communication in a client-server model",mistake:"The client doesn\\'t store data?'it just requests and displays it",descriptionDetailed:"The client serializes a request into the appropriate protocol format (HTTP, WebSocket, etc.) and sends it over a network socket. It manages connection pooling, timeouts, and retries. Upon receiving the response, the client deserializes the data and updates its user interface."},
  {id:"loadbalancer",name:"Load Balancer",category:"Network",icon:"load-balancer",shape:"diamond",x:160,y:65,w:110,h:50,purpose:"Distributes incoming client requests across multiple backend servers",description:"The load balancer sits between clients and servers, deciding which server should handle each request based on health and load.",why:"Load balancers prevent any single server from being overwhelmed",analogy:"Like a receptionist directing customers to the shortest checkout line",funFact:"Load balancers can detect and route around failed servers automatically",takeaway:"Load balancing enables websites to handle millions of concurrent users",mistake:"The client doesn\\'t directly choose a server?'the load balancer decides",descriptionDetailed:"Load balancers use algorithms like round-robin, least connections, or IP hash to distribute traffic. They perform health checks by pinging servers or checking specific endpoints. Advanced load balancers also terminate SSL/TLS, offloading encryption work from backend servers."},
  {id:"webserver",name:"Web Server",category:"Software",icon:"server",shape:"rounded-rect",x:290,y:65,w:110,h:50,purpose:"Processes HTTP requests and serves web content or forwards to application logic",description:"The web server receives the forwarded request, handles static files directly, or passes dynamic requests to an application server.",why:"Web servers are the frontline of request processing on the server side",analogy:"Like a restaurant kitchen that prepares your order based on the recipe",funFact:"Nginx was created to solve the C10K problem of handling 10,000 concurrent connections",takeaway:"Web servers handle both static content and act as reverse proxies",mistake:"A web server and an application server are different?'the app server runs business logic",descriptionDetailed:"The web server parses the HTTP request, checks URL routing rules, and decides how to handle it. Static files are served directly from disk with appropriate MIME types. Dynamic requests are forwarded to an application server via FastCGI, uWSGI, or a similar protocol."},
  {id:"dbserver",name:"Database Server",category:"Storage",icon:"database",shape:"cylinder",x:420,y:65,w:110,h:50,purpose:"Stores, retrieves, and manages data required by the application",description:"The database server processes queries from the application server, reading or writing data in structured tables or documents.",why:"Databases persist all user data, content, and application state",analogy:"Like a filing cabinet where information is stored and searched",funFact:"MySQL handles over 10 million queries per second at major companies",takeaway:"Most dynamic websites query a database to generate each page",mistake:"Database servers don\\'t store files?'they store structured records",descriptionDetailed:"The database server runs a DBMS like PostgreSQL or MongoDB that manages data storage, indexing, and query execution. It uses caching, connection pooling, and query optimization to handle high throughput. Replication ensures data is copied to multiple servers for redundancy."},
  {id:"cache",name:"Cache Server",category:"Storage",icon:"cache",shape:"cylinder",x:550,y:65,w:110,h:50,purpose:"Temporarily stores frequently accessed data to reduce load on backend servers",description:"The cache server keeps copies of popular data in fast memory so subsequent requests can be served instantly without hitting the database.",why:"Caching dramatically reduces response times and server load",analogy:"Like keeping frequently used tools on your workbench instead of in the garage",funFact:"Memcached was created by a LiveJournal developer to reduce database load",takeaway:"Cached data is temporary and may be outdated if not invalidated properly",mistake:"Caches don\\'t store everything?'they only keep what\\'s requested often enough",descriptionDetailed:"Cache servers like Redis or Memcached store data in RAM for sub-millisecond access. They use LRU or LFU eviction policies to manage memory. Cached data is invalidated when the source data changes, either through TTL expiration or active invalidation."}
];
var connections = [{from:"client",to:"loadbalancer"},{from:"loadbalancer",to:"webserver"},{from:"webserver",to:"dbserver"},{from:"dbserver",to:"cache"}];
var steps = [{label:"Step 1: Client Application",status:"Exploring: Client Application - Sends requests to the server and processes the response for the user"},{label:"Step 2: Load Balancer",status:"Exploring: Load Balancer - Distributes incoming client requests across multiple backend servers"},{label:"Step 3: Web Server",status:"Exploring: Web Server - Processes HTTP requests and serves web content or forwards to application logic"},{label:"Step 4: Database Server",status:"Exploring: Database Server - Stores, retrieves, and manages data required by the application"},{label:"Step 5: Cache Server",status:"Exploring: Cache Server - Temporarily stores frequently accessed data to reduce load on backend servers"}];
var tour = [{title:"Client Application",description:"Sends requests to the server and processes the response for the user",componentId:"client"},{title:"Load Balancer",description:"Distributes incoming client requests across multiple backend servers",componentId:"loadbalancer"},{title:"Web Server",description:"Processes HTTP requests and serves web content or forwards to application logic",componentId:"webserver"},{title:"Database Server",description:"Stores, retrieves, and manages data required by the application",componentId:"dbserver"},{title:"Cache Server",description:"Temporarily stores frequently accessed data to reduce load on backend servers",componentId:"cache"}];

deferInit(function(){
  new DiagramEngine({
    title: 'Client Server',
    subtitle: 'How Internet Works',
    desc: 'Explore how clients communicate with servers through load balancers, databases, and caches.',
    components: components,
    connections: connections,
    steps: steps,
    tour: tour,
    packetFlow: [
      {label:'API Request',color:'#22c55e'},
      {label:'Route',color:'#60a5fa'},
      {label:'DB Query',color:'#c084fc'},
      {label:'Cached Data',color:'#f59e0b'}
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
