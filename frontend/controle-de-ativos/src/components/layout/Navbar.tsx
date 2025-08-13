'use client';
import { AuthGuard } from '@/services/authGuard';
import { FaBars } from 'react-icons/fa';

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
