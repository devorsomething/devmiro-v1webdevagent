/* Progressive Web App Enhanced JavaScript */

document.addEventListener('DOMContentLoaded', function() {
  initPWAEnhanced();
});

/**
 * PWA Enhanced Configuration
 */
const pwaEnhancedConfig = {
  enableInstallPrompt: true,
  enableOfflineIndicator: true,
  enableBackgroundSync: true,
  enableShareAPI: true,
  enableShortcuts: true,
  enableAppBadges: true,
  
  // Install prompt settings
  installPromptDelay: 30000, // 30 seconds
  installPromptMinVisits: 2,
  
  // Update settings
  updateCheckInterval: 3600000, // 1 hour
  updatePollingEnabled: true
};

/**
 * PWA State
 */
let pwaState = {
  deferredPrompt: null,
  isInstalled: false,
  isOffline: false,
  updateAvailable: false,
  backgroundSyncQueue: [],
  lastInstallPrompt: null
};

/**
 * Initialize PWA Enhanced
 */
function initPWAEnhanced() {
  // Check if already installed
  checkInstalledStatus();
  
  // Initialize install prompt
  if (pwaEnhancedConfig.enableInstallPrompt) {
    initInstallPrompt();
  }
  
  // Initialize offline detection
  if (pwaEnhancedConfig.enableOfflineIndicator) {
    initOfflineDetection();
  }
  
  // Initialize background sync
  if (pwaEnhancedConfig.enableBackgroundSync) {
    initBackgroundSync();
  }
  
  // Initialize share API
  if (pwaEnhancedConfig.enableShareAPI) {
    initShareAPI();
  }
  
  // Initialize app shortcuts
  if (pwaEnhancedConfig.enableShortcuts) {
    initAppShortcuts();
  }
  
  // Initialize update handling
  initUpdateHandling();
  
  // Create quick actions
  createPWAQuickActions();
}

/**
 * Check installed status
 */
function checkInstalledStatus() {
  pwaState.isInstalled = window.matchMedia('(display-mode: standalone)').matches ||
                         window.navigator.standalone === true ||
                         document.referrer.includes('android-app://');
  
  if (pwaState.isInstalled) {
    document.body.classList.add('pwa-installed');
  }
}

/**
 * Initialize install prompt
 */
function initInstallPrompt() {
  // Capture install prompt
  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    pwaState.deferredPrompt = e;
    
    // Show prompt after delay
    setTimeout(() => {
      showInstallPrompt();
    }, pwaEnhancedConfig.installPromptDelay);
  });
  
  // Track app installed
  window.addEventListener('appinstalled', () => {
    pwaState.deferredPrompt = null;
    pwaState.isInstalled = true;
    showToast('App erfolgreich installiert!', 'success');
    hideInstallPrompt();
  });
}

/**
 * Show install prompt
 */
function showInstallPrompt() {
  if (pwaState.isInstalled || !pwaState.deferredPrompt) return;
  
  const existing = document.querySelector('.pwa-install-prompt');
  if (existing) return;
  
  const prompt = document.createElement('div');
  prompt.className = 'pwa-install-prompt';
  prompt.id = 'pwa-install-prompt';
  prompt.innerHTML = `
    <div class="pwa-install-prompt__icon">📱</div>
    <h3 class="pwa-install-prompt__title">DevMiro App installieren</h3>
    <p class="pwa-install-prompt__desc">
      Fügen Sie DevMiro zu Ihrem Home-Bildschirm hinzu für schnellen Zugriff und eine bessere Erfahrung.
    </p>
    <div class="pwa-install-prompt__actions">
      <button class="btn btn--primary" onclick="installPWA()">
        Installieren
      </button>
      <button class="btn btn--secondary" onclick="hideInstallPrompt()">
        Später
      </button>
    </div>
  `;
  
  document.body.appendChild(prompt);
}

/**
 * Hide install prompt
 */
function hideInstallPrompt() {
  const prompt = document.getElementById('pwa-install-prompt');
  if (prompt) {
    prompt.style.animation = 'slideUp 0.3s ease reverse';
    setTimeout(() => prompt.remove(), 300);
  }
}

/**
 * Install PWA
 */
async function installPWA() {
  if (!pwaState.deferredPrompt) return;
  
  pwaState.deferredPrompt.prompt();
  
  const { outcome } = await pwaState.deferredPrompt.userChoice;
  
  if (outcome === 'accepted') {
    console.log('PWA install accepted');
  } else {
    console.log('PWA install dismissed');
  }
  
  pwaState.deferredPrompt = null;
  hideInstallPrompt();
}

/**
 * Initialize offline detection
 */
