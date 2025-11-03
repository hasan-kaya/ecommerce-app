'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import Button from '@/components/ui/Button';
import { addToCartAction } from '@/app/actions/cart';
import { formatMoney } from '@/lib/utils/money';

type ProductCardProps = {
  id: string;
  name: string;
  price: number;
  currency: string;
  image?: string;
};

export default function ProductCard({
  id,
  name,
  price,
  currency,
}: ProductCardProps) {
  const { status } = useSession();
  const router = useRouter();
  const [isAdding, setIsAdding] = useState(false);

  const handleAddToCart = async () => {
    if (status === 'unauthenticated') {
      alert('Please login to add items to cart');
      router.push('/login');
      return;
    }

    if (status === 'loading') {
      return;
    }

    setIsAdding(true);

    try {
      const result = await addToCartAction(id, 1);

      if (!result.success) {
        throw new Error(result.error);
      }

      alert('Product added to cart!');
    } catch (error) {
      console.error('Failed to add to cart:', error);
      alert(
        `Error: ${
          error instanceof Error ? error.message : 'Failed to add to cart'
        }`
      );
    } finally {
      setIsAdding(false);
    }
  };

  return (
    <div className="border rounded-lg p-4 hover:shadow-lg transition-shadow">
      <div className="bg-gray-200 h-48 rounded mb-4 flex items-center justify-center">
        <span className="text-gray-400">No Image</span>
      </div>

      <h3 className="font-semibold text-lg mb-2">{name}</h3>

      <div className="flex items-center justify-between">
        <span className="text-xl font-bold">
          {formatMoney(price, currency)}
        </span>
        <Button onClick={handleAddToCart} isLoading={isAdding}>
          Add to Cart
        </Button>
      </div>
    </div>
  );
}
