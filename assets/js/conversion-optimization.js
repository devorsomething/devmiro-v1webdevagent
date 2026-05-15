/* Advanced Conversion Optimization JavaScript */

document.addEventListener('DOMContentLoaded', function() {
  initConversionOptimization();
});

/**
 * Conversion Optimization Configuration
 */
const conversionConfig = {
  // Exit intent
  exitIntentEnabled: true,
  exitIntentDelay: 5000,
  
  // Smart popups
  popupTriggers: {
    scrollDepth: 75,
    timeOnPage: 60,
    minPages: 2
  },
  
  // Urgency
  urgencyEnabled: true,
  urgencyDuration: 3600000, // 1 hour
  
  // Social proof
  socialProofEnabled: true,
  socialProofInterval: 15000,
  
  // Scarcity
  scarcityEnabled: true,
  
  // Funnel tracking
  funnelSteps: [
    { id: 'visit', name: 'Besuch', icon: '👁️' },
    { id: 'view', name: 'Produkt-Ansicht', icon: '📄' },
    { id: 'interest', name: 'Interesse', icon: '💡' },
    { id: 'consideration', name: 'Überlegung', icon: '🤔' },
    { id: 'conversion', name: 'Conversion', icon: '🎯' }
  ]
};

/**
 * Conversion State
 */
let conversionState = {
  currentFunnelStage: 'visit',
  pagesViewed: [],
  timeOnPage: 0,
  exitIntentShown: false,
  popupsShown: [],
  urgencyTimer: null,
  urgencyEnd: null
};

/**
 * Initialize conversion optimization
 */
function initConversionOptimization() {
  // Track funnel progress
  initFunnelTracking();
  
  // Initialize exit intent
  if (conversionConfig.exitIntentEnabled) {
    initExitIntent();
  }
  
  // Initialize smart popups
  initSmartPopups();
  
  // Initialize urgency timers
  if (conversionConfig.urgencyEnabled) {
    initUrgencyTimer();
  }
  
  // Initialize social proof
  if (conversionConfig.socialProofEnabled) {
    initSocialProof();
  }
  
  // Initialize scarcity
  if (conversionConfig.scarcityEnabled) {
    initScarcity();
  }
  
  // Track time on page
  initTimeTracking();
}

/**
 * Initialize funnel tracking
 */
function initFunnelTracking() {
  // Update current stage based on URL
  const url = window.location.pathname;
  
  if (url.includes('contact') || url.includes('anfrage')) {
    conversionState.currentFunnelStage = 'consideration';
  } else if (url.includes('pricing') || url.includes('preis')) {
    conversionState.currentFunnelStage = 'interest';
  } else if (url.includes('product') || url.includes('service')) {
    conversionState.currentFunnelStage = 'view';
  }
  
  // Add to pages viewed
  conversionState.pagesViewed.push({
    url,
    timestamp: Date.now()
  });
  
  // Save state
  saveConversionState();
  
  // Render funnel visualization
  renderFunnelVisualization();
}

/**
 * Render funnel visualization
 */
function renderFunnelVisualization() {
  const container = document.getElementById('conv-funnel');
  if (!container) return;
  
  const lang = window.getCurrentLang ? window.getCurrentLang() : 'de';
  
  // Calculate conversion rates (mock data)
  const funnelData = [
    { stage: 'visit', count: 10000, rate: 100 },
    { stage: 'view', count: 6500, rate: 65 },
    { stage: 'interest', count: 3200, rate: 32 },
    { stage: 'consideration', count: 1800, rate: 18 },
    { stage: 'conversion', count: 450, rate: 4.5 }
  ];
  
  container.innerHTML = `
    <div class="conv-funnel-enhanced">
      <div class="conv-funnel-enhanced__header">
        <h2 class="section__title">🎯 ${lang === 'de' ? 'Conversion Funnel' : 'Conversion Funnel'}</h2>
        <p class="section__subtitle">${lang === 'de' ? 'Verfolge deine Fortschritte' : 'Track your progress'}</p>
      </div>
      <div class="conv-funnel-enhanced__stages">
        ${funnelData.map((step, index) => `
          <div class="conv-stage">
            ${index > 0 ? '<div class="conv-stage__connector"></div>' : ''}
            <div class="conv-stage__icon">${conversionConfig.funnelSteps[index].icon}</div>
            <div class="conv-stage__count">${step.count.toLocaleString()}</div>
            <div class="conv-stage__label">${getStepLabel(step.stage, lang)}</div>
            <div class="conv-stage__rate">${step.rate}%</div>
          </div>
        `).join('')}
      </div>
    </div>
  `;
}

