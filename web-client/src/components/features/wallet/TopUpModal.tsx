'use client';

import { useState } from 'react';
import { useMutation } from '@apollo/client/react';
import Button from '@/components/ui/Button';
import FormField from '@/components/ui/FormField';
import Modal from '@/components/ui/Modal';
import { Wallet } from '@/graphql/types';
import { TOP_UP_WALLET } from '@/graphql/mutations/wallet';
import { GET_WALLETS } from '@/graphql/queries/wallet';

type TopUpModalProps = {
  isOpen: boolean;
  onClose: () => void;
  wallets: Wallet[];
  selectedWalletId: string | null;
};

export default function TopUpModal({
  isOpen,
  onClose,
  wallets,
  selectedWalletId,
}: TopUpModalProps) {
  const [amount, setAmount] = useState('');

  const selectedWallet = wallets.find((w) => w.id === selectedWalletId);

  const [topUpWallet, { loading }] = useMutation(TOP_UP_WALLET, {
    refetchQueries: [{ query: GET_WALLETS }],
    onCompleted: () => {
      alert('Top up successful!');
      onClose();
      setAmount('');
    },
    onError: (error) => {
      alert(`Error: ${error.message}`);
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedWallet) {
      alert('Wallet not found');
      return;
    }

    // Convert amount to minor units (e.g., 100.50 -> 10050)
    const amountMinor = Math.round(parseFloat(amount) * 100);

    await topUpWallet({
      variables: {
        currency: selectedWallet.currency,
        amountMinor,
      },
    });
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Top Up Wallet">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Wallet
          </label>
          <div className="px-3 py-2 border border-gray-300 rounded-md bg-gray-50">
            <span className="font-semibold">
              {selectedWallet?.currency || 'N/A'}
            </span>
          </div>
        </div>

        <FormField
          label="Amount"
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="Enter amount"
          required
          min="1"
          step="0.01"
        />

        <div className="flex gap-3">
          <Button type="button" onClick={onClose} variant="secondary" fullWidth>
            Cancel
          </Button>
          <Button type="submit" fullWidth disabled={loading}>
            {loading ? 'Processing...' : 'Top Up'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
