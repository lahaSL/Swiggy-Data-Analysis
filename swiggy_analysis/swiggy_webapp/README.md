# Swiggy Restaurant Analytics — Interactive Web Dashboard

Live, interactive React dashboard for the Swiggy Restaurant Data Analysis project — filter by city, cuisine, price category, and minimum rating to explore 2,000 restaurants and 12,000 orders in real time.

## Tech Stack
- **React 18** + **Vite** — fast static build, zero backend
- **Recharts** — bar, pie, scatter, line charts
- Data baked in as static JSON (no API calls, no database) — works entirely client-side

## Features
- 5 live filters: City, Price Category, Cuisine, Minimum Rating slider
- 5 KPI stat cards that update instantly with filters
- 6 interactive charts: top cities, top cuisines, price split, cost-vs-rating scatter, monthly GMV trend, most-voted restaurants leaderboard
- Fully responsive layout

## Run Locally
```bash
npm install
npm run dev
```
Visit `http://localhost:5173`

## Deploy to Vercel

### Option A — Vercel CLI
```bash
npm install -g vercel
vercel
```
Follow the prompts — Vercel auto-detects the Vite framework from `vercel.json`.

### Option B — GitHub + Vercel Dashboard
1. Push this folder to a GitHub repository
2. Go to [vercel.com/new](https://vercel.com/new)
3. Import the repository
4. Vercel auto-detects Vite — click **Deploy**
5. Live in ~60 seconds

## Project Structure
```
swiggy_webapp/
├── src/
│   ├── App.jsx                  # Main dashboard logic + chart definitions
│   ├── main.jsx                 # React entry point
│   ├── index.css                # Global dark theme styles
│   ├── restaurants.json         # 2,000 restaurant records
│   ├── orders.json               # 3,000 sampled order records
│   └── components/
│       ├── StatCard.jsx
│       ├── FilterBar.jsx
│       └── TopList.jsx
├── index.html
├── vite.config.js
├── vercel.json
└── package.json
```

## Author
**Sharat Laha** | M.Tech in Data Science & Analytics, LPU
[LinkedIn](https://linkedin.com/in/sharatlaha) | [GitHub](https://github.com/sololevellingg/Files-v1)
