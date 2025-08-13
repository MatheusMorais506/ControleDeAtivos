"use client";

import { EquipamentosProvider } from "@/context/EquipamentosContext";
import EquipamentosClient from "./EquipamentosClient";
import { AutenticacaoGuard } from "@/guards/AutenticacaoGuard";

export default function EquipamentosPage() {
  return (
    <AutenticacaoGuard>
      <EquipamentosProvider>
        <EquipamentosClient />
      </EquipamentosProvider>
    </AutenticacaoGuard>
  );
}
