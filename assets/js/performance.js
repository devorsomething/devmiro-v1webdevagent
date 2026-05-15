/* Performance Optimization Advanced JavaScript */

document.addEventListener('DOMContentLoaded', function() {
  initPerformanceOptimization();
});

/**
 * Performance Configuration
 */
const performanceConfig = {
  enableMetrics: true,
  enableResourceHints: true,
  enableLazyLoading: true,
  enableCodeSplitting: true,
  enableCriticalCSS: true,
  
  // Lazy loading thresholds
  lazyLoadThreshold: {
    rootMargin: '50px',
    threshold: 0.1
  },
  
  // Performance budgets
  budgets: {
    fcp: 1800,
    lcp: 2500,
    tbt: 200,
    cls: 0.1,
    fid: 100,
    lcpImage: 250000
  },
  
  // Resource hints to inject
  resourceHints: [
    { type: 'preconnect', href: 'https://fonts.googleapis.com' },
    { type: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: 'anonymous' },
    { type: 'preload', href: '/assets/css/styles.css', as: 'style' },
    { type: 'preload', href: '/assets/js/main.js', as: 'script' }
  ]
};

/**
 * Performance State
 */
let performanceState = {
  metrics: {},
  resourceHintsApplied: false,
  chunksLoaded: [],
  imageOptimizations: {}
};

/**
 * Initialize performance optimization
 */
function initPerformanceOptimization() {
  // Measure initial metrics
  measureCoreWebVitals();
  
  // Inject resource hints
  if (performanceConfig.enableResourceHints) {
    injectResourceHints();
  }
  
  // Initialize lazy loading
  if (performanceConfig.enableLazyLoading) {
    initLazyLoading();
  }
  
  // Initialize performance indicators
  if (performanceConfig.enableMetrics) {
    initPerformanceIndicators();
  }
  
  // Monitor resource loading
  initResourceMonitoring();
  
  // Initialize code splitting display
  if (performanceConfig.enableCodeSplitting) {
    initCodeSplittingPanel();
  }
}

/**
 * Measure Core Web Vitals
 */
function measureCoreWebVitals() {
  // LCP (Largest Contentful Paint)
  new PerformanceObserver((entryList) => {
    const entries = entryList.getEntries();
    const lastEntry = entries[entries.length - 1];
    
    performanceState.metrics.lcp = lastEntry.startTime;
    
    // Check if LCP image is optimized
    if (lastEntry.element) {
      checkLCPImageOptimization(lastEntry.element);
    }
  }).observe({ entryType: 'largest-contentful-paint' });
  
  // FID (First Input Delay)
  new PerformanceObserver((entryList) => {
    const entries = entryList.getEntries();
    entries.forEach(entry => {
      performanceState.metrics.fid = entry.processingStart - entry.startTime;
    });
  }).observe({ entryType: 'first-input' });
  
  // CLS (Cumulative Layout Shift)
  let clsValue = 0;
  
  new PerformanceObserver((entryList) => {
    for (const entry of entryList.getEntries()) {
      if (!entry.hadRecentInput) {
        clsValue += entry.value;
      }
    }
    performanceState.metrics.cls = clsValue;
  }).observe({ entryType: 'layout-shift' });
  
  // FCP (First Contentful Paint)
  new PerformanceObserver((entryList) => {
    const entries = entryList.getEntries();
    const fcpEntry = entries.find(e => e.entryType === 'paint' && e.name === 'first-contentful-paint');
    if (fcpEntry) {
      performanceState.metrics.fcp = fcpEntry.startTime;
    }
  }).observe({ entryType: 'paint' });
  
  // TBT (Total Blocking Time)
  const longTasks = [];
  
  new PerformanceObserver((entryList) => {
    entryList.getEntries().forEach(entry => {
      longTasks.push(entry);
      performanceState.metrics.tbt = longTasks.reduce((acc, task) => {
        return acc + Math.max(0, task.duration - 50);
      }, 0);
    });
  }).observe({ entryType: 'longtask' });
  
  // Report metrics after page load
  window.addEventListener('load', () => {
    setTimeout(() => {
      reportMetrics();
    }, 3000);
  });
}

/**
 * Check LCP image optimization
 */
function checkLCPImageOptimization(element) {
  const src = element.src || element.currentSrc || '';
  
  if (!src) return;
  
  // Check if image is WebP/AVIF
  const isOptimized = src.includes('.webp') || src.includes('.avif') || src.includes('f_auto');
  
  performanceState.imageOptimizations.lcp = {
    url: src.substring(0, 100),
    optimized: isOptimized
  };
}

