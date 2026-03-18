import { useState, type ReactNode, type CSSProperties } from "react";
import { useAuth } from "../../hooks/useAuth";

const G = "#2c5530";
const GOLD = "#c7a252";

function SectionCard({ titulo, children }: { titulo: string; children: ReactNode }) {
  return (
    <div style={{ backgroundColor: "#fff", borderRadius: 14, border: "1px solid #e8f0e8", boxShadow: "0 2px 8px rgba(44,85,48,0.06)", overflow: "hidden", marginBottom: 20 }}>
      <div style={{ padding: "16px 24px", borderBottom: "1px solid #f0f5f0", backgroundColor: "#fafdf9" }}>
        <h2 style={{ fontFamily: "'Poppins',sans-serif", fontWeight: 600, fontSize: 14, color: "#1a3320", margin: 0 }}>{titulo}</h2>
      </div>
      <div style={{ padding: "22px 24px" }}>
        {children}
      </div>
    </div>
  );
}

function Campo({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div style={{ marginBottom: 18 }}>
      <label style={{ display: "block", fontFamily: "'Roboto',sans-serif", fontWeight: 500, fontSize: 11, color: "#4a7856", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 7 }}>
        {label}
      </label>
      {children}
    </div>
  );
}

const inputStyle: CSSProperties = {
  width: "100%",
  padding: "10px 13px",
  border: "1.5px solid #d5e8d6",
  borderRadius: 9,
  fontFamily: "'Roboto',sans-serif",
  fontSize: 14,
  color: "#2c3e2c",
  outline: "none",
  backgroundColor: "#fff",
  boxSizing: "border-box",
  transition: "border-color 0.2s",
};

