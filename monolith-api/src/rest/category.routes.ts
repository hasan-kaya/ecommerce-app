import { Router, Request, Response } from 'express';
import { sendSuccess } from "@/common/utils/response";
import { CategoryService } from "@/services/CategoryService";
import { asyncHandler } from '@/common/middleware/error';

const router = Router();
const categoryService = new CategoryService();

router.get('/', asyncHandler(async (req: Request, res: Response) => {
  const categories = await categoryService.getAllCategories();
  return sendSuccess(res, categories);
}));

export default router;

