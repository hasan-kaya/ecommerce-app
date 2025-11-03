import { getClient } from '@/lib/graphql/client';
import { GET_PRODUCTS } from '@/graphql/queries/products';
import type { Product, ProductsResponse } from '@/graphql/types';

const ITEMS_PER_PAGE = 12;

type FetchProductsParams = {
  selectedCategory?: string | null;
  searchQuery?: string;
  currentPage?: number;
};

export async function fetchProducts({
  selectedCategory,
  searchQuery,
  currentPage,
}: FetchProductsParams) {
  const client = await getClient();

  const { data } = await client.query<{ products: ProductsResponse }>({
    query: GET_PRODUCTS,
    variables: {
      category: selectedCategory,
      search: searchQuery,
      page: currentPage,
      pageSize: ITEMS_PER_PAGE,
    },
  });

  const response = data?.products;
  const products: Product[] = response?.products || [];
  const totalPages = response?.totalPages || 1;

  return { products, totalPages };
}
