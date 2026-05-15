/* Advanced SEO Optimizer JavaScript */

document.addEventListener('DOMContentLoaded', function() {
  initSEOOptimizer();
});

/**
 * SEO Configuration
 */
const seoConfig = {
  // Target keywords
  targetKeywords: [
    'Webentwicklung Vorarlberg',
    'IT-Dienstleistungen Österreich',
    'Website erstellen lassen',
    'Webdesign Bregenz',
    'Online Marketing Agentur'
  ],
  
  // Competitor domains
  competitors: [
    'webdesign-vorarlberg.at',
    'internet-agentur.at',
    'digital-agentur.at'
  ],
  
  // Content optimization settings
  contentOptimization: {
    minWordCount: 300,
    maxKeywordDensity: 3,
    minReadabilityScore: 60
  }
};

/**
 * SEO State
 */
let seoState = {
  score: 0,
  checks: [],
  schemaMarkup: {},
  metaTags: {},
  keywords: [],
  backlinks: { total: 0, dofollow: 0, nofollow: 0 },
  competitors: {}
};

/**
 * Get current language
 */
function getSEOLang() {
  return window.getCurrentLang ? window.getCurrentLang() : 'de';
}

/**
 * Initialize SEO optimizer
 */
function initSEOOptimizer() {
  const container = document.getElementById('seo-dashboard');
  if (!container) return;
  
  // Run SEO analysis
  runSEOAnalysis();
  
  // Render dashboard
  renderSEODashboard();
  
  // Generate schema markup
  generateSchemaMarkup();
}

/**
 * Run SEO analysis
 */
