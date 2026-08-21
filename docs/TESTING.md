# Backend Testing Strategy

## 1. Test Levels
- **Unit Tests**: Test isolated domain logic, pricing calculator, coupon discount boundaries, tax rules, OTP generators, validation schemas.
- **Service Integration Tests**: Test service coordination with repositories, business rule enforcement (single restaurant per order, status state machine transitions).
- **API / Route Integration Tests**: Test HTTP endpoints using Supertest, verifying status codes, response shapes, authentication headers, error middleware behavior.

## 2. Priority Test Cases

### 2.1 Authentication & RBAC
- Login with valid email & password -> returns 200 and JWT token.
- Login with invalid password -> returns 401.
- Request OTP with valid phone -> returns 200 with OTP challenge.
- Verify valid OTP -> returns JWT with user profile.
- Accessing admin endpoints with customer role -> returns 403 Forbidden.
- Accessing protected endpoint without token -> returns 401 Unauthorized.

### 2.2 Pricing & Calculation Engine
- Calculate order subtotal with multiple items and quantities.
- Apply percentage coupon with max discount cap (e.g. 50% up to ₹100 on ₹450 subtotal = ₹100 discount).
- Apply flat coupon (e.g. ₹150 off on ₹499 min order).
- Enforce min order constraint on coupons -> rejects coupon if subtotal < minOrder.
- Calculate 5% GST on subtotal.
- Apply ₹0 delivery fee when order exceeds ₹500.

### 2.3 Order Lifecycle & Verification
- Create order with valid items and address -> returns 201 and creates order in `confirmed` state.
- Transition order from `confirmed` -> `preparing` -> `on_the_way`.
- Transition from `on_the_way` -> `delivered` with valid OTP -> succeeds and records delivery.
- Transition to `delivered` with wrong OTP -> returns 400 Invalid OTP.
- Illegal status transition (e.g. `delivered` -> `preparing`) -> returns 400.

### 2.4 Restaurant & Menu Management
- List restaurants with search and cuisine filter.
- Add menu item to restaurant as partner/admin -> succeeds.
- Toggle restaurant open/close status -> succeeds.
- Toggle item availability -> succeeds.
