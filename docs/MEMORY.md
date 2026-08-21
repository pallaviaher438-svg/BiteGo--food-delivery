# PROJECT MEMORY

## Current State
- Phase: COMPLETE — Backend fully implemented and verified
- Structure: Monorepo with `frontend/` and `backend/` top-level folders
- Backend: Express + TypeScript, in-memory store, port 5000
- Frontend: React 19 + Vite + Tailwind v4, port 3000

## Project Structure
```
BiteGo--food-delivery/
├── frontend/          ← React app (Vite)
│   ├── src/
│   │   ├── components/
│   │   ├── views/
│   │   ├── context/
│   │   ├── data/
│   │   ├── App.tsx, main.tsx, types.ts, index.css
│   ├── index.html
│   ├── vite.config.ts  (proxy /api → localhost:5000)
│   ├── tsconfig.json
│   └── package.json
├── backend/           ← Express API
│   ├── config/        env.ts, logger.ts
│   ├── controllers/   auth, restaurant, coupon, address, order, delivery, admin
│   ├── data/          store.ts (in-memory + seed)
│   ├── middlewares/   auth, error, security, validate
│   ├── routes/        all route files
│   ├── services/      all service files
│   ├── types/         index.ts
│   ├── utils/         AppError, authUtils, response
│   ├── app.ts, server.ts
│   ├── package.json
│   └── tsconfig.json
├── docs/
├── package.json       ← root workspace orchestrator
└── node_modules/      ← hoisted (npm workspaces)
```

## Completed
- All backend services: auth, restaurant, coupon, address, order, delivery, admin
- All controllers, routes, middleware (auth, RBAC, rate-limit, CORS, validation, error)
- In-memory store with full seed data (5 restaurants, 4 orders, 4 riders, 3 coupons)
- Business rules BR-001→BR-007 fully enforced server-side
- JWT auth (HMAC SHA-256), PBKDF2 password hashing (no external crypto deps)
- frontend/ and backend/ separation with correct configs

## How to Run
```
# Backend (from project root)
node node_modules/tsx/dist/cli.cjs server.ts   ← run from backend/

# Or via npm workspace scripts (from root):
npm run backend   → starts backend dev server
npm run frontend  → starts frontend dev server
```

## Verified Working
- GET  /health → 200
- GET  /api/v1/restaurants → 200, 5 restaurants
- POST /api/v1/auth/login (admin@bitego.com / Admin123!) → 200, JWT
- GET  /api/v1/admin/metrics (with token) → 200
- POST /api/v1/coupons/validate BITE50 on ₹500 → discount=100, final=400
- Unauthenticated /admin/metrics → 401 blocked
- Unknown route → 404 JSON

## Seed Credentials
| Role       | Email                    | Password        |
|------------|--------------------------|-----------------|
| admin      | admin@bitego.com         | Admin123!       |
| customer   | rahul.nashik@bitego.com  | Customer123!    |
| restaurant | restaurant@bitego.com    | Restaurant123!  |
| delivery   | delivery@bitego.com      | Delivery123!    |

OTP demo bypass: any phone → OTP `4220` or `1234`
Delivery completion OTP: `4220`

## Important Decisions
- DEC-003: In-memory repository (pluggable for MongoDB/PostgreSQL)
- DEC-004: Server-side price calculation (never trust client totals)
- DEC-005: 4-digit OTP for delivery completion
- No external jwt/bcrypt deps — uses Node.js built-in `crypto`
- npm workspaces for monorepo (node_modules hoisted to root)

## Important Constraints
- PowerShell execution policy blocks .ps1/.cmd scripts — run tsx via `node .../cli.cjs`
- node_modules hoisted to root by npm workspaces
- Indian market: ₹ currency, +91 phone format, 5% GST
- Frontend proxy: vite.config.ts proxies /api → localhost:5000

## Known Issues
- None

## Next Actions
- Connect frontend API calls to backend (replace mockData usage with fetch calls)
- Add .env file to backend/ with actual secrets for production
- Consider MongoDB/PostgreSQL migration when needed

## Important Files
- `backend/server.ts` — entry point
- `backend/app.ts` — Express app setup
- `backend/data/store.ts` — in-memory store + seed data
- `backend/services/orderService.ts` — order placement + business rules
- `backend/services/couponService.ts` — pricing calculation engine
- `frontend/vite.config.ts` — API proxy config
- `docs/API_CONTRACT.md` — REST API specifications
- `docs/BUSINESS_RULES.md` — pricing, coupons, state machine
