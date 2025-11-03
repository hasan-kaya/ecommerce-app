'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useQuery } from '@apollo/client/react';
import PaymentMethod from '@/components/features/checkout/PaymentMethod';
import OrderSummary from '@/components/features/checkout/OrderSummary';
import { GET_WALLETS } from '@/graphql/queries/wallet';
import type { WalletsResponse } from '@/graphql/types';

const mockOrderItems = [
  { id: '1', name: 'Wireless Headphones', price: 9999, quantity: 1 },
  { id: '2', name: 'Smart Watch', price: 29999, quantity: 2 },
  { id: '3', name: 'USB-C Cable', price: 1999, quantity: 3 },
];

export default function CheckoutPage() {
  const router = useRouter();
  const [selectedWallet, setSelectedWallet] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const { data: walletsData, loading: walletsLoading } =
    useQuery<WalletsResponse>(GET_WALLETS);

  const handlePlaceOrder = async () => {
    if (!selectedWallet) {
      alert('Please select a wallet');
      return;
    }

    setIsProcessing(true);

    // Simulate API call
    setTimeout(() => {
      setIsProcessing(false);
      alert('Order placed successfully!');
      router.push('/');
    }, 2000);
  };

  if (walletsLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">Loading...</div>
      </div>
    );
  }

  const wallets =
    walletsData?.wallets.map((wallet) => ({
      currency: wallet.currency,
      balance: Number(wallet.balanceMinor),
    })) || [];

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Checkout</h1>

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
            items={mockOrderItems}
            currency="TRY"
            onPlaceOrder={handlePlaceOrder}
            isProcessing={isProcessing}
          />
        </div>
      </div>
    </div>
  );
}
