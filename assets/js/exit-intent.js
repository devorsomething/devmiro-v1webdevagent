/* Exit Intent Popup JavaScript */

document.addEventListener('DOMContentLoaded', function() {
  initExitIntent();
});

/**
 * Exit Intent Popup Configuration
 */
const exitIntentConfig = {
  enabled: true,
  maxShows: 1,
  cooldown: 7, // days
  delay: 5000, // ms before activation
  excludeSelectors: ['input', 'textarea', 'select', 'a'],
  pages: ['/', '/index.html', '/services.html', '/contact.html', '/about.html'],
  showOnScrollUp: true,
  scrollUpThreshold: 100
};

/**
 * Exit Intent Popup Class
 */
class ExitIntentPopup {
  constructor() {
    this.config = exitIntentConfig;
    this.shown = false;
    this.lastScrollY = 0;
    this.init();
  }

  init() {
    // Check if should show
    if (!this.shouldShow()) {
      return;
    }

    // Wait for delay
    setTimeout(() => {
      this.bindEvents();
    }, this.config.delay);
  }

  shouldShow() {
    // Check current page
    const page = window.location.pathname;
    if (!this.config.pages.some(p => page.includes(p))) {
      return false;
    }

    // Check cooldown
    const lastShown = localStorage.getItem('exitIntentShown');
    if (lastShown) {
      const daysSince = (Date.now() - parseInt(lastShown)) / (1000 * 60 * 60 * 24);
      if (daysSince < this.config.cooldown) {
        return false;
      }
    }

    // Check if already shown this session
    if (sessionStorage.getItem('exitIntentShown')) {
      return false;
    }

    return true;
  }

  bindEvents() {
    // Desktop: Mouse leave viewport (going up to URL bar)
    document.addEventListener('mouseout', (e) => {
      if (!this.shown && e.clientY < 10) {
        // Check if leaving to external link
        const target = e.relatedTarget || e.toElement;
        if (!target || target.tagName === 'HTML' || target.tagName === 'BODY') {
          this.show();
        }
      }
    });

    // Mobile: Scroll up quickly (going to leave via back button)
    if (this.config.showOnScrollUp) {
      window.addEventListener('scroll', this.handleScroll.bind(this), { passive: true });
    }

    // Keyboard: Back button detection
    window.addEventListener('popstate', () => {
      if (!this.shown) {
        this.show();
      }
    });

    // Tab visibility change (switching tabs = might be leaving)
    document.addEventListener('visibilitychange', () => {
      if (document.hidden && !this.shown) {
        // User switched tabs - potential exit intent
        setTimeout(() => {
          if (!document.hidden && !this.shown) {
            // User came back but didn't interact
          }
        }, 5000);
      }
    });
  }

  handleScroll() {
    const currentScrollY = window.scrollY;
    
    // Scrolling up quickly (potential back button intent on mobile)
    if (currentScrollY < this.lastScrollY && 
        currentScrollY < this.config.scrollUpThreshold &&
        this.lastScrollY > 200) {
      this.show();
    }
    
    this.lastScrollY = currentScrollY;
  }

  show() {
    if (this.shown || !this.config.enabled) {
      return;
    }

    this.shown = true;

    // Save to localStorage and sessionStorage
    localStorage.setItem('exitIntentShown', Date.now().toString());
    sessionStorage.setItem('exitIntentShown', 'true');

    // Create popup
    this.createPopup();

    // Track event
    if (typeof window.crispTrackEvent === 'function') {
      window.crispTrackEvent('exit_intent_shown', { page: window.location.pathname });
    }
  }

  createPopup() {
    // Create popup container
    const popup = document.createElement('div');
    popup.className = 'exit-intent-popup';
    popup.innerHTML = this.getPopupHTML();
    document.body.appendChild(popup);

    // Prevent body scroll
    document.body.style.overflow = 'hidden';

    // Trigger animation
    requestAnimationFrame(() => {
      popup.classList.add('show');
    });

    // Bind events
    this.bindPopupEvents(popup);

    // Auto-close after 60 seconds (optional)
    setTimeout(() => {
      if (!popup.classList.contains('closed')) {
        this.hide();
      }
    }, 60000);
  }

