(function(){'use strict';
var components = [
  {id:"client",name:"Client Application",category:"Software",icon:"monitor",shape:"rounded-rect",x:30,y:65,w:110,h:50,purpose:"Sends requests to the server and processes the response for the user",description:"The client—a browser, mobile app, or desktop application—formulates a request and waits for the server's response.",why:"Clients are what users directly interact with to access services",analogy:"Like a customer at a restaurant placing an order with the waiter",funFact:"A client doesn't need to know where the server is physically located",takeaway:"The client always initiates the communication in a client-server model",mistake:"The client doesn't store data. It just requests and displays it",descriptionDetailed:"The client serializes a request into the appropriate protocol format (HTTP, WebSocket, etc.) and sends it over a network socket. It manages connection pooling, timeouts, and retries. Upon receiving the response, the client deserializes the data and updates its user interface."},
  {id:"loadbalancer",name:"Load Balancer",category:"Network",icon:"load-balancer",shape:"diamond",x:160,y:65,w:110,h:50,purpose:"Distributes incoming client requests across multiple backend servers",description:"The load balancer sits between clients and servers, deciding which server should handle each request based on health and load.",why:"Load balancers prevent any single server from being overwhelmed",analogy:"Like a receptionist directing customers to the shortest checkout line",funFact:"Load balancers can detect and route around failed servers automatically",takeaway:"Load balancing enables websites to handle millions of concurrent users",mistake:"The client doesn't directly choose a server. The load balancer decides",descriptionDetailed:"Load balancers use algorithms like round-robin, least connections, or IP hash to distribute traffic. They perform health checks by pinging servers or checking specific endpoints. Advanced load balancers also terminate SSL/TLS, offloading encryption work from backend servers."},
  {id:"webserver",name:"Web Server",category:"Software",icon:"server",shape:"rounded-rect",x:290,y:65,w:110,h:50,purpose:"Processes HTTP requests and serves web content or forwards to application logic",description:"The web server receives the forwarded request, handles static files directly, or passes dynamic requests to an application server.",why:"Web servers are the frontline of request processing on the server side",analogy:"Like a restaurant kitchen that prepares your order based on the recipe",funFact:"Nginx was created to solve the C10K problem of handling 10,000 concurrent connections",takeaway:"Web servers handle both static content and act as reverse proxies",mistake:"A web server and an application server are different. The app server runs business logic",descriptionDetailed:"The web server parses the HTTP request, checks URL routing rules, and decides how to handle it. Static files are served directly from disk with appropriate MIME types. Dynamic requests are forwarded to an application server via FastCGI, uWSGI, or a similar protocol."},
  {id:"dbserver",name:"Database Server",category:"Storage",icon:"database",shape:"cylinder",x:420,y:65,w:110,h:50,purpose:"Stores, retrieves, and manages data required by the application",description:"The database server processes queries from the application server, reading or writing data in structured tables or documents.",why:"Databases persist all user data, content, and application state",analogy:"Like a filing cabinet where information is stored and searched",funFact:"MySQL handles over 10 million queries per second at major companies",takeaway:"Most dynamic websites query a database to generate each page",mistake:"Database servers don't store files. They store structured records",descriptionDetailed:"The database server runs a DBMS like PostgreSQL or MongoDB that manages data storage, indexing, and query execution. It uses caching, connection pooling, and query optimization to handle high throughput. Replication ensures data is copied to multiple servers for redundancy."},
  {id:"cache",name:"Cache Server",category:"Storage",icon:"cache",shape:"cylinder",x:550,y:65,w:110,h:50,purpose:"Temporarily stores frequently accessed data to reduce load on backend servers",description:"The cache server keeps copies of popular data in fast memory so subsequent requests can be served instantly without hitting the database.",why:"Caching dramatically reduces response times and server load",analogy:"Like keeping frequently used tools on your workbench instead of in the garage",funFact:"Memcached was created by a LiveJournal developer to reduce database load",takeaway:"Cached data is temporary and may be outdated if not invalidated properly",mistake:"Caches don't store everything. They only keep what's requested often enough",descriptionDetailed:"Cache servers like Redis or Memcached store data in RAM for sub-millisecond access. They use LRU or LFU eviction policies to manage memory. Cached data is invalidated when the source data changes, either through TTL expiration or active invalidation."}
];
var connections = [{from:"client",to:"loadbalancer"},{from:"loadbalancer",to:"webserver"},{from:"webserver",to:"dbserver"},{from:"dbserver",to:"cache"}];
var steps = [{id:"client",label:"Step 1: Client Application",status:"Exploring: Client Application - Sends requests to the server and processes the response for the user"},{id:"loadbalancer",label:"Step 2: Load Balancer",status:"Exploring: Load Balancer - Distributes incoming client requests across multiple backend servers"},{id:"webserver",label:"Step 3: Web Server",status:"Exploring: Web Server - Processes HTTP requests and serves web content or forwards to application logic"},{id:"dbserver",label:"Step 4: Database Server",status:"Exploring: Database Server - Stores, retrieves, and manages data required by the application"},{id:"cache",label:"Step 5: Cache Server",status:"Exploring: Cache Server - Temporarily stores frequently accessed data to reduce load on backend servers"}];
var tour = [{title:"Client Application",description:"Sends requests to the server and processes the response for the user",componentId:"client"},{title:"Load Balancer",description:"Distributes incoming client requests across multiple backend servers",componentId:"loadbalancer"},{title:"Web Server",description:"Processes HTTP requests and serves web content or forwards to application logic",componentId:"webserver"},{title:"Database Server",description:"Stores, retrieves, and manages data required by the application",componentId:"dbserver"},{title:"Cache Server",description:"Temporarily stores frequently accessed data to reduce load on backend servers",componentId:"cache"}];

deferInit(function(){
  new DiagramEngine({
    title: 'Client Server',
    subtitle: 'How Internet Works',
    desc: 'Explore how clients communicate with servers through load balancers, databases, and caches.',
    module: 1,
    difficulty: 'Beginner',
    time: '10',
    objectives: 'Explore how clients and servers communicate over a network.',
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

    customChallenge: function(container, engine) {
      // Client-Server Communication Lab
      container.innerHTML = `
        <div class="sim-interactive-area" style="padding: 16px;">
          <div style="font-size:14px; font-weight:700; color:#60a5fa; margin-bottom:4px;">Client-Server Communication Lab</div>
          <p style="font-size:11px; color:#cbd5e1; margin-bottom:12px;">Trigger HTTP requests and watch data route to Load Balancer, Web Server, Cache, and DB.</p>
          
          <div style="display:flex; gap:12px; margin-bottom:12px; align-items:center; flex-wrap:wrap;">
            <div>
              <label style="font-size:10px; font-weight:bold; color:#64748b; text-transform:uppercase;">HTTP Method</label>
              <select class="sim-input" id="sim-http-method" style="margin-left:4px;">
                <option value="GET">GET</option>
                <option value="POST">POST</option>
              </select>
            </div>
            <div>
              <label style="font-size:10px; font-weight:bold; color:#64748b; text-transform:uppercase;">Endpoint</label>
              <select class="sim-input" id="sim-http-path" style="margin-left:4px;">
                <option value="/profile">/profile (User Profile)</option>
                <option value="/settings">/settings (Account Config)</option>
              </select>
            </div>
            <button class="act-btn" id="sim-request-btn" style="background:#0959C8; border-color:#3b82f6;">📡 Send HTTP Request</button>
          </div>
          
          <div class="sim-canvas" style="display:flex; justify-content:space-around; align-items:center; padding:16px;">
            <div id="sim-node-client" class="glass-panel" style="padding:8px; text-align:center;">
              <span style="font-size:20px;">💻</span>
              <div style="font-size:8px; font-weight:bold;">Client</div>
            </div>
            <div id="sim-node-lb" class="glass-panel" style="padding:8px; text-align:center;">
              <span style="font-size:20px;">⚖️</span>
              <div style="font-size:8px; font-weight:bold;">Load Balancer</div>
            </div>
            <div id="sim-node-server" class="glass-panel" style="padding:8px; text-align:center;">
              <span style="font-size:20px;">🖥️</span>
              <div style="font-size:8px; font-weight:bold;">Web Server</div>
            </div>
            <div id="sim-node-cache" class="glass-panel" style="padding:8px; text-align:center; opacity:0.6;">
              <span style="font-size:20px;">⚡</span>
              <div style="font-size:8px; font-weight:bold;">Redis Cache</div>
            </div>
            <div id="sim-node-db" class="glass-panel" style="padding:8px; text-align:center; opacity:0.6;">
              <span style="font-size:20px;">🗄️</span>
              <div style="font-size:8px; font-weight:bold;">Database</div>
            </div>
          </div>
          
          <div class="glass-panel" style="padding:10px; background:rgba(0,0,0,0.3); border-radius:6px; min-height:80px; font-family:monospace; font-size:11px;">
            <div style="font-weight:bold; color:#60a5fa; margin-bottom:4px;">HTTP Response Console</div>
            <div id="sim-console-output" style="color:#cbd5e1;">Waiting for request...</div>
          </div>
        </div>
      `;

      var btn = container.querySelector('#sim-request-btn');
      var methodSel = container.querySelector('#sim-http-method');
      var pathSel = container.querySelector('#sim-http-path');
      var consoleOutput = container.querySelector('#sim-console-output');

      var mockCache = {};

      btn.addEventListener('click', function() {
        var method = methodSel.value;
        var path = pathSel.value;
        sendRequest(method, path);
      });

      function sendRequest(method, path) {
        btn.disabled = true;
        consoleOutput.innerHTML = "Connecting to server...";
        
        var nodeClient = container.querySelector('#sim-node-client');
        var nodeLb = container.querySelector('#sim-node-lb');
        var nodeServer = container.querySelector('#sim-node-server');
        var nodeCache = container.querySelector('#sim-node-cache');
        var nodeDb = container.querySelector('#sim-node-db');

        // Reset opacity highlights
        [nodeClient, nodeLb, nodeServer, nodeCache, nodeDb].forEach(n => n.style.borderColor = "rgba(255,255,255,0.08)");

        // Client to LB
        setTimeout(() => {
          nodeClient.style.borderColor = "#3b82f6";
          nodeLb.style.borderColor = "#3b82f6";
          consoleOutput.innerHTML = `&gt; ${method} ${path} HTTP/1.1<br>Host: api.consica.edu`;
        }, 300);

        // LB to WebServer
        setTimeout(() => {
          nodeServer.style.borderColor = "#3b82f6";
          consoleOutput.innerHTML += `<br>&gt; Load Balancer forwarding to WebServer-01...`;
        }, 900);

        // Cache Hit/Miss logic
        setTimeout(() => {
          nodeCache.style.opacity = "1";
          nodeCache.style.borderColor = "#3b82f6";
          
          if (method === "GET" && mockCache[path]) {
            // Cache hit
            nodeCache.style.borderColor = "#10b981";
            consoleOutput.innerHTML += `<br>&gt; Redis Cache Hit! Returning data from memory...`;
            setTimeout(() => {
              finishRequest(200, "OK", mockCache[path], true);
            }, 600);
          } else {
            // Cache miss (must hit Database)
            nodeCache.style.borderColor = "#ef4444";
            consoleOutput.innerHTML += `<br>&gt; Cache Miss. Fetching from PostgreSQL Database...`;
            setTimeout(() => {
              nodeDb.style.opacity = "1";
              nodeDb.style.borderColor = "#3b82f6";
              
              setTimeout(() => {
                var responseData = { status: "Active", name: "Consica Learner" };
                if (method === "POST") {
                  responseData.lastUpdated = new Date().toISOString();
                }
                mockCache[path] = responseData; // save in cache
                finishRequest(method === "POST" ? 201 : 200, method === "POST" ? "Created" : "OK", responseData, false);
              }, 600);
            }, 600);
          }
        }, 1500);

        function finishRequest(code, status, data, isCached) {
          nodeClient.style.borderColor = "#10b981";
          consoleOutput.innerHTML += `<br><br><span style="color:#10b981;">HTTP/1.1 ${code} ${status}</span><br>` +
            `<span style="color:#64748b;">X-Cache: ${isCached ? 'HIT' : 'MISS'}</span><br>` +
            `<span style="color:#fff;">${JSON.stringify(data, null, 2)}</span>`;
          btn.disabled = false;
          engine.markCompleted();
        }
      }
    },

    onReplay: function(engine) {
      engine.t = 0;
    }
  });
});
})();
