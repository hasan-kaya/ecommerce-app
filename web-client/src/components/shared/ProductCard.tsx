'use client';

import { useMutation } from '@apollo/client/react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Button from '@/components/ui/Button';
import { ADD_TO_CART } from '@/graphql/mutations/cart';
import { GET_CART } from '@/graphql/queries/cart';
import type { AddToCartResponse } from '@/graphql/types';
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

  const [addToCart, { loading: isAdding }] = useMutation<AddToCartResponse>(ADD_TO_CART, {
    update(cache, { data }) {
      if (data?.addToCart) {
        cache.writeQuery({
          query: GET_CART,
          data: { cart: data.addToCart },
        });
      }
    },
    onCompleted: () => {
      alert('Product added to cart!');
    },
    onError: (error) => {
      console.error('Failed to add to cart:', error);
      alert(`Error: ${error.message}`);
    },
  });

  const handleAddToCart = async () => {
    if (status === 'unauthenticated') {
      alert('Please login to add items to cart');
      router.push('/login');
      return;
    }

    if (status === 'loading') {
      return;
    }

    await addToCart({
      variables: {
        productId: id,
        qty: 1,
      },
    });
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
