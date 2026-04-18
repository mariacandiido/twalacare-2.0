import type { ReactNode } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Home, Package, User, LogOut, ChevronRight } from "lucide-react";
import { FloatingChat } from "./FloatingChat";
import { useAuth } from "../../hooks/useAuth";

interface DashboardLayoutProps {
  children: ReactNode;
  userType: "farmacia" | "entregador" | "admin";
  userName: string;
}

const SIDEBAR_BG    = "#2c5530";
const GOLD          = "#c7a252";
const GOLD_LIGHT    = "rgba(199,162,82,0.15)";
const SIDEBAR_BORDER = "rgba(255,255,255,0.1)";

export function DashboardLayout({ children, userType, userName }: DashboardLayoutProps) {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  const menuItems = {
    farmacia: [
      { path: "/farmacia/dashboard", label: "Dashboard", icon: Home },
      { path: "/farmacia/produtos",  label: "Produtos",  icon: Package },
      { path: "/farmacia/pedidos",   label: "Pedidos",   icon: Package },
      { path: "/farmacia/perfil",    label: "Perfil",    icon: User },
    ],
    entregador: [
      { path: "/entregador/dashboard", label: "Dashboard", icon: Home },
      { path: "/entregador/entregas",  label: "Entregas",  icon: Package },
      { path: "/entregador/perfil",    label: "Meu Perfil", icon: User },
    ],
    admin: [
      { path: "/admin/dashboard",  label: "Dashboard",          icon: Home },
      { path: "/admin/usuarios",   label: "Gerenciar Usuários", icon: User },
      { path: "/admin/perfil",     label: "Meu Perfil",         icon: User },
    ],
  };

  const iniciais = userName
    .split(" ")
    .slice(0, 2)
    .map((n) => n.charAt(0).toUpperCase())
    .join("") || "U";

  const typeLabel: Record<string, string> = {
    farmacia: "Farmácia",
    entregador: "Entregador",
    admin: "Admin",
  };

  return (
    <>
      <div className="min-h-screen flex" style={{ backgroundColor: "#faf7f2" }}>

        {/* ── SIDEBAR ── */}
        <aside
          className="w-64 flex flex-col relative"
          style={{ backgroundColor: SIDEBAR_BG }}
        >
          {/* Logo */}
          <div
            className="p-5 flex-shrink-0"
            style={{ borderBottom: `1px solid ${SIDEBAR_BORDER}` }}
          >
            <Link to="/" className="flex items-center gap-3">
              <div
                className="w-9 h-9 rounded-xl flex items-center justify-center shadow-md"
                style={{ background: `linear-gradient(135deg, ${GOLD}, #a88235)`, border: "1px solid rgba(255,255,255,0.2)" }}
              >
                <span style={{ color: "#2c5530", fontFamily: "'Poppins', sans-serif", fontWeight: 700, fontSize: 15 }}>T</span>
              </div>
              <div>
                <span style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 600, color: "#ffffff", fontSize: 16 }}>
                  Twala<span style={{ color: GOLD }}>Care</span>
                </span>
                <p style={{ fontFamily: "'Roboto', sans-serif", fontSize: 10, color: "rgba(255,255,255,0.6)", letterSpacing: "0.5px" }}>
                  {typeLabel[userType] ?? "Painel"}
                </p>
              </div>
            </Link>
          </div>

          {/* Info do utilizador */}
          <div className="px-4 py-4 flex-shrink-0" style={{ borderBottom: `1px solid ${SIDEBAR_BORDER}` }}>
            <p style={{ fontFamily: "'Roboto', sans-serif", fontSize: 11, color: "rgba(255,255,255,0.5)", marginBottom: 4 }}>
              Bem-vindo,
            </p>
            <p style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 600, color: "#ffffff", fontSize: 14 }}>
              {userName}
            </p>
            <p
              className="inline-flex items-center mt-1.5 px-2 py-0.5 rounded-full capitalize"
              style={{
                fontFamily: "'Roboto', sans-serif",
                fontSize: 11,
                color: GOLD,
                backgroundColor: GOLD_LIGHT,
                border: `1px solid rgba(199,162,82,0.3)`,
              }}
            >
              {typeLabel[userType] ?? userType}
            </p>
          </div>

          {/* Navegação */}
          <nav className="p-3 flex-1">
            <p
              className="px-3 mb-3"
              style={{ fontFamily: "'Roboto', sans-serif", fontSize: 10, fontWeight: 600, color: "rgba(255,255,255,0.35)", letterSpacing: "1px", textTransform: "uppercase" }}
            >
              Menu Principal
            </p>
            <ul className="space-y-0.5">
              {menuItems[userType].map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname.startsWith(item.path);
                return (
                  <li key={item.path}>
                    <Link
                      to={item.path}
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
                          style={{ width: 16, height: 16, color: isActive ? GOLD : "rgba(255,255,255,0.5)" }}
                        />
                        <span>{item.label}</span>
                      </div>
                      {isActive && <ChevronRight style={{ width: 14, height: 14, color: GOLD }} />}
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
        <main className="flex-1 overflow-auto twala-page-enter">
          {/* Header do dashboard */}
          <div
            className="h-14 px-6 flex items-center justify-between sticky top-0 z-10"
            style={{
              backgroundColor: "#ffffff",
              borderBottom: "1px solid rgba(44,85,48,0.1)",
              boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
            }}
          >
            <div className="flex items-center gap-2">
              <span style={{ fontFamily: "'Roboto', sans-serif", fontSize: 13, color: "#5a6b5a" }}>
                {typeLabel[userType]}
              </span>
              <ChevronRight className="w-3.5 h-3.5" style={{ color: "#9aab9a" }} />
              <span style={{ fontFamily: "'Poppins', sans-serif", fontSize: 14, fontWeight: 600, color: "#2c5530" }}>
                Painel
              </span>
            </div>
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center"
              style={{ background: `linear-gradient(135deg, ${GOLD}, #a88235)` }}
            >
              <span style={{ color: "#2c5530", fontFamily: "'Poppins', sans-serif", fontWeight: 700, fontSize: 12 }}>
                {iniciais}
              </span>
            </div>
          </div>
          {children}
        </main>
      </div>

      <FloatingChat />
    </>
  );
}
