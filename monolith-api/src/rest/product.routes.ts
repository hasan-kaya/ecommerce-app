import { Router, Request, Response } from 'express';

import { asyncHandler } from '@/common/middleware/error';
import { sendSuccess } from '@/common/utils/response';
import { ProductService } from '@/services/ProductService';

const router = Router();
const productService = new ProductService();

router.get(
  '/',
  asyncHandler(async (req: Request, res: Response) => {
    const { category, search, page, pageSize } = req.query;

    const result = await productService.getProducts(
      page ? Number(page) : 1,
      pageSize ? Number(pageSize) : 10,
      category as string | undefined,
      search as string | undefined
    );

    return sendSuccess(res, result);
  })
);

export default router;
