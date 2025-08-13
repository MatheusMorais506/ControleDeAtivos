'use client';

import { useAuth } from '@/context/AutenticacaoContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

interface AuthGuardProps {
  children: React.ReactNode;
}

export function AuthGuard({ children }: AuthGuardProps) {
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (user === false) {
      router.push('/login');
    }
  }, [user, router]);

  if (user === null) {
    return;
  }

  if (user === false) {
    return null;
  }

  return <>{children}</>;
}
