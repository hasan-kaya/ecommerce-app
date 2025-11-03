import ProductCard from '@/components/shared/ProductCard';
import ProductFilters from '@/components/features/products/ProductFilters';
import Pagination from '@/components/features/products/Pagination';
import SortSelect from '@/components/features/products/SortSelect';
import { getClient } from '@/lib/apollo-client';
import { GET_PRODUCTS } from '@/graphql/queries/products';

const ITEMS_PER_PAGE = 12;

type SearchParams = Promise<{
  search?: string;
  category?: string;
  page?: string;
  minPrice?: string;
  maxPrice?: string;
  sort?: string;
}>;

interface Product {
  id: string;
  name: string;
  slug: string;
  priceMinor: string;
  currency: string;
  stockQty: number;
  category: {
    id: string;
    name: string;
    slug: string;
  };
}

interface ProductsResponse {
  products: Product[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export default async function ProductsPage(props: {
  searchParams: SearchParams;
}) {
  const searchParams = await props.searchParams;
  const searchQuery = searchParams.search || '';
  const selectedCategory = searchParams.category || null;
  const currentPage = Number(searchParams.page) || 1;
  const minPrice = Number(searchParams.minPrice) || 0;
  const maxPrice = Number(searchParams.maxPrice) || 0;
  const sortBy = searchParams.sort || 'default';

  const client = getClient();
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
  const total = response?.total || 0;
  const totalPages = response?.totalPages || 1;
  const start = (currentPage - 1) * ITEMS_PER_PAGE;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">All Products</h1>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <aside className="lg:col-span-1">
          <ProductFilters
            searchQuery={searchQuery}
            categories={[]}
            selectedCategory={selectedCategory}
            minPrice={minPrice}
            maxPrice={maxPrice}
          />
        </aside>

        <main className="lg:col-span-3">
          <div className="flex items-center justify-between mb-6">
            <div className="text-gray-600">
              Showing {start}-{start + products.length} of {total} products
            </div>
            <SortSelect currentSort={sortBy} />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product) => (
              <ProductCard
                key={product.id}
                name={product.name}
                price={Number(product.priceMinor)}
                currency={product.currency}
              />
            ))}
          </div>

          {products.length === 0 && (
            <div className="text-center py-12 text-gray-500">
              No products found matching your filters.
            </div>
          )}

          {totalPages > 1 && (
            <Pagination currentPage={currentPage} totalPages={totalPages} />
          )}
        </main>
      </div>
    </div>
  );
}
