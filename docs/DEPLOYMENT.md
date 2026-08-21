# Backend Deployment & Runtime Guide

## 1. Environment Configuration

The application reads configuration through environment variables via `dotenv` and `src/config/env.ts`.

### Sample `.env.example`
```env
# Server Configuration
PORT=5000
NODE_ENV=development
APP_URL=http://localhost:3000

# Security & Authentication
JWT_SECRET=bitego_super_secure_production_jwt_secret_nashik_2026
JWT_EXPIRES_IN=7d

# CORS Configuration
CORS_ORIGIN=http://localhost:3000

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX=100

# Logging
LOG_LEVEL=info

# Gemini AI (Optional)
GEMINI_API_KEY=MY_GEMINI_API_KEY
```

## 2. Running Locally

### Development Server
```bash
# Start Backend in Watch Mode
npm run server:dev

# Start Frontend (Vite)
npm run dev

# Or Start Combined Full-Stack Server
npm run start
```

## 3. Production Build & Execution
```bash
# Build frontend and backend bundles
npm run build

# Start Production Server
node dist/server.js
```

## 4. Health Checks
- Endpoint: `GET /api/v1/health`
- Response: `200 OK`
  ```json
  {
    "status": "healthy",
    "timestamp": "2026-08-21T11:30:00.000Z",
    "uptime": 124.5,
    "version": "1.0.0"
  }
  ```
