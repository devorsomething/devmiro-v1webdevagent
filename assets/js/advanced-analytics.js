/* Advanced Analytics & BI Dashboard JavaScript */

document.addEventListener('DOMContentLoaded', function() {
  initAdvancedAnalytics();
});

/**
 * Advanced Analytics Configuration
 */
const advancedAnalyticsConfig = {
  refreshInterval: 60000,
  dateRange: '30d',
  comparisonEnabled: true,
  
  // KPI Targets
  targets: {
    visitors: 15000,
    conversionRate: 3.0,
    avgSessionDuration: 200,
    bounceRate: 40
  },
  
  // Funnel Steps
  funnelSteps: [
    { name: 'Visitors', key: 'visitors' },
    { name: 'Product Views', key: 'productViews' },
    { name: 'Add to Cart', key: 'addToCart' },
    { name: 'Checkout', key: 'checkout' },
    { name: 'Purchase', key: 'purchase' }
  ],
  
  // Segments
  segments: [
    { id: 'new', name: 'Neue Besucher', color: '#22C55E' },
    { id: 'returning', name: 'Wiederkehrend', color: '#3B82F6' },
    { id: 'engaged', name: 'Engagiert', color: '#8B5CF6' },
    { id: 'vip', name: 'VIP', color: '#F59E0B' }
  ]
};

/**
 * Analytics Data Store
 */
let analyticsData = {
  kpis: {},
  timeSeries: [],
  funnel: [],
  segments: [],
  topPages: [],
  trafficSources: [],
  conversions: {},
  goals: []
};

/**
 * Initialize advanced analytics
 */
function initAdvancedAnalytics() {
  const container = document.getElementById('advanced-analytics');
  if (!container) return;
  
  // Load data
  loadAnalyticsData();
  
  // Render dashboard
  renderAdvancedDashboard();
  
  // Initialize charts
  setTimeout(initAdvancedCharts, 500);
  
  // Set up auto-refresh
  setInterval(refreshAnalyticsData, advancedAnalyticsConfig.refreshInterval);
}

/**
 * Load analytics data
 */
function loadAnalyticsData() {
  // Simulate data (in production, fetch from API)
  analyticsData = {
    kpis: {
      visitors: { value: 12453, change: 12.3, trend: 'up' },
      pageviews: { value: 34291, change: 8.1, trend: 'up' },
      conversionRate: { value: 2.8, change: 0.3, trend: 'up' },
      avgSessionDuration: { value: 185, change: -5.2, trend: 'down' },
      bounceRate: { value: 42.1, change: -3.1, trend: 'up' },
      revenue: { value: 47850, change: 15.2, trend: 'up' }
    },
    timeSeries: generateTimeSeries(30),
    funnel: [
      { name: 'Visitors', count: 12453, rate: 100 },
      { name: 'Product Views', count: 8923, rate: 71.6 },
      { name: 'Add to Cart', count: 3421, rate: 27.5 },
      { name: 'Checkout', count: 1245, rate: 10 },
      { name: 'Purchase', count: 287, rate: 2.3 }
    ],
    segments: [
      { id: 'new', name: 'Neue Besucher', count: 5234, percent: 42 },
      { id: 'returning', name: 'Wiederkehrend', count: 4123, percent: 33 },
      { id: 'engaged', name: 'Engagiert', count: 2456, percent: 20 },
      { id: 'vip', name: 'VIP', count: 640, percent: 5 }
    ],
    topPages: [
      { path: '/', views: 8234, bounce: 38, time: 45 },
      { path: '/services', views: 5421, bounce: 45, time: 120 },
      { path: '/pricing', views: 3892, bounce: 32, time: 90 },
      { path: '/contact', views: 2109, bounce: 28, time: 60 },
      { path: '/about', views: 1876, bounce: 51, time: 30 }
    ],
    trafficSources: [
      { source: 'Google', sessions: 5234, percent: 42 },
      { source: 'Direct', sessions: 2845, percent: 23 },
      { source: 'Social', sessions: 1892, percent: 15 },
      { source: 'Referral', sessions: 1456, percent: 12 },
      { source: 'Email', sessions: 1026, percent: 8 }
    ],
    goals: [
      { name: 'Monatliche Besucher', current: 12453, target: 15000 },
      { name: 'Conversion Rate', current: 2.8, target: 3.0 },
      { name: 'Umsatz', current: 47850, target: 50000 }
    ]
  };
}

