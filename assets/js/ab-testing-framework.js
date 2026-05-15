/* Automated A/B Testing Framework JavaScript */

document.addEventListener('DOMContentLoaded', function() {
  initABFramework();
});

/**
 * A/B Testing Framework Configuration
 */
const abFrameworkConfig = {
  // Active tests
  tests: [
    {
      id: 'hero-cta',
      name: 'Hero CTA Button',
      variants: [
        { id: 'A', name: 'Jetzt anfragen', weight: 0.5 },
        { id: 'B', name: 'Kostenlos beraten', weight: 0.5 }
      ],
      elements: '[data-ab="hero-cta"]',
      goal: 'click',
      minSampleSize: 100,
      maxDuration: 14 // days
    },
    {
      id: 'pricing-layout',
      name: 'Preis-Tabelle Layout',
      variants: [
        { id: 'A', name: 'Karten', weight: 0.5 },
        { id: 'B', name: 'Tabellen', weight: 0.5 }
      ],
      elements: '[data-ab="pricing"]',
      goal: 'conversion',
      minSampleSize: 200,
      maxDuration: 21
    },
    {
      id: 'testimonial-position',
      name: 'Testimonial Position',
      variants: [
        { id: 'A', name: 'Oben', weight: 0.5 },
        { id: 'B', name: 'Unten', weight: 0.5 }
      ],
      elements: '[data-ab="testimonials"]',
      goal: 'scroll',
      minSampleSize: 150,
      maxDuration: 14
    }
  ],
  
  // Statistical settings
  statistical: {
    confidenceLevel: 0.95,
    minimumDetectableEffect: 0.1,
    power: 0.8
  },
  
  // Bandit settings
  bandit: {
    enabled: true,
    explorationRate: 0.2,
    updateInterval: 3600 // seconds
  }
};

/**
 * Test State
 */
let abState = {
  activeTests: {},
  assignments: {},
  conversions: {},
  isInitialized: false
};

/**
 * Initialize A/B framework
 */
function initABFramework() {
  // Load saved state
  loadTestState();
  
  // Assign users to tests
  assignUserToTests();
  
  // Apply variants
  applyVariants();
  
  // Start tracking
  initTracking();
  
  // Create UI
  createTestSelector();
  
  abState.isInitialized = true;
  
  // Update bandits periodically
  if (abFrameworkConfig.bandit.enabled) {
    setInterval(updateBandits, abFrameworkConfig.bandit.updateInterval * 1000);
  }
}

/**
 * Load test state from storage
 */
function loadTestState() {
  const saved = localStorage.getItem('ab_framework_state');
  if (saved) {
    abState = { ...abState, ...JSON.parse(saved) };
  }
}

/**
 * Save test state
 */
function saveTestState() {
  localStorage.setItem('ab_framework_state', JSON.stringify(abState));
}

/**
 * Assign user to tests
 */
function assignUserToTests() {
  const userId = getUserId();
  
  abFrameworkConfig.tests.forEach(test => {
    if (!abState.assignments[test.id]) {
      // Check if user already in test
      const existingAssignment = abState.assignments[test.id];
      
      if (!existingAssignment) {
        // Assign based on weights (or bandit)
        let variantId;
        
        if (abFrameworkConfig.bandit.enabled && abState.conversions[test.id]) {
          // Multi-armed bandit selection
          variantId = selectBanditVariant(test);
        } else {
          // Random weighted selection
          variantId = selectWeightedVariant(test);
        }
        
        abState.assignments[test.id] = {
          variantId,
          userId,
          assignedAt: Date.now()
        };
        
        // Initialize conversion tracking
        if (!abState.conversions[test.id]) {
          abState.conversions[test.id] = {};
          test.variants.forEach(v => {
            abState.conversions[test.id][v.id] = { views: 0, conversions: 0 };
          });
        }
      }
    }
    
    // Increment view
    const assignment = abState.assignments[test.id];
    if (assignment && abState.conversions[test.id]?.[assignment.variantId]) {
      abState.conversions[test.id][assignment.variantId].views++;
    }
  });
  
  saveTestState();
}

/**
 * Get user ID
 */
function getUserId() {
  let userId = localStorage.getItem('devmiro_user_id');
  if (!userId) {
    userId = 'user_' + Date.now();
    localStorage.setItem('devmiro_user_id', userId);
  }
  return userId;
}

/**
 * Select weighted variant
 */
function selectWeightedVariant(test) {
  const rand = Math.random();
  let cumulative = 0;
  
  for (const variant of test.variants) {
    cumulative += variant.weight;
    if (rand <= cumulative) {
      return variant.id;
    }
  }
  
  return test.variants[0].id;
}

/**
 * Select bandit variant
 */
