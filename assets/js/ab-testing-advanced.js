/* Advanced A/B Testing with Statistical Significance */

document.addEventListener('DOMContentLoaded', function() {
  initAdvancedABTesting();
});

/**
 * Advanced A/B Testing Configuration
 */
const advancedABConfig = {
  // Minimum sample size per variant before calculating significance
  minSampleSize: 100,
  
  // Confidence level required (95% by default)
  confidenceLevel: 0.95,
  
  // Enable debug mode with ?ab_debug
  debugMode: new URLSearchParams(window.location.search).has('ab_debug'),
  
  // Active tests configuration
  tests: [
    {
      id: 'hero-cta-test',
      name: 'Hero CTA Text',
      variants: {
        control: { weight: 50, value: 'Kontakt aufnehmen' },
        variant_a: { weight: 50, value: 'Kostenloses Angebot' }
      },
      goal: 'cta_click',
      status: 'running',
      startDate: '2024-01-01',
      impressions: { control: 0, variant_a: 0 },
      conversions: { control: 0, variant_a: 0 }
    },
    {
      id: 'pricing-layout-test',
      name: 'Pricing Card Layout',
      variants: {
        control: { weight: 50, value: 'horizontal' },
        variant_a: { weight: 50, value: 'vertical' }
      },
      goal: 'pricing_view',
      status: 'running',
      startDate: '2024-01-15',
      impressions: { control: 0, variant_a: 0 },
      conversions: { control: 0, variant_a: 0 }
    },
    {
      id: 'testimonial-position-test',
      name: 'Testimonial Position',
      variants: {
        control: { weight: 50, value: 'after-pricing' },
        variant_a: { weight: 50, value: 'before-pricing' }
      },
      goal: 'testimonial_view',
      status: 'running',
      startDate: '2024-02-01',
      impressions: { control: 0, variant_a: 0 },
      conversions: { control: 0, variant_a: 0 }
    }
  ]
};

/**
 * Statistical Functions
 */

/**
 * Calculate Z-score for two proportions
 */
function calculateZScore(convA, visitsA, convB, visitsB) {
  if (visitsA === 0 || visitsB === 0) return 0;
  
  const p1 = convA / visitsA;
  const p2 = convB / visitsB;
  const pPooled = (convA + convB) / (visitsA + visitsB);
  
  if (pPooled === 0 || pPooled === 1) return 0;
  
  const se = Math.sqrt(pPooled * (1 - pPooled) * (1 / visitsA + 1 / visitsB));
  if (se === 0) return 0;
  
  return (p1 - p2) / se;
}

/**
 * Calculate p-value from z-score (two-tailed)
 */
function calculatePValue(zScore) {
  // Approximation using error function
  const absZ = Math.abs(zScore);
  const t = 1 / (1 + 0.2316419 * absZ);
  const d = 0.3989423 * Math.exp(-absZ * absZ / 2);
  const p = d * t * (0.3193815 + t * (-0.3565638 + t * (1.781478 + t * (-1.821256 + t * 1.330274))));
  return 2 * (absZ > 0 ? p : 1 - p);
}

/**
 * Check if result is statistically significant
 */
function isSignificant(pValue, confidenceLevel = 0.95) {
  return pValue < (1 - confidenceLevel);
}

/**
 * Get confidence interval for conversion rate
 */
function getConfidenceInterval(convRate, visits, confidenceLevel = 0.95) {
  if (visits === 0) return { lower: 0, upper: 0 };
  
  const z = confidenceLevel === 0.95 ? 1.96 : 2.576; // 95% or 99%
  const se = Math.sqrt((convRate * (1 - convRate)) / visits);
  
  return {
    lower: convRate - z * se,
    upper: convRate + z * se
  };
}

/**
 * Calculate required sample size for significance
 */
function calculateRequiredSampleSize(baselineRate, minimumDetectableEffect, confidenceLevel = 0.95, power = 0.8) {
  const zAlpha = confidenceLevel === 0.95 ? 1.96 : 2.576;
  const zBeta = 0.84; // 80% power
  
  const p1 = baselineRate;
  const p2 = baselineRate * (1 + minimumDetectableEffect);
  
  const pAvg = (p1 + p2) / 2;
  
  const n = Math.ceil(
    2 * Math.pow(zAlpha + zBeta, 2) * pAvg * (1 - pAvg) / Math.pow(p1 - p2, 2)
  );
  
  return n;
}

/**
 * A/B Testing Class
 */
class ABTestEngine {
  constructor(config) {
    this.config = config;
    this.currentUserVariant = this.getOrAssignVariant();
    this.storageKey = 'devmiro-ab-tests';
    this.loadTestData();
  }
  
