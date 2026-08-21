import { Router } from 'express';
import { couponController } from '../controllers/couponController';
import { authenticate, authorizeRoles } from '../middlewares/authMiddleware';
import { validateBody } from '../middlewares/validateMiddleware';

const router = Router();

// GET /api/v1/coupons — public
router.get('/', couponController.list.bind(couponController));

// POST /api/v1/coupons/validate — public
router.post(
  '/validate',
  validateBody({
    code:        { required: true, type: 'string', minLength: 1 },
    orderAmount: { required: true, type: 'number', min: 0 },
  }),
  couponController.validate.bind(couponController)
);

// POST /api/v1/coupons — admin only
router.post(
  '/',
  authenticate,
  authorizeRoles('admin'),
  validateBody({
    code:          { required: true, type: 'string', minLength: 2, maxLength: 20 },
    discountType:  { required: true, type: 'string', enum: ['percentage', 'flat'] },
    discountValue: { required: true, type: 'number', min: 1 },
    minOrder:      { required: true, type: 'number', min: 0 },
    description:   { required: true, type: 'string' },
  }),
  couponController.create.bind(couponController)
);

// DELETE /api/v1/coupons/:code — admin only
router.delete(
  '/:code',
  authenticate,
  authorizeRoles('admin'),
  couponController.deleteCoupon.bind(couponController)
);

export default router;
