(function(){'use strict';
var components = [{id:"ui",name:"User Interface",category:"UI",purpose:"The visual layer users interact with — buttons, screens, and controls",description:"The user interface is what you see and interact with on your screen. It includes layout, colors, buttons, text, and all visual elements.",why:"The UI is the bridge between the user and the application's logic",analogy:"Like the dashboard of a car — controls and displays you interact with",funFact:"The first graphical user interface was developed at Xerox PARC in 1973",takeaway:"The UI is the visible part of an app that users directly interact with",mistake:"UI isn't just about looks — it's about usability, accessibility, and clarity",descriptionDetailed:"The UI layer renders visual elements using platform-specific frameworks. On the web this means HTML/CSS rendered in a browser. On mobile it uses native SDKs like SwiftUI or Jetpack Compose. The UI communicates user actions to the logic layer and displays results back to the user."},{id:"logic",name:"Application Logic",category:"Logic",purpose:"The brain of the app — processes user actions, enforces rules, and coordinates data flow",description:"Application logic contains the rules, calculations, and decision-making code that makes the app function. It processes inputs and produces outputs.",why:"Logic is what makes an app smart — it turns user actions into meaningful results",analogy:"Like the engine of a car that processes fuel into motion",funFact:"A typical mobile app contains between 10,000 and 100,000 lines of code",takeaway:"Application logic is the core intelligence that drives app behavior",mistake:"Logic isn't just if-statements — it includes validation, business rules, state management, and error handling",descriptionDetailed:"Application logic is written in programming languages like JavaScript, Python, or Swift. It handles input validation, business rule enforcement, state management, and coordinates between the UI and data layers. Modern apps use patterns like MVC, MVVM, or Redux to organize this logic."},{id:"data",name:"Data Storage",category:"Data",purpose:"Persists and retrieves information needed by the application",description:"Data storage is where apps keep information long-term — user profiles, settings, content, and transaction records.",why:"Data gives apps memory — without it every session would start from scratch",analogy:"Like a filing cabinet where documents are stored and retrieved",funFact:"The average app stores data across at least three different storage systems",takeaway:"Data storage allows apps to remember information across sessions",mistake:"Data storage isn't just databases — it includes files, caches, local storage, and cloud services",descriptionDetailed:"Data can be stored locally on the device using SQLite, file systems, or IndexedDB, or remotely on servers using databases like PostgreSQL or MongoDB. Data is typically organized into structured records with relationships. Encryption and access controls protect sensitive data."},{id:"network",name:"Network Layer",category:"Network",purpose:"Handles communication between the app and external services over the internet",description:"The network layer manages sending and receiving data between the app and remote servers, handling protocols, caching, and error recovery.",why:"Networks connect apps to the wider world — cloud services, APIs, and other users",analogy:"Like the postal service delivering letters between people",funFact:"A single app request may travel through 15-20 different network devices before reaching a server",takeaway:"The network layer enables apps to communicate with servers and services",mistake:"Networking isn't instant — bandwidth, latency, and connection errors all affect app performance",descriptionDetailed:"The network layer uses protocols like HTTP/HTTPS, WebSockets, and TCP/IP. It handles connection establishment, data serialization, encryption (TLS/SSL), and error recovery. Modern apps use techniques like caching, retry logic, and offline-first strategies to handle unreliable networks."},{id:"user",name:"User",category:"User",purpose:"The human who interacts with the application to accomplish tasks",description:"The user is anyone who uses the app — tapping buttons, filling forms, reading content, and triggering actions.",why:"Without users, an app is just code — users give purpose to the application",analogy:"Like the driver of a car who decides where to go",funFact:"The average person uses 30-40 different apps per month",takeaway:"Users are the reason apps exist — all design and development serves the user",mistake:"Users aren't all the same — different users have different needs, expectations, and abilities",descriptionDetailed:"Users interact with apps through touch, voice, mouse, and keyboard. User experience (UX) design focuses on making these interactions intuitive and efficient. Accessibility ensures users with disabilities can also use the app. User feedback drives app improvements and new features."}];
var connections = [{from:"user",to:"ui"},{from:"ui",to:"logic"},{from:"logic",to:"data"},{from:"data",to:"logic"},{from:"logic",to:"ui"},{from:"ui",to:"user"}];
var steps = [{label:"Step 1: User Action",status:"Exploring: User initiates an action by tapping or clicking"}, {label:"Step 2: UI Captures Input",status:"Exploring: User Interface captures the action and sends it to logic"}, {label:"Step 3: Logic Processes",status:"Exploring: Application logic processes the request and applies rules"}, {label:"Step 4: Data Interaction",status:"Exploring: Logic reads or writes data from storage"}, {label:"Step 5: Response to User",status:"Exploring: Results are sent back through the UI to the user"}];
var tour = [{title:"User",description:"The human who interacts with the application to accomplish tasks",componentId:"user"},{title:"User Interface",description:"The visual layer users interact with — buttons, screens, and controls",componentId:"ui"},{title:"Application Logic",description:"The brain of the app — processes user actions, enforces rules, and coordinates data flow",componentId:"logic"},{title:"Data Storage",description:"Persists and retrieves information needed by the application",componentId:"data"},{title:"Network Layer",description:"Handles communication between the app and external services over the internet",componentId:"network"}];

deferInit(function(){
  new DiagramEngine({
    title: 'What Is an App',
    subtitle: 'How Apps Work',
    desc: 'Explore the layers of a modern application — UI, logic, and data.',
    module: 5,
    difficulty: 'Beginner',
    time: '10',
    objectives: 'Explore the layers of a modern application — UI, logic, and data.',
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
