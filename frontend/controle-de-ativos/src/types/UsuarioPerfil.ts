export const UsuarioPerfil = {
  Administrador: 1,
  Basico: 2,
} as const;

export type UsuarioPerfilType =
  typeof UsuarioPerfil[keyof typeof UsuarioPerfil];
