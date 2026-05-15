/* Interactive Heatmap JavaScript */

document.addEventListener('DOMContentLoaded', function() {
  initHeatmap();
});

/**
 * Heatmap Configuration
 */
const heatmapConfig = {
  enableClickTracking: true,
  enableScrollTracking: true,
  enableEyeTracking: false,
  colors: {
    hot: 'rgba(239, 68, 68, 0.6)',
    warm: 'rgba(245, 158, 11, 0.6)',
    cool: 'rgba(59, 130, 246, 0.6)'
  },
  autoShow: false
};

/**
 * Heatmap State
 */
let heatmapState = {
  clicks: [],
  scrollDepth: 0,
  scrollPoints: [],
  elementEngagement: {},
  timeOnPage: 0,
  startTime: Date.now()
};

/**
 * Initialize heatmap
 */
function initHeatmap() {
  // Check if heatmap should auto-show
  if (heatmapConfig.autoShow) {
    showHeatmapUI();
  }
  
  // Track clicks
  if (heatmapConfig.enableClickTracking) {
    initClickTracking();
  }
  
  // Track scroll
  if (heatmapConfig.enableScrollTracking) {
    initScrollTracking();
  }
  
  // Track time on page
  initTimeTracking();
  
  // Add keyboard shortcut (Ctrl+H)
  document.addEventListener('keydown', (e) => {
    if (e.ctrlKey && e.key === 'h') {
      e.preventDefault();
      toggleHeatmap();
    }
  });
}

/**
 * Show heatmap UI
 */
function showHeatmapUI() {
  // Create controls panel
  const controls = document.createElement('div');
  controls.className = 'heatmap__controls';
  controls.innerHTML = `
    <div class="heatmap__title">📊 Heatmap</div>
    <div class="heatmap__option" onclick="toggleClickHeatmap()">
      <span class="heatmap__option-label">
        <span class="heatmap__color-box" style="background: #EF4444;"></span>
        Klicks
      </span>
      <div class="heatmap__toggle ${heatmapState.showClicks ? 'active' : ''}" id="clicks-toggle"></div>
    </div>
    <div class="heatmap__option" onclick="toggleScrollHeatmap()">
      <span class="heatmap__option-label">
        <span class="heatmap__color-box" style="background: #3B82F6;"></span>
        Scroll-Tiefe
      </span>
      <div class="heatmap__toggle ${heatmapState.showScroll ? 'active' : ''}" id="scroll-toggle"></div>
    </div>
    <div class="heatmap__option" onclick="toggleEyeTracking()">
      <span class="heatmap__option-label">
        <span class="heatmap__color-box" style="background: #8B5CF6;"></span>
        Eye Tracking
      </span>
      <div class="heatmap__toggle" id="eye-toggle"></div>
    </div>
  `;
  
  document.body.appendChild(controls);
  
  // Create scroll depth indicator
  const scrollDepth = document.createElement('div');
  scrollDepth.className = 'scroll-depth';
  scrollDepth.innerHTML = `
    <div class="scroll-depth__bar">
      <div class="scroll-depth__progress" id="scroll-progress"></div>
    </div>
  `;
  
  document.body.appendChild(scrollDepth);
  
  // Create data panel
  const dataPanel = document.createElement('div');
  dataPanel.className = 'heatmap__data-panel';
  dataPanel.innerHTML = `
    <div class="heatmap__title">📈 Engagement</div>
    <div class="heatmap__data-row">
      <span class="heatmap__data-label">Scroll-Tiefe</span>
      <span class="heatmap__data-value" id="data-scroll">0%</span>
    </div>
    <div class="heatmap__data-row">
      <span class="heatmap__data-label">Klicks</span>
      <span class="heatmap__data-value" id="data-clicks">0</span>
    </div>
    <div class="heatmap__data-row">
      <span class="heatmap__data-label">Zeit auf Seite</span>
      <span class="heatmap__data-value" id="data-time">0s</span>
    </div>
    <div class="heatmap__data-row">
      <span class="heatmap__data-label">Beste Zone</span>
      <span class="heatmap__data-value" id="data-zone">—</span>
    </div>
  `;
  
  document.body.appendChild(dataPanel);
  
  // Create canvas for click visualization
  const canvas = document.createElement('canvas');
  canvas.id = 'heatmap-canvas';
  canvas.className = 'heatmap-canvas';
  
  const overlay = document.createElement('div');
  overlay.className = 'heatmap-overlay';
  overlay.appendChild(canvas);
  
  document.body.appendChild(overlay);
}

