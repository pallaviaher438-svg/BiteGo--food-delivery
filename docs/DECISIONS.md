# Architecture Decision Log

## DEC-001: Backend Architecture & Directory Structure
- **Decision**: Adopt a modular Layered Architecture (Routes -> Controllers -> Services -> Repositories -> Data Models) in TypeScript.
- **Why**: Clean separation of concerns, testability, easy maintenance, and future swapability of storage engines without touching business logic.
- **Alternatives considered**: Single flat file backend (monolithic script), or complex microservices.
- **Impact**: Code is strictly organized into `src/routes`, `src/controllers`, `src/services`, `src/repositories`, `src/models`, `src/middlewares`, `src/validators`, and `src/utils`.
- **Date**: 2026-08-21

---

## DEC-002: Dual Auth Strategy (JWT + Mobile OTP Simulator)
- **Decision**: Support stateless JWT bearer tokens for session management, with support for email/password and mobile OTP flows (with standard Indian demo OTP `4220` or dynamically generated 6-digit OTP).
- **Why**: Indian food delivery apps predominantly rely on quick phone OTP login while admin/staff portal access uses email/password.
- **Alternatives considered**: Session cookies (stateful, harder for cross-domain mobile clients).
- **Impact**: Enables smooth testing from the frontend `AuthView` while securing all role-protected endpoints.
- **Date**: 2026-08-21

---

## DEC-003: Pluggable Repository Pattern with In-Memory Persistent Store
- **Decision**: Implement a persistent repository abstraction seeded with rich mock data matching the frontend's Nashik dataset (`mockData.ts`), backed by atomic in-memory state with file snapshot persistence, exposing clean async CRUD repository methods.
- **Why**: Allows instant out-of-the-box local execution, comprehensive end-to-end frontend integration, seamless test runs without requiring external database provisioning, while maintaining 100% database-agnostic service layer that can plug into MongoDB/PostgreSQL by swapping repository drivers.
- **Alternatives considered**: Direct database binding to a local SQLite or remote DB which may fail without installed drivers.
- **Impact**: Complete functionality, zero setup friction, perfectly synchronized with existing frontend components.
- **Date**: 2026-08-21

---

## DEC-004: Server-Side Calculation of Order Financials
- **Decision**: Never trust client-supplied totals, tax amounts, delivery fees, or discounts. The backend recalculates item totals from canonical menu item prices, computes 5% GST, evaluates coupon eligibility (min order & discount caps), and sets final order total.
- **Why**: Security and data integrity against client tampering.
- **Alternatives considered**: Trusting frontend price calculations.
- **Impact**: Eliminates financial fraud risk.
- **Date**: 2026-08-21

---

## DEC-005: OTP-Protected Order Completion Handshake
- **Decision**: Require 4-digit customer delivery OTP (or Nashik default code `4220`) for riders to transition an order from `on_the_way` to `delivered`.
- **Why**: Mirrors production Indian delivery platforms (Swiggy, Zomato, Blinkit) to prevent false delivery marking and ensure audit trail.
- **Alternatives considered**: Open unverified one-click completion.
- **Impact**: Enforced in `DeliveryService.verifyOtpAndComplete`.
- **Date**: 2026-08-21
