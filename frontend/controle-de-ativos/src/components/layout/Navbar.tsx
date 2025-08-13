'use client';
import { useAuth } from '@/context/AutenticacaoContext';
import { AutenticacaoGuard } from '@/guards/AutenticacaoGuard';
import { NavbarProps } from '@/types/NavbarProps';
import { FaBars } from 'react-icons/fa';

export function Navbar({ toggleSidebar }: NavbarProps) {
  const { user } = useAuth();
  
  return (
    <AutenticacaoGuard>
      <header className="bg-white border-b border-gray-200 px-4 py-2 flex items-center justify-between">
        <button
          onClick={toggleSidebar}
          className="text-teal-600 hover:text-teal-800"
        >
          <FaBars size={20} />
        </button>
        <h1 className="font-bold text-gray-700 "></h1>
        <div className="text-gray-700 font-medium text-sm">
          {user ? `Olá, ${user.nome}` : ""}
        </div>
      </header>
    </AutenticacaoGuard>
  );
};
