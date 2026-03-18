import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { OrderStatus } from "../types";

// ── Produto ────────────────────────────────────────────────────────────────────
export interface AdminProduto {
  id: string;
  nome: string;
  categoria: string;
  descricao: string;
  preco: number;
  farmacia: string;
  provincia: string;
  stock: number;
  requerReceita: boolean;
  horario: string;
  rating: number;
  image: string;
  ativo: boolean;
}

// ── Pedido ─────────────────────────────────────────────────────────────────────
export interface AdminPedido {
  id: string;
  clienteId: string;
  clienteNome: string;
  farmacia: string;
  itens: string;       // descrição curta dos itens
  total: number;
  status: OrderStatus;
  metodoPagamento: string;
  enderecoEntrega: string;
  dataPedido: string;
  dataEntrega?: string;
}

interface AdminStore {
  produtos: AdminProduto[];
  pedidos: AdminPedido[];
  adicionarPedido: (pedido: Omit<AdminPedido, "id" | "dataPedido">) => void;
  editarProduto: (id: string, dados: Partial<AdminProduto>) => void;
  removerProduto: (id: string) => void;
  toggleAtivoProduto: (id: string) => void;
  atualizarStatusPedido: (id: string, status: OrderStatus) => void;
}

const produtosIniciais: AdminProduto[] = [
  { id: "p1", nome: "Paracetamol 500mg",   categoria: "Analgésicos",   descricao: "Analgésico e antitérmico de ação rápida",   preco: 1500, farmacia: "Farmácia Central",     provincia: "Luanda",   stock: 150, requerReceita: false, horario: "08:00 - 20:00", rating: 4.8, image: "https://images.unsplash.com/photo-1646392206581-2527b1cae5cb?w=400", ativo: true },
  { id: "p2", nome: "Ibuprofeno 400mg",    categoria: "Analgésicos",   descricao: "Anti-inflamatório não esteroide",             preco: 2000, farmacia: "Farmácia Saúde Plus",  provincia: "Luanda",   stock: 200, requerReceita: false, horario: "07:00 - 22:00", rating: 4.6, image: "https://images.unsplash.com/photo-1646392206581-2527b1cae5cb?w=400", ativo: true },
  { id: "p3", nome: "Amoxicilina 500mg",   categoria: "Antibióticos",  descricao: "Antibiótico de amplo espectro",               preco: 3500, farmacia: "Farmácia Vida",         provincia: "Benguela", stock: 80,  requerReceita: true,  horario: "08:00 - 18:00", rating: 4.9, image: "https://images.unsplash.com/photo-1646392206581-2527b1cae5cb?w=400", ativo: true },
  { id: "p4", nome: "Vitamina C 1000mg",   categoria: "Vitaminas",     descricao: "Suplemento vitamínico imunidade",             preco: 2500, farmacia: "Farmácia Bem-Estar",   provincia: "Luanda",   stock: 300, requerReceita: false, horario: "08:00 - 20:00", rating: 4.7, image: "https://images.unsplash.com/photo-1646392206581-2527b1cae5cb?w=400", ativo: true },
  { id: "p5", nome: "Loratadina 10mg",     categoria: "Antialérgicos", descricao: "Anti-histamínico para alergias",              preco: 1800, farmacia: "Farmácia Central",     provincia: "Luanda",   stock: 120, requerReceita: false, horario: "08:00 - 20:00", rating: 4.5, image: "https://images.unsplash.com/photo-1646392206581-2527b1cae5cb?w=400", ativo: true },
  { id: "p6", nome: "Omeprazol 20mg",      categoria: "Digestivos",    descricao: "Protetor gástrico para refluxo",              preco: 2200, farmacia: "Farmácia Saúde Plus",  provincia: "Huíla",    stock: 150, requerReceita: true,  horario: "07:00 - 22:00", rating: 4.8, image: "https://images.unsplash.com/photo-1646392206581-2527b1cae5cb?w=400", ativo: true },
  { id: "p7", nome: "Metformina 500mg",    categoria: "Antidiabéticos",descricao: "Controlo glicémico na diabetes tipo 2",       preco: 2800, farmacia: "Farmácia Nova Esperança", provincia: "Huíla", stock: 90, requerReceita: true,  horario: "08:00 - 19:00", rating: 4.7, image: "https://images.unsplash.com/photo-1646392206581-2527b1cae5cb?w=400", ativo: true },
  { id: "p8", nome: "Ácido Fólico 5mg",   categoria: "Vitaminas",     descricao: "Suplemento essencial na gravidez",            preco: 1200, farmacia: "Farmácia São Pedro",   provincia: "Huambo",  stock: 200, requerReceita: false, horario: "08:00 - 18:00", rating: 4.6, image: "https://images.unsplash.com/photo-1646392206581-2527b1cae5cb?w=400", ativo: true },
];

