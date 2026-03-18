import { createBrowserRouter, Navigate } from "react-router-dom";
import { Root } from "./components/Root";
import { Home } from "./pages/Home";
import { Login } from "./pages/Login";
import { Register } from "./pages/Register";
import { Farmacias } from "./pages/Farmacias";
import { Farmacos } from "./pages/Farmacos";
import { DeliveriesPage } from "./components/Entregador/DeliveriesPage";
import ReceitasFarmacia from "./components/farmacia/ReceitasFarmacia";
import { SobreNos } from "./pages/SobreNos";
import { FAQ } from "./pages/FAQ";
import { NotificationsPage } from "./pages/NotificationsPage";
import { Carrinho } from "./pages/Carrinho";
import { Checkout } from "./pages/Checkout";
import { ForgotPassword } from "./pages/ForgotPassword";
import { ResetPassword } from "./pages/ResetPassword";

// Entregador
import { EntregadorDashboard } from "./pages/Entregador/Dashboard";
import { EntregasDisponiveis } from "./pages/Entregador/EntregasDisponiveis";
import { MinhasEntregas } from "./pages/Entregador/MinhasEntregas";
import { Historico } from "./pages/Entregador/Historico";
import { Perfil as EntregadorPerfil } from "./pages/Entregador/Perfil";

// Farmácia
import { FarmaciaDashboard } from "./pages/Farmacia/FarmaciaDashboard";
import { FarmaciaProdutos } from "./pages/Farmacia/FarmaciaProdutos";
import { FarmaciaPedidos } from "./pages/Farmacia/FarmaciaPedidos";
import { FarmaciaReceitas } from "./pages/Farmacia/FarmaciaReceitas";
import { FarmaciaEntregas } from "./pages/Farmacia/FarmaciaEntregas";
import { FarmaciaPerfil } from "./pages/Farmacia/FarmaciaPerfil";

// Páginas da área do cliente — protegidas, só acessíveis com tipo "cliente"
import { HistoricoCompras } from "./pages/cliente/HistoricoCompras";
import { ReceitasEnviadas } from "./pages/cliente/ReceitasEnviadas";
import { PerfilCliente } from "./pages/cliente/Perfil";
import { AcompanharEntrega } from "./pages/cliente/AcompanharEntrega";
import { ConfiguracoesCliente } from "./pages/cliente/ConfiguracoesCliente";

