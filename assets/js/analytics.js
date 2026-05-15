/* Analytics Dashboard JavaScript */

document.addEventListener('DOMContentLoaded', function() {
  initAnalyticsDashboard();
});

/**
 * Analytics Dashboard
 */
function initAnalyticsDashboard() {
  const dashboard = document.querySelector('.analytics-dashboard');
  if (!dashboard) return;

  // Load and render data
  renderDashboard();

  // Set up real-time updates
  setInterval(() => {
    updateRealtimeData();
  }, 30000); // Every 30 seconds
}

function renderDashboard() {
  // Get analytics data
  const data = getAnalyticsData();

  // Render components
  renderStats(data.stats);
  renderTrafficChart(data.traffic);
  renderSourcesChart(data.sources);
  renderFunnelChart(data.funnel);
  renderPagesTable(data.pages);
  renderTopSources(data.sources);
}

function getAnalyticsData() {
  // Mock data - replace with real analytics
  return {
    stats: {
      visitors: { value: 12847, change: 12.5 },
      pageviews: { value: 38921, change: 8.2 },
      bounceRate: { value: 42.3, change: -5.1 },
      avgSession: { value: '3:24', change: 15.3 }
    },
    traffic: {
      labels: ['Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa', 'So'],
      datasets: [
        { label: 'Besucher', data: [1240, 1890, 2100, 2340, 1980, 1450, 890], color: '#3B82F6' },
        { label: 'Seitenaufrufe', data: [3200, 4800, 5400, 6100, 5200, 3900, 2200], color: '#8B5CF6' }
      ]
    },
    sources: [
      { name: 'Google', type: 'Search', value: 4521, color: '#4285F4' },
      { name: 'Direkt', type: 'Direct', value: 2890, color: '#10B981' },
      { name: 'LinkedIn', type: 'Social', value: 1890, color: '#0077B5' },
      { name: 'Empfehlungen', type: 'Referral', value: 1240, color: '#F59E0B' },
      { name: 'Facebook', type: 'Social', value: 890, color: '#1877F2' }
    ],
    funnel: [
      { stage: 'Website-Besucher', value: 12847, percent: 100 },
      { stage: 'Interessiert', value: 4876, percent: 38 },
      { stage: 'Angebot angefragt', value: 892, percent: 7 },
      { stage: 'Kunde geworden', value: 156, percent: 1.2 }
    ],
    pages: [
      { name: 'Startseite', path: '/', views: 8234 },
      { name: 'Websites', path: '/websites.html', views: 4521 },
      { name: 'Kontakt', path: '/contact.html', views: 3892 },
      { name: 'Hosting', path: '/hosting.html', views: 2341 },
      { name: 'Webapps', path: '/webapps.html', views: 1890 }
    ]
  };
}

function renderStats(stats) {
  const container = document.querySelector('.dashboard-stats');
  if (!container) return;

  const items = [
    {
      icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>',
      value: stats.visitors.value.toLocaleString(),
      label: 'Unique Besucher',
      trend: stats.visitors.change,
      color: '#3B82F6'
    },
    {
      icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>',
      value: stats.pageviews.value.toLocaleString(),
      label: 'Seitenaufrufe',
      trend: stats.pageviews.change,
      color: '#8B5CF6'
    },
    {
      icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>',
      value: stats.bounceRate.value + '%',
      label: 'Absprungrate',
      trend: stats.bounceRate.change,
      color: '#F59E0B',
      invertTrend: true
    },
    {
      icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>',
      value: stats.avgSession.value,
      label: 'Ø Sitzungsdauer',
      trend: stats.avgSession.change,
      color: '#10B981'
    }
  ];

  container.innerHTML = items.map(item => `
    <div class="dashboard-stat">
      <div class="dashboard-stat__header">
        <div class="dashboard-stat__icon" style="color: ${item.color}; background: ${item.color}15;">
          ${item.icon}
        </div>
        <div class="dashboard-stat__trend ${item.invertTrend ? (item.trend > 0 ? 'trend--down' : 'trend--up') : (item.trend > 0 ? 'trend--up' : 'trend--down')}">
          ${item.trend > 0 ? '↑' : '↓'} ${Math.abs(item.trend)}%
        </div>
      </div>
      <div class="dashboard-stat__value">${item.value}</div>
      <div class="dashboard-stat__label">${item.label}</div>
    </div>
  `).join('');
}

function renderTrafficChart(traffic) {
  const container = document.querySelector('.traffic-chart');
  if (!container) return;

  const maxValue = Math.max(...traffic.datasets[0].data);

  let bars = traffic.labels.map((label, i) => {
    const value = traffic.datasets[0].data[i];
    const height = (value / maxValue) * 100;
    return `
      <div class="bar-chart__bar">
        <div class="bar-chart__value">${value}</div>
        <div class="bar-chart__fill" style="height: ${height}%; background: ${traffic.datasets[0].color};"></div>
        <div class="bar-chart__label">${label}</div>
      </div>
    `;
  }).join('');

  container.innerHTML = `
    <div class="chart-card">
      <div class="chart-card__header">
        <div>
          <div class="chart-card__title">Traffic Übersicht</div>
          <div class="chart-card__subtitle">Letzte 7 Tage</div>
        </div>
        <div class="chart-card__legend">
          ${traffic.datasets.map(ds => `
            <div class="chart-legend-item">
              <span class="chart-legend-dot" style="background: ${ds.color};"></span>
              ${ds.label}
            </div>
          `).join('')}
        </div>
      </div>
      <div class="bar-chart">${bars}</div>
    </div>
  `;
}