function runSEOAnalysis() {
  seoState.checks = [];
  seoState.score = 0;
  
  // 1. Title Tag
  const title = document.querySelector('title');
  const titleCheck = {
    name: getSEOLang() === 'de' ? 'Title Tag' : 'Title Tag',
    status: title && title.textContent.length >= 30 && title.textContent.length <= 60 ? 'pass' : 'warn',
    score: title ? 20 : 0,
    desc: title 
      ? `${title.textContent.length} Zeichen (Ideal: 50-60)`
      : getSEOLang() === 'de' ? 'Title fehlt!' : 'Title missing!'
  };
  seoState.checks.push(titleCheck);
  
  // 2. Meta Description
  const metaDesc = document.querySelector('meta[name="description"]');
  const descContent = metaDesc?.getAttribute('content') || '';
  const descCheck = {
    name: getSEOLang() === 'de' ? 'Meta Description' : 'Meta Description',
    status: descContent.length >= 120 && descContent.length <= 160 ? 'pass' : descContent.length > 0 ? 'warn' : 'fail',
    score: descContent.length >= 120 && descContent.length <= 160 ? 20 : descContent.length > 0 ? 10 : 0,
    desc: descContent 
      ? `${descContent.length} Zeichen (Ideal: 120-160)`
      : getSEOLang() === 'de' ? 'Description fehlt!' : 'Description missing!'
  };
  seoState.checks.push(descCheck);
  
  // 3. Heading Structure
  const h1 = document.querySelectorAll('h1');
  const h2 = document.querySelectorAll('h2');
  const h3 = document.querySelectorAll('h3');
  const headingCheck = {
    name: getSEOLang() === 'de' ? 'Überschriften-Struktur' : 'Heading Structure',
    status: h1.length === 1 && h2.length >= 2 ? 'pass' : h1.length > 1 ? 'fail' : 'warn',
    score: h1.length === 1 ? 15 : h1.length > 1 ? 0 : 5,
    desc: `${h1.length} H1, ${h2.length} H2, ${h3.length} H3 (Soll: 1 H1, min. 2 H2)`
  };
  seoState.checks.push(headingCheck);
  
  // 4. Images (Alt Text)
  const images = document.querySelectorAll('img');
  const imagesWithAlt = document.querySelectorAll('img[alt]');
  const imagesWithAltAttr = [...images].filter(img => img.alt && img.alt.trim()).length;
  const imagesCheck = {
    name: getSEOLang() === 'de' ? 'Bild-Alt-Texte' : 'Image Alt Texts',
    status: images.length === 0 || imagesWithAltAttr === images.length ? 'pass' : 'warn',
    score: images.length === 0 ? 10 : Math.round((imagesWithAltAttr / images.length) * 10),
    desc: `${imagesWithAltAttr}/${images.length} Bilder mit Alt-Text`
  };
  seoState.checks.push(imagesCheck);
  
  // 5. Internal Links
  const internalLinks = document.querySelectorAll('a[href^="/"], a[href^="' + window.location.origin + '"]');
  const linksCheck = {
    name: getSEOLang() === 'de' ? 'Interne Verlinkung' : 'Internal Links',
    status: internalLinks.length >= 5 ? 'pass' : internalLinks.length >= 2 ? 'warn' : 'fail',
    score: Math.min(internalLinks.length * 2, 10),
    desc: `${internalLinks.length} interne Links gefunden`
  };
  seoState.checks.push(linksCheck);
  
  // 6. SSL/HTTPS
  const isHTTPS = window.location.protocol === 'https:';
  const sslCheck = {
    name: 'SSL/HTTPS',
    status: isHTTPS ? 'pass' : 'fail',
    score: isHTTPS ? 10 : 0,
    desc: isHTTPS 
      ? getSEOLang() === 'de' ? 'Sicher (HTTPS aktiv)' : 'Secure (HTTPS active)'
      : getSEOLang() === 'de' ? 'Nicht sicher (HTTPS fehlt)' : 'Not secure (HTTPS missing)'
  };
  seoState.checks.push(sslCheck);
  
  // 7. Mobile Friendly
  const viewport = document.querySelector('meta[name="viewport"]');
  const mobileCheck = {
    name: getSEOLang() === 'de' ? 'Mobile Optimierung' : 'Mobile Friendly',
    status: viewport ? 'pass' : 'fail',
    score: viewport ? 10 : 0,
    desc: viewport 
      ? getSEOLang() === 'de' ? 'Viewport gesetzt' : 'Viewport set'
      : getSEOLang() === 'de' ? 'Viewport fehlt!' : 'Viewport missing!'
  };
  seoState.checks.push(mobileCheck);
  
  // 8. Page Speed (basic)
  const perf = window.performance || window.webkitPerformance;
  const loadTime = perf?.timing?.loadEventEnd - perf?.timing?.navigationStart || 0;
  const speedCheck = {
    name: getSEOLang() === 'de' ? 'Ladezeit' : 'Page Speed',
    status: loadTime < 2000 ? 'pass' : loadTime < 4000 ? 'warn' : 'fail',
    score: loadTime < 2000 ? 10 : loadTime < 4000 ? 5 : 0,
    desc: `${Math.round(loadTime)}ms (Ideal: <2000ms)`
  };
  seoState.checks.push(speedCheck);
  
  // 9. Schema Markup
  const hasSchema = document.querySelector('script[type="application/ld+json"]');
  const schemaCheck = {
    name: 'Schema Markup',
    status: hasSchema ? 'pass' : 'warn',
    score: hasSchema ? 10 : 5,
    desc: hasSchema 
      ? getSEOLang() === 'de' ? 'Schema vorhanden' : 'Schema found'
      : getSEOLang() === 'de' ? 'Schema fehlt (empfohlen)' : 'Schema missing (recommended)'
  };
  seoState.checks.push(schemaCheck);
  
  // 10. Open Graph Tags
  const ogTags = ['og:title', 'og:description', 'og:image', 'og:url'];
  const ogPresent = ogTags.filter(tag => document.querySelector(`meta[property="${tag}"]`)).length;
  const ogCheck = {
    name: 'Open Graph Tags',
    status: ogPresent >= 4 ? 'pass' : ogPresent >= 2 ? 'warn' : 'fail',
    score: Math.round((ogPresent / 4) * 10),
    desc: `${ogPresent}/4 OG-Tags vorhanden`
  };
  seoState.checks.push(ogCheck);
  
  // Calculate total score
  seoState.score = seoState.checks.reduce((sum, check) => sum + check.score, 0);
  
  // Update meta tags state
  seoState.metaTags = {
    title: title?.textContent || '',
    description: descContent,
    keywords: seoConfig.targetKeywords.join(', ')
  };
  
  // Update keywords
  seoState.keywords = seoConfig.targetKeywords;
}

/**
 * Render SEO dashboard
 */
