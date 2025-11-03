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
      order: { createdAt: 'DESC' },
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
    return this.repository.findOne({ where: { id }, relations: { category: true } });
  }

  async findBySlug(slug: string) {
    return this.repository.findOne({ where: { slug } });
  }

  async decreaseStock(productId: string, quantity: number) {
    const product = await this.repository.findOne({ where: { id: productId } });
    if (!product) return null;

    product.stock_qty = product.stock_qty - quantity;
    return this.repository.save(product);
  }

  async count() {
    return this.repository.count();
  }

  async create(data: {
    name: string;
    slug: string;
    priceMinor: string;
    currency: string;
    stockQty: number;
    categoryId: string;
  }) {
    const product = this.repository.create({
      name: data.name,
      slug: data.slug,
      priceMinor: Number(data.priceMinor),
      currency: data.currency,
      stock_qty: data.stockQty,
      category: { id: data.categoryId },
    });
    const saved = await this.repository.save(product);
    const productWithCategory = await this.findById(saved.id);
    if (!productWithCategory) {
      throw new Error('Failed to load created product');
    }
    return productWithCategory;
  }

  async update(
    id: string,
    data: {
      name: string;
      slug: string;
      priceMinor: string;
      currency: string;
      stockQty: number;
      categoryId: string;
    }
  ) {
    await this.repository.update(id, {
      name: data.name,
      slug: data.slug,
      priceMinor: Number(data.priceMinor),
      currency: data.currency,
      stock_qty: data.stockQty,
      category: { id: data.categoryId },
    });
    return this.findById(id);
  }

  async delete(id: string) {
    const result = await this.repository.delete(id);
    return result.affected ? result.affected > 0 : false;
  }
}
