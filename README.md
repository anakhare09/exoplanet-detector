# Exoplanet Detector

A Next.js app that runs a real convolutional neural network — trained on
NASA Kepler light curves — entirely in the browser. Pick a star from the
bundled catalog and watch the model judge whether it hosts a transiting
planet, or look up any confirmed exoplanet's real dossier from NASA's
Exoplanet Archive.

## How it works

- `cnn_exoplanets.keras` (the model you supplied) had no accompanying app —
  only the model, a requirements.txt, and a sample data file. This app was
  built from scratch around it.
- The model is tiny (≈11k parameters), so instead of running a Python/
  TensorFlow backend (which is heavy for Vercel's serverless limits), its
  weights were extracted to `lib/weights.json` and re-implemented as a
  plain-JS forward pass in `lib/model.js`. This was checked against the
  original Keras model on all 570 bundled samples: **0 label mismatches**.
  Every prediction you see is computed live in the visitor's browser — no
  server, no cold starts.
- The 570 sample light curves live as static JSON under `public/data/` —
  one lightweight `catalog.json` plus one file per star, fetched on demand.
- "Explore Known Worlds" calls `app/api/planet/route.js`, a small serverless
  function that proxies NASA's public Exoplanet Archive TAP service for
  real, live confirmed-planet data. **Note:** I built this against NASA's
  documented TAP query format but couldn't make a live network call to
  verify it from my sandbox (the domain isn't reachable there) — test it
  once after deploying, in case the query needs a small tweak.

## Deploy: GitHub → Vercel

1. **Push this folder to a new GitHub repo:**
   ```bash
   cd exoplanet-detector
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/<your-username>/<repo-name>.git
   git push -u origin main
   ```

2. **Import it on Vercel:**
   - Go to https://vercel.com/new
   - Select "Import Git Repository" and choose your new repo
   - Framework preset should auto-detect as **Next.js** — leave build
     settings as default (`npm run build`, output handled automatically)
   - Click **Deploy**

That's it — no environment variables or extra config needed. Vercel will
give you a live `.vercel.app` URL a minute or two later.

## Local development

```bash
npm install
npm run dev
```

Then open http://localhost:3000.

## Project structure

```
app/
  page.js              — main page (catalog, chart, gauge, info cards)
  layout.js            — root layout, theme bootstrap
  globals.css          — design tokens (colors, type, spacing)
  api/planet/route.js  — NASA Exoplanet Archive proxy
components/            — StarCatalog, LightCurveChart, ConfidenceGauge,
                          InfoCard, KnownWorlds, FunFacts, ThemeToggle
lib/
  model.js             — pure-JS forward pass for the CNN
  weights.json          — the trained model's weights, extracted from
                          cnn_exoplanets.keras
public/data/
  catalog.json         — lightweight list of all 570 sample stars
  stars/<id>.json       — each star's light curve + label
```
