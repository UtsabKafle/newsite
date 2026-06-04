(function() {
  'use strict';

  const bits = document.querySelectorAll('.bit');
  const decimalDisplay = document.getElementById('decimalValue');
  const hexDisplay = document.getElementById('hexValue');
  const asciiDisplay = document.getElementById('asciiValue');
  const colorSwatch = document.getElementById('colorSwatch');
  const colorValue = document.getElementById('colorValue');

  let currentBits = [0,0,0,0,0,0,0,0];
  let isPlaying = false;
  let countTimer = null;
  let countValue = 0;

  function bitsToDecimal(bitsArray) {
    let val = 0;
    for (let i = 0; i < 8; i++) {
      if (bitsArray[i]) val += (1 << (7 - i));
    }
    return val;
  }

  function decimalToBits(val) {
    const arr = [];
    for (let i = 7; i >= 0; i--) {
      arr.push((val >> i) & 1);
    }
    return arr;
  }

  function updateDisplay(bitsArray) {
    const dec = bitsToDecimal(bitsArray);

    // Update bit buttons
    bits.forEach((btn, i) => {
      const val = bitsArray[i];
      btn.textContent = val;
      btn.className = 'bit ' + (val ? 'on' : 'off');
    });

    // Decimal
    decimalDisplay.textContent = dec;

    // Hex
    hexDisplay.textContent = '0x' + dec.toString(16).toUpperCase().padStart(2, '0');

    // ASCII
    if (dec >= 32 && dec <= 126) {
      asciiDisplay.textContent = String.fromCharCode(dec);
    } else if (dec === 0) {
      asciiDisplay.textContent = 'NUL';
    } else if (dec === 10) {
      asciiDisplay.textContent = 'LF';
    } else if (dec === 13) {
      asciiDisplay.textContent = 'CR';
    } else if (dec === 127) {
      asciiDisplay.textContent = 'DEL';
    } else {
      asciiDisplay.textContent = `0x${dec.toString(16).toUpperCase().padStart(2, '0')}`;
    }

    // Color (use as grayscale or simple color mapping)
    const r = (dec & 0xE0) << 0;
    const g = (dec & 0x1C) << 3;
    const b = (dec & 0x03) << 6;
    const hex = '#' + [r,g,b].map(v => v.toString(16).padStart(2,'0')).join('');
    colorSwatch.style.background = hex;
    colorValue.textContent = hex;
  }

  function toggleBit(index) {
    currentBits[index] = currentBits[index] ? 0 : 1;
    updateDisplay(currentBits);
  }

  // Bit click handlers
  bits.forEach((btn, i) => {
    btn.addEventListener('click', function() { toggleBit(i); });
    btn.addEventListener('keydown', function(e) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        toggleBit(i);
      }
    });
  });

  // Play: auto-count from 0-255
  function startCounting() {
    if (isPlaying) return;
    isPlaying = true;
    countValue = bitsToDecimal(currentBits);

    function step() {
      if (!isPlaying) return;
      countValue = (countValue + 1) % 256;
      currentBits = decimalToBits(countValue);
      updateDisplay(currentBits);

      const speed = parseInt(document.getElementById('speedSlider').value);
      const delay = Math.max(50, 600 - (speed - 1) * 55);
      countTimer = setTimeout(step, delay);
    }

    step();
  }

  function stopCounting() {
    isPlaying = false;
    if (countTimer) {
      clearTimeout(countTimer);
      countTimer = null;
    }
  }

  function resetBits() {
    stopCounting();
    currentBits = [0,0,0,0,0,0,0,0];
    countValue = 0;
    updateDisplay(currentBits);
  }

  // Controls
  document.getElementById('playBtn').addEventListener('click', startCounting);
  document.getElementById('pauseBtn').addEventListener('click', stopCounting);
  document.getElementById('resetBtn').addEventListener('click', resetBits);

  // Keyboard for ctrl buttons
  document.querySelectorAll('.ctrl-btn').forEach(btn => {
    btn.addEventListener('keydown', function(e) {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); this.click(); }
    });
  });

  // Initial display
  updateDisplay(currentBits);
})();
