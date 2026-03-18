import { Link, useLocation } from "react-router-dom";
import {
  Home, Building2, Pill, Truck, FileText, Info,
  LayoutDashboard, Globe, History as HistoryIcon, ShoppingBag,
  ChevronDown, LucideIcon, X, Menu,
} from "lucide-react";
import { useAuth } from "../../hooks/useAuth";
import { useState, useRef, useEffect } from "react";
import type { UserType } from "../../types";
import { useTheme, type Lang } from "../../contexts/ThemeContext";
import { getLanguageMeta } from "../../i18n/catalog";

interface MenuItem {
  path: string;
  label: string;
  icon: LucideIcon;
  private?: boolean;
  roles?: UserType[];
}

const menuItems: MenuItem[] = [
  { path: "/",              label: "Início",        icon: Home },
  { path: "/farmacias",     label: "Farmácias",     icon: Building2 },
  { path: "/farmacos",      label: "Medicamentos",  icon: Pill },
  { path: "/deliveriesPage",label: "Entrega",       icon: Truck,    private: true, roles: ["entregador"] },
  { path: "/receitasfarmacias", label: "Receitas",  icon: FileText, private: true, roles: ["farmacia"] },
  { path: "/sobre-nos",     label: "Sobre Nós",     icon: Info },
];

const HISTORICO_ITEMS = [
  { path: "/cliente/historico-compras", label: "Compras realizadas", icon: ShoppingBag },
  { path: "/cliente/receitas-enviadas", label: "Receitas enviadas",  icon: FileText },
];

/* Estilos inline da navbar para garantir consistência sem depender de utilitários Tailwind */
const NAV_BG        = "#2c5530";
const NAV_HOVER_BG  = "rgba(0,0,0,0.15)";
const NAV_ACTIVE_BG = "rgba(0,0,0,0.25)";
const GOLD          = "#c7a252";

