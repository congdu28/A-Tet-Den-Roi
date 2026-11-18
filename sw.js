// Resilient Service Worker for Tet 2027 PWA (network-first with offline app-shell fallback)
const CACHE_NAME = 'tet-2027-shell-v12';
const SHELL_ASSETS = [
    '/',
    '/index.html',
    '/css/style.css',
    '/js/lunar.js',
    '/js/audio.js',
    '/js/fireworks.js',
    '/js/ambient.js',
    '/js/petals.js',
    '/js/countdown.js',
    '/js/lixi.js',
    '/js/fortune.js',
    '/js/card-maker.js',
    '/js/app.js',
    '/assets/site.webmanifest',
    '/assets/favicon.svg',
    '/assets/favicon-32x32.png',
    '/assets/icon-192.png',
    '/assets/icon-512.png'
];

self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => cache.addAll(SHELL_ASSETS).catch(() => {}))
            .then(() => self.skipWaiting())
    );
});

self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys()
            .then((keys) => Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k))))
            .then(() => self.clients.claim())
    );
});

self.addEventListener('fetch', (event) => {
    const req = event.request;
    if (req.method !== 'GET') return;

    // Never intercept byte-range / streaming audio requests
    if (req.headers.has('range') || req.destination === 'audio' || req.destination === 'video') {
        return;
    }

    let url;
    try {
        url = new URL(req.url);
    } catch {
        return;
    }
    if (url.origin !== self.location.origin) return;

    event.respondWith(
        fetch(req)
            .then((res) => {
                if (res && res.ok && res.type === 'basic') {
                    const copy = res.clone();
                    caches.open(CACHE_NAME).then((cache) => cache.put(req, copy)).catch(() => {});
                }
                return res;
            })
            .catch(async () => {
                const cached = await caches.match(req);
                if (cached) return cached;
                if (req.mode === 'navigate') {
                    const fallbackDoc = await caches.match('/index.html') || await caches.match('/');
                    if (fallbackDoc) return fallbackDoc;
                }
                return new Response('Offline', { status: 503, statusText: 'Offline' });
            })
    );
});
