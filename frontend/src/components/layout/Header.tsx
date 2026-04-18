import { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ShoppingCart, Bell, LogOut, ChevronDown, UserCircle, Settings, UserRound } from "lucide-react";
import { useCartStore } from "../../store/cartStore";
import { useAuth } from "../../hooks/useAuth";

export function Header() {
  const cartCount = useCartStore((state) =>
    state.items.reduce((acc, item) => acc + item.quantity, 0)
  );
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  /* Fecha o dropdown ao clicar fora */
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setUserMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    setUserMenuOpen(false);
    await logout();
    navigate("/");
  };

  const getProfilePath = () => {
    if (!user) return "/login";
    return `/${user.tipo}/perfil`;
  };

  const getSettingsPath = () => {
    if (!user) return "/login";
    if (user.tipo === "cliente") return "/cliente/configuracoes";
    if (user.tipo === "admin") return "/admin/dashboard";
    return `/${user.tipo}/perfil`;
  };

  /* Iniciais do utilizador para o avatar */
  const getInitials = () => {
    if (!user?.nome) return "MC";
    return user.nome
      .split(" ")
      .slice(0, 2)
      .map((n) => n.charAt(0).toUpperCase())
      .join("");
  };

  /* Nome curto para exibição */
  const getDisplayName = () => {
    if (!user?.nome) return "Maria Cândido";
    return user.nome.split(" ")[0];
  };

  return (
    <header
      style={{ backgroundColor: "#ffffff", borderBottom: "1px solid rgba(44,85,48,0.1)" }}
      className="sticky top-0 z-50 shadow-sm"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">

          {/* ── LOGOTIPO ── */}
          <Link to="/" className="flex items-center gap-3 select-none group">
            {/* Ícone SVG TwalaCare */}
            <div className="relative">
              <svg
                width="46"
                height="46"
                viewBox="0 0 46 46"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="transition-transform duration-300 group-hover:scale-105"
              >
                {/* Círculo exterior dourado */}
                <circle cx="23" cy="23" r="21" stroke="#c7a252" strokeWidth="1.5" fill="none" strokeDasharray="4 2" />
                {/* Círculo interior verde */}
                <circle cx="23" cy="23" r="17" fill="#2c5530" />
                {/* Folha/planta */}
                <path
                  d="M23 11 C15 15 12 23 17 29 C20 32 25 32 28 29 C33 24 32 15 23 11Z"
                  fill="#4a7856"
                />
                {/* Nervura */}
                <path
                  d="M23 11 C21 19 19 25 17 29"
                  stroke="#a8d8a8"
                  strokeWidth="1"
                  strokeLinecap="round"
                  fill="none"
                />
                {/* Cruz médica dourada */}
                <rect x="20.5" y="18" width="5" height="2" rx="1" fill="#c7a252" />
                <rect x="22" y="16.5" width="2" height="5" rx="1" fill="#c7a252" />
                {/* Cabo da lupa */}
                <line x1="33" y1="33" x2="38" y2="38" stroke="#c7a252" strokeWidth="3" strokeLinecap="round" />
              </svg>
            </div>

            {/* Nome da marca */}
            <div className="flex flex-col leading-tight">
              <span
                className="text-2xl font-semibold tracking-tight"
                style={{ fontFamily: "'Poppins', sans-serif", color: "#2c5530" }}
              >
                Twala<span style={{ color: "#c7a252" }}>CARE</span>
              </span>
              <span
                className="text-xs tracking-widest uppercase"
                style={{ fontFamily: "'Roboto', sans-serif", color: "#4a7856", fontSize: "10px" }}
              >
                Farmácias Online
              </span>
            </div>
          </Link>

          {/* ── BOTÕES DA DIREITA ── */}
          <div className="flex items-center gap-3">

            {isAuthenticated && (
              <>
                {/* Notificações */}
                <Link
                  to="/notificationsPage"
                  className="relative p-2.5 rounded-full transition-all duration-300 hover:scale-105"
                  style={{ color: "#2c5530" }}
                  title="Notificações"
                >
                  <Bell className="w-5 h-5" />
                  <span
                    className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full border border-white"
                    style={{ backgroundColor: "#d45a5a" }}
                  />
                </Link>

                {/* Carrinho */}
                <Link
                  to="/carrinho"
                  className="relative p-2.5 rounded-full transition-all duration-300 hover:scale-105"
                  style={{ color: "#2c5530" }}
                  title="Carrinho"
                >
                  <ShoppingCart className="w-5 h-5" />
                  {cartCount > 0 && (
                    <span
                      className="absolute -top-0.5 -right-0.5 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full font-medium"
                      style={{ backgroundColor: "#2c5530", fontSize: "11px" }}
                    >
                      {cartCount}
                    </span>
                  )}
                </Link>
              </>
            )}

            {/* Área do utilizador */}
            {isAuthenticated ? (
              <div className="relative" ref={menuRef}>
                <button
                  onClick={() => setUserMenuOpen((prev) => !prev)}
                  className="flex items-center gap-2.5 px-3 py-1.5 rounded-xl transition-all duration-300 hover:shadow-md"
                  style={{
                    backgroundColor: "rgba(44,85,48,0.06)",
                    border: "1px solid rgba(44,85,48,0.15)",
                  }}
                >
                  {/* Avatar circular com iniciais */}
                  <div className="twala-avatar-mc" style={{ width: 36, height: 36, fontSize: 13 }}>
                    {getInitials()}
                  </div>
                  <div className="hidden sm:flex flex-col items-start">
                    <span
                      className="font-medium leading-tight"
                      style={{ fontFamily: "'Poppins', sans-serif", color: "#2c5530", fontSize: 14 }}
                    >
                      {getDisplayName()}
                    </span>
                    <span
                      className="capitalize leading-tight"
                      style={{ fontFamily: "'Roboto', sans-serif", color: "#4a7856", fontSize: 11 }}
                    >
                      {user?.tipo ?? "cliente"}
                    </span>
                  </div>
                  <ChevronDown
                    className="w-3.5 h-3.5 transition-transform duration-200"
                    style={{
                      color: "#4a7856",
                      transform: userMenuOpen ? "rotate(180deg)" : "rotate(0deg)",
                    }}
                  />
                </button>

                {/* Dropdown do utilizador */}
                {userMenuOpen && (
                  <div
                    className="twala-dropdown absolute right-0 top-full mt-2 w-56 overflow-hidden z-50"
                  >
                    {/* Info do utilizador */}
                    <div
                      className="px-4 py-3 border-b"
                      style={{ borderColor: "rgba(44,85,48,0.08)", backgroundColor: "rgba(44,85,48,0.03)" }}
                    >
                      {/* Avatar + nome */}
                      <div className="flex items-center gap-2.5 mb-1">
                        <div
                          className="twala-avatar-mc flex-shrink-0"
                          style={{ width: 32, height: 32, fontSize: 11 }}
                        >
                          {getInitials()}
                        </div>
                        <div className="min-w-0">
                          <p
                            className="font-semibold truncate"
                            style={{ fontFamily: "'Poppins', sans-serif", color: "#2c5530", fontSize: 13 }}
                          >
                            {user?.nome ?? "Utilizador"}
                          </p>
                          <p
                            className="truncate"
                            style={{ fontFamily: "'Roboto', sans-serif", color: "#5a6b5a", fontSize: 11 }}
                          >
                            {user?.email}
                          </p>
                        </div>
                      </div>
                      {/* Badge de tipo */}
                      <span
                        className="capitalize inline-block mt-1 px-2 py-0.5 rounded-full text-xs font-medium"
                        style={{ backgroundColor: "rgba(44,85,48,0.1)", color: "#2c5530", fontFamily: "'Roboto', sans-serif" }}
                      >
                        {user?.tipo ?? "cliente"}
                      </span>
                    </div>

                    {/* Links do menu */}
                    <div className="py-1">
                      {/* Meu Perfil */}
                      <Link
                        to={getProfilePath()}
                        onClick={() => setUserMenuOpen(false)}
                        className="flex items-center gap-3 px-4 py-2.5 transition-colors duration-200"
                        style={{ fontFamily: "'Roboto', sans-serif", color: "#2c3e2c", fontSize: 14, textDecoration: "none" }}
                        onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "rgba(44,85,48,0.06)")}
                        onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
                      >
                        <div
                          className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0"
                          style={{ backgroundColor: "rgba(44,85,48,0.1)" }}
                        >
                          <UserRound style={{ width: 14, height: 14, color: "#2c5530" }} />
                        </div>
                        Meu Perfil
                      </Link>

                      {/* Configurações */}
                      <Link
                        to={getSettingsPath()}
                        onClick={() => setUserMenuOpen(false)}
                        className="flex items-center gap-3 px-4 py-2.5 transition-colors duration-200"
                        style={{ fontFamily: "'Roboto', sans-serif", color: "#2c3e2c", fontSize: 14, textDecoration: "none" }}
                        onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "rgba(44,85,48,0.06)")}
                        onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
                      >
                        <div
                          className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0"
                          style={{ backgroundColor: "rgba(199,162,82,0.12)" }}
                        >
                          <Settings style={{ width: 14, height: 14, color: "#8a6e25" }} />
                        </div>
                        Configurações
                      </Link>

                      {/* Divisor */}
                      <div style={{ height: 1, backgroundColor: "rgba(44,85,48,0.07)", margin: "4px 0" }} />

                      {/* Terminar Sessão */}
                      <button
                        onClick={handleLogout}
                        className="flex items-center gap-3 w-full px-4 py-2.5 transition-colors duration-200 text-left"
                        style={{ fontFamily: "'Roboto', sans-serif", color: "#a03030", fontSize: 14 }}
                        onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "rgba(212,90,90,0.06)")}
                        onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
                      >
                        <div
                          className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0"
                          style={{ backgroundColor: "rgba(212,90,90,0.08)" }}
                        >
                          <LogOut style={{ width: 14, height: 14, color: "#a03030" }} />
                        </div>
                        Terminar Sessão
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              /* Botão de login */
              <Link
                to="/login"
                className="flex items-center gap-2 transition-all duration-300"
                title="Iniciar Sessão"
                style={{
                  textDecoration: "none",
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  padding: "6px 14px 6px 8px",
                  borderRadius: 12,
                  backgroundColor: "#2c5530",
                  border: "1px solid #2c5530",
                  transition: "all 0.2s",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.backgroundColor = "#1e3d22";
                  (e.currentTarget as HTMLElement).style.boxShadow = "0 4px 12px rgba(44,85,48,0.3)";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.backgroundColor = "#2c5530";
                  (e.currentTarget as HTMLElement).style.boxShadow = "none";
                }}
              >
                {/* Ícone de perfil */}
                <div
                  className="flex items-center justify-center rounded-full"
                  style={{
                    width: 32,
                    height: 32,
                    backgroundColor: "rgba(255,255,255,0.15)",
                  }}
                >
                  <UserCircle style={{ width: 20, height: 20, color: "#ffffff" }} />
                </div>
                <span
                  className="hidden sm:inline font-medium"
                  style={{ fontFamily: "'Roboto', sans-serif", color: "#ffffff", fontSize: 14 }}
                >
                  Iniciar Sessão
                </span>
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
