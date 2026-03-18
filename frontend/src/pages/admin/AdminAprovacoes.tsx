import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useFarmaciasStore, type FarmaciaLoja } from "../../store/farmaciasStore";
import { useEntregadoresAdminStore } from "../../store/entregadoresAdminStore";
import { useAdminLogsStore } from "../../store/adminLogsStore";
import { AprovacaoCard } from "../../components/admin/AprovacaoCard";

const G = "#2c5530";
const GOLD = "#c7a252";

function ModalRejeicao({
  nome,
  onConfirmar,
  onCancelar,
}: {
  nome: string;
  onConfirmar: (motivo: string) => void;
  onCancelar: () => void;
}) {
  const [motivo, setMotivo] = useState("");
  return (
    <div
      onClick={onCancelar}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9998,
        backgroundColor: "rgba(0,0,0,0.5)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 16,
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          backgroundColor: "#fff",
          borderRadius: 16,
          padding: 28,
          width: "100%",
          maxWidth: 440,
          borderTop: "4px solid #d45a5a",
        }}
      >
        <h3
          style={{
            fontFamily: "'Poppins',sans-serif",
            fontWeight: 600,
            fontSize: 16,
            color: "#2c3e2c",
            margin: "0 0 6px",
          }}
        >
          Rejeitar Cadastro
        </h3>
        <p
          style={{
            fontFamily: "'Roboto',sans-serif",
            fontSize: 13,
            color: "#7a8a7a",
            margin: "0 0 16px",
          }}
        >
          <strong>{nome}</strong>
        </p>
        <label
          style={{
            display: "block",
            fontFamily: "'Roboto',sans-serif",
            fontWeight: 500,
            fontSize: 11,
            color: "#4a7856",
            textTransform: "uppercase",
            letterSpacing: "0.06em",
            marginBottom: 6,
          }}
        >
          Motivo *
        </label>
        <textarea
          value={motivo}
          onChange={(e) => setMotivo(e.target.value)}
          rows={3}
          placeholder="Ex: Documentação incompleta..."
          style={{
            width: "100%",
            padding: "10px 12px",
            border: "1.5px solid #d5e8d6",
            borderRadius: 8,
            fontFamily: "'Roboto',sans-serif",
            fontSize: 14,
            resize: "none",
            boxSizing: "border-box",
            outline: "none",
          }}
        />
        <div style={{ display: "flex", gap: 10, marginTop: 16 }}>
          <button
            onClick={onCancelar}
            style={{
              flex: 1,
              padding: "10px",
              borderRadius: 8,
              border: "1.5px solid #d5e8d6",
              backgroundColor: "#fff",
              fontFamily: "'Roboto',sans-serif",
              fontSize: 14,
              cursor: "pointer",
            }}
          >
            Cancelar
          </button>
          <button
            onClick={() => motivo.trim() && onConfirmar(motivo)}
            disabled={!motivo.trim()}
            style={{
              flex: 1,
              padding: "10px",
              borderRadius: 8,
              border: "none",
              backgroundColor: motivo.trim() ? "#d45a5a" : "#e0e0e0",
              color: motivo.trim() ? "#fff" : "#999",
              fontFamily: "'Poppins',sans-serif",
              fontWeight: 600,
              fontSize: 14,
              cursor: motivo.trim() ? "pointer" : "not-allowed",
            }}
          >
            Confirmar
          </button>
        </div>
      </div>
    </div>
  );
}

