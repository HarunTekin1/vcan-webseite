// Basic offline cache for static assets
const CACHE_NAME = 'vcan-static-v105';
const ASSETS = [
  'index.html','vision.html','kontakt.html','impressum.html','datenschutz.html','agb.html','offline.html','admin.html','fuer-user.html',
  'partner.html','en/index.html',
  'styles.css','app.js','manifest.json',
  'assets/vcan-logo.jpg','assets/icon-192.png','assets/icon-512.png','assets/favicon.svg',
  // New illustrations
  'assets/illus-community.svg','assets/illus-dialog.svg','assets/illus-hands.svg','assets/illus-features.svg',
  'assets/illus-perspektive.svg','assets/illus-empower.svg','assets/illus-scale.svg','assets/illus-team.svg',
  // Hero photo variants
  'assets/optimized/41819f8e-51e3-4c75-915e-e11dbbeeb64f-640.avif',
  'assets/optimized/41819f8e-51e3-4c75-915e-e11dbbeeb64f-960.avif',
  'assets/optimized/41819f8e-51e3-4c75-915e-e11dbbeeb64f-1280.avif'
  ,
  'assets/optimized/41819f8e-51e3-4c75-915e-e11dbbeeb64f-640.webp',
  'assets/optimized/41819f8e-51e3-4c75-915e-e11dbbeeb64f-960.webp',
  'assets/optimized/41819f8e-51e3-4c75-915e-e11dbbeeb64f-1280.webp',
  'assets/optimized/41819f8e-51e3-4c75-915e-e11dbbeeb64f-640.jpg',
  'assets/optimized/41819f8e-51e3-4c75-915e-e11dbbeeb64f-960.jpg',
  'assets/optimized/41819f8e-51e3-4c75-915e-e11dbbeeb64f-1280.jpg'
];
self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE_NAME).then(c=>c.addAll(ASSETS)).then(()=>self.skipWaiting())
  );
});
self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys => Promise.all(keys.filter(k=>k!==CACHE_NAME).map(k=>caches.delete(k)))).then(()=>self.clients.claim())
  );
});
self.addEventListener('fetch', e => {
  const req = e.request;
  if(req.method !== 'GET') return;
  try {
    const url = new URL(req.url);
    // Redirect legacy paths
    if (url.pathname.endsWith('/register.html') || url.pathname.endsWith('/register')) {
      e.respondWith(Response.redirect(`${url.origin}/fuer-user.html`, 302));
      return;
    }
    if (url.pathname.endsWith('/features.html') || url.pathname.endsWith('/features')) {
      e.respondWith(Response.redirect(`${url.origin}/admin.html#features-admin`, 302));
      return;
    }
  } catch (_) {}
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
