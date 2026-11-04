import { z } from 'zod';

export const createProductSchema = z.object({
  body: z.object({
    name: z.string().min(3, 'Product name must be at least 3 characters').max(200),
    SKU: z.string().min(3, 'SKU must be at least 3 characters'),
    description: z.string().min(10, 'Description must be at least 10 characters'),
    shortDescription: z.string().optional(),
    category: z.string().min(1, 'Category is required'),
    brand: z.string().min(1, 'Brand is required'),
    price: z.coerce.number().positive('Price must be greater than zero'),
    discountPercentage: z.coerce.number().min(0).max(100).optional().default(0),
    stock: z.coerce.number().int().min(0, 'Stock cannot be negative'),
    images: z.array(z.string()).optional(),
    model3D: z.string().optional(),
    specifications: z.array(z.object({
      key: z.string(),
      value: z.string()
    })).optional(),
    isFeatured: z.boolean().optional(),
    isBestSeller: z.boolean().optional(),
    isActive: z.boolean().optional()
  })
});

export const updateProductSchema = z.object({
  body: z.object({
    name: z.string().min(3).max(200).optional(),
    SKU: z.string().min(3).optional(),
    description: z.string().min(10).optional(),
    shortDescription: z.string().optional(),
    category: z.string().optional(),
    brand: z.string().optional(),
    price: z.coerce.number().positive().optional(),
    discountPercentage: z.coerce.number().min(0).max(100).optional(),
    stock: z.coerce.number().int().min(0).optional(),
    images: z.array(z.string()).optional(),
    model3D: z.string().optional(),
    specifications: z.array(z.object({
      key: z.string(),
      value: z.string()
    })).optional(),
    isFeatured: z.boolean().optional(),
    isBestSeller: z.boolean().optional(),
    isActive: z.boolean().optional()
  })
});
