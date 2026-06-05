const module8 = {
  num: 8,
  title: "Scratch Programming",
  slug: "scratch-programming",
  overview: "Learn code visually through Scratch! Master sprite movement, layout configurations, coordinate mapping, loop structures, conditional checks, variables, broadcast message communications, and game building blocks.",
  outcomes: [
    "Understand the Scratch visual block IDE interface and stage panels",
    "Learn sprite coordinate movements (X and Y coordinates)",
    "Program motions, looks, speech bubbles, and audio outputs",
    "Create events based on user input, key presses, and sprite clicks",
    "Use loops (Repeat, Forever) and conditional blocks (If-Then-Else)",
    "Send and receive event signals via broadcast messages to coordinate sprites"
  ],
  chapters: [
    {
      num: 1,
      title: "Introduction to Scratch",
      slug: "introduction-to-scratch",
      type: "explorer",
      icon: "browser",
      subtitle: "Discovering visual coding through draggable blocks",
      definition: "Scratch is a visual block-based programming language and online community designed for students to learn basic logic, coding concepts, and computational thinking by snapping blocks together.",
      example: {
        text: "Imagine you are directing a play. Instead of telling the actors what to do in a written text letter, you stack action blocks:",
        steps: [
          "Event: 'When the play starts (Green Flag clicked)'",
          "Motion: 'Walk forward 10 steps'",
          "Looks: 'Say Hello! for 2 seconds'"
        ],
        list: ["Events (Cues)", "Motion (Acting movements)", "Looks (Lines/Speech)"]
      },
      analogy: {
        title: "Think of Scratch as:",
        items: [
          { text: "Lego building blocks", icon: "blocks" },
          { text: "A theatrical stage", icon: "stage" },
          { text: "Actors (Sprites)", icon: "sprites" },
          { text: "Script instructions", icon: "script" }
        ],
        text: "Just as you snap Lego bricks together to build a castle, in Scratch you snap logic blocks together to build a script that makes characters move and speak."
      },
      howItWorks: "Scratch replaces typed code syntax (like semicolons and parentheses) with visual colored blocks. Each block color represents a category (blue for Motion, yellow for Events, orange for Control). Stacking blocks from top to bottom tells the computer the exact sequence of actions to execute.",
      deeperDive: "In Scratch, every character on screen is called a Sprite. Sprites have their own scripts, costumes, and sounds. Stacking an event block (like 'when green flag clicked') at the top of a script tells the engine to run the attached blocks in order when that specific trigger occurs.",
      advanced: "Scratch compiles visual block stacks into JSON structures that are executed by an interpreter written in HTML5 and WebGL. It uses event listeners, coordinate mapping engines, and multi-threaded script execution to run parallel loops for multiple sprites simultaneously.",
      vocab: [
        { term: "Scratch", definition: "A block-based coding language designed for learning programming logic." },
        { term: "Sprite", definition: "A character or object in a Scratch project that can be programmed." },
        { term: "Block", definition: "A visual coding block that represents an instruction or code structure." },
        { term: "Script", definition: "A stack of snapped-together blocks that defines a sprite's actions." }
      ],
      funFacts: [
        "Scratch was developed by the Lifelong Kindergarten Group at the MIT Media Lab, led by Mitchel Resnick in 2007.",
        "The language is named 'Scratch' after the technique used by hip-hop DJs to scratch records and mix sounds together.",
        "Scratch is used by millions of kids in over 200 countries and is translated into more than 70 languages."
      ],
      misconceptions: [
        { misconception: "Scratch is not 'real' programming.", truth: "Scratch teaches real programming logic: loops, variables, conditions, and event handling. The only difference is that you drag blocks instead of typing syntax." },
        { misconception: "You can only build simple animations.", truth: "You can build complex games, physics engines, calculators, and interactive art in Scratch if you stack blocks creatively." }
      ],
      visualLearning: {
        description: "The diagram shows the Scratch editor workspace layout: Blocks Palette, Script Canvas, Stage, and Sprite List.",
        notice: [
          "Observe how blocks must snap under an event cap block to run.",
          "Different colors represent distinct programming categories."
        ]
      },
      quiz: [
        { q: "What is a character or object in Scratch called?", opts: ["Actor", "Sprite", "Element", "Node"], a: "Sprite" },
        { q: "Which group developed Scratch?", opts: ["Google Education", "MIT Media Lab", "Microsoft Coding", "Stanford CS"], a: "MIT Media Lab" },
        { q: "What starts a script execution in Scratch?", opts: ["A closing block", "An event block (like Green Flag)", "A variable block", "A math block"], a: "An event block (like Green Flag)" }
      ],
      criticalThinking: [
        "Why is it easier to learn coding with blocks instead of typing text in languages like Java?",
        "What happens if you have two separate scripts starting with 'when green flag clicked' on the same sprite?"
      ],
      miniProjects: [
        { title: "Block Explorer", desc: "Visit scratch.mit.edu. Create a free account, open a new project, and explore the different categories of blocks on the left panel." },
        { title: "Script Outline", desc: "Write out a script in plain English for a sprite that walks to a wall, bounces, and changes color." }
      ],
      teacherNotes: {
        objectives: ["Define what Scratch is and identify its interface components.", "Assemble a simple script using Events, Motion, and Looks blocks.", "Explain the concept of a Sprite."],
        prep: ["Ensure student accounts are created or project is open on screen."],
        prompts: ["What would you like to build first in Scratch?", "Why do blocks have different shapes?"]
      },
      diagram: {
        components: [
          { id: "blocks", name: "Blocks Palette", category: "IDE", icon: "settings", shape: "rounded-rect", x: 40, y: 80, w: 110, h: 56, purpose: "Holds categorized logic blocks", description: "The panel containing Motion, Looks, Sound, and Control blocks.", why: "The library of coding elements", analogy: "Toolbox of Lego parts", funFact: "Blocks are color-coded: blue for motion, purple for looks", takeaway: "Drag blocks from here to code", mistake: "Blocks here cannot run until dragged to script canvas", descriptionDetailed: "Library UI component holding pre-configured block types." },
          { id: "canvas", name: "Script Canvas", category: "IDE", icon: "code", shape: "rounded-rect", x: 200, y: 80, w: 110, h: 56, purpose: "Workspace for stacking scripts", description: "The workspace where you snap blocks together to write scripts.", why: "Where active programming happens", analogy: "Lego construction baseplate", funFact: "You can write independent script stacks on the same canvas", takeaway: "Blocks execute from top to bottom in stacks", mistake: "Floating blocks that aren't connected to events won't execute", descriptionDetailed: "The active drag-and-drop workspace container mapping block coordinates." },
          { id: "stage", name: "The Stage", category: "IDE", icon: "monitor", shape: "rounded-rect", x: 360, y: 80, w: 110, h: 56, purpose: "Displays visual animations", description: "The rendering viewport displaying coordinates, sprites, and animations.", why: "Allows observing program results", analogy: "Theatrical theater stage", funFact: "The Scratch stage is a grid: 480 pixels wide by 360 pixels high", takeaway: "Visual coordinates guide character movements", mistake: "Sprites can wander off the stage if boundary limits aren't coded", descriptionDetailed: "WebGL canvas rendering sprite transformations and stage backgrounds." }
        ],
        connections: [
          { from: "blocks", to: "canvas" },
          { from: "canvas", to: "stage" }
        ],
        steps: [
          { id: "blocks", label: "Step 1: Pick Blocks", status: "Drag a block from the Blocks Palette on the left." },
          { id: "canvas", label: "Step 2: Stack Code", status: "Snap blocks together on the Script Canvas, starting with an Event." },
          { id: "stage", label: "Step 3: Run Script", status: "Click Green Flag. Stage displays character movements and bubbles." }
        ],
        tour: [
          { title: "Blocks Palette", description: "Your library of coding blocks.", componentId: "blocks" },
          { title: "Script Canvas", description: "The grid workspace where you snap code blocks.", componentId: "canvas" },
          { title: "The Stage", description: "Visual viewport showing running game loops.", componentId: "stage" }
        ]
      }
    }
  ]
};