/**
 * Toggle heatmap
 */
function toggleHeatmap() {
  const controls = document.querySelector('.heatmap__controls');
  if (controls) {
    controls.remove();
    document.querySelector('.scroll-depth')?.remove();
    document.querySelector('.heatmap__data-panel')?.remove();
    document.querySelector('.heatmap-overlay')?.remove();
  } else {
    showHeatmapUI();
  }
}

/**
 * Initialize click tracking
 */
function initClickTracking() {
  document.addEventListener('click', (e) => {
    const x = e.clientX;
    const y = e.clientY;
    const target = e.target.tagName;
    const id = e.target.id || '';
    const className = e.target.className || '';
    
    heatmapState.clicks.push({ x, y, target, id, className, time: Date.now() });
    
    // Track element engagement
    const elementKey = `${target}${id ? '#' + id : ''}${className ? '.' + className.split(' ')[0] : ''}`;
    heatmapState.elementEngagement[elementKey] = (heatmapState.elementEngagement[elementKey] || 0) + 1;
    
    // Draw click
    drawClick(x, y);
    
    // Update data panel
    updateDataPanel();
    
    // Save to localStorage for analytics
    saveHeatmapData();
  });
}

/**
 * Initialize scroll tracking
 */
function initScrollTracking() {
  let lastScrollY = 0;
  
  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;
    const windowHeight = window.innerHeight;
    const docHeight = document.documentElement.scrollHeight;
    
    // Calculate scroll percentage
    const scrollPercent = Math.round((scrollY / (docHeight - windowHeight)) * 100);
    heatmapState.scrollDepth = scrollPercent;
    
    // Track scroll points
    heatmapState.scrollPoints.push({
      y: scrollY,
      percent: scrollPercent,
      time: Date.now()
    });
    
    // Update UI
    const progressEl = document.getElementById('scroll-progress');
    if (progressEl) {
      progressEl.style.height = scrollPercent + '%';
    }
    
    const dataScrollEl = document.getElementById('data-scroll');
    if (dataScrollEl) {
      dataScrollEl.textContent = scrollPercent + '%';
    }
    
    lastScrollY = scrollY;
  });
}

/**
 * Initialize time tracking
 */
function initTimeTracking() {
  setInterval(() => {
    heatmapState.timeOnPage = Math.round((Date.now() - heatmapState.startTime) / 1000);
    
    const dataTimeEl = document.getElementById('data-time');
    if (dataTimeEl) {
      if (heatmapState.timeOnPage < 60) {
        dataTimeEl.textContent = heatmapState.timeOnPage + 's';
      } else {
        const mins = Math.floor(heatmapState.timeOnPage / 60);
        const secs = heatmapState.timeOnPage % 60;
        dataTimeEl.textContent = mins + 'm ' + secs + 's';
      }
    }
  }, 1000);
}

/**
 * Draw click on canvas
 */
function drawClick(x, y) {
  const canvas = document.getElementById('heatmap-canvas');
  if (!canvas) return;
  
  const ctx = canvas.getContext('2d');
  const radius = 40;
  
  // Create gradient
  const gradient = ctx.createRadialGradient(x, y, 0, x, y, radius);
  gradient.addColorStop(0, 'rgba(239, 68, 68, 0.8)');
  gradient.addColorStop(1, 'rgba(239, 68, 68, 0)');
  
  ctx.fillStyle = gradient;
  ctx.beginPath();
  ctx.arc(x, y, radius, 0, Math.PI * 2);
  ctx.fill();
}

/**
 * Toggle click heatmap
 */
function toggleClickHeatmap() {
  heatmapState.showClicks = !heatmapState.showClicks;
  const toggle = document.getElementById('clicks-toggle');
  if (toggle) {
    toggle.classList.toggle('active', heatmapState.showClicks);
  }
  
  // Redraw canvas
  const canvas = document.getElementById('heatmap-canvas');
  if (canvas) {
    canvas.style.display = heatmapState.showClicks ? 'block' : 'none';
  }
}

