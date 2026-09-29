<div align="center">

# 🪔 Pandal Hopper Guide

### A festive, zero-backend map of **180 Jagadhatri Puja pandals** across Chandannagar & Bhadreswar, West Bengal.

[![Live Site](https://img.shields.io/badge/Live-pandalhopping.netlify.app-C41E28?style=for-the-badge&logo=netlify&logoColor=white)](https://pandalhopping.netlify.app/)
[![Pandals](https://img.shields.io/badge/Pandals-180-E8A61C?style=for-the-badge)](#)
[![Made with Love](https://img.shields.io/badge/Made%20with-🪔%20in%20Chandannagar-F5C542?style=for-the-badge)](#)
[![No Backend](https://img.shields.io/badge/Backend-None-8B1520?style=for-the-badge)](#)
[![License](https://img.shields.io/badge/License-MIT-4A0A12?style=for-the-badge)](#license)

<img src="https://pandalhopping.netlify.app/og-preview.png" alt="Pandal Hopper Guide preview" width="720" />

</div>

---

## 🌟 What is this?

Every year during **Jagadhatri Puja**, lakhs of pandal hoppers wander the streets of Chandannagar, Mankundu, Bhadreswar, and surrounding areas trying to find the next great pandal. Google Maps helps with roads but not with *"which pandal is closest to me right now?"*

**Pandal Hopper Guide** answers that question in one tap.

- 🗺️ Interactive map with **180 verified pandal markers**
- 🔍 Search by pandal name, area, theme, or address
- 🎯 Filter by area with live counts
- 📍 "Use my location" — sorts everything by distance
- 🚗 Turn-by-turn routing with distance and time
- 🎉 Jubilee / Adi Puja / Popular badges on every card
- 📱 Fully responsive — desktop, tablet, mobile
- ✨ Festive maroon-and-gold UI inspired by pandal decorations
- 🚀 **Zero backend** — pure static site, deploys in seconds

---

## 🖼️ Screenshots

| Desktop | Mobile |
|---|---|
| <img src="docs/screenshot-desktop.png" width="500" /> | <img src="docs/screenshot-mobile.png" width="240" /> |

> *(Add your own screenshots to a `docs/` folder and update the paths above.)*

---

## 📊 The Data

| Metric | Count |
|---|---|
| **Total pandals** | **180** |
| Chandannagar | 133 |
| Bhadreswar | 47 |
| **Adi Pujas** (pre-1900) | 7 |
| **Jubilee celebrations** | 15 |
| **Pre-Jubilee celebrations** | 19 |
| **Popular pandals** | 23 |
| Oldest pandal | **Milannagar Sohid Bedi** — est. **1686** (341 years) |
| Second oldest | **Laxmigunj Kaporepotti** — est. 1766 (261 years) |
| Third oldest | **Gourhati Tetultala** — est. 1793 (234 years) |

Each pandal entry includes:

- **`id`** — URL-safe slug (used as map marker ID)
- **`name`** — committee name as listed by CCJPC
- **`area`** — Chandannagar or Bhadreswar
- **`address`** — full postal address with Google Plus Code
- **`lat` / `lng`** — precise coordinates
- **`estd`** — founding year
- **`year`** — how many years the puja has run
- **`theme`** — design theme or classification
- **`jubilee` / `preJubilee` / `adi` / `popular`** — filter flags
- **`tags`** — array of classification tags

---

## 🚀 Quick Start

### Run locally

ES modules require an HTTP server — you can't just open `index.html` from your file manager.

```bash
# Option 1 — Node
npx serve

# Option 2 — Python
python -m http.server 5173

# Option 3 — VS Code Live Server
# Right-click index.html → "Open with Live Server"
```

Then open **http://localhost:5173**.

### Deploy

| Platform | Method | Time |
|---|---|---|
| **Netlify** ⭐ | Drag the folder onto [app.netlify.com/drop](https://app.netlify.com/drop) | 30 sec |
| **GitHub Pages** | Push to a repo, enable Pages in Settings | 2 min |
| **Cloudflare Pages** | Connect repo, no build command | 1 min |
| **Vercel** | `npx vercel` in the folder | 1 min |

No build step. No environment variables. No server.

---

## 📁 Project Structure

```
pandal-guide/
├── index.html              # Markup — header, controls, drawer, map container
├── css/
│   └── styles.css          # All styling, design tokens, responsive rules
└── js/
    ├── data.js             # 🪔 All 180 pandals (single source of truth)
    ├── state.js            # Shared state + helpers (haversine, escapeHtml)
    ├── map.js              # Leaflet init, marker icons, route layers
    ├── ui.js               # Renders chips, list, detail card
    ├── actions.js          # Selection, routing, geolocation
    ├── search.js           # Nominatim autocomplete + pandal filter
    ├── drawer.js           # Hamburger profile drawer
    └── main.js             # Boots everything
```

**Why this structure?** Every file has **one job**. Change a colour → edit `css/styles.css`. Add a pandal → edit `js/data.js`. Nothing else moves.

---

## 🎨 Design System

The palette is pulled straight from a Chandannagar pandal at dusk.

| Token | Hex | Used for |
|---|---|---|
| `--maroon-900` | `#4A0A12` | Header gradient start |
| `--maroon-700` | `#8B1520` | Primary buttons, headings |
| `--crimson` | `#C41E28` | Gradients, active states |
| `--saffron` | `#E8A61C` | Focus rings, route box accents |
| `--gold` | `#F5C542` | Avatar, marker gradient |
| `--cream` | `#FBF5EC` | Page background |
| `--ink` | `#1F1410` | Body text |

**Typography:**
- **Playfair Display** — headings, pandal names, distances (ceremonial serif)
- **Inter** — UI, labels, body (clean sans)

**Motion:**
- Markers scale on hover, pulse when selected
- Detail card slides up on selection
- Drawer slides in from the left with a soft backdrop blur
- Route polylines use a 4-layer stack: gold haze → white casing → maroon core → dashed gold accent

---

## 🗺️ Features in Detail

### 🔍 Search
Debounced 200 ms. Matches against name, area, address, and theme. Case-insensitive, multi-term (splits on whitespace).

### 📍 Use My Location
Browser Geolocation API. Sorts the entire pandal list by distance from you, draws a pulsing blue dot on the map, and re-routes the currently selected pandal from your position.

### 🚗 Routing
Routing uses the **OSRM demo server** (free, CORS-enabled, no API key). The polyline follows actual roads.

If OSRM is unavailable, the app **gracefully falls back** to a straight-line distance estimate (Haversine × 1.3 road factor), so the feature never breaks.

### 🔎 Start-Point Search
Type any Indian address and get live suggestions via **Nominatim** (OpenStreetMap's free geocoder). Results are cached for the session to respect Nominatim's 1 req/sec policy.

### 🎉 Special Pandal Filters
New in the 180-pandal dataset:

- **Jubilee pandals** — celebrating a milestone anniversary this year (Silver, Golden, Diamond, Platinum)
- **Pre-Jubilee pandals** — one year away from a milestone
- **Adi Pujas** — historic pujas established before 1900
- **Popular pandals** — the community's most-visited committees

### 📱 Mobile
Single stacked column. Tapping a pandal from the list auto-scrolls the map into view. No separate mobile layout to maintain.

### ☰ Profile Drawer
The hamburger button in the top-left opens a slide-in drawer with:
- Your avatar + name + role
- Contact links (email, WhatsApp, Instagram, GitHub)
- About this project
- **Data attribution** (see below)
- Credits

Edit **`index.html`** → `<aside class="drawer">` to customise.

---

## 🛠️ Tech Stack

| Layer | Tech | Why |
|---|---|---|
| **Markup** | HTML5, ES modules | No build tooling |
| **Styling** | Vanilla CSS with custom properties | Zero dependencies, fast |
| **Map** | [Leaflet 1.9](https://leafletjs.com/) via CDN | 42 KB, battle-tested |
| **Tiles** | [OpenStreetMap](https://www.openstreetmap.org/) | Free, no API key |
| **Routing** | [OSRM](http://project-osrm.org/) demo server | Free, CORS-enabled |
| **Geocoding** | [Nominatim](https://nominatim.org/) | Free, well-documented |
| **Geolocation** | Browser API | Built-in |

**Total page weight:** ~180 KB before tiles. Loads in under a second on 4G.

---

## ✏️ Customising

### Add or edit a pandal

Open `js/data.js`. Each pandal is one line:

```js
{
  id: "subhaspally",
  name: "Subhaspally Sarbojanin",
  area: "Bhadreswar",
  address: "V993+HFW, Uttarpara, Khalisani, West Bengal 712136",
  lat: 22.8690563,
  lng: 88.3537835,
  estd: 1969,
  year: 58,
  theme: "Traditional",
  jubilee: false,
  preJubilee: false,
  adi: false,
  popular: false,
  tags: []
}
```

**Get coordinates:** right-click a location in Google Maps → click the lat/lng at the top → paste both numbers.

### Add a special filter (jubilee / Adi / popular)

In your sidebar component:

```jsx
const [special, setSpecial] = useState('all'); // 'all' | 'jubilee' | 'preJubilee' | 'adi' | 'popular'

const visible = pandals.filter((p) => {
  if (special === 'jubilee') return p.jubilee;
  if (special === 'preJubilee') return p.preJubilee;
  if (special === 'adi') return p.adi;
  if (special === 'popular') return p.popular;
  return true;
});
```

### Change your profile details

Edit `<aside class="drawer">` inside `index.html`:

| What | Where |
|---|---|
| Initials | `<div class="avatar">YN</div>` |
| Name | `<h2 class="drawer-name">…</h2>` |
| Role | `<p class="drawer-role">…</p>` |
| Email | `mailto:you@example.com` + the display text |
| WhatsApp | `https://wa.me/919999999999` + display text |
| Instagram | `https://instagram.com/yourhandle` |
| GitHub | `https://github.com/yourhandle` |

### Change colours

All in `css/styles.css` → `:root { … }`. Change `--maroon-700` and every primary button, heading, and chip updates at once.

---

## 📜 Data Attribution

**Pandal data source:** [**Jagadhatri Online**](https://www.jagadhatrionline.co.in/puja-committee-list) — Chandannagar's leading Jagadhatri Puja portal since 2016.

The committee list, coordinates, established years, and jubilee classifications in `js/data.js` were compiled from their public directory. If you use this dataset, please retain the attribution line in your app's profile drawer and this README.

---

## ⚠️ Notes & Constraints

### Nominatim Policy
The public Nominatim server has a **1 request/second limit** and forbids bulk geocoding. This app:
- Sends only 5 results per query
- Restricts searches to India (`countrycodes=in`)
- Caches per-session
- Includes a contact `email` parameter (required by their policy)

For very high traffic, self-host Nominatim or switch to Mapbox / LocationIQ / Geoapify.

### OSRM Demo Server
Also fair-use. If it ever goes down, the routing gracefully falls back to a Haversine-based distance estimate with a dashed line — the app never crashes.

### Coordinate Accuracy
Coordinates in `js/data.js` come directly from the Jagadhatri Online directory, which uses Google Plus Codes for accuracy. They should place markers within a few metres of the actual pandal.

---

## 🤝 Contributing

Found a pandal that's missing? A coordinate that's off? A theme that changed this year?

1. Fork the repo
2. Edit `js/data.js` (or `css/styles.css`, or wherever the fix belongs)
3. Open a pull request with a short description

If you're only fixing data, one-line PRs are welcome.

---

## 📜 License

MIT — use it, fork it, host it, print it on a t-shirt. Just don't blame me if the coordinates lead you to a wrong lane during rush hour.

---

## 🙏 Credits

- **Pandal data** — [Jagadhatri Online](https://www.jagadhatrionline.co.in/puja-committee-list) (Chandannagar's #1 Jagadhatri Puja portal)
- **Map data** © [OpenStreetMap](https://www.openstreetmap.org/copyright) contributors
- **Routing** by [OSRM](http://project-osrm.org/)
- **Geocoding** by [Nominatim](https://nominatim.org/)
- **Map library** — [Leaflet](https://leafletjs.com/)
- **Fonts** — [Playfair Display](https://fonts.google.com/specimen/Playfair+Display) + [Inter](https://fonts.google.com/specimen/Inter) via Google Fonts

---

<div align="center">

### 🪔 Made with love in Chandannagar

*May your feet stay cool, your phone battery stay full, and your route always pass the best lighting.*

**[🌐 Visit the live guide →](https://pandalhopping.netlify.app/)**

</div>
