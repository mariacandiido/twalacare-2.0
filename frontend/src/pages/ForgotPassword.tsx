import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Mail, Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import { authService } from "../services/authService";

const GREEN = "#2c5530";
// const GOLD = "#c7a252";

export function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setIsLoading(true);
    setError(null);

    try {
      const result = await authService.forgotPassword(email);
      if (result.success) {
        setIsSubmitted(true);
      } else {
        setError(result.error || "Ocorreu um erro ao processar seu pedido.");
      }
    } catch (err) {
      setError("Erro de conexão. Tente novamente mais tarde.");
    } finally {
      setIsLoading(false);
    }
  };

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
          <Link
            to="/login"
            className="inline-flex items-center gap-2 mb-6 transition-opacity hover:opacity-75"
            style={{ color: GREEN, fontSize: 14, fontWeight: 500 }}
          >
            <ArrowLeft className="w-4 h-4" />
            Voltar para o login
          </Link>

          <h2
            className="mb-2"
            style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 600, color: "#2c3e2c", fontSize: 24 }}
          >
            Recuperar senha
          </h2>
          <p style={{ fontFamily: "'Roboto', sans-serif", color: "#5a6b5a", fontSize: 14, lineHeight: 1.6 }}>
            Digite o e-mail associado à sua conta e enviaremos um link para redefinir sua senha.
          </p>
        </div>

        {isSubmitted ? (
          <div className="text-center py-6 twala-page-enter">
            <div className="flex justify-center mb-6">
              <div
                className="w-16 h-16 rounded-full flex items-center justify-center"
                style={{ backgroundColor: "rgba(44,85,48,0.1)" }}
              >
                <CheckCircle2 className="w-8 h-8" style={{ color: GREEN }} />
              </div>
            </div>
            <h3 className="mb-3 text-lg font-semibold" style={{ color: "#2c3e2c" }}>E-mail Enviado!</h3>
            <p className="mb-8 text-sm leading-relaxed" style={{ color: "#5a6b5a" }}>
              Se o e-mail <strong>{email}</strong> estiver associado a uma conta, 
              um link de recuperação foi enviado para a sua caixa de entrada.
            </p>
            <Link
              to="/login"
              className="twala-btn-primary block w-full py-3"
              style={{ textAlign: "center", textDecoration: "none" }}
            >
              Voltar ao Início
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label
                className="block mb-2 text-sm font-medium"
                style={{ color: "#2c3e2c" }}
              >
                E-mail da conta
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: "#7a8a7a" }} />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="exemplo@email.com"
                  className="twala-input pl-11"
                />
              </div>
            </div>

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
                <span className="text-sm" style={{ color: "#a03030" }}>{error}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading || !email}
              className="twala-btn-primary w-full flex items-center justify-center gap-2 py-3.5 h-12"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  A processar...
                </>
              ) : (
                "Enviar link de recuperação"
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
