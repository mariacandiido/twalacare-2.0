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

  // O admin não deve aceder a rotas públicas ou de cliente. Se estiver autenticado e não estiver na área /admin,
  // redirecionamos imediatamente para o painel administrativo.
  if (!isLoading && user?.tipo === "admin" && !location.pathname.startsWith("/admin")) {
    return <Navigate to="/admin/dashboard" replace />;
  }

  const publicEntryPaths = ["/login", "/register"];

  // Farmácia e entregador ainda podem acessar páginas públicas, mas se tentarem ir a login/registro
  // enquanto já estão autenticados, redirecionam para o seu painel.
  if (!isLoading && user?.tipo === "farmacia" && publicEntryPaths.includes(location.pathname)) {
    return <Navigate to="/farmacia/dashboard" replace />;
  }

  if (!isLoading && user?.tipo === "entregador" && publicEntryPaths.includes(location.pathname)) {
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
