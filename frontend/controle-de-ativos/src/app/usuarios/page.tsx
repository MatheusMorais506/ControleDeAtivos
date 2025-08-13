export const dynamic = "force-dynamic";

import { UsuariosProvider } from '@/context/UsuariosContext';
import UsuarioClient from './UsuarioClient';
import { consultarUsuario } from '@/services/usuariosService';
import { AuthGuard } from '@/services/authGuard';

export default async function UsuariosPage() {

  const usuarios = await consultarUsuario();

  return (
    <AuthGuard>
      <UsuariosProvider initialUsers={usuarios}>
        <UsuarioClient />
      </UsuariosProvider>
    </AuthGuard>
  );
}
