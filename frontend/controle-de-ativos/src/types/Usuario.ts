export interface Usuario {
  id: number;
  login: string;
  nome: string;
  email: string;
  senha: string;
  statusId: string;
  perfilId: string;
  acoes?: string[];
}