export function AdminAprovacoes() {
  const [searchParams] = useSearchParams();
  const tabInicial = (searchParams.get("tab") as "farmacias" | "entregadores") || "farmacias";
  const [tab, setTab] = useState<"farmacias" | "entregadores">(tabInicial);
  const [modalRejeitarF, setModalRejeitarF] = useState<FarmaciaLoja | null>(null);
  const [modalRejeitarE, setModalRejeitarE] = useState<string | null>(null);
  const [toast, setToast] = useState({ visivel: false, msg: "", ok: true });

  const {
    obterPendentes: obterPendentesF,
    obterAprovadas,
    obterTodas,
    aprovarFarmacia,
    rejeitarFarmacia,
  } = useFarmaciasStore();
  const {
    obterPendentes: obterPendentesE,
    obterAprovados: obterAprovadosE,
    obterRejeitados: obterRejeitadosE,
    aprovarEntregador,
    rejeitarEntregador,
  } = useEntregadoresAdminStore();
  const addLog = useAdminLogsStore((s) => s.addLog);

  const pendentesF = obterPendentesF();
  const aprovadasF = obterAprovadas();
  const rejeitadasF = obterTodas().filter((f) => f.rejeitada);
  const pendentesE = obterPendentesE();
  const aprovadosE = obterAprovadosE();
  const rejeitadosE = obterRejeitadosE();

  const mostrarToast = (msg: string, ok = true) => {
    setToast({ visivel: true, msg, ok });
    setTimeout(() => setToast((p) => ({ ...p, visivel: false })), 3200);
  };

  const handleAprovarFarmacia = (f: FarmaciaLoja) => {
    aprovarFarmacia(f.id);
    addLog("Farmácia aprovada", f.nome, "farmacia");
    mostrarToast(`"${f.nome}" aprovada com sucesso.`);
  };

  const handleRejeitarFarmacia = (motivo: string) => {
    if (!modalRejeitarF) return;
    rejeitarFarmacia(modalRejeitarF.id, motivo);
    addLog("Farmácia rejeitada", modalRejeitarF.nome, "farmacia");
    mostrarToast(`"${modalRejeitarF.nome}" rejeitada.`, false);
    setModalRejeitarF(null);
  };

  const handleAprovarEntregador = (id: string, nome: string) => {
    aprovarEntregador(id);
    addLog("Entregador aprovado", nome, "entregador");
    mostrarToast(`"${nome}" aprovado com sucesso.`);
  };

  const handleRejeitarEntregador = (motivo: string) => {
    if (!modalRejeitarE) return;
    const ent = useEntregadoresAdminStore.getState().entregadores.find((e) => e.id === modalRejeitarE);
    if (ent) {
      rejeitarEntregador(modalRejeitarE, motivo);
      addLog("Entregador rejeitado", ent.nome, "entregador");
      mostrarToast(`"${ent.nome}" rejeitado.`, false);
    }
    setModalRejeitarE(null);
  };

  const tabs = [
    { id: "farmacias" as const, label: "Farmácias", count: pendentesF.length },
    { id: "entregadores" as const, label: "Entregadores", count: pendentesE.length },
  ];

  return (
    <div>
      {toast.visivel && (
        <div
          style={{
            position: "fixed",
            top: 24,
            right: 24,
            zIndex: 9999,
            padding: "12px 20px",
            borderRadius: 10,
            backgroundColor: toast.ok ? G : "#d45a5a",
            color: "#fff",
            fontFamily: "'Roboto',sans-serif",
            fontSize: 14,
            fontWeight: 500,
            boxShadow: "0 8px 24px rgba(0,0,0,0.18)",
            transition: "all 0.3s",
          }}
        >
          {toast.msg}
        </div>
      )}

      {modalRejeitarF && (
        <ModalRejeicao
          nome={modalRejeitarF.nome}
          onConfirmar={handleRejeitarFarmacia}
          onCancelar={() => setModalRejeitarF(null)}
        />
      )}
      {modalRejeitarE && (
        <ModalRejeicao
          nome={
            useEntregadoresAdminStore.getState().entregadores.find((e) => e.id === modalRejeitarE)
              ?.nome ?? "Entregador"
          }
          onConfirmar={handleRejeitarEntregador}
          onCancelar={() => setModalRejeitarE(null)}
        />
      )}

      <div style={{ marginBottom: 24 }}>
        <h1
          style={{
            fontFamily: "'Poppins',sans-serif",
            fontWeight: 700,
            fontSize: "clamp(1.2rem,3vw,1.6rem)",
            color: "#1a3320",
            margin: "0 0 4px",
          }}
        >
          Aprovações
        </h1>
        <p
          style={{
            fontFamily: "'Roboto',sans-serif",
            fontSize: 13,
            color: "#7a8a7a",
            margin: 0,
          }}
        >
          Analise pedidos de cadastro de farmácias e entregadores. Documentos enviados no cadastro estão indicados abaixo.
        </p>
      </div>

      <div
        style={{
          display: "flex",
          backgroundColor: "#fff",
          borderRadius: 10,
          border: "1px solid #e0ebe0",
          padding: 4,
          gap: 4,
          marginBottom: 20,
          width: "fit-content",
        }}
      >
        {tabs.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setTab(t.id)}
            style={{
              padding: "8px 18px",
              borderRadius: 7,
              border: "none",
              backgroundColor: tab === t.id ? G : "transparent",
              color: tab === t.id ? "#fff" : "#4a5e4a",
              fontFamily: "'Roboto',sans-serif",
              fontWeight: tab === t.id ? 600 : 400,
              fontSize: 13,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: 6,
            }}
          >
            {t.label}
            {t.count > 0 && (
              <span
                style={{
                  padding: "1px 6px",
                  borderRadius: 10,
                  backgroundColor: tab === t.id ? "rgba(255,255,255,0.25)" : GOLD,
                  color: tab === t.id ? "#fff" : "#1a3320",
                  fontSize: 10,
                  fontWeight: 700,
                }}
              >
                {t.count}
              </span>
            )}
          </button>
        ))}
      </div>

      {tab === "farmacias" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {pendentesF.map((f) => (
            <AprovacaoCard
              key={f.id}
              titulo={f.nome}
              status="PENDENTE"
              documentos={(f.documentosCadastro ?? []).map((d) => ({ label: d.label, preview: d.preview, fileName: d.fileName }))}
              onAprovar={() => handleAprovarFarmacia(f)}
              onRejeitar={() => setModalRejeitarF(f)}
            >
              <div style={{ display: "grid", gap: 8, fontFamily: "'Roboto',sans-serif", fontSize: 13, color: "#2c3e2c" }}>
                <p><strong>Email:</strong> {f.email}</p>
                <p><strong>Telefone:</strong> {f.telefone}</p>
                <p><strong>Responsável (Farmacêutico):</strong> {f.farmaceuticoNome}</p>
                <p><strong>Telefone do farmacêutico:</strong> {f.farmaceuticoTel}</p>
                <p><strong>Cédula profissional:</strong> {f.farmaceuticoCedula}</p>
                <p><strong>NIF:</strong> {f.nif}</p>
                <p><strong>Licença de funcionamento:</strong> {f.licencaFuncionamento}</p>
                <p><strong>Endereço:</strong> {f.rua}, {f.numEdificio}, {f.bairro}, {f.municipio}, {f.provincia}</p>
                <p><strong>Horário de funcionamento:</strong> {f.horarioAbertura} – {f.horarioFechamento}</p>
              </div>
            </AprovacaoCard>
          ))}
          {aprovadasF.length > 0 && (
            <div style={{ marginTop: 8 }}>
              <p style={{ fontFamily: "'Roboto',sans-serif", fontSize: 11, fontWeight: 600, color: "#7a8a7a", textTransform: "uppercase", marginBottom: 8 }}>Aprovadas</p>
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {aprovadasF.map((f) => (
                  <AprovacaoCard key={f.id} titulo={f.nome} status="APROVADO">
                    <p style={{ fontFamily: "'Roboto',sans-serif", fontSize: 13 }}>Email: {f.email} · Aprovada em {f.dataAprovacao ?? "—"}</p>
                  </AprovacaoCard>
                ))}
              </div>
            </div>
          )}
          {rejeitadasF.length > 0 && (
            <div style={{ marginTop: 8 }}>
              <p style={{ fontFamily: "'Roboto',sans-serif", fontSize: 11, fontWeight: 600, color: "#7a8a7a", textTransform: "uppercase", marginBottom: 8 }}>Rejeitadas</p>
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {rejeitadasF.map((f) => (
                  <AprovacaoCard key={f.id} titulo={f.nome} status="REJEITADO">
                    <p style={{ fontFamily: "'Roboto',sans-serif", fontSize: 13 }}>Motivo: {f.motivoRejeicao ?? "—"}</p>
                  </AprovacaoCard>
                ))}
              </div>
            </div>
          )}
          {pendentesF.length === 0 && aprovadasF.length === 0 && rejeitadasF.length === 0 && (
            <p style={{ textAlign: "center", padding: 48, color: "#9aa89a", fontFamily: "'Roboto',sans-serif" }}>Nenhuma farmácia registada.</p>
          )}
        </div>
      )}

      {tab === "entregadores" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {pendentesE.map((e) => (
            <AprovacaoCard
              key={e.id}
              titulo={e.nome}
              status="PENDENTE"
              documentos={e.documentos.map((d) => ({ label: d.label, preview: d.preview ?? undefined, fileName: d.fileName }))}
              onAprovar={() => handleAprovarEntregador(e.id, e.nome)}
              onRejeitar={() => setModalRejeitarE(e.id)}
            >
              <div style={{ display: "grid", gap: 8, fontFamily: "'Roboto',sans-serif", fontSize: 13, color: "#2c3e2c" }}>
                <p><strong>Nome:</strong> {e.nome}</p>
                <p><strong>Email:</strong> {e.email}</p>
                <p><strong>Telefone:</strong> {e.telefone}</p>
                <p><strong>Tipo de veículo:</strong> {e.tipoVeiculo}</p>
                {e.numeroBi && <p><strong>Nº BI:</strong> {e.numeroBi}</p>}
                {e.dataNasc && <p><strong>Data de nascimento:</strong> {e.dataNasc}</p>}
                {e.endereco && <p><strong>Endereço:</strong> {e.endereco}</p>}
                {(e.provincia || e.municipio) && <p><strong>Província / Município:</strong> {e.provincia} {e.municipio}</p>}
                {e.bairro && <p><strong>Bairro:</strong> {e.bairro}</p>}
                {(e.marcaMoto || e.modeloMoto) && <p><strong>Mota:</strong> {e.marcaMoto} {e.modeloMoto} {e.corMoto && `(${e.corMoto})`}</p>}
                {e.matricula && <p><strong>Matrícula:</strong> {e.matricula}</p>}
              </div>
            </AprovacaoCard>
          ))}
          {aprovadosE.length > 0 && (
            <div style={{ marginTop: 8 }}>
              <p style={{ fontFamily: "'Roboto',sans-serif", fontSize: 11, fontWeight: 600, color: "#7a8a7a", textTransform: "uppercase", marginBottom: 8 }}>Aprovados</p>
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {aprovadosE.map((e) => (
                  <AprovacaoCard key={e.id} titulo={e.nome} status="APROVADO">
                    <p style={{ fontFamily: "'Roboto',sans-serif", fontSize: 13 }}>Telefone: {e.telefone} · Veículo: {e.tipoVeiculo}</p>
                  </AprovacaoCard>
                ))}
              </div>
            </div>
          )}
          {rejeitadosE.length > 0 && (
            <div style={{ marginTop: 8 }}>
              <p style={{ fontFamily: "'Roboto',sans-serif", fontSize: 11, fontWeight: 600, color: "#7a8a7a", textTransform: "uppercase", marginBottom: 8 }}>Rejeitados</p>
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {rejeitadosE.map((e) => (
                  <AprovacaoCard key={e.id} titulo={e.nome} status="REJEITADO">
                    <p style={{ fontFamily: "'Roboto',sans-serif", fontSize: 13 }}>Motivo: {e.motivoRejeicao ?? "—"}</p>
                  </AprovacaoCard>
                ))}
              </div>
            </div>
          )}
          {pendentesE.length === 0 && aprovadosE.length === 0 && rejeitadosE.length === 0 && (
            <p style={{ textAlign: "center", padding: 48, color: "#9aa89a", fontFamily: "'Roboto',sans-serif" }}>Nenhum entregador registado.</p>
          )}
        </div>
      )}
    </div>
  );
}
