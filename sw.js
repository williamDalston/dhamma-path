// Robust Service Worker for GitHub Pages
self.addEventListener('install', (event) => {
  const base = self.registration.scope; // e.g. https://.../dhamma-path/
  const urls = [
    `${base}index.html`,
    `${base}offline.html`,
    `${base}assets/css/styles.css`,
    `${base}assets/js/app.js`,
    `${base}assets/js/navigation.js`,
  ];

  event.waitUntil((async () => {
    const cache = await caches.open('mf-critical-v1');
    const results = await Promise.allSettled(urls.map(u => cache.add(u)));
    results.forEach((r, i) => {
      if (r.status === 'rejected') console.warn('[SW] skipped', urls[i], r.reason);
    });
    self.skipWaiting();
  })());
});

self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener('fetch', (event) => {
  const req = event.request;
  event.respondWith((async () => {
    try {
      const net = await fetch(req);
      return net;
    } catch {
      // Offline fallback for navigations
      if (req.mode === 'navigate') {
        const cache = await caches.open('mf-critical-v1');
        const base = self.registration.scope;
        return (await cache.match(`${base}offline.html`)) || Response.error();
      }
      // Try cache for other requests
      const cached = await caches.match(req);
      return cached || Response.error();
    }
  })());
});