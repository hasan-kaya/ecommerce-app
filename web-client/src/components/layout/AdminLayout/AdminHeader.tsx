'use client';

import { useRouter } from 'next/navigation';

export default function AdminHeader() {
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem('user');
    window.dispatchEvent(new Event('userChanged'));
    router.push('/');
  };

  return (
    <header className="bg-white border-b px-6 py-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">E-commerce Admin</h1>

        <div className="flex items-center gap-4">
          <span className="text-gray-600">Admin User</span>
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          >
            Logout
          </button>
        </div>
      </div>
    </header>
  );
}
