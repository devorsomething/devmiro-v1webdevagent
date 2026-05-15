/* Real-time Notifications JavaScript */

document.addEventListener('DOMContentLoaded', function() {
  initNotifications();
});

/**
 * Notifications Configuration
 */
const notificationsConfig = {
  maxVisible: 5,
  duration: 5000,
  position: 'top-right',
  types: {
    success: { icon: '✓', color: '#22C55E' },
    error: { icon: '✕', color: '#EF4444' },
    warning: { icon: '⚠', color: '#F59E0B' },
    info: { icon: 'ℹ', color: '#3B82F6' }
  }
};

/**
 * Notifications State
 */
let notificationsState = {
  queue: [],
  visible: [],
  history: []
};

/**
 * Initialize notifications
 */
function initNotifications() {
  // Create container
  const container = document.createElement('div');
  container.className = 'notifications-container';
  container.id = 'notifications-container';
  document.body.appendChild(container);
  
  // Initialize notification bell
  createNotificationBell();
  
  // Listen for custom notification events
  document.addEventListener('showNotification', (e) => {
    showNotification(e.detail);
  });
  
  // WebSocket simulation for real-time (can be connected to actual server)
  initWebSocketSimulation();
}

/**
 * Create notification bell
 */
function createNotificationBell() {
  const header = document.querySelector('.header__actions');
  if (!header) return;
  
  const bell = document.createElement('button');
  bell.className = 'notification-bell';
  bell.innerHTML = `
    <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
      <path d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.89 2 2 2zm6-6v-5c0-3.07-1.64-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.63 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2zm-2 1H8v-6c0-2.48 1.51-4.5 4-4.5s4 2.02 4 4.5v6z"/>
    </svg>
    <span class="notification-bell__badge" style="display: none;">0</span>
  `;
  
  bell.onclick = openNotificationCenter;
  header.appendChild(bell);
}

/**
 * Show notification
 */
function showNotification({ type = 'info', title, message, duration, action }) {
  const container = document.getElementById('notifications-container');
  if (!container) return;
  
  const id = 'notif-' + Date.now();
  const config = notificationsConfig.types[type] || notificationsConfig.types.info;
  const durationMs = duration || notificationsConfig.duration;
  
  const notification = document.createElement('div');
  notification.className = `notification ${type}`;
  notification.id = id;
  notification.style.setProperty('--duration', durationMs + 'ms');
  notification.innerHTML = `
    <div class="notification__icon ${type}">${config.icon}</div>
    <div class="notification__content">
      <div class="notification__title">${title}</div>
      <div class="notification__message">${message}</div>
      ${action ? `
        <button class="notification__action" onclick="${action.callback}">
          ${action.label}
        </button>
      ` : ''}
      <div class="notification__time">Gerade eben</div>
    </div>
    <button class="notification__close" onclick="closeNotification('${id}')">
      <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16">
        <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
      </svg>
    </button>
    <div class="notification__progress"></div>
  `;
  
  notification.onclick = () => {
    if (action?.callback) {
      window[action.callback]?.();
    }
  };
  
  container.appendChild(notification);
  notificationsState.visible.push({ id, type, title, message });
  
  // Update bell badge
  updateNotificationBell();
  
  // Auto hide after duration
  if (durationMs > 0) {
    setTimeout(() => closeNotification(id), durationMs);
  }
  
  // Limit visible notifications
  if (notificationsState.visible.length > notificationsConfig.maxVisible) {
    closeNotification(notificationsState.visible[0].id);
  }
}

/**
 * Close notification
 */
function closeNotification(id) {
  const notification = document.getElementById(id);
  if (!notification) return;
  
  notification.classList.add('hiding');
  
  setTimeout(() => {
    notification.remove();
    notificationsState.visible = notificationsState.visible.filter(n => n.id !== id);
    updateNotificationBell();
  }, 300);
  
  // Add to history
  const notifData = notificationsState.visible.find(n => n.id === id);
  if (notifData) {
    notificationsState.history.push({ ...notifData, closedAt: Date.now() });
    localStorage.setItem('devmiro-notifications', JSON.stringify(notificationsState.history.slice(-50)));
  }
}

