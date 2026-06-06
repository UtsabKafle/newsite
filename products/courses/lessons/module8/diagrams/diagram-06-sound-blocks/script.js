(function(){'use strict';
var components = [{"id":"node1","name":"Event Block","category":"Events","icon":"cable","shape":"rounded-rect","x":40,"y":80,"w":110,"h":56,"purpose":"Starts script execution","description":"Hat block launching threads on triggers.","why":"Orchestration driver","analogy":"Start signal gun","funFact":"Runs asynchronously when clicked","takeaway":"Launches attached block stack","mistake":"Does not perform actions on its own","descriptionDetailed":"Event listener registration node.","howItWorks":"Hat block launching threads on triggers.","deeperDive":"Event listener registration node.","advancedConcept":"Runs asynchronously when clicked"},{"id":"node2","name":"Control Loop","category":"Control","icon":"settings","shape":"rounded-rect","x":200,"y":80,"w":110,"h":56,"purpose":"Iterates execution steps","description":"Loops like repeat or forever running code blocks.","why":"Enables repeated behaviors","analogy":"Revolving carousel","funFact":"Forever loops run at 30 frames per second yield","takeaway":"Repeats calculations","mistake":"Can cause infinite freezes if conditions aren't met","descriptionDetailed":"Control pipeline evaluation thread.","howItWorks":"Loops like repeat or forever running code blocks.","deeperDive":"Control pipeline evaluation thread.","advancedConcept":"Forever loops run at 30 frames per second yield"},{"id":"node3","name":"Stage Display","category":"Visuals","icon":"monitor","shape":"diamond","x":360,"y":80,"w":110,"h":56,"purpose":"Paints sprite coordinates","description":"Renders graphics based on variables and positions.","why":"Displays game changes","analogy":"Cinema projector screen","funFact":"Updated instantly after each logic loop","takeaway":"Displays final graphics","mistake":"Will show delayed movements if loop logic is bloated","descriptionDetailed":"Graphics update pipeline node.","howItWorks":"Renders graphics based on variables and positions.","deeperDive":"Graphics update pipeline node.","advancedConcept":"Updated instantly after each logic loop"}];
var connections = [{"from":"node1","to":"node2"},{"from":"node2","to":"node3"}];
var steps = [{"id":"node1","label":"Step 1: Event Clicked","status":"Event block captures green flag click, initializing thread execution."},{"id":"node2","label":"Step 2: Loop Cycle","status":"Control loop cycles through motion and variable checks."},{"id":"node3","label":"Step 3: Update Screen","status":"Stage re-renders sprite coordinates, showing character animations."}];
var tour = [{"title":"Event Block","description":"Captures triggers to start scripts.","componentId":"node1"},{"title":"Control Loop","description":"Coordinates repetitive actions.","componentId":"node2"},{"title":"Stage Display","description":"Shows visual animations to users.","componentId":"node3"}];

deferInit(function(){
  new DiagramEngine({
    title: "Sound Blocks",
    subtitle: "Scratch Programming",
    desc: "Explore the core components and operations.",
    module: 8,
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