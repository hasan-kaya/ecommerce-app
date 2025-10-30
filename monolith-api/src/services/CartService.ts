import { AppError } from '@/common/middleware/error';
import { CartRepository } from '@/repositories/CartRepository';
import { ProductRepository } from '@/repositories/ProductRepository';

export class CartService {
  private cartRepository = new CartRepository();
  private productRepository = new ProductRepository();

  async addToCart(userId: string, productId: string, qty: number) {
    const product = await this.productRepository.findById(productId);
    if (!product) {
      throw new AppError('Product not found', 404);
    }

    let cart = await this.cartRepository.findByUserId(userId);

    let userAddedQty = 0;
    if (cart) {
      userAddedQty = cart?.cartItems.find((ci) => ci.product.id === productId)?.qty || 0;
    }

    if (product.stock_qty < userAddedQty + qty) {
      throw new AppError('Not enough stock', 400);
    }

    if (!cart) {
      cart = await this.cartRepository.createCart(userId);
    }

    const existingItem = cart.cartItems.find((ci) => ci.product.id === productId);
    if (existingItem) {
      existingItem.qty += qty;
      return this.cartRepository.saveCartItem(existingItem);
    }

    return this.cartRepository.addCartItem(cart.id, productId, qty);
  }
}
