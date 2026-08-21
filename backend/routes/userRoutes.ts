import { Router } from 'express';
import { authController } from '../controllers/authController';
import { authenticate } from '../middlewares/authMiddleware';

const router = Router();

// GET /api/v1/users/profile
router.get('/profile', authenticate, authController.getProfile.bind(authController));

// PUT /api/v1/users/profile
router.put('/profile', authenticate, authController.updateProfile.bind(authController));

export default router;
