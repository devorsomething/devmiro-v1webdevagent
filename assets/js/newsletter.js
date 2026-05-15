/* Email Marketing / Newsletter JavaScript */

document.addEventListener('DOMContentLoaded', function() {
  initNewsletter();
});

/**
 * Newsletter Configuration
 */
const newsletterConfig = {
  // Mailchimp integration (replace with your credentials)
  mailchimp: {
    apiKey: 'YOUR_API_KEY-us1',
    listId: 'YOUR_LIST_ID',
    serverPrefix: 'us1' // First part of API key (e.g., us1, us2)
  },
  
  // Capture types
  captureTypes: {
    de: [
      {
        id: 'guide',
        icon: '📧',
        title: 'Website Starter Guide',
        description: 'Der ultimative Leitfaden für Ihre erste professionelle Website. 50+ Seiten, kostenlos.'
      },
      {
        id: 'checklist',
        icon: '✅',
        title: 'Website Checkliste',
        description: 'Never forget anything again when building or updating your website.'
      },
      {
        id: 'updates',
        icon: '🔔',
        title: 'Website Updates',
        description: 'Neue Features, Sicherheits-Updates und Tipps direkt in Ihr Postfach.'
      }
    ],
    en: [
      {
        id: 'guide',
        icon: '📧',
        title: 'Website Starter Guide',
        description: 'The ultimate guide for your first professional website. 50+ pages, free.'
      },
      {
        id: 'checklist',
        icon: '✅',
        title: 'Website Checklist',
        description: 'Never forget anything again when building or updating your website.'
      },
      {
        id: 'updates',
        icon: '🔔',
        title: 'Website Updates',
        description: 'New features, security updates and tips directly to your inbox.'
      }
    ]
  }
};

/**
 * Get current language
 */
function getNewsletterLang() {
  return window.getCurrentLang ? window.getCurrentLang() : 'de';
}

/**
 * Initialize newsletter
 */
function initNewsletter() {
  const newsletterForms = document.querySelectorAll('.newsletter-form');
  const emailCaptureGrid = document.querySelector('.email-capture__grid');
  
  // Initialize forms
  newsletterForms.forEach(form => {
    initNewsletterForm(form);
  });
  
  // Initialize email capture cards
  if (emailCaptureGrid) {
    renderEmailCaptureCards(emailCaptureGrid);
  }
}

/**
 * Initialize single newsletter form
 */
function initNewsletterForm(form) {
  const input = form.querySelector('.newsletter-form__input');
  const btn = form.querySelector('.newsletter-form__btn');
  
  if (!input || !btn) return;
  
  // Email validation
  input.addEventListener('blur', () => {
    const email = input.value.trim();
    if (email && !isValidEmail(email)) {
      input.classList.add('error');
    } else {
      input.classList.remove('error');
    }
  });
  
  // Clear error on input
  input.addEventListener('input', () => {
    input.classList.remove('error');
  });
  
  // Form submission
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const email = input.value.trim();
    
    if (!email || !isValidEmail(email)) {
      input.classList.add('error');
      input.focus();
      return;
    }
    
    // Disable button
    const originalText = btn.textContent;
    btn.textContent = getNewsletterLang() === 'de' ? 'Wird gesendet...' : 'Sending...';
    btn.disabled = true;
    
    try {
      await subscribeToNewsletter(email);
      showNewsletterSuccess(form);
      
      // Track subscription
      trackNewsletterSubscription(email);
      
    } catch (error) {
      console.error('Newsletter subscription error:', error);
      
      if (window.showToast) {
        window.showToast(
          getNewsletterLang() === 'de' 
            ? 'Ein Fehler ist aufgetreten. Bitte versuchen Sie es erneut.' 
            : 'An error occurred. Please try again.',
          'error'
        );
      }
      
      btn.textContent = originalText;
      btn.disabled = false;
    }
  });
}

/**
 * Validate email
 */
function isValidEmail(email) {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
}

/**
 * Subscribe to newsletter
 */
async function subscribeToNewsletter(email) {
  const { apiKey, listId, serverPrefix } = newsletterConfig.mailchimp;
  
  // If using placeholder API key, simulate success
  if (apiKey === 'YOUR_API_KEY-us1') {
    console.log('Newsletter subscription (demo mode):', email);
    await new Promise(resolve => setTimeout(resolve, 1000));
    return { status: 'demo' };
  }
  
  // Actual Mailchimp API call
  const response = await fetch(`https://${serverPrefix}.api.mailchimp.com/3.0/lists/${listId}/members`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      email_address: email,
      status: 'subscribed',
      tags: ['website-signup']
    })
  });
  
  if (!response.ok) {
    const data = await response.json();
    // If already subscribed, that's OK
    if (data.title === 'Member Exists') {
      return { status: 'already_subscribed' };
    }
    throw new Error(data.detail || 'Subscription failed');
  }
  
  return response.json();
}

/**
 * Show success state
 */
function showNewsletterSuccess(form) {
  const lang = getNewsletterLang();
  const container = form.parentElement;
  
  form.style.display = 'none';
  
  const successHtml = `
    <div class="newsletter-form__success">
      <div class="newsletter-form__success-icon">✓</div>
      <h3 class="newsletter-form__success-title">${lang === 'de' ? 'Willkommen!' : 'Welcome!'}</h3>
      <p class="newsletter-form__success-message">
        ${lang === 'de' 
          ? 'Sie haben sich erfolgreich angemeldet. Wir freuen uns, Sie an Bord zu haben!' 
          : 'You have successfully subscribed. We are excited to have you on board!'}
      </p>
    </div>
  `;
  
  container.insertAdjacentHTML('beforeend', successHtml);
}

/**
 * Render email capture cards
 */
function renderEmailCaptureCards(container) {
  const lang = getNewsletterLang();
  const types = newsletterConfig.captureTypes[lang] || newsletterConfig.captureTypes.de;
  
  container.innerHTML = types.map(type => `
    <div class="email-capture__card" data-capture-id="${type.id}">
      <div class="email-capture__card-icon">${type.icon}</div>
      <h3 class="email-capture__card-title">${type.title}</h3>
      <p class="email-capture__card-desc">${type.description}</p>
      <button class="btn btn--primary" onclick="openEmailCaptureModal('${type.id}')">
        ${lang === 'de' ? 'Jetzt anmelden' : 'Sign up now'}
      </button>
    </div>
  `).join('');
}

/**
 * Open email capture modal (optional)
 */
function openEmailCaptureModal(captureType) {
  const modal = document.querySelector('.email-capture-modal');
  if (modal) {
    modal.classList.add('active');
    modal.dataset.captureType = captureType;
    
    // Focus input
    const input = modal.querySelector('.newsletter-form__input');
    if (input) input.focus();
  }
}

/**
 * Track newsletter subscription
 */
function trackNewsletterSubscription(email) {
  // Journey tracking
  if (window.journeyTrack) {
    window.journeyTrack.track('newsletter_subscribe', {
      email: email.substring(0, 3) + '***', // Privacy
      page_url: window.location.href
    });
  }
  
  // Google Analytics
  if (window.gtag) {
    window.gtag('event', 'newsletter_subscribe', {
      event_category: 'engagement',
      event_label: 'newsletter'
    });
  }
}

// Export for global use
window.newsletterConfig = newsletterConfig;
window.subscribeToNewsletter = subscribeToNewsletter;
window.openEmailCaptureModal = openEmailCaptureModal;