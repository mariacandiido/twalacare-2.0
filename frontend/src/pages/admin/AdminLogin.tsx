import { useEffect, useMemo, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { AlertCircle, Loader2, LockKeyhole, ShieldCheck } from "lucide-react";
import { useAuth } from "../../hooks/useAuth";

const GREEN = "#1f4d2b";
const GOLD = "#c7a252";

export function AdminLogin() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, isLoading, error, clearError, user, isAuthenticated, mockLogout } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fieldErrors, setFieldErrors] = useState<{ email?: string; password?: string }>({});

  const redirectPath = useMemo(() => {
    const from = location.state?.from?.pathname;
    return from?.startsWith("/admin") ? from : "/admin/dashboard";
  }, [location.state]);

  useEffect(() => {
    if (!isAuthenticated || !user) return;
    if (user.tipo !== "admin") {
      // Se existir uma sessão não administrativa nesta app, limpamo-la
      // para evitar redirecionamentos para áreas públicas.
      mockLogout();
      return;
    }

    navigate(redirectPath, { replace: true });
  }, [isAuthenticated, mockLogout, navigate, redirectPath, user]);

  useEffect(() => {
    clearError();
  }, [clearError]);

  const validateEmail = (value: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    clearError();

    const nextErrors: typeof fieldErrors = {};

    if (!validateEmail(email)) {
      nextErrors.email = "Introduza um email administrativo válido.";
    }

    if (password.trim().length < 6) {
      nextErrors.password = "A senha administrativa deve ter pelo menos 6 caracteres.";
    }

    setFieldErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    const success = await login(email.trim(), password, "admin");
    if (success) {
      navigate(redirectPath, { replace: true });
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center px-6 py-10"
      style={{ background: "linear-gradient(145deg, #0f1f14 0%, #17311f 55%, #102217 100%)" }}
    >
      <div className="grid w-full max-w-5xl overflow-hidden rounded-[28px] border border-white/10 bg-white shadow-2xl lg:grid-cols-[1.1fr_0.9fr]">
        <section
          className="hidden lg:flex flex-col justify-between p-10"
          style={{ background: "linear-gradient(160deg, #17311f 0%, #102217 100%)" }}
        >
          <div>
            <div
              className="mb-8 flex h-16 w-16 items-center justify-center rounded-2xl"
              style={{ background: "rgba(199,162,82,0.16)", border: "1px solid rgba(199,162,82,0.28)" }}
            >
              <ShieldCheck className="h-8 w-8" style={{ color: GOLD }} />
            </div>

            <p
              style={{
                color: GOLD,
                fontFamily: "'Roboto', sans-serif",
                fontSize: 12,
                fontWeight: 700,
                letterSpacing: "0.18em",
                textTransform: "uppercase",
              }}
            >
              Acesso Privado
            </p>

            <h1
              className="mt-4"
              style={{
                color: "#ffffff",
                fontFamily: "'Poppins', sans-serif",
                fontSize: 34,
                fontWeight: 700,
                lineHeight: 1.15,
              }}
            >
              Portal administrativo separado da área pública.
            </h1>

            <p
              className="mt-5 max-w-md"
              style={{
                color: "rgba(255,255,255,0.78)",
                fontFamily: "'Roboto', sans-serif",
                fontSize: 16,
                lineHeight: 1.7,
              }}
            >
              O painel do administrador agora entra por uma rota privada própria,
              sem partilhar o fluxo de autenticação com cliente, farmácia ou entregador.
            </p>
          </div>

          <div className="space-y-4">
            {[
              "Entrada dedicada em /admin/login",
              "Redirecionamento exclusivo para /admin/*",
              "Sessão administrativa isolada dos outros painéis",
            ].map((item) => (
              <div
                key={item}
                className="flex items-center gap-3 rounded-2xl px-4 py-3"
                style={{ backgroundColor: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }}
              >
                <div
                  className="flex h-9 w-9 items-center justify-center rounded-xl"
                  style={{ backgroundColor: "rgba(199,162,82,0.14)" }}
                >
                  <LockKeyhole className="h-4 w-4" style={{ color: GOLD }} />
                </div>
                <span style={{ color: "#ffffff", fontFamily: "'Roboto', sans-serif", fontSize: 14 }}>
                  {item}
                </span>
              </div>
            ))}
          </div>
        </section>

        <section className="p-6 sm:p-8 lg:p-10" style={{ backgroundColor: "#fcfbf8" }}>
          <div className="mx-auto w-full max-w-md">
            <div className="mb-8 flex items-center justify-between">
              <div>
                <p
                  style={{
                    color: GREEN,
                    fontFamily: "'Roboto', sans-serif",
                    fontSize: 12,
                    fontWeight: 700,
                    letterSpacing: "0.15em",
                    textTransform: "uppercase",
                  }}
                >
                  Admin
                </p>
                <h2
                  className="mt-2"
                  style={{ color: "#1c2d1f", fontFamily: "'Poppins', sans-serif", fontSize: 28, fontWeight: 700 }}
                >
                  Entrar no painel
                </h2>
                <p
                  className="mt-2"
                  style={{ color: "#5d6a60", fontFamily: "'Roboto', sans-serif", fontSize: 14, lineHeight: 1.7 }}
                >
                  Utilize as credenciais administrativas para aceder à área privada.
                </p>
              </div>

              <div
                className="flex h-14 w-14 items-center justify-center rounded-2xl"
                style={{ background: `linear-gradient(135deg, ${GREEN}, #2d6a3a)` }}
              >
                <ShieldCheck className="h-7 w-7" style={{ color: "#ffffff" }} />
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label
                  className="mb-1.5 block"
                  style={{ color: "#243428", fontFamily: "'Roboto', sans-serif", fontSize: 14, fontWeight: 500 }}
                >
                  Email administrativo
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(event) => {
                    setEmail(event.target.value);
                    setFieldErrors((prev) => ({ ...prev, email: undefined }));
                  }}
                  disabled={isLoading}
                  placeholder="admin@empresa.com"
                  className="twala-input"
                  style={{ borderColor: fieldErrors.email ? "#d45a5a" : undefined }}
                />
                {fieldErrors.email && (
                  <p className="mt-1.5 flex items-center gap-1.5" style={{ color: "#d45a5a", fontSize: 12 }}>
                    <AlertCircle className="h-3.5 w-3.5" />
                    {fieldErrors.email}
                  </p>
                )}
              </div>

              <div>
                <label
                  className="mb-1.5 block"
                  style={{ color: "#243428", fontFamily: "'Roboto', sans-serif", fontSize: 14, fontWeight: 500 }}
                >
                  Senha
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(event) => {
                    setPassword(event.target.value);
                    setFieldErrors((prev) => ({ ...prev, password: undefined }));
                  }}
                  disabled={isLoading}
                  placeholder="Introduza a senha administrativa"
                  className="twala-input"
                  style={{ borderColor: fieldErrors.password ? "#d45a5a" : undefined }}
                />
                {fieldErrors.password && (
                  <p className="mt-1.5 flex items-center gap-1.5" style={{ color: "#d45a5a", fontSize: 12 }}>
                    <AlertCircle className="h-3.5 w-3.5" />
                    {fieldErrors.password}
                  </p>
                )}
              </div>

              {error && (
                <div
                  className="flex items-start gap-2 rounded-2xl p-3"
                  style={{
                    backgroundColor: "rgba(212,90,90,0.06)",
                    border: "1px solid rgba(212,90,90,0.18)",
                    borderLeft: "3px solid #d45a5a",
                  }}
                >
                  <AlertCircle className="mt-0.5 h-4 w-4 flex-shrink-0" style={{ color: "#d45a5a" }} />
                  <span style={{ color: "#a03030", fontFamily: "'Roboto', sans-serif", fontSize: 14 }}>
                    {error}
                  </span>
                </div>
              )}

              <button
                type="submit"
                disabled={isLoading}
                className="twala-btn-primary flex w-full items-center justify-center gap-2 disabled:cursor-not-allowed disabled:opacity-60"
                style={{ padding: "13px 24px", fontSize: 15 }}
              >
                {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
                {isLoading ? "A validar acesso..." : "Entrar no admin"}
              </button>
            </form>

            <div
              className="mt-6 rounded-2xl p-4"
              style={{ backgroundColor: "rgba(31,77,43,0.04)", border: "1px solid rgba(31,77,43,0.08)" }}
            >
              <p style={{ color: "#304437", fontFamily: "'Roboto', sans-serif", fontSize: 13, lineHeight: 1.7 }}>
                Esta entrada é reservada ao administrador. Para cliente, farmácia ou entregador,
                continue pelo login principal da plataforma.
              </p>
            </div>

            <div className="mt-6 flex items-center justify-between gap-4 text-sm">
              <Link
                to="/login"
                style={{ color: GREEN, fontFamily: "'Roboto', sans-serif", fontWeight: 600 }}
                className="transition-opacity hover:opacity-75"
              >
                Ir para o login público
              </Link>
              <Link
                to="/"
                style={{ color: "#6a776d", fontFamily: "'Roboto', sans-serif", fontWeight: 500 }}
                className="transition-opacity hover:opacity-75"
              >
                Voltar ao site
              </Link>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
