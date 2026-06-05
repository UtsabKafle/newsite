(function(){'use strict';
var components = [{"id":"node1","name":"Event Block","category":"Events","icon":"cable","shape":"rounded-rect","x":40,"y":80,"w":110,"h":56,"purpose":"Starts script execution","description":"Hat block launching threads on triggers.","why":"Orchestration driver","analogy":"Start signal gun","funFact":"Runs asynchronously when clicked","takeaway":"Launches attached block stack","mistake":"Does not perform actions on its own","descriptionDetailed":"Event listener registration node.","howItWorks":"Hat block launching threads on triggers.","deeperDive":"Event listener registration node.","advancedConcept":"Runs asynchronously when clicked"},{"id":"node2","name":"Control Loop","category":"Control","icon":"settings","shape":"rounded-rect","x":200,"y":80,"w":110,"h":56,"purpose":"Iterates execution steps","description":"Loops like repeat or forever running code blocks.","why":"Enables repeated behaviors","analogy":"Revolving carousel","funFact":"Forever loops run at 30 frames per second yield","takeaway":"Repeats calculations","mistake":"Can cause infinite freezes if conditions aren't met","descriptionDetailed":"Control pipeline evaluation thread.","howItWorks":"Loops like repeat or forever running code blocks.","deeperDive":"Control pipeline evaluation thread.","advancedConcept":"Forever loops run at 30 frames per second yield"},{"id":"node3","name":"Stage Display","category":"Visuals","icon":"monitor","shape":"diamond","x":360,"y":80,"w":110,"h":56,"purpose":"Paints sprite coordinates","description":"Renders graphics based on variables and positions.","why":"Displays game changes","analogy":"Cinema projector screen","funFact":"Updated instantly after each logic loop","takeaway":"Displays final graphics","mistake":"Will show delayed movements if loop logic is bloated","descriptionDetailed":"Graphics update pipeline node.","howItWorks":"Renders graphics based on variables and positions.","deeperDive":"Graphics update pipeline node.","advancedConcept":"Updated instantly after each logic loop"}];
var connections = [{"from":"node1","to":"node2"},{"from":"node2","to":"node3"}];
var steps = [{"id":"node1","label":"Step 1: Event Clicked","status":"Event block captures green flag click, initializing thread execution."},{"id":"node2","label":"Step 2: Loop Cycle","status":"Control loop cycles through motion and variable checks."},{"id":"node3","label":"Step 3: Update Screen","status":"Stage re-renders sprite coordinates, showing character animations."}];
var tour = [{"title":"Event Block","description":"Captures triggers to start scripts.","componentId":"node1"},{"title":"Control Loop","description":"Coordinates repetitive actions.","componentId":"node2"},{"title":"Stage Display","description":"Shows visual animations to users.","componentId":"node3"}];

function initCustomInteractiveChallenge(container, engine) {
    var type = "tree";
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
    title: "Conditions",
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
      initCustomInteractiveChallenge(container, engine);
    },
    
    animate: function(engine) {},
    onReplay: function(engine) {
      engine.t = 0;
    }
  });
});
})();