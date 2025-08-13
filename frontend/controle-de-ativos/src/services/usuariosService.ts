import { UsuarioAcoes } from "@/types/UsuarioAcoes";
import api from '@/lib/api';
import { normalizeError } from "@/lib/normalizeError";

const API_URL = `${process.env.NEXT_PUBLIC_API_URL}/api/Usuarios`;

export async function consultarUsuario(): Promise<UsuarioAcoes[]> {
  try {
    const res = await api.get(API_URL);
    return res.data;
  } catch (error) {
    throw normalizeError(error);
  }
}

export async function registrarUsuario(user: Omit<UsuarioAcoes, 'id'>): Promise<UsuarioAcoes> {
  try {
    const res = await api.post(API_URL, user);
    return res.data;
  } catch (error) {
    throw normalizeError(error);
  }
}

export async function atualizarUsuario(id: number, user: Partial<UsuarioAcoes>): Promise<UsuarioAcoes> {
  try {
    user.id = id;
    const res = await api.put(API_URL, user);
    return res.data;
  } catch (error) {
    throw normalizeError(error);
  }
}

export async function deletarUsuario(id: number): Promise<void> {
  try {
    await api.delete(`${API_URL}/${id}`);
  } catch (error) {
    throw normalizeError(error);
  }
}