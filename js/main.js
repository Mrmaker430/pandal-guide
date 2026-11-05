// js/main.js
import { setOnSelect } from './map.js';
import { setUIHandlers, renderAll, initTabs, switchTab } from './ui.js';
import { select, clearSelection, initGeolocation } from './actions.js';
import { initStartSearch, initPandalSearch } from './search.js';
import { initDrawer } from './drawer.js';

// Map marker click selects destination and shows detail
setOnSelect((p) => {
  select(p);
  switchTab('map');
});

setUIHandlers({ onSelect: select, onClear: clearSelection });

initTabs();
initDrawer();
initGeolocation();
initStartSearch();
initPandalSearch();

renderAll();
