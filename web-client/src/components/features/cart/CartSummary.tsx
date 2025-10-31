import Button from '@/components/ui/Button';

type CartSummaryProps = {
  subtotal: number;
  currency: string;
  onCheckout: () => void;
};

export default function CartSummary({
  subtotal,
  currency,
  onCheckout,
}: CartSummaryProps) {
  const shipping = 0;
  const total = subtotal + shipping;

  return (
    <div className="border rounded-lg p-6 sticky top-4">
      <h2 className="text-xl font-bold mb-4">Order Summary</h2>

      <div className="space-y-3 mb-4">
        <div className="flex justify-between">
          <span className="text-gray-600">Subtotal</span>
          <span className="font-semibold">
            {(subtotal / 100).toFixed(2)} {currency}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Shipping</span>
          <span className="font-semibold">
            {shipping === 0 ? 'Free' : `${(shipping / 100).toFixed(2)} ${currency}`}
          </span>
        </div>
        <div className="border-t pt-3 flex justify-between text-lg">
          <span className="font-bold">Total</span>
          <span className="font-bold">
            {(total / 100).toFixed(2)} {currency}
          </span>
        </div>
      </div>

      <Button
        onClick={onCheckout}
        fullWidth
        size="lg"
      >
        Proceed to Checkout
      </Button>
    </div>
  );
}