  /**
   * Load saved test data from localStorage
   */
  loadTestData() {
    const saved = localStorage.getItem(this.storageKey);
    if (saved) {
      try {
        const data = JSON.parse(saved);
        // Merge saved data with config
        this.config.tests.forEach(test => {
          if (data[test.id]) {
            test.impressions = data[test.id].impressions || test.impressions;
            test.conversions = data[test.id].conversions || test.conversions;
          }
        });
      } catch (e) {
        console.log('Could not load A/B test data');
      }
    }
  }
  
  /**
   * Save test data to localStorage
   */
  saveTestData() {
    const data = {};
    this.config.tests.forEach(test => {
      data[test.id] = {
        impressions: test.impressions,
        conversions: test.conversions
      };
    });
    localStorage.setItem(this.storageKey, JSON.stringify(data));
  }
  
  /**
   * Get or assign variant for current user
   */
  getOrAssignVariant() {
    const variantKey = 'devmiro-variant-assignment';
    const saved = localStorage.getItem(variantKey);
    
    if (saved) {
      return JSON.parse(saved);
    }
    
    const assignments = {};
    this.config.tests.forEach(test => {
      const rand = Math.random() * 100;
      let cumulative = 0;
      
      for (const [variantId, variant] of Object.entries(test.variants)) {
        cumulative += variant.weight;
        if (rand < cumulative) {
          assignments[test.id] = variantId;
          break;
        }
      }
    });
    
    localStorage.setItem(variantKey, JSON.stringify(assignments));
    return assignments;
  }
  
  /**
   * Get variant for a specific test
   */
  getVariant(testId) {
    return this.currentUserVariant[testId];
  }
  
  /**
   * Track impression for a test
   */
  trackImpression(testId) {
    const test = this.config.tests.find(t => t.id === testId);
    if (!test || test.status !== 'running') return;
    
    const variant = this.getVariant(testId);
    if (variant) {
      test.impressions[variant]++;
      this.saveTestData();
    }
    
    if (this.config.debugMode) {
      console.log(`[A/B Test] Impression: ${testId} - ${variant}`);
    }
  }
  
  /**
   * Track conversion for a test
   */
  trackConversion(testId, value = 1) {
    const test = this.config.tests.find(t => t.id === testId);
    if (!test || test.status !== 'running') return;
    
    const variant = this.getVariant(testId);
    if (variant) {
      test.conversions[variant] += value;
      this.saveTestData();
    }
    
    if (this.config.debugMode) {
      console.log(`[A/B Test] Conversion: ${testId} - ${variant} - Value: ${value}`);
    }
  }
  
  /**
   * Get analysis for a specific test
   */
  getTestAnalysis(testId) {
    const test = this.config.tests.find(t => t.id === testId);
    if (!test) return null;
    
    const variants = Object.keys(test.variants);
    const controlVariant = variants[0];
    const treatmentVariant = variants[1];
    
    const controlVisits = test.impressions[controlVariant];
    const treatmentVisits = test.impressions[treatmentVariant];
    const controlConversions = test.conversions[controlVariant];
    const treatmentConversions = test.conversions[treatmentVariant];
    
    const controlRate = controlVisits > 0 ? controlConversions / controlVisits : 0;
    const treatmentRate = treatmentVisits > 0 ? treatmentConversions / treatmentVisits : 0;
    
    const zScore = calculateZScore(controlConversions, controlVisits, treatmentConversions, treatmentVisits);
    const pValue = calculatePValue(zScore);
    const significant = isSignificant(pValue, this.config.confidenceLevel);
    
    const controlCI = getConfidenceInterval(controlRate, controlVisits);
    const treatmentCI = getConfidenceInterval(treatmentRate, treatmentVisits);
    
    const totalSampleSize = controlVisits + treatmentVisits;
    const requiredSampleSize = calculateRequiredSampleSize(controlRate, 0.1); // 10% MDE
    
    const lift = controlRate > 0 ? ((treatmentRate - controlRate) / controlRate) * 100 : 0;
    
    return {
      testId: test.id,
      testName: test.name,
      status: test.status,
      startDate: test.startDate,
      control: {
        variant: controlVariant,
        visits: controlVisits,
        conversions: controlConversions,
        rate: controlRate,
        ci: controlCI
      },
      treatment: {
        variant: treatmentVariant,
        visits: treatmentVisits,
        conversions: treatmentConversions,
        rate: treatmentRate,
        ci: treatmentCI
      },
      statistics: {
        zScore,
        pValue,
        significant,
        lift,
        totalSampleSize,
        requiredSampleSize,
        hasEnoughSamples: totalSampleSize >= this.config.minSampleSize * 2
      },
      winner: significant ? (treatmentRate > controlRate ? treatmentVariant : controlVariant) : null
    };
  }
  
  /**
   * Get all test analyses
   */
  getAllAnalyses() {
    return this.config.tests.map(test => this.getTestAnalysis(test.id));
  }
  
