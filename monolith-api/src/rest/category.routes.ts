import { sendSuccess } from "@/common/utils/response";
import { CategoryService } from "@/services/CategoryService";
import { Router } from "express";

const router = Router();
const categoryService = new CategoryService();

router.get("/", async (req, res) => {
  const categories = await categoryService.getAllCategories();
  return sendSuccess(res, categories);
});

export default router;

