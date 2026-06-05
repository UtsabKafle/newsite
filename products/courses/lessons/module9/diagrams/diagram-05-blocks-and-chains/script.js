(function(){'use strict';
var components = [{"id":"node1","name":"Block Header","category":"Structure","icon":"database","shape":"rounded-rect","x":40,"y":80,"w":110,"h":56,"purpose":"Holds metadata and linkages","description":"Contains block number, nonce, prev-hash, and transaction data.","why":"Identifies the block unit","analogy":"Envelope cover details","funFact":"Includes the timestamp down to the second","takeaway":"Block header is hashed to lock data","mistake":"Editing header variables does not go unnoticed","descriptionDetailed":"Block data payload structure."},{"id":"node2","name":"Hash Function","category":"Security","icon":"key","shape":"rounded-rect","x":200,"y":80,"w":110,"h":56,"purpose":"Computes digital fingerprints","description":"Processes data using SHA-256 algorithm.","why":"Locks record data","analogy":"Digital seal wax","funFact":"Always produces a 64-character hex string","takeaway":"Hashes are one-way only","mistake":"You cannot reconstruct original text from the hash string","descriptionDetailed":"SHA-256 algorithm computation node."},{"id":"node3","name":"Linked Block","category":"Chain","icon":"monitor","shape":"diamond","x":360,"y":80,"w":110,"h":56,"purpose":"Secures subsequent chain link","description":"The next block containing the hash of the current one.","why":"Creates the tamper-proof link","analogy":"Locked chain links","funFact":"A break in one link invalidates all blocks that follow","takeaway":"Chaining ensures immutability","mistake":"Tampering with data in past blocks breaks all following hashes","descriptionDetailed":"Next sequence block referencing parent node."}];
var connections = [{"from":"node1","to":"node2"},{"from":"node2","to":"node3"}];
var steps = [{"id":"node1","label":"Step 1: Pack Block","status":"Transactions are packaged into a block header with the previous block's hash."},{"id":"node2","label":"Step 2: Calculate Hash","status":"SHA-256 function processes the block header, outputting a secure hash."},{"id":"node3","label":"Step 3: Link Chain","status":"The calculated hash is stored in the next block's header, securing the link."}];
var tour = [{"title":"Block Header","description":"Stores transaction data and links.","componentId":"node1"},{"title":"Hash Function","description":"Generates secure digital fingerprints.","componentId":"node2"},{"title":"Linked Block","description":"Binds the blocks into an unbroken chain.","componentId":"node3"}];

function initCustomInteractiveChallenge(container, engine) {
      container.innerHTML = '<div class="sim-interactive-area" style="padding: 16px; display:flex; flex-direction:column; gap:12px; width:100%;">' +
        '<div style="font-size:14px; font-weight:700; color:#60a5fa;">SHA-256 Block Hashing Lab</div>' +
        '<p style="font-size:11px; color:#cbd5e1;">Mine a block. Find a Nonce that makes the hash start with two zeros "00...".</p>' +
        '<div style="display:flex; flex-direction:column; gap:8px; width:100%;">' +
          '<div style="display:flex; align-items:center; gap:6px; font-size:11px; color:#94a3b8;">' +
            '<span>Block Data:</span>' +
            '<input type="text" id="miner-data" value="Hello" style="background:#1e293b; color:#fff; border:1px solid #475569; border-radius:4px; padding:2px 6px; flex:1; font-size:10px;">' +
          '</div>' +
          '<div style="display:flex; align-items:center; gap:6px; font-size:11px; color:#94a3b8;">' +
            '<span>Nonce:</span>' +
            '<input type="number" id="miner-nonce" value="0" style="background:#1e293b; color:#fff; border:1px solid #475569; border-radius:4px; padding:2px 6px; width:80px; font-size:10px;">' +
            '<button class="act-btn" id="btn-mine" style="padding: 4px 12px; font-weight:bold; cursor:pointer; font-size:10px; margin-left:6px;">MINE</button>' +
          '</div>' +
          '<div class="glass-panel" style="padding:10px; word-break:break-all; font-family:monospace; font-size:10px; border:1px solid rgba(255,255,255,0.06); background:rgba(0,0,0,0.25); border-radius:6px;">' +
            '<div>Hash:</div>' +
            '<div id="lbl-hash" style="color:#eab308; margin-top:2px;">-</div>' +
          '</div>' +
        '</div>' +
        '<div class="glass-panel" style="padding:12px; background:rgba(0,0,0,0.25); min-height:50px; font-size:11px; border-radius:8px; border:1px solid rgba(255,255,255,0.05);">' +
          '<div id="miner-feedback" style="color:#94a3b8; font-weight:500;">Enter a nonce or click MINE to search hashes starting with "00...".</div>' +
        '</div>' +
      '</div>';

      function calcSHA256(ascii) {
        var h = 0;
        for (var i = 0; i < ascii.length; i++) {
          h = (h << 5) - h + ascii.charCodeAt(i);
        }
        var hex = Math.abs(h).toString(16);
        return "00000000".substring(hex.length) + hex;
      }

      var minerData = container.querySelector("#miner-data");
      var minerNonce = container.querySelector("#miner-nonce");
      var lblHash = container.querySelector("#lbl-hash");
      var fb = container.querySelector("#miner-feedback");
      var btnMine = container.querySelector("#btn-mine");

      function updateHash() {
        var data = minerData.value;
        var nonce = minerNonce.value;
        var hash = calcSHA256(data + nonce);
        lblHash.textContent = hash;
        
        if (hash.startsWith("00")) {
          lblHash.style.color = "#10b981";
          fb.style.color = "#10b981";
          fb.innerHTML = "<strong>🎉 Block Mined!</strong> Nonce " + nonce + " solved hash. Challenge completed.";
          engine.markCompleted();
          return true;
        } else {
          lblHash.style.color = "#eab308";
          fb.style.color = "#cbd5e1";
          fb.textContent = 'Hash does not start with "00". Change nonce or click MINE.';
          return false;
        }
      }

      btnMine.addEventListener("click", function() {
        var n = 0;
        btnMine.disabled = true;
        btnMine.textContent = "MINING...";
        
        function mineStep() {
          minerNonce.value = n;
          var solved = updateHash();
          if (!solved && n < 1000) {
            n++;
            setTimeout(mineStep, 10);
          } else {
            btnMine.disabled = false;
            btnMine.textContent = "MINE";
          }
        }
        mineStep();
      });

      minerData.addEventListener("input", updateHash);
      minerNonce.addEventListener("input", updateHash);
      updateHash();
    }

deferInit(function(){
  new DiagramEngine({
    title: "Blocks and Chains",
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