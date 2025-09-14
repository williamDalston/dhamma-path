/**
 * Service Worker for Offline Functionality
 * Provides offline support and caching for MorningFlow app
 */

const CACHE_NAME = 'morningflow-v1';
const STATIC_CACHE_NAME = 'morningflow-static-v1';
const DYNAMIC_CACHE_NAME = 'morningflow-dynamic-v1';

// Files to cache for offline use
const STATIC_ASSETS = [
    '/',
    '/index.html',
    '/assets/css/styles.css',
    '/assets/js/app.js',
    '/assets/js/navigation.js',
    '/assets/js/flow-navigation.js',
    '/assets/js/user-anticipation.js',
    '/assets/js/smart-predictions.js',
    '/assets/js/accessibility-enhancer.js',
    '/assets/js/data-persistence.js',
    '/assets/js/smart-notifications.js',
    '/assets/templates/home.html',
    '/assets/templates/timer.html',
    '/assets/templates/journal.html',
    '/assets/templates/gratitude.html',
    '/assets/templates/workout.html',
    '/favicon.ico'
];

// Install event - cache static assets
self.addEventListener('install', (event) => {
    console.log('Service Worker installing...');
    
    event.waitUntil(
        caches.open(STATIC_CACHE_NAME)
            .then((cache) => {
                console.log('Caching static assets...');
                return cache.addAll(STATIC_ASSETS);
            })
            .then(() => {
                console.log('Static assets cached successfully');
                return self.skipWaiting();
            })
            .catch((error) => {
                console.error('Failed to cache static assets:', error);
            })
    );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
    console.log('Service Worker activating...');
    
    event.waitUntil(
        caches.keys()
            .then((cacheNames) => {
                return Promise.all(
                    cacheNames.map((cacheName) => {
                        if (cacheName !== STATIC_CACHE_NAME && 
                            cacheName !== DYNAMIC_CACHE_NAME) {
                            console.log('Deleting old cache:', cacheName);
                            return caches.delete(cacheName);
                        }
                    })
                );
            })
            .then(() => {
                console.log('Service Worker activated');
                return self.clients.claim();
            })
    );
});

// Fetch event - serve from cache or network
self.addEventListener('fetch', (event) => {
    const { request } = event;
    const url = new URL(request.url);
    
    // Skip non-GET requests
    if (request.method !== 'GET') {
        return;
    }
    
    // Skip chrome-extension and other non-http requests
    if (!request.url.startsWith('http')) {
        return;
    }
    
    event.respondWith(
        caches.match(request)
            .then((cachedResponse) => {
                // Return cached version if available
                if (cachedResponse) {
                    return cachedResponse;
                }
                
                // Otherwise, fetch from network
                return fetch(request)
                    .then((networkResponse) => {
                        // Don't cache if not a valid response
                        if (!networkResponse || 
                            networkResponse.status !== 200 || 
                            networkResponse.type !== 'basic') {
                            return networkResponse;
                        }
                        
                        // Clone the response
                        const responseToCache = networkResponse.clone();
                        
                        // Cache dynamic content
                        if (shouldCache(request)) {
                            caches.open(DYNAMIC_CACHE_NAME)
                                .then((cache) => {
                                    cache.put(request, responseToCache);
                                });
                        }
                        
                        return networkResponse;
                    })
                    .catch(() => {
                        // Return offline page for navigation requests
                        if (request.mode === 'navigate') {
                            return caches.match('/index.html');
                        }
                        
                        // Return a basic offline response for other requests
                        return new Response('Offline', {
                            status: 503,
                            statusText: 'Service Unavailable',
                            headers: new Headers({
                                'Content-Type': 'text/plain'
                            })
                        });
                    });
            })
    );
});

