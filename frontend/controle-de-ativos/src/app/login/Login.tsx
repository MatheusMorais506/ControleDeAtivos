'use client';
import React, { useState } from 'react';
import { useAuth } from '@/context/AutenticacaoContext';

export const Login: React.FC = () => {
  const { AutenticarUsuario } = useAuth();
  const [login, setLogin] = useState('');
  const [senha, setSenha] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!login || !senha) {
      setError('Preencha todos os campos');
      return;
    }
    try {
      await AutenticarUsuario({ login, senha });
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-teal-100 to-white flex items-center justify-center px-4">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <div className="flex justify-center mb-8">
          <img src="/logo_cejam.png" alt="CEJAM" className="h-20 w-20 object-contain" />
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="usuario" className="block text-sm font-medium text-gray-700">
              Usuário <span className="text-red-500">*</span>
            </label>
            <input
              id="usuario"
              type="text"
              value={login}
              onChange={(e) => setLogin(e.target.value)}
              className="mt-1 block w-full rounded-md border border-gray-300 bg-gray-100 px-3 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>

          <div>
            <label htmlFor="senha" className="block text-sm font-medium text-gray-700">
              Senha <span className="text-red-500">*</span>
            </label>
            <input
              id="senha"
              type="password"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              className="mt-1 block w-full rounded-md border border-gray-300 bg-gray-100 px-3 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <button
            type="submit"
            className="w-full rounded-md bg-gradient-to-r from-teal-400 to-teal-600 py-3 text-white font-semibold hover:from-teal-500 hover:to-teal-700 transition"
          >
            Entrar
          </button>
        </form>
      </div>
    </div>
  );
};
