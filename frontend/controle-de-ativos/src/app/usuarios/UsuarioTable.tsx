"use client";
import React, { useState, useEffect } from "react";
import { DataTable } from "@/components/common/DataTable";
import { FormModal } from "@/components/common/FormModal";
import { useUsuariosContext } from "@/context/UsuariosContext";
import { useUsuariosActions } from "@/hooks/useUsuariosActions";
import { Column } from "@/types/Column";
import { UsuarioAcoes } from "@/types/UsuarioAcoes";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { validateUsuarioForm } from "@/utils/validateUsuarioForm";
import { mensagemDeErro, mensagemDeSucesso } from "@/lib/toastLib";
import { UsuarioStatus } from "@/types/UsuarioStatus";
import { UsuarioPerfil } from "@/types/UsuarioPerfil";
import { usePopupConfirmacaoActions } from "@/hooks/usePopupConfirmacaoActions";
import { DropdownActions } from "@/components/common/DropdownActions";
import { encryptPassword } from "@/utils/crypto";

export function UsuarioTable() {
  const { usuarios } = useUsuariosContext();
  const {
    AdicionarUsuario,
    AtualizarUsuario,
    RemoverUsuario,
    ConsultarUsuario,
  } = useUsuariosActions();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUsuario, setEditingUsuario] = useState<UsuarioAcoes | null>(
    null
  );
  const [actionError, setActionError] = useState<string | null>(null);
  const [dropdownAbertoId, setDropdownAbertoId] = useState<number | null>(null);
  const { ConfirmarAcao } = usePopupConfirmacaoActions();

  const [formLogin, setFormLogin] = useState("");
  const [formNome, setFormNome] = useState("");
  const [formEmail, setFormEmail] = useState("");
  const [formSenha, setFormSenha] = useState("");
  const [formStatus, setFormStatus] = useState(1);
  const [formPerfil, setFormPerfil] = useState(0);
  const [mostrarSenha, setMostrarSenha] = useState(false);

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
    setEditingUsuario(null);
    setFormLogin("");
    setFormNome("");
    setFormEmail("");
    setFormSenha("");
    setFormStatus(1);
    setFormPerfil(1);
    setActionError(null);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setActionError(null);
    setDropdownAbertoId(null);
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    var senhaCriptografia = encryptPassword(formSenha);

    const errors = validateUsuarioForm({
      login: formLogin,
      nome: formNome,
      email: formEmail,
      senha: senhaCriptografia,
      editingUsuario: !!editingUsuario,
    });

    if (Object.keys(errors).length > 0) {
      setActionError(Object.values(errors)[0]);
      return;
    }

    const usuarioData: Omit<UsuarioAcoes, "id"> = {
      login: formLogin.trim(),
      nome: formNome.trim(),
      email: formEmail.trim(),
      senha: senhaCriptografia,
      statusId: formStatus.toString(),
      perfilId: formPerfil.toString(),
    };

    try {
      if (editingUsuario) {
        await AtualizarUsuario(editingUsuario.id, usuarioData);
        await ConsultarUsuario();
        mensagemDeSucesso("Usuário atualizado com sucesso!");
      } else {
        await AdicionarUsuario(usuarioData);
        await ConsultarUsuario();
        mensagemDeSucesso("Usuário adicionado com sucesso!");
      }
      closeModal();
    } catch (err) {
      setActionError((err as Error).message.toString() || "Erro desconhecido");
      mensagemDeErro(
        String((err as Error).message || "Processo não realizado!")
      );
    }
  };

  const onDelete = async (id: number) => {
    const result = await ConfirmarAcao({
      text: "Você não poderá reverter esta ação!",
    });

    if (result.isConfirmed) {
      try {
        await RemoverUsuario(id);
        setDropdownAbertoId(null);
        mensagemDeSucesso("Usuário removido com sucesso!");
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

  const columns: Column<UsuarioAcoes>[] = [
    { key: "login", label: "Login" },
    { key: "nome", label: "Nome" },
    { key: "email", label: "Email" },
    {
      key: "statusId",
      label: "Status",
      render: (u) =>
        parseInt(u.statusId) === UsuarioStatus.Ativo ? (
          <span className="text-green-600 font-semibold">Ativo</span>
        ) : (
          <span className="text-orange-600 font-semibold">Inativo</span>
        ),
    },
    {
      key: "perfilId",
      label: "Perfil",
      render: (u) =>
        parseInt(u.perfilId) === UsuarioPerfil.Administrador ? (
          <span className="text-green-600 font-semibold">Administrador</span>
        ) : (
          <span className="text-orange-600 font-semibold">Básico</span>
        ),
    },
    {
      key: "acoes",
      label: "Ações",
      render: (u) => (
        <DropdownActions
          item={u}
          onEdit={(user) => {
            setEditingUsuario(user);
            setFormLogin(user.login);
            setFormNome(user.nome);
            setFormEmail(user.email);
            setFormSenha("");
            setFormStatus(parseInt(user.statusId));
            setFormPerfil(parseInt(user.perfilId));
            setIsModalOpen(true);
          }}
          onDelete={(user) => onDelete(user.id)}
        />
      ),
    },
  ];

  return (
    <>
      <div className="flex justify-between items-center mb-4 px-4 py-2 border-b border-gray-200 bg-white">
        <h2 className="text-lg font-semibold text-gray-700">Usuários</h2>
        <button
          onClick={openAddModal}
          className="bg-teal-600 hover:bg-teal-500 text-white px-3 py-1 rounded-md text-md font-semibold"
        >
          Adicionar
        </button>
      </div>

      <DataTable
        columns={columns}
        data={usuarios}
        searchKeys={["login", "nome", "email", "statusId", "perfilId"]}
      />

      <FormModal
        isOpen={isModalOpen}
        title={editingUsuario ? "Editar Usuário" : "Novo Usuário"}
        onClose={closeModal}
        onSubmit={onSubmit}
      >
        {/* {actionError && <p className="text-red-600 mb-2">{actionError}</p>} */}

        {!editingUsuario && (
          <label className="block mb-2">
            Login
            <input
              type="text"
              value={formLogin}
              onChange={(e) => setFormLogin(e.target.value)}
              required
              className="mt-1 w-full border rounded px-3 py-2"
            />
          </label>
        )}

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
          Email
          <input
            type="email"
            value={formEmail}
            onChange={(e) => setFormEmail(e.target.value)}
            required
            className="mt-1 w-full border rounded px-3 py-2"
          />
        </label>

        <label className="block mb-2">
          Senha {editingUsuario && "(deixe vazio para não alterar)"}
          <div className="relative">
            <input
              type={mostrarSenha ? "text" : "password"}
              value={formSenha}
              onChange={(e) => setFormSenha(e.target.value)}
              className="mt-1 w-full border rounded px-3 py-2 pr-10"
              required={!editingUsuario}
            />
            <button
              type="button"
              onClick={() => setMostrarSenha(!mostrarSenha)}
              className="absolute inset-y-0 right-0 px-3 flex items-center text-gray-500 hover:text-gray-700"
              aria-label={mostrarSenha ? "Ocultar senha" : "Mostrar senha"}
            >
              {mostrarSenha ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>
        </label>

        <label className="block mb-2">
          Status
          <select
            value={formStatus}
            onChange={(e) => setFormStatus(Number(e.target.value))}
            className="mt-1 w-full border rounded px-3 py-2"
          >
            <option value={1}>Ativo</option>
            <option value={2}>Inativo</option>
          </select>
        </label>

        <label className="block mb-2">
          Perfil
          <select
            value={formPerfil}
            onChange={(e) => setFormPerfil(Number(e.target.value))}
            className="mt-1 w-full border rounded px-3 py-2"
          >
            <option value={1}>Administrador</option>
            <option value={2}>Básico</option>
          </select>
        </label>
      </FormModal>
    </>
  );
}
