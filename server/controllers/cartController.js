import Cart from '../models/Cart.js';
import Product from '../models/Product.js';
import Coupon from '../models/Coupon.js';
import { successResponse, errorResponse } from '../utils/apiResponse.js';

// Helper to calculate authoritative cart totals
const formatCartResponse = async (cart) => {
  if (!cart) {
    return {
      items: [],
      subtotal: 0,
      shippingFee: 0,
      discount: 0,
      total: 0,
      coupon: null
    };
  }

  // Populate product details
  await cart.populate({
    path: 'items.product',
    select: 'name slug price discountPercentage stock images SKU brand isActive'
  });

  // Filter out any deleted or inactive products
  cart.items = cart.items.filter(item => item.product && item.product.isActive);

  let subtotal = 0;
  const items = cart.items.map(item => {
    const unitPrice = item.product.discountPercentage > 0
      ? Math.round(item.product.price * (1 - item.product.discountPercentage / 100))
      : item.product.price;
    const itemTotal = unitPrice * item.quantity;
    subtotal += itemTotal;

    return {
      _id: item._id,
      product: item.product,
      quantity: item.quantity,
      price: unitPrice,
      total: itemTotal
    };
  });

  // Calculate authoritative coupon discount
  let discount = 0;
  let appliedCoupon = null;

  if (cart.coupon && cart.coupon.code) {
    const couponDoc = await Coupon.findOne({
      code: cart.coupon.code.toUpperCase(),
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
        discountType: couponDoc.discountType,
        discountValue: couponDoc.discountValue,
        calculatedDiscount: discount
      };
    } else {
      cart.coupon = null;
      await cart.save();
    }
  }

  // Shipping fee in PKR: Free shipping over 5000 PKR, else 250 PKR standard delivery
  const shippingFee = subtotal > 5000 || subtotal === 0 ? 0 : 250;
  const total = Math.max(0, subtotal - discount + shippingFee);

  return {
    _id: cart._id,
    items,
    itemCount: items.reduce((acc, curr) => acc + curr.quantity, 0),
    subtotal,
    shippingFee,
    discount,
    total,
    coupon: appliedCoupon
  };
};

