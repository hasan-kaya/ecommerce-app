import { Scope } from '@/auth/scopes';
import { GraphQLContext, requireScope } from '@/graphql/utils/auth';
import { CategoryService } from '@/services/CategoryService';

const categoryService = new CategoryService();

export const categoryResolvers = {
  Query: {
    categories: async (_: any, { page = 1, pageSize = 10 }: { page?: number; pageSize?: number }) => {
      return categoryService.getCategories(page, pageSize);
    },
  },
  Mutation: {
    createCategory: async (
      _: any,
      { input }: { input: { name: string; slug: string } },
      context: GraphQLContext
    ) => {
      requireScope(context, Scope.CATEGORIES_WRITE);
      return categoryService.createCategory(input);
    },
    updateCategory: async (
      _: any,
      { id, input }: { id: string; input: { name: string; slug: string } },
      context: GraphQLContext
    ) => {
      requireScope(context, Scope.CATEGORIES_WRITE);
      return categoryService.updateCategory(id, input);
    },
    deleteCategory: async (_: any, { id }: { id: string }, context: GraphQLContext) => {
      requireScope(context, Scope.CATEGORIES_WRITE);
      return categoryService.deleteCategory(id);
    },
  },
};
