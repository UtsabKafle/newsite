(function(){'use strict';
var components = [{"id":"html","name":"HTML Code","category":"Code","icon":"code","shape":"rounded-rect","x":40,"y":80,"w":110,"h":56,"purpose":"Provides page structure","description":"The raw HTML document containing tags.","why":"The foundational blueprint","analogy":"Brick structure of a house","funFact":"HTML was created to share scientific research documents","takeaway":"HTML is parsed line-by-line","mistake":"HTML doesn't style the page","descriptionDetailed":"Text streams parsed by the HTML parser tokenizer."},{"id":"dom","name":"DOM Tree","category":"DOM","icon":"network","shape":"rounded-rect","x":200,"y":80,"w":110,"h":56,"purpose":"Memory tag model","description":"The browser's memory tree representing HTML tags.","why":"Lets JS manipulate the page","analogy":"Family tree of elements","funFact":"You can change DOM nodes instantly using JavaScript console","takeaway":"DOM maps parent-child tag hierarchies","mistake":"DOM isn't visible on screen directly","descriptionDetailed":"Document Object Model tree nodes instantiated in C++ by the layout engine."},{"id":"cssom","name":"CSSOM Rules","category":"Style","icon":"settings","shape":"rounded-rect","x":200,"y":180,"w":110,"h":56,"purpose":"Applies CSS rulesets","description":"Memory tree of style rules parsed from CSS.","why":"Applies visuals to DOM","analogy":"Color paint guidelines","funFact":"CSSOM has to calculate selectors matching specificity","takeaway":"Cascading styles cascade down the tree","mistake":"CSSOM is separate from the HTML DOM tree","descriptionDetailed":"CSS Object Model styling definitions mapped to matching CSS selectors."},{"id":"rendertree","name":"Render Tree","category":"Render","icon":"monitor","shape":"diamond","x":360,"y":80,"w":110,"h":56,"purpose":"Visible boxes mapping","description":"Combined DOM and CSSOM representing visible nodes.","why":"Filters out invisible elements","analogy":"Blueprint with color paint added","funFact":"Display:none nodes are left out of this tree entirely","takeaway":"Render tree holds visible nodes","mistake":"Visibility:hidden elements are in this tree, but display:none aren't","descriptionDetailed":"Instantiated render tree nodes that represent boxes to lay out and paint."},{"id":"paint","name":"Painting","category":"Output","icon":"printer","shape":"rounded-rect","x":520,"y":80,"w":110,"h":56,"purpose":"Rasterizes pixels on screen","description":"Draws colors, borders, and images onto screen pixels.","why":"Displays the webpage to the user","analogy":"Painting the walls of the built house","funFact":"Graphics processors are used by modern browsers to hardware-accelerate paint","takeaway":"Painting is the final visual step","mistake":"Painting must rerun if content changes or moves","descriptionDetailed":"Graphics context calls converting layout boxes into bitmap buffers displayed on screen."}];
var connections = [{"from":"html","to":"dom"},{"from":"dom","to":"rendertree"},{"from":"cssom","to":"rendertree"},{"from":"rendertree","to":"paint"}];
var steps = [{"id":"html","label":"Step 1: Parse HTML","status":"Browser reads HTML code and builds the DOM tree in memory."},{"id":"cssom","label":"Step 2: Parse CSS","status":"Browser reads stylesheets and applies formatting to style tree."},{"id":"rendertree","label":"Step 3: Render Tree","status":"DOM and CSSOM merge to map out only the visible webpage sections."},{"id":"paint","label":"Step 4: Layout & Paint","status":"Browser calculates box coordinates and draws pixels on screen."}];
var tour = [{"title":"HTML Code","description":"The starting structure instructions.","componentId":"html"},{"title":"DOM Tree","description":"Hierarchy of HTML tags in memory.","componentId":"dom"},{"title":"CSSOM Rules","description":"Applies CSS rules to style tree.","componentId":"cssom"},{"title":"Render Tree","description":"The merged, visible components map.","componentId":"rendertree"},{"title":"Painting","description":"Draws the final pixels onto the screen.","componentId":"paint"}];

function initCustomInteractiveChallenge(container, engine) {
    var type = "flow";
    if (type === "builder" || type === "lab" || type === "flow" || type === "tree") {
      container.innerHTML = '<div class="sim-interactive-area" style="padding: 16px; display:flex; flex-direction:column; gap:12px; width:100%;">' +
        '<div style="font-size:14px; font-weight:700; color:#60a5fa;">Interactive Calibration Lab</div>' +
        '<p style="font-size:11px; color:#cbd5e1;">Calibrate values to complete the check. Select inputs to calculate system results.</p>' +
        '<div class="glass-panel" style="padding:12px; display:flex; flex-direction:column; gap:10px; border: 1px solid rgba(255,255,255,0.06); background: rgba(255,255,255,0.02); border-radius: 8px;">' +
          '<div style="display:flex; justify-content:space-between; align-items:center;">' +
            '<span style="font-size:12px; font-weight:bold; color:#cbd5e1;">System Status:</span>' +
            '<button class="act-btn" id="btn-lab-toggle" style="width:100px; justify-content:center; padding: 6px 12px; background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); border-radius: 4px; color:#cbd5e1; cursor:pointer;">OFF</button>' +
          '</div>' +
          '<div style="display:flex; flex-direction:column; gap:4px;">' +
            '<div style="display:flex; justify-content:space-between; font-size:11px; color:#94a3b8;">' +
              '<span>Calibration Meter:</span>' +
              '<span id="lbl-val">50%</span>' +
            '</div>' +
            '<input type="range" id="range-val" min="0" max="100" value="50" style="width:100%; cursor:pointer;">' +
          '</div>' +
        '</div>' +
        '<div class="glass-panel" style="padding:12px; background:rgba(0,0,0,0.25); min-height:60px; font-size:11px; border-radius:8px; border: 1px solid rgba(255,255,255,0.05);">' +
          '<div id="lab-feedback" style="color:#94a3b8; font-weight:500;">Set operational toggle to ON and adjust the meter to 100% to resolve.</div>' +
        '</div>' +
      '</div>';

      var btn = container.querySelector("#btn-lab-toggle");
      var range = container.querySelector("#range-val");
      var lbl = container.querySelector("#lbl-val");
      var fb = container.querySelector("#lab-feedback");
      var isOn = false;

      btn.addEventListener("click", function() {
        isOn = !isOn;
        this.textContent = isOn ? "ON" : "OFF";
        this.style.borderColor = isOn ? "#10b981" : "rgba(255,255,255,0.1)";
        this.style.color = isOn ? "#10b981" : "#cbd5e1";
        checkStatus();
      });

      range.addEventListener("input", function() {
        lbl.textContent = this.value + "%";
        checkStatus();
      });

      function checkStatus() {
        var val = parseInt(range.value);
        if (isOn && val === 100) {
          fb.style.color = "#10b981";
          fb.innerHTML = "<strong>🎉 Success!</strong> System calibrated successfully. Diagram challenge completed.";
          engine.markCompleted();
        } else if (isOn) {
          fb.style.color = "#3b82f6";
          fb.textContent = "Toggle is ON. Now dial the calibration slider to 100% to lock values.";
        } else {
          fb.style.color = "#94a3b8";
          fb.textContent = "Set operational toggle to ON and adjust the meter to 100% to resolve.";
        }
      }
    } else {
      engine.buildFallbackChallenge();
    }
  }

deferInit(function(){
  new DiagramEngine({
    title: "How Browsers Display Websites",
    subtitle: "Building Websites",
    desc: "Explore the core components and operations.",
    module: 6,
    difficulty: "Intermediate",
    time: "10",
    objectives: "Explore the core components and operations.",
    components: components,
    connections: connections,
    steps: steps,
    tour: tour,
    
    render: function(container, engine) {
      engine.buildVisual(container);
      engine._setStatus('Click any component to learn more');
    },
    
    customChallenge: function(container, engine) {
      initCustomInteractiveChallenge(container, engine);
    },
    
    animate: function(engine) {},
    onReplay: function(engine) {
      engine.t = 0;
    }
  });
});
})();