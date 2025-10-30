'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function UserMenu() {
  const router = useRouter();
  const [user, setUser] = useState<{ name: string; email: string } | null>(
    null
  );
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // Check if user is logged in
    const checkUser = () => {
      const userData = localStorage.getItem('user');
      if (userData) {
        setUser(JSON.parse(userData));
      } else {
        setUser(null);
      }
    };

    // Initial check
    checkUser();

    // Listen for storage changes (from other tabs/windows)
    window.addEventListener('storage', checkUser);

    // Listen for custom event (from same tab)
    window.addEventListener('userChanged', checkUser);

    return () => {
      window.removeEventListener('storage', checkUser);
      window.removeEventListener('userChanged', checkUser);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('user');

    // Dispatch custom event to notify other components
    window.dispatchEvent(new Event('userChanged'));

    setUser(null);
    setIsOpen(false);
    router.push('/');
  };

  if (!user) {
    return (
      <div className="flex gap-4">
        <Link href="/login" className="hover:text-gray-600">
          Login
        </Link>
      </div>
    );
  }

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 hover:text-gray-600"
      >
        <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
          {user.name.charAt(0).toUpperCase()}
        </div>
        <span>{user.name}</span>
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute right-0 mt-2 w-48 bg-white border rounded-lg shadow-lg z-20">
            <Link
              href="/orders"
              className="block px-4 py-2 hover:bg-gray-100"
              onClick={() => setIsOpen(false)}
            >
              Order History
            </Link>
            <Link
              href="/wallet"
              className="block px-4 py-2 hover:bg-gray-100"
              onClick={() => setIsOpen(false)}
            >
              Wallet
            </Link>
            <button
              onClick={handleLogout}
              className="w-full text-left px-4 py-2 hover:bg-gray-100 text-red-600"
            >
              Logout
            </button>
          </div>
        </>
      )}
    </div>
  );
}
