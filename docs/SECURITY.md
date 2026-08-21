# Security Architecture & Policies

## 1. Authentication & Session Management
- **Stateless JWT**: Signed with HMAC SHA-256 (`JWT_SECRET`) with configurable expiry (e.g. 24h/7d).
- **Password Security**: Passwords hashed using bcrypt / Argon2 with salt rounds >= 10. Passwords are never stored in plaintext and stripped from all JSON responses.
- **Sensitive Key Exposure**: Tokens, secret keys, password hashes, and internal database connection strings are never exposed in API outputs or console logs.

## 2. Authorization & RBAC
- **Token Verification**: `authenticate` middleware verifies `Authorization: Bearer <token>`.
- **Role Verification**: `authorizeRoles('admin', 'restaurant', ...)` ensures only authorized user classes access protected endpoints.
- **Tenant & Object Isolation**: Verifies that `req.user.id` or `req.user.restaurantId` matches the targeted resource ID, preventing Insecure Direct Object References (IDOR).

## 3. Input Validation & Injection Prevention
- **Schema Validation**: All input bodies, parameters, and query parameters validated against strict schemas (types, bounds, allowed fields, regex).
- **Sanitization**: Strips script tags, invalid escape characters, and unwanted fields.
- **Parameter Tampering Prevention**: Client cannot inject server-calculated values (e.g. `total`, `discount`, `status`, `isGoldMember`).

## 4. Network & Middleware Hardening
- **CORS**: Configured to restrict allowed origins in production, supporting Vite frontend during development.
- **Rate Limiting**: Rate limiter middleware applied to authentication (`/api/v1/auth/*`) and order placement (`/api/v1/orders`) to mitigate brute force and denial of service.
- **Security Headers**: Helmet integration (`X-Content-Type-Options: nosniff`, `X-Frame-Options: SAMEORIGIN`, `Content-Security-Policy`, `X-XSS-Protection`).
- **Standardized Errors**: Internal error stack traces suppressed in production responses to prevent info leakage.
