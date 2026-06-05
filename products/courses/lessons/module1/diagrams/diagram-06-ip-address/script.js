(function(){'use strict';
var components = [
  {id:"ipv4",name:"IPv4 Address",category:"Network",icon:"globe",shape:"pill",x:50,y:20,w:110,h:50,purpose:"Identifies devices on a network using a 32-bit numeric label",description:"IPv4 addresses are written as four decimal numbers separated by dots, like 192.168.1.1, and provide about 4.3 billion unique addresses.",why:"IPv4 is the addressing system that the Internet was built on",analogy:"Like a street address made of house number, street, city, and zip code",funFact:"All 4.3 billion IPv4 addresses were officially exhausted in 2019",takeaway:"IPv4 addresses are running out, which is why IPv6 was created",mistake:"192.168.x.x addresses aren\\'t public?'they\\'re reserved for private networks",descriptionDetailed:"An IPv4 address has 32 bits divided into four octets, each ranging from 0 to 255. The address is split into a network portion and a host portion, determined by the subnet mask. Public IPv4 addresses are assigned by IANA and regional registries, while private ranges are for local use."},
  {id:"ipv6",name:"IPv6 Address",category:"Network",icon:"globe",shape:"pill",x:300,y:20,w:110,h:50,purpose:"Identifies devices using a 128-bit address to solve IPv4 exhaustion",description:"IPv6 addresses are written as eight groups of four hex digits, like 2001:0db8:85a3::8a2e:0370:7334, offering trillions of addresses.",why:"IPv6 ensures the Internet can continue growing for generations",analogy:"Like expanding from a 4-digit ZIP code to one with enough combinations for every grain of sand",funFact:"IPv6 has 340 undecillion addresses?'enough for every atom on Earth\\'s surface 100 times over",takeaway:"IPv6 is the future of Internet addressing, but adoption is still ongoing",mistake:"IPv6 isn\\'t just IPv4 with more numbers?'it has a completely different header structure",descriptionDetailed:"IPv6 addresses are 128 bits, providing 2^128 unique addresses. IPv6 eliminates NAT, restores end-to-end connectivity, and includes built-in IPsec security. The transition uses dual-stack and tunneling mechanisms."},
  {id:"subnet",name:"Subnet Mask",category:"Network",icon:"filter",shape:"rounded-rect",x:50,y:135,w:110,h:50,purpose:"Divides an IP address into network and host portions for routing efficiency",description:"The subnet mask tells routers which part of an IP identifies the network and which part identifies specific devices on that network.",why:"Subnets organize networks into manageable segments and reduce broadcast traffic",analogy:"Like a ZIP code that identifies a region vs. the street number identifying a specific house",funFact:"CIDR notation like /24 represents the number of bits in the network portion",takeaway:"Subnet masks are essential for routing packets to the right network",mistake:"Subnet masks are not part of the IP address?'they\\'re a separate setting",descriptionDetailed:"A subnet mask is a 32-bit number where network bits are set to 1 and host bits to 0. For example, 255.255.255.0 means the first 24 bits are the network. Subnetting allows network administrators to create smaller, more efficient network segments."},
  {id:"gateway",name:"Default Gateway",category:"Network",icon:"router",shape:"rounded-rect",x:300,y:135,w:110,h:50,purpose:"Acts as the exit point from a local network to other networks",description:"The default gateway is the router\\'s IP address that your device sends packets to when the destination is outside your local network.",why:"Without a gateway, your device can only communicate within its own network",analogy:"Like the front door of your building that you must leave through to go elsewhere",funFact:"The default gateway is usually the first or last usable IP in a subnet",takeaway:"Every device needs a default gateway to access the Internet",mistake:"The gateway isn\\'t a physical device?'it\\'s the IP address of your router",descriptionDetailed:"When a device determines the destination is not on its local subnet, it forwards the packet to the default gateway\\'s MAC address. The gateway then routes the packet to the next hop. Multiple gateways can be configured for redundancy using protocols like VRRP."},
  {id:"dhcp",name:"DHCP Server",category:"Network",icon:"server",shape:"cylinder",x:175,y:85,w:110,h:50,purpose:"Automatically assigns IP addresses and network configuration to devices",description:"The Dynamic Host Configuration Protocol server hands out IP addresses, subnet masks, gateways, and DNS servers to devices when they connect.",why:"DHCP eliminates the need to manually configure every device on a network",analogy:"Like a valet who parks your car and gives you a ticket instead of you finding a spot yourself",funFact:"DHCP leases are temporary?'devices must renew periodically to keep their IP",takeaway:"DHCP makes connecting to a network as simple as plugging in a cable",mistake:"DHCP doesn\\'t assign a permanent IP unless configured for a static reservation",descriptionDetailed:"DHCP uses a four-step process: Discover, Offer, Request, and Acknowledge. Leases have configurable durations, and the server can provide options like DNS, NTP, and domain names."},
  {id:"nat",name:"Network Address Translation",category:"Network",icon:"network",shape:"rounded-rect",x:175,y:220,w:110,h:50,purpose:"Maps multiple private IP addresses to a single public IP address",description:"NAT allows many devices on a private network to share one public IP address by rewriting packet headers as they pass through the router.",why:"NAT conserves IPv4 addresses and adds a layer of privacy",analogy:"Like a company mailroom that receives packages and delivers them to the correct employee",funFact:"NAT is the reason your devices have IPs like 192.168.x.x instead of public ones",takeaway:"NAT lets hundreds of devices share one public IP address",mistake:"NAT is not a security feature, though it does hide internal IPs",descriptionDetailed:"NAT maintains a translation table mapping each private IP and port to the public IP and a unique port number. When a response arrives, the router looks up the port in the table to forward it to the correct internal device."}
];
var connections = [{from:"ipv4",to:"ipv6"},{from:"ipv6",to:"subnet"},{from:"subnet",to:"gateway"},{from:"gateway",to:"dhcp"},{from:"dhcp",to:"nat"}];
var steps = [{label:"Step 1: IPv4 Address",status:"Exploring: IPv4 Address - Identifies devices on a network using a 32-bit numeric label"},{label:"Step 2: IPv6 Address",status:"Exploring: IPv6 Address - Identifies devices using a 128-bit address to solve IPv4 exhaustion"},{label:"Step 3: Subnet Mask",status:"Exploring: Subnet Mask - Divides an IP address into network and host portions for routing efficiency"},{label:"Step 4: Default Gateway",status:"Exploring: Default Gateway - Acts as the exit point from a local network to other networks"},{label:"Step 5: DHCP Server",status:"Exploring: DHCP Server - Automatically assigns IP addresses and network configuration to devices"},{label:"Step 6: Network Address Translation",status:"Exploring: Network Address Translation - Maps multiple private IP addresses to a single public IP address"}];
var tour = [{title:"IPv4 Address",description:"Identifies devices on a network using a 32-bit numeric label",componentId:"ipv4"},{title:"IPv6 Address",description:"Identifies devices using a 128-bit address to solve IPv4 exhaustion",componentId:"ipv6"},{title:"Subnet Mask",description:"Divides an IP address into network and host portions for routing efficiency",componentId:"subnet"},{title:"Default Gateway",description:"Acts as the exit point from a local network to other networks",componentId:"gateway"},{title:"DHCP Server",description:"Automatically assigns IP addresses and network configuration to devices",componentId:"dhcp"},{title:"Network Address Translation",description:"Maps multiple private IP addresses to a single public IP address",componentId:"nat"}];

deferInit(function(){
  new DiagramEngine({
    title: 'Ip Address',
    subtitle: 'How Internet Works',
    desc: 'Learn how IPv4, IPv6, subnet masks, gateways, and NAT work together.',
    module: 1,
    difficulty: 'Beginner',
    time: '10',
    objectives: 'Understand IP addressing, subnet masks, and network configuration.',
    components: components,
    connections: connections,
    steps: steps,
    tour: tour,
    packetFlow: [
      {label:'Address Lookup',color:'#22c55e'},
      {label:'Subnet Mask',color:'#60a5fa'},
      {label:'Gateway Route',color:'#c084fc'},
      {label:'DHCP Lease',color:'#f59e0b'},
      {label:'Network Config',color:'#22c55e'}
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
