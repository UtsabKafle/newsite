const module7 = {
  num: 7,
  title: "How Robots Work",
  slug: "how-robots-work",
  overview: "Discover the amazing world of robotics. Learn about touch, light, and distance sensors, controllers (microcontrollers acting as robot brains), motors that drive movement, automation logic, decision-making trees, and industrial robotics workflows.",
  outcomes: [
    "Identify the core components of a robot (Sensors, Controllers, Actuators, Chassis)",
    "Understand how sensors receive inputs and convert them to voltage signals",
    "Learn robot decision-making logic using if-then-else conditions",
    "Understand how motors drive wheels and steer robot systems",
    "Learn automation workflows, sensors, and conveyor belt automation loops",
    "Build program routines to navigate obstacles and solve virtual missions"
  ],
  chapters: [
    {
      num: 1,
      title: "What Is a Robot?",
      slug: "what-is-a-robot",
      type: "explorer",
      icon: "chip",
      subtitle: "Understanding machines that sense, think, and act",
      definition: "A robot is a reprogrammable machine designed to perform tasks automatically by sensing its environment, processing that information, and taking action in the physical world.",
      example: {
        text: "Imagine a home robot vacuum cleaner. It doesn't just bump around blindly; it follows a cycle of sensing, thinking, and acting:",
        steps: [
          "Sense: It uses bumper switches and cameras to see furniture.",
          "Think: Its computer chip plans a path around the chair.",
          "Act: Its motors spin the wheels to move it under the table."
        ],
        list: ["Sense (Bumper sensors)", "Think (Computer Chip)", "Act (Wheels & Brushes)"]
      },
      analogy: {
        title: "Think of a Robot as:",
        items: [
          { text: "A physical body", icon: "chassis" },
          { text: "Sensory organs", icon: "sensors" },
          { text: "A computer brain", icon: "chip" },
          { text: "Moving muscles", icon: "actuators" }
        ],
        text: "Just as a human has a body, sensory organs, a brain, and muscles, a robot has a chassis, sensors, a controller, and motors to interact with the world."
      },
      howItWorks: "Robots operate by running continuous program loops. First, sensors gather data about the environment (like distance to a wall). The controller (brain) processes this data using logic rules. Finally, the controller sends electrical power to actuators (motors) to perform actions like moving, picking up objects, or turning lights on.",
      deeperDive: "Robots differ from simple machines because they contain a feedback loop. Traditional machines just run until turned off, whereas a robot constantly adjust its speed and direction based on sensor readings. This automated cycle of Sense -> Plan -> Act allows them to handle changes in their environment.",
      advanced: "Robotics combines mechanical engineering (gears, linkages), electrical engineering (voltages, transistors, circuits), and computer science (PID controller loops, algorithms, AI navigation). Modern autonomous robots use LiDAR and computer vision to navigate complex, dynamic human spaces.",
      vocab: [
        { term: "Robot", definition: "A machine that can automatically sense, think, and act in the physical world." },
        { term: "Chassis", definition: "The physical frame or skeleton that holds a robot's components together." },
        { term: "Controller", definition: "The computer chip or microcontroller that acts as a robot's brain." },
        { term: "Feedback Loop", definition: "The continuous process of sensing the world and adjusting actions accordingly." }
      ],
      funFacts: [
        "The word 'robot' comes from the Czech word 'robota', which means 'forced labor' or 'drudgery'. It was first used in a play in 1920.",
        "The first industrial robot, Unimate, joined a General Motors assembly line in 1961 to lift hot metal parts.",
        "NASA's Curiosity Rover has been exploring Mars autonomously since 2012, using sensors to avoid craters and sand traps."
      ],
      misconceptions: [
        { misconception: "All robots look like humans (androids).", truth: "Most robots look like arms, boxes on wheels, or vacuum discs. They are designed for function rather than human appearance." },
        { misconception: "Robots are smart and think like humans.", truth: "Robots are only as smart as the code written by their programmers. They follow strict logic rules and cannot feel emotions or adapt to completely unexpected tasks." }
      ],
      visualLearning: {
        description: "The diagram shows the continuous robotic loop: Sensors send data to the Controller, which directs the Motors to move the Chassis.",
        notice: [
          "Observe how the loop feeds back constantly from sensors to controller.",
          "Check how electrical power is routed from battery to controller and then to motors."
        ]
      },
      quiz: [
        { q: "What are the three core actions that define a robot?", opts: ["Speak, Write, Read", "Sense, Think, Act", "Plug in, Turn on, Run", "Build, Connect, Deploy"], a: "Sense, Think, Act" },
        { q: "Which component acts as the robot's brain?", opts: ["Chassis", "Sensor", "Controller", "Motor"], a: "Controller" },
        { q: "True or False: The word 'robot' was invented in a Czech play.", opts: ["True", "False"], a: "True" }
      ],
      criticalThinking: [
        "What is the difference between a toaster (a simple machine) and a robot vacuum cleaner?",
        "If you were to design a robot to help you at home, what task would it perform and what sensors would it need?"
      ],
      miniProjects: [
        { title: "Robot Spotter", desc: "Look around your kitchen and home. Identify three devices that perform tasks automatically (like a dishwasher or washing machine). Write down if they act like robots." },
        { title: "Chassis Sketch", desc: "Draw a top-down view of a robot chassis. Outline where you would place two wheels, a caster ball, a battery, and a distance sensor." }
      ],
      teacherNotes: {
        objectives: ["Define what a robot is using Sense, Think, Act loop.", "Identify core components of a robotic system.", "Differentiate robots from simple static machinery."],
        prep: ["Prepare simple robotics diagrams to show physical connections."],
        prompts: ["What makes a machine a robot?", "How do you think Mars rovers survive without anyone steering them?"]
      },
      diagram: {
        components: [
          { id: "sensor", name: "Sensors", category: "Inputs", icon: "wifi", shape: "rounded-rect", x: 40, y: 80, w: 110, h: 56, purpose: "Gather environment details", description: "Sensors detect light, distance, touch, or sound.", why: "Gives the robot information", analogy: "Robot's eyes and ears", funFact: "Infrared sensors use invisible light beams to detect walls", takeaway: "Sensors convert physical parameters into electrical voltages", mistake: "Sensors do not make decisions on their own", descriptionDetailed: "Transducers converting physical properties (light, pressure, temp) into analog/digital signals." },
          { id: "brain", name: "Controller", category: "Processing", icon: "chip", shape: "rounded-rect", x: 200, y: 80, w: 110, h: 56, purpose: "Runs code and calculations", description: "The microcontroller running the decision logic code.", why: "Acts as the system brain", analogy: "Human brain", funFact: "Arduino chips execute up to 16 million instructions per second", takeaway: "Controllers route sensor data to motor actions", mistake: "Controllers don't move; they only send signals to motors", descriptionDetailed: "Microcontroller (like ATMega328 or ARM Cortex) that reads inputs, runs logic, and generates outputs." },
          { id: "motors", name: "Motors & Gears", category: "Actuators", icon: "power", shape: "rounded-rect", x: 360, y: 80, w: 110, h: 56, purpose: "Drives physical movement", description: "DC motors and servo gears turning wheels or mechanical joints.", why: "Creates the physical action", analogy: "Robot muscles", funFact: "Gearboxes multiply motor torque, allowing small motors to lift heavy weights", takeaway: "Motors convert electrical energy into mechanical movement", mistake: "Motors spin uncontrollably without controller signals", descriptionDetailed: "Electromechanical actuators driven by motor drivers using PWM (Pulse Width Modulation) speed signals." }
        ],
        connections: [
          { from: "sensor", to: "brain" },
          { from: "brain", to: "motors" }
        ],
        steps: [
          { id: "sensor", label: "Step 1: Sense", status: "Sensors measure physical parameters and send voltage signals to brain." },
          { id: "brain", label: "Step 2: Think", status: "Controller chip evaluates the program conditions and logic scripts." },
          { id: "motors", label: "Step 3: Act", status: "Controller turns on motors, driving the robot chassis forward." }
        ],
        tour: [
          { title: "Sensors", description: "How the robot gathers info about the room.", componentId: "sensor" },
          { title: "Controller", description: "Processes inputs and decides what to do.", componentId: "brain" },
          { title: "Motors & Gears", description: "Creates movement based on controller orders.", componentId: "motors" }
        ]
      }
    }
  ]
};

