import { AppError } from '@/common/middleware/error';
import { Order, OrderStatus } from '@/entities/Order';
import { OrderItem } from '@/entities/OrderItem';
import { User } from '@/entities/User';
import { CartRepository } from '@/repositories/CartRepository';
import { OrderRepository } from '@/repositories/OrderRepository';

export class OrderService {
  private orderRepository = new OrderRepository();
  private cartRepository = new CartRepository();

  async createOrder(walletCurrency: string, userId: string) {
    const cart = await this.cartRepository.findByUserId(userId);
    if (!cart) {
      throw new AppError('Cart not found', 404);
    }

    if (!cart.cartItems || cart.cartItems.length === 0) {
      throw new AppError('Cart is empty', 400);
    }

    cart.cartItems.forEach((cartItem) => {
      if (cartItem.product.stock_qty < cartItem.qty) {
        throw new AppError(
          `You can purchase a maximum of ${cartItem.product.stock_qty} units of ${cartItem.product.name}.`,
          400
        );
      }
    });

    let totalPriceMinor = 0;
    for (const cartItem of cart.cartItems) {
      const itemTotal = cartItem.product.price_minor * cartItem.qty;
      totalPriceMinor += itemTotal;
    }

    const orderItems = cart.cartItems.map((cartItem) => {
      const orderItem = new OrderItem();
      orderItem.product = cartItem.product;
      orderItem.qty = cartItem.qty;
      orderItem.price_minor = cartItem.product.price_minor;
      orderItem.currency = walletCurrency;
      return orderItem;
    });

    const order = new Order();
    order.user = { id: userId } as User;
    order.price_minor = totalPriceMinor;
    order.currency = walletCurrency;
    order.status = OrderStatus.PENDING;
    order.items = orderItems;

    const savedOrder = await this.orderRepository.create(order);

    await this.cartRepository.delete(cart.id);

    return savedOrder;
  }
}
