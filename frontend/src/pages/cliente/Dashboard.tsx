import { Navigate } from "react-router-dom";

export function ClienteDashboard() {
  // Redireciona para a página principal do cliente (histórico de compras)
  return <Navigate to="/cliente/historico-compras" replace />;
}
