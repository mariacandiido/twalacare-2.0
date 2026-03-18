import { create } from "zustand";
import { persist } from "zustand/middleware";

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
  aprovada: boolean;
}

interface FarmaciasStore {
  farmacias: FarmaciaLoja[];
  isLoading: boolean;
  error: string | null;
  fetchFarmacias: () => Promise<void>;
  obterAprovadas: () => FarmaciaLoja[];
  obterTodas: () => FarmaciaLoja[];
}

export const useFarmaciasStore = create<FarmaciasStore>()(
  (set, get) => ({
    farmacias: [],
    isLoading: false,
    error: null,

    fetchFarmacias: async () => {
      set({ isLoading: true, error: null });
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/public/farmacias`);
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

    obterAprovadas: () => get().farmacias, // No backend já filtramos as aprovadas no /public
    obterTodas: () => get().farmacias,
  })
);
