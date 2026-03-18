// hooks/useAuth.ts (VERSÃO MOCK - provider compartilhado)
import React, { createContext, useContext, useState, useCallback } from "react";
// Importa os tipos de utilizador definidos em src/types/index.ts.
// "Cliente" foi adicionado para suportar o novo perfil de cliente.
import {
  type UserType,
  type Farmacia,
  type Entregador,
  type Admin,
  type Cliente,
} from "../types";

// Interface para dados de registro
interface RegisterData {
  nome: string;
  email: string;
  telefone: string;
  tipo: UserType;
  password: string;
  confirmPassword?: string;
  // Campos específicos por tipo
  dataNascimento?: string;
  provincia?: string;
  municipio?: string;
  endereco?: string;
  nif?: string;
  horarioAbertura?: string;
  horarioFechamento?: string;
  veiculo?: string;
  placaVeiculo?: string;
  cargo?: string;
  departamento?: string;
}

// Interface para resultado do registro
interface RegisterResult {
  success: boolean;
  message: string;
  requiresVerification?: boolean;
  requiresApproval?: boolean;
  data?: AppUser;
}

// AppUser é um tipo union: representa qualquer utilizador autenticado no sistema.
// Ao adicionar "| Cliente", o sistema passa a aceitar clientes nos mesmos fluxos
// de login, logout e atualização de perfil que já existiam para os outros tipos.
export type AppUser = Farmacia | Entregador | Admin | Cliente;

interface UseAuthReturn {
  user: AppUser | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (
    email: string,
    password: string,
    userType: UserType,
  ) => Promise<boolean>;
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
  mockLogin: (userData: AppUser) => void;
  mockLogout: () => void;
}

// Utilizadores base (sempre disponíveis para testes sem necessidade de registo).
// O utilizador "cliente" foi adicionado para testar a área do cliente.
// Credenciais de teste: email = "cliente@gmail.com", senha = "123456"
const BASE_USERS: AppUser[] = [
  {
    id: "1",
    nome: "Maria Cliente",
    email: "cliente@gmail.com",
    telefone: "+244 900 000 001",
    dataRegistro: "2024-01-01T00:00:00Z",
    status: "ativo",
    tipo: "cliente",       // define que este utilizador tem o perfil de cliente
    dataNascimento: "1995-03-20",
    provincia: "Luanda",
    municipio: "Ingombota",
    endereco: "Rua da Missão, 45",
  },
  {
    id: "2",
    nome: "Farmácia Saúde",
    email: "farmacia@gmail.com",
    telefone: "+244 900 000 002",
    dataRegistro: "2024-01-01T00:00:00Z",
    status: "ativo",
    tipo: "farmacia",
    nif: "5400000000",
    provincia: "Luanda",
    municipio: "Belas",
    endereco: "Kilamba",
    horarioAbertura: "08:00",
    horarioFechamento: "22:00",
    avaliacao: 4.5,
  },
  {
    id: "3",
    nome: "Carlos Entregador",
    email: "entregador@gmail.com",
    telefone: "900 000 003",
    dataRegistro: "2024-01-01T00:00:00Z",
    status: "ativo",
    tipo: "entregador",
    dataNascimento: "1992-05-15",
    provincia: "Luanda",
    municipio: "Viana",
    endereco: "Rua das Flores, 12",
    veiculo: "moto",
    placaVeiculo: "LD-12345-AX",
    avaliacao: 4.8,
    ganhosMes: 45000,
  },
  {
    id: "admin-1",
    nome: "Administrador TwalaCare",
    email: "admin@twalcare.com",
    telefone: "+244 900 000 000",
    dataRegistro: "2024-01-01T00:00:00Z",
    status: "ativo",
    tipo: "admin",
    cargo: "Administrador",
    departamento: "Gestão",
    permissoes: ["all"],
  },
];

// Senhas dos utilizadores de teste (em produção as senhas estariam no backend com hash).
// A chave é o email (ou telefone no caso do entregador) usado no login.
const BASE_PASSWORDS: Record<string, string> = {
  "cliente@gmail.com": "123456",      // senha do utilizador cliente de teste
  "farmacia@gmail.com": "123456",     // senha da farmácia de teste
  "900 000 003": "1234",              // senha do entregador (usa telefone como login)
  "admin@twalcare.com": "admin123",   // senha do administrador
};

