/* Interactive Sitemap & Content Strategy JavaScript */

document.addEventListener('DOMContentLoaded', function() {
  initSitemap();
});

/**
 * Sitemap Configuration
 */
const sitemapConfig = {
  siteUrl: 'https://devmiro.at',
  lastModified: new Date().toISOString().split('T')[0],
  changeFrequency: 'weekly',
  priority: 0.8,
  
  pages: [
    // Main Pages
    { url: '/', title: 'Home', priority: 1.0, changefreq: 'weekly', status: 'complete' },
    { url: '/services', title: 'Services', priority: 0.9, changefreq: 'weekly', status: 'complete' },
    { url: '/portfolio', title: 'Portfolio', priority: 0.8, changefreq: 'monthly', status: 'complete' },
    { url: '/about', title: 'Über uns', priority: 0.7, changefreq: 'monthly', status: 'complete' },
    { url: '/pricing', title: 'Preise', priority: 0.9, changefreq: 'monthly', status: 'complete' },
    { url: '/contact', title: 'Kontakt', priority: 0.9, changefreq: 'monthly', status: 'complete' },
    { url: '/blog', title: 'Blog', priority: 0.8, changefreq: 'weekly', status: 'complete' },
    
    // Service Pages
    { url: '/services/web-development', title: 'Webentwicklung', priority: 0.9, changefreq: 'monthly', status: 'complete' },
    { url: '/services/ux-design', title: 'UX Design', priority: 0.8, changefreq: 'monthly', status: 'complete' },
    { url: '/services/maintenance', title: 'Wartung & Support', priority: 0.7, changefreq: 'monthly', status: 'complete' },
    { url: '/services/seo', title: 'SEO Optimierung', priority: 0.8, changefreq: 'monthly', status: 'complete' },
    
    // Legal Pages
    { url: '/privacy', title: 'Datenschutz', priority: 0.5, changefreq: 'yearly', status: 'complete' },
    { url: '/impressum', title: 'Impressum', priority: 0.5, changefreq: 'yearly', status: 'complete' },
    { url: '/terms', title: 'AGB', priority: 0.5, changefreq: 'yearly', status: 'pending' },
    
    // Content Pages
    { url: '/blog/web-design-trends-2025', title: 'Web Design Trends 2025', priority: 0.6, changefreq: 'monthly', status: 'planned' },
    { url: '/blog/seo-checklist', title: 'SEO Checkliste', priority: 0.6, changefreq: 'monthly', status: 'planned' },
    { url: '/case-studies/b2b-portal', title: 'B2B Portal Case Study', priority: 0.7, changefreq: 'monthly', status: 'planned' },
    { url: '/case-studies/e-commerce-setup', title: 'E-Commerce Setup', priority: 0.7, changefreq: 'monthly', status: 'planned' },
    
    // Tools
    { url: '/tools/calculator', title: 'Preiskalkulator', priority: 0.8, changefreq: 'monthly', status: 'planned' },
    { url: '/tools/audit', title: 'Website Audit', priority: 0.7, changefreq: 'monthly', status: 'planned' }
  ],
  
  // Content strategy data
  contentStrategy: {
    types: {
      blog: { icon: '📝', count: 24, target: 'monthly' },
      caseStudies: { icon: '📊', count: 12, target: 'quarterly' },
      guides: { icon: '📚', count: 8, target: 'monthly' },
      videos: { icon: '🎬', count: 6, target: 'quarterly' },
      templates: { icon: '📋', count: 4, target: 'monthly' }
    },
    
    topics: [
      'Webentwicklung', 'UX Design', 'SEO', 'Conversion Optimization',
      'E-Commerce', 'Performance', 'Security', 'Hosting'
    ]
  }
};

/**
 * Initialize sitemap
 */
function initSitemap() {
  const container = document.getElementById('sitemap');
  if (!container) return;
  
  renderSitemap();
  generateSitemapXML();
}

/**
 * Render sitemap
 */
