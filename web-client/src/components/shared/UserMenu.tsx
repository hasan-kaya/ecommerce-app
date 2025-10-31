'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Button from '@/components/ui/Button';

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
      <Button
        onClick={() => setIsOpen(!isOpen)}
        variant="ghost"
        className="p-2"
      >
        <span>👤</span>
        <span>{user ? user.name : 'Account'}</span>
      </Button>

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
            <Button
              onClick={handleLogout}
              variant="ghost"
              className="w-full justify-start text-red-600 hover:bg-gray-100"
            >
              Logout
            </Button>
          </div>
        </>
      )}
    </div>
  );
}
