import Link from 'next/link';

export default function AdminSidebar() {
  return (
    <aside className="w-64 bg-gray-900 text-white min-h-screen">
      <div className="p-6">
        <h2 className="text-2xl font-bold">Admin Panel</h2>
      </div>

      <nav className="mt-6">
        <Link
          href="/admin"
          className="block px-6 py-3 hover:bg-gray-800 border-l-4 border-transparent hover:border-blue-500"
        >
          Dashboard
        </Link>
        <Link
          href="/admin/products"
          className="block px-6 py-3 hover:bg-gray-800 border-l-4 border-transparent hover:border-blue-500"
        >
          Products
        </Link>
        <Link
          href="/admin/orders"
          className="block px-6 py-3 hover:bg-gray-800 border-l-4 border-transparent hover:border-blue-500"
        >
          Orders
        </Link>
        <Link
          href="/admin/users"
          className="block px-6 py-3 hover:bg-gray-800 border-l-4 border-transparent hover:border-blue-500"
        >
          Users
        </Link>
        <Link
          href="/admin/categories"
          className="block px-6 py-3 hover:bg-gray-800 border-l-4 border-transparent hover:border-blue-500"
        >
          Categories
        </Link>
      </nav>
    </aside>
  );
}
