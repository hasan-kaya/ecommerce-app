import Button from '@/components/ui/Button';
import { formatMoney } from '@/lib/utils/money';

type CartItemProps = {
  name: string;
  price: number;
  currency: string;
  quantity: number;
};

export default function CartItem({
  name,
  price,
  currency,
  quantity,
}: CartItemProps) {
  const itemTotal = price * quantity;

  return (
    <div className="flex items-center gap-4 border-b py-4">
      <div className="bg-gray-200 w-24 h-24 rounded flex items-center justify-center flex-shrink-0">
        <span className="text-gray-400 text-sm">No Image</span>
      </div>

      <div className="flex-1">
        <h3 className="font-semibold text-lg">{name}</h3>
        <p className="text-gray-600">{formatMoney(price, currency)}</p>
      </div>

      <div className="flex items-center gap-2">
        <Button
          disabled={quantity <= 1}
          variant="ghost"
          size="sm"
          className="w-8 h-8 p-0"
        >
          -
        </Button>
        <span className="w-12 text-center">{quantity}</span>
        <Button variant="ghost" size="sm" className="w-8 h-8 p-0">
          +
        </Button>
      </div>

      <div className="text-right w-24">
        <p className="font-bold">{formatMoney(itemTotal, currency)}</p>
      </div>

      <Button
        variant="danger"
        size="sm"
        className="bg-transparent text-red-600 hover:bg-red-50 hover:text-red-800"
      >
        Remove
      </Button>
    </div>
  );
}
