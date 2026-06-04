(function() {
  'use strict';

  const canvas = document.getElementById('onionCanvas');
  const ctx = canvas.getContext('2d');
  const dpr = window.devicePixelRatio || 1;
  const size = 500;
  canvas.width = size * dpr;
  canvas.height = size * dpr;
  canvas.style.width = size + 'px';
  canvas.style.height = size + 'px';
  ctx.scale(dpr, dpr);

  const layerInfo = {
    kernel: {
      title: 'Kernel',
      desc: 'The core of the OS. Manages CPU scheduling, memory allocation, process management, and direct hardware communication. Everything passes through the kernel.'
    },
    drivers: {
      title: 'Device Drivers',
      desc: 'Software that allows the OS to communicate with hardware devices. Each hardware component (GPU, NIC, disk) has a specific driver that translates generic OS commands into device-specific instructions.'
    },
    filesystem: {
      title: 'File System',
      desc: 'Organizes and manages data storage. Controls how files are named, stored, retrieved, and organized on disk. Provides a hierarchical directory structure and handles permissions.'
    },
    ui: {
      title: 'User Interface',
      desc: 'The graphical or command-line interface that users interact with. Includes the desktop environment, window manager, and input handling for keyboard, mouse, and touch.'
    },
    apps: {
      title: 'Applications',
      desc: 'User-facing programs that run on top of the OS. Applications use system calls to request services from the kernel through the various OS layers.'
    },
    user: {
      title: 'User',
      desc: 'The person interacting with the system. User input flows through the UI layer, gets processed by applications, and system requests travel down to the kernel for hardware access.'
    }
  };

  const layers = ['kernel', 'drivers', 'filesystem', 'ui', 'apps', 'user'];
  const layerRadii = [45, 85, 125, 165, 205, 245];
  const layerColors = [
    '#ff6b35', // warm orange - kernel
    '#e85d3a',
    '#c94c4c',
    '#4a7fb5',
    '#3a6f9a',
    '#0959C8'  // cool blue - user
  ];

  let selectedLayer = 'kernel';
  let hoveredLayer = null;
  let animatingFlow = false;
  let flowProgress = 0;
  let flowDirection = 1; // 1 = inward, -1 = outward
  let animFrame = null;
  let isPlaying = false;

  function getLayerAtPoint(x, y) {
    const cx = size / 2, cy = size / 2;
    const dx = x - cx, dy = y - cy;
    const dist = Math.sqrt(dx * dx + dy * dy);
    for (let i = layers.length - 1; i >= 0; i--) {
      const threshold = layerRadii[i] + 6;
      if (dist <= threshold) return layers[i];
    }
    return null;
  }

  function drawOnion() {
    ctx.clearRect(0, 0, size, size);
    const cx = size / 2, cy = size / 2;

    // Draw rings from outside in (so inner rings overlay)
    for (let i = layers.length - 1; i >= 0; i--) {
      const radius = layerRadii[i];
      const isSelected = layers[i] === selectedLayer;
      const isHovered = hoveredLayer === layers[i];
      const isFlowLayer = animatingFlow;

      // Ring fill with gradient
      const grad = ctx.createRadialGradient(cx, cy, radius - 20, cx, cy, radius + 10);
      const baseColor = layerColors[i];
      grad.addColorStop(0, baseColor + '55');
      grad.addColorStop(0.5, baseColor + '33');
      grad.addColorStop(1, baseColor + '11');

      ctx.beginPath();
      ctx.arc(cx, cy, radius, 0, Math.PI * 2);
      ctx.fillStyle = grad;
      ctx.fill();

      // Ring stroke
      ctx.strokeStyle = isSelected || isHovered
        ? baseColor
        : 'rgba(255,255,255,0.12)';
      ctx.lineWidth = isSelected ? 3 : 1.5;
      ctx.stroke();

      // Glow for selected
      if (isSelected) {
        ctx.shadowColor = baseColor;
        ctx.shadowBlur = 16;
        ctx.stroke();
        ctx.shadowBlur = 0;
      }

      // Inner glow for hover
      if (isHovered && !isSelected) {
        ctx.shadowColor = baseColor;
        ctx.shadowBlur = 8;
        ctx.stroke();
        ctx.shadowBlur = 0;
      }

      // Label
      const labelAngle = -Math.PI / 2 + (i - 2.5) * 0.15;
      const labelR = radius + 14;
      const lx = cx + labelR * Math.cos(labelAngle);
      const ly = cy + labelR * Math.sin(labelAngle);

      ctx.fillStyle = isSelected || isHovered ? '#fff' : 'rgba(255,255,255,0.7)';
      ctx.font = i === 0 ? 'bold 11px Poppins, sans-serif' : '10px Poppins, sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(layers[i].charAt(0).toUpperCase() + layers[i].slice(1), lx, ly);
    }

    // Data flow indicator dots on the selected layer ring
    if (animatingFlow) {
      const selIdx = layers.indexOf(selectedLayer);
      const r = layerRadii[selIdx];
      const angle = flowProgress * Math.PI * 2;
      const dotX = cx + r * Math.cos(angle - Math.PI / 2);
      const dotY = cy + r * Math.sin(angle - Math.PI / 2);

      ctx.beginPath();
      ctx.arc(dotX, dotY, 5, 0, Math.PI * 2);
      ctx.fillStyle = layerColors[selIdx];
      ctx.shadowColor = layerColors[selIdx];
      ctx.shadowBlur = 16;
      ctx.fill();
      ctx.shadowBlur = 0;
    }

    // Center label
    ctx.fillStyle = 'rgba(255,255,255,0.2)';
    ctx.font = '7px Inter, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('⬤', cx, cy + 2);
  }

  function updateLayerInfo(layer) {
    selectedLayer = layer;
    const info = layerInfo[layer];
    document.getElementById('layerTitle').textContent = info.title;
    document.getElementById('layerDesc').textContent = info.desc;
    drawOnion();
  }

  // Mouse events
  canvas.addEventListener('mousemove', function(e) {
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width / dpr;
    const scaleY = canvas.height / rect.height / dpr;
    const x = (e.clientX - rect.left) * scaleX;
    const y = (e.clientY - rect.top) * scaleY;
    const layer = getLayerAtPoint(x, y);
    hoveredLayer = layer;
    canvas.style.cursor = layer ? 'pointer' : 'default';
    drawOnion();
  });

  canvas.addEventListener('mouseleave', function() {
    hoveredLayer = null;
    drawOnion();
  });

  canvas.addEventListener('click', function(e) {
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width / dpr;
    const scaleY = canvas.height / rect.height / dpr;
    const x = (e.clientX - rect.left) * scaleX;
    const y = (e.clientY - rect.top) * scaleY;
    const layer = getLayerAtPoint(x, y);
    if (layer) updateLayerInfo(layer);
  });

  // Keyboard: use arrow keys to cycle layers
  canvas.addEventListener('keydown', function(e) {
    const idx = layers.indexOf(selectedLayer);
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
      e.preventDefault();
      const next = (idx + 1) % layers.length;
      updateLayerInfo(layers[next]);
    } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
      e.preventDefault();
      const prev = (idx - 1 + layers.length) % layers.length;
      updateLayerInfo(layers[prev]);
    } else if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      // Act as click at center
    }
  });
  canvas.setAttribute('tabindex', '0');
  canvas.setAttribute('role', 'figure');
  canvas.setAttribute('aria-label', 'OS layers diagram. Use arrow keys to navigate layers.');

  // Data flow animation
  function startFlow() {
    if (isPlaying) return;
    isPlaying = true;
    animatingFlow = true;
    flowProgress = 0;
    flowDirection = 1;

    const dot = document.getElementById('flowDot');
    dot.style.left = '0%';

    function animateFlow() {
      if (!isPlaying) {
        animatingFlow = false;
        return;
      }

      flowProgress += 0.005 * flowDirection;

      if (flowProgress >= 1) {
        flowDirection = -1;
      } else if (flowProgress <= 0) {
        flowDirection = 1;
      }

      // Update flow dot position
      const pct = flowProgress * 100;
      dot.style.left = pct + '%';

      // Update flow dot color based on position
      const seg = flowProgress * 4;
      const colorIdx = Math.min(4, Math.floor(seg));
      const colors = ['#ff6b35', '#c94c4c', '#4a7fb5', '#3a6f9a', '#0959C8'];
      dot.style.background = colors[colorIdx] || '#0959C8';
      dot.style.boxShadow = `0 0 12px ${colors[colorIdx] || '#0959C8'}80`;

      // Update onion canvas flow indicator
      const ringIdx = Math.min(4, Math.floor(seg));
      selectedLayer = layers[ringIdx];
      updateLayerInfo(selectedLayer);

      animFrame = requestAnimationFrame(animateFlow);
    }

    animateFlow();
  }

  function stopFlow() {
    isPlaying = false;
    animatingFlow = false;
    if (animFrame) {
      cancelAnimationFrame(animFrame);
      animFrame = null;
    }
  }

  function resetFlow() {
    stopFlow();
    flowProgress = 0;
    flowDirection = 1;
    const dot = document.getElementById('flowDot');
    dot.style.left = '0%';
    dot.style.background = '#0959C8';
    dot.style.boxShadow = '0 0 12px rgba(9,89,200,0.6)';
    updateLayerInfo('kernel');
  }

  // Controls
  document.getElementById('playBtn').addEventListener('click', startFlow);
  document.getElementById('pauseBtn').addEventListener('click', stopFlow);
  document.getElementById('resetBtn').addEventListener('click', resetFlow);

  document.querySelectorAll('.ctrl-btn').forEach(btn => {
    btn.addEventListener('keydown', function(e) {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); this.click(); }
    });
  });

  // Handle resize for canvas
  function handleResize() {
    const rect = canvas.getBoundingClientRect();
    const newSize = Math.min(rect.width, 500);
    canvas.style.width = newSize + 'px';
    canvas.style.height = newSize + 'px';
  }
  window.addEventListener('resize', handleResize);

  // Init
  updateLayerInfo('kernel');
})();
