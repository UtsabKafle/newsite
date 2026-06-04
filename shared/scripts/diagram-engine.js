/* ═══════════════════════════════════════════════════════
   Consica Labs — Universal Interactive Diagram Engine v2
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

class DiagramEngine{
  constructor(cfg){
    this.cfg=cfg;
    this.speed=1;this.playing=false;this.t=0;this.dt=0;
    this.selectedId=null;this.currentStep=-1;this.tourActive=false;this.tourStep=0;
    this.detailMode='basic';
    this.lastFrame=0;this.rafId=null;
    this._connPaths=[];this._flowDots=[];

    this.el={};
    this._build();
    this._bind();
    if(this.cfg.render)this.cfg.render(this.el.visual,this);
    this._showEmptyState();
    this._updateStepControls();
    if(window.matchMedia('(prefers-reduced-motion:reduce)').matches){
      this.speed=0;this._updateSpeedDisplay();
    }
  }

  _build(){
    const title=_formatTitle(this.cfg.title||'Interactive Diagram');
    const w=this.el.wrapper=$('#diagram-wrapper',document.body)||(()=>{
      const d=document.createElement('div');d.id='diagram-wrapper';d.className='diagram-wrapper';
      document.body.prepend(d);return d;
    })();
    w.innerHTML=`
      <a class="skip-link" href="#diagram-visual">Skip to diagram</a>
      <header class="diagram-header">
        <h1 class="diagram-title">${this._esc(title)}</h1>
        ${this.cfg.subtitle?`<p class="diagram-subtitle">${this._esc(this.cfg.subtitle)}</p>`:''}
        ${this.cfg.desc?`<p class="diagram-desc">${this._esc(this.cfg.desc)}</p>`:''}
      </header>
      <div class="controls-bar" role="toolbar" aria-label="Diagram controls">
        <div class="ctrl-group">
          <button class="ctrl-btn" id="ctrl-play" aria-label="Play"><svg viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg><span class="btn-label">Play</span></button>
          <button class="ctrl-btn" id="ctrl-replay" aria-label="Replay"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M1 4v6h6M23 20v-6h-6"/><path d="M20.49 9A9 9 0 005.64 5.64L1 10m22 4l-4.64 4.36A9 9 0 013.51 15"/></svg><span class="btn-label">Replay</span></button>
        </div>
        <div class="ctrl-divider"></div>
        <div class="ctrl-group speed-ctrl" role="group" aria-label="Animation speed">
          <span class="speed-label">Speed</span>
          <button class="speed-down" aria-label="Decrease speed">−</button>
          <span class="speed-display" aria-live="polite">1×</span>
          <button class="speed-up" aria-label="Increase speed">+</button>
        </div>
        <div class="ctrl-divider"></div>
        <div class="ctrl-group">
          <button class="ctrl-btn tour-btn" id="ctrl-tour" aria-label="Start guided tour"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4M12 8h.01"/></svg><span class="btn-label">Tour</span></button>
        </div>
      </div>
      <div class="diagram-main">
        <div class="diagram-visual" id="diagram-visual" role="img" aria-label="${this._esc(title)}"></div>
        <aside class="diagram-explanation" id="explanation-panel" role="complementary" aria-label="Component explanation">
          <div class="explanation-empty" id="expl-empty">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4M12 8h.01"/></svg>
            <p>Click a component to explore</p>
            <span class="expl-hint">Or start the guided tour</span>
          </div>
          <div class="explanation-header" id="expl-header" hidden>
            <span class="expl-name" id="expl-name"></span>
            <div class="expl-mode" role="group" aria-label="Explanation detail level">
              <button class="active" data-mode="basic" aria-pressed="true">Basic</button>
              <button data-mode="detailed" aria-pressed="false">Detailed</button>
            </div>
            <button class="expl-close" id="expl-close" aria-label="Close explanation">&times;</button>
          </div>
          <div class="explanation-body" id="expl-body" hidden></div>
        </aside>
      </div>
      <div class="step-controls" id="step-controls" role="group" aria-label="Step navigation">
        <button class="step-btn" id="step-prev" aria-label="Previous step"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" width="14" height="14"><path d="M19 12H5M12 19l-7-7 7-7"/></svg> Prev</button>
        <span class="step-indicator" id="step-indicator" aria-live="polite"></span>
        <button class="step-btn" id="step-next" aria-label="Next step">Next <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" width="14" height="14"><path d="M5 12h14M12 5l7 7-7 7"/></svg></button>
      </div>
      <div class="tour-overlay" id="tour-overlay" hidden></div>
    `;
    document.title=title+' — Interactive Diagram | Consica Labs';
    this.el.visual=$('#diagram-visual',w);
    this.el.playBtn=$('#ctrl-play',w);
    this.el.replayBtn=$('#ctrl-replay',w);
    this.el.speedDown=$('.speed-down',w);
    this.el.speedUp=$('.speed-up',w);
    this.el.speedDisplay=$('.speed-display',w);
    this.el.tourBtn=$('#ctrl-tour',w);
    this.el.explPanel=$('#explanation-panel',w);
    this.el.explHeader=$('#expl-header',w);
    this.el.explBody=$('#expl-body',w);
    this.el.explName=$('#expl-name',w);
    this.el.explEmpty=$('#expl-empty',w);
    this.el.explClose=$('#expl-close',w);
    this.el.stepPrev=$('#step-prev',w);
    this.el.stepNext=$('#step-next',w);
    this.el.stepIndicator=$('#step-indicator',w);
    this.el.stepControls=$('#step-controls',w);
    this.el.tourOverlay=$('#tour-overlay',w);
    this.el.modeBtns=$$('[data-mode]',this.el.explHeader);
    this.el.skipLink=$('.skip-link',w);

    if(!this.cfg.steps||!this.cfg.steps.length)this.el.stepControls.hidden=true;
  }

  _bind(){
    this.el.playBtn.addEventListener('click',()=>this.togglePlay());
    this.el.replayBtn.addEventListener('click',()=>this.replay());
    this.el.speedDown.addEventListener('click',()=>this._adjustSpeed(-.5));
    this.el.speedUp.addEventListener('click',()=>this._adjustSpeed(.5));
    this.el.tourBtn.addEventListener('click',()=>this.toggleTour());
    this.el.explClose.addEventListener('click',()=>this._clearSelection());
    this.el.stepPrev.addEventListener('click',()=>this.prevStep());
    this.el.stepNext.addEventListener('click',()=>this.nextStep());
    this.el.modeBtns.forEach(b=>b.addEventListener('click',()=>this._setDetailMode(b.dataset.mode)));

    document.addEventListener('keydown',e=>{
      if(e.target.closest('input,textarea,select'))return;
      if(e.key===' '||e.key==='Space'){e.preventDefault();this.togglePlay()}
      if(e.key==='ArrowRight'&&e.altKey){e.preventDefault();this.nextStep()}
      if(e.key==='ArrowLeft'&&e.altKey){e.preventDefault();this.prevStep()}
      if(e.key==='Escape')this._clearSelection();
    });

    this.el.visual.addEventListener('click',e=>{
      const el=e.target.closest('[data-component-id]');
      if(el)this.selectComponent(el.dataset.componentId);
    });
    this.el.visual.addEventListener('keydown',e=>{
      if(e.key==='Enter'||e.key===' '){
        const el=e.target.closest('[data-component-id]');
        if(el){e.preventDefault();this.selectComponent(el.dataset.componentId)}
      }
    });
  }

  togglePlay(){
    if(this.playing)this.pause();else this.play();
  }
  play(){
    if(this.playing)return;
    this.playing=true;
    this.lastFrame=performance.now();
    this._tick();
    this._updatePlayBtn();
    this._setStatus('Playing');
  }
  pause(){
    if(!this.playing)return;
    this.playing=false;
    if(this.rafId){cancelAnimationFrame(this.rafId);this.rafId=null}
    this._updatePlayBtn();
    this._setStatus('Paused');
  }
  replay(){
    this.t=0;this.currentStep=-1;
    if(!this.playing)this.play();else this._setStatus('Replaying');
    if(this.cfg.onReplay)this.cfg.onReplay(this);
  }
  _tick(){
    if(!this.playing)return;
    const now=performance.now();
    this.dt=(now-this.lastFrame)/1000*this.speed;
    this.lastFrame=now;
    if(this.speed>0){this.t+=this.dt;
      if(this.cfg.animate)this.cfg.animate(this);
      this._updateFlowDots();
    }
    this.rafId=requestAnimationFrame(()=>this._tick());
  }
  _updatePlayBtn(){
    const b=this.el.playBtn;
    if(this.playing){
      b.innerHTML='<svg viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/></svg><span class="btn-label">Pause</span>';
      b.setAttribute('aria-label','Pause');
    }else{
      b.innerHTML='<svg viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg><span class="btn-label">Play</span>';
      b.setAttribute('aria-label','Play');
    }
  }

  _adjustSpeed(delta){
    const speeds=[.5,1,1.5,2,3];
    let i=speeds.indexOf(this.speed);
    if(i<0)i=1;
    i=Math.max(0,Math.min(speeds.length-1,i+(delta>0?1:-1)));
    this.speed=speeds[i];
    this._updateSpeedDisplay();
  }
  _updateSpeedDisplay(){
    this.el.speedDisplay.textContent=this.speed+'×';
  }

  selectComponent(id){
    if(!id)return;
    if(this.tourActive)this._endTour();
    this._clearHighlights();
    this.selectedId=id;
    $$('[data-component-id]',this.el.visual).forEach(el=>{
      if(el.dataset.componentId===id)el.classList.add('selected');
    });
    if(this.cfg.connections){
      $$('.connection',this.el.visual).forEach(el=>{
        const f=el.dataset.from,t=el.dataset.to;
        if(f===id||t===id)el.classList.add('highlighted');
      });
    }
    this._showExplanation(id);
    this._setStatus(`Selected: ${id}`);
  }
  _clearSelection(){
    this.selectedId=null;
    this._clearHighlights();
    this._showEmptyState();
    this._setStatus('Ready');
  }
  _clearHighlights(){
    $$('.selected',this.el.visual).forEach(el=>el.classList.remove('selected'));
    $$('.connection.highlighted',this.el.visual).forEach(el=>el.classList.remove('highlighted'));
  }

  _showExplanation(id){
    const comp=this._findComp(id);
    if(!comp)return;
    this.el.explEmpty.hidden=true;
    this.el.explHeader.hidden=false;
    this.el.explBody.hidden=false;
    this.el.explName.textContent=comp.name||id;

    const d=this.detailMode==='detailed';
    this.el.explPanel.classList.toggle('detailed',d);

    this.el.explBody.innerHTML=html`
      ${comp.category?`<div class="expl-section"><div class="expl-label">Category</div><div class="expl-value">${this._esc(comp.category)}</div></div>`:''}
      ${comp.purpose?`<div class="expl-section"><div class="expl-label">Purpose</div><div class="expl-value">${this._esc(comp.purpose)}</div></div>`:''}
      ${comp.description?`<div class="expl-section"><div class="expl-label">What It Does</div><div class="expl-value${comp.descriptionDetailed?' basic-only':''}">${this._esc(comp.description)}</div>${comp.descriptionDetailed?`<div class="expl-value detailed-only">${this._esc(comp.descriptionDetailed)}</div>`:''}</div>`:''}
      ${comp.why?`<div class="expl-section"><div class="expl-label">Why It Matters</div><div class="expl-value">${this._esc(comp.why)}</div></div>`:''}
      ${comp.analogy?`<div class="expl-section"><div class="expl-label">Real-World Analogy</div><div class="expl-value">${this._esc(comp.analogy)}</div></div>`:''}
      ${comp.funFact?`<div class="expl-section"><div class="expl-label">Fun Fact</div><div class="expl-value">${this._esc(comp.funFact)}</div></div>`:''}
      ${comp.takeaway?`<div class="expl-section"><div class="expl-label">Key Takeaway</div><div class="expl-value">${this._esc(comp.takeaway)}</div></div>`:''}
      ${comp.mistake?`<div class="expl-section"><div class="expl-label">Common Mistake</div><div class="expl-value">${this._esc(comp.mistake)}</div></div>`:''}
    `;
  }
  _showEmptyState(){
    this.el.explEmpty.hidden=false;
    this.el.explHeader.hidden=true;
    this.el.explBody.hidden=true;
  }
  _findComp(id){
    if(!this.cfg.components)return null;
    return this.cfg.components.find(c=>c.id===id)||null;
  }
  _setDetailMode(mode){
    this.detailMode=mode;
    this.el.modeBtns.forEach(b=>{
      const a=b.dataset.mode===mode;
      b.classList.toggle('active',a);
      b.setAttribute('aria-pressed',a);
    });
    if(this.selectedId)this._showExplanation(this.selectedId);
  }

  nextStep(){
    if(!this.cfg.steps||!this.cfg.steps.length)return;
    this.pause();
    this.currentStep=Math.min(this.currentStep+1,this.cfg.steps.length-1);
    this._applyStep();
  }
  prevStep(){
    if(!this.cfg.steps||!this.cfg.steps.length)return;
    this.pause();
    this.currentStep=Math.max(this.currentStep-1,0);
    this._applyStep();
  }
  _applyStep(){
    const steps=this.cfg.steps;
    if(!steps||!steps.length)return;
    const s=steps[this.currentStep];
    if(!s){this._setStatus('No more steps');return}
    if(s.onEnter)s.onEnter(this);
    this._setStatus(s.status||`Step ${this.currentStep+1} of ${steps.length}`);
    this._updateStepControls();
  }
  _updateStepControls(){
    const steps=this.cfg.steps;
    if(!steps||!steps.length){this.el.stepControls.hidden=true;return}
    this.el.stepControls.hidden=false;
    this.el.stepPrev.disabled=this.currentStep<=0;
    this.el.stepNext.disabled=this.currentStep>=steps.length-1;
    this.el.stepIndicator.textContent=this.currentStep>=0
      ? `Step ${this.currentStep+1} of ${steps.length}`
      : 'Click Next to begin';
    if(this.currentStep>=0&&steps[this.currentStep]&&steps[this.currentStep].label){
      this.el.stepIndicator.textContent+=` — ${steps[this.currentStep].label}`;
    }
  }

  toggleTour(){
    if(this.tourActive)this._endTour();else this._startTour();
  }
  _startTour(){
    if(!this.cfg.tour||!this.cfg.tour.length)return;
    this.pause();
    this.tourActive=true;this.tourStep=0;
    this.el.tourBtn.classList.add('active');
    this.el.tourBtn.querySelector('.btn-label').textContent='End Tour';
    this.el.tourOverlay.hidden=false;
    this._applyTourStep();
  }
  _endTour(){
    this.tourActive=false;
    this.el.tourBtn.classList.remove('active');
    this.el.tourBtn.querySelector('.btn-label').textContent='Tour';
    this.el.tourOverlay.hidden=true;
    this._clearSelection();
  }
  _applyTourStep(){
    if(!this.tourActive)return;
    const tour=this.cfg.tour;
    if(!tour||this.tourStep>=tour.length||this.tourStep<0){this._endTour();return}
    const step=tour[this.tourStep];
    if(step.componentId)this.selectComponent(step.componentId);
    if(step.selectEl){
      const el=this.el.visual.querySelector(step.selectEl);
      if(el)el.scrollIntoView({behavior:'smooth',block:'center'});
    }
    this.el.tourOverlay.innerHTML=`
      <div class="tour-tooltip" style="${step.style||'bottom:20px;right:20px;left:auto;top:auto'}">
        <h4>${this._esc(step.title||'')}</h4>
        <p>${this._esc(step.description||'')}</p>
        <div class="tour-nav">
          ${this.tourStep>0?'<button class="tour-prev">Previous</button>':''}
          ${this.tourStep<tour.length-1
            ?'<button class="tour-next primary">Next</button>'
            :'<button class="tour-finish primary">Finish</button>'}
        </div>
      </div>
    `;
    const overlay=this.el.tourOverlay;
    const prev=overlay.querySelector('.tour-prev');
    const next=overlay.querySelector('.tour-next');
    const finish=overlay.querySelector('.tour-finish');
    if(prev)prev.addEventListener('click',()=>{this.tourStep--;this._applyTourStep()});
    if(next)next.addEventListener('click',()=>{this.tourStep++;this._applyTourStep()});
    if(finish)finish.addEventListener('click',()=>this._endTour());
  }

  // ── New: buildVisual with shapes, icons, custom layouts ──
  buildVisual(container){
    const comps=this.cfg.components||[];
    const conns=this.cfg.connections||[];
    if(!comps.length){container.innerHTML='<div style="padding:40px;text-align:center;color:#94a3b8"><p>No components defined</p></div>';return}

    const hasPos=comps.some(c=>c.x!==undefined);
    const compColors=['#1a2235','#1d2638','#16233a','#1a2538','#1c2838','#18243a'];
    let w,h,autoCols,autoRows,autoCw=120,autoCh=56,autoGx=18,autoGy=22,autoPx=20,autoPy=18;
    let compsPos=[];

    if(hasPos){
      let maxX=0,maxY=0;
      comps.forEach(c=>{
        const cw=c.width||110,ch=c.height||50;
        const cx=c.x||0,cy=c.y||0;
        maxX=Math.max(maxX,cx+cw+30);
        maxY=Math.max(maxY,cy+ch+30);
      });
      w=Math.max(maxX,320);h=Math.max(maxY,240);
      comps.forEach(c=>{
        compsPos.push({x:c.x||0,y:c.y||0,w:c.width||110,h:c.height||50});
      });
    }else{
      const n=comps.length;
      autoCols=Math.min(n,4);
      autoRows=Math.ceil(n/autoCols);
      w=autoCols*autoCw+(autoCols-1)*autoGx+autoPx*2;
      h=autoRows*autoCh+(autoRows-1)*autoGy+autoPy*2;
      comps.forEach((c,j)=>{
        compsPos.push({
          x:autoPx+(j%autoCols)*(autoCw+autoGx),
          y:autoPy+Math.floor(j/autoCols)*(autoCh+autoGy),
          w:autoCw,h:autoCh
        });
      });
    }

    const svg=document.createElementNS('http://www.w3.org/2000/svg','svg');
    svg.setAttribute('viewBox',`0 0 ${w} ${h}`);
    svg.setAttribute('style','width:100%;height:auto;max-height:65vh');
    const defs=document.createElementNS('http://www.w3.org/2000/svg','defs');
    const filter=document.createElementNS('http://www.w3.org/2000/svg','filter');
    filter.setAttribute('id','g');
    const shadow=document.createElementNS('http://www.w3.org/2000/svg','feDropShadow');
    shadow.setAttribute('dx','0');shadow.setAttribute('dy','2');
    shadow.setAttribute('stdDeviation','4');
    shadow.setAttribute('flood-color','#0959C8');shadow.setAttribute('flood-opacity','.25');
    filter.appendChild(shadow);defs.appendChild(filter);
    const gfilter=document.createElementNS('http://www.w3.org/2000/svg','filter');
    gfilter.setAttribute('id','glow');
    const gshadow=document.createElementNS('http://www.w3.org/2000/svg','feGaussianBlur');
    gshadow.setAttribute('stdDeviation','2');gshadow.setAttribute('result','blur');
    const gmerge=document.createElementNS('http://www.w3.org/2000/svg','feMerge');
    const gn1=document.createElementNS('http://www.w3.org/2000/svg','feMergeNode');
    gn1.setAttribute('in','blur');
    const gn2=document.createElementNS('http://www.w3.org/2000/svg','feMergeNode');
    gn2.setAttribute('in','SourceGraphic');
    gmerge.appendChild(gn1);gmerge.appendChild(gn2);
    gfilter.appendChild(gshadow);gfilter.appendChild(gmerge);defs.appendChild(gfilter);
    svg.appendChild(defs);

    const bg=document.createElementNS('http://www.w3.org/2000/svg','rect');
    bg.setAttribute('width',w);bg.setAttribute('height',h);
    bg.setAttribute('fill','transparent');
    svg.appendChild(bg);

    // connections (smart edge-to-edge routing)
    this._connPaths=[];
    const colors=['#475569','#64748b','#475569'];
    conns.forEach((c,i)=>{
      const fi=comps.findIndex(x=>x.id===c.from);
      const ti=comps.findIndex(x=>x.id===c.to);
      if(fi<0||ti<0)return;
      const fp=compsPos[fi],tp=compsPos[ti];
      // compute best edge pair
      const edges=(p)=>({
        r:{x:p.x+p.w,y:p.y+p.h/2},l:{x:p.x,y:p.y+p.h/2},
        t:{x:p.x+p.w/2,y:p.y},b:{x:p.x+p.w/2,y:p.y+p.h}
      });
      const fe=edges(fp),te=edges(tp);
      let bd=Infinity,bx,by,tx,ty;
      for(const fk of['r','l','t','b']){
        const f=fe[fk];
        for(const tk of['l','r','b','t']){
          const t=te[tk],dx=f.x-t.x,dy=f.y-t.y,dd=dx*dx+dy*dy;
          if(dd<bd){bd=dd;bx=f.x;by=f.y;tx=t.x;ty=t.y}
        }
      }
      const mx=(bx+tx)/2,my=(by+ty)/2;
      const p=document.createElementNS('http://www.w3.org/2000/svg','path');
      p.setAttribute('class','connection');
      p.setAttribute('data-from',c.from);p.setAttribute('data-to',c.to);
      p.setAttribute('d',`M${bx} ${by}C${mx} ${by},${mx} ${ty},${tx} ${ty}`);
      p.setAttribute('stroke',c.color||colors[i%3]);
      svg.appendChild(p);
      const poly=document.createElementNS('http://www.w3.org/2000/svg','polygon');
      poly.setAttribute('class','connection-arrow');
      const ang=Math.atan2(ty-by,tx-bx);
      const al=10,aw=5;
      poly.setAttribute('points',
        `${tx-al*Math.cos(ang-0.4)},${ty-al*Math.sin(ang-0.4)} `+
        `${tx},${ty} `+
        `${tx-al*Math.cos(ang+0.4)},${ty-al*Math.sin(ang+0.4)}`
      );
      svg.appendChild(poly);
      if(c.label){
        const t=document.createElementNS('http://www.w3.org/2000/svg','text');
        t.setAttribute('x',mx);t.setAttribute('y',my-8);
        t.setAttribute('text-anchor','middle');t.setAttribute('fill','#94a3b8');
        t.setAttribute('font-size','11');t.setAttribute('font-weight','500');
        t.textContent=c.label;
        svg.appendChild(t);
      }
      this._connPaths.push({from:c.from,to:c.to,x1:bx,y1:by,x2:tx,y2:ty,mx,my});
    });

    // components
    comps.forEach((c,j)=>{
      const pos=compsPos[j];
      const cx=pos.x,cy=pos.y,cw=pos.w,ch=pos.h;
      const bgc=compColors[j%compColors.length];
      const shape=c.shape||'rounded-rect';
      const icon=c.icon||this._defaultIcon(c.id);
      const g=document.createElementNS('http://www.w3.org/2000/svg','g');
      g.setAttribute('data-component-id',c.id);
      g.setAttribute('class','component');
      g.setAttribute('tabindex','0');
      g.setAttribute('role','button');
      g.setAttribute('aria-label',`Select ${c.name||c.id}`);

      this._renderShapeBg(g,shape,cx,cy,cw,ch,bgc);

      if(icon&&ICONS[icon]){
        this._renderIcon(g,icon,cx,cy,cw,ch);
      }else{
        this._renderDefaultMarker(g,cx,cy,cw,ch,c.id);
      }

      const nameStr=c.name||c.id;
      const nameLen=nameStr.length;
      const availW=cw-14;
      const approxW=nameLen*6.5;
      const fs=approxW>availW?Math.max(7,Math.floor(availW/nameLen*1.2)):11;
      const name=document.createElementNS('http://www.w3.org/2000/svg','text');
      const textX=cx+(icon?cw/2:cw/2);
      name.setAttribute('x',textX);
      name.setAttribute('y',cy+ch-10);
      name.setAttribute('text-anchor','middle');
      name.setAttribute('fill','#e2e8f0');
      name.setAttribute('font-size',String(fs));
      name.setAttribute('font-weight','600');
      name.setAttribute('font-family',"'Inter',sans-serif");
      name.setAttribute('pointer-events','none');
      name.textContent=nameStr;
      g.appendChild(name);

      if(c.category&&!icon){
        const cat=document.createElementNS('http://www.w3.org/2000/svg','text');
        cat.setAttribute('x',cw/2);cat.setAttribute('y',ch-4);
        cat.setAttribute('text-anchor','middle');cat.setAttribute('fill','#94a3b8');
        cat.setAttribute('font-size','9');
        cat.setAttribute('font-family',"'Inter',sans-serif");
        cat.setAttribute('pointer-events','none');
        cat.textContent=c.category;
        // cat is placed relative to g which inherits transform
      }

      svg.appendChild(g);
    });

    // flow dots (or labeled packets if packetFlow config)
    this._flowDots=[];
    const pf=this.cfg.packetFlow;
    this._connPaths.forEach((cp,i)=>{
      if(i>=this.cfg.connections.length)return;
      const pkt=pf&&pf[i];
      let dot;
      if(pkt){
        dot=document.createElementNS('http://www.w3.org/2000/svg','g');
        dot.setAttribute('class','flow-dot packet');
        dot.setAttribute('data-conn-idx',i);
        dot.setAttribute('data-label',pkt.label||'');
        dot.setAttribute('role','button');
        dot.setAttribute('tabindex','0');
        dot.setAttribute('aria-label','Packet: '+(pkt.label||''));
        dot.style.cursor='pointer';
        const bg=document.createElementNS('http://www.w3.org/2000/svg','rect');
        bg.setAttribute('x','-24');bg.setAttribute('y','-8');
        bg.setAttribute('width','48');bg.setAttribute('height','16');
        bg.setAttribute('rx','4');bg.setAttribute('ry','4');
        bg.setAttribute('fill',pkt.color||'#22c55e');bg.setAttribute('opacity','0.9');
        bg.setAttribute('filter','url(#glow)');
        dot.appendChild(bg);
        const txt=document.createElementNS('http://www.w3.org/2000/svg','text');
        txt.setAttribute('text-anchor','middle');txt.setAttribute('fill','#fff');
        txt.setAttribute('font-size','8');txt.setAttribute('font-weight','700');
        txt.setAttribute('font-family',"'Inter',sans-serif");
        txt.setAttribute('y','3');txt.setAttribute('pointer-events','none');
        txt.textContent=pkt.label||'';
        dot.appendChild(txt);
        // Click handler
        dot.addEventListener('click',(function(idx,label,color){
          return function(e){
            e.stopPropagation();
            self._showPacketInfo(label,color,idx);
          };
        })(i,pkt.label,pkt.color));
        dot.addEventListener('keydown',(function(idx,label,color){
          return function(e){
            if(e.key==='Enter'||e.key===' '){e.preventDefault();self._showPacketInfo(label,color,idx)}
          };
        })(i,pkt.label,pkt.color));
      }else{
        dot=document.createElementNS('http://www.w3.org/2000/svg','circle');
        dot.setAttribute('r','4');
        dot.setAttribute('class','flow-dot');
        dot.setAttribute('data-conn-idx',i);
        dot.setAttribute('opacity','0.8');
        dot.setAttribute('filter','url(#glow)');
      }
      svg.appendChild(dot);
      this._flowDots.push({el:dot,idx:i,isPacket:!!pkt});
    });

    container.innerHTML='';
    container.appendChild(svg);
  }

  _renderShapeBg(g,shape,x,y,w,h,bgc){
    const el=document.createElementNS('http://www.w3.org/2000/svg','g');
    // Offset the shape group so text/kids can use relative coords
    let bg;
    switch(shape){
      case 'circle':
        const r=Math.min(w,h)/2;
        const cx=x+w/2,cy=y+h/2;
        bg=document.createElementNS('http://www.w3.org/2000/svg','circle');
        bg.setAttribute('cx',cx);bg.setAttribute('cy',cy);
        bg.setAttribute('r',r);
        bg.setAttribute('fill',bgc);
        bg.setAttribute('stroke','#2a3a55');bg.setAttribute('stroke-width','1.5');
        bg.setAttribute('filter','url(#g)');
        el.appendChild(bg);
        break;
      case 'pill':
        bg=document.createElementNS('http://www.w3.org/2000/svg','rect');
        bg.setAttribute('x',x);bg.setAttribute('y',y);
        bg.setAttribute('width',w);bg.setAttribute('height',h);
        bg.setAttribute('rx',h/2);bg.setAttribute('ry',h/2);
        bg.setAttribute('fill',bgc);
        bg.setAttribute('stroke','#2a3a55');bg.setAttribute('stroke-width','1.5');
        bg.setAttribute('filter','url(#g)');
        el.appendChild(bg);
        break;
      case 'diamond':
        bg=document.createElementNS('http://www.w3.org/2000/svg','polygon');
        const dx=x+w/2,dy=y+h/2;
        bg.setAttribute('points',`${dx},${y} ${x+w},${dy} ${dx},${y+h} ${x},${dy}`);
        bg.setAttribute('fill',bgc);
        bg.setAttribute('stroke','#2a3a55');bg.setAttribute('stroke-width','1.5');
        bg.setAttribute('filter','url(#g)');
        el.appendChild(bg);
        break;
      case 'hexagon':
        bg=document.createElementNS('http://www.w3.org/2000/svg','polygon');
        const hw=w/2,hh=h/2,hs=w*0.25;
        bg.setAttribute('points',`${x+hs},${y} ${x+w-hs},${y} ${x+w},${y+hh} ${x+w-hs},${y+h} ${x+hs},${y+h} ${x},${y+hh}`);
        bg.setAttribute('fill',bgc);
        bg.setAttribute('stroke','#2a3a55');bg.setAttribute('stroke-width','1.5');
        bg.setAttribute('filter','url(#g)');
        el.appendChild(bg);
        break;
      case 'cylinder':
        bg=document.createElementNS('http://www.w3.org/2000/svg','path');
        bg.setAttribute('d',`M${x},${y+10} L${x},${y+h-10} A${w/2},10 0 0,0 ${x+w},${y+h-10} L${x+w},${y+10} A${w/2},10 0 0,1 ${x},${y+10} Z`);
        bg.setAttribute('fill',bgc);
        bg.setAttribute('stroke','#2a3a55');bg.setAttribute('stroke-width','1.5');
        bg.setAttribute('filter','url(#g)');
        el.appendChild(bg);
        // top ellipse
        const top=document.createElementNS('http://www.w3.org/2000/svg','ellipse');
        top.setAttribute('cx',x+w/2);top.setAttribute('cy',y+10);
        top.setAttribute('rx',w/2);top.setAttribute('ry',10);
        top.setAttribute('fill',bgc);
        top.setAttribute('stroke','#2a3a55');top.setAttribute('stroke-width','1.5');
        el.appendChild(top);
        break;
      case 'cloud-shape':
        bg=document.createElementNS('http://www.w3.org/2000/svg','path');
        const cw2=w*0.3,ch2=h*0.4;
        bg.setAttribute('d',`M${x+cw2},${y+h} C${x},${y+h} ${x},${y+ch2} ${x+cw2},${y+ch2} C${x+cw2},${y} ${x+w-cw2},${y} ${x+w-cw2},${y+ch2} C${x+w},${y+ch2} ${x+w},${y+h} ${x+w-cw2},${y+h} Z`);
        bg.setAttribute('fill',bgc);
        bg.setAttribute('stroke','#2a3a55');bg.setAttribute('stroke-width','1.5');
        bg.setAttribute('filter','url(#g)');
        el.appendChild(bg);
        break;
      default:
        bg=document.createElementNS('http://www.w3.org/2000/svg','rect');
        bg.setAttribute('x',x);bg.setAttribute('y',y);
        bg.setAttribute('width',w);bg.setAttribute('height',h);
        bg.setAttribute('rx','8');bg.setAttribute('fill',bgc);
        bg.setAttribute('stroke','#2a3a55');bg.setAttribute('stroke-width','1.5');
        bg.setAttribute('filter','url(#g)');
        el.appendChild(bg);
    }
    el.setAttribute('class','component-bg');
    g.appendChild(el);
  }

  _renderIcon(g,key,cx,cy,cw,ch){
    const pathData=ICONS[key];
    if(!pathData)return;
    const iconSize=18;
    const ix=cx+cw/2-iconSize/2;
    const iy=cy+ch/2-iconSize/2-5;
    const svgNs='http://www.w3.org/2000/svg';
    const iconGroup=document.createElementNS(svgNs,'g');
    iconGroup.setAttribute('pointer-events','none');
    // icon background circle
    const bg=document.createElementNS(svgNs,'circle');
    bg.setAttribute('cx',cx+cw/2);
    bg.setAttribute('cy',cy+ch/2-5);
    bg.setAttribute('r','12');
    bg.setAttribute('fill','#0959C8');
    bg.setAttribute('opacity','0.15');
    iconGroup.appendChild(bg);
    // icon path
    const path=document.createElementNS(svgNs,'path');
    path.setAttribute('d',pathData);
    path.setAttribute('fill','#60a5fa');
    path.setAttribute('opacity','0.9');
    path.setAttribute('transform',`translate(${ix},${iy}) scale(${iconSize/24})`);
    iconGroup.appendChild(path);
    g.appendChild(iconGroup);
  }

  _renderDefaultMarker(g,cx,cy,cw,ch,id){
    const svgNs='http://www.w3.org/2000/svg';
    const circle=document.createElementNS(svgNs,'circle');
    circle.setAttribute('cx',cx+22);circle.setAttribute('cy',cy+ch/2);
    circle.setAttribute('r','16');circle.setAttribute('fill','#0959C8');
    circle.setAttribute('opacity','0.2');
    g.appendChild(circle);
    const letter=document.createElementNS(svgNs,'text');
    letter.setAttribute('x',cx+22);letter.setAttribute('y',cy+ch/2+5);
    letter.setAttribute('text-anchor','middle');letter.setAttribute('fill','#60a5fa');
    letter.setAttribute('font-size','14');letter.setAttribute('font-weight','700');
    letter.setAttribute('font-family',"'Inter',sans-serif");
    letter.setAttribute('pointer-events','none');
    letter.textContent=(id||'?')[0].toUpperCase();
    g.appendChild(letter);
  }

  _defaultIcon(id){
    const map={
      device:'laptop',router:'router',isp:'cloud',server:'server',
      dns:'server',packet:'packet',wifi:'wifi',modem:'modem',
      browser:'browser',website:'globe',client:'monitor',loadbalancer:'load-balancer',
      database:'database',cache:'database',source:'laptop',destination:'monitor',
      ipv4:'globe',ipv6:'globe',subnet:'filter',gateway:'router',
      dhcp:'server',network:'network',switch:'router',firewall:'shield',
      landing:'data-center',cable:'cable',repeater:'chip',buoy:'satellite',
      rack:'server',cooling:'fan',power:'power',cdn:'cdn',origin:'server',
      tcp:'cable',satellite:'satellite',cellular:'cell-tower',
      saas:'cloud',paas:'cloud',iaas:'cloud',public:'globe',private:'lock',
      hybrid:'network',encryption:'lock',vpn:'shield',antivirus:'shield',
      auth:'key',backup:'database',waf:'firewall',loadbalancer:'load-balancer',
      dns:'globe',tld:'server',root:'server',authoritative:'server',
      recursive:'server',modem:'modem',ap:'wifi'
    };
    return map[id]||null;
  }

  _updateFlowDots(){
    if(!this._flowDots||!this._flowDots.length)return;
    const base=this.t*0.3;
    this._flowDots.forEach((fd,j)=>{
      const cp=this._connPaths[fd.idx];
      if(!cp)return;
      let t=(base+j*0.15)%1;
      const u=1-t;
      const x=u*u*u*cp.x1+3*u*u*t*cp.mx+3*u*t*t*cp.mx+t*t*t*cp.x2;
      const y=u*u*u*cp.y1+3*u*u*t*cp.y1+3*u*t*t*cp.y2+t*t*t*cp.y2;
      if(fd.isPacket){
        fd.el.setAttribute('transform','translate('+x+','+y+')');
      }else{
        fd.el.setAttribute('cx',x);
        fd.el.setAttribute('cy',y);
      }
    });
  }

  _showPacketInfo(label,color,connIdx){
    const eng=this;
    if(!eng.el.packetBar){
      const bar=document.createElement('div');
      bar.id='packet-bar';
      bar.style.cssText='display:flex;align-items:center;gap:10px;padding:10px 14px;background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.06);border-radius:8px;margin-top:8px;animation:fadeIn .3s ease';
      const barInner=document.createElement('div');barInner.id='packet-bar-inner';barInner.style.cssText='flex:1';
      bar.appendChild(barInner);
      const closeBtn=document.createElement('button');
      closeBtn.innerHTML='&times;';
      closeBtn.style.cssText='background:none;border:none;color:#64748b;font-size:18px;cursor:pointer;padding:0 4px';
      closeBtn.addEventListener('click',function(){bar.remove();eng.el.packetBar=null});
      bar.appendChild(closeBtn);
      this.el.packetBar=bar;
      // Find where to insert (after diagram-visual)
      const visual=this.el.visual;
      if(visual&&visual.parentNode){
        visual.parentNode.insertBefore(bar,visual.nextSibling);
      }
    }
    const inner=document.getElementById('packet-bar-inner');
    if(inner){
      const conn=this.cfg.connections&&this.cfg.connections[connIdx];
      const fromComp=conn?this._findComp(conn.from):null;
      const toComp=conn?this._findComp(conn.to):null;
      inner.innerHTML='<div style="font-size:12px;font-weight:600;color:'+(color||'#22c55e')+'">'+(label||'Packet')+'</div><div style="font-size:11px;color:#94a3b8;margin-top:2px">Traveling from <strong style="color:#e2e8f0">'+(fromComp?fromComp.name:conn.from)+'</strong> to <strong style="color:#e2e8f0">'+(toComp?toComp.name:conn.to)+'</strong></div>';
      this._setStatus('Tracing: '+label+' packet');
    }
  }

  // ── Drag & Drop Matching Builder ──
  buildDragMatching(container,cfg){
    const self=this;
    const items=cfg.items||[];
    const slots=cfg.slots||[];
    if(!items.length){container.innerHTML='<div style="padding:40px;text-align:center;color:#94a3b8"><p>No items</p></div>';return}
    container.innerHTML='';
    container.style.cssText='display:flex;gap:16px;padding:16px;flex-wrap:wrap;min-height:300px';
    const matched={};
    const total=items.length;

    // Palette (left/top)
    const pal=document.createElement('div');
    pal.style.cssText='flex:1;min-width:200px;display:flex;flex-direction:column;gap:8px;padding:12px;background:rgba(255,255,255,0.02);border-radius:8px;border:1px solid rgba(255,255,255,0.06)';
    const palTitle=document.createElement('div');
    palTitle.textContent='Drag item to matching slot';
    palTitle.style.cssText='font-size:11px;font-weight:600;text-transform:uppercase;letter-spacing:.05em;color:#64748b;padding-bottom:6px;border-bottom:1px solid rgba(255,255,255,0.06)';
    pal.appendChild(palTitle);
    container.appendChild(pal);

    // Slots area (right/bottom)
    const slArea=document.createElement('div');
    slArea.style.cssText='flex:1;min-width:200px;display:flex;flex-direction:column;gap:8px;padding:12px;background:rgba(255,255,255,0.02);border-radius:8px;border:1px solid rgba(255,255,255,0.06)';
    const slTitle=document.createElement('div');
    slTitle.textContent='Drop zones';
    slTitle.style.cssText='font-size:11px;font-weight:600;text-transform:uppercase;letter-spacing:.05em;color:#64748b;padding-bottom:6px;border-bottom:1px solid rgba(255,255,255,0.06)';
    slArea.appendChild(slTitle);
    container.appendChild(slArea);

    function buildPalette(){
      while(pal.children.length>1)pal.removeChild(pal.lastChild);
      items.forEach(function(it){
        if(matched[it.id])return;
        const card=document.createElement('div');
        card.draggable=true;
        card.dataset.itemId=it.id;
        card.style.cssText='padding:10px 14px;background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.08);border-radius:6px;cursor:grab;transition:all .2s;user-select:none;font-size:13px;font-weight:500;color:#e2e8f0';
        card.textContent=it.label||it.id;
        card.addEventListener('dragstart',function(e){e.dataTransfer.setData('text/plain',it.id);this.style.opacity='0.4'});
        card.addEventListener('dragend',function(){this.style.opacity='1'});
        // Touch
        card.addEventListener('touchstart',function(e){
          this.dataset.touchId=it.id;
          const g=document.createElement('div');g.id='mg-ghost';g.textContent=it.label||it.id;
          g.style.cssText='position:fixed;pointer-events:none;z-index:9999;padding:8px 14px;background:rgba(9,89,200,0.9);color:#fff;border-radius:6px;font-size:12px;font-weight:600;box-shadow:0 4px 20px rgba(0,0,0,0.3)';
          document.body.appendChild(g);
        },{passive:true});
        card.addEventListener('touchmove',function(e){
          e.preventDefault();const t=e.touches[0];const g=document.getElementById('mg-ghost');
          if(g){g.style.left=(t.clientX-40)+'px';g.style.top=(t.clientY-20)+'px'}
        },{passive:false});
        card.addEventListener('touchend',function(e){
          const g=document.getElementById('mg-ghost');if(g)g.remove();
          const t=e.changedTouches[0];const el=document.elementFromPoint(t.clientX,t.clientY);
          if(el&&el.dataset.slotId)handleMatch(this.dataset.touchId,el.dataset.slotId);
          delete this.dataset.touchId;
        });
        pal.appendChild(card);
      });
      const prog=document.createElement('div');
      prog.style.cssText='font-size:10px;color:#64748b;padding:4px 0;text-align:center;margin-top:auto';
      prog.textContent=Object.keys(matched).length+'/'+total+' matched';
      pal.appendChild(prog);
    }

    function buildSlots(){
      while(slArea.children.length>1)slArea.removeChild(slArea.lastChild);
      slots.forEach(function(sl){
        const zone=document.createElement('div');
        zone.dataset.slotId=sl.id;
        zone.style.cssText='padding:10px 14px;border:2px dashed rgba(96,165,250,0.3);border-radius:6px;transition:all .3s;font-size:12px;color:#94a3b8;min-height:44px;display:flex;align-items:center;gap:8px';
        const lbl=document.createElement('span');
        lbl.textContent=sl.label+': ';
        lbl.style.cssText='color:#64748b;font-weight:500;flex-shrink:0';
        zone.appendChild(lbl);
        const val=document.createElement('span');
        val.id='slot-val-'+sl.id;
        val.textContent='—';
        val.style.cssText='color:#94a3b8;font-style:italic';
        zone.appendChild(val);
        zone.addEventListener('dragover',function(e){e.preventDefault();this.style.borderColor='rgba(96,165,250,0.8)';this.style.backgroundColor='rgba(9,89,200,0.08)'});
        zone.addEventListener('dragleave',function(){this.style.borderColor='rgba(96,165,250,0.3)';this.style.backgroundColor='transparent'});
        zone.addEventListener('drop',function(e){
          e.preventDefault();this.style.borderColor='rgba(96,165,250,0.3)';this.style.backgroundColor='transparent';
          const id=e.dataTransfer.getData('text/plain');
          handleMatch(id,sl.id);
        });
        slArea.appendChild(zone);
      });
    }

    function handleMatch(itemId,slotId){
      if(matched[itemId]){self._setStatus('Already matched');return}
      const item=items.find(function(x){return x.id===itemId});
      const slot=slots.find(function(x){return x.id===slotId});
      if(!item||!slot){self._setStatus('Invalid match');return}
      const zone=slArea.querySelector('[data-slot-id="'+slotId+'"]');
      if(item.slot===slotId){
        matched[itemId]=true;
        if(zone){
          zone.style.borderColor='rgba(34,197,94,0.6)';zone.style.background='rgba(34,197,94,0.1)';
          const val=document.getElementById('slot-val-'+slotId);
          if(val){val.textContent=item.label||itemId;val.style.color='#22c55e';val.style.fontStyle='normal'}
        }
        self._setStatus('Correct! '+slot.label);
        if(self.cfg.components){
          const comp=self.cfg.components.find(function(c){return c.id===itemId});
          if(comp)self.selectComponent(itemId);
        }
        buildPalette();
        if(Object.keys(matched).length===total){
          self._setStatus('All matched!');
          const done=document.createElement('div');
          done.textContent='\u2705 All items matched correctly!';
          done.style.cssText='text-align:center;padding:16px;color:#22c55e;font-size:16px;font-weight:600;animation:popIn .3s ease';
          slArea.appendChild(done);
        }
      }else{
        if(zone){zone.style.borderColor='rgba(239,68,68,0.8)';zone.style.background='rgba(239,68,68,0.1)';
          setTimeout(function(){zone.style.borderColor='rgba(96,165,250,0.3)';zone.style.background='transparent'},1200)}
        self._setStatus('Not quite. '+slot.label+' doesn\'t match '+(item.label||itemId));
      }
    }

    buildPalette();
    buildSlots();
    if(!document.getElementById('ib-keyframes')){
      const s=document.createElement('style');s.id='ib-keyframes';
      s.textContent='@keyframes popIn{0%{transform:scale(0.5);opacity:0}100%{transform:scale(1);opacity:1}}';
      document.head.appendChild(s);
    }
  }

  // ── Step Flow Builder ──
  buildStepFlow(container){
    const self=this;
    const steps=self.cfg.steps||[];

    container.innerHTML='';
    container.style.cssText='display:flex;flex-direction:column;gap:12px;padding:16px;min-height:300px';

    // Flow visualization
    const flowArea=document.createElement('div');
    flowArea.style.cssText='display:flex;gap:8px;align-items:flex-start;overflow-x:auto;padding:12px 8px;background:rgba(255,255,255,0.02);border-radius:8px;border:1px solid rgba(255,255,255,0.06);min-height:120px;flex-wrap:wrap';
    container.appendChild(flowArea);

    // Detail panel
    const detail=document.createElement('div');
    detail.id='stepflow-detail';
    detail.style.cssText='padding:14px 16px;background:rgba(255,255,255,0.02);border-radius:8px;border:1px solid rgba(255,255,255,0.06);min-height:80px;display:none';
    container.appendChild(detail);

    let currentStep=-1;

    function buildFlow(){
      flowArea.innerHTML='';
      steps.forEach(function(s,i){
        const node=document.createElement('div');
        node.dataset.sidx=i;
        node.style.cssText='display:flex;flex-direction:column;align-items:center;gap:6px;cursor:pointer;padding:8px 12px;border-radius:8px;border:1px solid rgba(255,255,255,0.06);background:rgba(255,255,255,0.02);transition:all .3s;min-width:90px;flex-shrink:0';
        node.innerHTML='<div style="width:28px;height:28px;border-radius:50%;background:rgba(9,89,200,0.2);color:#60a5fa;display:flex;align-items:center;justify-content:center;font-size:12px;font-weight:700">'+(i+1)+'</div><div style="font-size:11px;font-weight:500;color:#e2e8f0;text-align:center;line-height:1.2">'+self._esc(s.label)+'</div>';
        if(i<steps.length-1){
          const arrow=document.createElement('div');
          arrow.textContent='\u2192';
          arrow.style.cssText='font-size:18px;color:#475569;flex-shrink:0;margin-top:10px';
          flowArea.appendChild(node);
          flowArea.appendChild(arrow);
        }else{
          flowArea.appendChild(node);
        }
        node.addEventListener('click',function(){showStep(i)});
        // Auto-advance play
        if(self.cfg.animate){
          // Visual highlight when playing
        }
      });
    }

    function showStep(i){
      currentStep=i;
      const nodes=flowArea.querySelectorAll('[data-sidx]');
      nodes.forEach(function(n){
        var idx=parseInt(n.dataset.sidx);
        n.style.borderColor=idx===i?'rgba(9,89,200,0.6)':'rgba(255,255,255,0.06)';
        n.style.background=idx===i?'rgba(9,89,200,0.1)':'rgba(255,255,255,0.02)';
        n.style.boxShadow=idx===i?'0 0 20px rgba(9,89,200,0.2)':'none';
      });
      const s=steps[i];
      detail.style.display='block';
      detail.innerHTML='<div style="font-size:14px;font-weight:600;color:#60a5fa;margin-bottom:4px">'+self._esc(s.label)+'</div><div style="font-size:12px;color:#94a3b8;line-height:1.6">'+self._esc(s.description||'')+'</div>';
      if(self.cfg.components){
        const comp=self.cfg.components.find(function(c){return c.id===s.id});
        if(comp)self.selectComponent(s.id);
      }
      self._setStatus(s.status||'Step '+(i+1)+' of '+steps.length);
    }

    buildFlow();
    if(steps.length){showStep(0)}
  }

  // ── Click Explorer Builder ──
  buildClickExplorer(container){
    const self=this;
    const comps=this.cfg.components||[];
    if(!comps.length){container.innerHTML='<div style="padding:40px;text-align:center;color:#94a3b8"><p>No components</p></div>';return}
    container.innerHTML='';
    container.style.cssText='display:flex;flex-direction:column;gap:12px;padding:16px;min-height:300px';

    // Visual grid of clickable components
    const grid=document.createElement('div');
    grid.style.cssText='display:grid;grid-template-columns:repeat(auto-fill,minmax(140px,1fr));gap:12px;padding:8px';
    container.appendChild(grid);

    const detail=document.createElement('div');
    detail.id='ce-detail';
    detail.style.cssText='padding:14px 16px;background:rgba(255,255,255,0.02);border-radius:8px;border:1px solid rgba(255,255,255,0.06);min-height:60px;display:none';
    container.appendChild(detail);

    comps.forEach(function(c){
      const card=document.createElement('div');
      card.dataset.componentId=c.id;
      card.style.cssText='display:flex;flex-direction:column;align-items:center;gap:6px;padding:14px 10px;background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.06);border-radius:8px;cursor:pointer;transition:all .2s;text-align:center';
      const iconEl=document.createElement('div');
      iconEl.textContent=self._getIconChar(c.id);
      iconEl.style.cssText='font-size:24px;line-height:1';
      card.appendChild(iconEl);
      const nameEl=document.createElement('div');
      nameEl.textContent=c.name||c.id;
      nameEl.style.cssText='font-size:11px;font-weight:600;color:#e2e8f0;line-height:1.2';
      card.appendChild(nameEl);
      const catEl=document.createElement('div');
      catEl.textContent=c.category||'';
      catEl.style.cssText='font-size:9px;color:#64748b';
      card.appendChild(catEl);
      card.addEventListener('click',function(){
        grid.querySelectorAll('[data-component-id]').forEach(function(el){el.style.borderColor='rgba(255,255,255,0.06)';el.style.background='rgba(255,255,255,0.03)'});
        card.style.borderColor='rgba(9,89,200,0.6)';card.style.background='rgba(9,89,200,0.1)';
        self.selectComponent(c.id);
        detail.style.display='block';
        detail.innerHTML='<div style="font-size:14px;font-weight:600;color:#60a5fa;margin-bottom:4px">'+self._esc(c.name||c.id)+'</div><div style="font-size:12px;color:#cbd5e1;line-height:1.6">'+self._esc(c.purpose||'')+'</div><div style="font-size:11px;color:#94a3b8;margin-top:6px;line-height:1.5">'+self._esc(c.description||'')+'</div>';
      });
      grid.appendChild(card);
    });
  }

  _getIconChar(id){
    const map={socket:'\u26A1',chipset:'\u2699',slots:'\u25A1',headers:'\u2194',ports:'\u2197',vrms:'\u26A1',cpu:'\u2699',dimm:'\u2B1B',slot:'\u25A1',channel:'\u2194',latch:'\u2714',dualrank:'\u25A3',capacity:'\u23F3',ssd:'\u26A1',hdd:'\u23F0',bracket:'\u2699',cable:'\u2194',m2:'\u2B1B',tray:'\u25A1',psu:'\u26A1',connector:'\u26A1',rail:'\u2194',modular:'\u21C4',rating:'\u2605',case:'\u25A3',fan:'\u2744',radiator:'\u27A1',airflow:'\u27A1',filter:'\u25A0',thermal:'\u2668',gpu:'\u2699',pcie:'\u2B1A',power:'\u26A1',bracket:'\u2699',riser:'\u2195',bios:'\u2699',uefi:'\u2699',cmos:'\u23F1',settings:'\u2699',boot:'\u27A1',firmware:'\u2699',media:'\uD83D\uDCBF',partition:'\u25A3',format:'\u267B',install:'\u2B07',driver:'\u2699',activation:'\u2714',utility:'\u2699',codec:'\u266A',runtime:'\u2699',update:'\u21BB',config:'\u2699',postcode:'\u2316',beep:'\u266A',multimeter:'\u2699',reseat:'\u21BA'};
    return map[id]||'\u25A0';
  }

  _setStatus(msg){}
  _esc(s){if(!s)return'';const d=document.createElement('div');d.textContent=s;return d.innerHTML}
}

window.DiagramEngine=DiagramEngine;
window.deferInit=function(fn){
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',fn);else fn();
};

})();
