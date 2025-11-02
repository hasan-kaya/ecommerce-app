import { ProductService } from '@/services/ProductService';

const productService = new ProductService();

export const productResolvers = {
  Query: {
    products: async (_: any, { category, search }: { category?: string; search?: string }) => {
      return productService.getAllProducts(category, search);
    },
  },
  Product: {
    priceMinor: (parent: any) => parent.price_minor.toString(),
    stockQty: (parent: any) => parent.stock_qty,
  },
};
