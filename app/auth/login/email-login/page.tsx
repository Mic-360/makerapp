'use client';

import AuthCard from '@/components/auth-card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { loginUser } from '@/lib/api';
import { useAuthenticationStore } from '@/lib/store';
import { Check, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function EmailLoginPage() {
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const { loginIdentifier, setUser, setToken } = useAuthenticationStore();
  const router = useRouter();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const result = await loginUser(loginIdentifier, password);
      if (result) {
        setUser(result.user);
        setToken(result.token);
        router.push('/home');
      } else {
        setError('Invalid credentials');
      }
    } catch (error) {
      setError('An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthCard
      title="Login to Karkhana Hub"
      description="Empowering you to design, learn, and make an impact."
      footerContent={
        <p className="text-sm text-center">
          Don&apos;t have an account?{' '}
          <Link href="/auth/signup" className="underline font-medium">
            SignUp
          </Link>
        </p>
      }
      onClose={() => router.push('/auth')}
    >
      <form onSubmit={handleSubmit} className="space-y-8 px-8">
        <div className="space-y-2 text-start">
          <label htmlFor="email" className="text-sm pl-3 font-semibold">
            Email
          </label>
          <div className="relative w-full">
            <Input
              type="email"
              value={loginIdentifier}
              className="rounded-xl mb-4 p-6 ring-1 ring-black focus:ring-0"
              readOnly
            />
            <Check className="absolute right-5 top-6 transform -translate-y-1/2 text-green-500" />
          </div>
        </div>
        <div className="space-y-2 text-start">
          <label htmlFor="password" className="text-sm pl-3 font-semibold">
            Password
          </label>
          <Input
            id="password"
            type="password"
            value={password}
            placeholder="Enter your password"
            onChange={(e) => setPassword(e.target.value)}
            className="rounded-xl p-6"
          />
          {error && <p className="text-sm text-red-500 pl-3">{error}</p>}
        </div>
        <div className="space-y-2 text-start">
          <Link
            href="/auth/login/forgot-password"
            className="text-xs pl-3 -mt-3 text-muted-foreground underline-offset-1"
          >
            Forgot Password ?
          </Link>
        </div>
        <Button
          type="submit"
          className="rounded-full px-10 py-4"
          disabled={isLoading || !password}
        >
          {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
          Login
        </Button>
      </form>
    </AuthCard>
  );
}
