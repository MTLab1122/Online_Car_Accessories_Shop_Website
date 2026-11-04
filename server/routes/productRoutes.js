import express from 'express';
import {
  getProducts,
  getFeaturedProducts,
  getProductBySlug,
  createProduct,
  updateProduct,
  deleteProduct
} from '../controllers/productController.js';
import { protect, authorize } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import { createProductSchema, updateProductSchema } from '../validators/productValidator.js';

const router = express.Router();

router.get('/', getProducts);
router.get('/featured', getFeaturedProducts);
router.get('/:slug', getProductBySlug);

// Admin-only product mutation routes
router.post('/', protect, authorize('admin'), validate(createProductSchema), createProduct);
router.patch('/:id', protect, authorize('admin'), validate(updateProductSchema), updateProduct);
router.put('/:id', protect, authorize('admin'), validate(updateProductSchema), updateProduct);
router.delete('/:id', protect, authorize('admin'), deleteProduct);

export default router;

