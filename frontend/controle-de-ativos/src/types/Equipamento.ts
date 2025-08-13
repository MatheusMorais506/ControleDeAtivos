import { EquipamentoStatusType } from "./EquipamentoStatus";

export interface Equipamento {
  id: string;
  nome: string;
  codigoIdentificacao: string;
  status: EquipamentoStatusType;
  notaEmprestimo: string;
  acoes?: string[];
}
