import { useState, useEffect } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { Lock, Loader2, CheckCircle2, AlertCircle, Eye, EyeOff } from "lucide-react";
import { authService } from "../services/authService";

const GREEN = "#2c5530";
// const GOLD = "#c7a252";

export function ResetPassword() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!token) {
      setError("Token de redefinição ausente ou inválido.");
    }
  }, [token]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;

    if (password.length < 6) {
      setError("A senha deve ter pelo menos 6 caracteres.");
      return;
    }

    if (password !== confirmPassword) {
      setError("As senhas não coincidem.");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const result = await authService.resetPassword(token, password);
      if (result.success) {
        setIsSuccess(true);
      } else {
        setError(result.error || "Ocorreu um erro ao redefinir sua senha.");
      }
    } catch (err) {
      setError("Erro de conexão. Tente novamente mais tarde.");
    } finally {
      setIsLoading(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6" style={{ backgroundColor: "#faf7f2" }}>
        <div
          className="w-full max-w-md rounded-2xl p-10 bg-white text-center twala-page-enter"
          style={{
            boxShadow: "0 8px 40px rgba(0,0,0,0.08)",
            border: "1px solid rgba(44,85,48,0.08)",
          }}
        >
          <div className="flex justify-center mb-6">
            <div
              className="w-20 h-20 rounded-full flex items-center justify-center"
              style={{ backgroundColor: "rgba(44,85,48,0.1)" }}
            >
              <CheckCircle2 className="w-10 h-10" style={{ color: GREEN }} />
            </div>
          </div>
          <h2 className="mb-4 text-2xl font-bold" style={{ color: "#2c3e2c", fontFamily: "'Poppins', sans-serif" }}>
            Senha Atualizada!
          </h2>
          <p className="mb-10 text-base leading-relaxed" style={{ color: "#5a6b5a" }}>
            Sua senha foi redefinida com sucesso. Agora você pode acessar sua conta com as novas credenciais.
          </p>
          <Link
            to="/login"
            className="twala-btn-primary block w-full py-4 font-semibold no-underline"
          >
            Fazer Login Agora
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-6" style={{ backgroundColor: "#faf7f2" }}>
      <div
        className="w-full max-w-md rounded-2xl p-8 bg-white"
        style={{
          boxShadow: "0 8px 40px rgba(0,0,0,0.08)",
          border: "1px solid rgba(44,85,48,0.08)",
        }}
      >
        <div className="mb-8">
          <h2
            className="mb-2"
            style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 600, color: "#2c3e2c", fontSize: 24 }}
          >
            Nova Senha
          </h2>
          <p style={{ fontFamily: "'Roboto', sans-serif", color: "#5a6b5a", fontSize: 14, lineHeight: 1.6 }}>
            Crie uma senha forte e segura para proteger sua conta.
          </p>
        </div>

        {!token && (
          <div
            className="p-4 mb-6 rounded-xl flex items-start gap-3"
            style={{ backgroundColor: "#fef2f2", border: "1px solid #fee2e2" }}
          >
            <AlertCircle className="w-5 h-5 mt-0.5 flex-shrink-0" style={{ color: "#ef4444" }} />
            <div>
              <p className="text-sm font-semibold text-red-800">Token Inválido</p>
              <p className="text-sm text-red-700 mt-1">
                O link de redefinição parece estar corrompido ou expirado. 
                Por favor, solicite um novo link.
              </p>
              <Link to="/forgot-password" title="Pedir novo link" className="text-sm font-bold mt-2 block" style={{ color: GREEN }}>
                Solicitar novo link
              </Link>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div>
              <label className="block mb-1.5 text-sm font-medium" style={{ color: "#2c3e2c" }}> Nova Senha </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: "#7a8a7a" }} />
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Mínimo 6 caracteres"
                  className="twala-input pl-11 pr-11"
                  disabled={!token || isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div>
              <label className="block mb-1.5 text-sm font-medium" style={{ color: "#2c3e2c" }}> Confirmar Senha </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: "#7a8a7a" }} />
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Repita a nova senha"
                  className="twala-input pl-11"
                  disabled={!token || isLoading}
                />
              </div>
            </div>
          </div>

          {error && !isSuccess && (
            <div
              className="p-3 rounded-xl flex items-start gap-2"
              style={{
                backgroundColor: "rgba(212,90,90,0.06)",
                border: "1px solid rgba(212,90,90,0.2)",
                borderLeft: "3px solid #d45a5a",
              }}
            >
              <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" style={{ color: "#d45a5a" }} />
              <span className="text-sm" style={{ color: "#a03030" }}>{error}</span>
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading || !token || !password || !confirmPassword}
            className="twala-btn-primary w-full flex items-center justify-center gap-2 py-3.5 h-12"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                A atualizar...
              </>
            ) : (
                "Redefinir Senha"
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
