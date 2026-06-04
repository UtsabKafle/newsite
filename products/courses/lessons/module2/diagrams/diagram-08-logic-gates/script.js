(function() {
  'use strict';

  const gates = {
    and: { inputs: { a: 0, b: 0 }, output: null },
    or: { inputs: { a: 0, b: 0 }, output: null },
    not: { inputs: { a: 0 }, output: null },
    nand: { inputs: { a: 0, b: 0 }, output: null }
  };

  const switchEls = document.querySelectorAll('.input-switch');
  const outputBulbs = {
    and: document.getElementById('andOutput'),
    or: document.getElementById('orOutput'),
    not: document.getElementById('notOutput'),
    nand: document.getElementById('nandOutput')
  };

  function computeGate(type, inputs) {
    switch (type) {
      case 'and': return inputs.a & inputs.b;
      case 'or': return inputs.a | inputs.b;
      case 'not': return inputs.a ? 0 : 1;
      case 'nand': return (inputs.a & inputs.b) ? 0 : 1;
      default: return 0;
    }
  }

  function updateGate(gateType) {
    const gate = gates[gateType];
    gate.output = computeGate(gateType, gate.inputs);
    const bulb = outputBulbs[gateType];
    bulb.textContent = gate.output;
    bulb.setAttribute('data-state', gate.output);
    bulb.setAttribute('aria-label', `${gateType.toUpperCase()} gate output, currently ${gate.output}`);

    // Highlight truth table row
    const tt = document.getElementById(gateType + 'Truth');
    if (tt) {
      tt.querySelectorAll('.tt-row:not(.tt-header)').forEach(row => {
        const match = Object.keys(gate.inputs).every(key => {
          const expected = parseInt(row.getAttribute('data-' + key));
          return gate.inputs[key] === expected;
        });
        row.classList.toggle('highlight', match);
      });
    }
  }

  function setInput(gateType, inputName, value) {
    gates[gateType].inputs[inputName] = value;
    // Update button text and class
    const btn = document.querySelector(`.input-switch[data-gate="${gateType}"][data-input="${inputName}"]`);
    if (btn) {
      const label = inputName.toUpperCase();
      btn.textContent = `${label}: ${value}`;
      btn.classList.toggle('on', value === 1);
      btn.setAttribute('aria-label', `${gateType.toUpperCase()} gate input ${label}, currently ${value}`);
    }
    updateGate(gateType);
  }

  // Switch click handlers
  switchEls.forEach(btn => {
    btn.addEventListener('click', function() {
      const gate = this.dataset.gate;
      const input = this.dataset.input;
      const current = gates[gate].inputs[input];
      setInput(gate, input, current ? 0 : 1);
    });
    btn.addEventListener('keydown', function(e) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        this.click();
      }
    });
  });

  // Play: cycle through all combinations
  let isPlaying = false;
  let cycleTimer = null;
  let cycleState = 0;
  const cycleLengths = { and: 4, or: 4, not: 2, nand: 4 };

  function startCycling() {
    if (isPlaying) return;
    isPlaying = true;

    function step() {
      if (!isPlaying) return;

      const combos_and = [[0,0],[0,1],[1,0],[1,1]];
      const combos_not = [[0],[1]];

      Object.keys(gates).forEach(type => {
        const combos = type === 'not' ? combos_not : combos_and;
        const idx = cycleState % combos.length;
        const vals = combos[idx];
        if (type === 'not') {
          setInput(type, 'a', vals[0]);
        } else {
          setInput(type, 'a', vals[0]);
          setInput(type, 'b', vals[1]);
        }
      });

      cycleState = (cycleState + 1) % 4;
      cycleTimer = setTimeout(step, 1000);
    }

    step();
  }

  function stopCycling() {
    isPlaying = false;
    if (cycleTimer) {
      clearTimeout(cycleTimer);
      cycleTimer = null;
    }
  }

  function resetAll() {
    stopCycling();
    cycleState = 0;
    Object.keys(gates).forEach(type => {
      Object.keys(gates[type].inputs).forEach(inp => {
        setInput(type, inp, 0);
      });
    });
  }

  document.getElementById('playBtn').addEventListener('click', startCycling);
  document.getElementById('pauseBtn').addEventListener('click', stopCycling);
  document.getElementById('resetBtn').addEventListener('click', resetAll);

  document.querySelectorAll('.ctrl-btn').forEach(btn => {
    btn.addEventListener('keydown', function(e) {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); this.click(); }
    });
  });

  // Init
  resetAll();
})();
