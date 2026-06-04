(function(){'use strict';
var components = [    {id:"wriststrap",name:"Anti-Static Wrist Strap",category:"Tool",purpose:"Prevents electrostatic discharge damage to sensitive electronic components",description:"The wrist strap connects to your wrist with a conductive band and attaches via a coiled wire to a grounded metal object, draining static charge.",why:"ESD can destroy components instantly—the wrist strap prevents this",analogy:"Like grounding yourself before touching sensitive equipment",funFact:"You can generate over 3,000 volts of static just by walking on carpet",takeaway:"Always wear an anti-static wrist strap when handling computer components",mistake:"Static damage isn\\'t always immediate—it can cause latent failures that appear later",descriptionDetailed:"The wrist strap contains a 1-megaohm resistor that limits current for safety. Clip it to a grounded metal object like the PSU case (plugged in but off). Touch bare metal of the case periodically even without a strap."},    {id:"mat",name:"Anti-Static Mat",category:"Tool",purpose:"Provides a static-safe work surface for assembling or repairing computers",description:"The mat is made of conductive material that drains static charge from components placed on it, protecting them from ESD.",why:"The mat protects components by preventing static buildup on the work surface",analogy:"Like a safe zone where static electricity can\\'t harm your components",funFact:"ESD mats are typically blue or green and have a grounding snap",takeaway:"Use an ESD mat with the wrist strap for complete static protection",mistake:"Working on a carpet with a mat still risks static—discharge before starting",descriptionDetailed:"ESD mats have two layers: a dissipative top layer and a conductive bottom layer. Connect the mat\\'s ground snap to a common ground point. The mat should cover your entire work area."},    {id:"screwdriver",name:"Phillips Head Screwdriver",category:"Tool",purpose:"Tightens and loosens the screws that hold computer components in place",description:"A Phillips #2 screwdriver is the standard tool for most computer screws, with magnetic tip and comfortable grip for precise work.",why:"Almost every component in a PC is secured with Phillips screws",analogy:"Like the one key that opens almost every part of a building",funFact:"PC builders typically only need one screwdriver size: Phillips #2",takeaway:"A magnetic tip screwdriver makes assembly much easier",mistake:"Don\\'t use the wrong screwdriver size—it can strip screw heads",descriptionDetailed:"A magnetic tip prevents dropping tiny screws into the case. Precision screwdriver sets include smaller sizes for laptop work. A ratcheting mechanism allows faster turning. Keep screws organized in a tray or magnetic mat."},    {id:"tweezers",name:"Tweezers",category:"Tool",purpose:"Handles small screws, jumpers, and connectors in tight spaces",description:"Fine-tipped tweezers help place and retrieve tiny screws, set jumpers on motherboard headers, and manipulate small cables.",why:"Tweezers provide precision in tight spaces where fingers can\\'t reach",analogy:"Like chopsticks for tiny computer parts",funFact:"Ceramic-tipped tweezers are used to avoid scratching motherboard surfaces",takeaway:"Tweezers are essential for motherboard header connectors and tiny screws",mistake:"Avoid metal tweezers near live circuits—they can cause shorts",descriptionDetailed:"Non-magnetic tweezers are preferred near magnetic storage. Angled tips help reach awkward positions. Antistatic tweezers are coated to prevent static discharge. Precision tweezers come in blunt, sharp, and curved varieties."},    {id:"paste",name:"Thermal Paste",category:"Tool",purpose:"Fills microscopic gaps between the CPU and cooler for efficient heat transfer",description:"Thermal paste is a thermally conductive compound that eliminates air pockets between the CPU\\'s heat spreader and the cooler\\'s base plate.",why:"Thermal paste dramatically improves heat transfer, preventing CPU overheating",analogy:"Like lotion that fills tiny wrinkles between your skin and a bandage for better contact",funFact:"Thermal paste contains materials like silver, ceramic, or diamond powder",takeaway:"Apply a pea-sized drop of thermal paste—more isn\\'t always better",mistake:"Too much thermal paste can insulate and cause overheating instead of cooling",descriptionDetailed:"Thermal paste fills microscopic imperfections in metal surfaces that trap air. Thermal conductivity is measured in W/mK. Common application methods include pea, line, and spread techniques."},    {id:"ties",name:"Cable Ties",category:"Tool",purpose:"Organizes and secures cables for better airflow and aesthetics",description:"Cable ties—zip ties or Velcro straps—bundle cables together neatly inside the case, improving airflow and making future maintenance easier.",why:"Good cable management improves airflow and makes troubleshooting easier",analogy:"Like organizing cords behind your TV to eliminate tangles",funFact:"Velcro straps are reusable, unlike single-use zip ties",takeaway:"Neat cable management reduces clutter, improves airflow, and looks professional",mistake:"Over-tightening zip ties can damage cable insulation",descriptionDetailed:"Cable ties come in various lengths and materials. Velcro straps are preferred for reusability. Route cables behind the motherboard tray when possible. Group cables by type and destination."}];
var connections = [{from:"wriststrap",to:"mat"},{from:"mat",to:"screwdriver"},{from:"screwdriver",to:"tweezers"},{from:"tweezers",to:"paste"},{from:"paste",to:"ties"}];
var steps = [{label:"Step 1: Anti-Static Wrist Strap",status:"Exploring: Anti-Static Wrist Strap - Prevents electrostatic discharge damage to sensitive electronic components"},{label:"Step 2: Anti-Static Mat",status:"Exploring: Anti-Static Mat - Provides a static-safe work surface for assembling or repairing computers"},{label:"Step 3: Phillips Head Screwdriver",status:"Exploring: Phillips Head Screwdriver - Tightens and loosens the screws that hold computer components in place"},{label:"Step 4: Tweezers",status:"Exploring: Tweezers - Handles small screws, jumpers, and connectors in tight spaces"},{label:"Step 5: Thermal Paste",status:"Exploring: Thermal Paste - Fills microscopic gaps between the CPU and cooler for efficient heat transfer"},{label:"Step 6: Cable Ties",status:"Exploring: Cable Ties - Organizes and secures cables for better airflow and aesthetics"}];
var tour = [{title:"Anti-Static Wrist Strap",description:"Prevents electrostatic discharge damage to sensitive electronic components",componentId:"wriststrap"},{title:"Anti-Static Mat",description:"Provides a static-safe work surface for assembling or repairing computers",componentId:"mat"},{title:"Phillips Head Screwdriver",description:"Tightens and loosens the screws that hold computer components in place",componentId:"screwdriver"},{title:"Tweezers",description:"Handles small screws, jumpers, and connectors in tight spaces",componentId:"tweezers"},{title:"Thermal Paste",description:"Fills microscopic gaps between the CPU and cooler for efficient heat transfer",componentId:"paste"},{title:"Cable Ties",description:"Organizes and secures cables for better airflow and aesthetics",componentId:"ties"}];

deferInit(function(){
  new DiagramEngine({
    title: 'Safety Tools',
    subtitle: 'Computer Assembly',
    desc: 'Match essential tools to their purposes for safe computer assembly.',
    components: components,
    connections: connections,
    steps: steps,
    tour: tour,
    
    render: function(container, engine) {
      engine.buildDragMatching(container, {
        items: [
          {id: 'wriststrap', label: 'Anti-Static Wrist Strap', slot: 'esd'},
          {id: 'mat', label: 'Anti-Static Mat', slot: 'surface'},
          {id: 'screwdriver', label: 'Phillips Head Screwdriver', slot: 'fasten'},
          {id: 'tweezers', label: 'Tweezers', slot: 'jumpers'},
          {id: 'paste', label: 'Thermal Paste', slot: 'cool'},
          {id: 'ties', label: 'Cable Ties', slot: 'cablemgmt'}
        ],
        slots: [
          {id: 'esd', label: 'Anti-static protection'},
          {id: 'surface', label: 'ESD-safe work surface'},
          {id: 'fasten', label: 'Screwing components'},
          {id: 'jumpers', label: 'Placing jumper caps/small parts'},
          {id: 'cool', label: 'Thermal paste for CPU'},
          {id: 'cablemgmt', label: 'Cable management'}
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