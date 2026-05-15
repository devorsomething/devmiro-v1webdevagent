/* E-commerce / Snipcart Integration JavaScript */

document.addEventListener('DOMContentLoaded', function() {
  initStore();
});

/**
 * Product Catalog
 */
const products = [
  {
    id: 'website-starter-guide',
    name: { 
      de: 'Website Starter Guide', 
      en: 'Website Starter Guide' 
    },
    description: { 
      de: 'Der ultimative Leitfaden für den Aufbau Ihrer ersten professionellen Website. Inklusive Checklisten, Vorlagen und Best Practices.',
      en: 'The ultimate guide for building your first professional website. Includes checklists, templates, and best practices.'
    },
    price: 49,
    annualPrice: 39,
    category: 'digital',
    icon: '📄',
    features: { 
      de: [
        '100+ Seiten PDF Guide',
        'Website-Checkliste',
        'Design-Vorlagen',
        'Content-Beispiele',
        'SEO-Grundlagen',
        'Kostenlose Updates'
      ],
      en: [
        '100+ Pages PDF Guide',
        'Website Checklist',
        'Design Templates',
        'Content Examples',
        'SEO Basics',
        'Free Updates'
      ]
    },
    badge: null,
    popular: false
  },
  {
    id: 'seo-audit-tool',
    name: { 
      de: 'SEO Audit Tool', 
      en: 'SEO Audit Tool' 
    },
    description: { 
      de: 'Vollständiger SEO-Check für Ihre Website. Analysiert technische SEO, On-Page-Optimierung und Wettbewerber.',
      en: 'Complete SEO check for your website. Analyzes technical SEO, on-page optimization, and competitors.'
    },
    price: 99,
    annualPrice: 79,
    category: 'digital',
    icon: '🔍',
    features: { 
      de: [
        'Technische SEO-Analyse',
        'Keyword-Recherche',
        'Competitor-Analyse',
        'Action-Plan PDF',
        'Rankings-Tracking',
        'Monatlicher Report'
      ],
      en: [
        'Technical SEO Analysis',
        'Keyword Research',
        'Competitor Analysis',
        'Action Plan PDF',
        'Rankings Tracking',
        'Monthly Report'
      ]
    },
    badge: 'Empfohlen',
    popular: true
  },
  {
    id: 'hosting-basic',
    name: { 
      de: 'Hosting Basic', 
      en: 'Basic Hosting' 
    },
    description: { 
      de: 'Schnelles und sicheres Hosting für Ihre Website. Perfekt für kleine bis mittlere Projekte.',
      en: 'Fast and secure hosting for your website. Perfect for small to medium projects.'
    },
    price: 19,
    annualPrice: 15,
    category: 'subscription',
    icon: '🌐',
    features: { 
      de: [
        '5 GB SSD Speicher',
        'Kostenloses SSL',
        'Email Support',
        '99.9% Uptime',
        'Tägliche Backups',
        'CDN Integration'
      ],
      en: [
        '5 GB SSD Storage',
        'Free SSL',
        'Email Support',
        '99.9% Uptime',
        'Daily Backups',
        'CDN Integration'
      ]
    },
    badge: null,
    popular: false
  },
  {
    id: 'maintenance-basic',
    name: { 
      de: 'Wartungsvertrag Basic', 
      en: 'Basic Maintenance' 
    },
    description: { 
      de: 'Monatliche Wartung und Updates für Ihre Website. Halten Sie Ihre Website sicher und aktuell.',
      en: 'Monthly maintenance and updates for your website. Keep your site secure and up-to-date.'
    },
    price: 99,
    annualPrice: 79,
    category: 'subscription',
    icon: '🔧',
    features: { 
      de: [
        'Monatliche Updates',
        'Security Monitoring',
        'Backup-Management',
        'Performance-Optimierung',
        'Email Support',
        'Priorität-Support'
      ],
      en: [
        'Monthly Updates',
        'Security Monitoring',
        'Backup Management',
        'Performance Optimization',
        'Email Support',
        'Priority Support'
      ]
    },
    badge: 'Beliebt',
    popular: true
  },
  {
    id: 'security-package',
    name: { 
      de: 'Website Security Package', 
      en: 'Website Security Package' 
    },
    description: { 
      de: 'Umfassendes Sicherheitspaket für Ihre Website. Schutz vor Hackern, Malware und DDoS.',
      en: 'Comprehensive security package for your website. Protection against hackers, malware, and DDoS.'
    },
    price: 149,
    annualPrice: 119,
    category: 'subscription',
    icon: '🛡️',
    features: { 
      de: [
        'Firewall-Schutz',
        'Malware-Scanning',
        'DDoS-Schutz',
        'SSL-Zertifikate',
        'Security Reports',
        'Emergency Support'
      ],
      en: [
        'Firewall Protection',
        'Malware Scanning',
        'DDoS Protection',
        'SSL Certificates',
        'Security Reports',
        'Emergency Support'
      ]
    },
    badge: null,
    popular: false
  },
  {
    id: 'premium-support',
    name: { 
      de: 'Premium Support Package', 
      en: 'Premium Support Package' 
    },
    description: { 
      de: 'VIP-Support mit persönlichem Ansprechpartner. Schnelle Hilfe wann immer Sie sie brauchen.',
      en: 'VIP support with personal contact. Quick help whenever you need it.'
    },
    price: 199,
    annualPrice: 159,
    category: 'subscription',
    icon: '⭐',
    features: { 
      de: [
        'Persönlicher Ansprechpartner',
        'Priority Support',
        'Phone Support',
        'SLA 99.9%',
        'Monatliche Calls',
        'Rund-um-die-Uhr Support'
      ],
      en: [
        'Personal Contact',
        'Priority Support',
        'Phone Support',
        '99.9% SLA',
        'Monthly Calls',
        '24/7 Support'
      ]
    },
    badge: 'VIP',
    popular: false
  }
];

