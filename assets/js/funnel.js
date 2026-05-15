/* Customer Journey Tracking JavaScript */

document.addEventListener('DOMContentLoaded', function() {
  initJourneyTracking();
  initFunnelVisualization();
});

/**
 * Customer Journey Tracking
 */
function initJourneyTracking() {
  const journeyConfig = {
    stages: ['awareness', 'consideration', 'decision', 'retention'],
    events: {
      awareness: ['page_view', 'scroll_25', 'scroll_50', 'scroll_75', 'cta_click'],
      consideration: ['time_on_page_30s', 'portfolio_view', 'testimonial_view', 'pricing_view', 'faq_view'],
      decision: ['form_start', 'form_field_focus', 'form_step_complete', 'chat_open', 'phone_click'],
      retention: ['form_submit', 'conversion', 'review_request', 'referral']
    }
  };

  // Initialize journey tracking
  window.customerJourney = {
    currentStage: null,
    events: [],
    startTime: Date.now(),
    sessionId: generateSessionId()
  };

  // Track page view
  trackEvent('page_view', { page: window.location.pathname });

  // Scroll depth tracking
  let scrollDepths = new Set();
  window.addEventListener('scroll', debounce(() => {
    const scrollPercent = Math.round((window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100);
    
    [25, 50, 75, 100].forEach(depth => {
      if (scrollPercent >= depth && !scrollDepths.has(depth)) {
        scrollDepths.add(depth);
        trackEvent(`scroll_${depth}`, { depth, page: window.location.pathname });
        updateJourneyStage();
      }
    });
  }, 500));

  // CTA click tracking
  document.querySelectorAll('a[href*="contact"], a[href*="offer"], .cta-button, .hero-cta').forEach(el => {
    el.addEventListener('click', () => {
      trackEvent('cta_click', { 
        element: el.tagName,
        href: el.href || el.getAttribute('href'),
        page: window.location.pathname
      });
    });
  });

  // Form tracking
  const forms = document.querySelectorAll('form');
  forms.forEach(form => {
    let formStarted = false;
    let currentStep = 0;
    
    form.addEventListener('focusin', (e) => {
      if (!formStarted) {
        formStarted = true;
        trackEvent('form_start', { form_id: form.id || 'unknown' });
        updateJourneyStage();
      }
      
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'SELECT' || e.target.tagName === 'TEXTAREA') {
        trackEvent('form_field_focus', { 
          field: e.target.name || e.target.id || 'unknown',
          form_id: form.id || 'unknown'
        });
      }
    });

    // Multi-step form tracking
    const stepIndicators = form.querySelectorAll('[data-step], .step-indicator, .progress-step');
    if (stepIndicators.length > 0) {
      const nextBtns = form.querySelectorAll('.next-step, [data-next], .btn-next');
      nextBtns.forEach(btn => {
        btn.addEventListener('click', () => {
          currentStep++;
          trackEvent('form_step_complete', { 
            step: currentStep,
            total_steps: stepIndicators.length,
            form_id: form.id || 'unknown'
          });
        });
      });
    }

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      trackEvent('form_submit', { 
        form_id: form.id || 'unknown',
        time_to_complete: Date.now() - customerJourney.startTime
      });
      updateJourneyStage();
      
      // Simulate form submission
      showFormSuccess(form);
    });
  });

  // Chat widget tracking
  const chatButtons = document.querySelectorAll('[data-chat], .chat-trigger, [href*="chat"]');
  chatButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      trackEvent('chat_open', { page: window.location.pathname });
      updateJourneyStage();
    });
  });

  // Phone click tracking
  const phoneLinks = document.querySelectorAll('a[href^="tel:"], [data-phone]');
  phoneLinks.forEach(link => {
    link.addEventListener('click', () => {
      trackEvent('phone_click', { 
        phone: link.href.replace('tel:', ''),
        page: window.location.pathname
      });
      updateJourneyStage();
    });
  });

  // Portfolio/Services viewing
  const portfolioLinks = document.querySelectorAll('[href*="portfolio"], [href*="gallery"], .portfolio-link');
  portfolioLinks.forEach(link => {
    link.addEventListener('click', () => {
      trackEvent('portfolio_view', { page: window.location.pathname });
    });
  });

  // Update journey stage
  function updateJourneyStage() {
    const events = customerJourney.events;
    
    // Determine current stage based on events
    if (events.some(e => e.type === 'form_submit' || e.type === 'conversion')) {
      customerJourney.currentStage = 'retention';
    } else if (events.some(e => ['form_start', 'chat_open', 'phone_click'].includes(e.type))) {
      customerJourney.currentStage = 'decision';
    } else if (events.some(e => ['portfolio_view', 'pricing_view', 'faq_view', 'time_on_page_30s'].includes(e.type))) {
      customerJourney.currentStage = 'consideration';
    } else if (events.some(e => ['page_view', 'scroll_50', 'cta_click'].includes(e.type))) {
      customerJourney.currentStage = 'awareness';
    }

    // Store in localStorage
    localStorage.setItem('customer_journey', JSON.stringify(customerJourney));
  }

  // Track event function
  function trackEvent(type, data = {}) {
    const event = {
      type,
      data,
      timestamp: Date.now(),
      session_id: customerJourney.sessionId
    };
    
    customerJourney.events.push(event);
    
    // Send to analytics
    if (window.gtag) {
      window.gtag('event', `journey_${type}`, {
        event_category: 'customer_journey',
        event_label: type,
        ...data
      });
    }

    // Debug logging
    if (new URLSearchParams(window.location.search).has('journey_debug')) {
      console.log('[Journey]', event);
    }
  }

  // Generate session ID
  function generateSessionId() {
    const existing = sessionStorage.getItem('journey_session_id');
    if (existing) return existing;
    
    const sessionId = 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    sessionStorage.setItem('journey_session_id', sessionId);
    return sessionId;
  }

  // Show form success (demo)
  function showFormSuccess(form) {
    const successMsg = document.createElement('div');
    successMsg.className = 'form-success';
    successMsg.innerHTML = `
      <div class="form-success__content">
        <svg viewBox="0 0 24 24" width="64" height="64">
          <circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" stroke-width="2"/>
          <path d="M9 12l2 2 4-4" fill="none" stroke="currentColor" stroke-width="2"/>
        </svg>
        <h3>Anfrage gesendet!</h3>
        <p>Wir melden uns innerhalb von 24 Stunden bei Ihnen.</p>
      </div>
    `;
    form.innerHTML = '';
    form.appendChild(successMsg);
    form.classList.add('success');
  }

  // Debounce helper
  function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }

  // Return tracking functions for external use
  window.journeyTrack = {
    track: trackEvent,
    getStage: () => customerJourney.currentStage,
    getEvents: () => [...customerJourney.events],
    getSessionId: () => customerJourney.sessionId
  };
}

