const cableData = [
  {
    id: 'transatlantic',
    name: 'Transatlantic',
    route: 'New York \u2192 London',
    length: '5,500 km',
    lengthNum: 5500,
    capacity: '200 Tbps',
    capacityNum: 200,
    year: 2016,
    color: '#00d4ff',
    description: 'One of the busiest submarine cable routes connecting North America to Europe, carrying vast amounts of transatlantic data traffic daily.'
  },
  {
    id: 'panamerican',
    name: 'Pan-American',
    route: 'Miami \u2192 S\u00e3o Paulo',
    length: '8,000 km',
    lengthNum: 8000,
    capacity: '120 Tbps',
    capacityNum: 120,
    year: 2018,
    color: '#ff6b35',
    description: 'Connects North and South America, linking major business hubs across the Americas with high-speed fiber optic connectivity.'
  },
  {
    id: 'africacoast',
    name: 'Africa Coast',
    route: 'Lisbon \u2192 Cape Town',
    length: '10,500 km',
    lengthNum: 10500,
    capacity: '80 Tbps',
    capacityNum: 80,
    year: 2020,
    color: '#7bed9f',
    description: 'Runs along the western coast of Africa, providing critical broadband connectivity to the African continent and surrounding regions.'
  },
  {
    id: 'eurasia',
    name: 'Eurasia Express',
    route: 'Marseille \u2192 Singapore',
    length: '15,000 km',
    lengthNum: 15000,
    capacity: '250 Tbps',
    capacityNum: 250,
    year: 2019,
    color: '#ffd93d',
    description: 'The longest cable in our network, connecting Europe to Southeast Asia through the Mediterranean and Indian Ocean corridors.'
  },
  {
    id: 'asiaaustralia',
    name: 'Asia-Australia',
    route: 'Jakarta \u2192 Sydney',
    length: '4,200 km',
    lengthNum: 4200,
    capacity: '90 Tbps',
    capacityNum: 90,
    year: 2021,
    color: '#ff6b9d',
    description: 'Direct high-capacity link between Southeast Asia and Australia, supporting the rapidly growing digital economies of the region.'
  },
  {
    id: 'transpacific',
    name: 'Trans-Pacific',
    route: 'Tokyo \u2192 San Francisco',
    length: '12,000 km',
    lengthNum: 12000,
    capacity: '180 Tbps',
    capacityNum: 180,
    year: 2017,
    color: '#a855f7',
    description: 'Spans the Pacific Ocean to connect Asia with North America, forming a vital backbone link for global internet traffic.'
  }
];

const totalLength = cableData.reduce(function (sum, c) { return sum + c.lengthNum; }, 0);
const totalCapacity = cableData.reduce(function (sum, c) { return sum + c.capacityNum; }, 0);

var svg = document.querySelector('.map-svg');
var dotsGroup = svg.querySelector('.dots');
var infoPanel = document.getElementById('infoPanel');
var infoClose = document.getElementById('infoClose');
var cableGlows = svg.querySelectorAll('.cable-glow');
var cableLabels = svg.querySelectorAll('.cable-label');
var legendItems = document.getElementById('legendItems');
var playBtn = document.getElementById('playBtn');
var resetBtn = document.getElementById('resetBtn');

var isPlaying = true;
var animationId = null;
var dotProgress = [];

function initDots() {
  dotsGroup.innerHTML = '';
  dotProgress = [];

  cableData.forEach(function (cable, index) {
    var path = document.querySelector('.cable-path[data-cable="' + cable.id + '"]');
    if (!path) return;

    var numDots = 3;
    for (var i = 0; i < numDots; i++) {
      var dot = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
      dot.classList.add('dot');
      dot.style.fill = cable.color;
      dot.setAttribute('data-cable', cable.id);
      dotsGroup.appendChild(dot);

      dotProgress.push({
        cableIndex: index,
        element: dot,
        offset: i / numDots,
        speed: 0.002 + (index * 0.0005)
      });
    }
  });
}

function updateDots() {
  var time = Date.now() / 1000;
  dotProgress.forEach(function (dp, i) {
    var cable = cableData[dp.cableIndex];
    var path = document.querySelector('.cable-path[data-cable="' + cable.id + '"]');
    if (!path) return;

    if (isPlaying) {
      dp.offset += dp.speed;
      if (dp.offset > 1) dp.offset -= 1;
    }

    try {
      var len = path.getTotalLength();
      if (len === 0) return;
      var point = path.getPointAtLength(dp.offset * len);
      dp.element.setAttribute('cx', point.x);
      dp.element.setAttribute('cy', point.y);
    } catch (e) {
      return;
    }

    var pulse = 0.55 + 0.45 * Math.sin(time * 2.5 + i * 1.2);
    dp.element.setAttribute('opacity', pulse);
  });
}

function animate() {
  updateDots();
  animationId = requestAnimationFrame(animate);
}

