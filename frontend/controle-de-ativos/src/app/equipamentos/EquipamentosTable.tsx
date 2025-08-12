'use client';

import React, { useState, useEffect } from 'react';
import { FaEdit, FaTrash } from 'react-icons/fa';
import { useEquipamentosContext } from '@/context/EquipamentosContext';
import { useEquipamentosActions } from '@/hooks/useEquipamentosActions';
import { FormModal } from '@/components/common/FormModal';
import { ActionButtons } from '@/components/common/ActionButtons';
import { Equipamento} from '@/types/Equipamento';
import { EquipamentoStatus } from '@/types/EquipamentoStatus';
import { DataTable } from '@/components/common/DataTable';
import { Column } from '@/types/Column';

export const EquipamentosTable: React.FC = () => {
  const { equipamentos } = useEquipamentosContext();
  const {
    addEquipamento,
    removeEquipamento,
    fetchEquipamentos,
    updateEquipamento,
    emprestar,
    devolver,
  } = useEquipamentosActions();

  // Estados para modal, pesquisa e paginação
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalOpenEmprestimo, setIsModalOpenEmprestimo] = useState(false);
  const [editingEquipamento, setEditingEquipamento] = useState<Equipamento | null>(null);
  const [equipamentoSelecionado, setEquipamentoSelecionado] = useState<Equipamento | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);
  const [formNome, setFormNome] = useState('');
  const [formCodigo, setFormCodigo] = useState('');
  const [notaEmprestimo, setNotaEmprestimo] = useState('');
  const [dropdownAbertoId, setDropdownAbertoId] = useState<string | null>(null);

  // Nova state para filtro da pesquisa
  const [searchTerm, setSearchTerm] = useState('');

  // Paginação
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(20);

  useEffect(() => {
    fetchEquipamentos();
  }, [fetchEquipamentos]);

  // Filtra os equipamentos conforme o termo pesquisado
const filteredEquipamentos = equipamentos.filter((eq) => {
  const nome = typeof eq.nome === 'string' ? eq.nome.toLowerCase() : '';
  const codigo = typeof eq.codigo === 'string' ? eq.codigo.toLowerCase() : '';
  const termo = searchTerm.toLowerCase();
  return nome.includes(termo) || codigo.includes(termo);
});

  // Paginação lógica
  const totalItems = filteredEquipamentos.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const paginatedEquipamentos = filteredEquipamentos.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Funções para navegação da paginação
  const goToPage = (page: number) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };

  // Ações e modais continuam iguais
  const openAddModal = () => {
    setEditingEquipamento(null);
    setFormNome('');
    setFormCodigo('');
    setActionError(null);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setActionError(null);
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingEquipamento) {
        await updateEquipamento(editingEquipamento.id, formNome, formCodigo);
      } else {
        await addEquipamento(formNome, formCodigo);
      }
      await fetchEquipamentos();
      closeModal();
    } catch (err) {
      setActionError((err as Error).message || 'Erro desconhecido');
    }
  };

  const onDelete = async (id: string) => {
    try {
      await removeEquipamento(id);
      await fetchEquipamentos();
    } catch (err) {
      alert((err as Error).message || 'Erro ao remover equipamento');
    }
  };

  const emprestarEquipamento = async () => {
    if (!equipamentoSelecionado) return;
    try {
      await emprestar(equipamentoSelecionado.id, notaEmprestimo);
      await fetchEquipamentos();
      setNotaEmprestimo('');
      setEquipamentoSelecionado(null);
      setIsModalOpenEmprestimo(false);
    } catch (err) {
      alert((err as Error).message);
    }
  };

  const devolverEquipamento = async (equip: Equipamento) => {
    try {
      await devolver(equip.id);
      await fetchEquipamentos();
    } catch (err) {
      alert((err as Error).message);
    }
  };

  const toggleDropdown = (id: string) => {
  setDropdownAbertoId(prev => (prev === id ? null : id));
};

