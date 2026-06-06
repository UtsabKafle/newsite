(function(){'use strict';
var components = [{"id":"request","name":"User Request","category":"Client","icon":"user","shape":"rounded-rect","x":40,"y":80,"w":110,"h":56,"purpose":"Sends user filter parameters","description":"The request sent by the client, e.g. search query or user login.","why":"Defines what dynamic content is needed","analogy":"Like giving a waiter your order","funFact":"Google handles over 99,000 search requests every single second","takeaway":"Dynamic requests include parameters","mistake":"Dynamic requests are not pre-packaged","descriptionDetailed":"HTTP request parameters, headers, and query parameters sent from client.","howItWorks":"The request sent by the client, e.g. search query or user login.","deeperDive":"HTTP request parameters, headers, and query parameters sent from client.","advancedConcept":"Google handles over 99,000 search requests every single second"},{"id":"db","name":"Database","category":"Storage","icon":"database","shape":"rounded-rect","x":200,"y":80,"w":110,"h":56,"purpose":"Stores variables & user data","description":"The structured registry holding accounts, inventory, and pages.","why":"Houses all dynamic information","analogy":"Like files in a cabinet","funFact":"Large database systems are replicated across multiple countries","takeaway":"Databases allow personalization","mistake":"Web browsers do not connect directly to databases for security reasons","descriptionDetailed":"Structured query systems (like PostgreSQL or Redis) containing relational or key-value data.","howItWorks":"The structured registry holding accounts, inventory, and pages.","deeperDive":"Structured query systems (like PostgreSQL or Redis) containing relational or key-value data.","advancedConcept":"Large database systems are replicated across multiple countries"},{"id":"renderer","name":"HTML Generator","category":"Server","icon":"chip","shape":"rounded-rect","x":360,"y":80,"w":110,"h":56,"purpose":"Builds webpage HTML dynamically","description":"Server code that inserts database values into HTML templates.","why":"Assembles the final custom webpage","analogy":"Like a chef putting ingredients together","funFact":"Modern serverless runtimes generate pages in under 10 milliseconds","takeaway":"The server builds the HTML page on demand","mistake":"The browser does not receive raw database tables; it receives formatted HTML","descriptionDetailed":"Backend application server rendering HTML pages using engines like Jinja, React SSR, or PHP.","howItWorks":"Server code that inserts database values into HTML templates.","deeperDive":"Backend application server rendering HTML pages using engines like Jinja, React SSR, or PHP.","advancedConcept":"Modern serverless runtimes generate pages in under 10 milliseconds"}];
var connections = [{"from":"request","to":"db"},{"from":"db","to":"renderer"}];
var steps = [{"id":"request","label":"Step 1: Custom Filter","status":"User logs in or searches. Custom request travels to web server."},{"id":"db","label":"Step 2: Database Query","status":"Server queries the database to pull user-specific variables."},{"id":"renderer","label":"Step 3: Render Page","status":"Server dynamically populates HTML template with retrieved data and returns it."}];
var tour = [{"title":"User Request","description":"Carries parameters describing what custom page is needed.","componentId":"request"},{"title":"Database","description":"Stores and retrieves structured information.","componentId":"db"},{"title":"HTML Generator","description":"Puts the retrieved data into HTML code to send back.","componentId":"renderer"}];

deferInit(function(){
  new DiagramEngine({
    title: "Types of Websites",
    subtitle: "Building Websites",
    desc: "Explore the core components and operations.",
    module: 6,
    difficulty: "Intermediate",
    time: "10",
    objectives: "Explore the core components and operations.",
    components: components,
    connections: connections,
    steps: steps,
    tour: tour,
    
    render: function(container, engine) {
      engine.buildVisual(container);
      engine._setStatus('Click any component to learn more');
    },
    
    customChallenge: function(container, engine) {
      engine.buildAutoChallenge(container);
    },
    
    animate: function(engine) {},
    onReplay: function(engine) {
      engine.t = 0;
    }
  });
});
})();