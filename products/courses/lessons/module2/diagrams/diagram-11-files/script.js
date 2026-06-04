(function () {
  const playBtn = document.getElementById('playBtn');
  const pauseBtn = document.getElementById('pauseBtn');
  const resetBtn = document.getElementById('resetBtn');
  const statusBadge = document.getElementById('statusBadge');
  const treeRoot = document.getElementById('treeRoot');
  const contentBody = document.getElementById('contentBody');
  const toast = document.getElementById('toast');
  const contentPanel = document.getElementById('contentPanel');

  let isPlaying = false;
  let isPaused = false;
  let animationTimer = null;
  let dragSrc = null;

  const fileDB = {
    '/C:/Users/Student/readme.txt':     { type: 'document', size: '1.2 KB', date: '2026-05-20 14:32', icon: 'document' },
    '/C:/Users/Student/photo.jpg':      { type: 'image',    size: '3.4 MB', date: '2026-05-18 09:15', icon: 'image' },
    '/C:/Program Files/app.exe':        { type: 'application', size: '24.6 MB', date: '2026-04-10 11:00', icon: 'document' },
    '/C:/Documents/report.docx':        { type: 'document', size: '156 KB', date: '2026-05-22 16:45', icon: 'document' },
    '/C:/Documents/budget.xlsx':        { type: 'spreadsheet', size: '89 KB', date: '2026-05-19 08:30', icon: 'document' },
    '/C:/Documents/vacation.mp4':       { type: 'video',    size: '128 MB', date: '2026-05-15 20:10', icon: 'video' },
    '/C:/Documents/song.mp3':           { type: 'music',    size: '5.6 MB', date: '2026-05-10 18:55', icon: 'music' },
  };

  const iconMap = { image: 'image', video: 'video', music: 'music' };

  function showToast(msg, dur) {
    toast.textContent = msg;
    toast.hidden = false;
    toast.style.animation = 'none';
    void toast.offsetHeight;
    toast.style.animation = 'fadeSlideUp 0.3s ease';
    clearTimeout(toast._hide);
    toast._hide = setTimeout(() => { toast.hidden = true; }, dur || 2000);
  }

  function safeToggle(el) {
    if (!el) return;
    const parent = el.closest('.tree-node');
    if (!parent) return;
    const children = parent.querySelector('.children');
    const toggleIcon = el.querySelector('.toggle-icon');
    if (!children) return;
    const isOpen = children.classList.contains('open');
    if (isOpen) {
      children.classList.remove('open');
      el.classList.remove('expanded');
      el.setAttribute('aria-expanded', 'false');
      if (toggleIcon) toggleIcon.textContent = '▶';
    } else {
      children.classList.add('open');
      el.classList.add('expanded');
      el.setAttribute('aria-expanded', 'true');
      if (toggleIcon) toggleIcon.textContent = '▼';
    }
  }

  treeRoot.addEventListener('click', function (e) {
    const label = e.target.closest('.node-label');
    if (!label || label.closest('.file-item')) {
      const fileLabel = e.target.closest('.file-item')?.querySelector('.node-label');
      if (fileLabel) showFileDetails(fileLabel.closest('.tree-node'));
      return;
    }
    safeToggle(label);
  });

  treeRoot.addEventListener('keydown', function (e) {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      const label = e.target.closest('.node-label');
      if (!label) return;
      if (label.closest('.file-item')) {
        showFileDetails(label.closest('.tree-node'));
      } else {
        safeToggle(label);
      }
    }
  });

  function showFileDetails(node) {
    if (!node) return;
    const path = node.dataset.path;
    const nameEl = node.querySelector('.node-name');
    if (!nameEl || !path) return;
    const name = nameEl.textContent;
    const info = fileDB[path] || { type: 'unknown', size: '-', date: '-', icon: 'document' };
    const fileIcon = node.querySelector('.file-icon')?.outerHTML || '';
    const iconClass = iconMap[info.icon] || '';
    contentBody.innerHTML = `
      <div class="file-detail-card" role="region" aria-label="File details for ${name}">
        <div class="detail-icon">${fileIcon}</div>
        <div class="detail-name">${name}</div>
        <div class="detail-row"><span class="detail-label">Path</span><span class="detail-value">${path}</span></div>
        <div class="detail-row"><span class="detail-label">Type</span><span class="detail-value">${info.type}</span></div>
        <div class="detail-row"><span class="detail-label">Size</span><span class="detail-value">${info.size}</span></div>
        <div class="detail-row"><span class="detail-label">Modified</span><span class="detail-value">${info.date}</span></div>
      </div>
    `;
  }

  function setStatus(text, active) {
    statusBadge.textContent = text;
    statusBadge.classList.toggle('active', !!active);
  }

  function getFolderNode(path) {
    return treeRoot.querySelector(`.tree-node[data-path="${path}"]`);
  }

  function ensureFolderOpen(path) {
    const parts = path.split('/').filter(Boolean);
    let acc = '';
    for (const p of parts) {
      acc += '/' + p;
      const node = getFolderNode(acc);
      if (node) {
        const label = node.querySelector('.node-label');
        const children = node.querySelector('.children');
        if (children && !children.classList.contains('open') && label) {
          children.classList.add('open');
          label.classList.add('expanded');
          label.setAttribute('aria-expanded', 'true');
          const ti = label.querySelector('.toggle-icon');
          if (ti) ti.textContent = '▼';
        }
      }
    }
  }

  function addFileToFolder(path, fileName, info) {
    const folderNode = getFolderNode(path);
    if (!folderNode) return null;
    const children = folderNode.querySelector('.children');
    if (!children) return null;
    const fullPath = path + '/' + fileName;
    const fileLi = document.createElement('li');
    fileLi.className = 'tree-node file-item';
    fileLi.setAttribute('role', 'treeitem');
    fileLi.dataset.path = fullPath;
    const iconSvg = info.icon === 'image'
      ? '<svg class="file-icon image" width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z"/></svg>'
      : info.icon === 'video'
      ? '<svg class="file-icon video" width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M17 10.5V7c0-.55-.45-1-1-1H4c-.55 0-1 .45-1 1v10c0 .55.45 1 1 1h12c.55 0 1-.45 1-1v-3.5l4 4v-11l-4 4z"/></svg>'
      : info.icon === 'music'
      ? '<svg class="file-icon music" width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z"/></svg>'
      : '<svg class="file-icon" width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V8l-6-6zm-1 7V3.5L18.5 9H13z"/></svg>';
    fileLi.innerHTML = `
      <div class="node-label file" tabindex="0">
        ${iconSvg}
        <span class="node-name">${fileName}</span>
      </div>
    `;
    children.appendChild(fileLi);
    fileDB[fullPath] = { type: info.type, size: info.size, date: info.date, icon: info.icon };
    const label = folderNode.querySelector('.node-label');
    const childContainer = children;
    if (!childContainer.classList.contains('open') && label) {
      childContainer.classList.add('open');
      label.classList.add('expanded');
      label.setAttribute('aria-expanded', 'true');
      const ti = label.querySelector('.toggle-icon');
      if (ti) ti.textContent = '▼';
    }
    return fileLi;
  }

  function removeFile(path) {
    const node = treeRoot.querySelector(`.tree-node[data-path="${path}"]`);
    if (node) node.remove();
    delete fileDB[path];
  }

  const saveAnimationFiles = [
    { file: 'essay_final.docx', folder: '/C:/Documents', info: { type: 'document', size: '245 KB', date: '2026-06-03 22:30', icon: 'document' } },
  ];

  let saveAnimIdx = 0;

  function runPlay() {
    if (isPlaying && !isPaused) return;
    isPlaying = true;
    isPaused = false;
    playBtn.disabled = true;
    pauseBtn.disabled = false;
    resetBtn.disabled = false;
    setStatus('Saving file...', true);

    const item = saveAnimationFiles[0];
    ensureFolderOpen(item.folder);

    const folderNode = getFolderNode(item.folder);
    if (!folderNode) { stopPlay(); return; }
    const folderRect = folderNode.querySelector('.node-label')?.getBoundingClientRect();
    const startX = window.innerWidth / 2 - 20;
    const startY = 60;

    const fl = document.createElement('div');
    fl.className = 'floating-file';
    fl.textContent = '📄';
    fl.style.left = startX + 'px';
    fl.style.top = startY + 'px';
    fl.style.opacity = '1';
    document.body.appendChild(fl);

    const targetX = folderRect ? folderRect.left + folderRect.width / 2 - 20 : startX;
    const targetY = folderRect ? folderRect.top + folderRect.height / 2 - 24 : startY + 200;
    const duration = 1500;
    const startTime = performance.now();

    function animateSave(now) {
      const elapsed = now - startTime;
      const t = Math.min(elapsed / duration, 1);
      const ease = 1 - Math.pow(1 - t, 3);
      const x = startX + (targetX - startX) * ease;
      const y = startY + (targetY - startY) * ease;
      fl.style.left = x + 'px';
      fl.style.top = y + 'px';
      fl.style.opacity = 1 - ease * 0.5;
      if (t < 1) {
        animationTimer = requestAnimationFrame(animateSave);
      } else {
        fl.remove();
        addFileToFolder(item.folder, item.file, item.info);
        showToast(`File saved: ${item.folder}/${item.file}`, 2500);

        const pathDisplay = document.createElement('div');
        pathDisplay.className = 'save-path-display';
        pathDisplay.setAttribute('role', 'status');
        pathDisplay.innerHTML = `📁 Saved to: <span class="path-highlight">${item.folder}/${item.file}</span>`;
        contentBody.innerHTML = '';
        contentBody.appendChild(pathDisplay);

        setTimeout(() => {
          if (isPlaying && !isPaused) stopPlay();
        }, 1500);
      }
    }
    animationTimer = requestAnimationFrame(animateSave);
  }

  function stopPlay() {
    isPlaying = false;
    isPaused = false;
    playBtn.disabled = false;
    pauseBtn.disabled = true;
    resetBtn.disabled = false;
    setStatus('Idle', false);
    if (animationTimer) { cancelAnimationFrame(animationTimer); animationTimer = null; }
    const fl = document.querySelector('.floating-file');
    if (fl) fl.remove();
  }

  function resetAll() {
    stopPlay();
    const floating = document.querySelector('.floating-file');
    if (floating) floating.remove();
    const added = document.querySelectorAll('.tree-node.file-item.added-by-play');
    added.forEach(n => n.remove());
    const initialState = treeRoot.innerHTML;
    treeRoot.innerHTML = initialState;
    contentBody.innerHTML = '<div class="empty-state">Select a file to view details</div>';
    pauseBtn.disabled = true;
    resetBtn.disabled = true;
    setStatus('Idle', false);
    const allFolders = treeRoot.querySelectorAll('.tree-node[aria-expanded="true"]');
    allFolders.forEach(f => {
      const c = f.querySelector('.children');
      const l = f.querySelector('.node-label');
      const ti = l?.querySelector('.toggle-icon');
      if (l && c) {
        c.classList.remove('open');
        l.classList.remove('expanded');
        l.setAttribute('aria-expanded', 'false');
        if (ti) ti.textContent = '▶';
      }
    });
    const rootNode = treeRoot.querySelector('.tree-node[data-path="/"]');
    if (rootNode) {
      const rc = rootNode.querySelector('.children');
      const rl = rootNode.querySelector('.node-label');
      if (rl && rc) {
        rc.classList.add('open');
        rl.classList.add('expanded');
        rl.setAttribute('aria-expanded', 'true');
        const rti = rl.querySelector('.toggle-icon');
        if (rti) rti.textContent = '▼';
      }
    }
    const cNode = treeRoot.querySelector('.tree-node[data-path="/C:"]');
    if (cNode) {
      const cc = cNode.querySelector('.children');
      const cl = cNode.querySelector('.node-label');
      if (cl && cc) {
        cc.classList.add('open');
        cl.classList.add('expanded');
        cl.setAttribute('aria-expanded', 'true');
        const cti = cl.querySelector('.toggle-icon');
        if (cti) cti.textContent = '▼';
      }
    }
  }

  playBtn.addEventListener('click', runPlay);
  pauseBtn.addEventListener('click', function () {
    if (!isPlaying) return;
    isPaused = !isPaused;
    pauseBtn.innerHTML = isPaused
      ? '<svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg><span>Resume</span>'
      : '<svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg><span>Pause</span>';
    if (!isPaused) runPlay();
    else setStatus('Paused', true);
  });
  resetBtn.addEventListener('click', resetAll);
  resetBtn.disabled = true;

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') { resetAll(); }
  });

  let draggedEl = null;
  document.addEventListener('dragstart', function (e) {
    const label = e.target.closest('.node-label.file');
    if (!label) { e.preventDefault(); return; }
    draggedEl = label.closest('.tree-node');
    if (!draggedEl) { e.preventDefault(); return; }
    e.dataTransfer.effectAllowed = 'move';
    label.classList.add('dragging');
    dragSrc = draggedEl.dataset.path;
  });

  document.addEventListener('dragend', function (e) {
    document.querySelectorAll('.dragover').forEach(el => el.classList.remove('dragover'));
    document.querySelectorAll('.dragging').forEach(el => el.classList.remove('dragging'));
    dragSrc = null;
    draggedEl = null;
  });

  document.addEventListener('dragover', function (e) {
    const label = e.target.closest('.node-label.folder');
    if (!label || !draggedEl) return;
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    document.querySelectorAll('.dragover').forEach(el => el.classList.remove('dragover'));
    label.classList.add('dragover');
  });

  document.addEventListener('drop', function (e) {
    e.preventDefault();
    document.querySelectorAll('.dragover').forEach(el => el.classList.remove('dragover'));
    const targetLabel = e.target.closest('.node-label.folder');
    if (!targetLabel || !draggedEl) return;
    const targetNode = targetLabel.closest('.tree-node');
    if (!targetNode) return;
    const targetPath = targetNode.dataset.path;
    const srcPath = draggedEl.dataset.path;
    if (!srcPath || !targetPath || srcPath === targetPath) return;
    const fileName = draggedEl.querySelector('.node-name')?.textContent;
    const info = fileDB[srcPath];
    if (!fileName || !info) return;
    removeFile(srcPath);
    addFileToFolder(targetPath, fileName, info);
    showToast(`Moved "${fileName}" to ${targetPath}`, 2000);
    draggedEl = null;
    dragSrc = null;
  });
})();
