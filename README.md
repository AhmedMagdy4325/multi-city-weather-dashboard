# Multi-City Weather Dashboard

A React weather app that lets you search any town, save favourites, track your most-visited cities, and browse a 30-day search history — all persisted locally, no backend required.

**Live demo →** [multi-city-weather-dashboard.vercel.app](https://multi-city-weather-dashboard.vercel.app/)

## Features

- Search any city worldwide and get current conditions plus an hourly (next 24h) or 7-day forecast
- Favourite cities for quick access from the home screen
- Automatic "Most Visited" ranking based on how often you check a city
- 30-day search history with relative timestamps ("2h ago", "3d ago")
- Everything persists across reloads via `localStorage`
- Responsive layout, built mobile-first with Tailwind CSS

## Tech stack

- **React** (Vite) — component structure, hooks
- **React Router** — client-side routing (`/`, `/city/:cityId`, `/history`)
- **Context API + `useReducer`** — centralized app state, no external state library
- **Tailwind CSS** — styling
- **[Open-Meteo](https://open-meteo.com/)** — free weather + geocoding API, no key required

## Architecture notes

State lives in one `WeatherContext`, backed by a single reducer with actions for fetch lifecycle (`fetch/start`, `fetch/success`, `fetch/error`), city updates (`favorite/toggled`, `city/visited`), and persistence (`cities/loaded`, `visits/loaded`). Cities are stored once, deduplicated by an ID derived from rounded coordinates — favourites, most-visited, and history are all just different filters/sorts over that same array, plus a separate append-only `visits` log for the history timeline.

## Running locally

```bash
git clone <this-repo-url>
cd <repo-folder>
npm install
npm run dev
```

## What I'd add next

- Migrate state management to Redux (in progress on the next project)
- Unit tests (Jest) and a couple of end-to-end flows (Cypress)
- Unit toggle (°C/°F)
- Better handling for ambiguous city name matches (currently takes the first geocoding result)
