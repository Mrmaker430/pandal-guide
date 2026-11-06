// js/search.js
import { PANDALS } from './data.js';
import { NAME_BN } from './names-bn.js';
import { state, $, escapeHtml, origin, haversineKm } from './state.js';
import { map, startIcon, mapState } from './map.js';
import { select } from './actions.js';
import { renderList, renderAll, switchTab, displayName } from './ui.js';

export function initStartSearch() {
  const input = $('startInput');
  const box = $('startSugg');
  if (!input || !box) return;

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

function searchPandalsList(query) {
  const q = query.toLowerCase().trim();
  const o = origin();
  if (!q) {
    return PANDALS
      .map((p) => ({ ...p, distKm: o ? haversineKm(o, p) : null }))
      .sort((a, b) => (a.distKm != null ? a.distKm - b.distKm : a.name.localeCompare(b.name)))
      .slice(0, 25);
  }

  const terms = q.split(/\s+/);
  return PANDALS
    .filter((p) => {
      const bnName = NAME_BN[p.id] || '';
      const haystack = `${p.name} ${bnName} ${p.area} ${p.address} ${p.theme} ${(p.tags || []).join(' ')}`.toLowerCase();
      return terms.every((t) => haystack.includes(t));
    })
    .map((p) => ({ ...p, distKm: o ? haversineKm(o, p) : null }))
    .sort((a, b) => (a.distKm != null ? a.distKm - b.distKm : a.name.localeCompare(b.name)));
}

export function renderSearchResults(query = '') {
  const resultsContainer = $('pandalSearchResults');
  const countBadge = $('searchCountBadge');
  if (!resultsContainer) return;

  const results = searchPandalsList(query);
  if (countBadge) {
    countBadge.textContent = query.trim()
      ? `ফলাফল: ${results.length}টি মণ্ডপ পাওয়া গেছে`
      : `প্রস্তাবিত মণ্ডপ (${results.length}টি)`;
  }

  if (!results.length) {
    resultsContainer.innerHTML = `<li class="empty">"${escapeHtml(query)}" নামে কোনো প্যান্ডেল খুঁজে পাওয়া যায়নি। অন্য নাম বা এলাকা দিয়ে চেষ্টা করুন।</li>`;
    return;
  }

  resultsContainer.innerHTML = results
    .map((p) => `
      <li data-pandal-id="${p.id}">
        <div class="search-item-info">
          <div class="name">
            <span>${escapeHtml(displayName(p))}</span>
            ${p.distKm != null ? `<span class="dist">${p.distKm.toFixed(1)} কিমি</span>` : ''}
          </div>
          <div class="meta">${escapeHtml(p.area)} · ${escapeHtml(p.address.split(',')[0])}</div>
          <div class="theme">${escapeHtml(p.theme)}</div>
          <div class="feature-actions"><button class="mini-action" data-action="toggle-favourite" data-id="${p.id}">♡ পছন্দ</button><button class="mini-action" data-action="add-stop" data-id="${p.id}">＋ ট্যুরে যোগ</button></div>
        </div>
        <div class="search-item-action">
          <span>ম্যাপে দেখুন</span>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="9 18 15 12 9 6"></polyline>
          </svg>
        </div>
      </li>
    `)
    .join('');

  resultsContainer.querySelectorAll('li[data-pandal-id]').forEach((li) => {
    li.addEventListener('click', () => {
      const p = PANDALS.find((x) => x.id === li.dataset.pandalId);
      if (!p) return;
      // Auto select as destination
      select(p);
      // Auto jump to map section
      switchTab('map');
    });
  });
}

export function initPandalSearch() {
  const input = $('pandalSearchInput');
  const clearBtn = $('clearSearchBtn');
  if (!input) return;

  // Initial render with recommendations
  renderSearchResults('');

  let searchTimer = null;
  input.addEventListener('input', (e) => {
    const val = e.target.value;
    if (clearBtn) {
      clearBtn.style.display = val ? 'flex' : 'none';
    }
    clearTimeout(searchTimer);
    searchTimer = setTimeout(() => {
      state.query = val;
      renderSearchResults(val);
      renderList();
    }, 150);
  });

  if (clearBtn) {
    clearBtn.addEventListener('click', () => {
      input.value = '';
      clearBtn.style.display = 'none';
      state.query = '';
      renderSearchResults('');
      renderList();
      input.focus();
    });
  }
}
