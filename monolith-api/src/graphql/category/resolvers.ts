import { CategoryService } from '@/services/CategoryService';

const categoryService = new CategoryService();

export const categoryResolvers = {
  Query: {
    categories: async () => {
      return categoryService.getAllCategories();
    },
  },
};
