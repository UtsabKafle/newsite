(function(){'use strict';
var components = [{"id":"node1","name":"Project Outline","category":"Idea","icon":"browser","shape":"rounded-rect","x":40,"y":80,"w":110,"h":56,"purpose":"Defines project targets","description":"Outline detailing features and requirements.","why":"Foundational guide","analogy":"Shopping checklist","funFact":"Ensures focus on critical goals","takeaway":"Map requirements before coding","mistake":"Skipping features leads to gaps in implementation","descriptionDetailed":"Project specification mapper.","howItWorks":"Outline detailing features and requirements.","deeperDive":"Project specification mapper.","advancedConcept":"Ensures focus on critical goals"},{"id":"node2","name":"Assembly Lab","category":"Logic","icon":"chip","shape":"rounded-rect","x":200,"y":80,"w":110,"h":56,"purpose":"Builds system components","description":"Snap together hardware and software blocks.","why":"Creates the physical/logical system","analogy":"Assembling building blocks","funFact":"Modular parts speed up assembly","takeaway":"Connect modules step-by-step","mistake":"Forcing incompatible slots causes error signals","descriptionDetailed":"Modular assembly loop.","howItWorks":"Snap together hardware and software blocks.","deeperDive":"Modular assembly loop.","advancedConcept":"Modular parts speed up assembly"},{"id":"node3","name":"Debugger","category":"Check","icon":"monitor","shape":"diamond","x":360,"y":80,"w":110,"h":56,"purpose":"Verifies system signals","description":"Locates logical breaks or cable misalignments.","why":"Ensures the system boots correctly","analogy":"Diagnostic engine scanner","funFact":"The word 'bug' was coined when a physical moth was found in a relay in 1947","takeaway":"Trace code to find bugs","mistake":"Ignoring log warnings causes system failures","descriptionDetailed":"System check debug routine.","howItWorks":"Locates logical breaks or cable misalignments.","deeperDive":"System check debug routine.","advancedConcept":"The word 'bug' was coined when a physical moth was found in a relay in 1947"}];
var connections = [{"from":"node1","to":"node2"},{"from":"node2","to":"node3"}];
var steps = [{"id":"node1","label":"Step 1: Check Specs","status":"Read the project guidelines and confirm all required parts are listed."},{"id":"node2","label":"Step 2: Assemble System","status":"Position components and connect signal buses or code functions."},{"id":"node3","label":"Step 3: Run Debugger","status":"Execute system diagnostics and fix any warning flags."}];
var tour = [{"title":"Project Outline","description":"Specifies what is required to build.","componentId":"node1"},{"title":"Assembly Lab","description":"Where physical and logical assembly occurs.","componentId":"node2"},{"title":"Debugger","description":"Checks for and resolves system bugs.","componentId":"node3"}];

deferInit(function(){
  new DiagramEngine({
    title: "Website Design Project",
    subtitle: "Mini Projects",
    desc: "Explore the core components and operations.",
    module: 10,
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