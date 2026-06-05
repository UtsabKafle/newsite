(function(){'use strict';
var components = [
  {id:"device",name:"Your Device",category:"End Point",icon:"laptop",shape:"rounded-rect",x:50,y:35,w:110,h:56,purpose:"Initiates a connection to the network by sending and receiving wireless signals",description:"Your smartphone, laptop, or tablet uses a wireless network adapter to communicate with the Wi-Fi router.",why:"The device is the starting point of every Internet connection",analogy:"Like a radio that both broadcasts and receives signals",funFact:"A smartphone has at least seven different radios inside it",takeaway:"Your device must authenticate with the network before getting Internet access",mistake:"Airplane mode disables all wireless radios, not just cellular",descriptionDetailed:"The device's wireless NIC scans for available Wi-Fi networks by sending probe requests. Once a network is selected, the device goes through authentication and association phases using WPA3 or WPA2 encryption. The DHCP client then requests an IP address from the router."},
  {id:"wifi",name:"Wi-Fi Signal",category:"Network",icon:"wifi",shape:"pill",x:180,y:35,w:110,h:56,purpose:"Provides wireless connectivity between devices and the network",description:"Wi-Fi uses radio waves in the 2.4 GHz and 5 GHz bands to transmit data between your device and the router.",why:"Wi-Fi enables cable-free connectivity throughout your home or office",analogy:"Like a cordless phone that uses radio waves instead of wires",funFact:"Wi-Fi signals can travel through walls but are weakened by concrete and metal",takeaway:"Wi-Fi range and speed depend on frequency, obstacles, and interference",mistake:"Wi-Fi stands for Wireless Fidelity, but it was never officially an acronym",descriptionDetailed:"Wi-Fi uses IEEE 802.11 standards with different generations (Wi-Fi 6, Wi-Fi 7) offering increasing speeds. The 2.4 GHz band travels farther but is slower and more congested, while 5 GHz is faster but has shorter range. MIMO technology uses multiple antennas to improve throughput."},
  {id:"router",name:"Network Router",category:"Network",icon:"router",shape:"hexagon",x:310,y:35,w:110,h:56,purpose:"Acts as the central hub connecting local devices to the Internet",description:"The router connects your home network to the Internet, directing traffic between your devices and the ISP.",why:"The router manages all the devices in your home and connects them to the outside world",analogy:"Like a traffic officer directing cars at a busy intersection",funFact:"Most home routers can handle 50+ devices simultaneously",takeaway:"Your router creates a local network and acts as a gateway to the Internet",mistake:"Your router's speed affects your whole home network performance",descriptionDetailed:"The router performs Network Address Translation to share a single public IP among multiple devices. It runs DHCP to assign local IPs, DNS forwarding for name resolution, and typically includes a firewall, switch, and wireless access point all in one unit. Advanced routers support VLANs, QoS, and VPN passthrough."},
  {id:"isp",name:"Internet Service Provider",category:"Network",icon:"cloud",shape:"cloud-shape",x:180,y:130,w:110,h:56,purpose:"Provides the physical connection from your home to the global Internet",description:"The ISP maintains the cables, fiber, or satellite links that carry your data between your home and the rest of the Internet.",why:"Your ISP is the bridge between your home network and the entire Internet",analogy:"Like a utility company that provides water to your house from the main supply",funFact:"Some ISPs offer speeds up to 10 Gbps using fiber optic technology",takeaway:"Your connection speed depends on your ISP's infrastructure and your plan",mistake:"Switching ISPs often requires different hardware like modems",descriptionDetailed:"ISPs manage the last-mile connection to your home, which can be DSL (over phone lines), cable (over coax), fiber (FTTH), fixed wireless, or satellite. The ISP's head-end connects to larger regional networks and ultimately to the Internet backbone through peering agreements."},
  {id:"modem",name:"Cable Modem",category:"Hardware",icon:"modem",shape:"rounded-rect",x:310,y:130,w:110,h:56,purpose:"Converts signals between your home network and your ISP's infrastructure",description:"The modem translates digital data from your network into signals that travel over your ISP's physical lines.",why:"Without a modem, your router can't communicate with your ISP",analogy:"Like a translator who converts between two languages",funFact:"Cable modems can use the same lines as cable TV without interference",takeaway:"The modem type depends on your Internet connection technology",mistake:"You don't need a separate modem if you have fiber Internet (ONT replaces it)",descriptionDetailed:"A cable modem uses DOCSIS standards to send data over coaxial cables. It demodulates incoming RF signals from the ISP into digital data and modulates outgoing digital data into RF signals. DOCSIS 3.1 supports speeds up to 10 Gbps downstream and 1 Gbps upstream."}
];
var connections = [{from:"device",to:"wifi"},{from:"wifi",to:"router"},{from:"router",to:"isp"},{from:"isp",to:"modem"}];
var steps = [{id:"device",label:"Step 1: Your Device",status:"Exploring: Your Device - Initiates a connection to the network by sending and receiving wireless signals"},{id:"wifi",label:"Step 2: Wi-Fi Signal",status:"Exploring: Wi-Fi Signal - Provides wireless connectivity between devices and the network"},{id:"router",label:"Step 3: Network Router",status:"Exploring: Network Router - Acts as the central hub connecting local devices to the Internet"},{id:"isp",label:"Step 4: Internet Service Provider",status:"Exploring: Internet Service Provider - Provides the physical connection from your home to the global Internet"},{id:"modem",label:"Step 5: Cable Modem",status:"Exploring: Cable Modem - Converts signals between your home network and your ISP's infrastructure"}];
var tour = [{title:"Your Device",description:"Initiates a connection to the network by sending and receiving wireless signals",componentId:"device"},{title:"Wi-Fi Signal",description:"Provides wireless connectivity between devices and the network",componentId:"wifi"},{title:"Network Router",description:"Acts as the central hub connecting local devices to the Internet",componentId:"router"},{title:"Internet Service Provider",description:"Provides the physical connection from your home to the global Internet",componentId:"isp"},{title:"Cable Modem",description:"Converts signals between your home network and your ISP's infrastructure",componentId:"modem"}];

deferInit(function(){
  new DiagramEngine({
    title: 'Device Connection',
    subtitle: 'How Internet Works',
    desc: 'See how your device connects to the Internet through Wi-Fi, routers, ISPs, and modems.',
    module: 1,
    difficulty: 'Beginner',
    time: '10',
    objectives: 'Understand how your device connects through Wi-Fi, routers, and modems.',
    components: components,
    connections: connections,
    steps: steps,
    tour: tour,
    packetFlow: [
      {label:'Wi-Fi Signal',color:'#22c55e'},
      {label:'Auth Request',color:'#60a5fa'},
      {label:'DHCP Request',color:'#c084fc'},
      {label:'Connection',color:'#f59e0b'}
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

    customChallenge: function(container, engine) {
      // Interactive Network Playground Challenge
      container.innerHTML = `
        <div class="sim-interactive-area">
          <div style="font-size: 13px; font-weight: 600; color: #60a5fa; margin-bottom: 8px;">Network Playground: Build a working Internet Connection</div>
          <p style="font-size: 11px; color: #94a3b8; margin-bottom: 12px;">Arrange components from left to right to build a path from Your Device to the Internet backbone.</p>
          
          <div class="sim-sidebar" id="play-palette">
            <div class="sim-card" draggable="true" data-type="wifi">📡 Wi-Fi Signal</div>
            <div class="sim-card" draggable="true" data-type="router">📟 Network Router</div>
            <div class="sim-card" draggable="true" data-type="modem">📠 Cable Modem</div>
            <div class="sim-card" draggable="true" data-type="isp">☁️ ISP Backbone</div>
          </div>
          
          <div class="sim-canvas" style="display:flex; justify-content:space-around; align-items:center; padding: 20px;">
            <div class="glass-panel" style="padding: 10px; text-align: center; border-color:#3b82f6;">
              <span style="font-size:20px;">💻</span>
              <div style="font-size: 9px; font-weight:bold; margin-top:4px;">Your Device</div>
            </div>
            <div class="conn-slot" data-slot="0" style="width:90px; height:60px; border:2px dashed rgba(255,255,255,0.15); border-radius:8px; display:flex; align-items:center; justify-content:center; font-size:10px; color:#64748b;">Drop slot 1</div>
            <div class="conn-slot" data-slot="1" style="width:90px; height:60px; border:2px dashed rgba(255,255,255,0.15); border-radius:8px; display:flex; align-items:center; justify-content:center; font-size:10px; color:#64748b;">Drop slot 2</div>
            <div class="conn-slot" data-slot="2" style="width:90px; height:60px; border:2px dashed rgba(255,255,255,0.15); border-radius:8px; display:flex; align-items:center; justify-content:center; font-size:10px; color:#64748b;">Drop slot 3</div>
            <div class="conn-slot" data-slot="3" style="width:90px; height:60px; border:2px dashed rgba(255,255,255,0.15); border-radius:8px; display:flex; align-items:center; justify-content:center; font-size:10px; color:#64748b;">Drop slot 4</div>
          </div>
          
          <div class="sim-controls-panel">
            <button class="act-btn" id="sim-test-conn" style="background:#0959C8; border-color:#3b82f6;">⚡ Test Connection</button>
            <button class="act-btn" id="sim-reset" style="background:none;">Reset</button>
            <span id="sim-feedback" style="font-size:11px; font-weight:600; color:#94a3b8; margin-left: 8px;"></span>
          </div>
        </div>
      `;

      var userSlots = [null, null, null, null];
      var correctOrder = ["wifi", "router", "modem", "isp"];
      var itemsMap = {
        wifi: "📡 Wi-Fi Signal",
        router: "📟 Network Router",
        modem: "📠 Cable Modem",
        isp: "☁️ ISP Backbone"
      };

      var cards = container.querySelectorAll('.sim-card');
      cards.forEach(function(card) {
        card.addEventListener('dragstart', function(e) {
          e.dataTransfer.setData('text/plain', this.dataset.type);
        });
        
        // Touch events for mobile
        card.addEventListener('touchstart', function(e) {
          this.dataset.touchType = this.dataset.type;
        }, {passive:true});
        card.addEventListener('touchend', function(e) {
          var touch = e.changedTouches[0];
          var targetEl = document.elementFromPoint(touch.clientX, touch.clientY);
          var slot = targetEl ? targetEl.closest('.conn-slot') : null;
          if (slot) {
            placeItem(this.dataset.touchType, parseInt(slot.dataset.slot));
          }
        });
      });

      var slots = container.querySelectorAll('.conn-slot');
      slots.forEach(function(slot) {
        slot.addEventListener('dragover', function(e) {
          e.preventDefault();
          this.style.borderColor = "#3b82f6";
          this.style.background = "rgba(9,89,200,0.05)";
        });
        slot.addEventListener('dragleave', function() {
          this.style.borderColor = "rgba(255,255,255,0.15)";
          this.style.background = "transparent";
        });
        slot.addEventListener('drop', function(e) {
          e.preventDefault();
          this.style.borderColor = "rgba(255,255,255,0.15)";
          this.style.background = "transparent";
          var type = e.dataTransfer.getData('text/plain');
          placeItem(type, parseInt(this.dataset.slot));
        });
      });

      function placeItem(type, idx) {
        // remove old placements of same type
        var oldIdx = userSlots.indexOf(type);
        if (oldIdx !== -1) {
          userSlots[oldIdx] = null;
          slots[oldIdx].textContent = "Drop slot " + (oldIdx + 1);
          slots[oldIdx].style.color = "#64748b";
          slots[oldIdx].style.borderColor = "rgba(255,255,255,0.15)";
        }
        
        userSlots[idx] = type;
        slots[idx].textContent = itemsMap[type];
        slots[idx].style.color = "#fff";
        slots[idx].style.borderColor = "#3b82f6";

        // Remove from palette visual
        var palCard = container.querySelector('#play-palette [data-type="' + type + '"]');
        if (palCard) palCard.style.display = "none";
      }

      var feedback = container.querySelector('#sim-feedback');

      container.querySelector('#sim-test-conn').addEventListener('click', function() {
        var completed = true;
        for (var i = 0; i < 4; i++) {
          if (userSlots[i] !== correctOrder[i]) {
            completed = false;
          }
        }
        
        if (completed) {
          feedback.style.color = "#10b981";
          feedback.textContent = "✓ Successful connection! Data packets are flowing smoothly from Device to the Backbone.";
          engine.markCompleted();
        } else {
          feedback.style.color = "#ef4444";
          feedback.textContent = "✗ Connection Failed. Check if the ordering of signal propagation is correct.";
        }
      });

      container.querySelector('#sim-reset').addEventListener('click', function() {
        userSlots = [null, null, null, null];
        slots.forEach(function(s, idx) {
          s.textContent = "Drop slot " + (idx + 1);
          s.style.color = "#64748b";
          s.style.borderColor = "rgba(255,255,255,0.15)";
        });
        cards.forEach(function(c) {
          c.style.display = "block";
        });
        feedback.textContent = "";
      });
    },

    onReplay: function(engine) {
      engine.t = 0;
    }
  });
});
})();
