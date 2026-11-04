import express from 'express';
import {
  getCart,
  addItemToCart,
  updateCartItem,
  removeCartItem,
  applyCoupon,
  removeCoupon,
  clearCart,
  syncGuestCart
} from '../controllers/cartController.js';
import { optionalAuth, protect } from '../middleware/auth.js';

const router = express.Router();

router.use(optionalAuth);

router.route('/')
  .get(getCart)
  .delete(clearCart);

router.post('/items', addItemToCart);
router.patch('/items/:productId', updateCartItem);
router.delete('/items/:productId', removeCartItem);

router.post('/coupon', applyCoupon);
router.delete('/coupon', removeCoupon);

router.post('/sync', protect, syncGuestCart);

export default router;
