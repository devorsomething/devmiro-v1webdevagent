/* Cookie Settings Modal JavaScript */

document.addEventListener('DOMContentLoaded', function() {
  initCookieConsent();
});

function initCookieConsent() {
  // Check if consent already given
  if (getCookieConsent() !== null) {
    return;
  }

  // Show banner after delay
  setTimeout(() => {
    showCookieBanner();
  }, 2000);
}

function getCookieConsent() {
  return localStorage.getItem('cookieConsent');
}

function saveCookieConsent(preferences) {
  localStorage.setItem('cookieConsent', JSON.stringify({
    date: Date.now(),
    preferences: preferences
  }));
}

function showCookieBanner() {
  const banner = document.querySelector('.cookie-consent');
  if (banner) {
    banner.classList.add('show');
  }
}

function hideCookieBanner() {
  const banner = document.querySelector('.cookie-consent');
  if (banner) {
    banner.classList.remove('show');
  }
}

function openCookieModal() {
  const modal = document.getElementById('cookieModal');
  if (modal) {
    modal.classList.add('show');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }
}

function closeCookieModal() {
  const modal = document.getElementById('cookieModal');
  if (modal) {
    modal.classList.remove('show');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }
}

function acceptAllCookies() {
  const preferences = {
    essential: true,
    analytics: true,
    marketing: true
  };
  
  saveCookieConsent(preferences);
  hideCookieBanner();
  closeCookieModal();
  
  // Enable all cookies
  enableCookies(preferences);
}

function rejectAllCookies() {
  const preferences = {
    essential: true,
    analytics: false,
    marketing: false
  };
  
  saveCookieConsent(preferences);
  hideCookieBanner();
  closeCookieModal();
  
  // Only enable essential
  enableCookies(preferences);
}

function saveCookiePreferences() {
  const analyticsCheckbox = document.getElementById('analyticsCookies');
  const marketingCheckbox = document.getElementById('marketingCookies');
  
  const preferences = {
    essential: true,
    analytics: analyticsCheckbox ? analyticsCheckbox.checked : false,
    marketing: marketingCheckbox ? marketingCheckbox.checked : false
  };
  
  saveCookieConsent(preferences);
  hideCookieBanner();
  closeCookieModal();
  
  // Apply preferences
  enableCookies(preferences);
}

function enableCookies(preferences) {
  // Analytics
  if (preferences.analytics) {
    // Enable Google Analytics
    window.gtag && window.gtag('consent', 'update', {
      'analytics_storage': 'granted'
    });
  } else {
    window.gtag && window.gtag('consent', 'update', {
      'analytics_storage': 'denied'
    });
  }
  
  // Marketing
  if (preferences.marketing) {
    // Enable marketing cookies
    window.gtag && window.gtag('consent', 'update', {
      'ad_storage': 'granted'
    });
  } else {
    window.gtag && window.gtag('consent', 'update', {
      'ad_storage': 'denied'
    });
  }
}

// Event Listeners
document.addEventListener('DOMContentLoaded', function() {
  // Accept button
  const acceptBtn = document.getElementById('acceptAllCookies');
  if (acceptBtn) {
    acceptBtn.addEventListener('click', acceptAllCookies);
  }
  
  // Reject button
  const rejectBtn = document.getElementById('rejectAllCookies');
  if (rejectBtn) {
    rejectBtn.addEventListener('click', rejectAllCookies);
  }
  
  // Save button
  const saveBtn = document.getElementById('saveCookiePreferences');
  if (saveBtn) {
    saveBtn.addEventListener('click', saveCookiePreferences);
  }
  
  // Banner settings button
  const settingsBtn = document.querySelector('.cookie-consent__settings');
  if (settingsBtn) {
    settingsBtn.addEventListener('click', () => {
      hideCookieBanner();
      openCookieModal();
    });
  }
  
  // Banner accept button
  const bannerAccept = document.querySelector('.cookie-consent__accept');
  if (bannerAccept) {
    bannerAccept.addEventListener('click', acceptAllCookies);
  }
  
  // Modal close button
  const modalClose = document.querySelector('.cookie-modal__close');
  if (modalClose) {
    modalClose.addEventListener('click', closeCookieModal);
  }
  
  // Modal backdrop
  const backdrop = document.querySelector('.cookie-modal__backdrop');
  if (backdrop) {
    backdrop.addEventListener('click', closeCookieModal);
  }
  
  // Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeCookieModal();
    }
  });
});

// Export for use
window.acceptAllCookies = acceptAllCookies;
window.rejectAllCookies = rejectAllCookies;
window.saveCookiePreferences = saveCookiePreferences;
window.openCookieModal = openCookieModal;
window.closeCookieModal = closeCookieModal;