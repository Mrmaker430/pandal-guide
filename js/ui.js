// js/ui.js
import { PANDALS } from './data.js';
import { NAME_BN } from './names-bn.js';
import { state, $, haversineKm, origin, escapeHtml } from './state.js';

const displayName = (p) => NAME_BN[p.id] || p.name;

const AREA_BN = {
  Chandannagar: 'চন্দননগর',
  Bhadreswar: 'ভদ্রেশ্বর',
  Mankundu: 'মানকুণ্ডু',
  Kolkata: 'কলকাতা',
  Krishnanagar: 'কৃষ্ণনগর',
  Howrah: 'হাওড়া',
  Chinsurah: 'চুঁচুড়া',
  Serampore: 'শ্রীরামপুর',
  Bandel: 'ব্যান্ডেল',
  Santipur: 'শান্তিপুর',
  Tarakeswar: 'তারকেশ্বর',
};

let onSelectHandler = () => {};
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
    { n: 'সব প্যান্ডেল', v: '', c: PANDALS.length },
    ...sorted.map(([n, c]) => ({ n: AREA_BN[n] || n, v: n, c })),
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
    .filter((p) => {
      if (!q) return true;
      const haystack = `${p.name} ${NAME_BN[p.id] || ''} ${p.area} ${p.address} ${p.theme}`.toLowerCase();
      return haystack.includes(q);
    })
    .map((p) => ({ ...p, distKm: o ? haversineKm(o, p) : null }))
    .sort((a, b) =>
      a.distKm != null ? a.distKm - b.distKm : a.name.localeCompare(b.name)
    );
}

export function renderList() {
  const list = filteredPandals();
  $('listCount').textContent = list.length;

  if (!list.length) {
    $('list').innerHTML = `<li class="empty">কোনো প্যান্ডেল পাওয়া যায়নি।</li>`;
    return;
  }

  $('list').innerHTML = list
    .map(
      (p) => `
      <li data-id="${p.id}" class="${state.selected?.id === p.id ? 'active' : ''}">
        <div class="name">
          <span>${escapeHtml(displayName(p))}</span>
          ${p.distKm != null ? `<span class="dist">${p.distKm.toFixed(1)} কিমি</span>` : ''}
        </div>
        <div class="meta">${escapeHtml(p.area)}${p.timings ? ` · ${escapeHtml(p.timings)}` : ''}</div>
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
  if (!state.selected) { box.innerHTML = ''; return; }

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
          <div class="route-km" style="font-family:var(--font-body);font-size:.92rem;color:var(--muted);font-weight:500">শুরুর বিন্দু সেট করুন</div>
          <div class="route-min">উপরের সার্চ বাক্স ব্যবহার করুন বা লোকেশন চালু করুন।</div>
        </div>
      </div>`;
  } else if (state.route) {
    routeBox = `
      <div class="route-box">
        <div class="route-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 20l-5.447-2.724A1 1 0 0 1 3 16.382V5.618a1 1 0 0 1 1.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0 0 21 18.382V7.618a1 1 0 0 0-.553-.894L15 4m0 13V4m0 0L9 7"/></svg>
        </div>
        <div class="route-meta">
          <div class="route-km">${state.route.km} কিমি <small>·  ~${state.route.min} মিনিট</small></div>
          <div class="route-min">গাড়িতে · ${state.route.real ? 'লাইভ ট্রাফিক' : 'সরলরেখা অনুমান'}</div>
        </div>
      </div>`;
  } else {
    routeBox = `
      <div class="route-box">
        <div class="route-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>
        </div>
        <div class="route-meta">
          <div class="route-km" style="font-family:var(--font-body);font-size:.92rem;color:var(--muted);font-weight:500">রুট গণনা করা হচ্ছে…</div>
        </div>
      </div>`;
  }

  const gmaps = `https://www.google.com/maps/dir/?api=1&destination=${p.lat},${p.lng}&travelmode=driving`;
  const shareText = encodeURIComponent(`🪔 ${displayName(p)} — ${p.address}\nজগদ্ধাত্রী পূজা প্যান্ডেল\n${gmaps}`);

  box.innerHTML = `
    <div class="detail-card">
      <div class="detail-hero">
        <button class="detail-close" id="closeDetail" aria-label="বন্ধ করুন">×</button>
        <div class="detail-hero-content">
          <span class="area-badge">🪔 ${escapeHtml(p.area)}</span>
          <h2>${escapeHtml(displayName(p))}</h2>
          <p class="addr">${escapeHtml(p.address)}</p>
        </div>
      </div>
      <div class="detail-body">
        <div class="pills">
          ${p.timings ? `<span class="pill">🕙 ${escapeHtml(p.timings)}</span>` : ''}
          <span class="pill">🎨 ${escapeHtml(p.theme)}</span>
        </div>
        ${routeBox}
        <div class="actions">
          <a class="btn primary" href="${gmaps}" target="_blank" rel="noreferrer">
            গুগল ম্যাপে খুলুন
          </a>
          <a class="btn" href="https://wa.me/?text=${shareText}" target="_blank" rel="noreferrer">
            শেয়ার করুন
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
