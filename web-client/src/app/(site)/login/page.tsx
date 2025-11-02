'use client';

import Button from '@/components/ui/Button';
import { signIn } from 'next-auth/react';

export default function LoginPage() {
  const handleSignIn = async () => {
    signIn('web-client', {
      callbackUrl: '/',
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
