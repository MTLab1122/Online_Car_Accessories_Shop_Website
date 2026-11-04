import express from 'express';
import {
  createOrder,
  getMyOrders,
  getOrderById,
  cancelOrder,
  getOrderTracking
} from '../controllers/orderController.js';
import { protect } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import { createOrderSchema, cancelOrderSchema } from '../validators/orderValidator.js';

const router = express.Router();

router.use(protect); // Orders require authentication

router.route('/')
  .post(validate(createOrderSchema), createOrder);

router.get('/my-orders', getMyOrders);
router.get('/:id', getOrderById);
router.patch('/:id/cancel', validate(cancelOrderSchema), cancelOrder);
router.get('/:id/tracking', getOrderTracking);

export default router;