// Helper to find or create cart for user or guest session
const getCartInstance = async (req) => {
  const sessionId = req.headers['x-session-id'] || req.cookies?.sessionId || req.query.sessionId;

  if (req.user) {
    let cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
      cart = await Cart.create({ user: req.user._id, items: [] });
    }
    return cart;
  }

  if (sessionId) {
    let cart = await Cart.findOne({ sessionId });
    if (!cart) {
      cart = await Cart.create({ sessionId, items: [] });
    }
    return cart;
  }

  // Generate a fallback session id if none provided
  const newSessionId = `guest_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
  const cart = await Cart.create({ sessionId: newSessionId, items: [] });
  return cart;
};

// @desc    Get user or session cart
// @route   GET /api/v1/cart
// @access  Public (Optional Auth)
export const getCart = async (req, res, next) => {
  try {
    const cart = await getCartInstance(req);
    const formatted = await formatCartResponse(cart);
    return successResponse(res, 200, 'Cart retrieved', formatted);
  } catch (err) {
    next(err);
  }
};

// @desc    Add product to cart
// @route   POST /api/v1/cart/items
// @access  Public (Optional Auth)
export const addItemToCart = async (req, res, next) => {
  try {
    const { productId, quantity = 1 } = req.body;
    const qty = Math.max(1, parseInt(quantity, 10));

    const product = await Product.findById(productId);
    if (!product || !product.isActive) {
      return errorResponse(res, 404, 'Product not found or currently unavailable');
    }

    if (product.stock < qty) {
      return errorResponse(res, 400, `Insufficient stock. Only ${product.stock} units available.`);
    }

    const cart = await getCartInstance(req);
    const existingIndex = cart.items.findIndex(
      item => item.product.toString() === productId
    );

    const price = product.discountPercentage > 0
      ? Math.round(product.price * (1 - product.discountPercentage / 100))
      : product.price;

    if (existingIndex > -1) {
      const newQty = cart.items[existingIndex].quantity + qty;
      if (newQty > product.stock) {
        return errorResponse(res, 400, `Cannot add more. Limit of ${product.stock} reached.`);
      }
      cart.items[existingIndex].quantity = newQty;
      cart.items[existingIndex].price = price;
    } else {
      cart.items.push({
        product: product._id,
        quantity: qty,
        price
      });
    }

    await cart.save();
    const formatted = await formatCartResponse(cart);
    return successResponse(res, 200, 'Product added to cart', formatted);
  } catch (err) {
    next(err);
  }
};

// @desc    Update quantity of cart item
// @route   PATCH /api/v1/cart/items/:productId
// @access  Public (Optional Auth)
export const updateCartItem = async (req, res, next) => {
  try {
    const { productId } = req.params;
    const { quantity } = req.body;
    const qty = parseInt(quantity, 10);

    const cart = await getCartInstance(req);
    const itemIndex = cart.items.findIndex(item => item.product.toString() === productId);

    if (itemIndex === -1) {
      return errorResponse(res, 404, 'Item not found in cart');
    }

    if (qty <= 0) {
      cart.items.splice(itemIndex, 1);
    } else {
      const product = await Product.findById(productId);
      if (!product || product.stock < qty) {
        return errorResponse(res, 400, `Only ${product ? product.stock : 0} units available.`);
      }
      cart.items[itemIndex].quantity = qty;
    }

    await cart.save();
    const formatted = await formatCartResponse(cart);
    return successResponse(res, 200, 'Cart item updated', formatted);
  } catch (err) {
    next(err);
  }
};

// @desc    Remove item from cart
// @route   DELETE /api/v1/cart/items/:productId
// @access  Public (Optional Auth)
export const removeCartItem = async (req, res, next) => {
  try {
    const { productId } = req.params;
    const cart = await getCartInstance(req);

    cart.items = cart.items.filter(item => item.product.toString() !== productId);
    await cart.save();

    const formatted = await formatCartResponse(cart);
    return successResponse(res, 200, 'Item removed from cart', formatted);
  } catch (err) {
    next(err);
  }
};

// @desc    Apply coupon to cart
// @route   POST /api/v1/cart/coupon
// @access  Public (Optional Auth)
export const applyCoupon = async (req, res, next) => {
  try {
    const { code } = req.body;
    if (!code) {
      return errorResponse(res, 400, 'Coupon code is required');
    }

    const coupon = await Coupon.findOne({
      code: code.trim().toUpperCase(),
      isActive: true,
      expiryDate: { $gt: new Date() }
    });

    if (!coupon) {
      return errorResponse(res, 400, 'Invalid or expired coupon code');
    }

    if (coupon.usageLimit && coupon.usageCount >= coupon.usageLimit) {
      return errorResponse(res, 400, 'Coupon usage limit has been reached');
    }

    const cart = await getCartInstance(req);
    const currentDetails = await formatCartResponse(cart);

    if (currentDetails.subtotal < coupon.minimumOrderAmount) {
      return errorResponse(
        res,
        400,
        `This coupon requires a minimum cart subtotal of PKR ${coupon.minimumOrderAmount.toLocaleString()}`
      );
    }

    cart.coupon = {
      code: coupon.code,
      discountType: coupon.discountType,
      discountValue: coupon.discountValue,
      calculatedDiscount: 0
    };

    await cart.save();
    const formatted = await formatCartResponse(cart);
    return successResponse(res, 200, `Coupon "${coupon.code}" applied successfully!`, formatted);
  } catch (err) {
    next(err);
  }
};

// @desc    Remove coupon from cart
// @route   DELETE /api/v1/cart/coupon
// @access  Public (Optional Auth)
export const removeCoupon = async (req, res, next) => {
  try {
    const cart = await getCartInstance(req);
    cart.coupon = null;
    await cart.save();

    const formatted = await formatCartResponse(cart);
    return successResponse(res, 200, 'Coupon removed', formatted);
  } catch (err) {
    next(err);
  }
};

// @desc    Clear all items in cart
// @route   DELETE /api/v1/cart
// @access  Public (Optional Auth)
export const clearCart = async (req, res, next) => {
  try {
    const cart = await getCartInstance(req);
    cart.items = [];
    cart.coupon = null;
    await cart.save();

    const formatted = await formatCartResponse(cart);
    return successResponse(res, 200, 'Cart cleared', formatted);
  } catch (err) {
    next(err);
  }
};

// @desc    Synchronize guest cart into authenticated user cart
// @route   POST /api/v1/cart/sync
// @access  Private
export const syncGuestCart = async (req, res, next) => {
  try {
    const { sessionId } = req.body;
    if (!sessionId) {
      return errorResponse(res, 400, 'Session ID required for synchronization');
    }

    const guestCart = await Cart.findOne({ sessionId });
    if (!guestCart || guestCart.items.length === 0) {
      const userCart = await Cart.findOne({ user: req.user._id });
      const formatted = await formatCartResponse(userCart);
      return successResponse(res, 200, 'Cart synchronized', formatted);
    }

    let userCart = await Cart.findOne({ user: req.user._id });
    if (!userCart) {
      userCart = await Cart.create({ user: req.user._id, items: [] });
    }

    // Merge items
    for (const gItem of guestCart.items) {
      const existing = userCart.items.find(
        uItem => uItem.product.toString() === gItem.product.toString()
      );
      if (existing) {
        existing.quantity += gItem.quantity;
      } else {
        userCart.items.push(gItem);
      }
    }

    if (guestCart.coupon && !userCart.coupon) {
      userCart.coupon = guestCart.coupon;
    }

    await userCart.save();
    await Cart.deleteOne({ _id: guestCart._id });

    const formatted = await formatCartResponse(userCart);
    return successResponse(res, 200, 'Guest cart successfully synchronized', formatted);
  } catch (err) {
    next(err);
  }
};