function buildLegend() {
  legendItems.innerHTML = '';
  cableData.forEach(function (cable) {
    var item = document.createElement('div');
    item.className = 'legend-item';
    item.setAttribute('data-cable', cable.id);
    item.setAttribute('tabindex', '0');
    item.setAttribute('role', 'button');
    item.setAttribute('aria-label', 'Show ' + cable.name + ' cable information');

    var line = document.createElement('span');
    line.className = 'legend-line';
    line.style.background = cable.color;

    var name = document.createElement('span');
    name.textContent = cable.name + ' (' + cable.length + ')';

    item.appendChild(line);
    item.appendChild(name);

    item.addEventListener('click', function () { showCableInfo(cable.id); });
    item.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        showCableInfo(cable.id);
      }
    });

    legendItems.appendChild(item);
  });
}

function showCableInfo(cableId) {
  var cable = cableData.find(function (c) { return c.id === cableId; });
  if (!cable) return;

  document.getElementById('infoName').textContent = cable.name;
  document.getElementById('infoName').style.color = cable.color;
  document.getElementById('infoRoute').textContent = cable.route;
  document.getElementById('infoLength').textContent = cable.length;
  document.getElementById('infoCapacity').textContent = cable.capacity;
  document.getElementById('infoYear').textContent = cable.year;
  document.getElementById('infoDesc').textContent = cable.description;

  infoPanel.classList.add('visible');
  infoPanel.setAttribute('aria-hidden', 'false');
  setTimeout(function () { infoClose.focus(); }, 100);

  svg.querySelectorAll('.cable-glow.active').forEach(function (el) { el.classList.remove('active'); });
  svg.querySelectorAll('.cable-label.active').forEach(function (el) { el.classList.remove('active'); });
  legendItems.querySelectorAll('.legend-item.active').forEach(function (el) { el.classList.remove('active'); });

  var activeGlow = svg.querySelector('.cable-glow[data-cable="' + cableId + '"]');
  if (activeGlow) activeGlow.classList.add('active');

  var activeLabel = svg.querySelector('.cable-label[data-cable="' + cableId + '"]');
  if (activeLabel) activeLabel.classList.add('active');

  var activeLegend = legendItems.querySelector('.legend-item[data-cable="' + cableId + '"]');
  if (activeLegend) activeLegend.classList.add('active');
}

function hideInfo() {
  infoPanel.classList.remove('visible');
  infoPanel.setAttribute('aria-hidden', 'true');

  svg.querySelectorAll('.cable-glow.active').forEach(function (el) { el.classList.remove('active'); });
  svg.querySelectorAll('.cable-label.active').forEach(function (el) { el.classList.remove('active'); });
  legendItems.querySelectorAll('.legend-item.active').forEach(function (el) { el.classList.remove('active'); });
}

function animateStats() {
  var statCables = document.getElementById('statCables');
  var statLength = document.getElementById('statLength');
  var statCapacity = document.getElementById('statCapacity');

  var targetCables = cableData.length;
  var targetLength = totalLength;
  var targetCapacity = totalCapacity;

  var duration = 1500;
  var startTime = performance.now();

  function update() {
    var elapsed = performance.now() - startTime;
    var progress = Math.min(elapsed / duration, 1);
    var eased = 1 - Math.pow(1 - progress, 3);

    var curCables = Math.round(eased * targetCables);
    var curLength = Math.round(eased * targetLength);
    var curCapacity = Math.round(eased * targetCapacity);

    statCables.textContent = String(curCables).padStart(2, '0');
    statLength.textContent = curLength.toLocaleString();
    statCapacity.textContent = curCapacity;

    if (progress < 1) {
      requestAnimationFrame(update);
    } else {
      statCables.textContent = String(targetCables).padStart(2, '0');
      statLength.textContent = targetLength.toLocaleString();
      statCapacity.textContent = targetCapacity;
    }
  }

  update();
}

cableGlows.forEach(function (glow) {
  glow.addEventListener('click', function (e) {
    showCableInfo(glow.getAttribute('data-cable'));
  });
  glow.addEventListener('keydown', function (e) {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      showCableInfo(glow.getAttribute('data-cable'));
    }
  });
  glow.setAttribute('tabindex', '0');
  glow.setAttribute('role', 'button');
  glow.setAttribute('aria-label', 'Click to view cable details');
});

infoClose.addEventListener('click', hideInfo);
infoClose.addEventListener('keydown', function (e) {
  if (e.key === 'Enter' || e.key === ' ') {
    e.preventDefault();
    hideInfo();
  }
});

document.addEventListener('click', function (e) {
  if (infoPanel.classList.contains('visible') &&
      !infoPanel.contains(e.target) &&
      !e.target.closest('.cable-glow') &&
      !e.target.closest('.legend-item')) {
    hideInfo();
  }
});

document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape') hideInfo();
});

playBtn.addEventListener('click', function () {
  isPlaying = !isPlaying;
  if (isPlaying) {
    playBtn.innerHTML = '<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M6 4h4v16H6zM14 4h4v16h-4z"/></svg><span>Pause</span>';
    playBtn.classList.remove('playing');
    playBtn.setAttribute('aria-label', 'Pause animation');
  } else {
    playBtn.innerHTML = '<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg><span>Play</span>';
    playBtn.classList.add('playing');
    playBtn.setAttribute('aria-label', 'Play animation');
  }
});

resetBtn.addEventListener('click', function () {
  dotProgress.forEach(function (dp) {
    dp.offset = dp.offset > 0.5 ? 1 : 0;
  });
  hideInfo();
});

function init() {
  buildLegend();
  initDots();
  animate();
  animateStats();
}

init();
