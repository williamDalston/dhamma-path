// Production Service Worker for The Dhamma Path
// Ferrari-level caching strategies and offline support

const CACHE_VERSION = 'v2.1.0';
const STATIC_CACHE = `dhamma-path-static-${CACHE_VERSION}`;
const DYNAMIC_CACHE = `dhamma-path-dynamic-${CACHE_VERSION}`;
const IMAGE_CACHE = `dhamma-path-images-${CACHE_VERSION}`;
const API_CACHE = `dhamma-path-api-${CACHE_VERSION}`;

// Critical resources for immediate caching
const CRITICAL_RESOURCES = [
    '/',
    '/index.html',
    '/assets/css/critical.css',
    '/assets/css/styles.css',
    '/assets/js/navigation.js',
    '/assets/js/meditation-timer.js',
    '/assets/js/app.js',
    '/assets/js/production-optimizer.js',
    '/manifest.json',
    '/favicon.svg',
    '/favicon.png',
    '/apple-touch-icon.png'
];

// Template resources for prefetching
const TEMPLATE_RESOURCES = [
    '/assets/templates/home.html',
    '/assets/templates/timer.html',
    '/assets/templates/journal.html',
    '/assets/templates/workout.html',
    '/assets/templates/interview.html',
    '/assets/templates/layout.html'
];

// Install event - cache critical resources
self.addEventListener('install', (event) => {
    console.log('🚀 Production Service Worker installing...');
    event.waitUntil(
        Promise.all([
            caches.open(STATIC_CACHE).then(cache => {
                console.log('📦 Caching critical resources...');
                return cache.addAll(CRITICAL_RESOURCES);
            }),
            caches.open(DYNAMIC_CACHE).then(cache => {
                console.log('📦 Caching template resources...');
                return cache.addAll(TEMPLATE_RESOURCES);
            })
        ]).then(() => {
            console.log('✅ All critical resources cached successfully');
            return self.skipWaiting();
        }).catch(error => {
            console.error('❌ Failed to cache resources:', error);
        })
    );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
    console.log('🔄 Production Service Worker activating...');
    event.waitUntil(
        caches.keys()
            .then(cacheNames => {
                const validCaches = [STATIC_CACHE, DYNAMIC_CACHE, IMAGE_CACHE, API_CACHE];
                return Promise.all(
                    cacheNames.map(cacheName => {
                        if (!validCaches.includes(cacheName)) {
                            console.log('🗑️ Deleting old cache:', cacheName);
                            return caches.delete(cacheName);
                        }
                    })
                );
            })
            .then(() => {
                console.log('✅ Production Service Worker activated successfully');
                return self.clients.claim();
            })
    );
});

// Fetch event - advanced caching strategies
self.addEventListener('fetch', (event) => {
    const { request } = event;
    const url = new URL(request.url);

    // Skip non-GET requests and non-http protocols
    if (request.method !== 'GET' || !url.protocol.startsWith('http')) {
        return;
    }

    // Handle different resource types with optimized strategies
    if (url.pathname === '/' || url.pathname === '/index.html') {
        event.respondWith(networkFirstWithFallback(request, STATIC_CACHE));
    } else if (url.pathname.startsWith('/assets/css/') || url.pathname.startsWith('/assets/js/')) {
        event.respondWith(cacheFirstWithNetworkUpdate(request, STATIC_CACHE));
    } else if (url.pathname.startsWith('/assets/templates/')) {
        event.respondWith(staleWhileRevalidate(request, DYNAMIC_CACHE));
    } else if (url.pathname.match(/\.(jpg|jpeg|png|gif|webp|svg)$/i)) {
        event.respondWith(imageCacheStrategy(request));
    } else if (url.pathname.startsWith('/api/')) {
        event.respondWith(apiCacheStrategy(request));
    } else {
        event.respondWith(staleWhileRevalidate(request, DYNAMIC_CACHE));
    }
});

// Network first with fallback strategy
async function networkFirstWithFallback(request, cacheName) {
    try {
        const networkResponse = await fetch(request);
        if (networkResponse.ok) {
            const cache = await caches.open(cacheName);
            cache.put(request, networkResponse.clone());
        }
        return networkResponse;
    } catch (error) {
        const cachedResponse = await caches.match(request);
        if (cachedResponse) {
            return cachedResponse;
        }
        return new Response('Offline - Please check your connection', { 
            status: 503,
            headers: { 'Content-Type': 'text/html' }
        });
    }
}

