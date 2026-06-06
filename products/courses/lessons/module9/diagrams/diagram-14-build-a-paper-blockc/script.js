(function(){'use strict';
var components = [{"id":"node1","name":"Block Header","category":"Structure","icon":"database","shape":"rounded-rect","x":40,"y":80,"w":110,"h":56,"purpose":"Holds metadata and linkages","description":"Contains block number, nonce, prev-hash, and transaction data.","why":"Identifies the block unit","analogy":"Envelope cover details","funFact":"Includes the timestamp down to the second","takeaway":"Block header is hashed to lock data","mistake":"Editing header variables does not go unnoticed","descriptionDetailed":"Block data payload structure.","howItWorks":"Contains block number, nonce, prev-hash, and transaction data.","deeperDive":"Block data payload structure.","advancedConcept":"Includes the timestamp down to the second"},{"id":"node2","name":"Hash Function","category":"Security","icon":"key","shape":"rounded-rect","x":200,"y":80,"w":110,"h":56,"purpose":"Computes digital fingerprints","description":"Processes data using SHA-256 algorithm.","why":"Locks record data","analogy":"Digital seal wax","funFact":"Always produces a 64-character hex string","takeaway":"Hashes are one-way only","mistake":"You cannot reconstruct original text from the hash string","descriptionDetailed":"SHA-256 algorithm computation node.","howItWorks":"Processes data using SHA-256 algorithm.","deeperDive":"SHA-256 algorithm computation node.","advancedConcept":"Always produces a 64-character hex string"},{"id":"node3","name":"Linked Block","category":"Chain","icon":"monitor","shape":"diamond","x":360,"y":80,"w":110,"h":56,"purpose":"Secures subsequent chain link","description":"The next block containing the hash of the current one.","why":"Creates the tamper-proof link","analogy":"Locked chain links","funFact":"A break in one link invalidates all blocks that follow","takeaway":"Chaining ensures immutability","mistake":"Tampering with data in past blocks breaks all following hashes","descriptionDetailed":"Next sequence block referencing parent node.","howItWorks":"The next block containing the hash of the current one.","deeperDive":"Next sequence block referencing parent node.","advancedConcept":"A break in one link invalidates all blocks that follow"}];
var connections = [{"from":"node1","to":"node2"},{"from":"node2","to":"node3"}];
var steps = [{"id":"node1","label":"Step 1: Pack Block","status":"Transactions are packaged into a block header with the previous block's hash."},{"id":"node2","label":"Step 2: Calculate Hash","status":"SHA-256 function processes the block header, outputting a secure hash."},{"id":"node3","label":"Step 3: Link Chain","status":"The calculated hash is stored in the next block's header, securing the link."}];
var tour = [{"title":"Block Header","description":"Stores transaction data and links.","componentId":"node1"},{"title":"Hash Function","description":"Generates secure digital fingerprints.","componentId":"node2"},{"title":"Linked Block","description":"Binds the blocks into an unbroken chain.","componentId":"node3"}];

deferInit(function(){
  new DiagramEngine({
    title: "Build a Paper Blockchain",
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
      engine.buildAutoChallenge(container);
    },
    
    animate: function(engine) {},
    onReplay: function(engine) {
      engine.t = 0;
    }
  });
});
})();