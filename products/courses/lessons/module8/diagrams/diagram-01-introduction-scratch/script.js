(function(){'use strict';
var components = [{"id":"blocks","name":"Blocks Palette","category":"IDE","icon":"settings","shape":"rounded-rect","x":40,"y":80,"w":110,"h":56,"purpose":"Holds categorized logic blocks","description":"The panel containing Motion, Looks, Sound, and Control blocks.","why":"The library of coding elements","analogy":"Toolbox of Lego parts","funFact":"Blocks are color-coded: blue for motion, purple for looks","takeaway":"Drag blocks from here to code","mistake":"Blocks here cannot run until dragged to script canvas","descriptionDetailed":"Library UI component holding pre-configured block types.","vocabDefinition":"A visual coding block that represents an instruction or code structure.","howItWorks":"The panel containing Motion, Looks, Sound, and Control blocks.","deeperDive":"Library UI component holding pre-configured block types.","advancedConcept":"Blocks are color-coded: blue for motion, purple for looks"},{"id":"canvas","name":"Script Canvas","category":"IDE","icon":"code","shape":"rounded-rect","x":200,"y":80,"w":110,"h":56,"purpose":"Workspace for stacking scripts","description":"The workspace where you snap blocks together to write scripts.","why":"Where active programming happens","analogy":"Lego construction baseplate","funFact":"You can write independent script stacks on the same canvas","takeaway":"Blocks execute from top to bottom in stacks","mistake":"Floating blocks that aren't connected to events won't execute","descriptionDetailed":"The active drag-and-drop workspace container mapping block coordinates.","vocabDefinition":"A stack of snapped-together blocks that defines a sprite's actions.","howItWorks":"The workspace where you snap blocks together to write scripts.","deeperDive":"The active drag-and-drop workspace container mapping block coordinates.","advancedConcept":"You can write independent script stacks on the same canvas"},{"id":"stage","name":"The Stage","category":"IDE","icon":"monitor","shape":"rounded-rect","x":360,"y":80,"w":110,"h":56,"purpose":"Displays visual animations","description":"The rendering viewport displaying coordinates, sprites, and animations.","why":"Allows observing program results","analogy":"Theatrical theater stage","funFact":"The Scratch stage is a grid: 480 pixels wide by 360 pixels high","takeaway":"Visual coordinates guide character movements","mistake":"Sprites can wander off the stage if boundary limits aren't coded","descriptionDetailed":"WebGL canvas rendering sprite transformations and stage backgrounds.","howItWorks":"The rendering viewport displaying coordinates, sprites, and animations.","deeperDive":"WebGL canvas rendering sprite transformations and stage backgrounds.","advancedConcept":"The Scratch stage is a grid: 480 pixels wide by 360 pixels high"}];
var connections = [{"from":"blocks","to":"canvas"},{"from":"canvas","to":"stage"}];
var steps = [{"id":"blocks","label":"Step 1: Pick Blocks","status":"Drag a block from the Blocks Palette on the left."},{"id":"canvas","label":"Step 2: Stack Code","status":"Snap blocks together on the Script Canvas, starting with an Event."},{"id":"stage","label":"Step 3: Run Script","status":"Click Green Flag. Stage displays character movements and bubbles."}];
var tour = [{"title":"Blocks Palette","description":"Your library of coding blocks.","componentId":"blocks"},{"title":"Script Canvas","description":"The grid workspace where you snap code blocks.","componentId":"canvas"},{"title":"The Stage","description":"Visual viewport showing running game loops.","componentId":"stage"}];

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
      initCustomInteractiveChallenge(container, engine);
    },
    
    animate: function(engine) {},
    onReplay: function(engine) {
      engine.t = 0;
    }
  });
});
})();