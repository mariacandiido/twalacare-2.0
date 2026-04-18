import { useState } from "react";
import { useTheme, type Theme, type Lang } from "../../contexts/ThemeContext";

// ─────────────────────────────────────────────
// Tipos
// ─────────────────────────────────────────────
type Secao = "seguranca" | "preferencias";
type TipoToast = "sucesso" | "erro";

// ─────────────────────────────────────────────
// Toast de feedback (aparece no canto superior direito)
// ─────────────────────────────────────────────
function Toast({
  mensagem,
  tipo,
  visivel,
}: {
  mensagem: string;
  tipo: TipoToast;
  visivel: boolean;
}) {
  return (
    <div
      style={{
        position: "fixed",
        top: 24,
        right: 24,
        zIndex: 9999,
        padding: "12px 20px",
        borderRadius: 10,
        backgroundColor: tipo === "sucesso" ? "#2c5530" : "#d45a5a",
        color: "#fff",
        fontFamily: "'Roboto', sans-serif",
        fontSize: 14,
        fontWeight: 500,
        boxShadow: "0 8px 24px rgba(0,0,0,0.18)",
        transform: visivel ? "translateY(0)" : "translateY(-16px)",
        opacity: visivel ? 1 : 0,
        transition: "all 0.3s ease",
        pointerEvents: "none",
        maxWidth: 320,
      }}
    >
      {mensagem}
    </div>
  );
}

