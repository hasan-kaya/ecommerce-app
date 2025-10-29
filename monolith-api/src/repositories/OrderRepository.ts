import { AppDataSource } from '@/config/data-source';
import { Order } from '@/entities/Order';

export class OrderRepository {
  private repository = AppDataSource.getRepository(Order);

  async findByUserId(userId: string) {
    return this.repository.find({ where: { user: { id: userId } } });
  }

  async create(order: Order) {
    return this.repository.save(order);
  }
}
