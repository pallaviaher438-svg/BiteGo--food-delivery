# Project Context: BiteGo Food Delivery Platform

## High-Level Summary
BiteGo is a multi-role, hyper-local food delivery platform tailored for Indian urban and semi-urban markets (currently localized for Nashik, Maharashtra). It connects Customers, Restaurant Partners, Delivery Riders, and Platform Administrators in a unified, real-time ecosystem.

## Target User Roles
1. **Customer (`customer`)**: Discover restaurants, browse menus, manage cart, apply coupons, place orders (UPI/Card/NetBanking/COD), track orders live with GPS simulation, write reviews, manage delivery addresses.
2. **Restaurant Partner (`restaurant`)**: Manage restaurant profile, toggle operational status (Open/Closed), Kitchen Display System (KDS) for live incoming orders, prep time buffers, accept/reject orders, full menu CRUD and item stock availability.
3. **Delivery Partner (`delivery`)**: On-duty toggle, nearby delivery requests, live navigation steps (Pickup -> En Route -> Delivery), delivery checklist, secure customer OTP verification, earnings ledger, surge zone analytics, instant payout requests.
4. **Platform Administrator (`admin`)**: System-wide GMV & commission reporting, order monitoring & overrides, restaurant onboarding & catalog controls, rider fleet monitoring, coupon & discount engine, payment gateway channel metrics & transaction logs.

## Technology Stack
- **Backend Core**: Node.js, Express.js, TypeScript
- **Frontend Core**: React 19, TypeScript, Tailwind CSS v4, Motion, Lucide Icons, Vite
- **Database/Persistence**: Modular Repository Layer with Schema Validation & persistent storage abstraction (easily pluggable for MongoDB/PostgreSQL)
- **Authentication Strategy**: Stateless JWT (JSON Web Tokens) with Argon2/bcrypt password hashing, OTP challenge simulation for mobile numbers, role-based claims
- **Authorization Strategy**: Role-Based Access Control (RBAC) middleware + Object-Level Authorization (Tenant/Resource Ownership Verification)
- **API Convention**: RESTful JSON APIs mounted under `/api/v1/`

## Core Modules
- `auth`: Registration, Login (Email & Mobile OTP), Profile, Token Refresh, Role Switcher verification
- `restaurants`: Discovery, Filtering (cuisine, veg/non-veg, rating, distance), Detailed Restaurant & Menu fetch, Status toggle
- `menu`: Category browsing, Dish CRUD, Price updates, Availability toggle
- `orders`: Order calculation engine (taxes, platform fee, coupon discount rules), Order creation, Status state machine (`confirmed` -> `preparing` -> `on_the_way` -> `delivered` / `cancelled`), Reorder, History
- `delivery`: Nearby task dispatch, Order claim, Stage transitions, Delivery checklist, Customer 4-digit OTP completion, Earnings & Surge hotspots
- `coupons`: Promo code engine (Percentage, Flat, Min Order, Max Discount limits), Coupon CRUD
- `reviews`: Order rating and feedback submission
- `addresses`: User delivery address book (Home/Work/Other, default address flag)
- `admin`: Fleet tracking, GMV metrics, Commission calculations (18%), Payment channel breakdowns, System audit ledger

## Current Status & Constraints
- Frontend contains rich, high-fidelity UI views for all 4 roles.
- Backend is being structured as a clean, production-ready, modular TypeScript/Express service with strict validation, centralized error handling, and complete API contracts matching the frontend expectations.
