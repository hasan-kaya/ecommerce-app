'use client';

import { useState } from 'react';
import Button from '@/components/ui/Button';
import { formatMoney } from '@/lib/utils/money';

type CartItemProps = {
  id: string;
  name: string;
  price: number;
  currency: string;
  quantity: number;
  onUpdateQuantity: (cartItemId: string, qty: number) => Promise<void>;
  onRemove: (cartItemId: string) => Promise<void>;
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
  const [isUpdating, setIsUpdating] = useState(false);
  const [isRemoving, setIsRemoving] = useState(false);
  const itemTotal = price * quantity;

  const handleUpdateQuantity = async (newQty: number) => {
    if (newQty < 1) return;

    setIsUpdating(true);
    await onUpdateQuantity(id, newQty);
    setIsUpdating(false);
  };

  const handleRemove = async () => {
    setIsRemoving(true);
    await onRemove(id);
    setIsRemoving(false);
  };

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
          onClick={() => handleUpdateQuantity(quantity - 1)}
          disabled={quantity <= 1 || isUpdating}
          variant="ghost"
          size="sm"
          className="w-8 h-8 p-0"
        >
          -
        </Button>
        <span className="w-12 text-center">{quantity}</span>
        <Button
          onClick={() => handleUpdateQuantity(quantity + 1)}
          disabled={isUpdating}
          variant="ghost"
          size="sm"
          className="w-8 h-8 p-0"
        >
          +
        </Button>
      </div>
      <div className="text-right w-24">
        <p className="font-bold">{formatMoney(itemTotal, currency)}</p>
      </div>
      <Button
        onClick={handleRemove}
        disabled={isRemoving}
        isLoading={isRemoving}
        variant="danger"
        size="sm"
      >
        Remove
      </Button>
    </div>
  );
}
