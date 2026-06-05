const module10 = {
  num: 10,
  title: "Mini Projects",
  slug: "mini-projects",
  overview: "Apply everything you have learned! Build portfolio projects, troubleshoot virtual network nodes, run custom assembly labs, code Scratch animations, configure consensus chains, and construct a virtual smart technology city.",
  outcomes: [
    "Formulate technology designs, plans, wireframes, and project outlines",
    "Troubleshoot router maps, server databases, and network connections",
    "Integrate PC assembly parts, motherboard slots, and PSU cabling checks",
    "Deploy custom HTML portfolio webpages with styled CSS boxes",
    "Program interactive Scratch games with score variables and event flags",
    "Build a smart city grid linking hardware, web hosting, and automation sensors"
  ],
  chapters: [
    {
      num: 1,
      title: "Technology Project Planning",
      slug: "technology-project-planning",
      type: "builder",
      icon: "browser",
      subtitle: "Learning how to map out a tech project before coding",
      definition: "Technology project planning is the process of defining project goals, sketching user interfaces (wireframing), outlining features, and deciding what tools and systems are needed before writing code.",
      example: {
        text: "Imagine you are building a wooden treehouse. You don't just start nailing planks together randomly; you follow a plan:",
        steps: [
          "Sketch: Draw a picture of what the treehouse will look like.",
          "Spec: List the tools (hammer, saw) and materials (wood, nails) needed.",
          "Timeline: Plan what to build first (floor, then walls, then roof)."
        ],
        list: ["Visual Sketch (Wireframe)", "Required Tools (Spec)", "Step-by-Step path (Timeline)"]
      },
      analogy: {
        title: "Think of Project Planning as:",
        items: [
          { text: "Architectural blueprint", icon: "blueprint" },
          { text: "Recipe ingredients list", icon: "recipe" },
          { text: "A map layout", icon: "map" },
          { text: "A project checklist", icon: "checklist" }
        ],
        text: "Just as an architect draws blueprints to prevent constructing a crooked building, a technology plan prevents building a buggy or disorganized app."
      },
      howItWorks: "Planning begins with a specification sheet (or 'spec') which outlines what the program must do. Next, designers create wireframes, which are simple sketches showing where buttons, headers, and images go. Finally, developers break down tasks into checklist tickets to track progress.",
      deeperDive: "In professional software development, this process is part of SDLC (Software Development Life Cycle). Planning includes gathering user requirements, estimating database scopes, choosing frontend layouts, and outlining system architectures. Planning helps discover errors early before they cost time to fix in code.",
      advanced: "Tech project planning utilizes Agile methodologies, where projects are broken into small increments called sprints. Developers use wireframing tools (like Figma) and issue trackers (like Jira or GitHub Issues) to define user stories and map database relationships (ER diagrams) before implementing APIs.",
      vocab: [
        { term: "Project Planning", definition: "Mapping out specifications and designs before starting tech construction." },
        { term: "Wireframe", definition: "A simple sketch or outline of a user interface design." },
        { term: "Specification", definition: "A detailed description of what a program must do and how it should behave." },
        { term: "SDLC", definition: "Software Development Life Cycle, the structured stages of building software." }
      ],
      funFacts: [
        "Major technology companies spend up to 30% of their total project time on planning and design before writing a single line of code.",
        "The first wireframe was hand-drawn on paper by early computer UI designers in the 1970s.",
        "Planning software flows using flowcharts was invented in the 1920s to optimize manufacturing lines before being adopted by code developers."
      ],
      misconceptions: [
        { misconception: "Planning is a waste of time; it's better to start coding immediately.", truth: "Starting to code without a plan leads to disorganized logic, compatibility errors, and lost time when you have to rebuild sections from scratch." },
        { misconception: "Wireframes must look pretty and have complete designs.", truth: "Wireframes are meant to be simple layouts using gray boxes and placeholder text, focusing on where elements go rather than colors or graphics." }
      ],
      visualLearning: {
        description: "The diagram shows the tech planning sequence: Ideas -> Wireframe layout -> Spec sheet -> Code development.",
        notice: [
          "Observe how the wireframe step translates ideas into spatial grids.",
          "Check how the spec list maps tools and requirements for the next coding step."
        ]
      },
      quiz: [
        { q: "What is a wireframe in software planning?", opts: ["A type of computer cable", "A simple sketch of a user interface layout", "A database table schema", "A CPU clock cycle timer"], a: "A simple sketch of a user interface layout" }
      ],
      criticalThinking: [
        "What problems might occur if a team of five programmers starts building a game together without a project plan?",
        "Why is it useful to sketch a mobile layout separate from a desktop layout when wireframing?"
      ],
      miniProjects: [
        { title: "My First Wireframe", desc: "Pick a simple app (like a calculator or calendar). Sketch its user interface layout on paper using only rectangles, circles, and labels." },
        { title: "Feature Checklist", desc: "Write a feature spec list for a website that tracks homework tasks. List at least 4 features it must have." }
      ],
      teacherNotes: {
        objectives: ["Explain the value of planning in tech projects.", "Create a simple wireframe sketch for a page.", "List specifications for a target app."],
        prep: ["Distribute graphing paper for wireframe sketches."],
        prompts: ["How do blueprints help builders? How are wireframes like blueprints?", "What features must every game have?"]
      },
      diagram: {
        components: [
          { id: "idea", name: "Project Idea", category: "Concept", icon: "user", shape: "rounded-rect", x: 40, y: 80, w: 110, h: 56, purpose: "Defines target goals", description: "The core concept or problem to solve.", why: "Aligns the team target", analogy: "Deciding what to build", funFact: "Many billion-dollar apps started as simple sketches on paper napkins", takeaway: "Clarify your core idea first", mistake: "Do not plan too many features at once", descriptionDetailed: "Project goals definition mapping." },
          { id: "wireframe", name: "Wireframe UI", category: "Design", icon: "monitor", shape: "rounded-rect", x: 200, y: 80, w: 110, h: 56, purpose: "Maps layout grids", description: "Visual grid layout sketches.", why: "Defines screen layouts visually", analogy: "House floor plans", funFact: "Figma is the most popular tool used for UI wireframes", takeaway: "Focus on layout boxes, not colors", mistake: "Do not waste time on graphics during wireframing", descriptionDetailed: "Visual user interface box layout planning." },
          { id: "spec", name: "Feature Spec", category: "Planning", icon: "settings", shape: "diamond", x: 360, y: 80, w: 110, h: 56, purpose: "Defines code requirements", description: "The list of parameters, databases, and functions needed.", why: "Forms the coding checklist", analogy: "Shopping list of ingredients", funFact: "Specs prevent scope creep (adding features indefinitely)", takeaway: "A clear spec keeps the project on track", mistake: "Vague specifications cause misaligned implementations", descriptionDetailed: "Functional requirements document schema." }
        ],
        connections: [
          { from: "idea", to: "wireframe" },
          { from: "wireframe", to: "spec" }
        ],
        steps: [
          { id: "idea", label: "Step 1: Ideate", status: "Formulate target project goals and identify the user problem to solve." },
          { id: "wireframe", label: "Step 2: Sketch UI", status: "Draw simple layouts mapping positions of elements on screen." },
          { id: "spec", label: "Step 3: Define Spec", status: "Write out technical parameters and feature checklists for coding." }
        ],
        tour: [
          { title: "Project Idea", description: "Defines what to build.", componentId: "idea" },
          { title: "Wireframe UI", description: "Maps layout boxes visually.", componentId: "wireframe" },
          { title: "Feature Spec", description: "Checks off requirements before coding.", componentId: "spec" }
        ]
      }
    }
  ]
};

