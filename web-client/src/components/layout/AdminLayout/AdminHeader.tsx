'use client';

import Button from '@/components/ui/Button';
import { signOut } from 'next-auth/react';

export default function AdminHeader() {
  const handleLogout = async () => {
    await signOut({ callbackUrl: '/' });
  };

  return (
    <header className="bg-white border-b px-6 py-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">E-commerce Admin</h1>

        <div className="flex items-center gap-4">
          <span className="text-gray-600">Admin User</span>
          <Button onClick={handleLogout} variant="danger">
            Logout
          </Button>
        </div>
      </div>
    </header>
  );
}
