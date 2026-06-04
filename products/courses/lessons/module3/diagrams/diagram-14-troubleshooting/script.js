(function () {
  'use strict';

  var state = { playing: false, scanTimer: null, beepStep: 0, gaugeInterval: null };
  var playBtn, pauseBtn, resetBtn, statusText;
  var detailOverlay, detailHeading, detailSymptoms, detailCauses, detailSolutions;
  var scanLine, beepDisplay, beepText, optimizeBtn;
  var gaugeTempFill, gaugeTempValue, gaugeFanFill, gaugeFanValue;
  var gaugeVoltFill, gaugeVoltValue, gaugeMemFill, gaugeMemValue;

  var ISSUE_DATA = {
    nopost: {
      name: 'No POST',
      symptoms: 'System powers on but no display, no beep codes, fans spin but nothing happens.',
      causes: 'Loose RAM, improperly seated CPU, faulty power supply, or short circuit from motherboard standoffs.',
      solutions: 'Reseat RAM sticks, check CPU power cable, try booting with one RAM stick, clear CMOS, check for bent CPU pins.'
    },
    bsod: {
      name: 'Blue Screen (BSOD)',
      symptoms: 'System crashes to a blue screen with error codes. Random reboots during use.',
      causes: 'Faulty drivers, RAM errors, corrupt system files, overheating, or failing hardware (RAM/HDD/SSD).',
      solutions: 'Note the stop code, boot in Safe Mode, run memtest86, update drivers, check disk for errors, restore from backup.'
    },
    overheat: {
      name: 'Overheating',
      symptoms: 'High CPU/GPU temperatures, fans running at maximum speed, system throttling or shutting down.',
      causes: 'Dust-clogged heatsinks, failed thermal paste, inadequate case airflow, broken fan, overclocking without sufficient cooling.',
      solutions: 'Clean dust from heatsinks and fans, reapply thermal paste, improve case airflow, check all fans spin freely, reduce overclock.'
    },
    nodisplay: {
      name: 'No Display',
      symptoms: 'Computer turns on but monitor shows "No Signal" or remains blank.',
      causes: 'GPU not seated properly, monitor cable loose, wrong input source selected, GPU power cables not connected, dead GPU.',
      solutions: 'Reseat the GPU, check monitor cable and input source, verify PCIe power cables, try integrated graphics if available, test GPU in another system.'
    },
    slow: {
      name: 'Slow Performance',
      symptoms: 'Long boot times, sluggish application launches, high disk usage at idle, system stuttering.',
      causes: 'Too many startup programs, failing HDD, insufficient RAM, malware, fragmented HDD, full storage drive.',
      solutions: 'Disable startup programs, run disk cleanup, upgrade to SSD, add more RAM, run antivirus scan, defrag HDD, check for Windows updates.'
    },
    loud: {
      name: 'Loud Fan',
      symptoms: 'Constant loud whirring, grinding, or rattling noise from the case.',
      causes: 'Fan bearing wear, cable hitting fan blades, dust buildup, fan running at full speed due to high temperatures, cheap/low-quality fans.',
      solutions: 'Clean fans with compressed air, check for cable obstructions, replace worn fans, adjust fan curves in BIOS, upgrade to higher quality fans.'
    }
  };

  var BEEP_CODES = [
    'Initializing... No beep codes yet',
    '1 short beep — System OK',
    '1 long beep — Memory error detected',
    '1 long + 2 short — Video/GPU error',
    'Repeating short beeps — No POST failure',
    'Continuous beep — PSU issue detected',
    'Diagnostic complete — All checks passed'
  ];

  var GAUGE_REST = {
    temp: { dash: 200, value: '52' },
    fan: { dash: 140, value: '1200' },
    volt: { dash: 80, value: '12.2' },
    mem: { dash: 170, value: '40' }
  };

  function init() {
    playBtn = document.getElementById('playBtn');
    pauseBtn = document.getElementById('pauseBtn');
    resetBtn = document.getElementById('resetBtn');
    statusText = document.getElementById('statusText');
    detailOverlay = document.getElementById('detailOverlay');
    detailHeading = document.getElementById('detailHeading');
    detailSymptoms = document.getElementById('detailSymptoms');
    detailCauses = document.getElementById('detailCauses');
    detailSolutions = document.getElementById('detailSolutions');
    scanLine = document.getElementById('scanLine');
    beepDisplay = document.getElementById('beepDisplay');
    beepText = document.getElementById('beepText');
    optimizeBtn = document.getElementById('optimizeBtn');
    gaugeTempFill = document.getElementById('gaugeTempFill');
    gaugeTempValue = document.getElementById('gaugeTempValue');
    gaugeFanFill = document.getElementById('gaugeFanFill');
    gaugeFanValue = document.getElementById('gaugeFanValue');
    gaugeVoltFill = document.getElementById('gaugeVoltFill');
    gaugeVoltValue = document.getElementById('gaugeVoltValue');
    gaugeMemFill = document.getElementById('gaugeMemFill');
    gaugeMemValue = document.getElementById('gaugeMemValue');

    // Issue card click
    document.querySelectorAll('[data-issue]').forEach(function (el) {
      el.addEventListener('click', function () {
        var key = el.getAttribute('data-issue');
        showIssue(key);
      });
      el.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          var key = el.getAttribute('data-issue');
          showIssue(key);
        }
      });
      if (!el.getAttribute('tabindex')) {
        el.setAttribute('tabindex', '0');
        el.setAttribute('role', 'button');
        el.setAttribute('aria-label', 'View details for ' + el.getAttribute('data-issue'));
      }
    });

    optimizeBtn.addEventListener('click', runOptimize);
    if (!optimizeBtn.getAttribute('tabindex')) {
      optimizeBtn.setAttribute('tabindex', '0');
      optimizeBtn.setAttribute('role', 'button');
      optimizeBtn.setAttribute('aria-label', 'Run system optimization');
    }

    playBtn.addEventListener('click', play);
    pauseBtn.addEventListener('click', pause);
    resetBtn.addEventListener('click', reset);

    document.addEventListener('keydown', function (e) {
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
      if (e.key === ' ' || e.key === 'Spacebar') {
        e.preventDefault();
        if (state.playing) pause(); else play();
      }
    });

    resetAll();
    updateButtons();
  }

  function showIssue(key) {
    var data = ISSUE_DATA[key];
    if (!data) return;
    detailOverlay.classList.add('visible');
    detailHeading.textContent = data.name;
    detailSymptoms.textContent = 'Symptoms: ' + data.symptoms;
    detailCauses.textContent = 'Causes: ' + data.causes;
    detailSolutions.textContent = 'Solutions: ' + data.solutions;
    statusText.innerHTML = '<strong>' + data.name + ':</strong> ' + data.symptoms.substring(0, 60) + '...';
    // Highlight active card
    document.querySelectorAll('[data-issue]').forEach(function (el) {
      el.classList.toggle('active', el.getAttribute('data-issue') === key);
    });
  }

  function setGauge(el, valueEl, dashOffset, value, cls) {
    if (!el) return;
    el.setAttribute('stroke-dashoffset', dashOffset);
    cls = cls || '';
    el.setAttribute('class', 'gauge-fill ' + cls);
    if (valueEl) valueEl.textContent = value;
  }

  function simulateScan() {
    state.beepStep = 0;
    scanLine.classList.add('active');
    beepText.textContent = BEEP_CODES[0];

    // Simulate changing gauges
    var values = [
      { temp: { dash: 200, value: '52' }, fan: { dash: 140, value: '1200' }, volt: { dash: 80, value: '12.2' }, mem: { dash: 170, value: '40' } },
      { temp: { dash: 180, value: '58' }, fan: { dash: 130, value: '1400' }, volt: { dash: 90, value: '12.0' }, mem: { dash: 160, value: '45' } },
      { temp: { dash: 150, value: '68' }, fan: { dash: 110, value: '1800' }, volt: { dash: 100, value: '11.8' }, mem: { dash: 140, value: '55' } },
      { temp: { dash: 220, value: '48' }, fan: { dash: 150, value: '1100' }, volt: { dash: 75, value: '12.3' }, mem: { dash: 180, value: '35' } },
      { temp: { dash: 200, value: '52' }, fan: { dash: 140, value: '1200' }, volt: { dash: 80, value: '12.2' }, mem: { dash: 170, value: '40' } }
    ];

    var gaugeStep = 0;
    if (state.gaugeInterval) clearInterval(state.gaugeInterval);
    state.gaugeInterval = setInterval(function () {
      if (gaugeStep >= values.length) gaugeStep = 0;
      var v = values[gaugeStep];
      setGauge(gaugeTempFill, gaugeTempValue, v.temp.dash, v.temp.value);
      setGauge(gaugeFanFill, gaugeFanValue, v.fan.dash, v.fan.value);
      setGauge(gaugeVoltFill, gaugeVoltValue, v.volt.dash, v.volt.value);
      setGauge(gaugeMemFill, gaugeMemValue, v.mem.dash, v.mem.value);
      gaugeStep++;
    }, 800);

    state.scanTimer = setInterval(function () {
      state.beepStep++;
      if (state.beepStep >= BEEP_CODES.length) {
        state.beepStep = BEEP_CODES.length - 1;
        if (state.scanTimer) { clearInterval(state.scanTimer); state.scanTimer = null; }
        if (state.gaugeInterval) { clearInterval(state.gaugeInterval); state.gaugeInterval = null; }
        state.playing = false;
        scanLine.classList.remove('active');
        beepText.textContent = 'Diagnostic complete — System healthy';
        beepDisplay.setAttribute('fill', 'rgba(16,185,129,0.1)');
        beepDisplay.setAttribute('stroke', '#10B981');
        statusText.innerHTML = '<strong>Diagnostic complete!</strong> System healthy — no issues found';
        // Restore gauges
        setGauge(gaugeTempFill, gaugeTempValue, GAUGE_REST.temp.dash, GAUGE_REST.temp.value);
        setGauge(gaugeFanFill, gaugeFanValue, GAUGE_REST.fan.dash, GAUGE_REST.fan.value);
        setGauge(gaugeVoltFill, gaugeVoltValue, GAUGE_REST.volt.dash, GAUGE_REST.volt.value);
        setGauge(gaugeMemFill, gaugeMemValue, GAUGE_REST.mem.dash, GAUGE_REST.mem.value);
        updateButtons();
        return;
      }
      beepText.textContent = BEEP_CODES[state.beepStep];
      statusText.innerHTML = '<strong>Scanning...</strong> ' + BEEP_CODES[state.beepStep];
    }, 1200);
  }

  function play() {
    if (state.playing) return;
    state.playing = true;
    detailOverlay.classList.remove('visible');
    document.querySelectorAll('[data-issue]').forEach(function (el) {
      el.classList.remove('active');
    });
    beepDisplay.removeAttribute('fill');
    beepDisplay.removeAttribute('stroke');
    statusText.innerHTML = '<strong>Starting diagnostic scan...</strong>';
    simulateScan();
    updateButtons();
  }

  function pause() {
    if (!state.playing) return;
    state.playing = false;
    if (state.scanTimer) { clearInterval(state.scanTimer); state.scanTimer = null; }
    if (state.gaugeInterval) { clearInterval(state.gaugeInterval); state.gaugeInterval = null; }
    scanLine.classList.remove('active');
    statusText.innerHTML = '<strong>Scan paused</strong>';
    updateButtons();
  }

  function resetAll() {
    if (state.scanTimer) { clearInterval(state.scanTimer); state.scanTimer = null; }
    if (state.gaugeInterval) { clearInterval(state.gaugeInterval); state.gaugeInterval = null; }
    state.playing = false;
    state.beepStep = 0;
    scanLine.classList.remove('active');
    detailOverlay.classList.remove('visible');
    document.querySelectorAll('[data-issue]').forEach(function (el) {
      el.classList.remove('active');
    });
    beepDisplay.removeAttribute('fill');
    beepDisplay.removeAttribute('stroke');
    beepText.textContent = 'No beep codes detected';
    setGauge(gaugeTempFill, gaugeTempValue, GAUGE_REST.temp.dash, GAUGE_REST.temp.value);
    setGauge(gaugeFanFill, gaugeFanValue, GAUGE_REST.fan.dash, GAUGE_REST.fan.value);
    setGauge(gaugeVoltFill, gaugeVoltValue, GAUGE_REST.volt.dash, GAUGE_REST.volt.value);
    setGauge(gaugeMemFill, gaugeMemValue, GAUGE_REST.mem.dash, GAUGE_REST.mem.value);
  }

  function reset() {
    resetAll();
    statusText.innerHTML = 'Press <strong>Play</strong> to run diagnostic scan';
    updateButtons();
  }

  function runOptimize() {
    if (state.playing) { pause(); }
    statusText.innerHTML = '<strong>Optimizing:</strong> Cleaning temp files...';
    var steps = ['Cleaning temp files...', 'Defragmenting drives...', 'Updating drivers...', 'Optimization complete!'];
    var i = 0;
    var optTimer = setInterval(function () {
      i++;
      if (i >= steps.length) {
        clearInterval(optTimer);
        statusText.innerHTML = '<strong>Optimization complete!</strong> System cleaned and optimized';
        return;
      }
      statusText.innerHTML = '<strong>Optimizing:</strong> ' + steps[i];
    }, 1000);
  }

  function updateButtons() {
    playBtn.disabled = state.playing;
    pauseBtn.disabled = !state.playing;
    resetBtn.disabled = state.beepStep === 0 && !state.playing;
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
