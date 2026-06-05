(function(){'use strict';
var components = [
  {id:"source",name:"Source Device",category:"End Point",icon:"laptop",shape:"rounded-rect",x:50,y:30,w:110,h:50,purpose:"Creates the data packet and sends it toward the destination",description:"The source device generates a packet with its own IP as the source and the destination's IP, then forwards it to the local router.",why:"Every data journey starts at a source device",analogy:"Like your house being the starting point for a package you ship",funFact:"The source device doesn't know the full route. Just the next hop",takeaway:"The source sets the destination address, but not the path taken",mistake:"Packets don't travel directly from source to destination. They hop through routers",descriptionDetailed:"The source device encapsulates the data with a TCP segment header and an IP packet header containing both source and destination addresses. It checks its routing table for the next hop IP and sends the packet to the default gateway. The source has no control over which path the packet takes through the network."},
  {id:"router1",name:"Router One",category:"Network",icon:"router",shape:"hexagon",x:180,y:30,w:110,h:50,purpose:"Receives the packet from the source and forwards it toward the backbone",description:"The first router examines the destination IP, looks up its routing table, and forwards the packet to the next router closer to the destination.",why:"The first router connects your local network to the broader Internet",analogy:"Like your local post office that sorts mail for out-of-town delivery",funFact:"Consumer routers typically handle 15-50 Mbps of routing through their CPU",takeaway:"Each router only knows the next hop, not the entire path",mistake:"Routers don't route by domain name. They route by IP address",descriptionDetailed:"Router1 performs a lookup on the destination IP in its forwarding table using the longest prefix match algorithm. It decrements the TTL field, recalculates the checksum, and rewrites the MAC address for the next hop. The packet is then queued on the appropriate outgoing interface."},
  {id:"router2",name:"Router Two",category:"Network",icon:"router",shape:"hexagon",x:310,y:30,w:110,h:50,purpose:"Acts as an intermediate hop, forwarding the packet across the network core",description:"The intermediate router receives the packet, performs another routing table lookup, and passes it further along toward the destination.",why:"Intermediate routers form the backbone that connects networks across continents",analogy:"Like a regional distribution center that routes packages between states",funFact:"Some backbone routers cost over $500,000 and process terabits per second",takeaway:"A packet may pass through many routers before reaching its destination",mistake:"Not all routers are equal. Backbone routers are far more powerful than home ones",descriptionDetailed:"Router2 uses dynamic routing protocols like OSPF or BGP to maintain its routing table. It can make real-time decisions based on network congestion, link failures, or policy rules. The packet's TTL is decremented again, and if it reaches zero, the packet is dropped."},
  {id:"router3",name:"Router Three",category:"Network",icon:"router",shape:"hexagon",x:180,y:125,w:110,h:50,purpose:"Routes the packet closer to its final destination network",description:"The third router receives the packet and routes it toward the destination's local network, potentially the destination's ISP.",why:"Router3 helps bring the packet from the backbone to the destination region",analogy:"Like a local delivery truck that takes packages from the depot to neighborhoods",funFact:"BGP routers maintain a routing table with over 900,000 routes",takeaway:"The path is dynamic and can change even while data is being transmitted",mistake:"Routers don't remember packets. Each one is routed independently",descriptionDetailed:"Router3's routing table now has more specific routes for the destination network. It may have learned these routes through BGP peering with the destination's ISP. The packet is now nearing the destination's local network segment."},
  {id:"destination",name:"Destination Device",category:"End Point",icon:"monitor",shape:"rounded-rect",x:310,y:125,w:110,h:50,purpose:"Receives the packet and reassembles it with others into the original data",description:"The destination device collects all the packets belonging to the same message, checks for errors, and reassembles them in order.",why:"The destination is where the data finally gets used",analogy:"Like the recipient of a package who opens it and checks the contents",funFact:"The destination sends back acknowledgment packets to confirm receipt",takeaway:"Packets can arrive out of order and must be reassembled correctly",mistake:"The destination doesn't just receive. It also acknowledges and requests retransmissions if needed",descriptionDetailed:"The destination's TCP stack checks each packet's sequence number and places it in the correct position in the receive buffer. Once all packets are received, the data is reassembled and passed to the application. Duplicate packets are discarded, and missing packets trigger retransmission requests."}
];
var connections = [{from:"source",to:"router1"},{from:"router1",to:"router2"},{from:"router2",to:"router3"},{from:"router3",to:"destination"}];
var steps = [{id:"source",label:"Step 1: Source Device",status:"Exploring: Source Device - Creates the data packet and sends it toward the destination"},{id:"router1",label:"Step 2: Router One",status:"Exploring: Router One - Receives the packet from the source and forwards it toward the backbone"},{id:"router2",label:"Step 3: Router Two",status:"Exploring: Router Two - Acts as an intermediate hop, forwarding the packet across the network core"},{id:"router3",label:"Step 4: Router Three",status:"Exploring: Router Three - Routes the packet closer to its final destination network"},{id:"destination",label:"Step 5: Destination Device",status:"Exploring: Destination Device - Receives the packet and reassembles it with others into the original data"}];
var tour = [{title:"Source Device",description:"Creates the data packet and sends it toward the destination",componentId:"source"},{title:"Router One",description:"Receives the packet from the source and forwards it toward the backbone",componentId:"router1"},{title:"Router Two",description:"Acts as an intermediate hop, forwarding the packet across the network core",componentId:"router2"},{title:"Router Three",description:"Routes the packet closer to its final destination region",componentId:"router3"},{title:"Destination Device",description:"Receives the packet and reassembles it with others into the original data",componentId:"destination"}];

deferInit(function(){
  new DiagramEngine({
    title: 'Packets',
    subtitle: 'How Internet Works',
    desc: 'Watch how data is broken into packets and routed across a network.',
    module: 1,
    difficulty: 'Beginner',
    time: '10',
    objectives: 'Learn how data is broken into packets and routed across networks.',
    components: components,
    connections: connections,
    steps: steps,
    tour: tour,
    packetFlow: [
      {label:'Packet 1',color:'#22c55e'},
      {label:'Hop 1',color:'#60a5fa'},
      {label:'Hop 2',color:'#c084fc'},
      {label:'Hop 3',color:'#f59e0b'}
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
      // Packet Journey Simulator Challenge
      container.innerHTML = `
        <div class="sim-interactive-area" style="padding: 18px;">
          <div style="font-size:14px; font-weight:700; color:#60a5fa; margin-bottom:6px;">Packet Journey Simulator</div>
          <p style="font-size:11px; color:#94a3b8; margin-bottom:12px;">Simulate file splitting and packet switching over an unstable network with TCP retransmission.</p>
          
          <div style="display:flex; gap:16px; margin-bottom:12px; flex-wrap:wrap; align-items:center;">
            <div>
              <label style="font-size:10px; font-weight:bold; color:#64748b; text-transform:uppercase;">File Size</label>
              <select class="sim-input" id="sim-file-size" style="margin-left:6px;">
                <option value="3">Small File (3 Packets)</option>
                <option value="6" selected>Medium File (6 Packets)</option>
                <option value="10">Large File (10 Packets)</option>
              </select>
            </div>
            <div>
              <label style="font-size:10px; font-weight:bold; color:#64748b; text-transform:uppercase;">Packet Loss Rate</label>
              <select class="sim-input" id="sim-loss-rate" style="margin-left:6px;">
                <option value="0">0% (Perfect Connection)</option>
                <option value="0.2">20% (Typical Mobile)</option>
                <option value="0.4">40% (High Congestion)</option>
              </select>
            </div>
            <button class="act-btn" id="sim-send-btn" style="background:#0959C8; border-color:#3b82f6;">🚀 Transmit File</button>
          </div>
          
          <!-- Transmit Canvas -->
          <div class="sim-canvas" style="display:flex; flex-direction:column; justify-content:space-between; padding:20px; overflow-y:auto; min-height:220px;">
            <div style="display:flex; justify-content:space-between; font-size:12px; font-weight:bold;">
              <span>Source Device (Client)</span>
              <span>Destination Server</span>
            </div>
            <div id="sim-packet-stream" style="position:relative; flex-grow:1; display:flex; align-items:center; justify-content:space-between; margin: 20px 0; min-height: 80px;">
              <div style="font-size:32px;">💻</div>
              <div id="sim-network-mesh" style="position:absolute; left:60px; right:60px; top:0; bottom:0; display:flex; justify-content:space-around; align-items:center;">
                <!-- Mock Routers -->
                <div class="glass-panel" style="padding:6px; font-size:10px; border-color:#64748b;">Router A</div>
                <div class="glass-panel" style="padding:6px; font-size:10px; border-color:#64748b;">Router B</div>
              </div>
              <div style="font-size:32px;">🖥️</div>
            </div>
            <div id="sim-assembly-buffer" style="display:flex; gap:4px; padding:8px; background:rgba(0,0,0,0.2); border-radius:6px; min-height:40px; align-items:center; justify-content:center;">
              <span style="font-size:11px; color:#64748b;">Assembly buffer waiting for packets...</span>
            </div>
          </div>
          
          <div style="margin-top:8px; display:flex; justify-content:space-between; align-items:center;">
            <span id="sim-packets-feedback" style="font-size:11px; font-weight:600; color:#cbd5e1;">Select options and click Transmit.</span>
          </div>
        </div>
      `;

      var sendBtn = container.querySelector('#sim-send-btn');
      var feedback = container.querySelector('#sim-packets-feedback');
      var buffer = container.querySelector('#sim-assembly-buffer');
      var canvas = container.querySelector('#sim-packet-stream');

      sendBtn.addEventListener('click', function() {
        var count = parseInt(container.querySelector('#sim-file-size').value);
        var lossRate = parseFloat(container.querySelector('#sim-loss-rate').value);
        runPacketSimulation(count, lossRate);
      });

      function runPacketSimulation(count, lossRate) {
        sendBtn.disabled = true;
        buffer.innerHTML = "";
        feedback.style.color = "#cbd5e1";
        feedback.textContent = "Splitting file into packets and transmitting...";

        var arrived = {};
        var list = [];
        for (var i = 0; i < count; i++) {
          list.push({ seq: i, attempts: 0 });
        }

        function transmitPackets(packetsToTransmit) {
          if (!packetsToTransmit.length) {
            checkCompletion();
            return;
          }
          
          var nextBatch = [];
          var completedChecks = 0;

          packetsToTransmit.forEach(function(pkt) {
            pkt.attempts++;
            var pEl = document.createElement('div');
            pEl.textContent = `P${pkt.seq + 1}`;
            pEl.style.cssText = `position:absolute; left:40px; top:30px; padding:4px 8px; background:#3b82f6; border-radius:4px; font-size:9px; font-weight:bold; color:#fff; transition:all 1.5s linear; z-index:99;`;
            canvas.appendChild(pEl);

            // Trigger anim path
            var pathIdx = Math.floor(Math.random() * 2);
            var destY = pathIdx === 0 ? -20 : 50;

            setTimeout(function() {
              pEl.style.left = "45%";
              pEl.style.top = destY + "px";
            }, 50);

            setTimeout(function() {
              var loss = Math.random() < lossRate;
              if (loss) {
                pEl.style.background = "#ef4444";
                pEl.style.transform = "scale(0.5)";
                pEl.style.opacity = "0";
                feedback.style.color = "#f59e0b";
                feedback.textContent = `⚠️ Packet Loss detected on P${pkt.seq + 1}. Awaiting TCP timeout...`;
                nextBatch.push(pkt); // Need to retransmit
                setTimeout(function() { pEl.remove(); }, 500);
              } else {
                pEl.style.left = "85%";
                pEl.style.top = "30px";
                setTimeout(function() {
                  arived[pkt.seq] = true;
                  updateBuffer();
                  pEl.remove();
                }, 500);
              }
              completedChecks++;
              if (completedChecks === packetsToTransmit.length) {
                setTimeout(function() {
                  transmitPackets(nextBatch);
                }, 1000);
              }
            }, 800);
          });
        }

        function updateBuffer() {
          buffer.innerHTML = "";
          for (var i = 0; i < count; i++) {
            var block = document.createElement('div');
            block.style.cssText = `width:28px; height:24px; display:flex; align-items:center; justify-content:center; font-size:10px; font-weight:bold; border-radius:4px;`;
            if (arived[i]) {
              block.textContent = `P${i+1}`;
              block.style.background = "#10b981";
              block.style.color = "#fff";
            } else {
              block.textContent = "-";
              block.style.background = "rgba(255,255,255,0.05)";
              block.style.color = "#64748b";
            }
            buffer.appendChild(block);
          }
        }

        function checkCompletion() {
          var allOk = true;
          for (var i = 0; i < count; i++) {
            if (!arived[i]) allOk = false;
          }
          if (allOk) {
            feedback.style.color = "#10b981";
            feedback.textContent = "✓ Success! All packets successfully arrived, ordered, and reassembled back into the original file.";
            sendBtn.disabled = false;
            engine.markCompleted();
          }
        }

        updateBuffer();
        transmitPackets(list);
      }
    },

    onReplay: function(engine) {
      engine.t = 0;
    }
  });
});
})();
