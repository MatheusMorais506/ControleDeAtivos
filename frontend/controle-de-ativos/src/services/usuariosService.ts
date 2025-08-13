import { Usuario } from "@/types/Usuario";
import api from '@/lib/api';

const API_URL = `${process.env.NEXT_PUBLIC_API_URL}/api/Usuarios`;

export async function consultarUsuario(): Promise<Usuario[]> {
  try {
    const res = await api.get(API_URL);
    return res.data;
  } catch (error) {
    throw new Error('Erro ao buscar usuários');
  }
}

export async function registrarUsuario(user: Omit<Usuario, 'id'>): Promise<Usuario> {
  try {
    const res = await api.post(API_URL, user);
    return res.data;
  } catch (error) {
    throw new Error('Erro ao criar usuário');
  }
}

export async function atualizarUsuario(id: number, user: Partial<Usuario>): Promise<Usuario> {
  try {
    user.id = id;
    const res = await api.put(API_URL, user);
    return res.data;
  } catch (error) {
    throw new Error('Erro ao atualizar usuário');
  }
}

export async function deletarUsuario(id: number): Promise<void> {
  try {
    await api.delete(`${API_URL}/${id}`);
  } catch (error) {
    throw new Error('Erro ao remover usuário');
  }
}