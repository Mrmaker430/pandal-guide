// js/main.js
import { setOnSelect } from './map.js';
import { setUIHandlers, renderAll } from './ui.js';
import { select, clearSelection, initGeolocation } from './actions.js';
import { initStartSearch, initPandalSearch } from './search.js';
import { initDrawer } from './drawer.js';

setOnSelect(select);
setUIHandlers({ onSelect: select, onClear: clearSelection });

initDrawer();
initGeolocation();
initStartSearch();
initPandalSearch();

renderAll();
