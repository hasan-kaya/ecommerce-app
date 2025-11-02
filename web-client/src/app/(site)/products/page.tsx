import ProductCard from '@/components/shared/ProductCard';
import ProductFilters from '@/components/features/products/ProductFilters';
import Pagination from '@/components/features/products/Pagination';
import SortSelect from '@/components/features/products/SortSelect';
import { getClient } from '@/lib/apollo-client';
import { GET_PRODUCTS } from '@/graphql/queries/products';

const ITEMS_PER_PAGE = 6;

type SearchParams = Promise<{
  search?: string;
  category?: string;
  minPrice?: string;
  maxPrice?: string;
  page?: string;
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

export default async function ProductsPage(props: {
  searchParams: SearchParams;
}) {
  const searchParams = await props.searchParams;
  const searchQuery = searchParams.search || '';
  const selectedCategory = searchParams.category || null;
  const minPrice = Number(searchParams.minPrice) || 0;
  const maxPrice = Number(searchParams.maxPrice) || 100000;
  const currentPage = Number(searchParams.page) || 1;
  const sortBy = searchParams.sort || 'default';

  const client = getClient();
  const { data } = await client.query<{ products: Product[] }>({
    query: GET_PRODUCTS,
    variables: {
      category: selectedCategory,
      search: searchQuery,
    },
  });

  const allProducts: Product[] = data?.products || [];

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
              Showing {allProducts.length} of {allProducts.length} products
            </div>
            <SortSelect currentSort={sortBy} />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {allProducts.map((product) => (
              <ProductCard
                key={product.id}
                name={product.name}
                price={Number(product.priceMinor)}
                currency={product.currency}
              />
            ))}
          </div>

          {allProducts.length === 0 && (
            <div className="text-center py-12 text-gray-500">
              No products found matching your filters.
            </div>
          )}
          {/* TODO: Pagination */}
          {1 > 1 && <Pagination currentPage={currentPage} totalPages={1} />}
        </main>
      </div>
    </div>
  );
}
