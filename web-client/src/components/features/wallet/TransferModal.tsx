'use client';

import { useState } from 'react';
import Button from '@/components/ui/Button';
import FormSelect from '@/components/ui/FormSelect';
import FormField from '@/components/ui/FormField';
import Modal from '@/components/ui/Modal';
import { Wallet } from '@/graphql/types';

type TransferModalProps = {
  isOpen: boolean;
  onClose: () => void;
  wallets: Wallet[];
  selectedFromWalletId?: string | null;
};

export default function TransferModal({
  isOpen,
  onClose,
  wallets,
  selectedFromWalletId,
}: TransferModalProps) {
  const [toWalletId, setToWalletId] = useState('');
  const [amount, setAmount] = useState('');

  const fromWallet = wallets.find((w) => w.id === selectedFromWalletId);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedFromWalletId) {
      alert('Source wallet not selected');
      return;
    }

    if (selectedFromWalletId === toWalletId) {
      alert('Cannot transfer to the same wallet');
      return;
    }

    // API call will be added later
    alert(`Transfer ${amount} from ${selectedFromWalletId} to ${toWalletId}`);
    onClose();
    setAmount('');
    setToWalletId('');
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Transfer">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            From Wallet
          </label>
          <div className="px-3 py-2 border border-gray-300 rounded-md bg-gray-50">
            <span className="font-semibold">
              {fromWallet?.currency || 'N/A'}
            </span>
          </div>
        </div>

        <FormSelect
          label="To Wallet"
          value={toWalletId}
          onChange={(e) => setToWalletId(e.target.value)}
          required
        >
          <option value="">Choose destination wallet</option>
          {wallets
            .filter((w) => w.id !== selectedFromWalletId)
            .map((wallet) => (
              <option key={wallet.id} value={wallet.id}>
                {wallet.currency}
              </option>
            ))}
        </FormSelect>

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
          <Button type="submit" fullWidth>
            Transfer
          </Button>
        </div>
      </form>
    </Modal>
  );
}