/**
 * Get step label
 */
function getStepLabel(stage, lang) {
  const labels = {
    visit: lang === 'de' ? 'Besuch' : 'Visit',
    view: lang === 'de' ? 'Produkt' : 'Product',
    interest: lang === 'de' ? 'Interesse' : 'Interest',
    consideration: lang === 'de' ? 'Überlegung' : 'Consideration',
    conversion: lang === 'de' ? 'Conversion' : 'Conversion'
  };
  return labels[stage] || stage;
}

/**
 * Initialize exit intent
 */
function initExitIntent() {
  // Only on desktop
  if (window.innerWidth < 1024) return;
  
  document.addEventListener('mouseout', (e) => {
    if (e.clientY < 10 && !conversionState.exitIntentShown) {
      showExitIntent();
    }
  });
}

/**
 * Show exit intent modal
 */
function showExitIntent() {
  // Check if already shown today
  const lastShown = localStorage.getItem('devmiro_exit_intent_date');
  const today = new Date().toDateString();
  
  if (lastShown === today) return;
  
  conversionState.exitIntentShown = true;
  localStorage.setItem('devmiro_exit_intent_date', today);
  
  const lang = window.getCurrentLang ? window.getCurrentLang() : 'de';
  
  const overlay = document.createElement('div');
  overlay.className = 'exit-intent-overlay active';
  overlay.id = 'exit-intent-overlay';
  overlay.onclick = (e) => { if (e.target === overlay) overlay.remove(); };
  
  overlay.innerHTML = `
    <div class="exit-intent-modal">
      <button class="exit-intent-modal__close" onclick="this.closest('.exit-intent-overlay').remove()" style="
        position: absolute;
        top: var(--space-4);
        right: var(--space-4);
        background: none;
        border: none;
        font-size: 1.5rem;
        cursor: pointer;
      ">✕</button>
      
      <div class="exit-intent-modal__icon">😟</div>
      <h2 style="font-size: 1.75rem; margin-bottom: var(--space-3);">
        ${lang === 'de' ? 'Warte! Bevor du gehst...' : 'Wait! Before you go...'}
      </h2>
      <p style="color: var(--color-text-muted); margin-bottom: var(--space-4);">
        ${lang === 'de' 
          ? 'Erhalte 15% Rabatt auf deine erste Zusammenarbeit mit uns.'
          : 'Get 15% off your first collaboration with us.'}
      </p>
      
      <div class="urgency-timer" style="margin-bottom: var(--space-4);">
        <span class="urgency-timer__icon">⏰</span>
        <span class="urgency-timer__time" id="exit-timer">15:00</span>
      </div>
      
      <form class="form" style="max-width: 400px; margin: 0 auto;" onsubmit="handleExitIntentSubmit(event)">
        <div class="form__group">
          <label class="form__label" for="exit-email">
            ${lang === 'de' ? 'Deine E-Mail' : 'Your Email'}
          </label>
          <input type="email" id="exit-email" class="form__input" 
            placeholder="email@beispiel.at" required>
        </div>
        <button type="submit" class="btn btn--primary btn--full">
          ${lang === 'de' ? 'Rabatt sichern' : 'Claim Discount'}
        </button>
      </form>
      
      <p style="font-size: 0.75rem; color: var(--color-text-muted); margin-top: var(--space-3);">
        ${lang === 'de' 
          ? 'Kein Spam. Jederzeit abmeldbar.'
          : 'No spam. Unsubscribe anytime.'}
      </p>
    </div>
  `;
  
  document.body.appendChild(overlay);
  
  // Start countdown
  startExitTimer(900);
}

/**
 * Start exit timer
 */
function startExitTimer(seconds) {
  let remaining = seconds;
  
  const timer = setInterval(() => {
    remaining--;
    
    const mins = Math.floor(remaining / 60);
    const secs = remaining % 60;
    
    const display = document.getElementById('exit-timer');
    if (display) {
      display.textContent = `${mins}:${secs.toString().padStart(2, '0')}`;
    }
    
    if (remaining <= 0) {
      clearInterval(timer);
      const overlay = document.getElementById('exit-intent-overlay');
      if (overlay) overlay.remove();
    }
  }, 1000);
}

