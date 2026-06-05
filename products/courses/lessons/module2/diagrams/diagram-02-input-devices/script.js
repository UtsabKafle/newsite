(function(){'use strict';
var components = [    {id:"keyboard",name:"Keyboard",category:"Input",purpose:"Enters text, numbers, and commands by pressing keys",description:"A keyboard uses a matrix of switches under each key that close circuits when pressed, sending a unique scan code to the computer.",why:"Keyboards remain the primary text input method for computers",analogy:"Like a typewriter, but with keys that produce digital signals",funFact:"The QWERTY layout was designed in 1873 to prevent typewriter jams",takeaway:"Each key press generates a unique scan code, not the letter itself",mistake:"Keyboards don\\'t send letters—they send scan codes that the OS maps to characters",descriptionDetailed:"Keyboards use a matrix circuit where pressing a key connects a row and column. A microcontroller detects the connection, debounces the signal, and sends a scan code via USB or Bluetooth. The OS driver maps scan codes to characters based on keyboard layout."},    {id:"mouse",name:"Mouse",category:"Input",purpose:"Controls a cursor on screen and selects items through clicking",description:"A mouse tracks movement using an optical sensor that captures surface images thousands of times per second to detect motion.",why:"The mouse made graphical user interfaces practical and intuitive",analogy:"Like your finger pointing at objects on a table",funFact:"The first mouse was made of wood and had only one button",takeaway:"Optical mice use LED or laser illumination and a CMOS sensor to track movement",mistake:"A mouse doesn\\'t move the cursor directly—it reports relative motion to the OS",descriptionDetailed:"Optical mice capture sequential surface images with a CMOS sensor and compare them to calculate direction and distance. The DPI setting determines sensitivity. Buttons and scroll wheel generate additional input events."},    {id:"scanner",name:"Scanner",category:"Input",purpose:"Converts physical documents and images into digital data",description:"Scanners use a bright light and optical sensors to capture the reflected light from a document, creating a digital image.",why:"Scanners digitize paper documents for electronic storage and processing",analogy:"Like a photocopier that sends the image to a computer instead of printing it",funFact:"The first scanner could only scan in black and white and took 5 minutes per page",takeaway:"Scanners create raster images that can be processed with OCR to extract text",mistake:"A scanner captures images, not text—OCR software is needed to recognize characters",descriptionDetailed:"Flatbed scanners use a CCD or CIS sensor array moving across the document. The sensor captures reflected light intensity at each point, creating a grid of pixels. Resolution is measured in DPI."},    {id:"microphone",name:"Microphone",category:"Input",purpose:"Converts sound waves into electrical signals for recording or communication",description:"Microphones use a diaphragm that vibrates with sound waves, converting those vibrations into analog electrical signals.",why:"Microphones enable voice communication, recording, and voice commands",analogy:"Like an ear that turns sound vibrations into signals the brain can process",funFact:"The carbon microphone invented in 1878 was the first practical microphone",takeaway:"Microphones are transducers that convert acoustic energy to electrical energy",mistake:"A microphone doesn\\'t record sound directly—it converts it to analog signals that must be digitized",descriptionDetailed:"Most microphones use dynamic or condenser elements. Dynamic mics use electromagnetic induction, while condenser mics use a charged capacitor. The analog signal is amplified and converted to digital via an ADC."},    {id:"camera",name:"Camera",category:"Input",purpose:"Captures still images and video by recording light through a lens",description:"Digital cameras use a CMOS or CCD sensor with millions of photosites that convert light intensity into electrical charges.",why:"Cameras enable visual communication, photography, and computer vision",analogy:"Like your eye, with a lens that focuses light onto a light-sensitive surface",funFact:"The first digital camera weighed 8 pounds and had a resolution of 0.01 megapixels",takeaway:"Camera sensors capture light as analog signals that are converted to digital pixel values",mistake:"Cameras don\\'t capture color—they capture brightness through color filters that are interpolated",descriptionDetailed:"Light enters through the lens and is focused onto an image sensor. The sensor has millions of photosites that accumulate electrical charge proportional to light intensity. A Bayer color filter array allows color capture."},    {id:"touchscreen",name:"Touchscreen",category:"Input",purpose:"Detects touch input directly on the display surface",description:"Touchscreens use capacitive sensing to detect the electrical properties of a finger, determining touch location with a grid of sensors.",why:"Touchscreens made smartphones and tablets possible by combining input and display",analogy:"Like a magic mirror that responds when you touch it",funFact:"The first touchscreen smartphone was the IBM Simon in 1994",takeaway:"Capacitive touchscreens detect the electrical charge of your finger, not pressure",mistake:"Touchscreens don\\'t work with regular gloves because fabric blocks the electrical charge",descriptionDetailed:"Projected capacitive touchscreens have a grid of transparent electrodes on glass. Touching the screen distorts the electrostatic field at that point. The controller detects changes in capacitance and calculates the exact touch coordinates."}];
var connections = [{from:"keyboard",to:"mouse"},{from:"mouse",to:"scanner"},{from:"scanner",to:"microphone"},{from:"microphone",to:"camera"},{from:"camera",to:"touchscreen"}];
var steps = [{label:"Step 1: Keyboard",status:"Exploring: Keyboard - Enters text, numbers, and commands by pressing keys"},{label:"Step 2: Mouse",status:"Exploring: Mouse - Controls a cursor on screen and selects items through clicking"},{label:"Step 3: Scanner",status:"Exploring: Scanner - Converts physical documents and images into digital data"},{label:"Step 4: Microphone",status:"Exploring: Microphone - Converts sound waves into electrical signals for recording or communication"},{label:"Step 5: Camera",status:"Exploring: Camera - Captures still images and video by recording light through a lens"},{label:"Step 6: Touchscreen",status:"Exploring: Touchscreen - Detects touch input directly on the display surface"}];
var tour = [{title:"Keyboard",description:"Enters text, numbers, and commands by pressing keys",componentId:"keyboard"},{title:"Mouse",description:"Controls a cursor on screen and selects items through clicking",componentId:"mouse"},{title:"Scanner",description:"Converts physical documents and images into digital data",componentId:"scanner"},{title:"Microphone",description:"Converts sound waves into electrical signals for recording or communication",componentId:"microphone"},{title:"Camera",description:"Captures still images and video by recording light through a lens",componentId:"camera"},{title:"Touchscreen",description:"Detects touch input directly on the display surface",componentId:"touchscreen"}];

deferInit(function(){
  new DiagramEngine({
    title: 'Input Devices',
    subtitle: 'How Computers Work',
    desc: 'Explore the devices that let you interact with a computer.',
    module: 2,
    difficulty: 'Beginner',
    time: '10',
    objectives: 'Explore the devices used to interact with a computer.',
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