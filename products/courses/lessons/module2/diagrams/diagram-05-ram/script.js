(function(){'use strict';
var components = [    {id:"dram",name:"DRAM Chip",category:"Memory",purpose:"Stores data as electrical charges in tiny capacitors that must be constantly refreshed",description:"Dynamic RAM stores each bit in a capacitor and transistor pair, where the capacitor holds a charge representing 1 or 0 but leaks over time.",why:"DRAM provides the main working memory that all programs run in",analogy:"Like a leaky bucket that needs constant refilling to keep its contents",funFact:"DRAM capacitors are so small that a single grain of salt could cover millions of them",takeaway:"DRAM is called dynamic because it must be refreshed thousands of times per second",mistake:"DRAM loses all data when power is turned off, unlike storage drives",descriptionDetailed:"Each DRAM cell has one transistor and one capacitor. The charge on the capacitor drains over milliseconds, so the memory controller must refresh every cell every 64ms. DRAM is organized in rows and columns accessed through RAS and CAS signals."},    {id:"addressbus",name:"Memory Address Bus",category:"Memory",purpose:"Carries the memory address from the CPU to indicate which location to access",description:"The address bus is a set of wires that transmit the specific memory location the CPU wants to read from or write to.",why:"The address bus determines how much memory a CPU can address",analogy:"Like a postal address that tells the mail carrier which house to deliver to",funFact:"A 32-bit address bus can only address 4 GB of memory, which is why 64-bit CPUs were needed",takeaway:"The address bus width limits the maximum RAM the system can use",mistake:"The address bus doesn\\'t carry data—it only carries the location for data",descriptionDetailed:"Each wire in the address bus carries one bit of the address. A 64-bit address bus allows 2^64 memory locations. The memory controller decodes the address into row and column signals for the DRAM array."},    {id:"databus",name:"Data Bus",category:"Memory",purpose:"Transfers actual data between the CPU, memory, and peripherals",description:"The data bus carries the actual binary data being read from or written to memory, with its width determining how many bits transfer per cycle.",why:"The data bus width directly affects how much data can move per clock cycle",analogy:"Like the number of lanes on a highway determining how many cars can travel at once",funFact:"Modern CPUs have 64-bit data buses, transferring 8 bytes per memory access",takeaway:"A wider data bus means faster data transfer between CPU and RAM",mistake:"The data bus and address bus are separate—they carry different types of information",descriptionDetailed:"The data bus is bidirectional, allowing both reads and writes. Its width is typically equal to the CPU\\'s word size. Modern systems use dual or quad memory channels to achieve wider total memory bandwidth."},    {id:"controller",name:"Memory Controller",category:"Memory",purpose:"Manages read and write operations between the CPU and DRAM modules",description:"The memory controller interprets CPU memory requests, handles DRAM refresh cycles, and optimizes access patterns for performance.",why:"The memory controller is essential for reliable and efficient memory operation",analogy:"Like a librarian who manages book checkouts and returns, ensuring everything is organized",funFact:"Modern CPUs integrate the memory controller directly on the chip instead of on the motherboard chipset",takeaway:"The memory controller handles timing, refresh, and data routing between CPU and RAM",mistake:"The memory controller doesn\\'t just route data—it also manages DRAM-specific protocols",descriptionDetailed:"The memory controller translates CPU requests into DRAM commands: activate row, read column, precharge. It schedules commands to maximize bandwidth through bank interleaving and open-page policies."},    {id:"dimm",name:"DIMM Module",category:"Memory",purpose:"A physical circuit board that holds multiple DRAM chips and connects to the motherboard",description:"A Dual Inline Memory Module has DRAM chips soldered on both sides and an edge connector with contacts that plug into the motherboard slot.",why:"DIMMs package DRAM into standardized, replaceable modules",analogy:"Like a cartridge that holds multiple batteries together for easy installation",funFact:"The first DIMMs had 72 pins; modern DDR5 DIMMs have 288 pins",takeaway:"DIMMs are the physical form factor that makes RAM replaceable and upgradeable",mistake:"DDR3, DDR4, and DDR5 DIMMs are not interchangeable—they have different notch positions",descriptionDetailed:"A DIMM carries DRAM chips on a PCB with a 64-bit data bus (72-bit with ECC). The module has an SPD chip that tells the BIOS its timing and capacity. DDR transfers data on both rising and falling clock edges."}];
var connections = [{from:"dram",to:"addressbus"},{from:"addressbus",to:"databus"},{from:"databus",to:"controller"},{from:"controller",to:"dimm"}];
var steps = [{label:"Step 1: DRAM Chip",status:"Exploring: DRAM Chip - Stores data as electrical charges in tiny capacitors that must be constantly refreshed"},{label:"Step 2: Memory Address Bus",status:"Exploring: Memory Address Bus - Carries the memory address from the CPU to indicate which location to access"},{label:"Step 3: Data Bus",status:"Exploring: Data Bus - Transfers actual data between the CPU, memory, and peripherals"},{label:"Step 4: Memory Controller",status:"Exploring: Memory Controller - Manages read and write operations between the CPU and DRAM modules"},{label:"Step 5: DIMM Module",status:"Exploring: DIMM Module - A physical circuit board that holds multiple DRAM chips and connects to the motherboard"}];
var tour = [{title:"DRAM Chip",description:"Stores data as electrical charges in tiny capacitors that must be constantly refreshed",componentId:"dram"},{title:"Memory Address Bus",description:"Carries the memory address from the CPU to indicate which location to access",componentId:"addressbus"},{title:"Data Bus",description:"Transfers actual data between the CPU, memory, and peripherals",componentId:"databus"},{title:"Memory Controller",description:"Manages read and write operations between the CPU and DRAM modules",componentId:"controller"},{title:"DIMM Module",description:"A physical circuit board that holds multiple DRAM chips and connects to the motherboard",componentId:"dimm"}];

deferInit(function(){
  new DiagramEngine({
    title: 'Ram',
    subtitle: 'How Computers Work',
    desc: 'Learn how RAM provides fast temporary storage for active programs.',
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