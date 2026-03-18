import { create } from "zustand";
import { persist } from "zustand/middleware";
import { useAdminLogsStore } from "./adminLogsStore";

export interface FarmaciaLoja {
  id: string;
  nome: string;
  email: string;
  telefone: string;
  provincia: string;
  municipio: string;
  bairro: string;
  rua: string;
  numEdificio: string;
  nif: string;
  licencaFuncionamento: string;
  horarioAbertura: string;
  horarioFechamento: string;
  farmaceuticoNome: string;
  farmaceuticoCedula: string;
  farmaceuticoTel: string;
  // Campos para exibição pública
  rating: number;
  deliveryTime: string;
  image: string;
  products: number;
  isOpen: boolean;
  // Controlo de aprovação
  aprovada: boolean;
  dataRegisto: string;
  dataAprovacao?: string;
  rejeitada?: boolean;
  motivoRejeicao?: string;
}

interface FarmaciasStore {
  farmacias: FarmaciaLoja[];
  adicionarFarmacia: (f: Omit<FarmaciaLoja, "id" | "dataRegisto" | "aprovada" | "rating" | "deliveryTime" | "image" | "products" | "isOpen"> & { documentosCadastro?: { label: string; preview: string | null; fileName?: string }[] }) => void;
  aprovarFarmacia: (id: string) => void;
  rejeitarFarmacia: (id: string, motivo: string) => void;
  obterAprovadas: () => FarmaciaLoja[];
  obterPendentes: () => FarmaciaLoja[];
  obterTodas: () => FarmaciaLoja[];
}

// Farmácias iniciais já aprovadas (dados históricos da plataforma)
const farmaciasIniciais: FarmaciaLoja[] = [
  {
    id: "fi-1",
    nome: "Farmácia Central",
    email: "central@pharmacy.com",
    telefone: "+244 900 000 001",
    provincia: "Luanda",
    municipio: "Maianga",
    bairro: "Maianga",
    rua: "Av. dos Combatentes",
    numEdificio: "1",
    nif: "5400000001LA040",
    licencaFuncionamento: "LF-0001-2020",
    horarioAbertura: "08:00",
    horarioFechamento: "20:00",
    farmaceuticoNome: "Dr. António Neto",
    farmaceuticoCedula: "ORF-000001",
    farmaceuticoTel: "+244 911 000 001",
    rating: 4.8,
    deliveryTime: "20-30 min",
    image: "https://images.unsplash.com/photo-1765031092161-a9ebe556117e?w=400",
    products: 1250,
    isOpen: true,
    aprovada: true,
    dataRegisto: "2025-01-10",
    dataAprovacao: "2025-01-12",
  },
  {
    id: "fi-2",
    nome: "Farmácia Saúde Plus",
    email: "saudeplus@pharmacy.com",
    telefone: "+244 900 000 002",
    provincia: "Luanda",
    municipio: "Talatona",
    bairro: "Talatona",
    rua: "Av. Pedro de Castro Van-Dúnem",
    numEdificio: "45",
    nif: "5400000002LA040",
    licencaFuncionamento: "LF-0002-2020",
    horarioAbertura: "07:00",
    horarioFechamento: "22:00",
    farmaceuticoNome: "Dra. Sofia Lopes",
    farmaceuticoCedula: "ORF-000002",
    farmaceuticoTel: "+244 911 000 002",
    rating: 4.9,
    deliveryTime: "15-25 min",
    image: "https://images.unsplash.com/photo-1765031092161-a9ebe556117e?w=400",
    products: 980,
    isOpen: true,
    aprovada: true,
    dataRegisto: "2025-01-08",
    dataAprovacao: "2025-01-10",
  },
  {
    id: "fi-3",
    nome: "Farmácia Vida",
    email: "vida@pharmacy.com",
    telefone: "+244 900 000 003",
    provincia: "Benguela",
    municipio: "Centro",
    bairro: "Centro",
    rua: "Rua dos Mártires",
    numEdificio: "12",
    nif: "5400000003BG040",
    licencaFuncionamento: "LF-0003-2020",
    horarioAbertura: "08:00",
    horarioFechamento: "18:00",
    farmaceuticoNome: "Dr. Manuel Silva",
    farmaceuticoCedula: "ORF-000003",
    farmaceuticoTel: "+244 911 000 003",
    rating: 4.7,
    deliveryTime: "25-35 min",
    image: "https://images.unsplash.com/photo-1765031092161-a9ebe556117e?w=400",
    products: 1100,
    isOpen: false,
    aprovada: true,
    dataRegisto: "2025-01-05",
    dataAprovacao: "2025-01-07",
  },
  {
    id: "fi-4",
    nome: "Farmácia Bem-Estar",
    email: "bemestar@pharmacy.com",
    telefone: "+244 900 000 004",
    provincia: "Luanda",
    municipio: "Viana",
    bairro: "Viana",
    rua: "Estrada de Viana",
    numEdificio: "78",
    nif: "5400000004LA040",
    licencaFuncionamento: "LF-0004-2020",
    horarioAbertura: "08:00",
    horarioFechamento: "20:00",
    farmaceuticoNome: "Dra. Ana Costa",
    farmaceuticoCedula: "ORF-000004",
    farmaceuticoTel: "+244 911 000 004",
    rating: 4.6,
    deliveryTime: "30-40 min",
    image: "https://images.unsplash.com/photo-1765031092161-a9ebe556117e?w=400",
    products: 850,
    isOpen: true,
    aprovada: true,
    dataRegisto: "2025-01-03",
    dataAprovacao: "2025-01-05",
  },
  {
    id: "fi-5",
    nome: "Farmácia Nova Esperança",
    email: "novaesperanca@pharmacy.com",
    telefone: "+244 900 000 005",
    provincia: "Huíla",
    municipio: "Lubango",
    bairro: "Centro",
    rua: "Rua Comandante Bula",
    numEdificio: "33",
    nif: "5400000005HU040",
    licencaFuncionamento: "LF-0005-2020",
    horarioAbertura: "08:00",
    horarioFechamento: "19:00",
    farmaceuticoNome: "Dr. João Baptista",
    farmaceuticoCedula: "ORF-000005",
    farmaceuticoTel: "+244 911 000 005",
    rating: 4.8,
    deliveryTime: "20-30 min",
    image: "https://images.unsplash.com/photo-1765031092161-a9ebe556117e?w=400",
    products: 920,
    isOpen: true,
    aprovada: true,
    dataRegisto: "2024-12-20",
    dataAprovacao: "2024-12-22",
  },
  {
    id: "fi-6",
    nome: "Farmácia São Pedro",
    email: "saopedro@pharmacy.com",
    telefone: "+244 900 000 006",
    provincia: "Huambo",
    municipio: "Centro",
    bairro: "Centro",
    rua: "Av. Norton de Matos",
    numEdificio: "5",
    nif: "5400000006HB040",
    licencaFuncionamento: "LF-0006-2020",
    horarioAbertura: "08:00",
    horarioFechamento: "18:00",
    farmaceuticoNome: "Dra. Paula Ferreira",
    farmaceuticoCedula: "ORF-000006",
    farmaceuticoTel: "+244 911 000 006",
    rating: 4.5,
    deliveryTime: "25-35 min",
    image: "https://images.unsplash.com/photo-1765031092161-a9ebe556117e?w=400",
    products: 780,
    isOpen: true,
    aprovada: true,
    dataRegisto: "2024-12-15",
    dataAprovacao: "2024-12-17",
  },
];

