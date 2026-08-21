import { Router } from 'express';
import { orderController } from '../controllers/orderController';
import { authenticate, authorizeRoles } from '../middlewares/authMiddleware';
import { validateBody } from '../middlewares/validateMiddleware';
import { rateLimiter } from '../middlewares/securityMiddleware';

const router = Router();

// All order routes require authentication
router.use(authenticate);

// Tighter rate limit on order placement
const orderRateLimit = rateLimiter(60 * 1000, 10);

// POST /api/v1/orders/quote — customer only
router.post(
  '/quote',
  authorizeRoles('customer'),
  validateBody({
    items: { required: true, type: 'array' },
  }),
  orderController.getQuote.bind(orderController)
);

// POST /api/v1/orders — customer only
router.post(
  '/',
  authorizeRoles('customer'),
  orderRateLimit,
  validateBody({
    restaurantId:  { required: true, type: 'string' },
    items:         { required: true, type: 'array' },
    addressId:     { required: true, type: 'string' },
    paymentMethod: {
      required: true,
      type: 'string',
      enum: ['upi', 'card', 'netbanking', 'cod'],
    },
  }),
  orderController.placeOrder.bind(orderController)
);

// GET /api/v1/orders
router.get('/', orderController.list.bind(orderController));

// GET /api/v1/orders/:id
router.get('/:id', orderController.getById.bind(orderController));

// PATCH /api/v1/orders/:id/status — restaurant, delivery, admin
router.patch(
  '/:id/status',
  authorizeRoles('restaurant', 'delivery', 'admin'),
  validateBody({
    status: {
      required: true,
      type: 'string',
      enum: ['confirmed', 'preparing', 'on_the_way', 'delivered', 'cancelled'],
    },
  }),
  orderController.updateStatus.bind(orderController)
);

// POST /api/v1/orders/:id/cancel — customer, restaurant, admin
router.post(
  '/:id/cancel',
  authorizeRoles('customer', 'restaurant', 'admin'),
  orderController.cancelOrder.bind(orderController)
);

// POST /api/v1/orders/:id/review — customer only
router.post(
  '/:id/review',
  authorizeRoles('customer'),
  validateBody({
    rating:  { required: true, type: 'number', min: 1, max: 5 },
    comment: { required: false, type: 'string', maxLength: 500 },
  }),
  orderController.submitReview.bind(orderController)
);

export default router;
