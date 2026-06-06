(function(){'use strict';
var components = [{"id":"html","name":"HTML Code","category":"Code","icon":"code","shape":"rounded-rect","x":40,"y":80,"w":110,"h":56,"purpose":"Provides page structure","description":"The raw HTML document containing tags.","why":"The foundational blueprint","analogy":"Brick structure of a house","funFact":"HTML was created to share scientific research documents","takeaway":"HTML is parsed line-by-line","mistake":"HTML doesn't style the page","descriptionDetailed":"Text streams parsed by the HTML parser tokenizer.","howItWorks":"The raw HTML document containing tags.","deeperDive":"Text streams parsed by the HTML parser tokenizer.","advancedConcept":"HTML was created to share scientific research documents"},{"id":"dom","name":"DOM Tree","category":"DOM","icon":"network","shape":"rounded-rect","x":200,"y":80,"w":110,"h":56,"purpose":"Memory tag model","description":"The browser's memory tree representing HTML tags.","why":"Lets JS manipulate the page","analogy":"Family tree of elements","funFact":"You can change DOM nodes instantly using JavaScript console","takeaway":"DOM maps parent-child tag hierarchies","mistake":"DOM isn't visible on screen directly","descriptionDetailed":"Document Object Model tree nodes instantiated in C++ by the layout engine.","vocabDefinition":"Document Object Model, the tree-like structure of HTML elements in memory.","howItWorks":"The browser's memory tree representing HTML tags.","deeperDive":"Document Object Model tree nodes instantiated in C++ by the layout engine.","advancedConcept":"You can change DOM nodes instantly using JavaScript console"},{"id":"cssom","name":"CSSOM Rules","category":"Style","icon":"settings","shape":"rounded-rect","x":200,"y":180,"w":110,"h":56,"purpose":"Applies CSS rulesets","description":"Memory tree of style rules parsed from CSS.","why":"Applies visuals to DOM","analogy":"Color paint guidelines","funFact":"CSSOM has to calculate selectors matching specificity","takeaway":"Cascading styles cascade down the tree","mistake":"CSSOM is separate from the HTML DOM tree","descriptionDetailed":"CSS Object Model styling definitions mapped to matching CSS selectors.","vocabDefinition":"CSS Object Model, the tree containing style rules for each element.","howItWorks":"Memory tree of style rules parsed from CSS.","deeperDive":"CSS Object Model styling definitions mapped to matching CSS selectors.","advancedConcept":"CSSOM has to calculate selectors matching specificity"},{"id":"rendertree","name":"Render Tree","category":"Render","icon":"monitor","shape":"diamond","x":360,"y":80,"w":110,"h":56,"purpose":"Visible boxes mapping","description":"Combined DOM and CSSOM representing visible nodes.","why":"Filters out invisible elements","analogy":"Blueprint with color paint added","funFact":"Display:none nodes are left out of this tree entirely","takeaway":"Render tree holds visible nodes","mistake":"Visibility:hidden elements are in this tree, but display:none aren't","descriptionDetailed":"Instantiated render tree nodes that represent boxes to lay out and paint.","vocabDefinition":"The combination of DOM and CSSOM containing only the visible elements.","howItWorks":"Combined DOM and CSSOM representing visible nodes.","deeperDive":"Instantiated render tree nodes that represent boxes to lay out and paint.","advancedConcept":"Display:none nodes are left out of this tree entirely"},{"id":"paint","name":"Painting","category":"Output","icon":"printer","shape":"rounded-rect","x":520,"y":80,"w":110,"h":56,"purpose":"Rasterizes pixels on screen","description":"Draws colors, borders, and images onto screen pixels.","why":"Displays the webpage to the user","analogy":"Painting the walls of the built house","funFact":"Graphics processors are used by modern browsers to hardware-accelerate paint","takeaway":"Painting is the final visual step","mistake":"Painting must rerun if content changes or moves","descriptionDetailed":"Graphics context calls converting layout boxes into bitmap buffers displayed on screen.","howItWorks":"Draws colors, borders, and images onto screen pixels.","deeperDive":"Graphics context calls converting layout boxes into bitmap buffers displayed on screen.","advancedConcept":"Graphics processors are used by modern browsers to hardware-accelerate paint"}];
var connections = [{"from":"html","to":"dom"},{"from":"dom","to":"rendertree"},{"from":"cssom","to":"rendertree"},{"from":"rendertree","to":"paint"}];
var steps = [{"id":"html","label":"Step 1: Parse HTML","status":"Browser reads HTML code and builds the DOM tree in memory."},{"id":"cssom","label":"Step 2: Parse CSS","status":"Browser reads stylesheets and applies formatting to style tree."},{"id":"rendertree","label":"Step 3: Render Tree","status":"DOM and CSSOM merge to map out only the visible webpage sections."},{"id":"paint","label":"Step 4: Layout & Paint","status":"Browser calculates box coordinates and draws pixels on screen."}];
var tour = [{"title":"HTML Code","description":"The starting structure instructions.","componentId":"html"},{"title":"DOM Tree","description":"Hierarchy of HTML tags in memory.","componentId":"dom"},{"title":"CSSOM Rules","description":"Applies CSS rules to style tree.","componentId":"cssom"},{"title":"Render Tree","description":"The merged, visible components map.","componentId":"rendertree"},{"title":"Painting","description":"Draws the final pixels onto the screen.","componentId":"paint"}];

deferInit(function(){
  new DiagramEngine({
    title: "How Browsers Display Websites",
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