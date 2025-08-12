'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { Equipamento } from '@/types/Equipamento';

interface EquipamentosContextProps {
  equipamentos: Equipamento[];
  isLoading: boolean;
  error: string | null;
  setError: React.Dispatch<React.SetStateAction<string | null>>;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
  setEquipamentos: React.Dispatch<React.SetStateAction<Equipamento[]>>;
}

interface EquipamentosProviderProps {
  children: React.ReactNode;
  initialEquipamentos: Equipamento[];
}

const EquipamentosContext = createContext<EquipamentosContextProps | undefined>(undefined);

export const EquipamentosProvider: React.FC<EquipamentosProviderProps> = ({ children, initialEquipamentos }) => {
  const [equipamentos, setEquipamentos] = useState<Equipamento[]>(initialEquipamentos);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setEquipamentos(initialEquipamentos);
  }, [initialEquipamentos]);

  return (
    <EquipamentosContext.Provider
      value={{ equipamentos, isLoading, error, setError, setIsLoading, setEquipamentos }}
    >
      {children}
    </EquipamentosContext.Provider>
  );
};

export const useEquipamentosContext = () => {
  const context = useContext(EquipamentosContext);
  if (!context) throw new Error('useEquipamentosContext deve ser usado dentro de EquipamentosProvider');
  return context;
};
