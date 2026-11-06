// js/main.js
import { setOnSelect } from './map.js';
import { setUIHandlers, renderAll, initTabs, switchTab } from './ui.js';
import { select, clearSelection, initGeolocation } from './actions.js';
import { initStartSearch, initPandalSearch } from './search.js';
import { initDrawer } from './drawer.js';
import { initVisitorFeatures } from './features.js';

// Map marker click selects destination and shows detail.
setOnSelect((p) => {
  select(p);
  switchTab('map');
});

setUIHandlers({ onSelect: select, onClear: clearSelection });

function initPWA() {
  if ('serviceWorker' in navigator && (location.protocol === 'https:' || location.hostname === 'localhost')) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('./service-worker.js').catch((error) => {
        console.warn('PWA offline support could not be enabled:', error);
      });
    });
  }

  const installButton = document.getElementById('installApp');
  if (!installButton) return;

  let installPrompt = null;
  window.addEventListener('beforeinstallprompt', (event) => {
    event.preventDefault();
    installPrompt = event;
    installButton.hidden = false;
  });

  installButton.addEventListener('click', async () => {
    if (!installPrompt) return;
    installButton.disabled = true;
    installPrompt.prompt();
    await installPrompt.userChoice;
    installPrompt = null;
    installButton.hidden = true;
    installButton.disabled = false;
  });

  window.addEventListener('appinstalled', () => {
    installPrompt = null;
    installButton.hidden = true;
  });
}

initTabs();
initDrawer();
initGeolocation();
initStartSearch();
initPandalSearch();
initVisitorFeatures();
document.getElementById('sortPandals')?.addEventListener('change', renderAll);
initPWA();
renderAll();
