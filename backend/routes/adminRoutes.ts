import { Router } from 'express';
import { adminController } from '../controllers/adminController';
import { authenticate, authorizeRoles } from '../middlewares/authMiddleware';

const router = Router();

// All admin routes require authentication + admin role
router.use(authenticate, authorizeRoles('admin'));

// GET /api/v1/admin/metrics
router.get('/metrics', adminController.getMetrics.bind(adminController));

// GET /api/v1/admin/fleet
router.get('/fleet', adminController.getFleet.bind(adminController));

// GET /api/v1/admin/payments
router.get('/payments', adminController.getPayments.bind(adminController));

export default router;
