import { ApiResponse } from "../types";
import { apiRequest } from "./authService";

export interface DashboardStats {
  produtosAtivos: number;
  pedidosTotais: number;
  pedidosPendentes: number;
  entregasAndamento: number;
  receitaMensal: number;
  avaliacaoMedia: number;
}

export const farmaciaService = {
  // Obter estatísticas do dashboard
  async getDashboardStats(): Promise<ApiResponse<DashboardStats>> {
    // Como não há um endpoint de stats, vamos buscar pedidos e medicamentos e calcular
    try {
      const [medsRes, ordersRes, historyRes] = await Promise.all([
        apiRequest<any[]>("/farmacia/medicamentos", "GET"),
        apiRequest<any[]>("/farmacia/pedidos", "GET"),
        apiRequest<any[]>("/farmacia/historico-pedidos", "GET")
      ]);

      if (!medsRes.success || !ordersRes.success || !historyRes.success) {
        return { success: false, error: "Erro ao carregar dados do dashboard" };
      }

      const meds = medsRes.data || [];
      const pendingOrders = ordersRes.data || [];
      const historyOrders = historyRes.data || [];
      const allOrders = [...pendingOrders, ...historyOrders];

      // Cálculo simplificado
      const stats: DashboardStats = {
        produtosAtivos: meds.length,
        pedidosTotais: allOrders.length,
        pedidosPendentes: pendingOrders.filter((o: any) => o.status === "PENDENTE").length,
        entregasAndamento: allOrders.filter((o: any) => o.status === "EM_TRANSITO").length,
        receitaMensal: historyOrders
          .filter((o: any) => o.status === "ENTREGUE")
          .reduce((acc: number, o: any) => acc + Number(o.total || 0), 0),
        avaliacaoMedia: 4.5 // Mock por enquanto pois não temos endpoint de avaliações consolidado
      };

      return { success: true, data: stats };
    } catch (err) {
      return { success: false, error: "Falha na conexão" };
    }
  },

  // Listar entregadores disponíveis
  async getEntregadoresDisponiveis(): Promise<ApiResponse<any[]>> {
    return apiRequest("/farmacia/entregadores-disponiveis", "GET");
  },

  // Atribuir entregador a um pedido
  async atribuirEntregador(pedidoId: string, entregadorId: number): Promise<ApiResponse<any>> {
    return apiRequest(`/farmacia/pedidos/${pedidoId}/atribuir-entregador`, "POST", { entregador_id: entregadorId });
  }
};
