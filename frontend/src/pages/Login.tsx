import { useState, useEffect } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { Building2, Truck, Loader2, AlertCircle, User } from "lucide-react";
import { useAuth } from "../hooks/useAuth";
import { getAdminAppUrl } from "../adminAppUrl";

type UserType = "farmacia" | "entregador" | "cliente";

const GREEN = "#2c5530";
const GOLD  = "#c7a252";

export function Login() {
  const navigate  = useNavigate();
  const location  = useLocation();
  const { login, isLoading, error, clearError, user, isAuthenticated } = useAuth();

  const from = location.state?.from?.pathname;
  const [userType,   setUserType]   = useState<UserType>("cliente");
  const [email,      setEmail]      = useState("");
  const [password,   setPassword]   = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [errors,     setErrors]     = useState<{ email?: string; password?: string }>({});

  useEffect(() => {
    if (!isAuthenticated || !user) return;
    if (from && from !== "/login") { navigate(from, { replace: true }); return; }
    switch (user.tipo) {
      case "cliente":    navigate("/cliente/historico-compras", { replace: true }); break;
      case "farmacia":   navigate("/farmacia/dashboard",        { replace: true }); break;
      case "entregador": navigate("/entregador/dashboard",      { replace: true }); break;
      case "admin":      navigate("/admin/dashboard",           { replace: true }); break;
      default:           navigate("/",                          { replace: true });
    }
  }, [isAuthenticated, user]);

  useEffect(() => { clearError(); }, [userType, clearError]);

  const validateEmail    = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
  const validatePhone    = (v: string) => /^9\d{2}\s\d{3}\s\d{3}$/.test(v);
  const validatePassword = (v: string) => userType === "entregador" ? /^\d{4}$/.test(v) : v.length >= 6;

  const formatPhone = (v: string) => {
    const d = v.replace(/\D/g, "").slice(0, 9);
    if (d.length <= 3) return d;
    if (d.length <= 6) return `${d.slice(0,3)} ${d.slice(3)}`;
    return `${d.slice(0,3)} ${d.slice(3,6)} ${d.slice(6)}`;
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    clearError();
    let valid = true;
    const newErrors: typeof errors = {};
    if (userType === "entregador") {
      if (!validatePhone(email))    { newErrors.email    = "Formato: 9XX XXX XXX"; valid = false; }
    } else {
      if (!validateEmail(email))    { newErrors.email    = "Email inválido";       valid = false; }
    }
    if (!validatePassword(password)) {
      newErrors.password = userType === "entregador" ? "O PIN deve ter 4 dígitos" : "Mínimo 6 caracteres";
      valid = false;
    }
    if (!valid) { setErrors(newErrors); return; }
    await login(email, password, userType);
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = e.target.value;
    if (userType === "entregador") {
      const f = formatPhone(v);
      setEmail(f);
      setErrors((p) => ({ ...p, email: f && !validatePhone(f) ? "Formato: 9XX XXX XXX" : undefined }));
    } else {
      setEmail(v);
      setErrors((p) => ({ ...p, email: v && !validateEmail(v) ? "Email inválido" : undefined }));
    }
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = e.target.value;
    if (userType === "entregador") {
      const n = v.replace(/\D/g, "").slice(0, 4);
      setPassword(n);
      setErrors((p) => ({ ...p, password: n.length > 0 && n.length < 4 ? "O PIN deve ter 4 dígitos" : undefined }));
    } else {
      setPassword(v);
      setErrors((p) => ({ ...p, password: v && v.length < 6 ? "Mínimo 6 caracteres" : undefined }));
    }
  };

  const handleTypeChange = (type: UserType) => {
    setUserType(type);
    setErrors({});
    setEmail("");
    setPassword("");
    clearError();
  };

  const userTypes: { type: UserType; icon: typeof User; label: string; desc: string }[] = [
    { type: "cliente",    icon: User,      label: "Cliente",    desc: "Compre medicamentos" },
    { type: "farmacia",   icon: Building2, label: "Farmácia",   desc: "Gerencie pedidos" },
    { type: "entregador", icon: Truck,     label: "Entregador", desc: "Faça entregas" },
  ];

  return (
    <div
      className="min-h-screen flex twala-page-enter"
      style={{ backgroundColor: "#faf7f2" }}
    >

      {/* ── LADO ESQUERDO (HERO) ── */}
      <div
        className="hidden md:flex w-1/2 relative overflow-hidden flex-col items-center justify-center p-12"
        style={{ background: `linear-gradient(145deg, ${GREEN} 0%, #3a6b40 60%, #2c5530 100%)` }}
      >
        {/* Decorações de fundo */}
        <div
          className="absolute top-0 right-0 w-80 h-80 rounded-full opacity-10"
          style={{ background: GOLD, transform: "translate(40%, -40%)" }}
        />
        <div
          className="absolute bottom-0 left-0 w-64 h-64 rounded-full opacity-10"
          style={{ background: GOLD, transform: "translate(-40%, 40%)" }}
        />
        <div
          className="absolute top-1/2 left-1/2 w-96 h-96 rounded-full opacity-5"
          style={{ background: GOLD, transform: "translate(-50%, -50%)" }}
        />

        {/* Conteúdo */}
        <div className="relative z-10 text-center max-w-sm">
          {/* Logo TwalaCare */}
          <div className="flex justify-center mb-8">
            <div
              className="relative"
              style={{
                width: 96,
                height: 96,
                background: `linear-gradient(135deg, ${GOLD}, #a88235)`,
                borderRadius: 24,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: "0 16px 40px rgba(0,0,0,0.3)",
                border: "2px solid rgba(255,255,255,0.2)",
              }}
            >
              <span style={{ color: GREEN, fontFamily: "'Poppins', sans-serif", fontWeight: 700, fontSize: 42 }}>T</span>
            </div>
          </div>

          <h1
            className="mb-4"
            style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 600, fontSize: 30, color: "#ffffff", lineHeight: 1.2 }}
          >
            Bem-vindo ao TwalaCare
          </h1>
          <p style={{ fontFamily: "'Roboto', sans-serif", color: "rgba(255,255,255,0.8)", fontSize: 16, lineHeight: 1.7, marginBottom: 32 }}>
            A plataforma líder em farmácias online em Angola. Medicamentos de
            qualidade, entregues até si.
          </p>

          {/* Estatísticas */}
          <div className="flex justify-center gap-8">
            {[
              { num: "50+", label: "Farmácias" },
              { num: "4.9", label: "Avaliação" },
              { num: "30m", label: "Entrega" },
            ].map((s) => (
              <div key={s.label} className="text-center">
                <p style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 700, fontSize: 22, color: GOLD }}>
                  {s.num}
                </p>
                <p style={{ fontFamily: "'Roboto', sans-serif", fontSize: 12, color: "rgba(255,255,255,0.6)" }}>
                  {s.label}
                </p>
              </div>
            ))}
          </div>

          {/* Linha dourada */}
          <div
            className="mx-auto mt-8"
            style={{ height: 2, width: 80, background: `linear-gradient(90deg, transparent, ${GOLD}, transparent)`, borderRadius: 2 }}
          />

          {/* Selo */}
          <div className="mt-6 flex justify-center">
            <span className="twala-seal" style={{ fontSize: 11 }}>
              Farmácia de Confiança · Angola
            </span>
          </div>
        </div>
      </div>

      {/* ── FORMULÁRIO (DIREITA) ── */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-6">
        <div
          className="w-full max-w-md rounded-2xl p-8"
          style={{
            backgroundColor: "#ffffff",
            boxShadow: "0 8px 40px rgba(0,0,0,0.08)",
            border: "1px solid rgba(44,85,48,0.08)",
          }}
        >
          {/* Cabeçalho */}
          <div className="mb-8">
            {/* Logo mobile */}
            <div className="md:hidden flex justify-center mb-6">
              <div
                className="w-14 h-14 rounded-2xl flex items-center justify-center"
                style={{ background: `linear-gradient(135deg, ${GREEN}, #4a7856)` }}
              >
                <span style={{ color: GOLD, fontFamily: "'Poppins', sans-serif", fontWeight: 700, fontSize: 28 }}>T</span>
              </div>
            </div>

            <h2
              className="mb-1"
              style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 600, color: "#2c3e2c", fontSize: 22 }}
            >
              Entrar na sua conta
            </h2>
            <p style={{ fontFamily: "'Roboto', sans-serif", color: "#5a6b5a", fontSize: 14 }}>
              Selecione o tipo de conta para continuar
            </p>
          </div>

          {/* Seleção de tipo de utilizador */}
          <div className="grid grid-cols-3 gap-3 mb-8">
            {userTypes.map(({ type, icon: Icon, label, desc }) => (
              <button
                key={type}
                type="button"
                onClick={() => handleTypeChange(type)}
                className="flex flex-col items-center p-3 rounded-xl transition-all duration-300"
                style={{
                  border: userType === type ? `2px solid ${GREEN}` : "2px solid rgba(44,85,48,0.1)",
                  backgroundColor: userType === type ? "rgba(44,85,48,0.05)" : "transparent",
                  boxShadow: userType === type ? "0 4px 16px rgba(44,85,48,0.15)" : "none",
                }}
              >
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center mb-1.5"
                  style={{
                    backgroundColor: userType === type ? GREEN : "rgba(44,85,48,0.08)",
                  }}
                >
                  <Icon className="w-4 h-4" style={{ color: userType === type ? "#ffffff" : "#4a7856" }} />
                </div>
                <span
                  className="font-semibold leading-tight"
                  style={{ fontFamily: "'Poppins', sans-serif", fontSize: 12, color: userType === type ? GREEN : "#2c3e2c" }}
                >
                  {label}
                </span>
                <span
                  className="leading-tight text-center"
                  style={{ fontFamily: "'Roboto', sans-serif", fontSize: 10, color: "#7a8a7a", marginTop: 2 }}
                >
                  {desc}
                </span>
              </button>
            ))}
          </div>

          {/* Linha dourada */}
          <div
            className="mb-6"
            style={{ height: 1, background: `linear-gradient(90deg, transparent, ${GOLD}, transparent)` }}
          />

          {/* Formulário */}
          <form onSubmit={handleLogin} className="space-y-5">

            {/* Campo Email / Telefone */}
            <div>
              <label
                className="block mb-1.5"
                style={{ fontFamily: "'Roboto', sans-serif", fontSize: 14, fontWeight: 500, color: "#2c3e2c" }}
              >
                {userType === "entregador" ? "Número de Telefone" : "Email"}
              </label>
              <input
                type="text"
                value={email}
                onChange={handleEmailChange}
                disabled={isLoading}
                placeholder={userType === "entregador" ? "9XX XXX XXX" : "Digite seu email"}
                inputMode={userType === "entregador" ? "numeric" : "text"}
                className="twala-input"
                style={{
                  borderColor: errors.email ? "#d45a5a" : undefined,
                }}
              />
              {errors.email && (
                <p className="mt-1.5 flex items-center gap-1.5" style={{ fontFamily: "'Roboto', sans-serif", fontSize: 12, color: "#d45a5a" }}>
                  <AlertCircle className="w-3.5 h-3.5" />
                  {errors.email}
                </p>
              )}
            </div>

            {/* Campo Senha / PIN */}
            <div>
              <label
                className="block mb-1.5"
                style={{ fontFamily: "'Roboto', sans-serif", fontSize: 14, fontWeight: 500, color: "#2c3e2c" }}
              >
                {userType === "entregador" ? "PIN (4 dígitos)" : "Senha"}
              </label>
              <input
                type="password"
                value={password}
                onChange={handlePasswordChange}
                disabled={isLoading}
                placeholder={userType === "entregador" ? "• • • •" : "Digite sua senha"}
                className="twala-input"
                maxLength={userType === "entregador" ? 4 : undefined}
                inputMode={userType === "entregador" ? "numeric" : "text"}
                style={{
                  borderColor: errors.password ? "#d45a5a" : undefined,
                }}
              />
              {errors.password && (
                <p className="mt-1.5 flex items-center gap-1.5" style={{ fontFamily: "'Roboto', sans-serif", fontSize: 12, color: "#d45a5a" }}>
                  <AlertCircle className="w-3.5 h-3.5" />
                  {errors.password}
                </p>
              )}
            </div>

            {/* Lembrar + Esqueceu senha */}
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="twala-checkbox"
                />
                <span style={{ fontFamily: "'Roboto', sans-serif", fontSize: 14, color: "#5a6b5a" }}>
                  Lembrar-me
                </span>
              </label>
              <button
                type="button"
                onClick={() => navigate("/forgot-password")}
                style={{ fontFamily: "'Roboto', sans-serif", fontSize: 14, color: GREEN, fontWeight: 500 }}
                className="hover:opacity-75 transition-opacity"
              >
                Esqueceu a senha?
              </button>
            </div>

            {/* Botão entrar */}
            <button
              type="submit"
              disabled={isLoading}
              className="twala-btn-primary w-full flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
              style={{ padding: "13px 24px", fontSize: 15 }}
            >
              {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
              {isLoading ? "A entrar..." : "Entrar"}
            </button>

            {/* Erro de autenticação */}
            {error && (
              <div
                className="p-3 rounded-xl flex items-start gap-2"
                style={{
                  backgroundColor: "rgba(212,90,90,0.06)",
                  border: "1px solid rgba(212,90,90,0.2)",
                  borderLeft: "3px solid #d45a5a",
                }}
              >
                <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" style={{ color: "#d45a5a" }} />
                <span style={{ fontFamily: "'Roboto', sans-serif", fontSize: 14, color: "#a03030" }}>{error}</span>
              </div>
            )}
          </form>

          {/* Criar conta */}
          <div
            className="mt-6 pt-6 text-center"
            style={{ borderTop: "1px solid rgba(44,85,48,0.08)" }}
          >
            <p style={{ fontFamily: "'Roboto', sans-serif", fontSize: 14, color: "#5a6b5a" }}>
              Não tem uma conta?{" "}
              <Link
                to="/register"
                style={{ color: GREEN, fontWeight: 600, fontFamily: "'Roboto', sans-serif" }}
                className="hover:opacity-75 transition-opacity"
              >
                Criar conta
              </Link>
            </p>
            <p style={{ fontFamily: "'Roboto', sans-serif", fontSize: 13, color: "#7a8a7a", marginTop: 10 }}>
              É administrador?{" "}
              <a
                href={getAdminAppUrl("/admin/login")}
                style={{ color: GREEN, fontWeight: 600, fontFamily: "'Roboto', sans-serif" }}
                className="hover:opacity-75 transition-opacity"
              >
                Entrar na área privada
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
