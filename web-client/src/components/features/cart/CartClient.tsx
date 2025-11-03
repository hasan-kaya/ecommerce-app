'use client';

import Link from 'next/link';
import { useQuery, useMutation } from '@apollo/client/react';
import {
  UPDATE_CART_ITEM_QUANTITY,
  REMOVE_CART_ITEM,
} from '@/graphql/mutations/cart';
import { GET_CART } from '@/graphql/queries/cart';
import type {
  Cart,
  UpdateCartItemQuantityResponse,
  RemoveCartItemResponse,
} from '@/graphql/types';
import CartItem from './CartItem';
import CartSummary from './CartSummary';

type CartClientProps = {
  initialCart: Cart;
};

export default function CartClient({ initialCart }: CartClientProps) {
  const { data } = useQuery<{ cart: Cart }>(GET_CART, {
    skip: false,
  });

  const [updateCartItemQuantity] = useMutation<
    UpdateCartItemQuantityResponse,
    { cartItemId: string; qty: number }
  >(UPDATE_CART_ITEM_QUANTITY, {
    update(cache, { data }) {
      if (data?.updateCartItemQuantity) {
        cache.writeQuery({
          query: GET_CART,
          data: { cart: data.updateCartItemQuantity },
        });
      }
    },
    onError(error) {
      console.error('Update quantity error:', error);
      alert('Failed to update quantity');
    },
  });

  const [removeCartItem] = useMutation<
    RemoveCartItemResponse,
    { cartItemId: string }
  >(REMOVE_CART_ITEM, {
    update(cache, { data }) {
      if (data?.removeCartItem) {
        cache.writeQuery({
          query: GET_CART,
          data: { cart: data.removeCartItem },
        });
      }
    },
    onError(error) {
      console.error('Remove item error:', error);
      alert('Failed to remove item');
    },
  });

  const handleUpdateQuantity = async (cartItemId: string, qty: number) => {
    await updateCartItemQuantity({ variables: { cartItemId, qty } });
  };

  const handleRemove = async (cartItemId: string) => {
    if (!confirm('Remove this item from cart?')) return;
    await removeCartItem({ variables: { cartItemId } });
  };

  const cart = data?.cart || initialCart;
  if (!cart) return null;

  const totalPrice = Number(cart.totalPrice);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Shopping Cart</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="border rounded-lg p-4">
            {cart.cartItems?.map((item) => (
              <CartItem
                key={item.id}
                id={item.id}
                name={item.product.name}
                price={Number(item.product.priceMinor)}
                currency={item.product.currency}
                quantity={item.qty}
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
          <CartSummary subtotal={totalPrice} currency="TRY" />
        </div>
      </div>
    </div>
  );
}
