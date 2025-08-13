"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { Equipamento } from "@/types/Equipamento";
import { EquipamentosContextProps } from "@/types/EquipamentosContextProps";
import { consultarEquipamento } from "@/services/equipamentosService";
import { EquipamentosProviderProps } from "@/types/EquipamentosProviderProps";

const EquipamentosContext = createContext<EquipamentosContextProps | undefined>(
  undefined
);

export const EquipamentosProvider = ({
  children,
}: EquipamentosProviderProps) => {
  const [equipamentos, setEquipamentos] = useState<Equipamento[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchEquipamentos = async () => {
    setIsLoading(true);
    try {
      const data = await consultarEquipamento();
      setEquipamentos(data);
    } catch (err) {
      setError((err as Error).message || "Erro ao consultar equipamentos");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchEquipamentos();
  }, []);

  return (
    <EquipamentosContext.Provider
      value={{
        equipamentos,
        isLoading,
        error,
        setError,
        setIsLoading,
        setEquipamentos,
        fetchEquipamentos,
      }}
    >
      {children}
    </EquipamentosContext.Provider>
  );
};

export const useEquipamentosContext = () => {
  const context = useContext(EquipamentosContext);
  if (!context)
    throw new Error(
      "useEquipamentosContext deve ser usado dentro de EquipamentosProvider"
    );
  return context;
};
