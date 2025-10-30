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

  async decreaseStock(productId: string, quantity: number) {
    const product = await this.repository.findOne({ where: { id: productId } });
    if (!product) return null;

    product.stock_qty = product.stock_qty - quantity;
    return this.repository.save(product);
  }
}
