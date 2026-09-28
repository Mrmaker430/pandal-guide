import { $ } from './state.js';

export function initDrawer() {
  const menuBtn = $('menuBtn');
  const drawer = $('drawer');
  const overlay = $('drawerOverlay');

  const open = () => {
    drawer.classList.add('open');
    overlay.classList.add('open');
    menuBtn.classList.add('open');
    menuBtn.setAttribute('aria-expanded', 'true');
    drawer.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  };

  const close = () => {
    drawer.classList.remove('open');
    overlay.classList.remove('open');
    menuBtn.classList.remove('open');
    menuBtn.setAttribute('aria-expanded', 'false');
    drawer.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  };

  menuBtn.onclick = () =>
    drawer.classList.contains('open') ? close() : open();
  overlay.onclick = close;
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') close();
  });
}
