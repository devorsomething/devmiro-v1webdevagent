/* AI Personalization Engine JavaScript */

document.addEventListener('DOMContentLoaded', function() {
  initPersonalization();
});

/**
 * Personalization Configuration
 */
const personalizationConfig = {
  enableBehaviorTracking: true,
  enableRecommendations: true,
  enableSmartPopups: true,
  enableUserSegmentation: true,
  enablePredictiveCart: true,
  
  // AI Model settings (simplified)
  modelEndpoint: '/api/personalize',
  refreshInterval: 30000,
  
  // Segmentation rules
  segments: {
    new: { maxVisits: 1, minTimeOnSite: 0 },
    returning: { minVisits: 2, maxVisits: 5 },
    engaged: { minVisits: 5, minTimeOnSite: 120 },
    vip: { minPurchases: 3, minTotalValue: 1000 }
  },
  
  // Recommendations
  recommendations: {
    basedOnViews: true,
    basedOnCart: true,
    basedOnHistory: true,
    maxItems: 4
  }
};

/**
 * User State
 */
let userState = {
  userId: null,
  segment: 'new',
  visits: 0,
  pageViews: [],
  cartItems: [],
  searchHistory: [],
  timeOnSite: 0,
  lastActive: Date.now(),
  preferences: {},
  engagementScore: 0,
  predictedNeeds: []
};

/**
 * Initialize personalization
 */
function initPersonalization() {
  // Generate or retrieve user ID
  initUserId();
  
  // Start behavior tracking
  if (personalizationConfig.enableBehaviorTracking) {
    initBehaviorTracking();
  }
  
  // Initialize recommendations
  if (personalizationConfig.enableRecommendations) {
    initRecommendations();
  }
  
  // Initialize smart popups
  if (personalizationConfig.enableSmartPopups) {
    initSmartPopups();
  }
  
  // Initialize user segmentation
  if (personalizationConfig.enableUserSegmentation) {
    initUserSegmentation();
  }
  
  // Initialize predictive cart
  if (personalizationConfig.enablePredictiveCart) {
    initPredictiveCart();
  }
  
  // Apply personalization
  applyPersonalization();
}

/**
 * Initialize user ID
 */
function initUserId() {
  let userId = localStorage.getItem('devmiro_user_id');
  
  if (!userId) {
    userId = 'user_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    localStorage.setItem('devmiro_user_id', userId);
  }
  
  userState.userId = userId;
  
  // Load existing data
  const savedData = localStorage.getItem('devmiro_user_data');
  if (savedData) {
    userState = { ...userState, ...JSON.parse(savedData) };
    userState.visits++;
    userState.lastActive = Date.now();
  } else {
    userState.visits = 1;
  }
  
  // Save updated data
  saveUserData();
}

/**
 * Save user data
 */
function saveUserData() {
  localStorage.setItem('devmiro_user_data', JSON.stringify(userState));
}

/**
 * Initialize behavior tracking
 */
function initBehaviorTracking() {
  // Track page views
  trackPageView(window.location.pathname);
  
  // Track scroll depth
  initScrollTracking();
  
  // Track clicks
  initClickTracking();
  
  // Track time on page
  initTimeTracking();
  
  // Create tracker UI
  createBehaviorTracker();
  
  // Update behavior tracker
  setInterval(updateBehaviorTracker, 5000);
}

/**
 * Track page view
 */
function trackPageView(path) {
  userState.pageViews.push({
    path,
    timestamp: Date.now()
  });
  
  // Keep only last 50 pages
  if (userState.pageViews.length > 50) {
    userState.pageViews = userState.pageViews.slice(-50);
  }
  
  saveUserData();
}

/**
 * Initialize scroll tracking
 */