const pedidosIniciais: AdminPedido[] = [
  { id: "#TC12345", clienteId: "1", clienteNome: "Maria Cliente",    farmacia: "Farmácia Central",     itens: "Paracetamol 500mg × 2, Vitamina C × 1", total: 6000,  status: "em-transito",    metodoPagamento: "Multicaixa Express", enderecoEntrega: "Luanda, Talatona, Rua Principal 123", dataPedido: "2026-03-08" },
  { id: "#TC12344", clienteId: "1", clienteNome: "Maria Cliente",    farmacia: "Farmácia Saúde Plus",  itens: "Ibuprofeno 400mg × 1, Loratadina × 1",  total: 4200,  status: "entregue",       metodoPagamento: "Unitel Money",        enderecoEntrega: "Luanda, Talatona, Rua Principal 123", dataPedido: "2026-03-05", dataEntrega: "2026-03-05" },
  { id: "#TC12343", clienteId: "2", clienteNome: "João Baptista",    farmacia: "Farmácia Vida",        itens: "Amoxicilina 500mg × 1",                  total: 3500,  status: "pendente",       metodoPagamento: "Transferência",       enderecoEntrega: "Benguela, Centro, Av. República 45",  dataPedido: "2026-03-10" },
  { id: "#TC12342", clienteId: "3", clienteNome: "Ana Costa",        farmacia: "Farmácia Bem-Estar",   itens: "Vitamina C × 2, Omeprazol × 1",          total: 7200,  status: "confirmado",     metodoPagamento: "Dinheiro",            enderecoEntrega: "Luanda, Viana, Rua das Flores 12",    dataPedido: "2026-03-09" },
  { id: "#TC12341", clienteId: "4", clienteNome: "Pedro Mendes",     farmacia: "Farmácia Central",     itens: "Paracetamol 500mg × 3",                  total: 4500,  status: "em-preparacao",  metodoPagamento: "Multicaixa Express",  enderecoEntrega: "Luanda, Maianga, Rua do Sol 7",       dataPedido: "2026-03-10" },
  { id: "#TC12340", clienteId: "5", clienteNome: "Sofia Lopes",      farmacia: "Farmácia Nova Esperança", itens: "Metformina 500mg × 2",              total: 5600,  status: "cancelado",      metodoPagamento: "Unitel Money",        enderecoEntrega: "Huíla, Lubango, Rua Bula 33",         dataPedido: "2026-03-07" },
  { id: "#TC12339", clienteId: "1", clienteNome: "Maria Cliente",    farmacia: "Farmácia São Pedro",   itens: "Ácido Fólico 5mg × 3",                  total: 3600,  status: "entregue",       metodoPagamento: "Multicaixa Express",  enderecoEntrega: "Luanda, Talatona, Rua Principal 123", dataPedido: "2026-03-01", dataEntrega: "2026-03-02" },
  { id: "#TC12338", clienteId: "6", clienteNome: "Carlos Fernandes", farmacia: "Farmácia Bem-Estar",   itens: "Ibuprofeno 400mg × 2, Loratadina × 1",  total: 5600,  status: "pronto",         metodoPagamento: "Transferência",       enderecoEntrega: "Luanda, Viana, Av. Deolinda 88",      dataPedido: "2026-03-10" },
];

export const useAdminStore = create<AdminStore>()(
  persist(
    (set) => ({
      produtos: produtosIniciais,
      pedidos: pedidosIniciais,

      adicionarPedido: (pedido) =>
        set((s) => ({
          pedidos: [
            ...s.pedidos,
            {
              ...pedido,
              id: `#TC${Date.now()}`,
              dataPedido: new Date().toISOString().split("T")[0],
            },
          ],
        })),

      editarProduto: (id, dados) =>
        set((s) => ({ produtos: s.produtos.map((p) => p.id === id ? { ...p, ...dados } : p) })),

      removerProduto: (id) =>
        set((s) => ({ produtos: s.produtos.filter((p) => p.id !== id) })),

      toggleAtivoProduto: (id) =>
        set((s) => ({ produtos: s.produtos.map((p) => p.id === id ? { ...p, ativo: !p.ativo } : p) })),

      atualizarStatusPedido: (id, status) =>
        set((s) => ({
          pedidos: s.pedidos.map((p) =>
            p.id === id
              ? { ...p, status, ...(status === "entregue" ? { dataEntrega: new Date().toISOString().split("T")[0] } : {}) }
              : p,
          ),
        })),
    }),
    { name: "twala-admin-store", version: 1 },
  ),
);
