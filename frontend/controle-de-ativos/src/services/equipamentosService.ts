import { Equipamento } from '@/types/Equipamento';
import api from '@/lib/api';

const API_URL = `${process.env.NEXT_PUBLIC_API_URL}/api/Equipamentos`;

export async function consultarEquipamento(): Promise<Equipamento[]> {
  try {
    const res = await api.get(API_URL);
    return res.data;
  } catch (error) {
    throw new Error('Erro ao buscar equipamentos');
  }
}

export async function registrarEquipamento(nome: string, codigoIdentificacao: string): Promise<Equipamento> {
  try {
    const res = await api.post(API_URL, { nome, codigoIdentificacao });
    return res.data;
  } catch (error) {
    throw new Error('Erro ao adicionar ativo');
  }
}

export async function emprestarEquipamento(id: string, nota: string): Promise<Equipamento> {
  try {
    const res = await api.put(`${API_URL}/${id}/emprestar`, { nota });
    return res.data;
  } catch (error) {
    throw new Error('Erro ao realizar empréstimo');
  }
}

export async function devolverEquipamento(id: string): Promise<Equipamento> {
  try {
    const res = await api.put(`${API_URL}/${id}/devolver`);
    return res.data;
  } catch (error) {
    throw new Error('Erro ao registrar devolução');
  }
}

export async function deletarEquipamento(id: string): Promise<void> {
  try {
    await api.delete(`${API_URL}/${id}`);
  } catch (error) {
    throw new Error('Erro ao remover ativo');
  }
}

export async function atualizarEquipamento(
  id: string, nome: string, codigoIdentificacao: string, notaEmprestimo: string): Promise<Equipamento> {
  try {
    const res = await api.put(`${API_URL}/${id}/atualizar`, { nome, codigoIdentificacao, notaEmprestimo });
    return res.data;
  } catch (error) {
    throw new Error('Erro ao atualizar ativo');
  }
}
