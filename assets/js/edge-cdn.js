/* Edge Computing & CDN Integration JavaScript */

document.addEventListener('DOMContentLoaded', function() {
  initEdgeCDN();
});

/**
 * Edge/CDN Configuration
 */
const edgeConfig = {
  cdnProvider: 'cloudflare', // cloudflare, vercel, netlify, custom
  cacheTTL: 86400, // 24 hours
  edgeRegions: ['VIE', 'FRA', 'ZRH', 'AMS'],
  enablePrefetch: true,
  enablePreload: true,
  enablePreconnect: true
};

/**
 * Edge State
 */
let edgeState = {
  cacheHitRate: 0,
  avgLatency: 0,
  edgeNode: null,
  totalRequests: 0,
  cachedRequests: 0
};

/**
 * Initialize Edge/CDN
 */
function initEdgeCDN() {
  // Generate resource hints
  generateResourceHints();
  
  // Create CDN status indicator
  createCDNStatus();
  
  // Create edge cache visualizer
  createEdgeCacheViz();
  
  // Monitor performance
  initPerformanceMonitoring();
}

/**
 * Generate resource hints (preload, prefetch, preconnect)
 */
function generateResourceHints() {
  const head = document.head;
  
  // Preconnect to critical origins
  if (edgeConfig.enablePreconnect) {
    const preconnects = [
      'https://fonts.googleapis.com',
      'https://fonts.gstatic.com',
      'https://www.google-analytics.com',
      'https://cdn.jsdelivr.net'
    ];
    
    preconnects.forEach(url => {
      const link = document.createElement('link');
      link.rel = 'preconnect';
      link.href = url;
      link.crossOrigin = 'anonymous';
      head.appendChild(link);
    });
  }
  
  // Preload critical assets
  if (edgeConfig.enablePreload) {
    const criticalAssets = [
      '/assets/css/styles.css',
      '/assets/js/main.js'
    ];
    
    criticalAssets.forEach(asset => {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.href = asset;
      link.as = asset.endsWith('.css') ? 'style' : 'script';
      head.appendChild(link);
    });
  }
  
  // Add dns-prefetch for non-critical origins
  const dnsPrefetches = [
    'https://www.googletagmanager.com',
    'https://www.facebook.com'
  ];
  
  dnsPrefetches.forEach(url => {
    const link = document.createElement('link');
    link.rel = 'dns-prefetch';
    link.href = url;
    head.appendChild(link);
  });
}

/**
 * Create CDN status indicator
 */
function createCDNStatus() {
  const status = document.createElement('div');
  status.className = 'cdn-status';
  status.innerHTML = `
    <span class="cdn-status__dot" id="cdn-status-dot"></span>
    <span id="cdn-status-text">CDN Aktiv</span>
  `;
  
  document.body.appendChild(status);
}

/**
 * Update CDN status
 */
function updateCDNStatus(status) {
  const dot = document.getElementById('cdn-status-dot');
  const text = document.getElementById('cdn-status-text');
  
  dot.className = 'cdn-status__dot';
  if (status === 'slow') {
    dot.classList.add('slow');
    text.textContent = 'CDN Langsam';
  } else if (status === 'offline') {
    dot.classList.add('offline');
    text.textContent = 'CDN Offline';
  } else {
    text.textContent = 'CDN Aktiv';
  }
}

/**
 * Create edge cache visualizer
 */
