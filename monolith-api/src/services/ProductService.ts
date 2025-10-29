import { ProductRepository } from '@/repositories/ProductRepository';

export class ProductService {
  private productRepository = new ProductRepository();

  async getAllProducts() {
    return this.productRepository.findAll();
  }
}
