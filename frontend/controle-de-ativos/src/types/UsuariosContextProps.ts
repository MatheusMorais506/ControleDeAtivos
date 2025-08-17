import { UsuarioAcoes } from "./UsuarioAcoes";

export interface UsuariosContextProps {
  usuarios: UsuarioAcoes[];
  isLoading: boolean;
  error: string | null;
  setError: React.Dispatch<React.SetStateAction<string | null>>;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
  setUsuarios: React.Dispatch<React.SetStateAction<UsuarioAcoes[]>>;
  fetchUsuarios: () => Promise<void>;
}