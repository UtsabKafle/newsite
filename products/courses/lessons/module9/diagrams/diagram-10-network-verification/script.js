(function(){'use strict';
var components = [{"id":"node1","name":"Block Header","category":"Structure","icon":"database","shape":"rounded-rect","x":40,"y":80,"w":110,"h":56,"purpose":"Holds metadata and linkages","description":"Contains block number, nonce, prev-hash, and transaction data.","why":"Identifies the block unit","analogy":"Envelope cover details","funFact":"Includes the timestamp down to the second","takeaway":"Block header is hashed to lock data","mistake":"Editing header variables does not go unnoticed","descriptionDetailed":"Block data payload structure."},{"id":"node2","name":"Hash Function","category":"Security","icon":"key","shape":"rounded-rect","x":200,"y":80,"w":110,"h":56,"purpose":"Computes digital fingerprints","description":"Processes data using SHA-256 algorithm.","why":"Locks record data","analogy":"Digital seal wax","funFact":"Always produces a 64-character hex string","takeaway":"Hashes are one-way only","mistake":"You cannot reconstruct original text from the hash string","descriptionDetailed":"SHA-256 algorithm computation node."},{"id":"node3","name":"Linked Block","category":"Chain","icon":"monitor","shape":"diamond","x":360,"y":80,"w":110,"h":56,"purpose":"Secures subsequent chain link","description":"The next block containing the hash of the current one.","why":"Creates the tamper-proof link","analogy":"Locked chain links","funFact":"A break in one link invalidates all blocks that follow","takeaway":"Chaining ensures immutability","mistake":"Tampering with data in past blocks breaks all following hashes","descriptionDetailed":"Next sequence block referencing parent node."}];
var connections = [{"from":"node1","to":"node2"},{"from":"node2","to":"node3"}];
var steps = [{"id":"node1","label":"Step 1: Pack Block","status":"Transactions are packaged into a block header with the previous block's hash."},{"id":"node2","label":"Step 2: Calculate Hash","status":"SHA-256 function processes the block header, outputting a secure hash."},{"id":"node3","label":"Step 3: Link Chain","status":"The calculated hash is stored in the next block's header, securing the link."}];
var tour = [{"title":"Block Header","description":"Stores transaction data and links.","componentId":"node1"},{"title":"Hash Function","description":"Generates secure digital fingerprints.","componentId":"node2"},{"title":"Linked Block","description":"Binds the blocks into an unbroken chain.","componentId":"node3"}];

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
    title: "Network Verification",
    subtitle: "Blockchain Technology",
    desc: "Explore the core components and operations.",
    module: 9,
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