/**
 * Get current language
 */
function getStoreLang() {
  return window.getCurrentLang ? window.getCurrentLang() : 'de';
}

/**
 * Initialize store
 */
function initStore() {
  const storeGrid = document.querySelector('.store__grid');
  const pricingToggle = document.querySelector('.pricing-toggle__switch');
  
  if (storeGrid) {
    renderProducts(storeGrid, 'monthly');
  }
  
  if (pricingToggle) {
    initPricingToggle(pricingToggle);
  }
  
  initStoreFAQ();
  initSnipcart();
}

/**
 * Render products
 */
function renderProducts(container, billingPeriod = 'monthly') {
  const lang = getStoreLang();
  const isAnnual = billingPeriod === 'annual';
  
  let html = products.map(product => {
    const name = product.name[lang] || product.name.de;
    const description = product.description[lang] || product.description.de;
    const features = product.features[lang] || product.features.de;
    const price = isAnnual && product.annualPrice ? product.annualPrice : product.price;
    const period = isAnnual ? '/Monat' : '/Monat';
    const periodLabel = isAnnual ? '(Jährlich)' : '(Monatlich)';
    const savings = isAnnual ? Math.round((1 - product.annualPrice / product.price) * 100) : 0;
    
    return `
      <div class="product-card" data-item-id="${product.id}">
        <div class="product-card__image">
          <span class="product-card__image-icon">${product.icon}</span>
          ${product.badge ? `<span class="product-card__badge ${product.popular ? 'product-card__badge--popular' : ''}">${product.badge}</span>` : ''}
        </div>
        <div class="product-card__content">
          <span class="product-card__category">${product.category === 'subscription' ? (lang === 'de' ? 'Abonnement' : 'Subscription') : (lang === 'de' ? 'Digital' : 'Digital')}</span>
          <h3 class="product-card__title">${name}</h3>
          <p class="product-card__description">${description}</p>
          <ul class="product-card__features">
            ${features.map(f => `<li>${f}</li>`).join('')}
          </ul>
          <div class="product-card__footer">
            <div class="product-card__price">
              <span class="product-card__price-value">€${price}</span>
              <span class="product-card__price-period">${period} ${isAnnual ? '(-' + savings + '%)' : ''}</span>
            </div>
            <button class="product-card__btn snipcart-add-item"
                    data-item-id="${product.id}"
                    data-item-price="${price}"
                    data-item-url="${window.location.href}"
                    data-item-description="${description}"
                    data-item-name="${name}"
                    ${product.category === 'subscription' ? 'data-item-recurring="true"' : ''}>
              ${lang === 'de' ? 'In den Warenkorb' : 'Add to Cart'}
            </button>
          </div>
        </div>
      </div>
    `;
  }).join('');
  
  container.innerHTML = html;
}

