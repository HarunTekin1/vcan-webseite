// VCan minimal interactivity: nav toggle & focus trap helper
(function(){
  const toggle = document.getElementById('navToggle');
  const nav = document.getElementById('primaryNav');
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
