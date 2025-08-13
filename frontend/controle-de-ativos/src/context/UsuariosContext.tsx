'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { Usuario } from '@/types/Usuario';

interface UsuariosContextProps {
  usuarios: Usuario[];
  isLoading: boolean;
  error: string | null;
  setError: React.Dispatch<React.SetStateAction<string | null>>;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
  setUsuarios: React.Dispatch<React.SetStateAction<Usuario[]>>;
}

interface UsuariosProviderProps {
  children: React.ReactNode;
  initialUsers: Usuario[];
}

const UsuariosContext = createContext<UsuariosContextProps | undefined>(undefined);

export const UsuariosProvider: React.FC<UsuariosProviderProps> = ({ children, initialUsers }) => {
  const [usuarios, setUsuarios] = useState<Usuario[]>(initialUsers);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setUsuarios(initialUsers);
  }, [initialUsers]);

  return (
    <UsuariosContext.Provider
      value={{ usuarios, isLoading, error, setError, setIsLoading, setUsuarios }}
    >
      {children}
    </UsuariosContext.Provider>
  );
};

export const useUsuariosContext = () => {
  const context = useContext(UsuariosContext);
  if (!context) throw new Error('useUsuariosContext deve ser usado dentro de UsuariosProvider');
  return context;
};
