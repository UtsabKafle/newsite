(function () {
  'use strict';

  // ===== Score State =====
  const scoreState = {
    passwordScore: 0,
    httpsScored: false,
    sorterCorrect: 0,
    sorterTotal: 0,
    generatedScored: false,
  };

  function getTotalScore() {
    const pw = Math.min(scoreState.passwordScore, 100) * 0.30;
    const https = scoreState.httpsScored ? 15 : 0;
    const sorter = scoreState.sorterTotal > 0
      ? Math.round((scoreState.sorterCorrect / scoreState.sorterTotal) * 100) * 0.35
      : 0;
    const gen = scoreState.generatedScored ? 20 : 0;
    return Math.min(Math.round(pw + https + sorter + gen), 100);
  }

  function updateScore() {
    const pct = getTotalScore();
    const scoreText = document.getElementById('scoreText');
    const scoreFill = document.getElementById('scoreFill');
    const progress = document.querySelector('.score-track');
    scoreText.textContent = 'Safety Score: ' + pct + '%';
    scoreFill.style.width = pct + '%';
    if (progress) {
      progress.setAttribute('aria-valuenow', pct);
    }
  }

  // ===== 1. Password Strength Meter =====
  (function () {
    const input = document.getElementById('passwordInput');
    const fill = document.getElementById('strengthFill');
    const label = document.getElementById('strengthLabel');
    const criteriaEls = document.querySelectorAll('.criteria-item');
    const bar = document.getElementById('strengthBar');

    function evaluate(pw) {
      const checks = {
        length: pw.length >= 8,
        upper: /[A-Z]/.test(pw),
        lower: /[a-z]/.test(pw),
        number: /[0-9]/.test(pw),
        special: /[^A-Za-z0-9]/.test(pw),
      };

      let score = 0;
      for (const k in checks) {
        if (checks[k]) score++;
      }

      let level, color, pct;
      if (pw.length === 0) {
        level = 'No password';
        color = 'var(--text-muted)';
        pct = 0;
      } else if (score <= 1) {
        level = 'Weak';
        color = 'var(--weak)';
        pct = 20;
      } else if (score <= 2) {
        level = 'Weak';
        color = 'var(--weak)';
        pct = 35;
      } else if (score <= 3) {
        level = 'Medium';
        color = 'var(--medium)';
        pct = 55;
      } else if (score <= 4) {
        level = 'Strong';
        color = 'var(--strong)';
        pct = 75;
      } else {
        level = 'Very Strong';
        color = 'var(--very-strong)';
        pct = 100;
      }

      return { checks, level, color, pct, rawScore: score };
    }

    function update() {
      const pw = input.value;
      const result = evaluate(pw);
      fill.style.width = result.pct + '%';
      fill.style.background = result.color;
      label.textContent = result.level;
      label.style.color = result.color;
      if (bar) bar.setAttribute('aria-valuenow', Math.round(result.pct / 25));

      criteriaEls.forEach(function (el) {
        const key = el.getAttribute('data-criteria');
        if (result.checks[key]) {
          el.classList.add('met');
        } else {
          el.classList.remove('met');
        }
      });

      if (pw.length > 0) {
        scoreState.passwordScore = Math.round((result.rawScore / 5) * 100);
      } else {
        scoreState.passwordScore = 0;
      }
      updateScore();
    }

    input.addEventListener('input', update);
  })();

  // ===== 2. HTTPS vs HTTP Toggle =====
  (function () {
    const toggle = document.getElementById('httpsToggle');
    const thumb = document.getElementById('toggleThumb');
    const stateLabel = document.getElementById('toggleState');
    const padlock = document.getElementById('padlock');
    const info = document.getElementById('httpsInfo');

    function update(https) {
      toggle.setAttribute('aria-checked', https);
      stateLabel.textContent = https ? 'HTTPS' : 'HTTP';
      padlock.textContent = https ? '\u{1F512}' : '\u{1F513}';
      padlock.setAttribute('aria-label', https ? 'Connection is secure' : 'Connection is not secure');
      info.innerHTML = https
        ? '<strong>HTTPS</strong> encrypts data between your browser and the website, protecting your information from eavesdroppers. Always look for the padlock!'
        : '<strong>HTTP</strong> sends data in plain text. Anyone on the same network can read your information. Avoid entering sensitive data on HTTP sites.';
      if (!scoreState.httpsScored && https) {
        scoreState.httpsScored = true;
      } else if (!https) {
        scoreState.httpsScored = false;
      }
      updateScore();
    }

    toggle.addEventListener('click', function () {
      const current = toggle.getAttribute('aria-checked') === 'true';
      update(!current);
    });

    toggle.addEventListener('keydown', function (e) {
      if (e.key === ' ' || e.key === 'Enter') {
        e.preventDefault();
        toggle.click();
      }
    });

    update(true);
  })();

  // ===== 3. Share / Don't Share Sorter =====
  (function () {
    const items = document.querySelectorAll('.sorter-item');
    const safeList = document.getElementById('safeList');
    const privateList = document.getElementById('privateList');
    const feedback = document.getElementById('sorterFeedback');
    const correctMap = {
      name: 'safe',
      color: 'safe',
      password: 'private',
      email: 'private',
      address: 'private',
      phone: 'private',
    };

    let activeItem = null;
    let sortedIds = [];

    function clearBuckets() {
      safeList.innerHTML = '';
      privateList.innerHTML = '';
    }

    function renderBuckets() {
      clearBuckets();
      for (const id of sortedIds) {
        const span = document.createElement('span');
        span.textContent = id;
        if (correctMap[id] === 'safe') {
          safeList.appendChild(span);
        } else {
          privateList.appendChild(span);
        }
      }
    }

    function resetSorter(keepScore) {
      items.forEach(function (el) {
        el.classList.remove('sorted', 'active');
        el.disabled = false;
      });
      sortedIds = [];
      clearBuckets();
      activeItem = null;
      feedback.textContent = '';
      if (!keepScore) {
        scoreState.sorterCorrect = 0;
        scoreState.sorterTotal = 0;
        updateScore();
      }
    }

    function evaluateSorter() {
      let correct = 0;
      let total = sortedIds.length;
      for (const id of sortedIds) {
        const bucket = correctMap[id];
        const inSafe = safeList.querySelector('span') && Array.from(safeList.children).some(function (s) { return s.textContent === id; });
        const inPrivate = privateList.querySelector('span') && Array.from(privateList.children).some(function (s) { return s.textContent === id; });
        if ((bucket === 'safe' && inSafe) || (bucket === 'private' && inPrivate)) {
          correct++;
        }
      }
      scoreState.sorterCorrect = correct;
      scoreState.sorterTotal = total;
      updateScore();

      if (total === Object.keys(correctMap).length) {
        if (correct === total) {
          feedback.textContent = 'All correct! Great job!';
          feedback.style.color = 'var(--success)';
        } else {
          feedback.textContent = correct + ' of ' + total + ' correct. Try again!';
          feedback.style.color = 'var(--warning)';
        }
      } else {
        feedback.textContent = '';
      }
    }

    items.forEach(function (btn) {
      btn.addEventListener('click', function () {
        if (btn.classList.contains('sorted')) return;
        if (activeItem) {
          activeItem.classList.remove('active');
        }
        activeItem = btn;
        btn.classList.add('active');
      });

      btn.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          btn.click();
        }
      });
    });

    function placeItem(bucket) {
      if (!activeItem) return;
      const id = activeItem.getAttribute('data-id');
      if (sortedIds.indexOf(id) !== -1) return;

      const expected = correctMap[id];
      const span = document.createElement('span');
      span.textContent = id;

      if (bucket === 'safe') {
        safeList.appendChild(span);
      } else {
        privateList.appendChild(span);
      }
      sortedIds.push(id);
      activeItem.classList.remove('active');
      activeItem.classList.add('sorted');
      activeItem.disabled = true;
      activeItem = null;

      evaluateSorter();
    }

    document.getElementById('bucketSafe').addEventListener('click', function () { placeItem('safe'); });
    document.getElementById('bucketPrivate').addEventListener('click', function () { placeItem('private'); });

    document.getElementById('bucketSafe').addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); placeItem('safe'); }
    });
    document.getElementById('bucketPrivate').addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); placeItem('private'); }
    });

    window.__resetSorter = function (keepScore) { resetSorter(keepScore); };
  })();

  // ===== 4. Password Generator =====
  (function () {
    const display = document.getElementById('genPasswordDisplay');
    const generateBtn = document.getElementById('generateBtn');
    const copyBtn = document.getElementById('copyBtn');
    const feedbackEl = document.getElementById('genFeedback');
    const lenInput = document.getElementById('genLength');
    const upperChk = document.getElementById('genUpper');
    const lowerChk = document.getElementById('genLower');
    const numChk = document.getElementById('genNumbers');
    const specialChk = document.getElementById('genSpecial');

    let generatedPassword = '';

    function getChars() {
      let chars = '';
      if (upperChk.checked) chars += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
      if (lowerChk.checked) chars += 'abcdefghijklmnopqrstuvwxyz';
      if (numChk.checked) chars += '0123456789';
      if (specialChk.checked) chars += '!@#$%^&*()_+-=[]{}|;:,.<>?';
      return chars;
    }

    function generate() {
      const chars = getChars();
      if (chars.length === 0) {
        display.textContent = 'Select at least one character type';
        generatedPassword = '';
        copyBtn.disabled = true;
        return;
      }
      let len = parseInt(lenInput.value, 10);
      if (isNaN(len) || len < 8) len = 12;
      if (len > 64) len = 64;
      lenInput.value = len;

      let pw = '';
      const array = new Uint32Array(len);
      crypto.getRandomValues(array);
      for (let i = 0; i < len; i++) {
        pw += chars[array[i] % chars.length];
      }

      generatedPassword = pw;
      display.textContent = pw;
      copyBtn.disabled = false;
      feedbackEl.textContent = '';
      if (!scoreState.generatedScored) {
        scoreState.generatedScored = true;
        updateScore();
      }
    }

    function copy() {
      if (!generatedPassword) return;
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(generatedPassword).then(function () {
          feedbackEl.textContent = 'Copied to clipboard!';
        }).catch(function () {
          fallbackCopy();
        });
      } else {
        fallbackCopy();
      }
    }

    function fallbackCopy() {
      const ta = document.createElement('textarea');
      ta.value = generatedPassword;
      ta.style.position = 'fixed';
      ta.style.left = '-9999px';
      document.body.appendChild(ta);
      ta.select();
      try {
        document.execCommand('copy');
        feedbackEl.textContent = 'Copied to clipboard!';
      } catch (e) {
        feedbackEl.textContent = 'Failed to copy.';
      }
      document.body.removeChild(ta);
    }

    generateBtn.addEventListener('click', generate);
    copyBtn.addEventListener('click', copy);
    generateBtn.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); generate(); }
    });
    copyBtn.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); copy(); }
    });

    generate();

    window.__resetGenerator = function () {
      generatedPassword = '';
      display.textContent = 'Click "Generate" to create a password';
      copyBtn.disabled = true;
      feedbackEl.textContent = '';
      if (scoreState.generatedScored) {
        scoreState.generatedScored = false;
        updateScore();
      }
    };
  })();

  // ===== Reset All =====
  document.getElementById('resetAllBtn').addEventListener('click', function () {
    document.getElementById('passwordInput').value = '';
    document.getElementById('passwordInput').dispatchEvent(new Event('input'));

    const httpsToggle = document.getElementById('httpsToggle');
    if (httpsToggle.getAttribute('aria-checked') !== 'true') {
      httpsToggle.click();
    }

    if (typeof window.__resetSorter === 'function') {
      window.__resetSorter(true);
    }

    if (typeof window.__resetGenerator === 'function') {
      window.__resetGenerator();
    }

    scoreState.passwordScore = 0;
    scoreState.httpsScored = true;
    scoreState.sorterCorrect = 0;
    scoreState.sorterTotal = 0;
    scoreState.generatedScored = false;
    updateScore();

    document.activeElement && document.activeElement.blur();
  });

  // ===== Init score =====
  updateScore();
})();