function createEdgeCacheViz() {
  const viz = document.createElement('div');
  viz.className = 'edge-cache-viz';
  viz.innerHTML = `
    <div class="edge-cache-viz__title">
      ⚡ Edge Cache
    </div>
    <div class="edge-cache-viz__nodes">
      ${edgeConfig.edgeRegions.map(region => `
        <div class="edge-cache-viz__node" id="edge-node-${region}">
          <div class="edge-cache-viz__node-region">${region}</div>
          <div class="edge-cache-viz__node-status">●</div>
        </div>
      `).join('')}
    </div>
    <div class="edge-cache-viz__stats">
      <div class="edge-cache-viz__stat">
        <span class="edge-cache-viz__stat-label">Cache Hit Rate</span>
        <span class="edge-cache-viz__stat-value" id="cache-hit-rate">--</span>
      </div>
      <div class="edge-cache-viz__stat">
        <span class="edge-cache-viz__stat-label">Avg. Latenz</span>
        <span class="edge-cache-viz__stat-value" id="avg-latency">--</span>
      </div>
      <div class="edge-cache-viz__stat">
        <span class="edge-cache-viz__stat-label">Edge Node</span>
        <span class="edge-cache-viz__stat-value" id="edge-node-name">--</span>
      </div>
    </div>
    <div style="margin-top: var(--space-3); display: flex; gap: var(--space-2);">
      <button class="btn btn--secondary btn--small" onclick="purgeCDNCache()">
        🗑️ Cache leeren
      </button>
      <button class="btn btn--secondary btn--small" onclick="testEdgeSpeed()">
        📊 Speed Test
      </button>
    </div>
  `;
  
  document.body.appendChild(viz);
  
  // Initialize stats
  updateEdgeStats();
}

/**
 * Update edge stats
 */
function updateEdgeStats() {
  // Simulate edge node detection
  const userRegion = getUserRegion();
  edgeState.edgeNode = userRegion;
  
  // Simulate cache hit rate
  edgeState.cacheHitRate = Math.floor(Math.random() * 20) + 80;
  edgeState.avgLatency = Math.floor(Math.random() * 30) + 10;
  
  // Update UI
  const hitRateEl = document.getElementById('cache-hit-rate');
  const latencyEl = document.getElementById('avg-latency');
  const nodeEl = document.getElementById('edge-node-name');
  
  if (hitRateEl) hitRateEl.textContent = edgeState.cacheHitRate + '%';
  if (latencyEl) latencyEl.textContent = edgeState.avgLatency + 'ms';
  if (nodeEl) nodeEl.textContent = edgeState.edgeNode;
  
  // Update node status
  edgeConfig.edgeRegions.forEach(region => {
    const node = document.getElementById(`edge-node-${region}`);
    if (node) {
      node.classList.toggle('active', region === userRegion);
    }
  });
}

/**
 * Get user region
 */
function getUserRegion() {
  // Simplified - in production use actual geo-IP
  return 'VIE'; // Vienna
}

/**
 * Initialize performance monitoring
 */
function initPerformanceMonitoring() {
  const perf = window.performance || window.webkitPerformance;
  if (!perf) return;
  
  // Monitor Core Web Vitals
  if ('PerformanceObserver' in window) {
    // LCP
    try {
      new PerformanceObserver((entryList) => {
        const entries = entryList.getEntries();
        const lastEntry = entries[entries.length - 1];
        console.log('LCP:', lastEntry.renderTime || lastEntry.loadTime);
      }).observe({ entryType: 'largest-contentful-paint' });
    } catch (e) {}
    
    // FID
    try {
      new PerformanceObserver((entryList) => {
        const entries = entryList.getEntries();
        entries.forEach(entry => {
          console.log('FID:', entry.processingStart - entry.startTime);
        });
      }).observe({ entryType: 'first-input' });
    } catch (e) {}
    
    // CLS
    try {
      new PerformanceObserver((entryList) => {
        const entries = entryList.getEntries();
        let cls = 0;
        entries.forEach(entry => {
          if (!entry.hadRecentInput) {
            cls += entry.value;
          }
        });
        console.log('CLS:', cls);
      }).observe({ entryType: 'layout-shift' });
    } catch (e) {}
  }
  
  // Log timing
  const timing = perf.timing || perf.getEntriesByType('navigation')[0];
  if (timing) {
    console.log('Navigation timing:', {
      domContentLoaded: timing.domContentLoadedEventEnd - timing.navigationStart,
      loadComplete: timing.loadEventEnd - timing.navigationStart,
      domInteractive: timing.domInteractive - timing.navigationStart
    });
  }
}

/**
 * Purge CDN cache
 */
