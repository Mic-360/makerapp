// app/auth/signup/name.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Check, Loader2 } from 'lucide-react';
import { useSignupStore } from '@/lib/store';
import AuthCard from '@/components/auth-card';
import Link from 'next/link';


export default function NamePage() {

  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { firstName, lastName, setFirstName, setLastName, email,setEmail } = useSignupStore();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);

    try {
      router.push('/auth/signup/mobile');
    } catch (error) {
      console.error('Update error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthCard
      title="Create a free account"
      description="Explore the world of Karkhana"
      footerContent={
        <p className="text-sm text-center">
          Already have an account?{' '}
          <Link href="/auth/login" className="underline font-medium">
            Log In
          </Link>
        </p>
      }
      onClose={() => router.push('/auth/signup')}
    >
      <div className="px-8">
        <div className="relative">
          <Input
            type="email"
            placeholder="Enter your Email Address"
            value={email}
            className="rounded-xl text-start p-6"
          />
          <Check className="absolute right-3 top-1/2 transform -translate-y-1/2 text-green-500" />
        </div>
        <h2 className="py-4 font-bold">Tell us your Full Name</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            type="text"
            placeholder="First Name"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            className="rounded-xl text-start p-6"
          />
          <Input
            type="text"
            placeholder="Last Name"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            className="rounded-xl text-start p-6"
          />
          <Button
            type="submit"
            className="px-10 rounded-full"
            disabled={isLoading || !firstName || !lastName}
          >
            {isLoading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : null}
            Continue
          </Button>
        </form>
      </div>
    </AuthCard>
  );
}
