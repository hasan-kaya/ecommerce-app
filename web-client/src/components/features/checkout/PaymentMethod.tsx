'use client';

import FormField from '@/components/ui/FormField';
import FormSelect from '@/components/ui/FormSelect';
import FormRadio from '@/components/ui/FormRadio';

type PaymentMethodProps = {
  selectedMethod: 'wallet' | 'card';
  onMethodChange: (method: 'wallet' | 'card') => void;
  selectedWallet?: string;
  onWalletChange: (currency: string) => void;
  wallets: Array<{ currency: string; balance: number }>;
};

export default function PaymentMethod({
  selectedMethod,
  onMethodChange,
  selectedWallet,
  onWalletChange,
  wallets,
}: PaymentMethodProps) {
  return (
    <div className="border rounded-lg p-6">
      <h2 className="text-xl font-bold mb-4">Payment Method</h2>

      <div className="space-y-4">
        {/* Wallet Option */}
        <FormRadio
          name="paymentMethod"
          value="wallet"
          checked={selectedMethod === 'wallet'}
          onChange={() => onMethodChange('wallet')}
          label="Wallet"
          description="Pay with your wallet balance"
          variant="card"
        >
          {selectedMethod === 'wallet' && (
            <div className="mt-3">
              <FormSelect
                label="Select Wallet"
                value={selectedWallet}
                onChange={(e) => onWalletChange(e.target.value)}
              >
                <option value="">Choose a wallet</option>
                {wallets.map((wallet) => (
                  <option key={wallet.currency} value={wallet.currency}>
                    {wallet.currency} - Balance: {(wallet.balance / 100).toFixed(2)}
                  </option>
                ))}
              </FormSelect>
            </div>
          )}
        </FormRadio>

        {/* Card Option */}
        <FormRadio
          name="paymentMethod"
          value="card"
          checked={selectedMethod === 'card'}
          onChange={() => onMethodChange('card')}
          label="Credit/Debit Card"
          description="Pay with your card"
          variant="card"
        >
          {selectedMethod === 'card' && (
            <div className="mt-3 space-y-3">
              <FormField
                label="Card Number"
                type="text"
                placeholder="1234 5678 9012 3456"
              />
              <div className="grid grid-cols-2 gap-3">
                <FormField
                  label="Expiry Date"
                  type="text"
                  placeholder="MM/YY"
                />
                <FormField
                  label="CVV"
                  type="text"
                  placeholder="123"
                />
              </div>
            </div>
          )}
        </FormRadio>
      </div>
    </div>
  );
}
