import { type ApiResponse } from "../types";
import { apiRequest } from "./authService";

export interface PrescriptionCreateData {
  pedido_id?: string;
  farmacia_id: string;
  ficheiro_url: string;
  nome_ficheiro: string;
}

export const prescriptionService = {
  // Enviar uma nova receita
  async create(data: PrescriptionCreateData): Promise<ApiResponse<any>> {
    return apiRequest("/receitas", "POST", data);
  },

  // Listar minhas receitas (cliente)
  async getMyPrescriptions(): Promise<ApiResponse<any>> {
    return apiRequest("/receitas/me", "GET");
  },

  // Listar receitas da farmácia
  async getFarmaciaPrescriptions(): Promise<ApiResponse<any>> {
    return apiRequest("/receitas/farmacia", "GET");
  },

  // Atualizar estado (farmácia)
  async updateStatus(id: string, estado: string, observacoes?: string): Promise<ApiResponse<any>> {
    return apiRequest(`/receitas/${id}/estado`, "PATCH", { estado, observacoes });
  },
};
