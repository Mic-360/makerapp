'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Check, Loader2 } from 'lucide-react';
import AuthCard from '@/components/auth-card';
import { useAuthenticationStore } from '@/lib/store';
import Link from 'next/link';
import { forgotPassword } from '@/lib/api';

export default function ForgotPasswordPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();
  const { loginIdentifier } = useAuthenticationStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      await forgotPassword(loginIdentifier);
      setIsSubmitted(true);
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError('Failed to process request');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenEmail = () => {
    window.location.href = `mailto:${loginIdentifier}`;
  };

  return (
    <AuthCard
      title="Forgot Password?"
      description={
        isSubmitted
          ? "No worries, we've sent you a reset email"
          : "No worries, we'll send you reset email."
      }
      footerContent={
        <Link href="/auth/login" className="underline font-medium">
          Back to Login
        </Link>
      }
      onClose={() => router.push('/auth/login/email-login')}
    >
      <form onSubmit={handleSubmit} className="space-y-12 px-8">
        <div className="space-y-4 mt-6">
          <div className="space-y-2 text-start">
            <label htmlFor="email" className="text-sm pl-3 font-semibold">
              Email
            </label>
            <div className="relative w-full">
              <Input
                id="email"
                type="email"
                value={loginIdentifier}
                className="rounded-xl p-6"
                readOnly
              />
              <Check className="absolute right-3 top-6 transform -translate-y-1/2 text-green-500" />
            </div>
            {error && <p className="text-sm text-red-500 pl-3">{error}</p>}
            {isSubmitted && (
              <div className="text-center">
                <p className="text-sm">Didn&apos;t receive a code yet?</p>
                <button
                  type="button"
                  onClick={handleSubmit}
                  className="text-sm underline font-medium hover:opacity-80"
                >
                  Click to Resend
                </button>
              </div>
            )}
          </div>
          {isLoading ? (
            <Loader2 className="h-32 p-4 w-full animate-spin" />
          ) : (
            <div className="h-32 w-full" />
          )}
        </div>
        <Button
          type={isSubmitted ? 'button' : 'submit'}
          onClick={isSubmitted ? handleOpenEmail : undefined}
          className="rounded-full px-10 py-4 mx-auto"
          disabled={isLoading || !loginIdentifier}
        >
          {isSubmitted ? 'Open Email' : 'Reset Password'}
        </Button>
      </form>
    </AuthCard>
  );
}
