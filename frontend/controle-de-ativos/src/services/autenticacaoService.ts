import api from '@/lib/api';
import { LoginCredentials } from '@/types/LoginCredentials';
import { Usuario } from '@/types/Usuario';

const API_URL = `${process.env.NEXT_PUBLIC_API_URL}/api/Autenticacao`;

export async function loginService(credentials: LoginCredentials): Promise<Usuario> {
  try {
    const res = await api.post(API_URL, credentials);
    return res.data.usuario;
  } catch (error) {
    throw new Error('Credenciais inválidas');
  }
}

export async function logoutService(): Promise<void> {
  try {
    await api.post(`${API_URL}/logout`);
  } catch (error) {
    throw new Error('Erro ao sair');
  }
}

export async function fetchCurrentUser(): Promise<Usuario | null> {
  try {
    const res = await api.get(`${API_URL}`);
    if (res.status === 200) {
      return res.data.usuario;
    }
    return null;
  } catch (error: any) {
    if (error.response?.status === 401) {
      return null;
    }
    throw error;
  }
}