function initOfflineDetection() {
  // Create offline indicator
  const indicator = document.createElement('div');
  indicator.className = 'offline-indicator';
  indicator.id = 'offline-indicator';
  indicator.innerHTML = '📡 Offline - Ihre Daten werden synchronisiert, sobald Sie wieder online sind';
  document.body.appendChild(indicator);
  
  // Listen for online/offline events
  window.addEventListener('online', () => {
    pwaState.isOffline = false;
    document.getElementById('offline-indicator')?.classList.remove('active');
    showToast('Sie sind wieder online!', 'success');
    syncBackgroundQueue();
  });
  
  window.addEventListener('offline', () => {
    pwaState.isOffline = true;
    document.getElementById('offline-indicator')?.classList.add('active');
  });
  
  // Initial check
  pwaState.isOffline = !navigator.onLine;
  if (pwaState.isOffline) {
    document.getElementById('offline-indicator')?.classList.add('active');
  }
}

/**
 * Initialize background sync
 */
function initBackgroundSync() {
  // Create sync indicator
  const indicator = document.createElement('div');
  indicator.className = 'sync-indicator';
  indicator.id = 'sync-indicator';
  indicator.innerHTML = `
    <div class="sync-indicator__icon"></div>
    <span id="sync-status">Wartend...</span>
  `;
  document.body.appendChild(indicator);
  
  // Register service worker
  if ('serviceWorker' in navigator && 'sync' in window.ServiceWorkerRegistration.prototype) {
    navigator.serviceWorker.ready.then(registration => {
      console.log('Background sync available');
    });
  }
}

/**
 * Add to background sync queue
 */
function addToBackgroundSyncQueue(data) {
  pwaState.backgroundSyncQueue.push({
    ...data,
    timestamp: Date.now()
  });
  
  // Update indicator
  updateSyncIndicator();
  
  // If online, sync immediately
  if (navigator.onLine) {
    syncBackgroundQueue();
  }
}

/**
 * Sync background queue
 */
async function syncBackgroundQueue() {
  const indicator = document.getElementById('sync-indicator');
  if (indicator) indicator.classList.remove('synced');
  
  while (pwaState.backgroundSyncQueue.length > 0) {
    const item = pwaState.backgroundSyncQueue.shift();
    
    try {
      // In production, send to actual endpoint
      console.log('Syncing:', item);
      
      // Simulate sync
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // If failed, re-add to queue
      // pwaState.backgroundSyncQueue.unshift(item);
    } catch (error) {
      console.error('Sync failed:', error);
      pwaState.backgroundSyncQueue.unshift(item);
      break;
    }
  }
  
  updateSyncIndicator();
}

/**
 * Update sync indicator
 */
function updateSyncIndicator() {
  const indicator = document.getElementById('sync-indicator');
  const status = document.getElementById('sync-status');
  
  if (indicator && status) {
    indicator.classList.add('synced');
    status.textContent = pwaState.backgroundSyncQueue.length > 0 
      ? `${pwaState.backgroundSyncQueue.length} ausstehend`
      : 'Synchronisiert';
  }
}

/**
 * Initialize share API
 */
function initShareAPI() {
  // Create share button if supported
  if (navigator.share) {
    const shareBtn = document.createElement('button');
    shareBtn.className = 'pwa-quick-action';
    shareBtn.id = 'share-action';
    shareBtn.innerHTML = '📤';
    shareBtn.title = 'Teilen';
    shareBtn.onclick = showShareSheet;
    
    const actions = document.querySelector('.pwa-quick-actions');
    if (actions) actions.appendChild(shareBtn);
  }
}

/**
 * Show share sheet
 */
function showShareSheet() {
  const existing = document.querySelector('.share-sheet');
  if (existing) return;
  
  const sheet = document.createElement('div');
  sheet.className = 'share-sheet';
  sheet.id = 'share-sheet';
  sheet.innerHTML = `
    <h3 class="share-sheet__title">Teilen auf</h3>
    <div class="share-sheet__options">
      <div class="share-sheet__option" onclick="shareVia('whatsapp')">
        <div class="share-sheet__option-icon" style="background: #25D366;">💬</div>
        <span class="share-sheet__option-label">WhatsApp</span>
      </div>
      <div class="share-sheet__option" onclick="shareVia('email')">
        <div class="share-sheet__option-icon" style="background: #EA4335;">📧</div>
        <span class="share-sheet__option-label">E-Mail</span>
      </div>
      <div class="share-sheet__option" onclick="shareVia('twitter')">
        <div class="share-sheet__option-icon" style="background: #1DA1F2;">🐦</div>
        <span class="share-sheet__option-label">Twitter</span>
      </div>
      <div class="share-sheet__option" onclick="shareVia('copy')">
        <div class="share-sheet__option-icon" style="background: #666;">📋</div>
        <span class="share-sheet__option-label">Kopieren</span>
      </div>
    </div>
    <button class="btn btn--secondary" style="margin-top: var(--space-4); width: 100%;" onclick="closeShareSheet()">
      Schließen
    </button>
  `;
  
  document.body.appendChild(sheet);
  
  // Animate in
  setTimeout(() => sheet.classList.add('active'), 10);
  
  // Close on backdrop click
  document.addEventListener('click', (e) => {
    if (e.target === sheet) closeShareSheet();
  });
}

/**
 * Close share sheet
 */