  getPopupHTML() {
    return `
      <div class="exit-intent-popup__backdrop"></div>
      <div class="exit-intent-popup__content">
        <button class="exit-intent-popup__close" aria-label="Schließen">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="18" y1="6" x2="6" y2="18"/>
            <line x1="6" y1="6" x2="18" y2="18"/>
          </svg>
        </button>

        <div class="exit-intent-popup__icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
            <line x1="9" y1="10" x2="15" y2="10"/>
          </svg>
        </div>

        <div class="exit-intent-popup__badge">Warten Sie!</div>

        <h2 class="exit-intent-popup__title">
          Sie haben noch kein kostenloses Erstgespräch vereinbart
        </h2>

        <p class="exit-intent-popup__text">
          In einem 30-minütigen Gespräch klären wir Ihre Fragen und 
          erstellen Ihnen ein unverbindliches Angebot — ohne Verpflichtungen.
        </p>

        <div class="exit-intent-popup__offer">
          <span class="exit-intent-popup__offer-badge">
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
            </svg>
            Ihr Vorteil
          </span>
          <p>Kostenlose Beratung + <strong>10% Rabatt</strong> auf Ihr Projekt</p>
        </div>

        <div class="exit-intent-popup__actions">
          <a href="contact.html" class="exit-intent-popup__cta btn btn--primary btn--large" onclick="trackExitIntentConversion()">
            <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
            </svg>
            Jetzt Termin vereinbaren
          </a>
          <button class="exit-intent-popup__dismiss">
            Nein danke, ich melde mich später
          </button>
        </div>

        <div class="exit-intent-popup__trust">
          <span>
            <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
            </svg>
            Keine Verpflichtungen
          </span>
          <span>
            <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="12" cy="12" r="10"/>
              <polyline points="12 6 12 12 16 14"/>
            </svg>
            30 Minuten
          </span>
          <span>
            <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
              <polyline points="22 4 12 14.01 9 11.01"/>
            </svg>
            100% kostenlos
          </span>
        </div>
      </div>
    `;
  }

  bindPopupEvents(popup) {
    // Close button
    popup.querySelector('.exit-intent-popup__close').addEventListener('click', () => {
      this.hide();
    });

    // Backdrop click
    popup.querySelector('.exit-intent-popup__backdrop').addEventListener('click', () => {
      this.hide();
    });

    // Dismiss button
    popup.querySelector('.exit-intent-popup__dismiss').addEventListener('click', () => {
      this.hide();
    });

    // CTA click tracking
    popup.querySelector('.exit-intent-popup__cta').addEventListener('click', () => {
      if (typeof window.crispTrackEvent === 'function') {
        window.crispTrackEvent('exit_intent_clicked', { page: window.location.pathname });
      }
    });

    // Escape key
    const escapeHandler = (e) => {
      if (e.key === 'Escape') {
        this.hide();
        document.removeEventListener('keydown', escapeHandler);
      }
    };
    document.addEventListener('keydown', escapeHandler);
  }

  hide() {
    const popup = document.querySelector('.exit-intent-popup');
    if (!popup) return;

    popup.classList.add('closed');

    setTimeout(() => {
      popup.remove();
      document.body.style.overflow = '';
    }, 300);
  }
}

// Track conversion
function trackExitIntentConversion() {
  if (typeof window.crispTrackEvent === 'function') {
    window.crispTrackEvent('exit_intent_conversion', {
      page: window.location.pathname,
      timestamp: Date.now()
    });
  }
}

// Initialize
function initExitIntent() {
  const popup = new ExitIntentPopup();
  window.exitIntentPopup = popup;
  return popup;
}

// Export for global use
window.initExitIntent = initExitIntent;
window.trackExitIntentConversion = trackExitIntentConversion;