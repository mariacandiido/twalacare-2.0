import axios from "axios";
import { type ApiResponse, type BaseUser, type UserType } from "../types";

console.log(
  "TwalaCare: authService.ts loaded v3 (2.0-main); registerApi defined",
);

const API_BASE =
  (import.meta as any).env?.VITE_API_URL ?? "http://localhost:3000/api";

const TOKEN_KEY = "twalacare_token";
const REFRESH_KEY = "twalacare_refresh_token";
const USER_KEY = "twalacare_user";

const api = axios.create({
  baseURL: API_BASE,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem(TOKEN_KEY);
  if (token && config.headers) {
    // Axios v1 supports AxiosHeaders; assegura tipagem correta
    const headers = new axios.AxiosHeaders(config.headers);
    headers.set("Authorization", `Bearer ${token}`);
    config.headers = headers;
  }
  return config;
});

function normalizeError(err: unknown): string {
  if (!axios.isAxiosError(err)) {
    return err instanceof Error ? err.message : String(err);
  }

  if (err.response) {
    return (
      err.response.data?.message ||
      err.response.statusText ||
      `Erro ${err.response.status}`
    );
  }

  if (err.request) {
    return "Sem resposta do servidor. Verifique se o backend est� ativo em http://localhost:3000.";
  }

  return err.message;
}

const getAuthHeader = (): Record<string, string> => {
  const token = localStorage.getItem(TOKEN_KEY);
  return token ? { Authorization: `Bearer ${token}` } : {};
};

async function request<T>(
  path: string,
  method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE",
  body?: unknown,
): Promise<ApiResponse<T>> {
  try {
    const headers = { ...getAuthHeader() };
    if (!(body instanceof FormData)) {
      Object.assign(headers, { "Content-Type": "application/json" });
    }

    const response = await api.request({
      url: path,
      method,
      data: body,
      headers,
    });

    const data = response.data;
    if (data?.data !== undefined) {
      return { success: true, data: data.data };
    }

    return { success: true, data };
  } catch (err) {
    return { success: false, error: normalizeError(err) };
  }
}

export interface LoginResponse {
  token: string;
  refreshToken: string;
  user: BaseUser;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  nome: string;
  email: string;
  password: string;
  tipo: UserType;
  telefone?: string;
  nif?: string;
  licenca_funcionamento?: string;
  veiculo?: string;
  placa_veiculo?: string;
  provincia?: string;
  municipio?: string;
  bairro?: string;
  rua?: string;
}

export async function registerApi(
  data: RegisterData,
): Promise<ApiResponse<LoginResponse>> {
  console.log("AuthService: registerApi call (2.0-main)", {
    email: data.email,
    tipo: data.tipo,
  });
  const result = await request<LoginResponse>(
    `/auth/register-${data.tipo}`,
    "POST",
    data,
  );
  console.log(result);

  if (result.success && result.data) {
    result.data.user.tipo = result.data.user.tipo.toLowerCase() as UserType;

    if (result.data.token) {
      localStorage.setItem(TOKEN_KEY, result.data.token);
      localStorage.setItem(REFRESH_KEY, result.data.refreshToken);
      localStorage.setItem(USER_KEY, JSON.stringify(result.data.user));
    }
  }

  return result;
}

export const authService = {
  async login(credentials: {
    email: string;
    password: string;
  }): Promise<ApiResponse<LoginResponse>> {
    try {
      const payload = {
        email: credentials.email,
        password: credentials.password,
      };

      const result = await request<LoginResponse>(
        "/auth/login",
        "POST",
        payload,
      );

      if (result.success && result.data) {
        if (result.data.user && result.data.user.tipo) {
          result.data.user.tipo =
            result.data.user.tipo.toLowerCase() as UserType;
        }

        localStorage.setItem(TOKEN_KEY, result.data.token);
        localStorage.setItem(REFRESH_KEY, result.data.refreshToken);
        localStorage.setItem(USER_KEY, JSON.stringify(result.data.user));
      }

      return result;
    } catch (err) {
      return { success: false, error: normalizeError(err) };
    }
  },

  async registerCliente(data: {
    nome: string;
    email: string;
    password: string;
    telefone?: string;
  }): Promise<ApiResponse<LoginResponse>> {
    return request("/auth/register-cliente", "POST", data);
  },

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

  async completeFarmaciaRegistration(formData: FormData): Promise<ApiResponse<any>> {
    return request("/auth/register-farmacia-continue", "POST", formData);
  },

  async completeEntregadorRegistration(formData: FormData): Promise<ApiResponse<any>> {
    return request("/auth/register-entregador-continue", "POST", formData);
  },

  async logout(): Promise<ApiResponse<null>> {
    const refreshToken = localStorage.getItem(REFRESH_KEY);
    await request("/auth/logout", "POST", { refreshToken });
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(REFRESH_KEY);
    localStorage.removeItem(USER_KEY);
    return { success: true, data: null };
  },

  async me(): Promise<ApiResponse<BaseUser>> {
    const res = await request<BaseUser>("/auth/me", "GET");
    if (res.success && res.data) {
      res.data.tipo = res.data.tipo.toLowerCase() as UserType;
    }
    return res;
  },

  async updateProfile(data: Partial<BaseUser>): Promise<ApiResponse<BaseUser>> {
    const res = await request<BaseUser>("/auth/profile", "PUT", data);
    if (res.success && res.data) {
      res.data.tipo = res.data.tipo.toLowerCase() as UserType;
      const current = localStorage.getItem(USER_KEY);
      if (current) {
        const user = JSON.parse(current);
        localStorage.setItem(
          USER_KEY,
          JSON.stringify({ ...user, ...res.data }),
        );
      }
    }
    return res;
  },

  async changePassword(
    oldPassword: string,
    newPassword: string,
  ): Promise<ApiResponse<null>> {
    return request("/auth/change-password", "PUT", {
      oldPassword,
      newPassword,
    });
  },

  async forgotPassword(email: string): Promise<ApiResponse<null>> {
    return request("/auth/forgot-password", "POST", { email });
  },

  async resetPassword(
    token: string,
    newPassword: string,
  ): Promise<ApiResponse<null>> {
    return request("/auth/reset-password", "POST", { token, newPassword });
  },

  async verifyToken(token: string): Promise<ApiResponse<BaseUser>> {
    if (!token) return { success: false, error: "Sem token" };
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

  getCurrentUser(): BaseUser | null {
    const stored = localStorage.getItem(USER_KEY);
    if (!stored) return null;
    try {
      return JSON.parse(stored);
    } catch {
      return null;
    }
  },

  getToken(): string | null {
    return localStorage.getItem(TOKEN_KEY);
  },
};

export function getCurrentUser(): BaseUser | null {
  const stored = localStorage.getItem(USER_KEY);
  if (!stored) return null;
  try {
    return JSON.parse(stored);
  } catch {
    return null;
  }
}

export { getAuthHeader, request as apiRequest, API_BASE };
