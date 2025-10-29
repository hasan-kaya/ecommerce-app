import { z } from 'zod';

export const addToCartSchema = z.object({
  productId: z.string().min(2, 'Product ID is required'),
  qty: z.number().min(1, 'Quantity must be at least 1'),
});

export type AddToCartInput = z.infer<typeof addToCartSchema>;
