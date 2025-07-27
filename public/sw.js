const CACHE_NAME = 'rabbit-holes-v1';
const STATIC_CACHE = 'rabbit-holes-static-v1';
const DYNAMIC_CACHE = 'rabbit-holes-dynamic-v1';

// Files to cache immediately
const STATIC_FILES = [
  '/',
  '/about',
  '/archive',
  '/search',
  '/tags',
  '/settings',
  '/manifest.json',
  '/offline.html'
];

// Install event - cache static files
self.addEventListener('install', event => {
  console.log('Service Worker: Installing');
  
  event.waitUntil(
    caches.open(STATIC_CACHE)
      .then(cache => {
        console.log('Service Worker: Caching static files');
        return cache.addAll(STATIC_FILES);
      })
      .then(() => {
        console.log('Service Worker: Static files cached');
        return self.skipWaiting();
      })
      .catch(error => {
        console.error('Service Worker: Error caching static files', error);
      })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', event => {
  console.log('Service Worker: Activating');
  
  event.waitUntil(
    caches.keys()
      .then(cacheNames => {
        return Promise.all(
          cacheNames.map(cacheName => {
            if (cacheName !== STATIC_CACHE && cacheName !== DYNAMIC_CACHE) {
              console.log('Service Worker: Deleting old cache', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      })
      .then(() => {
        console.log('Service Worker: Activated');
        return self.clients.claim();
      })
  );
});

// Fetch event - serve from cache with network fallback
self.addEventListener('fetch', event => {
  const { request } = event;
  
  // Skip non-GET requests
  if (request.method !== 'GET') return;
  
  // Skip external requests
  if (!request.url.startsWith(self.location.origin)) return;
  
  event.respondWith(
    caches.match(request)
      .then(cachedResponse => {
        if (cachedResponse) {
          console.log('Service Worker: Serving from cache', request.url);
          return cachedResponse;
        }
        
        // Not in cache, fetch from network
        return fetch(request)
          .then(networkResponse => {
            // Check if valid response
            if (!networkResponse || networkResponse.status !== 200 || networkResponse.type !== 'basic') {
              return networkResponse;
            }
            
            // Clone response for caching
            const responseToCache = networkResponse.clone();
            
            // Cache dynamic content
            caches.open(DYNAMIC_CACHE)
              .then(cache => {
                console.log('Service Worker: Caching dynamic content', request.url);
                cache.put(request, responseToCache);
              });
            
            return networkResponse;
          })
          .catch(error => {
            console.error('Service Worker: Fetch failed', error);
            
            // Return offline page for navigation requests
            if (request.destination === 'document') {
              return caches.match('/offline.html');
            }
            
            // Return cached version or empty response
            return caches.match(request) || new Response('', {
              status: 408,
              statusText: 'Request Timeout'
            });
          });
      })
  );
});

// Push notification event
self.addEventListener('push', event => {
  console.log('Service Worker: Push received');
  
  let data = {};
  
  if (event.data) {
    try {
      data = event.data.json();
    } catch (e) {
      data = { title: 'New Discovery', body: event.data.text() };
    }
  }
  
  // Creative notification messages
  const creativeMessages = [
    "🐰 A new rabbit hole awaits your curiosity",
    "✨ Fresh discovery published - dive deep into something fascinating",
    "🔍 New content to explore - another beautiful distraction awaits",
    "💫 Just published: something worth getting lost in",
    "🌟 New post live - ready to fall down another rabbit hole?",
    "📚 Fresh reading material for the curious mind",
    "🎯 New discovery curated just for you",
    "⚡ Something interesting just dropped - come explore"
  ];
  
  const randomMessage = creativeMessages[Math.floor(Math.random() * creativeMessages.length)];
  
  const options = {
    title: data.title || 'New Discovery on Rabbit Holes',
    body: data.body || randomMessage,
    icon: '/icons/icon-192x192.png',
    badge: '/icons/badge-72x72.png',
    data: {
      url: data.url || '/',
      timestamp: Date.now()
    },
    actions: [
      {
        action: 'open',
        title: 'Explore Now',
        icon: '/icons/open-icon.png'
      },
      {
        action: 'dismiss',
        title: 'Maybe Later',
        icon: '/icons/dismiss-icon.png'
      }
    ],
    tag: 'rabbit-holes-discovery',
    renotify: true,
    requireInteraction: false,
    silent: false
  };
  
  event.waitUntil(
    self.registration.showNotification(options.title, options)
  );
});

// Notification click event
self.addEventListener('notificationclick', event => {
  console.log('Service Worker: Notification clicked');
  
  event.notification.close();
  
  if (event.action === 'dismiss') {
    return;
  }
  
  const urlToOpen = event.notification.data?.url || '/';
  
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true })
      .then(clientList => {
        // Check if site is already open
        for (const client of clientList) {
          if (client.url.includes(self.location.origin) && 'focus' in client) {
            client.focus();
            client.navigate(urlToOpen);
            return;
          }
        }
        
        // Open new window/tab
        if (clients.openWindow) {
          return clients.openWindow(urlToOpen);
        }
      })
  );
});

// Background sync event (for future use)
self.addEventListener('sync', event => {
  console.log('Service Worker: Background sync');
  
  if (event.tag === 'background-sync') {
    event.waitUntil(
      // Perform background tasks here
      Promise.resolve()
    );
  }
});

// Share target event (for future use)
self.addEventListener('share', event => {
  console.log('Service Worker: Share received');
  
  event.waitUntil(
    // Handle shared content
    Promise.resolve()
  );
});

// Message event for communication with main thread
self.addEventListener('message', event => {
  console.log('Service Worker: Message received', event.data);
  
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
  
  if (event.data && event.data.type === 'CACHE_UPDATE') {
    // Force cache update
    event.waitUntil(
      caches.open(STATIC_CACHE)
        .then(cache => cache.addAll(STATIC_FILES))
    );
  }
});