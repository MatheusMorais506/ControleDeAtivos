"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { UsuarioAcoes } from "@/types/UsuarioAcoes";
import { UsuariosContextProps } from "@/types/UsuariosContextProps";
import { consultarUsuario } from "@/services/usuariosService";
import { UsuariosProviderProps } from "@/types/UsuariosProviderProps";

const UsuariosContext = createContext<UsuariosContextProps | undefined>(
  undefined
);

export const UsuariosProvider = ({ children }: UsuariosProviderProps) => {
  const [usuarios, setUsuarios] = useState<UsuarioAcoes[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchUsuarios = async () => {
    setIsLoading(true);
    try {
      const data = await consultarUsuario();
      setUsuarios(data);
    } catch (err) {
      setError((err as Error).message || "Erro ao consultar usuários");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsuarios();
  }, []);

  return (
    <UsuariosContext.Provider
      value={{
        usuarios,
        isLoading,
        error,
        setError,
        setIsLoading,
        setUsuarios,
        fetchUsuarios,
      }}
    >
      {children}
    </UsuariosContext.Provider>
  );
};

export const useUsuariosContext = () => {
  const context = useContext(UsuariosContext);
  if (!context)
    throw new Error(
      "useUsuariosContext deve ser usado dentro de UsuariosProvider"
    );
  return context;
};
