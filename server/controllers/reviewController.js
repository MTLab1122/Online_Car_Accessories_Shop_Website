import Review from '../models/Review.js';
import Order from '../models/Order.js';
import Product from '../models/Product.js';
import { successResponse, errorResponse } from '../utils/apiResponse.js';

// @desc    Get approved reviews for a product
// @route   GET /api/v1/reviews/product/:productId
// @access  Public
export const getProductReviews = async (req, res, next) => {
  try {
    const { productId } = req.params;
    const reviews = await Review.find({
      product: productId,
      status: 'approved'
    })
      .populate('user', 'name avatar')
      .sort({ createdAt: -1 });

    return successResponse(res, 200, 'Reviews retrieved', reviews);
  } catch (err) {
    next(err);
  }
};

// @desc    Create review (Verified purchases only)
// @route   POST /api/v1/reviews
// @access  Private
export const createReview = async (req, res, next) => {
  try {
    const { productId, rating, title, comment } = req.body;

    const product = await Product.findById(productId);
    if (!product) {
      return errorResponse(res, 404, 'Product not found');
    }

    // Check if user already reviewed this product
    const existingReview = await Review.findOne({
      user: req.user._id,
      product: productId
    });

    if (existingReview) {
      return errorResponse(res, 400, 'You have already submitted a review for this product.');
    }

    // Verify user actually purchased this product in an active or delivered order
    const eligibleOrder = await Order.findOne({
      user: req.user._id,
      'items.product': productId,
      orderStatus: { $in: ['shipped', 'delivered', 'processing', 'confirmed', 'placed'] }
    });

    if (!eligibleOrder) {
      return errorResponse(
        res,
        403,
        'Only verified buyers who have purchased this item can leave a review.'
      );
    }

    const review = await Review.create({
      user: req.user._id,
      product: productId,
      order: eligibleOrder._id,
      rating,
      title,
      comment,
      status: 'approved' // Automatically approve verified buyer reviews
    });

    await review.populate('user', 'name avatar');
    return successResponse(res, 201, 'Review submitted successfully', review);
  } catch (err) {
    next(err);
  }
};

// @desc    Update own review
// @route   PATCH /api/v1/reviews/:id
// @access  Private
export const updateReview = async (req, res, next) => {
  try {
    const review = await Review.findById(req.params.id);
    if (!review) {
      return errorResponse(res, 404, 'Review not found');
    }

    if (review.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return errorResponse(res, 403, 'Unauthorized to edit this review');
    }

    const { rating, title, comment } = req.body;
    if (rating !== undefined) review.rating = rating;
    if (title !== undefined) review.title = title;
    if (comment !== undefined) review.comment = comment;

    await review.save();
    return successResponse(res, 200, 'Review updated successfully', review);
  } catch (err) {
    next(err);
  }
};

// @desc    Delete own review
// @route   DELETE /api/v1/reviews/:id
// @access  Private
export const deleteReview = async (req, res, next) => {
  try {
    const review = await Review.findById(req.params.id);
    if (!review) {
      return errorResponse(res, 404, 'Review not found');
    }

    if (review.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return errorResponse(res, 403, 'Unauthorized to delete this review');
    }

    const productId = review.product;
    await Review.findByIdAndDelete(req.params.id);

    // Recalculate average ratings
    await Review.calcAverageRatings(productId);

    return successResponse(res, 200, 'Review removed successfully');
  } catch (err) {
    next(err);
  }
};
