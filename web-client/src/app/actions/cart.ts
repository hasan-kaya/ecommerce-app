'use server';

import { getClient } from '@/lib/graphql/client';
import { ADD_TO_CART } from '@/graphql/mutations/cart';

export async function addToCartAction(productId: string, qty: number = 1) {
  try {
    const client = await getClient();

    const result = await client.mutate({
      mutation: ADD_TO_CART,
      variables: {
        productId,
        qty,
      },
    });

    if (!result.data) {
      return {
        success: false as const,
        error: 'No data returned from mutation',
      };
    }

    return {
      success: true as const,
      data: result.data,
    };
  } catch (error) {
    console.error('Add to cart error:', error);
    return {
      success: false as const,
      error: error instanceof Error ? error.message : 'Failed to add to cart',
    };
  }
}
