(function(){'use strict';
var components = [{"id":"node1","name":"Sensor Unit","category":"Inputs","icon":"wifi","shape":"rounded-rect","x":40,"y":80,"w":110,"h":56,"purpose":"Measures environment parameters","description":"Sensors that register touch, light, or distance states.","why":"Source of feedback","analogy":"Nervous touch receptors","funFact":"Runs constantly in millisecond loops","takeaway":"Gathers raw data","mistake":"Does not make decisions","descriptionDetailed":"Feedback node monitoring physical pins."},{"id":"node2","name":"Controller Core","category":"Processing","icon":"chip","shape":"rounded-rect","x":200,"y":80,"w":110,"h":56,"purpose":"Runs algorithm loops","description":"Processes inputs and compares to thresholds.","why":"System logic center","analogy":"Reflex brain stem","funFact":"Runs logic in microseconds","takeaway":"Drives control choices","mistake":"Variables must be scaled correctly","descriptionDetailed":"Core processing controller chip."},{"id":"node3","name":"Actuator Motor","category":"Output","icon":"power","shape":"diamond","x":360,"y":80,"w":110,"h":56,"purpose":"Triggers mechanical movement","description":"Drives wheels, pulleys, or robotic arm joints.","why":"Executes physical results","analogy":"Muscle fibers contracting","funFact":"Draws highest current in the circuit","takeaway":"Performs final actions","mistake":"Can stall if physical obstructions block movement","descriptionDetailed":"Rotational mechanical output actuator."}];
var connections = [{"from":"node1","to":"node2"},{"from":"node2","to":"node3"}];
var steps = [{"id":"node1","label":"Step 1: Sensor Feed","status":"Sensor detects threshold trigger and registers voltage shift."},{"id":"node2","label":"Step 2: Logic Check","status":"Controller core evaluates condition block parameters."},{"id":"node3","label":"Step 3: Move Motor","status":"Actuator receives power pulse, turning wheels to steer chassis."}];
var tour = [{"title":"Sensor Unit","description":"Captures environment feedback.","componentId":"node1"},{"title":"Controller Core","description":"Processes logic conditions.","componentId":"node2"},{"title":"Actuator Motor","description":"Spins wheels to move chassis.","componentId":"node3"}];

function initCustomInteractiveChallenge(container, engine) {
      container.innerHTML = '<div class="sim-interactive-area" style="padding: 16px; display:flex; flex-direction:column; gap:12px; width:100%;">' +
        '<div style="font-size:14px; font-weight:700; color:#60a5fa;">Robot Logic Condition Builder</div>' +
        '<p style="font-size:11px; color:#cbd5e1;">Assemble the avoidance script. Check if obstacle is too close.</p>' +
        '<div class="glass-panel" style="padding:16px; display:flex; flex-direction:column; gap:12px; border-radius:8px; border:1px solid rgba(255,255,255,0.06); background:rgba(255,255,255,0.02); font-family:monospace; font-size:12px;">' +
          '<div style="display:flex; flex-wrap:wrap; align-items:center; gap:6px;">' +
            '<span style="color:#f59e0b; font-weight:bold;">IF</span>' +
            '<select id="sel-cond" style="background:#1e293b; color:#fff; border:1px solid #475569; border-radius:4px; padding:2px 6px;">' +
              '<option value="">-- Select Sensor Condition --</option>' +
              '<option value="dist">Distance &lt; 20cm</option>' +
              '<option value="light">Light &gt; 500 Lux</option>' +
            '</select>' +
          '</div>' +
          '<div style="display:flex; flex-wrap:wrap; align-items:center; gap:6px; margin-left:16px;">' +
            '<span style="color:#3b82f6; font-weight:bold;">THEN</span>' +
            '<select id="sel-then" style="background:#1e293b; color:#fff; border:1px solid #475569; border-radius:4px; padding:2px 6px;">' +
              '<option value="">-- Select Action --</option>' +
              '<option value="drive">Drive Straight</option>' +
              '<option value="reverse">Reverse & Turn</option>' +
            '</select>' +
          '</div>' +
          '<div style="display:flex; flex-wrap:wrap; align-items:center; gap:6px;">' +
            '<span style="color:#f59e0b; font-weight:bold;">ELSE</span>' +
          '</div>' +
          '<div style="display:flex; flex-wrap:wrap; align-items:center; gap:6px; margin-left:16px;">' +
            '<select id="sel-else" style="background:#1e293b; color:#fff; border:1px solid #475569; border-radius:4px; padding:2px 6px;">' +
              '<option value="">-- Select Action --</option>' +
              '<option value="drive">Drive Straight</option>' +
              '<option value="stop">Stop</option>' +
            '</select>' +
          '</div>' +
        '</div>' +
        '<div class="glass-panel" style="padding:12px; background:rgba(0,0,0,0.25); min-height:50px; font-size:11px; border-radius:8px; border:1px solid rgba(255,255,255,0.05);">' +
          '<div id="logic-feedback" style="color:#94a3b8; font-weight:500;">Select the logic operations to program the robot.</div>' +
        '</div>' +
      '</div>';

      var selCond = container.querySelector("#sel-cond");
      var selThen = container.querySelector("#sel-then");
      var selElse = container.querySelector("#sel-else");
      var fb = container.querySelector("#logic-feedback");

      function checkLogic() {
        if (selCond.value === "dist" && selThen.value === "reverse" && selElse.value === "drive") {
          fb.style.color = "#10b981";
          fb.innerHTML = "<strong>🎉 Success!</strong> Robot configured to steer away from obstacles. Challenge completed.";
          engine.markCompleted();
        } else {
          fb.style.color = "#cbd5e1";
          fb.textContent = "IF Distance < 20cm THEN Reverse & Turn ELSE Drive Straight.";
        }
      }

      selCond.addEventListener("change", checkLogic);
      selThen.addEventListener("change", checkLogic);
      selElse.addEventListener("change", checkLogic);
    }

deferInit(function(){
  new DiagramEngine({
    title: "Robot Logic",
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