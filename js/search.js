// js/search.js
import { state, $, escapeHtml } from './state.js';
import { map, startIcon, mapState } from './map.js';
import { select } from './actions.js';
import { renderList, renderAll } from './ui.js';

export function initStartSearch() {
  const input = $('startInput');
  const box = $('startSugg');
  const geocodeCache = new Map();
  let suggestTimer = null;

  input.addEventListener('input', (e) => {
    const q = e.target.value.trim();
    if (q.length < 3) { box.style.display = 'none'; return; }

    clearTimeout(suggestTimer);
    suggestTimer = setTimeout(async () => {
      let results = geocodeCache.get(q.toLowerCase());

      if (!results) {
        try {
          const url = new URL('https://nominatim.openstreetmap.org/search');
          url.searchParams.set('q', q);
          url.searchParams.set('format', 'json');
          url.searchParams.set('limit', '5');
          url.searchParams.set('countrycodes', 'in');
          url.searchParams.set('email', 'pandal-guide@example.com');
          const r = await fetch(url);
          const data = await r.json();
          results = data.map((d) => ({ label: d.display_name, lat: +d.lat, lng: +d.lon }));
          geocodeCache.set(q.toLowerCase(), results);
        } catch { results = []; }
      }

      if (!results.length) { box.style.display = 'none'; return; }

      box.innerHTML = results
        .map((r, i) => `<li data-i="${i}">${escapeHtml(r.label)}</li>`)
        .join('');
      box.style.display = 'block';

      box.querySelectorAll('li').forEach((li) => {
        li.onclick = () => {
          const r = results[+li.dataset.i];
          state.start = { lat: r.lat, lng: r.lng, label: r.label.split(',').slice(0, 2).join(',') };
          state.user = null;
          input.value = r.label.split(',').slice(0, 2).join(',');
          box.style.display = 'none';
          $('locStatus').style.display = 'none';

          if (mapState.userMarker) { map.removeLayer(mapState.userMarker); mapState.userMarker = null; }
          if (mapState.startMarker) map.removeLayer(mapState.startMarker);
          mapState.startMarker = L.marker([r.lat, r.lng], { icon: startIcon }).addTo(map).bindPopup('শুরুর বিন্দু');
          map.flyTo([r.lat, r.lng], 13, { duration: 1 });

          if (state.selected) select(state.selected);
          else renderAll();
        };
      });
    }, 400);
  });

  document.addEventListener('click', (e) => {
    if (!e.target.closest('#startInput') && !e.target.closest('#startSugg')) {
      box.style.display = 'none';
    }
  });
}

export function initPandalSearch() {
  const input = $('search');
  let searchTimer = null;
  input.addEventListener('input', (e) => {
    const v = e.target.value;
    clearTimeout(searchTimer);
    searchTimer = setTimeout(() => { state.query = v; renderList(); }, 200);
  });
}