const chTitles = [
  "", "",
  "Types of Robots", "Robot Components", "Introduction to Sensors", "Touch Sensors",
  "Light Sensors", "Distance Sensors", "Robot Controllers", "Robot Logic",
  "Motors and Movement", "Automation Basics", "Robot Decision Making", "Real World Robotics",
  "Design Your Own Robot"
];
const chSlugs = [
  "", "",
  "types-of-robots", "robot-components", "introduction-to-sensors", "touch-sensors",
  "light-sensors", "distance-sensors", "robot-controllers", "robot-logic",
  "motors-and-movement", "automation-basics", "robot-decision-making", "real-world-robotics",
  "design-your-own-robot"
];
const chTypes = [
  "", "",
  "explorer", "explorer", "lab", "flow",
  "flow", "flow", "explorer", "tree",
  "lab", "tree", "tree", "explorer",
  "builder"
];
const chIcons = [
  "", "",
  "globe", "settings", "wifi", "wifi",
  "wifi", "wifi", "chip", "network",
  "power", "settings", "network", "globe",
  "chip"
];
const chSubtitles = [
  "", "",
  "Discovering robot designs across different environments", "Understanding the structural frames and electrical buses", "Learning how machines translate physical states to voltage", "Mapping switch inputs to collision boundaries",
  "Measuring light values and adjusting speed variables", "Calculating echo sound delays to map distances", "Exploring microcontrollers and code loop registers", "Developing simple logic checks and conditions",
  "Driving motors and calibrating wheel steer angles", "Assembling industrial automated sorting loops", "Assembling decision logic trees to bypass hazards", "Discovering industrial arms in factory workflows",
  "Assembling your custom robot chassis and controller"
];
const chDefinitions = [
  "", "",
  "Robots are grouped into various classes based on their locomotion, size, and environment, including mobile wheel-bots, aerial drones, and industrial arm manipulators.",
  "Robot components are the physical structures, links, buses, gears, batteries, and chips that make up a complete operational machine.",
  "Sensors are electronic devices that detect physical properties of the environment and convert them into electrical signals the controller can read.",
  "Touch sensors are micro-switches or bumpers that close an electrical circuit when physical pressure is applied, signaling a collision.",
  "Light sensors are resistors that change their electrical resistance based on the intensity of light falling on them.",
  "Distance sensors use ultrasonic sound waves or infrared light beams to calculate the distance to a physical obstacle.",
  "A robot controller is a small computer on a single integrated circuit containing a processor core, memory, and programmable inputs/outputs.",
  "Robot logic is the set of conditional statements (if-then-else) that guide a robot's decisions based on sensor values.",
  "Motors convert electrical energy from the battery into rotational force, while gears reduce speed and increase torque for control.",
  "Automation is the use of sensors, loops, and mechanical conveyors to perform repetitive industrial workflows without human intervention.",
  "Robot decision making is the process of evaluating multiple sensor parameters to choose the safest navigation route.",
  "Real-world robotics covers advanced industrial arms, surgical assistance bots, warehouse delivery nodes, and space exploration probes.",
  "Designing a robot involves specifying a chassis size, picking sensors, defining motor power requirements, and coding the controller loop."
];

