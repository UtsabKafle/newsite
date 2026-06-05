(function(){'use strict';
var components = [{"id":"node1","name":"Sensor Unit","category":"Inputs","icon":"wifi","shape":"rounded-rect","x":40,"y":80,"w":110,"h":56,"purpose":"Measures environment parameters","description":"Sensors that register touch, light, or distance states.","why":"Source of feedback","analogy":"Nervous touch receptors","funFact":"Runs constantly in millisecond loops","takeaway":"Gathers raw data","mistake":"Does not make decisions","descriptionDetailed":"Feedback node monitoring physical pins."},{"id":"node2","name":"Controller Core","category":"Processing","icon":"chip","shape":"rounded-rect","x":200,"y":80,"w":110,"h":56,"purpose":"Runs algorithm loops","description":"Processes inputs and compares to thresholds.","why":"System logic center","analogy":"Reflex brain stem","funFact":"Runs logic in microseconds","takeaway":"Drives control choices","mistake":"Variables must be scaled correctly","descriptionDetailed":"Core processing controller chip."},{"id":"node3","name":"Actuator Motor","category":"Output","icon":"power","shape":"diamond","x":360,"y":80,"w":110,"h":56,"purpose":"Triggers mechanical movement","description":"Drives wheels, pulleys, or robotic arm joints.","why":"Executes physical results","analogy":"Muscle fibers contracting","funFact":"Draws highest current in the circuit","takeaway":"Performs final actions","mistake":"Can stall if physical obstructions block movement","descriptionDetailed":"Rotational mechanical output actuator."}];
var connections = [{"from":"node1","to":"node2"},{"from":"node2","to":"node3"}];
var steps = [{"id":"node1","label":"Step 1: Sensor Feed","status":"Sensor detects threshold trigger and registers voltage shift."},{"id":"node2","label":"Step 2: Logic Check","status":"Controller core evaluates condition block parameters."},{"id":"node3","label":"Step 3: Move Motor","status":"Actuator receives power pulse, turning wheels to steer chassis."}];
var tour = [{"title":"Sensor Unit","description":"Captures environment feedback.","componentId":"node1"},{"title":"Controller Core","description":"Processes logic conditions.","componentId":"node2"},{"title":"Actuator Motor","description":"Spins wheels to move chassis.","componentId":"node3"}];

function initCustomInteractiveChallenge(container, engine) {
    var type = "flow";
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
    title: "Light Sensors",
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