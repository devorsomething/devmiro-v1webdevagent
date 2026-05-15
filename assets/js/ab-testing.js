/* A/B Testing System */

/**
 * DevMiro A/B Testing Framework
 * Lightweight, privacy-friendly A/B testing without external dependencies
 */

(function() {
  'use strict';

  // A/B Test Configuration
  const AB_TEST_CONFIG = {
    // Active tests
    tests: [
      {
        id: 'hero-cta-text',
        name: 'Hero CTA Button Text',
        description: 'Test different CTA texts on hero section',
        variants: [
          { id: 'control', weight: 33.33, name: 'Kostenloses Erstgespräch' },
          { id: 'variant-a', weight: 33.33, name: 'Angebot anfordern' },
          { id: 'variant-b', weight: 33.34, name: 'Jetzt starten' }
        ],
        goals: ['click', 'form_submit'],
        pages: ['/', '/index.html']
      },
      {
        id: 'pricing-display',
        name: 'Pricing Display Style',
        description: 'Test slider vs cards for price display',
        variants: [
          { id: 'control', weight: 50, name: 'Slider' },
          { id: 'variant-a', weight: 50, name: 'Cards' }
        ],
        goals: ['click', 'scroll', 'time_on_page'],
        pages: ['/', '/index.html', '/services.html']
      },
      {
        id: 'testimonial-position',
        name: 'Testimonials Position',
        description: 'Test testimonials before vs after CTA',
        variants: [
          { id: 'control', weight: 50, name: 'After CTA' },
          { id: 'variant-a', weight: 50, name: 'Before CTA' }
        ],
        goals: ['click', 'scroll'],
        pages: ['/', '/index.html']
      },
      {
        id: 'contact-form-steps',
        name: 'Contact Form Steps',
        description: 'Test 3-step vs 4-step form',
        variants: [
          { id: 'control', weight: 50, name: '3 Steps' },
          { id: 'variant-a', weight: 50, name: '4 Steps' }
        ],
        goals: ['form_start', 'form_step', 'form_submit', 'form_abandon'],
        pages: ['/contact.html']
      }
    ],
    
    // Storage key prefix
    storagePrefix: 'ab_test_',
    
    // Cookie expiry in days
    cookieExpiry: 30,
    
    // Enable analytics tracking
    trackEnabled: true
  };

  /**
   * A/B Test Manager
   */
  class ABTestManager {
    constructor(config) {
      this.config = config;
      this.userId = this.getUserId();
      this.variants = {};
      this.init();
    }

    /**
     * Initialize A/B Tests
     */
    init() {
      // Load or assign variants for each test
      this.config.tests.forEach(test => {
        const variant = this.getVariant(test);
        this.variants[test.id] = variant;
        
        // Apply variant to DOM
        this.applyVariant(test.id, variant);
        
        // Track assignment
        this.track(test.id, variant, 'assigned');
      });

      // Setup goal tracking
      this.setupGoalTracking();
    }

    /**
     * Get or assign user ID
     */
    getUserId() {
      const storageKey = `${this.config.storagePrefix}user_id`;
      let userId = localStorage.getItem(storageKey);
      
      if (!userId) {
        userId = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        localStorage.setItem(storageKey, userId);
      }
      
      return userId;
    }

    /**
     * Get variant for a test (from storage or assign new)
     */
    getVariant(test) {
      const storageKey = `${this.config.storagePrefix}${test.id}`;
      let stored = localStorage.getItem(storageKey);
      
      if (stored) {
        return stored;
      }

      // Check if test is active on current page
      const currentPage = window.location.pathname;
      const isActivePage = test.pages.some(page => 
        currentPage.includes(page.replace('/', ''))
      );
      
      if (!isActivePage) {
        return null;
      }

      // Assign variant based on weight
      const random = Math.random() * 100;
      let cumulative = 0;
      
      for (const variant of test.variants) {
        cumulative += variant.weight;
        if (random <= cumulative) {
          localStorage.setItem(storageKey, variant.id);
          return variant.id;
        }
      }

      // Fallback to first variant
      localStorage.setItem(storageKey, test.variants[0].id);
      return test.variants[0].id;
    }

    /**
     * Apply variant to DOM
     */
    applyVariant(testId, variantId) {
      if (!variantId) return;

      const test = this.config.tests.find(t => t.id === testId);
      if (!test) return;

      const variant = test.variants.find(v => v.id === variantId);
      if (!variant) return;

      // Apply CSS class to body
      document.body.classList.add(`ab-${testId}-${variantId}`);

      // Apply specific modifications based on test
      switch (testId) {
        case 'hero-cta-text':
          this.applyHeroCTAText(variant.name);
          break;
        case 'pricing-display':
          this.applyPricingDisplay(variantId);
          break;
        case 'testimonial-position':
          this.applyTestimonialPosition(variantId);
          break;
        case 'contact-form-steps':
          this.applyContactFormSteps(variantId);
          break;
      }
    }

    /**
     * Apply Hero CTA Text
     */
    applyHeroCTAText(text) {
      const ctaButtons = document.querySelectorAll('.hero-cta, .hero__cta, [data-ab="hero-cta"]');
      ctaButtons.forEach(btn => {
        if (btn.tagName === 'BUTTON') {
          btn.textContent = text;
        } else if (btn.tagName === 'A') {
          btn.textContent = text;
        }
      });
    }

    /**
     * Apply Pricing Display Style
     */
    applyPricingDisplay(variantId) {
      const priceSection = document.querySelector('.price-calculator, [data-ab="pricing"]');
      if (!priceSection) return;

      if (variantId === 'variant-a') {
        priceSection.classList.add('ab-pricing-cards');
      } else {
        priceSection.classList.add('ab-pricing-slider');
      }
    }

    /**
     * Apply Testimonial Position
     */
    applyTestimonialPosition(variantId) {
      const testimonials = document.querySelector('.testimonials');
      const cta = document.querySelector('.cta');
      
      if (!testimonials || !cta) return;

      if (variantId === 'variant-a') {
        // Move testimonials before CTA
        cta.parentNode.insertBefore(testimonials, cta);
      }
      // Control: testimonials stay after CTA
    }

    /**
     * Apply Contact Form Steps
     */
    applyContactFormSteps(variantId) {
      const form = document.querySelector('.multi-step-form, [data-ab="contact-form"]');
      if (!form) return;

      if (variantId === 'variant-a') {
        form.classList.add('ab-form-4-steps');
      } else {
        form.classList.add('ab-form-3-steps');
      }
    }

    /**
     * Setup Goal Tracking
     */
    setupGoalTracking() {
      // Click tracking
      document.addEventListener('click', (e) => {
        const target = e.target.closest('a, button');
        if (target) {
          this.trackGoal('click', { element: target.id || target.className });
        }
      });

      // Scroll tracking
      let scrollTimeout;
      window.addEventListener('scroll', () => {
        clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(() => {
          this.trackGoal('scroll', { scrollY: window.scrollY });
        }, 100);
      });

      // Form tracking
      const forms = document.querySelectorAll('form');
      forms.forEach(form => {
        form.addEventListener('submit', (e) => {
          this.trackGoal('form_submit', { form: form.id || form.className });
        });

        // Track form field interactions
        const fields = form.querySelectorAll('input, select, textarea');
        fields.forEach(field => {
          field.addEventListener('focus', () => {
            this.trackGoal('form_field_focus', { field: field.name || field.id });
          }, { once: true });
        });
      });

      // Time on page
      let timeOnPage = 0;
      setInterval(() => {
        timeOnPage += 1;
        if (timeOnPage % 30 === 0) { // Every 30 seconds
          this.trackGoal('time_on_page', { seconds: timeOnPage });
        }
      }, 1000);
    }

    /**
     * Track event
     */
    track(testId, variantId, event, data = {}) {
      if (!this.config.trackEnabled) return;

      const eventData = {
        test_id: testId,
        variant_id: variantId,
        event: event,
        user_id: this.userId,
        timestamp: Date.now(),
        url: window.location.href,
        ...data
      };

      // Console log for debugging
      if (window.location.search.includes('ab_debug')) {
        console.log('[A/B Test]', eventData);
      }

      // Send to analytics (if available)
      if (window.gtag) {
        window.gtag('event', 'ab_test_event', eventData);
      }

      // Store in localStorage for analysis
      this.storeEvent(eventData);
    }

    /**
     * Track goal completion
     */
    trackGoal(goal, data = {}) {
      Object.keys(this.variants).forEach(testId => {
        this.track(testId, this.variants[testId], `goal_${goal}`, data);
      });
    }

    /**
     * Store event for later analysis
     */
    storeEvent(eventData) {
      const storageKey = `${this.config.storagePrefix}events`;
      let events = JSON.parse(localStorage.getItem(storageKey) || '[]');
      
      // Keep last 100 events
      if (events.length >= 100) {
        events = events.slice(-99);
      }
      
      events.push(eventData);
      localStorage.setItem(storageKey, JSON.stringify(events));
    }

    /**
     * Get all current variants
     */
    getVariants() {
      return { ...this.variants };
    }

    /**
     * Force variant (for testing)
     */
    forceVariant(testId, variantId) {
      const storageKey = `${this.config.storagePrefix}${testId}`;
      localStorage.setItem(storageKey, variantId);
      location.reload();
    }

    /**
     * Reset all tests
     */
    resetAll() {
      Object.keys(localStorage).forEach(key => {
        if (key.startsWith(this.config.storagePrefix)) {
          localStorage.removeItem(key);
        }
      });
      location.reload();
    }
  }

  // Initialize on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      window.abTests = new ABTestManager(AB_TEST_CONFIG);
    });
  } else {
    window.abTests = new ABTestManager(AB_TEST_CONFIG);
  }

  // Debug mode
  if (window.location.search.includes('ab_debug')) {
    console.log('[A/B Testing] Debug Mode Enabled');
    console.log('[A/B Testing] User ID:', localStorage.getItem('ab_test_user_id'));
    console.log('[A/B Testing] Current variants:', window.abTests.getVariants());
  }

  // Expose for global use
  window.ABTestManager = ABTestManager;
  window.abTests = null; // Will be set on init

})();