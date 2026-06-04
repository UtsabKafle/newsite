(function() {
  'use strict';

  const packetEl = document.getElementById('activePacket');
  const sourceIp = document.getElementById('sourceIp');
  const destIp = document.getElementById('destIp');
  const packetProtocol = document.getElementById('packetProtocol');
  const packetPayload = document.getElementById('packetPayload');
  const messageInput = document.getElementById('messageInput');

  const packets = [
    { payload: '"Hello from A"', protocol: 'TCP' },
    { payload: '"ACK received"', protocol: 'TCP' },
    { payload: '"File chunk 1"', protocol: 'UDP' },
    { payload: '"DNS query"', protocol: 'UDP' },
    { payload: '"HTTP GET /"', protocol: 'TCP' },
    { payload: '"SYN request"', protocol: 'TCP' },
    { payload: '"Data block"', protocol: 'TCP' },
    { payload: '"Keep alive"', protocol: 'TCP' }
  ];

  let isPlaying = false;
  let animFrame = null;
  let packetIndex = 0;
  let packetProgress = 0;
  let isSending = false;
  let customMessage = null;
  let currentPacket = packets[0];

  function animatePacket(fromLeft, message, protocol, callback) {
    isSending = true;
    packetProgress = 0;
    packetEl.style.opacity = '1';
    packetEl.textContent = message || 'Data';
    packetEl.style.background = '#0959C8';
    packetEl.style.boxShadow = '0 0 12px rgba(9,89,200,0.5)';

    const duration = 60; // frames
    let frame = 0;

    function step() {
      frame++;
      packetProgress = frame / duration;

      if (fromLeft) {
        packetEl.style.left = (packetProgress * 100) + '%';
      } else {
        packetEl.style.left = ((1 - packetProgress) * 100) + '%';
      }

      // Fade in/out at edges
      if (packetProgress < 0.05) {
        packetEl.style.opacity = packetProgress / 0.05;
      } else if (packetProgress > 0.95) {
        packetEl.style.opacity = (1 - packetProgress) / 0.05;
      } else {
        packetEl.style.opacity = '1';
      }

      if (frame < duration) {
        animFrame = requestAnimationFrame(step);
      } else {
        packetEl.style.opacity = '0';
        isSending = false;
        if (callback) callback();
      }
    }

    step();
  }

  function sendPacket(payload, protocol) {
    if (isSending) return;

    const p = payload || 'Data';
    const proto = protocol || 'TCP';

    // Update detail panel
    sourceIp.textContent = '192.168.1.10';
    destIp.textContent = '192.168.1.20';
    packetProtocol.textContent = proto;
    packetPayload.textContent = typeof p === 'string' ? p : JSON.stringify(p);

    animatePacket(true, p, proto);
  }

  function sendCustomMessage() {
    if (isSending) return;
    const msg = messageInput.value.trim() || 'Hello';
    const payload = '"' + msg + '"';
    sendPacket(payload, 'TCP');
  }

  // Stream of packets
  function startStream() {
    if (isPlaying || isSending) return;
    isPlaying = true;
    packetIndex = 0;

    function nextPacket() {
      if (!isPlaying) return;
      if (isSending) {
        animFrame = requestAnimationFrame(nextPacket);
        return;
      }

      const pkt = packets[packetIndex % packets.length];
      currentPacket = pkt;
      packetIndex++;

      sendPacket(pkt.payload, pkt.protocol);

      // Schedule next after current finishes
      const checkDone = function() {
        if (!isPlaying) return;
        if (isSending) {
          animFrame = requestAnimationFrame(checkDone);
        } else {
          setTimeout(nextPacket, 400);
        }
      };
      setTimeout(checkDone, 100);
    }

    nextPacket();
  }

  function stopStream() {
    isPlaying = false;
  }

  function resetComm() {
    stopStream();
    if (animFrame) {
      cancelAnimationFrame(animFrame);
      animFrame = null;
    }
    isSending = false;
    packetEl.style.opacity = '0';
    packetEl.style.left = '0%';
    sourceIp.textContent = '192.168.1.10';
    destIp.textContent = '192.168.1.20';
    packetProtocol.textContent = 'TCP';
    packetPayload.textContent = '"Hello from A"';
    messageInput.value = 'Hello from A';
    packetIndex = 0;
  }

  // Controls
  document.getElementById('playBtn').addEventListener('click', startStream);
  document.getElementById('pauseBtn').addEventListener('click', stopStream);
  document.getElementById('resetBtn').addEventListener('click', resetComm);
  document.getElementById('sendBtn').addEventListener('click', sendCustomMessage);

  // Keyboard: Enter on send input triggers send
  messageInput.addEventListener('keydown', function(e) {
    if (e.key === 'Enter') {
      e.preventDefault();
      sendCustomMessage();
    }
  });

  document.querySelectorAll('.ctrl-btn').forEach(btn => {
    btn.addEventListener('keydown', function(e) {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); this.click(); }
    });
  });

  // Init
  resetComm();
})();
