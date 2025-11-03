import { AppError } from '@/common/middleware/error';
import { CategoryRepository } from '@/repositories/CategoryRepository';

export class CategoryService {
  private categoryRepository = new CategoryRepository();

  async getAllCategories() {
    return this.categoryRepository.findAll();
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

    return this.categoryRepository.create(data);
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
    return updated;
  }

  async deleteCategory(id: string) {
    const category = await this.categoryRepository.findById(id);
    if (!category) {
      throw new AppError('Category not found', 404);
    }

    return this.categoryRepository.delete(id);
  }
}
