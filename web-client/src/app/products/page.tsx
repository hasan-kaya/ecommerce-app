import ProductCard from '@/components/shared/ProductCard';
import ProductFilters from '@/components/features/products/ProductFilters';
import Pagination from '@/components/features/products/Pagination';
import SortSelect from '@/components/features/products/SortSelect';

const allProducts = [
  {
    id: '1',
    name: 'Wireless Headphones',
    price: 9999,
    currency: 'USD',
    category: 'Electronics',
  },
  {
    id: '2',
    name: 'Smart Watch',
    price: 29999,
    currency: 'USD',
    category: 'Electronics',
  },
  {
    id: '3',
    name: 'Laptop Stand',
    price: 4999,
    currency: 'USD',
    category: 'Accessories',
  },
  {
    id: '4',
    name: 'USB-C Cable',
    price: 1999,
    currency: 'USD',
    category: 'Accessories',
  },
  {
    id: '5',
    name: 'Mechanical Keyboard',
    price: 12999,
    currency: 'USD',
    category: 'Electronics',
  },
  {
    id: '6',
    name: 'Wireless Mouse',
    price: 5999,
    currency: 'USD',
    category: 'Electronics',
  },
  {
    id: '7',
    name: 'Phone Case',
    price: 2999,
    currency: 'USD',
    category: 'Accessories',
  },
  {
    id: '8',
    name: 'Tablet',
    price: 49999,
    currency: 'USD',
    category: 'Electronics',
  },
  {
    id: '9',
    name: 'Desk Lamp',
    price: 3999,
    currency: 'USD',
    category: 'Home',
  },
  {
    id: '10',
    name: 'Monitor',
    price: 39999,
    currency: 'USD',
    category: 'Electronics',
  },
  {
    id: '11',
    name: 'Webcam',
    price: 7999,
    currency: 'USD',
    category: 'Electronics',
  },
  {
    id: '12',
    name: 'Notebook',
    price: 999,
    currency: 'USD',
    category: 'Accessories',
  },
];

const ITEMS_PER_PAGE = 6;
const categories = ['Electronics', 'Accessories', 'Home'];

type SearchParams = Promise<{
  search?: string;
  category?: string;
  minPrice?: string;
  maxPrice?: string;
  page?: string;
  sort?: string;
}>;

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

  let filteredProducts = allProducts.filter((product) => {
    const searchMatch =
      !searchQuery ||
      product.name.toLowerCase().includes(searchQuery.toLowerCase());
    const categoryMatch =
      !selectedCategory || product.category === selectedCategory;
    const priceMatch = product.price >= minPrice && product.price <= maxPrice;
    return searchMatch && categoryMatch && priceMatch;
  });

  // Sıralama
  if (sortBy === 'name-asc') {
    filteredProducts = [...filteredProducts].sort((a, b) =>
      a.name.localeCompare(b.name)
    );
  } else if (sortBy === 'name-desc') {
    filteredProducts = [...filteredProducts].sort((a, b) =>
      b.name.localeCompare(a.name)
    );
  } else if (sortBy === 'price-asc') {
    filteredProducts = [...filteredProducts].sort((a, b) => a.price - b.price);
  } else if (sortBy === 'price-desc') {
    filteredProducts = [...filteredProducts].sort((a, b) => b.price - a.price);
  }

  const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedProducts = filteredProducts.slice(
    startIndex,
    startIndex + ITEMS_PER_PAGE
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">All Products</h1>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <aside className="lg:col-span-1">
          <ProductFilters
            searchQuery={searchQuery}
            categories={categories}
            selectedCategory={selectedCategory}
            minPrice={minPrice}
            maxPrice={maxPrice}
          />
        </aside>

        <main className="lg:col-span-3">
          <div className="flex items-center justify-between mb-6">
            <div className="text-gray-600">
              Showing {paginatedProducts.length} of {filteredProducts.length}{' '}
              products
            </div>
            <SortSelect currentSort={sortBy} />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {paginatedProducts.map((product) => (
              <ProductCard
                key={product.id}
                name={product.name}
                price={product.price}
                currency={product.currency}
              />
            ))}
          </div>

          {filteredProducts.length === 0 && (
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
