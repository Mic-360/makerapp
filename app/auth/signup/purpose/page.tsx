'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import AuthCard from '@/components/auth-card';
import { useSignupStore } from '@/lib/store';
import { Separator } from '@/components/ui/separator';

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
  // const { purpose, setPurpose, firstName } = useSignupStore();
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

    // try {
    //   router.push('/home');
    // } catch (error) {
    //   console.error('Update error:', error);
    // } finally {
    //   setIsLoading(false);
    // }
    try {
      // const response = await fetch('/api/auth/signup', {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //   },
      //   body: JSON.stringify({
      //     email,
      //     password,
      //     firstName,
      //     lastName,
      //     mobile,
      //     userType,
      //     industry,
      //     purpose,
      //   }),
      // });

      // if (response.ok) {
      //   router.push('/auth/login');
      // } else {
      //   console.error('Failed to register user:', await response.json());
      // }
        router.push('/home/onboarding');
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