function renderSitemap() {
  const container = document.getElementById('sitemap');
  if (!container) return;
  
  const lang = window.getCurrentLang ? window.getCurrentLang() : 'de';
  
  // Group pages by status
  const complete = sitemapConfig.pages.filter(p => p.status === 'complete');
  const pending = sitemapConfig.pages.filter(p => p.status === 'pending');
  const planned = sitemapConfig.pages.filter(p => p.status === 'planned');
  
  container.innerHTML = `
    <section class="sitemap">
      <div class="container">
        <div class="sitemap__container">
          <h2 class="section__title" style="text-align: center; margin-bottom: var(--space-8);">
            🗺️ ${lang === 'de' ? 'Sitemap & Content Strategy' : 'Sitemap & Content Strategy'}
          </h2>
          
          <!-- Sitemap Tree -->
          <div class="sitemap__tree">
            <h3 style="margin-bottom: var(--space-4);">📄 ${lang === 'de' ? 'Seitenstruktur' : 'Page Structure'}</h3>
            
            ${renderSitemapNode('/', 'Home', 'complete', '🏠', 1.0)}
            ${renderSitemapChildren([
              { url: '/services', title: 'Services', status: 'complete' },
              { url: '/portfolio', title: 'Portfolio', status: 'complete' },
              { url: '/about', title: 'Über uns', status: 'complete' },
              { url: '/pricing', title: 'Preise', status: 'complete' },
              { url: '/contact', title: 'Kontakt', status: 'complete' },
              { url: '/blog', title: 'Blog', status: 'complete' }
            ], lang)}
          </div>
          
          <!-- All Pages List -->
          <div style="margin-top: var(--space-8);">
            <h3 style="margin-bottom: var(--space-4);">📋 ${lang === 'de' ? 'Alle Seiten' : 'All Pages'}</h3>
            <div style="display: grid; gap: var(--space-3);">
              ${sitemapConfig.pages.map(page => `
                <a href="${page.url}" class="sitemap__item" style="text-decoration: none; color: inherit;">
                  <div class="sitemap__item-icon">📄</div>
                  <div class="sitemap__item-content">
                    <div class="sitemap__item-title">${page.title}</div>
                    <div class="sitemap__item-desc">${page.url}</div>
                  </div>
                  <div class="sitemap__item-status ${page.status}">
                    ${page.status === 'complete' ? '✓ ' : page.status === 'pending' ? '⏳ ' : '📅 '}
                    ${lang === 'de' 
                      ? (page.status === 'complete' ? 'Fertig' : page.status === 'pending' ? 'In Bearbeitung' : 'Geplant')
                      : (page.status === 'complete' ? 'Complete' : page.status === 'pending' ? 'In Progress' : 'Planned')}
                  </div>
                </a>
              `).join('')}
            </div>
          </div>
          
          <!-- Content Strategy -->
          <div class="content-strategy">
            <h3 class="content-strategy__title">📈 ${lang === 'de' ? 'Content Strategie' : 'Content Strategy'}</h3>
            <div class="content-strategy__grid">
              ${Object.entries(sitemapConfig.contentStrategy.types).map(([key, data]) => `
                <div class="content-strategy__card">
                  <div class="content-strategy__card-icon">${data.icon}</div>
                  <div class="content-strategy__card-title">${
                    lang === 'de' 
                      ? (key === 'blog' ? 'Blog Posts' : key === 'caseStudies' ? 'Case Studies' : key === 'guides' ? 'Guides' : key === 'videos' ? 'Videos' : 'Templates')
                      : key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1')
                  }</div>
                  <div class="content-strategy__card-count">${data.count} ${lang === 'de' ? 'geplant' : 'planned'}</div>
                </div>
              `).join('')}
            </div>
          </div>
          
          <!-- Priority Matrix -->
          <div class="priority-matrix">
            <h3 class="priority-matrix__title">🎯 ${lang === 'de' ? 'Prioritäts-Matrix' : 'Priority Matrix'}</h3>
            <div class="priority-matrix__grid">
              <div class="priority-matrix__cell high">
                <strong>1.0</strong>
                <div class="priority-matrix__label">${lang === 'de' ? 'Homepage' : 'Homepage'}</div>
              </div>
              <div class="priority-matrix__cell high">
                <strong>0.9</strong>
                <div class="priority-matrix__label">${lang === 'de' ? 'Services/Kontakt' : 'Services/Contact'}</div>
              </div>
              <div class="priority-matrix__cell medium">
                <strong>0.8</strong>
                <div class="priority-matrix__label">${lang === 'de' ? 'Portfolio/Blog' : 'Portfolio/Blog'}</div>
              </div>
              <div class="priority-matrix__cell low">
                <strong>0.5-0.7</strong>
                <div class="priority-matrix__label">${lang === 'de' ? 'Legal/Tools' : 'Legal/Tools'}</div>
              </div>
            </div>
          </div>
          
          <!-- Export Buttons -->
          <div style="display: flex; gap: var(--space-4); margin-top: var(--space-8); justify-content: center;">
            <button class="btn btn--secondary" onclick="downloadSitemapXML()">
              📥 XML Sitemap
            </button>
            <button class="btn btn--secondary" onclick="downloadSitemapJSON()">
              📥 JSON Sitemap
            </button>
            <button class="btn btn--secondary" onclick="printSitemap()">
              🖨️ Drucken
            </button>
          </div>
        </div>
      </div>
    </section>
  `;
}

