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
      // Usuário não autenticado, redireciona para login
      router.push('/login');
    }
  }, [user, router]);

  if (user === null) {
    // Ainda está carregando usuário (null = loading)
    return <p>Carregando...</p>;
  }

  if (user === false) {
    // Já redirecionou, pode retornar null ou algo aqui
    return null;
  }

  // Usuário autenticado, renderiza filhos
  return <>{children}</>;
}
