/* i18n - Multi-language Support JavaScript */

document.addEventListener('DOMContentLoaded', function() {
  initI18n();
});

/**
 * i18n Configuration
 */
const i18n = {
  currentLang: 'de',
  fallbackLang: 'de',
  supportedLangs: ['de', 'en'],
  langNames: {
    de: { name: 'Deutsch', native: 'Deutsch', flag: '🇦🇹' },
    en: { name: 'English', native: 'English', flag: '🇬🇧' }
  },
  
  translations: {
    de: {
      // Navigation
      'nav.home': 'Startseite',
      'nav.services': 'Leistungen',
      'nav.portfolio': 'Portfolio',
      'nav.about': 'Über uns',
      'nav.blog': 'Blog',
      'nav.contact': 'Kontakt',
      
      // Hero Section
      'hero.badge': 'IT-Dienstleistungen für Unternehmen',
      'hero.title': 'Professionelle IT-Lösungen',
      'hero.title.highlight': 'für Ihr Unternehmen',
      'hero.subtitle': 'Maßgeschneiderte Websites, Webanwendungen und IT-Lösungen für Unternehmen in Vorarlberg. Qualität trifft Innovation.',
      'hero.cta.primary': 'Kostenlos beraten',
      'hero.cta.secondary': 'Projekt anfragen',
      'hero.trust': '100+ zufriedene Kunden',
      
      // Services
      'services.title': 'Unsere Leistungen',
      'services.subtitle': 'Alles aus einer Hand – von der Idee bis zur fertigen Lösung',
      'services.website.title': 'Website & Shop',
      'services.website.desc': 'Moderne, responsive Websites und E-Commerce Lösungen, die conversionsorientiert sind.',
      'services.webapp.title': 'Webanwendungen',
      'services.webapp.desc': 'Maßgeschneiderte Webanwendungen für komplexe Geschäftsprozesse.',
      'services.hosting.title': 'Hosting & Domain',
      'services.hosting.desc': 'Schnelles, sicheres Hosting mit persönlichem Support in Vorarlberg.',
      'services.support.title': 'IT-Support',
      'services.support.desc': 'Remote und Vor-Ort Support für Ihre IT-Infrastruktur.',
      'services.consulting.title': 'IT-Beratung',
      'services.consulting.desc': 'Strategische IT-Beratung für nachhaltiges Wachstum.',
      'services.cta': 'Mehr erfahren',
      
      // Process
      'process.title': 'Unser Prozess',
      'process.subtitle': 'In 4 Schritten zum Erfolg',
      'process.analysis.title': 'Analyse',
      'process.analysis.desc': 'Wir verstehen Ihre Anforderungen und Ziele.',
      'process.design.title': 'Design',
      'process.design.desc': 'Modernes, benutzerfreundliches Design.',
      'process.development.title': 'Entwicklung',
      'process.development.desc': 'Sauberer Code, optimale Performance.',
      'process.launch.title': 'Launch',
      'process.launch.desc': 'Punktlandung mit umfassendem Support.',
      
      // Portfolio
      'portfolio.title': 'Unsere Arbeit',
      'portfolio.subtitle': 'Ausgewählte Projekte',
      'portfolio.cta': 'Alle Projekte ansehen',
      
      // Testimonials
      'testimonials.title': 'Kundenstimmen',
      'testimonials.subtitle': 'Das sagen unsere Kunden',
      
      // FAQ
      'faq.title': 'Häufige Fragen',
      'faq.subtitle': 'Hier finden Sie Antworten auf die wichtigsten Fragen',
      'faq.search.placeholder': 'Frage suchen...',
      'faq.noResults': 'Keine passenden Fragen gefunden',
      'faq.helpful': 'War das hilfreich?',
      'faq.yes': 'Ja',
      'faq.no': 'Nein',
      
      // CTA
      'cta.title': 'Bereit für Ihr Projekt?',
      'cta.subtitle': 'Lassen Sie uns gemeinsam Ihre digitale Zukunft gestalten.',
      'cta.button': 'Jetzt Projekt starten',
      
      // Footer
      'footer.brand': 'DevMiro',
      'footer.tagline': 'Ihre digitale Zukunft in Vorarlberg.',
      'footer.services': 'Leistungen',
      'footer.company': 'Unternehmen',
      'footer.legal': 'Rechtliches',
      'footer.contact': 'Kontakt',
      'footer.address': 'Vorarlberg, Österreich',
      'footer.copyright': '© 2024 DevMiro. Alle Rechte vorbehalten.',
      
      // Contact Form
      'contact.title': 'Kontakt aufnehmen',
      'contact.subtitle': 'Schreiben Sie uns oder rufen Sie direkt an',
      'contact.name': 'Name',
      'contact.email': 'E-Mail',
      'contact.phone': 'Telefon',
      'contact.message': 'Nachricht',
      'contact.submit': 'Nachricht senden',
      'contact.success': 'Vielen Dank! Wir melden uns innerhalb von 24 Stunden.',
      'contact.error': 'Ein Fehler ist aufgetreten. Bitte versuchen Sie es erneut.',
      
      // Price Calculator
      'calculator.title': 'Preiskalkulator',
      'calculator.subtitle': 'Erhalten Sie eine grobe Schätzung für Ihr Projekt',
      'calculator.pages': 'Anzahl der Seiten',
      'calculator.features': 'Anzahl der Features',
      'calculator.addons': 'Add-ons',
      'calculator.timeline': 'Zeitrahmen',
      'calculator.total': 'Geschätzter Preis',
      'calculator.request': 'Genaues Angebot anfordern',
      
      // Common
      'common.loading': 'Wird geladen...',
      'common.error': 'Ein Fehler ist aufgetreten',
      'common.success': 'Erfolgreich abgeschlossen',
      'common.back': 'Zurück',
      'common.next': 'Weiter',
      'common.submit': 'Absenden',
      'common.cancel': 'Abbrechen',
      'common.save': 'Speichern',
      'common.delete': 'Löschen',
      'common.edit': 'Bearbeiten',
      'common.close': 'Schließen',
      'common.viewAll': 'Alle anzeigen',
      'common.readMore': 'Mehr lesen'
    },
    
    en: {
      // Navigation
      'nav.home': 'Home',
      'nav.services': 'Services',
      'nav.portfolio': 'Portfolio',
      'nav.about': 'About',
      'nav.blog': 'Blog',
      'nav.contact': 'Contact',
      
      // Hero Section
      'hero.badge': 'IT Services for Businesses',
      'hero.title': 'Professional IT Solutions',
      'hero.title.highlight': 'for Your Business',
      'hero.subtitle': 'Custom websites, web applications and IT solutions for businesses in Vorarlberg. Quality meets innovation.',
      'hero.cta.primary': 'Get Free Consultation',
      'hero.cta.secondary': 'Request Project',
      'hero.trust': '100+ Satisfied Customers',
      
      // Services
      'services.title': 'Our Services',
      'services.subtitle': 'Everything from a single source – from idea to finished solution',
      'services.website.title': 'Website & Shop',
      'services.website.desc': 'Modern, responsive websites and e-commerce solutions that are conversion-oriented.',
      'services.webapp.title': 'Web Applications',
      'services.webapp.desc': 'Custom web applications for complex business processes.',
      'services.hosting.title': 'Hosting & Domain',
      'services.hosting.desc': 'Fast, secure hosting with personal support in Vorarlberg.',
      'services.support.title': 'IT Support',
      'services.support.desc': 'Remote and on-site support for your IT infrastructure.',
      'services.consulting.title': 'IT Consulting',
      'services.consulting.desc': 'Strategic IT consulting for sustainable growth.',
      'services.cta': 'Learn more',
      
      // Process
      'process.title': 'Our Process',
      'process.subtitle': 'Success in 4 steps',
      'process.analysis.title': 'Analysis',
      'process.analysis.desc': 'We understand your requirements and goals.',
      'process.design.title': 'Design',
      'process.design.desc': 'Modern, user-friendly design.',
      'process.development.title': 'Development',
      'process.development.desc': 'Clean code, optimal performance.',
      'process.launch.title': 'Launch',
      'process.launch.desc': 'On-time delivery with comprehensive support.',
      
      // Portfolio
      'portfolio.title': 'Our Work',
      'portfolio.subtitle': 'Selected Projects',
      'portfolio.cta': 'View All Projects',
      
      // Testimonials
      'testimonials.title': 'Customer Reviews',
      'testimonials.subtitle': 'What our customers say',
      
      // FAQ
      'faq.title': 'Frequently Asked Questions',
      'faq.subtitle': 'Find answers to the most important questions here',
      'faq.search.placeholder': 'Search question...',
      'faq.noResults': 'No matching questions found',
      'faq.helpful': 'Was this helpful?',
      'faq.yes': 'Yes',
      'faq.no': 'No',
      
      // CTA
      'cta.title': 'Ready for Your Project?',
      'cta.subtitle': 'Let\'s shape your digital future together.',
      'cta.button': 'Start Project Now',
      
      // Footer
      'footer.brand': 'DevMiro',
      'footer.tagline': 'Your digital future in Vorarlberg.',
      'footer.services': 'Services',
      'footer.company': 'Company',
      'footer.legal': 'Legal',
      'footer.contact': 'Contact',
      'footer.address': 'Vorarlberg, Austria',
      'footer.copyright': '© 2024 DevMiro. All rights reserved.',
      
      // Contact Form
      'contact.title': 'Get in Touch',
      'contact.subtitle': 'Write to us or call us directly',
      'contact.name': 'Name',
      'contact.email': 'Email',
      'contact.phone': 'Phone',
      'contact.message': 'Message',
      'contact.submit': 'Send Message',
      'contact.success': 'Thank you! We will get back to you within 24 hours.',
      'contact.error': 'An error occurred. Please try again.',
      
      // Price Calculator
      'calculator.title': 'Price Calculator',
      'calculator.subtitle': 'Get a rough estimate for your project',
      'calculator.pages': 'Number of pages',
      'calculator.features': 'Number of features',
      'calculator.addons': 'Add-ons',
      'calculator.timeline': 'Timeline',
      'calculator.total': 'Estimated Price',
      'calculator.request': 'Request Exact Quote',
      
      // Common
      'common.loading': 'Loading...',
      'common.error': 'An error occurred',
      'common.success': 'Successfully completed',
      'common.back': 'Back',
      'common.next': 'Next',
      'common.submit': 'Submit',
      'common.cancel': 'Cancel',
      'common.save': 'Save',
      'common.delete': 'Delete',
      'common.edit': 'Edit',
      'common.close': 'Close',
      'common.viewAll': 'View all',
      'common.readMore': 'Read more'
    }
  }
};

