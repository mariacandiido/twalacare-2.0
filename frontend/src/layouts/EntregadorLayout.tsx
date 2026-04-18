import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  PackageOpen,
  Truck,
  History,
  User,
  LogOut,
  Menu,
  X,
  ChevronRight,
  Bell,
  Wifi,
  WifiOff,
} from "lucide-react";
import { useAuth } from "../hooks/useAuth";
import { useEntregadorStore } from "../store/entregadorStore";
import { useEntregadoresAdminStore } from "../store/entregadoresAdminStore";

interface EntregadorLayoutProps {
  children: React.ReactNode;
  disponivel?: boolean;
  onToggleDisponivel?: () => void;
}

const menuItems = [
  { path: "/entregador/dashboard",            label: "Dashboard",             icon: LayoutDashboard },
  { path: "/entregador/entregas-disponiveis", label: "Entregas Disponíveis",  icon: PackageOpen },
  { path: "/entregador/minhas-entregas",      label: "Minhas Entregas",       icon: Truck },
  { path: "/entregador/historico",            label: "Histórico",             icon: History },
  { path: "/entregador/perfil",               label: "Perfil",                icon: User },
];

const SIDEBAR_BG    = "#2c5530";
const GOLD          = "#c7a252";
const GOLD_LIGHT    = "rgba(199,162,82,0.15)";
const SIDEBAR_BORDER = "rgba(255,255,255,0.1)";

