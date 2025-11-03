import Button from '@/components/ui/Button';
import Link from 'next/link';
import { formatMoney } from '@/lib/utils/money';

type CartSummaryProps = {
  subtotal: number;
  currency: string;
};

export default function CartSummary({ subtotal, currency }: CartSummaryProps) {
  const shipping = 0;
  const total = subtotal + shipping;

  return (
    <div className="border rounded-lg p-6 sticky top-4">
      <h2 className="text-xl font-bold mb-4">Order Summary</h2>

      <div className="space-y-3 mb-4">
        <div className="flex justify-between">
          <span className="text-gray-600">Subtotal</span>
          <span className="font-semibold">
            {formatMoney(subtotal, currency)}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Shipping</span>
          <span className="font-semibold">
            {shipping === 0 ? 'Free' : formatMoney(shipping, currency)}
          </span>
        </div>
        <div className="border-t pt-3 flex justify-between text-lg">
          <span className="font-bold">Total</span>
          <span className="font-bold">{formatMoney(total, currency)}</span>
        </div>
      </div>

      <Link href="/checkout">
        <Button fullWidth size="lg">
          Proceed to Checkout
        </Button>
      </Link>
    </div>
  );
}
