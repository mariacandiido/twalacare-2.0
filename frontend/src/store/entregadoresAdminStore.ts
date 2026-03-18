import { create } from "zustand";
import { persist } from "zustand/middleware";
import { useAdminLogsStore } from "./adminLogsStore";

export type StatusAprovacao = "PENDENTE" | "APROVADO" | "REJEITADO";

export interface DocumentoEntregador {
  label: string;
  preview?: string | null;  // data URL para o admin ver a imagem
  fileName?: string;
}

export interface EntregadorCadastro {
  id: string;
  nome: string;
  email: string;
  telefone: string;
  tipoVeiculo: string;
  documentos: DocumentoEntregador[];
  dataRegisto: string;
  status: StatusAprovacao;
  dataAprovacao?: string;
  motivoRejeicao?: string;
  // Dados completos do formulário (para o admin ver)
  numeroBi?: string;
  dataNasc?: string;
  endereco?: string;
  provincia?: string;
  municipio?: string;
  bairro?: string;
  marcaMoto?: string;
  modeloMoto?: string;
  corMoto?: string;
  anoMoto?: string;
  matricula?: string;
}

interface EntregadoresAdminStore {
  entregadores: EntregadorCadastro[];
  adicionarEntregador: (d: Omit<EntregadorCadastro, "id" | "dataRegisto" | "status">) => void;
  aprovarEntregador: (id: string) => void;
  rejeitarEntregador: (id: string, motivo: string) => void;
  obterPendentes: () => EntregadorCadastro[];
  obterAprovados: () => EntregadorCadastro[];
  obterRejeitados: () => EntregadorCadastro[];
  obterTodas: () => EntregadorCadastro[];
}

const mockPendentes: EntregadorCadastro[] = [
  {
    id: "ent-p1",
    nome: "Rui Fonseca",
    email: "rui@entrega.com",
    telefone: "+244 922 345 678",
    tipoVeiculo: "Bicicleta",
    documentos: [
      { label: "BI" },
      { label: "Carta de Condução" },
      { label: "Livrete" },
      { label: "Fotografia" },
    ],
    dataRegisto: "2025-03-08",
    status: "PENDENTE",
  },
  {
    id: "ent-p2",
    nome: "André Tavares",
    email: "andre.t@mail.com",
    telefone: "+244 933 111 222",
    tipoVeiculo: "Moto",
    documentos: [
      { label: "BI" },
      { label: "Carta de Condução" },
      { label: "Livrete" },
      { label: "Fotografia" },
    ],
    dataRegisto: "2025-03-10",
    status: "PENDENTE",
  },
];

const mockAprovados: EntregadorCadastro[] = [
  {
    id: "ent-a1",
    nome: "Carlos Entregador",
    email: "entregador@gmail.com",
    telefone: "+244 900 000 003",
    tipoVeiculo: "Moto",
    documentos: [],
    dataRegisto: "2024-01-01",
    status: "APROVADO",
    dataAprovacao: "2024-01-02",
  },
  {
    id: "ent-a2",
    nome: "Miguel Santos",
    email: "miguel@entrega.com",
    telefone: "+244 911 234 567",
    tipoVeiculo: "Carro",
    documentos: [],
    dataRegisto: "2025-01-15",
    status: "APROVADO",
    dataAprovacao: "2025-01-16",
  },
];

export const useEntregadoresAdminStore = create<EntregadoresAdminStore>()(
  persist(
    (set, get) => ({
      entregadores: [...mockPendentes, ...mockAprovados],

      adicionarEntregador: (dados) => {
        const novo: EntregadorCadastro = {
          ...dados,
          id: "ent_" + Date.now(),
          dataRegisto: new Date().toISOString().split("T")[0],
          status: "PENDENTE",
        };
        set((s) => ({ entregadores: [novo, ...s.entregadores] }));
        useAdminLogsStore.getState().addNotificacao("entregador", novo.id, novo.nome);
      },

      aprovarEntregador: (id) => {
        set((s) => ({
          entregadores: s.entregadores.map((e) =>
            e.id === id
              ? {
                  ...e,
                  status: "APROVADO" as const,
                  dataAprovacao: new Date().toISOString().split("T")[0],
                  motivoRejeicao: undefined,
                }
              : e
          ),
        }));
      },

      rejeitarEntregador: (id, motivo) => {
        set((s) => ({
          entregadores: s.entregadores.map((e) =>
            e.id === id
              ? { ...e, status: "REJEITADO" as const, motivoRejeicao: motivo }
              : e
          ),
        }));
      },

      obterPendentes: () =>
        get().entregadores.filter((e) => e.status === "PENDENTE"),
      obterAprovados: () =>
        get().entregadores.filter((e) => e.status === "APROVADO"),
      obterRejeitados: () =>
        get().entregadores.filter((e) => e.status === "REJEITADO"),
      obterTodas: () => get().entregadores,
    }),
    { name: "twala-entregadores-admin-store", version: 1 }
  )
);