/**
 * Funnel Visualization
 */
function initFunnelVisualization() {
  const funnelData = {
    awareness: { 
      value: 1000, 
      label: 'Awareness',
      description: 'Website-Besucher',
      icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>'
    },
    consideration: { 
      value: 400, 
      label: 'Interest',
      description: 'Interessierte Besucher',
      icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>'
    },
    decision: { 
      value: 120, 
      label: 'Decision',
      description: 'Anfragen gestellt',
      icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>'
    },
    retention: { 
      value: 45, 
      label: 'Conversion',
      description: 'Kunden gewonnen',
      icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>'
    }
  };

  const funnelContainer = document.querySelector('.funnel');
  if (!funnelContainer) return;

  // Render funnel
  const maxValue = funnelData.awareness.value;
  const stages = Object.entries(funnelData);

  stages.forEach(([stage, data], index) => {
    const percentage = Math.round((data.value / maxValue) * 100);
    const dropoff = index > 0 ? Math.round(((stages[index - 1][1].value - data.value) / stages[index - 1][1].value) * 100) : 0;

    // Create stage element
    const stageEl = document.createElement('div');
    stageEl.className = 'funnel-stage';
    stageEl.innerHTML = `
      <div class="funnel-bar" onclick="this.classList.toggle('expanded')">
        <div class="funnel-bar__fill funnel-bar__fill--${stage}" style="width: ${percentage}%">
          <div class="funnel-bar__content">
            <div class="funnel-bar__icon">${data.icon}</div>
            <div class="funnel-bar__info">
              <div class="funnel-bar__label">${data.label}</div>
              <div class="funnel-bar__description">${data.description}</div>
            </div>
            <div class="funnel-bar__metrics">
              <div class="funnel-bar__value">${data.value.toLocaleString()}</div>
              <div class="funnel-bar__percentage">${percentage}%</div>
            </div>
          </div>
        </div>
      </div>
      ${dropoff > 0 ? `
        <div class="funnel-dropoff">
          <span class="funnel-dropoff__badge">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polyline points="23 18 13.5 8.5 8.5 13.5 1 6"/>
              <polyline points="17 18 23 18 23 12"/>
            </svg>
            ${dropoff}% Abwanderung
          </span>
        </div>
      ` : ''}
    `;

    funnelContainer.appendChild(stageEl);

    // Animate bar fill
    setTimeout(() => {
      const fill = stageEl.querySelector('.funnel-bar__fill');
      fill.style.width = '0%';
      setTimeout(() => {
        fill.style.width = `${percentage}%`;
      }, 100);
    }, 300 + (index * 150));
  });

  // Render summary metrics
  const totalVisitors = funnelData.awareness.value;
  const totalConversions = funnelData.retention.value;
  const overallConversion = Math.round((totalConversions / totalVisitors) * 100);
  const avgSessionValue = 2500; // Demo value
  const revenue = totalConversions * avgSessionValue;

  const summaryHtml = `
    <div class="funnel-summary">
      <div class="funnel-metric">
        <div class="funnel-metric__icon">
          <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
            <circle cx="9" cy="7" r="4"/>
            <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
            <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
          </svg>
        </div>
        <div class="funnel-metric__value">${totalVisitors.toLocaleString()}</div>
        <div class="funnel-metric__label">Gesamtbesucher</div>
      </div>
      <div class="funnel-metric">
        <div class="funnel-metric__icon">
          <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
            <polyline points="22 4 12 14.01 9 11.01"/>
          </svg>
        </div>
        <div class="funnel-metric__value">${overallConversion}%</div>
        <div class="funnel-metric__label">Conversion Rate</div>
      </div>
      <div class="funnel-metric">
        <div class="funnel-metric__icon">
          <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="12" y1="1" x2="12" y2="23"/>
            <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
          </svg>
        </div>
        <div class="funnel-metric__value">€${(revenue / 1000).toFixed(0)}k</div>
        <div class="funnel-metric__label">Projektwert</div>
      </div>
      <div class="funnel-metric">
        <div class="funnel-metric__icon">
          <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="10"/>
            <polyline points="12 6 12 12 16 14"/>
          </svg>
        </div>
        <div class="funnel-metric__value">2:45</div>
        <div class="funnel-metric__label">Ø Verweildauer</div>
      </div>
    </div>
  `;

  funnelContainer.insertAdjacentHTML('afterend', summaryHtml);
}

// Export for global use
window.initJourneyTracking = initJourneyTracking;
window.initFunnelVisualization = initFunnelVisualization;