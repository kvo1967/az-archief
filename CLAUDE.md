# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

**Het Archief** — an archival web app displaying AZ Alkmaar football program booklets (1955–present). 1424 matches with images hosted on Cloudflare R2.

## Commands

```bash
pnpm dev        # Dev server at http://localhost:5173 (auto-opens browser)
pnpm build      # Production build → dist/
pnpm preview    # Preview production build at http://localhost:4173
```

Use **pnpm** (not npm or yarn). No test runner or linter is configured.

## Stack

- React 18 + Vite 5, plain JavaScript (JSX) — no TypeScript
- Leaflet / React-Leaflet for the map view
- Vanilla CSS + inline styles — no CSS framework or CSS modules
- Deployed on Vercel; images served from Cloudflare R2

## Environment

`VITE_BOEKJES_URL` — base URL for booklet images (Cloudflare R2 public bucket). Defined in `.env` for local dev; set in `vercel.json` for production. All image URLs are constructed in `src/utils/transform.js:getBoekjePad()`.

## Architecture

### Data flow

1. **Raw data**: `src/data/wedstrijden.json` — 1424 match records with fields: `DatePlayed`, `PlayedAt` (stadium name), `competitie`, `wedstrijd` (match string), `uitslag` (score), `ProgrammaBestanden[]` (image filenames).
2. **Transform**: `src/utils/transform.js` enriches raw records — parses opponent/home-away from the match string, derives the football season (Aug→May cycle), normalises competition names, looks up stadium coordinates, and builds R2 image URLs.
3. **Stadium data**: `src/data/stadions.js` — 60+ stadiums with lat/lon; keyed by the `PlayedAt` value in the raw data.
4. **App state**: `src/App.jsx` holds all filter state (`search`, `seizoen`, `tegenstander`, `competitie`, `view`, `selected`) and passes filtered data down to the active view component.

### Views

| Component | Description |
|---|---|
| `GridView.jsx` | Responsive card grid, 60 items/page with lazy load |
| `ListView.jsx` | Tabular layout, 100 items/page |
| `MapView.jsx` | Leaflet map; marker size scales by match count; fly-to on selection |
| `TimelineView.jsx` | Vertical timeline grouped by season; sticky sidebar with Intersection Observer |
| `BookjeModal.jsx` | Full-screen overlay with paginated image gallery and match metadata |

### Design language

- Color palette: `#8B0000` (AZ dark red), `#F5F1E8` (cream), `#1a0a0a` (near-black)
- Typography: Georgia serif (vintage newspaper aesthetic)
- CSS animations only — no animation library

## Image management scripts (PowerShell)

- `check-boekjes.ps1` — compares local `public/boekjes/` against R2 with parallel HEAD requests; writes missing filenames to `ontbrekende-boekjes.txt`
- `upload-ontbrekend.ps1` — uploads files listed in `ontbrekende-boekjes.txt` to R2 via Wrangler CLI; resumable, tracks state in `upload-state.txt`
- `upload-boekjes.ps1` — full bulk upload to R2

The `public/boekjes/` directory is gitignored (~250 MB of `.webp` images).
