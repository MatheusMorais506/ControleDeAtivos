'use client';

import { useEffect, useState } from 'react';
import { EquipamentosProvider } from '@/context/EquipamentosContext';
import { consultarEquipamento } from '@/services/equipamentosService';
import EquipamentosClient from './EquipamentosClient';
import { AuthGuard } from '@/services/authGuard';
import { Equipamento } from '@/types/Equipamento';
import { showError, showSuccess } from '@/lib/toastLib';

export default function EquipamentosPage() {
  const [equipamentos, setEquipamentos] = useState<Equipamento[]>([]);

  useEffect(() => {
    const fetchEquipamentos = async () => {
      try {
        const data = await consultarEquipamento();
        setEquipamentos(data);
      } catch (err) {
        showError((err as Error).message || 'Erro ao consultar equipamentos');
      }
    };
    fetchEquipamentos();
  }, []);

  return (
    <AuthGuard>
      <EquipamentosProvider initialEquipamentos={equipamentos}>
        <EquipamentosClient />
      </EquipamentosProvider>
    </AuthGuard>
  );
}
