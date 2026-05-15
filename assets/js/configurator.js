/* Interactive Product Configurator JavaScript */

document.addEventListener('DOMContentLoaded', function() {
  initConfigurator();
});

/**
 * Configurator Configuration
 */
const configuratorConfig = {
  basePrice: 1500,
  
  templates: [
    {
      id: 'starter',
      name: { de: 'Starter', en: 'Starter' },
      icon: '🚀',
      price: 0,
      features: ['5 Seiten', 'Responsive Design', 'Kontaktformular', 'SSL Zertifikat']
    },
    {
      id: 'professional',
      name: { de: 'Professional', en: 'Professional' },
      icon: '💼',
      price: 500,
      features: ['Alles von Starter', '10 Seiten', 'Blog Integration', 'SEO Optimization', 'Analytics']
    },
    {
      id: 'enterprise',
      name: { de: 'Enterprise', en: 'Enterprise' },
      icon: '🏢',
      price: 1500,
      features: ['Alles von Professional', 'Unbegrenzte Seiten', 'E-commerce', 'CRM Integration', 'Premium Support']
    }
  ],
  
  features: [
    {
      id: 'ecommerce',
      name: { de: 'E-Commerce', en: 'E-Commerce' },
      desc: { de: 'Online Shop mit bis zu 100 Produkten', en: 'Online shop with up to 100 products' },
      price: 800,
      icon: '🛒'
    },
    {
      id: 'blog',
      name: { de: 'Blog System', en: 'Blog System' },
      desc: { de: 'Blog mit Kategorien und Tags', en: 'Blog with categories and tags' },
      price: 300,
      icon: '📝'
    },
    {
      id: 'seo',
      name: { de: 'SEO Paket', en: 'SEO Package' },
      desc: { de: 'Meta Tags, Sitemap, Schema.org', en: 'Meta tags, Sitemap, Schema.org' },
      price: 200,
      icon: '🔍'
    },
    {
      id: 'multilang',
      name: { de: 'Multi-Language', en: 'Multi-Language' },
      desc: { de: 'Deutsch und Englisch', en: 'German and English' },
      price: 250,
      icon: '🌐'
    },
    {
      id: 'cms',
      name: { de: 'CMS Integration', en: 'CMS Integration' },
      desc: { de: 'Eigenständige Content-Bearbeitung', en: 'Independent content editing' },
      price: 600,
      icon: '📋'
    },
    {
      id: 'gallery',
      name: { de: 'Portfolio Gallery', en: 'Portfolio Gallery' },
      desc: { de: 'Bildergalerie mit Lightbox', en: 'Image gallery with lightbox' },
      price: 150,
      icon: '🖼️'
    },
    {
      id: 'newsletter',
      name: { de: 'Newsletter', en: 'Newsletter' },
      desc: { de: 'Mailchimp Integration', en: 'Mailchimp integration' },
      price: 200,
      icon: '📧'
    },
    {
      id: 'chat',
      name: { de: 'Live Chat', en: 'Live Chat' },
      desc: { de: 'Live Chat Widget', en: 'Live chat widget' },
      price: 150,
      icon: '💬'
    },
    {
      id: 'analytics',
      name: { de: 'Analytics Dashboard', en: 'Analytics Dashboard' },
      desc: { de: 'Besucher-Statistiken', en: 'Visitor statistics' },
      price: 100,
      icon: '📊'
    },
    {
      id: 'maintenance',
      name: { de: 'Wartung (1 Jahr)', en: 'Maintenance (1 year)' },
      desc: { de: 'Updates und Support', en: 'Updates and support' },
      price: 400,
      icon: '🛠️'
    }
  ],
  
  addons: [
    {
      id: 'copy',
      name: { de: 'Textoptimierung', en: 'Copy Optimization' },
      desc: { de: 'Professionelle Texte', en: 'Professional texts' },
      price: 300,
      icon: '✍️'
    },
    {
      id: 'photo',
      name: { de: 'Fotoshooting', en: 'Photo Shoot' },
      desc: { de: '10 professionelle Fotos', en: '10 professional photos' },
      price: 500,
      icon: '📷'
    },
    {
      id: 'video',
      name: { de: 'Erklärvideo', en: 'Explainer Video' },
      desc: { de: '60 Sekunden Animation', en: '60 seconds animation' },
      price: 800,
      icon: '🎬'
    }
  ]
};

/**
 * Configurator State
 */
let configuratorState = {
  template: 'starter',
  features: [],
  addons: [],
  monthly: false
};

/**
 * Get current language
 */
function getConfiguratorLang() {
  return window.getCurrentLang ? window.getCurrentLang() : 'de';
}

/**
 * Initialize configurator
 */
