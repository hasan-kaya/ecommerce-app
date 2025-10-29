import { Router, Request, Response } from 'express';
import { ProductService } from '@/services/ProductService';
import { sendSuccess } from '@/common/utils/response';
import { asyncHandler } from '@/common/middleware/error';

const router = Router();
const productService = new ProductService();

router.get('/', asyncHandler(async (req: Request, res: Response) => {
  const products = await productService.getAllProducts();
  return sendSuccess(res, products);
}));

export default router;
