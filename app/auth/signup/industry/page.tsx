'use client';

import AuthCard from '@/components/auth-card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { useSignupStore } from '@/lib/store';
import { Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

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
  const { industry, addIndustry, removeIndustry, firstName } = useSignupStore();

  const handleIndustryClick = (ind: string) => {
    if (industry.includes(ind)) {
      removeIndustry(ind);
    } else {
      addIndustry(ind);
    }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);

    try {
      if (industry.length > 0) {
        router.push('/auth/signup/purpose');
      }
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
              variant="outline"
              className={`${industry.includes(type) ? 'bg-green-500 text-white font-semibold' : 'text-gray-900'} rounded-xl py-8 text-xs`}
              onClick={() => handleIndustryClick(type)}
              disabled={industry.length >= 3 && !industry.includes(type)}
            >
              {type}
            </Button>
          ))}
        </div>
        <p className="text-xs text-center text-muted-foreground">
          Select up to 3 options that best describe your industry
        </p>
        <Button
          type="submit"
          className={`${industry.length > 0 ? 'bg-green-500' : 'bg-gray-500'} rounded-full px-10 py-4 hover:bg-green-400`}
          disabled={isLoading || industry.length === 0}
        >
          {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
          Continue
        </Button>
      </form>
    </AuthCard>
  );
}
