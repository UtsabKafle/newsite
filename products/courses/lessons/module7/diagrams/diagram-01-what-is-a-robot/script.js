(function(){'use strict';
var components = [{"id":"sensor","name":"Sensors","category":"Inputs","icon":"wifi","shape":"rounded-rect","x":40,"y":80,"w":110,"h":56,"purpose":"Gather environment details","description":"Sensors detect light, distance, touch, or sound.","why":"Gives the robot information","analogy":"Robot's eyes and ears","funFact":"Infrared sensors use invisible light beams to detect walls","takeaway":"Sensors convert physical parameters into electrical voltages","mistake":"Sensors do not make decisions on their own","descriptionDetailed":"Transducers converting physical properties (light, pressure, temp) into analog/digital signals."},{"id":"brain","name":"Controller","category":"Processing","icon":"chip","shape":"rounded-rect","x":200,"y":80,"w":110,"h":56,"purpose":"Runs code and calculations","description":"The microcontroller running the decision logic code.","why":"Acts as the system brain","analogy":"Human brain","funFact":"Arduino chips execute up to 16 million instructions per second","takeaway":"Controllers route sensor data to motor actions","mistake":"Controllers don't move; they only send signals to motors","descriptionDetailed":"Microcontroller (like ATMega328 or ARM Cortex) that reads inputs, runs logic, and generates outputs."},{"id":"motors","name":"Motors & Gears","category":"Actuators","icon":"power","shape":"rounded-rect","x":360,"y":80,"w":110,"h":56,"purpose":"Drives physical movement","description":"DC motors and servo gears turning wheels or mechanical joints.","why":"Creates the physical action","analogy":"Robot muscles","funFact":"Gearboxes multiply motor torque, allowing small motors to lift heavy weights","takeaway":"Motors convert electrical energy into mechanical movement","mistake":"Motors spin uncontrollably without controller signals","descriptionDetailed":"Electromechanical actuators driven by motor drivers using PWM (Pulse Width Modulation) speed signals."}];
var connections = [{"from":"sensor","to":"brain"},{"from":"brain","to":"motors"}];
var steps = [{"id":"sensor","label":"Step 1: Sense","status":"Sensors measure physical parameters and send voltage signals to brain."},{"id":"brain","label":"Step 2: Think","status":"Controller chip evaluates the program conditions and logic scripts."},{"id":"motors","label":"Step 3: Act","status":"Controller turns on motors, driving the robot chassis forward."}];
var tour = [{"title":"Sensors","description":"How the robot gathers info about the room.","componentId":"sensor"},{"title":"Controller","description":"Processes inputs and decides what to do.","componentId":"brain"},{"title":"Motors & Gears","description":"Creates movement based on controller orders.","componentId":"motors"}];

function initCustomInteractiveChallenge(container, engine) {
    var type = "explorer";
    if (type === "builder" || type === "lab" || type === "flow" || type === "tree") {
      container.innerHTML = '<div class="sim-interactive-area" style="padding: 16px; display:flex; flex-direction:column; gap:12px; width:100%;">' +
        '<div style="font-size:14px; font-weight:700; color:#60a5fa;">Interactive Calibration Lab</div>' +
        '<p style="font-size:11px; color:#cbd5e1;">Calibrate values to complete the check. Select inputs to calculate system results.</p>' +
        '<div class="glass-panel" style="padding:12px; display:flex; flex-direction:column; gap:10px; border: 1px solid rgba(255,255,255,0.06); background: rgba(255,255,255,0.02); border-radius: 8px;">' +
          '<div style="display:flex; justify-content:space-between; align-items:center;">' +
            '<span style="font-size:12px; font-weight:bold; color:#cbd5e1;">System Status:</span>' +
            '<button class="act-btn" id="btn-lab-toggle" style="width:100px; justify-content:center; padding: 6px 12px; background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); border-radius: 4px; color:#cbd5e1; cursor:pointer;">OFF</button>' +
          '</div>' +
          '<div style="display:flex; flex-direction:column; gap:4px;">' +
            '<div style="display:flex; justify-content:space-between; font-size:11px; color:#94a3b8;">' +
              '<span>Calibration Meter:</span>' +
              '<span id="lbl-val">50%</span>' +
            '</div>' +
            '<input type="range" id="range-val" min="0" max="100" value="50" style="width:100%; cursor:pointer;">' +
          '</div>' +
        '</div>' +
        '<div class="glass-panel" style="padding:12px; background:rgba(0,0,0,0.25); min-height:60px; font-size:11px; border-radius:8px; border: 1px solid rgba(255,255,255,0.05);">' +
          '<div id="lab-feedback" style="color:#94a3b8; font-weight:500;">Set operational toggle to ON and adjust the meter to 100% to resolve.</div>' +
        '</div>' +
      '</div>';

      var btn = container.querySelector("#btn-lab-toggle");
      var range = container.querySelector("#range-val");
      var lbl = container.querySelector("#lbl-val");
      var fb = container.querySelector("#lab-feedback");
      var isOn = false;

      btn.addEventListener("click", function() {
        isOn = !isOn;
        this.textContent = isOn ? "ON" : "OFF";
        this.style.borderColor = isOn ? "#10b981" : "rgba(255,255,255,0.1)";
        this.style.color = isOn ? "#10b981" : "#cbd5e1";
        checkStatus();
      });

      range.addEventListener("input", function() {
        lbl.textContent = this.value + "%";
        checkStatus();
      });

      function checkStatus() {
        var val = parseInt(range.value);
        if (isOn && val === 100) {
          fb.style.color = "#10b981";
          fb.innerHTML = "<strong>🎉 Success!</strong> System calibrated successfully. Diagram challenge completed.";
          engine.markCompleted();
        } else if (isOn) {
          fb.style.color = "#3b82f6";
          fb.textContent = "Toggle is ON. Now dial the calibration slider to 100% to lock values.";
        } else {
          fb.style.color = "#94a3b8";
          fb.textContent = "Set operational toggle to ON and adjust the meter to 100% to resolve.";
        }
      }
    } else {
      engine.buildFallbackChallenge();
    }
  }

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
      initCustomInteractiveChallenge(container, engine);
    },
    
    animate: function(engine) {},
    onReplay: function(engine) {
      engine.t = 0;
    }
  });
});
})();