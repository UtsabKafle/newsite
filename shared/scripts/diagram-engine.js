/* ═══════════════════════════════════════════════════════
   Consica Labs — Universal Interactive Diagram Engine v3
   ═══════════════════════════════════════════════════════ */
(function(){'use strict';

const $=(s,p=document)=>p.querySelector(s);
const $$=(s,p=document)=>[...p.querySelectorAll(s)];
const html=(s,...v)=>s.reduce((a,x,i)=>a+x+(v[i]||''),'');
const _formatTitle=s=>{
  if(!s)return'';
  const rx={'Cpu':'CPU','Dns':'DNS','Ip ':'IP ','Isp':'ISP','Gpu':'GPU','Ram':'RAM','Ssd':'SSD','Hdd':'HDD','Nvme':'NVMe','Psu':'PSU','Bios':'BIOS','Uefi':'UEFI','Nat':'NAT','Dhcp':'DHCP','Tcp':'TCP','Ssh':'SSH','Ftp':'FTP','Pcie':'PCIe','Vrm':'VRM','Lcd':'LCD','Led':'LED','Ddr':'DDR','Sata':'SATA','Usb':'USB','Hdmi':'HDMI','Vpn':'VPN','Tls':'TLS','Ssl':'SSL','Bgp':'BGP','Ospf':'OSPF','Dram':'DRAM','Sram':'SRAM','Ccd':'CCD','Cmos':'CMOS','Dsl':'DSL','Pwm':'PWM','Ai':'AI','Io':'I/O','Tld':'TLD','Dvd':'DVD','Blu':'Blu'};
  let r=s;for(const[k,v]of Object.entries(rx)){r=r.replace(new RegExp('\\b'+k,'g'),v)}return r;
};

const ICONS={
  laptop:'M3 7a2 2 0 012-2h14a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V7zm16 0H5v9h14V7zm-7 11h4v2H8v-2h4z',
  router:'M12 3v2M12 19v2M5 12H3M21 12h-2M7 7L5 5M19 19l-2-2M19 5l-2 2M7 17l-2 2M12 9a3 3 0 110 6 3 3 0 010-6zM10 12h4',
  server:'M4 2h16v4H4V2zm0 6h16v4H4V8zm0 6h16v4H4v-4zm12 4v4H8v-4h8z',
  cloud:'M18 10a6 6 0 00-11.5-3A5 5 0 005 17h13a4 4 0 000-8z',
  globe:'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z',
  wifi:'M1 9l2 2c4.97-4.97 13.03-4.97 18 0l2-2C16.93 2.93 7.08 2.93 1 9zm8 8l3 3 3-3c-1.65-1.66-4.34-1.66-6 0zm-4-4l2 2c2.76-2.76 7.24-2.76 10 0l2-2C15.14 9.14 8.87 9.14 5 13z',
  modem:'M8 3a5 5 0 00-5 5v3h18V8a5 5 0 00-5-5H8zm-1 6a1 1 0 100-2 1 1 0 000 2zm10 0a1 1 0 100-2 1 1 0 000 2zM3 13v4a5 5 0 005 5h8a5 5 0 005-5v-4H3zm5 3h8v2H8v-2z',
  browser:'M3 3h18v18H3V3zm2 2v14h14V5H5zm2 2h10v2H7V7zm0 4h10v2H7v-2zm0 4h6v2H7v-2z',
  packet:'M12 1L2 6l10 5 10-5-10-5zM2 11l10 5 10-5M2 16l10 5 10-5M2 21l10 5 10-5',
  cable:'M7 2v6h2V2H7zm8 0v6h2V2h-2zM3 10h18v4H3v-4zm2 4v6h2v-6H5zm12 0v6h2v-6h-2zm-6 0v8h2v-8h-2z',
  database:'M12 2C7.58 2 4 3.79 4 6v12c0 2.21 3.58 4 8 4s8-1.79 8-4V6c0-2.21-3.58-4-8-4zm0 2c3.87 0 6 1.5 6 2s-2.13 2-6 2-6-1.5-6-2 2.13-2 6-2zM4 10c0 1.5 3.58 3 8 3s8-1.5 8-3v2c0 1.5-3.58 3-8 3s-8-1.5-8-3v-2zm0 5c0 1.5 3.58 3 8 3s8-1.5 8-3v2c0 1.5-3.58 3-8 3s-8-1.5-8-3v-2z',
  shield:'M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm0 10.99h7c-.53 4.12-3.28 7.79-7 8.94V12H5V6.3l7-3.11v8.8z',
  lock:'M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1s3.1 1.39 3.1 3.1v2z',
  cdn:'M2 12c0 5.52 4.48 10 10 10V2C6.48 2 2 6.48 2 12zm10-4v8l4-4-4-4z',
  satellite:'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zM9 10c0-1.66 1.34-3 3-3s3 1.34 3 3-1.34 3-3 3-3-1.34-3-3z',
  'data-center':'M3 2h18v2H3V2zm0 4h18v2H3V6zm0 4h18v2H3v-2zm0 4h18v2H3v-2zm0 4h18v2H3v-2z',
  firewall:'M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm0 2.18l7 3.12v4.7c0 4.46-2.95 8.47-7 9.63V3.18z',
  'load-balancer':'M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5',
  'cell-tower':'M12 2c4.42 0 8 3.58 8 8 0 2.5-1.15 4.73-2.93 6.17L15 13.5c.6-.75 1-1.67 1-2.5 0-2.21-1.79-4-4-4S8 8.79 8 11c0 .83.4 1.75 1 2.5l-2.07 2.67C5.15 14.73 4 12.5 4 10c0-4.42 3.58-8 8-8zm0 4c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm-2 5.5c-.6.75-1 1.67-1 2.5 0 1.66 1.34 3 3 3s3-1.34 3-3c0-.83-.4-1.75-1-2.5h-4zM7 20h10l-1 2H8l-1-2z',
  monitor:'M20 3H4c-1.1 0-2 .9-2 2v11c0 1.1.9 2 2 2h6l-1 2H8v2h8v-2h-1l-1-2h6c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 13H4V5h16v11z',
  chip:'M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 2v14H5V5h14zm-7 3c-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4-1.79-4-4-4zm0 6c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2z',
  cpu:'M9 3v2h6V3h2v2h2v2h-2v2h2v2h-2v2h2v2h-2v2h2v2h-2v2H9v-2H7v-2h2v-2H7v-2h2v-2H7V9h2V7H7V5h2V3h2zM6 9H3v2h3V9zm12 0h3v2h-3V9zM6 13H3v2h3v-2zm12 0h3v2h-3v-2zM9 15h6v6H9v-6zm0-12h6v6H9V3z',
  ram:'M2 3h20v18H2V3zm2 2v14h16V5H4zm2 2h2v10H6V7zm14 0h-2v10h2V7z',
  hdd:'M3 3h18v14H3V3zm2 2v10h14V5H5zm0 12h14v2H5v-2zm2 2v2H5v-2h2zm10 0v2h2v-2h-2z',
  gpu:'M4 2h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2zm0 2v12h16V4H4zm2 2h12v8H6V6zm2 2v4h8V8H8zm-2 10h12v2H6v-2zm0 2v2H4v-2h2zm12 0v2h2v-2h-2z',
  power:'M12 2v10M8 5c-3.31 1.34-6 4.19-6 8 0 4.97 4.03 9 9 9s9-4.03 9-9c0-3.81-2.69-6.66-6-8',
  user:'M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z',
  network:'M16 4a4 4 0 01-4 4 4 4 0 01-4-4 4 4 0 014-4 4 4 0 014 4zM4 16h.01M20 16h.01M8 20h.01M16 20h.01M6 8a2 2 0 110-4 2 2 0 010 4zm12 0a2 2 0 110-4 2 2 0 010 4zM2 20a2 2 0 110-4 2 2 0 010 4zm20 0a2 2 0 110-4 2 2 0 010 4zM10 20a2 2 0 110-4 2 2 0 010 4zm4 0a2 2 0 110-4 2 2 0 010 4z',
  key:'M21 2l-2 2m-7.61 7.61a5.5 5.5 0 11-7.78 7.78 5.5 5.5 0 017.78-7.78zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4',
  printer:'M19 8H5c-1.66 0-3 1.34-3 3v6h4v4h12v-4h4v-6c0-1.66-1.34-3-3-3zm-3 11H8v-5h8v5zm3-7c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1zm-1-9H6v4h12V3z',
  mouse:'M12 2C9.24 2 7 4.24 7 7v5c0 2.76 2.24 5 5 5s5-2.24 5-5V7c0-2.76-2.24-5-5-5zm1 7h-2V5h2v4z',
  phone:'M17 1.01L7 1c-1.1 0-2 .9-2 2v18c0 1.1.9 2 2 2h10c1.1 0 2-.9 2-2V3c0-1.1-.9-1.99-2-1.99zM17 19H7V5h10v14z',
  mail:'M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z',
  search:'M15.5 14h-.79l-.28-.27A6.47 6.47 0 0016 9.5 6.5 6.5 0 109.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z',
  clock:'M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67V7z',
  star:'M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z',
  heart:'M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z',
  filter:'M3 3h18v2.5l-7 8.05V21l-4-2.5v-6.95L3 5.5V3z',
  settings:'M19.14 12.94c.04-.3.06-.61.06-.94 0-.32-.02-.64-.07-.94l2.03-1.58a.49.49 0 00.12-.61l-1.92-3.32a.49.49 0 00-.59-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94l-.36-2.54a.484.484 0 00-.48-.41h-3.84c-.24 0-.43.17-.47.41l-.36 2.54c-.59.24-1.13.57-1.62.94l-2.39-.96c-.22-.08-.47 0-.59.22L2.74 8.87c-.12.21-.08.47.12.61l2.03 1.58c-.05.3-.07.62-.07.94s.02.64.07.94l-2.03 1.58a.49.49 0 00-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.24.41.48.41h3.84c.24 0 .44-.17.47-.41l.36-2.54c.59-.24 1.13-.56 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32c.12-.22.07-.47-.12-.61l-2.01-1.58zM12 15.6A3.6 3.6 0 1115.6 12 3.6 3.6 0 0112 15.6z'
};

const DIAGRAM_THEMES = {
  dark: {
    compBgs: ['#1a2235','#1d2638','#16233a','#1a2538','#1c2838','#18243a'],
    compBgActive: '#1e2d50',
    compStroke: '#2a3a55',
    compStrokeActive: '#0959C8',
    connColors: ['#475569','#64748b','#475569'],
    connLabel: '#94a3b8',
    compText: '#e2e8f0',
    iconBg: 'rgba(9,89,200,0.15)',
    iconPath: '#60a5fa',
    markerBg: 'rgba(9,89,200,0.2)',
    markerText: '#60a5fa'
  },
  light: {
    compBgs: ['#e2e8f0','#cbd5e1','#d1d5db','#d4d4d8','#e5e7eb','#dce1e8'],
    compBgActive: '#bfdbfe',
    compStroke: '#94a3b8',
    compStrokeActive: '#3b82f6',
    connColors: ['#94a3b8','#64748b','#94a3b8'],
    connLabel: '#64748b',
    compText: '#1e293b',
    iconBg: 'rgba(9,89,200,0.1)',
    iconPath: '#3b82f6',
    markerBg: 'rgba(9,89,200,0.12)',
    markerText: '#3b82f6'
  }
};

class DiagramEngine {
  constructor(cfg) {
    this.cfg = cfg;
    this.speed = 1;
    this.playing = false;
    this.t = 0;
    this.dt = 0;
    this.selectedId = null;
    this.currentStep = -1;
    this.detailMode = 'basic';
    this.mode = 'learn'; // 'learn' or 'challenge'
    this.lastFrame = 0;
    this.rafId = null;
    this._connPaths = [];
    this._flowDots = [];
    this._theme = null;
    this.zoom = 1;
    this.panX = 0;
    this.panY = 0;
    this._origViewBox = null;
    this._listeners = {};
    this._pulseCache = null;
    this._viewBox = null;
    this._isPanning = false;
    this._panStart = null;
    this._tooltipEl = null;
    this._tooltipVisible = false;

    // LocalStorage key for Completion
    this.storageKey = `consica-diagram-${cfg.module || 0}-${cfg.title.replace(/\s+/g, '-').toLowerCase()}-completed`;

    this.el = {};
    this._build();
    this._bind();
    this._initCompletion();
    this._initTheme();

    if (this.cfg.render) this.cfg.render(this.el.visual, this);
    this._initZoomPan();
    this._showEmptyState();
    this._updateStepControls();

    if (window.matchMedia('(prefers-reduced-motion:reduce)').matches) {
      this.speed = 0;
      this._updateSpeedDisplay();
    }

    // Wrap animate callback to apply theme-aware component colors each frame
    if (this.cfg.animate) {
      var origAnimate = this.cfg.animate;
      var eng = this;
      this.cfg.animate = function(e) {
        origAnimate(e);
        if (!e.selectedId && e._pulseCache) {
          var pals = e._pal();
          var comps = e._pulseCache.comps;
          if (comps && comps.length) {
            for (var ci = 0; ci < comps.length; ci++) {
              var shape = comps[ci].querySelector('.component-bg > :first-child');
              if (!shape) continue;
              if (ci === e._pulseCache.lastIdx) {
                shape.setAttribute('fill', pals.compBgActive);
                shape.setAttribute('stroke', pals.compStrokeActive);
              } else {
                shape.setAttribute('fill', pals.compBgs[ci % 6]);
                shape.setAttribute('stroke', pals.compStroke);
              }
            }
          }
        }
      };
    }
  }

  _getTheme() {
    return localStorage.getItem('consica-theme') || (window.matchMedia('(prefers-color-scheme:light)').matches ? 'light' : 'dark');
  }

  _applyTheme(theme) {
    this._theme = theme;
    document.documentElement.setAttribute('data-theme', theme);
    if (theme === 'light') {
      document.documentElement.classList.add('light');
      document.documentElement.classList.remove('dark');
    } else {
      document.documentElement.classList.add('dark');
      document.documentElement.classList.remove('light');
    }
    const tb = document.getElementById('diagram-theme-toggle');
    if (tb) {
      const next = theme === 'light' ? 'dark' : 'light';
      tb.setAttribute('aria-label', 'Switch to ' + next + ' mode');
      tb.innerHTML = theme === 'light'
        ? '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="14" height="14"><path d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"/></svg><span class="act-label">Dark</span>'
        : '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="14" height="14"><path stroke-linecap="round" stroke-linejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707m0-12.728l.707.707m12.728 12.728l.707-.707M12 8a4 4 0 100 8 4 4 0 000-8z"/></svg><span class="act-label">Light</span>';
    }
  }

  _initTheme() {
    const saved = this._getTheme();
    this._applyTheme(saved);
  }

  _toggleTheme() {
    const next = this._theme === 'light' ? 'dark' : 'light';
    this._applyTheme(next);
    localStorage.setItem('consica-theme', next);
    if (this.mode === 'learn') {
      this.pause();
      this.t = 0;
      this.currentStep = 0;
      if (this.cfg.render) this.cfg.render(this.el.visual, this);
      this._initZoomPan();
      this._applyStep();
    } else if (this.mode === 'challenge') {
      if (this.cfg.customChallenge) {
        this.cfg.customChallenge(this.el.visual, this);
      } else {
        this.buildFallbackChallenge();
      }
    }
  }

  destroy() {
    this.pause();
    if (this._listeners.panMove) document.removeEventListener('mousemove', this._listeners.panMove);
    if (this._listeners.panEnd) document.removeEventListener('mouseup', this._listeners.panEnd);
    if (this._listeners.keyNav) document.removeEventListener('keydown', this._listeners.keyNav);
    // Remove SVG zoom/pan listeners
    var svg = this.el.visual ? this.el.visual.querySelector('svg') : null;
    if (svg) {
      if (this._listeners.zoomWheel) svg.removeEventListener('wheel', this._listeners.zoomWheel);
      if (this._listeners.zoomMousedown) svg.removeEventListener('mousedown', this._listeners.zoomMousedown);
      if (this._listeners.zoomDblclick) svg.removeEventListener('dblclick', this._listeners.zoomDblclick);
      if (this._listeners.zoomTouchstart) svg.removeEventListener('touchstart', this._listeners.zoomTouchstart);
      if (this._listeners.zoomTouchmove) svg.removeEventListener('touchmove', this._listeners.zoomTouchmove);
    }
    this._listeners = {};
    this._connPaths = [];
    this._flowDots = [];
    this._pulseCache = null;
    this._metricsCache = null;
  }

  _pal() {
    return DIAGRAM_THEMES[this._theme === 'light' ? 'light' : 'dark'];
  }

  _initZoomPan() {
    var svg = this.el.visual.querySelector('svg');
    if (!svg) return;
    var vb = svg.getAttribute('viewBox');
    if (!vb) return;
    var parts = vb.split(' ').map(Number);
    this._origViewBox = { x: parts[0], y: parts[1], w: parts[2], h: parts[3] };
    this._viewBox = { x: parts[0], y: parts[1], w: parts[2], h: parts[3] };
    this.zoom = 1;
    this._isPanning = false;
    this._panStart = null;
    var self = this;

    // Remove old SVG listeners to avoid duplicates on re-init
    if (this._listeners.zoomWheel) { svg.removeEventListener('wheel', this._listeners.zoomWheel); }
    if (this._listeners.zoomMousedown) { svg.removeEventListener('mousedown', this._listeners.zoomMousedown); }
    if (this._listeners.zoomDblclick) { svg.removeEventListener('dblclick', this._listeners.zoomDblclick); }
    if (this._listeners.zoomTouchstart) { svg.removeEventListener('touchstart', this._listeners.zoomTouchstart); }
    if (this._listeners.zoomTouchmove) { svg.removeEventListener('touchmove', this._listeners.zoomTouchmove); }

    svg.style.cursor = 'grab';
    this._listeners.zoomWheel = function(e) {
      e.preventDefault();
      var rect = svg.getBoundingClientRect();
      var mx = (e.clientX - rect.left) / rect.width;
      var my = (e.clientY - rect.top) / rect.height;
      var factor = e.deltaY > 0 ? 1.12 : 1 / 1.12;
      var nw = Math.max(50, Math.min(self._origViewBox.w * 5, self._viewBox.w * factor));
      var nh = nw * (self._origViewBox.h / self._origViewBox.w);
      self._viewBox.x = (self._viewBox.x + self._viewBox.w * mx) - nw * mx;
      self._viewBox.y = (self._viewBox.y + self._viewBox.h * my) - nh * my;
      self._viewBox.w = nw;
      self._viewBox.h = nh;
      self.zoom = Math.round((self._origViewBox.w / nw) * 100);
      svg.setAttribute('viewBox', self._viewBox.x + ' ' + self._viewBox.y + ' ' + nw + ' ' + nh);
      self._updateZoomDisplay();
    };
    svg.addEventListener('wheel', this._listeners.zoomWheel, { passive: false });

    this._listeners.zoomMousedown = function(e) {
      if (e.button !== 0 || e.target.closest('[data-component-id],[role="button"],[tabindex]')) return;
      self._isPanning = true;
      self._panStart = { x: e.clientX, y: e.clientY, vbX: self._viewBox.x, vbY: self._viewBox.y };
      svg.style.cursor = 'grabbing';
    };
    svg.addEventListener('mousedown', this._listeners.zoomMousedown);

    this._listeners.panMove = function(e) {
      if (!self._isPanning) return;
      var rect = svg.getBoundingClientRect();
      var dx = (e.clientX - self._panStart.x) / rect.width * self._viewBox.w;
      var dy = (e.clientY - self._panStart.y) / rect.height * self._viewBox.h;
      self._viewBox.x = self._panStart.vbX - dx;
      self._viewBox.y = self._panStart.vbY - dy;
      svg.setAttribute('viewBox', self._viewBox.x + ' ' + self._viewBox.y + ' ' + self._viewBox.w + ' ' + self._viewBox.h);
    };
    document.addEventListener('mousemove', this._listeners.panMove);

    this._listeners.panEnd = function() {
      if (!self._isPanning) return;
      self._isPanning = false;
      svg.style.cursor = 'grab';
    };
    document.addEventListener('mouseup', this._listeners.panEnd);

    this._listeners.zoomDblclick = function() {
      self._resetZoom();
    };
    svg.addEventListener('dblclick', this._listeners.zoomDblclick);

    // Touch zoom/pan
    var touchDist = 0, touchStart = null;
    this._listeners.zoomTouchstart = function(e) {
      if (e.touches.length === 2) {
        e.preventDefault();
        var dx = e.touches[0].clientX - e.touches[1].clientX;
        var dy = e.touches[0].clientY - e.touches[1].clientY;
        touchDist = Math.sqrt(dx * dx + dy * dy);
      } else if (e.touches.length === 1) {
        var target = e.target.closest('[data-component-id],[role="button"],[tabindex]');
        if (!target) {
          touchStart = { x: e.touches[0].clientX, y: e.touches[0].clientY, vbX: self._viewBox.x, vbY: self._viewBox.y };
        }
      }
    };
    svg.addEventListener('touchstart', this._listeners.zoomTouchstart, { passive: false });

    this._listeners.zoomTouchmove = function(e) {
      if (e.touches.length === 2) {
        e.preventDefault();
        var dx = e.touches[0].clientX - e.touches[1].clientX;
        var dy = e.touches[0].clientY - e.touches[1].clientY;
        var dist = Math.sqrt(dx * dx + dy * dy);
        if (touchDist > 0) {
          var factor = touchDist / dist;
          var nw = Math.max(50, Math.min(self._origViewBox.w * 5, self._viewBox.w * factor));
          var nh = nw * (self._origViewBox.h / self._origViewBox.w);
          var rect = svg.getBoundingClientRect();
          var mx = (e.touches[0].clientX + e.touches[1].clientX) / 2;
          var my = (e.touches[0].clientY + e.touches[1].clientY) / 2;
          var rx = (mx - rect.left) / rect.width;
          var ry = (my - rect.top) / rect.height;
          self._viewBox.x = (self._viewBox.x + self._viewBox.w * rx) - nw * rx;
          self._viewBox.y = (self._viewBox.y + self._viewBox.h * ry) - nh * ry;
          self._viewBox.w = nw;
          self._viewBox.h = nh;
          self.zoom = Math.round((self._origViewBox.w / nw) * 100);
          svg.setAttribute('viewBox', self._viewBox.x + ' ' + self._viewBox.y + ' ' + nw + ' ' + nh);
          self._updateZoomDisplay();
          touchDist = dist;
        }
      } else if (e.touches.length === 1 && touchStart) {
        e.preventDefault();
        var rect = svg.getBoundingClientRect();
        var dx = (e.touches[0].clientX - touchStart.x) / rect.width * self._viewBox.w;
        var dy = (e.touches[0].clientY - touchStart.y) / rect.height * self._viewBox.h;
        self._viewBox.x = touchStart.vbX - dx;
        self._viewBox.y = touchStart.vbY - dy;
        svg.setAttribute('viewBox', self._viewBox.x + ' ' + self._viewBox.y + ' ' + self._viewBox.w + ' ' + self._viewBox.h);
      }
    };
    svg.addEventListener('touchmove', this._listeners.zoomTouchmove, { passive: false });

    svg.addEventListener('touchend', function() {
      touchDist = 0;
      touchStart = null;
    });
  }

  _resetZoom() {
    if (!this._origViewBox) return;
    this._viewBox = { x: this._origViewBox.x, y: this._origViewBox.y, w: this._origViewBox.w, h: this._origViewBox.h };
    this.zoom = 100;
    var svg = this.el.visual.querySelector('svg');
    if (svg) svg.setAttribute('viewBox', this._origViewBox.x + ' ' + this._origViewBox.y + ' ' + this._origViewBox.w + ' ' + this._origViewBox.h);
    this._updateZoomDisplay();
  }

  _updateZoomDisplay() {
    if (this.el.zoomDisplay) this.el.zoomDisplay.textContent = this.zoom + '%';
  }

  _showTooltip(id, e) {
    var comp = this._findComp(id);
    if (!comp || !this._tooltipEl) return;
    var name = comp.name || id;
    var desc = comp.purpose || comp.description || comp.howItWorks || '';
    this._tooltipEl.innerHTML = '<div class="comp-tooltip-name">' + this._esc(name) + '</div>' + (desc ? '<div class="comp-tooltip-desc">' + this._esc(desc) + '</div>' : '');
    this._tooltipEl.style.display = 'block';
    this._tooltipVisible = true;
    this._positionTooltip(e);
  }

  _hideTooltip() {
    if (!this._tooltipEl) return;
    this._tooltipEl.style.display = 'none';
    this._tooltipVisible = false;
  }

  _positionTooltip(e) {
    if (!this._tooltipEl || !this._tooltipVisible) return;
    var x = e.clientX + 14;
    var y = e.clientY - 10;
    var tw = this._tooltipEl.offsetWidth || 200;
    var th = this._tooltipEl.offsetHeight || 60;
    if (x + tw > window.innerWidth - 10) x = e.clientX - tw - 14;
    if (y + th > window.innerHeight - 10) y = e.clientY - th - 10;
    if (y < 10) y = 10;
    this._tooltipEl.style.left = x + 'px';
    this._tooltipEl.style.top = y + 'px';
  }

  _build() {
    const title = _formatTitle(this.cfg.title || 'Interactive Diagram');
    const mod = this.cfg.module || '';
    const crumb = this.cfg.breadcrumb || {
      course: 'Consica Academy',
      module: mod ? 'Module ' + mod : 'Module',
      lesson: title
    };
    const w = this.el.wrapper = $('#lab-wrapper', document.body) || (() => {
      const d = document.createElement('div'); d.id = 'lab-wrapper'; d.className = 'lab-wrapper';
      document.body.prepend(d); return d;
    })();

    w.innerHTML = [
      '<a class="skip-link" href="#diagram-visual">Skip to diagram</a>',
      '<nav class="lab-breadcrumb" aria-label="Breadcrumb">',
        '<a href="#">',this._esc(crumb.course),'</a>',
        '<span class="crumb-sep">/</span>',
        '<a href="#">',this._esc(crumb.module),'</a>',
        '<span class="crumb-sep">/</span>',
        '<span>',this._esc(crumb.lesson),'</span>',
      '</nav>',
      '<header class="lab-header">',
        '<div class="lab-header-main">',
          '<div class="lab-header-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" width="24" height="24"><circle cx="12" cy="12" r="10"/><path d="M12 8v8M8 12h8"/></svg></div>',
          '<div>',
            '<h1 class="lab-title">',this._esc(title),'</h1>',
            '<p class="lab-purpose">',(this.cfg.desc ? this._esc(this.cfg.desc) : ''),'</p>',
          '</div>',
        '</div>',
        '<div class="lab-header-meta">',
          '<span class="lab-badge badge-completed" id="completion-status-btn" role="checkbox" aria-checked="false" tabindex="0" aria-label="Mark diagram as complete">',
            '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" width="12" height="12" style="margin-right:4px"><path d="M20 6L9 17l-5-5"/></svg>',
            '<span id="completion-text">In Progress</span>',
          '</span>',
          '<span class="lab-badge badge-diff">',this._esc(this.cfg.difficulty || 'Intermediate'),'</span>',
          '<span class="lab-badge badge-time">',this._esc(this.cfg.time || '~10'),' min</span>',
        '</div>',
      '</header>',
      '<div class="lab-actions" role="toolbar" aria-label="Simulation controls">',
        '<div class="action-group" id="playback-controls">',
          '<button class="act-btn" id="ctrl-play" aria-label="Play"><svg viewBox="0 0 24 24" fill="currentColor" width="14" height="14"><path d="M8 5v14l11-7z"/></svg><span class="act-label">Play</span></button>',
          '<button class="act-btn" id="ctrl-replay" aria-label="Replay"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" width="14" height="14"><path d="M1 4v6h6M23 20v-6h-6"/><path d="M20.49 9A9 9 0 005.64 5.64L1 10m22 4l-4.64 4.36A9 9 0 013.51 15"/></svg><span class="act-label">Replay</span></button>',
        '</div>',
        '<div class="action-divider" id="divider-play"></div>',
        '<div class="action-group">',
          '<div class="mode-selector-group" role="radiogroup" aria-label="Exploration Mode">',
            '<button class="mode-btn active" id="mode-learn" role="radio" aria-checked="true">Learn Mode</button>',
            '<button class="mode-btn" id="mode-challenge" role="radio" aria-checked="false">Challenge Mode</button>',
          '</div>',
        '</div>',
        '<div class="action-divider"></div>',
        '<div class="action-group speed-ctrl" role="group" aria-label="Animation speed">',
          '<span class="speed-label">Speed</span>',
          '<button class="speed-down" aria-label="Decrease speed">\u2212</button>',
          '<span class="speed-display" aria-live="polite">1\u00d7</span>',
          '<button class="speed-up" aria-label="Increase speed">+</button>',
        '</div>',
        '<div class="action-group">',
          '<button class="theme-toggle-btn-diagram" id="diagram-theme-toggle" aria-label="Switch to light mode"></button>',
        '</div>',
        '<div class="action-group zoom-controls">',
          '<button class="act-btn zoom-btn" id="zoom-reset" aria-label="Reset zoom">\u27f2</button>',
          '<span class="zoom-display" id="zoom-display" aria-live="polite">100%</span>',
        '</div>',
        '<div class="action-spacer"></div>',
        '<div class="action-group">',
          '<button class="act-btn" id="ctrl-fullscreen" aria-label="Enter fullscreen"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="14" height="14"><path d="M8 3H5a2 2 0 00-2 2v3m18 0V5a2 2 0 00-2-2h-3m0 18h3a2 2 0 002-2v-3M3 16v3a2 2 0 002 2h3"/></svg><span class="act-label">Lab</span></button>',
        '</div>',
      '</div>',
      '<div class="lab-workspace">',
        '<div class="lab-diagram" id="diagram-visual" role="img" aria-label="',this._esc(title),'">',
          '<div class="live-metrics" id="live-metrics" aria-label="Live simulation metrics">',
            '<div class="metric-item"><span class="metric-label">Packets</span><span class="metric-value" id="metric-packets">0</span></div>',
            '<div class="metric-item"><span class="metric-label">Latency</span><span class="metric-value" id="metric-latency">0ms</span></div>',
            '<div class="metric-item"><span class="metric-label">Active</span><span class="metric-value" id="metric-active">0</span></div>',
            '<div class="metric-item"><span class="metric-label">Rate</span><span class="metric-value" id="metric-rate">0/s</span></div>',
          '</div>',
          '<div class="lab-steps" id="step-controls" role="group" aria-label="Step navigation" hidden>',
            '<button class="step-btn" id="step-prev" aria-label="Previous step"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" width="14" height="14"><path d="M19 12H5M12 19l-7-7 7-7"/></svg> Prev</button>',
            '<span class="step-indicator" id="step-indicator" aria-live="polite"></span>',
            '<button class="step-btn" id="step-next" aria-label="Next step">Next <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" width="14" height="14"><path d="M5 12h14M12 5l7 7-7 7"/></svg></button>',
          '</div>',
        '</div>',
        '<aside class="lab-explorer" id="explorer-panel" role="complementary" aria-label="Component explorer">',
          '<div class="explorer-empty" id="explorer-empty">',
            '<div class="explorer-empty-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" width="32" height="32"><circle cx="12" cy="12" r="10"/><path d="M12 8v8M8 12h8"/></svg></div>',
            '<p class="explorer-empty-title">Select a component to inspect</p>',
            '<p class="explorer-empty-hint">Tap any device or connection in the diagram</p>',
          '</div>',
          '<div class="explorer-content" id="explorer-content" hidden>',
            '<div class="explorer-header" id="explorer-name"></div>',
            '<div class="explorer-scroll" id="explorer-scroll"></div>',
          '</div>',
        '</aside>',
      '</div>',
      '<div class="lab-insights" id="lab-insights">',
        '<div class="insight-card" id="insight-takeaway">',
          '<div class="insight-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="14" height="14"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg></div>',
          '<div><div class="insight-label">Key Takeaway</div><div class="insight-value" id="insight-takeaway-text">Click any component to see its key takeaway</div></div>',
        '</div>',
        '<div class="insight-card" id="insight-analogy">',
          '<div class="insight-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="14" height="14"><path d="M4 4h16v16H4V4zm2 2v12h12V6H6zm2 2h8v2H8V8zm0 4h8v2H8v-2zm0 4h4v2H8v-2z"/></svg></div>',
          '<div><div class="insight-label">Analogy</div><div class="insight-value" id="insight-analogy-text">Select a component for a real-world comparison</div></div>',
        '</div>',
        '<div class="insight-card" id="insight-funfact">',
          '<div class="insight-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="14" height="14"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 13l-4-4h8l-4 4z"/></svg></div>',
          '<div><div class="insight-label">Fun Fact</div><div class="insight-value" id="insight-funfact-text">Discover interesting facts about components</div></div>',
        '</div>',
      '</div>',
      '<div class="comp-tooltip" id="comp-tooltip" role="tooltip" style="display:none"></div>'
    ].join('\n');

    document.title = title + ' — Interactive Diagram | Consica Labs';
    this.el.visual = $('#diagram-visual', w);
    this.el.playBtn = $('#ctrl-play', w);
    this.el.replayBtn = $('#ctrl-replay', w);
    // Debug: ensure play button exists
    if (!this.el.playBtn) console.warn('[Consica] #ctrl-play not found');
    this.el.speedDown = $('.speed-down', w);
    this.el.speedUp = $('.speed-up', w);
    this.el.speedDisplay = $('.speed-display', w);
    this.el.fullscreenBtn = $('#ctrl-fullscreen', w);
    this.el.skipLink = $('.skip-link', w);
    this.el.explorer = $('#explorer-panel', w);
    this.el.explorerEmpty = $('#explorer-empty', w);
    this.el.explorerContent = $('#explorer-content', w);
    this.el.explorerName = $('#explorer-name', w);
    this.el.explorerScroll = $('#explorer-scroll', w);
    // Tooltip
    this._tooltipEl = $('#comp-tooltip', w);
    // Zoom
    this.el.zoomDisplay = $('#zoom-display', w);
    this.el.zoomReset = $('#zoom-reset', w);
    // Insights
    this.el.insights = $('#lab-insights', w);
    this.el.insightTakeaway = $('#insight-takeaway-text', w);
    this.el.insightAnalogy = $('#insight-analogy-text', w);
    this.el.insightFunfact = $('#insight-funfact-text', w);
    // Live Metrics
    this.el.metricsBar = $('#live-metrics', w);
    this.el.metricPackets = $('#metric-packets', w);
    this.el.metricLatency = $('#metric-latency', w);
    this.el.metricActive = $('#metric-active', w);
    this.el.metricRate = $('#metric-rate', w);
    // Steps
    this.el.stepPrev = $('#step-prev', w);
    this.el.stepNext = $('#step-next', w);
    this.el.stepIndicator = $('#step-indicator', w);
    this.el.stepControls = $('#step-controls', w);

    // Modes
    this.el.modeLearnBtn = $('#mode-learn', w);
    this.el.modeChallengeBtn = $('#mode-challenge', w);

    // Completion Status Button
    this.el.completionBtn = $('#completion-status-btn', w);
    this.el.completionText = $('#completion-text', w);
  }

  _bind() {
    var self = this;
    // Event delegation on wrapper for all action controls
    this.el.wrapper.addEventListener('click', function(e) {
      var btn = e.target.closest('[id]');
      if (!btn) return;
      switch (btn.id) {
        case 'ctrl-play': self.togglePlay(); break;
        case 'ctrl-replay': self.replay(); break;
        case 'ctrl-fullscreen': self.toggleFullscreen(); break;
        case 'zoom-reset': self._resetZoom(); break;
        case 'step-prev': self.prevStep(); break;
        case 'step-next': self.nextStep(); break;
        case 'mode-learn': self.setMode('learn'); break;
        case 'mode-challenge': self.setMode('challenge'); break;
        case 'completion-status-btn': self.toggleCompletion(); break;
        case 'diagram-theme-toggle': self._toggleTheme(); break;
      }
    });
    // Speed controls (no ID — use class)
    this.el.speedDown.addEventListener('click', () => this._adjustSpeed(-0.5));
    this.el.speedUp.addEventListener('click', () => this._adjustSpeed(0.5));

    // Completion Status Toggle (keyboard handler only — click via delegation)
    this.el.completionBtn.addEventListener('keydown', e => {
      if (e.key === ' ' || e.key === 'Enter') { e.preventDefault(); this.toggleCompletion(); }
    });

    this._listeners.keyNav = function(e) {
      if (e.target.closest('input,textarea,select')) return;
      if (e.key === 'ArrowRight' && e.altKey) { e.preventDefault(); self.nextStep(); }
      if (e.key === 'ArrowLeft' && e.altKey) { e.preventDefault(); self.prevStep(); }
      if (e.key === 'Escape') self._clearSelection();
      if (e.key === 'ArrowRight' && !e.altKey) { e.preventDefault(); self._focusNextComp(1); }
      if (e.key === 'ArrowLeft' && !e.altKey) { e.preventDefault(); self._focusNextComp(-1); }
      if (e.key === 'ArrowDown') { e.preventDefault(); self._focusNextComp(1); }
      if (e.key === 'ArrowUp') { e.preventDefault(); self._focusNextComp(-1); }
    };
    document.addEventListener('keydown', this._listeners.keyNav);

    this.el.visual.addEventListener('click', e => {
      const el = e.target.closest('[data-component-id]');
      if (el) this.selectComponent(el.dataset.componentId);
    });
    this.el.visual.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') {
        const el = e.target.closest('[data-component-id]');
        if (el) { e.preventDefault(); this.selectComponent(el.dataset.componentId); }
      }
    });

    // Tooltip event delegation
    this.el.visual.addEventListener('mouseover', e => {
      var el = e.target.closest('[data-component-id]');
      if (el) this._showTooltip(el.dataset.componentId, e);
    });
    this.el.visual.addEventListener('mousemove', e => {
      if (this._tooltipVisible) this._positionTooltip(e);
    });
    this.el.visual.addEventListener('mouseout', e => {
      var el = e.target.closest('[data-component-id]');
      if (!el) this._hideTooltip();
    });
  }

  _initCompletion() {
    const state = localStorage.getItem(this.storageKey);
    if (state === 'completed') {
      this.el.completionBtn.classList.add('active');
      this.el.completionBtn.setAttribute('aria-checked', 'true');
      this.el.completionText.textContent = 'Completed';
    } else {
      this.el.completionBtn.classList.remove('active');
      this.el.completionBtn.setAttribute('aria-checked', 'false');
      this.el.completionText.textContent = 'In Progress';
    }
  }

  toggleCompletion() {
    const isCompleted = this.el.completionBtn.classList.contains('active');
    if (isCompleted) {
      localStorage.setItem(this.storageKey, 'in-progress');
    } else {
      localStorage.setItem(this.storageKey, 'completed');
    }
    this._initCompletion();
  }

  markCompleted() {
    localStorage.setItem(this.storageKey, 'completed');
    this._initCompletion();
  }

  setMode(mode) {
    this.mode = mode;
    this.el.modeLearnBtn.classList.toggle('active', mode === 'learn');
    this.el.modeChallengeBtn.classList.toggle('active', mode === 'challenge');
    this.el.modeLearnBtn.setAttribute('aria-checked', mode === 'learn' ? 'true' : 'false');
    this.el.modeChallengeBtn.setAttribute('aria-checked', mode === 'challenge' ? 'true' : 'false');

    this.pause();
    this._clearSelection();

    // Reset visual container and playback panel based on mode
    if (mode === 'learn') {
      $('#playback-controls').style.display = 'flex';
      $('#divider-play').style.display = 'block';
      this.el.stepControls.hidden = false;
      this.t = 0;
      this.currentStep = 0;
      if (this.cfg.render) this.cfg.render(this.el.visual, this);
      this._initZoomPan();
      this._applyStep();
    } else if (mode === 'challenge') {
      $('#playback-controls').style.display = 'none';
      $('#divider-play').style.display = 'none';
      this.el.stepControls.hidden = true;
      if (this.cfg.customChallenge) {
        this.cfg.customChallenge(this.el.visual, this);
      } else {
        this.buildFallbackChallenge();
      }
      var firstFocusable = this.el.visual.querySelector('button, [tabindex="0"], .act-btn, .quiz-card');
      if (firstFocusable) setTimeout(function() { firstFocusable.focus(); }, 100);
    }
  }

  buildFallbackChallenge() {
    const comps = this.cfg.components || [];
    if (!comps.length) {
      this.el.visual.innerHTML = '<div style="padding:40px;text-align:center;color:#64748b">No components available for Challenge.</div>';
      return;
    }
    // Dynamic matching puzzle fallback
    const items = comps.map(c => ({ id: c.id, label: c.name, slot: c.id }));
    const slots = comps.map(c => ({ id: c.id, label: c.purpose }));
    // Shuffle items
    const shuffledItems = [...items].sort(() => Math.random() - 0.5);

    this.buildDragMatching(this.el.visual, {
      items: shuffledItems,
      slots: slots
    });
  }

  buildAutoChallenge(container) {
    var comps = this.cfg.components || [];
    var steps = this.cfg.steps || [];
    if (!comps.length) { this.buildFallbackChallenge(); return; }
    var hasQuizData = comps.some(function(c) { return c.purpose || c.takeaway || c.analogy; });
    var hasSteps = steps.length >= 2;
    var variants = [];
    if (hasQuizData) variants.push('quiz');
    if (hasSteps) variants.push('sequence');
    if (variants.length === 0) { this.buildFallbackChallenge(); return; }
    var pick = variants[Math.floor(Math.random() * variants.length)];
    if (pick === 'sequence') {
      this._buildSequenceChallenge(container);
    } else {
      var questions = this._generateQuizQuestions();
      if (questions.length >= 2) {
        this._buildQuizChallenge(container, questions);
      } else {
        this.buildFallbackChallenge();
      }
    }
  }

  _generateQuizQuestions() {
    var comps = this.cfg.components || [];
    var questions = [];
    var types = ['purpose','description','takeaway','analogy','howItWorks','why','funFact'];
    comps.forEach(function(comp) {
      var avail = [];
      types.forEach(function(t) { if (comp[t]) avail.push(t); });
      if (avail.length === 0) return;
      var usedType = avail[Math.floor(Math.random() * avail.length)];
      var questionText = usedType === 'purpose' ? 'What is the purpose of ' + comp.name + '?' :
                         usedType === 'takeaway' ? 'What is the key takeaway about ' + comp.name + '?' :
                         usedType === 'analogy' ? 'Which component is described by this analogy?' :
                         usedType === 'why' ? 'Why does ' + comp.name + ' matter?' :
                         usedType === 'funFact' ? 'Which component has this fun fact?' :
                         'Which component is described by:';
      var answer = comp.name;
      var distractors = comps.filter(function(c) { return c.id !== comp.id; }).map(function(c) { return c.name; });
      if (distractors.length < 2) return;
      var opts = [answer];
      var shuffled = distractors.sort(function() { return Math.random() - 0.5; }).slice(0, Math.min(3, distractors.length));
      opts = opts.concat(shuffled).sort(function() { return Math.random() - 0.5; });
      var desc = usedType === 'analogy' ? comp[usedType] : ('"' + comp[usedType] + '"');
      questions.push({
        question: usedType === 'purpose' || usedType === 'takeaway' || usedType === 'why'
          ? questionText + '\n' + comp[usedType]
          : questionText + '\n' + desc,
        answer: answer,
        options: opts,
        hint: usedType === 'analogy' ? ('Think about the real-world comparison used for ' + answer) : ''
      });
    });
    var shuffled = questions.sort(function() { return Math.random() - 0.5; }).slice(0, 4);
    return shuffled;
  }

  _buildQuizChallenge(container, questions) {
    var self = this;
    var title = this.cfg.title || 'Knowledge Check';

    var html = '<div class="sim-interactive-area" style="padding:16px;display:flex;flex-direction:column;gap:14px;width:100%">';
    html += '<div style="font-size:14px;font-weight:700;color:var(--brand-light);">' + this._esc(title) + ' — Quiz</div>';
    html += '<p style="font-size:11px;color:var(--text-muted);">Answer each question by selecting the correct component.</p>';
    html += '<div class="quiz-questions">';

    questions.forEach(function(q, qi) {
      html += '<div class="quiz-card glass-panel" data-q="' + qi + '" style="padding:12px;border-radius:8px;margin-bottom:10px">';
      html += '<div style="font-size:11px;font-weight:600;color:var(--text);margin-bottom:8px">Q' + (qi + 1) + ': ' + self._esc(q.question.replace(/\n/g, '<br>')) + '</div>';
      html += '<div style="display:flex;flex-wrap:wrap;gap:6px">';
      q.options.forEach(function(opt, oi) {
        html += '<button class="act-btn quiz-opt" data-q="' + qi + '" data-opt="' + oi + '" data-answer="' + self._esc(opt) + '" style="font-size:11px;padding:6px 12px">' + self._esc(opt) + '</button>';
      });
      html += '</div>';
      html += '<div class="quiz-feedback" style="font-size:11px;margin-top:6px;min-height:18px"></div>';
      html += '</div>';
    });

    html += '</div></div>';
    container.innerHTML = html;

    var correctCount = 0, total = questions.length;
    container.querySelectorAll('.quiz-opt').forEach(function(btn) {
      btn.addEventListener('click', function() {
        if (btn.disabled) return;
        var qi = parseInt(btn.dataset.q);
        var card = container.querySelector('.quiz-card[data-q="' + qi + '"]');
        var fb = card.querySelector('.quiz-feedback');
        card.querySelectorAll('.quiz-opt').forEach(function(b) { b.disabled = true; });
        if (btn.dataset.answer === questions[qi].answer) {
          btn.style.borderColor = '#10b981'; btn.style.color = '#10b981';
          btn.style.background = 'rgba(16,185,129,0.1)';
          fb.innerHTML = '<span style="color:#10b981">✓ Correct!</span>';
          fb.style.color = '#10b981';
          correctCount++;
        } else {
          btn.style.borderColor = '#ef4444'; btn.style.color = '#ef4444';
          btn.style.background = 'rgba(239,68,68,0.1)';
          var correctBtn = card.querySelector('.quiz-opt[data-answer="' + self._esc(questions[qi].answer) + '"]');
          if (correctBtn) { correctBtn.style.borderColor = '#10b981'; correctBtn.style.color = '#10b981'; correctBtn.style.background = 'rgba(16,185,129,0.1)'; }
          fb.innerHTML = '<span style="color:#ef4444">✗ The answer was: ' + self._esc(questions[qi].answer) + '</span>';
          fb.style.color = '#ef4444';
        }
        if (container.querySelectorAll('.quiz-opt:not(:disabled)').length === 0) {
          setTimeout(function() {
            if (correctCount === total) {
              self._showCompletionCelebration(container);
              self.markCompleted();
            } else {
              var msg = 'You got ' + correctCount + '/' + total + ' correct. Try again?';
              var retry = document.createElement('button');
              retry.className = 'act-btn';
              retry.style.cssText = 'margin:8px auto;display:block';
              retry.textContent = '🔄 Retry Quiz';
              retry.addEventListener('click', function() { self.buildAutoChallenge(container); self.pause(); });
              container.querySelector('.quiz-questions').appendChild(retry);
            }
          }, 600);
        }
      });
    });
  }

  _buildSequenceChallenge(container) {
    var self = this;
    var steps = this.cfg.steps || [];
    if (steps.length < 2) { this.buildFallbackChallenge(); return; }

    var items = steps.map(function(s, i) {
      return { id: s.id || 'step' + i, label: s.label || 'Step ' + (i + 1), idx: i };
    });
    var shuffled = items.sort(function() { return Math.random() - 0.5; });

    var title = this.cfg.title || 'Sequence';
    var html = '<div class="sim-interactive-area" style="padding:16px;display:flex;flex-direction:column;gap:12px;width:100%">';
    html += '<div style="font-size:14px;font-weight:700;color:var(--brand-light);">' + this._esc(title) + ' — Sequence</div>';
    html += '<p style="font-size:11px;color:var(--text-muted);">Drag the items into the correct order.</p>';
    html += '<div class="seq-slots" style="display:flex;flex-direction:column;gap:6px"></div>';
    html += '<div class="seq-pool" style="display:flex;flex-direction:column;gap:6px;padding:8px;background:var(--surface-pool);border-radius:6px;border:1px solid var(--border-pool);min-height:60px"></div>';
    html += '<div class="seq-feedback" style="font-size:11px;min-height:20px;color:var(--text-muted)" aria-live="polite"></div>';
    html += '</div>';
    container.innerHTML = html;

    var pool = container.querySelector('.seq-pool');
    var slots = container.querySelector('.seq-slots');
    var fb = container.querySelector('.seq-feedback');
    var placed = [];

    // Create slots
    items.forEach(function(item, i) {
      var slot = document.createElement('div');
      slot.className = 'seq-slot';
      slot.dataset.slotIdx = i;
      slot.style.cssText = 'padding:8px 12px;border:1px dashed var(--border-faint);border-radius:6px;min-height:36px;font-size:11px;color:var(--text-faint);display:flex;align-items:center;transition:var(--transition)';
      slot.textContent = 'Step ' + (i + 1);
      slots.appendChild(slot);
    });

    // Shuffle and add items to pool
    var shuffledItems = shuffled;
    shuffledItems.forEach(function(item, i) {
      var card = document.createElement('div');
      card.className = 'seq-card';
      card.draggable = true;
      card.dataset.itemIdx = item.idx;
      card.style.cssText = 'padding:8px 12px;background:var(--surface3);border:1px solid var(--border);border-radius:6px;font-size:11px;cursor:grab;user-select:none;transition:var(--transition)';
      card.textContent = item.label;
      card.addEventListener('dragstart', function(e) {
        e.dataTransfer.setData('text/plain', item.idx);
        card.style.opacity = '0.4';
      });
      card.addEventListener('dragend', function() { card.style.opacity = '1'; });
      pool.appendChild(card);
    });

    // Slot drop zones
    slots.querySelectorAll('.seq-slot').forEach(function(slot, si) {
      slot.addEventListener('dragover', function(e) { e.preventDefault(); slot.style.borderColor = 'var(--brand-light)'; });
      slot.addEventListener('dragleave', function() { slot.style.borderColor = 'var(--border-faint)'; });
      slot.addEventListener('drop', function(e) {
        e.preventDefault();
        slot.style.borderColor = 'var(--border-faint)';
        var idx = parseInt(e.dataTransfer.getData('text/plain'));
        var card = pool.querySelector('.seq-card[data-item-idx="' + idx + '"]');
        if (!card) return;
        // Check if already placed elsewhere
        var existing = slot.querySelector('.seq-card');
        if (existing) return;
        // Check if this card is already in another slot
        var anywhere = slots.querySelector('.seq-card[data-item-idx="' + idx + '"]');
        if (anywhere) return;

        slot.innerHTML = '';
        slot.textContent = '';
        var clone = card.cloneNode(true);
        clone.draggable = false;
        clone.style.cursor = 'default';
        clone.style.background = 'var(--surface2)';
        clone.style.border = '1px solid var(--brand-light)';
        clone.style.margin = '0';
        clone.style.width = '100%';
        slot.appendChild(clone);
        card.remove();

        placed[si] = idx;
        var allPlaced = placed.filter(function(p) { return p !== undefined; }).length === items.length;
        if (allPlaced) {
          var correct = placed.every(function(p, pi) { return p === pi; });
          if (correct) {
            fb.innerHTML = '<span style="color:#10b981">✓ Correct sequence! All steps in the right order.</span>';
            fb.style.color = '#10b981';
            self._showCompletionCelebration(container);
            self.markCompleted();
          } else {
            fb.innerHTML = '<span style="color:#ef4444">✗ Wrong order. Try again.</span>';
            fb.style.color = '#ef4444';
          }
        }
      });
    });

    // Touch support
    var touchCard = null, touchGhost = null;
    container.addEventListener('touchstart', function(e) {
      var card = e.target.closest('.seq-card');
      if (!card || !card.draggable) return;
      touchCard = card;
      var rect = card.getBoundingClientRect();
      touchGhost = card.cloneNode(true);
      touchGhost.style.cssText = 'position:fixed;z-index:99999;pointer-events:none;opacity:0.8;background:var(--surface3);border:1px solid var(--brand-light);border-radius:6px;padding:8px 12px;font-size:11px;width:' + rect.width + 'px';
      touchGhost.style.left = (e.touches[0].clientX - 20) + 'px';
      touchGhost.style.top = (e.touches[0].clientY - 20) + 'px';
      document.body.appendChild(touchGhost);
      card.style.opacity = '0.4';
    }, { passive: true });

    container.addEventListener('touchmove', function(e) {
      if (!touchGhost) return;
      e.preventDefault();
      touchGhost.style.left = (e.touches[0].clientX - 20) + 'px';
      touchGhost.style.top = (e.touches[0].clientY - 20) + 'px';
    }, { passive: false });

    container.addEventListener('touchend', function(e) {
      if (!touchCard || !touchGhost) return;
      touchGhost.remove(); touchGhost = null;
      touchCard.style.opacity = '1';
      var drop = document.elementFromPoint(e.changedTouches[0].clientX, e.changedTouches[0].clientY);
      if (drop) {
        var slot = drop.closest('.seq-slot');
        if (slot) {
          var simulatedEvent = new DragEvent('drop', { dataTransfer: new DataTransfer() });
          simulatedEvent.dataTransfer.setData('text/plain', touchCard.dataset.itemIdx);
          slot.dispatchEvent(simulatedEvent);
        }
      }
      touchCard = null;
    });
  }

  _showCompletionCelebration(container) {
    var el = document.createElement('div');
    el.setAttribute('role', 'alertdialog');
    el.setAttribute('aria-modal', 'true');
    el.setAttribute('aria-label', 'Challenge complete');
    el.style.cssText = 'position:absolute;inset:0;display:flex;align-items:center;justify-content:center;background:rgba(0,0,0,0.5);z-index:100;border-radius:var(--radius);animation:packetFadeIn .3s ease';
    var self = this;
    el.innerHTML = '<div style="text-align:center;padding:24px;background:var(--surface2);border:1px solid var(--brand-light);border-radius:12px;box-shadow:0 0 40px var(--brand-glow)">' +
      '<div style="font-size:40px;margin-bottom:8px" aria-hidden="true">🎉</div>' +
      '<div style="font-size:18px;font-weight:700;color:var(--text);margin-bottom:4px">Challenge Complete!</div>' +
      '<div style="font-size:13px;color:var(--text-muted);margin-bottom:12px">Great work mastering ' + this._esc(this.cfg.title || 'this topic') + '.</div>' +
      '<button class="act-btn" id="celebration-close-btn" style="font-size:13px;padding:8px 20px">Continue</button>' +
    '</div>';
    container.appendChild(el);
    var closeBtn = document.getElementById('celebration-close-btn');
    if (closeBtn) {
      closeBtn.focus();
      closeBtn.addEventListener('click', function() { el.remove(); });
      closeBtn.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') el.remove();
      });
    }
  }

  togglePlay() {
    if (this.playing) this.pause(); else this.play();
  }
  play() {
    if (this.playing) return;
    this.playing = true;
    this.lastFrame = performance.now();
    this._tick();
    this._updatePlayBtn();
    this._setStatus('Playing');
    if (this.el.metricsBar) this.el.metricsBar.style.display = 'flex';
  }
  pause() {
    if (!this.playing) return;
    this.playing = false;
    if (this.rafId) { cancelAnimationFrame(this.rafId); this.rafId = null; }
    this._updatePlayBtn();
    this._setStatus('Paused');
    if (this.el.metricsBar) this.el.metricsBar.style.display = 'none';
    var comps = this.el.visual.querySelectorAll('.component-breathing');
    comps.forEach(function(c) { c.classList.remove('component-breathing'); });
  }
  replay() {
    this.t = 0;
    this.currentStep = -1;
    if (!this.playing) this.play(); else this._setStatus('Replaying');
    if (this.cfg.onReplay) this.cfg.onReplay(this);
  }
  _tick() {
    if (!this.playing) return;
    const now = performance.now();
    this.dt = (now - this.lastFrame) / 1000 * this.speed;
    this.lastFrame = now;
    if (this.speed > 0) {
      this.t += this.dt;
      if (this.cfg.animate) this.cfg.animate(this);
      this._updateFlowDots();
      this._updateLiveMetrics();
      this._pulseActiveComponent();
    }
    this.rafId = requestAnimationFrame(() => this._tick());
  }
  _updatePlayBtn() {
    const b = this.el.playBtn;
    if (this.playing) {
      b.innerHTML = '<svg viewBox="0 0 24 24" fill="currentColor" width="14" height="14"><rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/></svg><span class="act-label">Pause</span>';
      b.setAttribute('aria-label', 'Pause');
    } else {
      b.innerHTML = '<svg viewBox="0 0 24 24" fill="currentColor" width="14" height="14"><path d="M8 5v14l11-7z"/></svg><span class="act-label">Play</span>';
      b.setAttribute('aria-label', 'Play');
    }
  }

  _adjustSpeed(delta) {
    const speeds = [0.5, 1, 1.5, 2, 3];
    let i = speeds.indexOf(this.speed);
    if (i < 0) i = 1;
    i = Math.max(0, Math.min(speeds.length - 1, i + (delta > 0 ? 1 : -1)));
    this.speed = speeds[i];
    this._updateSpeedDisplay();
  }
  _updateSpeedDisplay() {
    this.el.speedDisplay.textContent = this.speed + '×';
  }

  selectComponent(id) {
    if (!id) return;
    this._clearHighlights();
    this.selectedId = id;
    var comps = this.el.visual.querySelectorAll('.component-breathing');
    comps.forEach(function(c) { c.classList.remove('component-breathing'); });
    $$('[data-component-id]', this.el.visual).forEach(el => {
      if (el.dataset.componentId === id) el.classList.add('selected');
    });
    if (this.cfg.connections) {
      $$('.connection', this.el.visual).forEach(el => {
        const f = el.dataset.from, t = el.dataset.to;
        if (f === id || t === id) el.classList.add('highlighted');
      });
    }
    this._showExplanation(id);
    // Broadcast selection to parent page and as a CustomEvent for in-page listeners
    try {
      const comp = this._findComp(id) || {};
      const payload = {
        type: 'diagram-select',
        id: id,
        name: comp.name || '',
        howItWorks: comp.howItWorks || comp.description || '',
        deeperDive: comp.deeperDive || comp.descriptionDetailed || '',
        advanced: comp.advancedConcept || comp.funFact || comp.takeaway || ''
      };
      if (window.parent && window.parent !== window) {
        window.parent.postMessage(payload, '*');
      }
      window.dispatchEvent(new CustomEvent('diagram-select', { detail: payload }));
    } catch (e) {
      console.warn('diagram select broadcast failed', e);
    }
  }
  _clearSelection() {
    this.selectedId = null;
    this._clearHighlights();
    this._showEmptyState();
  }
  _clearHighlights() {
    $$('.selected', this.el.visual).forEach(el => el.classList.remove('selected'));
    $$('.connection.highlighted', this.el.visual).forEach(el => el.classList.remove('highlighted'));
  }

  _focusNextComp(dir) {
    var comps = $$('[data-component-id]', this.el.visual);
    if (!comps.length) return;
    var cur = this.selectedId;
    var idx = cur ? comps.findIndex(function(c) { return c.dataset.componentId === cur; }) : -1;
    var next = (idx + dir + comps.length) % comps.length;
    comps[next].focus();
    this.selectComponent(comps[next].dataset.componentId);
  }

  _showExplanation(id) {
    const comp = this._findComp(id);
    if (!comp) return;
    this.el.explorerEmpty.hidden = true;
    this.el.explorerContent.hidden = false;
    this.el.explorerName.textContent = comp.name || id;

    const d = this.detailMode === 'detailed';
    const howItWorks = comp.howItWorks || comp.description;
    const deeperDive = comp.deeperDive || comp.descriptionDetailed;
    const advancedConcept = comp.advancedConcept || comp.funFact || comp.takeaway;
    const vocabDefinition = comp.vocabDefinition || comp.vocab;

    // Render detailed texts
    let body = html`
      ${comp.purpose ? `<section class="ex-section"><div class="ex-label">Purpose</div><div class="ex-value">${this._esc(comp.purpose)}</div></section>` : ''}
      ${howItWorks ? `<section class="ex-section"><div class="ex-label">How It Works</div><div class="ex-value">${this._esc(howItWorks)}</div></section>` : ''}
      ${deeperDive ? `<section class="ex-section"><div class="ex-label">Deeper Dive</div><div class="ex-value">${this._esc(deeperDive)}</div></section>` : ''}
      ${advancedConcept ? `<section class="ex-section"><div class="ex-label">Advanced Concept</div><div class="ex-value">${this._esc(advancedConcept)}</div></section>` : ''}
      ${vocabDefinition ? `<section class="ex-section"><div class="ex-label">Vocabulary Definition</div><div class="ex-value">${this._esc(vocabDefinition)}</div></section>` : ''}
      ${comp.why ? `<section class="ex-section"><div class="ex-label">Why It Matters</div><div class="ex-value">${this._esc(comp.why)}</div></section>` : ''}
      ${comp.analogy ? `<section class="ex-section"><div class="ex-label">Real-World Analogy</div><div class="ex-value">${this._esc(comp.analogy)}</div></section>` : ''}
    `;

    // Append Related Concepts
    const related = (this.cfg.components || [])
      .filter(c => c.id !== id && (c.category === comp.category || (this.cfg.connections || []).some(conn => (conn.from === id && conn.to === c.id) || (conn.from === c.id && conn.to === id))))
      .slice(0, 3);
    if (related.length) {
      body += `<section class="ex-section"><div class="ex-label">Related Concepts</div><div style="margin-top: 4px;">`;
      related.forEach(r => {
        body += `<span class="concept-tag" data-link-id="${r.id}">${this._esc(r.name)}</span>`;
      });
      body += `</div></section>`;
    }

    // Append Component Challenge Question
    const qText = comp.challengeQuestion || `Which is a common mistake related to ${comp.name}?`;
    const opts = comp.challengeOptions || [
      comp.mistake || "Assuming it has no limitations.",
      "Thinking it's identical to the hardware layer.",
      "Confusing its logical flow with physical layout."
    ];
    // Dynamic correct index
    const correctIdx = comp.challengeAnswer !== undefined ? comp.challengeAnswer : 0;
    body += `
      <section class="ex-section">
        <div class="challenge-box">
          <div class="challenge-title">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="12" height="12"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"/></svg>
            Challenge Question
          </div>
          <div class="challenge-question">${this._esc(qText)}</div>
          <div class="challenge-options">
    `;
    opts.forEach((opt, idx) => {
      body += `<button class="challenge-opt-btn" data-opt-idx="${idx}">${this._esc(opt)}</button>`;
    });
    body += `
          </div>
        </div>
      </section>
    `;

    this.el.explorerScroll.innerHTML = body;

    // Attach click events to dynamic tags
    $$('.concept-tag', this.el.explorerScroll).forEach(tag => {
      tag.addEventListener('click', e => {
        e.stopPropagation();
        this.selectComponent(tag.dataset.linkId);
      });
    });

    // Attach click events to challenge options
    const optBtns = $$('.challenge-opt-btn', this.el.explorerScroll);
    optBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const selectedIdx = parseInt(btn.dataset.optIdx);
        optBtns.forEach((b, idx) => {
          b.disabled = true;
          if (idx === correctIdx) b.classList.add('correct');
          else if (idx === selectedIdx) b.classList.add('incorrect');
        });
        if (selectedIdx === correctIdx) {
          this.markCompleted();
        }
      });
    });

    // Update bottom insights panel
    if (this.el.insightTakeaway) this.el.insightTakeaway.textContent = comp.takeaway || comp.purpose || '';
    if (this.el.insightAnalogy) this.el.insightAnalogy.textContent = comp.analogy || 'Select a component for a real-world comparison';
    if (this.el.insightFunfact) this.el.insightFunfact.textContent = comp.funFact || 'Discover interesting facts about components';

    // Append dynamic Quick Quiz block in the Insights bar
    this.appendQuickQuiz();
  }

  appendQuickQuiz() {
    // If quiz is already shown, do not replicate
    if ($('#quick-quiz-block', this.el.insights)) return;
    const comps = this.cfg.components || [];
    if (comps.length < 2) return;
    
    // Pick a random component and build quiz
    const randomIdx = Math.floor(Math.random() * comps.length);
    const comp = comps[randomIdx];
    const qText = `What is the real-world analogy for the "${comp.name}"?`;
    const opts = [
      comp.analogy || "A standardized utility distribution system.",
      comps[(randomIdx + 1) % comps.length].analogy || "A post-box system.",
      comps[(randomIdx + 2) % comps.length].analogy || "A network hub."
    ];
    // Option 0 is correct
    const shuffled = opts.map((opt, i) => ({ opt, correct: i === 0 })).sort(() => Math.random() - 0.5);
    const correctIndex = shuffled.findIndex(o => o.correct);

    const quizCard = document.createElement('div');
    quizCard.className = 'insight-card insight-quiz-card';
    quizCard.id = 'quick-quiz-block';
    quizCard.innerHTML = html`
      <div class="insight-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="14" height="14"><path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"/><path d="M9.09 9a3 3 0 015.83 1c0 2-3 3-3 3M12 17h.01"/></svg></div>
      <div style="flex: 1;">
        <div class="insight-label">Lesson Quick Quiz</div>
        <div class="insight-value">${qText}</div>
        <div class="quiz-options-grid">
          ${shuffled.map((item, idx) => `<button class="challenge-opt-btn quiz-opt" data-correct="${item.correct}">${item.opt}</button>`).join('')}
        </div>
      </div>
    `;
    this.el.insights.appendChild(quizCard);

    const quizBtns = $$('.quiz-opt', quizCard);
    quizBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const isCorrect = btn.dataset.correct === 'true';
        quizBtns.forEach(b => {
          b.disabled = true;
          if (b.dataset.correct === 'true') b.classList.add('correct');
          else if (b === btn) b.classList.add('incorrect');
        });
        if (isCorrect) {
          this.markCompleted();
        }
      });
    });
  }

  _showEmptyState() {
    this.el.explorerEmpty.hidden = false;
    this.el.explorerContent.hidden = true;
    if (this.el.insightTakeaway) this.el.insightTakeaway.textContent = 'Click any component to see its key takeaway';
    if (this.el.insightAnalogy) this.el.insightAnalogy.textContent = 'Select a component for a real-world comparison';
    if (this.el.insightFunfact) this.el.insightFunfact.textContent = 'Discover interesting facts about components';
    const quiz = $('#quick-quiz-block', this.el.insights);
    if (quiz) quiz.remove();
  }

  _findComp(id) {
    if (!this.cfg.components) return null;
    return this.cfg.components.find(c => c.id === id) || null;
  }

  toggleFullscreen() {
    const w = this.el.wrapper;
    w.classList.toggle('lab-fullscreen');
    const btn = this.el.fullscreenBtn;
    const isFs = w.classList.contains('lab-fullscreen');
    btn.innerHTML = isFs
      ? '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16"><path d="M8 3v3a2 2 0 01-2 2H3m18 0h-3a2 2 0 01-2-2V3m0 18v-3a2 2 0 012-2h3M3 16h3a2 2 0 012 2v3"/></svg><span class="act-label">Exit Lab</span>'
      : '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16"><path d="M8 3H5a2 2 0 00-2 2v3m18 0V5a2 2 0 00-2-2h-3m0 18h3a2 2 0 002-2v-3M3 16v3a2 2 0 002 2h3"/></svg><span class="act-label">Lab</span>';
    btn.setAttribute('aria-label', isFs ? 'Exit fullscreen' : 'Enter fullscreen');
  }

  nextStep() {
    if (!this.cfg.steps || !this.cfg.steps.length) return;
    this.pause();
    this.currentStep = Math.min(this.currentStep + 1, this.cfg.steps.length - 1);
    this._applyStep();
  }
  prevStep() {
    if (!this.cfg.steps || !this.cfg.steps.length) return;
    this.pause();
    this.currentStep = Math.max(this.currentStep - 1, 0);
    this._applyStep();
  }
  _applyStep() {
    const steps = this.cfg.steps;
    if (!steps || !steps.length) return;
    const s = steps[this.currentStep];
    if (!s) { this._setStatus('No more steps'); return; }
    if (s.onEnter) s.onEnter(this);
    this._setStatus(s.status || `Step ${this.currentStep + 1} of ${steps.length}`);
    this._updateStepControls();
    if (this._onStepChange) this._onStepChange(this.currentStep);
    
    // Auto-select component in step
    if (s.id) {
      this.selectComponent(s.id);
    }
  }
  _updateStepControls() {
    const steps = this.cfg.steps;
    if (!steps || !steps.length) { this.el.stepControls.hidden = true; return; }
    this.el.stepPrev.disabled = this.currentStep <= 0;
    this.el.stepNext.disabled = this.currentStep >= steps.length - 1;
    this.el.stepIndicator.textContent = this.currentStep >= 0
      ? `Step ${this.currentStep + 1} of ${steps.length}`
      : 'Click Next to begin';
    if (this.currentStep >= 0 && steps[this.currentStep] && steps[this.currentStep].label) {
      this.el.stepIndicator.textContent += ` — ${steps[this.currentStep].label}`;
    }
  }

  buildVisual(container) {
    const comps = this.cfg.components || [];
    const conns = this.cfg.connections || [];
    if (!comps.length) {
      container.innerHTML = '<div style="padding:40px;text-align:center;color:#94a3b8"><p>No components defined</p></div>';
      return;
    }

    const hasPos = comps.some(c => c.x !== undefined);
    const pal = this._pal();
    const compColors = pal.compBgs;
    let w, h, autoCols, autoRows, autoCw = 120, autoCh = 56, autoGx = 18, autoGy = 22, autoPx = 20, autoPy = 18;
    let compsPos = [];

    if (hasPos) {
      let maxX = 0, maxY = 0, minX = Infinity, minY = Infinity;
      comps.forEach(c => {
        const cw = c.width || c.w || 110, ch = c.height || c.h || 50;
        const cx = c.x || 0, cy = c.y || 0;
        maxX = Math.max(maxX, cx + cw);
        maxY = Math.max(maxY, cy + ch);
        minX = Math.min(minX, cx);
        minY = Math.min(minY, cy);
      });
      const cw = maxX - minX, ch = maxY - minY;
      const mx = Math.round(cw * 0.18) + 40, my = Math.round(ch * 0.18) + 30;
      w = Math.max(maxX + mx, 400); h = Math.max(maxY + my, 280);
      comps.forEach(c => {
        compsPos.push({ x: c.x || 0, y: c.y || 0, w: c.width || c.w || 110, h: c.height || c.h || 50 });
      });
    } else {
      const n = comps.length;
      autoCols = Math.min(n, 4);
      autoRows = Math.ceil(n / autoCols);
      const origW = autoCols * autoCw + (autoCols - 1) * autoGx + autoPx * 2;
      const origH = autoRows * autoCh + (autoRows - 1) * autoGy + autoPy * 2;
      w = Math.round(origW * 1.2); h = Math.round(origH * 1.2);
      const ox = Math.round((w - origW) / 2), oy = Math.round((h - origH) / 2);
      comps.forEach((c, j) => {
        compsPos.push({
          x: autoPx + (j % autoCols) * (autoCw + autoGx) + ox,
          y: autoPy + Math.floor(j / autoCols) * (autoCh + autoGy) + oy,
          w: autoCw, h: autoCh
        });
      });
    }

    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('viewBox', `0 0 ${w} ${h}`);
    svg.setAttribute('style', 'width:100%;height:auto;max-width:1100px;margin:0 auto');
    const defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
    
    // Core drop shadow filter
    const filter = document.createElementNS('http://www.w3.org/2000/svg', 'filter');
    filter.setAttribute('id', 'g');
    const shadow = document.createElementNS('http://www.w3.org/2000/svg', 'feDropShadow');
    shadow.setAttribute('dx', '0'); shadow.setAttribute('dy', '2');
    shadow.setAttribute('stdDeviation', '4');
    shadow.setAttribute('flood-color', '#0959C8'); shadow.setAttribute('flood-opacity', '.25');
    filter.appendChild(shadow); defs.appendChild(filter);

    // Glow filter
    const gfilter = document.createElementNS('http://www.w3.org/2000/svg', 'filter');
    gfilter.setAttribute('id', 'glow');
    const gshadow = document.createElementNS('http://www.w3.org/2000/svg', 'feGaussianBlur');
    gshadow.setAttribute('stdDeviation', '2'); gshadow.setAttribute('result', 'blur');
    const gmerge = document.createElementNS('http://www.w3.org/2000/svg', 'feMerge');
    const gn1 = document.createElementNS('http://www.w3.org/2000/svg', 'feMergeNode');
    gn1.setAttribute('in', 'blur');
    const gn2 = document.createElementNS('http://www.w3.org/2000/svg', 'feMergeNode');
    gn2.setAttribute('in', 'SourceGraphic');
    gmerge.appendChild(gn1); gmerge.appendChild(gn2);
    gfilter.appendChild(gshadow); gfilter.appendChild(gmerge); defs.appendChild(gfilter);

    // Breathing glow filter for active component
    var bfilter = document.createElementNS('http://www.w3.org/2000/svg', 'filter');
    bfilter.setAttribute('id', 'breath-glow');
    bfilter.setAttribute('x', '-50%'); bfilter.setAttribute('y', '-50%');
    bfilter.setAttribute('width', '200%'); bfilter.setAttribute('height', '200%');
    var bblur = document.createElementNS('http://www.w3.org/2000/svg', 'feGaussianBlur');
    bblur.setAttribute('stdDeviation', '3'); bblur.setAttribute('result', 'blur');
    var bmerge = document.createElementNS('http://www.w3.org/2000/svg', 'feMerge');
    var bn1 = document.createElementNS('http://www.w3.org/2000/svg', 'feMergeNode');
    bn1.setAttribute('in', 'blur');
    var bn2 = document.createElementNS('http://www.w3.org/2000/svg', 'feMergeNode');
    bn2.setAttribute('in', 'SourceGraphic');
    bmerge.appendChild(bn1); bmerge.appendChild(bn2);
    bfilter.appendChild(bblur); bfilter.appendChild(bmerge); defs.appendChild(bfilter);

    // Component gradient defs — 6 distinct gradient pairs for visual depth
    var gradDefs = [
      ['comp-grad-0','#1e3a5f','#16223a'],['comp-grad-1','#1a3a5a','#142038'],
      ['comp-grad-2','#1e3550','#152030'],['comp-grad-3','#1c3858','#132235'],
      ['comp-grad-4','#1d3455','#162438'],['comp-grad-5','#1b3852','#122030']
    ];
    var gradDefsLight = [
      ['comp-grad-0','#e8ecf1','#d4d8e0'],['comp-grad-1','#e2e6ec','#cdd2da'],
      ['comp-grad-2','#e4e8ee','#d0d5dd'],['comp-grad-3','#e6eaf0','#d2d7df'],
      ['comp-grad-4','#e3e7ed','#ced3db'],['comp-grad-5','#e5e9ef','#d1d6de']
    ];
    var activeGradDefs = this._theme === 'light' ? gradDefsLight : gradDefs;
    for (var gi = 0; gi < activeGradDefs.length; gi++) {
      var gd = activeGradDefs[gi];
      var grad = document.createElementNS('http://www.w3.org/2000/svg', 'linearGradient');
      grad.setAttribute('id', gd[0]); grad.setAttribute('x1','0'); grad.setAttribute('y1','0');
      grad.setAttribute('x2','0'); grad.setAttribute('y2','1');
      var s1 = document.createElementNS('http://www.w3.org/2000/svg', 'stop');
      s1.setAttribute('offset','0%'); s1.setAttribute('stop-color', gd[1]);
      var s2 = document.createElementNS('http://www.w3.org/2000/svg', 'stop');
      s2.setAttribute('offset','100%'); s2.setAttribute('stop-color', gd[2]);
      grad.appendChild(s1); grad.appendChild(s2); defs.appendChild(grad);
      // Edge highlight overlay gradient (top-to-bottom subtle light)
      var hgrad = document.createElementNS('http://www.w3.org/2000/svg', 'linearGradient');
      hgrad.setAttribute('id', gd[0] + '-hl'); hgrad.setAttribute('x1','0'); hgrad.setAttribute('y1','0');
      hgrad.setAttribute('x2','0'); hgrad.setAttribute('y2','1');
      var hs1 = document.createElementNS('http://www.w3.org/2000/svg', 'stop');
      hs1.setAttribute('offset','0%'); hs1.setAttribute('stop-color', this._theme === 'light' ? 'rgba(255,255,255,0.6)' : 'var(--border-pool)');
      var hs2 = document.createElementNS('http://www.w3.org/2000/svg', 'stop');
      hs2.setAttribute('offset','40%'); hs2.setAttribute('stop-color', 'rgba(255,255,255,0)');
      hgrad.appendChild(hs1); hgrad.appendChild(hs2); defs.appendChild(hgrad);
    }
    svg.appendChild(defs);

    const bg = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
    bg.setAttribute('width', w); bg.setAttribute('height', h);
    bg.setAttribute('fill', 'transparent');
    svg.appendChild(bg);

    // Render connections
    this._connPaths = [];
    const colors = pal.connColors;
    conns.forEach((c, i) => {
      const fi = comps.findIndex(x => x.id === c.from);
      const ti = comps.findIndex(x => x.id === c.to);
      if (fi < 0 || ti < 0) return;
      const fp = compsPos[fi], tp = compsPos[ti];
      const edges = (p) => ({
        r: { x: p.x + p.w, y: p.y + p.h / 2 },
        l: { x: p.x, y: p.y + p.h / 2 },
        t: { x: p.x + p.w / 2, y: p.y },
        b: { x: p.x + p.w / 2, y: p.y + p.h }
      });
      const fe = edges(fp), te = edges(tp);
      let bd = Infinity, bx, by, tx, ty;
      for (const fk of ['r', 'l', 't', 'b']) {
        const f = fe[fk];
        for (const tk of ['l', 'r', 'b', 't']) {
          const t = te[tk], dx = f.x - t.x, dy = f.y - t.y, dd = dx * dx + dy * dy;
          if (dd < bd) { bd = dd; bx = f.x; by = f.y; tx = t.x; ty = t.y; }
        }
      }
      const mx = (bx + tx) / 2, my = (by + ty) / 2;
      const p = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      p.setAttribute('class', 'connection conn-entrance');
      p.style.setProperty('--entrance-delay', (i * 60) + 'ms');
      p.setAttribute('data-from', c.from); p.setAttribute('data-to', c.to);
      p.setAttribute('d', `M${bx} ${by}C${mx} ${by},${mx} ${ty},${tx} ${ty}`);
      p.setAttribute('stroke', c.color || colors[i % 3]);
      svg.appendChild(p);

      const poly = document.createElementNS('http://www.w3.org/2000/svg', 'polygon');
      poly.setAttribute('class', 'connection-arrow');
      const ang = Math.atan2(ty - by, tx - bx);
      const al = 10, aw = 5;
      poly.setAttribute('points',
        `${tx - al * Math.cos(ang - 0.4)},${ty - al * Math.sin(ang - 0.4)} ` +
        `${tx},${ty} ` +
        `${tx - al * Math.cos(ang + 0.4)},${ty - al * Math.sin(ang + 0.4)}`
      );
      svg.appendChild(poly);

      if (c.label) {
        const t = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        t.setAttribute('x', mx); t.setAttribute('y', my - 8);
        t.setAttribute('text-anchor', 'middle'); t.setAttribute('fill', pal.connLabel);
        t.setAttribute('font-size', '11'); t.setAttribute('font-weight', '500');
        t.textContent = c.label;
        svg.appendChild(t);
      }
      this._connPaths.push({
        from: c.from, to: c.to,
        x1: bx, y1: by, x2: tx, y2: ty, mx, my,
        ax: tx - bx, bxc: 3 * (bx - mx), cxc: 3 * (mx - bx),
        ay: 2 * (by - ty), byc: 3 * (ty - by)
      });
    });

    // Render components
    comps.forEach((c, j) => {
      const pos = compsPos[j];
      const cx = pos.x, cy = pos.y, cw = pos.w, ch = pos.h;
      const bgc = compColors[j % compColors.length];
      const shape = c.shape || 'rounded-rect';
      const icon = c.icon || this._defaultIcon(c.id);

      const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
      g.setAttribute('data-component-id', c.id);
      g.setAttribute('class', 'component comp-entrance');
      g.style.setProperty('--entrance-delay', (j * 80) + 'ms');
      g.setAttribute('tabindex', '0');
      g.setAttribute('role', 'button');
      g.setAttribute('aria-label', `Select ${c.name || c.id}`);

      this._renderShapeBg(g, shape, cx, cy, cw, ch, bgc, j);

      if (icon && ICONS[icon]) {
        this._renderIcon(g, icon, cx, cy, cw, ch);
      } else {
        this._renderDefaultMarker(g, cx, cy, cw, ch, c.id);
      }

      const nameStr = c.name || c.id;
      const nameLen = nameStr.length;
      const availW = cw - 14;
      const approxW = nameLen * 6.5;
      const fs = approxW > availW ? Math.max(7, Math.floor(availW / nameLen * 1.2)) : 11;
      
      const name = document.createElementNS('http://www.w3.org/2000/svg', 'text');
      const textX = cx + cw / 2;
      name.setAttribute('x', textX);
      name.setAttribute('y', cy + ch - 10);
      name.setAttribute('text-anchor', 'middle');
      name.setAttribute('fill', pal.compText);
      name.setAttribute('font-size', String(fs));
      name.setAttribute('font-weight', '600');
      name.setAttribute('font-family', "'Inter',sans-serif");
      name.setAttribute('pointer-events', 'none');
      name.textContent = nameStr;
      g.appendChild(name);

      svg.appendChild(g);
    });

    // Render flow packets/dots
    this._flowDots = [];
    const pf = this.cfg.packetFlow;
    const self = this;

    this._connPaths.forEach((cp, i) => {
      if (i >= this.cfg.connections.length) return;
      const pkt = pf && pf[i];
      let dot;
      if (pkt) {
        dot = document.createElementNS('http://www.w3.org/2000/svg', 'g');
        dot.setAttribute('class', 'flow-dot packet dot-entrance');
        dot.style.setProperty('--entrance-delay', (comps.length * 80 + i * 100) + 'ms');
        dot.setAttribute('data-conn-idx', i);
        dot.setAttribute('data-label', pkt.label || '');
        dot.setAttribute('role', 'button');
        dot.setAttribute('tabindex', '0');
        dot.setAttribute('aria-label', 'Packet: ' + (pkt.label || ''));
        dot.style.cursor = 'pointer';
        dot.setAttribute('transform', 'translate(' + cp.x1 + ',' + cp.y1 + ')');

        const txt = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        txt.setAttribute('text-anchor', 'middle'); txt.setAttribute('fill', '#fff');
        txt.setAttribute('font-size', '8'); txt.setAttribute('font-weight', '700');
        txt.setAttribute('font-family', "'Inter',sans-serif");
        txt.setAttribute('y', '3'); txt.setAttribute('pointer-events', 'none');
        var label = pkt.label || '';
        txt.textContent = label;
        dot.appendChild(txt);

        // Size rect to text width
        var pw = Math.max(36, label.length * 5.2 + 14);
        const pbg = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
        pbg.setAttribute('x', -pw / 2); pbg.setAttribute('y', '-8');
        pbg.setAttribute('width', pw); pbg.setAttribute('height', '16');
        pbg.setAttribute('rx', '4'); pbg.setAttribute('ry', '4');
        pbg.setAttribute('fill', pkt.color || '#22c55e'); pbg.setAttribute('opacity', '0.9');
        pbg.setAttribute('filter', 'url(#glow)');
        dot.insertBefore(pbg, txt);

        dot.addEventListener('click', (e) => {
          e.stopPropagation();
          self._showPacketInfo(pkt.label, pkt.color, i);
        });
        dot.addEventListener('keydown', (e) => {
          if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); self._showPacketInfo(pkt.label, pkt.color, i); }
        });
      } else {
        // Multiple trailing dots per connection for particle-stream effect
        var trailCount = 3;
        for (var td = 0; td < trailCount; td++) {
          dot = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
          dot.setAttribute('r', String(4 - td * 0.8));
          dot.setAttribute('class', 'flow-dot dot-entrance');
          dot.style.setProperty('--entrance-delay', (comps.length * 80 + i * 100 + td * 40) + 'ms');
          dot.setAttribute('data-conn-idx', i);
          dot.setAttribute('data-trail-idx', td);
          dot.setAttribute('opacity', String(0.8 - td * 0.2));
          dot.setAttribute('fill', '#10b981');
          dot.setAttribute('filter', 'url(#glow)');
          dot.setAttribute('cx', cp.x1); dot.setAttribute('cy', cp.y1);
          svg.appendChild(dot);
          this._flowDots.push({ el: dot, idx: i, isPacket: false, trail: td });
        }
      }
      if (pkt) {
        svg.appendChild(dot);
        this._flowDots.push({ el: dot, idx: i, isPacket: true });
      }
    });

    container.innerHTML = '';
    container.appendChild(svg);
  }

  _renderShapeBg(g, shape, x, y, w, h, bgc, compIdx) {
    const el = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    const gradId = 'comp-grad-' + ((compIdx !== undefined ? compIdx : 0) % 6);
    var strokeColor = this._pal().compStroke;
    let bg;
    switch (shape) {
      case 'circle':
        const r = Math.min(w, h) / 2;
        bg = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        bg.setAttribute('cx', x + w / 2); bg.setAttribute('cy', y + h / 2);
        bg.setAttribute('r', r);
        break;
      case 'pill':
        bg = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
        bg.setAttribute('x', x); bg.setAttribute('y', y);
        bg.setAttribute('width', w); bg.setAttribute('height', h);
        bg.setAttribute('rx', h / 2); bg.setAttribute('ry', h / 2);
        break;
      case 'diamond':
        bg = document.createElementNS('http://www.w3.org/2000/svg', 'polygon');
        bg.setAttribute('points', `${x + w / 2},${y} ${x + w},${y + h / 2} ${x + w / 2},${y + h} ${x},${y + h / 2}`);
        break;
      case 'hexagon':
        bg = document.createElementNS('http://www.w3.org/2000/svg', 'polygon');
        const hh = h / 2, hs = w * 0.22;
        bg.setAttribute('points', `${x + hs},${y} ${x + w - hs},${y} ${x + w},${y + hh} ${x + w - hs},${y + h} ${x + hs},${y + h} ${x},${y + hh}`);
        break;
      case 'cylinder':
        bg = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        bg.setAttribute('d', `M${x},${y + 10} L${x},${y + h - 10} A${w / 2},10 0 0,0 ${x + w},${y + h - 10} L${x + w},${y + 10} A${w / 2},10 0 0,1 ${x},${y + 10} Z`);
        el.appendChild(bg);
        const top = document.createElementNS('http://www.w3.org/2000/svg', 'ellipse');
        top.setAttribute('cx', x + w / 2); top.setAttribute('cy', y + 10);
        top.setAttribute('rx', w / 2); top.setAttribute('ry', 10);
        top.setAttribute('fill', 'url(#' + gradId + ')'); top.setAttribute('stroke', strokeColor); top.setAttribute('stroke-width', '1.5');
        el.appendChild(top);
        break;
      case 'cloud-shape':
        bg = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        const cw2 = w * 0.3, ch2 = h * 0.4;
        bg.setAttribute('d', `M${x + cw2},${y + h} C${x},${y + h} ${x},${y + ch2} ${x + cw2},${y + ch2} C${x + cw2},${y} ${x + w - cw2},${y} ${x + w - cw2},${y + ch2} C${x+w},${y + ch2} ${x + w},${y + h} ${x + w - cw2},${y + h} Z`);
        break;
      default:
        bg = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
        bg.setAttribute('x', x); bg.setAttribute('y', y);
        bg.setAttribute('width', w); bg.setAttribute('height', h);
        bg.setAttribute('rx', '8');
    }
    if (shape !== 'cylinder') {
      bg.setAttribute('fill', 'url(#' + gradId + ')');
      bg.setAttribute('stroke', strokeColor); bg.setAttribute('stroke-width', '1.5');
      bg.setAttribute('filter', 'url(#g)');
      el.appendChild(bg);
      // Edge highlight overlay
      var hl = bg.cloneNode(true);
      hl.setAttribute('fill', 'url(#' + gradId + '-hl)');
      hl.setAttribute('stroke', 'none');
      hl.setAttribute('filter', 'none');
      hl.setAttribute('pointer-events', 'none');
      hl.setAttribute('class', 'component-hl');
      el.appendChild(hl);
    }
    el.setAttribute('class', 'component-bg');
    g.appendChild(el);
  }

  _renderIcon(g, key, cx, cy, cw, ch) {
    const pathData = ICONS[key];
    if (!pathData) return;
    const pal2 = this._pal();
    const iconSize = 18;
    const ix = cx + cw / 2 - iconSize / 2;
    const iy = cy + ch / 2 - iconSize / 2 - 9;
    const svgNs = 'http://www.w3.org/2000/svg';
    const iconGroup = document.createElementNS(svgNs, 'g');
    iconGroup.setAttribute('pointer-events', 'none');

    const bg = document.createElementNS(svgNs, 'circle');
    bg.setAttribute('cx', cx + cw / 2); bg.setAttribute('cy', cy + ch / 2 - 9);
    bg.setAttribute('r', '12'); bg.setAttribute('fill', pal2.iconBg);
    iconGroup.appendChild(bg);

    const path = document.createElementNS(svgNs, 'path');
    path.setAttribute('d', pathData); path.setAttribute('fill', pal2.iconPath); path.setAttribute('opacity', '0.9');
    path.setAttribute('transform', `translate(${ix},${iy}) scale(${iconSize / 24})`);
    iconGroup.appendChild(path);
    g.appendChild(iconGroup);
  }

  _renderDefaultMarker(g, cx, cy, cw, ch, id) {
    const pal2 = this._pal();
    const svgNs = 'http://www.w3.org/2000/svg';
    const cx2 = cx + cw / 2;
    const circle = document.createElementNS(svgNs, 'circle');
    circle.setAttribute('cx', cx2); circle.setAttribute('cy', cy + ch / 2 - 9);
    circle.setAttribute('r', '14'); circle.setAttribute('fill', pal2.markerBg);
    g.appendChild(circle);

    const letter = document.createElementNS(svgNs, 'text');
    letter.setAttribute('x', cx2); letter.setAttribute('y', cy + ch / 2 - 3);
    letter.setAttribute('text-anchor', 'middle'); letter.setAttribute('fill', pal2.markerText);
    letter.setAttribute('font-size', '14'); letter.setAttribute('font-weight', '700');
    letter.setAttribute('font-family', "'Inter',sans-serif"); letter.setAttribute('pointer-events', 'none');
    letter.textContent = (id || '?')[0].toUpperCase();
    g.appendChild(letter);
  }

  _defaultIcon(id) {
    const map = {
      device: 'laptop', router: 'router', isp: 'cloud', server: 'server',
      dns: 'server', packet: 'packet', wifi: 'wifi', modem: 'modem',
      browser: 'browser', website: 'globe', client: 'monitor', loadbalancer: 'load-balancer',
      database: 'database', cache: 'database', source: 'laptop', destination: 'monitor',
      ipv4: 'globe', ipv6: 'globe', subnet: 'filter', gateway: 'router',
      dhcp: 'server', network: 'network', switch: 'router', firewall: 'shield',
      landing: 'data-center', cable: 'cable', repeater: 'chip', buoy: 'satellite',
      rack: 'server', cooling: 'fan', power: 'power', cdn: 'cdn', origin: 'server',
      tcp: 'cable', satellite: 'satellite', cellular: 'cell-tower',
      saas: 'cloud', paas: 'cloud', iaas: 'cloud', public: 'globe', private: 'lock',
      hybrid: 'network', encryption: 'lock', vpn: 'shield', antivirus: 'shield',
      auth: 'key', backup: 'database', waf: 'firewall', dns: 'globe',
      tld: 'server', root: 'server', authoritative: 'server', recursive: 'server', ap: 'wifi'
    };
    return map[id] || null;
  }

  _updateFlowDots() {
    if (!this._flowDots || !this._flowDots.length) return;
    const base = this.t * 0.3;
    this._flowDots.forEach((fd, j) => {
      const cp = this._connPaths[fd.idx];
      if (!cp) return;
      var trailOffset = fd.trail !== undefined ? fd.trail * 0.08 : j * 0.15;
      let t = (base + trailOffset) % 1;
      const x = ((cp.ax * t + cp.bxc) * t + cp.cxc) * t + cp.x1;
      const y = (cp.ay * t + cp.byc) * t * t + cp.y1;
      if (fd.isPacket) {
        fd.el.setAttribute('transform', 'translate(' + x + ',' + y + ')');
      } else {
        fd.el.setAttribute('cx', x);
        fd.el.setAttribute('cy', y);
      }
    });
  }

  _updateLiveMetrics() {
    if (!this.el.metricsBar) return;
    if (!this._metricsCache) this._metricsCache = {};
    var connCount = (this.cfg.connections || []).length;
    var flowCount = this._flowDots ? this._flowDots.length : 0;
    var activeCount = this._flowDots ? this._flowDots.filter(function(fd) { return fd.isPacket; }).length : 0;
    var t = this.t;
    var p = Math.floor(t * 3) % 999;
    var l = Math.round(12 + Math.sin(t * 2) * 5) + 'ms';
    var a = activeCount > 0 ? activeCount : Math.max(1, Math.floor(t * 0.5) % (connCount + 1));
    var r = Math.round(8 + Math.cos(t * 1.5) * 3) + '/s';
    if (p !== this._metricsCache.p) { this.el.metricPackets.textContent = p; this._metricsCache.p = p; }
    if (l !== this._metricsCache.l) { this.el.metricLatency.textContent = l; this._metricsCache.l = l; }
    if (a !== this._metricsCache.a) { this.el.metricActive.textContent = a; this._metricsCache.a = a; }
    if (r !== this._metricsCache.r) { this.el.metricRate.textContent = r; this._metricsCache.r = r; }
  }

  _pulseActiveComponent() {
    if (this.selectedId) return;
    var comps;
    if (!this._pulseCache) this._pulseCache = { step: -2 };
    if (this.currentStep !== this._pulseCache.step) {
      comps = this.el.visual.querySelectorAll('.component');
      this._pulseCache.comps = comps;
      this._pulseCache.step = this.currentStep;
      this._pulseCache.lastIdx = undefined;
    } else {
      comps = this._pulseCache.comps;
    }
    if (!comps || !comps.length) return;
    var idx = Math.floor(this.t * 0.5) % comps.length;
    if (idx === this._pulseCache.lastIdx) return;
    if (this._pulseCache.lastIdx !== undefined && this._pulseCache.lastIdx < comps.length) {
      comps[this._pulseCache.lastIdx].classList.remove('component-breathing');
      var prevBg = comps[this._pulseCache.lastIdx].querySelector('.component-bg > :first-child');
      if (prevBg) {
        var pi = this._pulseCache.lastIdx % 6;
        prevBg.setAttribute('fill', pal.compBgs[pi]);
        prevBg.setAttribute('stroke', pal.compStroke);
      }
    }
    comps[idx].classList.add('component-breathing');
    var pal = this._pal();
    var curBg = comps[idx].querySelector('.component-bg > :first-child');
    if (curBg) {
      curBg.setAttribute('fill', pal.compBgActive);
      curBg.setAttribute('stroke', pal.compStrokeActive);
    }
    this._pulseCache.lastIdx = idx;
  }

  _showPacketInfo(label, color, connIdx) {
    const eng = this;
    if (!eng.el.packetBar) {
      const bar = document.createElement('div');
      bar.id = 'packet-bar';
      bar.style.cssText = 'display:flex;align-items:center;gap:10px;padding:10px 14px;background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.06);border-radius:8px;margin-top:8px;animation:packetFadeIn .3s ease';
      const barInner = document.createElement('div'); barInner.id = 'packet-bar-inner'; barInner.style.cssText = 'flex:1';
      bar.appendChild(barInner);
      const closeBtn = document.createElement('button');
      closeBtn.innerHTML = '&times;';
      closeBtn.style.cssText = 'background:none;border:none;color:#64748b;font-size:18px;cursor:pointer;padding:0 4px';
      closeBtn.addEventListener('click', function () { bar.remove(); eng.el.packetBar = null; });
      bar.appendChild(closeBtn);
      this.el.packetBar = bar;
      const visual = this.el.visual;
      if (visual && visual.parentNode) {
        visual.parentNode.insertBefore(bar, visual.nextSibling);
      }
    }
    const inner = document.getElementById('packet-bar-inner');
    if (inner) {
      const conn = this.cfg.connections && this.cfg.connections[connIdx];
      const fromComp = conn ? this._findComp(conn.from) : null;
      const toComp = conn ? this._findComp(conn.to) : null;
      inner.innerHTML = '<div style="font-size:12px;font-weight:600;color:' + (color || '#22c55e') + '">' + (label || 'Packet') + '</div><div style="font-size:11px;color:#94a3b8;margin-top:2px">Traveling from <strong style="color:#e2e8f0">' + (fromComp ? fromComp.name : conn.from) + '</strong> to <strong style="color:#e2e8f0">' + (toComp ? toComp.name : conn.to) + '</strong></div>';
      this._setStatus('Tracing: ' + label + ' packet');
    }
  }

  // ── Drag & Drop Matching Builder ──
  buildDragMatching(container, cfg) {
    const self = this;
    const items = cfg.items || [];
    const slots = cfg.slots || [];
    if (!items.length) { container.innerHTML = '<div style="padding:40px;text-align:center;color:#94a3b8"><p>No items</p></div>'; return; }
    container.innerHTML = '';
    
    const wrapper = document.createElement('div');
    wrapper.style.cssText = 'display:flex;flex-direction:row;gap:20px;padding:24px;width:100%;height:100%;flex-wrap:wrap;overflow-y:auto';
    container.appendChild(wrapper);

    const matched = {};
    const total = items.length;

    // Palette (left/top)
    const pal = document.createElement('div');
    pal.style.cssText = 'flex:1;min-width:260px;display:flex;flex-direction:column;gap:10px;padding:16px;background:rgba(255,255,255,0.02);border-radius:12px;border:1px solid rgba(255,255,255,0.06)';
    const palTitle = document.createElement('div');
    palTitle.textContent = 'Drag items to correct definitions';
    palTitle.style.cssText = 'font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:.08em;color:#64748b;padding-bottom:8px;border-bottom:1px solid rgba(255,255,255,0.06)';
    pal.appendChild(palTitle);
    wrapper.appendChild(pal);

    // Slots area (right/bottom)
    const slArea = document.createElement('div');
    slArea.style.cssText = 'flex:1.2;min-width:280px;display:flex;flex-direction:column;gap:10px;padding:16px;background:rgba(255,255,255,0.02);border-radius:12px;border:1px solid rgba(255,255,255,0.06)';
    const slTitle = document.createElement('div');
    slTitle.textContent = 'Definitions / Purposes';
    slTitle.style.cssText = 'font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:.08em;color:#64748b;padding-bottom:8px;border-bottom:1px solid rgba(255,255,255,0.06)';
    slArea.appendChild(slTitle);
    wrapper.appendChild(slArea);

    function buildPalette() {
      // Clear old cards
      while (pal.children.length > 1) pal.removeChild(pal.lastChild);
      items.forEach(function (it) {
        if (matched[it.id]) return;
        const card = document.createElement('div');
        card.draggable = true;
        card.dataset.itemId = it.id;
        card.className = 'sim-card';
        card.style.cssText = 'padding:12px 16px;background:rgba(9,89,200,0.1);border:1px solid rgba(9,89,200,0.3);border-radius:8px;cursor:grab;transition:all .2s;font-size:13px;font-weight:600;color:#fff;user-select:none';
        card.textContent = it.label || it.id;
        
        card.addEventListener('dragstart', function (e) {
          e.dataTransfer.setData('text/plain', it.id);
          this.style.opacity = '0.4';
        });
        card.addEventListener('dragend', function () {
          this.style.opacity = '1';
        });

        // Touch handlers for mobile/tablet drag matching
        card.addEventListener('touchstart', function (e) {
          this.dataset.touchId = it.id;
          const ghost = document.createElement('div');
          ghost.id = 'mg-ghost';
          ghost.textContent = it.label || it.id;
          ghost.style.cssText = 'position:fixed;pointer-events:none;z-index:9999;padding:10px 16px;background:#0959C8;color:#fff;border-radius:8px;font-size:13px;font-weight:600;box-shadow:0 8px 30px rgba(0,0,0,0.5);border:1px solid #3b82f6';
          document.body.appendChild(ghost);
        }, { passive: true });
        
        card.addEventListener('touchmove', function (e) {
          const t = e.touches[0];
          const ghost = document.getElementById('mg-ghost');
          if (ghost) {
            ghost.style.left = (t.clientX - 50) + 'px';
            ghost.style.top = (t.clientY - 20) + 'px';
          }
        }, { passive: true });
        
        card.addEventListener('touchend', function (e) {
          const ghost = document.getElementById('mg-ghost');
          if (ghost) ghost.remove();
          const t = e.changedTouches[0];
          const dropEl = document.elementFromPoint(t.clientX, t.clientY);
          const zone = dropEl ? dropEl.closest('[data-slot-id]') : null;
          if (zone) handleMatch(this.dataset.touchId, zone.dataset.slotId);
          delete this.dataset.touchId;
        });

        pal.appendChild(card);
      });

      const prog = document.createElement('div');
      prog.style.cssText = 'font-size:11px;font-weight:600;color:#64748b;padding:8px 0;text-align:center;margin-top:auto';
      prog.textContent = Object.keys(matched).length + '/' + total + ' Completed';
      pal.appendChild(prog);
    }

    function buildSlots() {
      while (slArea.children.length > 1) slArea.removeChild(slArea.lastChild);
      slots.forEach(function (sl) {
        const zone = document.createElement('div');
        zone.dataset.slotId = sl.id;
        zone.style.cssText = 'padding:14px 18px;border:2px dashed rgba(255,255,255,0.08);border-radius:10px;transition:all .3s;font-size:12px;color:#cbd5e1;min-height:50px;display:flex;flex-direction:column;gap:6px;justify-content:center';
        
        const desc = document.createElement('div');
        desc.textContent = sl.label;
        desc.style.cssText = 'color:#94a3b8;font-weight:500';
        zone.appendChild(desc);

        const val = document.createElement('div');
        val.id = 'slot-val-' + sl.id;
        val.textContent = 'Drop component here...';
        val.style.cssText = 'font-size:11px;font-weight:700;color:#64748b;font-style:italic';
        zone.appendChild(val);

        zone.addEventListener('dragover', function (e) {
          e.preventDefault();
          this.style.borderColor = '#3b82f6';
          this.style.background = 'rgba(9,89,200,0.05)';
        });
        zone.addEventListener('dragleave', function () {
          this.style.borderColor = 'rgba(255,255,255,0.08)';
          this.style.background = 'transparent';
        });
        zone.addEventListener('drop', function (e) {
          e.preventDefault();
          this.style.borderColor = 'rgba(255,255,255,0.08)';
          this.style.background = 'transparent';
          const id = e.dataTransfer.getData('text/plain');
          handleMatch(id, sl.id);
        });

        slArea.appendChild(zone);
      });
    }

    function handleMatch(itemId, slotId) {
      if (matched[itemId]) return;
      const item = items.find(x => x.id === itemId);
      const slot = slots.find(x => x.id === slotId);
      if (!item || !slot) return;
      
      const zone = slArea.querySelector('[data-slot-id="' + slotId + '"]');
      if (item.slot === slotId) {
        matched[itemId] = true;
        if (zone) {
          zone.style.borderColor = '#10b981';
          zone.style.background = 'rgba(16, 185, 129, 0.08)';
          const val = document.getElementById('slot-val-' + slotId);
          if (val) {
            val.textContent = '✓ ' + item.label;
            val.style.color = '#10b981';
            val.style.fontStyle = 'normal';
          }
        }
        self._setStatus('Correct Match!');
        buildPalette();
        if (Object.keys(matched).length === total) {
          self._setStatus('Challenge Completed!');
          self.markCompleted();
          const done = document.createElement('div');
          done.textContent = '🎉 Congratulations! You resolved all concepts correctly.';
          done.style.cssText = 'text-align:center;padding:16px;color:#10b981;font-size:14px;font-weight:700;animation:packetFadeIn .4s ease';
          slArea.appendChild(done);
        }
      } else {
        if (zone) {
          zone.style.borderColor = '#ef4444';
          zone.style.background = 'rgba(239, 68, 68, 0.08)';
          setTimeout(() => {
            zone.style.borderColor = 'rgba(255, 255, 255, 0.08)';
            zone.style.background = 'transparent';
          }, 1200);
        }
        self._setStatus('Try again! Match does not fit.');
      }
    }

    buildPalette();
    buildSlots();
  }

  // ── Step Flow Builder ──
  buildStepFlow(container) {
    const self = this;
    const steps = self.cfg.steps || [];

    container.innerHTML = '';
    const wrapper = document.createElement('div');
    wrapper.style.cssText = 'display:flex;flex-direction:column;gap:16px;padding:24px;width:100%;height:100%;overflow-y:auto';
    container.appendChild(wrapper);

    // Flow visualization
    const flowArea = document.createElement('div');
    flowArea.style.cssText = 'display:flex;gap:12px;align-items:flex-start;overflow-x:auto;padding:16px 12px;background:rgba(255,255,255,0.02);border-radius:12px;border:1px solid rgba(255,255,255,0.06);min-height:130px;flex-wrap:nowrap';
    wrapper.appendChild(flowArea);

    // Detail panel
    const detail = document.createElement('div');
    detail.id = 'stepflow-detail';
    detail.style.cssText = 'padding:16px 20px;background:rgba(9,89,200,0.03);border-radius:12px;border:1px solid rgba(9,89,200,0.1);min-height:90px;display:none';
    wrapper.appendChild(detail);

    function buildFlow() {
      flowArea.innerHTML = '';
      steps.forEach(function (s, i) {
        const node = document.createElement('div');
        node.dataset.sidx = i;
        node.style.cssText = 'display:flex;flex-direction:column;align-items:center;gap:8px;cursor:pointer;padding:12px;border-radius:10px;border:1px solid rgba(255,255,255,0.06);background:rgba(255,255,255,0.02);transition:all .3s;min-width:110px;flex-shrink:0';
        node.innerHTML = '<div style="width:32px;height:32px;border-radius:50%;background:rgba(9,89,200,0.2);color:#60a5fa;display:flex;align-items:center;justify-content:center;font-size:13px;font-weight:700">' + (i + 1) + '</div><div style="font-size:12px;font-weight:600;color:#e2e8f0;text-align:center;line-height:1.3">' + self._esc(s.label) + '</div>';
        
        if (i < steps.length - 1) {
          const arrow = document.createElement('div');
          arrow.textContent = '→';
          arrow.style.cssText = 'font-size:20px;color:#475569;flex-shrink:0;margin-top:14px;font-weight:700';
          flowArea.appendChild(node);
          flowArea.appendChild(arrow);
        } else {
          flowArea.appendChild(node);
        }
        node.addEventListener('click', function () {
          self.currentStep = i;
          self._applyStep();
        });
      });
    }

    function showStep(i) {
      const nodes = flowArea.querySelectorAll('[data-sidx]');
      nodes.forEach(function (n) {
        var idx = parseInt(n.dataset.sidx);
        n.style.borderColor = idx === i ? '#3b82f6' : 'var(--border-pool)';
        n.style.background = idx === i ? 'rgba(9,89,200,0.1)' : 'rgba(255,255,255,0.02)';
        n.style.boxShadow = idx === i ? '0 0 20px rgba(9,89,200,0.3)' : 'none';
      });
      const s = steps[i];
      detail.style.display = 'block';
      detail.innerHTML = '<div style="font-size:15px;font-weight:700;color:#3b82f6;margin-bottom:6px">' + self._esc(s.label) + '</div><div style="font-size:13px;color:#cbd5e1;line-height:1.6">' + self._esc(s.description || s.status || '') + '</div>';
      
      if (self.cfg.components) {
        const comp = self.cfg.components.find(function (c) { return c.id === s.id; });
        if (comp) self.selectComponent(s.id);
      }
      self._setStatus(s.status || 'Step ' + (i + 1) + ' of ' + steps.length);
    }

    self._onStepChange = showStep;
    buildFlow();
    if (steps.length) {
      self.currentStep = 0;
      self._applyStep();
    }
  }

  // ── Click Explorer Builder ──
  buildClickExplorer(container) {
    const self = this;
    const comps = this.cfg.components || [];
    if (!comps.length) { container.innerHTML = '<div style="padding:40px;text-align:center;color:#94a3b8"><p>No components</p></div>'; return; }
    
    container.innerHTML = '';
    const wrapper = document.createElement('div');
    wrapper.style.cssText = 'display:flex;flex-direction:column;gap:16px;padding:24px;width:100%;height:100%;overflow-y:auto';
    container.appendChild(wrapper);

    // Visual grid of clickable components
    const grid = document.createElement('div');
    grid.style.cssText = 'display:grid;grid-template-columns:repeat(auto-fill,minmax(140px,1fr));gap:12px;padding:4px';
    wrapper.appendChild(grid);

    let detail;
    if (!self.cfg.suppressDetail) {
      detail = document.createElement('div');
      detail.id = 'ce-detail';
      detail.style.cssText = 'padding:16px 20px;background:rgba(255,255,255,0.02);border-radius:12px;border:1px solid rgba(255,255,255,0.06);min-height:60px;display:none';
      wrapper.appendChild(detail);
    }

    comps.forEach(function (c) {
      const card = document.createElement('div');
      card.dataset.componentId = c.id;
      card.style.cssText = 'display:flex;flex-direction:column;align-items:center;gap:8px;padding:18px 12px;background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.06);border-radius:10px;cursor:pointer;transition:all .2s;text-align:center';
      
      const iconEl = document.createElement('div');
      iconEl.textContent = self._getIconChar(c.id);
      iconEl.style.cssText = 'font-size:26px;line-height:1;margin-bottom:4px';
      card.appendChild(iconEl);
      
      const nameEl = document.createElement('div');
      nameEl.textContent = c.name || c.id;
      nameEl.style.cssText = 'font-size:12px;font-weight:700;color:#e2e8f0;line-height:1.3';
      card.appendChild(nameEl);
      
      const catEl = document.createElement('div');
      catEl.textContent = c.category || '';
      catEl.style.cssText = 'font-size:10px;color:#64748b';
      card.appendChild(catEl);
      
      card.addEventListener('click', function () {
        grid.querySelectorAll('[data-component-id]').forEach(el => {
          el.style.borderColor = 'var(--border-pool)';
          el.style.background = 'rgba(255,255,255,0.03)';
        });
        card.style.borderColor = '#3b82f6';
        card.style.background = 'rgba(9,89,200,0.1)';
        self.selectComponent(c.id);
        if (detail) {
          detail.style.display = 'block';
          detail.innerHTML = '<div style="font-size:15px;font-weight:700;color:#3b82f6;margin-bottom:6px">' + self._esc(c.name || c.id) + '</div><div style="font-size:13px;color:#cbd5e1;line-height:1.6">' + self._esc(c.purpose || '') + '</div><div style="font-size:12px;color:#94a3b8;margin-top:8px;line-height:1.5">' + self._esc(c.description || '') + '</div>';
        }
      });
      grid.appendChild(card);
    });
  }

  _getIconChar(id) {
    const map = {
      socket: '⚡', chipset: '⚙', slots: '☐', headers: '↔', ports: '↗', vrms: '⚡',
      cpu: '⚙', dimm: '⬛', slot: '☐', channel: '↔', latch: '✔', dualrank: '▤',
      capacity: '⏳', ssd: '⚡', hdd: '⏰', bracket: '⚙', cable: '↔', m2: '⬛',
      tray: '☐', psu: '⚡', connector: '⚡', rail: '↔', modular: '⇄', rating: '★',
      case: '▥', fan: '❄', radiator: '➡', airflow: '➡', filter: '■', thermal: '♨',
      gpu: '⚙', pcie: '▚', power: '⚡', riser: '↕', bios: '⚙', uefi: '⚙', cmos: '⏰',
      settings: '⚙', boot: '➡', firmware: '⚙', media: '💿', partition: '▤', format: '♻',
      install: '⬇', driver: '⚙', activation: '✔', utility: '⚙', codec: '♪', runtime: '⚙',
      update: '↻', config: '⚙', postcode: '⎶', beep: '♪', multimeter: '⚙', reseat: '↺'
    };
    return map[id] || '■';
  }

  _setStatus(msg) {
    // Left-aligned status trace for feedback
    console.log(`[Consica Status]: ${msg}`);
  }
  _esc(s) {
    if (!s) return '';
    const d = document.createElement('div');
    d.textContent = s;
    return d.innerHTML;
  }
}

window.DiagramEngine = DiagramEngine;
window.deferInit = function (fn) {
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', fn); else fn();
};

})();
