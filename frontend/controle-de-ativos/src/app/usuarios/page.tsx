"use client";

import { UsuariosProvider } from "@/context/UsuariosContext";
import UsuarioClient from "./UsuarioClient";
import { AutenticacaoGuard } from "@/guards/AutenticacaoGuard";

export default function UsuariosPage() {
  return (
    <AutenticacaoGuard>
      <UsuariosProvider>
        <UsuarioClient />
      </UsuariosProvider>
    </AutenticacaoGuard>
  );
}
