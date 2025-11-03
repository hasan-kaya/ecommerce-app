'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useQuery, useMutation } from '@apollo/client/react';
import PaymentMethod from '@/components/features/checkout/PaymentMethod';
import OrderSummary from '@/components/features/checkout/OrderSummary';
import { GET_WALLETS } from '@/graphql/queries/wallet';
import { GET_CART } from '@/graphql/queries/cart';
import { CHECKOUT } from '@/graphql/mutations/order';
import type { WalletsResponse, CheckoutResponse, Cart } from '@/graphql/types';

export default function CheckoutPage() {
  const router = useRouter();
  const [selectedWallet, setSelectedWallet] = useState('');

  const { data: walletsData, loading: walletsLoading } =
    useQuery<WalletsResponse>(GET_WALLETS);

  const { data: cartData, loading: cartLoading } = useQuery<{ cart: Cart }>(GET_CART);

  const [checkout, { loading: isProcessing }] = useMutation<
    CheckoutResponse,
    { walletCurrency: string }
  >(CHECKOUT, {
    refetchQueries: [{ query: GET_CART }],
    onCompleted: (data) => {
      alert(`Order placed successfully! Order ID: ${data.checkout.id}`);
      router.push('/');
    },
    onError: (error) => {
      alert(`Error: ${error.message}`);
    },
  });

  const handlePlaceOrder = async () => {
    if (!selectedWallet) {
      alert('Please select a wallet');
      return;
    }

    await checkout({
      variables: {
        walletCurrency: selectedWallet,
      },
    });
  };

  if (walletsLoading || cartLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">Loading...</div>
      </div>
    );
  }

  const wallets = walletsData?.wallets || [];
  const cartItems = cartData?.cart?.cartItems || [];

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Checkout</h1>

      {cartItems.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 mb-4">Your cart is empty</p>
          <button
            onClick={() => router.push('/')}
            className="text-blue-600 hover:underline"
          >
            Continue Shopping
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <PaymentMethod
              selectedWallet={selectedWallet}
              onWalletChange={setSelectedWallet}
              wallets={wallets}
            />
          </div>

          <div className="lg:col-span-1">
            <OrderSummary
              items={cartItems}
              currency="TRY"
              onPlaceOrder={handlePlaceOrder}
              isProcessing={isProcessing}
            />
          </div>
        </div>
      )}
    </div>
  );
}
