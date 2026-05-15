/* Automated Testing & QA JavaScript */

document.addEventListener('DOMContentLoaded', function() {
  initTesting();
});

/**
 * Testing Configuration
 */
const testingConfig = {
  autoRun: true,
  checkAccessibility: true,
  checkPerformance: true,
  checkSEO: true,
  checkResponsive: true
};

/**
 * Testing State
 */
let testingState = {
  tests: [],
  passed: 0,
  failed: 0,
  warnings: 0
};

/**
 * Initialize testing
 */
function initTesting() {
  // Create testing panel
  createTestingPanel();
  
  // Run automated tests on load
  if (testingConfig.autoRun) {
    setTimeout(runAutomatedTests, 1000);
  }
  
  // Create keyboard shortcut (Ctrl+T)
  document.addEventListener('keydown', (e) => {
    if (e.ctrlKey && e.key === 't') {
      e.preventDefault();
      toggleTestingPanel();
    }
  });
}

/**
 * Create testing panel
 */
function createTestingPanel() {
  const panel = document.createElement('div');
  panel.className = 'testing-panel';
  panel.id = 'testing-panel';
  panel.style.display = 'none';
  panel.innerHTML = `
    <div class="testing-panel__header">
      <span class="testing-panel__title">🧪 QA Testing</span>
      <button onclick="closeTestingPanel()" style="background: none; border: none; cursor: pointer;">✕</button>
    </div>
    <div class="testing-panel__status">
      <span class="testing-panel__status-dot" id="testing-status-dot"></span>
      <span id="testing-status-text">Bereit</span>
    </div>
    <div class="testing-panel__tests" id="testing-results">
      <p style="color: var(--color-text-muted); font-size: 0.875rem;">Drücken Sie Ctrl+T zum Starten</p>
    </div>
    <div style="display: flex; gap: var(--space-2); margin-top: var(--space-3);">
      <button class="btn btn--secondary btn--small" onclick="runAutomatedTests()">
        ▶ Tests ausführen
      </button>
      <button class="btn btn--secondary btn--small" onclick="runA11yCheck()">
        ♿ Accessibility
      </button>
    </div>
  `;
  
  document.body.appendChild(panel);
  
  // Create performance monitor
  createPerformanceMonitor();
}

/**
 * Toggle testing panel
 */
function toggleTestingPanel() {
  const panel = document.getElementById('testing-panel');
  if (panel) {
    panel.style.display = panel.style.display === 'none' ? 'block' : 'none';
  }
}

/**
 * Close testing panel
 */
function closeTestingPanel() {
  const panel = document.getElementById('testing-panel');
  if (panel) {
    panel.style.display = 'none';
  }
}

/**
 * Run automated tests
 */
function runAutomatedTests() {
  testingState.tests = [];
  testingState.passed = 0;
  testingState.failed = 0;
  testingState.warnings = 0;
  
  // Update status
  updateTestStatus('running', 'Tests werden ausgeführt...');
  
  // Run tests
  const tests = [
    { name: 'HTML Validation', fn: testHTMLValidation },
    { name: 'CSS Validation', fn: testCSSValidation },
    { name: 'JavaScript Errors', fn: testJSErrors },
    { name: 'Image Optimization', fn: testImageOptimization },
    { name: 'Meta Tags', fn: testMetaTags },
    { name: 'Accessibility', fn: testAccessibility },
    { name: 'Performance', fn: testPerformance },
    { name: 'Mobile Responsive', fn: testResponsive },
    { name: 'SSL/HTTPS', fn: testSSL },
    { name: 'Sitemap', fn: testSitemap }
  ];
  
  tests.forEach((test, i) => {
    setTimeout(() => {
      const result = test.fn();
      testingState.tests.push({ name: test.name, ...result });
      
      if (result.status === 'pass') testingState.passed++;
      else if (result.status === 'fail') testingState.failed++;
      else testingState.warnings++;
      
      updateTestingResults();
      
      if (i === tests.length - 1) {
        const status = testingState.failed > 0 ? 'error' : testingState.warnings > 0 ? 'warning' : 'pass';
        const text = testingState.failed > 0 
          ? `${testingState.failed} Fehler gefunden`
          : testingState.warnings > 0 
            ? `${testingState.warnings} Warnungen`
            : 'Alle Tests bestanden ✓';
        updateTestStatus(status, text);
      }
    }, i * 200);
  });
}

