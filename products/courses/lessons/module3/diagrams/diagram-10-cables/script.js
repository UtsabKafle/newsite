(function(){'use strict';
var components = [    {id:"powercable",name:"Power Cables",category:"Hardware",purpose:"Delivers electrical power from the PSU to every component in the system",description:"Power cables include the 24-pin motherboard connector, 4+4 pin CPU power, PCIe cables for GPU, and SATA power for drives.",why:"Every component needs power to function—cables deliver it safely",analogy:"Like electrical wiring in a house that powers all appliances",funFact:"The 24-pin connector provides power, ground, and standby voltage",takeaway:"Route power cables behind the motherboard tray for a clean build",mistake:"Don\\'t daisy-chain too many SATA power connectors from one cable—it can overload",descriptionDetailed:"Connect the largest cables first (24-pin ATX), then CPU power, then GPU. Route cables behind the tray using cutouts near each connection point. Use Velcro straps to bundle cables and keep them organized."},    {id:"data",name:"Data Cables",category:"Hardware",purpose:"Transfers data between storage drives and the motherboard",description:"SATA data cables connect HDDs and SATA SSDs to the motherboard, while M.2 drives connect directly without cables.",why:"Data cables enable communication between storage devices and the system",analogy:"Like network cables connecting computers in an office",funFact:"Narrow SATA cables are easier to route than older wide IDE cables",takeaway:"Use locking SATA cables to prevent accidental disconnection",mistake:"Don\\'t bend SATA cables sharply—it can damage internal wires",descriptionDetailed:"SATA cables should be connected to the fastest ports (SATA 3.0, usually color-coded). Route them neatly alongside power cables. Avoid running data cables near sharp metal edges. M.2 drives install directly into the motherboard slot."},    {id:"frontpanel",name:"Front Panel Connectors",category:"Hardware",purpose:"Connects the case\\'s front buttons and indicators to the motherboard",description:"Front panel connectors include the power button, reset button, power LED, HDD activity LED, and front audio/USB ports.",why:"Front panel connectors make the case\\'s external controls functional",analogy:"Like connecting a doorbell button to the chime inside",funFact:"Some modern motherboards use a single block connector instead of individual pins",takeaway:"Check the motherboard manual for the exact front panel pin layout—it varies",mistake:"LED connectors are polarity-sensitive—reversing them prevents them from lighting",descriptionDetailed:"PWR_SW and RST_SW are momentary switches (no polarity). HDD_LED and PWR_LED are polarity-sensitive (positive usually marked). Front audio and USB connectors plug into separate headers. Case-specific connections like USB-C require a compatible motherboard header."},    {id:"fanheader",name:"Fan Headers",category:"Hardware",purpose:"Provides power and speed control for case and CPU fans",description:"Fan headers on the motherboard deliver power (12V), ground, and PWM control signals to coolers and case fans.",why:"Fan headers allow the motherboard to control fan speed based on temperature",analogy:"Like a thermostat that controls your HVAC system",funFact:"Most motherboards can deliver about 1A (12W) per fan header",takeaway:"Use CPU_FAN header for the CPU cooler and SYS_FAN headers for case fans",mistake:"Using CPU_FAN header for case fans can cause CPU fan error warnings",descriptionDetailed:"4-pin PWM headers allow variable speed control. 3-pin headers run at fixed speed or voltage control. Use splitters or hubs for multiple fans. Fan curves are configurable in the BIOS."},    {id:"sata",name:"SATA Connections",category:"Hardware",purpose:"Connects storage drives for both data transfer and power",description:"SATA drives require two connections: a data cable to the motherboard and a power cable from the PSU, both using L-shaped keyed connectors.",why:"SATA connections are the standard interface for drives and some peripherals",analogy:"Like a two-part connection: one for communication, one for electricity",funFact:"The SATA standard originally supported hot-swapping of drives",takeaway:"Connect SATA data cable first, then SATA power—the order doesn\\'t matter",mistake:"SATA connectors can be inserted upside-down because the L-key prevents it",descriptionDetailed:"SATA data cables come in straight and right-angle variants. SATA power cables from the PSU are daisy-chained. Connect data cables to the fastest SATA ports (often SATA_1, SATA_2). Locking data cables have metal clips."},    {id:"management",name:"Cable Management",category:"Hardware",purpose:"Organizes cables for optimal airflow and easy maintenance",description:"Cable management involves routing wires behind the motherboard tray, using zip ties or Velcro straps, and avoiding obstruction of airflow paths.",why:"Good cable management improves cooling, reduces clutter, and looks professional",analogy:"Like organizing electrical wiring in a building for safety and access",funFact:"A messy case with tangled cables can increase temps by 3-5C",takeaway:"Plan cable routing before starting—install cables in order of thickness",mistake:"Zip tie cables loosely—overtightening can damage insulation or bend pins",descriptionDetailed:"Route the 24-pin and EPS cables first (thickest). Use case cutouts near connection points. Bundle excess cable length behind the tray. Use Velcro straps for easy future modifications. Separate data and power cables to reduce electrical interference."}];
var connections = [{from:"powercable",to:"data"},{from:"data",to:"frontpanel"},{from:"frontpanel",to:"fanheader"},{from:"fanheader",to:"sata"},{from:"sata",to:"management"}];
var steps = [{label:"Step 1: Power Cables",status:"Exploring: Power Cables - Delivers electrical power from the PSU to every component in the system"},{label:"Step 2: Data Cables",status:"Exploring: Data Cables - Transfers data between storage drives and the motherboard"},{label:"Step 3: Front Panel Connectors",status:"Exploring: Front Panel Connectors - Connects the case\\'s front buttons and indicators to the motherboard"},{label:"Step 4: Fan Headers",status:"Exploring: Fan Headers - Provides power and speed control for case and CPU fans"},{label:"Step 5: SATA Connections",status:"Exploring: SATA Connections - Connects storage drives for both data transfer and power"},{label:"Step 6: Cable Management",status:"Exploring: Cable Management - Organizes cables for optimal airflow and easy maintenance"}];
var tour = [{title:"Power Cables",description:"Delivers electrical power from the PSU to every component in the system",componentId:"powercable"},{title:"Data Cables",description:"Transfers data between storage drives and the motherboard",componentId:"data"},{title:"Front Panel Connectors",description:"Connects the case\\'s front buttons and indicators to the motherboard",componentId:"frontpanel"},{title:"Fan Headers",description:"Provides power and speed control for case and CPU fans",componentId:"fanheader"},{title:"SATA Connections",description:"Connects storage drives for both data transfer and power",componentId:"sata"},{title:"Cable Management",description:"Organizes cables for optimal airflow and easy maintenance",componentId:"management"}];

deferInit(function(){
  new DiagramEngine({
    title: 'Cables',
    subtitle: 'Computer Assembly',
    desc: 'Match computer cables to their connectors and purposes.',
    components: components,
    connections: connections,
    steps: steps,
    tour: tour,
    
    render: function(container, engine) {
      engine.buildDragMatching(container, {
        items: [
          {id: 'powercable', label: 'Power Cables', slot: 'powertrans'},
          {id: 'data', label: 'Data Cables', slot: 'datatrans'},
          {id: 'frontpanel', label: 'Front Panel Connectors', slot: 'chassisio'},
          {id: 'fanheader', label: 'Fan Headers', slot: 'coolctrl'},
          {id: 'sata', label: 'SATA Connections', slot: 'storconn'},
          {id: 'management', label: 'Cable Management', slot: 'cableorg'}
        ],
        slots: [
          {id: 'powertrans', label: 'Power transmission'},
          {id: 'datatrans', label: 'Data transfer'},
          {id: 'chassisio', label: 'Chassis I/O control'},
          {id: 'coolctrl', label: 'Cooling speed control'},
          {id: 'storconn', label: 'Storage device connection'},
          {id: 'cableorg', label: 'Cable organization'}
        ]
      });
    },
    
    animate: function() {},
    
    onReplay: function(engine) {
      engine.t = 0;
    }
  });
});
})();