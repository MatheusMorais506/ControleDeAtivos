export interface Usuario {
  id: number;
  login: string;
  nome: string;
  email: string;
  senha: string;
  status: number;
  perfil: number;
  acoes?: string[];
}
