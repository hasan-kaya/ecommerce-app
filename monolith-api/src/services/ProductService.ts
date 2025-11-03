import { AppError } from '@/common/middleware/error';
import { ProductRepository } from '@/repositories/ProductRepository';

export class ProductService {
  private productRepository = new ProductRepository();

  async getProducts(
    page: number = 1,
    pageSize: number = 10,
    categorySlug?: string,
    search?: string
  ) {
    return this.productRepository.findWithPagination(page, pageSize, categorySlug, search);
  }

  async getProduct(productId: string) {
    const product = await this.productRepository.findById(productId);
    if (!product) {
      throw new AppError('Product not found', 404);
    }
    return product;
  }

  async decreaseProductStock(productId: string, quantity: number) {
    const product = await this.productRepository.decreaseStock(productId, quantity);
    if (!product) {
      throw new AppError('Product not found', 404);
    }
    return product;
  }
}