// Cache first with network update strategy
async function cacheFirstWithNetworkUpdate(request, cacheName) {
    try {
        const cachedResponse = await caches.match(request);
        if (cachedResponse) {
            // Update cache in background
            fetch(request).then(networkResponse => {
                if (networkResponse.ok) {
                    caches.open(cacheName).then(cache => {
                        cache.put(request, networkResponse.clone());
                    });
                }
            }).catch(() => {});
            return cachedResponse;
        }

        const networkResponse = await fetch(request);
        if (networkResponse.ok) {
            const cache = await caches.open(cacheName);
            cache.put(request, networkResponse.clone());
        }
        return networkResponse;
    } catch (error) {
        return new Response('Resource unavailable offline', { status: 503 });
    }
}

// Stale while revalidate strategy
async function staleWhileRevalidate(request, cacheName) {
    const cache = await caches.open(cacheName);
    const cachedResponse = await cache.match(request);

    const fetchPromise = fetch(request).then(networkResponse => {
        if (networkResponse.ok) {
            cache.put(request, networkResponse.clone());
        }
        return networkResponse;
    }).catch(() => cachedResponse);

    return cachedResponse || fetchPromise;
}

// Image caching strategy with compression
async function imageCacheStrategy(request) {
    try {
        const cachedResponse = await caches.match(request);
        if (cachedResponse) {
            return cachedResponse;
        }

        const networkResponse = await fetch(request);
        if (networkResponse.ok) {
            const cache = await caches.open(IMAGE_CACHE);
            cache.put(request, networkResponse.clone());
        }
        return networkResponse;
    } catch (error) {
        return new Response('Image unavailable offline', { status: 503 });
    }
}

// API caching strategy with TTL
async function apiCacheStrategy(request) {
    try {
        const cachedResponse = await caches.match(request);
        const cacheDate = cachedResponse?.headers.get('sw-cache-date');
        
        // Check if cache is still valid (5 minutes TTL)
        if (cachedResponse && cacheDate) {
            const cacheTime = parseInt(cacheDate);
            const now = Date.now();
            if (now - cacheTime < 300000) { // 5 minutes
                return cachedResponse;
            }
        }

        const networkResponse = await fetch(request);
        if (networkResponse.ok) {
            const responseClone = networkResponse.clone();
            const headers = new Headers(responseClone.headers);
            headers.set('sw-cache-date', Date.now().toString());
            
            const cacheResponse = new Response(responseClone.body, {
                status: responseClone.status,
                statusText: responseClone.statusText,
                headers: headers
            });

            const cache = await caches.open(API_CACHE);
            cache.put(request, cacheResponse);
        }
        return networkResponse;
    } catch (error) {
        const cachedResponse = await caches.match(request);
        if (cachedResponse) {
            return cachedResponse;
        }
        return new Response('API unavailable offline', { status: 503 });
    }
}

// Background sync for offline actions
self.addEventListener('sync', (event) => {
    console.log('🔄 Background sync triggered:', event.tag);
    
    switch (event.tag) {
        case 'background-sync':
            event.waitUntil(doBackgroundSync());
            break;
        case 'analytics-sync':
            event.waitUntil(syncAnalytics());
            break;
        case 'progress-sync':
            event.waitUntil(syncProgress());
            break;
    }
});

async function doBackgroundSync() {
    try {
        // Sync any pending data when back online
        console.log('🔄 Syncing background data...');
        
        // Check for pending analytics
        const pendingAnalytics = await getStoredData('pending-analytics');
        if (pendingAnalytics && pendingAnalytics.length > 0) {
            await syncAnalytics();
        }
        
        // Check for pending progress data
        const pendingProgress = await getStoredData('pending-progress');
        if (pendingProgress && pendingProgress.length > 0) {
            await syncProgress();
        }
        
        console.log('✅ Background sync completed');
    } catch (error) {
        console.error('❌ Background sync failed:', error);
    }
}

