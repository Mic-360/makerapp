'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import AuthCard from '@/components/auth-card';
import { useSignupStore } from '@/lib/store';
import { Separator } from '@/components/ui/separator';

const userTypes = ['Student', 'Entrepreneur', 'Employee', 'Freelancer'];

export default function UserTypePage() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { userType, setUserType, firstName } = useSignupStore();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);

    try {
      router.push('/auth/signup/industry');
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
                userType === type ? 'bg-green-500 text-white font-semibold' : 'text-gray-900'
              } rounded-xl py-12 text-md`}
              onClick={() => setUserType(type)}
            >
              {type}
            </Button>
          ))}
        </div>
        <Button
          type="submit"
          className="rounded-full px-10 py-4 mt-6"
          disabled={isLoading || !userType}
        >
          {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
          Continue
        </Button>
      </form>
    </AuthCard>
  );
}
