(function(){'use strict';
var components = [{"id":"node1","name":"Block Header","category":"Structure","icon":"database","shape":"rounded-rect","x":40,"y":80,"w":110,"h":56,"purpose":"Holds metadata and linkages","description":"Contains block number, nonce, prev-hash, and transaction data.","why":"Identifies the block unit","analogy":"Envelope cover details","funFact":"Includes the timestamp down to the second","takeaway":"Block header is hashed to lock data","mistake":"Editing header variables does not go unnoticed","descriptionDetailed":"Block data payload structure.","howItWorks":"Contains block number, nonce, prev-hash, and transaction data.","deeperDive":"Block data payload structure.","advancedConcept":"Includes the timestamp down to the second"},{"id":"node2","name":"Hash Function","category":"Security","icon":"key","shape":"rounded-rect","x":200,"y":80,"w":110,"h":56,"purpose":"Computes digital fingerprints","description":"Processes data using SHA-256 algorithm.","why":"Locks record data","analogy":"Digital seal wax","funFact":"Always produces a 64-character hex string","takeaway":"Hashes are one-way only","mistake":"You cannot reconstruct original text from the hash string","descriptionDetailed":"SHA-256 algorithm computation node.","howItWorks":"Processes data using SHA-256 algorithm.","deeperDive":"SHA-256 algorithm computation node.","advancedConcept":"Always produces a 64-character hex string"},{"id":"node3","name":"Linked Block","category":"Chain","icon":"monitor","shape":"diamond","x":360,"y":80,"w":110,"h":56,"purpose":"Secures subsequent chain link","description":"The next block containing the hash of the current one.","why":"Creates the tamper-proof link","analogy":"Locked chain links","funFact":"A break in one link invalidates all blocks that follow","takeaway":"Chaining ensures immutability","mistake":"Tampering with data in past blocks breaks all following hashes","descriptionDetailed":"Next sequence block referencing parent node.","howItWorks":"The next block containing the hash of the current one.","deeperDive":"Next sequence block referencing parent node.","advancedConcept":"A break in one link invalidates all blocks that follow"}];
var connections = [{"from":"node1","to":"node2"},{"from":"node2","to":"node3"}];
var steps = [{"id":"node1","label":"Step 1: Pack Block","status":"Transactions are packaged into a block header with the previous block's hash."},{"id":"node2","label":"Step 2: Calculate Hash","status":"SHA-256 function processes the block header, outputting a secure hash."},{"id":"node3","label":"Step 3: Link Chain","status":"The calculated hash is stored in the next block's header, securing the link."}];
var tour = [{"title":"Block Header","description":"Stores transaction data and links.","componentId":"node1"},{"title":"Hash Function","description":"Generates secure digital fingerprints.","componentId":"node2"},{"title":"Linked Block","description":"Binds the blocks into an unbroken chain.","componentId":"node3"}];

function initCustomInteractiveChallenge(container, engine) {
      container.innerHTML = '<div class="sim-interactive-area" style="padding: 16px; display:flex; flex-direction:column; gap:12px; width:100%;">' +
        '<div style="font-size:14px; font-weight:700; color:#60a5fa;">Chain Tamper-Proofing Simulator</div>' +
        '<p style="font-size:11px; color:#cbd5e1;">Edit Block 2\'s data to break Block 3. Mine Block 2 and Block 3 to repair links.</p>' +
        '<div style="display:flex; flex-direction:column; gap:8px; width:100%;">' +
          '<div class="b-card" id="b1" style="background:#1e293b; padding:6px; border:1px solid #10b981; border-radius:4px; font-size:10px;">' +
            '<div style="font-weight:bold; color:#10b981;">Block 1</div>' +
            '<div>Data: <span style="font-family:monospace; color:#fff;">Tx: Alice -&gt; Bob $10</span></div>' +
            '<div>Prev: <span style="font-family:monospace; color:#64748b;">000000</span></div>' +
            '<div>Hash: <span style="font-family:monospace; color:#10b981;">00a1b2</span></div>' +
          '</div>' +
          '<div class="b-card" id="b2" style="background:#1e293b; padding:6px; border:1px solid #10b981; border-radius:4px; font-size:10px;">' +
            '<div style="display:flex; justify-content:space-between; align-items:center;">' +
              '<span style="font-weight:bold; color:#10b981;">Block 2</span>' +
              '<button class="act-btn" id="btn-mine-2" style="padding:2px 8px; font-size:9px; cursor:pointer;" disabled>MINE</button>' +
            '</div>' +
            '<div style="display:flex; align-items:center; gap:4px; margin-top:2px;">' +
              '<span>Data:</span>' +
              '<input type="text" id="b2-data" value="Tx: Bob -&gt; Charlie $5" style="background:#0f172a; color:#fff; border:1px solid #475569; border-radius:2px; padding:1px 4px; flex:1; font-size:9px;">' +
            '</div>' +
            '<div>Prev: <span style="font-family:monospace; color:#cbd5e1;">00a1b2</span></div>' +
            '<div>Hash: <span id="b2-hash" style="font-family:monospace; color:#10b981;">00c3d4</span></div>' +
          '</div>' +
          '<div class="b-card" id="b3" style="background:#1e293b; padding:6px; border:1px solid #10b981; border-radius:4px; font-size:10px;">' +
            '<div style="display:flex; justify-content:space-between; align-items:center;">' +
              '<span style="font-weight:bold; color:#10b981;" id="b3-title">Block 3</span>' +
              '<button class="act-btn" id="btn-mine-3" style="padding:2px 8px; font-size:9px; cursor:pointer;" disabled>MINE</button>' +
            '</div>' +
            '<div>Data: <span style="font-family:monospace; color:#fff;">Tx: Charlie -&gt; David $2</span></div>' +
            '<div>Prev: <span id="b3-prev" style="font-family:monospace; color:#10b981;">00c3d4</span></div>' +
            '<div>Hash: <span id="b3-hash" style="font-family:monospace; color:#10b981;">00e5f6</span></div>' +
          '</div>' +
        '</div>' +
        '<div class="glass-panel" style="padding:12px; background:rgba(0,0,0,0.25); min-height:50px; font-size:11px; border-radius:8px; border:1px solid rgba(255,255,255,0.05);">' +
          '<div id="tamper-feedback" style="color:#94a3b8; font-weight:500;">Edit Block 2\'s text to trigger the tamper validation flag.</div>' +
        '</div>' +
      '</div>';

      var b2Data = container.querySelector("#b2-data");
      var b2Hash = container.querySelector("#b2-hash");
      var b3Prev = container.querySelector("#b3-prev");
      var b3Hash = container.querySelector("#b3-hash");
      var btnMine2 = container.querySelector("#btn-mine-2");
      var btnMine3 = container.querySelector("#btn-mine-3");
      var fb = container.querySelector("#tamper-feedback");
      var b2Card = container.querySelector("#b2");
      var b3Card = container.querySelector("#b3");

      function calcSHA256(ascii) {
        var h = 0;
        for (var i = 0; i < ascii.length; i++) h = (h << 5) - h + ascii.charCodeAt(i);
        var hex = Math.abs(h).toString(16);
        return "0000".substring(hex.length) + hex;
      }

      b2Data.addEventListener("input", function() {
        var val = b2Data.value;
        var hash = calcSHA256(val);
        b2Hash.textContent = hash;
        b2Card.style.borderColor = "#ef4444";
        b3Prev.style.color = "#ef4444";
        b3Card.style.borderColor = "#ef4444";
        fb.style.color = "#ef4444";
        fb.innerHTML = "<strong>⚠️ Warning!</strong> Chain link broken! Block 3 expects " + b3Prev.textContent + " but Block 2 is " + hash;
        btnMine2.disabled = false;
      });

      btnMine2.addEventListener("click", function() {
        b2Hash.textContent = "00m2f8";
        b2Card.style.borderColor = "#10b981";
        fb.style.color = "#eab308";
        fb.textContent = "Block 2 mined. Now click MINE on Block 3 to propagate the hash!";
        btnMine2.disabled = true;
        btnMine3.disabled = false;
      });

      btnMine3.addEventListener("click", function() {
        b3Prev.textContent = "00m2f8";
        b3Prev.style.color = "#10b981";
        b3Hash.textContent = "00m3k9";
        b3Card.style.borderColor = "#10b981";
        fb.style.color = "#10b981";
        fb.innerHTML = "<strong>🎉 Success!</strong> Hashing chain repaired and consensus synced. Immutability check complete.";
        btnMine3.disabled = true;
        engine.markCompleted();
      });
    }

deferInit(function(){
  new DiagramEngine({
    title: "Why Blockchain Is Secure",
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