  /**
   * Render test indicator (debug mode)
   */
  renderDebugIndicator() {
    if (!this.config.debugMode) return;
    
    const analyses = this.getAllAnalyses();
    
    const indicator = document.createElement('div');
    indicator.className = 'ab-test-indicator visible';
    indicator.innerHTML = `
      <span class="ab-test-indicator__dot ab-test-indicator__dot--running"></span>
      <span>A/B Debug Mode</span>
      <button onclick="window.abTestEngine.toggleDebugPanel()" style="margin-left: 8px; background: white; border: none; padding: 2px 8px; border-radius: 4px; cursor: pointer;">
        Toggle Panel
      </button>
    `;
    
    document.body.appendChild(indicator);
    
    // Create debug panel
    this.renderDebugPanel(analyses);
  }
  
  /**
   * Render debug panel
   */
  renderDebugPanel(analyses) {
    const panel = document.createElement('div');
    panel.id = 'ab-debug-panel';
    panel.style.cssText = `
      position: fixed;
      top: 10px;
      left: 10px;
      width: 400px;
      max-height: 80vh;
      background: white;
      border-radius: 8px;
      box-shadow: 0 4px 20px rgba(0,0,0,0.2);
      padding: 16px;
      z-index: 10000;
      overflow-y: auto;
      display: none;
      color: #333;
      font-size: 12px;
    `;
    
    panel.innerHTML = `
      <h3 style="margin: 0 0 16px 0;">A/B Test Debug Panel</h3>
      ${analyses.map(analysis => `
        <div style="margin-bottom: 16px; padding: 12px; background: #f5f5f5; border-radius: 6px;">
          <div style="font-weight: bold; margin-bottom: 8px;">${analysis.testName}</div>
          <div style="display: flex; justify-content: space-between;">
            <div>
              <div style="color: #666;">Control (${analysis.control.variant})</div>
              <div>Visits: ${analysis.control.visits}</div>
              <div>Conv: ${analysis.control.conversions}</div>
              <div>Rate: ${(analysis.control.rate * 100).toFixed(2)}%</div>
            </div>
            <div>
              <div style="color: #666;">Treatment (${analysis.treatment.variant})</div>
              <div>Visits: ${analysis.treatment.visits}</div>
              <div>Conv: ${analysis.treatment.conversions}</div>
              <div>Rate: ${(analysis.treatment.rate * 100).toFixed(2)}%</div>
            </div>
          </div>
          <div style="margin-top: 8px; padding: 8px; background: ${analysis.statistics.significant ? '#d4edda' : '#fff3cd'}; border-radius: 4px;">
            <div>Z-Score: ${analysis.statistics.zScore.toFixed(4)}</div>
            <div>P-Value: ${analysis.statistics.pValue.toFixed(4)}</div>
            <div>Significant: ${analysis.statistics.significant ? '✅ YES' : '❌ NO'}</div>
            ${analysis.winner ? `<div>Winner: ${analysis.winner}</div>` : ''}
          </div>
        </div>
      `).join('')}
    `;
    
    document.body.appendChild(panel);
  }
  
  /**
   * Toggle debug panel
   */
  toggleDebugPanel() {
    const panel = document.getElementById('ab-debug-panel');
    if (panel) {
      panel.style.display = panel.style.display === 'none' ? 'block' : 'none';
    }
  }
}

// Initialize global instance
let abTestEngine = null;

function initAdvancedABTesting() {
  abTestEngine = new ABTestEngine(advancedABConfig);
  window.abTestEngine = abTestEngine;
  
  // Show debug indicator if in debug mode
  abTestEngine.renderDebugIndicator();
  
  // Auto-track impressions for active tests
  document.querySelectorAll('[data-ab-test]').forEach(el => {
    const testId = el.dataset.abTest;
    abTestEngine.trackImpression(testId);
  });
  
  // Track goal events
  document.querySelectorAll('[data-ab-goal]').forEach(el => {
    el.addEventListener('click', () => {
      const goal = el.dataset.abGoal;
      const testId = el.dataset.abTest;
      if (testId && goal) {
        abTestEngine.trackConversion(testId);
      }
    });
  });
  
  // Journey tracking integration
  if (window.journeyTrack) {
    const originalTrack = window.journeyTrack.track.bind(window.journeyTrack);
    window.journeyTrack.track = function(eventName, data) {
      originalTrack(eventName, data);
      
      // Track A/B test conversions for relevant goals
      abTestEngine.config.tests.forEach(test => {
        if (test.goal === eventName) {
          abTestEngine.trackConversion(test.id);
        }
      });
    };
  }
}

// Export
window.ABTestEngine = ABTestEngine;
window.advancedABConfig = advancedABConfig;