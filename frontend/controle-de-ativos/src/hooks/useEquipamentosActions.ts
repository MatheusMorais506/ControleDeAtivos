'use client';

import { useEquipamentosContext } from '@/context/EquipamentosContext';
import {
  consultarEquipamento,
  registrarEquipamento,
  deletarEquipamento,
  devolverEquipamento,
  atualizarEquipamento,
  emprestarEquipamento
} from '@/services/equipamentosService';
import { useCallback } from 'react';

export function useEquipamentosActions() {
  const { setEquipamentos, setIsLoading, setError } = useEquipamentosContext();

  const ConsultarEquipamento = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await consultarEquipamento();
      setEquipamentos(data);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setIsLoading(false);
    }
  }, [setEquipamentos, setIsLoading, setError]);

  const AdicionarEquipamento = useCallback(async (nome: string, codigoIdentificacao: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const newEquipamento = await registrarEquipamento(nome, codigoIdentificacao);
      setEquipamentos(prev => [...prev, newEquipamento]);
    } catch (err) {
      setError((err as Error).message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [setEquipamentos, setIsLoading, setError]);

  const EmprestarEquipamento = useCallback(async (id: string, note: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const updated = await emprestarEquipamento(id, note);
      setEquipamentos(prev => prev.map(e => (e.id === id ? updated : e)));
    } catch (err) {
      setError((err as Error).message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [setEquipamentos, setIsLoading, setError]);

  const DevolverEquipamento = useCallback(async (id: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const updated = await devolverEquipamento(id);
      setEquipamentos(prev => prev.map(e => (e.id === id ? updated : e)));
    } catch (err) {
      setError((err as Error).message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [setEquipamentos, setIsLoading, setError]);

  const RemoveEquipamento = useCallback(async (id: string) => {
    setIsLoading(true);
    setError(null);
    try {
      await deletarEquipamento(id);
      setEquipamentos(prev => prev.filter(e => e.id !== id));
    } catch (err) {
      setError((err as Error).message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [setEquipamentos, setIsLoading, setError]);

  const AtualizarEquipamento = useCallback(async (
    id: string, nome: string, codigoIdentificacao: string, notaEmprestimo: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const updated = await atualizarEquipamento(id, nome, codigoIdentificacao, notaEmprestimo);
      setEquipamentos(prev => prev.map(e => (e.id === id ? updated : e)));
    } catch (err) {
      setError((err as Error).message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [setEquipamentos, setIsLoading, setError]);

  return {
    ConsultarEquipamento,
    AdicionarEquipamento,
    EmprestarEquipamento,
    DevolverEquipamento,
    RemoveEquipamento,
    AtualizarEquipamento
  };
}