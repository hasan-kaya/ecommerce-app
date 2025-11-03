'use server';

import { ApolloClient, InMemoryCache, HttpLink } from '@apollo/client';
import { cookies } from 'next/headers';
import { ADD_TO_CART } from '@/graphql/mutations/cart';

const BACKEND_URL = process.env.BACKEND_URL || 'http://monolith-api:4000';

export async function addToCartAction(productId: string, qty: number = 1) {
  try {
    const cookieStore = await cookies();
    const sessionToken = cookieStore.get('session_token')?.value;

    if (!sessionToken) {
      return {
        success: false as const,
        error: 'Not authenticated',
      };
    }

    const client = new ApolloClient({
      cache: new InMemoryCache(),
      link: new HttpLink({
        uri: `${BACKEND_URL}/graphql`,
        headers: {
          cookie: `session_token=${sessionToken}`,
        },
      }),
    });

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
