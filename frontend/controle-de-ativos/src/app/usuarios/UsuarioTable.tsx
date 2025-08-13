import { ActionButtons } from '@/components/common/ActionButtons';
import { DataTable } from '@/components/common/DataTable';
import { FormModal } from '@/components/common/FormModal';
import { useUsuariosContext } from '@/context/UsuariosContext';
import { useUsuariosActions } from '@/hooks/useUsuariosActions';
import { Column } from '@/types/Column';
import { Usuario } from '@/types/Usuario';
import React, { useState, useEffect } from 'react';

export const UsuarioTable: React.FC = () => {
  const { usuarios } = useUsuariosContext();
  const { addUsuario, editUsuario, removeUsuario, fetchUsuarios } = useUsuariosActions();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUsuario, setEditingUsuario] = useState<Usuario | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);

  const [formLogin, setFormLogin] = useState('');
  const [formNome, setFormNome] = useState('');
  const [formEmail, setFormEmail] = useState('');
  const [formSenha, setFormSenha] = useState('');
  const [formStatus, setFormStatus] = useState(1);
  const [formPerfil, setFormPerfil] = useState(0);

  useEffect(() => {
    fetchUsuarios();
  }, [fetchUsuarios]);

  const openAddModal = () => {
    setEditingUsuario(null);
    setFormLogin('');
    setFormNome('');
    setFormEmail('');
    setFormSenha('');
    setFormStatus(1);
    setFormPerfil(0);
    setActionError(null);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setActionError(null);
  };

const onSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  // Cria objeto com dados do formulário para enviar à API
  const usuarioData: Omit<Usuario, 'id'> = {
    login: formLogin,
    nome: formNome,
    email: formEmail,
    senha: formSenha,
    status: formStatus,
    perfil: formPerfil,
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
    try {
      await removeUsuario(id);
    } catch (err) {
      alert((err as Error).message || 'Erro ao remover usuário');
    }
  };

const columns: Column<Usuario>[] = [
    { key: 'login', label: 'Login' },
    { key: 'nome', label: 'Nome' },
    { key: 'email', label: 'Email' },
    {
      key: 'status',
      label: 'Status',
      render: (item: Usuario) =>
        item.status === 1 ? (
          <span className="text-green-600 font-semibold">Ativo</span>
        ) : (
          <span className="text-orange-600 font-semibold">Inativo</span>
        ),
    },
    { key: 'perfil', 
      label: 'Perfil',
      render: (item: Usuario) =>
        item.perfil === 1 ? (
          <span className="text-green-600 font-semibold">Administrador</span>
        ) : (
          <span className="text-orange-600 font-semibold">Básico</span>
        ),
    },
    {
      key: 'acoes',
      label: 'Ações',
      render: (item: Usuario) => (
        <ActionButtons
          onEdit={() => {
            setEditingUsuario(item);
            setFormLogin(item.login);
            setFormNome(item.nome);
            setFormEmail(item.email);
            setFormSenha('');
            setFormStatus(item.status);
            setFormPerfil(item.perfil);
            setIsModalOpen(true);
          }}
          onDelete={() => onDelete(item.id)}
        />
      ),
    },
  ];

  return (
    <>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-gray-700">Usuários</h2>
        <button
          onClick={openAddModal}
          className="bg-teal-500 hover:bg-teal-600 text-white px-4 py-2 rounded"
        >
          Adicionar Usuário
        </button>
      </div>

      <DataTable columns={columns} data={usuarios} />

      <FormModal
        isOpen={isModalOpen}
        title={editingUsuario ? 'Editar Usuário' : 'Novo Usuário'}
        onClose={closeModal}
        onSubmit={onSubmit}
      >
        {actionError && <p className="text-red-600 mb-2">{actionError}</p>}

        <label className="block mb-2">
          Login
          <input
            type="text"
            value={formLogin}
            onChange={e => setFormLogin(e.target.value)}
            required
            className="mt-1 w-full border rounded px-3 py-2"
          />
        </label>

        <label className="block mb-2">
          Nome
          <input
            type="text"
            value={formNome}
            onChange={e => setFormNome(e.target.value)}
            required
            className="mt-1 w-full border rounded px-3 py-2"
          />
        </label>

        <label className="block mb-2">
          Email
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
          <input
            type="password"
            value={formSenha}
            onChange={e => setFormSenha(e.target.value)}
            className="mt-1 w-full border rounded px-3 py-2"
            required={!editingUsuario}
          />
        </label>

        <label className="block mb-2">
          Status
          <select
            value={formStatus}
            onChange={e => setFormStatus(Number(e.target.value))}
            className="mt-1 w-full border rounded px-3 py-2"
          >
            <option value={1}>Ativo</option>
            <option value={0}>Inativo</option>
          </select>
        </label>

        <label className="block mb-2">
          Perfil
          <input
            type="number"
            value={formPerfil}
            onChange={e => setFormPerfil(Number(e.target.value))}
            className="mt-1 w-full border rounded px-3 py-2"
            min={0}
            required
          />
        </label>
      </FormModal>
    </>
  );
};
