(function(){'use strict';
var components = [{"id":"node1","name":"Control Node","category":"Interface","icon":"chip","shape":"rounded-rect","x":40,"y":80,"w":110,"h":56,"purpose":"Orchestrates signals","description":"Terminal regulating logic flows.","why":"Gateway for inputs","analogy":"Like a traffic sign directing cars","funFact":"Runs on fast CPU clock cycles","takeaway":"Controls input channels","mistake":"Do not send overlapping inputs","descriptionDetailed":"Control interface parsing inputs.","howItWorks":"Terminal regulating logic flows.","deeperDive":"Control interface parsing inputs.","advancedConcept":"Runs on fast CPU clock cycles"},{"id":"node2","name":"Logic Core","category":"Processing","icon":"settings","shape":"rounded-rect","x":200,"y":80,"w":110,"h":56,"purpose":"Processes data operations","description":"Processes calculations.","why":"Drives calculations","analogy":"Calculator brain","funFact":"Calculates in one microsecond","takeaway":"Main processor node","mistake":"Variables must be initialized","descriptionDetailed":"Core processing block.","howItWorks":"Processes calculations.","deeperDive":"Core processing block.","advancedConcept":"Calculates in one microsecond"},{"id":"node3","name":"Output Display","category":"Output","icon":"monitor","shape":"diamond","x":360,"y":80,"w":110,"h":56,"purpose":"Displays result","description":"Visible pixel layout.","why":"User interface view","analogy":"Scoreboard screen","funFact":"Refreshes at 60 Hz","takeaway":"Visual output block","mistake":"Must repaint on updates","descriptionDetailed":"Visual paint layer.","howItWorks":"Visible pixel layout.","deeperDive":"Visual paint layer.","advancedConcept":"Refreshes at 60 Hz"}];
var connections = [{"from":"node1","to":"node2"},{"from":"node2","to":"node3"}];
var steps = [{"id":"node1","label":"Step 1: Input","status":"User triggers actions. Control node routes inputs."},{"id":"node2","label":"Step 2: Process","status":"Logic core runs calculations and layout mapping."},{"id":"node3","label":"Step 3: Display","status":"Output display paints the results on user viewport."}];
var tour = [{"title":"Control Node","description":"Registers interface triggers.","componentId":"node1"},{"title":"Logic Core","description":"Runs calculations.","componentId":"node2"},{"title":"Output Display","description":"Paints final pixels.","componentId":"node3"}];

function initCustomInteractiveChallenge(container, engine) {
      container.innerHTML = '<div class="sim-interactive-area" style="padding: 16px; display:flex; flex-direction:column; gap:12px; width:100%;">' +
        '<div style="font-size:14px; font-weight:700; color:#60a5fa;">CSS Sandbox Playground</div>' +
        '<p style="font-size:11px; color:#cbd5e1;">Style the preview box. Target: Text Color = Blue (#3b82f6), Padding = 20px, Border Radius = 10px.</p>' +
        '<div style="display:flex; gap:12px; flex-wrap:wrap; width:100%;">' +
          '<div style="flex:1; min-width:140px; display:flex; flex-direction:column; gap:8px;">' +
            '<div>' +
              '<span style="font-size:11px; color:#94a3b8;">Text Color:</span>' +
              '<div style="display:flex; gap:6px; margin-top:4px;">' +
                '<button class="color-btn" data-color="#ef4444" style="width:20px; height:20px; background:#ef4444; border:none; border-radius:50%; cursor:pointer;"></button>' +
                '<button class="color-btn" data-color="#10b981" style="width:20px; height:20px; background:#10b981; border:none; border-radius:50%; cursor:pointer;"></button>' +
                '<button class="color-btn" data-color="#3b82f6" style="width:20px; height:20px; background:#3b82f6; border:none; border-radius:50%; cursor:pointer;"></button>' +
              '</div>' +
            '</div>' +
            '<div style="display:flex; flex-direction:column; gap:2px;">' +
              '<div style="display:flex; justify-content:space-between; font-size:11px; color:#94a3b8;">' +
                '<span>Padding:</span>' +
                '<span id="lbl-pad">8px</span>' +
              '</div>' +
              '<input type="range" id="range-pad" min="0" max="40" value="8" style="width:100%; cursor:pointer;">' +
            '</div>' +
            '<div style="display:flex; flex-direction:column; gap:2px;">' +
              '<div style="display:flex; justify-content:space-between; font-size:11px; color:#94a3b8;">' +
                '<span>Border Radius:</span>' +
                '<span id="lbl-rad">2px</span>' +
              '</div>' +
              '<input type="range" id="range-rad" min="0" max="20" value="2" style="width:100%; cursor:pointer;">' +
            '</div>' +
          '</div>' +
          '<div style="flex:1; min-width:160px; display:flex; align-items:center; justify-content:center;">' +
            '<div id="css-preview" style="background:#1e293b; border:1px solid rgba(255,255,255,0.1); padding:8px; border-radius:2px; text-align:center; transition: all 0.2s;">' +
              '<h4 style="margin:0; font-size:14px; font-family:sans-serif; color:#fff;">CSS Preview</h4>' +
              '<p style="margin:4px 0 0 0; font-size:10px; color:#94a3b8;">Dynamic Box Model</p>' +
            '</div>' +
          '</div>' +
        '</div>' +
        '<div class="glass-panel" style="padding:12px; background:rgba(0,0,0,0.25); min-height:50px; font-size:11px; border-radius:8px; border:1px solid rgba(255,255,255,0.05);">' +
          '<div id="css-feedback" style="color:#94a3b8; font-weight:500;">Set color to blue, padding to 20px, and border-radius to 10px.</div>' +
        '</div>' +
      '</div>';

      var preview = container.querySelector("#css-preview");
      var rangePad = container.querySelector("#range-pad");
      var rangeRad = container.querySelector("#range-rad");
      var lblPad = container.querySelector("#lbl-pad");
      var lblRad = container.querySelector("#lbl-rad");
      var fb = container.querySelector("#css-feedback");
      var colorBtns = container.querySelectorAll(".color-btn");
      var selectedColor = "#ffffff";

      colorBtns.forEach(function(btn) {
        btn.addEventListener("click", function() {
          selectedColor = this.dataset.color;
          colorBtns.forEach(function(b) { b.style.outline = "none"; });
          this.style.outline = "2px solid #fff";
          updateCSS();
        });
      });

      rangePad.addEventListener("input", function() {
        lblPad.textContent = this.value + "px";
        updateCSS();
      });

      rangeRad.addEventListener("input", function() {
        lblRad.textContent = this.value + "px";
        updateCSS();
      });

      function updateCSS() {
        var pad = parseInt(rangePad.value);
        var rad = parseInt(rangeRad.value);
        preview.style.padding = pad + "px";
        preview.style.borderRadius = rad + "px";
        preview.querySelector("h4").style.color = selectedColor;

        if (selectedColor === "#3b82f6" && pad === 20 && rad === 10) {
          fb.style.color = "#10b981";
          fb.innerHTML = "<strong>🎉 Success!</strong> CSS styles matched target calibration. Challenge completed.";
          engine.markCompleted();
        } else {
          fb.style.color = "#cbd5e1";
          fb.textContent = "Current: Color=" + selectedColor + ", Padding=" + pad + "px, Radius=" + rad + "px. Keep tweaking!";
        }
      }
    }

deferInit(function(){
  new DiagramEngine({
    title: "Introduction to CSS",
    subtitle: "Building Websites",
    desc: "Explore the core components and operations.",
    module: 6,
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