const fecharDropdown = () => setDropdownAbertoId(null);

  const columns: Column<Equipamento>[] = [
    { key: 'nome', label: 'Nome' },
    { key: 'codigo', label: 'Codigo' }, // Alterei para "Regional" conforme imagem
    {
      key: 'status',
      label: 'Status',
      render: (item: Equipamento) =>
        item.status === EquipamentoStatus.Disponivel ? (
          <span className="text-green-600 font-semibold">Disponível</span>
        ) : (
          <span className="text-orange-600 font-semibold">Em Uso</span>
        ),
    },
{
  key: 'acoes',
  label: 'Ações',
  render: (item: Equipamento) => (
    <div className="relative inline-block text-left">
      <button
        onClick={() => toggleDropdown(item.id)}
        className="inline-flex items-center gap-1 bg-teal-200 text-teal-800 text-sm font-semibold px-3 py-1 rounded cursor-pointer hover:bg-teal-300 focus:outline-none focus:ring-2 focus:ring-teal-400"
      >
        Ações
          <svg
    className={`w-4 h-4 transition-transform duration-200 ${dropdownAbertoId === item.id ? 'rotate-180' : ''}`}
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
  </svg>
      </button>
      {dropdownAbertoId === item.id && (
        <div
          className="absolute mt-1 right-0 w-36 bg-white border border-gray-300 rounded shadow-lg z-10"
        >
          <ActionButtons
            onEdit={() => {
              setEditingEquipamento(item);
              setFormNome(item.nome);
              setFormCodigo(item.codigo);
              fecharDropdown();
              setIsModalOpen(true); // abre modal editar
            }}
            onDelete={() => {
              onDelete(item.id);
              fecharDropdown();
            }}
            onEmprestar={
              item.status === EquipamentoStatus.Disponivel
                ? () => {
                    setEquipamentoSelecionado(item);
                    fecharDropdown();
                    setIsModalOpenEmprestimo(true); // abre modal emprestar
                  }
                : undefined
            }
            onDevolver={
              item.status === EquipamentoStatus.EmUso
                ? () => {
                    devolverEquipamento(item);
                    fecharDropdown();
                  }
                : undefined
            }
          />
        </div>
      )}
    </div>
  ),
}
  ];

  return (
    <>
      {/* Cabeçalho com título, pesquisa e botão */}
      <div className="flex justify-between items-center mb-4 px-4 py-2 border-b border-gray-200 bg-white">
        <h2 className="text-lg font-semibold text-gray-700">Equipamentos</h2>

        <div className="flex items-center gap-2">
          <input
            type="text"
            placeholder="Pesquisar"
            className="border border-gray-300 rounded px-3 py-1 text-sm text-gray-600 focus:outline-none focus:ring-2 focus:ring-teal-400"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1); // reset página ao pesquisar
            }}
          />
          <button
            onClick={openAddModal}
            className="bg-teal-400 hover:bg-teal-500 text-white px-3 py-1 rounded text-sm font-medium"
          >
            Adicionar
          </button>
        </div>
      </div>

      {/* Tabela */}
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
          {paginatedEquipamentos.length > 0 ? (
            paginatedEquipamentos.map((item, idx) => (
              <tr key={idx} className="hover:bg-gray-50">
                {columns.map((col) => (
                  <td
                    key={String(col.key)}
                    className="px-4 py-3 border-b text-sm text-gray-700"
                  >
                    {col.render ? col.render(item) : String(item[col.key] ?? '')}
                  </td>
                ))}
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={columns.length} className="text-center py-4 text-gray-500">
                Nenhum registro encontrado.
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Paginação */}
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
          <span className="mx-2 px-2 py-1 bg-teal-400 text-white rounded">{currentPage}</span>
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
            {[10, 20, 50, 100].map((n) => (
              <option key={n} value={n}>
                {n}
              </option>
            ))}
          </select>
          <span>Exibindo {totalItems} de {equipamentos.length}</span>
        </div>
      </div>

      {/* Modais */}
      <FormModal
        isOpen={isModalOpen}
        title={editingEquipamento ? 'Editar Equipamento' : 'Novo Equipamento'}
        onClose={closeModal}
        onSubmit={onSubmit}
      >
        {actionError && <p className="text-red-600 mb-2">{actionError}</p>}

        <label className="block mb-2">
          Nome
          <input
            type="text"
            value={formNome}
            onChange={(e) => setFormNome(e.target.value)}
            required
            className="mt-1 w-full border rounded px-3 py-2"
          />
        </label>

        <label className="block mb-2">
          Código
          <input
            type="text"
            value={formCodigo}
            onChange={(e) => setFormCodigo(e.target.value)}
            required
            className="mt-1 w-full border rounded px-3 py-2"
          />
        </label>
      </FormModal>

      <FormModal
        isOpen={isModalOpenEmprestimo}
        title="Emprestar Equipamento"
        onClose={() => setIsModalOpenEmprestimo(false)}
        onSubmit={(e) => {
          e.preventDefault();
          emprestarEquipamento();
        }}
      >
        <label className="block mb-2">
          Observação (quem pegou / detalhes)
          <input
            type="text"
            value={notaEmprestimo}
            onChange={(e) => setNotaEmprestimo(e.target.value)}
            required
            className="mt-1 w-full border rounded px-3 py-2"
          />
        </label>
      </FormModal>
    </>
  );
};
