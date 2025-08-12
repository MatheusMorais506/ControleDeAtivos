'use client';

import { useEquipamentosContext } from '@/context/EquipamentosContext';
import {
  consultarEquipamento,
  registrarEquipamento,
  deletarEquipamento,
  emprestarEquipamento,
  devolverEquipamento,
  atualizarEquipamento
} from '@/services/equipamentosService';
import { useCallback } from 'react';

export function useEquipamentosActions() {
  const { setEquipamentos, setIsLoading, setError } = useEquipamentosContext();

  const fetchEquipamentos = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await consultarEquipamento();
      setEquipamentos(data);
    } catch (err) {
      setError((err as Error).message || 'Erro ao buscar equipamentos');
    } finally {
      setIsLoading(false);
    }
  }, [setEquipamentos, setIsLoading, setError]);

  const addEquipamento = useCallback(async (nome: string, codigoIdentificacao: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const newEquipamento = await registrarEquipamento(nome, codigoIdentificacao);
      setEquipamentos(prev => [...prev, newEquipamento]);
    } catch (err) {
      setError((err as Error).message || 'Erro ao adicionar equipamento');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [setEquipamentos, setIsLoading, setError]);

  const emprestar = useCallback(async (id: string, note: string) => {
    setIsLoading(true);
    setError(null);
    try {
      console.log('Emprestando equipamento:', id, note);
      const updated = await emprestarEquipamento(id, note);
      setEquipamentos(prev => prev.map(e => (e.id === id ? updated : e)));
    } catch (err) {
      setError((err as Error).message || 'Erro ao emprestar equipamento');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [setEquipamentos, setIsLoading, setError]);

  const devolver = useCallback(async (id: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const updated = await devolverEquipamento(id);
      setEquipamentos(prev => prev.map(e => (e.id === id ? updated : e)));
    } catch (err) {
      setError((err as Error).message || 'Erro ao devolver equipamento');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [setEquipamentos, setIsLoading, setError]);

  const removeEquipamento = useCallback(async (id: string) => {
    setIsLoading(true);
    setError(null);
    try {
      await deletarEquipamento(id);
      setEquipamentos(prev => prev.filter(e => e.id !== id));
    } catch (err) {
      setError((err as Error).message || 'Erro ao remover equipamento');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [setEquipamentos, setIsLoading, setError]);

  const updateEquipamento = useCallback(async (id: string, nome: string, codigoIdentificacao: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const updated = await atualizarEquipamento(id, nome, codigoIdentificacao);
      setEquipamentos(prev => prev.map(e => (e.id === id ? updated : e)));
    } catch (err) {
      setError((err as Error).message || 'Erro ao emprestar equipamento');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [setEquipamentos, setIsLoading, setError]);

  return { fetchEquipamentos, addEquipamento, emprestar, devolver, removeEquipamento, updateEquipamento };
}