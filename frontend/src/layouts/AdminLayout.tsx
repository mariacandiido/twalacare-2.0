import { useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { useFarmaciasStore } from "../store/farmaciasStore";
import { useEntregadoresAdminStore } from "../store/entregadoresAdminStore";
import { NotificacaoIcon } from "../components/admin/NotificacaoIcon";

// ── Ícones SVG inline ──────────────────────────────────────────────────────────
const Icons = {
  dashboard: () => (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="3" y="3" width="7" height="7" />
      <rect x="14" y="3" width="7" height="7" />
      <rect x="14" y="14" width="7" height="7" />
      <rect x="3" y="14" width="7" height="7" />
    </svg>
  ),
  users: () => (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  ),
  approval: () => (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M9 11l3 3L22 4" />
      <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
    </svg>
  ),
  stats: () => (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <line x1="18" y1="20" x2="18" y2="10" />
      <line x1="12" y1="20" x2="12" y2="4" />
      <line x1="6" y1="20" x2="6" y2="14" />
    </svg>
  ),
  logs: () => (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="16" y1="13" x2="8" y2="13" />
      <line x1="16" y1="17" x2="8" y2="17" />
      <polyline points="10 9 9 9 8 9" />
    </svg>
  ),
  settings: () => (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="3" />
      <path d="M19.07 4.93l-1.41 1.41M4.93 4.93l1.41 1.41M12 2v2M12 20v2M20 12h2M2 12h2M19.07 19.07l-1.41-1.41M4.93 19.07l1.41-1.41" />
    </svg>
  ),
  menu: () => (
    <svg
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <line x1="3" y1="6" x2="21" y2="6" />
      <line x1="3" y1="12" x2="21" y2="12" />
      <line x1="3" y1="18" x2="21" y2="18" />
    </svg>
  ),
  close: () => (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  ),
  bell: () => (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
      <path d="M13.73 21a2 2 0 0 1-3.46 0" />
    </svg>
  ),
  logout: () => (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
      <polyline points="16 17 21 12 16 7" />
      <line x1="21" y1="12" x2="9" y2="12" />
    </svg>
  ),
};

const NAV = [
  { to: "/admin/dashboard", label: "Dashboard", icon: Icons.dashboard },
  { to: "/admin/aprovacoes", label: "Aprovações", icon: Icons.approval },
  { to: "/admin/usuarios", label: "Usuários", icon: Icons.users },
  { to: "/admin/admins", label: "Gerenciar Admins", icon: Icons.users },
  { to: "/admin/estatisticas", label: "Estatísticas", icon: Icons.stats },
  { to: "/admin/logs", label: "Logs Administrativos", icon: Icons.logs },
  { to: "/admin/configuracoes", label: "Configurações", icon: Icons.settings },
];

const G = "#1a3320"; // sidebar fundo
const GA = "#243e2a"; // sidebar item hover
const GOLD = "#c7a252"; // dourado
const GREEN = "#2c5530"; // verde principal

export function AdminLayout() {
  const { user, logout } = useAuth();
  const pendentesFarmacias = useFarmaciasStore(
    (s) => s.obterPendentes().length,
  );
  const pendentesEntregadores = useEntregadoresAdminStore(
    (s) => s.obterPendentes().length,
  );
  const navigate = useNavigate();
  const [sidebarAberta, setSidebarAberta] = useState(false);

  const pendentes = pendentesFarmacias + pendentesEntregadores;

  const iniciais = (user?.nome ?? "AD")
    .split(" ")
    .slice(0, 2)
    .map((n) => n[0].toUpperCase())
    .join("");

  const handleLogout = async () => {
    await logout();
    navigate("/admin/login");
  };

  const SidebarContent = () => (
    <>
      {/* Logo */}
      <div
        style={{
          padding: "20px 20px 16px",
          borderBottom: "1px solid rgba(255,255,255,0.07)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div
            style={{
              width: 36,
              height: 36,
              borderRadius: 9,
              backgroundColor: "rgba(199,162,82,0.18)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            <span
              style={{
                color: GOLD,
                fontFamily: "'Poppins',sans-serif",
                fontWeight: 700,
                fontSize: 18,
              }}
            >
              T
            </span>
          </div>
          <div>
            <p
              style={{
                fontFamily: "'Poppins',sans-serif",
                fontWeight: 600,
                fontSize: 15,
                color: "#fff",
                margin: 0,
                lineHeight: 1,
              }}
            >
              Twala<span style={{ color: GOLD }}>Care</span>
            </p>
            <p
              style={{
                fontFamily: "'Roboto',sans-serif",
                fontSize: 10,
                color: "rgba(255,255,255,0.45)",
                margin: "3px 0 0",
                textTransform: "uppercase",
                letterSpacing: "0.07em",
              }}
            >
              Painel Admin
            </p>
          </div>
        </div>
      </div>

      {/* Perfil resumido */}
      <div
        style={{
          padding: "14px 20px 10px",
          borderBottom: "1px solid rgba(255,255,255,0.07)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div
            style={{
              width: 34,
              height: 34,
              borderRadius: "50%",
              backgroundColor: "rgba(199,162,82,0.22)",
              border: "1.5px solid rgba(199,162,82,0.4)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            <span
              style={{
                fontFamily: "'Poppins',sans-serif",
                fontWeight: 700,
                fontSize: 12,
                color: GOLD,
              }}
            >
              {iniciais}
            </span>
          </div>
          <div style={{ minWidth: 0 }}>
            <p
              style={{
                fontFamily: "'Poppins',sans-serif",
                fontWeight: 600,
                fontSize: 12,
                color: "#fff",
                margin: 0,
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              {user?.nome ?? "Administrador"}
            </p>
            <p
              style={{
                fontFamily: "'Roboto',sans-serif",
                fontSize: 10,
                color: "rgba(255,255,255,0.45)",
                margin: "1px 0 0",
              }}
            >
              Administrador
            </p>
          </div>
        </div>
      </div>

      {/* Navegação */}
      <nav style={{ padding: "10px 10px", flex: 1 }}>
        <p
          style={{
            fontFamily: "'Roboto',sans-serif",
            fontSize: 10,
            color: "rgba(255,255,255,0.3)",
            textTransform: "uppercase",
            letterSpacing: "0.09em",
            padding: "6px 10px 8px",
            margin: 0,
          }}
        >
          Menu Principal
        </p>
        {NAV.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            onClick={() => setSidebarAberta(false)}
            style={({ isActive }) => ({
              display: "flex",
              alignItems: "center",
              gap: 11,
              padding: "10px 12px",
              borderRadius: 9,
              marginBottom: 2,
              textDecoration: "none",
              fontFamily: "'Roboto',sans-serif",
              fontSize: 13,
              fontWeight: isActive ? 600 : 400,
              color: isActive ? "#fff" : "rgba(255,255,255,0.6)",
              backgroundColor: isActive
                ? "rgba(255,255,255,0.1)"
                : "transparent",
              borderLeft: `3px solid ${isActive ? GOLD : "transparent"}`,
              transition: "all 0.15s",
              position: "relative",
            })}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.backgroundColor = GA;
              (e.currentTarget as HTMLElement).style.color = "#fff";
            }}
            onMouseLeave={(e) => {
              const el = e.currentTarget as HTMLAnchorElement;
              if (!el.classList.contains("active")) {
                el.style.backgroundColor = "transparent";
                el.style.color = "rgba(255,255,255,0.6)";
              }
            }}
          >
            <Icon />
            <span style={{ flex: 1 }}>{label}</span>
            {/* Badge de pendentes na nav de Utilizadores */}
            {label === "Utilizadores" && pendentes > 0 && (
              <span
                style={{
                  padding: "1px 7px",
                  borderRadius: 10,
                  backgroundColor: GOLD,
                  color: G,
                  fontFamily: "'Poppins',sans-serif",
                  fontWeight: 700,
                  fontSize: 10,
                }}
              >
                {pendentes}
              </span>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Logout */}
      <div
        style={{
          padding: "10px 10px 16px",
          borderTop: "1px solid rgba(255,255,255,0.07)",
        }}
      >
        <button
          onClick={handleLogout}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            width: "100%",
            padding: "10px 12px",
            borderRadius: 9,
            border: "none",
            backgroundColor: "transparent",
            cursor: "pointer",
            fontFamily: "'Roboto',sans-serif",
            fontSize: 13,
            color: "rgba(255,255,255,0.5)",
            transition: "all 0.15s",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = "rgba(212,90,90,0.12)";
            e.currentTarget.style.color = "#e87a7a";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = "transparent";
            e.currentTarget.style.color = "rgba(255,255,255,0.5)";
          }}
        >
          <Icons.logout />
          Terminar Sessão
        </button>
      </div>
    </>
  );

  return (
    <div
      style={{
        display: "flex",
        minHeight: "100vh",
        backgroundColor: "#f0f4f0",
      }}
    >
      {/* ── SIDEBAR DESKTOP ── */}
      <aside
        className="hidden lg:flex"
        style={{
          width: 220,
          flexShrink: 0,
          backgroundColor: G,
          flexDirection: "column",
          position: "sticky",
          top: 0,
          height: "100vh",
          overflowY: "auto",
        }}
      >
        <SidebarContent />
      </aside>

      {/* ── SIDEBAR MOBILE (overlay) ── */}
      {sidebarAberta && (
        <div style={{ position: "fixed", inset: 0, zIndex: 9990 }}>
          {/* Backdrop */}
          <div
            onClick={() => setSidebarAberta(false)}
            style={{
              position: "absolute",
              inset: 0,
              backgroundColor: "rgba(0,0,0,0.55)",
            }}
          />
          {/* Drawer */}
          <aside
            style={{
              position: "absolute",
              left: 0,
              top: 0,
              bottom: 0,
              width: 220,
              backgroundColor: G,
              display: "flex",
              flexDirection: "column",
              overflowY: "auto",
              zIndex: 1,
            }}
          >
            <SidebarContent />
          </aside>
        </div>
      )}

      {/* ── CONTEÚDO PRINCIPAL ── */}
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          minWidth: 0,
        }}
      >
        {/* Header */}
        <header
          style={{
            backgroundColor: "#fff",
            borderBottom: "1px solid #e8f0e8",
            padding: "0 20px",
            height: 60,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            position: "sticky",
            top: 0,
            zIndex: 100,
            boxShadow: "0 1px 4px rgba(44,85,48,0.06)",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            {/* Hamburger mobile */}
            <button
              className="lg:hidden"
              onClick={() => setSidebarAberta(true)}
              style={{
                padding: 6,
                borderRadius: 8,
                border: "1px solid #e0ebe0",
                backgroundColor: "transparent",
                cursor: "pointer",
                color: GREEN,
                display: "flex",
              }}
            >
              <Icons.menu />
            </button>
            <div>
              <p
                style={{
                  fontFamily: "'Poppins',sans-serif",
                  fontWeight: 600,
                  fontSize: 15,
                  color: "#1a3320",
                  margin: 0,
                }}
              >
                Painel de Administração
              </p>
              <p
                style={{
                  fontFamily: "'Roboto',sans-serif",
                  fontSize: 11,
                  color: "#7a8a7a",
                  margin: 0,
                }}
              >
                TwalaCare ·{" "}
                {new Date().toLocaleDateString("pt-AO", {
                  weekday: "long",
                  day: "numeric",
                  month: "long",
                })}
              </p>
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <NotificacaoIcon />

            {/* Avatar */}
            <div
              onClick={() => navigate("/admin/configuracoes")}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                padding: "5px 10px 5px 6px",
                borderRadius: 10,
                border: "1px solid #e0ebe0",
                cursor: "pointer",
                backgroundColor: "rgba(44,85,48,0.03)",
              }}
            >
              <div
                style={{
                  width: 30,
                  height: 30,
                  borderRadius: "50%",
                  backgroundColor: GREEN,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <span
                  style={{
                    fontFamily: "'Poppins',sans-serif",
                    fontWeight: 700,
                    fontSize: 11,
                    color: "#fff",
                  }}
                >
                  {iniciais}
                </span>
              </div>
              <div className="hidden sm:block">
                <p
                  style={{
                    fontFamily: "'Poppins',sans-serif",
                    fontWeight: 600,
                    fontSize: 12,
                    color: "#1a3320",
                    margin: 0,
                  }}
                >
                  {user?.nome?.split(" ")[0] ?? "Admin"}
                </p>
                <p
                  style={{
                    fontFamily: "'Roboto',sans-serif",
                    fontSize: 10,
                    color: "#7a8a7a",
                    margin: 0,
                  }}
                >
                  Administrador
                </p>
              </div>
            </div>
          </div>
        </header>

        {/* Página */}
        <main
          style={{ flex: 1, padding: "24px 20px 48px", overflowX: "hidden" }}
        >
          <Outlet />
        </main>
      </div>
    </div>
  );
}
