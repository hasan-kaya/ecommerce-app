import { FindOptionsWhere, ILike } from 'typeorm';

import { AppDataSource } from '@/config/data-source';
import { Product } from '@/entities/Product';

export class ProductRepository {
  private repository = AppDataSource.getRepository(Product);

  async findAll(categorySlug?: string, search?: string) {
    const where: FindOptionsWhere<Product> = {};

    if (categorySlug) {
      where.category = { slug: categorySlug };
    }

    if (search) {
      where.name = ILike(`%${search}%`);
    }

    return this.repository.find({
      where,
      relations: { category: true },
    });
  }

  async findById(id: string) {
    return this.repository.findOne({ where: { id } });
  }
}
