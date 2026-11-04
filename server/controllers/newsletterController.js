import Newsletter from '../models/Newsletter.js';
import { successResponse, errorResponse } from '../utils/apiResponse.js';

// @desc    Subscribe to newsletter
// @route   POST /api/v1/newsletter/subscribe
// @access  Public
export const subscribe = async (req, res, next) => {
  try {
    const { email } = req.body;

    if (!email) {
      return errorResponse(res, 400, 'Email address is required');
    }

    const existing = await Newsletter.findOne({ email: email.toLowerCase() });
    if (existing) {
      if (!existing.isSubscribed) {
        existing.isSubscribed = true;
        await existing.save();
        return successResponse(res, 200, 'Welcome back! Your newsletter subscription has been reactivated.');
      }
      return successResponse(res, 200, 'You are already subscribed to the AUTOX newsletter.');
    }

    const sub = await Newsletter.create({ email: email.toLowerCase(), isSubscribed: true });
    return successResponse(res, 201, 'Thank you for subscribing to AUTOX updates and exclusive offers!', { email: sub.email });
  } catch (err) {
    next(err);
  }
};

// @desc    Unsubscribe from newsletter
// @route   POST /api/v1/newsletter/unsubscribe
// @access  Public
export const unsubscribe = async (req, res, next) => {
  try {
    const { email } = req.body;
    if (!email) {
      return errorResponse(res, 400, 'Email address is required');
    }

    const subscriber = await Newsletter.findOne({ email: email.toLowerCase() });
    if (subscriber) {
      subscriber.isSubscribed = false;
      await subscriber.save();
    }

    return successResponse(res, 200, 'You have been unsubscribed from the newsletter.');
  } catch (err) {
    next(err);
  }
};

