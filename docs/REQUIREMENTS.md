# Backend Requirements Specification

| ID | Description | Source | Priority | Backend Impact | Status |
|---|---|---|---|---|---|
| **REQ-001** | User authentication with Email/Password and Indian Phone OTP verification | AuthView & PRD | High | Auth APIs (`/api/v1/auth/*`), JWT issuing, User schema | In Progress |
| **REQ-002** | User profile management & Gold Membership attributes | ProfileView | Medium | Profile APIs (`/api/v1/users/profile`), User Repository | In Progress |
| **REQ-003** | Multi-role authorization (`customer`, `restaurant`, `delivery`, `admin`) | RoleSwitcher & Views | High | RBAC middleware (`authenticate`, `authorizeRoles`) | In Progress |
| **REQ-004** | User delivery address book (add, edit, delete, set default) | DeliveryAddressModal | Medium | Address APIs (`/api/v1/addresses/*`), Address Repository | In Progress |
| **REQ-005** | Restaurant discovery, search, and category filtering | HomeView, SearchView | High | Restaurant APIs (`/api/v1/restaurants/*`), Search & Filter service | In Progress |
| **REQ-006** | Restaurant details with full category-wise menus | RestaurantView | High | Restaurant & Menu APIs (`/api/v1/restaurants/:id`) | In Progress |
| **REQ-007** | Restaurant catalog and operational state management (Open/Close toggle, Dish CRUD) | RestaurantPortalView, AdminPortalView | High | Menu & Restaurant Management APIs (`/api/v1/restaurants/:id/menu`) | In Progress |
| **REQ-008** | Promo code & coupon discount engine (Flat/Percentage, Min Order, Max Discount) | CheckoutView, AdminPortalView | High | Coupon APIs (`/api/v1/coupons/*`), Validation service | In Progress |
| **REQ-009** | Cart validation & Server-side Order Price Calculation (Subtotal, Delivery Fee, 5% GST, Discounts) | CheckoutView | High | Pricing Engine, Order creation validation | In Progress |
| **REQ-010** | Order placement with multiple payment methods (`upi`, `card`, `netbanking`, `cod`) | CheckoutView | High | Order APIs (`/api/v1/orders`), Transaction record creation | In Progress |
| **REQ-011** | Order lifecycle state machine (`confirmed` -> `preparing` -> `on_the_way` -> `delivered` / `cancelled`) | TrackOrderView, RestaurantPortalView, DeliveryPartnerView | High | Order status transition validation & tracking coordinates | In Progress |
| **REQ-012** | Order feedback & ratings submission | OrdersView, TrackOrderView | Medium | Review APIs (`/api/v1/orders/:id/review`) | In Progress |
| **REQ-013** | Delivery rider task dispatch, claim, checklist, and OTP confirmation | DeliveryPartnerView | High | Delivery APIs (`/api/v1/delivery/*`), OTP verification | In Progress |
| **REQ-014** | Delivery rider earnings ledger, timeframes (today/week/month), surge zones | DeliveryDashboard | Medium | Delivery Dashboard & Earnings APIs (`/api/v1/delivery/dashboard`) | In Progress |
| **REQ-015** | Admin platform metrics (GMV, 18% commission, active orders, fleet status) | AdminPortalView, PaymentFlowBreakdown | High | Admin Analytics APIs (`/api/v1/admin/metrics`, `/api/v1/admin/fleet`) | In Progress |
| **REQ-016** | Admin payment channel breakdown and transaction ledger logs | PaymentFlowBreakdown | Medium | Payment Ledger APIs (`/api/v1/admin/payments`) | In Progress |
| **REQ-017** | Centralized error handling, standardized JSON error responses, request logging | Master Prompt | High | Error middleware, Logger utility, Request ID tracking | In Progress |
| **REQ-018** | Security hardening (Helmet headers, CORS, rate limiting, input sanitization, secret masking) | Security Rules | High | Security middleware stack | In Progress |