import { NotFound } from "./pages/NotFound";
import { ProtectedRoute } from "./components/auth/ProtectedRoute";
import { AdminProvidersLayout } from "./layouts/AdminProvidersLayout";
import { AdminLayout } from "./layouts/AdminLayout";
import { AdminErrorBoundary } from "./components/admin/AdminErrorBoundary";
import { AdminErrorFallback } from "./admin-routes";
import { AdminLogin } from "./pages/admin/AdminLogin";
import { AdminDashboard } from "./pages/admin/AdminDashboard";
import { AdminAprovacoes } from "./pages/admin/AdminAprovacoes";
import { AdminUsuarios } from "./pages/admin/AdminUsuarios";
import { AdminEstatisticas } from "./pages/admin/AdminEstatisticas";
import { AdminLogs } from "./pages/admin/AdminLogs";
import { AdminConfiguracoes } from "./pages/admin/AdminConfiguracoes";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Root,
    children: [
      { index: true, Component: Home },
      { path: "login", Component: Login },
      { path: "register", Component: Register },
      { path: "forgot-password", Component: ForgotPassword },
      { path: "reset-password", Component: ResetPassword },
      { path: "farmacias", Component: Farmacias },
      { path: "farmacos", Component: Farmacos },
      {
        path: "deliveriesPage",
        element: (
          <ProtectedRoute allowedTypes={["entregador"]}>
            <DeliveriesPage />
          </ProtectedRoute>
        ),
      },
      { path: "sobre-nos", Component: SobreNos },
      {
        path: "notificationsPage",
        element: (
          <ProtectedRoute>
            <NotificationsPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "receitasfarmacias",
        element: (
          <ProtectedRoute allowedTypes={["farmacia"]}>
            <ReceitasFarmacia />
          </ProtectedRoute>
        ),
      },
      { path: "faq", Component: FAQ },
      {
        path: "carrinho",
        element: (
          <ProtectedRoute>
            <Carrinho />
          </ProtectedRoute>
        ),
      },
      {
        path: "checkout",
        element: (
          <ProtectedRoute>
            <Checkout />
          </ProtectedRoute>
        ),
      },

      // --------------------------------------------------
      // Rotas do Cliente
      // /cliente/perfil — página de perfil acedida ao clicar no nome no header
      // Ambas as rotas são protegidas pelo ProtectedRoute.
      // allowedTypes={["cliente"]} garante que:
      //   - utilizadores não autenticados são enviados para /login
      //   - utilizadores autenticados com outro tipo (farmacia, entregador, admin)
      //     são redirecionados para o seu próprio dashboard
      // --------------------------------------------------
      {
        // Página de acompanhamento de entrega com mapa simulado em tempo real
        path: "cliente/acompanhar-entrega/:id?",
        element: (
          <ProtectedRoute allowedTypes={["cliente"]}>
            <AcompanharEntrega />
          </ProtectedRoute>
        ),
      },
      {
        // Página de perfil do cliente — visualização e edição de dados pessoais
        path: "cliente/perfil",
        element: (
          <ProtectedRoute allowedTypes={["cliente"]}>
            <PerfilCliente />
          </ProtectedRoute>
        ),
      },
      {
        // Página de configurações do cliente — tema, idioma, acessibilidade, segurança
        path: "cliente/configuracoes",
        element: (
          <ProtectedRoute allowedTypes={["cliente"]}>
            <ConfiguracoesCliente />
          </ProtectedRoute>
        ),
      },
      {
        // Página com o histórico de todas as compras do cliente
        path: "cliente/historico-compras",
        element: (
          <ProtectedRoute allowedTypes={["cliente"]}>
            <HistoricoCompras />
          </ProtectedRoute>
        ),
      },
      {
        // Página com todas as receitas médicas enviadas pelo cliente
        path: "cliente/receitas-enviadas",
        element: (
          <ProtectedRoute allowedTypes={["cliente"]}>
            <ReceitasEnviadas />
          </ProtectedRoute>
        ),
      },

      // Rotas da Farmácia
      {
        path: "farmacia/dashboard",
        element: (
          <ProtectedRoute allowedTypes={["farmacia"]}>
            <FarmaciaDashboard />
          </ProtectedRoute>
        ),
      },
      {
        path: "farmacia/produtos",
        element: (
          <ProtectedRoute allowedTypes={["farmacia"]}>
            <FarmaciaProdutos />
          </ProtectedRoute>
        ),
      },
      {
        path: "farmacia/pedidos",
        element: (
          <ProtectedRoute allowedTypes={["farmacia"]}>
            <FarmaciaPedidos />
          </ProtectedRoute>
        ),
      },
      {
        path: "farmacia/receitas",
        element: (
          <ProtectedRoute allowedTypes={["farmacia"]}>
            <FarmaciaReceitas />
          </ProtectedRoute>
        ),
      },
      {
        path: "farmacia/entregas",
        element: (
          <ProtectedRoute allowedTypes={["farmacia"]}>
            <FarmaciaEntregas />
          </ProtectedRoute>
        ),
      },
      {
        path: "farmacia/perfil",
        element: (
          <ProtectedRoute allowedTypes={["farmacia"]}>
            <FarmaciaPerfil />
          </ProtectedRoute>
        ),
      },

      // Rotas do Entregador
      {
        path: "entregador/dashboard",
        element: (
          <ProtectedRoute allowedTypes={["entregador"]}>
            <EntregadorDashboard />
          </ProtectedRoute>
        ),
      },
      {
        path: "entregador/entregas-disponiveis",
        element: (
          <ProtectedRoute allowedTypes={["entregador"]}>
            <EntregasDisponiveis />
          </ProtectedRoute>
        ),
      },
      {
        path: "entregador/minhas-entregas",
        element: (
          <ProtectedRoute allowedTypes={["entregador"]}>
            <MinhasEntregas />
          </ProtectedRoute>
        ),
      },
      {
        path: "entregador/historico",
        element: (
          <ProtectedRoute allowedTypes={["entregador"]}>
            <Historico />
          </ProtectedRoute>
        ),
      },
      {
        path: "entregador/perfil",
        element: (
          <ProtectedRoute allowedTypes={["entregador"]}>
            <EntregadorPerfil />
          </ProtectedRoute>
        ),
      },

      { path: "*", Component: NotFound },
    ],
  },

  {
    path: "/admin",
    element: (
      <AdminErrorBoundary>
        <AdminProvidersLayout />
      </AdminErrorBoundary>
    ),
    errorElement: <AdminErrorFallback />,
    children: [
      { index: true, element: <Navigate to="/admin/login" replace /> },
      { path: "login", element: <AdminLogin /> },
      {
        path: "",
        element: (
          <ProtectedRoute allowedTypes={["admin"]}>
            <AdminLayout />
          </ProtectedRoute>
        ),
        children: [
          { index: true, element: <Navigate to="/admin/dashboard" replace /> },
          { path: "dashboard", element: <AdminDashboard /> },
          { path: "aprovacoes", element: <AdminAprovacoes /> },
          { path: "usuarios", element: <AdminUsuarios /> },
          { path: "estatisticas", element: <AdminEstatisticas /> },
          { path: "logs", element: <AdminLogs /> },
          { path: "configuracoes", element: <AdminConfiguracoes /> },
          { path: "utilizadores", element: <Navigate to="/admin/usuarios" replace /> },
          { path: "farmacias", element: <Navigate to="/admin/aprovacoes" replace /> },
          { path: "produtos", element: <Navigate to="/admin/dashboard" replace /> },
          { path: "pedidos", element: <Navigate to="/admin/dashboard" replace /> },
        ],
      },
      { path: "*", element: <Navigate to="/admin/login" replace /> },
    ],
  },
]);