// Helper function to determine if request should be cached
function shouldCache(request) {
    const url = new URL(request.url);
    
    // Cache HTML pages
    if (url.pathname.endsWith('.html') || url.pathname === '/') {
        return true;
    }
    
    // Cache CSS and JS files
    if (url.pathname.match(/\.(css|js)$/)) {
        return true;
    }
    
    // Cache images
    if (url.pathname.match(/\.(png|jpg|jpeg|gif|svg|ico)$/)) {
        return true;
    }
    
    // Cache fonts
    if (url.pathname.match(/\.(woff|woff2|ttf|eot)$/)) {
        return true;
    }
    
    return false;
}

// Background sync for offline data
self.addEventListener('sync', (event) => {
    console.log('Background sync triggered:', event.tag);
    
    if (event.tag === 'background-sync') {
        event.waitUntil(doBackgroundSync());
    }
});

async function doBackgroundSync() {
    try {
        // Sync any offline data when connection is restored
        console.log('Performing background sync...');
        
        // In a real app, you'd sync offline journal entries, etc.
        // For now, just log that sync is happening
        console.log('Background sync completed');
        
    } catch (error) {
        console.error('Background sync failed:', error);
    }
}

// Push notifications
self.addEventListener('push', (event) => {
    console.log('Push notification received');
    
    const options = {
        body: 'Your morning routine is waiting for you!',
        icon: '/favicon.ico',
        badge: '/favicon.ico',
        vibrate: [100, 50, 100],
        data: {
            dateOfArrival: Date.now(),
            primaryKey: 1
        },
        actions: [
            {
                action: 'explore',
                title: 'Start Routine',
                icon: '/favicon.ico'
            },
            {
                action: 'close',
                title: 'Close',
                icon: '/favicon.ico'
            }
        ]
    };
    
    if (event.data) {
        const data = event.data.json();
        options.body = data.body || options.body;
        options.title = data.title || 'MorningFlow';
    }
    
    event.waitUntil(
        self.registration.showNotification('MorningFlow', options)
    );
});

// Notification click handler
self.addEventListener('notificationclick', (event) => {
    console.log('Notification clicked:', event.action);
    
    event.notification.close();
    
    if (event.action === 'explore') {
        event.waitUntil(
            clients.openWindow('/')
        );
    }
});

// Message handling for communication with main thread
self.addEventListener('message', (event) => {
    console.log('Service Worker received message:', event.data);
    
    if (event.data && event.data.type === 'SKIP_WAITING') {
        self.skipWaiting();
    }
    
    if (event.data && event.data.type === 'GET_VERSION') {
        event.ports[0].postMessage({ version: CACHE_NAME });
    }
});

// Periodic background sync (if supported)
self.addEventListener('periodicsync', (event) => {
    console.log('Periodic sync triggered:', event.tag);
    
    if (event.tag === 'content-sync') {
        event.waitUntil(doPeriodicSync());
    }
});

async function doPeriodicSync() {
    try {
        console.log('Performing periodic sync...');
        
        // Update cached content periodically
        const cache = await caches.open(STATIC_CACHE_NAME);
        const requests = STATIC_ASSETS.map(url => new Request(url));
        
        for (const request of requests) {
            try {
                const response = await fetch(request);
                if (response.ok) {
                    await cache.put(request, response);
                }
            } catch (error) {
                console.warn('Failed to update cache for:', request.url);
            }
        }
        
        console.log('Periodic sync completed');
        
    } catch (error) {
        console.error('Periodic sync failed:', error);
    }
}

// Cache management
async function cleanupOldCaches() {
    const cacheNames = await caches.keys();
    const oldCaches = cacheNames.filter(name => 
        name !== STATIC_CACHE_NAME && 
        name !== DYNAMIC_CACHE_NAME &&
        name.startsWith('morningflow-')
    );
    
    await Promise.all(
        oldCaches.map(cacheName => caches.delete(cacheName))
    );
    
    console.log('Cleaned up old caches:', oldCaches);
}

// Update available
self.addEventListener('message', (event) => {
    if (event.data && event.data.type === 'UPDATE_AVAILABLE') {
        console.log('Update available, reloading...');
        self.skipWaiting();
    }
});