// ─────────────────────────────────────────────
// Seção Segurança
// ─────────────────────────────────────────────
function SecaoSeguranca({
  onFeedback,
}: {
  onFeedback: (tipo: TipoToast, msg: string) => void;
}) {
  const [form, setForm] = useState({ atual: "", nova: "", confirmar: "" });
  const [twoFA, setTwoFA] = useState<boolean>(() => {
    try { return JSON.parse(localStorage.getItem("twala_2fa") ?? "false"); }
    catch { return false; }
  });
  const [loading, setLoading] = useState(false);

  const forcaSenha = (s: string) => {
    if (s.length === 0) return 0;
    if (s.length < 4) return 1;
    if (s.length < 6) return 2;
    if (s.length < 8) return 3;
    return 4;
  };

  const forca = forcaSenha(form.nova);
  const labelForca = ["", "Fraca", "Razoável", "Boa", "Forte"][forca];
  const corForca = ["", "#d45a5a", "#e5933a", "#c7a252", "#2c5530"][forca];

  const handleAtualizar = async () => {
    if (!form.atual.trim()) {
      onFeedback("erro", "Insira a senha actual.");
      return;
    }
    if (form.nova.length < 6) {
      onFeedback("erro", "A nova senha deve ter pelo menos 6 caracteres.");
      return;
    }
    if (form.nova !== form.confirmar) {
      onFeedback("erro", "As senhas não coincidem.");
      return;
    }
    setLoading(true);
    await new Promise((r) => setTimeout(r, 700));
    setLoading(false);
    setForm({ atual: "", nova: "", confirmar: "" });
    onFeedback("sucesso", "Senha actualizada com sucesso.");
  };

  const toggle2FA = async () => {
    const novo = !twoFA;
    setTwoFA(novo);
    localStorage.setItem("twala_2fa", JSON.stringify(novo));
    onFeedback(
      "sucesso",
      novo ? "2FA activado. A sua conta está mais segura." : "2FA desactivado."
    );
  };

  const inputStyle: React.CSSProperties = {
    width: "100%",
    padding: "11px 14px",
    border: "1.5px solid #d5e8d6",
    borderRadius: 8,
    fontFamily: "'Roboto', sans-serif",
    fontSize: 14,
    color: "#2c3e2c",
    backgroundColor: "#fff",
    outline: "none",
    boxSizing: "border-box",
    transition: "border-color 0.2s",
  };

  const labelStyle: React.CSSProperties = {
    display: "block",
    fontFamily: "'Roboto', sans-serif",
    fontWeight: 500,
    fontSize: 12,
    color: "#4a7856",
    textTransform: "uppercase",
    letterSpacing: "0.06em",
    marginBottom: 6,
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>

      {/* Alterar senha */}
      <div style={{ backgroundColor: "#fff", borderRadius: 14, border: "1px solid #e8f0e8", padding: "28px 28px 24px", boxShadow: "0 1px 6px rgba(44,85,48,0.06)" }}>
        <h2 style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 600, fontSize: 16, color: "#2c3e2c", margin: "0 0 4px" }}>
          Alterar Senha
        </h2>
        <p style={{ fontFamily: "'Roboto', sans-serif", fontSize: 13, color: "#7a8a7a", margin: "0 0 24px" }}>
          Use uma senha forte e única para proteger a sua conta.
        </p>

        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div>
            <label style={labelStyle}>Senha actual</label>
            <input
              type="password"
              value={form.atual}
              onChange={(e) => setForm((p) => ({ ...p, atual: e.target.value }))}
              placeholder="Insira a senha actual"
              style={inputStyle}
              onFocus={(e) => (e.currentTarget.style.borderColor = "#2c5530")}
              onBlur={(e) => (e.currentTarget.style.borderColor = "#d5e8d6")}
            />
          </div>

          <div>
            <label style={labelStyle}>Nova senha</label>
            <input
              type="password"
              value={form.nova}
              onChange={(e) => setForm((p) => ({ ...p, nova: e.target.value }))}
              placeholder="Mínimo 6 caracteres"
              style={inputStyle}
              onFocus={(e) => (e.currentTarget.style.borderColor = "#2c5530")}
              onBlur={(e) => (e.currentTarget.style.borderColor = "#d5e8d6")}
            />
            {/* Barra de força */}
            {form.nova.length > 0 && (
              <div style={{ marginTop: 8 }}>
                <div style={{ display: "flex", gap: 4, marginBottom: 4 }}>
                  {[1, 2, 3, 4].map((n) => (
                    <div
                      key={n}
                      style={{
                        flex: 1,
                        height: 4,
                        borderRadius: 2,
                        backgroundColor: n <= forca ? corForca : "#e5e5e5",
                        transition: "background-color 0.25s",
                      }}
                    />
                  ))}
                </div>
                <span style={{ fontFamily: "'Roboto', sans-serif", fontSize: 11, color: corForca }}>
                  {labelForca}
                </span>
              </div>
            )}
          </div>

          <div>
            <label style={labelStyle}>Confirmar nova senha</label>
            <input
              type="password"
              value={form.confirmar}
              onChange={(e) => setForm((p) => ({ ...p, confirmar: e.target.value }))}
              placeholder="Repita a nova senha"
              style={inputStyle}
              onFocus={(e) => (e.currentTarget.style.borderColor = "#2c5530")}
              onBlur={(e) => (e.currentTarget.style.borderColor = "#d5e8d6")}
            />
          </div>
        </div>

        <div style={{ marginTop: 24 }}>
          <button
            onClick={handleAtualizar}
            disabled={loading}
            style={{
              padding: "11px 28px",
              borderRadius: 9,
              border: "none",
              cursor: loading ? "not-allowed" : "pointer",
              backgroundColor: "#2c5530",
              color: "#fff",
              fontFamily: "'Poppins', sans-serif",
              fontWeight: 600,
              fontSize: 14,
              opacity: loading ? 0.7 : 1,
              transition: "opacity 0.2s, transform 0.1s",
              display: "flex",
              alignItems: "center",
              gap: 8,
            }}
            onMouseOver={(e) => { if (!loading) e.currentTarget.style.opacity = "0.88"; }}
            onMouseOut={(e) => { if (!loading) e.currentTarget.style.opacity = "1"; }}
          >
            {loading ? (
              <>
                <span
                  style={{
                    width: 14, height: 14,
                    border: "2px solid rgba(255,255,255,0.3)",
                    borderTop: "2px solid #fff",
                    borderRadius: "50%",
                    display: "inline-block",
                    animation: "twala-spin 0.8s linear infinite",
                  }}
                />
                A actualizar...
              </>
            ) : "Actualizar Senha"}
          </button>
        </div>
      </div>

      {/* 2FA */}
      <div style={{ backgroundColor: "#fff", borderRadius: 14, border: "1px solid #e8f0e8", padding: "24px 28px", boxShadow: "0 1px 6px rgba(44,85,48,0.06)" }}>
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 16 }}>
          <div style={{ flex: 1 }}>
            <h2 style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 600, fontSize: 16, color: "#2c3e2c", margin: "0 0 4px" }}>
              Autenticação de Dois Factores
            </h2>
            <p style={{ fontFamily: "'Roboto', sans-serif", fontSize: 13, color: "#7a8a7a", margin: 0, lineHeight: 1.6 }}>
              Proteja a sua conta com um código enviado ao seu telemóvel em cada início de sessão.
            </p>
            <div
              style={{
                marginTop: 14,
                padding: "9px 14px",
                borderRadius: 8,
                backgroundColor: twoFA ? "rgba(44,85,48,0.06)" : "rgba(212,90,90,0.05)",
                border: `1px solid ${twoFA ? "rgba(44,85,48,0.18)" : "rgba(212,90,90,0.15)"}`,
                display: "inline-block",
              }}
            >
              <span style={{ fontFamily: "'Roboto', sans-serif", fontSize: 12, fontWeight: 500, color: twoFA ? "#2c5530" : "#d45a5a" }}>
                {twoFA ? "✓ Activado — conta protegida" : "✗ Desactivado — conta sem protecção extra"}
              </span>
            </div>
          </div>

          {/* Toggle */}
          <button
            onClick={toggle2FA}
            aria-label={twoFA ? "Desactivar 2FA" : "Activar 2FA"}
            style={{
              position: "relative",
              width: 52,
              height: 28,
              borderRadius: 14,
              border: "none",
              cursor: "pointer",
              backgroundColor: twoFA ? "#2c5530" : "#ccd5cc",
              transition: "background-color 0.3s",
              flexShrink: 0,
              marginTop: 2,
              padding: 0,
            }}
          >
            <span
              style={{
                position: "absolute",
                top: 4,
                left: twoFA ? 28 : 4,
                width: 20,
                height: 20,
                borderRadius: "50%",
                backgroundColor: "#fff",
                boxShadow: "0 1px 4px rgba(0,0,0,0.2)",
                transition: "left 0.3s",
                display: "block",
              }}
            />
          </button>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// Seção Preferências
