'use client';

import { UsuariosProvider } from '@/context/UsuariosContext';
import UsuarioClient from './UsuarioClient';
import { consultarUsuario } from '@/services/usuariosService';
import { AuthGuard } from '@/services/authGuard';
import { useEffect, useState } from 'react';
import { Usuario } from '@/types/Usuario';

export default function UsuariosPage() {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);

  useEffect(() => {
    const fetchUsuarios = async () => {
      try {
        const data = await consultarUsuario();
        setUsuarios(data);
      } catch (err) {
      }
    };
    fetchUsuarios();
  }, []);

  return (
    <AuthGuard>
      <UsuariosProvider initialUsers={usuarios}>
        <UsuarioClient />
      </UsuariosProvider>
    </AuthGuard>
  );
}