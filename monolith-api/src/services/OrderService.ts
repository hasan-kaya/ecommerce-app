import { AppError } from '@/common/middleware/error';
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

  async createOrder(walletCurrency: string, userId: string) {
    const cart = await this.cartService.getUserCart(userId);

    if (!cart.cartItems || cart.cartItems.length === 0) {
      throw new AppError('Cart is empty', 400);
    }

    // 1. Check Stock
    this.cartService.checkCartStock(cart.cartItems);

    // 2. Check Wallet Balance
    let totalPriceMinor = 0;
    for (const cartItem of cart.cartItems) {
      const itemTotal = cartItem.product.price_minor * cartItem.qty;
      totalPriceMinor += itemTotal;
    }

    await this.walletService.checkBalance(userId, walletCurrency, totalPriceMinor);

    // 3. Create Order
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

    // 4. Deduct from Wallet
    await this.walletService.deductFromWallet(userId, walletCurrency, totalPriceMinor);

    // 5. Decrease Product Stock
    for (const cartItem of cart.cartItems) {
      await this.productService.decreaseProductStock(cartItem.product.id, cartItem.qty);
    }

    // 6. Clear Cart
    await this.cartService.clearCart(cart.id);

    return savedOrder;
  }
}
