(function(){'use strict';
var components = [    {id:"fetch",name:"Fetch Stage",category:"Processing",purpose:"Retrieves the next instruction from memory",description:"The fetch stage reads the instruction at the address in the program counter from the instruction cache or main memory.",why:"Fetching is the first step that brings instructions into the CPU",analogy:"Like a chef reading the next step from a recipe card",funFact:"Modern CPUs fetch multiple instructions per cycle using prefetching",takeaway:"The fetch stage uses the program counter to know which instruction to get",mistake:"Fetch only retrieves the instruction—it doesn\\'t interpret or execute it",descriptionDetailed:"The program counter (PC) provides the address. Instructions are loaded from L1 instruction cache (fast) or main memory (slow). Fetched instructions are placed in a queue for decoding. Branch prediction may guide which instructions to fetch next."},    {id:"decode",name:"Decode Stage",category:"Processing",purpose:"Translates the fetched instruction into control signals and operands",description:"The decode stage interprets the instruction\\'s opcode to determine the operation and identifies the operands (registers, memory addresses, or immediate values).",why:"Decoding translates machine-readable instructions into hardware actions",analogy:"Like a translator who converts a foreign sentence into action steps",funFact:"x86 instructions are variable-length (1-15 bytes), making decoding complex",takeaway:"The decode stage determines what operation to perform and on what data",mistake:"Decoding takes more hardware in x86 (CISC) than in ARM or RISC-V (RISC)",descriptionDetailed:"The decoder breaks the instruction into opcode, operands, and immediate values. Complex instructions are converted into micro-ops. The decoded instruction is checked for validity. Register operands are read in this stage."},    {id:"execute",name:"Execute Stage",category:"Processing",purpose:"Performs the actual operation on the operands using the ALU",description:"The execute stage sends the operation and operands to the appropriate execution unit (ALU, FPU, load/store) and computes the result.",why:"Execution is where computation actually happens",analogy:"Like actually mixing ingredients together after reading the recipe",funFact:"The execute stage can be split into multiple sub-stages for complex operations",takeaway:"The execute stage uses the ALU for arithmetic and logic operations",mistake:"Not all instructions go to the ALU—memory instructions use the load/store unit",descriptionDetailed:"The ALU performs the specified operation. Results are produced and written to registers or stored for later use. Execution time varies by operation (addition: 1 cycle, multiplication: 3-5 cycles). Branch instructions resolve here, potentially flushing the pipeline."},    {id:"memorywrite",name:"Memory Access Stage",category:"Processing",purpose:"Reads from or writes to data cache or main memory",description:"The memory access stage handles load (data read) and store (data write) operations, accessing L1 data cache and potentially main memory.",why:"Memory access loads data needed by instructions and saves results",analogy:"Like fetching ingredients from the pantry or storing leftovers",funFact:"Memory access is typically the slowest stage in the pipeline",takeaway:"Cache hits make memory access fast; misses cause significant delays",mistake:"Not all instructions need the memory stage—register operations skip it",descriptionDetailed:"For loads: data is read from cache/memory into the MDR. For stores: data is written from registers to the store buffer. The load/store unit manages address calculation. Cache misses cause pipeline stalls until data arrives."},    {id:"registerwrite",name:"Write-Back Stage",category:"Processing",purpose:"Writes the execution result back to a register file",description:"The write-back stage stores the result of the ALU operation into the destination register, completing the instruction cycle.",why:"Write-back makes computation results available for subsequent instructions",analogy:"Like writing the answer down on paper so you can use it later",funFact:"The write-back stage can be bypassed to avoid pipeline hazards",takeaway:"The write-back stage commits the instruction\\'s result to architectural state",mistake:"Write-back to memory (store) happens in the memory stage, not write-back stage",descriptionDetailed:"Results are written to the specified destination register in the register file. Forwarding (bypassing) sends results directly to dependent instructions. The write-back stage retires the instruction from the reorder buffer."}];
var connections = [{from:"fetch",to:"decode"},{from:"decode",to:"execute"},{from:"execute",to:"memorywrite"},{from:"memorywrite",to:"registerwrite"}];
var steps = [{label:"Step 1: Fetch Stage",status:"Exploring: Fetch Stage - Retrieves the next instruction from memory"},{label:"Step 2: Decode Stage",status:"Exploring: Decode Stage - Translates the fetched instruction into control signals and operands"},{label:"Step 3: Execute Stage",status:"Exploring: Execute Stage - Performs the actual operation on the operands using the ALU"},{label:"Step 4: Memory Access Stage",status:"Exploring: Memory Access Stage - Reads from or writes to data cache or main memory"},{label:"Step 5: Write-Back Stage",status:"Exploring: Write-Back Stage - Writes the execution result back to a register file"}];
var tour = [{title:"Fetch Stage",description:"Retrieves the next instruction from memory",componentId:"fetch"},{title:"Decode Stage",description:"Translates the fetched instruction into control signals and operands",componentId:"decode"},{title:"Execute Stage",description:"Performs the actual operation on the operands using the ALU",componentId:"execute"},{title:"Memory Access Stage",description:"Reads from or writes to data cache or main memory",componentId:"memorywrite"},{title:"Write-Back Stage",description:"Writes the execution result back to a register file",componentId:"registerwrite"}];

deferInit(function(){
  new DiagramEngine({
    title: 'Instruction Cycle',
    subtitle: 'CPU Components',
    desc: 'Follow the fetch-decode-execute cycle step by step.',
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