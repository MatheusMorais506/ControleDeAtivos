import { Equipamento } from "./Equipamento";

export interface EquipamentosContextProps {
  equipamentos: Equipamento[];
  isLoading: boolean;
  error: string | null;
  setError: React.Dispatch<React.SetStateAction<string | null>>;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
  setEquipamentos: React.Dispatch<React.SetStateAction<Equipamento[]>>;
  fetchEquipamentos: () => Promise<void>;
}
