import { AppError } from '@/common/middleware/error';
import { ProductRepository } from '@/repositories/ProductRepository';

export class ProductService {
  private productRepository = new ProductRepository();

  async getAllProducts(categorySlug?: string, search?: string) {
    return this.productRepository.findAll(categorySlug, search);
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