/**
 * Report metrics
 */
function reportMetrics() {
  const metrics = performanceState.metrics;
  const budgets = performanceConfig.budgets;
  
  // Check each metric against budget
  Object.keys(budgets).forEach(metric => {
    const value = metrics[metric];
    const budget = budgets[metric];
    
    if (value !== undefined) {
      const status = value <= budget ? 'good' : value <= budget * 1.5 ? 'needs-improvement' : 'poor';
      console.log(`[Performance] ${metric}: ${Math.round(value)}ms (budget: ${budget}ms) - ${status}`);
    }
  });
  
  // Store for display
  localStorage.setItem('devmiro_performance_metrics', JSON.stringify(metrics));
}

/**
 * Inject resource hints
 */
function injectResourceHints() {
  if (performanceState.resourceHintsApplied) return;
  
  const head = document.head;
  
  performanceConfig.resourceHints.forEach(hint => {
    const existing = document.querySelector(`link[${hint.type === 'preload' ? 'href' : 'href'}="${hint.href}"]`);
    if (existing) return;
    
    const link = document.createElement('link');
    link.rel = hint.type;
    link.href = hint.href;
    link.as = hint.as || undefined;
    link.crossorigin = hint.crossorigin || undefined;
    
    head.appendChild(link);
  });
  
  performanceState.resourceHintsApplied = true;
  
  // Show hints panel
  renderResourceHints();
}

/**
 * Render resource hints panel
 */
function renderResourceHints() {
  const panel = document.createElement('div');
  panel.className = 'resource-hints';
  panel.id = 'resource-hints-panel';
  panel.innerHTML = `
    <div class="resource-hints__header">
      <span>⚡ Resource Hints</span>
      <button onclick="toggleResourceHints()" style="background: none; border: none; cursor: pointer;">✕</button>
    </div>
    <div class="resource-hints__list">
      ${performanceConfig.resourceHints.map(hint => `
        <div class="resource-hint-item">
          <span class="resource-hint-item__type">${hint.type}</span>
          <span class="resource-hint-item__url">${hint.href}</span>
        </div>
      `).join('')}
    </div>
  `;
  
  document.body.appendChild(panel);
}

/**
 * Toggle resource hints panel
 */
function toggleResourceHints() {
  const panel = document.getElementById('resource-hints-panel');
  if (panel) {
    panel.classList.toggle('active');
  }
}

/**
 * Initialize lazy loading
 */
function initLazyLoading() {
  // Check for IntersectionObserver support
  if (!('IntersectionObserver' in window)) {
    // Fallback: load all images immediately
    document.querySelectorAll('img[data-src]').forEach(img => {
      img.src = img.dataset.src;
    });
    return;
  }
  
  const options = {
    rootMargin: performanceConfig.lazyLoadThreshold.rootMargin,
    threshold: performanceConfig.lazyLoadThreshold.threshold
  };
  
  const imageObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target;
        
        // Load image
        if (img.dataset.src) {
          img.src = img.dataset.src;
        }
        
        // Load background image
        if (img.dataset.bgSrc) {
          img.style.backgroundImage = `url(${img.dataset.bgSrc})`;
        }
        
        // Remove placeholder
        img.classList.remove('lazy-placeholder');
        
        // Stop observing
        observer.unobserve(img);
      }
    });
  }, options);
  
  // Observe images
  document.querySelectorAll('img[data-src], [data-bg-src], .lazy-placeholder').forEach(el => {
    imageObserver.observe(el);
  });
}

/**
 * Initialize performance indicators
 */
function initPerformanceIndicators() {
  const indicator = document.createElement('div');
  indicator.className = 'perf-indicator';
  indicator.id = 'perf-indicator';
  indicator.innerHTML = `
    <div class="perf-metric" id="perf-fcp">
      <span class="perf-metric__dot good"></span>
      <span>FCP:</span>
      <span class="perf-metric__value">--</span>
    </div>
    <div class="perf-metric" id="perf-lcp">
      <span class="perf-metric__dot warning"></span>
      <span>LCP:</span>
      <span class="perf-metric__value">--</span>
    </div>
    <div class="perf-metric" id="perf-cls">
      <span class="perf-metric__dot good"></span>
      <span>CLS:</span>
      <span class="perf-metric__value">--</span>
    </div>
  `;
  
  document.body.appendChild(indicator);
  
  // Update metrics periodically
  setInterval(updatePerformanceMetrics, 2000);
}

/**
 * Update performance metrics display
 */
