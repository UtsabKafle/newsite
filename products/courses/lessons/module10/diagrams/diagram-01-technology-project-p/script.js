(function(){'use strict';
var components = [{"id":"idea","name":"Project Idea","category":"Concept","icon":"user","shape":"rounded-rect","x":40,"y":80,"w":110,"h":56,"purpose":"Defines target goals","description":"The core concept or problem to solve.","why":"Aligns the team target","analogy":"Deciding what to build","funFact":"Many billion-dollar apps started as simple sketches on paper napkins","takeaway":"Clarify your core idea first","mistake":"Do not plan too many features at once","descriptionDetailed":"Project goals definition mapping.","howItWorks":"The core concept or problem to solve.","deeperDive":"Project goals definition mapping.","advancedConcept":"Many billion-dollar apps started as simple sketches on paper napkins"},{"id":"wireframe","name":"Wireframe UI","category":"Design","icon":"monitor","shape":"rounded-rect","x":200,"y":80,"w":110,"h":56,"purpose":"Maps layout grids","description":"Visual grid layout sketches.","why":"Defines screen layouts visually","analogy":"House floor plans","funFact":"Figma is the most popular tool used for UI wireframes","takeaway":"Focus on layout boxes, not colors","mistake":"Do not waste time on graphics during wireframing","descriptionDetailed":"Visual user interface box layout planning.","vocabDefinition":"A simple sketch or outline of a user interface design.","howItWorks":"Visual grid layout sketches.","deeperDive":"Visual user interface box layout planning.","advancedConcept":"Figma is the most popular tool used for UI wireframes"},{"id":"spec","name":"Feature Spec","category":"Planning","icon":"settings","shape":"diamond","x":360,"y":80,"w":110,"h":56,"purpose":"Defines code requirements","description":"The list of parameters, databases, and functions needed.","why":"Forms the coding checklist","analogy":"Shopping list of ingredients","funFact":"Specs prevent scope creep (adding features indefinitely)","takeaway":"A clear spec keeps the project on track","mistake":"Vague specifications cause misaligned implementations","descriptionDetailed":"Functional requirements document schema.","howItWorks":"The list of parameters, databases, and functions needed.","deeperDive":"Functional requirements document schema.","advancedConcept":"Specs prevent scope creep (adding features indefinitely)"}];
var connections = [{"from":"idea","to":"wireframe"},{"from":"wireframe","to":"spec"}];
var steps = [{"id":"idea","label":"Step 1: Ideate","status":"Formulate target project goals and identify the user problem to solve."},{"id":"wireframe","label":"Step 2: Sketch UI","status":"Draw simple layouts mapping positions of elements on screen."},{"id":"spec","label":"Step 3: Define Spec","status":"Write out technical parameters and feature checklists for coding."}];
var tour = [{"title":"Project Idea","description":"Defines what to build.","componentId":"idea"},{"title":"Wireframe UI","description":"Maps layout boxes visually.","componentId":"wireframe"},{"title":"Feature Spec","description":"Checks off requirements before coding.","componentId":"spec"}];

deferInit(function(){
  new DiagramEngine({
    title: "Technology Project Planning",
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