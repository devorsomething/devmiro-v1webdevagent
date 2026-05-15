/* Push Notifications JavaScript */

document.addEventListener('DOMContentLoaded', function() {
  initPushNotifications();
});

/**
 * Push Notifications Configuration
 */
const pushConfig = {
  // OneSignal App ID (replace with your actual App ID)
  appId: 'YOUR_ONESIGNAL_APP_ID',
  
  // Notification settings
  settings: {
    showPromptDelay: 5000, // 5 seconds
    promptLifetime: 7, // days
    autoPrompt: true,
    notificationIcons: true,
    notifyButton: true
  },
  
  // Notification messages
  messages: {
    welcome: {
      de: { title: 'Willkommen bei DevMiro! 🎉', body: 'Sie erhalten jetzt wichtige Updates direkt in Ihren Browser.' },
      en: { title: 'Welcome to DevMiro! 🎉', body: 'You will now receive important updates directly in your browser.' }
    },
    promo: {
      de: { title: 'Special Angebot! 🔥', body: 'Erhalten Sie 20% Rabatt auf Ihre erste Website.' },
      en: { title: 'Special Offer! 🔥', body: 'Get 20% off your first website.' }
    }
  },
  
  // Tracking events
  events: ['notification_received', 'notification_clicked', 'permission_prompted', 'permission_accepted', 'permission_rejected']
};

/**
 * Get current language
 */
function getPushLang() {
  return window.getCurrentLang ? window.getCurrentLang() : 'de';
}

/**
 * Push Notifications State
 */
let pushState = {
  isSubscribed: false,
  permission: Notification.permission,
  subscriptionId: null
};

/**
 * Initialize push notifications
 */
function initPushNotifications() {
  // Check if Push is supported
  if (!('Notification' in window) || !('serviceWorker' in navigator)) {
    console.log('Push notifications not supported');
    return;
  }
  
  // Load saved state
  loadPushState();
  
  // Check if already subscribed
  if (pushState.isSubscribed) {
    showSubscriptionBadge();
  }
  
  // Auto-prompt after delay
  if (pushConfig.settings.autoPrompt && pushState.permission === 'default') {
    setTimeout(() => {
      if (!isPushPromptShown()) {
        showPushPrompt();
      }
    }, pushConfig.settings.showPromptDelay);
  }
  
  // Create notification button
  createNotificationButton();
}

/**
 * Load push state from localStorage
 */
function loadPushState() {
  const saved = localStorage.getItem('devmiro-push-state');
  if (saved) {
    try {
      pushState = JSON.parse(saved);
    } catch (e) {
      console.log('Could not load push state');
    }
  }
}

/**
 * Save push state to localStorage
 */
function savePushState() {
  localStorage.setItem('devmiro-push-state', JSON.stringify(pushState));
}

/**
 * Check if prompt was shown recently
 */
function isPushPromptShown() {
  const shown = localStorage.getItem('devmiro-push-prompt-shown');
  if (!shown) return false;
  
  const days = parseInt(shown);
  const lastShown = new Date(days);
  const now = new Date();
  const diffDays = Math.floor((now - lastShown) / (1000 * 60 * 60 * 24));
  
  return diffDays < pushConfig.settings.promptLifetime;
}

/**
 * Mark prompt as shown
 */
function markPushPromptShown() {
  localStorage.setItem('devmiro-push-prompt-shown', new Date().getTime().toString());
}

/**
 * Show push notification prompt
 */
function showPushPrompt() {
  const prompt = document.getElementById('pushPrompt');
  if (!prompt) {
    createPushPrompt();
  }
  
  const el = document.getElementById('pushPrompt');
  if (el) {
    el.classList.add('active');
    trackPushEvent('permission_prompted');
  }
}

/**
 * Create push prompt HTML
 */
