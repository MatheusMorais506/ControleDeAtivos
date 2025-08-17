export const UsuarioStatus = {
  Ativo: 1,
  Inativo: 2,
} as const;

export type UsuarioStatusType =
  typeof UsuarioStatus[keyof typeof UsuarioStatus];
