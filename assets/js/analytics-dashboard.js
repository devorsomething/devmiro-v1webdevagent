/* Advanced Analytics Dashboard JavaScript */

document.addEventListener('DOMContentLoaded', function() {
  initAnalyticsDashboard();
});

/**
 * Analytics Configuration
 */
const analyticsConfig = {
  // Data refresh interval (ms)
  refreshInterval: 30000,
  
  // Chart colors
  colors: {
    primary: '#3B82F6',
    secondary: '#8B5CF6',
    success: '#22C55E',
    warning: '#F59E0B',
    danger: '#EF4444'
  },
  
  // Time periods
  periods: [
    { id: '7d', name: { de: '7 Tage', en: '7 Days' }, days: 7 },
    { id: '30d', name: { de: '30 Tage', en: '30 Days' }, days: 30 },
    { id: '90d', name: { de: '90 Tage', en: '90 Days' }, days: 90 },
    { id: '365d', name: { de: '1 Jahr', en: '1 Year' }, days: 365 }
  ],
  
  // A/B Tests
  abTests: [
    {
      id: 'hero-cta',
      name: 'Hero CTA Text',
      variants: ['Jetzt anfragen', 'Kostenlos beraten'],
      metrics: { control: 3.2, treatment: 4.1 }
    },
    {
      id: 'pricing-layout',
      name: 'Preis-Tabelle Layout',
      variants: ['Karten', 'Tabellen'],
      metrics: { control: 2.8, treatment: 3.5 }
    }
  ]
};

/**
 * Analytics State
 */
let analyticsState = {
  visitors: 0,
  pageviews: 0,
  avgSessionDuration: 0,
  bounceRate: 0,
  conversions: 0,
  conversionRate: 0,
  revenue: 0,
  topPages: [],
  trafficSources: [],
  conversionFunnel: [],
  timeSeriesData: []
};

/**
 * Get current language
 */
function getAnalyticsLang() {
  return window.getCurrentLang ? window.getCurrentLang() : 'de';
}

/**
 * Initialize analytics dashboard
 */
function initAnalyticsDashboard() {
  const container = document.getElementById('analytics-dashboard');
  if (!container) return;
  
  // Load mock data
  loadMockData();
  
  // Render dashboard
  renderAnalyticsDashboard();
  
  // Initialize charts
  setTimeout(() => {
    initCharts();
  }, 500);
  
  // Set up auto-refresh
  setInterval(refreshAnalytics, analyticsConfig.refreshInterval);
}

/**
 * Load mock data
 */
function loadMockData() {
  // Simulate data (in production, connect to analytics API)
  analyticsState = {
    visitors: 12453,
    pageviews: 34291,
    avgSessionDuration: 185,
    bounceRate: 42.3,
    conversions: 287,
    conversionRate: 2.3,
    revenue: 47850,
    topPages: [
      { path: '/', views: 8234, bounceRate: 38 },
      { path: '/services', views: 5421, bounceRate: 45 },
      { path: '/pricing', views: 3892, bounceRate: 32 },
      { path: '/contact', views: 2109, bounceRate: 28 },
      { path: '/about', views: 1876, bounceRate: 51 }
    ],
    trafficSources: [
      { source: 'Google', sessions: 5234, percent: 42 },
      { source: 'Direct', sessions: 2845, percent: 23 },
      { source: 'Social', sessions: 1892, percent: 15 },
      { source: 'Referral', sessions: 1456, percent: 12 },
      { source: 'Email', sessions: 1026, percent: 8 }
    ],
    conversionFunnel: [
      { stage: 'Visitors', count: 12453, rate: 100 },
      { stage: 'Engaged', count: 8923, rate: 72 },
      { stage: 'Considered', count: 3421, rate: 27 },
      { stage: 'Converted', count: 287, rate: 2.3 }
    ],
    timeSeriesData: generateTimeSeriesData(30)
  };
}

/**
 * Generate time series data
 */
function generateTimeSeriesData(days) {
  const data = [];
  const now = new Date();
  
  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);
    
    data.push({
      date: date.toISOString().split('T')[0],
      visitors: Math.floor(Math.random() * 300) + 400,
      pageviews: Math.floor(Math.random() * 800) + 1000,
      conversions: Math.floor(Math.random() * 15) + 5
    });
  }
  
  return data;
}

