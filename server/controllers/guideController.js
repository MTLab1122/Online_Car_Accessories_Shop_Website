import { guidesData } from '../data/guidesData.js';
import { successResponse, errorResponse } from '../utils/apiResponse.js';

// @desc    Get all editorial automotive guides
// @route   GET /api/v1/guides
// @access  Public
export const getGuides = async (req, res, next) => {
  try {
    const list = guidesData.map(g => ({
      slug: g.slug,
      title: g.title,
      metaDescription: g.metaDescription,
      excerpt: g.excerpt,
      readTime: g.readTime,
      publishedAt: g.publishedAt,
      author: g.author,
      category: g.category,
      heroImage: g.heroImage
    }));

    return successResponse(res, 200, 'Guides retrieved successfully', list);
  } catch (err) {
    next(err);
  }
};

// @desc    Get single editorial guide by slug
// @route   GET /api/v1/guides/:slug
// @access  Public
export const getGuideBySlug = async (req, res, next) => {
  try {
    const { slug } = req.params;
    const guide = guidesData.find(g => g.slug === slug);

    if (!guide) {
      return errorResponse(res, 404, 'Editorial guide not found');
    }

    return successResponse(res, 200, 'Guide details retrieved', guide);
  } catch (err) {
    next(err);
  }
};

