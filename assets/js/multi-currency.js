/* Multi-currency & Geo-targeting JavaScript */

document.addEventListener('DOMContentLoaded', function() {
  initGeoTargeting();
});

/**
 * Geo-targeting Configuration
 */
const geoConfig = {
  currencies: {
    EUR: { symbol: '€', rate: 1, locale: 'de-DE' },
    USD: { symbol: '$', rate: 1.08, locale: 'en-US' },
    GBP: { symbol: '£', rate: 0.86, locale: 'en-GB' },
    CHF: { symbol: 'CHF', rate: 0.94, locale: 'de-CH' }
  },
  
  locales: [
    { code: 'de', name: 'Deutsch', flag: '🇦🇹' },
    { code: 'en', name: 'English', flag: '🇬🇧' },
    { code: 'fr', name: 'Français', flag: '🇫🇷' },
    { code: 'it', name: 'Italiano', flag: '🇮🇹' }
  ],
  
  // Exchange rate API (fallback rates)
  fallbackRates: {
    EUR: 1,
    USD: 1.08,
    GBP: 0.86,
    CHF: 0.94
  }
};

/**
 * Geo State
 */
let geoState = {
  currency: 'EUR',
  locale: 'de',
  country: 'AT',
  timezone: 'Europe/Vienna'
};

/**
 * Initialize geo-targeting
 */
function initGeoTargeting() {
  // Detect location
  detectLocation();
  
  // Create currency selector
  createCurrencySelector();
  
  // Create locale switcher
  createLocaleSwitcher();
  
  // Apply regional pricing
  applyRegionalPricing();
}

/**
 * Detect user location
 */
function detectLocation() {
  // Check stored preferences first
  const storedCurrency = localStorage.getItem('devmiro-currency');
  const storedLocale = localStorage.getItem('devmiro-locale');
  
  if (storedCurrency) geoState.currency = storedCurrency;
  if (storedLocale) geoState.locale = storedLocale;
  
  // Try to detect from browser/API
  fetch('https://ipapi.co/json/')
    .then(res => res.json())
    .then(data => {
      if (data.country_code) {
        geoState.country = data.country_code;
        
        // Auto-select currency based on country
        if (!storedCurrency) {
          const countryCurrency = getCountryCurrency(data.country_code);
          if (countryCurrency) {
            geoState.currency = countryCurrency;
            localStorage.setItem('devmiro-currency', geoState.currency);
          }
        }
        
        // Show geo banner for specific regions
        if (['DE', 'CH'].includes(data.country_code) && !storedCurrency) {
          showGeoBanner(data.country_code);
        }
      }
    })
    .catch(() => {
      // Fallback to browser locale
      const browserLocale = navigator.language.split('-')[0];
      geoState.locale = browserLocale || 'de';
    });
}

/**
 * Get country currency
 */
function getCountryCurrency(countryCode) {
  const countryCurrencyMap = {
    'DE': 'EUR', 'AT': 'EUR', 'CH': 'CHF',
    'US': 'USD', 'GB': 'GBP', 'FR': 'EUR',
    'IT': 'EUR', 'ES': 'EUR', 'NL': 'EUR'
  };
  return countryCurrencyMap[countryCode] || null;
}

/**
 * Create currency selector
 */
function createCurrencySelector() {
  const headerActions = document.querySelector('.header__actions');
  if (!headerActions) return;
  
  const selector = document.createElement('div');
  selector.className = 'currency-selector';
  selector.innerHTML = `
    <button class="currency-selector__btn" onclick="toggleCurrencyDropdown()">
      <span class="currency-selector__current">${geoState.currency}</span>
      <svg viewBox="0 0 24 24" fill="currentColor" width="12" height="12">
        <path d="M7 10l5 5 5-5z"/>
      </svg>
    </button>
    <div class="currency-selector__dropdown" id="currency-dropdown">
      ${Object.entries(geoConfig.currencies).map(([code, data]) => `
        <div class="currency-selector__option ${code === geoState.currency ? 'active' : ''}" onclick="selectCurrency('${code}')">
          <span class="currency-selector__code">${code}</span>
          <span class="currency-selector__symbol">${data.symbol}</span>
        </div>
      `).join('')}
    </div>
  `;
  
  headerActions.appendChild(selector);
}

/**
 * Toggle currency dropdown
 */
function toggleCurrencyDropdown() {
  const dropdown = document.getElementById('currency-dropdown');
  if (dropdown) {
    dropdown.classList.toggle('active');
  }
}

/**
 * Select currency
 */
function selectCurrency(code) {
  geoState.currency = code;
  localStorage.setItem('devmiro-currency', code);
  
  // Update UI
  document.querySelector('.currency-selector__current').textContent = code;
  document.querySelectorAll('.currency-selector__option').forEach(opt => {
    opt.classList.toggle('active', opt.textContent.includes(code));
  });
  
  // Apply new pricing
  applyRegionalPricing();
  
  // Close dropdown
  document.getElementById('currency-dropdown')?.classList.remove('active');
  
  // Show confirmation
  showToast(`${code} ausgewählt`, 'success');
}