/**
 * Initialize i18n
 */
function initI18n() {
  // Detect language
  detectLanguage();
  
  // Set up language switcher
  setupLanguageSwitcher();
  
  // Apply translations
  applyTranslations();
  
  // Update URL
  updateURL();
  
  // Set up RTL support (for future languages)
  setupRTLSupport();
  
  // Set up alternate links
  setupAlternateLinks();
  
  // Track language change
  trackLanguageChange();
}

/**
 * Detect user's preferred language
 */
function detectLanguage() {
  // Check URL first
  const urlLang = getURLLanguage();
  if (urlLang && i18n.supportedLangs.includes(urlLang)) {
    i18n.currentLang = urlLang;
    return;
  }
  
  // Check localStorage
  const savedLang = localStorage.getItem('preferred_lang');
  if (savedLang && i18n.supportedLangs.includes(savedLang)) {
    i18n.currentLang = savedLang;
    return;
  }
  
  // Check browser language
  const browserLang = navigator.language.split('-')[0];
  if (i18n.supportedLangs.includes(browserLang)) {
    i18n.currentLang = browserLang;
    return;
  }
  
  // Default to German
  i18n.currentLang = 'de';
}

/**
 * Get language from URL
 */
function getURLLanguage() {
  const path = window.location.pathname;
  const match = path.match(/^\/(de|en)\//);
  return match ? match[1] : null;
}

/**
 * Set up language switcher
 */
function setupLanguageSwitcher() {
  const switcher = document.querySelector('.lang-switcher');
  if (!switcher) return;
  
  // Create dropdown if not exists
  let dropdown = switcher.querySelector('.lang-switcher__dropdown');
  if (!dropdown) {
    dropdown = document.createElement('div');
    dropdown.className = 'lang-switcher__dropdown';
    
    dropdown.innerHTML = i18n.supportedLangs.map(lang => `
      <div class="lang-switcher__item ${lang === i18n.currentLang ? 'active' : ''}" data-lang="${lang}">
        <span class="lang-switcher__flag">${i18n.langNames[lang].flag}</span>
        <span>${i18n.langNames[lang].native}</span>
      </div>
    `).join('');
    
    switcher.appendChild(dropdown);
  }
  
  // Toggle dropdown
  switcher.querySelector('.lang-switcher__btn').addEventListener('click', (e) => {
    e.stopPropagation();
    switcher.classList.toggle('active');
  });
  
  // Close on outside click
  document.addEventListener('click', () => {
    switcher.classList.remove('active');
  });
  
  // Language selection
  dropdown.querySelectorAll('.lang-switcher__item').forEach(item => {
    item.addEventListener('click', (e) => {
      e.stopPropagation();
      const newLang = item.dataset.lang;
      if (newLang !== i18n.currentLang) {
        changeLanguage(newLang);
      }
      switcher.classList.remove('active');
    });
  });
  
  // Update button text
  updateSwitcherButton();
}

/**
 * Update language switcher button
 */
function updateSwitcherButton() {
  const btn = document.querySelector('.lang-switcher__btn');
  if (!btn) return;
  
  const currentLangInfo = i18n.langNames[i18n.currentLang];
  btn.innerHTML = `
    <span>${currentLangInfo.flag}</span>
    <span>${currentLangInfo.native}</span>
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <polyline points="6 9 12 15 18 9"/>
    </svg>
  `;
}

/**
 * Change language
 */
function changeLanguage(lang) {
  if (!i18n.supportedLangs.includes(lang)) return;
  
  i18n.currentLang = lang;
  localStorage.setItem('preferred_lang', lang);
  
  // Apply translations
  applyTranslations();
  
  // Update URL
  updateURL();
  
  // Update switcher
  updateSwitcherButton();
  updateDropdownActive();
  
  // Update alternate links
  setupAlternateLinks();
  
  // Track event
  trackLanguageChange();
}

/**
 * Apply translations to DOM
 */
function applyTranslations() {
  // Add loading state
  document.documentElement.classList.add('lang-loading');
  
  // Translate all elements with data-i18n attribute
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.dataset.i18n;
    const translation = getTranslation(key);
    
    if (translation !== undefined) {
      // Handle different element types
      if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
        if (el.dataset.i18nPlaceholder) {
          el.placeholder = translation;
        }
      } else {
        el.textContent = translation;
      }
    }
  });
  
  // Translate placeholders
  document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
    const key = el.dataset.i18nPlaceholder;
    const translation = getTranslation(key);
    if (translation !== undefined) {
      el.placeholder = translation;
    }
  });
  
  // Translate attributes
  document.querySelectorAll('[data-i18n-aria]').forEach(el => {
    const attrMap = JSON.parse(el.dataset.i18nAria || '{}');
    Object.entries(attrMap).forEach(([attr, key]) => {
      const translation = getTranslation(key);
      if (translation !== undefined) {
        el.setAttribute(attr, translation);
      }
    });
  });
  
  // Update HTML lang attribute
  document.documentElement.lang = i18n.currentLang;
  
  // Remove loading state
  setTimeout(() => {
    document.documentElement.classList.remove('lang-loading');
  }, 100);
}

