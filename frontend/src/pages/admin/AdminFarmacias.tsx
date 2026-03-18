import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useFarmaciasStore, type FarmaciaLoja } from "../../store/farmaciasStore";
import { useAuth } from "../../hooks/useAuth";

// ─── Toast ────────────────────────────────────────────────────────────────────
function Toast({ msg, tipo, visivel }: { msg: string; tipo: "sucesso" | "erro"; visivel: boolean }) {
  return (
    <div style={{
      position: "fixed", top: 24, right: 24, zIndex: 9999,
      padding: "12px 20px", borderRadius: 10,
      backgroundColor: tipo === "sucesso" ? "#2c5530" : "#d45a5a",
      color: "#fff", fontFamily: "'Roboto', sans-serif", fontSize: 14, fontWeight: 500,
      boxShadow: "0 8px 24px rgba(0,0,0,0.18)",
      transform: visivel ? "translateY(0)" : "translateY(-16px)",
      opacity: visivel ? 1 : 0,
      transition: "all 0.3s ease", pointerEvents: "none",
    }}>
      {msg}
    </div>
  );
}

// ─── Modal de Rejeição ────────────────────────────────────────────────────────
function ModalRejeicao({
  farmacia,
  onConfirmar,
  onCancelar,
}: {
  farmacia: FarmaciaLoja;
  onConfirmar: (motivo: string) => void;
  onCancelar: () => void;
}) {
  const [motivo, setMotivo] = useState("");

  return (
    <div
      onClick={onCancelar}
      style={{ position: "fixed", inset: 0, zIndex: 9998, backgroundColor: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center", padding: 16 }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{ backgroundColor: "#fff", borderRadius: 16, padding: 28, width: "100%", maxWidth: 440, boxShadow: "0 20px 48px rgba(0,0,0,0.2)", borderTop: "4px solid #d45a5a" }}
      >
        <h3 style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 600, fontSize: 17, color: "#2c3e2c", margin: "0 0 6px" }}>
          Rejeitar cadastro
        </h3>
        <p style={{ fontFamily: "'Roboto', sans-serif", fontSize: 13, color: "#7a8a7a", margin: "0 0 18px" }}>
          Farmácia: <strong>{farmacia.nome}</strong>
        </p>
        <label style={{ display: "block", fontFamily: "'Roboto', sans-serif", fontWeight: 500, fontSize: 12, color: "#4a7856", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 6 }}>
          Motivo da rejeição *
        </label>
        <textarea
          value={motivo}
          onChange={(e) => setMotivo(e.target.value)}
          placeholder="Ex: Documentação incompleta. A licença de funcionamento está ilegível..."
          rows={4}
          style={{ width: "100%", padding: "10px 12px", border: "1.5px solid #d5e8d6", borderRadius: 8, fontFamily: "'Roboto', sans-serif", fontSize: 14, color: "#2c3e2c", resize: "none", boxSizing: "border-box", outline: "none" }}
          onFocus={(e) => (e.currentTarget.style.borderColor = "#2c5530")}
          onBlur={(e) => (e.currentTarget.style.borderColor = "#d5e8d6")}
        />
        <div style={{ display: "flex", gap: 10, marginTop: 18 }}>
          <button
            onClick={onCancelar}
            style={{ flex: 1, padding: "10px", borderRadius: 8, border: "1.5px solid #d5e8d6", backgroundColor: "#fff", fontFamily: "'Roboto', sans-serif", fontSize: 14, color: "#4a5e4a", cursor: "pointer" }}
          >
            Cancelar
          </button>
          <button
            onClick={() => { if (motivo.trim()) onConfirmar(motivo.trim()); }}
            disabled={!motivo.trim()}
            style={{ flex: 1, padding: "10px", borderRadius: 8, border: "none", backgroundColor: motivo.trim() ? "#d45a5a" : "#e0e0e0", color: motivo.trim() ? "#fff" : "#999", fontFamily: "'Poppins', sans-serif", fontWeight: 600, fontSize: 14, cursor: motivo.trim() ? "pointer" : "not-allowed" }}
          >
            Confirmar Rejeição
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Card de Farmácia Pendente ────────────────────────────────────────────────
function CardPendente({
  farm,
  onAprovar,
  onRejeitar,
}: {
  farm: FarmaciaLoja;
  onAprovar: () => void;
  onRejeitar: () => void;
}) {
  const [expandido, setExpandido] = useState(false);

  const campo = (label: string, valor: string) => (
    <div style={{ marginBottom: 8 }}>
      <span style={{ fontFamily: "'Roboto', sans-serif", fontSize: 11, fontWeight: 600, color: "#7a8a7a", textTransform: "uppercase", letterSpacing: "0.06em" }}>{label}</span>
      <p style={{ fontFamily: "'Roboto', sans-serif", fontSize: 14, color: "#2c3e2c", margin: "2px 0 0" }}>{valor || "—"}</p>
    </div>
  );

  return (
    <div style={{ backgroundColor: "#fff", borderRadius: 14, border: "1px solid #e8f0e8", boxShadow: "0 2px 10px rgba(44,85,48,0.06)", overflow: "hidden" }}>
      {/* Cabeçalho do card */}
      <div style={{ padding: "18px 20px", borderBottom: "1px solid #f0f5f0", display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 12 }}>
        <div style={{ flex: 1 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4 }}>
            <div style={{ width: 36, height: 36, borderRadius: 9, backgroundColor: "rgba(199,162,82,0.12)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <span style={{ fontSize: 16 }}>🏥</span>
            </div>
            <div>
              <h3 style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 600, fontSize: 15, color: "#2c3e2c", margin: 0 }}>
                {farm.nome}
              </h3>
              <p style={{ fontFamily: "'Roboto', sans-serif", fontSize: 12, color: "#7a8a7a", margin: 0 }}>
                {farm.provincia}, {farm.municipio} · Registada em {farm.dataRegisto}
              </p>
            </div>
          </div>
        </div>
        <span style={{ padding: "4px 12px", borderRadius: 20, backgroundColor: "rgba(199,162,82,0.12)", color: "#8a6e25", fontFamily: "'Roboto', sans-serif", fontSize: 11, fontWeight: 600, flexShrink: 0 }}>
          Pendente
        </span>
      </div>

      {/* Info resumida */}
      <div style={{ padding: "14px 20px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px 20px" }}>
          {campo("Email", farm.email)}
          {campo("Telefone", farm.telefone)}
          {campo("NIF", farm.nif)}
          {campo("Licença de Funcionamento", farm.licencaFuncionamento)}
        </div>

        {/* Detalhes expandíveis */}
        {expandido && (
          <div style={{ marginTop: 12, paddingTop: 12, borderTop: "1px solid #f0f5f0" }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px 20px" }}>
              {campo("Bairro", farm.bairro)}
              {campo("Rua", farm.rua + (farm.numEdificio ? `, nº ${farm.numEdificio}` : ""))}
              {campo("Horário", `${farm.horarioAbertura} – ${farm.horarioFechamento}`)}
              {campo("Farmacêutico", farm.farmaceuticoNome)}
              {campo("Cédula Profissional", farm.farmaceuticoCedula)}
              {campo("Tel. Farmacêutico", farm.farmaceuticoTel)}
            </div>
          </div>
        )}

        <button
          onClick={() => setExpandido(!expandido)}
          style={{ marginTop: 10, background: "none", border: "none", cursor: "pointer", fontFamily: "'Roboto', sans-serif", fontSize: 12, color: "#2c5530", fontWeight: 500, padding: 0 }}
        >
          {expandido ? "▲ Ver menos" : "▼ Ver mais detalhes"}
        </button>
      </div>

      {/* Acções */}
      <div style={{ padding: "12px 20px 16px", display: "flex", gap: 10, borderTop: "1px solid #f0f5f0" }}>
        <button
          onClick={onRejeitar}
          style={{ flex: 1, padding: "10px", borderRadius: 8, border: "1.5px solid #d45a5a", backgroundColor: "#fff", color: "#d45a5a", fontFamily: "'Poppins', sans-serif", fontWeight: 600, fontSize: 13, cursor: "pointer", transition: "all 0.15s" }}
          onMouseOver={(e) => { e.currentTarget.style.backgroundColor = "rgba(212,90,90,0.06)"; }}
          onMouseOut={(e) => { e.currentTarget.style.backgroundColor = "#fff"; }}
        >
          Rejeitar
        </button>
        <button
          onClick={onAprovar}
          style={{ flex: 2, padding: "10px", borderRadius: 8, border: "none", backgroundColor: "#2c5530", color: "#fff", fontFamily: "'Poppins', sans-serif", fontWeight: 600, fontSize: 13, cursor: "pointer", transition: "opacity 0.15s" }}
          onMouseOver={(e) => { e.currentTarget.style.opacity = "0.88"; }}
          onMouseOut={(e) => { e.currentTarget.style.opacity = "1"; }}
        >
          ✓ Aprovar Farmácia
        </button>
      </div>
    </div>
  );
}

// ─── Componente Principal ─────────────────────────────────────────────────────
export function AdminFarmacias() {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const { obterPendentes, obterAprovadas, obterTodas, aprovarFarmacia, rejeitarFarmacia } = useFarmaciasStore();
  const [tab, setTab] = useState<"pendentes" | "aprovadas" | "rejeitadas">("pendentes");
  const [modalFarmacia, setModalFarmacia] = useState<FarmaciaLoja | null>(null);
  const [toast, setToast] = useState({ visivel: false, msg: "", tipo: "sucesso" as "sucesso" | "erro" });

  const mostrarToast = (tipo: "sucesso" | "erro", msg: string) => {
    setToast({ visivel: true, msg, tipo });
    setTimeout(() => setToast((p) => ({ ...p, visivel: false })), 3500);
  };

  const handleAprovar = (id: string, nome: string) => {
    aprovarFarmacia(id);
    mostrarToast("sucesso", `"${nome}" aprovada e já visível no catálogo público.`);
  };

  const handleRejeitar = (farm: FarmaciaLoja) => {
    setModalFarmacia(farm);
  };

  const confirmarRejeicao = (motivo: string) => {
    if (!modalFarmacia) return;
    rejeitarFarmacia(modalFarmacia.id, motivo);
    mostrarToast("erro", `"${modalFarmacia.nome}" rejeitada.`);
    setModalFarmacia(null);
  };

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  const pendentes  = obterPendentes();
  const aprovadas  = obterAprovadas();
  const rejeitadas = obterTodas().filter((f) => f.rejeitada);

  const tabs: { id: typeof tab; label: string; count: number; cor: string }[] = [
    { id: "pendentes",  label: "Pendentes",  count: pendentes.length,  cor: "#c7a252" },
    { id: "aprovadas",  label: "Aprovadas",  count: aprovadas.length,  cor: "#2c5530" },
    { id: "rejeitadas", label: "Rejeitadas", count: rejeitadas.length, cor: "#d45a5a" },
  ];

  const listaActual =
    tab === "pendentes"  ? pendentes  :
    tab === "aprovadas"  ? aprovadas  :
    rejeitadas;

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#f4f7f4" }}>
      <Toast msg={toast.msg} tipo={toast.tipo} visivel={toast.visivel} />
      {modalFarmacia && (
        <ModalRejeicao
          farmacia={modalFarmacia}
          onConfirmar={confirmarRejeicao}
          onCancelar={() => setModalFarmacia(null)}
        />
      )}

      {/* Header */}
      <header style={{ backgroundColor: "#2c5530", padding: "0 24px", height: 60, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ width: 32, height: 32, borderRadius: 8, backgroundColor: "rgba(199,162,82,0.2)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <span style={{ color: "#c7a252", fontFamily: "'Poppins', sans-serif", fontWeight: 700, fontSize: 16 }}>T</span>
          </div>
          <span style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 600, fontSize: 16, color: "#fff" }}>
            Twala<span style={{ color: "#c7a252" }}>Care</span>
            <span style={{ fontFamily: "'Roboto', sans-serif", fontWeight: 400, fontSize: 12, color: "rgba(255,255,255,0.6)", marginLeft: 10 }}>
              Painel Admin
            </span>
          </span>
        </div>
        <button
          onClick={handleLogout}
          style={{ padding: "6px 14px", borderRadius: 8, border: "1px solid rgba(255,255,255,0.25)", backgroundColor: "transparent", color: "rgba(255,255,255,0.8)", fontFamily: "'Roboto', sans-serif", fontSize: 13, cursor: "pointer" }}
          onMouseOver={(e) => { e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.1)"; }}
          onMouseOut={(e) => { e.currentTarget.style.backgroundColor = "transparent"; }}
        >
          Sair
        </button>
      </header>

      <div style={{ maxWidth: 900, margin: "0 auto", padding: "32px 20px 60px" }}>

        {/* Título */}
        <div style={{ marginBottom: 28 }}>
          <h1 style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 700, fontSize: "clamp(1.3rem, 3vw, 1.7rem)", color: "#1e2e1e", margin: "0 0 6px" }}>
            Gestão de Farmácias
          </h1>
          <div style={{ width: 44, height: 3, background: "linear-gradient(90deg, #2c5530, #c7a252)", borderRadius: 2, marginBottom: 6 }} />
          <p style={{ fontFamily: "'Roboto', sans-serif", fontSize: 13, color: "#7a8a7a", margin: 0 }}>
            Aprove ou rejeite os cadastros de farmácias. Apenas as aprovadas são visíveis no catálogo público.
          </p>
        </div>

        {/* Estatísticas */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 14, marginBottom: 28 }}>
          {tabs.map((t) => (
            <div key={t.id} style={{ backgroundColor: "#fff", borderRadius: 12, border: "1px solid #e8f0e8", padding: "16px 18px", boxShadow: "0 1px 4px rgba(44,85,48,0.05)" }}>
              <p style={{ fontFamily: "'Roboto', sans-serif", fontSize: 12, color: "#7a8a7a", margin: "0 0 4px", textTransform: "uppercase", letterSpacing: "0.05em" }}>{t.label}</p>
              <p style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 700, fontSize: 28, color: t.cor, margin: 0 }}>{t.count}</p>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div style={{ display: "flex", backgroundColor: "#fff", borderRadius: 10, border: "1px solid #e0ebe0", padding: 4, marginBottom: 24, gap: 4, width: "fit-content" }}>
          {tabs.map((t) => {
            const ativo = tab === t.id;
            return (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                style={{
                  padding: "8px 20px", borderRadius: 7, border: "none",
                  backgroundColor: ativo ? t.cor : "transparent",
                  color: ativo ? "#fff" : "#4a5e4a",
                  fontFamily: "'Roboto', sans-serif", fontWeight: ativo ? 600 : 400,
                  fontSize: 13, cursor: "pointer", transition: "all 0.15s",
                  display: "flex", alignItems: "center", gap: 6,
                }}
              >
                {t.label}
                {t.count > 0 && (
                  <span style={{ padding: "1px 7px", borderRadius: 10, backgroundColor: ativo ? "rgba(255,255,255,0.25)" : "rgba(44,85,48,0.1)", fontSize: 11, fontWeight: 600 }}>
                    {t.count}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Lista */}
        {listaActual.length === 0 ? (
          <div style={{ textAlign: "center", padding: "48px 20px", backgroundColor: "#fff", borderRadius: 14, border: "1px solid #e8f0e8" }}>
            <p style={{ fontSize: 32, margin: "0 0 12px" }}>
              {tab === "pendentes" ? "✅" : tab === "aprovadas" ? "🏥" : "📋"}
            </p>
            <p style={{ fontFamily: "'Poppins', sans-serif", fontSize: 16, fontWeight: 600, color: "#2c3e2c", margin: "0 0 4px" }}>
              {tab === "pendentes" ? "Nenhum cadastro pendente" : tab === "aprovadas" ? "Nenhuma farmácia aprovada" : "Nenhuma farmácia rejeitada"}
            </p>
            <p style={{ fontFamily: "'Roboto', sans-serif", fontSize: 13, color: "#7a8a7a", margin: 0 }}>
              {tab === "pendentes" ? "Todos os cadastros foram processados." : ""}
            </p>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {tab === "pendentes" && listaActual.map((farm) => (
              <CardPendente
                key={farm.id}
                farm={farm}
                onAprovar={() => handleAprovar(farm.id, farm.nome)}
                onRejeitar={() => handleRejeitar(farm)}
              />
            ))}

            {tab !== "pendentes" && listaActual.map((farm) => (
              <div key={farm.id} style={{ backgroundColor: "#fff", borderRadius: 14, border: `1px solid ${farm.aprovada ? "#d5e8d6" : "#f5d5d5"}`, padding: "18px 20px", boxShadow: "0 1px 4px rgba(0,0,0,0.04)" }}>
                <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 12 }}>
                  <div>
                    <h3 style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 600, fontSize: 15, color: "#2c3e2c", margin: "0 0 4px" }}>
                      {farm.nome}
                    </h3>
                    <p style={{ fontFamily: "'Roboto', sans-serif", fontSize: 13, color: "#7a8a7a", margin: 0 }}>
                      {farm.provincia}, {farm.municipio} · {farm.email}
                    </p>
                    {farm.rejeitada && farm.motivoRejeicao && (
                      <p style={{ fontFamily: "'Roboto', sans-serif", fontSize: 12, color: "#d45a5a", margin: "6px 0 0", padding: "6px 10px", backgroundColor: "rgba(212,90,90,0.06)", borderRadius: 6 }}>
                        Motivo: {farm.motivoRejeicao}
                      </p>
                    )}
                  </div>
                  <span style={{
                    padding: "4px 12px", borderRadius: 20, flexShrink: 0,
                    backgroundColor: farm.aprovada ? "rgba(44,85,48,0.1)" : "rgba(212,90,90,0.1)",
                    color: farm.aprovada ? "#2c5530" : "#d45a5a",
                    fontFamily: "'Roboto', sans-serif", fontSize: 11, fontWeight: 600,
                  }}>
                    {farm.aprovada ? `✓ Aprovada em ${farm.dataAprovacao}` : "✗ Rejeitada"}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