const scrTitles = [
  "", "",
  "The Scratch Interface", "Sprites and Stage", "Motion Blocks", "Looks Blocks",
  "Sound Blocks", "Events", "Loops", "Conditions",
  "Variables", "Broadcast Messages", "Simple Game Logic", "Animation Projects",
  "Build Your Own Game"
];
const scrSlugs = [
  "", "",
  "the-scratch-interface", "sprites-and-stage", "motion-blocks", "looks-blocks",
  "sound-blocks", "events", "loops", "conditions",
  "variables", "broadcast-messages", "simple-game-logic", "animation-projects",
  "build-your-own-game"
];
const scrTypes = [
  "", "",
  "explorer", "explorer", "builder", "lab",
  "lab", "builder", "builder", "tree",
  "lab", "flow", "builder", "builder",
  "builder"
];
const scrIcons = [
  "", "",
  "settings", "monitor", "cable", "settings",
  "printer", "cable", "cable", "network",
  "database", "mail", "cable", "monitor",
  "browser"
];
const scrSubtitles = [
  "", "",
  "Navigating panels and coding grids", "Configuring coordinates, background stages, and characters", "Steering characters through steps and degrees", "Changing sprite costumes and adding bubble dialogues",
  "Adding sound clips and configuring pitch effects", "Starting scripts with inputs and flag triggers", "Repeating actions using count and forever loops", "Checking sprite attributes using if-then nodes",
  "Creating memory slots to save user scores", "Sending signal flags between sprites", "Building collider bounds and point loops", "Animating costume steps and moving cycles",
  "Assembling your custom clicker game code scripts"
];
const scrDefinitions = [
  "", "",
  "The Scratch interface comprises the Block Palette, Script Area, Stage, Sprite List, and Backdrop Pane, organized for seamless visual coding.",
  "Sprites are the programmable objects on screen, while the Stage is the coordinate grid (-240 to 240 X, -180 to 180 Y) where they act.",
  "Motion blocks are code instructions that change a sprite's position (steps, slide to coordinates) or orientation (turn degrees).",
  "Looks blocks control a sprite's appearance, enabling costume changes, speech bubbles, scale modifications, and color filter effects.",
  "Sound blocks are instructions that play audio files, adjust volume percentages, or change pitch rate metrics.",
  "Event blocks are hat-shaped triggers that start execution threads when inputs (clicks, key presses) occur.",
  "Loops are control structures (Repeat, Forever) that rerun a stack of attached instructions multiple times.",
  "Conditions are control structures (If-Then, If-Then-Else) that execute code paths only when specified criteria (sensing touch, comparisons) are true.",
  "Variables are labeled memory boxes that store variable values (like scores, coordinates, or timers) that can change during execution.",
  "Broadcast messages are invisible signals sent from one sprite that trigger specific events on other sprites across the project.",
  "Game logic combines events, motion, loops, variable updates, and sensing checks to build playable interactive mechanics.",
  "Animation projects utilize rapid costume switches, loops, and coordinate shifts to create the illusion of smooth motion.",
  "Building a game involves designing layouts, mapping score variables, programming loops, and debugging collision scripts."
];

