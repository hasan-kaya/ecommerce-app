'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import Button from '@/components/ui/Button';
import { signIn } from 'next-auth/react';

export default function LoginPage() {
  const router = useRouter();
  const { data: session, status } = useSession();

  useEffect(() => {
    if (status === 'authenticated' && session) {
      if (session.role === 'admin') {
        router.push('/admin');
      } else {
        router.push('/');
      }
    }
  }, [status, session, router]);

  const handleSignIn = async () => {
    signIn('web-client', {
      redirect: true,
    });
  };

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-md mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-center">Login</h1>

        <Button fullWidth onClick={handleSignIn}>
          Sign In
        </Button>
      </div>
    </div>
  );
}