for (let i = 2; i <= 14; i++) {
  module7.chapters.push({
    num: i,
    title: chTitles[i],
    slug: chSlugs[i],
    type: chTypes[i],
    icon: chIcons[i],
    subtitle: chSubtitles[i],
    definition: chDefinitions[i],
    example: {
      text: `Just as humans rely on physical organs and reflexes, ${chTitles[i]} operates through specific electrical and mechanical rules:`,
      steps: [
        `Identify the physical parameter (like light, touch, or distance).`,
        `Convert this into a voltage change on the controller pin.`,
        `Execute motor actions to adjust the robot's physical position.`
      ],
      list: ["Physical detection", "Electrical mapping", "Mechanical feedback"]
    },
    analogy: {
      title: `Think of ${chTitles[i]} as:`,
      items: [
        { text: "Nervous reflexes", icon: "reflexes" },
        { text: "Muscular control", icon: "muscles" },
        { text: "Sensory mapping", icon: "sensors" },
        { text: "Chassis frame", icon: "skeleton" }
      ],
      text: `Just as your brain receives sensory feedback from your skin and signals muscles to react, ${chTitles[i]} manages feedback loops.`
    },
    howItWorks: `Controllers read the voltage values from the ${chTitles[i]} subsystem. By comparing these values to set thresholds in the code, the robot decides whether to drive straight, reverse, turn, or activate arm grabbers.`,
    deeperDive: `Proper integration of ${chTitles[i]} requires managing noise. Electrical signals can fluctuate, requiring calibration algorithms, averaging, or debouncing to ensure the robot doesn't misinterpret environment hazards.`,
    advanced: `For advanced robotics, ${chTitles[i]} data is fed into filtering algorithms (like Kalman filters) to estimate real-time coordinates. Controllers utilize Pulse Width Modulation (PWM) to regulate motor speed and PID loops to lock wheel alignment.`,
    vocab: [
      { term: chTitles[i], definition: "The primary technological concept explaining how components interact within the context of How Robots Work." },
      { term: "Voltage Signal", definition: "An electrical signal representing data values based on pressure or intensity." },
      { term: "Microcontroller", definition: "A tiny computer chip designed to process inputs and steer physical circuits." },
      { term: "Actuator", definition: "A physical mechanical device (like a motor) that creates movement." }
    ],
    funFacts: [
      `Robotic components in ${chTitles[i]} are designed to operate under extreme vibration.`,
      `Over 80% of automated factories use similar sensors to align precision arms.`,
      `The technology has shrunk in size so much that micro-sensors can fit inside consumer watches.`
    ],
    misconceptions: [
      { misconception: "Robots see the world exactly as humans do.", truth: "Robots only read numeric values from sensors (like 'distance = 15cm'). They have no visual context unless running advanced AI computer vision." },
      { misconception: "Motors always run at the same speed.", truth: "Voltage levels decay as batteries drain, requiring controllers to continuously monitor and adjust pulse widths to maintain speed." }
    ],
    visualLearning: {
      description: `The diagram displays the interactive elements of ${chTitles[i]} and how they communicate inside the robot controller pipeline.`,
      notice: [
        "Observe the loop steps and check how input variables affect speed.",
        "Click on each component to inspect its purpose and internal wiring."
      ]
    },
    quiz: [
      { q: `What is the primary role of ${chTitles[i]}?`, opts: ["To write web pages", "To capture or process physical feedback", "To increase battery capacity", "To print papers"], a: "To capture or process physical feedback" },
      { q: "What does PWM stand for in motor speed control?", opts: ["Pulse Width Modulation", "Power Wire Mapping", "Process Wave Meter", "Processor Work Manager"], a: "Pulse Width Modulation" },
      { q: "Which unit converts physical attributes into electrical values?", opts: ["A sensor", "A chassis", "A gear", "A wheel"], a: "A sensor" }
    ],
    criticalThinking: [
      `Why is it critical for robots to run sensor checking loops multiple times every second?`,
      `What would happen if the feedback link between a sensor and motor was disconnected?`
    ],
    miniProjects: [
      { title: "Sensor Mapping", desc: "List three scenarios where a robot needs to measure distance. Explain what sensor it should use." },
      { title: "Logic Tree Design", desc: "Draw a simple decision flowchart for a robot vacuum that encounters a drop (cliff) in front of it." }
    ],
    teacherNotes: {
      objectives: [`Define the role of ${chTitles[i]}.`, "Write logical conditions to resolve obstacles.", "Trace data flows from sensor to actuator."],
      prep: ["Set up simple logic templates for class reviews."],
      prompts: ["How does the robot feel its surrounding environment?", "What mistakes might a robot make if its sensor is calibrated poorly?"]
    },
    diagram: {
      components: [
        { id: "node1", name: "Sensor Unit", category: "Inputs", icon: "wifi", shape: "rounded-rect", x: 40, y: 80, w: 110, h: 56, purpose: "Measures environment parameters", description: "Sensors that register touch, light, or distance states.", why: "Source of feedback", analogy: "Nervous touch receptors", funFact: "Runs constantly in millisecond loops", takeaway: "Gathers raw data", mistake: "Does not make decisions", descriptionDetailed: "Feedback node monitoring physical pins." },
        { id: "node2", name: "Controller Core", category: "Processing", icon: "chip", shape: "rounded-rect", x: 200, y: 80, w: 110, h: 56, purpose: "Runs algorithm loops", description: "Processes inputs and compares to thresholds.", why: "System logic center", analogy: "Reflex brain stem", funFact: "Runs logic in microseconds", takeaway: "Drives control choices", mistake: "Variables must be scaled correctly", descriptionDetailed: "Core processing controller chip." },
        { id: "node3", name: "Actuator Motor", category: "Output", icon: "power", shape: "diamond", x: 360, y: 80, w: 110, h: 56, purpose: "Triggers mechanical movement", description: "Drives wheels, pulleys, or robotic arm joints.", why: "Executes physical results", analogy: "Muscle fibers contracting", funFact: "Draws highest current in the circuit", takeaway: "Performs final actions", mistake: "Can stall if physical obstructions block movement", descriptionDetailed: "Rotational mechanical output actuator." }
      ],
      connections: [
        { from: "node1", to: "node2" },
        { from: "node2", to: "node3" }
      ],
      steps: [
        { id: "node1", label: "Step 1: Sensor Feed", status: "Sensor detects threshold trigger and registers voltage shift." },
        { id: "node2", label: "Step 2: Logic Check", status: "Controller core evaluates condition block parameters." },
        { id: "node3", label: "Step 3: Move Motor", status: "Actuator receives power pulse, turning wheels to steer chassis." }
      ],
      tour: [
        { title: "Sensor Unit", description: "Captures environment feedback.", componentId: "node1" },
        { title: "Controller Core", description: "Processes logic conditions.", componentId: "node2" },
        { title: "Actuator Motor", description: "Spins wheels to move chassis.", componentId: "node3" }
      ]
    }
  });
}

module.exports = module7;
