(function(){'use strict';
var components = [{"id":"node1","name":"Sensor Unit","category":"Inputs","icon":"wifi","shape":"rounded-rect","x":40,"y":80,"w":110,"h":56,"purpose":"Measures environment parameters","description":"Sensors that register touch, light, or distance states.","why":"Source of feedback","analogy":"Nervous touch receptors","funFact":"Runs constantly in millisecond loops","takeaway":"Gathers raw data","mistake":"Does not make decisions","descriptionDetailed":"Feedback node monitoring physical pins."},{"id":"node2","name":"Controller Core","category":"Processing","icon":"chip","shape":"rounded-rect","x":200,"y":80,"w":110,"h":56,"purpose":"Runs algorithm loops","description":"Processes inputs and compares to thresholds.","why":"System logic center","analogy":"Reflex brain stem","funFact":"Runs logic in microseconds","takeaway":"Drives control choices","mistake":"Variables must be scaled correctly","descriptionDetailed":"Core processing controller chip."},{"id":"node3","name":"Actuator Motor","category":"Output","icon":"power","shape":"diamond","x":360,"y":80,"w":110,"h":56,"purpose":"Triggers mechanical movement","description":"Drives wheels, pulleys, or robotic arm joints.","why":"Executes physical results","analogy":"Muscle fibers contracting","funFact":"Draws highest current in the circuit","takeaway":"Performs final actions","mistake":"Can stall if physical obstructions block movement","descriptionDetailed":"Rotational mechanical output actuator."}];
var connections = [{"from":"node1","to":"node2"},{"from":"node2","to":"node3"}];
var steps = [{"id":"node1","label":"Step 1: Sensor Feed","status":"Sensor detects threshold trigger and registers voltage shift."},{"id":"node2","label":"Step 2: Logic Check","status":"Controller core evaluates condition block parameters."},{"id":"node3","label":"Step 3: Move Motor","status":"Actuator receives power pulse, turning wheels to steer chassis."}];
var tour = [{"title":"Sensor Unit","description":"Captures environment feedback.","componentId":"node1"},{"title":"Controller Core","description":"Processes logic conditions.","componentId":"node2"},{"title":"Actuator Motor","description":"Spins wheels to move chassis.","componentId":"node3"}];

deferInit(function(){
  new DiagramEngine({
    title: "Distance Sensors",
    subtitle: "How Robots Work",
    desc: "Explore the core components and operations.",
    module: 7,
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