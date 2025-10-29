import { Router, Response } from 'express';

import { authenticate, AuthRequest } from '@/auth/middleware';
import { asyncHandler } from '@/common/middleware/error';
import { sendSuccess } from '@/common/utils/response';
import { WalletService } from '@/services/WalletService';
import { walletTopUpSchema } from '@/validators/wallet.validators';

const router = Router();
const walletService = new WalletService();

router.get(
  '/',
  authenticate,
  asyncHandler(async (req: AuthRequest, res: Response) => {
    const wallets = await walletService.getUserWallets(req.user!.userId);
    return sendSuccess(res, wallets);
  })
);

router.post(
  '/top-up',
  authenticate,
  asyncHandler(async (req: AuthRequest, res: Response) => {
    const validatedData = walletTopUpSchema.parse(req.body);
    const { currency, amountMinor } = validatedData;
    const updatedWallet = await walletService.topUpUserWallet(
      req.user!.userId,
      currency,
      amountMinor
    );
    return sendSuccess(res, updatedWallet);
  })
);

export default router;
