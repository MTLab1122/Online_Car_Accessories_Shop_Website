import Wishlist from '../models/Wishlist.js';
import Product from '../models/Product.js';
import { successResponse, errorResponse } from '../utils/apiResponse.js';

// @desc    Get user wishlist
// @route   GET /api/v1/wishlist
// @access  Private
export const getWishlist = async (req, res, next) => {
  try {
    let wishlist = await Wishlist.findOne({ user: req.user._id }).populate({
      path: 'products',
      select: 'name slug price discountPercentage stock images brand ratingAverage ratingCount'
    });

    if (!wishlist) {
      wishlist = await Wishlist.create({ user: req.user._id, products: [] });
    }

    // Filter out nulls in case any product was deleted
    wishlist.products = wishlist.products.filter(p => p !== null);

    return successResponse(res, 200, 'Wishlist retrieved', wishlist.products);
  } catch (err) {
    next(err);
  }
};

// @desc    Add product to wishlist
// @route   POST /api/v1/wishlist/:productId
// @access  Private
export const addToWishlist = async (req, res, next) => {
  try {
    const { productId } = req.params;

    const product = await Product.findById(productId);
    if (!product) {
      return errorResponse(res, 404, 'Product not found');
    }

    let wishlist = await Wishlist.findOne({ user: req.user._id });
    if (!wishlist) {
      wishlist = await Wishlist.create({ user: req.user._id, products: [] });
    }

    if (!wishlist.products.includes(productId)) {
      wishlist.products.push(productId);
      await wishlist.save();
    }

    await wishlist.populate({
      path: 'products',
      select: 'name slug price discountPercentage stock images brand ratingAverage ratingCount'
    });

    return successResponse(res, 200, 'Added to wishlist', wishlist.products);
  } catch (err) {
    next(err);
  }
};

// @desc    Remove product from wishlist
// @route   DELETE /api/v1/wishlist/:productId
// @access  Private
export const removeFromWishlist = async (req, res, next) => {
  try {
    const { productId } = req.params;
    let wishlist = await Wishlist.findOne({ user: req.user._id });

    if (wishlist) {
      wishlist.products = wishlist.products.filter(p => p.toString() !== productId);
      await wishlist.save();
      await wishlist.populate({
        path: 'products',
        select: 'name slug price discountPercentage stock images brand ratingAverage ratingCount'
      });
    }

    return successResponse(res, 200, 'Removed from wishlist', wishlist ? wishlist.products : []);
  } catch (err) {
    next(err);
  }
};
