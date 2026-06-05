(function(){'use strict';
var components = [
  {id:"input",name:"Input",category:"Input",purpose:"Accepts data and commands from the user or other systems into the computer",description:"Input devices like keyboards, mice, and sensors convert physical actions or environmental data into digital signals the computer can process.",why:"Input is how we communicate with computers and give them instructions",analogy:"Like your ears and eyes that gather information for your brain",funFact:"A typical keyboard registers keystrokes in less than 16 milliseconds",takeaway:"All computer operations start with input, whether from a user or another system",mistake:"Input isn't limited to human actions—sensors, networks, and timers all provide input",descriptionDetailed:"Input devices convert physical phenomena into electrical signals. These signals are digitized by analog-to-digital converters and sent to the CPU via buses. The OS processes inputs through device drivers and makes them available to applications."},
  {id:"process",name:"Processing",category:"Processing",purpose:"Performs calculations and logical operations on input data to produce output",description:"The CPU executes instructions from programs to transform input data through arithmetic, logic, and control operations.",why:"Processing is where raw data becomes useful information",analogy:"Like your brain thinking, calculating, and making decisions from what you sense",funFact:"A modern CPU can perform billions of calculations per second",takeaway:"Processing is the core function that makes computers useful",mistake:"Processing isn't just math—it includes data movement, comparison, and decision making",descriptionDetailed:"The CPU fetches instructions from memory, decodes them, and executes them using the ALU and control unit. Instructions include arithmetic, data movement, branching, and logical operations. The clock synchronizes all operations at speeds measured in gigahertz."},
  {id:"output",name:"Output",category:"Output",purpose:"Presents processed data to the user in a perceivable form",description:"Output devices like monitors, speakers, and printers convert digital data into visual images, sound, or physical media.",why:"Output is how computers communicate results back to us",analogy:"Like your mouth speaking words that your brain has formed",funFact:"The first computer monitor could only display green text on a black screen",takeaway:"Output completes the communication loop between computer and user",mistake:"Output isn't just visual—it includes sound, haptics, data files, and network transmissions",descriptionDetailed:"Output devices receive digital data from the computer and convert it into human-perceptible form. Displays use LCD/LED panels with millions of pixels driven by graphics processors. Speakers use electromagnets to vibrate diaphragms."},
  {id:"storage",name:"Storage",category:"Storage",purpose:"Saves data and programs permanently for future use",description:"Storage devices like SSDs and HDDs retain data even when the computer is powered off, holding the OS, applications, and user files.",why:"Storage ensures data persists beyond the current computing session",analogy:"Like a notebook where you write things down to remember them later",funFact:"Modern SSDs can read data in less than 0.1 milliseconds",takeaway:"Storage provides non-volatile retention of programs and data",mistake:"Storage and memory are different—RAM is temporary, storage is permanent",descriptionDetailed:"Storage uses magnetic (HDD) or flash (SSD) technology to retain data. The file system organizes data into files and directories. Data is read/written in blocks and cached in RAM for performance."},
  {id:"feedback",name:"Feedback Loop",category:"Processing",purpose:"Uses output to influence future input, creating adaptive behavior",description:"Feedback in computing allows systems to adjust their behavior based on results—like a thermostat adjusting temperature based on readings.",why:"Feedback enables automation, error correction, and intelligent behavior",analogy:"Like a chef tasting soup and adjusting the seasoning",funFact:"Feedback loops are the foundation of all control systems and artificial intelligence",takeaway:"Feedback makes computing systems smarter and more responsive",mistake:"Feedback doesn't have to be user-facing—many feedback loops happen automatically in software",descriptionDetailed:"Feedback involves measuring output and adjusting future input or processing accordingly. Error correction uses feedback to detect and fix transmission errors. Machine learning relies on feedback loops where model outputs are compared to expected results to improve accuracy."}
];
var connections = [{from:"input",to:"process"},{from:"process",to:"output"},{from:"output",to:"storage"},{from:"storage",to:"feedback"}];
var steps = [{id:"input",label:"Step 1: Input",status:"Exploring: Input - Accepts data and commands from the user or other systems into the computer"},{id:"process",label:"Step 2: Processing",status:"Exploring: Processing - Performs calculations and logical operations on input data to produce output"},{id:"output",label:"Step 3: Output",status:"Exploring: Output - Presents processed data to the user in a perceivable form"},{id:"storage",label:"Step 4: Storage",status:"Exploring: Storage - Saves data and programs permanently for future use"},{id:"feedback",label:"Step 5: Feedback Loop",status:"Exploring: Feedback Loop - Uses output to influence future input, creating adaptive behavior"}];
var tour = [{title:"Input",description:"Accepts data and commands from the user or other systems into the computer",componentId:"input"},{title:"Processing",description:"Performs calculations and logical operations on input data to produce output",componentId:"process"},{title:"Output",description:"Presents processed data to the user in a perceivable form",componentId:"output"},{title:"Storage",description:"Saves data and programs permanently for future use",componentId:"storage"},{title:"Feedback Loop",description:"Uses output to influence future input, creating adaptive behavior",componentId:"feedback"}];

deferInit(function(){
  new DiagramEngine({
    title: 'Computer Ipo',
    subtitle: 'How Computers Work',
    desc: 'Understand the Input-Process-Output cycle that powers all computing.',
    module: 2,
    difficulty: 'Beginner',
    time: '10',
    objectives: 'Understand the Input-Process-Output cycle that powers all computing.',
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

    customChallenge: function(container, engine) {
      // Interactive Data Flow Simulator
      container.innerHTML = `
        <div class="sim-interactive-area" style="padding:16px;">
          <div style="font-size:14px; font-weight:700; color:#60a5fa; margin-bottom:4px;">Interactive Data Flow Lab</div>
          <p style="font-size:11px; color:#94a3b8; margin-bottom:12px;">Trigger inputs (Keyboard, Mouse, or Mic) and follow the data flow through the CPU to Output/Storage targets.</p>
          
          <div style="display:flex; gap:16px; margin-bottom:16px; flex-wrap:wrap;">
            <!-- Inputs -->
            <div class="glass-panel" style="flex:1; min-width:140px; padding:10px; display:flex; flex-direction:column; gap:6px;">
              <span style="font-size:10px; font-weight:700; color:#64748b; text-transform:uppercase;">1. Trigger Input</span>
              <button class="act-btn sim-input-trigger" data-type="keyboard">⌨️ Keyboard (Text)</button>
              <button class="act-btn sim-input-trigger" data-type="mouse">🖱️ Mouse (Movement)</button>
              <button class="act-btn sim-input-trigger" data-type="mic">🎙️ Microphone (Voice)</button>
            </div>
            
            <!-- CPU & Processing -->
            <div class="glass-panel" style="flex:1.2; min-width:160px; padding:10px; text-align:center; display:flex; flex-direction:column; justify-content:center; align-items:center;">
              <div id="sim-cpu-block" style="width:70px; height:70px; border:2px solid #2a3a55; border-radius:12px; background:rgba(255,255,255,0.03); display:flex; flex-direction:column; align-items:center; justify-content:center; transition: all 0.3s;">
                <span style="font-size:24px;">⚙️</span>
                <span style="font-size:9px; font-weight:bold; margin-top:2px;">CPU</span>
              </div>
              <div id="sim-data-bits" style="font-family:monospace; font-size:10px; color:#cbd5e1; margin-top:8px;">00000000</div>
            </div>
            
            <!-- Outputs -->
            <div class="glass-panel" style="flex:1; min-width:140px; padding:10px; display:flex; flex-direction:column; gap:6px;">
              <span style="font-size:10px; font-weight:700; color:#64748b; text-transform:uppercase;">2. Output Target</span>
              <div id="sim-out-monitor" style="padding:6px; font-size:11px; border:1px solid rgba(255,255,255,0.05); border-radius:6px; text-align:center;">🖥️ Monitor</div>
              <div id="sim-out-speaker" style="padding:6px; font-size:11px; border:1px solid rgba(255,255,255,0.05); border-radius:6px; text-align:center;">🔊 Speaker</div>
              <div id="sim-out-printer" style="padding:6px; font-size:11px; border:1px solid rgba(255,255,255,0.05); border-radius:6px; text-align:center;">🖨️ Printer</div>
            </div>
          </div>
          
          <div class="glass-panel" style="padding:10px; background:rgba(0,0,0,0.3); border-radius:6px; min-height:60px; font-size:12px;">
            <div id="sim-ipo-feedback" style="color:#cbd5e1; font-weight:500;">Select an input trigger to begin the cycle...</div>
          </div>
        </div>
      `;

      var triggers = container.querySelectorAll('.sim-input-trigger');
      var cpu = container.querySelector('#sim-cpu-block');
      var bits = container.querySelector('#sim-data-bits');
      var feedback = container.querySelector('#sim-ipo-feedback');

      var monitor = container.querySelector('#sim-out-monitor');
      var speaker = container.querySelector('#sim-out-speaker');
      var printer = container.querySelector('#sim-out-printer');

      var runsCompleted = 0;

      triggers.forEach(function(trig) {
        trig.addEventListener('click', function() {
          var type = this.dataset.type;
          triggers.forEach(b => b.disabled = true);
          
          // Reset highlights
          [monitor, speaker, printer].forEach(o => {
            o.style.borderColor = "rgba(255,255,255,0.05)";
            o.style.background = "transparent";
            o.style.color = "#cbd5e1";
          });
          
          // Phase 1: Input to CPU
          cpu.style.borderColor = "#3b82f6";
          cpu.style.background = "rgba(9,89,200,0.15)";
          
          var mockBits = "";
          var targetEl, desc = "";
          
          if (type === "keyboard") {
            mockBits = "01001000 01001001"; // 'HI'
            targetEl = monitor;
            desc = "Keystroke input converted to binary ASCII, processed by CPU, and rendered on the Monitor screen.";
          } else if (type === "mouse") {
            mockBits = "11010010 00111010"; // coords
            targetEl = monitor;
            desc = "Mouse coordinates digitized, calculated in CPU registers, and updated cursor on Monitor.";
          } else if (type === "mic") {
            mockBits = "11100010 01010111"; // wave
            targetEl = speaker;
            desc = "Analog sound waves sampled by ADC, processed in CPU, and outputted through the Speaker.";
          }
          
          bits.textContent = "Digitizing...";
          feedback.textContent = `Capturing input from ${type} and converting to digital format...`;

          setTimeout(() => {
            // Processing phase
            bits.textContent = mockBits;
            feedback.textContent = `CPU processing data: Arithmetic Logic calculations executing...`;
            cpu.style.transform = "scale(1.08)";
            
            setTimeout(() => {
              // Output phase
              cpu.style.transform = "scale(1)";
              targetEl.style.borderColor = "#10b981";
              targetEl.style.background = "rgba(16, 185, 129, 0.08)";
              targetEl.style.color = "#10b981";
              feedback.textContent = `✓ Done! ${desc}`;
              
              runsCompleted++;
              triggers.forEach(b => b.disabled = false);
              
              if (runsCompleted >= 2) {
                engine.markCompleted();
              }
            }, 1000);
          }, 800);
        });
      });
    },

    onReplay: function(engine) {
      engine.t = 0;
    }
  });
});
})();