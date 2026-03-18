import { useEffect } from "react";
import { Outlet, useLocation, Navigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { Header } from "./layout/Header";
import { Navbar } from "./layout/Navbar";
import { Footer } from "./layout/Footer";


export function Root() {
  const location = useLocation();
  const { user, isLoading } = useAuth();

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }, [location.pathname]);

  // O painel de farmácia não pode aceder ao site público do cliente.
  // Se o utilizador for farmácia e tentar aceder a qualquer rota fora de /farmacia/*,
  // redireciona para o dashboard da farmácia.
  // Exceção: /register — permitir concluir a Etapa 2 do cadastro antes de redirecionar.
  if (!isLoading && user?.tipo === "farmacia" && !location.pathname.startsWith("/farmacia/") && location.pathname !== "/register") {
    return <Navigate to="/farmacia/dashboard" replace />;
  }

  // O admin não pode aceder à parte pública do site (início, farmácias, medicamentos, etc.).
  // Se o utilizador for admin e estiver em qualquer rota do site principal, redireciona para o painel admin.
  if (!isLoading && user?.tipo === "admin") {
    return <Navigate to="/admin/dashboard" replace />;
  }

  // O entregador não pode aceder à zona pública do cliente.
  // Se o utilizador for entregador e tentar aceder a qualquer rota fora de /entregador/*,
  // redireciona para o dashboard do entregador.
  if (!isLoading && user?.tipo === "entregador" && !location.pathname.startsWith("/entregador/")) {
    return <Navigate to="/entregador/dashboard" replace />;
  }

  // Rotas que não devem exibir o layout completo (dashboards, login e registo)
  const isDashboardRoute =
    location.pathname.includes("/farmacia/") ||
    location.pathname.includes("/entregador/") ||
    location.pathname.includes("/admin/") ||
    location.pathname === "/login" ||
    location.pathname === "/register";

  if (isDashboardRoute) {
    return <Outlet />;
  }
  

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>

  );
}
