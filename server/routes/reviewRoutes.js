import express from 'express';
import {
  getProductReviews,
  createReview,
  updateReview,
  deleteReview
} from '../controllers/reviewController.js';
import { protect } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import { createReviewSchema } from '../validators/reviewValidator.js';

const router = express.Router();

router.get('/product/:productId', getProductReviews);

// Protected review operations
router.post('/', protect, validate(createReviewSchema), createReview);
router.patch('/:id', protect, updateReview);
router.delete('/:id', protect, deleteReview);

export default router;
