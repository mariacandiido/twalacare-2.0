import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface Usuario {
  id: string;
  nome: string;
  email: string;
  tipo: "farmacia" | "entregador" | "admin";
  telefone: string;
  dataRegistro: string;
  status: "ativo" | "inativo";
}

interface UsuariosStore {
  usuarios: Usuario[];
  adicionarUsuario: (usuario: Omit<Usuario, "id" | "dataRegistro">) => void;
  editarUsuario: (id: string, dados: Partial<Usuario>) => void;
  deletarUsuario: (id: string) => void;
  toggleStatus: (id: string) => void;
  obterUsuario: (id: string) => Usuario | undefined;
  obterTodos: () => Usuario[];
  obterPorTipo: (tipo: Usuario["tipo"]) => Usuario[];
}

const usuariosIniciais: Usuario[] = [
  {
    id: "2",
    nome: "Farmácia Central",
    email: "central@pharmacy.com",
    tipo: "farmacia",
    telefone: "+244912345678",
    dataRegistro: "2025-01-10",
    status: "ativo",
  },
  {
    id: "3",
    nome: "Carlos Entregador",
    email: "carlos@delivery.com",
    tipo: "entregador",
    telefone: "+244987654321",
    dataRegistro: "2025-01-05",
    status: "ativo",
  },
  {
    id: "admin-1",
    nome: "Administrador",
    email: "admin@twalcare.com",
    tipo: "admin",
    telefone: "+244900000000",
    dataRegistro: "2024-12-01",
    status: "ativo",
  },
];

export const useUsuariosStore = create<UsuariosStore>()(
  persist(
    (set, get) => ({
      usuarios: usuariosIniciais,

      adicionarUsuario: (usuario) => {
        const novoUsuario: Usuario = {
          ...usuario,
          id: Date.now().toString(),
          dataRegistro: new Date().toISOString().split("T")[0],
        };
        set((state) => ({
          usuarios: [...state.usuarios, novoUsuario],
        }));
      },

      editarUsuario: (id, dados) => {
        set((state) => ({
          usuarios: state.usuarios.map((u) =>
            u.id === id ? { ...u, ...dados } : u,
          ),
        }));
      },

      deletarUsuario: (id) => {
        set((state) => ({
          usuarios: state.usuarios.filter((u) => u.id !== id),
        }));
      },

      toggleStatus: (id) => {
        set((state) => ({
          usuarios: state.usuarios.map((u) =>
            u.id === id
              ? { ...u, status: u.status === "ativo" ? "inativo" : "ativo" }
              : u,
          ),
        }));
      },

      obterUsuario: (id) => {
        return get().usuarios.find((u) => u.id === id);
      },

      obterTodos: () => {
        return get().usuarios;
      },

      obterPorTipo: (tipo) => {
        return get().usuarios.filter((u) => u.tipo === tipo);
      },
    }),
    {
      name: "usuarios-storage",
      version: 1,
    },
  ),
);
