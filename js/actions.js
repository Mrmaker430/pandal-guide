// js/actions.js
import { PANDALS } from './data.js';
import { state, $, haversineKm, origin } from './state.js';
import {
  map, markers, resetMarkerIcon, selectMarker,
  mapState, clearRouteLayers,
} from './map.js';
import { renderList, renderDetail, renderAll } from './ui.js';

export function clearSelection() {
  state.selected = null;
  state.route = null;
  resetMarkerIcon();
  clearRouteLayers();
  renderAll();
}

export async function select(p) {
  state.selected = p;
  state.route = null;
  selectMarker(p);
  map.flyTo([p.lat, p.lng], 16, { duration: 0.8 });
  markers[p.id].openPopup();

  if (window.innerWidth < 640) {
    document.querySelector('.map-wrap').scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  renderList();
  renderDetail();

  const o = origin();
  if (!o) return;

  try {
    const url = `https://router.project-osrm.org/route/v1/driving/${o.lng},${o.lat};${p.lng},${p.lat}?overview=full&geometries=geojson`;
    const res = await fetch(url);
    const data = await res.json();
    if (!data.routes?.length) throw new Error('no route');

    const r = data.routes[0];
    const geom = r.geometry.coordinates.map(([lng, lat]) => [lat, lng]);

    state.route = {
      km: (r.distance / 1000).toFixed(1),
      min: Math.max(1, Math.round(r.duration / 60)),
      real: true,
    };

    clearRouteLayers();
    mapState.routeLayers = [
      L.polyline(geom, { color: '#FFE8A3', weight: 12, opacity: 0.65 }),
      L.polyline(geom, { color: '#FFFFFF', weight: 9, opacity: 0.95 }),
      L.polyline(geom, { color: '#A8201A', weight: 5, opacity: 1, lineCap: 'round' }),
      L.polyline(geom, { color: '#E8A61C', weight: 2.5, opacity: 0.9, dashArray: '1 10', lineCap: 'round' }),
    ].map((l) => l.addTo(map));

    map.fitBounds(L.latLngBounds(geom), { padding: [80, 80], maxZoom: 16 });
  } catch {
    const km = haversineKm(o, p) * 1.3;
    state.route = {
      km: km.toFixed(1),
      min: Math.max(1, Math.round((km / 22) * 60)),
      real: false,
    };
    clearRouteLayers();
    mapState.routeLayers = [
      L.polyline([[o.lat, o.lng], [p.lat, p.lng]], { color: '#FFFFFF', weight: 6, opacity: 0.9 }).addTo(map),
      L.polyline([[o.lat, o.lng], [p.lat, p.lng]], { color: '#A8201A', weight: 3, dashArray: '8 8', opacity: 0.85 }).addTo(map),
    ];
  }
  renderDetail();
}

export function initGeolocation() {
  const btn = $('useLoc');
  const label = $('useLocText');
  const status = $('locStatus');
  const err = $('locErr');
  const showErr = (msg) => { err.textContent = msg; err.style.display = 'flex'; };
  const hideErr = () => { err.style.display = 'none'; };

  btn.onclick = () => {
    if (!navigator.geolocation) { showErr('এই ব্রাউজারে লোকেশন সাপোর্ট নেই।'); return; }
    btn.disabled = true;
    label.textContent = 'লোকেশন খোঁজা হচ্ছে…';
    hideErr();

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        state.user = { lat: pos.coords.latitude, lng: pos.coords.longitude };
        state.start = null;

        if (mapState.startMarker) { map.removeLayer(mapState.startMarker); mapState.startMarker = null; }
        if (mapState.userMarker) map.removeLayer(mapState.userMarker);

        mapState.userMarker = L.marker([state.user.lat, state.user.lng], {
          icon: L.divIcon({ className: '', html: '<div class="user-marker"></div>', iconSize: [18, 18], iconAnchor: [9, 9] }),
        }).addTo(map).bindPopup('আপনি এখানে');

        map.flyTo([state.user.lat, state.user.lng], 14, { duration: 1 });
        status.style.display = 'flex';
        btn.disabled = false;
        label.textContent = 'লোকেশন রিফ্রেশ করুন';

        if (state.selected) select(state.selected);
        else renderAll();
      },
      (e) => {
        btn.disabled = false;
        label.textContent = 'আমার বর্তমান অবস্থান';
        showErr(e.code === e.PERMISSION_DENIED ? 'লোকেশন অনুমতি দেওয়া হয়নি।' : 'লোকেশন পাওয়া যায়নি।');
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 }
    );
  };
}
