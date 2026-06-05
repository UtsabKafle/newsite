(function(){'use strict';
var components = [{"id":"request","name":"User Request","category":"Client","icon":"user","shape":"rounded-rect","x":40,"y":80,"w":110,"h":56,"purpose":"Sends user filter parameters","description":"The request sent by the client, e.g. search query or user login.","why":"Defines what dynamic content is needed","analogy":"Like giving a waiter your order","funFact":"Google handles over 99,000 search requests every single second","takeaway":"Dynamic requests include parameters","mistake":"Dynamic requests are not pre-packaged","descriptionDetailed":"HTTP request parameters, headers, and query parameters sent from client."},{"id":"db","name":"Database","category":"Storage","icon":"database","shape":"rounded-rect","x":200,"y":80,"w":110,"h":56,"purpose":"Stores variables & user data","description":"The structured registry holding accounts, inventory, and pages.","why":"Houses all dynamic information","analogy":"Like files in a cabinet","funFact":"Large database systems are replicated across multiple countries","takeaway":"Databases allow personalization","mistake":"Web browsers do not connect directly to databases for security reasons","descriptionDetailed":"Structured query systems (like PostgreSQL or Redis) containing relational or key-value data."},{"id":"renderer","name":"HTML Generator","category":"Server","icon":"chip","shape":"rounded-rect","x":360,"y":80,"w":110,"h":56,"purpose":"Builds webpage HTML dynamically","description":"Server code that inserts database values into HTML templates.","why":"Assembles the final custom webpage","analogy":"Like a chef putting ingredients together","funFact":"Modern serverless runtimes generate pages in under 10 milliseconds","takeaway":"The server builds the HTML page on demand","mistake":"The browser does not receive raw database tables; it receives formatted HTML","descriptionDetailed":"Backend application server rendering HTML pages using engines like Jinja, React SSR, or PHP."}];
var connections = [{"from":"request","to":"db"},{"from":"db","to":"renderer"}];
var steps = [{"id":"request","label":"Step 1: Custom Filter","status":"User logs in or searches. Custom request travels to web server."},{"id":"db","label":"Step 2: Database Query","status":"Server queries the database to pull user-specific variables."},{"id":"renderer","label":"Step 3: Render Page","status":"Server dynamically populates HTML template with retrieved data and returns it."}];
var tour = [{"title":"User Request","description":"Carries parameters describing what custom page is needed.","componentId":"request"},{"title":"Database","description":"Stores and retrieves structured information.","componentId":"db"},{"title":"HTML Generator","description":"Puts the retrieved data into HTML code to send back.","componentId":"renderer"}];

function initCustomInteractiveChallenge(container, engine) {
    var type = "explorer";
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
    title: "Types of Websites",
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