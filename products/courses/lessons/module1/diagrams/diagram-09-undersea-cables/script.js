(function(){'use strict';
var components = [
  {id:"landingstation",name:"Landing Station",category:"Network",icon:"data-center",shape:"rounded-rect",x:30,y:72,w:110,h:56,purpose:"Connects undersea cables to the terrestrial Internet backbone on shore",description:"Landing stations are facilities on the coast where undersea cables come ashore and connect to fiber optic networks that spread across the continent.",why:"Landing stations are the bridge between underwater and land-based networks",analogy:"Like a seaport where ships dock and unload cargo onto trucks",funFact:"There are over 500 active undersea cable landing stations worldwide",takeaway:"Undersea cables connect to landing stations, not directly to your home",mistake:"Landing stations are heavily secured and often disguised to prevent sabotage",descriptionDetailed:"Landing stations house the equipment that terminates the undersea cable, including power feed equipment and optical line terminals. They convert optical signals from the cable into signals compatible with terrestrial networks. Most landing stations have redundant power and cooling."},
  {id:"cable",name:"Undersea Fiber Optic Cable",category:"Network",icon:"cable",shape:"pill",x:160,y:72,w:110,h:56,purpose:"Carries data across oceans using pulses of light through hair-thin glass fibers",description:"The cable contains multiple fiber pairs, each carrying laser light pulses encoded with data, surrounded by layers of steel and plastic armor.",why:"Undersea cables carry over 95% of all international Internet traffic",analogy:"Like a super-fast underwater highway for data traveling at the speed of light",funFact:"The first transatlantic cable laid in 1858 could transmit just 1 word per 2 minutes",takeaway:"Undersea cables are still the backbone of global connectivity",mistake:"Cables aren\\'t just laid on the seafloor\u2014they\\'re buried near shore to prevent damage",descriptionDetailed:"Modern cables use dense wavelength division multiplexing to send multiple colors of light through each fiber. Cables are about the thickness of a garden hose and can span 6,000+ miles. Repeaters every 50-80 km amplify the optical signal."},
  {id:"repeater",name:"Optical Repeater",category:"Network",icon:"chip",shape:"hexagon",x:290,y:48,w:110,h:56,purpose:"Amplifies the optical signal to prevent data loss over long distances",description:"Repeaters are placed at regular intervals along the cable to boost the weakening light signal so data can travel thousands of kilometers.",why:"Without repeaters, light signals would fade after a few hundred kilometers",analogy:"Like rest stops along a highway where drivers refuel for the next leg",funFact:"A single cable can have over 100 repeaters spaced 50-80 km apart",takeaway:"Repeaters allow undersea cables to span entire oceans",mistake:"Repeaters don\\'t regenerate data\u2014they simply amplify the optical signal",descriptionDetailed:"Repeaters contain erbium-doped fiber amplifiers that use laser pumping to boost signal strength. Modern repeaters support multiple wavelength channels simultaneously. They are powered electrically from the landing stations through the cable\\'s copper conductor."},
  {id:"buoy",name:"Navigation Buoy",category:"Network",icon:"satellite",shape:"circle",x:420,y:72,w:110,h:56,purpose:"Marks cable locations and warns ships away from buried cables",description:"Buoys are placed near shore to mark the path of undersea cables and alert ships to avoid anchoring or fishing in cable areas.",why:"Ship anchors and fishing trawlers are the biggest threat to undersea cables",analogy:"Like warning signs posted near underground gas lines to prevent digging",funFact:"Over 100 cable breaks happen each year, mostly from ship anchors and fishing",takeaway:"Cables need protection from human activity, especially in shallow waters",mistake:"Buoys don\\'t transmit data\u2014they\\'re purely physical markers",descriptionDetailed:"Buoys are placed along the cable route near shorelines to visually mark the cable path. They are regulated by international maritime laws and cable protection zones. Cable repair ships can locate breaks and pull the cable up for repair."},
  {id:"data",name:"Transmitted Data",category:"Network",icon:"data-center",shape:"rounded-rect",x:550,y:72,w:110,h:56,purpose:"Represents all Internet traffic traveling between continents through cables",description:"Data in the form of light pulses travels through the fiber at nearly the speed of light, carrying everything from emails to video streams.",why:"This data is the reason the global Internet exists\u2014connecting people worldwide",analogy:"Like all the conversations happening simultaneously through a massive fiber-optic telephone line",funFact:"A single undersea cable pair can carry the equivalent of 100 million HD movies simultaneously",takeaway:"Every international website visit, email, or stream likely travels through an undersea cable",mistake:"Data doesn\\'t travel instantaneously\u2014the speed of light in fiber is about 200,000 km/s",descriptionDetailed:"Data is encoded as laser light pulses using phase-shift keying or quadrature amplitude modulation. Multiple wavelengths of light travel through the same fiber using DWDM technology."}
];
var connections = [{from:"landingstation",to:"cable"},{from:"cable",to:"repeater"},{from:"repeater",to:"buoy"},{from:"buoy",to:"data"}];
var steps = [{label:"Step 1: Landing Station",status:"Exploring: Landing Station - Connects undersea cables to the terrestrial Internet backbone on shore"},{label:"Step 2: Undersea Fiber Optic Cable",status:"Exploring: Undersea Fiber Optic Cable - Carries data across oceans using pulses of light through hair-thin glass fibers"},{label:"Step 3: Optical Repeater",status:"Exploring: Optical Repeater - Amplifies the optical signal to prevent data loss over long distances"},{label:"Step 4: Navigation Buoy",status:"Exploring: Navigation Buoy - Marks cable locations and warns ships away from buried cables"},{label:"Step 5: Transmitted Data",status:"Exploring: Transmitted Data - Represents all Internet traffic traveling between continents through cables"}];
var tour = [{title:"Landing Station",description:"Connects undersea cables to the terrestrial Internet backbone on shore",componentId:"landingstation"},{title:"Undersea Fiber Optic Cable",description:"Carries data across oceans using pulses of light through hair-thin glass fibers",componentId:"cable"},{title:"Optical Repeater",description:"Amplifies the optical signal to prevent data loss over long distances",componentId:"repeater"},{title:"Navigation Buoy",description:"Marks cable locations and warns ships away from buried cables",componentId:"buoy"},{title:"Transmitted Data",description:"Represents all Internet traffic traveling between continents through cables",componentId:"data"}];

deferInit(function(){
  new DiagramEngine({
    title: 'Undersea Cables',
    subtitle: 'How Internet Works',
    desc: 'Explore the undersea fiber optic cables that connect continents.',
    components: components,
    connections: connections,
    steps: steps,
    tour: tour,
    packetFlow: [
      {label:'Signal In',color:'#22c55e'},
      {label:'Fiber Optics',color:'#60a5fa'},
      {label:'Amplify',color:'#c084fc'},
      {label:'Navigation',color:'#f59e0b'}
    ],

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
        var shape = bg.querySelector(':scope > :first-child');
        if(!shape)return;
        shape.setAttribute('fill', i === idx ? '#1e2d50' : '#1a2235');
        shape.setAttribute('stroke', i === idx ? '#0959C8' : '#2a3a55');
      });
    },

    onReplay: function(engine) {
      engine.t = 0;
    }
  });
});
})();
