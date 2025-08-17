"use client";

import React, { useState, useEffect } from "react";
import { useEquipamentosContext } from "@/context/EquipamentosContext";
import { useEquipamentosActions } from "@/hooks/useEquipamentosActions";
import { FormModal } from "@/components/common/FormModal";
import { Equipamento } from "@/types/Equipamento";
import { EquipamentoStatus } from "@/types/EquipamentoStatus";
import { DataTable } from "@/components/common/DataTable";
import { Column } from "@/types/Column";
import { mensagemDeErro, mensagemDeSucesso } from "@/lib/toastLib";
import { usePopupConfirmacaoActions } from "@/hooks/usePopupConfirmacaoActions";
import { DropdownActions } from "@/components/common/DropdownActions";

export function EquipamentosTable() {
  const { equipamentos } = useEquipamentosContext();
  const {
    AdicionarEquipamento,
    RemoveEquipamento,
    AtualizarEquipamento,
    EmprestarEquipamento,
    DevolverEquipamento,
    ConsultarEquipamento,
  } = useEquipamentosActions();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalOpenEmprestimo, setIsModalOpenEmprestimo] = useState(false);
  const [editingEquipamento, setEditingEquipamento] =
    useState<Equipamento | null>(null);
  const [equipamentoSelecionado, setEquipamentoSelecionado] =
    useState<Equipamento | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);
  const { ConfirmarAcao } = usePopupConfirmacaoActions();

  const [formNome, setFormNome] = useState("");
  const [formCodigo, setFormCodigo] = useState("");
  const [observacaoEmprestimo, setObservacaoEmprestimo] = useState("");
  const [dropdownAbertoId, setDropdownAbertoId] = useState<number | null>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (
        !target.closest(".dropdown-menu") &&
        !target.closest(".dropdown-button")
      ) {
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
    setFormNome("");
    setFormCodigo("");
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
        await AtualizarEquipamento(
          editingEquipamento.id,
          formNome,
          formCodigo,
          observacaoEmprestimo
        );
        mensagemDeSucesso("Equipamento atualizado com sucesso!");
      } else {
        await AdicionarEquipamento(formNome, formCodigo);
        mensagemDeSucesso("Equipamento adicionado com sucesso!");
      }
      await ConsultarEquipamento();
      closeModal();
    } catch (err) {
      setActionError((err as Error).message.toString() || "Erro desconhecido");
      mensagemDeErro(
        String((err as Error).message || "Processo não realizado!")
      );
    }
  };

  const onDelete = async (id: string) => {
    const result = await ConfirmarAcao({
      text: "Você não poderá reverter esta ação!",
    });

    if (result.isConfirmed) {
      try {
        await RemoveEquipamento(id);
        await ConsultarEquipamento();
        mensagemDeSucesso("Equipamento removido com sucesso!");
      } catch (err) {
        setActionError(
          (err as Error).message.toString() || "Erro desconhecido"
        );
        mensagemDeErro(
          String((err as Error).message || "Processo não realizado!")
        );
      }
    }
  };

  const emprestarEquipamento = async () => {
    if (!equipamentoSelecionado) return;
    try {
      await EmprestarEquipamento(
        equipamentoSelecionado.id,
        observacaoEmprestimo
      );
      await ConsultarEquipamento();
      setEquipamentoSelecionado(null);
      setObservacaoEmprestimo("");
      setIsModalOpenEmprestimo(false);
      mensagemDeSucesso("Equipamento emprestado com sucesso!");
    } catch (err) {
      setActionError((err as Error).message.toString() || "Erro desconhecido");
      mensagemDeErro(
        String((err as Error).message || "Processo não realizado!")
      );
    }
  };

  const devolverEquipamento = async (equip: Equipamento) => {
    const result = await ConfirmarAcao({
      title: "Confirmar a devolução?",
    });

    if (result.isConfirmed) {
      try {
        await DevolverEquipamento(equip.id);
        await ConsultarEquipamento();
        mensagemDeSucesso("Equipamento devolvido com sucesso!");
      } catch (err) {
        setActionError(
          (err as Error).message.toString() || "Erro desconhecido"
        );
        mensagemDeErro(
          String((err as Error).message || "Processo não realizado!")
        );
      }
    }
  };

  const columns: Column<Equipamento>[] = [
    { key: "nome", label: "Nome" },
    { key: "codigoIdentificacao", label: "Código" },
    {
      key: "status",
      label: "Status",
      render: (item) =>
        item.status === EquipamentoStatus.Disponivel ? (
          <span className="text-green-600 font-semibold">Disponível</span>
        ) : (
          <span className="text-orange-600 font-semibold">Em Uso</span>
        ),
    },
    { key: "notaEmprestimo", label: "Nota" },
    {
      key: "acoes",
      label: "Ações",
      render: (item) => (
        <DropdownActions
          item={item}
          onEdit={(equip) => {
            setEditingEquipamento(equip);
            setFormNome(equip.nome);
            setFormCodigo(equip.codigoIdentificacao);
            setObservacaoEmprestimo(equip.notaEmprestimo || "");
            setIsModalOpen(true);
          }}
          onDelete={(equip) => onDelete(equip.id)}
          onExtraAction1={(equip) => {
            setEquipamentoSelecionado(equip);
            setIsModalOpenEmprestimo(true);
          }}
          showExtraAction1={(equip) =>
            equip.status === EquipamentoStatus.Disponivel
          }
          onExtraAction2={(equip) => devolverEquipamento(equip)}
          showExtraAction2={(equip) => equip.status === EquipamentoStatus.EmUso}
        />
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

      <DataTable
        columns={columns}
        data={equipamentos}
        searchKeys={["nome", "codigoIdentificacao", "status", "notaEmprestimo"]}
      />

      <FormModal
        isOpen={isModalOpen}
        title={editingEquipamento ? "Editar Equipamento" : "Novo Equipamento"}
        onClose={closeModal}
        onSubmit={onSubmit}
      >
        {/* {actionError && <p className="text-red-600 mb-2">{actionError}</p>} */}

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
        {observacaoEmprestimo !== "" &&
          observacaoEmprestimo !== null &&
          editingEquipamento && (
            <label className="block mb-2">
              Anotação
              <input
                type="text"
                value={observacaoEmprestimo || ""}
                onChange={(e) => setObservacaoEmprestimo(e.target.value)}
                required
                className="mt-1 w-full border rounded px-3 py-2"
              />
            </label>
          )}
      </FormModal>

      <FormModal
        isOpen={isModalOpenEmprestimo}
        title="Emprestar Equipamento"
        onClose={() => {
          setIsModalOpenEmprestimo(false);
          setObservacaoEmprestimo("");
        }}
        onSubmit={(e) => {
          e.preventDefault();
          emprestarEquipamento();
        }}
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
}