function renderSEODashboard() {
  const container = document.getElementById('seo-dashboard');
  if (!container) return;
  
  const lang = getSEOLang();
  
  container.innerHTML = `
    <section class="seo-dashboard">
      <div class="container">
        <div class="seo-dashboard__header">
          <h2 class="section__title">🔍 ${lang === 'de' ? 'SEO Optimizer' : 'SEO Optimizer'}</h2>
          <button class="btn btn--primary" onclick="runSEOAnalysis(); renderSEODashboard();">
            🔄 ${lang === 'de' ? 'Erneut analysieren' : 'Re-analyze'}
          </button>
        </div>
        
        <!-- SEO Score -->
        <div class="seo-score">
          <svg class="seo-score__ring" viewBox="0 0 80 80">
            <circle class="bg" cx="40" cy="40" r="36"/>
            <circle class="progress" cx="40" cy="40" r="36" style="stroke-dashoffset: ${226 - (226 * seoState.score / 100)}"/>
          </svg>
          <div class="seo-score__details">
            <div class="seo-score__value">${seoState.score}/100</div>
            <div class="seo-score__label">${lang === 'de' ? 'SEO Score' : 'SEO Score'}</div>
          </div>
        </div>
        
        <!-- SEO Checklist -->
        <div class="seo-checklist">
          ${seoState.checks.map(check => `
            <div class="seo-checklist__item ${check.status}">
              <div class="seo-checklist__icon">
                ${check.status === 'pass' ? '✓' : check.status === 'fail' ? '✕' : '⚠'}
              </div>
              <div class="seo-checklist__content">
                <div class="seo-checklist__title">${check.name}</div>
                <div class="seo-checklist__desc">${check.desc}</div>
              </div>
              <span class="seo-checklist__score">${check.score}/10</span>
            </div>
          `).join('')}
        </div>
        
        <!-- Meta Tag Editor -->
        <div class="meta-editor">
          <h3 style="margin-bottom: var(--space-4);">📝 ${lang === 'de' ? 'Meta Tag Editor' : 'Meta Tag Editor'}</h3>
          
          <div class="meta-editor__preview">
            <div class="meta-editor__preview-title" id="seo-preview-title">
              ${seoState.metaTags.title || 'Seitentitel hier...'}
            </div>
            <div class="meta-editor__preview-url">
              devmiro.at → <span style="color: #006621;">www.devmiro.at</span>
            </div>
            <div class="meta-editor__preview-desc" id="seo-preview-desc">
              ${seoState.metaTags.description || 'Meta Description hier...'}
            </div>
          </div>
          
          <div class="meta-editor__fields">
            <div class="meta-editor__field">
              <label for="meta-title">${lang === 'de' ? 'Title Tag (max. 60 Zeichen)' : 'Title Tag (max. 60 chars)'}</label>
              <input type="text" id="meta-title" value="${seoState.metaTags.title}" 
                     maxlength="60" oninput="updateSEOPreview()">
              <div class="meta-editor__counter ${document.getElementById('meta-title')?.value?.length > 60 ? 'error' : ''}">
                ${(seoState.metaTags.title || '').length}/60
              </div>
            </div>
            
            <div class="meta-editor__field">
              <label for="meta-description">${lang === 'de' ? 'Meta Description (max. 160 Zeichen)' : 'Meta Description (max. 160 chars)'}</label>
              <textarea id="meta-description" maxlength="160" oninput="updateSEOPreview()">${seoState.metaTags.description}</textarea>
              <div class="meta-editor__counter ${(seoState.metaTags.description || '').length > 160 ? 'error' : (seoState.metaTags.description || '').length < 120 ? 'warning' : ''}">
                ${(seoState.metaTags.description || '').length}/160
              </div>
            </div>
          </div>
        </div>
        
        <!-- Keyword Analyzer -->
        <div class="keyword-analyzer">
          <h3 style="margin-bottom: var(--space-4);">🎯 ${lang === 'de' ? 'Keyword Analyse' : 'Keyword Analysis'}</h3>
          
          <div class="keyword-cloud">
            ${seoState.keywords.map((kw, i) => {
              const sizes = ['high', 'medium', 'low'];
              return `<span class="keyword-tag ${sizes[i % 3]}">${kw}</span>`;
            }).join('')}
          </div>
          
          <div style="margin-top: var(--space-4);">
            <h4 style="margin-bottom: var(--space-2);">${lang === 'de' ? 'Empfohlene Keywords' : 'Recommended Keywords'}:</h4>
            <div class="keyword-cloud">
              <span class="keyword-tag">Webentwicklung Bregenz</span>
              <span class="keyword-tag">Website Agentur Vorarlberg</span>
              <span class="keyword-tag">Webdesign Dornbirn</span>
              <span class="keyword-tag">IT Support Österreich</span>
              <span class="keyword-tag">Onlineshop erstellen</span>
            </div>
          </div>
        </div>
        
        <!-- Schema Markup -->
        <div class="schema-viewer">
          <div class="schema-viewer__header">
            <h3>📋 Schema Markup</h3>
            <button class="btn btn--secondary btn--small" onclick="copySchemaMarkup()">
              📋 ${lang === 'de' ? 'Kopieren' : 'Copy'}
            </button>
          </div>
          <pre class="schema-viewer__code" id="schema-code"></pre>
        </div>
        
        <!-- Backlinks Monitor -->
        <div class="backlinks-monitor">
          <div class="backlink-stat">
            <div class="backlink-stat__value" id="total-backlinks">0</div>
            <div class="backlink-stat__label">${lang === 'de' ? 'Backlinks gesamt' : 'Total Backlinks'}</div>
          </div>
          <div class="backlink-stat">
            <div class="backlink-stat__value" id="dofollow-backlinks">0</div>
            <div class="backlink-stat__label">Do-Follow</div>
          </div>
          <div class="backlink-stat">
            <div class="backlink-stat__value" id="nofollow-backlinks">0</div>
            <div class="backlink-stat__label">No-Follow</div>
          </div>
        </div>
      </div>
    </section>
  `;
  
  // Display schema
  displaySchemaMarkup();
  
  // Update backlinks display
  document.getElementById('total-backlinks').textContent = seoState.backlinks.total;
  document.getElementById('dofollow-backlinks').textContent = seoState.backlinks.dofollow;
  document.getElementById('nofollow-backlinks').textContent = seoState.backlinks.nofollow;
}

