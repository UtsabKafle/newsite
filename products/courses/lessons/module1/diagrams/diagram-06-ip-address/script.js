(function () {
  'use strict';

  var DOM = {};

  function cacheDom() {
    DOM.ipInput = document.getElementById('ipInput');
    DOM.sendBtn = document.getElementById('sendBtn');
    DOM.deviceIp = document.getElementById('deviceIp');
    DOM.deviceEl = document.getElementById('deviceEl');
    DOM.envelope = document.getElementById('envelope');
    DOM.dataPacket = document.getElementById('dataPacket');
    DOM.postalScene = document.getElementById('postalScene');
    DOM.ipScene = document.getElementById('ipScene');
    DOM.mailboxFlag = document.getElementById('mailboxFlag');
    DOM.mailTruck = document.getElementById('mailTruck');
    DOM.tooltip = document.getElementById('tooltipEl');
    DOM.toast = document.getElementById('toastEl');
    DOM.playBtn = document.getElementById('playBtn');
    DOM.pauseBtn = document.getElementById('pauseBtn');
    DOM.resetBtn = document.getElementById('resetBtn');
    DOM.ctrlStatus = document.getElementById('ctrlStatus');
    DOM.ipv4Btn = document.getElementById('ipv4Btn');
    DOM.ipv6Btn = document.getElementById('ipv6Btn');
    DOM.ipvToggle = document.querySelector('.ipv-toggle');
    DOM.segNetwork = document.getElementById('segNetworkVal');
    DOM.segSubnet = document.getElementById('segSubnetVal');
    DOM.segDevice = document.getElementById('segDeviceVal');
    DOM.houseEl = document.getElementById('houseEl');
    DOM.mailboxEl = document.getElementById('mailboxEl');
    DOM.postOffice = document.getElementById('postOffice');
    DOM.routerEl = document.getElementById('routerEl');
    DOM.serverRack = document.getElementById('serverRack');
    DOM.chips = document.querySelectorAll('.chip');
    DOM.sendBtn = document.getElementById('sendBtn');
  }

  var state = {
    playing: false,
    paused: false,
    progress: 0,
    animId: null,
    startTime: null,
    pausedAt: null,
    duration: 1800,
    currentIp: '192.168.1.1',
    isIPv6: false,
    tooltipTimer: null,
    toastTimer: null
  };

  var FUN_FACTS = {
    house: {
      title: 'Street Address',
      body: 'Just like "House 10" identifies a specific building, the Device ID part of an IP address identifies a specific device on a network.'
    },
    mailbox: {
      title: 'Network Interface',
      body: 'Your mailbox receives mail — your Network Interface Card (NIC) receives data packets. Every NIC has a unique MAC address too!'
    },
    postOffice: {
      title: 'Router / Gateway',
      body: 'A post office sorts and forwards mail to the right city. A router does the same with data packets, forwarding them to the correct network.'
    },
    router: {
      title: 'Packet Routing',
      body: 'Routers examine the destination IP address and use routing tables to decide the best path for each data packet across the internet.'
    },
    serverRack: {
      title: 'Data Center',
      body: 'Servers store and serve websites, emails, and apps. When you visit a site, your device sends packets to a server, which sends packets back.'
    },
    device: {
      title: 'IP Assignment',
      body: 'Devices get IP addresses either statically (manual config) or dynamically via DHCP. Most home devices use DHCP from your router.'
    }
  };

  var v6Examples = ['2001:db8::1', '2001:db8:85a3::8a2e:370:7334', 'fe80::1', '::1'];
  var v6Index = 0;

  function isValidIPv4(str) {
    var parts = str.trim().split('.');
    if (parts.length !== 4) return false;
    for (var i = 0; i < parts.length; i++) {
      var n = Number(parts[i]);
      if (parts[i] === '' || isNaN(n) || n < 0 || n > 255) return false;
      if (parts[i] !== String(n)) return false;
    }
    return true;
  }

  function isValidIPv6(str) {
    var s = str.trim();
    if (s.length < 2 || s.length > 39) return false;
    var groups = s.split(':');
    if (groups.length < 2 || groups.length > 8) return false;
    for (var i = 0; i < groups.length; i++) {
      if (groups[i] === '') continue;
      if (!/^[0-9a-fA-F]{1,4}$/.test(groups[i])) return false;
    }
    return true;
  }

  function isValidIP(str) {
    return isValidIPv4(str) || isValidIPv6(str);
  }

  function breakdownIPv4(ip) {
    var parts = ip.trim().split('.');
    return {
      network: parts[0] + '.' + parts[1],
      subnet: parts[2],
      device: parts[3]
    };
  }

  function breakdownIPv6(ip) {
    var s = ip.trim();
    var expanded = expandIPv6(s);
    var groups = expanded.split(':');
    return {
      network: groups.slice(0, 4).join(':'),
      subnet: groups[4],
      device: groups.slice(5).join(':')
    };
  }

  function expandIPv6(ip) {
    var s = ip.trim();
    if (s.includes('::')) {
      var parts = s.split('::');
      var left = parts[0] ? parts[0].split(':') : [];
      var right = parts[1] ? parts[1].split(':') : [];
      var missing = 8 - left.length - right.length;
      var middle = new Array(missing).fill('0');
      return left.concat(middle, right).join(':');
    }
    return s;
  }

  function isPrivateIPv4(ip) {
    var parts = ip.trim().split('.').map(Number);
    if (parts[0] === 10) return true;
    if (parts[0] === 172 && parts[1] >= 16 && parts[1] <= 31) return true;
    if (parts[0] === 192 && parts[1] === 168) return true;
    return false;
  }

  function getIPClass(ip) {
    var first = Number(ip.trim().split('.')[0]);
    if (first >= 1 && first <= 126) return 'A';
    if (first >= 128 && first <= 191) return 'B';
    if (first >= 192 && first <= 223) return 'C';
    if (first >= 224 && first <= 239) return 'D';
    if (first >= 240 && first <= 255) return 'E';
    return '?';
  }

  function updateBreakdown(ip) {
    if (state.isIPv6) {
      if (!isValidIPv6(ip)) {
        DOM.segNetwork.textContent = '???';
        DOM.segSubnet.textContent = '???';
        DOM.segDevice.textContent = '???';
        return;
      }
      var b = breakdownIPv6(ip);
      DOM.segNetwork.textContent = b.network;
      DOM.segSubnet.textContent = b.subnet;
      DOM.segDevice.textContent = b.device;
    } else {
      if (!isValidIPv4(ip)) {
        DOM.segNetwork.textContent = '???';
        DOM.segSubnet.textContent = '???';
        DOM.segDevice.textContent = '???';
        return;
      }
      var b = breakdownIPv4(ip);
      DOM.segNetwork.textContent = b.network;
      DOM.segSubnet.textContent = b.subnet;
      DOM.segDevice.textContent = b.device;
    }
  }

  function setDeviceIp(ip) {
    state.currentIp = ip;
    DOM.deviceIp.textContent = ip;
    updateBreakdown(ip);
    var rows = document.querySelectorAll('.compare-table tbody tr');
    if (rows.length >= 3) {
      if (state.isIPv6) {
        rows[0].querySelectorAll('td')[2].innerHTML = '<span class="tag tag-ip">Network</span> ' + ip.split(':').slice(0, 4).join(':') + '::/48';
        rows[1].querySelectorAll('td')[2].innerHTML = '<span class="tag tag-ip">Subnet</span> ' + ip.split(':').slice(0, 5).join(':') + '::/64';
        rows[2].querySelectorAll('td')[2].innerHTML = '<span class="tag tag-ip">Device</span> ' + ip;
      } else {
        var parts = ip.trim().split('.');
        rows[0].querySelectorAll('td')[2].innerHTML = '<span class="tag tag-ip">Network</span> ' + parts[0] + '.' + parts[1] + '.0.0/16';
        rows[1].querySelectorAll('td')[2].innerHTML = '<span class="tag tag-ip">Subnet</span> ' + parts[0] + '.' + parts[1] + '.' + parts[2] + '.0/24';
        rows[2].querySelectorAll('td')[2].innerHTML = '<span class="tag tag-ip">Device</span> ' + ip;
      }
    }
  }

  function showToast(msg, type) {
    if (DOM.toastTimer) clearTimeout(DOM.toastTimer);
    DOM.toast.className = 'toast ' + (type || '') + ' visible';
    DOM.toast.innerHTML = '<span class="toast-icon">' + (type === 'error' ? '&#9888;' : '&#10003;') + '</span> ' + msg;
    DOM.toastTimer = setTimeout(function () {
      DOM.toast.classList.remove('visible');
    }, 2500);
  }

  function resetAnimation(resetProgress) {
    if (state.animId) {
      cancelAnimationFrame(state.animId);
      state.animId = null;
    }
    state.playing = false;
    state.paused = false;
    state.startTime = null;
    state.pausedAt = null;
    if (resetProgress !== false) state.progress = 0;

    DOM.envelope.style.transition = 'none';
    DOM.dataPacket.style.transition = 'none';
    DOM.envelope.classList.remove('visible');
    DOM.dataPacket.classList.remove('visible');
    DOM.deviceEl.classList.remove('active');
    DOM.mailboxFlag.className = 'mailbox-flag';
    DOM.mailTruck.classList.remove('visible');

    DOM.envelope.style.left = '';
    DOM.envelope.style.top = '';
    DOM.envelope.style.bottom = '';
    DOM.dataPacket.style.right = '';
    DOM.dataPacket.style.top = '';
    DOM.dataPacket.style.bottom = '';
    DOM.mailTruck.style.left = '';
    DOM.mailTruck.style.opacity = '';

    void DOM.envelope.offsetHeight;

    DOM.playBtn.disabled = false;
    DOM.pauseBtn.disabled = true;
    DOM.ctrlStatus.textContent = 'Ready';
  }

  function getScenePositions() {
    var postalRect = DOM.postalScene.getBoundingClientRect();
    var ipRect = DOM.ipScene.getBoundingClientRect();
    return { postalRect: postalRect, ipRect: ipRect };
  }

  function runAnimationStep(timestamp) {
    if (!state.startTime) state.startTime = timestamp;
    var elapsed = timestamp - state.startTime;
    state.progress = Math.min(elapsed / state.duration, 1);

    renderFrame(state.progress);

    if (state.progress < 1) {
      state.animId = requestAnimationFrame(runAnimationStep);
    } else {
      onAnimationComplete();
    }
  }

  function renderFrame(progress) {
    var postalW = DOM.postalScene.offsetWidth;
    var ipW = DOM.ipScene.offsetWidth;

    var ease = progress < 0.5
      ? 4 * progress * progress * progress
      : 1 - Math.pow(-2 * progress + 2, 3) / 2;

    var envStart = -40;
    var envEnd = postalW * 0.55;
    var envX = envStart + (envEnd - envStart) * ease;
    DOM.envelope.style.left = envX + 'px';

    var dpStart = ipW + 60;
    var dpEnd = ipW * 0.35;
    var dpX = dpStart + (dpEnd - dpStart) * ease;
    DOM.dataPacket.style.right = (ipW - dpX) + 'px';

    var truckStart = -60;
    var truckEnd = 60;
    var truckX = truckStart + (truckEnd - truckStart) * ease;
    DOM.mailTruck.style.left = truckX + 'px';

    if (progress > 0.05) {
      DOM.mailTruck.classList.add('visible');
    }

    if (progress > 0.15) {
      DOM.envelope.classList.add('visible');
      DOM.dataPacket.classList.add('visible');
    }

    if (progress > 0.85) {
      DOM.mailboxFlag.className = 'mailbox-flag up';
    }
    if (progress > 0.9) {
      DOM.deviceEl.classList.add('active');
    }

    DOM.ctrlStatus.textContent = Math.round(progress * 100) + '%';
  }

  function onAnimationComplete() {
    state.playing = false;
    state.progress = 1;
    DOM.playBtn.disabled = false;
    DOM.pauseBtn.disabled = true;
    DOM.ctrlStatus.textContent = 'Done';
    showToast('Packet delivered successfully!', 'success');
  }

  function startAnimation() {
    if (state.playing) return;
    resetAnimation(false);
    state.playing = true;
    state.paused = false;
    state.startTime = null;
    DOM.playBtn.disabled = true;
    DOM.pauseBtn.disabled = false;
    DOM.ctrlStatus.textContent = 'Starting...';

    requestAnimationFrame(function () {
      requestAnimationFrame(function () {
        state.animId = requestAnimationFrame(runAnimationStep);
      });
    });
  }

  function pauseAnimation() {
    if (!state.playing || state.paused) return;
    if (state.animId) {
      cancelAnimationFrame(state.animId);
      state.animId = null;
    }
    state.paused = true;
    state.playing = false;
    state.pausedAt = state.progress;
    DOM.playBtn.disabled = false;
    DOM.pauseBtn.disabled = true;
    DOM.ctrlStatus.textContent = 'Paused (' + Math.round(state.progress * 100) + '%)';
  }

  function resumeAnimation() {
    if (!state.paused) return;
    var remaining = state.duration * (1 - state.pausedAt);
    var resumedDuration = remaining;
    var resumedFrom = state.pausedAt;

    state.playing = true;
    state.paused = false;
    DOM.playBtn.disabled = true;
    DOM.pauseBtn.disabled = false;
    DOM.ctrlStatus.textContent = 'Resuming...';

    var resumeStart = null;

    function resumeStep(timestamp) {
      if (!resumeStart) resumeStart = timestamp;
      var elapsed = timestamp - resumeStart;
      var subProgress = Math.min(elapsed / resumedDuration, 1);
      state.progress = resumedFrom + subProgress * (1 - resumedFrom);
      renderFrame(state.progress);

      if (state.progress < 1) {
        state.animId = requestAnimationFrame(resumeStep);
      } else {
        onAnimationComplete();
      }
    }

    state.animId = requestAnimationFrame(resumeStep);
  }

  function sendPacket() {
    var ip = DOM.ipInput.value.trim();
    if (!ip) {
      DOM.ipInput.focus();
      return;
    }
    if (!isValidIP(ip)) {
      DOM.ipInput.classList.add('error');
      showToast('Invalid IP address. Please check the format.', 'error');
      DOM.ipInput.focus();
      DOM.ipInput.select();
      return;
    }
    DOM.ipInput.classList.remove('error');
    setDeviceIp(ip);
    resetAnimation();
    requestAnimationFrame(function () {
      requestAnimationFrame(startAnimation);
    });
  }

  function setIPv4Mode() {
    state.isIPv6 = false;
    DOM.ipv4Btn.classList.add('active');
    DOM.ipv4Btn.setAttribute('aria-checked', 'true');
    DOM.ipv6Btn.classList.remove('active');
    DOM.ipv6Btn.setAttribute('aria-checked', 'false');
    DOM.ipvToggle.classList.remove('ipv6');
    DOM.ipInput.placeholder = 'e.g. 192.168.1.1';
    DOM.ipInput.value = '192.168.1.1';
    setDeviceIp('192.168.1.1');
    for (var i = 0; i < DOM.chips.length; i++) DOM.chips[i].classList.remove('active');
    updateChipsForIPv4();
    document.querySelector('.chip[data-ip="192.168.1.1"]').classList.add('active');
    showToast('Switched to IPv4', 'success');
  }

  function setIPv6Mode() {
    state.isIPv6 = true;
    DOM.ipv4Btn.classList.remove('active');
    DOM.ipv4Btn.setAttribute('aria-checked', 'false');
    DOM.ipv6Btn.classList.add('active');
    DOM.ipv6Btn.setAttribute('aria-checked', 'true');
    DOM.ipvToggle.classList.add('ipv6');
    DOM.ipInput.placeholder = 'e.g. 2001:db8::1';
    var ex = v6Examples[v6Index % v6Examples.length];
    v6Index++;
    DOM.ipInput.value = ex;
    setDeviceIp(ex);
    for (var i = 0; i < DOM.chips.length; i++) DOM.chips[i].classList.remove('active');
    showToast('Switched to IPv6', 'success');
  }

  function updateChipsForIPv4() {
    var ips = ['192.168.1.1', '10.0.0.1', '172.16.0.1', '8.8.8.8'];
    for (var i = 0; i < DOM.chips.length && i < ips.length; i++) {
      DOM.chips[i].setAttribute('data-ip', ips[i]);
      DOM.chips[i].textContent = ips[i];
    }
  }

  function showTooltip(el, data) {
    hideTooltip();
    if (!data) return;
    var rect = el.getBoundingClientRect();
    DOM.tooltip.innerHTML = '<span class="tip-title">' + data.title + '</span>' + data.body;
    DOM.tooltip.classList.add('visible');
    DOM.tooltip.setAttribute('aria-hidden', 'false');

    var top = rect.top - DOM.tooltip.offsetHeight - 10;
    var left = rect.left + rect.width / 2 - DOM.tooltip.offsetWidth / 2;
    if (left < 8) left = 8;
    if (left + DOM.tooltip.offsetWidth > window.innerWidth - 8) {
      left = window.innerWidth - DOM.tooltip.offsetWidth - 8;
    }
    if (top < 4) top = rect.bottom + 10;
    DOM.tooltip.style.top = top + 'px';
    DOM.tooltip.style.left = left + 'px';
  }

  function hideTooltip() {
    DOM.tooltip.classList.remove('visible');
    DOM.tooltip.setAttribute('aria-hidden', 'true');
    if (state.tooltipTimer) {
      clearTimeout(state.tooltipTimer);
      state.tooltipTimer = null;
    }
  }

  function scheduleHideTooltip() {
    if (state.tooltipTimer) clearTimeout(state.tooltipTimer);
    state.tooltipTimer = setTimeout(hideTooltip, 150);
  }

  function bindEvents() {
    DOM.playBtn.addEventListener('click', function () {
      if (state.paused) { resumeAnimation(); return; }
      startAnimation();
    });

    DOM.pauseBtn.addEventListener('click', pauseAnimation);

    DOM.resetBtn.addEventListener('click', function () {
      if (state.animId) {
        cancelAnimationFrame(state.animId);
        state.animId = null;
      }
      resetAnimation();
      setDeviceIp(state.currentIp);
      DOM.ipInput.value = state.currentIp;
      DOM.ipInput.classList.remove('error');
      hideTooltip();
      showToast('Reset complete', '');
    });

    DOM.sendBtn.addEventListener('click', sendPacket);

    DOM.ipInput.addEventListener('keydown', function (e) {
      if (e.key === 'Enter') sendPacket();
    });

    DOM.ipInput.addEventListener('input', function () {
      DOM.ipInput.classList.remove('error');
    });

    DOM.ipv4Btn.addEventListener('click', setIPv4Mode);
    DOM.ipv6Btn.addEventListener('click', setIPv6Mode);

    for (var i = 0; i < DOM.chips.length; i++) {
      DOM.chips[i].addEventListener('click', function () {
        if (state.playing && !state.paused) return;
        var ip = this.getAttribute('data-ip');
        DOM.ipInput.value = ip;
        DOM.ipInput.classList.remove('error');
        if (state.isIPv6 ? isValidIPv6(ip) : isValidIPv4(ip)) {
          setDeviceIp(ip);
        }
        for (var j = 0; j < DOM.chips.length; j++) DOM.chips[j].classList.remove('active');
        this.classList.add('active');
      });
    }

    var tipTargets = [
      { el: DOM.houseEl, key: 'house' },
      { el: DOM.mailboxEl, key: 'mailbox' },
      { el: DOM.postOffice, key: 'postOffice' },
      { el: DOM.routerEl, key: 'router' },
      { el: DOM.serverRack, key: 'serverRack' },
      { el: DOM.deviceEl, key: 'device' }
    ];

    for (var i = 0; i < tipTargets.length; i++) {
      (function (target) {
        var show = function () { showTooltip(target.el, FUN_FACTS[target.key]); };
        var hide = function () { scheduleHideTooltip(); };
        target.el.addEventListener('mouseenter', show);
        target.el.addEventListener('mouseleave', hide);
        target.el.addEventListener('focus', show);
        target.el.addEventListener('blur', function () { setTimeout(hideTooltip, 200); });
        target.el.addEventListener('click', function (e) {
          e.stopPropagation();
          if (DOM.tooltip.classList.contains('visible')) {
            hideTooltip();
          } else {
            showTooltip(target.el, FUN_FACTS[target.key]);
          }
        });
      })(tipTargets[i]);
    }

    document.addEventListener('click', function (e) {
      var tooltipVisible = DOM.tooltip.classList.contains('visible');
      if (tooltipVisible) {
        for (var i = 0; i < tipTargets.length; i++) {
          if (tipTargets[i].el === e.target || tipTargets[i].el.contains(e.target)) return;
        }
        hideTooltip();
      }
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') hideTooltip();
    });
  }

  function init() {
    cacheDom();
    bindEvents();
    setDeviceIp('192.168.1.1');
    DOM.ipInput.value = '192.168.1.1';
    DOM.ctrlStatus.textContent = 'Ready';
    DOM.pauseBtn.disabled = true;
    for (var i = 0; i < DOM.chips.length; i++) {
      if (DOM.chips[i].getAttribute('data-ip') === '192.168.1.1') {
        DOM.chips[i].classList.add('active');
        break;
      }
    }
    DOM.tooltip.setAttribute('aria-hidden', 'true');
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
