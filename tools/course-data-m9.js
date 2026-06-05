const module9 = {
  num: 9,
  title: "Blockchain Technology",
  slug: "blockchain-technology",
  overview: "Understand how secure records are created and shared digitally without central authority. Study hashing, cryptographic signatures, distributed networks, consensus checking, and block tamper-proofing safety mechanics.",
  outcomes: [
    "Understand chronological records, transaction ledgers, and centralized downfalls",
    "Learn digital signatures using cryptographic public and private key pairs",
    "Understand SHA-256 hashes acting as unique digital fingerprints",
    "Explore peer-to-peer distributed ledger networks and network sync",
    "Learn consensus validation (Proof of Work) and mining math rules",
    "Understand block tamper-proofing and chain integrity validation checks"
  ],
  chapters: [
    {
      num: 1,
      title: "What Is a Record?",
      slug: "what-is-a-record",
      type: "explorer",
      icon: "database",
      subtitle: "Understanding how information is tracked over time",
      definition: "A record is a piece of written or digital evidence that documents an event, a transaction, or information, allowing it to be verified and tracked chronologically.",
      example: {
        text: "Imagine you borrow a book from a library. The librarian writes down your name, the book title, and the date in a ledger. This is a record:",
        steps: [
          "It lists who participated (You and the library).",
          "It lists what happened (Book borrowed).",
          "It lists when it occurred (The date and time)."
        ],
        list: ["Participants (Who)", "Transaction (What)", "Timestamp (When)"]
      },
      analogy: {
        title: "Think of a Record as:",
        items: [
          { text: "A receipt slip", icon: "receipt" },
          { text: "A diary entry", icon: "diary" },
          { text: "A score log sheet", icon: "log" },
          { text: "A medical record", icon: "medical" }
        ],
        text: "Just as a grocery receipt proves you paid for your milk at a specific time, a digital record proves that a transaction or action occurred online."
      },
      howItWorks: "Records store data in tables or ledgers. A basic digital record contains a header (metadata like timestamp and index) and a body (the actual information). To maintain trust, records must be saved in a way that prevents anyone from altering the history of what happened.",
      deeperDive: "In modern database systems, records are stored as rows in a table. In financial systems, these records are called ledgers. Ledgers track the flow of money, properties, or assets between accounts. If a record is edited, the ledger is no longer trustworthy, which is why audit logs are kept.",
      advanced: "Digital record security relies on cryptography and hash chains. Database transactions must satisfy ACID properties (Atomicity, Consistency, Isolation, Durability) to guarantee that records are written reliably. Ledgers utilize append-only structures to ensure historical records cannot be modified without detection.",
      vocab: [
        { term: "Record", definition: "A documented piece of data representing an action or transaction." },
        { term: "Ledger", definition: "A book or database tracking financial transactions and balances." },
        { term: "Timestamp", definition: "A digital label indicating the exact date and time a record was written." },
        { term: "Immutable", definition: "Something that can never be modified or altered once created." }
      ],
      funFacts: [
        "The oldest known written records are clay tables from ancient Mesopotamia, dating back over 5,000 years, used to track beer and grain taxes.",
        "Today, data centers write trillions of new digital records every second, tracking everything from mouse clicks to bank card swipes.",
        "Double-entry bookkeeping, invented in medieval Italy, is the record system that still runs modern global finance."
      ],
      misconceptions: [
        { misconception: "All digital records are permanent.", truth: "Most traditional digital databases allow administrators to delete or edit records. These records are not naturally permanent unless protected by special cryptographic systems." },
        { misconception: "Editing a record is always bad.", truth: "In general databases, we edit records (like correcting a misspelled name) regularly. However, in financial ledgers, editing past entries is forbidden; instead, we must write a new correcting record." }
      ],
      visualLearning: {
        description: "The diagram shows a chronological ledger adding new transaction records sequentially with timestamps.",
        notice: [
          "Observe how each new record is appended to the bottom, leaving previous records untouched.",
          "Check how the timestamp links each transaction to a specific block of time."
        ]
      },
      quiz: [
        { q: "What is the primary purpose of a ledger?", opts: ["To style webpages", "To track and document transactions", "To increase network speed", "To translate domain names"], a: "To track and document transactions" },
        { q: "What does it mean if a record is 'immutable'?", opts: ["It is written in multiple languages", "It can never be changed once written", "It is stored on a local phone", "It is deleted automatically"], a: "It can never be changed once written" },
        { q: "Which detail is always included in a secure record to prove when it happened?", opts: ["A font style", "A timestamp", "A user avatar", "A CSS class"], a: "A timestamp" }
      ],
      criticalThinking: [
        "Why is it dangerous if a bank administrator can edit your account balance record directly without creating a log?",
        "How did humans track ownership of land before computers and paper records were invented?"
      ],
      miniProjects: [
        { title: "Personal Ledger", desc: "Create a paper log of points. Write down 3 rows tracking imaginary points you give or receive from family members. Include columns for Sender, Receiver, Amount, and Time." },
        { title: "Receipt Audit", desc: "Examine a physical store receipt. Circle the three mandatory record components: Who, What, and When." }
      ],
      teacherNotes: {
        objectives: ["Define what a record is and its role in a ledger.", "Explain the importance of chronological timestamping.", "Understand the risk of record tampering in centralized systems."],
        prep: ["Prepare sample transaction receipts to show students."],
        prompts: ["How do we know someone paid for something online?", "Why can't we just erase errors in a bank ledger?"]
      },
      diagram: {
        components: [
          { id: "input", name: "Transaction Input", category: "Client", icon: "user", shape: "rounded-rect", x: 40, y: 80, w: 110, h: 56, purpose: "Generates transaction data", description: "Sender, receiver, and asset amount fields.", why: "Specifies the transaction details", analogy: "Filling out a check", funFact: "Millions of digital checkouts occur simultaneously worldwide", takeaway: "Transactions initiate database updates", mistake: "Inputs are not secure until processed", descriptionDetailed: "HTTP transaction request packet containing transaction details." },
          { id: "ledger", name: "Ledger Log", category: "Database", icon: "database", shape: "rounded-rect", x: 200, y: 80, w: 110, h: 56, purpose: "Stores records chronologically", description: "The sequential table tracking transaction balances.", why: "Houses the record history", analogy: "Library ledger book", funFact: "Ledgers must use append-only rules to maintain security", takeaway: "Ledgers write new entries at the bottom", mistake: "Traditional ledgers can be altered if database security is breached", descriptionDetailed: "Relational database table storing serialized transaction logs." },
          { id: "audit", name: "Audit Trail", category: "Security", icon: "shield", shape: "diamond", x: 360, y: 80, w: 110, h: 56, purpose: "Verifies record integrity", description: "Checks timestamps and logs to detect edits.", why: "Ensures trust in the ledger history", analogy: "Security cameras in a bank", funFact: "Cryptographic logs detect database alterations instantly", takeaway: "Auditing proves records haven't been tampered with", mistake: "Audits only detect changes; they do not prevent them unless backed by blockchain", descriptionDetailed: "Cryptographic logging daemon verifying data hashes." }
        ],
        connections: [
          { from: "input", to: "ledger" },
          { from: "ledger", to: "audit" }
        ],
        steps: [
          { id: "input", label: "Step 1: Write Transaction", status: "User sends transfer details. Client compiles transaction packet." },
          { id: "ledger", label: "Step 2: Append Log", status: "Database adds transaction row with index and chronological timestamp." },
          { id: "audit", label: "Step 3: Validate Record", status: "Auditing system checks signature logs to confirm entry is valid." }
        ],
        tour: [
          { title: "Transaction Input", description: "User enters transfer details.", componentId: "input" },
          { title: "Ledger Log", description: "Saves transaction entries in order.", componentId: "ledger" },
          { title: "Audit Trail", description: "Detects if past records have been altered.", componentId: "audit" }
        ]
      }
    }
  ]
};

