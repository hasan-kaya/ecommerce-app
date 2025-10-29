import { Router, Request, Response } from 'express';

import { asyncHandler } from '@/common/middleware/error';
import { sendSuccess } from '@/common/utils/response';
import { ProductService } from '@/services/ProductService';

const router = Router();
const productService = new ProductService();

router.get(
  '/',
  asyncHandler(async (req: Request, res: Response) => {
    const products = await productService.getAllProducts();
    return sendSuccess(res, products);
  })
);

export default router;
