(function(){'use strict';
var components = [    {id:"monitor",name:"Monitor",category:"Output",purpose:"Displays visual output from the computer as images on a screen",description:"Monitors use LCD or LED panels with millions of pixels, each controlled by liquid crystals that modulate light from a backlight.",why:"Monitors are the primary visual interface between computers and users",analogy:"Like a digital canvas where the computer paints what it wants to show you",funFact:"4K monitors have over 8 million pixels—four times more than 1080p",takeaway:"Each pixel on a monitor is made of red, green, and blue subpixels",mistake:"Higher refresh rate doesn\\'t mean better image quality—it means smoother motion",descriptionDetailed:"LCD panels use twisted nematic or IPS technology. A backlight shines through liquid crystals that rotate to control light passage. The GPU sends pixel data via DisplayPort or HDMI."},    {id:"speaker",name:"Speaker",category:"Output",purpose:"Converts electrical audio signals into sound waves we can hear",description:"Speakers use an electromagnet to vibrate a cone or diaphragm, creating pressure waves in the air that our ears perceive as sound.",why:"Speakers enable music, alerts, voice, and all audio from computers",analogy:"Like a paper cone that\\'s pushed and pulled by a magnet to create sound",funFact:"The first computer speakers could only produce simple beeps through a tiny piezoelectric speaker",takeaway:"Speakers are transducers that convert electrical energy into mechanical energy and then sound",mistake:"Better speakers don\\'t improve source audio quality—they just reproduce it more accurately",descriptionDetailed:"An audio signal from the sound card is amplified and sent to a voice coil inside a magnetic field. The coil vibrates according to the signal, moving the attached cone. Multiple drivers handle different frequency ranges."},    {id:"printer",name:"Printer",category:"Output",purpose:"Produces physical copies of digital documents and images on paper",description:"Printers use inkjet or laser technology to deposit ink or toner onto paper, creating text and images through precise dot patterns.",why:"Printers bridge the gap between digital documents and physical media",analogy:"Like a high-tech stamp that creates permanent marks on paper",funFact:"The first computer printer was the UNIVAC printer in 1953, printing at 600 lines per minute",takeaway:"All printers create images as patterns of tiny dots, not continuous lines",mistake:"Inkjet printers spray ink, while laser printers fuse toner powder onto paper using heat",descriptionDetailed:"Inkjet printers heat tiny chambers to eject ink droplets through nozzles. Laser printers use a drum charged with static electricity that attracts toner, then fuses it with heat."},    {id:"projector",name:"Projector",category:"Output",purpose:"Displays computer output as a large image on a screen or wall",description:"Projectors use bright lamps and optical systems to magnify and display an image from a small internal LCD or DLP chip onto a large surface.",why:"Projectors enable presentations and entertainment on a large scale",analogy:"Like a magnifying glass that turns a tiny image into a wall-sized picture",funFact:"The first digital projector, the LCD projector, was invented in 1984",takeaway:"Projectors use light valves (LCD or DLP) to create images that are then magnified by lenses",mistake:"Projector brightness is measured in lumens, not watts",descriptionDetailed:"DLP projectors use thousands of tiny mirrors on a DMD chip that tilt to reflect light. LCD projectors pass light through three LCD panels. Laser projectors use laser light sources for longer life."},    {id:"headphone",name:"Headphone",category:"Output",purpose:"Delivers private audio output directly to a listener\\'s ears",description:"Headphones use small drivers that sit on or in the ears, converting electrical signals into sound waves with minimal sound leakage.",why:"Headphones provide personal audio without disturbing others",analogy:"Like tiny speakers strapped to your ears for a personal listening experience",funFact:"Noise-cancelling headphones use microphones to capture ambient sound and generate inverse waves to cancel it",takeaway:"Headphone drivers work the same way as speakers but on a much smaller scale",mistake:"Higher impedance headphones need more power and may require a dedicated amplifier",descriptionDetailed:"Headphone drivers consist of a magnet, voice coil, and diaphragm. Open-back headphones have perforated cups for natural sound. Closed-back headphones isolate sound."}];
var connections = [{from:"monitor",to:"speaker"},{from:"speaker",to:"printer"},{from:"printer",to:"projector"},{from:"projector",to:"headphone"}];
var steps = [{label:"Step 1: Monitor",status:"Exploring: Monitor - Displays visual output from the computer as images on a screen"},{label:"Step 2: Speaker",status:"Exploring: Speaker - Converts electrical audio signals into sound waves we can hear"},{label:"Step 3: Printer",status:"Exploring: Printer - Produces physical copies of digital documents and images on paper"},{label:"Step 4: Projector",status:"Exploring: Projector - Displays computer output as a large image on a screen or wall"},{label:"Step 5: Headphone",status:"Exploring: Headphone - Delivers private audio output directly to a listener\\'s ears"}];
var tour = [{title:"Monitor",description:"Displays visual output from the computer as images on a screen",componentId:"monitor"},{title:"Speaker",description:"Converts electrical audio signals into sound waves we can hear",componentId:"speaker"},{title:"Printer",description:"Produces physical copies of digital documents and images on paper",componentId:"printer"},{title:"Projector",description:"Displays computer output as a large image on a screen or wall",componentId:"projector"},{title:"Headphone",description:"Delivers private audio output directly to a listener\\'s ears",componentId:"headphone"}];

deferInit(function(){
  new DiagramEngine({
    title: 'Output Devices',
    subtitle: 'How Computers Work',
    desc: 'See how computers present information through monitors, speakers, and printers.',
    module: 2,
    difficulty: 'Beginner',
    time: '10',
    objectives: 'See how computers present information through various output devices.',
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