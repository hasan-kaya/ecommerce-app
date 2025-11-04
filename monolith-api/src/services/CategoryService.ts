import { AppError } from '@/common/middleware/error';
import { CategoryRepository } from '@/repositories/CategoryRepository';
import { CacheService } from '@/services/CacheService';

export class CategoryService {
  private categoryRepository = new CategoryRepository();
  private cacheService = new CacheService();
  private readonly CATEGORIES_TTL = 300; // 5 minutes

  async getAllCategories() {
    const cacheKey = this.cacheService.getCategoriesKey();
    const cached = await this.cacheService.get(cacheKey);
    if (cached) {
      return cached;
    }

    const categories = await this.categoryRepository.findAll();
    await this.cacheService.set(cacheKey, categories, this.CATEGORIES_TTL);
    return categories;
  }

  async getCategories(page: number = 1, pageSize: number = 10) {
    return this.categoryRepository.findWithPagination(page, pageSize);
  }

  async getCategoryById(id: string) {
    const category = await this.categoryRepository.findById(id);
    if (!category) {
      throw new AppError('Category not found', 404);
    }
    return category;
  }

  async createCategory(data: { name: string; slug: string }) {
    const existingCategory = await this.categoryRepository.findBySlug(data.slug);
    if (existingCategory) {
      throw new AppError('Category with this slug already exists', 409);
    }

    const category = await this.categoryRepository.create(data);

    // Invalidate categories cache
    await this.cacheService.del(this.cacheService.getCategoriesKey());

    return category;
  }

  async updateCategory(id: string, data: { name: string; slug: string }) {
    const category = await this.categoryRepository.findById(id);
    if (!category) {
      throw new AppError('Category not found', 404);
    }

    const existingCategory = await this.categoryRepository.findBySlug(data.slug);
    if (existingCategory && existingCategory.id !== id) {
      throw new AppError('Category with this slug already exists', 409);
    }

    const updated = await this.categoryRepository.update(id, data);
    if (!updated) {
      throw new AppError('Failed to update category', 500);
    }

    // Invalidate categories cache and all products in this category
    await this.cacheService.del(this.cacheService.getCategoriesKey());
    await this.cacheService.delPattern(
      this.cacheService.getProductsPatternByCategory(category.slug)
    );

    return updated;
  }

  async deleteCategory(id: string) {
    const category = await this.categoryRepository.findById(id);
    if (!category) {
      throw new AppError('Category not found', 404);
    }

    const result = await this.categoryRepository.delete(id);

    // Invalidate categories cache and all products in this category
    await this.cacheService.del(this.cacheService.getCategoriesKey());
    await this.cacheService.delPattern(
      this.cacheService.getProductsPatternByCategory(category.slug)
    );

    return result;
  }
}
