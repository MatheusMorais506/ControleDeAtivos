'use client';
import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { loginService, LoginCredentials, User } from '@/services/autenticacaoService';
import { useRouter } from 'next/navigation';
import { fetchCurrentUser } from '@/services/autenticacaoService';
import { routes } from '@/routes';

interface AuthContextType {
  user: User | null | false;
  AutenticarUsuario: (credentials: LoginCredentials) => Promise<void>;
  logout: () => void;
}

interface AuthProviderProps {
  children: ReactNode;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null | false>(null);
  const router = useRouter();

useEffect(() => {
    async function loadUser() {
      const currentUser = await fetchCurrentUser();
       console.log('CurrentUser:', currentUser);
      if (currentUser) {
        setUser(currentUser);
      } else {
        setUser(false);
      }
    }
    loadUser();
  }, []);

  const AutenticarUsuario = async (credentials: LoginCredentials) => {
    const loggedUser = await loginService(credentials);
    setUser(loggedUser);
    router.push(routes.usuarios);
  };

  const logout = () => {
    setUser(null);
    router.push(routes.login);
  };

  return (
    <AuthContext.Provider value={{ user, AutenticarUsuario, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth deve ser usado dentro de AuthProvider');
  return context;
};
