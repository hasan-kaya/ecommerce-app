import { formatMoney } from '@/lib/utils/money';

type Transaction = {
  id: string;
  type: 'top_up' | 'transfer_in' | 'transfer_out' | 'payment';
  amount: number;
  currency: string;
  description: string;
  createdAt: string;
};

type TransactionHistoryProps = {
  transactions: Transaction[];
  currency: string;
};

export default function TransactionHistory({
  transactions,
  currency,
}: TransactionHistoryProps) {
  const getTransactionIcon = (type: Transaction['type']) => {
    switch (type) {
      case 'top_up':
        return '↓';
      case 'transfer_in':
        return '←';
      case 'transfer_out':
        return '→';
      case 'payment':
        return '💳';
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
      case 'payment':
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
      case 'payment':
        return 'Payment';
      default:
        return 'Transaction';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('tr-TR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  return (
    <div className="border rounded-lg p-6">
      <h2 className="text-2xl font-bold mb-6">
        Transaction History - {currency}
      </h2>

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
                  className={`font-bold ${getTransactionColor(transaction.type)}`}
                >
                  {transaction.type === 'top_up' || transaction.type === 'transfer_in' ? '+' : '-'}
                  {formatMoney(transaction.amount, transaction.currency)}
                </p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