function initConfigurator() {
  const container = document.getElementById('configurator');
  if (!container) return;
  
  renderConfigurator();
}

/**
 * Render configurator
 */
function renderConfigurator() {
  const container = document.getElementById('configurator');
  if (!container) return;
  
  const lang = getConfiguratorLang();
  const total = calculateConfiguratorTotal();
  const monthlyTotal = total.monthly;
  const oneTimeTotal = total.oneTime;
  
  container.innerHTML = `
    <section class="configurator">
      <div class="container">
        <div class="configurator__header" style="text-align: center; margin-bottom: var(--space-8);">
          <h2 class="section__title">${lang === 'de' ? 'Website Konfigurator' : 'Website Configurator'}</h2>
          <p class="section__subtitle">${lang === 'de' ? 'Stellen Sie Ihre perfekte Website zusammen' : 'Build your perfect website'}</p>
        </div>
        
        <div class="configurator__container">
          <!-- Builder -->
          <div class="configurator__builder">
            <!-- Templates -->
            <div class="configurator__section">
              <h3 class="configurator__section-title">${lang === 'de' ? '1. Template wählen' : '1. Choose Template'}</h3>
              <div class="configurator__templates">
                ${configuratorConfig.templates.map(t => `
                  <div class="template-card ${configuratorState.template === t.id ? 'selected' : ''}" onclick="selectTemplate('${t.id}')">
                    <div class="template-card__preview">${t.icon}</div>
                    <div class="template-card__name">${t.name[lang] || t.name.de}</div>
                    <div class="template-card__price">${t.price === 0 ? (lang === 'de' ? 'Inklusive' : 'Included') : '+€' + t.price.toLocaleString()}</div>
                  </div>
                `).join('')}
              </div>
            </div>
            
            <!-- Features -->
            <div class="configurator__section">
              <h3 class="configurator__section-title">${lang === 'de' ? '2. Features hinzufügen' : '2. Add Features'}</h3>
              <div class="configurator__features">
                ${configuratorConfig.features.map(f => `
                  <div class="feature-card ${configuratorState.features.includes(f.id) ? 'selected' : ''}" onclick="toggleFeature('${f.id}')">
                    <div class="feature-card__checkbox">
                      ${configuratorState.features.includes(f.id) ? '✓' : ''}
                    </div>
                    <div class="feature-card__content">
                      <div class="feature-card__title">${f.icon} ${f.name[lang] || f.name.de}</div>
                      <div class="feature-card__desc">${f.desc[lang] || f.desc.de}</div>
                    </div>
                    <div class="feature-card__price">+€${f.price}</div>
                  </div>
                `).join('')}
              </div>
            </div>
            
            <!-- Addons -->
            <div class="configurator__section">
              <h3 class="configurator__section-title">${lang === 'de' ? '3. Add-Ons (Optional)' : '3. Add-Ons (Optional)'}</h3>
              <div class="configurator__features">
                ${configuratorConfig.addons.map(a => `
                  <div class="feature-card ${configuratorState.addons.includes(a.id) ? 'selected' : ''}" onclick="toggleAddon('${a.id}')">
                    <div class="feature-card__checkbox">
                      ${configuratorState.addons.includes(a.id) ? '✓' : ''}
                    </div>
                    <div class="feature-card__content">
                      <div class="feature-card__title">${a.icon} ${a.name[lang] || a.name.de}</div>
                      <div class="feature-card__desc">${a.desc[lang] || a.desc.de}</div>
                    </div>
                    <div class="feature-card__price">+€${a.price}</div>
                  </div>
                `).join('')}
              </div>
            </div>
          </div>
          
          <!-- Summary -->
          <div class="configurator__summary">
            <h3 class="configurator__summary-title">${lang === 'de' ? 'Zusammenfassung' : 'Summary'}</h3>
            
            <div class="configurator__summary-items">
              <div class="summary-item">
                <span class="summary-item__label">${lang === 'de' ? 'Template' : 'Template'}</span>
                <span class="summary-item__price">€${configuratorConfig.templates.find(t => t.id === configuratorState.template).price.toLocaleString()}</span>
              </div>
              
              ${configuratorState.features.map(fId => {
                const feature = configuratorConfig.features.find(f => f.id === fId);
                return `
                  <div class="summary-item">
                    <span class="summary-item__label">${feature.name[lang] || feature.name.de}</span>
                    <span class="summary-item__price">+€${feature.price}</span>
                  </div>
                `;
              }).join('')}
              
              ${configuratorState.addons.map(aId => {
                const addon = configuratorConfig.addons.find(a => a.id === aId);
                return `
                  <div class="summary-item">
                    <span class="summary-item__label">${addon.name[lang] || addon.name.de}</span>
                    <span class="summary-item__price">+€${addon.price}</span>
                  </div>
                `;
              }).join('')}
            </div>
            
            <div class="configurator__total">
              <span class="configurator__total-label">${lang === 'de' ? 'Gesamt' : 'Total'}</span>
              <span class="configurator__total-price">€${oneTimeTotal.toLocaleString()}</span>
            </div>
            
            <div class="configurator__summary-actions">
              <a href="#" class="configurator__cta" onclick="requestQuote(event)">
                ${lang === 'de' ? 'Angebot anfordern' : 'Request Quote'}
              </a>
              <button class="configurator__secondary-btn" onclick="saveConfiguration()">
                ${lang === 'de' ? 'Konfiguration speichern' : 'Save Configuration'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  `;
}

