import { PANDALS } from './data.js';
import { state, $, haversineKm, origin, escapeHtml } from './state.js';

// onSelect is wired up by main.js
let onSelectHandler = (p) => {};
let onClearHandler = () => {};
export const setUIHandlers = ({ onSelect, onClear }) => {
  if (onSelect) onSelectHandler = onSelect;
  if (onClear) onClearHandler = onClear;
};

export function renderChips() {
  const counts = new Map();
  PANDALS.forEach((p) => counts.set(p.area, (counts.get(p.area) || 0) + 1));
  const sorted = [...counts.entries()].sort((a, b) => b[1] - a[1]);
  const chips = [
    { n: 'All pandals', v: '', c: PANDALS.length },
    ...sorted.map(([n, c]) => ({ n, v: n, c })),
  ];

  $('chips').innerHTML = chips
    .map(
      (ch) => `
        <button class="chip ${state.area === ch.v ? 'active' : ''}" data-area="${escapeHtml(ch.v)}">
          ${escapeHtml(ch.n)}<span class="count">${ch.c}</span>
        </button>`
    )
    .join('');

  $('chips').querySelectorAll('.chip').forEach((el) => {
    el.onclick = () => {
      state.area = el.dataset.area;
      renderAll();
    };
  });
}

export function filteredPandals() {
  const q = state.query.toLowerCase().trim();
  const o = origin();
  return PANDALS
    .filter((p) => !state.area || p.area === state.area)
    .filter((p) => !q || `${p.name} ${p.area} ${p.address} ${p.theme}`.toLowerCase().includes(q))
    .map((p) => ({ ...p, distKm: o ? haversineKm(o, p) : null }))
    .sort((a, b) =>
      a.distKm != null ? a.distKm - b.distKm : a.name.localeCompare(b.name)
    );
}

export function renderList() {
  const list = filteredPandals();
  $('listCount').textContent = list.length;
  $('listLabel').textContent = list.length === 1 ? 'pandal' : 'pandals nearby';

  if (!list.length) {
    $('list').innerHTML = `<li class="empty">No pandals match your search.</li>`;
    return;
  }

  $('list').innerHTML = list
    .map(
      (p) => `
      <li data-id="${p.id}" class="${state.selected?.id === p.id ? 'active' : ''}">
        <div class="name">
          <span>${escapeHtml(p.name)}</span>
          ${p.distKm != null ? `<span class="dist">${p.distKm.toFixed(1)} km</span>` : ''}
        </div>
        <div class="meta">${escapeHtml(p.area)}</div>
        <div class="theme">${escapeHtml(p.theme)}</div>
      </li>`
    )
    .join('');

  $('list').querySelectorAll('li[data-id]').forEach((el) => {
    el.onclick = () => {
      const p = PANDALS.find((x) => x.id === el.dataset.id);
      onSelectHandler(p);
    };
  });
}

export function renderDetail() {
  const box = $('detail');
  if (!state.selected) {
    box.innerHTML = '';
    return;
  }
  const p = state.selected;
  const o = origin();

  let routeBox;
  if (!o) {
    routeBox = `
      <div class="route-box">
        <div class="route-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="10" r="3"/><path d="M12 21s-7-6.5-7-12a7 7 0 1 1 14 0c0 5.5-7 12-7 12z"/></svg>
        </div>
        <div class="route-meta">
          <div class="route-km" style="font-family:var(--font-body);font-size:.88rem;color:var(--muted);font-weight:500">Set a start point</div>
          <div class="route-min">Search above or tap use my location to see directions.</div>
        </div>
      </div>`;
  } else if (state.route) {
    routeBox = `
      <div class="route-box">
        <div class="route-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 20l-5.447-2.724A1 1 0 0 1 3 16.382V5.618a1 1 0 0 1 1.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0 0 21 18.382V7.618a1 1 0 0 0-.553-.894L15 4m0 13V4m0 0L9 7"/></svg>
        </div>
        <div class="route-meta">
          <div class="route-km">${state.route.km} km<small>·  ~${state.route.min} min</small></div>
          <div class="route-min">by car · ${state.route.real ? 'live traffic estimate' : 'straight-line estimate'}</div>
        </div>
      </div>`;
  } else {
    routeBox = `
      <div class="route-box calculating">
        <div class="route-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>
        </div>
        <div class="route-meta"><div class="route-km">Calculating route…</div></div>
      </div>`;
  }

  const gmaps = `https://www.google.com/maps/dir/?api=1&destination=${p.lat},${p.lng}&travelmode=driving`;
  const shareText = encodeURIComponent(
    `🪔 ${p.name} — ${p.address}\nJagadhatri Puja pandal\n${gmaps}`
  );

  box.innerHTML = `
    <div class="detail-card">
      <div class="detail-hero">
        <button class="detail-close" id="closeDetail" aria-label="Close">×</button>
        <div class="detail-hero-content">
          <span class="area-badge">🪔 ${escapeHtml(p.area)}</span>
          <h2>${escapeHtml(p.name)}</h2>
          <p class="addr">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="10" r="3"/><path d="M12 21s-7-6.5-7-12a7 7 0 1 1 14 0c0 5.5-7 12-7 12z"/></svg>
            ${escapeHtml(p.address)}
          </p>
        </div>
      </div>
      <div class="detail-body">
        <div class="pills">
          <span class="pill">🎨 ${escapeHtml(p.theme)}</span>
        </div>
        ${routeBox}
        <div class="actions">
          <a class="btn primary" href="${gmaps}" target="_blank" rel="noreferrer">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 20l-5.447-2.724A1 1 0 0 1 3 16.382V5.618a1 1 0 0 1 1.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0 0 21 18.382V7.618a1 1 0 0 0-.553-.894L15 4m0 13V4m0 0L9 7"/></svg>
            Open in Google Maps
          </a>
          <a class="btn" href="https://wa.me/?text=${shareText}" target="_blank" rel="noreferrer">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/></svg>
            Share
          </a>
        </div>
      </div>
    </div>
  `;
  $('closeDetail').onclick = () => onClearHandler();
}

export function renderAll() {
  renderChips();
  renderList();
  renderDetail();
}