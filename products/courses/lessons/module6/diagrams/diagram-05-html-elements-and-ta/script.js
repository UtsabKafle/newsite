(function(){'use strict';
var components = [{"id":"node1","name":"Control Node","category":"Interface","icon":"chip","shape":"rounded-rect","x":40,"y":80,"w":110,"h":56,"purpose":"Orchestrates signals","description":"Terminal regulating logic flows.","why":"Gateway for inputs","analogy":"Like a traffic sign directing cars","funFact":"Runs on fast CPU clock cycles","takeaway":"Controls input channels","mistake":"Do not send overlapping inputs","descriptionDetailed":"Control interface parsing inputs.","howItWorks":"Terminal regulating logic flows.","deeperDive":"Control interface parsing inputs.","advancedConcept":"Runs on fast CPU clock cycles"},{"id":"node2","name":"Logic Core","category":"Processing","icon":"settings","shape":"rounded-rect","x":200,"y":80,"w":110,"h":56,"purpose":"Processes data operations","description":"Processes calculations.","why":"Drives calculations","analogy":"Calculator brain","funFact":"Calculates in one microsecond","takeaway":"Main processor node","mistake":"Variables must be initialized","descriptionDetailed":"Core processing block.","howItWorks":"Processes calculations.","deeperDive":"Core processing block.","advancedConcept":"Calculates in one microsecond"},{"id":"node3","name":"Output Display","category":"Output","icon":"monitor","shape":"diamond","x":360,"y":80,"w":110,"h":56,"purpose":"Displays result","description":"Visible pixel layout.","why":"User interface view","analogy":"Scoreboard screen","funFact":"Refreshes at 60 Hz","takeaway":"Visual output block","mistake":"Must repaint on updates","descriptionDetailed":"Visual paint layer.","howItWorks":"Visible pixel layout.","deeperDive":"Visual paint layer.","advancedConcept":"Refreshes at 60 Hz"}];
var connections = [{"from":"node1","to":"node2"},{"from":"node2","to":"node3"}];
var steps = [{"id":"node1","label":"Step 1: Input","status":"User triggers actions. Control node routes inputs."},{"id":"node2","label":"Step 2: Process","status":"Logic core runs calculations and layout mapping."},{"id":"node3","label":"Step 3: Display","status":"Output display paints the results on user viewport."}];
var tour = [{"title":"Control Node","description":"Registers interface triggers.","componentId":"node1"},{"title":"Logic Core","description":"Runs calculations.","componentId":"node2"},{"title":"Output Display","description":"Paints final pixels.","componentId":"node3"}];

deferInit(function(){
  new DiagramEngine({
    title: "HTML Elements and Tags",
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