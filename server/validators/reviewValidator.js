import { z } from 'zod';

export const createReviewSchema = z.object({
  body: z.object({
    productId: z.string().min(1, 'Product ID is required'),
    rating: z.coerce.number().min(1).max(5, 'Rating must be between 1 and 5'),
    title: z.string().min(2, 'Title must be at least 2 characters').max(120),
    comment: z.string().min(5, 'Review comment must be at least 5 characters')
  })
});

export const updateReviewStatusSchema = z.object({
  body: z.object({
    status: z.enum(['pending', 'approved', 'hidden'])
  })
});
