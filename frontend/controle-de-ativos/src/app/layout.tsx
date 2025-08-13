'use client';

import { useState } from 'react';
import { usePathname } from 'next/navigation';
import { Sidebar } from '@/components/layout/Sidebar';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { AuthProvider } from '@/context/AutenticacaoContext';
import './globals.css';
import { ToastProvider } from '@/lib/toastLib';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const [isExpanded, setIsExpanded] = useState(true);
  const pathname = usePathname();
  const isLoginPage = pathname === '/' || pathname === '/login';

  return (
    <html lang="pt-br">
      <body className="flex bg-gray-50 min-h-screen">
        <AuthProvider>
          {!isLoginPage && <Sidebar isExpanded={isExpanded} />}
          <div className="flex flex-col flex-1">
            {!isLoginPage && <Navbar toggleSidebar={() => setIsExpanded(!isExpanded)} />}
            <main className={`flex-1 ${isLoginPage ? 'p-0 flex overflow-hidden' : 'p-4'}`}>
              <ToastProvider>
                {children}
              </ToastProvider>
            </main>
            <Footer />
          </div>
        </AuthProvider>
      </body>
    </html>
  );
}
