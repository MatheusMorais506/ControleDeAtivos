'use client';

import React, { useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import clsx from 'clsx';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import Link from 'next/link';
import { FaBox, FaUsers, FaSignOutAlt, FaBars } from 'react-icons/fa';
import { AuthProvider } from '@/context/AutenticacaoContext';
import { ToastProvider } from  '@/lib/toastLib';
import { AuthGuard } from '@/services/authGuard';
import { Footer } from './Footer';
import { routes } from '@/routes';

interface SidebarProps {
  isExpanded: boolean;
}

const menuItems = [
  { name: 'Equipamentos', icon: <FaBox size={20} />, path: routes.equipamentos },
  { name: 'Usuários', icon: <FaUsers size={20} />, path: routes.usuarios },
];

export const Sidebar: React.FC<SidebarProps> = ({ isExpanded }) => {
  const router = useRouter();
  const MySwal = withReactContent(Swal);

  const handleLogout = async () => {
    const result = await MySwal.fire({
      title: 'Tem certeza que deseja sair?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sim',
      cancelButtonText: 'Não',
      reverseButtons: true,
    });

    if (result.isConfirmed) {
      router.push(routes.login);
    }
  };

  return (
    <AuthGuard>
      <div
        className={clsx(
          'bg-teal-700 text-white h-screen fixed top-0 left-0 flex flex-col justify-between transition-all duration-300 z-50',
          isExpanded ? 'w-60' : 'w-14'
        )}
      >
        <div>
          <div className="flex items-center justify-center py-5 font-bold text-md border-b border-teal-500">
            {isExpanded ? 'Controle de Ativos' : ''}
          </div>
          <nav className="mt-4 space-y-2">
            {menuItems.map((item) => (
              <Link
                key={item.name}
                href={item.path}
                className="flex items-center gap-3 px-4 py-2 hover:bg-teal-600 transition-colors"
              >
                {item.icon}
                {isExpanded && <span>{item.name}</span>}
              </Link>
            ))}
          </nav>
        </div>
        <div className="px-4 py-2 border-t border-teal-500">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 hover:text-red-300 transition-colors"
          >
            <FaSignOutAlt size={20} />
            {isExpanded && <span>Sair</span>}
          </button>
        </div>
      </div>
    </AuthGuard>
  );
};

interface NavbarProps {
  toggleSidebar: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ toggleSidebar }) => {
  return (
    <AuthGuard>
      <header className="bg-white border-b border-gray-200 px-4 py-2 flex items-center justify-between">
        <button
          onClick={toggleSidebar}
          className="text-teal-600 hover:text-teal-800"
        >
          <FaBars size={20} />
        </button>
        <h1 className="font-bold text-gray-700"></h1>
        <div></div>
      </header>
    </AuthGuard>
  );
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const [isExpanded, setIsExpanded] = useState(true);
  const pathname = usePathname();
  const isLoginPage = pathname === '/' || pathname === '/login';

  return (
    <html lang="pt-br">
      <body className="flex bg-gray-50 min-h-screen">
        <AuthProvider>
          {!isLoginPage && <Sidebar isExpanded={isExpanded} />}

          <div
            className={clsx(
              'flex flex-col flex-1 h-screen overflow-auto transition-all duration-300',
              !isLoginPage && (isExpanded ? 'ml-60' : 'ml-14')
            )}
          >
            {!isLoginPage && (
              <Navbar toggleSidebar={() => setIsExpanded(!isExpanded)} />
            )}
            <main className={`flex-1 ${isLoginPage ? 'p-0 flex' : 'p-4'}`}>
              <ToastProvider>{children}</ToastProvider>
            </main>
            <Footer />
          </div>
        </AuthProvider>
      </body>
    </html>
  );
}
