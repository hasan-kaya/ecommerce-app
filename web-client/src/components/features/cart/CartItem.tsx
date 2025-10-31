import Button from '@/components/ui/Button';

type CartItemProps = {
  id: string;
  name: string;
  price: number;
  currency: string;
  quantity: number;
  onUpdateQuantity: (id: string, quantity: number) => void;
  onRemove: (id: string) => void;
};

export default function CartItem({
  id,
  name,
  price,
  currency,
  quantity,
  onUpdateQuantity,
  onRemove,
}: CartItemProps) {
  return (
    <div className="flex items-center gap-4 border-b py-4">
      <div className="bg-gray-200 w-24 h-24 rounded flex items-center justify-center flex-shrink-0">
        <span className="text-gray-400 text-sm">No Image</span>
      </div>

      <div className="flex-1">
        <h3 className="font-semibold text-lg">{name}</h3>
        <p className="text-gray-600">
          {(price / 100).toFixed(2)} {currency}
        </p>
      </div>

      <div className="flex items-center gap-2">
        <Button
          onClick={() => onUpdateQuantity(id, quantity - 1)}
          disabled={quantity <= 1}
          variant="ghost"
          size="sm"
          className="w-8 h-8 p-0"
        >
          -
        </Button>
        <span className="w-12 text-center">{quantity}</span>
        <Button
          onClick={() => onUpdateQuantity(id, quantity + 1)}
          variant="ghost"
          size="sm"
          className="w-8 h-8 p-0"
        >
          +
        </Button>
      </div>

      <div className="text-right w-24">
        <p className="font-bold">
          {((price * quantity) / 100).toFixed(2)} {currency}
        </p>
      </div>

      <Button
        onClick={() => onRemove(id)}
        variant="danger"
        size="sm"
        className="bg-transparent text-red-600 hover:bg-red-50 hover:text-red-800"
      >
        Remove
      </Button>
    </div>
  );
}
