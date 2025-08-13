'use client';

import { useUsuariosContext } from '@/context/UsuariosContext';
import {
  registrarUsuario,
  atualizarUsuario,
  deletarUsuario,
  consultarUsuario
} from '@/services/usuariosService';
import { UsuarioAcoes } from '@/types/UsuarioAcoes';
import { useCallback } from 'react';

export function useUsuariosActions() {
  const { setUsuarios, setIsLoading, setError } = useUsuariosContext();

  const ConsultarUsuario = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await consultarUsuario();
      setUsuarios(data);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setIsLoading(false);
    }
  }, [setUsuarios, setIsLoading, setError]);

  const AdicionarUsuario = useCallback(async (usuario: Omit<UsuarioAcoes, 'id'>) => {
    setIsLoading(true);
    setError(null);
    try {
      const newUsuario = await registrarUsuario(usuario);
      setUsuarios(prev => [...prev, newUsuario]);
    } catch (err) {
      setError((err as Error).message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [setUsuarios, setIsLoading, setError]);

  const AtualizarUsuario = useCallback(async (id: number, usuario: Partial<UsuarioAcoes>) => {
    setIsLoading(true);
    setError(null);
    try {
      const updatedUsuario = await atualizarUsuario(id, usuario);
      setUsuarios(prev => prev.map(u => (u.id === id ? updatedUsuario : u)));
    } catch (err) {
      setError((err as Error).message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [setUsuarios, setIsLoading, setError]);

  const RemoverUsuario = useCallback(async (id: number) => {
    setIsLoading(true);
    setError(null);
    try {
      await deletarUsuario(id);
      setUsuarios(prev => prev.filter(u => u.id !== id));
    } catch (err) {
      setError((err as Error).message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [setUsuarios, setIsLoading, setError]);

  return { ConsultarUsuario, AdicionarUsuario, AtualizarUsuario, RemoverUsuario };
}
