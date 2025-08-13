'use client';

import { useAuth } from '@/context/AutenticacaoContext';
import { AuthGuardProps } from '@/types/AuthGuardProps';
import { UsuarioPerfil } from '@/types/UsuarioPerfil';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect } from 'react';

export function AutenticacaoGuard({ children }: AuthGuardProps) {
  const { user } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  const usuarioAdministrador =
      user !== false && user?.perfilId === UsuarioPerfil.Administrador.toString();

  useEffect(() => {
    if (user === false) {
      router.push('/login');
      return;
    }

    if (user && pathname.startsWith("/usuarios") && !usuarioAdministrador) {
      router.push("/");
    }

  }, [user, pathname,router]);

  if (user === null) {
    return null;
  }

  if (user === false) {
    return null;
  }

  if (user && pathname.startsWith("/usuarios") && !usuarioAdministrador) return null;

  return <>{children}</>;
}


