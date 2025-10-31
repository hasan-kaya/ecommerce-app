import { Router, Response } from 'express';

import { authenticate, AuthRequest, requireScopes } from '@/auth/middleware';
import { Scope } from '@/auth/scopes';
import { asyncHandler } from '@/common/middleware/error';
import { sendSuccess } from '@/common/utils/response';
import { OrderService } from '@/services/OrderService';
import { createOrderSchema } from '@/validators/order.validators';

const router = Router();
const orderService = new OrderService();

router.post(
  '/checkout',
  authenticate,
  requireScopes(Scope.ORDERS_WRITE, Scope.WALLET_READ),
  asyncHandler(async (req: AuthRequest, res: Response) => {
    const validatedData = createOrderSchema.parse(req.body);
    const { walletCurrency } = validatedData;

    const order = await orderService.createOrder(walletCurrency, req.user!.userId);

    sendSuccess(res, order);
  })
);

export default router;
