import { UserType } from "../types";

/**
 * Função centralizada para redirecionar usuários baseado no seu tipo (role)
 * após autenticação bem-sucedida.
 *
 * @param tipo - O tipo de usuário retornado pelo backend
 * @returns O caminho do dashboard correspondente
 */
export function getDashboardPath(tipo: UserType): string {
  switch (tipo) {
    case "cliente":
      return "/cliente/dashboard";
    case "farmacia":
      return "/farmacia/dashboard";
    case "entregador":
      return "/entregador/dashboard";
    case "admin":
      return "/admin/dashboard";
    default:
      return "/";
  }
}

/**
 * Redireciona automaticamente o usuário para o seu dashboard baseado no tipo
 * Utiliza a função getDashboardPath para determinar o caminho correto
 *
 * @param navigate - Função de navegação do React Router
 * @param tipo - O tipo de usuário
 * @param replace - Se deve substituir a entrada no histórico (padrão: true)
 */
export function redirectToDashboard(
  navigate: (path: string, options?: { replace?: boolean }) => void,
  tipo: UserType,
  replace: boolean = true,
): void {
  const path = getDashboardPath(tipo);
  navigate(path, { replace });
}
