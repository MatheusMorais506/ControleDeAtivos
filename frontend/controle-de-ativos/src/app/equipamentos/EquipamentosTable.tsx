'use client';

import React, { useState, useEffect } from 'react';
import { useEquipamentosContext } from '@/context/EquipamentosContext';
import { useEquipamentosActions } from '@/hooks/useEquipamentosActions';
import { FormModal } from '@/components/common/FormModal';
import { ActionButtons } from '@/components/common/ActionButtons';
import { Equipamento } from '@/types/Equipamento';
import { EquipamentoStatus } from '@/types/EquipamentoStatus';
import { DataTable } from '@/components/common/DataTable';
import { Column } from '@/types/Column';
import Swal from 'sweetalert2';

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

  // Estados para modal e paginação
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalOpenEmprestimo, setIsModalOpenEmprestimo] = useState(false);
  const [editingEquipamento, setEditingEquipamento] = useState<Equipamento | null>(null);
  const [equipamentoSelecionado, setEquipamentoSelecionado] = useState<Equipamento | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);
  const [formNome, setFormNome] = useState('');
  const [formCodigo, setFormCodigo] = useState('');
  const [observacaoEmprestimo, setObservacaoEmprestimo] = useState('');
  const [dropdownAbertoId, setDropdownAbertoId] = useState<string | null>(null);

  useEffect(() => { fetchEquipamentos(); }, [fetchEquipamentos]);

  const openAddModal = () => {
    setEditingEquipamento(null);
    setFormNome('');
    setFormCodigo('');
    setActionError(null);
    setIsModalOpen(true);
  };

  const closeModal = () => { setIsModalOpen(false); setActionError(null); };

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
    const result = await Swal.fire({
      title: 'Tem certeza?',
      text: 'Você não poderá reverter esta ação!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Sim, deletar!',
      cancelButtonText: 'Cancelar'
    });

    if (result.isConfirmed) {
      try {
        await removeEquipamento(id);
        await fetchEquipamentos();
        Swal.fire('Deletado!', 'O equipamento foi removido.', 'success');
      } catch (err) {
        Swal.fire('Erro!', (err as Error).message || 'Erro ao remover equipamento', 'error');
      }
    }
  };

  const emprestarEquipamento = async () => {
    if (!equipamentoSelecionado) return;
    try {
      await emprestar(equipamentoSelecionado.id, observacaoEmprestimo);
      await fetchEquipamentos();
      setEquipamentoSelecionado(null);
      setObservacaoEmprestimo('');
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

  const columns: Column<Equipamento>[] = [
    { key: 'nome', label: 'Nome' },
    { key: 'codigoIdentificacao', label: 'Código' },
    { key: 'status', label: 'Status', render: (item) =>
        item.status === EquipamentoStatus.Disponivel 
          ? <span className="text-green-600 font-semibold">Disponível</span>
          : <span className="text-orange-600 font-semibold">Em Uso</span>
    },
    { key: 'notaEmprestimo', label: 'Nota' },
    {
      key: 'acoes',
      label: 'Ações',
      render: (item) => (
        <div className="relative inline-block text-left">
          <button
            onClick={() => setDropdownAbertoId(prev => (prev === item.id ? null : item.id))}
            className="inline-flex items-center gap-1 bg-teal-200 text-teal-800 text-sm font-semibold px-3 py-1 rounded cursor-pointer hover:bg-teal-300 focus:outline-none focus:ring-2 focus:ring-teal-400"
          >
            Ações
            <svg
              className={`w-4 h-4 transition-transform duration-200 ${dropdownAbertoId === item.id ? 'rotate-180' : ''}`}
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {dropdownAbertoId === item.id && (
            <div className="absolute mt-1 right-0 w-36 bg-white border border-gray-300 rounded shadow-lg z-10">
              <ActionButtons
                onEdit={() => { setEditingEquipamento(item); setFormNome(item.nome); setFormCodigo(item.codigoIdentificacao); setIsModalOpen(true); setDropdownAbertoId(null); }}
                onDelete={() => { onDelete(item.id); setDropdownAbertoId(null); }}
                onEmprestar={item.status === EquipamentoStatus.Disponivel 
                  ? () => { setEquipamentoSelecionado(item); setIsModalOpenEmprestimo(true); setDropdownAbertoId(null); } 
                  : undefined}
                onDevolver={item.status === EquipamentoStatus.EmUso 
                  ? () => { devolverEquipamento(item); setDropdownAbertoId(null); } 
                  : undefined}
              />
            </div>
          )}
        </div>
      ),
    },
  ];

  return (
    <>
      <div className="flex justify-between items-center mb-4 px-4 py-2 border-b border-gray-200 bg-white">
        <h2 className="text-lg font-semibold text-gray-700">Equipamentos</h2>
<button
  onClick={openAddModal}
  className="bg-teal-600 hover:bg-teal-500 text-white px-3 py-1 rounded-md text-md font-semibold"
>
  Adicionar
</button>

      </div>

      <DataTable columns={columns} data={equipamentos} searchKeys={['nome','codigoIdentificacao']} />

      <FormModal
        isOpen={isModalOpen}
        title={editingEquipamento ? 'Editar Equipamento' : 'Novo Equipamento'}
        onClose={closeModal}
        onSubmit={onSubmit}
      >
        {actionError && <p className="text-red-600 mb-2">{actionError}</p>}
        <label className="block mb-2">
          Nome
          <input type="text" value={formNome} onChange={e => setFormNome(e.target.value)} required className="mt-1 w-full border rounded px-3 py-2" />
        </label>
        <label className="block mb-2">
          Código
          <input type="text" value={formCodigo} onChange={e => setFormCodigo(e.target.value)} required className="mt-1 w-full border rounded px-3 py-2" />
        </label>
      </FormModal>

      <FormModal
        isOpen={isModalOpenEmprestimo}
        title="Emprestar Equipamento"
        onClose={() => {
          setIsModalOpenEmprestimo(false);
          setObservacaoEmprestimo('');
        }}
        onSubmit={(e) => { e.preventDefault(); emprestarEquipamento(); }}
      >
        <label className="block mb-2">
          Observação
          <input
            type="text"
            value={observacaoEmprestimo}
            onChange={(e) => setObservacaoEmprestimo(e.target.value)}
            required
            className="mt-1 w-full border rounded px-3 py-2"
          />
        </label>
      </FormModal>
    </>
  );
};