function closeShareSheet() {
  const sheet = document.getElementById('share-sheet');
  if (sheet) {
    sheet.classList.remove('active');
    setTimeout(() => sheet.remove(), 300);
  }
}

/**
 * Share via platform
 */
async function shareVia(platform) {
  const url = window.location.href;
  const title = document.title;
  
  switch (platform) {
    case 'whatsapp':
      window.open(`https://wa.me/?text=${encodeURIComponent(title + ' ' + url)}`, '_blank');
      break;
    case 'email':
      window.location.href = `mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(url)}`;
      break;
    case 'twitter':
      window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`, '_blank');
      break;
    case 'copy':
      await navigator.clipboard.writeText(url);
      showToast('Link kopiert!', 'success');
      break;
  }
  
  closeShareSheet();
}

/**
 * Share using Web Share API
 */
async function webShare() {
  if (!navigator.share) {
    showShareSheet();
    return;
  }
  
  try {
    await navigator.share({
      title: document.title,
      text: 'Schauen Sie sich diese Website an!',
      url: window.location.href
    });
  } catch (error) {
    if (error.name !== 'AbortError') {
      console.error('Share failed:', error);
    }
  }
}

/**
 * Initialize app shortcuts
 */
function initAppShortcuts() {
  // Create quick actions panel
  const panel = document.createElement('div');
  panel.className = 'pwa-quick-actions';
  panel.id = 'pwa-quick-actions';
  panel.innerHTML = `
    <div class="pwa-quick-action" onclick="webShare()" title="Teilen">📤</div>
    <div class="pwa-quick-action" onclick="window.scrollTo({top: 0, behavior: 'smooth'})" title="Nach oben">⬆️</div>
    <div class="pwa-quick-action" onclick="toggleDarkMode()" title="Dark Mode">🌙</div>
  `;
  
  document.body.appendChild(panel);
}

/**
 * Create PWA quick actions
 */
function createPWAQuickActions() {
  // Additional quick actions can be added here
}

/**
 * Initialize update handling
 */
function initUpdateHandling() {
  // Check for updates
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.ready.then(registration => {
      // Check for updates periodically
      if (pwaEnhancedConfig.updatePollingEnabled) {
        setInterval(() => {
          registration.update();
        }, pwaEnhancedConfig.updateCheckInterval);
      }
      
      // Listen for update found
      registration.addEventListener('updatefound', () => {
        const newWorker = registration.installing;
        
        newWorker.addEventListener('statechange', () => {
          if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
            showUpdateBanner();
          }
        });
      });
    });
  }
}

/**
 * Show update banner
 */
function showUpdateBanner() {
  pwaState.updateAvailable = true;
  
  const banner = document.createElement('div');
  banner.className = 'app-update-banner';
  banner.id = 'app-update-banner';
  banner.innerHTML = `
    🔄 Eine neue Version ist verfügbar!
    <div class="app-update-banner__actions">
      <button class="btn btn--small btn--light" onclick="applyUpdate()">
        Jetzt aktualisieren
      </button>
      <button class="btn btn--small btn--secondary" onclick="dismissUpdate()">
        Später
      </button>
    </div>
  `;
  
  document.body.appendChild(banner);
  banner.classList.add('active');
}

/**
 * Apply update
 */
async function applyUpdate() {
  const registration = await navigator.serviceWorker.ready;
  
  if (registration.waiting) {
    registration.waiting.postMessage({ type: 'SKIP_WAITING' });
  }
  
  location.reload();
}

/**
 * Dismiss update
 */
function dismissUpdate() {
  const banner = document.getElementById('app-update-banner');
  if (banner) {
    banner.classList.remove('active');
    setTimeout(() => banner.remove(), 300);
  }
}

/**
 * Toggle dark mode (from PWA)
 */
function toggleDarkMode() {
  if (typeof toggleDarkModeGlobal === 'function') {
    toggleDarkModeGlobal();
  } else {
    document.documentElement.classList.toggle('dark-mode');
    showToast('Dark Mode umgeschaltet', 'info');
  }
}

/**
 * Get PWA state
 */
function getPWAState() {
  return {
    ...pwaState,
    isStandalone: window.matchMedia('(display-mode: standalone)').matches,
    isFullscreen: window.matchMedia('(display-mode: fullscreen)').matches,
    isTablet: window.matchMedia('(min-width: 768px)').matches,
    supportsShare: !!navigator.share,
    supportsInstall: !!pwaState.deferredPrompt
  };
}

// Export for global use
window.pwaEnhancedConfig = pwaEnhancedConfig;
window.pwaState = pwaState;
window.installPWA = installPWA;
window.hideInstallPrompt = hideInstallPrompt;
window.showShareSheet = showShareSheet;
window.closeShareSheet = closeShareSheet;
window.shareVia = shareVia;
window.webShare = webShare;
window.applyUpdate = applyUpdate;
window.dismissUpdate = dismissUpdate;
window.toggleDarkMode = toggleDarkMode;
window.getPWAState = getPWAState;