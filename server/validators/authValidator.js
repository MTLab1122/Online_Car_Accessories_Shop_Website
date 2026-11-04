import { z } from 'zod';

export const registerSchema = z.object({
  body: z.object({
    name: z.string().min(2, 'Name must be at least 2 characters').max(100),
    email: z.string().email('Please enter a valid email address'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
    phone: z.string().optional()
  })
});

export const loginSchema = z.object({
  body: z.object({
    email: z.string().email('Please enter a valid email address'),
    password: z.string().min(1, 'Password is required')
  })
});

export const forgotPasswordSchema = z.object({
  body: z.object({
    email: z.string().email('Please enter a valid email address')
  })
});

export const resetPasswordSchema = z.object({
  body: z.object({
    token: z.string().min(1, 'Token is required'),
    password: z.string().min(6, 'Password must be at least 6 characters')
  })
});

export const updateProfileSchema = z.object({
  body: z.object({
    name: z.string().min(2).max(100).optional(),
    phone: z.string().optional(),
    avatar: z.string().optional()
  })
});

export const updatePasswordSchema = z.object({
  body: z.object({
    currentPassword: z.string().min(1, 'Current password is required'),
    newPassword: z.string().min(6, 'New password must be at least 6 characters')
  })
});

export const addressSchema = z.object({
  body: z.object({
    fullName: z.string().min(2, 'Full name is required'),
    phone: z.string().min(7, 'Valid phone number is required'),
    street: z.string().min(3, 'Street address is required'),
    city: z.string().min(2, 'City is required'),
    province: z.string().min(2, 'Province is required'),
    postalCode: z.string().min(3, 'Postal code is required'),
    isDefault: z.boolean().optional()
  })
});

