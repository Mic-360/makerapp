'use client';

import AuthCard from '@/components/auth-card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { signupUser } from '@/lib/api';
import { useAuthenticationStore, useSignupStore } from '@/lib/store';
import { Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

const purposes = [
  'Learning',
  'Professional',
  'Personal',
  'Business',
  'Research',
  'Other',
];

export default function PurposePage() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();
  const {
    email,
    password,
    firstName,
    lastName,
    mobile,
    userType,
    industry,
    purpose,
    addPurpose,
    removePurpose,
  } = useSignupStore();
  const { login } = useAuthenticationStore();

  const handlePurposeClick = (p: string) => {
    if (purpose.includes(p)) {
      removePurpose(p);
    } else {
      addPurpose(p);
    }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const result = await signupUser({
        email,
        password,
        name: `${firstName} ${lastName}`,
        number: mobile,
        usertype: userType,
        industry,
        purpose,
        role: 'Individual',
      });

      login(result.user, result.token);
      router.push('/home/onboarding');
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError('Failed to create account');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthCard
      title="What's your purpose for booking?"
      description={`Hey ${firstName}! You're just a few steps away from setting up your Karkhana account`}
      onClose={() => router.push('/auth/signup/industry')}
    >
      <form onSubmit={handleSubmit} className="space-y-4 px-4">
        <div className="flex gap-x-4 items-center justify-center">
          <div className="text-xs text-gray-900 font-semibold">STEP 1</div>
          <Separator className="w-12 bg-black" />
          <div className="text-xs text-gray-900 font-semibold">STEP 2</div>
          <Separator className="w-12 bg-black" />
          <div className="text-xs text-gray-900 font-semibold">STEP 3</div>
        </div>
        <div className="grid grid-cols-2 gap-4 px-8">
          {purposes.map((field) => (
            <Button
              key={field}
              type="button"
              variant='outline'
              className={`${purpose.includes(field) ? 'bg-green-500 text-white font-semibold' : 'text-gray-900'} rounded-xl py-8 text-sm`}
              onClick={() => handlePurposeClick(field)}
              disabled={purpose.length >= 3 && !purpose.includes(field)}
            >
              {field}
            </Button>
          ))}
        </div>
        <p className="text-xs text-center text-muted-foreground">
          Select up to 3 options that best describe your purpose
        </p>
        {error && (
          <p className="text-sm text-red-500 text-center px-8">{error}</p>
        )}
        <Button
          type="submit"
          className={`${purpose.length > 0 ? 'bg-green-500' : 'bg-gray-500'}
            rounded-full px-10 py-4 mt-6 hover:bg-green-400`}
          disabled={isLoading || purpose.length === 0}
        >
          {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
          Create Account
        </Button>
      </form>
    </AuthCard>
  );
}
