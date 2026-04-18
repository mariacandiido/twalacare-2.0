import { create } from "zustand";

const API_BASE =
  (import.meta as any).env?.VITE_API_URL ?? "http://localhost:3000/api";

export interface FarmaciaLoja {
  id: string;
  nome: string;
  email: string;
  telefone: string;
  provincia: string;
  municipio: string;
  endereco: string;
  horarioAbertura: string;
  horarioFechamento: string;
  rating: number;
  deliveryTime: string;
  image: string;
  products: number;
  isOpen: boolean;
}

interface FarmaciasStore {
  farmacias: FarmaciaLoja[];
  isLoading: boolean;
  error: string | null;
  fetchFarmacias: () => Promise<void>;
  obterAprovadas: () => FarmaciaLoja[];
  obterTodas: () => FarmaciaLoja[];
  obterPendentes: () => FarmaciaLoja[];
  adicionarFarmacia: (f: any) => void;
}

export const useFarmaciasStore = create<FarmaciasStore>()((set, get) => ({
  farmacias: [],
  isLoading: false,
  error: null,

  fetchFarmacias: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch(`${API_BASE}/public/farmacias`);
      const result = await response.json();
      if (result.success) {
        set({ farmacias: result.data });
      } else {
        set({ error: result.message || "Erro ao carregar farmácias" });
      }
    } catch (err) {
      set({ error: "Erro de conexão com o servidor" });
    } finally {
      set({ isLoading: false });
    }
  },

  obterAprovadas: () => get().farmacias,
  obterTodas: () => get().farmacias,
  obterPendentes: () => [],
  adicionarFarmacia: (f) => set((s) => ({ farmacias: [...s.farmacias, f] })),
}));
