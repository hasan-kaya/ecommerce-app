'use client';

import { useState, useEffect } from 'react';
import { useSession, signOut } from 'next-auth/react';
import Link from 'next/link';
import Button from '@/components/ui/Button';

export default function UserMenu() {
  const { data: session, status } = useSession();
  const [user, setUser] = useState<{ name: string; email: string } | null>(
    null
  );
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      if (status === 'authenticated' && session?.user) {
        try {
          const response = await fetch(
            process.env.NEXT_PUBLIC_BACKEND_URL + '/graphql',
            {
              method: 'POST',
              credentials: 'include',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                query: `
                query Me {
                  me {
                    id
                    name
                    email
                  }
                }
              `,
              }),
            }
          );

          const { data } = await response.json();
          if (data?.me) {
            setUser(data.me);
          }
        } catch (error) {
          console.error('Failed to fetch user:', error);
        }
      } else {
        setUser(null);
      }
    };

    fetchUser();
  }, [session, status]);

  const handleLogout = async () => {
    await signOut({ callbackUrl: '/' });
    setUser(null);
    setIsOpen(false);
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
              Orders
            </Link>
            <Link
              href="/wallets"
              className="block px-4 py-2 hover:bg-gray-100"
              onClick={() => setIsOpen(false)}
            >
              Wallets
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
