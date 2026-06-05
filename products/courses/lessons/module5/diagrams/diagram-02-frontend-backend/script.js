(function(){'use strict';
var components = [{id:"client",name:"Client/Browser",category:"Client",purpose:"The user's device that runs the frontend code and renders the interface",description:"The client is the device and software that displays the app to the user — typically a web browser or mobile app runtime.",why:"The client is where users experience and interact with the application",analogy:"Like a television that displays the broadcast for you to watch",funFact:"There are over 4,000 different browser versions in use worldwide",takeaway:"The client runs frontend code and provides the user interface",mistake:"A client isn't just a browser — mobile apps, desktop apps, and IoT devices are all clients",descriptionDetailed:"Clients run frontend code written in HTML, CSS, and JavaScript (for web) or platform-specific languages. They render the UI, handle user input, and communicate with backend servers via HTTP requests. Modern clients can cache data, run service workers, and even work offline."},{id:"frontend",name:"Frontend Code",category:"Frontend",purpose:"The code that runs in the browser to create the user interface and handle user interactions",description:"Frontend code includes everything that runs on the client side — HTML for structure, CSS for styling, and JavaScript for behavior.",why:"Frontend code creates everything the user sees and interacts with directly",analogy:"Like the interior design and controls of a building that occupants directly use",funFact:"Frontend development is the fastest-growing area of software engineering",takeaway:"Frontend code runs on the client and creates the user experience",mistake:"Frontend isn't just visual design — it includes complex state management, routing, and API integration",descriptionDetailed:"Frontend code is organized into components that encapsulate HTML, CSS, and JS. Modern frameworks like React, Vue, and Angular help manage complexity. The browser executes JavaScript in a sandboxed environment, using the DOM API to manipulate page content dynamically."},{id:"network",name:"Network/Internet",category:"Network",purpose:"The communication channel that transmits data between client and server",description:"The network is the infrastructure that carries requests from the frontend to the backend and responses back again.",why:"The network enables the frontend and backend to exchange data and work together",analogy:"Like the roads and highways that connect cities and enable trade",funFact:"Fiber optic cables carry data at 200,000 kilometers per second — about 2/3 the speed of light",takeaway:"The network connects frontend and backend, enabling client-server communication",mistake:"The network isn't 100% reliable — latency, packet loss, and outages are real concerns",descriptionDetailed:"The network consists of routers, switches, fiber optic cables, and wireless infrastructure. Data travels as packets using TCP/IP protocols. HTTPS encrypts data in transit via TLS. CDNs cache content at edge locations to reduce latency. The average web request touches 20+ network devices."},{id:"backend",name:"Backend Server",category:"Backend",purpose:"The server-side code that processes requests, runs business logic, and manages data",description:"The backend is the server-side part of an application that handles HTTP requests, runs business logic, and communicates with databases.",why:"The backend performs heavy processing that can't or shouldn't happen on the client",analogy:"Like a restaurant kitchen where meals are prepared based on orders from the front of house",funFact:"A single backend server can handle millions of requests per day",takeaway:"The backend processes requests and manages data behind the scenes",mistake:"Backend isn't just APIs — it includes authentication, validation, caching, queuing, and background jobs",descriptionDetailed:"Backend servers run application code in languages like Node.js, Python, Java, or Go. They listen for incoming HTTP/HTTPS requests, route them to appropriate handlers, execute business logic, query databases, and return responses. Production setups often use load balancers and multiple server instances."},{id:"database",name:"Database",category:"Data",purpose:"Stores and retrieves structured data persistently for the application",description:"Databases are organized collections of data that the backend can query, insert, update, and delete efficiently.",why:"Databases provide reliable, queryable, and persistent data storage for applications",analogy:"Like a library with a catalog system that helps you find books quickly",funFact:"The first database management system was created in the 1960s by IBM",takeaway:"Databases store application data that the backend reads and writes",mistake:"Databases aren't just for storage — they enforce data integrity, support transactions, and provide search capabilities",descriptionDetailed:"Databases use structured query languages like SQL or flexible document models like NoSQL. They support ACID transactions for reliability, indexes for fast lookups, and replication for availability. Modern databases are distributed across multiple servers for scale."}];
var connections = [{from:"client",to:"frontend"},{from:"frontend",to:"network"},{from:"network",to:"backend"},{from:"backend",to:"database"},{from:"database",to:"backend"},{from:"backend",to:"network"},{from:"network",to:"frontend"},{from:"frontend",to:"client"}];
var steps = [{label:"Step 1: Client Request",status:"Exploring: Client/browser initiates a request to the frontend app"}, {label:"Step 2: Frontend Processing",status:"Exploring: Frontend code processes the user action and prepares a request"}, {label:"Step 3: Network Travel",status:"Exploring: Request travels across the network to the backend server"}, {label:"Step 4: Backend Processing",status:"Exploring: Backend server processes the request and queries the database"}, {label:"Step 5: Response Returns",status:"Exploring: Response travels back through the network to the frontend"}];
var tour = [{title:"Client/Browser",description:"The user's device that runs the frontend code and renders the interface",componentId:"client"},{title:"Frontend Code",description:"The code that runs in the browser to create the user interface and handle user interactions",componentId:"frontend"},{title:"Network/Internet",description:"The communication channel that transmits data between client and server",componentId:"network"},{title:"Backend Server",description:"The server-side code that processes requests, runs business logic, and manages data",componentId:"backend"},{title:"Database",description:"Stores and retrieves structured data persistently for the application",componentId:"database"}];

deferInit(function(){
  new DiagramEngine({
    title: 'Frontend vs Backend',
    subtitle: 'How Apps Work',
    desc: 'Understand the two sides of every application — client and server.',
    module: 5,
    difficulty: 'Beginner',
    time: '10',
    objectives: 'Understand the two sides of every application — client and server.',
    suppressDetail: true,
    components: components,
    connections: connections,
    steps: steps,
    tour: tour,
    
    render: function(container, engine) {
      engine.buildStepFlow(container);
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
        bg.setAttribute('fill', i === idx ? '#1e2d50' : '#1a2235');
        bg.setAttribute('stroke', i === idx ? '#0959C8' : '#2a3a55');
      });
    },
    
    onReplay: function(engine) {
      engine.t = 0;
    }
  });
});
})();
