import { EquipamentosProvider } from '@/context/EquipamentosContext';
import { consultarEquipamento } from '@/services/equipamentosService';
import EquipamentosClient from './EquipamentosClient';
import { AuthGuard } from '@/services/authGuard';

export default async function EquipamentosPage() {

  const equipamentos = await consultarEquipamento();

  return (
     <AuthGuard>
        <EquipamentosProvider initialEquipamentos={equipamentos}>
          <EquipamentosClient />
        </EquipamentosProvider>
     </AuthGuard>
  );
}
