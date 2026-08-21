# System Architecture & Layer Design

## Overview
BiteGo Backend follows a clean Layered Architecture (Controller-Service-Repository pattern) designed for high cohesion, low coupling, testability, and strict adherence to API contracts.

```
┌────────────────────────────────────────────────────────┐
│                   Vite Frontend Client                 │
│         (React 19 + TypeScript + Tailwind v4)          │
└───────────────────────────┬────────────────────────────┘
                            │ HTTP JSON Requests
                            ▼
┌────────────────────────────────────────────────────────┐
│                 Express API Server (/api/v1)           │
│ ┌────────────────────────────────────────────────────┐ │
│ │ Middleware Layer                                   │ │
│ │  - Security Headers (Helmet) & CORS                │ │
│ │  - Request Logging & Request-ID Injection          │ │
│ │  - Rate Limiting                                   │ │
│ │  - JWT Authentication & Role Authorization (RBAC)  │ │
│ │  - Input Schema Validation (Validators)            │ │
│ └─────────────────────────┬──────────────────────────┘ │
│                           ▼                            │
│ ┌────────────────────────────────────────────────────┐ │
│ │ Route Layer (Routing & Controller Mapping)         │ │
│ └─────────────────────────┬──────────────────────────┘ │
│                           ▼                            │
│ ┌────────────────────────────────────────────────────┐ │
│ │ Controller Layer (HTTP I/O, Status Codes)          │ │
│ └─────────────────────────┬──────────────────────────┘ │
│                           ▼                            │
│ ┌────────────────────────────────────────────────────┐ │
│ │ Service Layer (Core Business Rules & Orchestration)│ │
│ └─────────────────────────┬──────────────────────────┘ │
│                           ▼                            │
│ ┌────────────────────────────────────────────────────┐ │
│ │ Repository Layer (Data Access & Queries)           │ │
│ └─────────────────────────┬──────────────────────────┘ │
│                           ▼                            │
│ ┌────────────────────────────────────────────────────┐ │
│ │ Centralized Error Handler (Standardized API Errors) │ │
│ └────────────────────────────────────────────────────┘ │
└───────────────────────────┬────────────────────────────┘
                            │
                            ▼
┌────────────────────────────────────────────────────────┐
│             Persistent Data Store / Models             │
│        (User, Restaurant, MenuItem, Order,             │
│         Coupon, Address, Rider, Transaction)           │
└────────────────────────────────────────────────────────┘
```

## Layer Responsibilities

1. **Routes (`/src/routes`)**:
   - Declares URL endpoints and HTTP verbs under `/api/v1/*`.
   - Attaches relevant authentication, authorization, and validation middlewares.
   - Forwards request execution to corresponding controller methods. No business logic.

2. **Controllers (`/src/controllers`)**:
   - Parses HTTP request parameters, body, query strings, and authenticated user context (`req.user`).
   - Delegates business operations to the appropriate Service class.
   - Formats and sends HTTP responses using standardized JSON helper utilities.

3. **Services (`/src/services`)**:
   - Encapsulates all domain and business rules (e.g. price calculation, tax computation, discount bounds, order status progression rules, OTP validation, delivery fee algorithms).
   - Coordinates between multiple repositories.

4. **Repositories (`/src/repositories`)**:
   - Abstracted persistence interface for CRUD operations, filtering, pagination, sorting, and atomic updates.
   - Decoupled from HTTP context and business logic.

5. **Models & Types (`/src/models`, `/src/types`)**:
   - Defines strong TypeScript interfaces, schema structures, domain entities, and data transfer types.

6. **Middlewares (`/src/middlewares`)**:
   - `authMiddleware.ts`: Verifies JWT bearer tokens, decodes user payload.
   - `roleMiddleware.ts`: Enforces role-based permissions (`customer`, `restaurant`, `delivery`, `admin`).
   - `validateMiddleware.ts`: Validates request bodies, query params, and route parameters against schemas.
   - `errorMiddleware.ts`: Catches all operational and unhandled exceptions, returning standard error payloads.
   - `rateLimiter.ts`: Prevents abuse on sensitive endpoints like login and order placement.
