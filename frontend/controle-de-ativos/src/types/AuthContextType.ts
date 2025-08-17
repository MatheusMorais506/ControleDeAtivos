import { LoginCredentials } from "./LoginCredentials";
import { Usuario } from "./Usuario";

export interface AuthContextType {
  user: Usuario | null | false;
  AutenticarUsuario: (credentials: LoginCredentials) => Promise<void>;
  logout: () => void;
}
