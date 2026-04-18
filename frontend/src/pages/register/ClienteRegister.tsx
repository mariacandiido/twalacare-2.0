import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import {
  GoldDivider, FieldInput, PasswordInput,
  PasswordRules, TermsCheckbox, SubmitButton, OptionalAccordion,
  SelectProvincia, SelectMunicipio, Toast,
  GREEN, GOLD, RED,
  formatPhone, validateEmail, passwordValid,
} from "./shared";

export function ClienteRegister({ onBack }: { onBack: () => void }) {
  const navigate  = useNavigate();
  const { register } = useAuth();

  // Campos obrigatórios
  const [nome,            setNome]            = useState("");
  const [email,           setEmail]           = useState("");
  const [telefone,        setTelefone]        = useState("");
  const [password,        setPassword]        = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [termos,          setTermos]          = useState(false);

  // Campos opcionais
  const [endereco,  setEndereco]  = useState("");
  const [bairro,    setBairro]    = useState("");
  const [provincia, setProvincia] = useState("");
  const [municipio, setMunicipio] = useState("");

  const [errors,    setErrors]    = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [toast,     setToast]     = useState<{ type: "success" | "error"; msg: string } | null>(null);

  const clearErr = (k: string) => setErrors((p) => { const n = { ...p }; delete n[k]; return n; });

  const validate = (): boolean => {
    const e: Record<string, string> = {};
    if (!nome.trim())               e.nome     = "Nome é obrigatório";
    if (!email.trim())              e.email    = "Email é obrigatório";
    else if (!validateEmail(email)) e.email    = "Email inválido";
    if (!telefone.trim())           e.telefone = "Telefone é obrigatório";
    else if (telefone.replace(/\D/g, "").length < 9) e.telefone = "Número inválido (mínimo 9 dígitos)";
    if (!passwordValid(password))   e.password = "A senha não cumpre os requisitos";
    if (password.trim() !== confirmPassword.trim()) e.confirmPassword = "As senhas não coincidem";
    if (!termos)                    e.termos   = "É necessário aceitar os termos";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!validate()) {
      // Scroll para o primeiro erro
      const firstErr = document.querySelector("[data-field-error]");
      firstErr?.scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }
    setIsLoading(true);
    try {
      const result = await register({
        nome, email, telefone, password, confirmPassword,
        tipo: "cliente",
        ...(endereco  && { endereco }),
        ...(bairro    && { bairro }),
        ...(provincia && { provincia }),
        ...(municipio && { municipio }),
      } as Parameters<typeof register>[0]);

      if (!result.success) {
        setToast({ type: "error", msg: result.message });
        return;
      }

      setToast({ type: "success", msg: "Conta criada com sucesso! ✓ Bem-vindo(a) ao TwalaCare!" });
      setTimeout(() => navigate("/"), 2000);
    } catch {
      setToast({ type: "error", msg: "Ocorreu um erro inesperado. Tente novamente." });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-start justify-center p-6 twala-page-enter"
      style={{ backgroundColor: "#faf7f2" }}>
      {toast && <Toast type={toast.type} message={toast.msg} onClose={() => setToast(null)} />}

      <div className="w-full max-w-lg rounded-2xl p-8 my-6"
        style={{ backgroundColor: "#fff", boxShadow: "0 8px 40px rgba(0,0,0,0.08)", border: "1px solid rgba(44,85,48,0.08)" }}>

          {/* Logo */}
          <div className="flex justify-center mb-5">
            <div className="w-12 h-12 rounded-2xl flex items-center justify-center"
              style={{ background: `linear-gradient(135deg, ${GREEN}, #4a7856)` }}>
              <span style={{ color: GOLD, fontFamily: "'Poppins',sans-serif", fontWeight: 700, fontSize: 22 }}>T</span>
            </div>
          </div>

          {/* Cabeçalho */}
          <div className="flex items-start justify-between mb-6">
            <div>
              <h2 style={{ fontFamily: "'Poppins',sans-serif", fontWeight: 600, color: "#2c3e2c", fontSize: 21 }}>
                Criar conta de Cliente
              </h2>
              <p style={{ fontFamily: "'Roboto',sans-serif", color: "#5a6b5a", fontSize: 13, marginTop: 3 }}>
                Preencha os seus dados para criar a conta
              </p>
            </div>
            <button type="button" onClick={onBack}
              className="text-sm px-3 py-1.5 rounded-lg transition-colors flex-shrink-0"
              style={{ color: GREEN, border: "1px solid rgba(44,85,48,0.2)", fontFamily: "'Roboto',sans-serif", fontSize: 12 }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "rgba(44,85,48,0.05)")}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
            >
              ← Voltar
            </button>
          </div>

          <GoldDivider />

          <form onSubmit={handleSubmit} className="space-y-4 mt-5">

            {/* Nome */}
            <div data-field-error={errors.nome || undefined}>
              <FieldInput
                label="Nome completo" required
                value={nome} onChange={(v) => { setNome(v); clearErr("nome"); }}
                placeholder="Digite o seu nome completo"
                error={errors.nome}
                autoComplete="name"
              />
            </div>

            {/* Email */}
            <div data-field-error={errors.email || undefined}>
              <FieldInput
                label="Email" required type="email"
                value={email} onChange={(v) => { setEmail(v); clearErr("email"); }}
                placeholder="seu@email.com"
                error={errors.email}
                hint="Formato: nome@exemplo.com"
                autoComplete="email"
              />
            </div>

            {/* Telefone */}
            <div data-field-error={errors.telefone || undefined}>
              <FieldInput
                label="Número de telefone" required
                value={telefone}
                onChange={(v) => { setTelefone(formatPhone(v)); clearErr("telefone"); }}
                placeholder="9XX XXX XXX"
                error={errors.telefone}
                hint="Formato esperado: +244 900 000 000"
                inputMode="numeric"
                autoComplete="tel"
              />
            </div>

            {/* Senha */}
            <div data-field-error={errors.password || undefined}>
              <PasswordInput
                label="Senha" required
                value={password} onChange={(v) => { setPassword(v); clearErr("password"); }}
                placeholder="Crie uma senha segura"
                error={errors.password}
                autoComplete="new-password"
              />
              <PasswordRules password={password} />
            </div>

            {/* Confirmar senha */}
            <div data-field-error={errors.confirmPassword || undefined}>
              <PasswordInput
                label="Confirmar senha" required
                value={confirmPassword} onChange={(v) => { setConfirmPassword(v); clearErr("confirmPassword"); }}
                placeholder="Repita a senha"
                error={errors.confirmPassword}
                autoComplete="new-password"
              />
              {/* Indicador de correspondência */}
              {confirmPassword && (
              <p className="mt-1.5"
                style={{ fontFamily: "'Roboto',sans-serif", fontSize: 12, color: password.trim() === confirmPassword.trim() ? GREEN : RED }}>
                {password.trim() === confirmPassword.trim() ? "✓ Senhas coincidem" : "✗ Senhas não coincidem"}
              </p>
            )}
            </div>

            {/* Campos opcionais em accordion */}
            <OptionalAccordion label="+ Adicionar endereço (opcional)">
              <FieldInput
                label="Endereço completo"
                value={endereco} onChange={setEndereco}
                placeholder="Rua, Avenida, Número..."
              />
              <FieldInput
                label="Bairro"
                value={bairro} onChange={setBairro}
                placeholder="Nome do bairro"
              />
              <div className="grid grid-cols-2 gap-3">
                <SelectProvincia
                  value={provincia}
                  onChange={(v) => { setProvincia(v); setMunicipio(""); }}
                />
                <SelectMunicipio
                  provincia={provincia}
                  value={municipio}
                  onChange={setMunicipio}
                />
              </div>
            </OptionalAccordion>

            {/* Termos */}
            <div data-field-error={errors.termos || undefined}>
              <TermsCheckbox checked={termos} onChange={(v) => { setTermos(v); clearErr("termos"); }} error={errors.termos} />
            </div>

            <GoldDivider />

            {/* Botões */}
            <div className="flex flex-col sm:flex-row gap-3 pt-1">
              <button
                type="button" onClick={onBack}
                className="twala-btn-outline flex-1"
                style={{ padding: "12px 24px", fontSize: 14 }}
              >
                Cancelar
              </button>
              <div className="flex-1">
                <SubmitButton loading={isLoading} label="Criar Conta" loadingLabel="A criar conta..." />
              </div>
            </div>

          </form>

          {/* Link login */}
          <div className="mt-6 pt-5 text-center" style={{ borderTop: "1px solid rgba(44,85,48,0.08)" }}>
            <p style={{ fontFamily: "'Roboto',sans-serif", fontSize: 14, color: "#5a6b5a" }}>
              Já tem conta?{" "}
              <Link to="/login" style={{ color: GREEN, fontWeight: 600 }} className="hover:opacity-75 transition-opacity">
                Entrar
              </Link>
            </p>
          </div>
      </div>
    </div>
  );
}