function initScrollTracking() {
  let maxScroll = 0;
  
  window.addEventListener('scroll', () => {
    const scrollPercent = (window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100;
    maxScroll = Math.max(maxScroll, scrollPercent);
    
    userState.engagementScore = Math.min(100, maxScroll);
  });
}

/**
 * Initialize click tracking
 */
function initClickTracking() {
  document.addEventListener('click', (e) => {
    const target = e.target.closest('a, button');
    if (!target) return;
    
    userState.clicks = userState.clicks || [];
    userState.clicks.push({
      element: target.tagName.toLowerCase(),
      text: target.textContent?.trim().substring(0, 50),
      href: target.href || null,
      timestamp: Date.now()
    });
    
    // Keep only last 100 clicks
    if (userState.clicks.length > 100) {
      userState.clicks = userState.clicks.slice(-100);
    }
  });
}

/**
 * Initialize time tracking
 */
function initTimeTracking() {
  const startTime = Date.now();
  
  setInterval(() => {
    userState.timeOnSite = Math.floor((Date.now() - startTime) / 1000);
    userState.lastActive = Date.now();
    saveUserData();
  }, 10000);
}

/**
 * Create behavior tracker
 */
function createBehaviorTracker() {
  const tracker = document.createElement('div');
  tracker.className = 'behavior-tracker';
  tracker.id = 'behavior-tracker';
  tracker.innerHTML = `
    <div class="behavior-tracker__row">
      <span class="behavior-tracker__label">Segment:</span>
      <span class="behavior-tracker__value" id="user-segment">${userState.segment}</span>
    </div>
    <div class="behavior-tracker__row">
      <span class="behavior-tracker__label">Besuche:</span>
      <span class="behavior-tracker__value">${userState.visits}</span>
    </div>
    <div class="behavior-tracker__row">
      <span class="behavior-tracker__label">Zeit:</span>
      <span class="behavior-tracker__value" id="time-on-site">0s</span>
    </div>
    <div class="behavior-tracker__row">
      <span class="behavior-tracker__label">Score:</span>
      <span class="behavior-tracker__value" id="engagement-score">0%</span>
    </div>
  `;
  
  document.body.appendChild(tracker);
}

/**
 * Update behavior tracker
 */
function updateBehaviorTracker() {
  const timeEl = document.getElementById('time-on-site');
  const scoreEl = document.getElementById('engagement-score');
  const segmentEl = document.getElementById('user-segment');
  
  if (timeEl) {
    const minutes = Math.floor(userState.timeOnSite / 60);
    const seconds = userState.timeOnSite % 60;
    timeEl.textContent = `${minutes}m ${seconds}s`;
  }
  
  if (scoreEl) {
    scoreEl.textContent = Math.round(userState.engagementScore) + '%';
  }
  
  if (segmentEl) {
    segmentEl.textContent = userState.segment;
  }
}

/**
 * Initialize recommendations
 */
function initRecommendations() {
  const container = document.getElementById('recommendations');
  if (!container) return;
  
  renderRecommendations();
}

/**
 * Render recommendations
 */
function renderRecommendations() {
  const container = document.getElementById('recommendations');
  if (!container) return;
  
  const recommendations = generateRecommendations();
  const lang = window.getCurrentLang ? window.getCurrentLang() : 'de';
  
  container.innerHTML = `
    <section class="recommendation-carousel">
      <div class="container">
        <h2 class="section__title" style="margin-bottom: var(--space-4);">
          🎯 ${lang === 'de' ? 'Für Sie empfohlen' : 'Recommended for you'}
        </h2>
        
        <div class="recommendation-carousel__track">
          ${recommendations.map(rec => `
            <div class="recommendation-card" onclick="trackRecommendationClick('${rec.id}')">
              <div class="recommendation-card__image">${rec.icon}</div>
              <div class="recommendation-card__content">
                <span class="recommendation-card__badge">${rec.badge}</span>
                <h3 class="recommendation-card__title">${rec.title}</h3>
                <p class="recommendation-card__desc">${rec.description}</p>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    </section>
  `;
}

/**
 * Generate recommendations (simplified AI)
 */
function generateRecommendations() {
  const recommendations = [
    {
      id: 'web-dev',
      icon: '💻',
      badge: 'Beliebt',
      title: 'Webentwicklung',
      description: 'Maßgeschneiderte Websites für Ihr Business'
    },
    {
      id: 'ux-design',
      icon: '🎨',
      badge: 'Trending',
      title: 'UX Design',
      description: 'Nutzerfreundliche Interfaces die konvertieren'
    },
    {
      id: 'seo',
      icon: '📈',
      badge: 'Empfohlen',
      title: 'SEO Optimierung',
      description: 'Mehr Sichtbarkeit in Google'
    },
    {
      id: 'maintenance',
      icon: '🔧',
      badge: 'Service',
      title: 'Wartung & Support',
      description: 'Runde-the-clock Betreuung'
    }
  ];
  
  // Sort by user interests (simplified)
  if (userState.searchHistory?.length > 0) {
    recommendations.sort((a, b) => {
      const aMatch = a.id.includes(userState.searchHistory[0]) ? 1 : 0;
      const bMatch = b.id.includes(userState.searchHistory[0]) ? 1 : 0;
      return bMatch - aMatch;
    });
  }
  
  return recommendations.slice(0, personalizationConfig.recommendations.maxItems);
}

/**
 * Track recommendation click
 */
function trackRecommendationClick(recId) {
  userState.clicks = userState.clicks || [];
  userState.clicks.push({
    type: 'recommendation',
    id: recId,
    timestamp: Date.now()
  });
  
  saveUserData();
  showToast('Empfehlung angeklickt', 'info');
}

/**
 * Initialize smart popups
 */
function initSmartPopups() {
  const popupRules = [
    {
      trigger: 'exitIntent',
      condition: () => document.querySelector('body:hover'),
      content: {
        title: 'Warten Sie!',
        message: 'Lassen Sie uns Ihr Projekt besprechen, bevor Sie gehen.',
        cta: 'Kostenlos beraten'
      }
    },
    {
      trigger: 'lowEngagement',
      condition: () => userState.timeOnSite > 60 && userState.engagementScore < 30,
      content: {
        title: 'Brauchen Sie Hilfe?',
        message: 'Wir haben Antworten auf Ihre Fragen.',
        cta: 'Chat starten'
      }
    },
    {
      trigger: 'highIntent',
      condition: () => userState.engagementScore > 70 && userState.visits > 1,
      content: {
        title: 'Spezialangebot',
        message: 'Exklusiv für Sie: 20% Rabatt auf Webentwicklung.',
        cta: 'Angebot sichern'
      }
    }
  ];
  
  // Check rules periodically
  setInterval(() => {
    popupRules.forEach(rule => {
      if (rule.condition() && !userState.popupsShown?.includes(rule.trigger)) {
        showSmartPopup(rule.content);
        userState.popupsShown = userState.popupsShown || [];
        userState.popupsShown.push(rule.trigger);
        saveUserData();
      }
    });
  }, 30000);
}

/**
 * Show smart popup
 */
function showSmartPopup(content) {
  const existing = document.querySelector('.smart-popup');
  if (existing) existing.remove();
  
  const popup = document.createElement('div');
  popup.className = 'smart-popup';
  popup.id = 'smart-popup';
  popup.innerHTML = `
    <button class="smart-popup__close" onclick="closeSmartPopup()">✕</button>
    <div class="smart-popup__image">🎁</div>
    <h3 style="margin-bottom: var(--space-2);">${content.title}</h3>
    <p style="margin-bottom: var(--space-4); color: var(--color-text-muted);">${content.message}</p>
    <button class="btn btn--primary" onclick="closeSmartPopup(); trackPopupCTA('${content.cta}');">
      ${content.cta}
    </button>
  `;
  
  document.body.appendChild(popup);
  
  // Auto-close after 10 seconds
  setTimeout(() => {
    const p = document.getElementById('smart-popup');
    if (p) closeSmartPopup();
  }, 10000);
}

/**
 * Close smart popup
 */
function closeSmartPopup() {
  const popup = document.getElementById('smart-popup');
  if (popup) {
    popup.style.animation = 'slideUp 0.3s ease reverse';
    setTimeout(() => popup.remove(), 300);
  }
}

/**
 * Track popup CTA
 */
function trackPopupCTA(cta) {
  userState.conversions = userState.conversions || [];
  userState.conversions.push({
    type: 'popup',
    cta,
    timestamp: Date.now()
  });
  
  saveUserData();
  showToast('Vielen Dank! Wir melden uns bald.', 'success');
}

/**
 * Initialize user segmentation
 */
function initUserSegmentation() {
  updateUserSegment();
}

/**
 * Update user segment
 */
function updateUserSegment() {
  const { segments } = personalizationConfig;
  
  if (userState.purchases >= segments.vip.minPurchases || 
      userState.totalValue >= segments.vip.minTotalValue) {
    userState.segment = 'vip';
  } else if (userState.timeOnSite > 120) {
    userState.segment = 'engaged';
  } else if (userState.visits >= segments.returning.minVisits) {
    userState.segment = 'returning';
  } else {
    userState.segment = 'new';
  }
  
  // Apply segment-specific styling
  applySegmentStyling();
  
  saveUserData();
}

/**
 * Apply segment styling
 */
function applySegmentStyling() {
  const segment = userState.segment;
  
  // Add segment class to body
  document.body.classList.remove('segment-new', 'segment-returning', 'segment-engaged', 'segment-vip');
  document.body.classList.add(`segment-${segment}`);
}

/**
 * Initialize predictive cart
 */
function initPredictiveCart() {
  // Only show for returning users
  if (userState.segment === 'new') return;
  
  const container = document.getElementById('predictive-cart');
  if (!container) return;
  
  renderPredictiveCart();
}

/**
 * Render predictive cart
 */
function renderPredictiveCart() {
  const container = document.getElementById('predictive-cart');
  if (!container) return;
  
  const predictions = generatePredictions();
  const lang = window.getCurrentLang ? window.getCurrentLang() : 'de';
  
  container.innerHTML = `
    <div class="predictive-cart">
      <h4 style="margin-bottom: var(--space-3);">🧠 ${lang === 'de' ? 'Vielleicht interessant' : 'Maybe interesting'}</h4>
      ${predictions.map(p => `
        <div class="predictive-cart__item">
          <div class="predictive-cart__item-icon">${p.icon}</div>
          <div>
            <div style="font-weight: 600; font-size: 0.875rem;">${p.name}</div>
            <span class="predictive-cart__confidence">${p.confidence}% ${lang === 'de' ? 'Match' : 'Match'}</span>
          </div>
        </div>
      `).join('')}
    </div>
  `;
}

/**
 * Generate predictions (simplified)
 */
function generatePredictions() {
  const products = [
    { id: 'web-dev', name: 'Webentwicklung', icon: '💻' },
    { id: 'seo', name: 'SEO Paket', icon: '📈' },
    { id: 'maintenance', name: 'Wartungsvertrag', icon: '🔧' }
  ];
  
  return products.map(p => ({
    ...p,
    confidence: Math.floor(Math.random() * 20) + 70
  })).sort((a, b) => b.confidence - a.confidence).slice(0, 3);
}

/**
 * Apply personalization
 */
function applyPersonalization() {
  // Update content based on segment
  updateContentForSegment();
  
  // Apply preferences
  applyPreferences();
  
  // Send personalization event
  sendPersonalizationEvent();
}

/**
 * Update content for segment
 */
function updateContentForSegment() {
  const segment = userState.segment;
  
  // VIP users see premium content
  if (segment === 'vip') {
    const ctas = document.querySelectorAll('.cta-primary');
    ctas.forEach(cta => {
      cta.textContent = 'VIP Beratung buchen';
    });
  }
  
  // New users see educational content
  if (segment === 'new') {
    // Add "New here?" tooltip trigger
  }
}

/**
 * Apply preferences
 */
function applyPreferences() {
  const prefs = userState.preferences;
  
  // Apply dark mode if set
  if (prefs.darkMode) {
    document.documentElement.classList.add('dark-mode');
  }
  
  // Apply reduced motion if set
  if (prefs.reducedMotion) {
    document.documentElement.classList.add('reduced-motion');
  }
}

/**
 * Send personalization event
 */
function sendPersonalizationEvent() {
  const event = {
    type: 'personalization_applied',
    userId: userState.userId,
    segment: userState.segment,
    engagementScore: userState.engagementScore,
    timestamp: Date.now()
  };
  
  // In production, send to analytics
  console.log('Personalization event:', event);
}

/**
 * Get personalization data
 */
function getPersonalizationData() {
  return {
    ...userState,
    config: personalizationConfig,
    timestamp: Date.now()
  };
}

// Export for global use
window.personalizationConfig = personalizationConfig;
window.userState = userState;
window.closeSmartPopup = closeSmartPopup;
window.trackRecommendationClick = trackRecommendationClick;
window.trackPopupCTA = trackPopupCTA;
window.getPersonalizationData = getPersonalizationData;