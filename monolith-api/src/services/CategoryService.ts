import { GraphQLError } from 'graphql';

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
      throw new GraphQLError('Category not found', {
        extensions: { code: 'NOT_FOUND' },
      });
    }
    return category;
  }

  async createCategory(data: { name: string; slug: string }) {
    // Check if slug already exists
    const existingCategory = await this.categoryRepository.findBySlug(data.slug);
    if (existingCategory) {
      throw new GraphQLError('Category with this slug already exists', {
        extensions: { code: 'CONFLICT' },
      });
    }

    return this.categoryRepository.create(data);
  }

  async updateCategory(id: string, data: { name: string; slug: string }) {
    // Check if category exists
    const category = await this.categoryRepository.findById(id);
    if (!category) {
      throw new GraphQLError('Category not found', {
        extensions: { code: 'NOT_FOUND' },
      });
    }

    // Check if slug is taken by another category
    const existingCategory = await this.categoryRepository.findBySlug(data.slug);
    if (existingCategory && existingCategory.id !== id) {
      throw new GraphQLError('Category with this slug already exists', {
        extensions: { code: 'CONFLICT' },
      });
    }

    const updated = await this.categoryRepository.update(id, data);
    if (!updated) {
      throw new GraphQLError('Failed to update category', {
        extensions: { code: 'INTERNAL_SERVER_ERROR' },
      });
    }
    return updated;
  }

  async deleteCategory(id: string) {
    // Check if category exists
    const category = await this.categoryRepository.findById(id);
    if (!category) {
      throw new GraphQLError('Category not found', {
        extensions: { code: 'NOT_FOUND' },
      });
    }

    return this.categoryRepository.delete(id);
  }
}
