import Category from '../models/Category.js';
import Product from '../models/Product.js';
import { successResponse, errorResponse } from '../utils/apiResponse.js';

// @desc    Get all active categories with product counts
// @route   GET /api/v1/categories
// @access  Public
export const getCategories = async (req, res, next) => {
  try {
    const categories = await Category.find({ isActive: true }).sort({ name: 1 });

    // Include product count per category
    const categoriesWithCount = await Promise.all(
      categories.map(async (cat) => {
        const count = await Product.countDocuments({ category: cat._id, isActive: true });
        return {
          ...cat.toObject(),
          productCount: count
        };
      })
    );

    return successResponse(res, 200, 'Categories retrieved successfully', categoriesWithCount);
  } catch (err) {
    next(err);
  }
};

// @desc    Get single category by slug
// @route   GET /api/v1/categories/:slug
// @access  Public
export const getCategoryBySlug = async (req, res, next) => {
  try {
    const { slug } = req.params;
    const category = await Category.findOne({ slug, isActive: true });

    if (!category) {
      return errorResponse(res, 404, 'Category not found');
    }

    const products = await Product.find({ category: category._id, isActive: true })
      .populate('category', 'name slug')
      .sort({ createdAt: -1 });

    return successResponse(res, 200, 'Category and products retrieved', {
      category,
      products
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Create category (Admin)
// @route   POST /api/v1/categories
// @access  Private/Admin
export const createCategory = async (req, res, next) => {
  try {
    const { name, description, image } = req.body;
    const existing = await Category.findOne({ name });
    if (existing) {
      return errorResponse(res, 400, 'A category with this name already exists.');
    }

    const category = await Category.create({ name, description, image });
    return successResponse(res, 201, 'Category created successfully', category);
  } catch (err) {
    next(err);
  }
};

// @desc    Update category (Admin)
// @route   PATCH /api/v1/categories/:id
// @access  Private/Admin
export const updateCategory = async (req, res, next) => {
  try {
    const category = await Category.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!category) {
      return errorResponse(res, 404, 'Category not found');
    }

    return successResponse(res, 200, 'Category updated successfully', category);
  } catch (err) {
    next(err);
  }
};

// @desc    Delete category (Admin)
// @route   DELETE /api/v1/categories/:id
// @access  Private/Admin
export const deleteCategory = async (req, res, next) => {
  try {
    // Check if category has associated products
    const associatedProducts = await Product.countDocuments({ category: req.params.id });
    if (associatedProducts > 0) {
      return errorResponse(
        res,
        400,
        `Cannot delete category. ${associatedProducts} product(s) are currently assigned to it. Reassign or remove them first.`
      );
    }

    const category = await Category.findByIdAndDelete(req.params.id);
    if (!category) {
      return errorResponse(res, 404, 'Category not found');
    }

    return successResponse(res, 200, 'Category deleted successfully');
  } catch (err) {
    next(err);
  }
};

