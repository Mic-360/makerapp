'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import AuthCard from '@/components/auth-card';
import { useSignupStore } from '@/lib/store';
import { Separator } from '@/components/ui/separator';

const industries = [
  'Energy',
  'Manufacturing',
  'Agriculture',
  'Healthcare',
  'Education',
  'Computer',
  'Entertainment',
  'Design',
  'Aerospace',
];

export default function IndustryPage() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { industry, setIndustry, firstName } = useSignupStore();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);

    try {
      router.push('/auth/signup/purpose');
    } catch (error) {
      console.error('Update error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthCard
      title="What industry are you from?"
      description={`Hey ${firstName}! You're just a few steps away from setting up your Karkhana account`}
      onClose={() => router.push('/auth/signup/user-type')}
    >
      <form onSubmit={handleSubmit} className="space-y-8 px-2">
        <div className="flex gap-x-4 items-center justify-center">
          <div className="text-xs text-gray-900 font-semibold">STEP 1</div>
          <Separator className="w-12 bg-black" />
          <div className="text-xs text-gray-900 font-semibold">STEP 2</div>
          <Separator className="w-12 bg-gradient-to-r from-black" />
          <div className="text-xs text-gray-400">STEP 3</div>
        </div>
        <div className="grid grid-cols-3 gap-4">
          {industries.map((type) => (
            <Button
              key={type}
              type="button"
              variant='outline'
              className={`${industry === type ? 'bg-green-500 text-white font-semibold' : 'text-gray-900'} rounded-xl py-8 text-xs`}
              onClick={() => setIndustry(type)}
            >
              {type}
            </Button>
          ))}
        </div>
        <Button
          type="submit"
          className="rounded-full px-10 py-4"
          disabled={isLoading || !industry}
        >
          {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
          Continue
        </Button>
      </form>
    </AuthCard>
  );
}