/**
 * Create locale switcher
 */
function createLocaleSwitcher() {
  const headerActions = document.querySelector('.header__actions');
  if (!headerActions) return;
  
  const switcher = document.createElement('div');
  switcher.className = 'locale-switcher';
  switcher.innerHTML = geoConfig.locales.map(loc => `
    <button class="locale-switcher__btn ${loc.code === geoState.locale ? 'active' : ''}" onclick="selectLocale('${loc.code}')">
      ${loc.flag}
    </button>
  `).join('');
  
  headerActions.appendChild(switcher);
}

/**
 * Select locale
 */
function selectLocale(code) {
  geoState.locale = code;
  localStorage.setItem('devmiro-locale', code);
  
  // Update UI
  document.querySelectorAll('.locale-switcher__btn').forEach(btn => {
    btn.classList.toggle('active', btn.textContent.includes(geoConfig.locales.find(l => l.code === code)?.flag || ''));
  });
  
  // Apply locale change
  window.setCurrentLang = () => code;
  
  // Reload page for full locale change
  showToast('Sprache geändert', 'success');
}

/**
 * Show geo banner
 */
function showGeoBanner(countryCode) {
  const banner = document.createElement('div');
  banner.className = 'geo-banner';
  banner.innerHTML = `
    <div class="geo-banner__content">
      <span class="geo-banner__text">
        🌍 Sie surfen von ${countryCode === 'DE' ? 'Deutschland' : 'der Schweiz'}
      </span>
      <button class="geo-banner__close" onclick="this.closest('.geo-banner').remove()">
        Verstanden
      </button>
    </div>
  `;
  
  document.body.insertBefore(banner, document.body.firstChild);
}

/**
 * Apply regional pricing
 */
function applyRegionalPricing() {
  const prices = document.querySelectorAll('[data-price]');
  const rate = geoConfig.currencies[geoState.currency]?.rate || 1;
  const symbol = geoConfig.currencies[geoState.currency]?.symbol || '€';
  
  prices.forEach(el => {
    const basePrice = parseFloat(el.dataset.price);
    const converted = Math.round(basePrice * rate * 100) / 100;
    
    // Check for discount
    const original = el.querySelector('.regional-price__original');
    if (original) {
      const originalDisplay = `${symbol}${basePrice.toFixed(2)}`;
      original.textContent = originalDisplay;
    }
    
    // Set converted price
    const priceDisplay = el.querySelector('.price-value') || el;
    if (priceDisplay) {
      priceDisplay.textContent = `${symbol}${converted.toFixed(2)}`;
    }
  });
}

/**
 * Get current currency info
 */
function getCurrentCurrency() {
  return geoConfig.currencies[geoState.currency] || geoConfig.currencies.EUR;
}

/**
 * Convert price
 */
function convertPrice(basePrice, fromCurrency = 'EUR', toCurrency = null) {
  toCurrency = toCurrency || geoState.currency;
  
  const fromRate = geoConfig.currencies[fromCurrency]?.rate || 1;
  const toRate = geoConfig.currencies[toCurrency]?.rate || 1;
  
  const inEUR = basePrice / fromRate;
  const converted = inEUR * toRate;
  
  return {
    original: basePrice,
    converted: Math.round(converted * 100) / 100,
    symbol: geoConfig.currencies[toCurrency]?.symbol || '€'
  };
}

/**
 * Get timezone info
 */
function getTimezoneInfo() {
  const now = new Date();
  const offset = -now.getTimezoneOffset();
  const hours = Math.floor(Math.abs(offset) / 60);
  const minutes = Math.abs(offset) % 60;
  const sign = offset >= 0 ? '+' : '-';
  
  return {
    name: Intl.DateTimeFormat().resolvedOptions().timeZone,
    offset: `UTC${sign}${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`,
    localTime: now.toLocaleTimeString(geoConfig.currencies[geoState.currency]?.locale || 'de-DE')
  };
}

/**
 * Format price with locale
 */
function formatPrice(price, currency = null) {
  currency = currency || geoState.currency;
  const config = geoConfig.currencies[currency] || geoConfig.currencies.EUR;
  
  return new Intl.NumberFormat(config.locale, {
    style: 'currency',
    currency: currency
  }).format(price);
}

/**
 * Get visitor location summary
 */
function getVisitorLocation() {
  return {
    currency: geoState.currency,
    locale: geoState.locale,
    country: geoState.country,
    timezone: getTimezoneInfo()
  };
}

// Export for global use
window.geoConfig = geoConfig;
window.geoState = geoState;
window.selectCurrency = selectCurrency;
window.selectLocale = selectLocale;
window.convertPrice = convertPrice;
window.formatPrice = formatPrice;
window.getVisitorLocation = getVisitorLocation;