/**
 * DevMiro Service Worker
 * Version: 2.0
 * Enables offline support, caching, and push notifications for PWA
 */

const CACHE_NAME = 'devmiro-v2';
const OFFLINE_URL = '/offline.html';

// Assets to cache immediately on install
const PRECACHE_ASSETS = [
  '/',
  '/index.html',
  '/contact.html',
  '/services.html',
  '/manifest.json',
  '/styles.css',
  '/assets/js/main.js',
  '/offline.html'
];

// External resources to cache
const EXTERNAL_CACHE = [
  'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap',
  'https://cdnjs.cloudflare.com/ajax/libs/lottie-web/5.7.13/lottie.min.js'
];

/**
 * Install Event - Cache essential assets
 */
self.addEventListener('install', event => {
  console.log('[SW] Installing...');
  
  event.waitUntil(
    Promise.all([
      // Cache static assets
      caches.open(CACHE_NAME)
        .then(cache => {
          console.log('[SW] Precaching assets');
          return cache.addAll(PRECACHE_ASSETS);
        }),
      
      // External resources
      caches.open(CACHE_NAME + '-external')
        .then(cache => {
          return Promise.allSettled(
            EXTERNAL_CACHE.map(url => 
              fetch(url, { mode: 'cors' })
                .then(response => {
                  if (response.ok) {
                    cache.put(url, response);
                  }
                })
                .catch(err => console.log('[SW] Failed to cache:', url))
            )
          );
        }),
      
      // Activate immediately
      self.skipWaiting()
    ])
  );
});

/**
 * Activate Event - Clean up old caches
 */
self.addEventListener('activate', event => {
  console.log('[SW] Activating...');
  
  event.waitUntil(
    caches.keys()
      .then(cacheNames => {
        return Promise.all(
          cacheNames
            .filter(cacheName => {
              // Delete old version caches
              return cacheName.startsWith('devmiro-') && 
                     cacheName !== CACHE_NAME && 
                     cacheName !== CACHE_NAME + '-external';
            })
            .map(cacheName => {
              console.log('[SW] Deleting old cache:', cacheName);
              return caches.delete(cacheName);
            })
        );
      })
      .then(() => {
        // Take control of all clients immediately
        self.clients.claim();
        console.log('[SW] Now controlling all pages');
      })
  );
});

/**
 * Fetch Event - Handle network requests with cache strategies
 */
self.addEventListener('fetch', event => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET requests
  if (request.method !== 'GET') return;

  // Skip chrome-extension and other non-http requests
  if (!url.protocol.startsWith('http')) return;

  // Skip WebSocket requests
  if (url.protocol === 'ws:' || url.protocol === 'wss:') return;

  // Handle requests based on type
  if (isStaticAsset(url)) {
    // Static assets: Cache First
    event.respondWith(cacheFirst(request));
  } else if (isGoogleFont(url) || isCDNResource(url)) {
    // External resources: Stale While Revalidate
    event.respondWith(staleWhileRevalidate(request));
  } else if (isNavigationRequest(request)) {
    // Navigation requests: Network First with offline fallback
    event.respondWith(networkFirst(request));
  } else if (isAPIRequest(url)) {
    // API requests: Network Only (no caching)
    return;
  } else {
    // Default: Stale While Revalidate
    event.respondWith(staleWhileRevalidate(request));
  }
});

/**
 * Cache Strategies
 */

// Cache First - Good for static assets
async function cacheFirst(request) {
  const cachedResponse = await caches.match(request);
  
  if (cachedResponse) {
    // Return cached version and update in background
    updateCache(request);
    return cachedResponse;
  }
  
  try {
    const networkResponse = await fetch(request);
    
    if (networkResponse.ok) {
      const cache = await caches.open(CACHE_NAME);
      cache.put(request, networkResponse.clone());
    }
    
    return networkResponse;
  } catch (error) {
    console.log('[SW] Cache First failed:', error);
    return getOfflineResponse();
  }
}

// Stale While Revalidate - Good for external resources
async function staleWhileRevalidate(request) {
  const cache = await caches.open(CACHE_NAME + '-external');
  const cachedResponse = await cache.match(request);
  
  const fetchPromise = fetch(request)
    .then(networkResponse => {
      if (networkResponse.ok) {
        cache.put(request, networkResponse.clone());
      }
      return networkResponse;
    })
    .catch(() => null);
  
  // Return cached version immediately, or wait for network
  return cachedResponse || fetchPromise || getOfflineResponse();
}

