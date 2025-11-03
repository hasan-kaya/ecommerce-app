import Link from 'next/link';
import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { fetchCart } from '@/lib/services/cart';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import CartClient from '@/components/features/cart/CartClient';

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

  return <CartClient initialCart={cart} />;
}