// Funções para persistir utilizadores e senhas no localStorage
function loadPersistedUsers(): AppUser[] {
  try {
    const data = localStorage.getItem("mock_users");
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

function loadPersistedPasswords(): Record<string, string> {
  try {
    const data = localStorage.getItem("mock_passwords");
    return data ? JSON.parse(data) : {};
  } catch {
    return {};
  }
}

function getAllUsers(): AppUser[] {
  return [...BASE_USERS, ...loadPersistedUsers()];
}

function getAllPasswords(): Record<string, string> {
  return { ...BASE_PASSWORDS, ...loadPersistedPasswords() };
}

function saveNewUser(user: AppUser, password: string, loginKey: string) {
  const existingUsers = loadPersistedUsers();
  existingUsers.push(user);
  localStorage.setItem("mock_users", JSON.stringify(existingUsers));

  const existingPasswords = loadPersistedPasswords();
  existingPasswords[loginKey] = password;
  localStorage.setItem("mock_passwords", JSON.stringify(existingPasswords));
}

// Emails já cadastrados (para simular verificação)
const registeredEmails = new Set(BASE_USERS.map((user) => user.email));

// Provider + hook implementation
const AuthContext = createContext<UseAuthReturn | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AppUser | null>(() => {
    try {
      const userData = localStorage.getItem("user_data");
      return userData ? JSON.parse(userData) : null;
    } catch (error) {
      console.error("Erro ao carregar usuário do localStorage:", error);
      return null;
    }
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // useCallback garante que clearError mantém a mesma referência entre renders.
  // Sem isso, qualquer useEffect que dependa de clearError correria em cada render,
  // limpando mensagens de erro imediatamente após serem definidas.
  const clearError = useCallback(() => setError(null), []);

  const login = async (
    email: string,
    password: string,
    userType: UserType,
  ): Promise<boolean> => {
    try {
      setIsLoading(true);
      setError(null);

      if (!email.trim() || !password.trim()) {
        setError("Email e senha são obrigatórios");
        return false;
      }

      await new Promise((resolve) => setTimeout(resolve, 800));

      const allUsers = getAllUsers();
      const allPasswords = getAllPasswords();

      // Entregadores identificam-se com telefone; outros tipos usam email
      const foundUser = allUsers.find((u) => {
        if (userType === "entregador") {
          return u.telefone === email && u.tipo === userType;
        }
        return u.email === email && u.tipo === userType;
      });

      if (!foundUser) {
        setError("Utilizador não encontrado. Verifique o email e o tipo de conta.");
        return false;
      }

      // Verificar senha contra as senhas persistidas
      const senhaGuardada = allPasswords[email];
      const senhaValida = senhaGuardada === password;

      if (!senhaValida) {
        setError("Senha incorreta. Verifique as suas credenciais.");
        return false;
      }

      localStorage.setItem("auth_token", "mock_token_" + Date.now());
      localStorage.setItem("user_data", JSON.stringify(foundUser));
      setUser(foundUser);

      console.log("✅ Login mock bem-sucedido:", foundUser);
      return true;
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : "Erro desconhecido";
      setError(errorMsg);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (userData: RegisterData): Promise<RegisterResult> => {
    try {
      setIsLoading(true);
      setError(null);

      await new Promise((resolve) => setTimeout(resolve, 1500));

      const allUsers = getAllUsers();
      const emailJaExiste = allUsers.some((u) => u.email === userData.email);

      if (registeredEmails.has(userData.email) || emailJaExiste) {
        return {
          success: false,
          message: "Este email já está cadastrado. Tente fazer login.",
          requiresVerification: false,
          requiresApproval: false,
        };
      }

      if (userData.password.length < 6) {
        return {
          success: false,
          message: "A senha deve ter pelo menos 6 caracteres",
          requiresVerification: false,
          requiresApproval: false,
        };
      }

      const { password, confirmPassword, ...otherData } = userData;
      const newUser: AppUser = {
        ...otherData,
        id: "user_" + Date.now(),
        dataRegistro: new Date().toISOString(),
        status: "pendente-aprovacao",
      } as AppUser;

      registeredEmails.add(userData.email);

      // Persistir o novo utilizador e a sua senha no localStorage
      const chaveLogin = userData.tipo === "entregador" ? userData.telefone : userData.email;
      saveNewUser(newUser, password, chaveLogin);

      let successMessage = "Conta criada com sucesso!";
      let requiresApproval = false;

      switch (userData.tipo) {
        case "farmacia":
          successMessage = "Conta criada! ✅ Aguarde aprovação administrativa.";
          requiresApproval = true;
          break;
        case "entregador":
          successMessage = "Conta criada! ✅ Aguarde verificação dos documentos.";
          requiresApproval = true;
          break;
        case "admin":
          successMessage = "Solicitação de acesso administrativo enviada.";
          requiresApproval = true;
          break;
        default:
          successMessage = "Conta criada com sucesso! ✅";
          localStorage.setItem("auth_token", "mock_token_" + Date.now());
          localStorage.setItem("user_data", JSON.stringify(newUser));
          setUser(newUser);
      }

      console.log("✅ Registro mock bem-sucedido:", newUser);

      return {
        success: true,
        message: successMessage,
        requiresVerification: false,
        requiresApproval,
        data: newUser,
      };
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : "Erro desconhecido";
      setError(errorMsg);
      return {
        success: false,
        message: errorMsg,
        requiresVerification: false,
        requiresApproval: false,
      };
    } finally {
      setIsLoading(false);
    }
  };

  const checkEmailExists = async (email: string) => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 500));
      const allUsers = getAllUsers();
      const exists = registeredEmails.has(email) || allUsers.some((u) => u.email === email);
      const u = allUsers.find((u) => u.email === email);
      return { exists, user: u };
    } catch (err) {
      console.error("Erro ao verificar email:", err);
      return { exists: false, user: undefined };
    }
  };

  const sendVerificationEmail = async (email: string): Promise<boolean> => {
    try {
      setError(null);
      await new Promise((resolve) => setTimeout(resolve, 1000));
      console.log("📧 Email de verificação mock enviado para:", email);
      return true;
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : "Erro desconhecido";
      setError(errorMsg);
      return false;
    }
  };

  const verifyEmail = async (token: string): Promise<boolean> => {
    try {
      setIsLoading(true);
      setError(null);
      await new Promise((resolve) => setTimeout(resolve, 1000));
      console.log("✅ Email verificado mock com token:", token);
      return true;
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : "Erro desconhecido";
      setError(errorMsg);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const updateUser = async (
    userData: Partial<AppUser> & Record<string, any>,
  ): Promise<boolean> => {
    try {
      if (!user) {
        setError("Nenhum usuário autenticado");
        return false;
      }

      setIsLoading(true);
      setError(null);
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const updatedUser = { ...user, ...userData } as AppUser;
      setUser(updatedUser);
      localStorage.setItem("user_data", JSON.stringify(updatedUser));

      console.log("✅ Usuário atualizado mock:", updatedUser);
      return true;
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : "Erro desconhecido";
      setError(errorMsg);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      setIsLoading(true);
      await new Promise((resolve) => setTimeout(resolve, 500));
      localStorage.removeItem("auth_token");
      localStorage.removeItem("user_data");
      setUser(null);
      setError(null);
      console.log("✅ Logout mock realizado");
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : "Erro ao fazer logout";
      setError(errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  const mockLogin = (userData: AppUser) => {
    localStorage.setItem("user_data", JSON.stringify(userData));
    setUser(userData);
    console.log("🔧 Login mock manual:", userData);
  };

  const mockLogout = () => {
    localStorage.removeItem("auth_token");
    localStorage.removeItem("user_data");
    setUser(null);
    setError(null);
    console.log("🔧 Logout mock manual");
  };

  const value: UseAuthReturn = {
    user,
    isLoading,
    isAuthenticated: user !== null,
    login,
    register,
    logout,
    sendVerificationEmail,
    verifyEmail,
    checkEmailExists,
    error,
    clearError,
    updateUser,
    mockLogin,
    mockLogout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
