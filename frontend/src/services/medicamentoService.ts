/**
 * medicamentoService.ts - Integração real com a API de Medicamentos e Farmácias.
 * Substitui completamente os dados mock anteriores.
 */
import { type Medicamento, type ApiResponse } from "../types";
import { apiRequest, getAuthHeader, API_BASE } from "./authService";

export const medicamentoService = {
  // Obter todos os medicamentos disponíveis (público)
  async getAll(): Promise<ApiResponse<Medicamento[]>> {
    return apiRequest("/public/medicamentos", "GET");
  },

  // Pesquisar medicamentos por nome
  async search(query: string): Promise<ApiResponse<Medicamento[]>> {
    return apiRequest(`/public/medicamentos?q=${encodeURIComponent(query)}`, "GET");
  },

  // Obter medicamento por ID
  async getById(id: string): Promise<ApiResponse<Medicamento>> {
    return apiRequest(`/public/medicamentos/${id}`, "GET");
  },

  // Obter medicamentos por categoria (filtro no cliente)
  async getByCategory(categoria: string): Promise<ApiResponse<Medicamento[]>> {
    return apiRequest(`/public/medicamentos?categoria=${encodeURIComponent(categoria)}`, "GET");
  },

  // Obter medicamentos de uma farmácia específica
  async getByFarmacia(farmaciaId: string): Promise<ApiResponse<Medicamento[]>> {
    return apiRequest(`/public/medicamentos?farmaciaId=${farmaciaId}`, "GET");
  },

  // Listar farmácias aprovadas
  async getFarmacias(): Promise<ApiResponse<any[]>> {
    return apiRequest("/public/farmacias", "GET");
  },

  // Listar categorias de medicamentos
  async getCategorias(): Promise<ApiResponse<any[]>> {
    return apiRequest("/categorias", "GET");
  },

  // --- Farmácia: Gestão de Medicamentos ---

  // Listar medicamentos da farmácia autenticada
  async getMeusMedicamentos(): Promise<ApiResponse<Medicamento[]>> {
    return apiRequest("/farmacia/medicamentos", "GET");
  },

  // Criar medicamento (com upload de imagem)
  async create(data: Partial<Medicamento> & { imagem?: File }): Promise<ApiResponse<Medicamento>> {
    const form = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      if (key === "imagem" && value instanceof File) {
        form.append("medicamento_imagem", value);
      } else if (value !== undefined && value !== null) {
        form.append(key, String(value));
      }
    });

    try {
      const response = await fetch(`${API_BASE}/farmacia/medicamentos`, {
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

  // Editar medicamento
  async update(id: string, data: Partial<Medicamento> & { imagem?: File }): Promise<ApiResponse<Medicamento>> {
    const form = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      if (key === "imagem" && value instanceof File) {
        form.append("medicamento_imagem", value);
      } else if (value !== undefined && value !== null) {
        form.append(key, String(value));
      }
    });

    try {
      const response = await fetch(`${API_BASE}/farmacia/medicamentos/${id}`, {
        method: "PUT",
        headers: getAuthHeader(),
        body: form,
      });
      const json = await response.json();
      return response.ok ? { success: true, data: json.data } : { success: false, error: json.message };
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  },

  // Remover/desativar medicamento
  async delete(id: string): Promise<ApiResponse<null>> {
    return apiRequest(`/farmacia/medicamentos/${id}`, "DELETE" as any);
  },

  // Atualizar estoque (é feito pelo update acima, mantido por compatibilidade)
  async updateStock(id: string, quantity: number): Promise<ApiResponse<Medicamento>> {
    return apiRequest(`/farmacia/medicamentos/${id}`, "PUT", { stock: quantity });
  },
};