// Network First - Good for navigation and dynamic content
async function networkFirst(request) {
  try {
    const networkResponse = await fetch(request);
    
    if (networkResponse.ok) {
      const cache = await caches.open(CACHE_NAME);
      cache.put(request, networkResponse.clone());
    }
    
    return networkResponse;
  } catch (error) {
    console.log('[SW] Network First failed, trying cache');
    const cachedResponse = await caches.match(request);
    return cachedResponse || getOfflineResponse();
  }
}

// Update cache in background
async function updateCache(request) {
  try {
    const networkResponse = await fetch(request);
    
    if (networkResponse.ok) {
      const cache = await caches.open(CACHE_NAME);
      cache.put(request, networkResponse);
    }
  } catch (error) {
    // Silent fail for background updates
  }
}

// Get offline response
async function getOfflineResponse() {
  const cachedOffline = await caches.match(OFFLINE_URL);
  if (cachedOffline) return cachedOffline;
  
  // Fallback to basic offline HTML
  return new Response(
    `<!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1">
      <title>Offline - DevMiro</title>
      <style>
        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
          display: flex;
          align-items: center;
          justify-content: center;
          min-height: 100vh;
          margin: 0;
          background: #0F172A;
          color: #FFFFFF;
          text-align: center;
          padding: 20px;
        }
        .container { max-width: 400px; }
        h1 { font-size: 2rem; margin-bottom: 1rem; }
        p { color: #94A3B8; margin-bottom: 2rem; }
        a {
          display: inline-block;
          padding: 12px 24px;
          background: #3B82F6;
          color: white;
          text-decoration: none;
          border-radius: 8px;
        }
        a:hover { background: #2563EB; }
      </style>
    </head>
    <body>
      <div class="container">
        <h1>😕 Du bist offline</h1>
        <p>Bitte überprüfe deine Internetverbindung und versuche es erneut.</p>
        <a href="/">Zurück zur Startseite</a>
      </div>
    </body>
    </html>`,
    {
      headers: { 'Content-Type': 'text/html' }
    }
  );
}

/**
 * Helper Functions
 */

function isStaticAsset(url) {
  const staticExtensions = ['.js', '.css', '.png', '.jpg', '.jpeg', '.gif', '.svg', '.ico', '.woff', '.woff2', '.ttf', '.eot', '.webp', '.avif'];
  return staticExtensions.some(ext => url.pathname.endsWith(ext));
}

function isGoogleFont(url) {
  return url.hostname.includes('fonts.googleapis.com') || url.hostname.includes('fonts.gstatic.com');
}

function isCDNResource(url) {
  const cdnHosts = ['cdnjs.cloudflare.com', 'cdn.jsdelivr.net', 'unpkg.com'];
  return cdnHosts.some(host => url.hostname.includes(host));
}

function isNavigationRequest(request) {
  return request.mode === 'navigate' || 
         (request.headers.get('accept') || '').includes('text/html');
}

function isAPIRequest(url) {
  return url.pathname.startsWith('/api/') || url.pathname.startsWith('/wp-json/');
}

/**
 * Push Notifications
 */
self.addEventListener('push', event => {
  if (!event.data) return;

  let data;
  try {
    data = event.data.json();
  } catch (e) {
    data = { body: event.data.text() };
  }

  const options = {
    body: data.body || 'Neue Nachricht von DevMiro',
    icon: '/assets/icons/icon-192.png',
    badge: '/assets/icons/badge.png',
    vibrate: [100, 50, 100],
    data: {
      url: data.url || '/',
      date: data.date || Date.now()
    },
    actions: data.actions || [
      { action: 'open', title: 'Öffnen' },
      { action: 'close', title: 'Schließen' }
    ]
  };

  event.waitUntil(
    self.registration.showNotification(data.title || 'DevMiro', options)
  );
});

/**
 * Notification Click
 */
self.addEventListener('notificationclick', event => {
  event.notification.close();

  const url = event.notification.data?.url || '/';

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true })
      .then(clientList => {
        // Focus existing window if available
        for (const client of clientList) {
          if (client.url === url && 'focus' in client) {
            return client.focus();
          }
        }
        // Open new window
        if (clients.openWindow) {
          return clients.openWindow(url);
        }
      })
  );
});

/**
 * Background Sync
 */
self.addEventListener('sync', event => {
  if (event.tag === 'sync-forms') {
    event.waitUntil(syncForms());
  }
});

async function syncForms() {
  // Implement form sync logic if needed
  console.log('[SW] Syncing forms...');
}

/**
 * Message Handling
 */
self.addEventListener('message', event => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
  
  if (event.data && event.data.type === 'GET_VERSION') {
    event.ports[0].postMessage({ version: CACHE_NAME });
  }
});

console.log('[SW] Service Worker loaded');