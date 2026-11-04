import User from '../models/User.js';
import Order from '../models/Order.js';
import Product from '../models/Product.js';
import Review from '../models/Review.js';
import Coupon from '../models/Coupon.js';
import { successResponse, errorResponse } from '../utils/apiResponse.js';

// @desc    Get comprehensive admin dashboard analytics
// @route   GET /api/v1/admin/dashboard
// @access  Private/Admin
export const getDashboardStats = async (req, res, next) => {
  try {
    const [
      totalOrders,
      totalCustomers,
      totalProducts,
      pendingOrders,
      deliveredOrders,
      lowStockProducts,
      recentOrders,
      revenueStats,
      orderStatusCounts
    ] = await Promise.all([
      Order.countDocuments(),
      User.countDocuments({ role: 'customer' }),
      Product.countDocuments({ isActive: true }),
      Order.countDocuments({ orderStatus: { $in: ['placed', 'confirmed', 'processing'] } }),
      Order.countDocuments({ orderStatus: 'delivered' }),
      Product.find({ stock: { $lte: 5 }, isActive: true }).select('name SKU stock price').limit(5),
      Order.find()
        .populate('user', 'name email')
        .sort({ createdAt: -1 })
        .limit(6),
      Order.aggregate([
        {
          $group: {
            _id: null,
            grossRevenue: { $sum: '$total' },
            completedRevenue: {
              $sum: {
                $cond: [{ $eq: ['$paymentStatus', 'completed'] }, '$total', 0]
              }
            },
            refundedAmount: {
              $sum: {
                $cond: [{ $eq: ['$paymentStatus', 'refunded'] }, '$refundDetails.amount', 0]
              }
            }
          }
        }
      ]),
      Order.aggregate([
        {
          $group: {
            _id: '$orderStatus',
            count: { $sum: 1 }
          }
        }
      ])
    ]);

    const revenue = revenueStats[0] || { grossRevenue: 0, completedRevenue: 0, refundedAmount: 0 };

    // Monthly revenue trend (last 6 months)
    const monthlyRevenue = await Order.aggregate([
      {
        $match: {
          createdAt: {
            $gte: new Date(new Date().setMonth(new Date().getMonth() - 5))
          }
        }
      },
      {
        $group: {
          _id: {
            month: { $month: '$createdAt' },
            year: { $year: '$createdAt' }
          },
          revenue: { $sum: '$total' },
          orderCount: { $sum: 1 }
        }
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } }
    ]);

    return successResponse(res, 200, 'Admin metrics retrieved successfully', {
      metrics: {
        totalRevenue: revenue.grossRevenue,
        completedRevenue: revenue.completedRevenue,
        refundedAmount: revenue.refundedAmount,
        totalOrders,
        totalCustomers,
        totalProducts,
        pendingOrders,
        deliveredOrders,
        lowStockCount: lowStockProducts.length
      },
      recentOrders,
      lowStockProducts,
      orderStatusBreakdown: orderStatusCounts,
      monthlyRevenue
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get all orders (Admin) with filter, search, pagination
// @route   GET /api/v1/admin/orders
// @access  Private/Admin
export const getAllOrders = async (req, res, next) => {
  try {
    const { status, paymentStatus, search, page = 1, limit = 15 } = req.query;
    const query = {};

    if (status) query.orderStatus = status;
    if (paymentStatus) query.paymentStatus = paymentStatus;
    if (search) {
      query.$or = [
        { orderNumber: { $regex: search.trim(), $options: 'i' } },
        { 'shippingAddress.fullName': { $regex: search.trim(), $options: 'i' } },
        { 'shippingAddress.phone': { $regex: search.trim(), $options: 'i' } }
      ];
    }

    const pageNum = Math.max(1, parseInt(page, 10));
    const limitNum = Math.max(1, parseInt(limit, 10));
    const skip = (pageNum - 1) * limitNum;

    const [orders, total] = await Promise.all([
      Order.find(query)
        .populate('user', 'name email phone')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limitNum),
      Order.countDocuments(query)
    ]);

    return successResponse(res, 200, 'Orders retrieved successfully', orders, {
      page: pageNum,
      limit: limitNum,
      total,
      totalPages: Math.ceil(total / limitNum)
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Update order status & tracking (Admin)
// @route   PATCH /api/v1/admin/orders/:id/status
// @access  Private/Admin
export const updateOrderStatus = async (req, res, next) => {
  try {
    const { orderStatus, note, location, paymentStatus } = req.body;
    const order = await Order.findById(req.params.id);

    if (!order) {
      return errorResponse(res, 404, 'Order not found');
    }

    // Status transition validation
    const validTransitions = {
      placed: ['confirmed', 'cancelled'],
      confirmed: ['processing', 'cancelled'],
      processing: ['shipped', 'cancelled'],
      shipped: ['delivered', 'cancelled'],
      delivered: [],
      cancelled: []
    };

    if (orderStatus && orderStatus !== order.orderStatus) {
      const allowedNext = validTransitions[order.orderStatus] || [];
      if (!allowedNext.includes(orderStatus) && req.user.role !== 'admin') {
        return errorResponse(
          res,
          400,
          `Invalid status transition from "${order.orderStatus}" to "${orderStatus}".`
        );
      }

      order.orderStatus = orderStatus;
      order.deliveryTracking.push({
        status: orderStatus,
        message: note || `Order status updated to ${orderStatus}`,
        location: location || 'AUTOX Fulfillment Center',
        timestamp: new Date()
      });

      // If transition to delivered and COD, mark payment completed
      if (orderStatus === 'delivered' && order.paymentMethod === 'cod') {
        order.paymentStatus = 'completed';
      }
    }

    if (paymentStatus) {
      order.paymentStatus = paymentStatus;
    }

    await order.save();
    return successResponse(res, 200, 'Order status updated successfully', order);
  } catch (err) {
    next(err);
  }
};

// @desc    Get all registered customers
// @route   GET /api/v1/admin/customers
// @access  Private/Admin
export const getAllCustomers = async (req, res, next) => {
  try {
    const { search, page = 1, limit = 15 } = req.query;
    const query = { role: 'customer' };

    if (search) {
      query.$or = [
        { name: { $regex: search.trim(), $options: 'i' } },
        { email: { $regex: search.trim(), $options: 'i' } },
        { phone: { $regex: search.trim(), $options: 'i' } }
      ];
    }

    const pageNum = Math.max(1, parseInt(page, 10));
    const limitNum = Math.max(1, parseInt(limit, 10));
    const skip = (pageNum - 1) * limitNum;

    const [customers, total] = await Promise.all([
      User.find(query).sort({ createdAt: -1 }).skip(skip).limit(limitNum),
      User.countDocuments(query)
    ]);

    return successResponse(res, 200, 'Customers retrieved successfully', customers, {
      page: pageNum,
      limit: limitNum,
      total,
      totalPages: Math.ceil(total / limitNum)
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Update customer account status (Activate/Suspend)
// @route   PATCH /api/v1/admin/customers/:id/status
// @access  Private/Admin
export const updateCustomerStatus = async (req, res, next) => {
  try {
    const { isActive } = req.body;
    const user = await User.findById(req.params.id);

    if (!user) {
      return errorResponse(res, 404, 'User not found');
    }

    // Safety rule: Never allow suspending the last active administrator
    if (user.role === 'admin' && !isActive) {
      const activeAdminCount = await User.countDocuments({ role: 'admin', isActive: true });
      if (activeAdminCount <= 1) {
        return errorResponse(res, 400, 'Cannot deactivate the sole active administrator account.');
      }
    }

    user.isActive = isActive;
    await user.save();

    return successResponse(res, 200, `Account ${isActive ? 'activated' : 'suspended'} successfully.`, user);
  } catch (err) {
    next(err);
  }
};

// @desc    Get all reviews (Admin)
// @route   GET /api/v1/admin/reviews
// @access  Private/Admin
export const getAllReviews = async (req, res, next) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;
    const query = {};
    if (status) query.status = status;

    const pageNum = Math.max(1, parseInt(page, 10));
    const limitNum = Math.max(1, parseInt(limit, 10));
    const skip = (pageNum - 1) * limitNum;

    const [reviews, total] = await Promise.all([
      Review.find(query)
        .populate('user', 'name email avatar')
        .populate('product', 'name slug images')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limitNum),
      Review.countDocuments(query)
    ]);

    return successResponse(res, 200, 'Reviews retrieved', reviews, {
      page: pageNum,
      limit: limitNum,
      total,
      totalPages: Math.ceil(total / limitNum)
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Update review status (Approve, Hide)
// @route   PATCH /api/v1/admin/reviews/:id/status
// @access  Private/Admin
export const updateReviewStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    const review = await Review.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    if (!review) {
      return errorResponse(res, 404, 'Review not found');
    }

    // Recalculate average ratings
    await Review.calcAverageRatings(review.product);

    return successResponse(res, 200, `Review status updated to ${status}`, review);
  } catch (err) {
    next(err);
  }
};

// @desc    Get all coupons (Admin)
// @route   GET /api/v1/admin/coupons
// @access  Private/Admin
export const getAllCoupons = async (req, res, next) => {
  try {
    const coupons = await Coupon.find().sort({ createdAt: -1 });
    return successResponse(res, 200, 'Coupons retrieved', coupons);
  } catch (err) {
    next(err);
  }
};

// @desc    Create new coupon (Admin)
// @route   POST /api/v1/admin/coupons
// @access  Private/Admin
export const createCoupon = async (req, res, next) => {
  try {
    const existing = await Coupon.findOne({ code: req.body.code.toUpperCase() });
    if (existing) {
      return errorResponse(res, 400, 'A coupon with this code already exists.');
    }

    const coupon = await Coupon.create(req.body);
    return successResponse(res, 201, 'Coupon created successfully', coupon);
  } catch (err) {
    next(err);
  }
};

// @desc    Update coupon (Admin)
// @route   PATCH /api/v1/admin/coupons/:id
// @access  Private/Admin
export const updateCoupon = async (req, res, next) => {
  try {
    const coupon = await Coupon.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!coupon) {
      return errorResponse(res, 404, 'Coupon not found');
    }

    return successResponse(res, 200, 'Coupon updated successfully', coupon);
  } catch (err) {
    next(err);
  }
};

// @desc    Delete coupon (Admin)
// @route   DELETE /api/v1/admin/coupons/:id
// @access  Private/Admin
export const deleteCoupon = async (req, res, next) => {
  try {
    const coupon = await Coupon.findByIdAndDelete(req.params.id);
    if (!coupon) {
      return errorResponse(res, 404, 'Coupon not found');
    }

    return successResponse(res, 200, 'Coupon deleted successfully');
  } catch (err) {
    next(err);
  }
};

