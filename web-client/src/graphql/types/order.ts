import type { Product } from './product';

export enum OrderStatus {
  PENDING = 'PENDING',
  PAID = 'PAID',
  SHIPPED = 'SHIPPED',
  DELIVERED = 'DELIVERED',
  CANCELLED = 'CANCELLED',
  REFUNDED = 'REFUNDED',
}

export interface OrderItem {
  id: string;
  product: Product;
  qty: number;
  priceMinor: string;
  currency: string;
}

export interface Order {
  id: string;
  priceMinor: string;
  currency: string;
  status: OrderStatus;
  items: OrderItem[];
  createdAt: string;
}

export interface CheckoutResponse {
  checkout: Order;
}
