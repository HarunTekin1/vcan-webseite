// VCan minimal interactivity: nav toggle & focus trap helper
(function(){
  const toggle = document.getElementById('navToggle');
  // Robust: entweder explizite ID oder erstes Element mit .main-nav
  const nav = document.getElementById('primaryNav') || document.querySelector('.main-nav');
  if(!toggle || !nav) return;

  function close(){
    nav.classList.remove('open');
    toggle.setAttribute('aria-expanded','false');
  }
  function open(){
    nav.classList.add('open');
    toggle.setAttribute('aria-expanded','true');
  }
  toggle.addEventListener('click', () => {
    const isOpen = nav.classList.contains('open');
    (isOpen?close:open)();
    if(!isOpen){
      // focus first link
      const first = nav.querySelector('a');
      if(first) first.focus();
    } else {
      toggle.focus();
    }
  });
  document.addEventListener('keyup', e => {
    if(e.key === 'Escape') close();
  });
  // close when clicking outside on small screens
  document.addEventListener('click', e => {
    if(window.innerWidth > 860) return; // desktop
    if(!nav.contains(e.target) && e.target !== toggle) close();
  });
})();

// Theme toggle + persistence
(function(){
  const btn = document.getElementById('themeToggle');
  if(!btn) return;
  const root = document.documentElement;
  const STORAGE_KEY = 'vcan-theme';
  const saved = localStorage.getItem(STORAGE_KEY);
  if(saved === 'dark') root.classList.add('dark');
  if(saved === 'light') root.classList.add('light');
  function syncLabel(){
    const dark = root.classList.contains('dark');
    btn.textContent = dark? 'Light':'Dark';
    btn.setAttribute('aria-pressed', dark? 'true':'false');
  }
  syncLabel();
  btn.addEventListener('click', ()=>{
    const dark = root.classList.toggle('dark');
    if(dark) root.classList.remove('light');
    localStorage.setItem(STORAGE_KEY, dark? 'dark':'light');
    syncLabel();
  });
})();

// Service Worker registration (progressive)
(function(){
  if('serviceWorker' in navigator){
    window.addEventListener('load', ()=>{
      navigator.serviceWorker.register('sw.js').catch(()=>{/* ignore */});
    });
  }
})();

// Expose admin mode to UI (show admin-only links when session present)
(function(){
  try{
    const token = sessionStorage.getItem('adminAuth');
    if(token){ document.body.classList.add('is-admin'); }
    // keep in sync on storage events within same tab
    window.addEventListener('storage', () => {
      const t = sessionStorage.getItem('adminAuth');
      document.body.classList.toggle('is-admin', !!t);
    });
  }catch(_){ /* ignore */ }
})();

// Compute and set header height CSS var for full-viewport hero
(function(){
  function setHeaderH(){
    const header = document.querySelector('.site-header');
    if(!header) return;
    const h = header.getBoundingClientRect().height;
    document.documentElement.style.setProperty('--header-h', `${Math.round(h)}px`);
  }
  window.addEventListener('load', setHeaderH);
  window.addEventListener('resize', setHeaderH);
  // also update on font load/layout shifts
  document.addEventListener('DOMContentLoaded', setHeaderH);
})();
