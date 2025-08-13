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
import { showError, showSuccess } from '@/lib/toastLib';

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
  const [dropdownAbertoId, setDropdownAbertoId] = useState<number | null>(null);
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0 });

  useEffect(() => { fetchEquipamentos(); }, [fetchEquipamentos]);

    useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest(".dropdown-menu") && !target.closest(".dropdown-button")) {
        setDropdownAbertoId(null);
      }
    };
  
    if (dropdownAbertoId !== null) {
      document.addEventListener("click", handleClickOutside);
    } else {
      document.removeEventListener("click", handleClickOutside);
    }
  
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [dropdownAbertoId]);

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
        showSuccess('Equipamento atualizado com sucesso!');
      } else {
        await addEquipamento(formNome, formCodigo);
         showSuccess('Equipamento adicionado com sucesso!');
      }
      await fetchEquipamentos();
      closeModal();
    } catch (err) {
      setActionError((err as Error).message || 'Erro desconhecido');
      showError("Processo não realizado!");
    }
  };

  const onDelete = async (id: string) => {
    const result = await Swal.fire({
      title: 'Tem certeza?',
      text: 'Você não poderá reverter esta ação!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#0F766EFF',
      cancelButtonColor: '#DC2626FF',
      confirmButtonText: 'Sim',
      cancelButtonText: 'Não'
    });

    if (result.isConfirmed) {
      try {
        await removeEquipamento(id);
        await fetchEquipamentos();
        showSuccess('Equipamento removido com sucesso!');
      } catch (err) {
        showError((err as Error).message || 'Erro ao remover equipamento');
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
      showSuccess('Equipamento emprestado com sucesso!');
    } catch (err) {
      showError((err as Error).message || 'Erro ao emprestar equipamento');
    }
  };

  const devolverEquipamento = async (equip: Equipamento) => {

    const result = await Swal.fire({
      title: 'Confirmar a devolução?',
      text: '',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#0F766EFF',
      cancelButtonColor: '#DC2626FF',
      confirmButtonText: 'Sim',
      cancelButtonText: 'Não'
    });

   if (result.isConfirmed) {
    try {
      await devolver(equip.id);
      await fetchEquipamentos();
      showSuccess('Equipamento devolvido com sucesso!');
    } catch (err) {
      showError((err as Error).message || 'Erro ao devolver equipamento');
    }
    }
  };

  const handleToggleDropdown = (e: React.MouseEvent, id: number) => {
    e.stopPropagation();
    if (dropdownAbertoId === id) {
      setDropdownAbertoId(null);
    } else {
      const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
      setDropdownPosition({
        top: rect.bottom + window.scrollY,
        left: rect.left + window.scrollX
      });
      setDropdownAbertoId(id);
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
            onClick={(e) => handleToggleDropdown(e, parseInt(item.id))}
            className="inline-flex items-center gap-1 bg-teal-200 text-teal-800 text-sm font-semibold px-3 py-1 rounded cursor-pointer hover:bg-teal-300 focus:outline-none focus:ring-2 focus:ring-teal-400"
          >
            Ações
            <svg
              className={`w-4 h-4 transition-transform duration-200 ${dropdownAbertoId === parseInt(item.id) ? 'rotate-180' : ''}`}
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {dropdownAbertoId === parseInt(item.id) && (
           <div className="fixed z-50 bg-white border border-gray-300 rounded shadow-lg"
            style={{
              top: dropdownPosition.top,
              left: dropdownPosition.left
            }}>
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
