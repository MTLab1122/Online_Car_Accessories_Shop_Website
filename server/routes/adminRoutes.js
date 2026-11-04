import express from 'express';
import {
  getDashboardStats,
  getAllOrders,
  updateOrderStatus,
  getAllCustomers,
  updateCustomerStatus,
  getAllReviews,
  updateReviewStatus,
  getAllCoupons,
  createCoupon,
  updateCoupon,
  deleteCoupon
} from '../controllers/adminController.js';
import { protect, authorize } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import { updateOrderStatusSchema } from '../validators/orderValidator.js';
import { updateReviewStatusSchema } from '../validators/reviewValidator.js';
import { createCouponSchema } from '../validators/couponValidator.js';

const router = express.Router();

// Strict admin protection on all routes in this router
router.use(protect, authorize('admin'));

// Analytics Dashboard
router.get('/dashboard', getDashboardStats);
router.get('/overview', getDashboardStats);

// Order Management
router.get('/orders', getAllOrders);
router.patch('/orders/:id/status', validate(updateOrderStatusSchema), updateOrderStatus);

// Customer Management
router.get('/customers', getAllCustomers);
router.patch('/customers/:id/status', updateCustomerStatus);

// Review Management
router.get('/reviews', getAllReviews);
router.patch('/reviews/:id/status', validate(updateReviewStatusSchema), updateReviewStatus);

// Coupon Management
router.route('/coupons')
  .get(getAllCoupons)
  .post(validate(createCouponSchema), createCoupon);

router.route('/coupons/:id')
  .patch(updateCoupon)
  .delete(deleteCoupon);

export default router;