export function AdminConfiguracoes() {
  const { user } = useAuth();

  const [perfil, setPerfil]       = useState({ nome: user?.nome ?? "Administrador", email: user?.email ?? "admin@twalcare.com" });
  const [senhas, setSenhas]       = useState({ atual: "", nova: "", confirmar: "" });
  const [toast, setToast]         = useState({ visivel: false, msg: "", ok: true });
  const [salvandoPerfil, setSalvandoPerfil] = useState(false);
  const [salvandoSenha, setSalvandoSenha]   = useState(false);

  const mostrarToast = (msg: string, ok = true) => {
    setToast({ visivel: true, msg, ok });
    setTimeout(() => setToast((p) => ({ ...p, visivel: false })), 3500);
  };

  const handleSalvarPerfil = () => {
    if (!perfil.nome.trim() || !perfil.email.trim()) {
      mostrarToast("Preencha todos os campos do perfil.", false);
      return;
    }
    setSalvandoPerfil(true);
    setTimeout(() => {
      setSalvandoPerfil(false);
      mostrarToast("Perfil actualizado com sucesso.");
    }, 800);
  };

  const validarSenha = (s: string) => s.length >= 6;
  const forcaSenha = (s: string) => !s ? 0 : s.length < 6 ? 1 : s.length < 10 ? 2 : /[A-Z]/.test(s) && /\d/.test(s) ? 4 : 3;
  const corForca = [" ", "#d45a5a", GOLD, G, "#2a7a3d"];
  const labelForca = ["", "Fraca", "Razoável", "Boa", "Forte"];

  const handleSalvarSenha = () => {
    if (!senhas.atual) { mostrarToast("Introduza a senha actual.", false); return; }
    if (!validarSenha(senhas.nova)) { mostrarToast("Nova senha deve ter pelo menos 6 caracteres.", false); return; }
    if (senhas.nova !== senhas.confirmar) { mostrarToast("As senhas não coincidem.", false); return; }
    setSalvandoSenha(true);
    setTimeout(() => {
      setSalvandoSenha(false);
      setSenhas({ atual: "", nova: "", confirmar: "" });
      mostrarToast("Senha alterada com sucesso.");
    }, 800);
  };

  const toggleNotif = (id: string) =>
    setNotifs((prev) => prev.map((n) => n.id === id ? { ...n, ativo: !n.ativo } : n));

  const forca = forcaSenha(senhas.nova);

  return (
    <div style={{ maxWidth: 680 }}>
      {/* Toast */}
      <div style={{
        position: "fixed", top: 24, right: 24, zIndex: 9999,
        padding: "12px 20px", borderRadius: 10,
        backgroundColor: toast.ok ? G : "#d45a5a",
        color: "#fff", fontFamily: "'Roboto',sans-serif", fontSize: 14, fontWeight: 500,
        boxShadow: "0 8px 24px rgba(0,0,0,0.18)",
        transform: toast.visivel ? "translateY(0)" : "translateY(-20px)",
        opacity: toast.visivel ? 1 : 0, transition: "all 0.3s", pointerEvents: "none",
      }}>
        {toast.msg}
      </div>

      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontFamily: "'Poppins',sans-serif", fontWeight: 700, fontSize: "clamp(1.2rem,3vw,1.6rem)", color: "#1a3320", margin: "0 0 4px" }}>Configurações</h1>
        <p style={{ fontFamily: "'Roboto',sans-serif", fontSize: 13, color: "#7a8a7a", margin: 0 }}>Gerencie o perfil e as preferências do administrador.</p>
      </div>

      {/* Avatar */}
      <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 28, padding: "18px 24px", backgroundColor: "#fff", borderRadius: 14, border: "1px solid #e8f0e8", boxShadow: "0 2px 8px rgba(44,85,48,0.06)" }}>
        <div style={{ width: 60, height: 60, borderRadius: "50%", backgroundColor: G, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
          <span style={{ fontFamily: "'Poppins',sans-serif", fontWeight: 700, fontSize: 22, color: "#fff" }}>
            {perfil.nome.split(" ").slice(0,2).map((n) => n[0].toUpperCase()).join("")}
          </span>
        </div>
        <div>
          <p style={{ fontFamily: "'Poppins',sans-serif", fontWeight: 700, fontSize: 16, color: "#1a3320", margin: 0 }}>{perfil.nome}</p>
          <p style={{ fontFamily: "'Roboto',sans-serif", fontSize: 13, color: "#7a8a7a", margin: "3px 0 0" }}>{perfil.email}</p>
          <span style={{ padding: "2px 10px", borderRadius: 20, backgroundColor: "rgba(199,162,82,0.12)", color: "#8a6e25", fontFamily: "'Roboto',sans-serif", fontSize: 11, fontWeight: 600, display: "inline-block", marginTop: 5 }}>
            Administrador
          </span>
        </div>
      </div>

      {/* Perfil */}
      <SectionCard titulo="Dados do Perfil">
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 20px" }}>
          <Campo label="Nome completo">
            <input
              value={perfil.nome}
              onChange={(e) => setPerfil((p) => ({ ...p, nome: e.target.value }))}
              style={inputStyle}
              onFocus={(e) => (e.currentTarget.style.borderColor = G)}
              onBlur={(e) => (e.currentTarget.style.borderColor = "#d5e8d6")}
            />
          </Campo>
          <Campo label="Endereço de email">
            <input
              value={perfil.email}
              onChange={(e) => setPerfil((p) => ({ ...p, email: e.target.value }))}
              type="email"
              style={inputStyle}
              onFocus={(e) => (e.currentTarget.style.borderColor = G)}
              onBlur={(e) => (e.currentTarget.style.borderColor = "#d5e8d6")}
            />
          </Campo>
        </div>
        <button
          onClick={handleSalvarPerfil}
          disabled={salvandoPerfil}
          style={{ padding: "10px 24px", borderRadius: 9, border: "none", backgroundColor: G, color: "#fff", fontFamily: "'Poppins',sans-serif", fontWeight: 600, fontSize: 14, cursor: salvandoPerfil ? "wait" : "pointer", opacity: salvandoPerfil ? 0.7 : 1 }}
        >
          {salvandoPerfil ? "A guardar…" : "Guardar Alterações"}
        </button>
      </SectionCard>

      {/* Segurança */}
      <SectionCard titulo="Segurança — Alterar Senha">
        <Campo label="Senha actual">
          <input
            type="password"
            value={senhas.atual}
            onChange={(e) => setSenhas((p) => ({ ...p, atual: e.target.value }))}
            placeholder="Introduza a senha actual"
            style={inputStyle}
            onFocus={(e) => (e.currentTarget.style.borderColor = G)}
            onBlur={(e) => (e.currentTarget.style.borderColor = "#d5e8d6")}
          />
        </Campo>
        <Campo label="Nova senha">
          <input
            type="password"
            value={senhas.nova}
            onChange={(e) => setSenhas((p) => ({ ...p, nova: e.target.value }))}
            placeholder="Mínimo 6 caracteres"
            style={inputStyle}
            onFocus={(e) => (e.currentTarget.style.borderColor = G)}
            onBlur={(e) => (e.currentTarget.style.borderColor = "#d5e8d6")}
          />
          {senhas.nova && (
            <div style={{ marginTop: 8 }}>
              <div style={{ display: "flex", gap: 4, marginBottom: 4 }}>
                {[1,2,3,4].map((n) => (
                  <div key={n} style={{ flex: 1, height: 4, borderRadius: 4, backgroundColor: forca >= n ? corForca[forca] : "#e8f0e8", transition: "background-color 0.3s" }} />
                ))}
              </div>
              <p style={{ fontFamily: "'Roboto',sans-serif", fontSize: 11, color: corForca[forca], margin: 0 }}>
                {labelForca[forca]}
              </p>
            </div>
          )}
        </Campo>
        <Campo label="Confirmar nova senha">
          <input
            type="password"
            value={senhas.confirmar}
            onChange={(e) => setSenhas((p) => ({ ...p, confirmar: e.target.value }))}
            placeholder="Repita a nova senha"
            style={{ ...inputStyle, borderColor: senhas.confirmar && senhas.nova !== senhas.confirmar ? "#d45a5a" : "#d5e8d6" }}
            onFocus={(e) => (e.currentTarget.style.borderColor = G)}
            onBlur={(e) => (e.currentTarget.style.borderColor = senhas.confirmar && senhas.nova !== senhas.confirmar ? "#d45a5a" : "#d5e8d6")}
          />
          {senhas.confirmar && senhas.nova !== senhas.confirmar && (
            <p style={{ fontFamily: "'Roboto',sans-serif", fontSize: 11, color: "#d45a5a", margin: "5px 0 0" }}>As senhas não coincidem.</p>
          )}
        </Campo>
        <button
          onClick={handleSalvarSenha}
          disabled={salvandoSenha}
          style={{ padding: "10px 24px", borderRadius: 9, border: "none", backgroundColor: G, color: "#fff", fontFamily: "'Poppins',sans-serif", fontWeight: 600, fontSize: 14, cursor: salvandoSenha ? "wait" : "pointer", opacity: salvandoSenha ? 0.7 : 1 }}
        >
          {salvandoSenha ? "A alterar…" : "Alterar Senha"}
        </button>
      </SectionCard>

    </div>
  );
}
