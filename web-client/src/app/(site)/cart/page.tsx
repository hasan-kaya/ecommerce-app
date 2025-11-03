import Link from 'next/link';
import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import CartItem from '@/components/features/cart/CartItem';
import CartSummary from '@/components/features/cart/CartSummary';
import { fetchCart } from '@/lib/services/cart';

export default async function CartPage() {
  const session = await getServerSession(authOptions);
  if (!session) {
    redirect('/login');
  }

  const cart = await fetchCart();

  if (!cart || cart.cartItems.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-4">Your Cart is Empty</h1>
          <p className="text-gray-600 mb-8">
            Add some products to your cart to see them here.
          </p>
          <Link
            href="/products"
            className="inline-block bg-black text-white px-6 py-3 rounded hover:bg-gray-800"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  const totalPrice = Number(cart.totalPrice);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Shopping Cart</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="border rounded-lg p-4">
            {cart.cartItems.map((item) => (
              <CartItem
                key={item.id}
                name={item.product.name}
                price={Number(item.product.priceMinor)}
                currency={item.product.currency}
                quantity={item.qty}
              />
            ))}
          </div>

          <Link
            href="/products"
            className="inline-block mt-4 text-blue-600 hover:underline"
          >
            ← Continue Shopping
          </Link>
        </div>

        <div className="lg:col-span-1">
          <CartSummary subtotal={totalPrice} currency="USD" />
        </div>
      </div>
    </div>
  );
}
