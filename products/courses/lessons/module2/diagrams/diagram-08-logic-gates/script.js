(function(){'use strict';
var components = [    {id:"and",name:"AND Gate",category:"Processing",purpose:"Outputs 1 only when both inputs are 1",description:"The AND gate performs logical conjunction: it produces a high output only when all its inputs are high, acting like a series circuit.",why:"AND gates enable conditional operations where multiple conditions must be met",analogy:"Like two light switches in series—both must be on for the light to work",funFact:"AND gates are made from just two transistors in series",takeaway:"AND is used when all conditions must be true for an action to occur",mistake:"AND doesn\\'t add values—it checks if both are true (1)",descriptionDetailed:"AND gate truth table: 0 AND 0 = 0, 0 AND 1 = 0, 1 AND 0 = 0, 1 AND 1 = 1. AND gates are used in bit masking to selectively clear bits."},    {id:"or",name:"OR Gate",category:"Processing",purpose:"Outputs 1 when at least one input is 1",description:"The OR gate performs logical disjunction: it produces a high output when any of its inputs is high, like a parallel circuit.",why:"OR gates enable operations where either condition can trigger a result",analogy:"Like two light switches in parallel—flipping either one turns the light on",funFact:"OR gates are the most fundamental building block of binary adders",takeaway:"OR is used when at least one condition must be true",mistake:"OR isn\\'t exclusive—it outputs 1 when either or both inputs are 1",descriptionDetailed:"OR gate truth table: 0 OR 0 = 0, 0 OR 1 = 1, 1 OR 0 = 1, 1 OR 1 = 1. OR gates are used to set specific bits in bitwise operations."},    {id:"not",name:"NOT Gate",category:"Processing",purpose:"Inverts a single input, outputting the opposite value",description:"The NOT gate is a simple inverter: it outputs 0 when the input is 1 and 1 when the input is 0.",why:"NOT gates provide logical negation, essential for building all other gates",analogy:"Like a light switch that\\'s always in the opposite position of what you set",funFact:"The NOT gate is made from just one transistor in CMOS technology",takeaway:"NOT flips a signal from 0 to 1 or from 1 to 0",mistake:"NOT doesn\\'t delete or cancel—it just inverts the binary value",descriptionDetailed:"NOT gate is the simplest logic gate, implemented as a single inverter circuit. It\\'s the basis for NAND and NOR universal gates."},    {id:"nand",name:"NAND Gate",category:"Processing",purpose:"Outputs 0 only when both inputs are 1 (opposite of AND)",description:"The NAND gate is an AND gate followed by a NOT: it outputs 0 only when all inputs are 1, and 1 otherwise.",why:"NAND is a universal gate—any other gate can be built from NAND gates alone",analogy:"Like a light that\\'s on except when both switches are flipped on",funFact:"Every chip in your computer could theoretically be built using only NAND gates",takeaway:"NAND gates are universal building blocks for all digital logic",mistake:"NAND is the most important gate in digital design for manufacturing efficiency",descriptionDetailed:"NAND gate is universal: you can build AND, OR, NOT, NOR, and XOR from NAND gates alone. NAND gates are simpler and faster than AND gates in chip manufacturing."},    {id:"nor",name:"NOR Gate",category:"Processing",purpose:"Outputs 1 only when both inputs are 0 (opposite of OR)",description:"The NOR gate is an OR gate followed by a NOT: it outputs 1 only when all inputs are 0, and 0 otherwise.",why:"NOR is also a universal gate, like NAND, from which all logic can be built",analogy:"Like a light that\\'s on only when both switches are off",funFact:"NOR gates are used in SR latches and flip-flops for memory circuits",takeaway:"NOR gates can also be used to build any other logic gate",mistake:"NOR is not just OR with opposite meaning—check its truth table carefully",descriptionDetailed:"NOR gate truth table: 0 NOR 0 = 1, 0 NOR 1 = 0, 1 NOR 0 = 0, 1 NOR 1 = 0. NOR is the dual of NAND and is also a universal gate."},    {id:"xor",name:"XOR Gate",category:"Processing",purpose:"Outputs 1 when inputs are different (one is 1, the other is 0)",description:"XOR stands for exclusive OR: it produces a high output only when the inputs differ, which is essential for addition circuits.",why:"XOR is the fundamental gate used in binary addition and error detection",analogy:"Like a party where you can come alone or bring a friend, but not both or neither",funFact:"XOR gates are the core of binary adders—a full adder uses two XOR gates",takeaway:"XOR tells you if two bits are different, making it essential for arithmetic",mistake:"XOR isn\\'t the same as OR—OR outputs 1 when both are 1, XOR does not",descriptionDetailed:"XOR gate truth table: 0 XOR 0 = 0, 0 XOR 1 = 1, 1 XOR 0 = 1, 1 XOR 1 = 0. XOR is used in parity checking and encryption algorithms."}];
var connections = [{from:"and",to:"or"},{from:"or",to:"not"},{from:"not",to:"nand"},{from:"nand",to:"nor"},{from:"nor",to:"xor"}];
var steps = [{label:"Step 1: AND Gate",status:"Exploring: AND Gate - Outputs 1 only when both inputs are 1"},{label:"Step 2: OR Gate",status:"Exploring: OR Gate - Outputs 1 when at least one input is 1"},{label:"Step 3: NOT Gate",status:"Exploring: NOT Gate - Inverts a single input, outputting the opposite value"},{label:"Step 4: NAND Gate",status:"Exploring: NAND Gate - Outputs 0 only when both inputs are 1 (opposite of AND)"},{label:"Step 5: NOR Gate",status:"Exploring: NOR Gate - Outputs 1 only when both inputs are 0 (opposite of OR)"},{label:"Step 6: XOR Gate",status:"Exploring: XOR Gate - Outputs 1 when inputs are different (one is 1, the other is 0)"}];
var tour = [{title:"AND Gate",description:"Outputs 1 only when both inputs are 1",componentId:"and"},{title:"OR Gate",description:"Outputs 1 when at least one input is 1",componentId:"or"},{title:"NOT Gate",description:"Inverts a single input, outputting the opposite value",componentId:"not"},{title:"NAND Gate",description:"Outputs 0 only when both inputs are 1 (opposite of AND)",componentId:"nand"},{title:"NOR Gate",description:"Outputs 1 only when both inputs are 0 (opposite of OR)",componentId:"nor"},{title:"XOR Gate",description:"Outputs 1 when inputs are different (one is 1, the other is 0)",componentId:"xor"}];

deferInit(function(){
  new DiagramEngine({
    title: 'Logic Gates',
    subtitle: 'How Computers Work',
    desc: 'Explore the fundamental logic gates that build all digital circuits.',
    components: components,
    connections: connections,
    steps: steps,
    tour: tour,
    
    render: function(container, engine) {
      engine.buildClickExplorer(container);
      engine._setStatus('Click any component to learn more');
    },
    
    animate: function(engine) {
      var svg = engine.el.visual.querySelector('svg');
      if (!svg || engine.selectedId || !engine.playing) return;
      var comps = svg.querySelectorAll('.component');
      var idx = Math.floor(engine.t * 0.5) % comps.length;
      comps.forEach(function(el, i) {
        var bg = el.querySelector('.component-bg');
        if (!bg) return;
        bg.setAttribute('fill', i === idx ? '#1e2d50' : '#1a2235');
        bg.setAttribute('stroke', i === idx ? '#0959C8' : '#2a3a55');
      });
    },
    
    onReplay: function(engine) {
      engine.t = 0;
    }
  });
});
})();