const pjTitles = [
  "", "",
  "Internet Explorer Project", "Computer Hardware Project", "CPU Learning Project", "Operating System Project",
  "Website Design Project", "Robot Design Project", "Scratch Animation Project", "Scratch Game Project",
  "Blockchain Project", "Problem Solving Challenge", "Innovation Workshop", "Technology Showcase",
  "Grand Capstone Project"
];
const pjSlugs = [
  "", "",
  "internet-explorer-project", "computer-hardware-project", "cpu-learning-project", "operating-system-project",
  "website-design-project", "robot-design-project", "scratch-animation-project", "scratch-game-project",
  "blockchain-project", "problem-solving-challenge", "innovation-workshop", "technology-showcase",
  "grand-capstone-project"
];
const pjTypes = [
  "", "",
  "lab", "builder", "lab", "explorer",
  "builder", "builder", "builder", "builder",
  "lab", "tree", "explorer", "explorer",
  "builder"
];
const pjIcons = [
  "", "",
  "network", "chip", "cpu", "monitor",
  "code", "chip", "monitor", "monitor",
  "database", "network", "globe", "monitor",
  "server"
];
const pjSubtitles = [
  "", "",
  "Assembling network maps and routing paths", "Integrating motherboards, RAM slots, and PSU cabling", "Tracing instruction pipeline clock steps", "Managing process scheduling queues and file directories",
  "Coding HTML structures and applying CSS style sheets", "Designing robot bumpers, sensors, and chassis logic", "Animating costume changes and coordinate movements", "Programming clicker games with score variables",
  "Hashing blocks and checking consensus validity", "Debugging layout issues and solving network faults", "Developing technology ideas to assist local communities", "Formatting slides and presenting project achievements",
  "Integrating web hosting, databases, and logic into a smart city capstone"
];
const pjDefinitions = [
  "", "",
  "The Internet Explorer project compiles network knowledge to chart packet routing, DNS resolution, and client-server request hops.",
  "The Computer Hardware project is a hardware assembly lab where you install a CPU, RAM modules, SSD, and cables onto a motherboard.",
  "The CPU Learning project is a pipeline simulator where you trace Fetch-Decode-Execute instructions through registers and ALUs.",
  "The Operating System project explores the core functions of an OS, including memory tables, scheduling queues, and directory trees.",
  "The Website Design project involves coding a complete personal portfolio webpage using HTML structure tags and CSS styling rules.",
  "The Robot Design project is a mechanical-logical assembler where you configure sensors, motors, and obstacle avoidance conditions.",
  "The Scratch Animation project is a visual programming challenge where you animate costume shifts and character coordinate paths.",
  "The Scratch Game project is a visual game assembler where you program variables, collision sensors, and score tracking loops.",
  "The Blockchain project is a cryptographic lab where you mine blocks, check SHA-256 hashes, and validate chain link integrity.",
  "The Problem Solving challenge is a diagnostic workshop where you identify and fix broken code tags, misaligned circuits, or network errors.",
  "The Innovation workshop is a design challenge where you formulate solutions to real-world problems using automation and web tools.",
  "The Technology Showcase is a presentation project where you format wireframes, record demos, and pitch your completed projects.",
  "The Grand Capstone project integrates hardware, software, web design, automation, and security to construct a virtual smart automated city grid."
];

