import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  FileText,
  Truck,
  User,
  LogOut,
  Menu,
  X,
  ChevronRight,
  Bell,
} from "lucide-react";
import { useAuth } from "../hooks/useAuth";
import { useFarmaciasStore } from "../store/farmaciasStore";

interface FarmaciaLayoutProps {
  children: React.ReactNode;
}

const menuItems = [
  { path: "/farmacia/dashboard", label: "Dashboard",  icon: LayoutDashboard },
  { path: "/farmacia/produtos",  label: "Produtos",   icon: Package },
  { path: "/farmacia/pedidos",   label: "Pedidos",    icon: ShoppingBag },
  { path: "/farmacia/receitas",  label: "Receitas",   icon: FileText },
  { path: "/farmacia/entregas",  label: "Entregas",   icon: Truck },
  { path: "/farmacia/perfil",    label: "Perfil",     icon: User },
];

const SIDEBAR_BG   = "#2c5530";
const GOLD         = "#c7a252";
const GOLD_LIGHT   = "rgba(199,162,82,0.15)";
const SIDEBAR_BORDER = "rgba(255,255,255,0.1)";

export function FarmaciaLayout({ children }: FarmaciaLayoutProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const obterTodas = useFarmaciasStore((s) => s.obterTodas);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const farmaciaRegisto = obterTodas().find((f) => f.email === user?.email);
  const aguardandoAprovacao = farmaciaRegisto && !farmaciaRegisto.aprovada && !farmaciaRegisto.rejeitada;

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  const currentPage = menuItems.find((item) =>
    location.pathname.startsWith(item.path)
  );

  const iniciais = (user?.nome ?? "F")
    .split(" ")
    .slice(0, 2)
    .map((n) => n.charAt(0).toUpperCase())
    .join("") || "F";

  return (
    <div
      className="min-h-screen flex"
      style={{ backgroundColor: "#faf7f2" }}
    >
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
          lg:sticky lg:top-0 lg:h-screen lg:translate-x-0 lg:flex-shrink-0
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
        `}
        style={{
          backgroundColor: SIDEBAR_BG,
          borderRight: `1px solid ${SIDEBAR_BORDER}`,
        }}
      >
        {/* Logo */}
        <div
          className="h-16 px-5 flex items-center flex-shrink-0"
          style={{ borderBottom: `1px solid ${SIDEBAR_BORDER}` }}
        >
          <Link
            to="/"
            className="flex items-center gap-3"
            onClick={() => setSidebarOpen(false)}
          >
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center shadow-md"
              style={{
                background: `linear-gradient(135deg, ${GOLD}, #a88235)`,
                border: "1px solid rgba(255,255,255,0.2)",
              }}
            >
              <span
                style={{ color: "#2c5530", fontFamily: "'Poppins', sans-serif", fontWeight: 700, fontSize: 15 }}
              >
                T
              </span>
            </div>
            <div>
              <span
                style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 600, color: "#ffffff", fontSize: 16 }}
              >
                Twala<span style={{ color: GOLD }}>Care</span>
              </span>
              <p
                style={{ fontFamily: "'Roboto', sans-serif", fontSize: 10, color: "rgba(255,255,255,0.6)", letterSpacing: "0.5px" }}
              >
                Painel Farmácia
              </p>
            </div>
          </Link>
        </div>

        {/* Info do utilizador */}
        <div
          className="px-4 py-3 flex-shrink-0"
          style={{ borderBottom: `1px solid ${SIDEBAR_BORDER}` }}
        >
          <div
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl"
            style={{ backgroundColor: GOLD_LIGHT }}
          >
            <div
              className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0"
              style={{ background: `linear-gradient(135deg, ${GOLD}, #a88235)` }}
            >
              <span
                style={{ color: "#2c5530", fontFamily: "'Poppins', sans-serif", fontWeight: 700, fontSize: 13 }}
              >
                {iniciais}
              </span>
            </div>
            <div className="min-w-0">
              <p
                className="truncate leading-tight"
                style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 600, color: "#ffffff", fontSize: 13 }}
              >
                {user?.nome ?? "Farmácia"}
              </p>
              <p
                className="truncate leading-tight"
                style={{ fontFamily: "'Roboto', sans-serif", color: "rgba(255,255,255,0.6)", fontSize: 11 }}
              >
                {user?.email}
              </p>
            </div>
          </div>
        </div>

        {/* Navegação */}
        <nav className="flex-1 px-3 py-4 overflow-y-auto">
          <p
            className="px-3 mb-3"
            style={{ fontFamily: "'Roboto', sans-serif", fontSize: 10, fontWeight: 600, color: "rgba(255,255,255,0.4)", letterSpacing: "1px", textTransform: "uppercase" }}
          >
            Menu Principal
          </p>
          <ul className="space-y-0.5">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname.startsWith(item.path);
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
                        className="w-4.5 h-4.5 flex-shrink-0"
                        style={{ color: isActive ? GOLD : "rgba(255,255,255,0.55)", width: 17, height: 17 }}
                      />
                      <span>{item.label}</span>
                    </div>
                    {isActive && (
                      <ChevronRight
                        className="w-3.5 h-3.5"
                        style={{ color: GOLD }}
                      />
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Logout */}
        <div
          className="px-3 py-3 flex-shrink-0"
          style={{ borderTop: `1px solid ${SIDEBAR_BORDER}` }}
        >
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl transition-all duration-200"
            style={{
              color: "rgba(212,90,90,0.85)",
              fontFamily: "'Roboto', sans-serif",
              fontSize: 14,
              backgroundColor: "transparent",
            }}
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

        {/* Topbar */}
        <header
          className="h-16 px-4 lg:px-6 flex items-center justify-between flex-shrink-0 sticky top-0 z-10"
          style={{
            backgroundColor: "#ffffff",
            borderBottom: "1px solid rgba(44,85,48,0.1)",
            boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
          }}
        >
          {/* Botão menu mobile */}
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden p-2 rounded-lg transition-colors duration-200"
            style={{ color: "#2c5530" }}
          >
            <Menu className="w-5 h-5" />
          </button>

          {/* Breadcrumb (desktop) */}
          <div className="hidden lg:flex items-center gap-2">
            <span
              style={{ fontFamily: "'Roboto', sans-serif", fontSize: 13, color: "#5a6b5a" }}
            >
              Farmácia
            </span>
            <ChevronRight className="w-3.5 h-3.5" style={{ color: "#9aab9a" }} />
            <span
              style={{ fontFamily: "'Poppins', sans-serif", fontSize: 14, fontWeight: 600, color: "#2c5530" }}
            >
              {currentPage?.label ?? "Painel"}
            </span>
          </div>

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

          {/* Info do utilizador + notificações (desktop) */}
          <div className="flex items-center gap-3">
            <button
              className="relative p-2 rounded-full transition-all duration-200"
              style={{ color: "#2c5530" }}
            >
              <Bell className="w-5 h-5" />
              <span
                className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full"
                style={{ backgroundColor: "#d45a5a" }}
              />
            </button>

            <div className="hidden lg:flex items-center gap-3">
              <div className="text-right">
                <p
                  style={{ fontFamily: "'Poppins', sans-serif", fontSize: 13, fontWeight: 600, color: "#2c3e2c", lineHeight: 1.3 }}
                >
                  {user?.nome ?? "Farmácia"}
                </p>
                <p
                  style={{ fontFamily: "'Roboto', sans-serif", fontSize: 11, color: "#5a6b5a", lineHeight: 1.3 }}
                >
                  {user?.email}
                </p>
              </div>
              <div
                className="w-9 h-9 rounded-full flex items-center justify-center"
                style={{ background: `linear-gradient(135deg, ${GOLD}, #a88235)` }}
              >
                <span
                  style={{ color: "#2c5530", fontFamily: "'Poppins', sans-serif", fontWeight: 700, fontSize: 13 }}
                >
                  {iniciais}
                </span>
              </div>
            </div>
          </div>

          {/* Fechar sidebar mobile */}
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
              O seu cadastro está a aguardar aprovação pela equipa TwalaCare. Assim que for aprovado, poderá gerir pedidos e entregas normalmente.
            </div>
          )}
          {children}
        </main>
      </div>
    </div>
  );
}
