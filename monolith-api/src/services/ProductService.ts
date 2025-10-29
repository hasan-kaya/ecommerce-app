import { ProductRepository } from '@/repositories/ProductRepository';

export class ProductService {
  private productRepository = new ProductRepository();

  async getAllProducts(categorySlug?: string, search?: string) {
    return this.productRepository.findAll(categorySlug, search);
  }
}
