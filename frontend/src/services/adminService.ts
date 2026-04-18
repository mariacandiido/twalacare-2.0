import { apiRequest } from "./authService";
import { ApiResponse } from "../types";

interface ListOptions {
  page?: number;
  limit?: number;
  status?: string;
  tipo?: string;
}

export const adminService = {
  async getFarmacias(params: ListOptions = {}): Promise<ApiResponse<any>> {
    const query = new URLSearchParams();
    if (params.status) query.set("status", params.status);
    if (params.page) query.set("page", String(params.page));
    if (params.limit) query.set("limit", String(params.limit));
    return apiRequest(`/admin/farmacias?${query.toString()}`, "GET");
  },

  async approveFarmacia(id: number): Promise<ApiResponse<any>> {
    return apiRequest(`/admin/farmacias/${id}/approve`, "PATCH");
  },

  async rejectFarmacia(id: number, motivo?: string): Promise<ApiResponse<any>> {
    return apiRequest(`/admin/farmacias/${id}/reject`, "PATCH", { motivo });
  },

  async blockFarmacia(id: number): Promise<ApiResponse<any>> {
    return apiRequest(`/admin/farmacias/${id}/block`, "PATCH");
  },

  async unblockFarmacia(id: number): Promise<ApiResponse<any>> {
    return apiRequest(`/admin/farmacias/${id}/unblock`, "PATCH");
  },

  async getEntregadores(params: ListOptions = {}): Promise<ApiResponse<any>> {
    const query = new URLSearchParams();
    if (params.status) query.set("status", params.status);
    if (params.page) query.set("page", String(params.page));
    if (params.limit) query.set("limit", String(params.limit));
    return apiRequest(`/admin/entregadores?${query.toString()}`, "GET");
  },

  async approveEntregador(id: number): Promise<ApiResponse<any>> {
    return apiRequest(`/admin/entregadores/${id}/approve`, "PATCH");
  },

  async rejectEntregador(id: number): Promise<ApiResponse<any>> {
    return apiRequest(`/admin/entregadores/${id}/reject`, "PATCH");
  },

  async blockEntregador(id: number): Promise<ApiResponse<any>> {
    return apiRequest(`/admin/entregadores/${id}/block`, "PATCH");
  },

  async unblockEntregador(id: number): Promise<ApiResponse<any>> {
    return apiRequest(`/admin/entregadores/${id}/unblock`, "PATCH");
  },

  async getClientes(page = 1, limit = 50): Promise<ApiResponse<any>> {
    return apiRequest(`/admin/clientes?page=${page}&limit=${limit}`, "GET");
  },

  async getPedidos(page = 1, limit = 50): Promise<ApiResponse<any>> {
    return apiRequest(`/admin/pedidos?page=${page}&limit=${limit}`, "GET");
  },

  async getDashboardMetrics(): Promise<ApiResponse<any>> {
    return apiRequest("/admin/dashboard/metrics", "GET");
  },

  async generateReport(tipo: string): Promise<ApiResponse<any>> {
    return apiRequest(`/admin/reports?tipo=${encodeURIComponent(tipo)}`, "GET");
  },

  // Novos métodos para gerenciamento de usuários
  async getAllUsers(params: ListOptions = {}): Promise<ApiResponse<any>> {
    const query = new URLSearchParams();
    if (params.tipo) query.set("tipo", params.tipo);
    if (params.status) query.set("status", params.status);
    if (params.page) query.set("page", String(params.page));
    if (params.limit) query.set("limit", String(params.limit));
    return apiRequest(`/admin/usuarios?${query.toString()}`, "GET");
  },

  async getUserById(id: number): Promise<ApiResponse<any>> {
    return apiRequest(`/admin/usuarios/${id}`, "GET");
  },

  async blockUser(id: number, motivo?: string): Promise<ApiResponse<any>> {
    return apiRequest(`/admin/usuarios/${id}/block`, "PATCH", { motivo });
  },

  async unblockUser(id: number): Promise<ApiResponse<any>> {
    return apiRequest(`/admin/usuarios/${id}/unblock`, "PATCH");
  },

  // Métodos para gerenciamento de admins
  async listAdmins(params: ListOptions = {}): Promise<ApiResponse<any>> {
    const query = new URLSearchParams();
    if (params.page) query.set("page", String(params.page));
    if (params.limit) query.set("limit", String(params.limit));
    return apiRequest(`/admin/admins?${query.toString()}`, "GET");
  },

  async createAdmin(data: {
    nome: string;
    email: string;
    password_hash: string;
  }): Promise<ApiResponse<any>> {
    return apiRequest("/admin/admins", "POST", data);
  },

  async removeAdmin(id: number): Promise<ApiResponse<any>> {
    return apiRequest(`/admin/admins/${id}`, "DELETE");
  },

  // Métodos para logs administrativos
  async getAdminLogs(params: ListOptions = {}): Promise<ApiResponse<any>> {
    const query = new URLSearchParams();
    if (params.page) query.set("page", String(params.page));
    if (params.limit) query.set("limit", String(params.limit));
    return apiRequest(`/admin/logs?${query.toString()}`, "GET");
  },
};
