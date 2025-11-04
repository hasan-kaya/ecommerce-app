import { AppError } from '@/common/middleware/error';
import { runInTransaction } from '@/common/utils/transaction';
import { Order, OrderStatus } from '@/entities/Order';
import { OrderItem } from '@/entities/OrderItem';
import { User } from '@/entities/User';
import { OrderRepository } from '@/repositories/OrderRepository';
import { CartService } from '@/services/CartService';
import { ProductService } from '@/services/ProductService';
import { WalletService } from '@/services/WalletService';

export class OrderService {
  private orderRepository = new OrderRepository();
  private cartService = new CartService();
  private productService = new ProductService();
  private walletService = new WalletService();

  async getUserOrders(userId: string, page: number = 1, pageSize: number = 10) {
    const offset = (page - 1) * pageSize;
    const [orders, total] = await this.orderRepository.findByUserIdPaginated(
      userId,
      pageSize,
      offset
    );

    return {
      orders,
      total,
      page,
      pageSize,
    };
  }

  async createOrder(walletCurrency: string, userId: string) {
    return runInTransaction(async () => {
      const cart = await this.cartService.getUserCart(userId);

      if (!cart.cartItems || cart.cartItems.length === 0) {
        throw new AppError('Cart is empty', 400);
      }

      // 1. Check Stock
      this.cartService.checkCartStock(cart.cartItems);

      // 2. Calculate total
      let totalPriceMinor = 0;
      for (const cartItem of cart.cartItems) {
        const itemTotal = cartItem.product.priceMinor * cartItem.qty;
        totalPriceMinor += itemTotal;
      }

      // 3. Check Wallet Balance
      await this.walletService.checkBalance(userId, walletCurrency, totalPriceMinor);

      // 4. Deduct from Wallet (atomic operation with balance check)
      try {
        await this.walletService.deductFromWallet(userId, walletCurrency, totalPriceMinor);
      } catch {
        throw new AppError('Failed to deduct from wallet. Insufficient balance.', 400);
      }

      // 5. Decrease Product Stock (atomic operations with stock check)
      try {
        for (const cartItem of cart.cartItems) {
          await this.productService.decreaseProductStock(cartItem.product.id, cartItem.qty);
        }
      } catch (err) {
        throw new AppError(
          `Failed to reserve stock: ${err instanceof Error ? err.message : 'Unknown error'}`,
          400
        );
      }

      // 6. Create Order
      const orderItems = cart.cartItems.map((cartItem) => {
        const orderItem = new OrderItem();
        orderItem.product = cartItem.product;
        orderItem.qty = cartItem.qty;
        orderItem.priceMinor = cartItem.product.priceMinor;
        orderItem.currency = walletCurrency;
        return orderItem;
      });

      const order = new Order();
      order.user = { id: userId } as User;
      order.priceMinor = totalPriceMinor;
      order.currency = walletCurrency;
      order.status = OrderStatus.PENDING;
      order.items = orderItems;

      const savedOrder = await this.orderRepository.create(order);

      // 7. Clear Cart
      await this.cartService.clearCart(cart.id);

      return savedOrder;
    });
  }
}
