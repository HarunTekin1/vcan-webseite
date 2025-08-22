// For debugging only: run in the browser console to unregister SWs and clear caches for this origin.
(async function(){
  console.log('Unregistering service workers...');
  const regs = await navigator.serviceWorker.getRegistrations();
  for(const r of regs){ await r.unregister(); console.log('unregistered', r); }
  if(window.caches){
    console.log('Clearing caches...');
    const keys = await caches.keys();
    for(const k of keys){ await caches.delete(k); console.log('deleted cache', k); }
  }
  console.log('Done. Reload the page to fetch fresh assets.');
})();
