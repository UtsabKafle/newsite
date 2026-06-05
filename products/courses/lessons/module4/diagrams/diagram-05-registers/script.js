(function(){'use strict';
var components = [    {id:"accumulator",name:"Accumulator (EAX/RAX)",category:"Processing",purpose:"Stores intermediate arithmetic and logic operation results",description:"The accumulator register holds one operand for arithmetic operations and stores the result, optimized for calculations in most CPU architectures.",why:"The accumulator is the primary working register for calculations",analogy:"Like the display on a calculator showing the current result",funFact:"The x86 accumulator is called RAX (64-bit), EAX (32-bit), AX (16-bit)",takeaway:"Most arithmetic instructions use the accumulator by default",mistake:"Modern CPUs have many general-purpose registers, not just one accumulator",descriptionDetailed:"The accumulator evolved from single-accumulator machines (like 6502) to being one of many GPRs. In x86, RAX also stores the return value from functions. Some instructions implicitly use RAX (MUL, DIV, I/O). It\\'s often the fastest register to access."},    {id:"pc",name:"Program Counter (RIP)",category:"Processing",purpose:"Points to the address of the next instruction to be executed",description:"The program counter holds the memory address of the next instruction the CPU will fetch, automatically incrementing after each instruction.",why:"The program counter controls the flow of execution through program code",analogy:"Like a bookmark that shows where you stopped reading",funFact:"The program counter is also called the instruction pointer (RIP in x86-64)",takeaway:"The PC increments by instruction length after each fetch",mistake:"Jump instructions modify the PC—that\\'s how branches and loops work",descriptionDetailed:"After fetching an instruction, the PC advances by the instruction byte length. Branch instructions write a target address to the PC. Call instructions push the current PC onto the stack before jumping. The PC is restored by return instructions."},    {id:"ir",name:"Instruction Register",category:"Processing",purpose:"Holds the currently executing instruction for decoding",description:"The instruction register stores the fetched instruction bits so the decoder can analyze the opcode and determine operands.",why:"The IR holds the instruction steady while the decoder analyzes it",analogy:"Like holding a recipe card steady to read the ingredients list",funFact:"The IR is 32-128 bits wide depending on the CPU architecture",takeaway:"The IR is loaded from memory during the fetch phase and read during decode",mistake:"The IR isn\\'t programmer-accessible—it\\'s an internal CPU register",descriptionDetailed:"The IR latches the fetched instruction at the end of the fetch cycle. Its width matches the maximum instruction length (15 bytes for x86-64). The decoder continuously reads from the IR during decode. A new instruction loads into the IR each fetch cycle."},    {id:"mar",name:"Memory Address Register",category:"Processing",purpose:"Holds the memory address for read or write operations",description:"The MAR stores the address being accessed in memory, providing the address bus with a stable address throughout the access cycle.",why:"The MAR ensures the address bus has a steady signal during memory access",analogy:"Like writing an address on a package before sending it",funFact:"The MAR width equals the address bus width (typically 64 bits)",takeaway:"The MAR drives the address bus during memory read and write operations",mistake:"The MAR doesn\\'t store data—it only stores memory addresses",descriptionDetailed:"The MAR is loaded with the target address before any memory operation. It maintains the address throughout the access latency. For read-modify-write operations, the address stays in the MAR. The MAR feeds the address bus through tristate buffers."},    {id:"mdr",name:"Memory Data Register",category:"Processing",purpose:"Holds data being read from or written to memory",description:"The MDR (or MBR) temporarily stores data transferred between the CPU and memory, buffering the data during the access cycle.",why:"The MDR synchronizes data transfer between the CPU and memory at different speeds",analogy:"Like a loading dock where packages wait before being picked up or delivered",funFact:"The MDR width equals the data bus width (64 bits in modern CPUs)",takeaway:"The MDR bridges the speed difference between CPU and memory",mistake:"The MDR is separate from CPU registers—it\\'s a memory interface buffer",descriptionDetailed:"During reads, the MDR receives data from the memory bus. During writes, the MDR holds data until memory accepts it. The MDR interfaces between the internal data bus and external memory bus. It handles alignment and byte swapping."},    {id:"sr",name:"Status Register",category:"Processing",purpose:"Records condition flags from ALU operations for program decisions",description:"The status (or flags) register stores condition codes like Zero, Carry, Overflow, and Sign that reflect the result of the last arithmetic operation.",why:"The status register enables conditional branching based on computation results",analogy:"Like a scoreboard showing the outcome of the last play",funFact:"The x86 EFLAGS register includes the Direction Flag for string operations",takeaway:"Condition codes in the status register are used by jump and branch instructions",mistake:"Not all instructions modify the flags register—check the documentation",descriptionDetailed:"The flags register updates automatically after arithmetic/logic operations. Key flags: ZF (zero result), CF (unsigned overflow), OF (signed overflow), SF (negative), PF (parity). Control flags manage CPU state (interrupt flag, direction flag)."}];
var connections = [{from:"accumulator",to:"pc"},{from:"pc",to:"ir"},{from:"ir",to:"mar"},{from:"mar",to:"mdr"},{from:"mdr",to:"sr"}];
var steps = [{label:"Step 1: Accumulator (EAX/RAX)",status:"Exploring: Accumulator (EAX/RAX) - Stores intermediate arithmetic and logic operation results"},{label:"Step 2: Program Counter (RIP)",status:"Exploring: Program Counter (RIP) - Points to the address of the next instruction to be executed"},{label:"Step 3: Instruction Register",status:"Exploring: Instruction Register - Holds the currently executing instruction for decoding"},{label:"Step 4: Memory Address Register",status:"Exploring: Memory Address Register - Holds the memory address for read or write operations"},{label:"Step 5: Memory Data Register",status:"Exploring: Memory Data Register - Holds data being read from or written to memory"},{label:"Step 6: Status Register",status:"Exploring: Status Register - Records condition flags from ALU operations for program decisions"}];
var tour = [{title:"Accumulator (EAX/RAX)",description:"Stores intermediate arithmetic and logic operation results",componentId:"accumulator"},{title:"Program Counter (RIP)",description:"Points to the address of the next instruction to be executed",componentId:"pc"},{title:"Instruction Register",description:"Holds the currently executing instruction for decoding",componentId:"ir"},{title:"Memory Address Register",description:"Holds the memory address for read or write operations",componentId:"mar"},{title:"Memory Data Register",description:"Holds data being read from or written to memory",componentId:"mdr"},{title:"Status Register",description:"Records condition flags from ALU operations for program decisions",componentId:"sr"}];

deferInit(function(){
  new DiagramEngine({
    title: 'Registers',
    subtitle: 'CPU Components',
    desc: 'Learn about CPU registers and their roles in data processing.',
    module: 4,
    difficulty: 'Advanced',
    time: '10',
    objectives: 'Learn about CPU registers and their roles in processing.',
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