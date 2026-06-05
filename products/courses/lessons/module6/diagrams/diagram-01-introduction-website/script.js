(function(){'use strict';
var components = [{"id":"device","name":"User Device","category":"Client","icon":"laptop","shape":"rounded-rect","x":40,"y":80,"w":110,"h":56,"purpose":"Requests website pages","description":"Your computer or phone running a web browser.","why":"Initiates the webpage request","analogy":"Like a customer ordering food","funFact":"Mobile devices generate over 55% of global website traffic","takeaway":"Browsers are clients in the web ecosystem","mistake":"Browsers do not host websites","descriptionDetailed":"A client device running an HTTP user agent (browser) that initiates TCP connections to port 80/443.","howItWorks":"Your computer or phone running a web browser.","deeperDive":"A client device running an HTTP user agent (browser) that initiates TCP connections to port 80/443.","advancedConcept":"Mobile devices generate over 55% of global website traffic"},{"id":"network","name":"Internet Network","category":"Network","icon":"wifi","shape":"rounded-rect","x":200,"y":80,"w":110,"h":56,"purpose":"Carries requests and files","description":"The global network routing data packets.","why":"Connects client to server","analogy":"Like roads carrying delivery trucks","funFact":"Data travels through fiber optic cables at 200,000 km/s","takeaway":"Network speed affects page load times","mistake":"The network does not generate webpage files","descriptionDetailed":"A packet-switched network operating under TCP/IP guidelines, routing packets across multiple hops.","howItWorks":"The global network routing data packets.","deeperDive":"A packet-switched network operating under TCP/IP guidelines, routing packets across multiple hops.","advancedConcept":"Data travels through fiber optic cables at 200,000 km/s"},{"id":"server","name":"Web Server","category":"Server","icon":"server","shape":"rounded-rect","x":360,"y":80,"w":110,"h":56,"purpose":"Stores website files","description":"A remote computer hosting HTML, CSS, and image assets.","why":"Houses the website content","analogy":"Like a warehouse storing library books","funFact":"Some servers run for years without being restarted once","takeaway":"Webservers respond to client HTTP requests","mistake":"Servers are not magic; they are just computers optimized for reliability","descriptionDetailed":"A server daemon (like Nginx or Apache) that listens for incoming HTTP requests and serves files from disk or database.","howItWorks":"A remote computer hosting HTML, CSS, and image assets.","deeperDive":"A server daemon (like Nginx or Apache) that listens for incoming HTTP requests and serves files from disk or database.","advancedConcept":"Some servers run for years without being restarted once"},{"id":"assets","name":"Web Files","category":"Data","icon":"database","shape":"diamond","x":520,"y":80,"w":110,"h":56,"purpose":"HTML, CSS, JS and media","description":"The code files and media downloaded to represent the page.","why":"Contains the website content","analogy":"Like construction plans and paint","funFact":"The average webpage download size is around 2.2 megabytes","takeaway":"Browsers assemble these files into a visual page","mistake":"Webpages are made of separate files, not just a single image","descriptionDetailed":"Text and binary files (HTML, CSS, JS, JPEG, SVG) that describe the DOM tree, style rules, and scripting behaviors.","howItWorks":"The code files and media downloaded to represent the page.","deeperDive":"Text and binary files (HTML, CSS, JS, JPEG, SVG) that describe the DOM tree, style rules, and scripting behaviors.","advancedConcept":"The average webpage download size is around 2.2 megabytes"}];
var connections = [{"from":"device","to":"network"},{"from":"network","to":"server"},{"from":"server","to":"assets"}];
var steps = [{"id":"device","label":"Step 1: Request Page","status":"User types a URL. Device sends HTTP request across the network."},{"id":"server","label":"Step 2: Server Response","status":"Web server receives request and locates the HTML, CSS, and media files."},{"id":"assets","label":"Step 3: Download Assets","status":"Server sends files back. Browser downloads them to display the page."}];
var tour = [{"title":"User Device","description":"Your browser initiates the connection.","componentId":"device"},{"title":"Web Server","description":"Stores and delivers the page files.","componentId":"server"},{"title":"Web Files","description":"HTML and CSS downloaded to display the content.","componentId":"assets"}];

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
    title: "Introduction to Websites",
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