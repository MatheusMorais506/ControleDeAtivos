"use client";

import React from "react";
import clsx from "clsx";
import Link from "next/link";
import { FaBox, FaUsers, FaSignOutAlt } from "react-icons/fa";
import { useAuth } from "@/context/AutenticacaoContext";
import { mensagemDeSucesso } from "@/lib/toastLib";
import { routes } from "@/routes";
import { SidebarProps } from "@/types/SidebarProps";
import { usePopupConfirmacaoActions } from "@/hooks/usePopupConfirmacaoActions";
import { UsuarioPerfil } from "@/types/UsuarioPerfil";
import { AutenticacaoGuard } from "@/guards/AutenticacaoGuard";

export function Sidebar({ isExpanded }: SidebarProps) {
  const { logout, user } = useAuth();
  const { ConfirmarAcao } = usePopupConfirmacaoActions();

  const menuItems = [
    {
      name: "Equipamentos",
      icon: <FaBox size={20} />,
      path: routes.equipamentos,
    },
    {
      name: "Usuários",
      icon: <FaUsers size={20} />,
      path: routes.usuarios,
      usuarioAdministrador: true,
    },
  ];

  const filtrarMenu = menuItems.filter(
    (item) =>
      !item.usuarioAdministrador ||
      (user && user.perfilId === UsuarioPerfil.Administrador.toString())
  );

  const handleLogout = async () => {
    const result = await ConfirmarAcao({
      title: "Tem certeza que deseja sair?",
    });

    if (result.isConfirmed) {
      await logout();
      mensagemDeSucesso("Logout realizado com sucesso!");
    }
  };

  return (
    <AutenticacaoGuard>
      <div
        className={clsx(
          "bg-teal-700 text-white h-screen fixed top-0 left-0 flex flex-col justify-between transition-all duration-300 z-50",
          isExpanded ? "w-60" : "w-14"
        )}
      >
        <div>
          <div className="flex items-center justify-center py-5 font-bold text-md border-b border-teal-500">
            {isExpanded ? "Controle de Ativos" : ""}
          </div>
          <nav className="mt-4 space-y-2">
            {filtrarMenu.map((item) => (
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
    </AutenticacaoGuard>
  );
}
