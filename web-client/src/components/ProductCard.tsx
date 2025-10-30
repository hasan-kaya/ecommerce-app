type ProductCardProps = {
  name: string;
  price: number;
  currency: string;
  image?: string;
};

export default function ProductCard({ name, price, currency }: ProductCardProps) {
  return (
    <div className="border rounded-lg p-4 hover:shadow-lg transition-shadow">
      <div className="bg-gray-200 h-48 rounded mb-4 flex items-center justify-center">
        <span className="text-gray-400">No Image</span>
      </div>
      
      <h3 className="font-semibold text-lg mb-2">{name}</h3>
      
      <div className="flex items-center justify-between">
        <span className="text-xl font-bold">
          {(price / 100).toFixed(2)} {currency}
        </span>
        <button className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800">
          Add to Cart
        </button>
      </div>
    </div>
  );
}
