import React, { createContext, useContext, useState, useCallback } from "react";
import {
  type UserType,
  type Farmacia,
  type Entregador,
  type Admin,
  type Cliente,
} from "../types";
import {
  registerApi,
  authService,
  type RegisterData,
} from "../services/authService";

export type AppUser = Farmacia | Entregador | Admin | Cliente;

interface RegisterResult {
  success: boolean;
  message: string;
  requiresVerification?: boolean;
  requiresApproval?: boolean;
  data?: AppUser;
}

interface UseAuthReturn {
  user: AppUser | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (userData: RegisterData) => Promise<RegisterResult>;
  logout: () => Promise<void>;
  sendVerificationEmail: (email: string) => Promise<boolean>;
  verifyEmail: (token: string) => Promise<boolean>;
  checkEmailExists: (
    email: string,
  ) => Promise<{ exists: boolean; user?: AppUser }>;
  error: string | null;
  clearError: () => void;
  updateUser: (
    userData: Partial<AppUser> & Record<string, any>,
  ) => Promise<boolean>;
}

const AuthContext = createContext<UseAuthReturn | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AppUser | null>(
    authService.getCurrentUser() as AppUser | null,
  );
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const clearError = useCallback(() => setError(null), []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      setIsLoading(true);
      setError(null);
      const result = await authService.login({ email, password });
      if (result.success && result.data) {
        setUser(result.data.user as AppUser);
        return true;
      } else {
        setError(result.error || "Erro ao fazer login");
        return false;
      }
    } catch (err: any) {
      setError(err.message || "Erro de conexão");
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (userData: RegisterData): Promise<RegisterResult> => {
    try {
      setIsLoading(true);
      setError(null);
      const result = await registerApi(userData);
      if (result.success && result.data) {
        // Se for cliente, já logamos automaticamente dependendo da regra do backend
        if (userData.tipo === "cliente") {
          setUser(result.data.user as AppUser);
        }
        return {
          success: true,
          message: "Conta criada com sucesso!",
          requiresApproval: userData.tipo !== "cliente",
          data: result.data.user as AppUser,
        };
      } else {
        return {
          success: false,
          message: result.error || "Erro ao criar conta",
        };
      }
    } catch (err: any) {
      return {
        success: false,
        message: err.message || "Erro de conexão",
      };
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setIsLoading(true);
    authService.logout();
    setUser(null);
    setIsLoading(false);
  };

  const checkEmailExists = async (_email: string) => {
    // Implementação real via API se necessário, ou apenas retorno falso para evitar bloqueio
    return { exists: false };
  };

  const sendVerificationEmail = async (_email: string) => true;
  const verifyEmail = async (_token: string) => true;

  const updateUser = async (
    userData: Partial<AppUser> & Record<string, any>,
  ): Promise<boolean> => {
    try {
      setIsLoading(true);
      const result = await authService.updateProfile(userData);
      if (result.success && result.data) {
        setUser(result.data as AppUser);
        return true;
      }
      return false;
    } catch (err) {
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const value: UseAuthReturn = {
    user,
    isLoading,
    isAuthenticated: !!user,
    login,
    register,
    logout,
    sendVerificationEmail,
    verifyEmail,
    checkEmailExists,
    error,
    clearError,
    updateUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