// ─────────────────────────────────────────────
function SecaoPreferencias({
  onFeedback,
}: {
  onFeedback: (tipo: TipoToast, msg: string) => void;
}) {
  const { theme, setTheme, lang, setLang, fontSize, setFontSize } = useTheme();

  const temas: { value: Theme; label: string; desc: string }[] = [
    { value: "light", label: "Claro",       desc: "Fundo branco, texto escuro" },
    { value: "dark",  label: "Escuro",      desc: "Fundo escuro, texto claro" },
    { value: "auto",  label: "Automático",  desc: "Segue o sistema operativo" },
  ];

  const idiomas: { value: Lang; label: string; flag: string }[] = [
    { value: "pt",    label: "Português",           flag: "🇵🇹" },
    { value: "en",    label: "English",             flag: "🇬🇧" },
    { value: "fr",    label: "Français",            flag: "🇫🇷" },
  ];

  const fontes: { value: number; label: string }[] = [
    { value: 14, label: "Pequeno" },
    { value: 16, label: "Médio"   },
    { value: 18, label: "Grande"  },
  ];

  const cardStyle: React.CSSProperties = {
    backgroundColor: "#fff",
    borderRadius: 14,
    border: "1px solid #e8f0e8",
    padding: "28px 28px 24px",
    boxShadow: "0 1px 6px rgba(44,85,48,0.06)",
  };

  const sectionLabel: React.CSSProperties = {
    fontFamily: "'Poppins', sans-serif",
    fontWeight: 600,
    fontSize: 16,
    color: "#2c3e2c",
    margin: "0 0 4px",
  };

  const sectionSub: React.CSSProperties = {
    fontFamily: "'Roboto', sans-serif",
    fontSize: 13,
    color: "#7a8a7a",
    margin: "0 0 22px",
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>

      {/* Tema */}
      <div style={cardStyle}>
        <h2 style={sectionLabel}>Tema da Interface</h2>
        <p style={sectionSub}>A mudança aplica-se imediatamente em toda a plataforma.</p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12 }}>
          {temas.map((t) => {
            const sel = theme === t.value;
            return (
              <button
                key={t.value}
                onClick={() => { setTheme(t.value); onFeedback("sucesso", `Tema "${t.label}" aplicado.`); }}
                style={{
                  padding: "18px 10px 14px",
                  borderRadius: 10,
                  border: `2px solid ${sel ? "#2c5530" : "#e0ebe0"}`,
                  backgroundColor: sel ? "rgba(44,85,48,0.06)" : "#fafdf9",
                  cursor: "pointer",
                  textAlign: "center",
                  transition: "all 0.18s",
                  position: "relative",
                }}
                onMouseOver={(e) => { if (!sel) e.currentTarget.style.borderColor = "#a0c0a0"; }}
                onMouseOut={(e) => { if (!sel) e.currentTarget.style.borderColor = "#e0ebe0"; }}
              >
                {sel && (
                  <span
                    style={{
                      position: "absolute",
                      top: 8,
                      right: 8,
                      width: 18,
                      height: 18,
                      borderRadius: "50%",
                      backgroundColor: "#2c5530",
                      color: "#fff",
                      fontSize: 10,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    ✓
                  </span>
                )}
                {/* Miniatura visual do tema */}
                <div
                  style={{
                    width: "100%",
                    height: 38,
                    borderRadius: 7,
                    marginBottom: 10,
                    backgroundColor:
                      t.value === "light" ? "#f5f5f5"
                      : t.value === "dark"  ? "#1e2a1e"
                      : "linear-gradient(135deg, #f5f5f5 50%, #1e2a1e 50%)",
                    background:
                      t.value === "auto"
                        ? "linear-gradient(135deg, #f5f5f5 50%, #1e2a1e 50%)"
                        : undefined,
                    border: "1px solid #e0e0e0",
                    overflow: "hidden",
                  }}
                >
                  <div
                    style={{
                      height: "40%",
                      backgroundColor:
                        t.value === "light" ? "#e0e0e0"
                        : t.value === "dark"  ? "#2c3e2c"
                        : undefined,
                    }}
                  />
                </div>
                <p style={{ fontFamily: "'Poppins', sans-serif", fontWeight: sel ? 600 : 500, fontSize: 13, color: sel ? "#2c5530" : "#2c3e2c", margin: "0 0 3px" }}>
                  {t.label}
                </p>
                <p style={{ fontFamily: "'Roboto', sans-serif", fontSize: 11, color: "#9aa89a", margin: 0 }}>
                  {t.desc}
                </p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Idioma */}
      <div style={cardStyle}>
        <h2 style={sectionLabel}>Idioma</h2>
        <p style={sectionSub}>Toda a interface reflecte imediatamente o idioma escolhido.</p>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {idiomas.map((i) => {
            const sel = lang === i.value;
            return (
              <button
                key={i.value}
                onClick={() => { setLang(i.value); onFeedback("sucesso", `Idioma alterado para "${i.label}".`); }}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 14,
                  padding: "12px 16px",
                  borderRadius: 9,
                  border: `1.5px solid ${sel ? "#2c5530" : "#e0ebe0"}`,
                  backgroundColor: sel ? "rgba(44,85,48,0.05)" : "#fafdf9",
                  cursor: "pointer",
                  textAlign: "left",
                  transition: "all 0.18s",
                }}
                onMouseOver={(e) => { if (!sel) e.currentTarget.style.borderColor = "#a0c0a0"; }}
                onMouseOut={(e) => { if (!sel) e.currentTarget.style.borderColor = "#e0ebe0"; }}
              >
                <span style={{ fontSize: 20, flexShrink: 0 }}>{i.flag}</span>
                <span style={{ fontFamily: "'Roboto', sans-serif", fontWeight: sel ? 600 : 400, fontSize: 14, color: sel ? "#2c5530" : "#2c3e2c", flex: 1 }}>
                  {i.label}
                </span>
                {sel && (
                  <span style={{ width: 20, height: 20, borderRadius: "50%", backgroundColor: "#2c5530", color: "#fff", fontSize: 10, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    ✓
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Tamanho da fonte */}
      <div style={cardStyle}>
        <h2 style={sectionLabel}>Tamanho da Fonte</h2>
        <p style={sectionSub}>Ajusta o tamanho do texto em toda a plataforma.</p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12 }}>
          {fontes.map((f) => {
            const sel = fontSize === f.value;
            return (
              <button
                key={f.value}
                onClick={() => { setFontSize(f.value); onFeedback("sucesso", `Tamanho de fonte definido como "${f.label}".`); }}
                style={{
                  padding: "18px 10px",
                  borderRadius: 10,
                  border: `2px solid ${sel ? "#2c5530" : "#e0ebe0"}`,
                  backgroundColor: sel ? "rgba(44,85,48,0.06)" : "#fafdf9",
                  cursor: "pointer",
                  textAlign: "center",
                  transition: "all 0.18s",
                }}
                onMouseOver={(e) => { if (!sel) e.currentTarget.style.borderColor = "#a0c0a0"; }}
                onMouseOut={(e) => { if (!sel) e.currentTarget.style.borderColor = "#e0ebe0"; }}
              >
                <p
                  style={{
                    fontFamily: "'Poppins', sans-serif",
                    fontWeight: 700,
                    fontSize: f.value,
                    color: sel ? "#2c5530" : "#4a7856",
                    margin: "0 0 6px",
                    lineHeight: 1,
                  }}
                >
                  Aa
                </p>
                <p style={{ fontFamily: "'Roboto', sans-serif", fontWeight: sel ? 600 : 400, fontSize: 12, color: sel ? "#2c5530" : "#888", margin: 0 }}>
                  {f.label}
                </p>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// Componente Principal
// ─────────────────────────────────────────────
export function ConfiguracoesCliente() {
  const [secao, setSecao] = useState<Secao>("seguranca");
  const [toast, setToast] = useState({ visivel: false, mensagem: "", tipo: "sucesso" as TipoToast });

  const mostrarToast = (tipo: TipoToast, mensagem: string) => {
    setToast({ visivel: true, tipo, mensagem });
    setTimeout(() => setToast((p) => ({ ...p, visivel: false })), 3000);
  };

  const itens: { id: Secao; label: string }[] = [
    { id: "seguranca",    label: "Segurança"    },
    { id: "preferencias", label: "Preferências" },
  ];

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#f4f7f4", padding: "36px 20px 60px" }}>
      <Toast mensagem={toast.mensagem} tipo={toast.tipo} visivel={toast.visivel} />

      <div style={{ maxWidth: 960, margin: "0 auto" }}>

        {/* Cabeçalho */}
        <div style={{ marginBottom: 32 }}>
          <h1 style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 700, fontSize: "clamp(1.35rem, 3vw, 1.75rem)", color: "#1e2e1e", margin: "0 0 6px" }}>
            Configurações
          </h1>
          <div style={{ width: 48, height: 3, background: "linear-gradient(90deg, #2c5530, #c7a252)", borderRadius: 2 }} />
        </div>

        {/* Menu de navegação em tabs */}
        <div
          style={{
            display: "flex",
            backgroundColor: "#fff",
            borderRadius: 10,
            border: "1px solid #e0ebe0",
            padding: 4,
            marginBottom: 28,
            gap: 4,
            width: "fit-content",
          }}
        >
          {itens.map((item) => {
            const ativo = secao === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setSecao(item.id)}
                style={{
                  padding: "9px 28px",
                  borderRadius: 7,
                  border: "none",
                  backgroundColor: ativo ? "#2c5530" : "transparent",
                  color: ativo ? "#fff" : "#4a5e4a",
                  fontFamily: "'Roboto', sans-serif",
                  fontWeight: ativo ? 600 : 400,
                  fontSize: 14,
                  cursor: "pointer",
                  transition: "all 0.15s",
                }}
                onMouseOver={(e) => {
                  if (!ativo) e.currentTarget.style.backgroundColor = "rgba(44,85,48,0.06)";
                }}
                onMouseOut={(e) => {
                  if (!ativo) e.currentTarget.style.backgroundColor = "transparent";
                }}
              >
                {item.label}
              </button>
            );
          })}
        </div>

        {/* Título da secção activa */}
        <div style={{ marginBottom: 20 }}>
          <h2 style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 600, fontSize: 20, color: "#1e2e1e", margin: "0 0 4px" }}>
            {itens.find((i) => i.id === secao)?.label}
          </h2>
          <p style={{ fontFamily: "'Roboto', sans-serif", fontSize: 13, color: "#7a8a7a", margin: 0 }}>
            {secao === "seguranca"
              ? "Gerencie a sua senha e as opções de segurança da conta."
              : "Personalize o tema, idioma e tamanho de texto da plataforma."}
          </p>
        </div>

        {/* Conteúdo da secção */}
        {secao === "seguranca"    && <SecaoSeguranca    onFeedback={mostrarToast} />}
        {secao === "preferencias" && <SecaoPreferencias onFeedback={mostrarToast} />}
      </div>

      {/* Animação do spinner */}
      <style>{`
        @keyframes twala-spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
