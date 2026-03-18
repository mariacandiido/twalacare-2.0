import { create } from "zustand";

export interface Usuario {
  id: string;
  nome: string;
  email: string;
  tipo: "cliente" | "farmacia" | "entregador" | "admin";
  telefone: string;
  dataRegistro: string;
  status: "ativo" | "inativo";
}

interface UsuariosStore {
  usuarios: Usuario[];
  isLoading: boolean;
  error: string | null;
  fetchUsuarios: () => Promise<void>;
  adicionarUsuario: (usuario: Omit<Usuario, "id" | "dataRegistro">) => Promise<boolean>;
  deletarUsuario: (id: string) => Promise<boolean>;
  toggleStatus: (id: string) => Promise<boolean>;
}

export const useUsuariosStore = create<UsuariosStore>((set, get) => ({
  usuarios: [],
  isLoading: false,
  error: null,

  fetchUsuarios: async () => {
    set({ isLoading: true, error: null });
    try {
      const token = localStorage.getItem("twalacare_token");
      const res = await fetch(`${import.meta.env.VITE_API_URL}/admin/usuarios`, {
        headers: { "Authorization": `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) {
        set({ usuarios: data.data });
      }
    } catch (err) {
      set({ error: "Erro ao carregar usuários" });
    } finally {
      set({ isLoading: false });
    }
  },

  adicionarUsuario: async (usuario) => {
     // Implementar se necessário, ou usar authService
     return false;
  },

  deletarUsuario: async (id) => {
    try {
      const token = localStorage.getItem("twalacare_token");
      const res = await fetch(`${import.meta.env.VITE_API_URL}/admin/usuarios/${id}`, {
        method: "DELETE",
        headers: { "Authorization": `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) {
        await get().fetchUsuarios();
        return true;
      }
      return false;
    } catch (err) {
      return false;
    }
  },

  toggleStatus: async (id) => {
    try {
      const token = localStorage.getItem("twalacare_token");
       // Encontrar usuario atual para inverter status
      const u = get().usuarios.find(user => user.id === id);
      if (!u) return false;
      const novoStatus = u.status === 'ativo' ? 'inativo' : 'ativo';

      const res = await fetch(`${import.meta.env.VITE_API_URL}/admin/usuarios/${id}`, {
        method: "PATCH",
        headers: { 
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ status: novoStatus })
      });
      const data = await res.json();
      if (data.success) {
        await get().fetchUsuarios();
        return true;
      }
      return false;
    } catch (err) {
      return false;
    }
  },
}));
