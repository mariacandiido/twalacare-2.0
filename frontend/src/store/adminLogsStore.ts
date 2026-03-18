import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface LogAdmin {
  id: string;
  data: string;
  acao: string;
  usuarioAfetado: string;
  tipoUsuario?: "cliente" | "farmacia" | "entregador";
}

export interface NotificacaoAdmin {
  id: string;
  tipo: "farmacia" | "entregador";
  titulo: string;
  idRef: string;
  nomeRef: string;
  data: string;
  lida: boolean;
}

interface AdminLogsStore {
  logs: LogAdmin[];
  notificacoes: NotificacaoAdmin[];
  addLog: (acao: string, usuarioAfetado: string, tipoUsuario?: LogAdmin["tipoUsuario"]) => void;
  addNotificacao: (tipo: "farmacia" | "entregador", idRef: string, nomeRef: string) => void;
  marcarNotificacaoLida: (id: string) => void;
  marcarTodasLidas: () => void;
  obterNaoLidas: () => NotificacaoAdmin[];
  limparNotificacoes: () => void;
}

export const useAdminLogsStore = create<AdminLogsStore>()(
  persist(
    (set, get) => ({
      logs: [],
      notificacoes: [],

      addLog: (acao, usuarioAfetado, tipoUsuario) => {
        const data = new Date().toLocaleString("pt-AO", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        });
        set((s) => ({
          logs: [
            { id: "log_" + Date.now(), data, acao, usuarioAfetado, tipoUsuario },
            ...s.logs.slice(0, 499),
          ],
        }));
      },

      addNotificacao: (tipo, idRef, nomeRef) => {
        const data = new Date().toLocaleString("pt-AO", {
          day: "2-digit",
          month: "2-digit",
          hour: "2-digit",
          minute: "2-digit",
        });
        const titulo =
          tipo === "farmacia"
            ? "Nova farmácia solicita cadastro"
            : "Novo entregador solicita cadastro";
        set((s) => ({
          notificacoes: [
            {
              id: "notif_" + Date.now(),
              tipo,
              titulo,
              idRef,
              nomeRef,
              data,
              lida: false,
            },
            ...s.notificacoes,
          ],
        }));
      },

      marcarNotificacaoLida: (id) => {
        set((s) => ({
          notificacoes: s.notificacoes.map((n) =>
            n.id === id ? { ...n, lida: true } : n
          ),
        }));
      },

      marcarTodasLidas: () => {
        set((s) => ({
          notificacoes: s.notificacoes.map((n) => ({ ...n, lida: true })),
        }));
      },

      obterNaoLidas: () => get().notificacoes.filter((n) => !n.lida),

      limparNotificacoes: () => set({ notificacoes: [] }),
    }),
    { name: "twala-admin-logs-store", version: 1 }
  )
);
