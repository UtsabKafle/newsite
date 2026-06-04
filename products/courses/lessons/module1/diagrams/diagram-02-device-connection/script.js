/* ===== Consica Labs — Device Connection Flowchart ===== */

(function () {
  'use strict';

  var NUM_STEPS = 3;
  var PAUSE_MS = 800;
  var ARROW_DURATION = 700;

  var nodes = [
    document.getElementById('node0'),
    document.getElementById('node1'),
    document.getElementById('node2'),
    document.getElementById('node3'),
  ];

  var arrowFills = [
    document.getElementById('arrowFill0'),
    document.getElementById('arrowFill1'),
    document.getElementById('arrowFill2'),
  ];

  var arrowHeads = [
    document.getElementById('arrowHead0'),
    document.getElementById('arrowHead1'),
    document.getElementById('arrowHead2'),
  ];

  var progressFill = document.getElementById('progressFill');
  var progressSteps = document.querySelectorAll('.progress-step');
  var statusText = document.getElementById('statusText');
  var playBtn = document.getElementById('playBtn');
  var pauseBtn = document.getElementById('pauseBtn');
  var resetBtn = document.getElementById('resetBtn');
  var overlay = document.getElementById('tooltipOverlay');

  var currentStep = -1;
  var animating = false;
  var paused = false;
  var pauseRequested = false;
  var timeouts = [];
  var activeTooltip = null;

  function clearTimeouts () {
    timeouts.forEach(function (t) { clearTimeout(t); });
    timeouts = [];
  }

  function setNodeState (idx, state) {
    nodes[idx].classList.remove('active', 'completed');
    if (state) nodes[idx].classList.add(state);
  }

  function resetAllNodes () {
    nodes.forEach(function (n) { n.classList.remove('active', 'completed'); });
  }

  function setArrow (idx, filled) {
    arrowFills[idx].classList.toggle('animated', filled);
    arrowHeads[idx].classList.toggle('visible', filled);
  }

  function resetArrows () {
    for (var i = 0; i < arrowFills.length; i++) setArrow(i, false);
  }

  function setProgress (step) {
    var pct = step >= 0 ? ((step + 1) / NUM_STEPS) * 100 : 0;
    progressFill.style.width = pct + '%';
    progressFill.setAttribute('aria-valuenow', Math.max(0, step + 1));

    progressSteps.forEach(function (el, i) {
      el.classList.remove('active', 'done');
      if (i === step + 1 && step >= 0) el.classList.add('active');
      else if (i <= step) el.classList.add('done');
    });
  }

  function setStatus (msg, highlight) {
    statusText.innerHTML = highlight
      ? msg.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      : msg;
  }

  function enableButtons () {
    playBtn.disabled = false;
    pauseBtn.disabled = false;
    resetBtn.disabled = false;
  }

  function disableButtons (except) {
    if (except !== 'play') playBtn.disabled = true;
    if (except !== 'pause') pauseBtn.disabled = true;
    if (except !== 'reset') resetBtn.disabled = true;
  }

  function reset () {
    clearTimeouts();
    paused = false;
    pauseRequested = false;
    animating = false;
    currentStep = -1;

    resetAllNodes();
    resetArrows();
    setProgress(-1);
    setStatus('Ready \u2014 click **Play** to start the animation', true);
    enableButtons();
    playBtn.disabled = false;
    pauseBtn.disabled = true;
    resetBtn.disabled = false;
  }

  function stepForward (step) {
    if (step >= NUM_STEPS) {
      animating = false;
      currentStep = NUM_STEPS - 1;
      setNodeState(NUM_STEPS - 1, 'active');
      setNodeState(NUM_STEPS - 1, 'completed');
      setProgress(NUM_STEPS - 1);
      setStatus('All steps complete! Your data has reached the **Internet**.', true);
      enableButtons();
      playBtn.disabled = true;
      pauseBtn.disabled = true;
      return;
    }

    currentStep = step;

    if (step === 0) {
      setNodeState(0, 'active');
      setNodeState(0, 'completed');
    }

    setArrow(step, true);
    setNodeState(step + 1, 'active');
    setProgress(step);

    var labels = ['Device to Router', 'Router to ISP', 'ISP to Internet'];
    setStatus('Connecting: **' + labels[step] + '**', true);

    var t1 = setTimeout(function () {
      setNodeState(step + 1, 'completed');

      if (!paused && !pauseRequested) {
        var t2 = setTimeout(function () {
          if (!paused && !pauseRequested) {
            stepForward(step + 1);
          } else {
            animating = false;
          }
        }, PAUSE_MS);
        timeouts.push(t2);
      } else {
        animating = false;
      }
    }, ARROW_DURATION);

    timeouts.push(t1);
  }

  function play () {
    if (animating && !paused) return;

    if (paused) {
      paused = false;
      pauseRequested = false;
      pauseBtn.disabled = false;
      animating = true;
      setStatus('Resuming...', false);

      var t = setTimeout(function () {
        if (!paused && !pauseRequested) {
          stepForward(currentStep + 1);
        } else {
          animating = false;
        }
      }, 300);
      timeouts.push(t);
      return;
    }

    reset();
    animating = true;
    pauseRequested = false;
    pauseBtn.disabled = false;
    resetBtn.disabled = false;
    playBtn.disabled = true;
    setStatus('Starting animation...', false);

    var t = setTimeout(function () {
      if (!pauseRequested) {
        stepForward(0);
      } else {
        animating = false;
      }
    }, 400);
    timeouts.push(t);
  }

  function pause () {
    if (!animating || paused) return;
    paused = true;
    pauseRequested = true;
    playBtn.disabled = false;
    pauseBtn.disabled = true;
    setStatus('**Paused** at step ' + (currentStep + 1) + '. Click Play to continue.', true);
  }

  function showTooltip (node) {
    var tooltipId = node.getAttribute('data-tooltip');
    var tooltip = document.getElementById(tooltipId);
    if (!tooltip) return;

    if (activeTooltip && activeTooltip !== tooltip) {
      closeTooltip(activeTooltip);
    }

    tooltip.classList.add('visible');
    tooltip.setAttribute('aria-hidden', 'false');
    overlay.classList.add('active');
    activeTooltip = tooltip;
  }

  function closeTooltip (tooltip) {
    if (!tooltip) return;
    tooltip.classList.remove('visible');
    tooltip.setAttribute('aria-hidden', 'true');
    overlay.classList.remove('active');
    if (activeTooltip === tooltip) activeTooltip = null;
  }

  function closeAllTooltips () {
    if (activeTooltip) {
      closeTooltip(activeTooltip);
    }
  }

  nodes.forEach(function (node) {
    node.addEventListener('click', function (e) {
      e.stopPropagation();
      var tooltipId = node.getAttribute('data-tooltip');
      var tooltip = document.getElementById(tooltipId);
      if (activeTooltip === tooltip) {
        closeAllTooltips();
      } else {
        showTooltip(node);
      }
    });

    node.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        node.click();
      }
      if (e.key === 'Escape') {
        closeAllTooltips();
      }
    });
  });

  overlay.addEventListener('click', function () {
    closeAllTooltips();
  });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') {
      closeAllTooltips();
    }
  });

  playBtn.addEventListener('click', play);
  pauseBtn.addEventListener('click', pause);
  resetBtn.addEventListener('click', reset);

  reset();

})();
