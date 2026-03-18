// AuthContext.tsx
import React, { createContext, useContext, useState } from 'react';

interface Cliente {
  nome: string;
  email: string;
  fotoUrl?: string;
}

interface AuthContextType {
  usuario: Cliente | null;
  login: (email: string, senha: string) => Promise<void>;
  logout: () => void;
  atualizarUsuario: (dados: Cliente) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [usuario, setUsuario] = useState<Cliente | null>(null);

  const login = async (email: string, senha: string) => {
    // Simula login - na prática, seria uma chamada à API
    if (email === "usuario@exemplo.com" && senha === "123456") {
      setUsuario({
        nome: "João Silva",
        email: "usuario@exemplo.com",
        fotoUrl: "https://exemplo.com/foto.jpg"
      });
    } else {
      throw new Error("Credenciais inválidas");
    }
  };

  const logout = () => {
    setUsuario(null);
  };

  const atualizarUsuario = async (dados: Cliente) => {
    // Simula atualização no backend
    await new Promise(resolve => setTimeout(resolve, 1000));
    setUsuario(dados);
  };

  return (
    <AuthContext.Provider value={{ usuario, login, logout, atualizarUsuario }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth deve ser usado dentro de um AuthProvider");
  }
  return context;
}