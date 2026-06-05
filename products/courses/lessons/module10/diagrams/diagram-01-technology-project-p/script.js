(function(){'use strict';
var components = [{"id":"idea","name":"Project Idea","category":"Concept","icon":"user","shape":"rounded-rect","x":40,"y":80,"w":110,"h":56,"purpose":"Defines target goals","description":"The core concept or problem to solve.","why":"Aligns the team target","analogy":"Deciding what to build","funFact":"Many billion-dollar apps started as simple sketches on paper napkins","takeaway":"Clarify your core idea first","mistake":"Do not plan too many features at once","descriptionDetailed":"Project goals definition mapping."},{"id":"wireframe","name":"Wireframe UI","category":"Design","icon":"monitor","shape":"rounded-rect","x":200,"y":80,"w":110,"h":56,"purpose":"Maps layout grids","description":"Visual grid layout sketches.","why":"Defines screen layouts visually","analogy":"House floor plans","funFact":"Figma is the most popular tool used for UI wireframes","takeaway":"Focus on layout boxes, not colors","mistake":"Do not waste time on graphics during wireframing","descriptionDetailed":"Visual user interface box layout planning."},{"id":"spec","name":"Feature Spec","category":"Planning","icon":"settings","shape":"diamond","x":360,"y":80,"w":110,"h":56,"purpose":"Defines code requirements","description":"The list of parameters, databases, and functions needed.","why":"Forms the coding checklist","analogy":"Shopping list of ingredients","funFact":"Specs prevent scope creep (adding features indefinitely)","takeaway":"A clear spec keeps the project on track","mistake":"Vague specifications cause misaligned implementations","descriptionDetailed":"Functional requirements document schema."}];
var connections = [{"from":"idea","to":"wireframe"},{"from":"wireframe","to":"spec"}];
var steps = [{"id":"idea","label":"Step 1: Ideate","status":"Formulate target project goals and identify the user problem to solve."},{"id":"wireframe","label":"Step 2: Sketch UI","status":"Draw simple layouts mapping positions of elements on screen."},{"id":"spec","label":"Step 3: Define Spec","status":"Write out technical parameters and feature checklists for coding."}];
var tour = [{"title":"Project Idea","description":"Defines what to build.","componentId":"idea"},{"title":"Wireframe UI","description":"Maps layout boxes visually.","componentId":"wireframe"},{"title":"Feature Spec","description":"Checks off requirements before coding.","componentId":"spec"}];

function initCustomInteractiveChallenge(container, engine) {
    var type = "builder";
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
      initCustomInteractiveChallenge(container, engine);
    },
    
    animate: function(engine) {},
    onReplay: function(engine) {
      engine.t = 0;
    }
  });
});
})();