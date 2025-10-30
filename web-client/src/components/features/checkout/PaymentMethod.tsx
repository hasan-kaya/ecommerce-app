'use client';

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
        <label className="flex items-start gap-3 p-4 border rounded cursor-pointer hover:bg-gray-50">
          <input
            type="radio"
            name="paymentMethod"
            value="wallet"
            checked={selectedMethod === 'wallet'}
            onChange={() => onMethodChange('wallet')}
            className="mt-1"
          />
          <div className="flex-1">
            <div className="font-semibold">Wallet</div>
            <p className="text-sm text-gray-600">Pay with your wallet balance</p>

            {selectedMethod === 'wallet' && (
              <div className="mt-3">
                <label className="text-sm font-medium text-gray-700">
                  Select Wallet
                </label>
                <select
                  value={selectedWallet}
                  onChange={(e) => onWalletChange(e.target.value)}
                  className="w-full mt-1 border rounded px-3 py-2"
                >
                  <option value="">Choose a wallet</option>
                  {wallets.map((wallet) => (
                    <option key={wallet.currency} value={wallet.currency}>
                      {wallet.currency} - Balance: {(wallet.balance / 100).toFixed(2)}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>
        </label>

        {/* Card Option */}
        <label className="flex items-start gap-3 p-4 border rounded cursor-pointer hover:bg-gray-50">
          <input
            type="radio"
            name="paymentMethod"
            value="card"
            checked={selectedMethod === 'card'}
            onChange={() => onMethodChange('card')}
            className="mt-1"
          />
          <div className="flex-1">
            <div className="font-semibold">Credit/Debit Card</div>
            <p className="text-sm text-gray-600">Pay with your card</p>

            {selectedMethod === 'card' && (
              <div className="mt-3 space-y-3">
                <div>
                  <label className="text-sm font-medium text-gray-700">
                    Card Number
                  </label>
                  <input
                    type="text"
                    placeholder="1234 5678 9012 3456"
                    className="w-full mt-1 border rounded px-3 py-2"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-sm font-medium text-gray-700">
                      Expiry Date
                    </label>
                    <input
                      type="text"
                      placeholder="MM/YY"
                      className="w-full mt-1 border rounded px-3 py-2"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">CVV</label>
                    <input
                      type="text"
                      placeholder="123"
                      className="w-full mt-1 border rounded px-3 py-2"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        </label>
      </div>
    </div>
  );
}