/**
 * Generate schema markup
 */
function generateSchemaMarkup() {
  seoState.schemaMarkup = {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    "name": "DevMiro",
    "description": "IT-Dienstleistungen in Vorarlberg, Österreich. Webentwicklung, UX Design, Wartung & Support.",
    "url": "https://devmiro.at",
    "telephone": "+43 660 12345678",
    "email": "hallo@devmiro.at",
    "address": {
      "@type": "PostalAddress",
      "addressLocality": "Vorarlberg",
      "addressCountry": "AT"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": "47.2611",
      "longitude": "9.6092"
    },
    "openingHoursSpecification": [
      {
        "@type": "OpeningHoursSpecification",
        "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
        "opens": "09:00",
        "closes": "18:00"
      }
    ],
    "priceRange": "€€",
    "areaServed": "Vorarlberg",
    "serviceType": ["Web Development", "UX Design", "IT Support"]
  };
}

/**
 * Display schema markup
 */
function displaySchemaMarkup() {
  const schemaEl = document.getElementById('schema-code');
  if (schemaEl) {
    const schemaJSON = JSON.stringify(seoState.schemaMarkup, null, 2);
    schemaEl.innerHTML = syntaxHighlightSchema(schemaJSON);
  }
}

/**
 * Syntax highlight for schema
 */
function syntaxHighlightSchema(json) {
  return json
    .replace(/(".*?")\s*:/g, '<span class="schema-viewer__keyword">$1</span>:')
    .replace(/:\s*(".*?")/g, ': <span class="schema-viewer__string">$1</span>')
    .replace(/:\s*(\d+\.?\d*)/g, ': <span class="schema-viewer__number">$1</span>')
    .replace(/true/g, '<span style="color: #22C55E;">true</span>')
    .replace(/false/g, '<span style="color: #EF4444;">false</span>');
}

/**
 * Update SEO preview
 */
function updateSEOPreview() {
  const title = document.getElementById('meta-title')?.value || '';
  const desc = document.getElementById('meta-description')?.value || '';
  
  const previewTitle = document.getElementById('seo-preview-title');
  const previewDesc = document.getElementById('seo-preview-desc');
  
  if (previewTitle) previewTitle.textContent = title || 'Seitentitel hier...';
  if (previewDesc) previewDesc.textContent = desc || 'Meta Description hier...';
  
  // Update counters
  const counters = document.querySelectorAll('.meta-editor__counter');
  counters.forEach((counter, i) => {
    if (i === 0) {
      counter.textContent = `${title.length}/60`;
      counter.className = 'meta-editor__counter' + (title.length > 60 ? ' error' : title.length < 30 ? ' warning' : '');
    } else {
      counter.textContent = `${desc.length}/160`;
      counter.className = 'meta-editor__counter' + (desc.length > 160 ? ' error' : desc.length < 120 ? ' warning' : '');
    }
  });
}

/**
 * Copy schema markup
 */
function copySchemaMarkup() {
  const schemaJSON = JSON.stringify(seoState.schemaMarkup, null, 2);
  navigator.clipboard.writeText(schemaJSON).then(() => {
    showToast('Schema Markup kopiert', 'success');
  }).catch(() => {
    showToast('Kopieren fehlgeschlagen', 'error');
  });
}

/**
 * Get SEO report
 */
function getSEOReport() {
  return {
    score: seoState.score,
    checks: seoState.checks,
    metaTags: seoState.metaTags,
    keywords: seoState.keywords,
    schemaMarkup: seoState.schemaMarkup,
    timestamp: Date.now()
  };
}

/**
 * Export SEO report
 */
function exportSEOReport() {
  const lang = getSEOLang();
  
  const report = getSEOReport();
  const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'devmiro-seo-report-' + new Date().toISOString().split('T')[0] + '.json';
  a.click();
  URL.revokeObjectURL(url);
  
  showToast(lang === 'de' ? 'SEO Report exportiert' : 'SEO Report exported', 'success');
}

// Export for global use
window.seoConfig = seoConfig;
window.seoState = seoState;
window.runSEOAnalysis = runSEOAnalysis;
window.renderSEODashboard = renderSEODashboard;
window.updateSEOPreview = updateSEOPreview;
window.copySchemaMarkup = copySchemaMarkup;
window.exportSEOReport = exportSEOReport;
window.getSEOReport = getSEOReport;