function selectBanditVariant(test) {
  const conversions = abState.conversions[test.id];
  if (!conversions) return selectWeightedVariant(test);
  
  const explorationRate = abFrameworkConfig.bandit.explorationRate;
  
  // Exploration: random
  if (Math.random() < explorationRate) {
    return test.variants[Math.floor(Math.random() * test.variants.length)].id;
  }
  
  // Exploitation: use UCB1
  const results = test.variants.map(v => {
    const data = conversions[v.id];
    if (!data || data.views === 0) return { id: v.id, score: Infinity };
    
    const ctr = data.conversions / data.views;
    const n = data.views;
    const mean = ctr;
    const bonus = Math.sqrt(2 * Math.log(data.views + 1) / n);
    
    return { id: v.id, score: mean + bonus };
  });
  
  results.sort((a, b) => b.score - a.score);
  return results[0].id;
}

/**
 * Apply variants to elements
 */
function applyVariants() {
  abFrameworkConfig.tests.forEach(test => {
    const assignment = abState.assignments[test.id];
    if (!assignment) return;
    
    const elements = document.querySelectorAll(test.elements);
    elements.forEach(el => {
      el.setAttribute('data-ab-test', test.id);
      el.setAttribute('data-ab-variant', assignment.variantId);
      
      // Apply variant-specific modifications
      applyVariantModifications(el, test, assignment.variantId);
    });
  });
}

/**
 * Apply variant modifications
 */
function applyVariantModifications(element, test, variantId) {
  const variant = test.variants.find(v => v.id === variantId);
  if (!variant) return;
  
  // For CTA tests, update button text
  if (test.id === 'hero-cta' && element.tagName === 'BUTTON') {
    element.textContent = variant.name;
  }
}

/**
 * Initialize tracking
 */
function initTracking() {
  // Track clicks
  document.addEventListener('click', (e) => {
    const target = e.target.closest('[data-ab-test]');
    if (!target) return;
    
    const testId = target.getAttribute('data-ab-test');
    const variantId = target.getAttribute('data-ab-variant');
    
    trackConversion(testId, variantId, 'click');
  });
  
  // Track conversions
  document.querySelectorAll('form').forEach(form => {
    form.addEventListener('submit', () => {
      abFrameworkConfig.tests.forEach(test => {
        const assignment = abState.assignments[test.id];
        if (assignment && test.goal === 'conversion') {
          trackConversion(test.id, assignment.variantId, 'form_submit');
        }
      });
    });
  });
  
  // Track scroll depth
  initScrollTracking();
}

/**
 * Track conversion
 */
function trackConversion(testId, variantId, type) {
  if (!abState.conversions[testId]) return;
  if (!abState.conversions[testId][variantId]) return;
  
  abState.conversions[testId][variantId].conversions++;
  
  // Send to analytics (simplified)
  console.log(`A/B Test: ${testId} | Variant: ${variantId} | Conversion: ${type}`);
  
  // Check for significance
  checkSignificance(testId);
  
  saveTestState();
}

/**
 * Track scroll
 */
function initScrollTracking() {
  let tracked = false;
  
  window.addEventListener('scroll', () => {
    if (tracked) return;
    
    const scrollPercent = (window.scrollY / document.body.scrollHeight) * 100;
    
    if (scrollPercent > 50) {
      tracked = true;
      
      abFrameworkConfig.tests.forEach(test => {
        if (test.goal === 'scroll') {
          const assignment = abState.assignments[test.id];
          if (assignment) {
            trackConversion(test.id, assignment.variantId, 'scroll_50');
          }
        }
      });
    }
  });
}

/**
 * Check statistical significance
 */
function checkSignificance(testId) {
  const test = abFrameworkConfig.tests.find(t => t.id === testId);
  if (!test || test.variants.length !== 2) return;
  
  const conversions = abState.conversions[testId];
  if (!conversions) return;
  
  const [v1, v2] = test.variants;
  const data1 = conversions[v1.id];
  const data2 = conversions[v2.id];
  
  if (!data1 || !data2) return;
  if (data1.views < 50 || data2.views < 50) return;
  
  // Simple z-test
  const p1 = data1.conversions / data1.views;
  const p2 = data2.conversions / data2.views;
  const n1 = data1.views;
  const n2 = data2.views;
  
  const p = (data1.conversions + data2.conversions) / (n1 + n2);
  const se = Math.sqrt(p * (1 - p) * (1/n1 + 1/n2));
  
  if (se === 0) return;
  
  const z = Math.abs(p1 - p2) / se;
  const confidence = 1 - 2 * (1 - normalCDF(z));
  
  // Determine winner
  if (confidence >= abFrameworkConfig.statistical.confidenceLevel) {
    const winner = p1 > p2 ? v1 : v2;
    const lift = ((Math.max(p1, p2) - Math.min(p1, p2)) / Math.min(p1, p2) * 100).toFixed(1);
    
    // Show result badge
    showWinnerBadge(test, winner, lift, confidence);
  }
}

/**
 * Normal CDF approximation
 */