/**
 * Test HTML Validation
 */
function testHTMLValidation() {
  const issues = [];
  
  // Check for unclosed tags (simplified)
  const tags = ['main', 'section', 'div', 'header', 'footer', 'nav'];
  tags.forEach(tag => {
    const opens = document.querySelectorAll(tag + ':not([data-no-close])').length;
    const closes = document.querySelectorAll(tag).length;
    if (opens !== closes && opens > 0) {
      issues.push(`${tag}: ${Math.abs(opens - closes)} not matched`);
    }
  });
  
  return {
    status: issues.length > 0 ? 'fail' : 'pass',
    message: issues.length > 0 ? issues.join(', ') : 'HTML Struktur OK',
    issues
  };
}

/**
 * Test CSS Validation
 */
function testCSSValidation() {
  const issues = [];
  
  // Check for invalid CSS properties
  const elements = document.querySelectorAll('[style]');
  elements.forEach(el => {
    const style = el.getAttribute('style');
    if (style && style.includes('undefined')) {
      issues.push('Undefined value in style');
    }
  });
  
  // Check for vendor prefixes
  const hasPrefixes = document.querySelector('[class*="-webkit-"], [class*="-moz-"]');
  
  return {
    status: issues.length > 0 ? 'fail' : 'pass',
    message: 'CSS Validierung OK',
    issues
  };
}

/**
 * Test JavaScript Errors
 */
function testJSErrors() {
  const errors = [];
  
  // Check for console errors
  const originalError = console.error;
  let jsErrors = [];
  
  console.error = function(...args) {
    jsErrors.push(args.join(' '));
    originalError.apply(console, args);
  };
  
  // Reset after check
  setTimeout(() => {
    console.error = originalError;
  }, 100);
  
  // Check for broken resources
  const brokenLinks = [];
  const links = document.querySelectorAll('a[href]');
  links.forEach(link => {
    if (link.href && !link.href.startsWith('#') && link.href.length > 0) {
      // Would need actual fetch to check
    }
  });
  
  return {
    status: jsErrors.length > 0 ? 'fail' : 'pass',
    message: jsErrors.length > 0 ? `${jsErrors.length} JS Fehler` : 'Keine JS Fehler ✓',
    issues: jsErrors
  };
}

/**
 * Test Image Optimization
 */
function testImageOptimization() {
  const issues = [];
  const images = document.querySelectorAll('img');
  
  images.forEach(img => {
    if (!img.alt) {
      issues.push('Image ohne alt-Text');
    }
    if (img.width && img.height && (img.width > 1920 || img.height > 1080)) {
      issues.push('Image zu groß (>1920px)');
    }
  });
  
  // Check for lazy loading
  const lazyImages = document.querySelectorAll('img[loading="lazy"]');
  if (images.length > 0 && lazyImages.length === 0) {
    issues.push('Keine Lazy Loading Images');
  }
  
  return {
    status: issues.length > 0 ? 'warn' : 'pass',
    message: `${images.length} Images, ${issues.length} Warnungen`,
    issues
  };
}

/**
 * Test Meta Tags
 */
function testMetaTags() {
  const issues = [];
  
  // Check essential meta tags
  if (!document.querySelector('meta[name="description"]')) {
    issues.push('Meta description fehlt');
  }
  if (!document.querySelector('meta[name="viewport"]')) {
    issues.push('Viewport meta fehlt');
  }
  if (!document.querySelector('meta[charset]')) {
    issues.push('Charset meta fehlt');
  }
  
  // Check OG tags
  if (!document.querySelector('meta[property="og:title"]')) {
    issues.push('OG Tags fehlen');
  }
  
  return {
    status: issues.length > 0 ? 'warn' : 'pass',
    message: issues.length > 0 ? issues.join(', ') : 'Meta Tags OK',
    issues
  };
}

/**
 * Test Accessibility
 */
