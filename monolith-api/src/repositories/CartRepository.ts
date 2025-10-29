import { AppDataSource } from '@/config/data-source';
import { Cart } from '@/entities/Cart';
import { CartItem } from '@/entities/CartItem';

export class CartRepository {
  private cartRepository = AppDataSource.getRepository(Cart);
  private cartItemRepository = AppDataSource.getRepository(CartItem);

  async findByUserId(userId: string) {
    return this.cartRepository.findOne({
      where: { user: { id: userId } },
      relations: ['cartItems', 'cartItems.product'],
    });
  }

  async createCart(userId: string) {
    const cart = this.cartRepository.create({ user: { id: userId } });
    return this.cartRepository.save(cart);
  }

  async saveCartItem(cartItem: CartItem) {
    return this.cartItemRepository.save(cartItem);
  }

  async addCartItem(cartId: string, productId: string, qty: number) {
    const cartItem = this.cartItemRepository.create({
      cart: { id: cartId },
      product: { id: productId },
      qty,
    });
    return this.cartItemRepository.save(cartItem);
  }

  async delete(cartId: string) {
    return this.cartRepository.delete(cartId);
  }
}
