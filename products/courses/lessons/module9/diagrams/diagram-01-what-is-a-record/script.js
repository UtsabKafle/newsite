(function(){'use strict';
var components = [{"id":"input","name":"Transaction Input","category":"Client","icon":"user","shape":"rounded-rect","x":40,"y":80,"w":110,"h":56,"purpose":"Generates transaction data","description":"Sender, receiver, and asset amount fields.","why":"Specifies the transaction details","analogy":"Filling out a check","funFact":"Millions of digital checkouts occur simultaneously worldwide","takeaway":"Transactions initiate database updates","mistake":"Inputs are not secure until processed","descriptionDetailed":"HTTP transaction request packet containing transaction details.","howItWorks":"Sender, receiver, and asset amount fields.","deeperDive":"HTTP transaction request packet containing transaction details.","advancedConcept":"Millions of digital checkouts occur simultaneously worldwide"},{"id":"ledger","name":"Ledger Log","category":"Database","icon":"database","shape":"rounded-rect","x":200,"y":80,"w":110,"h":56,"purpose":"Stores records chronologically","description":"The sequential table tracking transaction balances.","why":"Houses the record history","analogy":"Library ledger book","funFact":"Ledgers must use append-only rules to maintain security","takeaway":"Ledgers write new entries at the bottom","mistake":"Traditional ledgers can be altered if database security is breached","descriptionDetailed":"Relational database table storing serialized transaction logs.","vocabDefinition":"A book or database tracking financial transactions and balances.","howItWorks":"The sequential table tracking transaction balances.","deeperDive":"Relational database table storing serialized transaction logs.","advancedConcept":"Ledgers must use append-only rules to maintain security"},{"id":"audit","name":"Audit Trail","category":"Security","icon":"shield","shape":"diamond","x":360,"y":80,"w":110,"h":56,"purpose":"Verifies record integrity","description":"Checks timestamps and logs to detect edits.","why":"Ensures trust in the ledger history","analogy":"Security cameras in a bank","funFact":"Cryptographic logs detect database alterations instantly","takeaway":"Auditing proves records haven't been tampered with","mistake":"Audits only detect changes; they do not prevent them unless backed by blockchain","descriptionDetailed":"Cryptographic logging daemon verifying data hashes.","howItWorks":"Checks timestamps and logs to detect edits.","deeperDive":"Cryptographic logging daemon verifying data hashes.","advancedConcept":"Cryptographic logs detect database alterations instantly"}];
var connections = [{"from":"input","to":"ledger"},{"from":"ledger","to":"audit"}];
var steps = [{"id":"input","label":"Step 1: Write Transaction","status":"User sends transfer details. Client compiles transaction packet."},{"id":"ledger","label":"Step 2: Append Log","status":"Database adds transaction row with index and chronological timestamp."},{"id":"audit","label":"Step 3: Validate Record","status":"Auditing system checks signature logs to confirm entry is valid."}];
var tour = [{"title":"Transaction Input","description":"User enters transfer details.","componentId":"input"},{"title":"Ledger Log","description":"Saves transaction entries in order.","componentId":"ledger"},{"title":"Audit Trail","description":"Detects if past records have been altered.","componentId":"audit"}];

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
      engine.buildAutoChallenge(container);
    },
    
    animate: function(engine) {},
    onReplay: function(engine) {
      engine.t = 0;
    }
  });
});
})();