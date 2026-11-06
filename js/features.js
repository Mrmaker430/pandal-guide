// Phase 1 visitor features: favourites and a locally saved multi-stop tour.
import { PANDALS } from './data.js';
import { NAME_BN } from './names-bn.js';
import { escapeHtml } from './state.js';

const FAV_KEY = 'pandal-guide:favourites:v1';
const TOUR_KEY = 'pandal-guide:tour:v1';
const readIds = (key) => {
  try { const value = JSON.parse(localStorage.getItem(key) || '[]'); return Array.isArray(value) ? value.filter((id) => PANDALS.some((p) => p.id === id)) : []; }
  catch { return []; }
};
let favourites = new Set(readIds(FAV_KEY));
let tour = readIds(TOUR_KEY);
const nameOf = (p) => NAME_BN[p.id] || p.name;
const save = () => localStorage.setItem(FAV_KEY, JSON.stringify([...favourites]));
const saveTour = () => localStorage.setItem(TOUR_KEY, JSON.stringify(tour));
const getPandal = (id) => PANDALS.find((p) => p.id === id);
const mapsUrl = () => {
  const stops = tour.map(getPandal).filter(Boolean);
  if (!stops.length) return '';
  const last = stops[stops.length - 1];
  const params = new URLSearchParams({ api: '1', destination: `${last.lat},${last.lng}`, travelmode: 'walking' });
  if (stops.length > 1) params.set('waypoints', stops.slice(0, -1).map((p) => `${p.lat},${p.lng}`).join('|'));
  return `https://www.google.com/maps/dir/?${params.toString()}`;
};

function renderPanels() {
  const host = document.getElementById('visitor-tools');
  if (!host) return;
  const favs = [...favourites].map(getPandal).filter(Boolean);
  const stops = tour.map(getPandal).filter(Boolean);
  host.innerHTML = `
    <section class="visitor-panel" aria-labelledby="saved-title">
      <div class="visitor-panel-head"><div><h3 id="saved-title">♥ পছন্দের প্যান্ডেল</h3><p>এই ডিভাইসে সংরক্ষিত · ${favs.length}টি</p></div><button class="mini-action" data-action="clear-favourites" ${favs.length ? '' : 'disabled'}>সব মুছুন</button></div>
      ${favs.length ? `<ul class="saved-list">${favs.map((p) => `<li><span>${escapeHtml(nameOf(p))}<small>${escapeHtml(p.area)}</small></span><button class="mini-action" data-action="remove-favourite" data-id="${p.id}" aria-label="পছন্দ থেকে সরান">✕</button></li>`).join('')}</ul>` : '<p class="visitor-empty">তালিকা থেকে ♥ চাপুন, পরে এখানে পাবেন।</p>'}
    </section>
    <section class="visitor-panel" aria-labelledby="tour-title">
      <div class="visitor-panel-head"><div><h3 id="tour-title">🧭 আমার প্যান্ডেল ট্যুর</h3><p>নিজের ঘোরার ক্রম সাজান · ${stops.length}টি স্টপ</p></div><button class="mini-action" data-action="clear-tour" ${stops.length ? '' : 'disabled'}>রিসেট</button></div>
      ${stops.length ? `<ol class="tour-stops">${stops.map((p, i) => `<li><span class="tour-number">${i + 1}</span><span>${escapeHtml(nameOf(p))}<small>${escapeHtml(p.area)}</small></span><button class="mini-action" data-action="remove-stop" data-id="${p.id}" aria-label="ট্যুর থেকে সরান">✕</button></li>`).join('')}</ol><a class="btn primary tour-link" href="${mapsUrl()}" target="_blank" rel="noreferrer">এই ক্রমে Google Maps রুট খুলুন ↗</a><button class="btn tour-share" data-action="share-tour">ট্যুর শেয়ার করুন</button>` : '<p class="visitor-empty">প্যান্ডেল তালিকার “ট্যুরে যোগ” বোতাম দিয়ে স্টপ যোগ করুন।</p>'}
    </section>`;
}

export const isFavorite = (id) => favourites.has(id);
export function initVisitorFeatures() {
  const list = document.getElementById('list');
  const results = document.getElementById('pandalSearchResults');
  const addButtons = (root) => {
    if (!root) return;
    root.querySelectorAll('[data-pandal-id]').forEach((item) => {
      const id = item.dataset.pandalId;
      if (!id) return;
      const existing = item.querySelector('.feature-actions');
      if (existing) {
        const toggle = existing.querySelector('[data-action="toggle-favourite"]');
        if (toggle) toggle.textContent = isFavorite(id) ? '♥ সংরক্ষিত' : '♡ পছন্দ';
        return;
      }
      const actions = document.createElement('div');
      actions.className = 'feature-actions';
      actions.innerHTML = `<button class="mini-action" data-action="toggle-favourite" data-id="${id}" aria-label="পছন্দের তালিকায় যোগ">${isFavorite(id) ? '♥ সংরক্ষিত' : '♡ পছন্দ'}</button><button class="mini-action" data-action="add-stop" data-id="${id}">＋ ট্যুরে যোগ</button>`;
      item.append(actions);
    });
  };
  const observe = new MutationObserver(() => { addButtons(list); addButtons(results); });
  if (list) observe.observe(list, { childList: true, subtree: true });
  if (results) observe.observe(results, { childList: true, subtree: true });
  addButtons(list); addButtons(results);
  renderPanels();

  document.addEventListener('click', async (event) => {
    const button = event.target.closest('[data-action]');
    if (!button) return;
    const { action, id } = button.dataset;
    if (action === 'toggle-favourite' || action === 'remove-favourite') {
      if (favourites.has(id)) favourites.delete(id); else favourites.add(id);
      save();
      document.querySelectorAll(`[data-action="toggle-favourite"][data-id="${id}"]`).forEach((el) => { el.textContent = isFavorite(id) ? '♥ সংরক্ষিত' : '♡ পছন্দ'; });
      renderPanels();
    } else if (action === 'clear-favourites') {
      favourites.clear(); save(); renderPanels();
      document.querySelectorAll('[data-action="toggle-favourite"]').forEach((el) => { el.textContent = '♡ পছন্দ'; });
    } else if (action === 'add-stop') {
      if (!tour.includes(id)) tour.push(id);
      saveTour(); renderPanels();
      button.textContent = '✓ যোগ হয়েছে';
    } else if (action === 'remove-stop') {
      tour = tour.filter((item) => item !== id); saveTour(); renderPanels();
    } else if (action === 'clear-tour') {
      tour = []; saveTour(); renderPanels();
    } else if (action === 'share-tour') {
      const text = tour.map((item, i) => `${i + 1}. ${nameOf(getPandal(item))}`).join('\n') + `\n\nরুট: ${mapsUrl()}`;
      if (navigator.share) { try { await navigator.share({ title: 'আমার প্যান্ডেল ট্যুর', text }); } catch {} }
      else if (navigator.clipboard?.writeText) { await navigator.clipboard.writeText(text); button.textContent = 'কপি হয়েছে ✓'; }
    }
  });
}
