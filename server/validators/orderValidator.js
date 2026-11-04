import { z } from 'zod';

export const createOrderSchema = z.object({
  body: z.object({
    shippingAddress: z.object({
      fullName: z.string().min(2, 'Full name is required'),
      phone: z.string().min(7, 'Phone number is required'),
      street: z.string().min(3, 'Street address is required'),
      city: z.string().min(2, 'City is required'),
      province: z.string().min(2, 'Province is required'),
      postalCode: z.string().min(3, 'Postal code is required'),
      deliveryInstructions: z.string().optional()
    }),
    paymentMethod: z.enum(['cod', 'simulated_card'], {
      errorMap: () => ({ message: 'Payment method must be Cash on Delivery (cod) or Simulated Card (simulated_card)' })
    }),
    couponCode: z.string().optional(),
    simulatedPaymentDetails: z.object({
      cardNumber: z.string().optional(),
      cardHolder: z.string().optional(),
      expiry: z.string().optional(),
      isDemoConfirmed: z.boolean().optional()
    }).optional()
  })
});

export const updateOrderStatusSchema = z.object({
  body: z.object({
    orderStatus: z.enum(['placed', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled']),
    note: z.string().optional(),
    location: z.string().optional(),
    paymentStatus: z.enum(['pending', 'completed', 'failed', 'refunded']).optional()
  })
});

export const cancelOrderSchema = z.object({
  body: z.object({
    reason: z.string().min(3, 'Cancellation reason is required')
  })
});

