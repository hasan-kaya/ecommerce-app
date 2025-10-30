'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import CartItem from '@/components/features/cart/CartItem';
import CartSummary from '@/components/features/cart/CartSummary';

type CartItemType = {
  id: string;
  name: string;
  price: number;
  currency: string;
  quantity: number;
};

const initialCartItems: CartItemType[] = [
  {
    id: '1',
    name: 'Wireless Headphones',
    price: 9999,
    currency: 'USD',
    quantity: 1,
  },
  {
    id: '2',
    name: 'Smart Watch',
    price: 29999,
    currency: 'USD',
    quantity: 2,
  },
  {
    id: '3',
    name: 'USB-C Cable',
    price: 1999,
    currency: 'USD',
    quantity: 3,
  },
];

export default function CartPage() {
  const router = useRouter();
  const [cartItems, setCartItems] = useState<CartItemType[]>(initialCartItems);

  const handleUpdateQuantity = (id: string, quantity: number) => {
    setCartItems((items) =>
      items.map((item) => (item.id === id ? { ...item, quantity } : item))
    );
  };

  const handleRemove = (id: string) => {
    setCartItems((items) => items.filter((item) => item.id !== id));
  };

  const handleCheckout = () => {
    router.push('/checkout');
  };

  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  if (cartItems.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-4">Your Cart is Empty</h1>
          <p className="text-gray-600 mb-8">
            Add some products to your cart to see them here.
          </p>
          <Link
            href="/products"
            className="inline-block bg-black text-white px-6 py-3 rounded hover:bg-gray-800"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Shopping Cart</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="border rounded-lg p-4">
            {cartItems.map((item) => (
              <CartItem
                key={item.id}
                id={item.id}
                name={item.name}
                price={item.price}
                currency={item.currency}
                quantity={item.quantity}
                onUpdateQuantity={handleUpdateQuantity}
                onRemove={handleRemove}
              />
            ))}
          </div>

          <Link
            href="/products"
            className="inline-block mt-4 text-blue-600 hover:underline"
          >
            ← Continue Shopping
          </Link>
        </div>

        <div className="lg:col-span-1">
          <CartSummary
            subtotal={subtotal}
            currency="USD"
            onCheckout={handleCheckout}
          />
        </div>
      </div>
    </div>
  );
}
