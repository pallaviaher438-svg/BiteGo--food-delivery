# BiteGo Backend Implementation Task Tracker

## Phase 1: Environment & Base Infrastructure
- [x] Documentation & Context System (`/docs/*`)
- [ ] Backend Configuration (`src/backend/config/env.ts`, `logger.ts`)
- [ ] Centralized Error Classes & Error Middleware (`src/backend/middlewares/errorMiddleware.ts`, `AppError.ts`)
- [ ] Security Middleware Stack (Helmet, CORS, Rate Limiting)
- [ ] Standardized Response Formatter (`src/backend/utils/response.ts`)

## Phase 2: Domain Models & Repositories
- [ ] Data Schemas & TypeScript Entities (`src/backend/models/*`)
- [ ] Seed Data Initializer matching Nashik dataset (`src/backend/data/seedData.ts`)
- [ ] Repository Abstraction & In-Memory / File Persistent Store (`src/backend/repositories/*`):
  - [ ] User Repository
  - [ ] Restaurant Repository
  - [ ] Menu Item Repository
  - [ ] Order Repository
  - [ ] Coupon Repository
  - [ ] Address Repository
  - [ ] Rider & Fleet Repository
  - [ ] Payment & Ledger Repository

## Phase 3: Business Logic Services
- [ ] Auth & User Service (JWT token creation, password verification, OTP generator & validator)
- [ ] Address Service (CRUD, default address rules)
- [ ] Restaurant & Menu Service (search, filter, category aggregation, open/close status, dish management)
- [ ] Coupon & Promotion Service (code validation, discount boundaries, minOrder verification)
- [ ] Order & Pricing Engine Service (item total recalculation, 5% GST, delivery fee computation, order state machine)
- [ ] Delivery Rider Service (nearby task dispatch, stage transitions, OTP completion verification, earnings calculations)
- [ ] Admin & Analytics Service (GMV calculation, 18% commission, fleet monitoring, payment breakdown)

## Phase 4: Validation & Controllers
- [ ] Input Validation Schemas (`src/backend/validators/*`)
- [ ] Auth & User Controller (`src/backend/controllers/authController.ts`, `userController.ts`)
- [ ] Address Controller (`src/backend/controllers/addressController.ts`)
- [ ] Restaurant & Menu Controller (`src/backend/controllers/restaurantController.ts`)
- [ ] Coupon Controller (`src/backend/controllers/couponController.ts`)
- [ ] Order Controller (`src/backend/controllers/orderController.ts`)
- [ ] Delivery Controller (`src/backend/controllers/deliveryController.ts`)
- [ ] Admin Controller (`src/backend/controllers/adminController.ts`)

## Phase 5: Routes & Express App Integration
- [ ] Route definitions under `/api/v1/*` (`src/backend/routes/*`)
- [ ] Express App & Server Bootstrap (`src/backend/app.ts`, `src/backend/server.ts`)
- [ ] Health check route (`GET /api/v1/health`)
- [ ] Frontend API Client Adapter / Proxy setup in Vite for unified execution

## Phase 6: Verification, Testing & Polish
- [ ] Automated integration tests for all core modules (Auth, Pricing, Orders, Delivery OTP, Admin)
- [ ] End-to-end verification of all 4 role portals
- [ ] Documentation update and completion
