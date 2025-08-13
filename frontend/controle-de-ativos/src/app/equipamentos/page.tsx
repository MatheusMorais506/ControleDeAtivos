'use client';

import { useEffect, useState } from 'react';
import { EquipamentosProvider } from '@/context/EquipamentosContext';
import { consultarEquipamento } from '@/services/equipamentosService';
import EquipamentosClient from './EquipamentosClient';
import { AuthGuard } from '@/services/authGuard';
import { Equipamento } from '@/types/Equipamento';

export default function EquipamentosPage() {
  const [equipamentos, setEquipamentos] = useState<Equipamento[]>([]);

  useEffect(() => {
    const fetchEquipamentos = async () => {
      try {
        const data = await consultarEquipamento();
        setEquipamentos(data);
      } catch (err) {
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