/**
 * Generate time series data
 */
function generateTimeSeries(days) {
  const data = [];
  const now = new Date();
  
  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);
    
    data.push({
      date: date.toISOString().split('T')[0],
      visitors: Math.floor(Math.random() * 300) + 350,
      pageviews: Math.floor(Math.random() * 800) + 900,
      conversions: Math.floor(Math.random() * 20) + 8,
      revenue: Math.floor(Math.random() * 2000) + 1500
    });
  }
  
  return data;
}

/**
 * Render advanced dashboard
 */
function renderAdvancedDashboard() {
  const container = document.getElementById('advanced-analytics');
  if (!container) return;
  
  const lang = window.getCurrentLang ? window.getCurrentLang() : 'de';
  
  container.innerHTML = `
    <section class="analytics-dashboard">
      <div class="container">
        <div class="seo-dashboard__header">
          <h2 class="section__title">📊 ${lang === 'de' ? 'Advanced Analytics' : 'Advanced Analytics'}</h2>
          <div class="export-actions">
            <select class="form-select" id="analytics-date-range">
              <option value="7d">7 ${lang === 'de' ? 'Tage' : 'Days'}</option>
              <option value="30d" selected>30 ${lang === 'de' ? 'Tage' : 'Days'}</option>
              <option value="90d">90 ${lang === 'de' ? 'Tage' : 'Days'}</option>
            </select>
            <button class="btn btn--secondary" onclick="exportAdvancedAnalytics()">
              📥 ${lang === 'de' ? 'Exportieren' : 'Export'}
            </button>
          </div>
        </div>
        
        <!-- KPI Grid -->
        <div class="kpi-grid">
          ${renderKPICard('Besucher', analyticsData.kpis.visitors, '👥')}
          ${renderKPICard('Seitenaufrufe', analyticsData.kpis.pageviews, '📄')}
          ${renderKPICard('Conversion Rate', analyticsData.kpis.conversionRate, '🎯', '%')}
          ${renderKPICard('Umsatz', analyticsData.kpis.revenue, '💰', '€')}
          ${renderKPICard('Durchschn. Sitzung', analyticsData.kpis.avgSessionDuration, '⏱️', 's')}
          ${renderKPICard('Absprungrate', analyticsData.kpis.bounceRate, '📊', '%')}
        </div>
        
        <!-- Charts Row -->
        <div class="chart-container">
          <div class="chart-container__header">
            <span class="chart-container__title">📈 ${lang === 'de' ? 'Besucher-Trend' : 'Visitor Trend'}</span>
            <div class="chart-container__actions">
              <button class="btn btn--small btn--secondary active">30T</button>
              <button class="btn btn--small btn--secondary">90T</button>
            </div>
          </div>
          <div class="chart-container__canvas">
            <canvas id="visitors-trend-chart"></canvas>
          </div>
        </div>
        
        <!-- Funnel + Segments -->
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: var(--space-6);">
          <div class="chart-container">
            <div class="chart-container__header">
              <span class="chart-container__title">漏 ${lang === 'de' ? 'Conversion Funnel' : 'Conversion Funnel'}</span>
            </div>
            <div class="funnel-container">
              ${analyticsData.funnel.map((step, i) => `
                <div class="funnel-stage">
                  <span class="funnel-stage__label">${step.name}</span>
                  <div class="funnel-stage__bar" style="width: ${step.rate}%;">
                    ${step.count.toLocaleString()}
                  </div>
                  <span class="funnel-stage__value">${step.rate}%</span>
                </div>
              `).join('')}
            </div>
          </div>
          
          <div class="chart-container">
            <div class="chart-container__header">
              <span class="chart-container__title">👥 ${lang === 'de' ? 'Nutzer-Segmente' : 'User Segments'}</span>
            </div>
            <div class="segment-grid">
              ${analyticsData.segments.map(seg => `
                <div class="segment-card" style="border-left: 4px solid ${seg.color};">
                  <div class="segment-card__name">${seg.name}</div>
                  <div class="segment-card__count">${seg.count.toLocaleString()}</div>
                  <div class="segment-card__percent">${seg.percent}%</div>
                </div>
              `).join('')}
            </div>
          </div>
        </div>
        
        <!-- Top Pages Table -->
        <div class="chart-container">
          <div class="chart-container__header">
            <span class="chart-container__title">📑 ${lang === 'de' ? 'Top Seiten' : 'Top Pages'}</span>
          </div>
          <table class="data-table">
            <thead>
              <tr>
                <th>${lang === 'de' ? 'Seite' : 'Page'}</th>
                <th>${lang === 'de' ? 'Aufrufe' : 'Views'}</th>
                <th>${lang === 'de' ? 'Absprungrate' : 'Bounce'}</th>
                <th>${lang === 'de' ? 'Zeit' : 'Time'}</th>
                <th>${lang === 'de' ? 'Performance' : 'Performance'}</th>
              </tr>
            </thead>
            <tbody>
              ${analyticsData.topPages.map(page => `
                <tr>
                  <td><code>${page.path}</code></td>
                  <td>${page.views.toLocaleString()}</td>
                  <td>${page.bounce}%</td>
                  <td>${page.time}s</td>
                  <td>
                    <div class="data-table__bar">
                      <div class="data-table__bar-fill" style="width: ${100 - page.bounce}%;"></div>
                      <span>${100 - page.bounce}%</span>
                    </div>
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
        
        <!-- Traffic Sources -->
        <div class="chart-container">
          <div class="chart-container__header">
            <span class="chart-container__title">🍕 ${lang === 'de' ? 'Traffic Quellen' : 'Traffic Sources'}</span>
          </div>
          <div class="chart-container__canvas" style="height: 250px;">
            <canvas id="traffic-sources-chart"></canvas>
          </div>
        </div>
        
        <!-- Goal Tracker -->
        <div class="goal-tracker">
          <div class="goal-tracker__header">
            <span class="section__title" style="font-size: 1.25rem;">🎯 ${lang === 'de' ? 'Ziele' : 'Goals'}</span>
          </div>
          ${analyticsData.goals.map(goal => {
            const progress = (goal.current / goal.target * 100).toFixed(0);
            return `
              <div style="margin-bottom: var(--space-4);">
                <div style="display: flex; justify-content: space-between; margin-bottom: var(--space-2);">
                  <span>${goal.name}</span>
                  <span>${goal.current.toLocaleString()} / ${goal.target.toLocaleString()}</span>
                </div>
                <div class="goal-tracker__progress">
                  <div class="goal-tracker__progress-fill" style="width: ${Math.min(progress, 100)}%;"></div>
                  <span class="goal-tracker__progress-text">${progress}%</span>
                </div>
              </div>
            `;
          }).join('')}
        </div>
        
        <!-- Cohort Analysis -->
        <div class="chart-container">
          <div class="chart-container__header">
            <span class="chart-container__title">📊 ${lang === 'de' ? 'Kohortenanalyse' : 'Cohort Analysis'}</span>
          </div>
          <div class="cohort-grid">
            ${generateCohortGrid()}
          </div>
        </div>
      </div>
    </section>
  `;
}

/**
 * Render KPI card
 */
function renderKPICard(label, data, icon, suffix = '') {
  return `
    <div class="kpi-card">
      <div class="kpi-card__icon">${icon}</div>
      <div class="kpi-card__label">${label}</div>
      <div class="kpi-card__value">${data.value.toLocaleString()}${suffix}</div>
      <div class="kpi-card__trend ${data.trend}">
        ${data.trend === 'up' ? '↑' : '↓'} ${Math.abs(data.change)}%
      </div>
    </div>
  `;
}

/**
 * Generate cohort grid
 */
function generateCohortGrid() {
  const cohortData = [
    [100, 85, 70, 55, 42, 38, 35, 33],
    [100, 88, 75, 60, 48, 40, 37, null],
    [100, 82, 68, 52, 40, null, null, null],
    [100, 90, 78, 65, null, null, null, null],
    [100, 85, 72, null, null, null, null, null],
    [100, 88, null, null, null, null, null, null]
  ];
  
  return cohortData.flat().map((value, i) => {
    if (value === null) {
      return '<div class="cohort-cell empty"></div>';
    }
    
    let className = 'empty';
    if (value >= 80) className = 'high';
    else if (value >= 60) className = 'medium';
    else if (value >= 40) className = 'low';
    
    return `<div class="cohort-cell ${className}">${value}%</div>`;
  }).join('');
}

/**
 * Initialize advanced charts
 */
function initAdvancedCharts() {
  // Visitors Trend Line Chart
  const visitorsCanvas = document.getElementById('visitors-trend-chart');
  if (visitorsCanvas && typeof Chart !== 'undefined') {
    new Chart(visitorsCanvas, {
      type: 'line',
      data: {
        labels: analyticsData.timeSeries.map(d => d.date.slice(5)),
        datasets: [
          {
            label: 'Besucher',
            data: analyticsData.timeSeries.map(d => d.visitors),
            borderColor: '#3B82F6',
            backgroundColor: 'rgba(59, 130, 246, 0.1)',
            fill: true,
            tension: 0.4
          },
          {
            label: 'Conversions',
            data: analyticsData.timeSeries.map(d => d.conversions * 20),
            borderColor: '#22C55E',
            backgroundColor: 'transparent',
            borderDash: [5, 5],
            tension: 0.4
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { position: 'top' }
        },
        scales: {
          y: { beginAtZero: false }
        }
      }
    });
  }
  
  // Traffic Sources Doughnut Chart
  const sourcesCanvas = document.getElementById('traffic-sources-chart');
  if (sourcesCanvas && typeof Chart !== 'undefined') {
    new Chart(sourcesCanvas, {
      type: 'doughnut',
      data: {
        labels: analyticsData.trafficSources.map(s => s.source),
        datasets: [{
          data: analyticsData.trafficSources.map(s => s.percent),
          backgroundColor: ['#3B82F6', '#8B5CF6', '#22C55E', '#F59E0B', '#EF4444']
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { position: 'right' }
        }
      }
    });
  }
}

/**
 * Refresh analytics data
 */
function refreshAnalyticsData() {
  loadAnalyticsData();
  console.log('Analytics data refreshed');
}

/**
 * Export advanced analytics
 */
function exportAdvancedAnalytics() {
  const lang = window.getCurrentLang ? window.getCurrentLang() : 'de';
  
  const exportData = {
    exportDate: new Date().toISOString(),
    dateRange: advancedAnalyticsConfig.dateRange,
    kpis: analyticsData.kpis,
    timeSeries: analyticsData.timeSeries,
    funnel: analyticsData.funnel,
    segments: analyticsData.segments,
    topPages: analyticsData.topPages,
    trafficSources: analyticsData.trafficSources,
    goals: analyticsData.goals
  };
  
  const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'devmiro-analytics-' + new Date().toISOString().split('T')[0] + '.json';
  a.click();
  URL.revokeObjectURL(url);
  
  showToast(lang === 'de' ? 'Analytics exportiert' : 'Analytics exported', 'success');
}

/**
 * Get advanced analytics summary
 */
function getAdvancedAnalyticsSummary() {
  return {
    kpis: analyticsData.kpis,
    totalVisitors: analyticsData.kpis.visitors?.value || 0,
    totalRevenue: analyticsData.kpis.revenue?.value || 0,
    conversionRate: analyticsData.kpis.conversionRate?.value || 0,
    timestamp: Date.now()
  };
}

// Export for global use
window.advancedAnalyticsConfig = advancedAnalyticsConfig;
window.analyticsData = analyticsData;
window.exportAdvancedAnalytics = exportAdvancedAnalytics;
window.getAdvancedAnalyticsSummary = getAdvancedAnalyticsSummary;