/**
 * Render sitemap node
 */
function renderSitemapNode(url, title, status, icon, priority) {
  return `
    <div class="sitemap__node">
      <div class="sitemap__item">
        <div class="sitemap__item-icon">${icon}</div>
        <div class="sitemap__item-content">
          <div class="sitemap__item-title">${title}</div>
          <div class="sitemap__item-desc">Priority: ${priority}</div>
        </div>
        <div class="sitemap__item-status ${status}">✓</div>
      </div>
    </div>
  `;
}

/**
 * Render sitemap children
 */
function renderSitemapChildren(pages, lang) {
  return `
    <div class="sitemap__children">
      ${pages.map(page => `
        <div class="sitemap__node">
          <a href="${page.url}" class="sitemap__item" style="text-decoration: none; color: inherit;">
            <div class="sitemap__item-icon">📄</div>
            <div class="sitemap__item-content">
              <div class="sitemap__item-title">${page.title}</div>
              <div class="sitemap__item-desc">${page.url}</div>
            </div>
            <div class="sitemap__item-status ${page.status}">✓</div>
          </a>
        </div>
      `).join('')}
    </div>
  `;
}

/**
 * Generate sitemap XML
 */
function generateSitemapXML() {
  const urls = sitemapConfig.pages.map(page => `
    <url>
      <loc>${sitemapConfig.siteUrl}${page.url}</loc>
      <lastmod>${sitemapConfig.lastModified}</lastmod>
      <changefreq>${page.changefreq}</changefreq>
      <priority>${page.priority.toFixed(1)}</priority>
    </url>
  `).join('');
  
  sitemapConfig.xmlContent = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>`;
}

/**
 * Download sitemap XML
 */
function downloadSitemapXML() {
  generateSitemapXML();
  
  const blob = new Blob([sitemapConfig.xmlContent], { type: 'application/xml' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'sitemap.xml';
  a.click();
  URL.revokeObjectURL(url);
  
  showToast('Sitemap XML heruntergeladen', 'success');
}

/**
 * Download sitemap JSON
 */
function downloadSitemapJSON() {
  const json = JSON.stringify({
    site: sitemapConfig.siteUrl,
    lastModified: sitemapConfig.lastModified,
    pages: sitemapConfig.pages
  }, null, 2);
  
  const blob = new Blob([json], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'sitemap.json';
  a.click();
  URL.revokeObjectURL(url);
  
  showToast('Sitemap JSON heruntergeladen', 'success');
}

/**
 * Print sitemap
 */
function printSitemap() {
  window.print();
}

/**
 * Get sitemap data
 */
function getSitemapData() {
  return {
    pages: sitemapConfig.pages,
    total: sitemapConfig.pages.length,
    complete: sitemapConfig.pages.filter(p => p.status === 'complete').length,
    pending: sitemapConfig.pages.filter(p => p.status === 'pending').length,
    planned: sitemapConfig.pages.filter(p => p.status === 'planned').length
  };
}

/**
 * Get content strategy data
 */
function getContentStrategy() {
  return sitemapConfig.contentStrategy;
}

// Export for global use
window.sitemapConfig = sitemapConfig;
window.downloadSitemapXML = downloadSitemapXML;
window.downloadSitemapJSON = downloadSitemapJSON;
window.printSitemap = printSitemap;
window.getSitemapData = getSitemapData;
window.getContentStrategy = getContentStrategy;