import { Router } from 'express';
import { authController } from '../controllers/authController';
import { authenticate } from '../middlewares/authMiddleware';
import { validateBody } from '../middlewares/validateMiddleware';
import { rateLimiter } from '../middlewares/securityMiddleware';

const router = Router();

// Stricter rate limit on auth endpoints
const authRateLimit = rateLimiter(15 * 60 * 1000, 20);

// POST /api/v1/auth/request-otp
router.post(
  '/request-otp',
  authRateLimit,
  validateBody({
    phone: {
      required: true,
      type: 'string',
      pattern: /^\+91[0-9]{10}$/,
      message: 'phone must be in format +91XXXXXXXXXX',
    },
  }),
  authController.requestOtp.bind(authController)
);

// POST /api/v1/auth/verify-otp
router.post(
  '/verify-otp',
  authRateLimit,
  validateBody({
    phone: { required: true, type: 'string' },
    otp:   { required: true, type: 'string', minLength: 4, maxLength: 6 },
  }),
  authController.verifyOtp.bind(authController)
);

// POST /api/v1/auth/login
router.post(
  '/login',
  authRateLimit,
  validateBody({
    email:    { required: true, type: 'string' },
    password: { required: true, type: 'string', minLength: 6 },
  }),
  authController.login.bind(authController)
);

// POST /api/v1/auth/signup
router.post(
  '/signup',
  authRateLimit,
  validateBody({
    name:     { required: true, type: 'string', minLength: 2, maxLength: 80 },
    email:    { required: true, type: 'string' },
    phone:    { required: true, type: 'string' },
    password: { required: true, type: 'string', minLength: 8 },
  }),
  authController.signup.bind(authController)
);

// GET /api/v1/users/profile  — mounted separately; re-exported from here for convenience
// PUT /api/v1/users/profile

export default router;
