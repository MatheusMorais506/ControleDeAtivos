import { EquipamentoStatusType } from "./EquipamentoStatus";

export interface Equipamento {
  id: string;
  nome: string;
  codigo: string;
  status: EquipamentoStatusType;
  nota: string;
  acoes?: string[];
}
