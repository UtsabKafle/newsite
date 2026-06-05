(function(){'use strict';
var components = [{id:"html",name:"HTML — Structure",category:"HTML",purpose:"Defines the structure and content of web pages using elements and tags",description:"HTML (HyperText Markup Language) provides the structural foundation of web pages using elements like headings, paragraphs, images, and links.",why:"HTML gives web content meaning and structure that browsers can understand",analogy:"Like the骨架 (skeleton) of a building that defines its rooms and layout",funFact:"The first HTML specification had just 18 elements — today there are over 140",takeaway:"HTML is the structural foundation of every web page on the internet",mistake:"HTML isn't a programming language — it's a markup language that describes content structure",descriptionDetailed:"HTML uses nested elements with opening and closing tags to define content hierarchy. Elements include semantic tags like header, nav, main, article, and footer. Attributes provide additional information like links, classes, and IDs. The browser parses HTML into the DOM tree for rendering."},{id:"css",name:"CSS — Style",category:"CSS",purpose:"Controls the visual presentation and layout of HTML elements on the page",description:"CSS (Cascading Style Sheets) defines how HTML elements should be displayed — colors, fonts, spacing, animations, and responsive layouts.",why:"CSS transforms raw HTML structures into visually appealing, usable interfaces",analogy:"Like the paint, wallpaper, and furniture that make a building look beautiful",funFact:"CSS can create complex 3D animations and interactive effects without JavaScript",takeaway:"CSS handles all visual styling and layout for web pages",mistake:"CSS isn't optional — even basic styling dramatically improves usability and accessibility",descriptionDetailed:"CSS uses selectors to target HTML elements and apply styles via properties and values. The cascade determines which styles take priority. Flexbox and Grid provide powerful layout systems. Media queries enable responsive design. CSS variables and preprocessors like Sass add programming power."},{id:"js",name:"JavaScript — Behavior",category:"JavaScript",purpose:"Adds interactivity, dynamic behavior, and programmatic control to web pages",description:"JavaScript is the programming language of the web that enables dynamic content, user interactions, animations, and complex application logic.",why:"JavaScript brings web pages to life — without it pages would be static documents",analogy:"Like the electrical system that makes a building functional with lights and appliances",funFact:"JavaScript was created in just 10 days in 1995 and is now the most widely used programming language",takeaway:"JavaScript makes web pages interactive and dynamic",mistake:"JavaScript isn't just for browsers — it runs on servers via Node.js, in databases, and on IoT devices",descriptionDetailed:"JavaScript is a high-level, interpreted language with first-class functions, prototypes, and async/await for concurrency. It manipulates the DOM to update page content dynamically. Modern JavaScript uses ES6+ features like modules, promises, arrow functions, and destructuring. Frameworks like React build on vanilla JS."},{id:"browser",name:"Browser",category:"Browser",purpose:"Renders web pages by interpreting HTML, CSS, and JavaScript into visual interfaces",description:"The browser is the software that fetches, parses, and renders web pages, turning code into the visual experience users see.",why:"Browsers are the universal platform for accessing web applications",analogy:"Like a movie projector that reads the film and displays it on screen",funFact:"The first web browser, WorldWideWeb, was also a page editor — not just a viewer",takeaway:"Browsers are the runtime environment that executes all frontend code",mistake:"Browsers aren't all the same — each renders pages slightly differently and supports different features",descriptionDetailed:"Browsers use rendering engines like Blink (Chrome), WebKit (Safari), and Gecko (Firefox). The engine parses HTML into a DOM tree, applies CSS styles, and executes JavaScript via the V8 or SpiderMonkey engine. DevTools provide debugging, profiling, and inspection capabilities."},{id:"dom",name:"DOM — Document",category:"DOM",purpose:"The programming interface that represents the page structure as a tree of objects",description:"The Document Object Model (DOM) is the data representation of the page that JavaScript can access and manipulate to change content dynamically.",why:"The DOM bridges the gap between HTML markup and JavaScript programmatic control",analogy:"Like a blueprint of a building that contractors can modify with changes",funFact:"The DOM was created to solve the problem of dynamically updating page content without reloading",takeaway:"The DOM is the API that JavaScript uses to interact with and modify web pages",mistake:"The DOM isn't the same as HTML — it's the live, in-memory representation that can differ from source",descriptionDetailed:"The DOM represents the page as a tree of Node objects. Each HTML element is an Element node with properties and methods. JavaScript can traverse, add, remove, and modify nodes. Virtual DOMs (used by React) optimize performance by batching changes."}];
var connections = [{from:"html",to:"dom"},{from:"css",to:"dom"},{from:"js",to:"dom"},{from:"dom",to:"browser"}];
var steps = [{label:"Step 1: HTML Parsed",status:"Exploring: Browser parses HTML into the DOM tree structure"}, {label:"Step 2: CSS Applied",status:"Exploring: CSS styles are computed and applied to DOM elements"}, {label:"Step 3: JavaScript Executed",status:"Exploring: JavaScript runs and can manipulate the DOM"}, {label:"Step 4: DOM Updates",status:"Exploring: Changes to the DOM are reflected in the rendered page"}, {label:"Step 5: Browser Renders",status:"Exploring: The browser paints the final visual output to the screen"}];
var tour = [{title:"HTML — Structure",description:"Defines the structure and content of web pages using elements and tags",componentId:"html"},{title:"CSS — Style",description:"Controls the visual presentation and layout of HTML elements on the page",componentId:"css"},{title:"JavaScript — Behavior",description:"Adds interactivity, dynamic behavior, and programmatic control to web pages",componentId:"js"},{title:"Browser",description:"Renders web pages by interpreting HTML, CSS, and JavaScript into visual interfaces",componentId:"browser"},{title:"DOM — Document",description:"The programming interface that represents the page structure as a tree of objects",componentId:"dom"}];

deferInit(function(){
  new DiagramEngine({
    title: 'Frontend Technologies',
    subtitle: 'How Apps Work',
    desc: 'Explore HTML, CSS, and JavaScript — the three core web technologies.',
    module: 5,
    difficulty: 'Beginner',
    time: '10',
    objectives: 'Explore HTML, CSS, and JavaScript — the three core web technologies.',
    suppressDetail: true,
    components: components,
    connections: connections,
    steps: steps,
    tour: tour,
    
    render: function(container, engine) {
      engine.buildStepFlow(container);
      engine._setStatus('Click any technology to learn more');
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
