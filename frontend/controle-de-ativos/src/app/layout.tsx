'use client';

import { ReactNode, useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { Sidebar } from '@/components/layout/Sidebar';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { AutenticacaoProvider } from '@/context/AutenticacaoContext';
import './globals.css';
import { ToastProvider } from '@/lib/toastLib';
import clsx from 'clsx';
import { setCurrentPath } from '@/lib/api';
import { setNavegacao } from '@/lib/navegacao';

export default function ComponentsLayout({ children }: { children: ReactNode }) {

  const [isExpanded, setIsExpanded] = useState(true);
  const pathname = usePathname();
  const router = useRouter();
  const isLoginPage = pathname === '/' || pathname === '/login';

  useEffect(() => {
  setCurrentPath(pathname);
  setNavegacao(router.push);
  }, [pathname, router]);

  return (
    <html lang="pt-br">
      <body className="flex bg-gray-50 min-h-screen">
        <AutenticacaoProvider>
          {!isLoginPage && <Sidebar isExpanded={isExpanded} />}

          <div
            className={clsx(
              'flex flex-col flex-1 h-screen overflow-y-auto overflow-x-hidden transition-all duration-300',
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
        </AutenticacaoProvider>
      </body>
    </html>
  );
}