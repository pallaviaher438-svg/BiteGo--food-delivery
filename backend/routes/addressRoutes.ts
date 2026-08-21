import { Router } from 'express';
import { addressController } from '../controllers/addressController';
import { authenticate, authorizeRoles } from '../middlewares/authMiddleware';
import { validateBody } from '../middlewares/validateMiddleware';

const router = Router();

// All address routes require authentication
router.use(authenticate);

// GET /api/v1/addresses
router.get('/', addressController.list.bind(addressController));

// POST /api/v1/addresses
router.post(
  '/',
  validateBody({
    label:       { required: true, type: 'string', enum: ['Home', 'Work', 'Other'] },
    addressLine: { required: true, type: 'string', minLength: 5, maxLength: 300 },
    phone:       { required: true, type: 'string' },
  }),
  addressController.create.bind(addressController)
);

// PUT /api/v1/addresses/:id
router.put('/:id', addressController.update.bind(addressController));

// DELETE /api/v1/addresses/:id
router.delete('/:id', addressController.remove.bind(addressController));

export default router;
