// Shared application state + tiny helpers used everywhere.
export const state = {
  user: null,        // { lat, lng } from geolocation
  start: null,       // { lat, lng, label } from search
  query: '',         // pandal search text
  area: '',          // selected area filter
  selected: null,    // currently selected pandal object
  route: null,       // { km, min, real } once computed
};

// DOM helper
export const $ = (id) => document.getElementById(id);

// Haversine distance in km
export const haversineKm = (a, b) => {
  const R = 6371;
  const toRad = (d) => (d * Math.PI) / 180;
  const dLat = toRad(b.lat - a.lat);
  const dLng = toRad(b.lng - a.lng);
  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(a.lat)) * Math.cos(toRad(b.lat)) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(h));
};

// Effective origin: explicit start point wins over geolocation
export const origin = () => state.start || state.user;

// Escape user data before injecting into HTML
export const escapeHtml = (s) =>
  String(s).replace(/[&<>"']/g, (c) =>
    ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c])
  );