function renderSourcesChart(sources) {
  const container = document.querySelector('.sources-chart');
  if (!container) return;

  const total = sources.reduce((sum, s) => sum + s.value, 0);
  let cumulativePercent = 0;

  const segments = sources.map(source => {
    const percent = (source.value / total) * 100;
    const segment = {
      ...source,
      percent,
      offset: cumulativePercent
    };
    cumulativePercent += percent;
    return segment;
  });

  // SVG donut chart
  const radius = 60;
  const circumference = 2 * Math.PI * radius;
  let svgSegments = '';
  let legendItems = '';

  segments.forEach((seg, i) => {
    const dashArray = `${(seg.percent / 100) * circumference} ${circumference}`;
    const dashOffset = -(seg.offset / 100) * circumference;

    svgSegments += `
      <circle
        class="donut-chart__segment"
        cx="75"
        cy="75"
        r="${radius}"
        fill="none"
        stroke="${seg.color}"
        stroke-width="20"
        stroke-dasharray="${dashArray}"
        stroke-dashoffset="${dashOffset}"
        style="transition: stroke-dasharray 1s ease;"
      />
    `;

    legendItems += `
      <div class="donut-legend-item">
        <div class="donut-legend-item__label">
          <span class="donut-legend-item__color" style="background: ${seg.color};"></span>
          ${seg.name}
        </div>
        <div class="donut-legend-item__value">${seg.value.toLocaleString()}</div>
      </div>
    `;
  });

  container.innerHTML = `
    <div class="chart-card">
      <div class="chart-card__header">
        <div>
          <div class="chart-card__title">Traffic Quellen</div>
          <div class="chart-card__subtitle">Verteilung in %</div>
        </div>
      </div>
      <div class="donut-chart">
        <div class="donut-chart__visual">
          <svg class="donut-chart__svg" viewBox="0 0 150 150" width="150" height="150">
            <circle cx="75" cy="75" r="${radius}" fill="none" stroke="#E5E7EB" stroke-width="20"/>
            ${svgSegments}
          </svg>
          <div class="donut-chart__center">
            <div class="donut-chart__value">${total.toLocaleString()}</div>
            <div class="donut-chart__label">Total</div>
          </div>
        </div>
        <div class="donut-chart__legend">${legendItems}</div>
      </div>
    </div>
  `;
}

function renderFunnelChart(funnel) {
  const container = document.querySelector('.funnel-chart');
  if (!container) return;

  const maxValue = funnel[0].value;

  const stages = funnel.map((stage, i) => {
    const width = (stage.value / maxValue) * 100;
    const colors = ['#3B82F6', '#6366F1', '#8B5CF6', '#10B981'];
    const color = colors[i] || colors[0];

    return `
      <div class="funnel-chart__stage">
        <div class="funnel-chart__bar" style="width: ${width}%; background: ${color};">
          <span class="funnel-chart__label">${stage.stage}</span>
          <span class="funnel-chart__metric">${stage.value.toLocaleString()}</span>
        </div>
      </div>
    `;
  }).join('');

  container.innerHTML = `
    <div class="chart-card">
      <div class="chart-card__header">
        <div>
          <div class="chart-card__title">Conversion Funnel</div>
          <div class="chart-card__subtitle">Besucher → Kunde</div>
        </div>
      </div>
      <div class="funnel-chart">${stages}</div>
    </div>
  `;
}

function renderPagesTable(pages) {
  const container = document.querySelector('.pages-table');
  if (!container) return;

  const rows = pages.map(page => `
    <tr>
      <td>
        <div class="page-item__name">${page.name}</div>
        <div class="page-item__path">${page.path}</div>
      </td>
      <td>
        <div class="page-item__views">${page.views.toLocaleString()}</div>
      </td>
    </tr>
  `).join('');

  container.innerHTML = `
    <div class="chart-card">
      <div class="chart-card__header">
        <div>
          <div class="chart-card__title">Top Seiten</div>
          <div class="chart-card__subtitle">Meistbesucht</div>
        </div>
      </div>
      <table class="dashboard-table">
        <thead>
          <tr>
            <th>Seite</th>
            <th>Aufrufe</th>
          </tr>
        </thead>
        <tbody>${rows}</tbody>
      </table>
    </div>
  `;
}

function renderTopSources(sources) {
  const container = document.querySelector('.sources-list');
  if (!container) return;

  const items = sources.slice(0, 5).map(source => {
    const iconMap = {
      'Search': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>',
      'Direct': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>',
      'Social': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></svg>',
      'Referral': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>'
    };

    return `
      <div class="source-item">
        <div class="source-item__icon">${iconMap[source.type] || iconMap['Direct']}</div>
        <div class="source-item__info">
          <div class="source-item__name">${source.name}</div>
          <div class="source-item__type">${source.type}</div>
        </div>
        <div class="source-item__value">${source.value.toLocaleString()}</div>
      </div>
    `;
  }).join('');

  container.innerHTML = `
    <div class="chart-card">
      <div class="chart-card__header">
        <div>
          <div class="chart-card__title">Top Quellen</div>
          <div class="chart-card__subtitle">Nach Traffic</div>
        </div>
      </div>
      <div class="source-list">${items}</div>
    </div>
  `;
}

function updateRealtimeData() {
  // Simulate real-time updates
  const visitorsEl = document.querySelector('.dashboard-stat__value');
  if (visitorsEl) {
    const current = parseInt(visitorsEl.textContent.replace(/\D/g, ''));
    const newValue = current + Math.floor(Math.random() * 5);
    visitorsEl.textContent = newValue.toLocaleString();
  }
}

// Export for global use
window.initAnalyticsDashboard = initAnalyticsDashboard;