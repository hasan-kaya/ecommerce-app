'use client';

import { useState } from 'react';
import WalletCard from '@/components/features/wallet/WalletCard';
import Modal from '@/components/ui/Modal';
import TopUpModal from '@/components/features/wallet/TopUpModal';
import TransferModal from '@/components/features/wallet/TransferModal';
import TransactionHistory from '@/components/features/wallet/TransactionHistory';
import { WalletsResponse } from '@/graphql/types';
import { GET_WALLETS } from '@/graphql/queries/wallet';
import { useQuery } from '@apollo/client/react';

const mockTransactions = [
  {
    id: '1',
    type: 'top_up',
    amount: 50000,
    currency: 'TRY',
    description: 'Top up via credit card',
    createdAt: '2025-11-03T10:30:00Z',
  },
  {
    id: '2',
    type: 'transfer_out',
    amount: 10000,
    currency: 'TRY',
    description: 'Transfer to USD wallet',
    createdAt: '2025-11-03T09:15:00Z',
  },
  {
    id: '3',
    type: 'payment',
    amount: 25000,
    currency: 'TRY',
    description: 'Order payment #ORD-123',
    createdAt: '2025-11-02T14:20:00Z',
  },
  {
    id: '4',
    type: 'top_up',
    amount: 2000,
    currency: 'USD',
    description: 'Top up via bank transfer',
    createdAt: '2025-11-01T16:45:00Z',
  },
];

export default function WalletsPage() {
  const [isTopUpModalOpen, setIsTopUpModalOpen] = useState(false);
  const [isTransferModalOpen, setIsTransferModalOpen] = useState(false);
  const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);
  const [selectedWalletForTopUp, setSelectedWalletForTopUp] = useState<
    string | null
  >(null);
  const [selectedWalletForTransfer, setSelectedWalletForTransfer] = useState<
    string | null
  >(null);
  const [selectedWalletForHistory, setSelectedWalletForHistory] = useState<
    string | null
  >(null);

  const { data: walletsData } = useQuery<WalletsResponse>(GET_WALLETS);

  const handleTopUp = (walletId: string) => {
    setSelectedWalletForTopUp(walletId);
    setIsTopUpModalOpen(true);
  };

  const handleTransfer = (walletId: string) => {
    setSelectedWalletForTransfer(walletId);
    setIsTransferModalOpen(true);
  };

  const handleShowHistory = (walletId: string) => {
    setSelectedWalletForHistory(walletId);
    setIsHistoryModalOpen(true);
  };

  const wallets = walletsData?.wallets || [];

  const selectedWallet = wallets.find((w) => w.id === selectedWalletForHistory);
  const filteredTransactions = mockTransactions;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">My Wallets</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {wallets.map((wallet) => (
          <WalletCard
            key={wallet.id}
            wallet={wallet}
            onTopUp={() => handleTopUp(wallet.id)}
            onTransfer={() => handleTransfer(wallet.id)}
            onShowHistory={() => handleShowHistory(wallet.id)}
          />
        ))}
      </div>

      {/* Modals */}
      <TopUpModal
        isOpen={isTopUpModalOpen}
        onClose={() => setIsTopUpModalOpen(false)}
        wallets={wallets}
        selectedWalletId={selectedWalletForTopUp}
      />

      <TransferModal
        isOpen={isTransferModalOpen}
        onClose={() => setIsTransferModalOpen(false)}
        wallets={wallets}
        selectedFromWalletId={selectedWalletForTransfer}
      />

      {selectedWallet && (
        <Modal
          isOpen={isHistoryModalOpen}
          onClose={() => setIsHistoryModalOpen(false)}
          title={`${selectedWallet.currency} Wallet History`}
        >
          <TransactionHistory
            transactions={filteredTransactions}
            currency={selectedWallet.currency}
          />
        </Modal>
      )}
    </div>
  );
}
