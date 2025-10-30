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
        <button
          onClick={() => onUpdateQuantity(id, quantity - 1)}
          disabled={quantity <= 1}
          className="w-8 h-8 border rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          -
        </button>
        <span className="w-12 text-center">{quantity}</span>
        <button
          onClick={() => onUpdateQuantity(id, quantity + 1)}
          className="w-8 h-8 border rounded hover:bg-gray-100"
        >
          +
        </button>
      </div>

      <div className="text-right w-24">
        <p className="font-bold">
          {((price * quantity) / 100).toFixed(2)} {currency}
        </p>
      </div>

      <button
        onClick={() => onRemove(id)}
        className="text-red-600 hover:text-red-800 px-2"
      >
        Remove
      </button>
    </div>
  );
}