/**
 * Get translation for key
 */
function getTranslation(key) {
  const translations = i18n.translations[i18n.currentLang] || i18n.translations[i18n.fallbackLang];
  return translations[key] || i18n.translations[i18n.fallbackLang]?.[key] || key;
}

/**
 * Update URL based on language
 */
function updateURL() {
  const currentPath = window.location.pathname;
  let newPath = currentPath;
  
  // Remove existing language prefix
  newPath = newPath.replace(/^\/(de|en)\//, '/');
  newPath = newPath.replace(/^\/(de|en)$/, '/');
  
  // Add new language prefix
  if (i18n.currentLang !== 'de') {
    newPath = '/' + i18n.currentLang + newPath;
  }
  
  // Update URL without reload
  const newURL = newPath + window.location.search + window.location.hash;
  window.history.replaceState({}, '', newURL);
  
  // Update hreflang tags
  updateAlternateLinks();
}

/**
 * Set up alternate links for SEO
 */
function setupAlternateLinks() {
  let head = document.head;
  
  // Remove existing alternate links
  document.querySelectorAll('link[rel="alternate"][hreflang]').forEach(el => el.remove());
  
  // Create new alternate links
  const currentPath = window.location.pathname.replace(/^\/(de|en)\//, '/').replace(/^\/(de|en)$/, '/');
  
  i18n.supportedLangs.forEach(lang => {
    const link = document.createElement('link');
    link.rel = 'alternate';
    link.hreflang = lang === 'de' ? 'de-AT' : lang;
    link.href = window.location.origin + (lang === 'de' ? '' : '/' + lang) + currentPath;
    head.appendChild(link);
  });
  
  // x-default
  const xDefault = document.createElement('link');
  xDefault.rel = 'alternate';
  xDefault.hreflang = 'x-default';
  xDefault.href = window.location.origin + currentPath;
  head.appendChild(xDefault);
}

/**
 * Update alternate links
 */
function updateAlternateLinks() {
  setupAlternateLinks();
}

/**
 * Set up RTL support (for future Arabic/Hebrew)
 */
function setupRTLSupport() {
  const rtlLangs = ['ar', 'he', 'fa'];
  
  if (rtlLangs.includes(i18n.currentLang)) {
    document.documentElement.dir = 'rtl';
  } else {
    document.documentElement.dir = 'ltr';
  }
}

/**
 * Track language change
 */
function trackLanguageChange() {
  if (window.gtag) {
    window.gtag('event', 'language_change', {
      event_category: 'i18n',
      event_label: i18n.currentLang
    });
  }
  
  // Track in journey
  if (window.journeyTrack) {
    window.journeyTrack.track('language_change', { lang: i18n.currentLang });
  }
}

/**
 * Get current language
 */
function getCurrentLang() {
  return i18n.currentLang;
}

/**
 * Get translation function for external use
 */
function t(key) {
  return getTranslation(key);
}

// Export for global use
window.i18n = i18n;
window.changeLanguage = changeLanguage;
window.getCurrentLang = getCurrentLang;
window.t = t;