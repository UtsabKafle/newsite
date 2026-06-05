(function(){'use strict';
var components = [{"id":"root","name":"<html> Root","category":"Structure","icon":"code","shape":"rounded-rect","x":40,"y":80,"w":110,"h":56,"purpose":"Tells browser it is HTML","description":"The wrapper tag enclosing the entire HTML document.","why":"Defines the document boundaries","analogy":"The outer cover of a book","funFact":"The root tag can define the page language using lang='en'","takeaway":"Every HTML page starts and ends with this tag","mistake":"Never place other tags outside the html tags","descriptionDetailed":"Root element of the HTML document tree.","vocabDefinition":"HyperText Markup Language, the standard code language for structure.","howItWorks":"The wrapper tag enclosing the entire HTML document.","deeperDive":"Root element of the HTML document tree.","advancedConcept":"The root tag can define the page language using lang='en'"},{"id":"head","name":"<head> Meta","category":"Structure","icon":"settings","shape":"rounded-rect","x":200,"y":80,"w":110,"h":56,"purpose":"Contains page metadata","description":"Stores non-visible information: title, stylesheet links, and scripts.","why":"Tells the browser how to load resources","analogy":"Catalog details card inside a book","funFact":"Search engines read the head tag to get page descriptions","takeaway":"Head elements are not drawn in the main viewport","mistake":"Do not put page text or content inside the head tag","descriptionDetailed":"Header block containing document configuration and links.","howItWorks":"Stores non-visible information: title, stylesheet links, and scripts.","deeperDive":"Header block containing document configuration and links.","advancedConcept":"Search engines read the head tag to get page descriptions"},{"id":"body","name":"<body> Content","category":"Structure","icon":"monitor","shape":"rounded-rect","x":200,"y":180,"w":110,"h":56,"purpose":"Contains visible elements","description":"Encloses all visible texts, graphics, tables, and links.","why":"Houses everything the user interacts with","analogy":"The actual readable pages of a book","funFact":"The body tag is where CSS styling usually applies global settings","takeaway":"Everything visible on screen sits inside body tags","mistake":"Do not put metadata links like stylesheets inside the body tag","descriptionDetailed":"Body container representing the viewport layout tree.","howItWorks":"Encloses all visible texts, graphics, tables, and links.","deeperDive":"Body container representing the viewport layout tree.","advancedConcept":"The body tag is where CSS styling usually applies global settings"}];
var connections = [{"from":"root","to":"head"},{"from":"root","to":"body"}];
var steps = [{"id":"root","label":"Step 1: Define Root","status":"Browser finds html tag, initializing HTML tree parser."},{"id":"head","label":"Step 2: Read Metadata","status":"Browser reads head settings: title, fonts, CSS files."},{"id":"body","label":"Step 3: Load Content","status":"Browser reads body tags and begins rendering the visible page layout."}];
var tour = [{"title":"<html> Root","description":"The main envelope wrapping all webpage code.","componentId":"root"},{"title":"<head> Meta","description":"Configurations and connections loaded first.","componentId":"head"},{"title":"<body> Content","description":"The content that is actually rendered for the user.","componentId":"body"}];

function initCustomInteractiveChallenge(container, engine) {
      container.innerHTML = '<div class="sim-interactive-area" style="padding: 16px; display:flex; flex-direction:column; gap:12px; width:100%;">' +
        '<div style="font-size:14px; font-weight:700; color:#60a5fa;">HTML Document Structure Builder</div>' +
        '<p style="font-size:11px; color:#cbd5e1;">Assemble a basic HTML document. Select the correct tag for each slot.</p>' +
        '<div class="glass-panel" style="padding:16px; display:flex; flex-direction:column; gap:8px; border-radius:8px; border:1px solid rgba(255,255,255,0.06); background:rgba(255,255,255,0.02);">' +
          '<div style="font-family:monospace; font-size:12px; display:flex; flex-direction:column; gap:8px; color:#a7f3d0;">' +
            '<div>&lt;!DOCTYPE html&gt;</div>' +
            '<div style="display:flex; align-items:center; gap:8px;">' +
              '<span>1.</span>' +
              '<select class="html-slot" id="slot-1" style="background:#1e293b; color:#fff; border:1px solid #475569; border-radius:4px; padding:2px 6px;">' +
                '<option value="">-- Select --</option>' +
                '<option value="html">&lt;html&gt;</option>' +
                '<option value="body">&lt;body&gt;</option>' +
                '<option value="head">&lt;head&gt;</option>' +
              '</select>' +
            '</div>' +
            '<div style="display:flex; align-items:center; gap:8px; margin-left:16px;">' +
              '<span>2.</span>' +
              '<select class="html-slot" id="slot-2" style="background:#1e293b; color:#fff; border:1px solid #475569; border-radius:4px; padding:2px 6px;">' +
                '<option value="">-- Select --</option>' +
                '<option value="head">&lt;head&gt;</option>' +
                '<option value="title">&lt;title&gt;</option>' +
                '<option value="body">&lt;body&gt;</option>' +
              '</select>' +
            '</div>' +
            '<div style="margin-left:32px; color:#64748b;">&lt;title&gt;My First Webpage&lt;/title&gt;</div>' +
            '<div style="margin-left:16px; color:#a7f3d0;">&lt;/head&gt;</div>' +
            '<div style="display:flex; align-items:center; gap:8px; margin-left:16px;">' +
              '<span>3.</span>' +
              '<select class="html-slot" id="slot-3" style="background:#1e293b; color:#fff; border:1px solid #475569; border-radius:4px; padding:2px 6px;">' +
                '<option value="">-- Select --</option>' +
                '<option value="body">&lt;body&gt;</option>' +
                '<option value="html">&lt;html&gt;</option>' +
                '<option value="h1">&lt;h1&gt;</option>' +
              '</select>' +
            '</div>' +
            '<div style="display:flex; align-items:center; gap:8px; margin-left:32px;">' +
              '<span>4.</span>' +
              '<select class="html-slot" id="slot-4" style="background:#1e293b; color:#fff; border:1px solid #475569; border-radius:4px; padding:2px 6px;">' +
                '<option value="">-- Select --</option>' +
                '<option value="h1">&lt;h1&gt;</option>' +
                '<option value="p">&lt;p&gt;</option>' +
                '<option value="head">&lt;head&gt;</option>' +
              '</select>' +
              '<span>Welcome to my website&lt;/h1&gt;</span>' +
            '</div>' +
            '<div style="margin-left:32px; color:#64748b;">&lt;p&gt;This is structured content!&lt;/p&gt;</div>' +
            '<div style="margin-left:16px; color:#a7f3d0;">&lt;/body&gt;</div>' +
            '<div style="color:#a7f3d0;">&lt;/html&gt;</div>' +
          '</div>' +
        '</div>' +
        '<div class="glass-panel" style="padding:12px; background:rgba(0,0,0,0.25); min-height:50px; font-size:11px; border-radius:8px; border:1px solid rgba(255,255,255,0.05);">' +
          '<div id="html-feedback" style="color:#94a3b8; font-weight:500;">Select the tags to build a correct HTML document layout.</div>' +
        '</div>' +
      '</div>';

      var s1 = container.querySelector("#slot-1");
      var s2 = container.querySelector("#slot-2");
      var s3 = container.querySelector("#slot-3");
      var s4 = container.querySelector("#slot-4");
      var fb = container.querySelector("#html-feedback");

      function validateHTML() {
        if (s1.value === "html" && s2.value === "head" && s3.value === "body" && s4.value === "h1") {
          fb.style.color = "#10b981";
          fb.innerHTML = "<strong>🎉 Success!</strong> Document structured correctly. Tim Berners-Lee would be proud!";
          engine.markCompleted();
        } else {
          fb.style.color = "#94a3b8";
          fb.textContent = "Keep trying! html wraps everything, head holds title, body holds visible elements.";
        }
      }

      s1.addEventListener("change", validateHTML);
      s2.addEventListener("change", validateHTML);
      s3.addEventListener("change", validateHTML);
      s4.addEventListener("change", validateHTML);
    }

deferInit(function(){
  new DiagramEngine({
    title: "Introduction to HTML",
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