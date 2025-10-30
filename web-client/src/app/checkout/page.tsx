'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import PaymentMethod from '@/components/features/checkout/PaymentMethod';
import OrderSummary from '@/components/features/checkout/OrderSummary';

const mockOrderItems = [
  { id: '1', name: 'Wireless Headphones', price: 9999, quantity: 1 },
  { id: '2', name: 'Smart Watch', price: 29999, quantity: 2 },
  { id: '3', name: 'USB-C Cable', price: 1999, quantity: 3 },
];

const mockWallets = [
  { currency: 'USD', balance: 100000 },
  { currency: 'EUR', balance: 50000 },
  { currency: 'TRY', balance: 200000 },
];

export default function CheckoutPage() {
  const router = useRouter();
  const [paymentMethod, setPaymentMethod] = useState<'wallet' | 'card'>('wallet');
  const [selectedWallet, setSelectedWallet] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const handlePlaceOrder = async () => {
    if (paymentMethod === 'wallet' && !selectedWallet) {
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

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Checkout</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <PaymentMethod
            selectedMethod={paymentMethod}
            onMethodChange={setPaymentMethod}
            selectedWallet={selectedWallet}
            onWalletChange={setSelectedWallet}
            wallets={mockWallets}
          />
        </div>

        <div className="lg:col-span-1">
          <OrderSummary
            items={mockOrderItems}
            currency="USD"
            onPlaceOrder={handlePlaceOrder}
            isProcessing={isProcessing}
          />
        </div>
      </div>
    </div>
  );
}
