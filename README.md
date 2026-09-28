<div align="center">

# 🪔 Pandal Hopper Guide

### A festive, zero-backend map of 140+ Jagadhatri Puja pandals across Chandannagar, Mankundu, Bhadreswar, Kolkata & Krishnanagar.

[![Live Site](https://img.shields.io/badge/Live-pandalhopping.netlify.app-C41E28?style=for-the-badge&logo=netlify&logoColor=white)](https://pandalhopping.netlify.app/)
[![Made with Love](https://img.shields.io/badge/Made%20with-🪔%20in%20Chandannagar-E8A61C?style=for-the-badge)](#)
[![No Backend](https://img.shields.io/badge/Backend-None-F5C542?style=for-the-badge)](#)
[![License](https://img.shields.io/badge/License-MIT-8B1520?style=for-the-badge)](#license)

<img src="https://pandalhopping.netlify.app/og-preview.png" alt="Pandal Hopper Guide preview" width="720" />

</div>

---

## 🌟 What is this?

Every year, during **Jagadhatri Puja**, thousands of pandal hoppers wander the streets of Chandannagar, Mankundu, Bhadreswar, Kolkata and Krishnanagar trying to find the next big pandal. Google Maps helps with roads, but not with **"which pandal is closest to me right now?"**

**Pandal Hopper Guide** answers that question in one tap.

- 🗺️ Interactive map with 140+ pandal markers
- 🔍 Search by pandal name, area, or theme
- 🎯 Filter by area with live counts
- 📍 "Use my location" — sorts everything by distance
- 🚗 Turn-by-turn routing with distance and time
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
    ├── data.js             # 🪔 All 140+ pandals (single source of truth)
    ├── state.js            # Shared state + helpers (haversine, escapeHtml)
    ├── map.js              # Leaflet init, marker icons, route layers
    ├── ui.js               # Renders chips, list, detail card
    ├── actions.js          # Selection, routing, geolocation
    ├── search.js           # Nominatim autocomplete + pandal filter
    ├── drawer.js           # Hamburger profile drawer
    └── main.js             # Boots everything
```

**Why this structure?** Every file has **one job**. If you want to change a colour, edit `css/styles.css`. If you want to add a pandal, edit `js/data.js`. Nothing else needs to move.

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

If OSRM is unavailable, the app **gracefully falls back** to a straight-line distance calculation using the Haversine formula multiplied by a 1.3× road factor — so the feature never breaks.

### 🔎 Start-Point Search
Type any Indian address and get live suggestions via **Nominatim** (OpenStreetMap's free geocoder). Results are cached for the session to respect Nominatim's 1 req/sec policy.

### 📱 Mobile
Everything is a single stacked column. When you tap a pandal from the list, the map auto-scrolls into view. No bottom sheet, no separate mobile layout to maintain.

### ☰ Profile Drawer
The hamburger button in the top-left opens a slide-in drawer with:
- Your avatar + name + role
- Contact links (email, WhatsApp, Instagram, GitHub)
- About this project
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
  id:    "subhaspally",
  name:  "Subhaspally Sarbojanin",
  area:  "Chandannagar",
  address: "Near Chandannagar Station",
  lat:   22.8665,
  lng:   88.3680,
  timings: "10 AM – 10 PM",
  theme:  "Innovative pandal art"
}
```

**Get coordinates:** right-click a location in Google Maps → click the lat/lng at the top → paste both numbers.

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
Pandal coordinates in `js/data.js` are **approximate** and were compiled from public sources. They're accurate enough to see on a map, but if you're launching this for real festival traffic, **verify every coordinate** against Google Maps or a recent Google Street View pass.

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

- **Map data** © [OpenStreetMap](https://www.openstreetmap.org/copyright) contributors
- **Routing** by [OSRM](http://project-osrm.org/)
- **Geocoding** by [Nominatim](https://nominatim.org/)
- **Map library** — [Leaflet](https://leafletjs.com/)
- **Fonts** — [Playfair Display](https://fonts.google.com/specimen/Playfair+Display) + [Inter](https://fonts.google.com/specimen/Inter) via Google Fonts
- **Pandal data** compiled from public and community sources

---

<div align="center">

### 🪔 Made with love in Chandannagar

*May your feet stay cool, your phone battery stay full, and your route always pass the best lighting.*

**[🌐 Visit the live guide →](https://pandalhopping.netlify.app/)**

</div>