/**
 * Handle exit intent submit
 */
function handleExitIntentSubmit(event) {
  event.preventDefault();
  
  const email = document.getElementById('exit-email').value;
  
  // Track conversion
  console.log('Exit intent conversion:', email);
  
  // Show success
  showToast('🎉 Rabatt-Code: WELCOME15', 'success');
  
  // Close modal
  const overlay = document.getElementById('exit-intent-overlay');
  if (overlay) overlay.remove();
}

/**
 * Initialize smart popups
 */
function initSmartPopups() {
  // Scroll depth trigger
  let scrollTriggered = false;
  
  window.addEventListener('scroll', () => {
    if (scrollTriggered) return;
    
    const scrollPercent = (window.scrollY / document.body.scrollHeight) * 100;
    
    if (scrollPercent >= conversionConfig.popupTriggers.scrollDepth && 
        conversionState.pagesViewed.length >= conversionConfig.popupTriggers.minPages) {
      scrollTriggered = true;
      showSmartPopup('scroll');
    }
  });
}

/**
 * Show smart popup
 */
function showSmartPopup(type) {
  if (conversionState.popupsShown.includes(type)) return;
  
  conversionState.popupsShown.push(type);
  
  const lang = window.getCurrentLang ? window.getCurrentLang() : 'de';
  
  const popup = document.createElement('div');
  popup.className = `smart-popup smart-popup--bottom-right ${type === 'scroll' ? 'active' : ''}`;
  popup.id = 'smart-popup';
  
  popup.innerHTML = `
    <div class="smart-popup__content">
      <div class="smart-popup__header">
        <span class="smart-popup__title">🎁 ${lang === 'de' ? 'Angebot' : 'Offer'}</span>
        <button class="smart-popup__close" onclick="this.closest('.smart-popup').classList.remove('active')">✕</button>
      </div>
      
      <div class="smart-popup__offer">
        <div class="smart-popup__discount">-15%</div>
        <p>${lang === 'de' 
          ? 'Sonderangebot für dich!' 
          : 'Special offer for you!'}</p>
      </div>
      
      <a href="/contact" class="btn btn--primary btn--full">
        ${lang === 'de' ? 'Jetzt anfragen' : 'Request Now'}
      </a>
    </div>
  `;
  
  document.body.appendChild(popup);
  
  // Auto-hide after 10 seconds
  setTimeout(() => {
    const p = document.getElementById('smart-popup');
    if (p) p.classList.remove('active');
  }, 10000);
}

/**
 * Initialize urgency timer
 */
function initUrgencyTimer() {
  // Check for existing timer
  const savedEnd = localStorage.getItem('devmiro_urgency_end');
  
  if (savedEnd) {
    conversionState.urgencyEnd = parseInt(savedEnd);
    
    if (Date.now() < conversionState.urgencyEnd) {
      renderUrgencyTimer();
      startUrgencyCountdown();
    }
  }
}

/**
 * Start urgency timer
 */
function startUrgencyTimer(duration) {
  conversionState.urgencyEnd = Date.now() + duration;
  localStorage.setItem('devmiro_urgency_end', conversionState.urgencyEnd.toString());
  
  renderUrgencyTimer();
  startUrgencyCountdown();
}

/**
 * Render urgency timer
 */
function renderUrgencyTimer() {
  const lang = window.getCurrentLang ? window.getCurrentLang() : 'de';
  
  const timer = document.createElement('div');
  timer.id = 'urgency-timer-global';
  timer.className = 'urgency-timer';
  timer.innerHTML = `
    <span class="urgency-timer__icon">🔥</span>
    <span>Angebot endet in:</span>
    <span class="urgency-timer__time" id="urgency-countdown">--:--</span>
  `;
  
  // Add to pricing section or nav
  const pricingSection = document.querySelector('.pricing-section, #pricing, .container .pricing');
  if (pricingSection) {
    pricingSection.insertBefore(timer, pricingSection.firstChild);
  }
}

/**
 * Start urgency countdown
 */
