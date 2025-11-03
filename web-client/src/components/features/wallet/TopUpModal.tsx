'use client';

import { useState } from 'react';
import Button from '@/components/ui/Button';
import FormSelect from '@/components/ui/FormSelect';
import FormField from '@/components/ui/FormField';
import Modal from '@/components/ui/Modal';
import { Wallet } from '@/graphql/types';

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
  const [walletId, setWalletId] = useState(selectedWalletId || '');
  const [amount, setAmount] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // API call will be added later
    alert(`Top up ${amount} to wallet ${walletId}`);
    onClose();
    setAmount('');
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Top Up Wallet">
      <form onSubmit={handleSubmit} className="space-y-4">
        <FormSelect
          label="Select Wallet"
          value={walletId}
          onChange={(e) => setWalletId(e.target.value)}
          required
        >
          <option value="">Choose a wallet</option>
          {wallets.map((wallet) => (
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
            Top Up
          </Button>
        </div>
      </form>
    </Modal>
  );
}
