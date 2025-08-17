import React, { useState, useEffect } from "react";
import { ActionButtons } from "@/components/common/ActionButtons";
import { useAuth } from "@/context/AutenticacaoContext";
import { UsuarioPerfil } from "@/types/UsuarioPerfil";
import { DropdownActionsProps } from "@/types/DropdownActionsProps";

export function DropdownActions<T>({
  item,
  onEdit,
  onDelete,
  onExtraAction1,
  onExtraAction2,
  showExtraAction1,
  showExtraAction2,
}: DropdownActionsProps<T>) {
  const [isOpen, setIsOpen] = useState(false);
  const [position, setPosition] = useState({ top: 0, left: 0 });
  const { user } = useAuth();

  const toggleDropdown = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!isOpen) {
      const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
      setPosition({
        top: rect.bottom + window.scrollY,
        left: rect.left + window.scrollX,
      });
    }
    setIsOpen(!isOpen);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (
        !target.closest(".dropdown-menu") &&
        !target.closest(".dropdown-button")
      ) {
        setIsOpen(false);
      }
    };
    if (isOpen) document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, [isOpen]);

  const usuarioAdministrador =
    user !== false && user?.perfilId === UsuarioPerfil.Administrador.toString();

  return (
    <div className="relative inline-block text-left">
      <button
        onClick={toggleDropdown}
        className="dropdown-button inline-flex items-center gap-1 bg-teal-200 text-teal-800 text-sm font-semibold px-3 py-1 rounded hover:bg-teal-300 focus:outline-none focus:ring-2 focus:ring-teal-400"
      >
        Ações
        <svg
          className={`w-4 h-4 transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      {isOpen && (
        <div
          className="dropdown-menu fixed z-50 bg-white border border-gray-300 rounded shadow-lg"
          style={{ top: position.top, left: position.left }}
        >
          <ActionButtons
            onEdit={() => {
              onEdit?.(item);
              setIsOpen(false);
            }}
            onDelete={() => {
              onDelete?.(item);
              setIsOpen(false);
            }}
            onEmprestar={
              onExtraAction1 &&
              usuarioAdministrador &&
              (!showExtraAction1 || showExtraAction1(item))
                ? () => {
                    onExtraAction1(item);
                    setIsOpen(false);
                  }
                : undefined
            }
            onDevolver={
              onExtraAction2 &&
              usuarioAdministrador &&
              (!showExtraAction2 || showExtraAction2(item))
                ? () => {
                    onExtraAction2(item);
                    setIsOpen(false);
                  }
                : undefined
            }
          />
        </div>
      )}
    </div>
  );
}
