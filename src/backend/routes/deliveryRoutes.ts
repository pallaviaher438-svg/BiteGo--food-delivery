import { Router } from 'express';
import { deliveryController } from '../controllers/deliveryController';
import { authenticate, authorizeRoles } from '../middlewares/authMiddleware';
import { validateBody } from '../middlewares/validateMiddleware';

const router = Router();

// All delivery routes require authentication
router.use(authenticate);

// GET /api/v1/delivery/tasks — delivery or admin
router.get(
  '/tasks',
  authorizeRoles('delivery', 'admin'),
  deliveryController.getTasks.bind(deliveryController)
);

// PATCH /api/v1/delivery/tasks/:orderId/stage — delivery only
router.patch(
  '/tasks/:orderId/stage',
  authorizeRoles('delivery'),
  validateBody({
    stage: {
      required: true,
      type: 'string',
      enum: ['confirmed', 'preparing', 'on_the_way'],
    },
  }),
  deliveryController.advanceStage.bind(deliveryController)
);

// POST /api/v1/delivery/tasks/:orderId/verify-otp — delivery only
router.post(
  '/tasks/:orderId/verify-otp',
  authorizeRoles('delivery'),
  validateBody({
    otp: { required: true, type: 'string', minLength: 4, maxLength: 6 },
  }),
  deliveryController.verifyOtp.bind(deliveryController)
);

// GET /api/v1/delivery/dashboard — delivery or admin
router.get(
  '/dashboard',
  authorizeRoles('delivery', 'admin'),
  deliveryController.getDashboard.bind(deliveryController)
);

// POST /api/v1/delivery/cashout — delivery only
router.post(
  '/cashout',
  authorizeRoles('delivery'),
  validateBody({
    amount: { required: true, type: 'number', min: 1 },
  }),
  deliveryController.requestCashout.bind(deliveryController)
);

export default router;
