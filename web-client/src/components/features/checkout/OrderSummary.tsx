import Button from '@/components/ui/Button';
import { formatMoney } from '@/lib/utils/money';
import type { CartItem } from '@/graphql/types';

type OrderSummaryProps = {
  items: CartItem[];
  currency: string;
  onPlaceOrder: () => void;
  isProcessing: boolean;
};

export default function OrderSummary({
  items,
  currency,
  onPlaceOrder,
  isProcessing,
}: OrderSummaryProps) {
  const subtotal = items.reduce(
    (sum, item) => sum + Number(item.product.priceMinor) * item.qty,
    0
  );
  const shipping = 0;
  const total = subtotal + shipping;

  return (
    <div className="border rounded-lg p-6 sticky top-4">
      <h2 className="text-xl font-bold mb-4">Order Summary</h2>

      <div className="space-y-3 mb-4">
        {items.map((item) => (
          <div key={item.id} className="flex justify-between text-sm">
            <span className="text-gray-600">
              {item.product.name} x {item.qty}
            </span>
            <span>{formatMoney(Number(item.product.priceMinor) * item.qty, currency)}</span>
          </div>
        ))}
      </div>

      <div className="border-t pt-3 space-y-2 mb-4">
        <div className="flex justify-between">
          <span className="text-gray-600">Subtotal</span>
          <span className="font-semibold">
            {formatMoney(subtotal, currency)}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Shipping</span>
          <span className="font-semibold">Free</span>
        </div>
        <div className="border-t pt-2 flex justify-between text-lg">
          <span className="font-bold">Total</span>
          <span className="font-bold">{formatMoney(total, currency)}</span>
        </div>
      </div>

      <Button
        onClick={onPlaceOrder}
        isLoading={isProcessing}
        fullWidth
        size="lg"
      >
        {isProcessing ? 'Processing...' : 'Place Order'}
      </Button>
    </div>
  );
}
