import { Router, Response } from 'express';

import { authenticate, AuthRequest } from '@/auth/middleware';
import { asyncHandler } from '@/common/middleware/error';
import { sendSuccess } from '@/common/utils/response';
import { CartService } from '@/services/CartService';
import { addToCartSchema } from '@/validators/cart.validators';

const router = Router();
const cartService = new CartService();

router.post(
  '/items',
  authenticate,
  asyncHandler(async (req: AuthRequest, res: Response) => {
    const validatedData = addToCartSchema.parse(req.body);
    const userId = req.user!.userId;
    const { productId, qty } = validatedData;

    const cartItem = await cartService.addToCart(userId, productId, qty);
    return sendSuccess(res, cartItem, 201);
  })
);

export default router;
