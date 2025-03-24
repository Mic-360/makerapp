'use client';

import AuthCard from '@/components/auth-card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { useSignupStore } from '@/lib/store';
import { Check, Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

const userTypes = ['Student', 'Entrepreneur', 'Employee', 'Freelancer'];

export default function UserTypePage() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { userType, addUserType, removeUserType, firstName } = useSignupStore();

  const handleUserTypeClick = (type: string) => {
    if (userType.includes(type)) {
      removeUserType(type);
    } else {
      addUserType(type);
    }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);

    try {
      if (userType.length > 0) {
        router.push('/auth/signup/industry');
      }
    } catch (error) {
      console.error('Update error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthCard
      title="What best describes you?"
      description={`Hey ${firstName}! You're just a few steps away from
setting up your Karkhana account`}
      onClose={() => router.push('/auth/signup/mobile')}
    >
      <form onSubmit={handleSubmit} className="space-y-8 px-8">
        <div className="flex gap-x-4 items-center justify-center">
          <div className="text-xs text-gray-900 font-semibold">STEP 1</div>
          <Separator className="w-12 bg-gradient-to-r from-black" />
          <div className="text-xs text-gray-400">STEP 2</div>
          <Separator className="w-12" />
          <div className="text-xs text-gray-400">STEP 3</div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          {userTypes.map((type) => (
            <Button
              key={type}
              type="button"
              variant="outline"
              className={`${
                userType.includes(type)
                  ? 'bg-green-500 text-white font-semibold'
                  : 'text-gray-900'
              } rounded-xl py-12 text-md`}
              onClick={() => handleUserTypeClick(type)}
              disabled={userType.length >= 2 && !userType.includes(type)}
            >
              {type}
            </Button>
          ))}
        </div>
        <p className="text-xs text-center text-muted-foreground">
          Select up to 2 options that best describe you
        </p>
        <Button
          type="submit"
          className="rounded-full px-10 py-4 mt-6"
          disabled={isLoading || userType.length === 0}
        >
          {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
          Continue
        </Button>
      </form>
    </AuthCard>
  );
}
