import { z } from 'zod';

export const validateCouponSchema = z.object({
  body: z.object({
    code: z.string().min(1, 'Coupon code is required'),
    cartTotal: z.coerce.number().min(0, 'Cart total must be positive')
  })
});

export const createCouponSchema = z.object({
  body: z.object({
    code: z.string().min(2, 'Code must be at least 2 characters').toUpperCase(),
    discountType: z.enum(['percentage', 'fixed']),
    discountValue: z.coerce.number().positive('Discount value must be positive'),
    minimumOrderAmount: z.coerce.number().min(0).optional().default(0),
    maximumDiscount: z.coerce.number().positive().optional().nullable(),
    startDate: z.string().or(z.date()).optional(),
    expiryDate: z.string().or(z.date()),
    usageLimit: z.coerce.number().int().positive().optional().default(100),
    perUserLimit: z.coerce.number().int().positive().optional().default(1),
    isActive: z.boolean().optional().default(true)
  })
});