/**
 * Initialize pricing toggle
 */
function initPricingToggle(toggle) {
  toggle.addEventListener('click', () => {
    toggle.classList.toggle('annual');
    
    const isAnnual = toggle.classList.contains('annual');
    const periodLabel = document.querySelector('.pricing-toggle__label.active');
    
    if (periodLabel) {
      periodLabel.textContent = isAnnual ? 'Jährlich (spart 20%)' : 'Monatlich';
    }
    
    const storeGrid = document.querySelector('.store__grid');
    if (storeGrid) {
      renderProducts(storeGrid, isAnnual ? 'annual' : 'monthly');
    }
    
    // Track toggle
    if (window.journeyTrack) {
      window.journeyTrack.track('pricing_toggle', { period: isAnnual ? 'annual' : 'monthly' });
    }
  });
}

/**
 * Initialize store FAQ
 */
function initStoreFAQ() {
  const faqItems = document.querySelectorAll('.store-faq__item');
  
  faqItems.forEach(item => {
    const question = item.querySelector('.store-faq__question');
    
    question.addEventListener('click', () => {
      // Close other items
      faqItems.forEach(i => {
        if (i !== item) i.classList.remove('active');
      });
      
      // Toggle current item
      item.classList.toggle('active');
    });
  });
}

/**
 * Initialize Snipcart
 */
function initSnipcart() {
  // Snipcart is already loaded via the external script
  // This function adds custom event handlers
  
  document.addEventListener('snipcart.ready', () => {
    console.log('Snipcart ready');
    
    // Customize Snipcart theme
    Snipcart.api.theme.apply('dark');
    
    // Listen for events
    document.addEventListener('snipcart.item.added', (event) => {
      console.log('Item added:', event.detail.item);
      
      if (window.journeyTrack) {
        window.journeyTrack.track('ecommerce_add_to_cart', {
          item_id: event.detail.item.id,
          item_name: event.detail.item.name,
          price: event.detail.item.price
        });
      }
    });
    
    document.addEventListener('snipcart.checkout.ready', () => {
      console.log('Checkout ready');
      
      if (window.journeyTrack) {
        window.journeyTrack.track('ecommerce_checkout_start');
      }
    });
    
    document.addEventListener('snipcart.order.completed', (event) => {
      console.log('Order completed:', event.detail.order);
      
      if (window.journeyTrack) {
        window.journeyTrack.track('ecommerce_purchase', {
          order_id: event.detail.order.invoiceNumber,
          total: event.detail.order.total,
          items: event.detail.order.items
        });
      }
    });
  });
}

/**
 * Format price
 */
function formatPrice(price, currency = 'EUR') {
  return new Intl.NumberFormat('de-DE', {
    style: 'currency',
    currency: currency
  }).format(price);
}

/**
 * Get cart count
 */
function getCartCount() {
  if (window.Snipcart) {
    return window.Snipcart.store.get().state.cart.items.count;
  }
  return 0;
}

// Export for global use
window.products = products;
window.initStore = initStore;
window.renderProducts = renderProducts;