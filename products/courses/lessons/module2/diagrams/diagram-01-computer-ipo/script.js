(function(){'use strict';
var components = [    {id:"input",name:"Input",category:"Input",purpose:"Accepts data and commands from the user or other systems into the computer",description:"Input devices like keyboards, mice, and sensors convert physical actions or environmental data into digital signals the computer can process.",why:"Input is how we communicate with computers and give them instructions",analogy:"Like your ears and eyes that gather information for your brain",funFact:"A typical keyboard registers keystrokes in less than 16 milliseconds",takeaway:"All computer operations start with input, whether from a user or another system",mistake:"Input isn\\'t limited to human actions—sensors, networks, and timers all provide input",descriptionDetailed:"Input devices convert physical phenomena into electrical signals. These signals are digitized by analog-to-digital converters and sent to the CPU via buses. The OS processes inputs through device drivers and makes them available to applications."},    {id:"process",name:"Processing",category:"Processing",purpose:"Performs calculations and logical operations on input data to produce output",description:"The CPU executes instructions from programs to transform input data through arithmetic, logic, and control operations.",why:"Processing is where raw data becomes useful information",analogy:"Like your brain thinking, calculating, and making decisions from what you sense",funFact:"A modern CPU can perform billions of calculations per second",takeaway:"Processing is the core function that makes computers useful",mistake:"Processing isn\\'t just math—it includes data movement, comparison, and decision making",descriptionDetailed:"The CPU fetches instructions from memory, decodes them, and executes them using the ALU and control unit. Instructions include arithmetic, data movement, branching, and logical operations. The clock synchronizes all operations at speeds measured in gigahertz."},    {id:"output",name:"Output",category:"Output",purpose:"Presents processed data to the user in a perceivable form",description:"Output devices like monitors, speakers, and printers convert digital data into visual images, sound, or physical media.",why:"Output is how computers communicate results back to us",analogy:"Like your mouth speaking words that your brain has formed",funFact:"The first computer monitor could only display green text on a black screen",takeaway:"Output completes the communication loop between computer and user",mistake:"Output isn\\'t just visual—it includes sound, haptics, data files, and network transmissions",descriptionDetailed:"Output devices receive digital data from the computer and convert it into human-perceptible form. Displays use LCD/LED panels with millions of pixels driven by graphics processors. Speakers use electromagnets to vibrate diaphragms."},    {id:"storage",name:"Storage",category:"Storage",purpose:"Saves data and programs permanently for future use",description:"Storage devices like SSDs and HDDs retain data even when the computer is powered off, holding the OS, applications, and user files.",why:"Storage ensures data persists beyond the current computing session",analogy:"Like a notebook where you write things down to remember them later",funFact:"Modern SSDs can read data in less than 0.1 milliseconds",takeaway:"Storage provides non-volatile retention of programs and data",mistake:"Storage and memory are different—RAM is temporary, storage is permanent",descriptionDetailed:"Storage uses magnetic (HDD) or flash (SSD) technology to retain data. The file system organizes data into files and directories. Data is read/written in blocks and cached in RAM for performance."},    {id:"feedback",name:"Feedback Loop",category:"Processing",purpose:"Uses output to influence future input, creating adaptive behavior",description:"Feedback in computing allows systems to adjust their behavior based on results—like a thermostat adjusting temperature based on readings.",why:"Feedback enables automation, error correction, and intelligent behavior",analogy:"Like a chef tasting soup and adjusting the seasoning",funFact:"Feedback loops are the foundation of all control systems and artificial intelligence",takeaway:"Feedback makes computing systems smarter and more responsive",mistake:"Feedback doesn\\'t have to be user-facing—many feedback loops happen automatically in software",descriptionDetailed:"Feedback involves measuring output and adjusting future input or processing accordingly. Error correction uses feedback to detect and fix transmission errors. Machine learning relies on feedback loops where model outputs are compared to expected results to improve accuracy."}];
var connections = [{from:"input",to:"process"},{from:"process",to:"output"},{from:"output",to:"storage"},{from:"storage",to:"feedback"}];
var steps = [{label:"Step 1: Input",status:"Exploring: Input - Accepts data and commands from the user or other systems into the computer"},{label:"Step 2: Processing",status:"Exploring: Processing - Performs calculations and logical operations on input data to produce output"},{label:"Step 3: Output",status:"Exploring: Output - Presents processed data to the user in a perceivable form"},{label:"Step 4: Storage",status:"Exploring: Storage - Saves data and programs permanently for future use"},{label:"Step 5: Feedback Loop",status:"Exploring: Feedback Loop - Uses output to influence future input, creating adaptive behavior"}];
var tour = [{title:"Input",description:"Accepts data and commands from the user or other systems into the computer",componentId:"input"},{title:"Processing",description:"Performs calculations and logical operations on input data to produce output",componentId:"process"},{title:"Output",description:"Presents processed data to the user in a perceivable form",componentId:"output"},{title:"Storage",description:"Saves data and programs permanently for future use",componentId:"storage"},{title:"Feedback Loop",description:"Uses output to influence future input, creating adaptive behavior",componentId:"feedback"}];

deferInit(function(){
  new DiagramEngine({
    title: 'Computer Ipo',
    subtitle: 'How Computers Work',
    desc: 'Understand the Input-Process-Output cycle that powers all computing.',
    components: components,
    connections: connections,
    steps: steps,
    tour: tour,
    
    render: function(container, engine) {
      engine.buildStepFlow(container);
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