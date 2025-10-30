import ProductCard from '@/components/shared/ProductCard';

const featuredProducts = [
  { id: '1', name: 'Wireless Headphones', price: 9999, currency: 'USD' },
  { id: '2', name: 'Smart Watch', price: 29999, currency: 'USD' },
  { id: '3', name: 'Laptop Stand', price: 4999, currency: 'USD' },
  { id: '4', name: 'USB-C Cable', price: 1999, currency: 'USD' },
  { id: '5', name: 'Mechanical Keyboard', price: 12999, currency: 'USD' },
  { id: '6', name: 'Wireless Mouse', price: 5999, currency: 'USD' },
];

export default function Home() {
  return (
    <div className="container mx-auto px-4 py-8">
      <section>
        <h3 className="text-2xl font-bold mb-6">Featured Products</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredProducts.map((product) => (
            <ProductCard
              key={product.id}
              name={product.name}
              price={product.price}
              currency={product.currency}
            />
          ))}
        </div>
      </section>
    </div>
  );
}
