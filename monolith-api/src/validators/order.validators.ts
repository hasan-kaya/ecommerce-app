import { z } from 'zod';

export const createOrderSchema = z.object({
  walletCurrency: z.string().length(3, 'Currency must be 3 characters'),
});

export type CreateOrderInput = z.infer<typeof createOrderSchema>;
