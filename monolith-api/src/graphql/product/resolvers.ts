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
  Product: {
    priceMinor: (parent: any) => parent.price_minor.toString(),
    stockQty: (parent: any) => parent.stock_qty,
  },
};