/**
 * Render analytics dashboard
 */
function renderAnalyticsDashboard() {
  const container = document.getElementById('analytics-dashboard');
  if (!container) return;
  
  const lang = getAnalyticsLang();
  
  container.innerHTML = `
    <section class="analytics-dashboard">
      <div class="container">
        <div class="analytics-dashboard__header">
          <h2 class="section__title">📊 ${lang === 'de' ? 'Analytics Dashboard' : 'Analytics Dashboard'}</h2>
          <div style="display: flex; gap: var(--space-3);">
            <select class="form-select" id="analytics-period" onchange="changeAnalyticsPeriod()">
              ${analyticsConfig.periods.map(p => `
                <option value="${p.id}">${p.name[lang] || p.name.de}</option>
              `).join('')}
            </select>
            <button class="btn btn--secondary" onclick="exportAnalytics()">
              📥 ${lang === 'de' ? 'Exportieren' : 'Export'}
            </button>
          </div>
        </div>
        
        <!-- KPIs -->
        <div class="analytics-dashboard__kpis">
          ${renderKPI('Besucher', analyticsState.visitors.toLocaleString(), '+12%', true, '👥')}
          ${renderKPI('Seitenaufrufe', analyticsState.pageviews.toLocaleString(), '+8%', true, '📄')}
          ${renderKPI('Conversion Rate', analyticsState.conversionRate + '%', '+0.3%', true, '🎯')}
          ${renderKPI('Umsatz', '€' + analyticsState.revenue.toLocaleString(), '+15%', true, '💰')}
        </div>
        
        <!-- Charts -->
        <div class="analytics-charts">
          <div class="analytics-chart">
            <div class="analytics-chart__header">
              <span class="analytics-chart__title">📈 ${lang === 'de' ? 'Besucher-Trend' : 'Visitor Trend'}</span>
              <span class="analytics-chart__period">30 ${lang === 'de' ? 'Tage' : 'Days'}</span>
            </div>
            <div class="analytics-chart__canvas">
              <canvas id="visitors-chart"></canvas>
            </div>
          </div>
          
          <div class="analytics-chart">
            <div class="analytics-chart__header">
              <span class="analytics-chart__title">🍕 ${lang === 'de' ? 'Traffic Quellen' : 'Traffic Sources'}</span>
              <span class="analytics-chart__period">${lang === 'de' ? 'Verteilung' : 'Distribution'}</span>
            </div>
            <div class="analytics-chart__canvas">
              <canvas id="sources-chart"></canvas>
            </div>
          </div>
        </div>
        
        <!-- Conversion Funnel -->
        <div class="analytics-chart">
          <div class="analytics-chart__header">
            <span class="analytics-chart__title">漏 ${lang === 'de' ? 'Conversion Funnel' : 'Conversion Funnel'}</span>
          </div>
          <div class="funnel-chart">
            ${analyticsState.conversionFunnel.map((step, i) => `
              <div class="funnel-step">
                <span class="funnel-step__label">${step.stage}</span>
                <div class="funnel-step__bar" style="width: ${step.rate}%;">
                  ${step.count.toLocaleString()}
                </div>
                <span class="funnel-step__value">${step.rate}%</span>
              </div>
            `).join('')}
          </div>
        </div>
        
        <!-- Top Pages Table -->
        <div class="analytics-chart" style="margin-top: var(--space-6);">
          <div class="analytics-chart__header">
            <span class="analytics-chart__title">📑 ${lang === 'de' ? 'Top Seiten' : 'Top Pages'}</span>
          </div>
          <table class="conversion-table">
            <thead>
              <tr>
                <th>${lang === 'de' ? 'Seite' : 'Page'}</th>
                <th>${lang === 'de' ? 'Aufrufe' : 'Views'}</th>
                <th>${lang === 'de' ? 'Absprungrate' : 'Bounce Rate'}</th>
              </tr>
            </thead>
            <tbody>
              ${analyticsState.topPages.map(page => `
                <tr>
                  <td>${page.path}</td>
                  <td>${page.views.toLocaleString()}</td>
                  <td>
                    <div style="display: flex; align-items: center; gap: var(--space-2);">
                      <div class="conversion-table__bar" style="width: 100px;">
                        <div class="conversion-table__bar-fill" style="width: ${page.bounceRate}%;"></div>
                      </div>
                      <span>${page.bounceRate}%</span>
                    </div>
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
        
        <!-- A/B Test Results -->
        <div class="analytics-chart" style="margin-top: var(--space-6);">
          <div class="analytics-chart__header">
            <span class="analytics-chart__title">🧪 ${lang === 'de' ? 'A/B Test Ergebnisse' : 'A/B Test Results'}</span>
          </div>
          ${analyticsConfig.abTests.map(test => {
            const control = test.metrics.control;
            const treatment = test.metrics.treatment;
            const lift = ((treatment - control) / control * 100).toFixed(1);
            const isPositive = treatment > control;
            
            return `
              <div style="margin-bottom: var(--space-4); padding: var(--space-4); background: var(--color-background-secondary); border-radius: var(--radius-lg);">
                <h4 style="margin-bottom: var(--space-3);">${test.name}</h4>
                <div class="ab-results">
                  <div class="ab-variant">
                    <div class="ab-variant__label">A (${test.variants[0]})</div>
                    <div class="ab-variant__metric">${control}%</div>
                    <span class="ab-variant__lift">Control</span>
                  </div>
                  <div class="ab-variant">
                    <div class="ab-variant__label">B (${test.variants[1]})</div>
                    <div class="ab-variant__metric">${treatment}%</div>
                    <span class="ab-variant__lift ${isPositive ? 'positive' : 'negative'}">
                      ${isPositive ? '+' : ''}${lift}%
                    </span>
                  </div>
                </div>
              </div>
            `;
          }).join('')}
        </div>
        
        <!-- ROI Calculator -->
        <div class="roi-calculator">
          <div class="roi-calculator__header">
            <h3>💰 ROI Calculator</h3>
          </div>
          <div class="roi-calculator__inputs">
            <div class="roi-calculator__input">
              <label>${lang === 'de' ? 'Monatliche Besucher' : 'Monthly Visitors'}</label>
              <input type="number" id="roi-visitors" value="10000" onchange="calculateROI()">
            </div>
            <div class="roi-calculator__input">
              <label>${lang === 'de' ? 'Conversion Rate (%)' : 'Conversion Rate (%)'}</label>
              <input type="number" id="roi-conversion" value="2.5" step="0.1" onchange="calculateROI()">
            </div>
            <div class="roi-calculator__input">
              <label>${lang === 'de' ? 'Durchschn. Auftragswert (€)' : 'Avg. Order Value (€)'}</label>
              <input type="number" id="roi-aov" value="500" onchange="calculateROI()">
            </div>
          </div>
          <div class="roi-calculator__results" id="roi-results">
            <div class="roi-calculator__result">
              <div class="roi-calculator__result-label">${lang === 'de' ? 'Conversions/Monat' : 'Conversions/Month'}</div>
              <div class="roi-calculator__result-value" id="roi-conversions">250</div>
            </div>
            <div class="roi-calculator__result">
              <div class="roi-calculator__result-label">${lang === 'de' ? 'Umsatz/Monat' : 'Revenue/Month'}</div>
              <div class="roi-calculator__result-value" id="roi-revenue">€125,000</div>
            </div>
            <div class="roi-calculator__result">
              <div class="roi-calculator__result-label">${lang === 'de' ? 'Umsatz/Jahr' : 'Revenue/Year'}</div>
              <div class="roi-calculator__result-value" id="roi-annual">€1.5M</div>
            </div>
            <div class="roi-calculator__result">
              <div class="roi-calculator__result-label">${lang === 'de' ? 'ROI (3 Jahre)' : 'ROI (3 Years)'}</div>
              <div class="roi-calculator__result-value" id="roi-total">450%</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  `;
}

/**
 * Render KPI card
 */
function renderKPI(label, value, change, positive, icon) {
  return `
    <div class="analytics-kpi">
      <div class="analytics-kpi__icon">${icon}</div>
      <div class="analytics-kpi__label">${label}</div>
      <div class="analytics-kpi__value">${value}</div>
      <div class="analytics-kpi__change ${positive ? 'positive' : 'negative'}">
        ${positive ? '↑' : '↓'} ${change}
      </div>
    </div>
  `;
}

/**
 * Initialize charts
 */
function initCharts() {
  // Visitors Chart (Line)
  const visitorsCanvas = document.getElementById('visitors-chart');
  if (visitorsCanvas && typeof Chart !== 'undefined') {
    new Chart(visitorsCanvas, {
      type: 'line',
      data: {
        labels: analyticsState.timeSeriesData.map(d => d.date.slice(5)),
        datasets: [{
          label: 'Besucher',
          data: analyticsState.timeSeriesData.map(d => d.visitors),
          borderColor: '#3B82F6',
          backgroundColor: 'rgba(59, 130, 246, 0.1)',
          fill: true,
          tension: 0.4
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false } }
      }
    });
  }
  
  // Sources Chart (Doughnut)
  const sourcesCanvas = document.getElementById('sources-chart');
  if (sourcesCanvas && typeof Chart !== 'undefined') {
    new Chart(sourcesCanvas, {
      type: 'doughnut',
      data: {
        labels: analyticsState.trafficSources.map(s => s.source),
        datasets: [{
          data: analyticsState.trafficSources.map(s => s.percent),
          backgroundColor: ['#3B82F6', '#8B5CF6', '#22C55E', '#F59E0B', '#EF4444']
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false
      }
    });
  }
}

/**
 * Change analytics period
 */
function changeAnalyticsPeriod() {
  const period = document.getElementById('analytics-period').value;
  const days = analyticsConfig.periods.find(p => p.id === period)?.days || 30;
  
  // Reload data for period
  analyticsState.timeSeriesData = generateTimeSeriesData(days);
  
  // Re-render charts
  initCharts();
  
  showToast(`Zeitraum: ${days} Tage`, 'info');
}

/**
 * Refresh analytics
 */
function refreshAnalytics() {
  // Update data
  loadMockData();
  
  // Update KPIs
  console.log('Analytics refreshed:', analyticsState);
}

/**
 * Export analytics data
 */
function exportAnalytics() {
  const lang = getAnalyticsLang();
  
  const data = {
    date: new Date().toISOString(),
    summary: {
      visitors: analyticsState.visitors,
      pageviews: analyticsState.pageviews,
      conversions: analyticsState.conversions,
      revenue: analyticsState.revenue
    },
    timeSeries: analyticsState.timeSeriesData,
    topPages: analyticsState.topPages,
    trafficSources: analyticsState.trafficSources,
    funnel: analyticsState.conversionFunnel
  };
  
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'devmiro-analytics-' + new Date().toISOString().split('T')[0] + '.json';
  a.click();
  URL.revokeObjectURL(url);
  
  showToast(lang === 'de' ? 'Analytics exportiert' : 'Analytics exported', 'success');
}

/**
 * Calculate ROI
 */
function calculateROI() {
  const visitors = parseInt(document.getElementById('roi-visitors').value) || 0;
  const conversionRate = parseFloat(document.getElementById('roi-conversion').value) / 100 || 0;
  const aov = parseInt(document.getElementById('roi-aov').value) || 0;
  
  const conversions = Math.round(visitors * conversionRate);
  const monthlyRevenue = conversions * aov;
  const annualRevenue = monthlyRevenue * 12;
  const threeYearRevenue = annualRevenue * 3;
  
  // Assume website cost of €15,000
  const websiteCost = 15000;
  const roi = ((threeYearRevenue - websiteCost) / websiteCost * 100).toFixed(0);
  
  document.getElementById('roi-conversions').textContent = conversions.toLocaleString();
  document.getElementById('roi-revenue').textContent = '€' + monthlyRevenue.toLocaleString();
  document.getElementById('roi-annual').textContent = '€' + (annualRevenue / 1000000 > 1 ? (annualRevenue / 1000000).toFixed(1) + 'M' : annualRevenue.toLocaleString());
  document.getElementById('roi-total').textContent = roi + '%';
}

/**
 * Get analytics summary
 */
function getAnalyticsSummary() {
  return {
    ...analyticsState,
    timestamp: Date.now()
  };
}

// Export for global use
window.analyticsConfig = analyticsConfig;
window.analyticsState = analyticsState;
window.changeAnalyticsPeriod = changeAnalyticsPeriod;
window.refreshAnalytics = refreshAnalytics;
window.exportAnalytics = exportAnalytics;
window.calculateROI = calculateROI;
window.getAnalyticsSummary = getAnalyticsSummary;