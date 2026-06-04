(function(){'use strict';
var components = [    {id:"fetcher",name:"Instruction Fetcher",category:"Processing",purpose:"Retrieves instructions from memory and prepares them for decoding",description:"The fetcher reads instructions from the instruction cache or main memory using the program counter as the address pointer.",why:"Fetching is the first step of the instruction cycle—without it, nothing happens",analogy:"Like pulling the next page from a stack of instructions",funFact:"The fetcher can predict and fetch multiple instructions ahead of time",takeaway:"The fetcher uses the program counter to know which instruction to fetch next",mistake:"The fetcher doesn\\'t execute instructions—it just retrieves them",descriptionDetailed:"The fetcher reads memory at the address in the program counter. It can fetch multiple instructions per cycle (prefetch). Branch prediction helps the fetcher guess which instructions to fetch after a branch. Fetched instructions go into a queue for decoding."},    {id:"decoder",name:"Instruction Decoder",category:"Processing",purpose:"Translates instructions into micro-operations the CPU can execute",description:"The decoder interprets instruction opcodes and operands, breaking complex x86 instructions into simpler micro-ops for the execution units.",why:"Decoding translates software instructions into hardware actions",analogy:"Like a translator who converts a complex sentence into simple action steps",funFact:"x86 instructions are complex to decode—the decoder is a major piece of CPU logic",takeaway:"The decoder determines what the instruction does and what data it needs",mistake:"ARM and RISC-V instructions are simpler to decode than x86 instructions",descriptionDetailed:"The decoder identifies the opcode (operation) and operands (data locations). x86 instructions decode into 1-4 micro-ops. Modern decoders can decode 4-6 instructions per cycle. CISC architectures require more complex decoding than RISC."},    {id:"sequencer",name:"Execution Sequencer",category:"Processing",purpose:"Determines the order in which instructions execute, including out-of-order",description:"The sequencer manages instruction flow, reordering operations for efficiency while maintaining logical correctness.",why:"Out-of-order execution keeps the CPU\\'s execution units busy instead of idle",analogy:"Like a chef who cooks multiple dishes simultaneously, prioritizing prep work for each",funFact:"Out-of-order execution was pioneered by the IBM System/360 Model 91 in 1966",takeaway:"The sequencer can reorder instructions to maximize execution unit utilization",mistake:"Out-of-order execution doesn\\'t change the final result—just the order of operations",descriptionDetailed:"The sequencer uses a reorder buffer to track instruction status. Instructions are issued to execution units when operands are ready. Results are committed in original program order. Speculative execution may discard results of mispredicted branches."},    {id:"microcode",name:"Microcode",category:"Software",purpose:"Low-level instructions that control the CPU\\'s internal logic circuits",description:"Microcode is firmware stored in the CPU that defines how complex instructions are broken down into sequences of simple hardware operations.",why:"Microcode allows fixing CPU bugs and adding features without hardware changes",analogy:"Like a script that tells actors exactly what moves to make for each scene",funFact:"Intel\\'s 2022 CPU bug required a microcode update to fix, showing its importance",takeaway:"Microcode updates can be applied through BIOS updates to fix CPU issues",mistake:"Microcode isn\\'t user-programmable—it\\'s built into the CPU by the manufacturer",descriptionDetailed:"Microcode resides in a small ROM or RAM (patchable) inside the CPU. Each complex instruction maps to a microcode routine. Microcode updates are loaded by the BIOS during boot. Patchable microcode allows post-manufacturing fixes."},    {id:"instructions",name:"Instruction Queue",category:"Processing",purpose:"Buffers fetched instructions to maintain steady flow to the decoder",description:"The instruction queue is a buffer between the fetcher and decoder, allowing the fetcher to work ahead and keep the decoder supplied.",why:"The queue smooths out instruction flow when fetch or decode experiences delays",analogy:"Like a waiting area between two conveyor belts running at different speeds",funFact:"The instruction queue depth varies by CPU design—typically 14-20 entries",takeaway:"The instruction queue prevents stalls when the fetcher temporarily gets ahead of the decoder",mistake:"The queue doesn\\'t execute or modify instructions—it just stores them temporarily",descriptionDetailed:"The queue holds prefetched instructions before decoding. It absorbs timing mismatches between fetch and decode rates. A full queue signals the fetcher to pause. The queue is part of the CPU\\'s pipeline front-end."}];
var connections = [{from:"fetcher",to:"decoder"},{from:"decoder",to:"sequencer"},{from:"sequencer",to:"microcode"},{from:"microcode",to:"instructions"}];
var steps = [{label:"Step 1: Instruction Fetcher",status:"Exploring: Instruction Fetcher - Retrieves instructions from memory and prepares them for decoding"},{label:"Step 2: Instruction Decoder",status:"Exploring: Instruction Decoder - Translates instructions into micro-operations the CPU can execute"},{label:"Step 3: Execution Sequencer",status:"Exploring: Execution Sequencer - Determines the order in which instructions execute, including out-of-order"},{label:"Step 4: Microcode",status:"Exploring: Microcode - Low-level instructions that control the CPU\\'s internal logic circuits"},{label:"Step 5: Instruction Queue",status:"Exploring: Instruction Queue - Buffers fetched instructions to maintain steady flow to the decoder"}];
var tour = [{title:"Instruction Fetcher",description:"Retrieves instructions from memory and prepares them for decoding",componentId:"fetcher"},{title:"Instruction Decoder",description:"Translates instructions into micro-operations the CPU can execute",componentId:"decoder"},{title:"Execution Sequencer",description:"Determines the order in which instructions execute, including out-of-order",componentId:"sequencer"},{title:"Microcode",description:"Low-level instructions that control the CPU\\'s internal logic circuits",componentId:"microcode"},{title:"Instruction Queue",description:"Buffers fetched instructions to maintain steady flow to the decoder",componentId:"instructions"}];

deferInit(function(){
  new DiagramEngine({
    title: 'Control Unit',
    subtitle: 'CPU Components',
    desc: 'See how the control unit directs instruction execution.',
    components: components,
    connections: connections,
    steps: steps,
    tour: tour,
    
    render: function(container, engine) {
      engine.buildStepFlow(container);
      engine._setStatus('Click any step to learn more');
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