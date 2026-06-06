(function(){'use strict';
var components = [{"id":"sensor","name":"Sensors","category":"Inputs","icon":"wifi","shape":"rounded-rect","x":40,"y":80,"w":110,"h":56,"purpose":"Gather environment details","description":"Sensors detect light, distance, touch, or sound.","why":"Gives the robot information","analogy":"Robot's eyes and ears","funFact":"Infrared sensors use invisible light beams to detect walls","takeaway":"Sensors convert physical parameters into electrical voltages","mistake":"Sensors do not make decisions on their own","descriptionDetailed":"Transducers converting physical properties (light, pressure, temp) into analog/digital signals."},{"id":"brain","name":"Controller","category":"Processing","icon":"chip","shape":"rounded-rect","x":200,"y":80,"w":110,"h":56,"purpose":"Runs code and calculations","description":"The microcontroller running the decision logic code.","why":"Acts as the system brain","analogy":"Human brain","funFact":"Arduino chips execute up to 16 million instructions per second","takeaway":"Controllers route sensor data to motor actions","mistake":"Controllers don't move; they only send signals to motors","descriptionDetailed":"Microcontroller (like ATMega328 or ARM Cortex) that reads inputs, runs logic, and generates outputs."},{"id":"motors","name":"Motors & Gears","category":"Actuators","icon":"power","shape":"rounded-rect","x":360,"y":80,"w":110,"h":56,"purpose":"Drives physical movement","description":"DC motors and servo gears turning wheels or mechanical joints.","why":"Creates the physical action","analogy":"Robot muscles","funFact":"Gearboxes multiply motor torque, allowing small motors to lift heavy weights","takeaway":"Motors convert electrical energy into mechanical movement","mistake":"Motors spin uncontrollably without controller signals","descriptionDetailed":"Electromechanical actuators driven by motor drivers using PWM (Pulse Width Modulation) speed signals."}];
var connections = [{"from":"sensor","to":"brain"},{"from":"brain","to":"motors"}];
var steps = [{"id":"sensor","label":"Step 1: Sense","status":"Sensors measure physical parameters and send voltage signals to brain."},{"id":"brain","label":"Step 2: Think","status":"Controller chip evaluates the program conditions and logic scripts."},{"id":"motors","label":"Step 3: Act","status":"Controller turns on motors, driving the robot chassis forward."}];
var tour = [{"title":"Sensors","description":"How the robot gathers info about the room.","componentId":"sensor"},{"title":"Controller","description":"Processes inputs and decides what to do.","componentId":"brain"},{"title":"Motors & Gears","description":"Creates movement based on controller orders.","componentId":"motors"}];

deferInit(function(){
  new DiagramEngine({
    title: "What Is a Robot?",
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