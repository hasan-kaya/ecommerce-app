import { AppError } from '@/common/middleware/error';
import { Cart } from '@/entities/Cart';
import { CartItem } from '@/entities/CartItem';
import { Product } from '@/entities/Product';
import { CartRepository } from '@/repositories/CartRepository';
import { CurrencyService } from '@/services/CurrencyService';
import { ProductService } from '@/services/ProductService';

export class CartService {
  private cartRepository = new CartRepository();
  private productService = new ProductService();
  private currencyService = new CurrencyService();

  private validateQuantity(qty: number) {
    if (qty < 1) {
      throw new AppError('Quantity must be at least 1', 400);
    }
  }

  private async getOrCreateCart(userId: string) {
    let cart = await this.cartRepository.findByUserId(userId);
    if (!cart) {
      cart = await this.cartRepository.createCart(userId);
    }
    return cart;
  }

  private findCartItem(cart: Cart, cartItemId: string) {
    const cartItem = cart.cartItems.find((item) => item.id === cartItemId);
    if (!cartItem) {
      throw new AppError('Cart item not found', 404);
    }
    return cartItem;
  }

  private checkStock(product: Product, requestedQty: number) {
    if (product.stock_qty < requestedQty) {
      throw new AppError(`Only ${product.stock_qty} units available for ${product.name}`, 400);
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

  private async convertCartItemPrice(item: CartItem) {
    const priceInBase = await this.currencyService.convertToBase(
      Number(item.product.priceMinor),
      item.product.currency
    );

    return {
      ...item,
      product: {
        ...item.product,
        priceMinor: priceInBase,
        currency: this.currencyService.getBaseCurrency(),
      },
    };
  }

  private async calculateTotalPrice(cartItems: CartItem[]): Promise<string> {
    let totalInBase = 0;

    for (const item of cartItems) {
      const itemTotal = Number(item.product.priceMinor) * item.qty;
      const itemTotalInBase = await this.currencyService.convertToBase(
        itemTotal,
        item.product.currency
      );
      totalInBase += itemTotalInBase;
    }

    return totalInBase.toString();
  }

  public async getUserCart(userId: string) {
    const cart = await this.cartRepository.findByUserId(userId);
    if (!cart) {
      throw new AppError('Cart not found', 404);
    }

    const convertedCartItems = await Promise.all(
      cart.cartItems.map((item) => this.convertCartItemPrice(item))
    );

    const totalPrice = await this.calculateTotalPrice(cart.cartItems);

    return {
      ...cart,
      cartItems: convertedCartItems,
      totalPrice,
    };
  }

  public async clearCart(cartId: string) {
    await this.cartRepository.delete(cartId);
  }

  public async updateCartItemQuantity(userId: string, cartItemId: string, qty: number) {
    this.validateQuantity(qty);

    const cart = await this.cartRepository.findByUserId(userId);
    if (!cart) {
      throw new AppError('Cart not found', 404);
    }

    const cartItem = this.findCartItem(cart, cartItemId);
    this.checkStock(cartItem.product, qty);

    cartItem.qty = qty;
    await this.cartRepository.saveCartItem(cartItem);

    return this.getUserCart(userId);
  }

  public async removeCartItem(userId: string, cartItemId: string) {
    const cart = await this.cartRepository.findByUserId(userId);
    if (!cart) {
      throw new AppError('Cart not found', 404);
    }

    this.findCartItem(cart, cartItemId);

    await this.cartRepository.removeCartItem(cartItemId);

    return this.getUserCart(userId);
  }

  async addToCart(userId: string, productId: string, qty: number) {
    this.validateQuantity(qty);

    const product = await this.productService.getProduct(productId);
    const cart = await this.getOrCreateCart(userId);

    const existingItem = cart.cartItems.find((ci) => ci.product.id === productId);
    const currentQty = existingItem?.qty || 0;
    const newTotalQty = currentQty + qty;

    this.checkStock(product, newTotalQty);

    if (existingItem) {
      existingItem.qty = newTotalQty;
      return this.cartRepository.saveCartItem(existingItem);
    }

    return this.cartRepository.addCartItem(cart.id, productId, qty);
  }
}
