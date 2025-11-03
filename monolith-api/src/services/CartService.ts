import { AppError } from '@/common/middleware/error';
import { CartItem } from '@/entities/CartItem';
import { Product } from '@/entities/Product';
import { CartRepository } from '@/repositories/CartRepository';
import { ProductService } from '@/services/ProductService';

export class CartService {
  private cartRepository = new CartRepository();
  private productService = new ProductService();

  private checkStockForAdd(product: Product, existingQty: number, newQty: number) {
    if (product.stock_qty < existingQty + newQty) {
      throw new AppError('Not enough stock', 400);
    }
  }

  public checkCartStock(cartItems: CartItem[]) {
    cartItems.forEach((cartItem) => {
      if (cartItem.product.stock_qty < cartItem.qty) {
        throw new AppError(
          `You can purchase a maximum of ${cartItem.product.stock_qty} units of ${cartItem.product.name}.`,
          400
        );
      }
    });
  }

  private calculateTotalPrice(cartItems: CartItem[]): string {
    const total = cartItems.reduce((sum, item) => {
      return sum + Number(item.product.price_minor) * item.qty;
    }, 0);
    return total.toString();
  }

  public async getUserCart(userId: string) {
    const cart = await this.cartRepository.findByUserId(userId);
    if (!cart) {
      throw new AppError('Cart not found', 404);
    }

    const totalPrice = this.calculateTotalPrice(cart.cartItems);

    return {
      ...cart,
      totalPrice,
    };
  }

  public async clearCart(cartId: string) {
    await this.cartRepository.delete(cartId);
  }

  async addToCart(userId: string, productId: string, qty: number) {
    const product = await this.productService.getProduct(productId);

    let cart = await this.cartRepository.findByUserId(userId);

    let userAddedQty = 0;
    if (cart) {
      userAddedQty = cart?.cartItems.find((ci) => ci.product.id === productId)?.qty || 0;
    }

    this.checkStockForAdd(product, userAddedQty, qty);

    if (!cart) {
      cart = await this.cartRepository.createCart(userId);
    }

    const existingItem = cart?.cartItems.find((ci) => ci.product.id === productId);
    if (existingItem) {
      existingItem.qty += qty;
      return this.cartRepository.saveCartItem(existingItem);
    }

    return this.cartRepository.addCartItem(cart.id, productId, qty);
  }
}
