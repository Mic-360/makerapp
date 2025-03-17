'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Loader2 } from 'lucide-react';
import AuthCard from '@/components/auth-card';
import Link from 'next/link';
import { resetPassword } from '@/lib/api';

export default function NewPasswordPage() {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      if (!token) {
        throw new Error('Invalid reset token');
      }

      if (newPassword !== confirmPassword) {
        setError('Passwords do not match');
        return;
      }

      await resetPassword(token, newPassword);
      router.push('/auth/reset/password-changed');
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError('Failed to reset password');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthCard
      title="Set a New Password"
      description="Your new password must be different from previously used passwords."
      footerContent={
        <Link href="/auth/login" className="underline font-medium">
          Back to Login
        </Link>
      }
      onClose={() => router.push('/home')}
    >
      <form onSubmit={handleSubmit} className="space-y-8 px-8">
        <div className="space-y-4 my-6">
          <div className="text-start">
            <label htmlFor="newPassword" className="text-sm font-semibold pl-3">
              New Password
            </label>
            <Input
              id="newPassword"
              type="password"
              value={newPassword}
              placeholder="Enter your new password"
              onChange={(e) => setNewPassword(e.target.value)}
              className="rounded-xl p-6"
            />
            <p className="text-xs text-muted-foreground pl-3 mt-1">
              Must be at least 8 characters
            </p>
          </div>
          <div className="text-start">
            <label
              htmlFor="confirmPassword"
              className="text-sm font-semibold pl-3"
            >
              Confirm Password
            </label>
            <Input
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              placeholder="Re-enter your new password"
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="rounded-xl p-6"
            />
          </div>
          {error && (
            <p className="text-sm text-red-500 pl-3">{error}</p>
          )}
        </div>
        <Button
          type="submit"
          className="rounded-full px-10 py-4 mx-auto"
          disabled={
            isLoading ||
            !newPassword ||
            !confirmPassword ||
            newPassword !== confirmPassword ||
            !token
          }
        >
          {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
          Reset Password
        </Button>
      </form>
    </AuthCard>
  );
}