function purgeCDNCache() {
  showNotification({
    type: 'info',
    title: 'CDN Cache',
    message: 'Cache wird geleert...'
  });
  
  // Simulate cache purge
  setTimeout(() => {
    showNotification({
      type: 'success',
      title: 'CDN Cache',
      message: 'Cache erfolgreich geleert'
    });
  }, 2000);
}

/**
 * Test edge speed
 */
function testEdgeSpeed() {
  const start = performance.now();
  
  fetch('/favicon.ico', { method: 'HEAD', cache: 'no-cache' })
    .then(() => {
      const end = performance.now();
      const latency = Math.round(end - start);
      
      // Update state
      edgeState.avgLatency = latency;
      
      // Update UI
      document.getElementById('avg-latency').textContent = latency + 'ms';
      
      // Update CDN status based on latency
      if (latency > 100) {
        updateCDNStatus('slow');
      } else {
        updateCDNStatus('good');
      }
      
      showToast(`Latenz: ${latency}ms`, latency > 100 ? 'warning' : 'success');
    })
    .catch(() => {
      showToast('Speed Test fehlgeschlagen', 'error');
    });
}

/**
 * Generate cache-busting URL
 */
function generateCacheBustURL(url, version) {
  version = version || new Date().getTime();
  const separator = url.includes('?') ? '&' : '?';
  return url + separator + '_cb=' + version;
}

/**
 * Set cache headers (for edge functions)
 */
function setCacheHeaders(cacheType = 'short') {
  const cacheDurations = {
    short: 3600,    // 1 hour
    medium: 86400,  // 1 day
    long: 604800,   // 1 week
    immutable: 31536000 // 1 year
  };
  
  return {
    'Cache-Control': `public, max-age=${cacheDurations[cacheType]}, s-maxage=${cacheDurations[cacheType]}`,
    'CDN-Cache-Control': `public, max-age=${cacheDurations[cacheType]}`
  };
}

/**
 * Smart asset loading
 */
function smartLoadAsset(url, type = 'script') {
  return new Promise((resolve, reject) => {
    const isCached = sessionStorage.getItem('cached_' + url);
    
    if (isCached && edgeState.cacheHitRate > 90) {
      console.log('Cache hit:', url);
      resolve();
      return;
    }
    
    const element = document.createElement(type === 'script' ? 'script' : 'link');
    
    if (type === 'script') {
      element.src = url;
      element.onload = () => {
        sessionStorage.setItem('cached_' + url, 'true');
        edgeState.cachedRequests++;
        resolve();
      };
      element.onerror = reject;
    } else {
      element.rel = 'stylesheet';
      element.href = url;
      element.onload = () => {
        sessionStorage.setItem('cached_' + url, 'true');
        edgeState.cachedRequests++;
        resolve();
      };
      element.onerror = reject;
    }
    
    document.head.appendChild(element);
  });
}

/**
 * Prefetch visible links
 */
function prefetchVisibleLinks() {
  if (!edgeConfig.enablePrefetch) return;
  
  const links = document.querySelectorAll('a[href^="/"]');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const link = entry.target;
        if (link.rel && link.rel.includes('prefetch')) return;
        
        link.rel = 'prefetch';
        observer.unobserve(link);
      }
    });
  }, { threshold: 0.5 });
  
  links.forEach(link => observer.observe(link));
}

// Initialize prefetch on load
setTimeout(prefetchVisibleLinks, 2000);

/**
 * Get edge analytics
 */
function getEdgeAnalytics() {
  return {
    ...edgeState,
    timestamp: Date.now(),
    provider: edgeConfig.cdnProvider,
    regions: edgeConfig.edgeRegions
  };
}

// Export for global use
window.edgeConfig = edgeConfig;
window.edgeState = edgeState;
window.purgeCDNCache = purgeCDNCache;
window.testEdgeSpeed = testEdgeSpeed;
window.generateCacheBustURL = generateCacheBustURL;
window.smartLoadAsset = smartLoadAsset;
window.getEdgeAnalytics = getEdgeAnalytics;