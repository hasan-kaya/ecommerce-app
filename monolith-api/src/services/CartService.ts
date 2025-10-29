import { CartRepository } from '@/repositories/CartRepository';

export class CartService {
  private cartRepository = new CartRepository();

  async addToCart(userId: string, productId: string, qty: number) {
    let cart = await this.cartRepository.findByUserId(userId);
    if (!cart) {
      cart = await this.cartRepository.createCart(userId);
    }

    const existingItem = cart.cartItems.find(
      (ci) => ci.product.id === productId
    );
    if (existingItem) {
      existingItem.qty += qty;
      return this.cartRepository.saveCartItem(existingItem);
    }

    return this.cartRepository.addCartItem(cart.id, productId, qty);
  }
}
