import { AppDataSource } from '@/config/data-source';
import { Product } from '@/entities/Product';

export class ProductRepository {
  private repository = AppDataSource.getRepository(Product);

  async findAll() {
    return this.repository.find({
      relations: { category: true },
    });
  }
}