for (let i = 2; i <= 14; i++) {
  module8.chapters.push({
    num: i,
    title: scrTitles[i],
    slug: scrSlugs[i],
    type: scrTypes[i],
    icon: scrIcons[i],
    subtitle: scrSubtitles[i],
    definition: scrDefinitions[i],
    example: {
      text: `Just as you coordinate actions in real life, ${scrTitles[i]} works by structuring logic commands in sequence:`,
      steps: [
        `Register the trigger event block.`,
        `Run calculations or movements within a continuous control block.`,
        `Update values or graphics on the stage viewport.`
      ],
      list: ["Trigger event", "Logic evaluation", "Visual update"]
    },
    analogy: {
      title: `Think of ${scrTitles[i]} as:`,
      items: [
        { text: "Director script", icon: "script" },
        { text: "Grid movements", icon: "grid" },
        { text: "Trigger alarms", icon: "trigger" },
        { text: "Costume racks", icon: "wardrobe" }
      ],
      text: `Just as an actor changes costume or walks across the theater grid on cue, ${scrTitles[i]} dictates sprite behavior.`
    },
    howItWorks: `The Scratch engine interprets ${scrTitles[i]} by compiling the visual blocks into executable runtime threads. For each cycle, it updates coordinates, evaluates conditions, and repaint sprites.`,
    deeperDive: `Managing ${scrTitles[i]} requires understanding thread execution. In Scratch, multiple scripts can run in parallel, meaning a 'forever' loop checks sensing parameters while a separate event handler moves the sprite.`,
    advanced: `At the code level, ${scrTitles[i]} blocks are processed as asynchronous functions inside the browser page. The interpreter handles variables using scope mappings and coordinates using float coordinates mapped to WebGL pixel coordinates.`,
    vocab: [
      { term: scrTitles[i], definition: "The primary technological concept explaining how components interact within the context of Scratch Programming." },
      { term: "Coordinate Grid", definition: "The X and Y plane representing the Stage layout coordinates." },
      { term: "Hat Block", definition: "A block with a rounded top that registers events to launch scripts." },
      { term: "Sensing Block", definition: "A block that checks for collisions, touch parameters, or mouse pointer coordinates." }
    ],
    funFacts: [
      `Using ${scrTitles[i]} blocks prevents syntax compiler issues entirely.`,
      `Over 100 million Scratch projects have been shared on the public educational repository.`,
      `The coding ideas behind Scratch are used by university students to learn fundamental syntax concepts.`
    ],
    misconceptions: [
      { misconception: "Sprites can only execute one script stack at a time.", truth: "A single sprite can have multiple scripts running simultaneously, starting from different events or the same event." },
      { misconception: "Variables are shared across all sprites by default.", truth: "You can create variables that belong 'For this sprite only', isolating data from other elements." }
    ],
    visualLearning: {
      description: `The diagram displays the interactive components of ${scrTitles[i]} and how they link inside the Scratch compilation chain.`,
      notice: [
        "Check how block inputs map to variables and control paths.",
        "Click on components to see details about coordinate alignment."
      ]
    },
    quiz: [
      { q: `What is the main role of ${scrTitles[i]}?`, opts: ["To save system data on disks", "To orchestrate behaviors and controls visually", "To connect internet cables", "To generate HTML web tags"], a: "To orchestrate behaviors and controls visually" },
      { q: "Which block shape starts a script stack in Scratch?", opts: ["Flat block", "Hat block (curved top)", "Diamond block", "Oval block"], a: "Hat block (curved top)" },
      { q: "What is the maximum X coordinate limit on the stage?", opts: ["180", "240", "360", "480"], a: "240" }
    ],
    criticalThinking: [
      `How does changing X coordinates differ from changing Y coordinates when positioning sprites?`,
      `Why do you think games need variables to track scores instead of displaying raw text?`
    ],
    miniProjects: [
      { title: "Block Stacker", desc: "Open the Scratch editor and write a script to move a character back and forth across the stage forever." },
      { title: "Grid Navigator", desc: "Write down the X and Y coordinates of the center, top-right, and bottom-left points of the stage." }
    ],
    teacherNotes: {
      objectives: [`Explain the purpose of ${scrTitles[i]}.`, "Construct control stacks to steer coordinates.", "Manage variables and event loops."],
      prep: ["Prepare basic project templates with pre-loaded sprites."],
      prompts: ["How do coordinates help us animate characters?", "What games can you create using variables and collision sensing?"]
    },
    diagram: {
      components: [
        { id: "node1", name: "Event Block", category: "Events", icon: "cable", shape: "rounded-rect", x: 40, y: 80, w: 110, h: 56, purpose: "Starts script execution", description: "Hat block launching threads on triggers.", why: "Orchestration driver", analogy: "Start signal gun", funFact: "Runs asynchronously when clicked", takeaway: "Launches attached block stack", mistake: "Does not perform actions on its own", descriptionDetailed: "Event listener registration node." },
        { id: "node2", name: "Control Loop", category: "Control", icon: "settings", shape: "rounded-rect", x: 200, y: 80, w: 110, h: 56, purpose: "Iterates execution steps", description: "Loops like repeat or forever running code blocks.", why: "Enables repeated behaviors", analogy: "Revolving carousel", funFact: "Forever loops run at 30 frames per second yield", takeaway: "Repeats calculations", mistake: "Can cause infinite freezes if conditions aren't met", descriptionDetailed: "Control pipeline evaluation thread." },
        { id: "node3", name: "Stage Display", category: "Visuals", icon: "monitor", shape: "diamond", x: 360, y: 80, w: 110, h: 56, purpose: "Paints sprite coordinates", description: "Renders graphics based on variables and positions.", why: "Displays game changes", analogy: "Cinema projector screen", funFact: "Updated instantly after each logic loop", takeaway: "Displays final graphics", mistake: "Will show delayed movements if loop logic is bloated", descriptionDetailed: "Graphics update pipeline node." }
      ],
      connections: [
        { from: "node1", to: "node2" },
        { from: "node2", to: "node3" }
      ],
      steps: [
        { id: "node1", label: "Step 1: Event Clicked", status: "Event block captures green flag click, initializing thread execution." },
        { id: "node2", label: "Step 2: Loop Cycle", status: "Control loop cycles through motion and variable checks." },
        { id: "node3", label: "Step 3: Update Screen", status: "Stage re-renders sprite coordinates, showing character animations." }
      ],
      tour: [
        { title: "Event Block", description: "Captures triggers to start scripts.", componentId: "node1" },
        { title: "Control Loop", description: "Coordinates repetitive actions.", componentId: "node2" },
        { title: "Stage Display", description: "Shows visual animations to users.", componentId: "node3" }
      ]
    }
  });
}

module.exports = module8;