/**
 * Toggle scroll heatmap
 */
function toggleScrollHeatmap() {
  heatmapState.showScroll = !heatmapState.showScroll;
  const toggle = document.getElementById('scroll-toggle');
  if (toggle) {
    toggle.classList.toggle('active', heatmapState.showScroll);
  }
  
  const scrollDepth = document.querySelector('.scroll-depth');
  if (scrollDepth) {
    scrollDepth.style.display = heatmapState.showScroll ? 'block' : 'none';
  }
}

/**
 * Toggle eye tracking
 */
function toggleEyeTracking() {
  heatmapConfig.enableEyeTracking = !heatmapConfig.enableEyeTracking;
  
  if (heatmapConfig.enableEyeTracking) {
    initEyeTracking();
  }
}

/**
 * Initialize eye tracking (mouse simulation)
 */
function initEyeTracking() {
  const trail = document.createElement('div');
  trail.className = 'eye-tracking';
  document.body.appendChild(trail);
  
  let points = [];
  
  document.addEventListener('mousemove', (e) => {
    points.push({ x: e.clientX, y: e.clientY, time: Date.now() });
    
    // Keep only last 20 points
    if (points.length > 20) {
      points.shift();
    }
    
    // Draw trail
    trail.innerHTML = points.map((p, i) => `
      <div style="
        position: absolute;
        left: ${p.x}px;
        top: ${p.y}px;
        width: ${8 - i * 0.3}px;
        height: ${8 - i * 0.3}px;
        background: rgba(139, 92, 246, ${0.5 - i * 0.02});
        border-radius: 50%;
        pointer-events: none;
        transform: translate(-50%, -50%);
      "></div>
    `).join('');
  });
}

/**
 * Update data panel
 */
function updateDataPanel() {
  const clicksEl = document.getElementById('data-clicks');
  if (clicksEl) {
    clicksEl.textContent = heatmapState.clicks.length;
  }
  
  // Find most clicked zone
  const zoneEl = document.getElementById('data-zone');
  if (zoneEl && Object.keys(heatmapState.elementEngagement).length > 0) {
    const topZone = Object.entries(heatmapState.elementEngagement)
      .sort((a, b) => b[1] - a[1])[0];
    zoneEl.textContent = topZone[0];
  }
}

/**
 * Save heatmap data to localStorage
 */
function saveHeatmapData() {
  localStorage.setItem('devmiro-heatmap', JSON.stringify({
    clicks: heatmapState.clicks.slice(-100), // Keep last 100
    scrollDepth: heatmapState.scrollDepth,
    scrollPoints: heatmapState.scrollPoints.slice(-50),
    elementEngagement: heatmapState.elementEngagement,
    timeOnPage: heatmapState.timeOnPage
  }));
}

/**
 * Get heatmap data (for analytics)
 */
function getHeatmapData() {
  return {
    clicks: heatmapState.clicks,
    scrollDepth: heatmapState.scrollDepth,
    scrollPoints: heatmapState.scrollPoints,
    elementEngagement: heatmapState.elementEngagement,
    timeOnPage: heatmapState.timeOnPage
  };
}

/**
 * Generate zone analysis
 */
function generateZoneAnalysis() {
  const zones = {
    hero: { name: 'Hero', clicks: 0, scroll: 0 },
    features: { name: 'Features', clicks: 0, scroll: 0 },
    cta: { name: 'CTA', clicks: 0, scroll: 0 },
    footer: { name: 'Footer', clicks: 0, scroll: 0 }
  };
  
  // Analyze clicks by position
  heatmapState.clicks.forEach(click => {
    const y = click.y;
    const windowHeight = window.innerHeight;
    
    if (y < windowHeight) {
      zones.hero.clicks++;
    } else if (y < windowHeight * 2) {
      zones.features.clicks++;
    } else if (y > document.documentElement.scrollHeight - windowHeight) {
      zones.cta.clicks++;
    }
  });
  
  return zones;
}

// Export
window.heatmapConfig = heatmapConfig;
window.toggleHeatmap = toggleHeatmap;
window.toggleClickHeatmap = toggleClickHeatmap;
window.toggleScrollHeatmap = toggleScrollHeatmap;
window.getHeatmapData = getHeatmapData;
window.generateZoneAnalysis = generateZoneAnalysis;