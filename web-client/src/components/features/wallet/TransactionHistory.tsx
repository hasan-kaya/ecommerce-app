'use client';

import { useState } from 'react';
import { useQuery } from '@apollo/client/react';
import { formatMoney } from '@/lib/utils/money';
import { formatDate } from '@/lib/utils/date';
import { GET_WALLET_TRANSACTIONS } from '@/graphql/queries/walletTransaction';
import Pagination from '@/components/ui/Pagination';

type Transaction = {
  id: string;
  type: 'top_up' | 'transfer_in' | 'transfer_out' | 'purchase';
  amountMinor: string;
  currency: string;
  description: string;
  createdAt: string;
};

type TransactionHistoryProps = {
  currency: string;
};

export default function TransactionHistory({
  currency,
}: TransactionHistoryProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  const { data, loading, error } = useQuery(GET_WALLET_TRANSACTIONS, {
    variables: { currency, page: currentPage, pageSize },
  });

  if (loading) {
    return (
      <div className="py-6">
        <p className="text-gray-500 text-center py-8">Loading...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="py-6">
        <p className="text-red-500 text-center py-8">Error: {error.message}</p>
      </div>
    );
  }

  const transactions: Transaction[] =
    (data as any)?.walletTransactions?.transactions || [];
  const total = (data as any)?.walletTransactions?.total || 0;
  const totalPages = Math.ceil(total / pageSize);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const getTransactionIcon = (type: Transaction['type']) => {
    switch (type) {
      case 'top_up':
      case 'transfer_in':
        return '←';
      case 'transfer_out':
      case 'purchase':
        return '→';
      default:
        return '•';
    }
  };

  const getTransactionColor = (type: Transaction['type']) => {
    switch (type) {
      case 'top_up':
      case 'transfer_in':
        return 'text-green-600';
      case 'transfer_out':
      case 'purchase':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  const getTransactionLabel = (type: Transaction['type']) => {
    switch (type) {
      case 'top_up':
        return 'Top Up';
      case 'transfer_in':
        return 'Transfer In';
      case 'transfer_out':
        return 'Transfer Out';
      case 'purchase':
        return 'Purchase';
      default:
        return 'Transaction';
    }
  };

  return (
    <div className="py-6">
      <div className="space-y-4">
        {transactions.length === 0 ? (
          <p className="text-gray-500 text-center py-8">No transactions yet</p>
        ) : (
          transactions.map((transaction) => (
            <div
              key={transaction.id}
              className="flex items-center justify-between border-b pb-4 last:border-b-0"
            >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-xl">
                  {getTransactionIcon(transaction.type)}
                </div>
                <div>
                  <p className="font-semibold">
                    {getTransactionLabel(transaction.type)}
                  </p>
                  <p className="text-sm text-gray-500">
                    {transaction.description}
                  </p>
                  <p className="text-xs text-gray-400">
                    {formatDate(transaction.createdAt)}
                  </p>
                </div>
              </div>

              <div className="text-right">
                <p
                  className={`font-bold ${getTransactionColor(
                    transaction.type
                  )}`}
                >
                  {transaction.type === 'top_up' ||
                  transaction.type === 'transfer_in'
                    ? '+'
                    : '-'}
                  {formatMoney(
                    parseInt(transaction.amountMinor),
                    transaction.currency
                  )}
                </p>
              </div>
            </div>
          ))
        )}
      </div>

      {totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      )}
    </div>
  );
}
