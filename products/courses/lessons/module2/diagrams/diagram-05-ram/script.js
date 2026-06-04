(function () {
  'use strict';

  var state = {
    stage: 0,
    progress: 0,
    playing: false,
    rafId: null,
    lastTime: null,
    bytesWritten: 0,
    bytesRead: 0,
    currentAddr: 0,
    currentData: 0,
    isWrite: true
  };

  var ROWS = 4;
  var COLS = 8;
  var ADDRS = ['0x0000', '0x0001', '0x0002', '0x0003'];
  var DATA_VALUES = [0xA5, 0x3C, 0xF0, 0x0F, 0x55, 0xAA, 0x7E, 0x81, 0xC3, 0x66];

  var memCells = [];
  var rowBits = [];
  var byteValue, infoOperation, infoAddress, infoData, infoWritten, infoRead, infoLed;
  var addressArrow, dataArrow;
  var statusText, playBtn, pauseBtn, resetBtn;

  function init() {
    statusText = document.getElementById('statusText');
    playBtn = document.getElementById('playBtn');
    pauseBtn = document.getElementById('pauseBtn');
    resetBtn = document.getElementById('resetBtn');
    byteValue = document.getElementById('byteValue');
    infoOperation = document.getElementById('infoOperation');
    infoAddress = document.getElementById('infoAddress');
    infoData = document.getElementById('infoData');
    infoWritten = document.getElementById('infoWritten');
    infoRead = document.getElementById('infoRead');
    infoLed = document.querySelector('.info-led');

    addressArrow = document.querySelector('#address-bus .bus-arrow');
    dataArrow = document.querySelector('#data-bus .data-bus-arrow');

    for (var r = 0; r < ROWS; r++) {
      memCells[r] = [];
      var rowEl = document.querySelector('[data-row="' + r + '"]');
      var cells = rowEl.querySelectorAll('.mem-cell');
      for (var c = 0; c < COLS; c++) {
        memCells[r][c] = { el: cells[c], filled: false, value: 0 };
      }
      rowBits[r] = rowEl.querySelector('.row-bits');
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

    resetUI();
  }

  function getRandomAddress() {
    return Math.floor(Math.random() * ROWS);
  }

  function getRandomData() {
    return DATA_VALUES[Math.floor(Math.random() * DATA_VALUES.length)];
  }

  function isRowFull(row) {
    for (var c = 0; c < COLS; c++) {
      if (!memCells[row][c].filled) return false;
    }
    return true;
  }

  function writeToRow(row, data) {
    if (data === undefined) data = getRandomData();
    for (var c = 0; c < COLS; c++) {
      if (!memCells[row][c].filled) {
        memCells[row][c].filled = true;
        memCells[row][c].value = (data >> (7 - c)) & 1;
        memCells[row][c].el.classList.add('write');
        setTimeout(function (el) {
          el.classList.remove('write');
          el.classList.add('filled');
        }.bind(null, memCells[row][c].el), 600);
        break;
      }
    }
    updateRowBits(row);
  }

  function readFromRow(row) {
    for (var c = 0; c < COLS; c++) {
      if (memCells[row][c].filled) {
        memCells[row][c].el.classList.add('read');
        setTimeout(function (el) {
          el.classList.remove('read');
        }.bind(null, memCells[row][c].el), 600);
        break;
      }
    }
  }

  function updateRowBits(row) {
    var bits = '';
    for (var c = 0; c < COLS; c++) {
      bits += memCells[row][c].filled ? (memCells[row][c].value ? '1' : '0') : '-';
    }
    rowBits[row].textContent = bits;
  }

  function resetMemory() {
    for (var r = 0; r < ROWS; r++) {
      for (var c = 0; c < COLS; c++) {
        memCells[r][c].filled = false;
        memCells[r][c].value = 0;
        memCells[r][c].el.classList.remove('write', 'read', 'filled');
      }
      updateRowBits(r);
    }
    state.bytesWritten = 0;
    state.bytesRead = 0;
  }

  function play() {
    if (state.playing) return;
    state.playing = true;
    state.stage = 0;
    state.progress = 0;
    state.lastTime = null;
    state.isWrite = true;
    if (addressArrow) addressArrow.classList.add('active');
    if (dataArrow) dataArrow.classList.add('active');
    updateUI();
    state.rafId = requestAnimationFrame(animLoop);
  }

  function pause() {
    if (!state.playing) return;
    state.playing = false;
    if (state.rafId) { cancelAnimationFrame(state.rafId); state.rafId = null; }
    if (addressArrow) addressArrow.classList.remove('active');
    if (dataArrow) dataArrow.classList.remove('active');
    infoLed.classList.remove('active');
    updateUI();
  }

  function reset() {
    if (state.rafId) { cancelAnimationFrame(state.rafId); state.rafId = null; }
    state.playing = false;
    state.stage = 0;
    state.progress = 0;
    state.bytesWritten = 0;
    state.bytesRead = 0;
    state.lastTime = null;
    if (addressArrow) addressArrow.classList.remove('active');
    if (dataArrow) dataArrow.classList.remove('active');
    infoLed.classList.remove('active');
    resetMemory();
    resetUI();
  }

  function resetUI() {
    byteValue.textContent = '0x00';
    infoOperation.textContent = 'Idle';
    infoAddress.textContent = '--';
    infoData.textContent = '--';
    infoWritten.textContent = '0';
    infoRead.textContent = '0';
    statusText.innerHTML = 'Press <strong>Play</strong> to simulate RAM read/write operations';
    updateButtons();
  }

  var STAGE_DURATION = 800;

  function animLoop(timestamp) {
    if (!state.playing) return;
    if (state.lastTime === null) { state.lastTime = timestamp; state.rafId = requestAnimationFrame(animLoop); return; }
    var dt = timestamp - state.lastTime;
    state.lastTime = timestamp;
    state.progress += dt / STAGE_DURATION;
    if (state.progress >= 1) {
      state.progress = 0;
      performOperation();
    }
    state.rafId = requestAnimationFrame(animLoop);
  }

  function performOperation() {
    var addr = getRandomAddress();
    state.currentAddr = addr;
    state.currentData = getRandomData();

    infoLed.classList.add('active');
    infoAddress.textContent = ADDRS[addr];

    if (state.isWrite) {
      if (isRowFull(addr)) {
        state.isWrite = false;
        infoOperation.textContent = 'Read';
        var rAddr = getRandomAddress();
        state.currentAddr = rAddr;
        infoAddress.textContent = ADDRS[rAddr];
        byteValue.textContent = 'READ';
        infoData.textContent = 'reading...';
        infoOperation.textContent = 'Read';
        state.bytesRead++;
        readFromRow(rAddr);
        infoRead.textContent = state.bytesRead;
      } else {
        byteValue.textContent = '0x' + state.currentData.toString(16).toUpperCase().padStart(2, '0');
        infoData.textContent = '0x' + state.currentData.toString(16).toUpperCase().padStart(2, '0');
        infoOperation.textContent = 'Write';
        state.bytesWritten++;
        writeToRow(addr, state.currentData);
        infoWritten.textContent = state.bytesWritten;
      }
    } else {
      byteValue.textContent = 'READ';
      infoData.textContent = 'reading...';
      infoOperation.textContent = 'Read';
      state.bytesRead++;
      readFromRow(addr);
      infoRead.textContent = state.bytesRead;
      state.isWrite = true;
    }

    updateButtons();
    updateStatusText();
  }

  function updateStatusText() {
    if (state.playing) {
      var op = infoOperation.textContent;
      var addr = infoAddress.textContent;
      statusText.innerHTML = '<strong>' + op + '</strong> at address ' + addr;
    }
  }

  function updateUI() {
    updateButtons();
    if (!state.playing) {
      statusText.innerHTML = state.bytesWritten === 0 && state.bytesRead === 0
        ? 'Press <strong>Play</strong> to simulate RAM read/write operations'
        : 'Simulation paused';
    }
  }

  function updateButtons() {
    playBtn.disabled = state.playing;
    pauseBtn.disabled = !state.playing;
    resetBtn.disabled = state.bytesWritten === 0 && state.bytesRead === 0;
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
