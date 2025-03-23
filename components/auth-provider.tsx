'use client';

import { Suspense, useEffect } from 'react';
import { useAuthenticationStore } from '@/lib/store';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';

const publicPaths = ['/auth/login', '/auth/signup', '/home', '/']; // Add other public paths
const protectedPaths = ['/home/onboarding']; // Add other protected paths
const authPaths = ['/auth']; // Auth paths that should be inaccessible when logged in
const resetPaths = ['/auth/reset']; // Reset password paths

export default function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { token, reauth, isLoading } = useAuthenticationStore();
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const resetToken = pathname.startsWith('/auth/reset') ? searchParams.get('token') : null;

  useEffect(() => {

    reauth()
    // Set up periodic reauth (e.g., every 30 minutes)
    const interval = setInterval(() => {
      if (token) {
        reauth();
      }
    }, 30 * 60 * 1000);

    return () => clearInterval(interval);
  }, [reauth, token]);

  useEffect(() => {
    if (isLoading) return;

    const isPublicPath = publicPaths.some(path => pathname.startsWith(path));
    const isProtectedPath = protectedPaths.some(path => pathname.startsWith(path));
    const isAuthPath = authPaths.some(path => pathname.startsWith(path));
    const isResetPath = resetPaths.some(path => pathname.startsWith(path));

    // Handle reset password paths
    if (isResetPath && !resetToken && !pathname.includes('password-changed')) {
      router.push('/auth/login');
      return;
    }

    if (!token && isProtectedPath) {
      // Redirect to login if trying to access protected route without auth
      router.push('/auth/login');
    } else if (token && isAuthPath && !isResetPath) {
      // Redirect to home if trying to access auth routes while logged in
      // But allow access to reset password routes
      router.push('/home');
    }
  }, [token, pathname, router, isLoading, resetToken]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen min-w-screen bg-white relative">
      <Suspense fallback={<div>Loading...</div>}>
        {children}
      </Suspense>
    </div>
  );
}