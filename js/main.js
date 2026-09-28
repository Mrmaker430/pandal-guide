// ─── Boot: wire up modules and render initial state ───
import { setOnSelect } from './map.js';
import { setUIHandlers, renderAll } from './ui.js';
import { select, clearSelection, initGeolocation } from './actions.js';
import { initStartSearch, initPandalSearch } from './search.js';
import { initDrawer } from './drawer.js';

// Map markers need a way to trigger the select flow — avoid circular import
setOnSelect(select);

// UI render functions need to trigger select/clear via callbacks
setUIHandlers({ onSelect: select, onClear: clearSelection });

// Wire up all interactive modules
initDrawer();
initGeolocation();
initStartSearch();
initPandalSearch();

// First render
renderAll();
