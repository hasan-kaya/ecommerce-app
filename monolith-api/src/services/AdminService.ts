import { OrderRepository } from '@/repositories/OrderRepository';
import { ProductRepository } from '@/repositories/ProductRepository';
import { UserRepository } from '@/repositories/UserRepository';

export class AdminService {
  private orderRepository = new OrderRepository();
  private userRepository = new UserRepository();
  private productRepository = new ProductRepository();

  async getAdminStats() {
    const [totalOrders, totalUsers, totalProducts, totalRevenue] = await Promise.all([
      this.orderRepository.count(),
      this.userRepository.count(),
      this.productRepository.count(),
      this.orderRepository.getTotalRevenue(),
    ]);

    return {
      totalOrders,
      totalUsers,
      totalProducts,
      totalRevenue: String(totalRevenue),
    };
  }
}