function createPushPrompt() {
  const lang = getPushLang();
  const isGerman = lang === 'de';
  
  const prompt = document.createElement('div');
  prompt.id = 'pushPrompt';
  prompt.className = 'push-notification-prompt';
  prompt.innerHTML = `
    <div class="push-notification-prompt__icon">
      <svg viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.89 2 2 2zm6-6v-5c0-3.07-1.64-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.63 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2z"/>
      </svg>
    </div>
    <h3 class="push-notification-prompt__title">${isGerman ? 'Benachrichtigungen aktivieren' : 'Enable Notifications'}</h3>
    <p class="push-notification-prompt__text">${isGerman ? 'Erhalten Sie Updates über neue Blog-Beiträge, Angebote und wichtige Neuigkeiten.' : 'Receive updates about new blog posts, offers and important news.'}</p>
    <div class="push-notification-prompt__actions">
      <button class="push-notification-prompt__btn push-notification-prompt__btn--accept" onclick="subscribeToPush()">
        ${isGerman ? 'Aktivieren' : 'Enable'}
      </button>
      <button class="push-notification-prompt__btn push-notification-prompt__btn--decline" onclick="hidePushPrompt()">
        ${isGerman ? 'Nein Danke' : 'Not now'}
      </button>
    </div>
  `;
  
  document.body.appendChild(prompt);
}

/**
 * Hide push prompt
 */
function hidePushPrompt() {
  const prompt = document.getElementById('pushPrompt');
  if (prompt) {
    prompt.classList.remove('active');
    markPushPromptShown();
  }
}

/**
 * Subscribe to push notifications
 */
async function subscribeToPush() {
  hidePushPrompt();
  markPushPromptShown();
  trackPushEvent('permission_prompted');
  
  try {
    const permission = await Notification.requestPermission();
    
    if (permission === 'granted') {
      pushState.permission = 'granted';
      pushState.isSubscribed = true;
      savePushState();
      
      // Register service worker
      const registration = await navigator.serviceWorker.ready;
      
      // Subscribe to push
      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(pushConfig.appId)
      });
      
      pushState.subscriptionId = subscription.endpoint;
      savePushState();
      
      // Send subscription to server
      await sendSubscriptionToServer(subscription);
      
      // Show success notification
      showNotificationToast(
        getPushLang() === 'de' ? 'Benachrichtigungen aktiviert!' : 'Notifications enabled!',
        getPushLang() === 'de' ? 'Sie werden jetzt über Updates informiert.' : 'You will now receive updates.',
        'success'
      );
      
      // Send welcome notification
      setTimeout(() => {
        const welcomeMsg = pushConfig.messages.welcome[getPushLang()] || pushConfig.messages.welcome.de;
        showBrowserNotification(welcomeMsg.title, { body: welcomeMsg.body, icon: '/assets/img/icon-192.png' });
      }, 2000);
      
      showSubscriptionBadge();
      trackPushEvent('permission_accepted');
    } else {
      pushState.permission = 'denied';
      savePushState();
      trackPushEvent('permission_rejected');
    }
  } catch (error) {
    console.error('Error subscribing to push:', error);
    showNotificationToast(
      getPushLang() === 'de' ? 'Fehler' : 'Error',
      getPushLang() === 'de' ? 'Push-Benachrichtigungen konnten nicht aktiviert werden.' : 'Could not enable push notifications.',
      'warning'
    );
  }
}

/**
 * Unsubscribe from push notifications
 */
async function unsubscribeFromPush() {
  try {
    const registration = await navigator.serviceWorker.ready;
    const subscription = await registration.pushManager.getSubscription();
    
    if (subscription) {
      await subscription.unsubscribe();
      await removeSubscriptionFromServer(subscription.endpoint);
    }
    
    pushState.isSubscribed = false;
    pushState.subscriptionId = null;
    savePushState();
    
    hideSubscriptionBadge();
    showNotificationToast(
      getPushLang() === 'de' ? 'Benachrichtigungen deaktiviert' : 'Notifications disabled',
      getPushLang() === 'de' ? 'Sie erhalten keine weiteren Benachrichtigungen.' : 'You will no longer receive notifications.',
      'info'
    );
  } catch (error) {
    console.error('Error unsubscribing:', error);
  }
}

/**
 * Send subscription to server
 */
async function sendSubscriptionToServer(subscription) {
  // Replace with your actual backend endpoint
  const endpoint = '/api/push/subscribe';
  
  try {
    await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(subscription)
    });
  } catch (error) {
    console.error('Error sending subscription to server:', error);
  }
}

/**
 * Remove subscription from server
 */
