/**
 * authService.ts - Integração real com a API de Autenticação do TwalaCare.
 * Substitui completamente os dados mock anteriores.
 */
import { type ApiResponse, type BaseUser, type UserType } from "../types";

const API_BASE = (import.meta as any).env?.VITE_API_URL ?? "http://localhost:3001/api";

// Helper para gerir tokens no localStorage
const TOKEN_KEY = "twalacare_token";
const REFRESH_KEY = "twalacare_refresh_token";
const USER_KEY = "twalacare_user";

function getAuthHeader(): Record<string, string> {
  const token = localStorage.getItem(TOKEN_KEY);
  return token ? { Authorization: `Bearer ${token}` } : {};
}

async function request<T>(
  path: string,
  method: string,
  body?: unknown,
): Promise<ApiResponse<T>> {
  try {
    const isFormData = body instanceof FormData;
    const headers: Record<string, string> = {
      ...getAuthHeader(),
      ...(isFormData ? {} : { "Content-Type": "application/json" }),
    };

    const response = await fetch(`${API_BASE}${path}`, {
      method,
      headers,
      body: body == null ? undefined : isFormData ? (body as FormData) : JSON.stringify(body),
    });

    const json = await response.json();

    if (!response.ok) {
      return { success: false, error: json.message || `Erro ${response.status}` };
    }

    return { success: true, data: json.data };
  } catch (err: any) {
    return { success: false, error: err.message || "Erro de conexão com a API" };
  }
}

interface LoginResponse {
  token: string;
  refreshToken: string;
  user: BaseUser;
}

export const authService = {
  // Login unificado – todos os painéis usam o mesmo endpoint
  async login(credentials: {
    email: string;
    password: string;
    userType?: UserType;
  }): Promise<ApiResponse<LoginResponse>> {
    const result = await request<LoginResponse>("/auth/login", "POST", {
      email: credentials.email,
      password: credentials.password,
    });

    if (result.success && result.data) {
      localStorage.setItem(TOKEN_KEY, result.data.token);
      localStorage.setItem(REFRESH_KEY, result.data.refreshToken);
      localStorage.setItem(USER_KEY, JSON.stringify(result.data.user));
    }

    return result;
  },

  // Registo de Cliente
  async registerCliente(data: {
    nome: string;
    email: string;
    password: string;
    telefone?: string;
  }): Promise<ApiResponse<LoginResponse>> {
    return request("/auth/register-cliente", "POST", data);
  },

  // Registo de Farmácia
  async registerFarmacia(data: {
    nome: string;
    email: string;
    password: string;
    nif?: string;
    licenca_funcionamento?: string;
    telefone?: string;
  }): Promise<ApiResponse<LoginResponse>> {
    return request("/auth/register-farmacia", "POST", data);
  },

  // Registo de Entregador
  async registerEntregador(data: {
    nome: string;
    email: string;
    password: string;
    veiculo?: string;
    placa_veiculo?: string;
    telefone?: string;
  }): Promise<ApiResponse<LoginResponse>> {
    return request("/auth/register-entregador", "POST", data);
  },

  // Logout
  async logout(): Promise<ApiResponse<null>> {
    const refreshToken = localStorage.getItem(REFRESH_KEY);
    await request("/auth/logout", "POST", { refreshToken });
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(REFRESH_KEY);
    localStorage.removeItem(USER_KEY);
    return { success: true, data: null };
  },

  // Obter dados do utilizador autenticado
  async me(): Promise<ApiResponse<BaseUser>> {
    return request("/auth/me", "GET");
  },

  // Atualizar perfil
  async updateProfile(data: Partial<BaseUser>): Promise<ApiResponse<BaseUser>> {
    return request("/auth/profile", "PUT", data);
  },

  // Alterar password
  async changePassword(oldPassword: string, newPassword: string): Promise<ApiResponse<null>> {
    return request("/auth/change-password", "PUT", { oldPassword, newPassword });
  },

  // Esqueci minha senha
  async forgotPassword(email: string): Promise<ApiResponse<null>> {
    return request("/auth/forgot-password", "POST", { email });
  },

  // Redefinir senha
  async resetPassword(token: string, newPassword: string): Promise<ApiResponse<null>> {
    return request("/auth/reset-password", "POST", { token, newPassword });
  },

  // Verificar token local
  async verifyToken(token: string): Promise<ApiResponse<BaseUser>> {
    if (!token) return { success: false, error: "Sem token" };
    // Tenta obter o perfil usando o token que já está no localStorage
    const storedUser = localStorage.getItem(USER_KEY);
    if (storedUser) {
      try {
        return { success: true, data: JSON.parse(storedUser) };
      } catch {
        // fall through
      }
    }
    return request("/auth/me", "GET");
  },

  // Get current stored user
  getCurrentUser(): BaseUser | null {
    const stored = localStorage.getItem(USER_KEY);
    if (!stored) return null;
    try { return JSON.parse(stored); } catch { return null; }
  },

  // Get current token
  getToken(): string | null {
    return localStorage.getItem(TOKEN_KEY);
  },
};

export { getAuthHeader, request as apiRequest, API_BASE };
