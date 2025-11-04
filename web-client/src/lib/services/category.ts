import { GET_CATEGORIES } from '@/graphql/queries/categories';
import { getClient } from '@/lib/graphql/client';
import type { Category } from '@/graphql/types';

export async function fetchCategories() {
  const client = await getClient();
  const { data: categoriesData } = await client.query<{
    categories: {
      categories: Category[];
      total: number;
      page: number;
      pageSize: number;
      totalPages: number;
    };
  }>({
    query: GET_CATEGORIES,
  });
  return (
    categoriesData?.categories || {
      categories: [],
      total: 0,
      page: 1,
      pageSize: 10,
      totalPages: 0,
    }
  );
}
