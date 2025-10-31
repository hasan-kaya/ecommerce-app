'use client';

import { useRouter } from 'next/navigation';
import Button from '@/components/ui/Button';

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
          <Button
            onClick={handleLogout}
            variant="danger"
          >
            Logout
          </Button>
        </div>
      </div>
    </header>
  );
}