/**
 * Calculate configurator total
 */
function calculateConfiguratorTotal() {
  let oneTime = configuratorConfig.basePrice;
  
  // Add template price
  const template = configuratorConfig.templates.find(t => t.id === configuratorState.template);
  if (template) oneTime += template.price;
  
  // Add feature prices
  configuratorState.features.forEach(fId => {
    const feature = configuratorConfig.features.find(f => f.id === fId);
    if (feature) oneTime += feature.price;
  });
  
  // Add addon prices
  configuratorState.addons.forEach(aId => {
    const addon = configuratorConfig.addons.find(a => a.id === aId);
    if (addon) oneTime += addon.price;
  });
  
  // Monthly is 10% of one-time
  const monthly = Math.round(oneTime * 0.1);
  
  return { oneTime, monthly };
}

/**
 * Select template
 */
function selectTemplate(templateId) {
  configuratorState.template = templateId;
  renderConfigurator();
  
  if (window.journeyTrack) {
    window.journeyTrack.track('configurator_template', { template: templateId });
  }
}

/**
 * Toggle feature
 */
function toggleFeature(featureId) {
  const index = configuratorState.features.indexOf(featureId);
  if (index === -1) {
    configuratorState.features.push(featureId);
  } else {
    configuratorState.features.splice(index, 1);
  }
  renderConfigurator();
  
  if (window.journeyTrack) {
    window.journeyTrack.track('configurator_feature', { 
      feature: featureId, 
      action: configuratorState.features.includes(featureId) ? 'add' : 'remove' 
    });
  }
}

/**
 * Toggle addon
 */
function toggleAddon(addonId) {
  const index = configuratorState.addons.indexOf(addonId);
  if (index === -1) {
    configuratorState.addons.push(addonId);
  } else {
    configuratorState.addons.splice(index, 1);
  }
  renderConfigurator();
  
  if (window.journeyTrack) {
    window.journeyTrack.track('configurator_addon', { 
      addon: addonId, 
      action: configuratorState.addons.includes(addonId) ? 'add' : 'remove' 
    });
  }
}

/**
 * Request quote
 */
function requestQuote(event) {
  event.preventDefault();
  
  const lang = getConfiguratorLang();
  const total = calculateConfiguratorTotal();
  
  // Save configuration
  localStorage.setItem('devmiro-config', JSON.stringify({
    ...configuratorState,
    total: total.oneTime
  }));
  
  // Track
  if (window.journeyTrack) {
    window.journeyTrack.track('configurator_quote_request', configuratorState);
  }
  
  // Show success
  alert(lang === 'de' 
    ? 'Vielen Dank! Wir werden uns innerhalb von 24 Stunden bei Ihnen melden.' 
    : 'Thank you! We will contact you within 24 hours.');
}

/**
 * Save configuration
 */
function saveConfiguration() {
  localStorage.setItem('devmiro-config', JSON.stringify(configuratorState));
  
  const lang = getConfiguratorLang();
  alert(lang === 'de' 
    ? 'Konfiguration gespeichert!' 
    : 'Configuration saved!');
}

/**
 * Load saved configuration
 */
function loadConfiguration() {
  const saved = localStorage.getItem('devmiro-config');
  if (saved) {
    try {
      const config = JSON.parse(saved);
      configuratorState = {
        template: config.template || 'starter',
        features: config.features || [],
        addons: config.addons || [],
        monthly: config.monthly || false
      };
    } catch (e) {
      console.log('Could not load configuration');
    }
  }
}

// Load saved on init
loadConfiguration();

// Export for global use
window.configuratorConfig = configuratorConfig;
window.selectTemplate = selectTemplate;
window.toggleFeature = toggleFeature;
window.toggleAddon = toggleAddon;
window.requestQuote = requestQuote;
window.saveConfiguration = saveConfiguration;
window.loadConfiguration = loadConfiguration;