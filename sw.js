// Robust Service Worker for GitHub Pages
const SCOPE = self.registration.scope; // e.g. https://.../dhamma-path/
const toURL = (u) => {
    const cleanScope = SCOPE.endsWith('/') ? SCOPE : SCOPE + '/';
    return cleanScope + u.replace(/^\//, '');
};

const STATIC = 'dhamma-path-static-v1';
const DYNAMIC = 'dhamma-path-dynamic-v1';

self.addEventListener('install', (event) => {
  const CRITICAL = [
    '',                 // index
    'offline.html',
    'assets/css/styles.css',
    'assets/js/app.js',
    'assets/js/navigation.js',
  ].map(toURL);

  event.waitUntil((async () => {
    const cache = await caches.open(STATIC);
    const results = await Promise.allSettled(CRITICAL.map(u => cache.add(u)));
    results.forEach((r, i) => {
      if (r.status === 'rejected') console.warn('[SW] skipped', CRITICAL[i], r.reason);
    });
    self.skipWaiting();
  })());
});

self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim());
  self.skipWaiting();
});

self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);

  // ✅ Never intercept cross-origin (fixes Tailwind CDN fetch below)
  if (url.origin !== self.location.origin) return;

  event.respondWith(
    caches.match(event.request).then((hit) =>
      hit ||
      fetch(event.request).then(res => {
        const copy = res.clone();
        caches.open(DYNAMIC).then(c => c.put(event.request, copy));
        return res;
      }).catch(() => caches.match(toURL('offline.html')))
    )
  );
});