(function(){'use strict';
var components = [
  {id:"hdd",name:"Hard Disk Drive",category:"Storage",purpose:"Stores data magnetically on spinning platters read by moving heads",description:"HDDs have one or more metal platters coated with magnetic material that spin at high speeds while read-write heads float nanometers above the surface.",why:"HDDs provide high-capacity storage at the lowest cost per gigabyte",analogy:"Like a record player where data is read from spinning disks by moving arms",funFact:"The first HDD in 1956 weighed over a ton and stored only 5 MB",takeaway:"HDDs use magnetic domains on spinning platters to store data",mistake:"HDDs store data magnetically, not optically",descriptionDetailed:"Platters spin at 5,400 or 7,200 RPM for consumer drives. The actuator arm positions the read-write head over the correct track. Seek time (5-15ms) is the main performance bottleneck."},
  {id:"ssd",name:"Solid State Drive",category:"Storage",purpose:"Stores data in NAND flash memory chips with no moving parts",description:"SSDs store data in floating-gate transistors that trap electrons to represent 0s and 1s, with no mechanical delay for reading or writing.",why:"SSDs are dramatically faster and more durable than HDDs",analogy:"Like a USB drive on steroids, with many memory chips working in parallel",funFact:"SSDs can achieve random read speeds over 1 million IOPS, compared to 200 for HDDs",takeaway:"SSDs have no moving parts, making them faster, quieter, and more shock-resistant",mistake:"SSDs don't use magnetic storage—they use flash memory with floating-gate transistors",descriptionDetailed:"NAND flash stores charge in a floating gate isolated by oxide layers. SLC stores 1 bit per cell, MLC 2 bits, TLC 3 bits, QLC 4 bits. The SSD controller manages wear leveling, garbage collection, and error correction."},
  {id:"nvme",name:"NVMe Drive",category:"Storage",purpose:"Connects SSDs directly to the CPU via PCI Express for maximum speed",description:"NVMe is a protocol designed specifically for SSDs that uses the PCIe bus to achieve much lower latency and higher throughput than SATA.",why:"NVMe removes the bottlenecks of older storage interfaces",analogy:"Like a dedicated express lane for data instead of sharing a slow road",funFact:"NVMe drives can reach sequential speeds over 14 GB/s with PCIe 5.0",takeaway:"NVMe connects directly to the CPU's PCIe lanes, bypassing the slower SATA controller",mistake:"NVMe isn't a type of drive—it's a protocol; the drive is still an SSD",descriptionDetailed:"NVMe uses a queue depth of up to 65,535 commands per queue with multiple queues. It reduces latency by eliminating translation layers needed for SATA. NVMe drives use the M.2 form factor."},
  {id:"controller",name:"Storage Controller",category:"Storage",purpose:"Manages data flow between the storage device and the rest of the computer",description:"The storage controller runs firmware that handles error correction, wear leveling, garbage collection, and communication with the OS driver.",why:"The controller is the intelligence behind reliable storage operation",analogy:"Like a traffic controller managing vehicles entering and leaving a parking garage",funFact:"SSD controllers have their own processors and RAM, making them tiny computers",takeaway:"The storage controller translates between OS commands and the physical storage medium",mistake:"The controller isn't just a pass-through—it actively manages data placement and error recovery",descriptionDetailed:"HDD controllers manage spindle motor speed, head positioning, and cache buffering. SSD controllers run complex firmware for wear leveling and ECC. Controllers use DRAM as cache and store mapping tables."},
  {id:"firmware",name:"Storage Firmware",category:"Software",purpose:"Low-level software that controls the storage device's internal operations",description:"Firmware is embedded software on the storage controller that manages all internal operations, from error correction to advanced performance optimizations.",why:"Firmware defines the behavior, performance, and reliability characteristics of a drive",analogy:"Like the operating system of a storage device",funFact:"SSD firmware updates can sometimes improve performance by 20% or more",takeaway:"Firmware is the brain of the storage device",mistake:"Firmware isn't user-installed software—it's pre-installed on the drive's controller chip",descriptionDetailed:"Firmware implements the command set, manages flash translation layer for SSDs, and handles background tasks like garbage collection. Firmware bugs can cause data loss."},
  {id:"cache",name:"Storage Cache",category:"Storage",purpose:"Temporarily stores frequently accessed data for faster read and write performance",description:"Storage cache uses DRAM or fast NAND to buffer frequently requested data, so repeated reads are served instantly without accessing the main storage medium.",why:"Caching dramatically improves apparent storage performance",analogy:"Like a toolbox you keep on your desk instead of walking to the shed each time",funFact:"Enterprise SSDs often have DRAM cache equal to 1/1000th of their total capacity",takeaway:"Cache memory on storage devices speeds up access to frequently used data",mistake:"Cache doesn't permanently store data—it's temporary and volatile",descriptionDetailed:"HDDs use DRAM cache (16-256 MB) to buffer read-ahead data and write commands. SSDs use DRAM cache for mapping tables and as a write buffer. Write-back caching improves performance but risks data loss on power failure."}
];
var connections = [{from:"hdd",to:"ssd"},{from:"ssd",to:"nvme"},{from:"nvme",to:"controller"},{from:"controller",to:"firmware"},{from:"firmware",to:"cache"}];
var steps = [{id:"hdd",label:"Step 1: Hard Disk Drive",status:"Exploring: Hard Disk Drive - Stores data magnetically on spinning platters read by moving heads"},{id:"ssd",label:"Step 2: Solid State Drive",status:"Exploring: Solid State Drive - Stores data in NAND flash memory chips with no moving parts"},{id:"nvme",label:"Step 3: NVMe Drive",status:"Exploring: NVMe Drive - Connects SSDs directly to the CPU via PCI Express for maximum speed"},{id:"controller",label:"Step 4: Storage Controller",status:"Exploring: Storage Controller - Manages data flow between the storage device and the rest of the computer"},{id:"firmware",label:"Step 5: Storage Firmware",status:"Exploring: Storage Firmware - Low-level software that controls the storage device's internal operations"},{id:"cache",label:"Step 6: Storage Cache",status:"Exploring: Storage Cache - Temporarily stores frequently accessed data for faster read and write performance"}];
var tour = [{title:"Hard Disk Drive",description:"Stores data magnetically on spinning platters read by moving heads",componentId:"hdd"},{title:"Solid State Drive",description:"Stores data in NAND flash memory chips with no moving parts",componentId:"ssd"},{title:"NVMe Drive",description:"Connects SSDs directly to the CPU via PCI Express for maximum speed",componentId:"nvme"},{title:"Storage Controller",description:"Manages data flow between the storage device and the rest of the computer",componentId:"controller"},{title:"Storage Firmware",description:"Low-level software that controls the storage device's internal operations",componentId:"firmware"},{title:"Storage Cache",description:"Temporarily stores frequently accessed data for faster read and write performance",componentId:"cache"}];

deferInit(function(){
  new DiagramEngine({
    title: 'Storage',
    subtitle: 'How Computers Work',
    desc: 'Compare HDD, SSD, and other storage technologies.',
    module: 2,
    difficulty: 'Beginner',
    time: '10',
    objectives: 'Compare HDD, SSD, and other storage technologies.',
    components: components,
    connections: connections,
    steps: steps,
    tour: tour,

    render: function(container, engine) {
      engine.buildClickExplorer(container);
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
        bg.setAttribute('fill', i === idx ? '#1e2d50' : '#1a2235');
        bg.setAttribute('stroke', i === idx ? '#0959C8' : '#2a3a55');
      });
    },

    customChallenge: function(container, engine) {
      // Storage Explorer (Volatility Lab)
      container.innerHTML = `
        <div class="sim-interactive-area" style="padding: 16px;">
          <div style="font-size: 14px; font-weight:700; color:#60a5fa; margin-bottom:4px;">Storage Explorer: Volatility Lab</div>
          <p style="font-size: 11px; color:#cbd5e1; margin-bottom:12px;">Move active project files between temporary volatile RAM memory and permanent SSD storage. Click power to test data loss.</p>
          
          <div style="display:flex; justify-content:space-between; margin-bottom:12px; align-items:center;">
            <button class="act-btn" id="sim-power-btn" style="background:#ef4444; border-color:#f87171; color:#fff;">🔴 POWER OFF</button>
            <span id="sim-power-status" style="font-size:11px; font-weight:bold; color:#10b981;">SYSTEM ONLINE</span>
          </div>

          <div style="display:flex; gap:16px; min-height:160px;">
            <!-- RAM Container -->
            <div id="sim-zone-ram" class="glass-panel" style="flex:1; padding:12px; border:2px dashed rgba(96,165,250,0.3); border-radius:10px; display:flex; flex-direction:column; gap:6px;">
              <span style="font-size:10px; font-weight:bold; color:#60a5fa; text-transform:uppercase;">Volatile Memory (RAM)</span>
              <!-- Active document data starts here -->
              <div id="file-essay" class="sim-card" draggable="true" style="background:rgba(9,89,200,0.15); border-color:#3b82f6;">📝 active_essay.docx</div>
            </div>
            
            <!-- SSD Storage Container -->
            <div id="sim-zone-ssd" class="glass-panel" style="flex:1; padding:12px; border:2px dashed rgba(16,185,129,0.3); border-radius:10px; display:flex; flex-direction:column; gap:6px;">
              <span style="font-size:10px; font-weight:bold; color:#10b981; text-transform:uppercase;">Non-Volatile SSD Storage</span>
              <div id="file-system" class="sim-card" style="opacity:0.6; cursor:default;">⚙️ system_os.sys</div>
            </div>
          </div>
          
          <div class="glass-panel" style="padding:10px; background:rgba(0,0,0,0.3); border-radius:6px; min-height:60px; font-size:12px; margin-top:10px;">
            <div id="sim-storage-feedback" style="color:#cbd5e1; font-weight:500;">Goal: Save the active essay by moving it to the SSD, then turn the computer off to test persistence.</div>
          </div>
        </div>
      `;

      var powerBtn = container.querySelector('#sim-power-btn');
      var powerStatus = container.querySelector('#sim-power-status');
      var essay = container.querySelector('#file-essay');
      var ramZone = container.querySelector('#sim-zone-ram');
      var ssdZone = container.querySelector('#sim-zone-ssd');
      var feedback = container.querySelector('#sim-storage-feedback');

      var isOnline = true;
      var currentZone = "ram"; // 'ram' or 'ssd'

      essay.addEventListener('dragstart', function(e) {
        if (!isOnline) {
          e.preventDefault();
          return;
        }
        e.dataTransfer.setData('text/plain', 'essay');
      });

      // Touch support
      essay.addEventListener('touchstart', function(e) {
        if (!isOnline) return;
        this.dataset.touchFile = "essay";
      }, {passive:true});
      essay.addEventListener('touchend', function(e) {
        if (!isOnline) return;
        var t = e.changedTouches[0];
        var dropEl = document.elementFromPoint(t.clientX, t.clientY);
        if (dropEl) {
          var targetZone = dropEl.closest('#sim-zone-ram, #sim-zone-ssd');
          if (targetZone) {
            moveFile(targetZone.id === "sim-zone-ssd" ? "ssd" : "ram");
          }
        }
      });

      [ramZone, ssdZone].forEach(zone => {
        zone.addEventListener('dragover', function(e) {
          if (!isOnline) return;
          e.preventDefault();
          this.style.background = "rgba(255,255,255,0.05)";
        });
        zone.addEventListener('dragleave', function() {
          this.style.background = "transparent";
        });
        zone.addEventListener('drop', function(e) {
          e.preventDefault();
          this.style.background = "transparent";
          var target = this.id === "sim-zone-ssd" ? "ssd" : "ram";
          moveFile(target);
        });
      });

      function moveFile(target) {
        currentZone = target;
        if (target === "ssd") {
          ssdZone.appendChild(essay);
          feedback.textContent = "Essay saved permanently on the SSD storage platter! You can now power down safely.";
        } else {
          ramZone.appendChild(essay);
          feedback.textContent = "Essay moved to active memory (RAM). Warning: active variables are volatile!";
        }
      }

      powerBtn.addEventListener('click', function() {
        if (isOnline) {
          // Power down
          isOnline = false;
          powerStatus.textContent = "SYSTEM OFFLINE (NO POWER)";
          powerStatus.style.color = "#ef4444";
          powerBtn.textContent = "🟢 POWER ON";
          powerBtn.style.background = "#10b981";
          powerBtn.style.borderColor = "#6ee7b7";
          
          if (currentZone === "ram") {
            essay.remove();
            feedback.style.color = "#ef4444";
            feedback.innerHTML = "❌ <strong>Data Loss!</strong> Since the essay was in volatile RAM when power was cut, all electrons drained and the file is permanently gone! Reboot and try again.";
          } else {
            feedback.style.color = "#10b981";
            feedback.textContent = "System shut down. Saved files on the SSD are safe and preserved.";
          }
        } else {
          // Power up
          isOnline = true;
          powerStatus.textContent = "SYSTEM ONLINE";
          powerStatus.style.color = "#10b981";
          powerBtn.textContent = "🔴 POWER OFF";
          powerBtn.style.background = "#ef4444";
          powerBtn.style.borderColor = "#f87171";

          if (currentZone === "ssd") {
            feedback.style.color = "#10b981";
            feedback.innerHTML = "✓ <strong>Success!</strong> The essay was saved in non-volatile SSD storage and was successfully loaded back after system bootup.";
            engine.markCompleted();
          } else {
            // Re-create the essay card in RAM for retry
            currentZone = "ram";
            ramZone.appendChild(essay);
            feedback.style.color = "#cbd5e1";
            feedback.textContent = "System rebooted. Try saving active_essay.docx to the SSD and power off.";
          }
        }
      });
    },

    onReplay: function(engine) {
      engine.t = 0;
    }
  });
});
})();