const bcTitles = [
  "", "",
  "How Records Are Stored", "Problems with Traditional Records", "Introduction to Blockchain", "Blocks and Chains",
  "Transactions", "Digital Signatures", "Hashes", "Distributed Ledgers",
  "Network Verification", "Why Blockchain Is Secure", "Real World Blockchain Uses", "Future of Blockchain",
  "Build a Paper Blockchain"
];
const bcSlugs = [
  "", "",
  "how-records-are-stored", "problems-with-traditional-records", "introduction-to-blockchain", "blocks-and-chains",
  "transactions", "digital-signatures", "hashes", "distributed-ledgers",
  "network-verification", "why-blockchain-is-secure", "real-world-blockchain-uses", "future-of-blockchain",
  "build-a-paper-blockchain"
];
const bcTypes = [
  "", "",
  "explorer", "flow", "explorer", "builder",
  "flow", "lab", "lab", "flow",
  "tree", "flow", "explorer", "explorer",
  "builder"
];
const bcIcons = [
  "", "",
  "server", "shield", "database", "cable",
  "mail", "key", "key", "network",
  "network", "shield", "globe", "globe",
  "browser"
];
const bcSubtitles = [
  "", "",
  "Comparing server folders and database registries", "Analyzing centralized points of failure and tampered ledgers", "Discovering the trust network of block ledgers", "Linking blocks together with cryptographic link hashes",
  "Signing and transferring digital values across nodes", "Generating private key signatures and public lock keys", "Creating unique digital fingerprints using SHA-256", "Synchronizing peer-to-peer ledger copy nodes",
  "Verifying ledger records across network nodes", "Checking Proof of Work calculations and tamper blocks", "Discovering tracking chains and smart contract functions", "Exploring digital identity files and voting networks",
  "Simulating consensus steps in a paper classroom chain"
];
const bcDefinitions = [
  "", "",
  "Traditional record storage relies on centralized databases hosted on physical servers controlled by a single organization (like a bank or government).",
  "Centralized storage has vulnerabilities including data-altering admin access, single points of failure, and security breach points.",
  "A blockchain is a decentralized, shared digital ledger that stores records (blocks) across a peer-to-peer network without a central authority.",
  "Blocks are packets of transaction records, while the Chain is the cryptographic sequence linking each block to the hash of the previous one.",
  "A blockchain transaction is an authorized entry transferring ownership of an asset from one address to another, broadcast to all network nodes.",
  "Digital signatures use asymmetric cryptography (private and public keys) to authorize transactions securely without sharing private passwords.",
  "A hash is a cryptographic function (like SHA-256) that converts any input data into a fixed-length string acting as a unique digital fingerprint.",
  "A distributed ledger is a database that is replicated, shared, and synchronized across a network of nodes, with no central master copy.",
  "Network verification is the process where nodes audit incoming transactions to ensure senders have sufficient balances and correct keys.",
  "Blockchain security is maintained through consensus algorithms (like Proof of Work) and hash chaining that make editing historical blocks mathematically impossible.",
  "Real-world blockchain applications include secure cryptocurrency payments, transparent supply chains, and smart contract automation.",
  "Future blockchain technologies aim to support secure voting portals, digital identity keys, and decentralized domain naming platforms.",
  "Building a blockchain model involves writing transaction slips, calculating hashes manually, linking sheets, and verifying them in a group."
];

