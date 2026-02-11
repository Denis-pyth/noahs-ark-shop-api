import { z } from 'zod';

export const createProductSchema = z.object({
  name: z.string().min(1, 'Product name is required'),
  description: z.string().optional(),
  price: z.number().positive('Price must be greater than zero'),
  stock: z.number().int().min(0, 'Stock cannot be negative').default(0),
  image_url: z.string().url('Invalid image URL').optional(),
  brand: z.string().optional(),
  is_active: z.boolean().default(false)
});

export const updateProductSchema = z.object({
  name: z.string().min(1).optional(),
  description: z.string().optional(),
  price: z.coerce.number().positive(),
  stock:  z.coerce.number().int().min(0).default(0),
  image_url: z.string().url().optional(),
  brand: z.string().optional(),
  is_active: z.coerce.boolean().default(false)
}).refine(data => Object.keys(data).length > 0, {
  message: 'At least one field must be provided for update'
});

export const productIdSchema = z.object({
  id: z.string().regex(/^\d+$/, 'Invalid product ID').transform(Number)
});