import Button from '@/components/ui/Button';
import { Wallet } from '@/graphql/types';
import { formatMoney } from '@/lib/utils/money';

type WalletCardProps = {
  wallet: Wallet;
  onTopUp: () => void;
  onShowHistory: () => void;
  onTransfer: () => void;
};

export default function WalletCard({
  wallet,
  onTopUp,
  onShowHistory,
  onTransfer,
}: WalletCardProps) {
  return (
    <div className="border rounded-lg p-6 hover:shadow-lg transition-shadow">
      <div className="flex items-center justify-between mb-4">
        <div
          className={`w-12 h-12 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold`}
        >
          {wallet.currency}
        </div>
      </div>

      <div className="mb-4">
        <p className="text-sm text-gray-500 mb-1">Balance</p>
        <p className="text-2xl font-bold">
          {formatMoney(wallet.balanceMinor, wallet.currency)}
        </p>
      </div>

      <div className="space-y-2">
        <div className="flex gap-2">
          <Button onClick={onTopUp} fullWidth size="sm" variant="success">
            Top Up
          </Button>
          <Button onClick={onTransfer} fullWidth size="sm">
            Transfer
          </Button>
        </div>
        <Button onClick={onShowHistory} fullWidth size="sm" variant="secondary">
          Show Transactions
        </Button>
      </div>
    </div>
  );
}
