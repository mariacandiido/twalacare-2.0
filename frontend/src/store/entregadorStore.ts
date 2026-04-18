import { create } from 'zustand';
import { apiRequest, getCurrentUser } from '../services/authService';

export interface Entrega {
  id: string;
  pedidoId: string;
  farmacia: string;
  farmaciaEndereco: string;
  cliente: string;
  clienteEndereco: string;
  clienteTelefone: string;
  status: string;
  valor: number;
  data: string;
  aceitoEm?: string;
  distancia?: string;
  tempoEstimado?: string;
  itens?: string[];
  clienteCoords?: { lat: number; lng: number };
  farmaciaCoords?: { lat: number; lng: number };
}

export interface EntregadorPerfil {
  nome: string;
  email: string;
  telefone: string;
  veiculo: string;
  placaVeiculo: string;
  provincia: string;
  municipio: string;
  totalEntregas: number;
  avaliacao: number;
  ganhosMes: number;
}

interface EntregadorState {
  disponivel: boolean;
  entregasDisponiveis: Entrega[];
  entregasAtivas: Entrega[];
  historico: Entrega[];
  perfil: EntregadorPerfil;
  isLoading: boolean;
  error: string | null;

  // Ações
  toggleDisponivel: () => Promise<void>;
  fetchEntregas: () => Promise<void>;
  aceitarEntrega: (id: string) => Promise<boolean>;
  atualizarStatus: (id: string, novoStatus: string) => Promise<boolean>;
  atualizarPerfil: (dados: Partial<EntregadorPerfil>) => Promise<boolean>;
}

export const useEntregadorStore = create<EntregadorState>((set, get) => ({
  disponivel: true,
  entregasDisponiveis: [],
  entregasAtivas: [],
  historico: [],
  perfil: {
    nome: '',
    email: '',
    telefone: '',
    veiculo: 'moto',
    placaVeiculo: '',
    provincia: 'Luanda',
    municipio: 'Viana',
    totalEntregas: 0,
    avaliacao: 5.0,
    ganhosMes: 0
  },
  isLoading: false,
  error: null,

  toggleDisponivel: async () => {
    const novoEstado = !get().disponivel;
    const res = await apiRequest("/entregador/disponibilidade", "PUT", { isAvailable: novoEstado });
    if (res.success) {
      set({ disponivel: novoEstado });
    }
  },

  fetchEntregas: async () => {
    set({ isLoading: true, error: null });
    try {
      const [disponiveisRes, atribuidosRes, historicoRes] = await Promise.all([
        apiRequest<any[]>("/entrega/disponiveis", "GET"),
        apiRequest<any[]>("/entregador/pedidos-atribuidos", "GET"),
        apiRequest<any[]>("/entregador/historico", "GET")
      ]);

      const currentUser = getCurrentUser();

      const mapEntrega = (e: any): Entrega => ({
        id: e.id.toString(),
        pedidoId: e.pedido_id?.toString() || "N/A",
        status: e.status?.toLowerCase() || "pendente",
        valor: Number(e.valor_entrega || 0),
        data: e.createdAt || new Date().toISOString(),
        farmacia: e.Pedido?.PedidoItems?.[0]?.Farmacia?.nome || "Farmácia Twala",
        farmaciaEndereco: e.Pedido?.PedidoItems?.[0]?.Farmacia?.endereco || "Endereço Farmácia",
        cliente: e.Pedido?.Cliente?.nome || "Cliente",
        clienteEndereco: e.Pedido?.Endereco ? `${e.Pedido.Endereco.municipio}, ${e.Pedido.Endereco.bairro}` : "Endereço Cliente",
        clienteTelefone: e.Pedido?.Cliente?.telefone || "N/A",
        aceitoEm: e.updatedAt ? new Date(e.updatedAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : undefined,
        distancia: "5.2 km", // Mockado pois backend não retorna GPS
        tempoEstimado: "15 min",
        itens: e.Pedido?.PedidoItems?.map((i: any) => i.nome) || []
      });

      if (disponiveisRes.success && atribuidosRes.success && historicoRes.success) {
        set({
          entregasDisponiveis: (disponiveisRes.data || []).map(mapEntrega),
          entregasAtivas: (atribuidosRes.data || []).map(mapEntrega),
          historico: (historicoRes.data || []).map(mapEntrega)
        });
      }

      if (currentUser) {
        set({
          disponivel: currentUser.status === 'ATIVO',
          perfil: {
            ...get().perfil,
            nome: currentUser.nome,
            email: currentUser.email,
            telefone: currentUser.telefone || '',
            veiculo: currentUser.veiculo || 'moto',
            placaVeiculo: currentUser.placa_veiculo || '',
            totalEntregas: (historicoRes.data || []).length,
            ganhosMes: (historicoRes.data || []).reduce((acc: number, cur: any) => acc + Number(cur.valor_entrega || 0), 0)
          }
        });
      }
    } catch (err) {
      set({ error: "Erro ao carregar dados do estafeta" });
    } finally {
      set({ isLoading: false });
    }
  },

  aceitarEntrega: async (id: string) => {
    const res = await apiRequest(`/entrega/${id}/aceitar`, "POST");
    if (res.success) {
      await get().fetchEntregas();
      return true;
    }
    return false;
  },

  atualizarStatus: async (id: string, novoStatus: string) => {
    // A API tem dois jeitos: /entrega/:id/status (PATCH) ou /entregador/pedidos/:id/status (PUT)
    // Vamos usar o do entregaRoutes que parece mais geral
    let endpoint = `/entrega/${id}/status`;
    let method = "PATCH";
    
    // Mapeamento de status para backend se necessário
    if (novoStatus === 'entregue') {
      endpoint = `/entregador/pedidos/${id}/concluir`;
      method = "PUT";
    } else if (novoStatus === 'em_transito') {
      endpoint = `/entregador/pedidos/${id}/iniciar`;
      method = "PUT";
    }

    const res = await apiRequest(endpoint, method, { status: novoStatus, statusMessage: `Status alterado para ${novoStatus}` });
    if (res.success) {
      await get().fetchEntregas();
      return true;
    }
    return false;
  },

  atualizarPerfil: async (dados: Partial<EntregadorPerfil>) => {
    const res = await apiRequest("/entregador/perfil", "PUT", {
      nome: dados.nome,
      telefone: dados.telefone,
      veiculo: dados.veiculo,
      placa_veiculo: dados.placaVeiculo
    });
    if (res.success) {
      set({ perfil: { ...get().perfil, ...dados } });
      return true;
    }
    return false;
  }
}));
