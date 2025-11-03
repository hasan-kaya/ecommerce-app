import type { Product } from './product';

export interface CartItem {
  id: string;
  qty: number;
  product: Product;
}

export interface Cart {
  id: string;
  totalPrice: string;
  cartItems: CartItem[];
}
