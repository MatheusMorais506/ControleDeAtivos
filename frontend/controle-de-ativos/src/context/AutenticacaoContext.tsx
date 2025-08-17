"use client";

import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";
import { loginService, logoutService } from "@/services/autenticacaoService";
import { usePathname, useRouter } from "next/navigation";
import { fetchCurrentUser } from "@/services/autenticacaoService";
import { routes } from "@/routes";
import { AuthContextType } from "@/types/AuthContextType";
import { AuthProviderProps } from "@/types/AuthProviderProps";
import { Usuario } from "@/types/Usuario";
import { LoginCredentials } from "@/types/LoginCredentials";

const AutenticacaoContext = createContext<AuthContextType | undefined>(
  undefined
);

export function AutenticacaoProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<Usuario | null | false>(null);
  const [sessionActive, setSessionActive] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (pathname === "/logout") {
      logout();
      return;
    }

    if (pathname === "/login" || pathname === "/") {
      setUser(false);
      setSessionActive(false);
      return;
    }

    if (!sessionActive && user !== false) {
      const loadUser = async () => {
        const currentUser = await fetchCurrentUser();
        if (currentUser) {
          setUser(currentUser);
          setSessionActive(true);
        } else {
          setUser(false);
        }
      };
      loadUser();
    }
  }, [pathname]);

  const AutenticarUsuario = async (credentials: LoginCredentials) => {
    const loggedUser = await loginService(credentials);
    setUser(loggedUser);
    setSessionActive(true);
    router.push(routes.equipamentos);
  };

  const logout = async () => {
    try {
      await logoutService();
    } catch (err) {
    } finally {
      setUser(false);
      setSessionActive(false);
      router.push(routes.login);
    }
  };

  return (
    <AutenticacaoContext.Provider value={{ user, AutenticarUsuario, logout }}>
      {children}
    </AutenticacaoContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AutenticacaoContext);
  if (!context)
    throw new Error("useAuth deve ser usado dentro de AuthProvider");
  return context;
};
