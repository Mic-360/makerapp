import { useAuthenticationStore } from '@/lib/store';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export function useAuth() {
  const { user, token, isLoading } = useAuthenticationStore();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !token) {
      router.push('/auth/login');
    }
  }, [isLoading, token, router]);

  return { user, isLoading };
}
