(function(){'use strict';
var components = [{"id":"device","name":"User Device","category":"Client","icon":"laptop","shape":"rounded-rect","x":40,"y":80,"w":110,"h":56,"purpose":"Requests website pages","description":"Your computer or phone running a web browser.","why":"Initiates the webpage request","analogy":"Like a customer ordering food","funFact":"Mobile devices generate over 55% of global website traffic","takeaway":"Browsers are clients in the web ecosystem","mistake":"Browsers do not host websites","descriptionDetailed":"A client device running an HTTP user agent (browser) that initiates TCP connections to port 80/443.","howItWorks":"Your computer or phone running a web browser.","deeperDive":"A client device running an HTTP user agent (browser) that initiates TCP connections to port 80/443.","advancedConcept":"Mobile devices generate over 55% of global website traffic"},{"id":"network","name":"Internet Network","category":"Network","icon":"wifi","shape":"rounded-rect","x":200,"y":80,"w":110,"h":56,"purpose":"Carries requests and files","description":"The global network routing data packets.","why":"Connects client to server","analogy":"Like roads carrying delivery trucks","funFact":"Data travels through fiber optic cables at 200,000 km/s","takeaway":"Network speed affects page load times","mistake":"The network does not generate webpage files","descriptionDetailed":"A packet-switched network operating under TCP/IP guidelines, routing packets across multiple hops.","howItWorks":"The global network routing data packets.","deeperDive":"A packet-switched network operating under TCP/IP guidelines, routing packets across multiple hops.","advancedConcept":"Data travels through fiber optic cables at 200,000 km/s"},{"id":"server","name":"Web Server","category":"Server","icon":"server","shape":"rounded-rect","x":360,"y":80,"w":110,"h":56,"purpose":"Stores website files","description":"A remote computer hosting HTML, CSS, and image assets.","why":"Houses the website content","analogy":"Like a warehouse storing library books","funFact":"Some servers run for years without being restarted once","takeaway":"Webservers respond to client HTTP requests","mistake":"Servers are not magic; they are just computers optimized for reliability","descriptionDetailed":"A server daemon (like Nginx or Apache) that listens for incoming HTTP requests and serves files from disk or database.","howItWorks":"A remote computer hosting HTML, CSS, and image assets.","deeperDive":"A server daemon (like Nginx or Apache) that listens for incoming HTTP requests and serves files from disk or database.","advancedConcept":"Some servers run for years without being restarted once"},{"id":"assets","name":"Web Files","category":"Data","icon":"database","shape":"diamond","x":520,"y":80,"w":110,"h":56,"purpose":"HTML, CSS, JS and media","description":"The code files and media downloaded to represent the page.","why":"Contains the website content","analogy":"Like construction plans and paint","funFact":"The average webpage download size is around 2.2 megabytes","takeaway":"Browsers assemble these files into a visual page","mistake":"Webpages are made of separate files, not just a single image","descriptionDetailed":"Text and binary files (HTML, CSS, JS, JPEG, SVG) that describe the DOM tree, style rules, and scripting behaviors.","howItWorks":"The code files and media downloaded to represent the page.","deeperDive":"Text and binary files (HTML, CSS, JS, JPEG, SVG) that describe the DOM tree, style rules, and scripting behaviors.","advancedConcept":"The average webpage download size is around 2.2 megabytes"}];
var connections = [{"from":"device","to":"network"},{"from":"network","to":"server"},{"from":"server","to":"assets"}];
var steps = [{"id":"device","label":"Step 1: Request Page","status":"User types a URL. Device sends HTTP request across the network."},{"id":"server","label":"Step 2: Server Response","status":"Web server receives request and locates the HTML, CSS, and media files."},{"id":"assets","label":"Step 3: Download Assets","status":"Server sends files back. Browser downloads them to display the page."}];
var tour = [{"title":"User Device","description":"Your browser initiates the connection.","componentId":"device"},{"title":"Web Server","description":"Stores and delivers the page files.","componentId":"server"},{"title":"Web Files","description":"HTML and CSS downloaded to display the content.","componentId":"assets"}];

deferInit(function(){
  new DiagramEngine({
    title: "Introduction to Websites",
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