/**
 * pedidoService.ts - Integração real com a API de Pedidos, Entregas e Notificações.
 * Substitui completamente os dados mock anteriores.
 */
import { type ApiResponse, type Pedido, type OrderStatus } from "../types";
import { apiRequest, getAuthHeader, API_BASE } from "./authService";

export const pedidoService = {
  // --- Cliente: Pedidos ---

  // Criar pedido (checkout)
  async create(data: {
    endereco_id: number;
    itens: { medicamento_id: number; quantidade: number }[];
    metodo_pagamento: string;
  }): Promise<ApiResponse<Pedido>> {
    return apiRequest("/cliente/pedidos", "POST", data);
  },

  // Listar histórico de pedidos do cliente
  async getAll(): Promise<ApiResponse<Pedido[]>> {
    return apiRequest("/cliente/pedidos/historico", "GET");
  },

  // Acompanhar status de um pedido específico
  async getById(id: string): Promise<ApiResponse<Pedido>> {
    return apiRequest(`/cliente/pedidos/${id}/status`, "GET");
  },

  // Enviar receita médica para um pedido
  async uploadReceita(pedidoId: string, file: File): Promise<ApiResponse<any>> {
    const form = new FormData();
    form.append("receita_arquivo", file);
    try {
      const response = await fetch(`${API_BASE}/cliente/pedidos/${pedidoId}/receita`, {
        method: "POST",
        headers: getAuthHeader(),
        body: form,
      });
      const json = await response.json();
      return response.ok ? { success: true, data: json.data } : { success: false, error: json.message };
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  },

  // Avaliar farmácia/medicamento de um pedido concluído
  async avaliar(data: {
    pedido_id?: number;
    farmacia_id?: number;
    medicamento_id?: number;
    rating: number;
    comentario?: string;
  }): Promise<ApiResponse<any>> {
    return apiRequest("/cliente/avaliacoes", "POST", data);
  },

  // --- Cliente: Endereços ---

  async getEnderecos(): Promise<ApiResponse<any[]>> {
    return apiRequest("/cliente/enderecos", "GET");
  },

  async createEndereco(data: {
    provincia: string;
    municipio: string;
    bairro?: string;
    rua?: string;
    referencia?: string;
    is_padrao?: boolean;
  }): Promise<ApiResponse<any>> {
    return apiRequest("/cliente/enderecos", "POST", data);
  },

  // --- Farmácia: Gestão de Pedidos ---

  // Fila de pedidos pendentes
  async getFarmaciaPedidos(): Promise<ApiResponse<Pedido[]>> {
    return apiRequest("/farmacia/pedidos", "GET");
  },

  // Detalhes de um pedido específico  
  async getByCliente(clienteId: string): Promise<ApiResponse<Pedido[]>> {
    // Equivalente ao histórico do cliente
    return apiRequest("/cliente/pedidos/historico", "GET");
  },

  // Atualizar status do pedido (aceitar/rejeitar/preparar)
  async updateStatus(id: string, status: OrderStatus, observacao?: string): Promise<ApiResponse<Pedido>> {
    // Mapeia o status para o enum do backend
    const statusMap: Record<string, string> = {
      "confirmado": "CONFIRMADO",
      "em-preparacao": "EM_PREPARACAO",
      "pronto": "PRONTO",
      "em-transito": "EM_TRANSITO",
      "entregue": "ENTREGUE",
      "cancelado": "CANCELADO",
    };
    return apiRequest(`/farmacia/pedidos/${id}/status`, "PUT", {
      status: statusMap[status] ?? status.toUpperCase(),
      observacao,
    });
  },

  // Cancelar pedido
  async cancel(id: string): Promise<ApiResponse<Pedido>> {
    return this.updateStatus(id, "cancelado" as OrderStatus);
  },

  // Atribuir entregador a um pedido
  async assignDelivery(pedidoId: string, entregadorId: string): Promise<ApiResponse<any>> {
    return apiRequest(`/farmacia/pedidos/${pedidoId}/atribuir-entregador`, "POST", {
      entregador_id: Number(entregadorId),
    });
  },

  // Histórico de pedidos da farmácia
  async getHistoricoFarmacia(): Promise<ApiResponse<Pedido[]>> {
    return apiRequest("/farmacia/historico-pedidos", "GET");
  },

  // Verificar receita médica
  async verificarReceita(receitaId: string, valid: boolean): Promise<ApiResponse<any>> {
    return apiRequest(`/farmacia/receitas/${receitaId}/verificar`, "POST", { valid });
  },

  // Lista de entregadores disponíveis (para a farmácia)
  async getEntregadoresDisponiveis(): Promise<ApiResponse<any[]>> {
    return apiRequest("/farmacia/entregadores-disponiveis", "GET");
  },

  // --- Entregador ---

  async getEntregasAtribuidas(): Promise<ApiResponse<any[]>> {
    return apiRequest("/entregador/pedidos-atribuidos", "GET");
  },

  async iniciarEntrega(pedidoId: string): Promise<ApiResponse<any>> {
    return apiRequest(`/entregador/pedidos/${pedidoId}/iniciar`, "PUT");
  },

  async concluirEntrega(pedidoId: string): Promise<ApiResponse<any>> {
    return apiRequest(`/entregador/pedidos/${pedidoId}/concluir`, "PUT");
  },

  async getHistoricoEntregas(): Promise<ApiResponse<any[]>> {
    return apiRequest("/entregador/historico", "GET");
  },

  async updateDisponibilidade(isAvailable: boolean): Promise<ApiResponse<any>> {
    return apiRequest("/entregador/disponibilidade", "PUT", { isAvailable });
  },

  // --- Notificações ---

  async getNotificacoes(): Promise<ApiResponse<any[]>> {
    return apiRequest("/notificacoes", "GET");
  },

  async marcarNotificacaoLida(id: string): Promise<ApiResponse<any>> {
    return apiRequest(`/notificacoes/${id}/lida`, "PUT");
  },
};
