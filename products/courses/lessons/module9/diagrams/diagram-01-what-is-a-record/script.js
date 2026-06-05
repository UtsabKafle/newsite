(function(){'use strict';
var components = [{"id":"input","name":"Transaction Input","category":"Client","icon":"user","shape":"rounded-rect","x":40,"y":80,"w":110,"h":56,"purpose":"Generates transaction data","description":"Sender, receiver, and asset amount fields.","why":"Specifies the transaction details","analogy":"Filling out a check","funFact":"Millions of digital checkouts occur simultaneously worldwide","takeaway":"Transactions initiate database updates","mistake":"Inputs are not secure until processed","descriptionDetailed":"HTTP transaction request packet containing transaction details."},{"id":"ledger","name":"Ledger Log","category":"Database","icon":"database","shape":"rounded-rect","x":200,"y":80,"w":110,"h":56,"purpose":"Stores records chronologically","description":"The sequential table tracking transaction balances.","why":"Houses the record history","analogy":"Library ledger book","funFact":"Ledgers must use append-only rules to maintain security","takeaway":"Ledgers write new entries at the bottom","mistake":"Traditional ledgers can be altered if database security is breached","descriptionDetailed":"Relational database table storing serialized transaction logs."},{"id":"audit","name":"Audit Trail","category":"Security","icon":"shield","shape":"diamond","x":360,"y":80,"w":110,"h":56,"purpose":"Verifies record integrity","description":"Checks timestamps and logs to detect edits.","why":"Ensures trust in the ledger history","analogy":"Security cameras in a bank","funFact":"Cryptographic logs detect database alterations instantly","takeaway":"Auditing proves records haven't been tampered with","mistake":"Audits only detect changes; they do not prevent them unless backed by blockchain","descriptionDetailed":"Cryptographic logging daemon verifying data hashes."}];
var connections = [{"from":"input","to":"ledger"},{"from":"ledger","to":"audit"}];
var steps = [{"id":"input","label":"Step 1: Write Transaction","status":"User sends transfer details. Client compiles transaction packet."},{"id":"ledger","label":"Step 2: Append Log","status":"Database adds transaction row with index and chronological timestamp."},{"id":"audit","label":"Step 3: Validate Record","status":"Auditing system checks signature logs to confirm entry is valid."}];
var tour = [{"title":"Transaction Input","description":"User enters transfer details.","componentId":"input"},{"title":"Ledger Log","description":"Saves transaction entries in order.","componentId":"ledger"},{"title":"Audit Trail","description":"Detects if past records have been altered.","componentId":"audit"}];

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
    title: "What Is a Record?",
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