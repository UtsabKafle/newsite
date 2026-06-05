(function(){'use strict';
var components = [{"id":"node1","name":"Event Block","category":"Events","icon":"cable","shape":"rounded-rect","x":40,"y":80,"w":110,"h":56,"purpose":"Starts script execution","description":"Hat block launching threads on triggers.","why":"Orchestration driver","analogy":"Start signal gun","funFact":"Runs asynchronously when clicked","takeaway":"Launches attached block stack","mistake":"Does not perform actions on its own","descriptionDetailed":"Event listener registration node.","howItWorks":"Hat block launching threads on triggers.","deeperDive":"Event listener registration node.","advancedConcept":"Runs asynchronously when clicked"},{"id":"node2","name":"Control Loop","category":"Control","icon":"settings","shape":"rounded-rect","x":200,"y":80,"w":110,"h":56,"purpose":"Iterates execution steps","description":"Loops like repeat or forever running code blocks.","why":"Enables repeated behaviors","analogy":"Revolving carousel","funFact":"Forever loops run at 30 frames per second yield","takeaway":"Repeats calculations","mistake":"Can cause infinite freezes if conditions aren't met","descriptionDetailed":"Control pipeline evaluation thread.","howItWorks":"Loops like repeat or forever running code blocks.","deeperDive":"Control pipeline evaluation thread.","advancedConcept":"Forever loops run at 30 frames per second yield"},{"id":"node3","name":"Stage Display","category":"Visuals","icon":"monitor","shape":"diamond","x":360,"y":80,"w":110,"h":56,"purpose":"Paints sprite coordinates","description":"Renders graphics based on variables and positions.","why":"Displays game changes","analogy":"Cinema projector screen","funFact":"Updated instantly after each logic loop","takeaway":"Displays final graphics","mistake":"Will show delayed movements if loop logic is bloated","descriptionDetailed":"Graphics update pipeline node.","howItWorks":"Renders graphics based on variables and positions.","deeperDive":"Graphics update pipeline node.","advancedConcept":"Updated instantly after each logic loop"}];
var connections = [{"from":"node1","to":"node2"},{"from":"node2","to":"node3"}];
var steps = [{"id":"node1","label":"Step 1: Event Clicked","status":"Event block captures green flag click, initializing thread execution."},{"id":"node2","label":"Step 2: Loop Cycle","status":"Control loop cycles through motion and variable checks."},{"id":"node3","label":"Step 3: Update Screen","status":"Stage re-renders sprite coordinates, showing character animations."}];
var tour = [{"title":"Event Block","description":"Captures triggers to start scripts.","componentId":"node1"},{"title":"Control Loop","description":"Coordinates repetitive actions.","componentId":"node2"},{"title":"Stage Display","description":"Shows visual animations to users.","componentId":"node3"}];

function initCustomInteractiveChallenge(container, engine) {
      container.innerHTML = '<div class="sim-interactive-area" style="padding: 16px; display:flex; flex-direction:column; gap:12px; width:100%;">' +
        '<div style="font-size:14px; font-weight:700; color:#60a5fa;">Scratch Sprite Navigation</div>' +
        '<p style="font-size:11px; color:#cbd5e1;">Navigate the sprite to the Target Zone (X: 100, Y: -100).</p>' +
        '<div style="display:flex; gap:12px; flex-wrap:wrap; width:100%;">' +
          '<div style="flex:1.2; min-width:160px; display:flex; align-items:center; justify-content:center;">' +
            '<div style="position:relative; width:150px; height:150px; background:#0b0f19; border:2px solid rgba(255,255,255,0.1); border-radius:4px;">' +
              '<div style="position:absolute; left:50%; top:0; bottom:0; width:1px; background:rgba(255,255,255,0.15);"></div>' +
              '<div style="position:absolute; top:50%; left:0; right:0; height:1px; background:rgba(255,255,255,0.15);"></div>' +
              '<div style="position:absolute; right:10px; bottom:10px; width:30px; height:30px; border:2px dashed #10b981; border-radius:4px; background:rgba(16,185,129,0.1); display:flex; align-items:center; justify-content:center;">' +
                '<span style="font-size:8px; color:#10b981; font-weight:bold;">GOAL</span>' +
              '</div>' +
              '<div id="scratch-sprite" style="position:absolute; left:67px; top:67px; width:16px; height:16px; background:#ef4444; border-radius:50%; border:2px solid #fff; transition: all 0.3s; box-shadow:0 0 8px #ef4444;"></div>' +
            '</div>' +
          '</div>' +
          '<div style="flex:1; min-width:120px; display:flex; flex-direction:column; gap:6px;">' +
            '<div style="font-size:11px; color:#cbd5e1;">' +
              'X: <span id="val-x" style="font-weight:bold;">0</span><br>' +
              'Y: <span id="val-y" style="font-weight:bold;">0</span>' +
            '</div>' +
            '<button class="act-btn" id="btn-x-up" style="padding:4px; font-size:10px; cursor:pointer;">X by +50</button>' +
            '<button class="act-btn" id="btn-x-dn" style="padding:4px; font-size:10px; cursor:pointer;">X by -50</button>' +
            '<button class="act-btn" id="btn-y-up" style="padding:4px; font-size:10px; cursor:pointer;">Y by +50</button>' +
            '<button class="act-btn" id="btn-y-dn" style="padding:4px; font-size:10px; cursor:pointer;">Y by -50</button>' +
          '</div>' +
        '</div>' +
        '<div class="glass-panel" style="padding:12px; background:rgba(0,0,0,0.25); min-height:50px; font-size:11px; border-radius:8px; border:1px solid rgba(255,255,255,0.05);">' +
          '<div id="scratch-feedback" style="color:#94a3b8; font-weight:500;">Change sprite coordinates to reach target zone.</div>' +
        '</div>' +
      '</div>';

      var sprite = container.querySelector("#scratch-sprite");
      var valX = container.querySelector("#val-x");
      var valY = container.querySelector("#val-y");
      var fb = container.querySelector("#scratch-feedback");
      var cx = 0;
      var cy = 0;

      function move(dx, dy) {
        cx += dx; cy += dy;
        cx = Math.max(-100, Math.min(100, cx));
        cy = Math.max(-100, Math.min(100, cy));
        valX.textContent = cx;
        valY.textContent = cy;

        var leftPos = 67 + (cx / 100) * 55;
        var topPos = 67 - (cy / 100) * 55;
        sprite.style.left = leftPos + "px";
        sprite.style.top = topPos + "px";

        if (cx === 100 && cy === -100) {
          fb.style.color = "#10b981";
          fb.innerHTML = "<strong>🎉 Success!</strong> Sprite reached target coordinates. Motion loops executed!";
          engine.markCompleted();
        } else {
          fb.style.color = "#cbd5e1";
          fb.textContent = "Navigate to (X: 100, Y: -100).";
        }
      }

      container.querySelector("#btn-x-up").addEventListener("click", function() { move(50, 0); });
      container.querySelector("#btn-x-dn").addEventListener("click", function() { move(-50, 0); });
      container.querySelector("#btn-y-up").addEventListener("click", function() { move(0, 50); });
      container.querySelector("#btn-y-dn").addEventListener("click", function() { move(0, -50); });
    }

deferInit(function(){
  new DiagramEngine({
    title: "Motion Blocks",
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