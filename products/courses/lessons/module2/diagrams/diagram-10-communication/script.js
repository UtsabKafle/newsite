(function(){'use strict';
var components = [    {id:"source",name:"Communication Source",category:"Network",purpose:"Initiates the data transmission in a communication system",description:"The source is the sender that generates data to be transmitted, such as a computer creating a message or a sensor reading.",why:"Every communication begins with a source that has something to send",analogy:"Like a person who starts speaking to convey information",funFact:"In Shannon\\'s information theory, the source is the first of five communication components",takeaway:"The source generates the original message that needs to be transmitted",mistake:"The source isn\\'t always a person—it can be any device generating data",descriptionDetailed:"The source encodes data into a format suitable for transmission. The data is framed into protocol-specific units with headers. The source also initiates error correction coding."},    {id:"protocol",name:"Communication Protocol",category:"Network",purpose:"Defines the rules and format for data exchange between systems",description:"A protocol is a set of rules specifying how data is formatted, transmitted, received, and acknowledged, ensuring both sides understand each other.",why:"Protocols enable different systems to communicate reliably and predictably",analogy:"Like the rules of a phone call: dial, wait, say hello, speak, say goodbye",funFact:"The Internet uses a suite of over 500 different protocols working together",takeaway:"Protocols standardize communication so devices from different manufacturers can work together",mistake:"Protocols also define timing, error handling, and sequencing, not just format",descriptionDetailed:"Protocols are organized in layers (OSI or TCP/IP model). Each layer has its own protocols: HTTP, TCP, IP, Ethernet. Headers contain metadata like addresses, sequence numbers, and checksums."},    {id:"interface",name:"Communication Interface",category:"Network",purpose:"The physical or logical connection point where data enters or leaves a system",description:"An interface can be a physical port (Ethernet, USB) or a logical API (socket) that defines how data is exchanged between components.",why:"Interfaces provide the connection points that make communication physically possible",analogy:"Like a telephone jack on the wall where you plug in your phone",funFact:"The USB interface can carry data, power, and display signals simultaneously",takeaway:"Every communication system needs a standardized interface at both ends",mistake:"Interfaces aren\\'t just physical—software APIs are also interfaces",descriptionDetailed:"Physical interfaces define electrical characteristics, pinouts, and connector shapes. Logical interfaces define data formats and function calls. Network interfaces are identified by MAC addresses."},    {id:"medium",name:"Transmission Medium",category:"Network",purpose:"The physical path through which data travels from source to destination",description:"The medium is the channel that carries signals—copper wire, fiber optic cable, radio waves, or even light—between communicating devices.",why:"The medium determines speed, distance, and reliability of communication",analogy:"Like the road or air that carries vehicles or sound waves",funFact:"The speed of light in fiber optic cable is about 200,000 km/s",takeaway:"Different media offer different trade-offs between speed, distance, cost, and reliability",mistake:"Wireless isn\\'t always slower than wired—modern Wi-Fi can exceed 1 Gbps",descriptionDetailed:"Guided media include twisted-pair copper, coaxial cable, and fiber optics. Unguided media include radio, microwave, and infrared. Each has different bandwidth, latency, and interference characteristics."},    {id:"destination",name:"Communication Destination",category:"Network",purpose:"Receives the transmitted data and processes it for consumption",description:"The destination is the receiver that captures the transmitted signal, decodes it, and presents the recovered data to the end application or user.",why:"The destination completes the communication loop by consuming the transmitted information",analogy:"Like the person who listens to a speaker and understands the message",funFact:"The destination must acknowledge receipt in reliable protocols like TCP",takeaway:"Successful communication requires both a working medium and a configured destination",mistake:"The destination isn\\'t passive—it sends acknowledgments and requests retransmission",descriptionDetailed:"The destination performs signal reception, demodulation, error detection, and data extraction. It strips protocol headers and passes data to the application."}];
var connections = [{from:"source",to:"protocol"},{from:"protocol",to:"interface"},{from:"interface",to:"medium"},{from:"medium",to:"destination"}];
var steps = [{label:"Step 1: Communication Source",status:"Exploring: Communication Source - Initiates the data transmission in a communication system"},{label:"Step 2: Communication Protocol",status:"Exploring: Communication Protocol - Defines the rules and format for data exchange between systems"},{label:"Step 3: Communication Interface",status:"Exploring: Communication Interface - The physical or logical connection point where data enters or leaves a system"},{label:"Step 4: Transmission Medium",status:"Exploring: Transmission Medium - The physical path through which data travels from source to destination"},{label:"Step 5: Communication Destination",status:"Exploring: Communication Destination - Receives the transmitted data and processes it for consumption"}];
var tour = [{title:"Communication Source",description:"Initiates the data transmission in a communication system",componentId:"source"},{title:"Communication Protocol",description:"Defines the rules and format for data exchange between systems",componentId:"protocol"},{title:"Communication Interface",description:"The physical or logical connection point where data enters or leaves a system",componentId:"interface"},{title:"Transmission Medium",description:"The physical path through which data travels from source to destination",componentId:"medium"},{title:"Communication Destination",description:"Receives the transmitted data and processes it for consumption",componentId:"destination"}];

deferInit(function(){
  new DiagramEngine({
    title: 'Communication',
    subtitle: 'How Computers Work',
    desc: 'Follow how data travels from source to destination through protocols and media.',
    module: 2,
    difficulty: 'Beginner',
    time: '10',
    objectives: 'Follow how data travels from source to destination.',
    components: components,
    connections: connections,
    steps: steps,
    packetFlow: [
      {label: 'Data Frame', color: '#22c55e'},
      {label: 'Protocol Header', color: '#60a5fa'},
      {label: 'Signal', color: '#c084fc'},
      {label: 'Acknowledgment', color: '#f59e0b'}
    ],
    tour: tour,
    
    render: function(container, engine) {
      engine.buildVisual(container);
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