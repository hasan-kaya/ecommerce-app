'use client';

import FormSelect from '@/components/ui/FormSelect';
import { formatMoney } from '@/lib/utils/money';
import type { Wallet } from '@/graphql/types';

type PaymentMethodProps = {
  selectedWallet?: string;
  onWalletChange: (currency: string) => void;
  wallets: Wallet[];
};

export default function PaymentMethod({
  selectedWallet,
  onWalletChange,
  wallets,
}: PaymentMethodProps) {
  return (
    <div className="border rounded-lg p-6">
      <h2 className="text-xl font-bold mb-4">Select Wallet</h2>

      <FormSelect
        label="Choose a wallet to pay"
        value={selectedWallet}
        onChange={(e) => onWalletChange(e.target.value)}
      >
        <option value="">Select a wallet</option>
        {wallets.map((wallet) => (
          <option key={wallet.currency} value={wallet.currency}>
            {wallet.currency} - Balance: {formatMoney(Number(wallet.balanceMinor), wallet.currency)}
          </option>
        ))}
      </FormSelect>
    </div>
  );
}
