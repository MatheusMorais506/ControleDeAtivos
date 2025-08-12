'use client';

import { useState } from 'react';
import { usePathname } from 'next/navigation';
import { Sidebar } from '@/components/layout/Sidebar';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { AuthProvider } from '@/context/AutenticacaoContext';
import './globals.css';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const [isExpanded, setIsExpanded] = useState(true);
  const pathname = usePathname();

  // Verifica se está na página de login
  const isLoginPage = pathname === '/login';

  return (
    <html lang="pt-br">
      <body className="flex bg-gray-50">
        <AuthProvider>
          {!isLoginPage && <Sidebar isExpanded={isExpanded} />}
          <div className="flex flex-col flex-1 min-h-screen">
            {!isLoginPage && <Navbar toggleSidebar={() => setIsExpanded(!isExpanded)} />}
            <main className="flex-1 p-4">{children}</main>
            <Footer />
          </div>
        </AuthProvider>
      </body>
    </html>
  );
}
