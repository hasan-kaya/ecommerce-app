import { AppDataSource } from '@/config/data-source';
import { Cart } from '@/entities/Cart';
import { CartItem } from '@/entities/CartItem';

export class CartRepository {
  private cartRepository = AppDataSource.getRepository(Cart);
  private cartItemRepository = AppDataSource.getRepository(CartItem);

  async findByUserId(userId: string) {
    const cart = await this.cartRepository.findOne({
      where: { user: { id: userId } },
      relations: ['cartItems', 'cartItems.product'],
      order: {
        cartItems: {
          createdAt: 'ASC',
        },
      },
    });

    return cart;
  }

  async createCart(userId: string) {
    const cart = this.cartRepository.create({
      user: { id: userId },
      cartItems: [],
    });
    return this.cartRepository.save(cart);
  }

  async saveCartItem(cartItem: CartItem) {
    const saved = await this.cartItemRepository.save(cartItem);
    return this.cartItemRepository.findOne({
      where: { id: saved.id },
      relations: ['product', 'product.category'],
    });
  }

  async addCartItem(cartId: string, productId: string, qty: number) {
    const cartItem = this.cartItemRepository.create({
      cart: { id: cartId },
      product: { id: productId },
      qty,
    });
    const saved = await this.cartItemRepository.save(cartItem);
    return this.cartItemRepository.findOne({
      where: { id: saved.id },
      relations: ['product', 'product.category'],
    });
  }
  async removeCartItem(cartItemId: string) {
    return this.cartItemRepository.delete(cartItemId);
  }

  async delete(cartId: string) {
    return this.cartRepository.delete(cartId);
  }
}