export const useFarmaciasStore = create<FarmaciasStore>()(
  persist(
    (set, get) => ({
      farmacias: farmaciasIniciais,

      adicionarFarmacia: (dados) => {
        const { documentosCadastro, ...resto } = dados;
        const nova: FarmaciaLoja = {
          ...resto,
          documentosCadastro: documentosCadastro ?? [],
          id: "farm_" + Date.now(),
          dataRegisto: new Date().toISOString().split("T")[0],
          aprovada: false,
          rating: 0,
          deliveryTime: "A definir",
          image: "https://images.unsplash.com/photo-1765031092161-a9ebe556117e?w=400",
          products: 0,
          isOpen: false,
        };
        set((s) => ({ farmacias: [...s.farmacias, nova] }));
        useAdminLogsStore.getState().addNotificacao("farmacia", nova.id, nova.nome);
      },

      aprovarFarmacia: (id) => {
        set((s) => ({
          farmacias: s.farmacias.map((f) =>
            f.id === id
              ? { ...f, aprovada: true, rejeitada: false, motivoRejeicao: undefined, dataAprovacao: new Date().toISOString().split("T")[0], isOpen: true }
              : f,
          ),
        }));
      },

      rejeitarFarmacia: (id, motivo) => {
        set((s) => ({
          farmacias: s.farmacias.map((f) =>
            f.id === id ? { ...f, aprovada: false, rejeitada: true, motivoRejeicao: motivo } : f,
          ),
        }));
      },

      obterAprovadas: () => get().farmacias.filter((f) => f.aprovada && !f.rejeitada),
      obterPendentes: () => get().farmacias.filter((f) => !f.aprovada && !f.rejeitada),
      obterTodas: () => get().farmacias,
    }),
    { name: "twala-farmacias-store", version: 1 },
  ),
);
