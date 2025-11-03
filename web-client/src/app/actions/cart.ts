'use server';

import { revalidatePath } from 'next/cache';
import { getClient } from '@/lib/graphql/client';
import {
  ADD_TO_CART,
  UPDATE_CART_ITEM_QUANTITY,
  REMOVE_CART_ITEM,
} from '@/graphql/mutations/cart';

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

export async function updateCartItemQuantityAction(
  cartItemId: string,
  qty: number
) {
  try {
    const client = await getClient();

    const result = await client.mutate({
      mutation: UPDATE_CART_ITEM_QUANTITY,
      variables: {
        cartItemId,
        qty,
      },
    });

    if (!result.data) {
      return {
        success: false as const,
        error: 'No data returned from mutation',
      };
    }

    revalidatePath('/cart');

    return {
      success: true as const,
      data: result.data.updateCartItemQuantity,
    };
  } catch (error) {
    console.error('Update cart item error:', error);
    return {
      success: false as const,
      error:
        error instanceof Error ? error.message : 'Failed to update cart item',
    };
  }
}

export async function removeCartItemAction(cartItemId: string) {
  try {
    const client = await getClient();

    const result = await client.mutate({
      mutation: REMOVE_CART_ITEM,
      variables: {
        cartItemId,
      },
    });

    if (!result.data) {
      return {
        success: false as const,
        error: 'No data returned from mutation',
      };
    }

    revalidatePath('/cart');

    return {
      success: true as const,
      data: result.data.removeCartItem,
    };
  } catch (error) {
    console.error('Remove cart item error:', error);
    return {
      success: false as const,
      error:
        error instanceof Error ? error.message : 'Failed to remove cart item',
    };
  }
}