export function EntregadorLayout({
  children,
  disponivel = true,
  onToggleDisponivel,
}: EntregadorLayoutProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { entregasDisponiveis, entregasAtivas } = useEntregadorStore();
  const entregadores = useEntregadoresAdminStore((s) => s.entregadores);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const entregadorRegisto = entregadores.find(
    (e) => e.telefone === user?.telefone || e.email === user?.email
  );
  const aguardandoAprovacao =
    entregadorRegisto && entregadorRegisto.status !== "APROVADO" && entregadorRegisto.status !== "REJEITADO";

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  const currentPage = menuItems.find(
    (item) =>
      location.pathname === item.path ||
      location.pathname.startsWith(item.path + "/")
  );

  const badges: Record<string, number> = {
    "/entregador/entregas-disponiveis": entregasDisponiveis.length,
    "/entregador/minhas-entregas": entregasAtivas.length,
  };

  const iniciais =
    (user?.nome ?? "E")
      .split(" ")
      .slice(0, 2)
      .map((n) => n.charAt(0).toUpperCase())
      .join("") || "E";

  return (
    <div className="min-h-screen flex" style={{ backgroundColor: "#faf7f2" }}>
      {/* ── OVERLAY MOBILE ── */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-20 lg:hidden"
          style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* ── SIDEBAR ── */}
      <aside
        className={`
          fixed top-0 left-0 h-full w-64 z-30 flex flex-col
          transition-transform duration-300 ease-in-out
          lg:sticky lg:top-0 lg:h-screen lg:translate-x-0
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
        `}
        style={{ backgroundColor: SIDEBAR_BG }}
      >
        {/* Logo */}
        <div
          className="p-5 flex items-center gap-3 flex-shrink-0"
          style={{ borderBottom: `1px solid ${SIDEBAR_BORDER}` }}
        >
          <Link
            to="/"
            className="flex items-center gap-3"
            onClick={() => setSidebarOpen(false)}
          >
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center shadow-md"
              style={{ background: `linear-gradient(135deg, ${GOLD}, #a88235)`, border: "1px solid rgba(255,255,255,0.2)" }}
            >
              <span style={{ color: "#2c5530", fontFamily: "'Poppins', sans-serif", fontWeight: 700, fontSize: 16 }}>T</span>
            </div>
            <div>
              <span style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 600, color: "#ffffff", fontSize: 17 }}>
                Twala<span style={{ color: GOLD }}>Care</span>
              </span>
              <p style={{ fontFamily: "'Roboto', sans-serif", fontSize: 10, color: "rgba(255,255,255,0.6)", letterSpacing: "0.5px" }}>
                Painel Entregador
              </p>
            </div>
          </Link>
        </div>

        {/* Info do utilizador */}
        <div className="px-4 py-4 flex-shrink-0" style={{ borderBottom: `1px solid ${SIDEBAR_BORDER}` }}>
          <div className="flex items-center gap-3 mb-3">
            <div className="relative flex-shrink-0">
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center"
                style={{ background: `linear-gradient(135deg, ${GOLD}, #a88235)` }}
              >
                <span style={{ color: "#2c5530", fontFamily: "'Poppins', sans-serif", fontWeight: 700, fontSize: 14 }}>
                  {iniciais}
                </span>
              </div>
              <span
                className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full border-2"
                style={{
                  backgroundColor: disponivel ? "#4ade80" : "#9ca3af",
                  borderColor: SIDEBAR_BG,
                }}
              />
            </div>
            <div className="min-w-0">
              <p
                className="truncate"
                style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 600, color: "#ffffff", fontSize: 13 }}
              >
                {user?.nome ?? "Entregador"}
              </p>
              <p
                className="truncate"
                style={{ fontFamily: "'Roboto', sans-serif", color: "rgba(255,255,255,0.55)", fontSize: 11 }}
              >
                {user?.email ?? ""}
              </p>
            </div>
          </div>

          {/* Toggle disponibilidade */}
          {onToggleDisponivel && (
            <button
              onClick={onToggleDisponivel}
              className="w-full flex items-center justify-between px-3 py-2 rounded-xl transition-all duration-200"
              style={{
                backgroundColor: disponivel ? "rgba(74,222,128,0.12)" : "rgba(255,255,255,0.06)",
                border: disponivel ? "1px solid rgba(74,222,128,0.3)" : "1px solid rgba(255,255,255,0.12)",
                fontFamily: "'Roboto', sans-serif",
                fontSize: 12,
                fontWeight: 600,
                color: disponivel ? "#4ade80" : "rgba(255,255,255,0.5)",
              }}
            >
              <div className="flex items-center gap-2">
                {disponivel ? <Wifi className="w-3.5 h-3.5" /> : <WifiOff className="w-3.5 h-3.5" />}
                <span>{disponivel ? "Online — Disponível" : "Offline"}</span>
              </div>
              <div
                className="w-9 h-5 rounded-full relative flex-shrink-0 transition-colors"
                style={{ backgroundColor: disponivel ? "#4ade80" : "rgba(255,255,255,0.2)" }}
              >
                <div
                  className="absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform"
                  style={{ transform: disponivel ? "translateX(18px)" : "translateX(2px)" }}
                />
              </div>
            </button>
          )}
        </div>

        {/* Navegação */}
        <nav className="flex-1 p-3 overflow-y-auto">
          <p
            className="px-3 mb-3"
            style={{ fontFamily: "'Roboto', sans-serif", fontSize: 10, fontWeight: 600, color: "rgba(255,255,255,0.35)", letterSpacing: "1px", textTransform: "uppercase" }}
          >
            Menu Principal
          </p>
          <ul className="space-y-0.5">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive =
                location.pathname === item.path ||
                location.pathname.startsWith(item.path + "/");
              const badge = badges[item.path];

              return (
                <li key={item.path}>
                  <Link
                    to={item.path}
                    onClick={() => setSidebarOpen(false)}
                    className="flex items-center justify-between px-3 py-2.5 rounded-xl transition-all duration-200"
                    style={{
                      backgroundColor: isActive ? GOLD_LIGHT : "transparent",
                      color: isActive ? GOLD : "rgba(255,255,255,0.75)",
                      borderRight: isActive ? `3px solid ${GOLD}` : "3px solid transparent",
                      fontFamily: "'Roboto', sans-serif",
                      fontWeight: isActive ? 500 : 400,
                      fontSize: 14,
                    }}
                    onMouseEnter={(e) => {
                      if (!isActive) {
                        (e.currentTarget as HTMLElement).style.backgroundColor = "rgba(255,255,255,0.06)";
                        (e.currentTarget as HTMLElement).style.color = "#ffffff";
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!isActive) {
                        (e.currentTarget as HTMLElement).style.backgroundColor = "transparent";
                        (e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.75)";
                      }
                    }}
                  >
                    <div className="flex items-center gap-3">
                      <Icon
                        className="flex-shrink-0"
                        style={{ width: 17, height: 17, color: isActive ? GOLD : "rgba(255,255,255,0.5)" }}
                      />
                      <span>{item.label}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      {badge !== undefined && badge > 0 && (
                        <span
                          className="text-center"
                          style={{
                            fontSize: 10,
                            fontWeight: 700,
                            padding: "2px 6px",
                            borderRadius: 20,
                            minWidth: 18,
                            backgroundColor: isActive ? "rgba(199,162,82,0.3)" : "rgba(199,162,82,0.2)",
                            color: GOLD,
                          }}
                        >
                          {badge}
                        </span>
                      )}
                      {isActive && <ChevronRight className="w-3.5 h-3.5" style={{ color: GOLD }} />}
                    </div>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Logout */}
        <div className="p-3 flex-shrink-0" style={{ borderTop: `1px solid ${SIDEBAR_BORDER}` }}>
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl transition-all duration-200"
            style={{ color: "rgba(212,90,90,0.85)", fontFamily: "'Roboto', sans-serif", fontSize: 14, backgroundColor: "transparent" }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.backgroundColor = "rgba(212,90,90,0.12)";
              (e.currentTarget as HTMLElement).style.color = "#e87a7a";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.backgroundColor = "transparent";
              (e.currentTarget as HTMLElement).style.color = "rgba(212,90,90,0.85)";
            }}
          >
            <LogOut className="w-4 h-4 flex-shrink-0" />
            <span>Terminar Sessão</span>
          </button>
        </div>
      </aside>

      {/* ── CONTEÚDO PRINCIPAL ── */}
      <div className="flex-1 flex flex-col min-w-0">

        {/* Header */}
        <header
          className="px-4 lg:px-8 py-3 flex items-center justify-between sticky top-0 z-10"
          style={{
            backgroundColor: "#ffffff",
            borderBottom: "1px solid rgba(44,85,48,0.1)",
            boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
            minHeight: 64,
          }}
        >
          {/* Mobile: botão de menu */}
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden p-2 rounded-lg transition-colors duration-200"
            style={{ color: "#2c5530" }}
          >
            <Menu className="w-5 h-5" />
          </button>

          {/* Logo mobile */}
          <div className="lg:hidden flex items-center gap-2">
            <div
              className="w-7 h-7 rounded-lg flex items-center justify-center"
              style={{ background: `linear-gradient(135deg, ${GOLD}, #a88235)` }}
            >
              <span style={{ color: "#2c5530", fontFamily: "'Poppins', sans-serif", fontWeight: 700, fontSize: 12 }}>T</span>
            </div>
            <span style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 600, color: "#2c5530", fontSize: 15 }}>TwalaCare</span>
          </div>

          {/* Desktop: breadcrumb */}
          <div className="hidden lg:flex items-center gap-2">
            <span style={{ fontFamily: "'Roboto', sans-serif", fontSize: 13, color: "#5a6b5a" }}>Entregador</span>
            <ChevronRight className="w-3 h-3" style={{ color: "#9aab9a" }} />
            <span style={{ fontFamily: "'Poppins', sans-serif", fontSize: 14, fontWeight: 600, color: "#2c5530" }}>
              {currentPage?.label ?? "Painel"}
            </span>
          </div>

          {/* Direita: notificações + status + avatar */}
          <div className="flex items-center gap-3">
            <button
              className="relative p-2 rounded-full transition-all duration-200"
              style={{ color: "#2c5530" }}
            >
              <Bell className="w-5 h-5" />
              {entregasDisponiveis.length > 0 && (
                <span
                  className="absolute top-1 right-1 w-2 h-2 rounded-full"
                  style={{ backgroundColor: "#d45a5a" }}
                />
              )}
            </button>

            {/* Status badge */}
            <div
              className="hidden sm:flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full"
              style={{
                backgroundColor: disponivel ? "rgba(44,85,48,0.06)" : "rgba(0,0,0,0.04)",
                color: disponivel ? "#2c5530" : "#6b7280",
                border: disponivel ? "1px solid rgba(44,85,48,0.2)" : "1px solid rgba(0,0,0,0.1)",
                fontFamily: "'Roboto', sans-serif",
                fontSize: 12,
              }}
            >
              <span
                className="w-1.5 h-1.5 rounded-full"
                style={{ backgroundColor: disponivel ? "#4ade80" : "#9ca3af", animation: disponivel ? "pulse 2s infinite" : "none" }}
              />
              {disponivel ? "Online" : "Offline"}
            </div>

            {/* Avatar */}
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
              style={{ background: `linear-gradient(135deg, ${GOLD}, #a88235)` }}
            >
              <span style={{ color: "#2c5530", fontFamily: "'Poppins', sans-serif", fontWeight: 700, fontSize: 12 }}>
                {iniciais}
              </span>
            </div>

            <span
              className="hidden md:block truncate max-w-[120px]"
              style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 600, color: "#2c3e2c", fontSize: 13 }}
            >
              {user?.nome?.split(" ")[0] ?? "Entregador"}
            </span>
          </div>

          {/* Mobile: fechar sidebar */}
          <button
            onClick={() => setSidebarOpen(false)}
            className={`lg:hidden p-2 rounded-lg transition-colors duration-200 ${!sidebarOpen ? "invisible" : ""}`}
            style={{ color: "#2c5530" }}
          >
            <X className="w-5 h-5" />
          </button>
        </header>

        <main className="flex-1 overflow-auto twala-page-enter">
          {aguardandoAprovacao && (
            <div
              className="px-4 py-3 text-center"
              style={{
                backgroundColor: "rgba(199,162,82,0.2)",
                borderBottom: "1px solid rgba(199,162,82,0.4)",
                fontFamily: "'Roboto', sans-serif",
                fontSize: 14,
                color: "#7a5a20",
              }}
            >
              O seu cadastro está a aguardar aprovação pela equipa TwalaCare. Assim que for aprovado, poderá receber e realizar entregas.
            </div>
          )}
          {children}
        </main>
      </div>
    </div>
  );
}
