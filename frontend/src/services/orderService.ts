import { type ApiResponse } from "../types";
import { apiRequest } from "./authService";

export interface OrderCreateData {
  items: {
    medicamento_id: string;
    farmacia_id: string;
    nome: string;
    preco_unitario: number;
    quantidade: number;
    requires_prescription: boolean;
  }[];
  subtotal: number;
  taxa_entrega: number;
  total: number;
  metodo_pagamento: string;
  endereco_entrega: string;
}

export const orderService = {
  // Criar um novo pedido
  async create(data: OrderCreateData): Promise<ApiResponse<any>> {
    return apiRequest("/pedidos", "POST", data);
  },

  // Obter meus pedidos (cliente)
  async getMyOrders(): Promise<ApiResponse<any>> {
    return apiRequest("/pedidos/me", "GET");
  },

  // Obter detalhes de um pedido
  async getById(id: string): Promise<ApiResponse<any>> {
    return apiRequest(`/pedidos/${id}`, "GET");
  },

  // Cancelar pedido
  async cancel(id: string): Promise<ApiResponse<any>> {
    return apiRequest(`/pedidos/${id}/status`, "PATCH", { status: "cancelado" });
  },

  // Listar pedidos da farmácia
  async getFarmaciaPedidos(): Promise<ApiResponse<any[]>> {
    return apiRequest("/pedidos/farmacia", "GET");
  },

  // Atualizar status do pedido (farmácia/entregador)
  async updateStatus(id: string, status: string): Promise<ApiResponse<any>> {
    return apiRequest(`/pedidos/${id}/status`, "PATCH", { status });
  },
};