for (let i = 2; i <= 14; i++) {
  module10.chapters.push({
    num: i,
    title: pjTitles[i],
    slug: pjSlugs[i],
    type: pjTypes[i],
    icon: pjIcons[i],
    subtitle: pjSubtitles[i],
    definition: pjDefinitions[i],
    example: {
      text: `Just as developers coordinate complex systems to build major products, ${pjTitles[i]} integrates multiple stages:`,
      steps: [
        `Define the specific project goals and specs.`,
        `Assemble components (hardware slots, code files, or logic blocks).`,
        `Test and debug the system to verify correct outputs.`
      ],
      list: ["Project specs", "System assembly", "Verification checks"]
    },
    analogy: {
      title: `Think of ${pjTitles[i]} as:`,
      items: [
        { text: "Workshop assembly", icon: "assembly" },
        { text: "System connection", icon: "connect" },
        { text: "Debugger checks", icon: "debug" },
        { text: "Showcase presentation", icon: "showcase" }
      ],
      text: `Just as an engineer builds, connects, and tests a complex machine part by part, ${pjTitles[i]} applies your skills to solve tasks.`
    },
    howItWorks: `This project operates by bringing together multiple concepts. You will read instructions, place modules in sequence, and write code to fulfill the project's functional goals.`,
    deeperDive: `Success in ${pjTitles[i]} requires careful planning. You must check that the components are compatible (like checking DDR5 RAM notch fit) and verify that data flows correctly between variables and screen outputs.`,
    advanced: `At the systems level, ${pjTitles[i]} requires managing interfaces. You will analyze how the frontend viewport talks to the backend logic, how sensors communicate voltage values, and how databases persist user variables safely.`,
    vocab: [
      { term: pjTitles[i], definition: "The primary technological concept explaining how components interact within the context of Mini Projects." },
      { term: "Debugging", definition: "Finding and fixing errors in code, circuits, or systems." },
      { term: "Integration", definition: "Connecting different systems (like code and hardware) to work together." },
      { term: "Project Specs", definition: "The document detailing what features are required to complete a project." }
    ],
    funFacts: [
      `Completing ${pjTitles[i]} demonstrates real engineering capabilities.`,
      `Many popular products (like Slack or Twitter) started as mini hackathon projects.`,
      `The skills learned in this project are used directly in high-end tech careers.`
    ],
    misconceptions: [
      { misconception: "Projects must be perfect on the first try.", truth: "All code and designs require debugging. Finding errors and correcting them is a normal, healthy part of the engineering process." },
      { misconception: "Only software matters in modern technology.", truth: "Physical hardware interfaces and network cables are just as critical for running and delivering programs to users." }
    ],
    visualLearning: {
      description: `The diagram displays the interactive phases of ${pjTitles[i]} and how they communicate inside the engineering workspace.`,
      notice: [
        "Check how inputs flow through processing steps to create outputs.",
        "Click on components to see detailed specs and debugging guides."
      ]
    },
    quiz: [
      { q: `What is the main objective of ${pjTitles[i]}?`, opts: ["To write simple text", "To apply coding and hardware concepts to solve projects", "To check internet wires", "To print paper forms"], a: "To apply coding and hardware concepts to solve projects" },
      { q: "What is the process of locating and fixing code errors called?", opts: ["Compiling", "Debugging", "Styling", "Routing"], a: "Debugging" },
      { q: "What does system integration mean?", opts: ["Deleting files", "Connecting different systems to work together", "Styling page fonts", "Calibrating switches"], a: "Connecting different systems to work together" }
    ],
    criticalThinking: [
      `Why is it helpful to test components separately before connecting them into a large project?`,
      `How does debugging help you become a better problem-solver in everyday life?`
    ],
    miniProjects: [
      { title: "Project Draft", desc: "Write down a project plan for a simple mobile app. List its core features and sketch its main screen." },
      { title: "Trouble Finder", desc: "List three common tech problems (like a website not loading). Write a one-sentence troubleshooting step for each." }
    ],
    teacherNotes: {
      objectives: [`Summarize the goals of ${pjTitles[i]}.`, "Assemble hardware and software components.", "Debug system errors systematically."],
      prep: ["Ensure all project templates and sandbox assets are ready."],
      prompts: ["What was the most challenging part of this project?", "How does planning help prevent bugs?"]
    },
    diagram: {
      components: [
        { id: "node1", name: "Project Outline", category: "Idea", icon: "browser", shape: "rounded-rect", x: 40, y: 80, w: 110, h: 56, purpose: "Defines project targets", description: "Outline detailing features and requirements.", why: "Foundational guide", analogy: "Shopping checklist", funFact: "Ensures focus on critical goals", takeaway: "Map requirements before coding", mistake: "Skipping features leads to gaps in implementation", descriptionDetailed: "Project specification mapper." },
        { id: "node2", name: "Assembly Lab", category: "Logic", icon: "chip", shape: "rounded-rect", x: 200, y: 80, w: 110, h: 56, purpose: "Builds system components", description: "Snap together hardware and software blocks.", why: "Creates the physical/logical system", analogy: "Assembling building blocks", funFact: "Modular parts speed up assembly", takeaway: "Connect modules step-by-step", mistake: "Forcing incompatible slots causes error signals", descriptionDetailed: "Modular assembly loop." },
        { id: "node3", name: "Debugger", category: "Check", icon: "monitor", shape: "diamond", x: 360, y: 80, w: 110, h: 56, purpose: "Verifies system signals", description: "Locates logical breaks or cable misalignments.", why: "Ensures the system boots correctly", analogy: "Diagnostic engine scanner", funFact: "The word 'bug' was coined when a physical moth was found in a relay in 1947", takeaway: "Trace code to find bugs", mistake: "Ignoring log warnings causes system failures", descriptionDetailed: "System check debug routine." }
      ],
      connections: [
        { from: "node1", to: "node2" },
        { from: "node2", to: "node3" }
      ],
      steps: [
        { id: "node1", label: "Step 1: Check Specs", status: "Read the project guidelines and confirm all required parts are listed." },
        { id: "node2", label: "Step 2: Assemble System", status: "Position components and connect signal buses or code functions." },
        { id: "node3", label: "Step 3: Run Debugger", status: "Execute system diagnostics and fix any warning flags." }
      ],
      tour: [
        { title: "Project Outline", description: "Specifies what is required to build.", componentId: "node1" },
        { title: "Assembly Lab", description: "Where physical and logical assembly occurs.", componentId: "node2" },
        { title: "Debugger", description: "Checks for and resolves system bugs.", componentId: "node3" }
      ]
    }
  });
}

module.exports = module10;
