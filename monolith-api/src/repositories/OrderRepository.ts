import { AppDataSource } from '@/config/data-source';
import { Order } from '@/entities/Order';

export class OrderRepository {
  private repository = AppDataSource.getRepository(Order);

  async findByUserId(userId: string) {
    return this.repository.find({ where: { user: { id: userId } } });
  }

  async findByUserIdPaginated(
    userId: string,
    limit: number = 10,
    offset: number = 0
  ): Promise<[Order[], number]> {
    return this.repository.findAndCount({
      where: { user: { id: userId } },
      relations: ['items', 'items.product'],
      order: { createdAt: 'DESC' },
      take: limit,
      skip: offset,
    });
  }

  async create(order: Order) {
    return this.repository.save(order);
  }

  async count() {
    return this.repository.count();
  }

  async getTotalRevenue() {
    const result = await this.repository
      .createQueryBuilder('order')
      .select('SUM(order.priceMinor)', 'total')
      .getRawOne();

    return result?.total || 0;
  }
}
