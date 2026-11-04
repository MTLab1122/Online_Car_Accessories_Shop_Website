import Coupon from '../models/Coupon.js';
import { successResponse, errorResponse } from '../utils/apiResponse.js';

// @desc    Validate coupon code against cart total
// @route   POST /api/v1/coupons/validate
// @access  Public
export const validateCoupon = async (req, res, next) => {
  try {
    const { code, cartTotal = 0 } = req.body;

    if (!code) {
      return errorResponse(res, 400, 'Coupon code is required');
    }

    const coupon = await Coupon.findOne({
      code: code.trim().toUpperCase(),
      isActive: true,
      expiryDate: { $gt: new Date() }
    });

    if (!coupon) {
      return errorResponse(res, 400, 'Invalid or expired coupon code.');
    }

    if (coupon.usageLimit && coupon.usageCount >= coupon.usageLimit) {
      return errorResponse(res, 400, 'This coupon has reached its maximum usage limit.');
    }

    if (cartTotal < coupon.minimumOrderAmount) {
      return errorResponse(
        res,
        400,
        `This coupon requires a minimum order subtotal of PKR ${coupon.minimumOrderAmount.toLocaleString()}`
      );
    }

    let discount = 0;
    if (coupon.discountType === 'percentage') {
      discount = Math.round((cartTotal * coupon.discountValue) / 100);
      if (coupon.maximumDiscount && discount > coupon.maximumDiscount) {
        discount = coupon.maximumDiscount;
      }
    } else {
      discount = Math.min(coupon.discountValue, cartTotal);
    }

    return successResponse(res, 200, `Coupon "${coupon.code}" is valid!`, {
      code: coupon.code,
      discountType: coupon.discountType,
      discountValue: coupon.discountValue,
      discountAmount: discount
    });
  } catch (err) {
    next(err);
  }
};
