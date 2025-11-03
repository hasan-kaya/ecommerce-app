import { FindOptionsWhere, ILike } from 'typeorm';

import { AppDataSource } from '@/config/data-source';
import { Product } from '@/entities/Product';

export class ProductRepository {
  private repository = AppDataSource.getRepository(Product);

  async findWithPagination(
    page: number = 1,
    pageSize: number = 10,
    categorySlug?: string,
    search?: string
  ) {
    const where: FindOptionsWhere<Product> = {};

    if (categorySlug) {
      where.category = { slug: categorySlug };
    }

    if (search) {
      where.name = ILike(`%${search}%`);
    }

    const [products, total] = await this.repository.findAndCount({
      where,
      relations: { category: true },
      take: pageSize,
      skip: (page - 1) * pageSize,
      order: { id: 'ASC' },
    });

    return {
      products,
      total,
      page,
      pageSize,
      totalPages: Math.ceil(total / pageSize),
    };
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