for (let i = 2; i <= 14; i++) {
  module9.chapters.push({
    num: i,
    title: bcTitles[i],
    slug: bcSlugs[i],
    type: bcTypes[i],
    icon: bcIcons[i],
    subtitle: bcSubtitles[i],
    definition: bcDefinitions[i],
    example: {
      text: `Just as communities establish trust through shared checks, ${bcTitles[i]} coordinates ledger validity using protocols:`,
      steps: [
        `Register the transaction using private signature keys.`,
        `Calculate the unique cryptographic block hash.`,
        `Broadcast this block to all distributed network nodes for verification.`
      ],
      list: ["Signature authorization", "Hash computation", "Consensus check"]
    },
    analogy: {
      title: `Think of ${bcTitles[i]} as:`,
      items: [
        { text: "Digital fingerprints", icon: "hash" },
        { text: "Locked mailboxes", icon: "keys" },
        { text: "Group photocopies", icon: "ledger" },
        { text: "Mining puzzle rules", icon: "mining" }
      ],
      text: `Just as having 100 people copy down a score makes it impossible for one person to cheat, ${bcTitles[i]} uses consensus to preserve truth.`
    },
    howItWorks: `Nodes in the network monitor incoming transaction broadcasts. When a transaction is validated, miners bundle it into a block, compute the cryptographic hash linking it to the previous block, and append it to their copy of the ledger.`,
    deeperDive: `This structure ensures immutability. If an attacker edits Block 2, its hash changes. Since Block 3 contains the old hash of Block 2, the link breaks. The entire subsequent chain becomes invalid, alerting other nodes to reject the edit.`,
    advanced: `Blockchain protocols rely on peer-to-peer socket systems and hashing functions. In Proof of Work, miners search for a 'nonce' value that, when hashed with the block header, produces a hash with a target number of leading zeros.`,
    vocab: [
      { term: bcTitles[i], definition: "The primary technological concept explaining how components interact within the context of Blockchain Technology." },
      { term: "Cryptographic Hash", definition: "A mathematical fingerprint that turns text into a secure code." },
      { term: "Proof of Work", definition: "A mining process requiring math calculations to secure the network ledger." },
      { term: "Consensus", definition: "An agreement protocol among distributed nodes to accept a new block." }
    ],
    funFacts: [
      `Changing a single letter in a block changes its ${bcTitles[i]} hash output completely.`,
      `Over 100,000 nodes actively sync the Bitcoin blockchain around the globe.`,
      `The concept of cryptographic blockchain chains was first proposed in 1991, decades before Bitcoin.`
    ],
    misconceptions: [
      { misconception: "Blockchain and Bitcoin are the same thing.", truth: "Bitcoin is a digital currency. Blockchain is the underlying database technology that makes Bitcoin and other platforms work." },
      { misconception: "Anyone can edit a block if they have administrator keys.", truth: "There are no administrator keys in a decentralized blockchain. Decisions are made by majority consensus of all nodes." }
    ],
    visualLearning: {
      description: `The diagram displays the interactive modules of ${bcTitles[i]} and how they maintain consensus inside the network blockchain.`,
      notice: [
        "Check how tampered block data invalidates all following blocks.",
        "Observe how public/private key pairs validate transaction signatures."
      ]
    },
    quiz: [
      { q: `What is the primary role of ${bcTitles[i]}?`, opts: ["To style webpage buttons", "To secure digital records and decentralize trust", "To increase router speeds", "To write robot sensor code"], a: "To secure digital records and decentralize trust" },
      { q: "What happens if a historical block's data is edited?", opts: ["The database runs faster", "Subsequent block hash links break", "The domain name resolves", "The CPU clock cycles multiply"], a: "Subsequent block hash links break" },
      { q: "Which hash algorithm is most commonly used in block verification?", opts: ["SHA-256", "HTTP", "CSS", "DNS"], a: "SHA-256" }
    ],
    criticalThinking: [
      `How does storing copies of a database on 1,000 computers prevent hackers from destroying the data?`,
      `Why do you think mining blocks requires doing hard mathematical calculations?`
    ],
    miniProjects: [
      { title: "Hash Checker", desc: "Use an online SHA-256 tool. Type your name, then change one letter to a capital. Write down how much the hash changed." },
      { title: "Paper Chain", desc: "Design three paper strips representing blocks. Write an index, some data, and link them by drawing connecting lines." }
    ],
    teacherNotes: {
      objectives: [`Define the role of ${bcTitles[i]}.`, "Explain cryptographic hashing and chain links.", "Understand how distributed network consensus functions."],
      prep: ["Set up simple hash demo portals for students to play with."],
      prompts: ["Why is a fingerprint unique? How is a digital hash like a fingerprint?", "What problems does decentralization solve?"]
    },
    diagram: {
      components: [
        { id: "node1", name: "Block Header", category: "Structure", icon: "database", shape: "rounded-rect", x: 40, y: 80, w: 110, h: 56, purpose: "Holds metadata and linkages", description: "Contains block number, nonce, prev-hash, and transaction data.", why: "Identifies the block unit", analogy: "Envelope cover details", funFact: "Includes the timestamp down to the second", takeaway: "Block header is hashed to lock data", mistake: "Editing header variables does not go unnoticed", descriptionDetailed: "Block data payload structure." },
        { id: "node2", name: "Hash Function", category: "Security", icon: "key", shape: "rounded-rect", x: 200, y: 80, w: 110, h: 56, purpose: "Computes digital fingerprints", description: "Processes data using SHA-256 algorithm.", why: "Locks record data", analogy: "Digital seal wax", funFact: "Always produces a 64-character hex string", takeaway: "Hashes are one-way only", mistake: "You cannot reconstruct original text from the hash string", descriptionDetailed: "SHA-256 algorithm computation node." },
        { id: "node3", name: "Linked Block", category: "Chain", icon: "monitor", shape: "diamond", x: 360, y: 80, w: 110, h: 56, purpose: "Secures subsequent chain link", description: "The next block containing the hash of the current one.", why: "Creates the tamper-proof link", analogy: "Locked chain links", funFact: "A break in one link invalidates all blocks that follow", takeaway: "Chaining ensures immutability", mistake: "Tampering with data in past blocks breaks all following hashes", descriptionDetailed: "Next sequence block referencing parent node." }
      ],
      connections: [
        { from: "node1", to: "node2" },
        { from: "node2", to: "node3" }
      ],
      steps: [
        { id: "node1", label: "Step 1: Pack Block", status: "Transactions are packaged into a block header with the previous block's hash." },
        { id: "node2", label: "Step 2: Calculate Hash", status: "SHA-256 function processes the block header, outputting a secure hash." },
        { id: "node3", label: "Step 3: Link Chain", status: "The calculated hash is stored in the next block's header, securing the link." }
      ],
      tour: [
        { title: "Block Header", description: "Stores transaction data and links.", componentId: "node1" },
        { title: "Hash Function", description: "Generates secure digital fingerprints.", componentId: "node2" },
        { title: "Linked Block", description: "Binds the blocks into an unbroken chain.", componentId: "node3" }
      ]
    }
  });
}

module.exports = module9;
