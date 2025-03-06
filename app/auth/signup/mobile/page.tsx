'use client';

import AuthCard from '@/components/auth-card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useSignupStore } from '@/lib/store';
import { Check, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function MobilePage() {
  const [isLoading, setIsLoading] = useState(false);
  const [isValidPhone, setIsValidPhone] = useState(false);
  const router = useRouter();
  const { mobile, setMobile, firstName, email } = useSignupStore();

  const validatePhone = (phone: string) => {
    const re = /^\d{10}$/;
    const isValid = re.test(phone);
    setIsValidPhone(isValid);
    return isValid;
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!validatePhone(mobile)) return;

    setIsLoading(true);
    try {
      setMobile(mobile);
      router.push('/auth/signup/user-type');
    } catch (error) {
      console.error('Update error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthCard
      title={`Add your mobile number`}
      description="We'll send you an OTP to verify your number"
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