async function syncAnalytics() {
    try {
        const pendingData = await getStoredData('pending-analytics') || [];
        if (pendingData.length === 0) return;
        
        // Send analytics data to server
        const response = await fetch('/api/analytics/batch', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ events: pendingData })
        });
        
        if (response.ok) {
            await clearStoredData('pending-analytics');
            console.log('✅ Analytics synced successfully');
        }
    } catch (error) {
        console.error('❌ Analytics sync failed:', error);
    }
}

async function syncProgress() {
    try {
        const pendingData = await getStoredData('pending-progress') || [];
        if (pendingData.length === 0) return;
        
        // Send progress data to server
        const response = await fetch('/api/progress/batch', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ progress: pendingData })
        });
        
        if (response.ok) {
            await clearStoredData('pending-progress');
            console.log('✅ Progress synced successfully');
        }
    } catch (error) {
        console.error('❌ Progress sync failed:', error);
    }
}

// Push notifications with rich content
self.addEventListener('push', (event) => {
    if (event.data) {
        const data = event.data.json();
        const options = {
            body: data.body,
            icon: '/favicon.svg',
            badge: '/favicon.svg',
            vibrate: [200, 100, 200, 100, 200],
            data: {
                dateOfArrival: Date.now(),
                primaryKey: data.primaryKey,
                url: data.url || '/'
            },
            actions: [
                {
                    action: 'open',
                    title: 'Open App',
                    icon: '/favicon.svg'
                },
                {
                    action: 'dismiss',
                    title: 'Dismiss',
                    icon: '/favicon.svg'
                }
            ],
            requireInteraction: data.requireInteraction || false,
            silent: data.silent || false
        };

        event.waitUntil(
            self.registration.showNotification(data.title, options)
        );
    }
});

// Enhanced notification click handling
self.addEventListener('notificationclick', (event) => {
    event.notification.close();

    if (event.action === 'open' || !event.action) {
        event.waitUntil(
            clients.matchAll({ type: 'window' }).then(clientList => {
                const url = event.notification.data?.url || '/';
                
                // Focus existing window or open new one
                for (const client of clientList) {
                    if (client.url === url && 'focus' in client) {
                        return client.focus();
                    }
                }
                
                if (clients.openWindow) {
                    return clients.openWindow(url);
                }
            })
        );
    }
});

// Utility functions for data storage
async function getStoredData(key) {
    try {
        const cache = await caches.open(DYNAMIC_CACHE);
        const response = await cache.match(`/data/${key}`);
        return response ? await response.json() : null;
    } catch (error) {
        console.error('Failed to get stored data:', error);
        return null;
    }
}

async function setStoredData(key, data) {
    try {
        const cache = await caches.open(DYNAMIC_CACHE);
        const response = new Response(JSON.stringify(data));
        await cache.put(`/data/${key}`, response);
    } catch (error) {
        console.error('Failed to store data:', error);
    }
}

async function clearStoredData(key) {
    try {
        const cache = await caches.open(DYNAMIC_CACHE);
        await cache.delete(`/data/${key}`);
    } catch (error) {
        console.error('Failed to clear stored data:', error);
    }
}

// Cache management and cleanup
self.addEventListener('message', (event) => {
    if (event.data && event.data.type === 'CACHE_CLEANUP') {
        event.waitUntil(cleanupCaches());
    }
});

async function cleanupCaches() {
    try {
        const cacheNames = await caches.keys();
        const validCaches = [STATIC_CACHE, DYNAMIC_CACHE, IMAGE_CACHE, API_CACHE];
        
        for (const cacheName of cacheNames) {
            if (!validCaches.includes(cacheName)) {
                await caches.delete(cacheName);
            }
        }
        
        // Clean up old entries in dynamic cache
        const dynamicCache = await caches.open(DYNAMIC_CACHE);
        const requests = await dynamicCache.keys();
        
        for (const request of requests) {
            const response = await dynamicCache.match(request);
            const cacheDate = response?.headers.get('sw-cache-date');
            
            if (cacheDate && Date.now() - parseInt(cacheDate) > 86400000) { // 24 hours
                await dynamicCache.delete(request);
            }
        }
        
        console.log('✅ Cache cleanup completed');
    } catch (error) {
        console.error('❌ Cache cleanup failed:', error);
    }
}