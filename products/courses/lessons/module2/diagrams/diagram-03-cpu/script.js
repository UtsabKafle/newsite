(function(){'use strict';
var components = [    {id:"controlunit",name:"Control Unit",category:"Processing",purpose:"Directs and coordinates all CPU operations by fetching, decoding, and sequencing instructions",description:"The control unit reads instructions from memory, decodes them, and generates control signals that orchestrate the ALU, registers, and data flow.",why:"The control unit is the brain\\'s executive—it decides what operations happen when",analogy:"Like a conductor of an orchestra who tells each musician when to play",funFact:"The control unit doesn\\'t process data—it tells other components how to process data",takeaway:"The control unit manages instruction sequencing but doesn\\'t perform calculations itself",mistake:"The control unit doesn\\'t execute instructions—it orchestrates the components that do",descriptionDetailed:"The control unit has hardwired (fixed logic circuits) or microprogrammed (microcode in ROM) implementations. It generates timing signals that coordinate fetch-decode-execute cycles. Modern control units support pipelining, branch prediction, and out-of-order execution."},    {id:"alu",name:"Arithmetic Logic Unit",category:"Processing",purpose:"Performs all arithmetic calculations and logical comparisons",description:"The ALU executes math operations like addition and subtraction, and logical operations like AND, OR, and comparison between values.",why:"The ALU makes all mathematical and logical computation possible",analogy:"Like a calculator that\\'s built into the processor",funFact:"Modern ALUs can perform over 100 billion operations per second",takeaway:"Every mathematical and logical operation happens in the ALU",mistake:"The ALU doesn\\'t handle floating-point math—that\\'s done by the FPU",descriptionDetailed:"The ALU accepts two operands and an opcode, then produces a result and status flags (zero, carry, overflow, negative). It uses logic gates and adder circuits to perform operations in parallel at the bit level."},    {id:"registers",name:"CPU Registers",category:"Processing",purpose:"Provides ultra-fast temporary storage for data the CPU is actively working with",description:"Registers are small storage locations inside the CPU that hold data, addresses, and instruction state with zero-latency access.",why:"Registers provide the fastest possible data access, critical for performance",analogy:"Like your immediate short-term memory holding what you\\'re thinking about right now",funFact:"A CPU register can be read in less than 0.3 nanoseconds",takeaway:"Registers are the fastest memory in the computer hierarchy",mistake:"Registers don\\'t store data permanently—they\\'re volatile and lose data when power is off",descriptionDetailed:"General-purpose registers hold data for ALU operations. Special-purpose registers include the program counter (PC), instruction register (IR), and status register (flags). Register files are built from SRAM."},    {id:"cache",name:"CPU Cache",category:"Memory",purpose:"Stores frequently accessed data closer to the CPU to reduce latency",description:"Cache memory sits between the CPU and main RAM, holding copies of recently used data and instructions for faster access.",why:"Cache bridges the speed gap between the CPU and main memory",analogy:"Like a kitchen counter where you keep frequently used ingredients instead of going to the pantry",funFact:"A CPU cache hit takes about 1 nanosecond, while a RAM access takes about 50 nanoseconds",takeaway:"Cache significantly improves CPU performance by reducing wait time for data",mistake:"Cache isn\\'t just one block—it\\'s organized in levels: L1, L2, and L3",descriptionDetailed:"L1 cache is per-core, fastest but tiny (32-64KB). L2 is per-core, slightly larger (256-512KB). L3 is shared across cores, larger but slower (4-32MB). Cache uses SRAM technology and operates at CPU clock speed."},    {id:"bus",name:"System Bus",category:"Processing",purpose:"Transfers data, addresses, and control signals between CPU components",description:"The system bus is a set of parallel wires that connect the CPU to memory and peripherals, carrying data, memory addresses, and control commands.",why:"The bus is the communication highway connecting all computer components",analogy:"Like roads that connect different parts of a city, allowing traffic to flow",funFact:"Early PC buses were 8 bits wide; modern buses are 64 bits wide",takeaway:"The bus speed and width directly impact overall system performance",mistake:"There isn\\'t just one bus—there are separate buses for data, addresses, and control",descriptionDetailed:"The data bus carries actual data, the address bus specifies memory locations, and the control bus carries commands. Bus width determines how many bits can travel simultaneously."}];
var connections = [{from:"controlunit",to:"alu"},{from:"alu",to:"registers"},{from:"registers",to:"cache"},{from:"cache",to:"bus"}];
var steps = [{label:"Step 1: Control Unit",status:"Exploring: Control Unit - Directs and coordinates all CPU operations by fetching, decoding, and sequencing instructions"},{label:"Step 2: Arithmetic Logic Unit",status:"Exploring: Arithmetic Logic Unit - Performs all arithmetic calculations and logical comparisons"},{label:"Step 3: CPU Registers",status:"Exploring: CPU Registers - Provides ultra-fast temporary storage for data the CPU is actively working with"},{label:"Step 4: CPU Cache",status:"Exploring: CPU Cache - Stores frequently accessed data closer to the CPU to reduce latency"},{label:"Step 5: System Bus",status:"Exploring: System Bus - Transfers data, addresses, and control signals between CPU components"}];
var tour = [{title:"Control Unit",description:"Directs and coordinates all CPU operations by fetching, decoding, and sequencing instructions",componentId:"controlunit"},{title:"Arithmetic Logic Unit",description:"Performs all arithmetic calculations and logical comparisons",componentId:"alu"},{title:"CPU Registers",description:"Provides ultra-fast temporary storage for data the CPU is actively working with",componentId:"registers"},{title:"CPU Cache",description:"Stores frequently accessed data closer to the CPU to reduce latency",componentId:"cache"},{title:"System Bus",description:"Transfers data, addresses, and control signals between CPU components",componentId:"bus"}];

deferInit(function(){
  new DiagramEngine({
    title: 'Cpu',
    subtitle: 'How Computers Work',
    desc: 'Dive inside the CPU — control unit, ALU, registers, cache, and bus.',
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