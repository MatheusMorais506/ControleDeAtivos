import api from '@/lib/api';

const API_URL = `${process.env.NEXT_PUBLIC_API_URL}/api/Autenticacao`;

export interface LoginCredentials {
  login: string;
  senha: string;
}

export interface User {
  id: number;
  nome: string;
  email: string;
  token: string;
}

export async function loginService(credentials: LoginCredentials): Promise<User> {
  try {
    const res = await api.post(API_URL, credentials);
    return res.data.usuario;
  } catch (error) {
    throw new Error('Credenciais inválidas');
  }
}

export async function fetchCurrentUser(): Promise<User | null> {
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

