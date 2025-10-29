import { z } from 'zod';

export const walletTopUpSchema = z.object({
  currency: z.string().min(3, 'Currency is required').max(3, 'Currency must be 3 characters'),
  amountMinor: z.number().min(1, 'Amount must be at least 1'),
});

export type WalletTopUpInput = z.infer<typeof walletTopUpSchema>;