function startUrgencyCountdown() {
  const countdownEl = document.getElementById('urgency-countdown');
  
  const interval = setInterval(() => {
    const remaining = conversionState.urgencyEnd - Date.now();
    
    if (remaining <= 0) {
      clearInterval(interval);
      const timer = document.getElementById('urgency-timer-global');
      if (timer) timer.remove();
      localStorage.removeItem('devmiro_urgency_end');
      return;
    }
    
    const hours = Math.floor(remaining / 3600000);
    const mins = Math.floor((remaining % 3600000) / 60000);
    const secs = Math.floor((remaining % 60000) / 1000);
    
    if (countdownEl) {
      if (hours > 0) {
        countdownEl.textContent = `${hours}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
      } else {
        countdownEl.textContent = `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
      }
    }
  }, 1000);
}

/**
 * Initialize social proof
 */
function initSocialProof() {
  const messages = [
    { avatars: ['👩', '👨', '👨'], text: '3 Personen schauen sich das gerade an' },
    { avatars: ['🧑', '👩'], text: 'Jemand hat gerade eine Anfrage gesendet' },
    { avatars: ['👨', '👩', '👨'], text: '2 Personen sind interessiert' },
    { avatars: ['👩'], text: 'Letzte Woche: 12 neue Projekte abgeschlossen' }
  ];
  
  let messageIndex = 0;
  
  setInterval(() => {
    const message = messages[messageIndex % messages.length];
    
    showSocialProofBar(message);
    
    messageIndex++;
  }, conversionConfig.socialProofInterval);
}

/**
 * Show social proof bar
 */
function showSocialProofBar(message) {
  const existing = document.querySelector('.social-proof-bar');
  if (existing) existing.remove();
  
  const bar = document.createElement('div');
  bar.className = 'social-proof-bar active';
  bar.innerHTML = `
    <div class="social-proof-bar__avatars">
      ${message.avatars.map(a => `<div class="social-proof-bar__avatar">${a}</div>`).join('')}
    </div>
    <span class="social-proof-bar__text">${message.text}</span>
  `;
  
  document.body.appendChild(bar);
  
  // Hide after 5 seconds
  setTimeout(() => {
    bar.classList.remove('active');
    setTimeout(() => bar.remove(), 300);
  }, 5000);
}

/**
 * Initialize scarcity
 */
function initScarcity() {
  // Check stock levels (mock)
  const stockData = {
    'web-dev': { remaining: 3, total: 10 },
    'consulting': { remaining: 5, total: 10 }
  };
  
  Object.entries(stockData).forEach(([service, data]) => {
    if (data.remaining <= 5) {
      showScarcityIndicator(service, data.remaining);
    }
  });
}

/**
 * Show scarcity indicator
 */
function showScarcityIndicator(service, remaining) {
  const indicator = document.createElement('div');
  indicator.className = 'scarce-indicator';
  indicator.id = `scarce-${service}`;
  indicator.innerHTML = `
    <span class="scarce-indicator__dot"></span>
    <span>Nur noch ${remaining} Plätze verfügbar!</span>
  `;
  
  // Add to service card
  const serviceCard = document.querySelector(`[data-service="${service}"]`);
  if (serviceCard) {
    const header = serviceCard.querySelector('.service-card__header');
    if (header) {
      header.appendChild(indicator);
    }
  }
}

/**
 * Initialize time tracking
 */
function initTimeTracking() {
  conversionState.timeOnPage = 0;
  
  const interval = setInterval(() => {
    conversionState.timeOnPage++;
    sessionStorage.setItem('devmiro_time_on_page', conversionState.timeOnPage.toString());
    
    // Check if ready for popup
    if (conversionState.timeOnPage >= conversionConfig.popupTriggers.timeOnPage &&
        conversionState.pagesViewed.length >= conversionConfig.popupTriggers.minPages) {
      showSmartPopup('time');
      clearInterval(interval);
    }
  }, 1000);
}

/**
 * Save conversion state
 */
function saveConversionState() {
  localStorage.setItem('devmiro_conversion_state', JSON.stringify(conversionState));
}

/**
 * Get conversion state
 */
function getConversionState() {
  return {
    ...conversionState,
    config: conversionConfig
  };
}

// Export for global use
window.conversionConfig = conversionConfig;
window.conversionState = conversionState;
window.showExitIntent = showExitIntent;
window.showSmartPopup = showSmartPopup;
window.startUrgencyTimer = startUrgencyTimer;
window.getConversionState = getConversionState;