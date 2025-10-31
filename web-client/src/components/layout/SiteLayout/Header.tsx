import Link from 'next/link';
import UserMenu from '@/components/shared/UserMenu';

export default function Header() {
  return (
    <header className="border-b">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="text-2xl font-bold">
            E-commerce Platform
          </Link>

          <div className="flex items-center gap-6">
            <nav className="flex gap-6">
              <Link href="/" className="hover:text-gray-600">
                Home
              </Link>
              <Link href="/products" className="hover:text-gray-600">
                Products
              </Link>
              <Link href="/cart" className="hover:text-gray-600">
                Cart
              </Link>
            </nav>

            <UserMenu />
          </div>
        </div>
      </div>
    </header>
  );
}
