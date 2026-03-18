import { createBrowserRouter, Navigate, useRouteError } from "react-router-dom";
import { ProtectedRoute } from "./components/auth/ProtectedRoute";
import { AdminProvidersLayout } from "./layouts/AdminProvidersLayout";
import { AdminLayout } from "./layouts/AdminLayout";
import { AdminLogin } from "./pages/admin/AdminLogin";
import { AdminDashboard } from "./pages/admin/AdminDashboard";
import { AdminAprovacoes } from "./pages/admin/AdminAprovacoes";
import { AdminUsuarios } from "./pages/admin/AdminUsuarios";
import { AdminEstatisticas } from "./pages/admin/AdminEstatisticas";
import { AdminLogs } from "./pages/admin/AdminLogs";
import { AdminConfiguracoes } from "./pages/admin/AdminConfiguracoes";

export function AdminErrorFallback() {
  const error = useRouteError();
  const message =
    error instanceof Error ? error.message : typeof error === "string" ? error : "Ocorreu um erro.";
  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: 24, backgroundColor: "#f0f4f0", fontFamily: "'Roboto',sans-serif" }}>
      <div style={{ maxWidth: 480, padding: 32, backgroundColor: "#fff", borderRadius: 16, border: "1px solid #e8f0e8" }}>
        <h1 style={{ fontFamily: "'Poppins',sans-serif", fontWeight: 700, fontSize: 18, color: "#1a3320", margin: "0 0 8px" }}>Erro</h1>
        <p style={{ fontSize: 14, color: "#7a8a7a", margin: "0 0 16px" }}>{message}</p>
        <button type="button" onClick={() => window.location.href = "/admin/login"} style={{ padding: "10px 20px", borderRadius: 9, border: "none", backgroundColor: "#2c5530", color: "#fff", fontFamily: "'Poppins',sans-serif", fontWeight: 600, fontSize: 14, cursor: "pointer" }}>
          Ir para o login
        </button>
      </div>
    </div>
  );
}

export const adminRouter = createBrowserRouter([
  {
    element: <AdminProvidersLayout />,
    errorElement: <AdminErrorFallback />,
    children: [
      {
        path: "/",
        element: <Navigate to="/admin/login" replace />,
      },
      {
        path: "/admin/login",
        element: <AdminLogin />,
      },
      {
        path: "/admin",
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
      {
        path: "*",
        element: <Navigate to="/admin/login" replace />,
      },
    ],
  },
]);