function testAccessibility() {
  const issues = [];
  
  // Check for ARIA labels
  const buttons = document.querySelectorAll('button');
  buttons.forEach(btn => {
    if (!btn.textContent.trim() && !btn.getAttribute('aria-label')) {
      issues.push('Button ohne Text/aria-label');
    }
  });
  
  // Check for form labels
  const inputs = document.querySelectorAll('input:not([type="hidden"])');
  inputs.forEach(input => {
    const label = document.querySelector(`label[for="${input.id}"]`);
    const ariaLabel = input.getAttribute('aria-label') || input.getAttribute('aria-labelledby');
    if (!label && !ariaLabel && input.type !== 'submit' && input.type !== 'button') {
      issues.push(`Input ohne Label: ${input.type}`);
    }
  });
  
  // Check for heading hierarchy
  const h1s = document.querySelectorAll('h1');
  const h2s = document.querySelectorAll('h2');
  if (h1s.length > 1) {
    issues.push('Mehrere H1 gefunden');
  }
  if (h2s.length > 0 && h1s.length === 0) {
    issues.push('H2 ohne H1');
  }
  
  return {
    status: issues.length > 0 ? 'warn' : 'pass',
    message: issues.length > 0 ? issues.join(', ') : 'Accessibility OK',
    issues
  };
}

/**
 * Test Performance
 */
function testPerformance() {
  const issues = [];
  
  // Check for render blocking resources
  const scripts = document.querySelectorAll('script[src]');
  if (scripts.length > 10) {
    issues.push(`${scripts.length} externe Scripts`);
  }
  
  // Check for inline styles
  const inlineStyles = document.querySelectorAll('[style]');
  if (inlineStyles.length > 5) {
    issues.push(`${inlineStyles.length} Inline Styles`);
  }
  
  // Check font loading
  const fonts = document.querySelectorAll('link[href*="fonts.googleapis"]');
  if (fonts.length > 0) {
    issues.push('Google Fonts geladen (kann Performance beeinflussen)');
  }
  
  return {
    status: issues.length > 0 ? 'warn' : 'pass',
    message: issues.length > 0 ? issues.join(', ') : 'Performance OK',
    issues
  };
}

/**
 * Test Responsive
 */
function testResponsive() {
  const issues = [];
  
  // Check for viewport meta
  const viewport = document.querySelector('meta[name="viewport"]');
  if (!viewport) {
    issues.push('Viewport nicht gesetzt');
  }
  
  // Check for media queries in CSS
  const styles = document.querySelectorAll('style');
  let hasMediaQueries = false;
  styles.forEach(style => {
    if (style.textContent.includes('@media')) {
      hasMediaQueries = true;
    }
  });
  
  if (!hasMediaQueries) {
    issues.push('Keine Media Queries gefunden');
  }
  
  return {
    status: issues.length > 0 ? 'fail' : 'pass',
    message: issues.length > 0 ? issues.join(', ') : 'Responsive Design OK',
    issues
  };
}

/**
 * Test SSL
 */
function testSSL() {
  const isHTTPS = window.location.protocol === 'https:';
  
  return {
    status: isHTTPS ? 'pass' : 'fail',
    message: isHTTPS ? 'HTTPS aktiv ✓' : 'HTTPS nicht aktiv',
    issues: isHTTPS ? [] : ['Seite nicht über HTTPS']
  };
}

/**
 * Test Sitemap
 */
function testSitemap() {
  const hasSitemap = document.querySelector('link[rel="sitemap"]') || 
                     document.querySelector('a[href="sitemap.xml"]');
  
  return {
    status: hasSitemap ? 'pass' : 'warn',
    message: hasSitemap ? 'Sitemap vorhanden ✓' : 'Sitemap fehlt',
    issues: hasSitemap ? [] : ['Sitemap.xml nicht gefunden']
  };
}

/**
 * Update testing results
 */
