type OrderItem = {
  id: string;
  name: string;
  price: number;
  quantity: number;
};

type OrderSummaryProps = {
  items: OrderItem[];
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
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shipping = 0;
  const total = subtotal + shipping;

  return (
    <div className="border rounded-lg p-6 sticky top-4">
      <h2 className="text-xl font-bold mb-4">Order Summary</h2>

      <div className="space-y-3 mb-4">
        {items.map((item) => (
          <div key={item.id} className="flex justify-between text-sm">
            <span className="text-gray-600">
              {item.name} x {item.quantity}
            </span>
            <span>{((item.price * item.quantity) / 100).toFixed(2)}</span>
          </div>
        ))}
      </div>

      <div className="border-t pt-3 space-y-2 mb-4">
        <div className="flex justify-between">
          <span className="text-gray-600">Subtotal</span>
          <span className="font-semibold">
            {(subtotal / 100).toFixed(2)} {currency}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Shipping</span>
          <span className="font-semibold">Free</span>
        </div>
        <div className="border-t pt-2 flex justify-between text-lg">
          <span className="font-bold">Total</span>
          <span className="font-bold">
            {(total / 100).toFixed(2)} {currency}
          </span>
        </div>
      </div>

      <button
        onClick={onPlaceOrder}
        disabled={isProcessing}
        className="w-full bg-black text-white py-3 rounded hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isProcessing ? 'Processing...' : 'Place Order'}
      </button>
    </div>
  );
}
