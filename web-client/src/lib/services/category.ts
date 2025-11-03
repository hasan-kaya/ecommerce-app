import { GET_CATEGORIES } from '@/graphql/queries/categories';
import { getClient } from '@/lib/graphql/client';
import type { Category } from '@/graphql/types';

export async function fetchCategories() {
  const client = await getClient();
  const { data: categoriesData } = await client.query<{
    categories: Category[];
  }>({
    query: GET_CATEGORIES,
  });
  return categoriesData?.categories || [];
}
