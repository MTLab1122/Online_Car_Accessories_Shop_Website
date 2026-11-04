import Product from '../models/Product.js';
import Category from '../models/Category.js';
import { successResponse, errorResponse } from '../utils/apiResponse.js';

// @desc    Get all products with filtering, search, sorting & pagination
// @route   GET /api/v1/products
// @access  Public
export const getProducts = async (req, res, next) => {
  try {
    const {
      search,
      category,
      brand,
      minPrice,
      maxPrice,
      rating,
      inStock,
      sort,
      featured,
      bestSeller,
      page = 1,
      limit = 12
    } = req.query;

    const query = { isActive: true };

    // Search keyword
    if (search && search.trim() !== '') {
      query.$or = [
        { name: { $regex: search.trim(), $options: 'i' } },
        { description: { $regex: search.trim(), $options: 'i' } },
        { brand: { $regex: search.trim(), $options: 'i' } },
        { SKU: { $regex: search.trim(), $options: 'i' } }
      ];
    }

    // Category filter by category slug or ObjectId
    if (category && category.trim() !== '') {
      if (category.match(/^[0-9a-fA-F]{24}$/)) {
        query.category = category;
      } else {
        const cat = await Category.findOne({ slug: category.toLowerCase() });
        if (cat) {
          query.category = cat._id;
        } else {
          // If category doesn't exist, return empty
          return successResponse(res, 200, 'Products retrieved successfully', [], {
            page: Number(page),
            limit: Number(limit),
            total: 0,
            totalPages: 0
          });
        }
      }
    }

    // Brand filter (supports comma-separated)
    if (brand && brand.trim() !== '') {
      const brands = brand.split(',').map(b => b.trim()).filter(Boolean);
      if (brands.length > 0) {
        query.brand = { $in: brands.map(b => new RegExp(`^${b}$`, 'i')) };
      }
    }

    // Price range
    const hasMin = minPrice !== undefined && minPrice !== '' && !isNaN(Number(minPrice));
    const hasMax = maxPrice !== undefined && maxPrice !== '' && !isNaN(Number(maxPrice));
    if (hasMin || hasMax) {
      query.price = {};
      if (hasMin) query.price.$gte = Number(minPrice);
      if (hasMax) query.price.$lte = Number(maxPrice);
    }

    // Minimum rating
    if (rating !== undefined && rating !== '' && !isNaN(Number(rating))) {
      query.ratingAverage = { $gte: Number(rating) };
    }

    // Stock availability
    if (inStock === 'true' || inStock === true) {
      query.stock = { $gt: 0 };
    }

    if (featured === 'true') {
      query.isFeatured = true;
    }

    if (bestSeller === 'true') {
      query.isBestSeller = true;
    }

    // Sorting
    let sortOptions = { createdAt: -1 };
    if (sort) {
      switch (sort) {
        case 'price-asc':
          sortOptions = { price: 1 };
          break;
        case 'price-desc':
          sortOptions = { price: -1 };
          break;
        case 'rating':
          sortOptions = { ratingAverage: -1 };
          break;
        case 'newest':
          sortOptions = { createdAt: -1 };
          break;
        case 'name-asc':
          sortOptions = { name: 1 };
          break;
        case 'name-desc':
          sortOptions = { name: -1 };
          break;
        default:
          sortOptions = { createdAt: -1 };
      }
    }

    const pageNum = Math.max(1, parseInt(page, 10));
    const limitNum = Math.max(1, parseInt(limit, 10));
    const skip = (pageNum - 1) * limitNum;

    const [products, total] = await Promise.all([
      Product.find(query)
        .populate('category', 'name slug')
        .sort(sortOptions)
        .skip(skip)
        .limit(limitNum),
      Product.countDocuments(query)
    ]);

    const totalPages = Math.ceil(total / limitNum);

    return successResponse(res, 200, 'Products retrieved successfully', products, {
      page: pageNum,
      limit: limitNum,
      total,
      totalPages
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get featured and trending products
// @route   GET /api/v1/products/featured
// @access  Public
export const getFeaturedProducts = async (req, res, next) => {
  try {
    const [featured, bestSellers] = await Promise.all([
      Product.find({ isActive: true, isFeatured: true })
        .populate('category', 'name slug')
        .limit(8),
      Product.find({ isActive: true, isBestSeller: true })
        .populate('category', 'name slug')
        .limit(8)
    ]);

    return successResponse(res, 200, 'Featured products retrieved', {
      featured,
      bestSellers
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get product by slug or id
// @route   GET /api/v1/products/:slug
// @access  Public
export const getProductBySlug = async (req, res, next) => {
  try {
    const { slug } = req.params;
    let product;

    if (slug.match(/^[0-9a-fA-F]{24}$/)) {
      product = await Product.findById(slug).populate('category', 'name slug');
    } else {
      product = await Product.findOne({ slug }).populate('category', 'name slug');
    }

    if (!product) {
      return errorResponse(res, 404, 'Product not found');
    }

    // Fetch related products in the same category
    const related = await Product.find({
      category: product.category._id,
      _id: { $ne: product._id },
      isActive: true
    }).limit(4);

    return successResponse(res, 200, 'Product details retrieved', {
      product,
      related
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Create product (Admin)
// @route   POST /api/v1/products
// @access  Private/Admin
export const createProduct = async (req, res, next) => {
  try {
    const product = await Product.create(req.body);
    return successResponse(res, 201, 'Product created successfully', product);
  } catch (err) {
    next(err);
  }
};

// @desc    Update product (Admin)
// @route   PATCH /api/v1/products/:id
// @access  Private/Admin
export const updateProduct = async (req, res, next) => {
  try {
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate('category', 'name slug');

    if (!product) {
      return errorResponse(res, 404, 'Product not found');
    }

    return successResponse(res, 200, 'Product updated successfully', product);
  } catch (err) {
    next(err);
  }
};

// @desc    Delete product (Admin)
// @route   DELETE /api/v1/products/:id
// @access  Private/Admin
export const deleteProduct = async (req, res, next) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);

    if (!product) {
      return errorResponse(res, 404, 'Product not found');
    }

    return successResponse(res, 200, 'Product deleted successfully');
  } catch (err) {
    next(err);
  }
};

