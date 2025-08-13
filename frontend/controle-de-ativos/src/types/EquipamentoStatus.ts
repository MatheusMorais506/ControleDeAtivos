export const EquipamentoStatus = {
  Disponivel: false,
  EmUso: true,
} as const;

export type EquipamentoStatusType =
  typeof EquipamentoStatus[keyof typeof EquipamentoStatus];
