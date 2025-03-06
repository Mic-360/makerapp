'use client';

import AuthCard from '@/components/auth-card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { useSignupStore } from '@/lib/store';
import { Check, Loader2 } from 'lucide-react';
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
    setPurpose,
  } = useSignupStore();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          password,
          firstName,
          lastName,
          mobile,
          userType,
          industry,
          purpose,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create account');
      }

      const data = await response.json();
      if (data.success) {
        router.push('/home/onboarding');
      } else {
        throw new Error(data.error || 'Failed to create account');
      }
    } catch (error) {
      console.error('Error during registration:', error);
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
              className={`${purpose === field ? 'bg-green-500 text-white font-semibold' : 'text-gray-900'} rounded-xl py-8 text-sm`}
              onClick={() => setPurpose(field)}
            >
              {field}
            </Button>
          ))}
        </div>
        <Button
          type="submit"
          className={`${purpose ? 'bg-green-500' : 'bg-gray-500'}
            rounded-full px-10 py-4 mt-6 hover:bg-green-400`}
          disabled={isLoading || !purpose}
        >
          {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
          Create Account
        </Button>
      </form>
    </AuthCard>
  );
}
