'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Loader2, Check } from 'lucide-react';
import AuthCard from '@/components/auth-card';
import { useSignupStore } from '@/lib/store';
import Link from 'next/link';

export default function MobilePage() {
  const [isLoading, setIsLoading] = useState(false);
  const [isValidPhone, setIsValidPhone] = useState(false);
  const router = useRouter();
  const { mobile, setMobile, firstName } = useSignupStore();

  const validatePhone = (phone: string) => {
    const re = /^\d{10}$/;
    setIsValidPhone(re.test(phone));
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      router.push('/auth/signup/user-type');
    }, 1500);
  };

  return (
    <AuthCard
      title={`Hi ${firstName}`}
      description="Welcome to Karkhana your seamless machine booking platform"
      footerContent={
        <p className="text-sm text-center">
          Already have an account?{' '}
          <Link href="/auth/login" className="underline font-medium">
            Log In
          </Link>
        </p>
      }
      onClose={() => router.push('/auth/signup/name')}
    >
      <form
        onSubmit={handleSubmit}
        className="space-y-4 flex flex-col justify-center px-8 gap-y-6"
      >
        <div className="relative">
          <Input
            type="tel"
            placeholder="Enter your mobile number"
            value={mobile}
            onChange={(e) => {
              validatePhone(e.target.value);
              setMobile(e.target.value);
            }}
            className="rounded-xl text-start p-6"
          />
          {isValidPhone && (
            <Check className="absolute right-3 top-1/2 transform -translate-y-1/2 text-green-500" />
          )}
        </div>
        {isLoading ? (
          <Loader2 className="h-32 w-full animate-spin" />
        ) : (
          <div className="h-32 w-full" />
        )}
        <Button
          type="submit"
          className="rounded-full px-10 py-4 max-w-sm mx-auto"
          disabled={isLoading || !isValidPhone}
        >
          Continue
        </Button>
      </form>
    </AuthCard>
  );
}