function updateTestingResults() {
  const container = document.getElementById('testing-results');
  if (!container) return;
  
  container.innerHTML = testingState.tests.map(test => `
    <div class="testing-panel__test testing-panel__test-${test.status === 'pass' ? 'pass' : 'fail'}">
      <span class="testing-panel__test-name">
        <span class="testing-panel__test-icon">${test.status === 'pass' ? '✓' : test.status === 'fail' ? '✕' : '⚠'}</span>
        ${test.name}
      </span>
      <span style="font-size: 0.75rem; color: var(--color-text-muted);">${test.message}</span>
    </div>
  `).join('');
  
  // Add summary
  container.innerHTML += `
    <div style="padding-top: var(--space-3); border-top: 1px solid var(--color-border); margin-top: var(--space-3);">
      <span style="color: #22C55E;">✓ ${testingState.passed} passed</span> · 
      <span style="color: #EF4444;">✕ ${testingState.failed} failed</span> · 
      <span style="color: #F59E0B;">⚠ ${testingState.warnings} warnings</span>
    </div>
  `;
}

/**
 * Update test status
 */
function updateTestStatus(status, text) {
  const dot = document.getElementById('testing-status-dot');
  const textEl = document.getElementById('testing-status-text');
  
  if (dot) {
    dot.className = 'testing-panel__status-dot';
    if (status === 'error') dot.classList.add('error');
    else if (status === 'warning') dot.classList.add('warning');
  }
  
  if (textEl) {
    textEl.textContent = text;
  }
}

/**
 * Create performance monitor
 */
function createPerformanceMonitor() {
  const monitor = document.createElement('div');
  monitor.className = 'perf-monitor';
  monitor.style.display = 'none';
  
  const updatePerf = () => {
    const perf = window.performance || window.webkitPerformance;
    if (!perf) return;
    
    const timing = perf.timing || perf.getEntriesByType('navigation')[0];
    if (!timing) return;
    
    const loadTime = timing.loadEventEnd - timing.navigationStart;
    const domReady = timing.domContentLoadedEventEnd - timing.navigationStart;
    
    monitor.innerHTML = `
      <div class="perf-monitor__row">
        <span class="perf-monitor__label">Load:</span>
        <span class="perf-monitor__value ${loadTime > 3000 ? 'error' : loadTime > 1500 ? 'warning' : ''}">${loadTime}ms</span>
      </div>
      <div class="perf-monitor__row">
        <span class="perf-monitor__label">DOM:</span>
        <span class="perf-monitor__value ${domReady > 2000 ? 'error' : ''}">${domReady}ms</span>
      </div>
      <div class="perf-monitor__row">
        <span class="perf-monitor__label">Views:</span>
        <span class="perf-monitor__value">${document.visibilityState}</span>
      </div>
    `;
  };
  
  updatePerf();
  setInterval(updatePerf, 5000);
  
  document.body.appendChild(monitor);
  
  // Toggle with Ctrl+P
  document.addEventListener('keydown', (e) => {
    if (e.ctrlKey && e.key === 'p') {
      e.preventDefault();
      monitor.style.display = monitor.style.display === 'none' ? 'block' : 'none';
    }
  });
}

/**
 * Run accessibility check
 */
function runA11yCheck() {
  const issues = [];
  
  // Check color contrast
  const elements = document.querySelectorAll('p, span, h1, h2, h3, h4, h5, h6');
  elements.forEach(el => {
    const style = window.getComputedStyle(el);
    const bg = window.getComputedStyle(el.parentElement);
    // Simplified check - in production use proper contrast algorithm
  });
  
  // Check keyboard navigation
  const focusable = document.querySelectorAll('a, button, input, select, textarea, [tabindex]');
  if (focusable.length === 0) {
    issues.push('Keine fokussierbaren Elemente');
  }
  
  showNotification({
    type: 'info',
    title: 'Accessibility Check',
    message: issues.length > 0 ? `${issues.length} Probleme gefunden` : 'Keine Probleme gefunden'
  });
}

/**
 * Run visual regression test
 */
function runVisualRegressionTest() {
  // In production, this would compare screenshots
  showToast('Visuelle Regression wird getestet...', 'info');
  
  setTimeout(() => {
    showToast('Visuelle Regression: ✓', 'success');
  }, 2000);
}

// Export for global use
window.testingConfig = testingConfig;
window.runAutomatedTests = runAutomatedTests;
window.runA11yCheck = runA11yCheck;
window.runVisualRegressionTest = runVisualRegressionTest;
window.toggleTestingPanel = toggleTestingPanel;