// Basic offline cache for static assets
const CACHE_NAME = 'vcan-static-v2';
const ASSETS = [
  'index.html','features.html','vision.html','kontakt.html','impressum.html','datenschutz.html','offline.html',
  'partner.html','en/index.html',
  'styles.css','app.js','manifest.json',
  'assets/vcan-logo.jpg','assets/icon-192.png','assets/icon-512.png','assets/favicon.svg'
];
self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE_NAME).then(c=>c.addAll(ASSETS)));
});
self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys => Promise.all(keys.filter(k=>k!==CACHE_NAME).map(k=>caches.delete(k))))
  );
});
self.addEventListener('fetch', e => {
  const req = e.request;
  if(req.method !== 'GET') return;
  if(req.mode === 'navigate') {
    e.respondWith(fetch(req).catch(() => caches.match('offline.html')));
    return;
  }
  e.respondWith(
    caches.match(req).then(cached => {
      const fetchPromise = fetch(req).then(r => {
        if(r.ok) caches.open(CACHE_NAME).then(c => c.put(req, r.clone()));
        return r;
      }).catch(()=> cached);
      return cached || fetchPromise;
    })
  );
});
