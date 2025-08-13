"use client";

import React, { useState, useMemo } from "react";
import { Column } from "@/types/Column";
import { DataTableProps } from "@/types/DataTableProps";
import { EquipamentoStatus } from "@/types/EquipamentoStatus";
import { UsuarioStatus } from "@/types/UsuarioStatus";
import { UsuarioPerfil } from "@/types/UsuarioPerfil";

export function DataTable<T>({
  data,
  columns,
  searchKeys = [],
  itemsPerPageOptions = [10, 20, 50, 100],
  defaultItemsPerPage = 20,
}: DataTableProps<T>) {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(defaultItemsPerPage);
  const [dropdownAbertoId, setDropdownAbertoId] = useState<
    string | number | null
  >(null);

  const fecharDropdown: () => void = () => {
    setDropdownAbertoId(null);
  };

  const filteredData = useMemo(() => {
    if (!searchTerm || searchKeys.length === 0) return data;
    const termo = searchTerm.toLowerCase();

    return data.filter((item) =>
      searchKeys.some((key) => {
        let val: any = item[key];

        if (key === "status") {
          val = val === EquipamentoStatus.Disponivel ? "Disponível" : "Em Uso";
        }

        if (key === "statusId") {
          val = val === UsuarioStatus.Ativo ? "Ativo" : "Inativo";
        }

        if (key === "perfilId") {
          val =
            val === UsuarioPerfil.Administrador ? "Administrador" : "Básico";
        }

        return String(val).toLowerCase().includes(termo);
      })
    );
  }, [data, searchTerm, searchKeys]);

  const totalItems = filteredData.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const paginatedData = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const goToPage = (page: number) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };

  return (
    <div>
      {searchKeys.length > 0 && (
        <div className="mb-3">
          <input
            type="text"
            placeholder="Pesquisar"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value.trim());
              setCurrentPage(1);
            }}
            className="border border-gray-300 rounded px-4 py-2 text-base focus:outline-none focus:ring-2 focus:ring-teal-400"
          />
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200 rounded-md shadow-sm">
          <thead>
            <tr className="bg-teal-100 text-gray-700 text-sm font-semibold">
              {columns.map((col) => (
                <th
                  key={String(col.key)}
                  className="px-4 py-2 border-b border-teal-200 text-left"
                >
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {paginatedData.length > 0 ? (
              paginatedData.map((item, idx) => (
                <tr key={idx} className="hover:bg-gray-50">
                  {columns.map((col) => (
                    <td
                      key={String(col.key)}
                      className="px-4 py-3 border-b text-sm text-gray-700"
                    >
                      {col.render
                        ? col.render({
                            ...item,
                            dropdownAbertoId,
                            setDropdownAbertoId,
                            fecharDropdown,
                          })
                        : String(item[col.key] ?? "")}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={columns.length}
                  className="text-center py-4 text-gray-500"
                >
                  Nenhum registro encontrado.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="flex justify-between items-center mt-3 px-4 text-gray-600 text-sm">
        <div>
          <button
            onClick={() => goToPage(1)}
            disabled={currentPage === 1}
            className="px-2 py-1 rounded hover:bg-teal-100 disabled:opacity-50"
          >
            «
          </button>
          <button
            onClick={() => goToPage(currentPage - 1)}
            disabled={currentPage === 1}
            className="px-2 py-1 rounded hover:bg-teal-100 disabled:opacity-50"
          >
            ‹
          </button>
          <span className="mx-2 px-2 py-1 bg-teal-400 text-white rounded">
            {currentPage}
          </span>
          <button
            onClick={() => goToPage(currentPage + 1)}
            disabled={currentPage === totalPages || totalPages === 0}
            className="px-2 py-1 rounded hover:bg-teal-100 disabled:opacity-50"
          >
            ›
          </button>
          <button
            onClick={() => goToPage(totalPages)}
            disabled={currentPage === totalPages || totalPages === 0}
            className="px-2 py-1 rounded hover:bg-teal-100 disabled:opacity-50"
          >
            »
          </button>
        </div>

        <div className="flex items-center gap-2">
          <select
            className="border border-gray-300 rounded px-2 py-1 text-sm"
            value={itemsPerPage}
            onChange={(e) => {
              setItemsPerPage(Number(e.target.value));
              setCurrentPage(1);
            }}
          >
            {itemsPerPageOptions.map((n) => (
              <option key={n} value={n}>
                {n}
              </option>
            ))}
          </select>
          <span>
            Exibindo {totalItems} de {data.length}
          </span>
        </div>
      </div>
    </div>
  );
}