function updatePerformanceMetrics() {
  const metrics = performanceState.metrics;
  
  // FCP
  if (metrics.fcp !== undefined) {
    updateMetricDisplay('perf-fcp', metrics.fcp, performanceConfig.budgets.fcp);
  }
  
  // LCP
  if (metrics.lcp !== undefined) {
    updateMetricDisplay('perf-lcp', metrics.lcp, performanceConfig.budgets.lcp);
  }
  
  // CLS
  if (metrics.cls !== undefined) {
    updateMetricDisplay('perf-cls', metrics.cls, performanceConfig.budgets.cls, true);
  }
}

/**
 * Update metric display
 */
function updateMetricDisplay(elementId, value, budget, isDecimal = false) {
  const element = document.getElementById(elementId);
  if (!element) return;
  
  const valueEl = element.querySelector('.perf-metric__value');
  const dotEl = element.querySelector('.perf-metric__dot');
  
  if (valueEl) {
    valueEl.textContent = isDecimal ? value.toFixed(2) : Math.round(value) + 'ms';
  }
  
  if (dotEl) {
    dotEl.classList.remove('good', 'warning', 'bad');
    
    if (value <= budget) {
      dotEl.classList.add('good');
    } else if (value <= budget * 1.5) {
      dotEl.classList.add('warning');
    } else {
      dotEl.classList.add('bad');
    }
  }
}

/**
 * Initialize resource monitoring
 */
function initResourceMonitoring() {
  // Monitor script loading
  const scripts = document.querySelectorAll('script[src]');
  
  scripts.forEach(script => {
    script.addEventListener('load', () => {
      performanceState.chunksLoaded.push({
        type: 'script',
        url: script.src,
        time: Date.now()
      });
    });
  });
  
  // Monitor CSS loading
  const styles = document.querySelectorAll('link[rel="stylesheet"]');
  
  styles.forEach(style => {
    style.addEventListener('load', () => {
      performanceState.chunksLoaded.push({
        type: 'style',
        url: style.href,
        time: Date.now()
      });
    });
  });
}

/**
 * Initialize code splitting panel
 */
function initCodeSplittingPanel() {
  const panel = document.createElement('div');
  panel.className = 'code-split-panel';
  panel.id = 'code-split-panel';
  panel.innerHTML = `
    <div style="font-weight: 600; margin-bottom: var(--space-3);">
      📦 Code Chunks
    </div>
    <div id="code-split-list">
      <!-- Chunks will be listed here -->
    </div>
  `;
  
  document.body.appendChild(panel);
  
  // Show panel on click
  const toggle = document.createElement('button');
  toggle.className = 'no-print';
  toggle.style.cssText = `
    position: fixed;
    bottom: 100px;
    left: 24px;
    width: 40px;
    height: 40px;
    border-radius: 50%;
    background: var(--color-background);
    border: 1px solid var(--color-border);
    cursor: pointer;
    font-size: 1rem;
    z-index: 9998;
  `;
  toggle.innerHTML = '📦';
  toggle.onclick = () => {
    panel.classList.toggle('active');
    updateCodeSplitDisplay();
  };
  
  document.body.appendChild(toggle);
}

/**
 * Update code split display
 */
function updateCodeSplitDisplay() {
  const list = document.getElementById('code-split-list');
  if (!list) return;
  
  // Get all loaded resources
  const resources = performanceState.chunksLoaded.map(r => {
    const size = estimateResourceSize(r.url);
    return `<div class="code-split-panel__chunk">
      <span>${r.type}</span>
      <span class="code-split-panel__size">${size}</span>
    </div>`;
  }).join('');
  
  list.innerHTML = resources || '<div style="font-size: 0.75rem; color: var(--color-text-muted);">Keine Chunks geladen</div>';
}

/**
 * Estimate resource size (mock)
 */
function estimateResourceSize(url) {
  if (url.endsWith('.js')) return '~50 KB';
  if (url.endsWith('.css')) return '~25 KB';
  if (url.endsWith('.jpg') || url.endsWith('.png')) return '~150 KB';
  if (url.endsWith('.woff2')) return '~80 KB';
  return '~10 KB';
}

/**
 * Get performance summary
 */
function getPerformanceSummary() {
  return {
    metrics: performanceState.metrics,
    budgets: performanceConfig.budgets,
    resourceHints: performanceConfig.resourceHints.length,
    chunksLoaded: performanceState.chunksLoaded.length,
    timestamp: Date.now()
  };
}

// Export for global use
window.performanceConfig = performanceConfig;
window.performanceState = performanceState;
window.toggleResourceHints = toggleResourceHints;
window.getPerformanceSummary = getPerformanceSummary;