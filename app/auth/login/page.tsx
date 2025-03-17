'use client';

import AuthCard from '@/components/auth-card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { verifyEmailOrPhone } from '@/lib/api';
import { useAuthenticationStore } from '@/lib/store';
import { Check, Loader2, MessageCircleMore, X } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();
  const {
    loginIdentifier,
    isValidEmail,
    isValidPhone,
    setLoginIdentifier,
    setIsValidEmail,
    setIsValidPhone,
  } = useAuthenticationStore();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const { email, isValid } = await verifyEmailOrPhone(loginIdentifier);

      if (isValid) {
        // If email was returned, use it for login
        if (email) {
          setLoginIdentifier(email);
          router.push('/auth/login/email-login');
        } else {
          setError('Unable to retrieve account information');
        }
      } else {
        // Show appropriate error based on input type
        if (isValidEmail) {
          setError('No account found with this email');
          setIsValidEmail(false);
        } else if (isValidPhone) {
          setError('No account found with this phone number');
          setIsValidPhone(false);
        } else {
          setError('Please enter a valid email or phone number');
        }
      }
    } catch (error) {
      setError('An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleIdentifierChange = (value: string) => {
    setError('');
    setLoginIdentifier(value);
    if (isNaN(Number(value))) {
      // Email validation
      setIsValidEmail(/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value));
      setIsValidPhone(false);
    } else {
      // Phone validation (10 digits)
      setIsValidPhone(/^\d{10}$/.test(value));
      setIsValidEmail(false);
    }
  };

  return (
    <AuthCard
      title="Login to Karkhana Hub"
      description="Empowering you to design, learn, and make an impact."
      footerContent={
        <p className="text-sm text-center">
          Don&apos;t have an account?{' '}
          <Link href="/auth/signup" className="underline font-medium">
            SignUp
          </Link>
        </p>
      }
      onClose={() => router.push('/home')}
    >
      <div className="space-y-6 px-8 mt-6">
        <div className="grid grid-cols-2 gap-4">
          <Button
            variant="outline"
            className="w-full border-black rounded-full px-6 py-4 text-xs"
            onClick={() => {}}
          >
            <Image
              src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/google/google-original.svg"
              alt="Google logo"
              width={20}
              height={20}
              className="mr-2"
            />
            Continue with Google
          </Button>
          <Button
            variant="outline"
            className="w-full border-black rounded-full px-6 py-4 text-xs"
          >
            <Image
              src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/linkedin/linkedin-original.svg"
              alt="LinkedIn logo"
              width={20}
              height={20}
              className="mr-2"
            />
            Continue with LinkedIn
          </Button>
        </div>
        <div className="flex w-full py-2 pb-4 items-center justify-center">
          <Separator className="w-20 text-black" />
          <span className="text-xs px-6 text-muted-foreground">
            or Sign in with
          </span>
          <Separator className="w-20 text-black" />
        </div>
        <form onSubmit={handleSubmit} className="flex flex-col items-center">
          <div className="relative w-full">
            <Input
              type="text"
              placeholder="Enter your mobile number or Email ID"
              value={loginIdentifier}
              onChange={(e) => handleIdentifierChange(e.target.value)}
              className="rounded-xl mb-4 p-6"
            />
            {(isValidEmail || isValidPhone) && !error && (
              <Check className="absolute right-3 top-6 transform -translate-y-1/2 text-green-500" />
            )}
            {error && (
              <X className="absolute right-3 top-6 transform -translate-y-1/2 text-red-500" />
            )}
          </div>
          {error && <p className="text-sm text-red-500 mb-4">{error}</p>}
          <p className="text-[9px] w-60 text-muted-foreground text-center mb-4">
            We&apos;ll text you to confirm your number. Standard message and
            data rates apply. Privacy Policy and T&C.
          </p>
          <Button
            type="submit"
            className="rounded-full px-10 py-4"
            disabled={isLoading || (!isValidEmail && !isValidPhone)}
          >
            {isLoading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : null}
            Continue
          </Button>
          {isValidPhone && (
            <Button
              variant="link"
              className="text-xs text-muted-foreground font-light flex gap-x-1 items-center justify-center"
            >
              <span>
                <MessageCircleMore className="h-4 w-4" />
              </span>{' '}
              <span>Send on Whatsapp</span>
            </Button>
          )}
        </form>
      </div>
    </AuthCard>
  );
}
