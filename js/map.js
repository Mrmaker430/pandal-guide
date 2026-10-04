// js/map.js
import { PANDALS } from './data.js';
import { NAME_BN } from './names-bn.js';

const displayName = (p) => NAME_BN[p.id] || p.name;

export const map = L.map('map', {
  zoomControl: true,
  attributionControl: true,
}).setView([22.867, 88.367], 13);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  maxZoom: 19,
  attribution: '&copy; OpenStreetMap',
}).addTo(map);

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

export const markers = {};
let onSelectHandler = () => {};
export const setOnSelect = (fn) => { onSelectHandler = fn; };

PANDALS.forEach((p) => {
  const m = L.marker([p.lat, p.lng], { icon: pandalIcon })
    .addTo(map)
    .bindPopup(
      `<strong>${displayName(p)}</strong>${p.address}${p.timings ? `<br><small style="color:#8A7868">${p.timings}</small>` : ''}`
    );
  m.on('click', () => onSelectHandler(p));
  markers[p.id] = m;
});

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
