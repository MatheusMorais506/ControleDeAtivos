'use client';
import React, { useState, useEffect } from 'react';
import { DataTable } from '@/components/common/DataTable';
import { FormModal } from '@/components/common/FormModal';
import { ActionButtons } from '@/components/common/ActionButtons';
import { useUsuariosContext } from '@/context/UsuariosContext';
import { useUsuariosActions } from '@/hooks/useUsuariosActions';
import { Column } from '@/types/Column';
import { Usuario } from '@/types/Usuario';
import Swal from 'sweetalert2';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { validateUsuarioForm } from '@/utils/validateUsuarioForm';

export const UsuarioTable: React.FC = () => {
  const { usuarios } = useUsuariosContext();
  const { addUsuario, editUsuario, removeUsuario, fetchUsuarios } = useUsuariosActions();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUsuario, setEditingUsuario] = useState<Usuario | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);
  const [dropdownAbertoId, setDropdownAbertoId] = useState<number | null>(null);

  const [formLogin, setFormLogin] = useState('');
  const [formNome, setFormNome] = useState('');
  const [formEmail, setFormEmail] = useState('');
  const [formSenha, setFormSenha] = useState('');
  const [formStatus, setFormStatus] = useState(1);
  const [formPerfil, setFormPerfil] = useState(0);
  const [mostrarSenha, setMostrarSenha] = useState(false);

  useEffect(() => { fetchUsuarios(); }, [fetchUsuarios]);

  const openAddModal = () => {
    setEditingUsuario(null);
    setFormLogin('');
    setFormNome('');
    setFormEmail('');
    setFormSenha('');
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

    const errors = validateUsuarioForm({
      login: formLogin,
      nome: formNome,
      email: formEmail,
      senha: formSenha,
      editingUsuario: !!editingUsuario
    });

    if (Object.keys(errors).length > 0) {
      setActionError(Object.values(errors)[0]);
      return;
    }

    const usuarioData: Omit<Usuario, 'id'> = {
      login: formLogin.trim(),
      nome: formNome.trim(),
      email: formEmail.trim(),
      senha: formSenha,
      statusId: formStatus.toString(),
      perfilId: formPerfil.toString()
    };

    try {
      if (editingUsuario) {
        await editUsuario(editingUsuario.id, usuarioData);
      } else {
        await addUsuario(usuarioData);
      }
      closeModal();
    } catch (err) {
      setActionError((err as Error).message || 'Erro desconhecido');
    }
  };

  const onDelete = async (id: number) => {
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
        await removeUsuario(id);
        setDropdownAbertoId(null);
        Swal.fire('Deletado!', 'O usuário foi removido.', 'success');
      } catch (err) {
        Swal.fire('Erro!', (err as Error).message || 'Erro ao remover usuário', 'error');
      }
    }
  };

  const columns: Column<Usuario>[] = [
    { key: 'login', label: 'Login' },
    { key: 'nome', label: 'Nome' },
    { key: 'email', label: 'Email' },
    {
      key: 'statusId',
      label: 'Status',
      render: u => parseInt(u.statusId) === 1
        ? <span className="text-green-600 font-semibold">Ativo</span>
        : <span className="text-orange-600 font-semibold">Inativo</span>
    },
    {
      key: 'perfilId',
      label: 'Perfil',
      render: u => parseInt(u.perfilId) === 1
        ? <span className="text-green-600 font-semibold">Administrador</span>
        : <span className="text-orange-600 font-semibold">Básico</span>
    },
    {
      key: 'acoes',
      label: 'Ações',
      render: u => (
        <div className="relative inline-block text-left">
          <button
            onClick={() => setDropdownAbertoId(prev => (prev === u.id ? null : u.id))}
            className="inline-flex items-center gap-1 bg-teal-200 text-teal-800 text-sm font-semibold px-3 py-1 rounded cursor-pointer hover:bg-teal-300 focus:outline-none focus:ring-2 focus:ring-teal-400"
          >
            Ações
            <svg
              className={`w-4 h-4 transition-transform duration-200 ${dropdownAbertoId === u.id ? 'rotate-180' : ''}`}
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {dropdownAbertoId === u.id && (
            <div className="absolute mt-1 right-0 w-36 bg-white border border-gray-300 rounded shadow-lg z-10">
              <ActionButtons
                onEdit={() => {
                  setEditingUsuario(u);
                  setFormLogin(u.login);
                  setFormNome(u.nome);
                  setFormEmail(u.email);
                  setFormSenha('');
                  setFormStatus(parseInt(u.statusId));
                  setFormPerfil(parseInt(u.perfilId));
                  setIsModalOpen(true);
                  setDropdownAbertoId(null);
                }}
                onDelete={() => onDelete(u.id)}
              />
            </div>
          )}
        </div>
      ),
    }
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

      <DataTable columns={columns} data={usuarios} searchKeys={['login', 'nome', 'email']} />

      <FormModal
        isOpen={isModalOpen}
        title={editingUsuario ? 'Editar Usuário' : 'Novo Usuário'}
        onClose={closeModal}
        onSubmit={onSubmit}
      >
        {actionError && <p className="text-red-600 mb-2">{actionError}</p>}

        <label className="block mb-2">Login
          <input
            type="text"
            value={formLogin}
            onChange={e => setFormLogin(e.target.value)}
            required
            className="mt-1 w-full border rounded px-3 py-2"
          />
        </label>

        <label className="block mb-2">Nome
          <input
            type="text"
            value={formNome}
            onChange={e => setFormNome(e.target.value)}
            required
            className="mt-1 w-full border rounded px-3 py-2"
          />
        </label>

        <label className="block mb-2">Email
          <input
            type="email"
            value={formEmail}
            onChange={e => setFormEmail(e.target.value)}
            required
            className="mt-1 w-full border rounded px-3 py-2"
          />
        </label>

        <label className="block mb-2">
          Senha {editingUsuario && '(deixe vazio para não alterar)'}
          <div className="relative">
            <input
              type={mostrarSenha ? 'text' : 'password'}
              value={formSenha}
              onChange={(e) => setFormSenha(e.target.value)}
              className="mt-1 w-full border rounded px-3 py-2 pr-10"
              required={!editingUsuario}
            />
            <button
              type="button"
              onClick={() => setMostrarSenha(!mostrarSenha)}
              className="absolute inset-y-0 right-0 px-3 flex items-center text-gray-500 hover:text-gray-700"
              aria-label={mostrarSenha ? 'Ocultar senha' : 'Mostrar senha'}
            >
              {mostrarSenha ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>
        </label>

        <label className="block mb-2">Status
          <select
            value={formStatus}
            onChange={e => setFormStatus(Number(e.target.value))}
            className="mt-1 w-full border rounded px-3 py-2"
          >
            <option value={1}>Ativo</option>
            <option value={2}>Inativo</option>
          </select>
        </label>

        <label className="block mb-2">Perfil
          <select
            value={formPerfil}
            onChange={e => setFormPerfil(Number(e.target.value))}
            className="mt-1 w-full border rounded px-3 py-2"
          >
            <option value={1}>Administrador</option>
            <option value={2}>Básico</option>
          </select>
        </label>
      </FormModal>
    </>
  );
};