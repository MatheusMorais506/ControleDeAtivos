'use client';
import { FaBox, FaSignOutAlt, FaUsers } from 'react-icons/fa';
import Link from 'next/link';
import clsx from 'clsx';
import { routes } from '@/routes';
import { AuthGuard } from '@/services/authGuard';

interface SidebarProps {
  isExpanded: boolean;
}

const menuItems = [
  { name: 'Ativos', icon: <FaBox size={20} />, path: routes.ativos },
  { name: 'Usuários', icon: <FaUsers size={20} />, path: routes.usuarios },
];

export const Sidebar: React.FC<SidebarProps> = ({ isExpanded }) => {
  return (
         <AuthGuard>
          <div
      className={clsx(
        'bg-teal-700 text-white h-screen transition-all duration-300 flex flex-col justify-between',
        isExpanded ? 'w-64' : 'w-20'
      )}
    >
      <div>
        <div className="flex items-center justify-center py-4 font-bold text-lg border-b border-teal-500">
          {isExpanded ? 'Controle de Ativos' : 'CA'}
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
      <div className="px-4 py-4 border-t border-teal-500">
        <button className="flex items-center gap-3 hover:text-red-300 transition-colors">
          <FaSignOutAlt size={20} />
          {isExpanded && <span>Sair</span>}
        </button>
      </div>
    </div>
         </AuthGuard>
    
  );
};
