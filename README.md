# 🌍 NASA EONET Incident Explorer

An interactive incident explorer for real-time natural events, powered by NASA’s EONET API. Visualize global activity on a map, track event progression, and analyze user interactions. All in a fast, mobile-first Nuxt 4 app.

## 🚀 Features

### Core Functionality

- 🌐 **Map View** – Visualize incidents geographically using Leaflet
- 📋 **List View** – Browse all incidents with key details
- 🔍 **Filtering** – Filter incidents by category
- 🔄 **Sorting** – Sort by most recent or oldest
- 📄 **Incident Details** – View full details in a modal

### Map Visualization

- 📍 All geometry points displayed for each incident
- 🔗 Multi-point incidents connected visually to show progression
- 🎯 Selected incident highlighted (color + size change)
- 🖱️ Click interaction opens unified modal (no conflicting popups)

### Data Handling

- ⏳ Loading states during data fetch
- ❌ Error handling (API rate limiting, high demand)
- 🧪 Demo data fallback when live API unavailable
- 🔁 Switch between demo and live data

### Analytics

- 📊 Track most clicked incidents
- 💾 Persistent storage via localStorage
- 🏆 Top 5 most clicked incidents
- ♻️ Reset analytics
- 🪟 Dedicated modal for better UX

### UX & Responsiveness

- 📱 Mobile-first responsive design
- 🧭 Compact mobile toolbar with collapsible filters
- 🪟 Modal-based UI for details and analytics
- 🗺️ Clean map interaction without overlapping elements

## 🛠️ Tech Stack

- **Nuxt 4** (Vue 3)
- **TypeScript**
- **Tailwind CSS**
- **Leaflet** (@nuxtjs/leaflet)
- **Composition API**

## 📦 Installation & Setup

```bash
npm install
npm run dev
```

App available at `http://localhost:3000`

## 📡 Data Source

NASA EONET API (v3): https://eonet.gsfc.nasa.gov/api/v3/events

## 🧠 Key Implementation Decisions

### Geometry Handling

- Displays all geometry points per incident
- Connects multi-point sequences with lines to show progression
- Maintains consistent interaction via unified incident modal

### Map Interaction

- Removed Leaflet popups to avoid UI conflicts
- Click → opens application modal for consistent UX
- Better mobile experience with modal-based interactions

### Analytics Design

- Local storage using localStorage
- Resets when switching data sources to avoid stale results
- Decoupled from filtering/sorting logic

### Responsive Strategy

- Desktop: full toolbar visible
- Mobile: collapsible filter panel + analytics button
- Modals reduce vertical scrolling needs

## ⚠️ Known Limitations

- NASA API may return 503 responses during high demand
- Analytics are local only (not persisted across devices)
- No search functionality (filter + sort only)
- Large datasets rely on scrolling instead of pagination

## 🔮 Possible Improvements

- 🔍 Add search functionality
- 📄 Pagination or virtualized list
- 📌 Enhanced map highlighting/animation
- 🌐 Backend-powered analytics
- 🗺️ Marker clustering for dense areas

## 👨‍💻 Summary

This project focuses on clean separation of logic and UI, resilient data handling, strong UX decisions (modals, mobile-first), and clear visualization of real-world data.
