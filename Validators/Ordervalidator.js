import { z } from 'zod';

const orderItemSchema = z.object({
  productId: z.coerce.number().int().positive('Invalid product ID'),
  quantity: z.coerce.number().int().positive('Quantity must be at least 1')
});

export const createOrderSchema = z.object({
  items: z.array(orderItemSchema).min(1, 'Order must have at least one item'),
  shippingAddress: z.object({
    city: z.string().min(1, 'City is required'),
    shipping_address1: z.string().min(1, 'Shipping address is required'),
    shipping_address2: z.string().optional(),
    country: z.string().optional(),
    zip: z.number().int().optional()
  })
});

export const orderIdSchema = z.object({
  id: z.string().regex(/^\d+$/, 'Invalid order ID').transform(Number)
});

export const updateOrderStatusSchema = z.object({
  status: z.enum(['pending', 'paid', 'shipped', 'delivered', 'cancelled'], {
    errorMap: () => ({ message: 'Invalid order status' })
  })
});

export const paginationSchema = z.object({
  page:  z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().default(10)
});