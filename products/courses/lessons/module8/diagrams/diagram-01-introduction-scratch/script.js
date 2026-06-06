(function(){'use strict';
var components = [{"id":"blocks","name":"Blocks Palette","category":"IDE","icon":"settings","shape":"rounded-rect","x":40,"y":80,"w":110,"h":56,"purpose":"Holds categorized logic blocks","description":"The panel containing Motion, Looks, Sound, and Control blocks.","why":"The library of coding elements","analogy":"Toolbox of Lego parts","funFact":"Blocks are color-coded: blue for motion, purple for looks","takeaway":"Drag blocks from here to code","mistake":"Blocks here cannot run until dragged to script canvas","descriptionDetailed":"Library UI component holding pre-configured block types.","vocabDefinition":"A visual coding block that represents an instruction or code structure.","howItWorks":"The panel containing Motion, Looks, Sound, and Control blocks.","deeperDive":"Library UI component holding pre-configured block types.","advancedConcept":"Blocks are color-coded: blue for motion, purple for looks"},{"id":"canvas","name":"Script Canvas","category":"IDE","icon":"code","shape":"rounded-rect","x":200,"y":80,"w":110,"h":56,"purpose":"Workspace for stacking scripts","description":"The workspace where you snap blocks together to write scripts.","why":"Where active programming happens","analogy":"Lego construction baseplate","funFact":"You can write independent script stacks on the same canvas","takeaway":"Blocks execute from top to bottom in stacks","mistake":"Floating blocks that aren't connected to events won't execute","descriptionDetailed":"The active drag-and-drop workspace container mapping block coordinates.","vocabDefinition":"A stack of snapped-together blocks that defines a sprite's actions.","howItWorks":"The workspace where you snap blocks together to write scripts.","deeperDive":"The active drag-and-drop workspace container mapping block coordinates.","advancedConcept":"You can write independent script stacks on the same canvas"},{"id":"stage","name":"The Stage","category":"IDE","icon":"monitor","shape":"rounded-rect","x":360,"y":80,"w":110,"h":56,"purpose":"Displays visual animations","description":"The rendering viewport displaying coordinates, sprites, and animations.","why":"Allows observing program results","analogy":"Theatrical theater stage","funFact":"The Scratch stage is a grid: 480 pixels wide by 360 pixels high","takeaway":"Visual coordinates guide character movements","mistake":"Sprites can wander off the stage if boundary limits aren't coded","descriptionDetailed":"WebGL canvas rendering sprite transformations and stage backgrounds.","howItWorks":"The rendering viewport displaying coordinates, sprites, and animations.","deeperDive":"WebGL canvas rendering sprite transformations and stage backgrounds.","advancedConcept":"The Scratch stage is a grid: 480 pixels wide by 360 pixels high"}];
var connections = [{"from":"blocks","to":"canvas"},{"from":"canvas","to":"stage"}];
var steps = [{"id":"blocks","label":"Step 1: Pick Blocks","status":"Drag a block from the Blocks Palette on the left."},{"id":"canvas","label":"Step 2: Stack Code","status":"Snap blocks together on the Script Canvas, starting with an Event."},{"id":"stage","label":"Step 3: Run Script","status":"Click Green Flag. Stage displays character movements and bubbles."}];
var tour = [{"title":"Blocks Palette","description":"Your library of coding blocks.","componentId":"blocks"},{"title":"Script Canvas","description":"The grid workspace where you snap code blocks.","componentId":"canvas"},{"title":"The Stage","description":"Visual viewport showing running game loops.","componentId":"stage"}];

deferInit(function(){
  new DiagramEngine({
    title: "Introduction to Scratch",
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