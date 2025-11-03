import { getClient } from '@/lib/graphql/client';
import { GET_CART } from '@/graphql/queries/cart';
import type { Cart } from '@/graphql/types/cart';

export async function fetchCart() {
  const client = await getClient();
  const { data } = await client.query<{ cart: Cart }>({
    query: GET_CART,
    fetchPolicy: 'no-cache',
  });
  return data?.cart || null;
}
