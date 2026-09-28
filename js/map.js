import { PANDALS } from './data.js';
import { state } from './state.js';

// ─── Map init ───
export const map = L.map('map', {
  zoomControl: true,
  attributionControl: true,
}).setView([22.867, 88.367], 13);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  maxZoom: 19,
  attribution: '&copy; OpenStreetMap',
}).addTo(map);

// ─── Icons ───
export const pandalIcon = L.divIcon({
  className: '',
  html: '<div class="marker-pin"></div>',
  iconSize: [16, 16],
  iconAnchor: [8, 8],
});

export const selectedIcon = L.divIcon({
  className: '',
  html: '<div class="marker-pin selected"></div>',
  iconSize: [22, 22],
  iconAnchor: [11, 11],
});

export const userIcon = L.divIcon({
  className: '',
  html: '<div class="user-marker"></div>',
  iconSize: [18, 18],
  iconAnchor: [9, 9],
});

export const startIcon = L.divIcon({
  className: '',
  html: '<div class="start-marker"></div>',
  iconSize: [16, 16],
  iconAnchor: [8, 8],
});

// ─── Markers ───
// Export `markers` map so actions.js and ui.js can reference them.
export const markers = {};

// onSelect will be set by main.js to avoid a circular import.
let onSelectHandler = (p) => {};
export const setOnSelect = (fn) => { onSelectHandler = fn; };

PANDALS.forEach((p) => {
  const m = L.marker([p.lat, p.lng], { icon: pandalIcon })
    .addTo(map)
    .bindPopup(
      `<strong>${p.name}</strong>${p.address}<br><small style="color:#8A7868">${p.timings}</small>`
    );
  m.on('click', () => onSelectHandler(p));
  markers[p.id] = m;
});

// ─── Mutable map-layer state ───
export const mapState = {
  userMarker: null,
  startMarker: null,
  routeLayers: [],
  selectedMarker: null,
};

export function clearRouteLayers() {
  mapState.routeLayers.forEach((l) => map.removeLayer(l));
  mapState.routeLayers = [];
}

// ─── Restore selection in state (kept in sync from actions.js) ───
export function resetMarkerIcon() {
  if (mapState.selectedMarker && markers[mapState.selectedMarker.pandalId]) {
    markers[mapState.selectedMarker.pandalId].setIcon(pandalIcon);
  }
  mapState.selectedMarker = null;
}

export function selectMarker(pandal) {
  resetMarkerIcon();
  const marker = markers[pandal.id];
  marker.setIcon(selectedIcon);
  marker.pandalId = pandal.id;
  mapState.selectedMarker = marker;
  }