/**
 * Update notification bell badge
 */
function updateNotificationBell() {
  const badge = document.querySelector('.notification-bell__badge');
  if (!badge) return;
  
  const unreadCount = notificationsState.visible.length;
  if (unreadCount > 0) {
    badge.textContent = unreadCount > 9 ? '9+' : unreadCount;
    badge.style.display = 'flex';
    badge.classList.add('notification-bell__unread');
  } else {
    badge.style.display = 'none';
    badge.classList.remove('notification-bell__unread');
  }
}

/**
 * Open notification center
 */
function openNotificationCenter() {
  const history = localStorage.getItem('devmiro-notifications');
  const notifications = history ? JSON.parse(history) : [];
  
  // Create modal
  const modal = document.createElement('div');
  modal.className = 'notification-modal';
  modal.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
    z-index: 10000;
    display: flex;
    align-items: center;
    justify-content: center;
  `;
  
  modal.innerHTML = `
    <div style="
      background: var(--color-background);
      border-radius: var(--radius-xl);
      padding: var(--space-6);
      max-width: 400px;
      width: 90%;
      max-height: 80vh;
      overflow-y: auto;
    ">
      <h3 style="margin-bottom: var(--space-4);">Benachrichtigungen</h3>
      ${notifications.length > 0 ? notifications.map(n => `
        <div style="padding: var(--space-3); border-bottom: 1px solid var(--color-border);">
          <strong>${n.title}</strong>
          <p style="color: var(--color-text-muted); font-size: 0.875rem;">${n.message}</p>
        </div>
      `).join('') : '<p style="color: var(--color-text-muted);">Keine Benachrichtigungen</p>'}
      <button onclick="this.closest('.notification-modal').remove()" style="
        margin-top: var(--space-4);
        padding: var(--space-3) var(--space-5);
        background: var(--color-primary);
        color: white;
        border: none;
        border-radius: var(--radius-md);
        cursor: pointer;
      ">Schließen</button>
    </div>
  `;
  
  modal.onclick = (e) => {
    if (e.target === modal) modal.remove();
  };
  
  document.body.appendChild(modal);
}

/**
 * Show toast
 */
function showToast(message, type = 'info') {
  const existing = document.querySelector('.toast');
  if (existing) existing.remove();
  
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.textContent = message;
  
  document.body.appendChild(toast);
  
  setTimeout(() => {
    toast.style.animation = 'toastUp 0.3s ease reverse';
    setTimeout(() => toast.remove(), 300);
  }, 3000);
}

/**
 * WebSocket simulation for real-time notifications
 */
function initWebSocketSimulation() {
  // This would be replaced with actual WebSocket connection in production
  // Simulating real-time events
  
  const simulateEvent = () => {
    const events = [
      { type: 'info', title: 'Neue Nachricht', message: 'Sie haben eine neue Anfrage erhalten' },
      { type: 'success', title: 'Auftrag bestätigt', message: 'Projekt wurde erfolgreich gestartet' },
      { type: 'warning', title: 'Wartung', message: 'Geplante Wartung今晚 22:00' },
      { type: 'info', title: 'Update verfügbar', message: 'Neue Version der Website verfügbar' }
    ];
    
    const event = events[Math.floor(Math.random() * events.length)];
    // Don't auto-show, just track for demo
    // showNotification(event);
  };
  
  // Simulate every 60 seconds (disabled by default)
  // setInterval(simulateEvent, 60000);
}

/**
 * Push notification (browser notification API)
 */
function pushNotification(title, options = {}) {
  if (!('Notification' in window)) return;
  
  if (Notification.permission === 'granted') {
    new Notification(title, {
      icon: '/assets/img/icon-192.png',
      badge: '/assets/img/badge.png',
      ...options
    });
  } else if (Notification.permission !== 'denied') {
    Notification.requestPermission().then(permission => {
      if (permission === 'granted') {
        new Notification(title, options);
      }
    });
  }
}

// Export for global use
window.notificationsConfig = notificationsConfig;
window.showNotification = (config) => showNotification(config);
window.closeNotification = closeNotification;
window.showToast = showToast;
window.pushNotification = pushNotification;