// Basic offline cache for static assets
const CACHE_NAME = 'vcan-static-v1';
const ASSETS = [
  'index.html','styles.css','app.js','manifest.json',
  'assets/VCan LOGO.jpg','assets/icon-192.png','assets/icon-512.png','assets/logo.svg'
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
  e.respondWith(
    caches.match(req).then(cached => cached || fetch(req).then(r => {
      const clone = r.clone();
      caches.open(CACHE_NAME).then(c => c.put(req, clone));
      return r;
    }).catch(()=> cached))
  );
});
