// ProtectedRoute — Componente de proteção de rotas por autenticação e tipo de utilizador.
//
// Como funciona:
//   1. Se o utilizador ainda está a carregar (isLoading), mostra um spinner.
//   2. Se não está autenticado, redireciona para /login guardando a página
//      original em "state.from" para voltar depois do login.
//   3. Se está autenticado mas com um tipo não permitido (ex: farmácia a tentar
//      aceder a uma rota de cliente), redireciona para o seu próprio dashboard.
//   4. Se tudo estiver correcto, renderiza o conteúdo filho normalmente.

import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { UserType } from "../../types";
import { getDashboardPath } from "../../utils/authRedirect";

// Props do componente:
// - children: o conteúdo da página a proteger
// - allowedTypes: lista de tipos de utilizador que podem aceder (ex: ["cliente"])
//   Se omitido, qualquer utilizador autenticado pode aceder.
interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedTypes?: UserType[];
}

export function ProtectedRoute({
  children,
  allowedTypes,
}: ProtectedRouteProps) {
  const { user, isAuthenticated, isLoading } = useAuth();

  // useLocation é usado para guardar a rota atual antes de redirecionar para o login,
  // para que após o login o utilizador volte à página que estava a tentar aceder.
  const location = useLocation();
  const isAdminArea = location.pathname.startsWith("/admin");

  // Enquanto o estado de autenticação está a ser verificado, mostra um spinner
  // para evitar um "flash" de conteúdo incorreto antes da verificação terminar.
  if (isLoading) {
    return (
      <div className="flex h-screen w-screen items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-t-2 border-primary"></div>
      </div>
    );
  }

  // Se o utilizador não está autenticado, envia-o para o login.
  // O "state={{ from: location }}" guarda a rota atual para redirecionar
  // de volta depois de o utilizador fazer login com sucesso.
  if (!isAuthenticated) {
    return (
      <Navigate
        to={isAdminArea ? "/admin/login" : "/login"}
        state={{ from: location }}
        replace
      />
    );
  }

  // Se a rota define tipos permitidos e o utilizador autenticado não é um deles,
  // redireciona-o para o dashboard correspondente ao seu tipo.
  // Exemplo: um entregador a tentar aceder a /cliente/historico-compras
  // será redirecionado para /entregador/dashboard.
  if (allowedTypes && user && !allowedTypes.includes(user.tipo)) {
    if (isAdminArea) {
      return <Navigate to="/admin/login" state={{ from: location }} replace />;
    }

    const dashboardPath = getDashboardPath(user.tipo);
    return <Navigate to={dashboardPath} replace />;
  }

  // Tudo validado: renderiza o conteúdo protegido normalmente
  return <>{children}</>;
}