function normalCDF(z) {
  const a1 =  0.254829592;
  const a2 = -0.284496736;
  const a3 =  1.284496736;
  const a4 = -1.338516976;
  const a5 =  1.468178919;
  
  const t = 1 / (1 + 0.2316419 * Math.abs(z));
  const poly = a1 * t + a2 * Math.pow(t, 2) + a3 * Math.pow(t, 3) + a4 * Math.pow(t, 4) + a5 * Math.pow(t, 5);
  const m = Math.exp(-Math.pow(z, 2) / 2) / Math.sqrt(2 * Math.PI);
  
  return 1 - m * poly;
}

/**
 * Show winner badge
 */
function showWinnerBadge(test, winner, lift, confidence) {
  const existing = document.querySelector('.ab-result-badge');
  if (existing) return;
  
  const badge = document.createElement('div');
  badge.className = 'ab-result-badge';
  badge.innerHTML = `
    <div class="ab-result-badge__winner">
      <span>🏆</span>
      <div>
        <div class="ab-result-badge__variant-name">${winner.name}</div>
        <div class="ab-result-badge__lift">+${lift}%</div>
      </div>
    </div>
    <div class="ab-result-badge__confidence">
      Konfidenz: ${(confidence * 100).toFixed(0)}%
    </div>
    <div class="significance-meter">
      <div class="significance-meter__bar">
        <div class="significance-meter__fill" style="width: ${confidence * 100}%;"></div>
      </div>
      <span class="significance-meter__label">
        ${confidence >= 0.95 ? '✓ Signifikant' : '⏳ In Progress'}
      </span>
    </div>
    <button class="btn btn--secondary btn--small" style="margin-top: var(--space-3); width: 100%;" onclick="this.parentElement.remove()">
      Schließen
    </button>
  `;
  
  document.body.appendChild(badge);
}

/**
 * Update bandits
 */
function updateBandits() {
  Object.keys(abState.conversions).forEach(testId => {
    const test = abFrameworkConfig.tests.find(t => t.id === testId);
    if (!test) return;
    
    // Re-balance weights based on performance
    const conversions = abState.conversions[testId];
    let totalViews = 0;
    
    test.variants.forEach(v => {
      if (conversions[v.id]) {
        totalViews += conversions[v.id].views;
      }
    });
    
    if (totalViews > 50) {
      test.variants.forEach(v => {
        const data = conversions[v.id];
        if (data && data.views > 0) {
          v.weight = data.views / totalViews;
        }
      });
    }
  });
}

/**
 * Create test selector
 */
function createTestSelector() {
  const selector = document.createElement('div');
  selector.className = 'ab-test-variant-selector';
  selector.innerHTML = `
    <div class="ab-test-variant-selector__header">
      🧪 A/B Tests
    </div>
    <div class="ab-test-variant-selector__tests">
      ${abFrameworkConfig.tests.map(test => {
        const assignment = abState.assignments[test.id];
        return `
          <div class="ab-test-item">
            <div class="ab-test-item__name">${test.name}</div>
            <div class="ab-test-item__variants">
              ${test.variants.map(v => `
                <button 
                  class="ab-test-variant-btn ${assignment?.variantId === v.id ? 'active' : ''}"
                  onclick="forceVariant('${test.id}', '${v.id}')"
                >
                  ${v.id}: ${v.name}
                </button>
              `).join('')}
            </div>
          </div>
        `;
      }).join('')}
    </div>
    <div style="margin-top: var(--space-3);">
      <span class="bandit-indicator">🎰 Bandit Active</span>
    </div>
  `;
  
  document.body.appendChild(selector);
}

/**
 * Force variant
 */
function forceVariant(testId, variantId) {
  abState.assignments[testId] = {
    variantId,
    userId: getUserId(),
    assignedAt: Date.now(),
    forced: true
  };
  
  saveTestState();
  
  // Re-apply
  applyVariants();
  
  // Reload to apply
  location.reload();
}

/**
 * Get test results
 */
function getTestResults() {
  const results = {};
  
  abFrameworkConfig.tests.forEach(test => {
    const conversions = abState.conversions[test.id];
    if (!conversions) return;
    
    const testResults = {
      testId: test.id,
      testName: test.name,
      variants: test.variants.map(v => ({
        id: v.id,
        views: conversions[v.id]?.views || 0,
        conversions: conversions[v.id]?.conversions || 0,
        ctr: conversions[v.id]?.views 
          ? (conversions[v.id].conversions / conversions[v.id].views * 100).toFixed(2) + '%'
          : '0%'
      })),
      totalViews: Object.values(conversions).reduce((sum, v) => sum + v.views, 0)
    };
    
    results[test.id] = testResults;
  });
  
  return results;
}

// Export for global use
window.abFrameworkConfig = abFrameworkConfig;
window.abState = abState;
window.forceVariant = forceVariant;
window.getTestResults = getTestResults;