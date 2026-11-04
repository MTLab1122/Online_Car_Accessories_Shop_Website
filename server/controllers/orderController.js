import Order from '../models/Order.js';
import Product from '../models/Product.js';
import Cart from '../models/Cart.js';
import Coupon from '../models/Coupon.js';
import { successResponse, errorResponse } from '../utils/apiResponse.js';

// Helper to generate unique order number: AOX-YYYYMMDD-XXXX
const generateOrderNumber = () => {
  const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, '');
  const randomStr = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `AOX-${dateStr}-${randomStr}`;
};

// @desc    Create new order
// @route   POST /api/v1/orders
// @access  Private
export const createOrder = async (req, res, next) => {
  try {
    const { shippingAddress, paymentMethod, couponCode, simulatedPaymentDetails } = req.body;

    // Fetch user cart
    const cart = await Cart.findOne({ user: req.user._id }).populate('items.product');

    if (!cart || cart.items.length === 0) {
      return errorResponse(res, 400, 'Your cart is empty. Please add items before checking out.');
    }

    // Server-side verification of all cart items & stock
    const orderItems = [];
    let subtotal = 0;

    for (const item of cart.items) {
      const product = await Product.findById(item.product._id);
      if (!product || !product.isActive) {
        return errorResponse(res, 400, `Product "${item.product.name}" is no longer available.`);
      }

      if (product.stock < item.quantity) {
        return errorResponse(
          res,
          400,
          `Insufficient stock for "${product.name}". Only ${product.stock} units remaining.`
        );
      }

      const unitPrice = product.discountPercentage > 0
        ? Math.round(product.price * (1 - product.discountPercentage / 100))
        : product.price;

      orderItems.push({
        product: product._id,
        name: product.name,
        SKU: product.SKU,
        price: unitPrice,
        quantity: item.quantity,
        image: product.images && product.images.length > 0 ? product.images[0] : ''
      });

      subtotal += unitPrice * item.quantity;
    }

    // Validate coupon if provided
    let discount = 0;
    let appliedCoupon = undefined;
    const codeToTest = couponCode || cart.coupon?.code;

    if (codeToTest) {
      const couponDoc = await Coupon.findOne({
        code: codeToTest.trim().toUpperCase(),
        isActive: true,
        expiryDate: { $gt: new Date() }
      });

      if (couponDoc && subtotal >= couponDoc.minimumOrderAmount) {
        if (couponDoc.discountType === 'percentage') {
          discount = Math.round((subtotal * couponDoc.discountValue) / 100);
          if (couponDoc.maximumDiscount && discount > couponDoc.maximumDiscount) {
            discount = couponDoc.maximumDiscount;
          }
        } else {
          discount = Math.min(couponDoc.discountValue, subtotal);
        }

        appliedCoupon = {
          code: couponDoc.code,
          discountAmount: discount
        };

        // Increment coupon usage
        couponDoc.usageCount += 1;
        const userUsage = couponDoc.usedBy.find(u => u.user.toString() === req.user._id.toString());
        if (userUsage) {
          userUsage.count += 1;
        } else {
          couponDoc.usedBy.push({ user: req.user._id, count: 1 });
        }
        await couponDoc.save();
      }
    }

    // Server-side calculated shipping fee: Free shipping above 5000 PKR
    const shippingFee = subtotal > 5000 ? 0 : 250;
    const total = Math.max(0, subtotal - discount + shippingFee);

    // Stock deduction
    for (const item of cart.items) {
      await Product.findByIdAndUpdate(item.product._id, {
        $inc: { stock: -item.quantity }
      });
    }

    // Determine initial payment status
    let paymentStatus = 'pending';
    if (paymentMethod === 'simulated_card') {
      // Clearly marked simulated demonstration payment
      paymentStatus = 'completed';
    }

    const orderNumber = generateOrderNumber();

    const order = await Order.create({
      orderNumber,
      user: req.user._id,
      items: orderItems,
      shippingAddress,
      subtotal,
      shippingFee,
      discount,
      total,
      coupon: appliedCoupon,
      paymentMethod,
      paymentStatus,
      orderStatus: 'placed',
      deliveryTracking: [{
        status: 'placed',
        message: 'Order placed successfully. Awaiting warehouse fulfillment.',
        location: 'AUTOX Logistics Hub, Pakistan',
        timestamp: new Date()
      }]
    });

    // Clear user cart
    cart.items = [];
    cart.coupon = null;
    await cart.save();

    return successResponse(res, 201, 'Order created successfully', order);
  } catch (err) {
    next(err);
  }
};

// @desc    Get logged in user orders
// @route   GET /api/v1/orders/my-orders
// @access  Private
export const getMyOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
    return successResponse(res, 200, 'Orders retrieved successfully', orders);
  } catch (err) {
    next(err);
  }
};

// @desc    Get order details by ID
// @route   GET /api/v1/orders/:id
// @access  Private
export const getOrderById = async (req, res, next) => {
  try {
    if (!req.params.id || !req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
      return errorResponse(res, 404, 'Order not found');
    }

    const order = await Order.findById(req.params.id).populate('user', 'name email phone');

    if (!order) {
      return errorResponse(res, 404, 'Order not found');
    }

    // Authorization: User can only see their own order, Admin can see any
    if (order.user._id.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return errorResponse(res, 403, 'Unauthorized access to this order.');
    }

    return successResponse(res, 200, 'Order details retrieved', order);
  } catch (err) {
    next(err);
  }
};

// @desc    Cancel order by customer
// @route   PATCH /api/v1/orders/:id/cancel
// @access  Private
export const cancelOrder = async (req, res, next) => {
  try {
    const { reason } = req.body;
    const order = await Order.findById(req.params.id);

    if (!order) {
      return errorResponse(res, 404, 'Order not found');
    }

    if (order.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return errorResponse(res, 403, 'Unauthorized to cancel this order.');
    }

    if (['shipped', 'delivered', 'cancelled'].includes(order.orderStatus)) {
      return errorResponse(res, 400, `Cannot cancel order with status "${order.orderStatus}".`);
    }

    // Restock items
    for (const item of order.items) {
      await Product.findByIdAndUpdate(item.product, {
        $inc: { stock: item.quantity }
      });
    }

    order.orderStatus = 'cancelled';
    order.cancellationReason = reason || 'Customer requested cancellation';
    order.deliveryTracking.push({
      status: 'cancelled',
      message: `Order cancelled: ${order.cancellationReason}`,
      location: 'AUTOX Customer Support',
      timestamp: new Date()
    });

    if (order.paymentStatus === 'completed') {
      order.paymentStatus = 'refunded';
      order.refundDetails = {
        amount: order.total,
        reason: 'Order cancelled by customer',
        processedAt: new Date()
      };
    }

    await order.save();
    return successResponse(res, 200, 'Order cancelled successfully', order);
  } catch (err) {
    next(err);
  }
};

// @desc    Get order delivery tracking timeline
// @route   GET /api/v1/orders/:id/tracking
// @access  Private
export const getOrderTracking = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id).select('orderNumber orderStatus deliveryTracking shippingAddress createdAt');

    if (!order) {
      return errorResponse(res, 404, 'Order not found');
    }

    return successResponse(res, 200, 'Tracking information retrieved', {
      orderNumber: order.orderNumber,
      orderStatus: order.orderStatus,
      trackingTimeline: order.deliveryTracking,
      shippingCity: order.shippingAddress.city
    });
  } catch (err) {
    next(err);
  }
};

