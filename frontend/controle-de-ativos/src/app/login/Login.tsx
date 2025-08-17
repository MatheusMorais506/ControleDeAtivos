"use client";
import React, { useState } from "react";
import { useAuth } from "@/context/AutenticacaoContext";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { mensagemDeErro } from "@/lib/toastLib";
import { Loading } from "@/components/common/Loading";
import Image from "next/image";
import { encryptPassword } from "@/utils/crypto";

export function Login() {
  const { AutenticarUsuario } = useAuth();
  const [login, setLogin] = useState("");
  const [senha, setSenha] = useState("");
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [erro, setErro] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!login || !senha) {
      setErro("Preencha todos os campos");
      mensagemDeErro("Preencha todos os campos");
      return;
    }

    setErro("");
    setLoading(true);

    try {
      var senhaCriptografia = encryptPassword(senha);

      await AutenticarUsuario({ login, senha: senhaCriptografia });
    } catch (erro: unknown) {
      const erroOcorrido =
        erro instanceof Error ? erro.message : "Erro ao autenticar usuário";
      setErro(erroOcorrido);
      mensagemDeErro(erroOcorrido);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="h-full w-full overflow-hidden bg-gradient-to-b from-teal-100 to-white flex items-center justify-center px-4">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-sm">
        <div className="flex justify-center mb-8">
          <Image
            src="/logo_cejam.png"
            alt="CEJAM"
            width={80}
            height={80}
            className="object-contain"
          />
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label
              htmlFor="usuario"
              className="block text-sm font-medium text-gray-700"
            >
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
            <label
              htmlFor="senha"
              className="block text-sm font-medium text-gray-700"
            >
              Senha <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <input
                id="senha"
                type={mostrarSenha ? "text" : "password"}
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                className="mt-1 block w-full rounded-md border border-gray-300 bg-gray-100 px-3 py-2 pr-10 text-gray-700 focus:outline-none focus:ring-2 focus:ring-teal-500"
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
          </div>

          {/* {erro && <p className="text-red-500 text-sm">{erro}</p>} */}

          <button
            type="submit"
            disabled={loading}
            className={`w-full rounded-md bg-gradient-to-r from-teal-400 to-teal-600 py-3 text-white font-semibold hover:from-teal-500 hover:to-teal-700 transition flex justify-center items-center ${
              loading ? "opacity-70 cursor-not-allowed" : ""
            }`}
          >
            {loading ? <Loading /> : "Entrar"}
          </button>
        </form>
      </div>
    </div>
  );
}
