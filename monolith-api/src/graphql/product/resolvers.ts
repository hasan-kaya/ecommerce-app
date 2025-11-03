import { Scope } from '@/auth/scopes';
import { GraphQLContext, requireScope } from '@/graphql/utils/auth';
import { ProductService } from '@/services/ProductService';

const productService = new ProductService();

interface ProductsArgs {
  category?: string;
  search?: string;
  page?: number;
  pageSize?: number;
}

export const productResolvers = {
  Query: {
    products: async (_: any, { category, search, page = 1, pageSize = 10 }: ProductsArgs) => {
      return productService.getProducts(page, pageSize, category, search);
    },
  },
  Mutation: {
    createProduct: async (
      _: any,
      {
        input,
      }: {
        input: {
          name: string;
          slug: string;
          priceMinor: string;
          currency: string;
          stockQty: number;
          categoryId: string;
        };
      },
      context: GraphQLContext
    ) => {
      requireScope(context, Scope.PRODUCTS_WRITE);
      return productService.createProduct(input);
    },
    updateProduct: async (
      _: any,
      {
        id,
        input,
      }: {
        id: string;
        input: {
          name: string;
          slug: string;
          priceMinor: string;
          currency: string;
          stockQty: number;
          categoryId: string;
        };
      },
      context: GraphQLContext
    ) => {
      requireScope(context, Scope.PRODUCTS_WRITE);
      return productService.updateProduct(id, input);
    },
    deleteProduct: async (_: any, { id }: { id: string }, context: GraphQLContext) => {
      requireScope(context, Scope.PRODUCTS_WRITE);
      return productService.deleteProduct(id);
    },
  },
  Product: {
    stockQty: (parent: any) => parent.stock_qty,
  },
};