export function Navbar() {
  const location  = useLocation();
  const { user, isAuthenticated } = useAuth();
  const { lang, setLang } = useTheme();
  const [historicoAberto, setHistoricoAberto] = useState(false);
  const [languageMenuOpen, setLanguageMenuOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen]   = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const languageRef = useRef<HTMLDivElement>(null);

  const isCliente = isAuthenticated && user?.tipo === "cliente";

  const filteredItems = menuItems.filter((item) => {
    if (item.private && !isAuthenticated) return false;
    if (item.roles && (!user || !item.roles.includes(user.tipo))) return false;
    return true;
  });

  const languageOptions: Array<{ value: Lang; label: string }> = [
    { value: "pt", label: "Português (PT)" },
    { value: "en", label: "English (EN)" },
    { value: "fr", label: "Français (FR)" },
  ];

  const currentLanguage = getLanguageMeta(lang);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setHistoricoAberto(false);
      }
      if (languageRef.current && !languageRef.current.contains(event.target as Node)) {
        setLanguageMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  /* Fecha menu mobile ao navegar */
  useEffect(() => {
    setMobileMenuOpen(false);
    setHistoricoAberto(false);
    setLanguageMenuOpen(false);
  }, [location.pathname]);

  const historicoActivo = HISTORICO_ITEMS.some((item) => location.pathname === item.path);

  /* Componente de item de nav com hover dourado */
  const NavItem = ({
    to,
    icon: Icon,
    label,
    isActive,
    onClick,
  }: {
    to: string;
    icon: LucideIcon;
    label: string;
    isActive: boolean;
    onClick?: () => void;
  }) => {
    const [hovered, setHovered] = useState(false);
    return (
      <Link
        to={to}
        onClick={onClick}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{
          display: "flex",
          alignItems: "center",
          gap: 6,
          padding: "10px 14px",
          color: "#ffffff",
          textDecoration: "none",
          position: "relative",
          fontFamily: "'Roboto', sans-serif",
          fontWeight: isActive ? 600 : 400,
          fontSize: 14,
          backgroundColor: isActive
            ? NAV_ACTIVE_BG
            : hovered
            ? NAV_HOVER_BG
            : "transparent",
          borderBottom: isActive
            ? `3px solid ${GOLD}`
            : hovered
            ? `3px solid ${GOLD}`
            : "3px solid transparent",
          transition: "all 0.25s ease",
          borderRadius: isActive || hovered ? "6px 6px 0 0" : 0,
          whiteSpace: "nowrap",
        }}
      >
        <Icon style={{ width: 16, height: 16, flexShrink: 0 }} />
        <span className="hidden sm:inline">{label}</span>
      </Link>
    );
  };

  return (
    <>
      <nav
        style={{ backgroundColor: NAV_BG, position: "sticky", top: 80, zIndex: 40 }}
        className="shadow-md"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">

            {/* ── ITENS DESKTOP ── */}
            <div className="hidden sm:flex items-center">
              {filteredItems.map((item) => (
                <NavItem
                  key={item.path}
                  to={item.path}
                  icon={item.icon}
                  label={item.label}
                  isActive={location.pathname === item.path}
                />
              ))}

              {/* Entrega para clientes */}
              {isCliente && (
                <NavItem
                  to="/cliente/acompanhar-entrega"
                  icon={Truck}
                  label="Entrega"
                  isActive={location.pathname === "/cliente/acompanhar-entrega"}
                />
              )}

              {/* Dashboard para não-clientes autenticados */}
              {isAuthenticated && user?.tipo !== "cliente" && (
                <NavItem
                  to={`/${user?.tipo}/dashboard`}
                  icon={LayoutDashboard}
                  label="Dashboard"
                  isActive={location.pathname.includes("/dashboard")}
                />
              )}

              {/* Dropdown Histórico — apenas clientes */}
              {isCliente && (
                <div className="relative" ref={dropdownRef}>
                  <HistoricoButton
                    isActive={historicoActivo}
                    isOpen={historicoAberto}
                    onClick={() => setHistoricoAberto((p) => !p)}
                  />

                  {historicoAberto && (
                    <div
                      className="absolute left-0 top-full mt-0 w-52 overflow-hidden z-50 twala-dropdown"
                      style={{ borderTop: `2px solid ${GOLD}` }}
                    >
                      {HISTORICO_ITEMS.map((item) => {
                        const Icon = item.icon;
                        const active = location.pathname === item.path;
                        return (
                          <Link
                            key={item.path}
                            to={item.path}
                            onClick={() => setHistoricoAberto(false)}
                            className="flex items-center gap-3 px-4 py-3 text-sm transition-colors duration-200"
                            style={{
                              fontFamily: "'Roboto', sans-serif",
                              color: active ? "#2c5530" : "#2c3e2c",
                              fontWeight: active ? 600 : 400,
                              backgroundColor: active ? "rgba(44,85,48,0.06)" : "transparent",
                            }}
                            onMouseEnter={(e) => {
                              if (!active) (e.currentTarget as HTMLElement).style.backgroundColor = "rgba(44,85,48,0.04)";
                            }}
                            onMouseLeave={(e) => {
                              if (!active) (e.currentTarget as HTMLElement).style.backgroundColor = "transparent";
                            }}
                          >
                            <Icon className="w-4 h-4 flex-shrink-0" style={{ color: active ? "#2c5530" : "#4a7856" }} />
                            <span>{item.label}</span>
                          </Link>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* ── BOTÃO HAMBURGER MOBILE ── */}
            <button
              className="sm:hidden p-2.5 rounded-lg transition-colors duration-200"
              style={{ color: "#ffffff" }}
              onClick={() => setMobileMenuOpen(true)}
              aria-label="Abrir menu"
            >
              <Menu className="w-5 h-5" />
            </button>

            {/* ── BOTÃO DE IDIOMA ── */}
            <div className="relative" ref={languageRef}>
              <button
                onClick={() => setLanguageMenuOpen((prev) => !prev)}
                className="flex items-center gap-1.5 px-3 py-2.5 rounded-md transition-all duration-300"
                style={{
                  color: "rgba(255,255,255,0.9)",
                  fontFamily: "'Roboto', sans-serif",
                  fontSize: 14,
                  fontWeight: 500,
                }}
                onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.backgroundColor = NAV_HOVER_BG)}
                onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.backgroundColor = "transparent")}
                aria-label="Selecionar idioma"
                title={currentLanguage.label}
              >
                <Globe className="w-4 h-4" />
                <span className="hidden sm:inline">{currentLanguage.short}</span>
                <ChevronDown
                  className="hidden sm:inline"
                  style={{
                    width: 14,
                    height: 14,
                    transition: "transform 0.2s",
                    transform: languageMenuOpen ? "rotate(180deg)" : "rotate(0deg)",
                  }}
                />
              </button>

              {languageMenuOpen && (
                <div
                  className="absolute right-0 top-full mt-2 min-w-44 overflow-hidden z-50 twala-dropdown"
                  style={{ borderTop: `2px solid ${GOLD}` }}
                >
                  {languageOptions.map((option) => {
                    const isActive = lang === option.value;
                    return (
                      <button
                        key={option.value}
                        onClick={() => {
                          setLang(option.value);
                          setLanguageMenuOpen(false);
                        }}
                        className="w-full flex items-center justify-between gap-3 px-4 py-3 text-sm transition-colors duration-200"
                        style={{
                          fontFamily: "'Roboto', sans-serif",
                          color: isActive ? "#2c5530" : "#2c3e2c",
                          fontWeight: isActive ? 600 : 400,
                          backgroundColor: isActive ? "rgba(44,85,48,0.06)" : "#ffffff",
                          textAlign: "left",
                        }}
                        onMouseEnter={(e) => {
                          if (!isActive) (e.currentTarget as HTMLElement).style.backgroundColor = "rgba(44,85,48,0.04)";
                        }}
                        onMouseLeave={(e) => {
                          if (!isActive) (e.currentTarget as HTMLElement).style.backgroundColor = "#ffffff";
                        }}
                      >
                        <span>{option.label}</span>
                        {isActive && <span>✓</span>}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* ── MENU MOBILE (FULLSCREEN) ── */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 z-[100] flex flex-col"
          style={{
            backgroundColor: "rgba(44,85,48,0.97)",
            animation: "twala-fade-in 0.2s ease",
          }}
        >
          {/* Cabeçalho mobile */}
          <div
            className="flex items-center justify-between px-5 py-4 border-b"
            style={{ borderColor: "rgba(199,162,82,0.3)" }}
          >
            <span
              className="text-xl font-semibold"
              style={{ fontFamily: "'Poppins', sans-serif", color: "#ffffff" }}
            >
              Twala<span style={{ color: GOLD }}>CARE</span>
            </span>
            <button
              onClick={() => setMobileMenuOpen(false)}
              className="p-2 rounded-full transition-colors duration-200"
              style={{ color: "rgba(255,255,255,0.8)" }}
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Links mobile */}
          <div className="flex-1 overflow-y-auto py-6 px-5 space-y-1">
            {filteredItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className="flex items-center gap-4 px-4 py-3.5 rounded-xl transition-all duration-200"
                  style={{
                    fontFamily: "'Roboto', sans-serif",
                    fontSize: 16,
                    fontWeight: isActive ? 600 : 400,
                    color: isActive ? GOLD : "rgba(255,255,255,0.9)",
                    backgroundColor: isActive ? "rgba(199,162,82,0.12)" : "transparent",
                    borderLeft: isActive ? `3px solid ${GOLD}` : "3px solid transparent",
                  }}
                >
                  <Icon className="w-5 h-5 flex-shrink-0" />
                  {item.label}
                </Link>
              );
            })}

            {isCliente && (
              <Link
                to="/cliente/acompanhar-entrega"
                className="flex items-center gap-4 px-4 py-3.5 rounded-xl transition-all duration-200"
                style={{
                  fontFamily: "'Roboto', sans-serif",
                  fontSize: 16,
                  color: "rgba(255,255,255,0.9)",
                  borderLeft: "3px solid transparent",
                }}
              >
                <Truck className="w-5 h-5" />
                Entrega
              </Link>
            )}

            {isAuthenticated && user?.tipo !== "cliente" && (
              <Link
                to={`/${user?.tipo}/dashboard`}
                className="flex items-center gap-4 px-4 py-3.5 rounded-xl"
                style={{
                  fontFamily: "'Roboto', sans-serif",
                  fontSize: 16,
                  color: "rgba(255,255,255,0.9)",
                  borderLeft: "3px solid transparent",
                }}
              >
                <LayoutDashboard className="w-5 h-5" />
                Dashboard
              </Link>
            )}

            {isCliente &&
              HISTORICO_ITEMS.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className="flex items-center gap-4 px-4 py-3 rounded-xl ml-4"
                    style={{
                      fontFamily: "'Roboto', sans-serif",
                      fontSize: 14,
                      color: "rgba(255,255,255,0.7)",
                      borderLeft: "3px solid transparent",
                    }}
                  >
                    <Icon className="w-4 h-4" />
                    {item.label}
                  </Link>
                );
              })}
          </div>

          {/* Rodapé mobile — idioma */}
          <div
            className="px-5 py-4 border-t"
            style={{ borderColor: "rgba(199,162,82,0.3)" }}
          >
            <button
              onClick={() => setLanguageMenuOpen((prev) => !prev)}
              className="flex items-center gap-2 text-sm"
              style={{ color: "rgba(255,255,255,0.7)", fontFamily: "'Roboto', sans-serif" }}
              aria-label="Selecionar idioma"
            >
              <Globe className="w-4 h-4" />
              {currentLanguage.label}
            </button>
            {languageMenuOpen && (
              <div
                className="mt-3 flex flex-col gap-2"
                style={{ color: "rgba(255,255,255,0.9)" }}
              >
                {languageOptions.map((option) => {
                  const isActive = lang === option.value;
                  return (
                    <button
                      key={option.value}
                      onClick={() => {
                        setLang(option.value);
                        setLanguageMenuOpen(false);
                      }}
                      className="flex items-center justify-between gap-3 rounded-lg px-3 py-2 text-sm"
                      style={{
                        fontFamily: "'Roboto', sans-serif",
                        backgroundColor: isActive ? "rgba(199,162,82,0.16)" : "rgba(255,255,255,0.05)",
                        color: isActive ? GOLD : "rgba(255,255,255,0.9)",
                      }}
                    >
                      <span>{option.label}</span>
                      {isActive && <span>✓</span>}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}

/* Botão Histórico com seta */
function HistoricoButton({
  isActive,
  isOpen,
  onClick,
}: {
  isActive: boolean;
  isOpen: boolean;
  onClick: () => void;
}) {
  const [hovered, setHovered] = useState(false);
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: "flex",
        alignItems: "center",
        gap: 6,
        padding: "10px 14px",
        color: "#ffffff",
        position: "relative",
        fontFamily: "'Roboto', sans-serif",
        fontWeight: isActive ? 600 : 400,
        fontSize: 14,
        backgroundColor: isActive
          ? "rgba(0,0,0,0.25)"
          : hovered
          ? "rgba(0,0,0,0.15)"
          : "transparent",
        borderBottom: isActive
          ? "3px solid #c7a252"
          : hovered
          ? "3px solid #c7a252"
          : "3px solid transparent",
        borderRadius: isActive || hovered ? "6px 6px 0 0" : 0,
        transition: "all 0.25s ease",
        cursor: "pointer",
        border: "none",
        whiteSpace: "nowrap",
      }}
    >
      <HistoryIcon style={{ width: 16, height: 16 }} />
      <span className="hidden sm:inline">Histórico</span>
      <ChevronDown
        style={{
          width: 14,
          height: 14,
          transition: "transform 0.2s",
          transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
        }}
      />
    </button>
  );
}

