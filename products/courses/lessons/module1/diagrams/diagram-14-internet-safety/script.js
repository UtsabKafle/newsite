(function(){'use strict';
var components = [
  {id:"firewall",name:"Software Firewall",category:"Security",icon:"firewall",shape:"rounded-rect",x:149,y:12,w:100,h:50,purpose:"Monitors and controls incoming and outgoing network traffic based on security rules",description:"A firewall examines data packets and blocks those that don\\'t meet security rules, protecting your device from unauthorized access.",why:"Firewalls are your first shield against hackers and malicious traffic",analogy:"Like a bouncer at a club checking IDs and only letting authorized people in",funFact:"Windows includes a built-in firewall that\\'s been part of the OS since XP SP2",takeaway:"A firewall is essential for blocking unauthorized access to your computer",mistake:"A firewall can\\'t stop threats that originate from inside your network",descriptionDetailed:"Software firewalls inspect traffic at the application layer and can block programs from accessing the Internet. They use rules based on ports, protocols, and application signatures."},
  {id:"encryption",name:"Encryption",category:"Security",icon:"lock",shape:"rounded-rect",x:268,y:56,w:100,h:50,purpose:"Scrambles data so only authorized parties can read it",description:"Encryption uses algorithms and keys to transform readable data into unreadable ciphertext that can only be decrypted with the correct key.",why:"Encryption protects your private data even if it\\'s intercepted",analogy:"Like writing a letter in a secret code that only the recipient can decode",funFact:"End-to-end encryption means even the service provider can\\'t read your messages",takeaway:"Always look for HTTPS in the URL to ensure your data is encrypted in transit",mistake:"Encrypted data can still be leaked—it\\'s just unreadable without the key",descriptionDetailed:"Symmetric encryption uses one key for encryption and decryption (AES). Asymmetric encryption uses a public-private key pair (RSA, ECC). TLS/SSL uses both: asymmetric for key exchange and symmetric for bulk data."},
  {id:"vpn",name:"Virtual Private Network",category:"Security",icon:"shield",shape:"rounded-rect",x:251,y:164,w:100,h:50,purpose:"Creates an encrypted tunnel between your device and a remote server, hiding your traffic",description:"A VPN encrypts all your Internet traffic and routes it through a server in a location you choose, masking your real IP address.",why:"VPNs protect your privacy on public Wi-Fi and hide your online activity from your ISP",analogy:"Like a private, enclosed walkway that protects you from view as you travel",funFact:"VPNs were originally invented to connect corporate offices securely over the Internet",takeaway:"A VPN encrypts all your traffic but you must trust the VPN provider with your data",mistake:"VPNs don\\'t make you anonymous—the VPN provider can still see your traffic",descriptionDetailed:"VPNs create an encrypted tunnel using protocols like OpenVPN, WireGuard, or IPsec. All traffic is encrypted and sent through this tunnel to the VPN server, which then forwards it to the Internet."},
  {id:"antivirus",name:"Antivirus Software",category:"Security",icon:"search",shape:"rounded-rect",x:64,y:164,w:100,h:50,purpose:"Detects, prevents, and removes malicious software from your computer",description:"Antivirus software scans files, monitors system behavior, and uses signature databases to identify and block known and unknown malware.",why:"Antivirus protects against malware that can steal data, encrypt files, or take over your system",analogy:"Like an immune system that identifies and neutralizes invading pathogens",funFact:"The first antivirus program was created in 1987 to fight the Brain virus",takeaway:"Antivirus is essential but isn\\'t 100% effective—safe browsing habits matter too",mistake:"Antivirus doesn\\'t catch everything—zero-day attacks can bypass signature-based detection",descriptionDetailed:"Antivirus uses signature-based detection, heuristic analysis, and machine learning. Real-time protection scans files when accessed. Modern suites include ransomware protection and web filtering."},
  {id:"auth",name:"Authentication",category:"Security",icon:"key",shape:"rounded-rect",x:149,y:100,w:100,h:50,purpose:"Verifies that you are who you claim to be before granting access",description:"Authentication uses passwords, biometrics, or security keys to confirm your identity, often with multiple factors for stronger security.",why:"Authentication prevents unauthorized access to your accounts and data",analogy:"Like showing your ID card and entering a PIN to access a secure building",funFact:"The most common password is still 123456—used by millions of people",takeaway:"Multi-factor authentication is the single most effective security measure you can enable",mistake:"A strong password isn\\'t enough—MFA is essential to protect against credential theft",descriptionDetailed:"Single-factor uses something you know (password). Two-factor adds something you have (phone, security key) or something you are (fingerprint, face)."},
  {id:"backup",name:"Data Backup",category:"Security",icon:"database",shape:"rounded-rect",x:30,y:56,w:100,h:50,purpose:"Creates copies of important files to recover from data loss or ransomware",description:"Backups save copies of your files to external drives, cloud storage, or network locations, allowing you to restore them if originals are lost.",why:"Backups are your last defense against ransomware, hardware failure, and accidental deletion",analogy:"Like making photocopies of important documents and storing them in a safe place",funFact:"Ransomware attacks increased by 300% in recent years, making backups more critical than ever",takeaway:"Follow the 3-2-1 rule: 3 copies, 2 different media, 1 off-site backup",mistake:"Backups must be tested—untested backups are just wishes",descriptionDetailed:"Backup strategies include full, incremental, and differential backups. Cloud backups provide off-site protection against physical disasters."}
];
var connections = [{from:"firewall",to:"encryption"},{from:"encryption",to:"vpn"},{from:"vpn",to:"antivirus"},{from:"antivirus",to:"auth"},{from:"auth",to:"backup"}];
var steps = [{label:"Step 1: Software Firewall",status:"Exploring: Software Firewall - Monitors and controls incoming and outgoing network traffic based on security rules"},{label:"Step 2: Encryption",status:"Exploring: Encryption - Scrambles data so only authorized parties can read it"},{label:"Step 3: Virtual Private Network",status:"Exploring: Virtual Private Network - Creates an encrypted tunnel between your device and a remote server, hiding your traffic"},{label:"Step 4: Antivirus Software",status:"Exploring: Antivirus Software - Detects, prevents, and removes malicious software from your computer"},{label:"Step 5: Authentication",status:"Exploring: Authentication - Verifies that you are who you claim to be before granting access"},{label:"Step 6: Data Backup",status:"Exploring: Data Backup - Creates copies of important files to recover from data loss or ransomware"}];
var tour = [{title:"Software Firewall",description:"Monitors and controls incoming and outgoing network traffic based on security rules",componentId:"firewall"},{title:"Encryption",description:"Scrambles data so only authorized parties can read it",componentId:"encryption"},{title:"Virtual Private Network",description:"Creates an encrypted tunnel between your device and a remote server, hiding your traffic",componentId:"vpn"},{title:"Antivirus Software",description:"Detects, prevents, and removes malicious software from your computer",componentId:"antivirus"},{title:"Authentication",description:"Verifies that you are who you claim to be before granting access",componentId:"auth"},{title:"Data Backup",description:"Creates copies of important files to recover from data loss or ransomware",componentId:"backup"}];

deferInit(function(){
  new DiagramEngine({
    title: 'Internet Safety',
    subtitle: 'How Internet Works',
    desc: 'Learn about firewalls, encryption, VPNs, and security best practices.',
    components: components,
    connections: connections,
    steps: steps,
    tour: tour,
    packetFlow: [
      {label:'Traffic Scan',color:'#22c55e'},
      {label:'Encrypt',color:'#60a5fa'},
      {label:'Tunnel',color:'#c084fc'},
      {label:'Threat Detect',color:'#f59e0b'},
      {label:'Authenticate',color:'#22c55e'}
    ],

    render: function(container, engine) {
      engine.buildVisual(container);
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
        var shape = bg.querySelector(':scope > :first-child');
        if(!shape)return;
        shape.setAttribute('fill', i === idx ? '#1e2d50' : '#1a2235');
        shape.setAttribute('stroke', i === idx ? '#0959C8' : '#2a3a55');
      });
    },

    onReplay: function(engine) {
      engine.t = 0;
    }
  });
});
})();