# AgriWasteX — Farm Waste Exchange Platform

Full-stack marketplace for agricultural waste: farmers sell crop residue, banana stems, coconut shells, sugarcane waste, rice husk, and animal manure to mushroom farms, biofuel companies, compost manufacturers, paper industries, and dairy farms.

## Theme

**White · Black · Green** — white background, Inter (sans) body type, **Instrument Serif** headings.

## Stack

- **Next.js 16** (App Router) · **React 19** · **TypeScript** · **Tailwind CSS 4**
- **Neon Postgres** via **Drizzle ORM**
- **Better Auth** (email/password)
- **Groq** LLM for AI price prediction (with linear-regression fallback)
- Logistic-style waste **grading** (A/B/C)

## Features

| Feature | Route | Backend |
|--------|--------|---------|
| Landing | `/` | Static catalog |
| Live marketplace | `/marketplace` | `GET /api/listings` |
| Nearby buyers | `/buyers` | `GET /api/buyers` |
| AI price prediction | `/price-predict` | `POST /api/price-predict` (Groq) |
| List waste + estimate | `/sell` | `POST /api/estimate`, `POST /api/listings` |
| Transport booking | `/transport` | `POST /api/transport` |
| Analytics + payments | `/dashboard` | `GET /api/dashboard` |
| Auth | `/login`, `/register` | `/api/auth/*` |

## Environment

Copy `.env.example` → `.env` (or use the provided Neon / Groq keys):

```bash
DATABASE_URL=          # Neon connection string
GROQ_API_KEY=          # Groq API key
BETTER_AUTH_SECRET=    # ≥32 characters
BETTER_AUTH_URL=http://localhost:3000
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## Setup

```bash
npm install
npm run db:push      # create tables on Neon
npm run db:seed      # seed listings, buyers, transactions
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

```bash
npm run build
npm run start
```

## Project structure

```
src/
  app/                 # pages + API routes
  app/api/             # listings, buyers, transport, price-predict, dashboard, auth
  components/          # Navbar, Footer, UI
  data/mock.ts         # static catalog (waste types, features, stats)
  db/                  # Drizzle schema, client, seed
  lib/                 # auth, AI, types
```