async function removeSubscriptionFromServer(endpoint) {
  const endpointUrl = '/api/push/unsubscribe';
  
  try {
    await fetch(endpointUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ endpoint })
    });
  } catch (error) {
    console.error('Error removing subscription from server:', error);
  }
}

/**
 * Create notification button
 */
function createNotificationButton() {
  const header = document.querySelector('.header__actions');
  if (!header) return;
  
  const button = document.createElement('button');
  button.id = 'notificationToggle';
  button.className = 'header__icon-btn';
  button.setAttribute('aria-label', getPushLang() === 'de' ? 'Benachrichtigungen' : 'Notifications');
  button.setAttribute('title', getPushLang() === 'de' ? 'Benachrichtigungen' : 'Notifications');
  button.onclick = () => {
    if (pushState.isSubscribed) {
      unsubscribeFromPush();
    } else {
      showPushPrompt();
    }
  };
  
  button.innerHTML = `
    <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
      <path d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.89 2 2 2zm6-6v-5c0-3.07-1.64-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.63 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2z"/>
    </svg>
  `;
  
  header.appendChild(button);
}

/**
 * Show subscription badge
 */
function showSubscriptionBadge() {
  const button = document.getElementById('notificationToggle');
  if (button) {
    button.classList.add('active');
    button.setAttribute('data-subscribed', 'true');
  }
}

/**
 * Hide subscription badge
 */
function hideSubscriptionBadge() {
  const button = document.getElementById('notificationToggle');
  if (button) {
    button.classList.remove('active');
    button.removeAttribute('data-subscribed');
  }
}

/**
 * Show browser notification
 */
function showBrowserNotification(title, options = {}) {
  if (Notification.permission !== 'granted') return;
  
  navigator.serviceWorker.ready.then(registration => {
    registration.showNotification(title, {
      icon: '/assets/img/icon-192.png',
      badge: '/assets/img/badge-72.png',
      vibrate: [100, 50, 100],
      ...options
    });
  });
}

/**
 * Show in-app notification toast
 */
function showNotificationToast(title, message, type = 'info') {
  // Remove existing toast
  const existing = document.getElementById('notificationToast');
  if (existing) existing.remove();
  
  const toast = document.createElement('div');
  toast.id = 'notificationToast';
  toast.className = 'notification-toast';
  toast.innerHTML = `
    <div class="notification-toast__icon notification-toast__icon--${type}">
      ${getToastIcon(type)}
    </div>
    <div class="notification-toast__content">
      <div class="notification-toast__title">${title}</div>
      <div class="notification-toast__message">${message}</div>
    </div>
    <button class="notification-toast__close" onclick="this.parentElement.remove()">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <line x1="18" y1="6" x2="6" y2="18"></line>
        <line x1="6" y1="6" x2="18" y2="18"></line>
      </svg>
    </button>
  `;
  
  document.body.appendChild(toast);
  
  // Show
  setTimeout(() => toast.classList.add('active'), 10);
  
  // Auto-hide after 5 seconds
  setTimeout(() => {
    toast.classList.remove('active');
    setTimeout(() => toast.remove(), 300);
  }, 5000);
}

/**
 * Get toast icon SVG
 */
function getToastIcon(type) {
  const icons = {
    info: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/></svg>',
    success: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/></svg>',
    warning: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z"/></svg>'
  };
  return icons[type] || icons.info;
}

/**
 * Track push events
 */
function trackPushEvent(eventName) {
  if (window.journeyTrack) {
    window.journeyTrack.track(`push_${eventName}`);
  }
}

/**
 * URL Base64 to Uint8 Array
 */
function urlBase64ToUint8Array(base64String) {
  const padding = '='.repeat((4 - base64String.length % 4) % 4);
  const base64 = (base64String + padding)
    .replace(/-/g, '+')
    .replace(/_/g, '/');
  
  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);
  
  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

// Export for global use
window.pushConfig = pushConfig;
window.subscribeToPush = subscribeToPush;
window.unsubscribeFromPush = unsubscribeFromPush;
window.showPushPrompt = showPushPrompt;
window.hidePushPrompt = hidePushPrompt;
window.showNotificationToast = showNotificationToast;