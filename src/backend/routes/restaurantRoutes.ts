import { Router } from 'express';
import { restaurantController } from '../controllers/restaurantController';
import { authenticate, authorizeRoles } from '../middlewares/authMiddleware';
import { validateBody } from '../middlewares/validateMiddleware';

const router = Router();

// GET /api/v1/restaurants — public
router.get('/', restaurantController.list.bind(restaurantController));

// GET /api/v1/restaurants/:id — public
router.get('/:id', restaurantController.getById.bind(restaurantController));

// POST /api/v1/restaurants — admin only
router.post(
  '/',
  authenticate,
  authorizeRoles('admin'),
  validateBody({
    name:         { required: true, type: 'string', minLength: 2, maxLength: 100 },
    address:      { required: true, type: 'string' },
    cuisine:      { required: true, type: 'array' },
    deliveryTime: { required: true, type: 'string' },
    priceForOne:  { required: true, type: 'number', min: 1 },
  }),
  restaurantController.create.bind(restaurantController)
);

// PATCH /api/v1/restaurants/:id/status — restaurant or admin
router.patch(
  '/:id/status',
  authenticate,
  authorizeRoles('restaurant', 'admin'),
  validateBody({
    isOpen: { required: true, type: 'boolean' },
  }),
  restaurantController.toggleStatus.bind(restaurantController)
);

// POST /api/v1/restaurants/:id/menu — restaurant or admin
router.post(
  '/:id/menu',
  authenticate,
  authorizeRoles('restaurant', 'admin'),
  validateBody({
    name:     { required: true, type: 'string', minLength: 1, maxLength: 120 },
    price:    { required: true, type: 'number', min: 1 },
    category: {
      required: true,
      type: 'string',
      enum: ['Appetizers', 'Main Course', 'Breads', 'Beverages', 'Desserts', 'Burgers', 'Pizzas', 'Sides'],
    },
  }),
  restaurantController.addMenuItem.bind(restaurantController)
);

// PATCH /api/v1/restaurants/:id/menu/:itemId/price
router.patch(
  '/:id/menu/:itemId/price',
  authenticate,
  authorizeRoles('restaurant', 'admin'),
  validateBody({
    price: { required: true, type: 'number', min: 1 },
  }),
  restaurantController.updateMenuItemPrice.bind(restaurantController)
);

// PATCH /api/v1/restaurants/:id/menu/:itemId/availability
router.patch(
  '/:id/menu/:itemId/availability',
  authenticate,
  authorizeRoles('restaurant', 'admin'),
  restaurantController.toggleItemAvailability.bind(restaurantController)
);

// DELETE /api/v1/restaurants/:id/menu/:itemId
router.delete(
  '/:id/menu/:itemId',
  authenticate,
  authorizeRoles('restaurant', 'admin'),
  restaurantController.deleteMenuItem.bind(restaurantController)
);

export default router;
