import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAdminLogsStore } from "../../store/adminLogsStore";
import { useFarmaciasStore } from "../../store/farmaciasStore";
import { useEntregadoresAdminStore } from "../../store/entregadoresAdminStore";

const G = "#1a3320";
const GOLD = "#c7a252";
const GREEN = "#2c5530";

const IconBell = () => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
    <path d="M13.73 21a2 2 0 0 1-3.46 0" />
  </svg>
);

export function NotificacaoIcon() {
  const navigate = useNavigate();
  const [aberto, setAberto] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const { notificacoes, obterNaoLidas, marcarNotificacaoLida, marcarTodasLidas } =
    useAdminLogsStore();
  const pendentesFarmacias = useFarmaciasStore((s) => s.obterPendentes());
  const pendentesEntregadores = useEntregadoresAdminStore((s) =>
    s.obterPendentes()
  );

  const naoLidas = obterNaoLidas();
  const totalPendentes = pendentesFarmacias.length + pendentesEntregadores.length;

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setAberto(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const irAprovacoes = (tipo?: "farmacia" | "entregador") => {
    setAberto(false);
    navigate("/admin/aprovacoes" + (tipo ? `?tab=${tipo}` : ""));
  };

  return (
    <div style={{ position: "relative" }} ref={ref}>
      <button
        type="button"
        onClick={() => setAberto((v) => !v)}
        style={{
          padding: 8,
          borderRadius: 8,
          border: "1px solid #e0ebe0",
          backgroundColor: "transparent",
          cursor: "pointer",
          color: GREEN,
          display: "flex",
        }}
        title="Notificações"
        aria-label="Notificações"
      >
        <IconBell />
      </button>
      {(totalPendentes > 0 || naoLidas.length > 0) && (
        <span
          style={{
            position: "absolute",
            top: 4,
            right: 4,
            width: 8,
            height: 8,
            borderRadius: "50%",
            backgroundColor: GOLD,
            border: "1.5px solid #fff",
          }}
        />
      )}

      {aberto && (
        <div
          style={{
            position: "absolute",
            top: "100%",
            right: 0,
            marginTop: 8,
            width: 320,
            maxWidth: "90vw",
            backgroundColor: "#fff",
            borderRadius: 12,
            border: "1px solid #e8f0e8",
            boxShadow: "0 12px 32px rgba(0,0,0,0.12)",
            zIndex: 9999,
            overflow: "hidden",
          }}
        >
          <div
            style={{
              padding: "12px 16px",
              borderBottom: "1px solid #f0f5f0",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              backgroundColor: "#fafdf9",
            }}
          >
            <span
              style={{
                fontFamily: "'Poppins',sans-serif",
                fontWeight: 600,
                fontSize: 13,
                color: G,
              }}
            >
              Notificações
            </span>
            {naoLidas.length > 0 && (
              <button
                type="button"
                onClick={() => marcarTodasLidas()}
                style={{
                  fontFamily: "'Roboto',sans-serif",
                  fontSize: 11,
                  color: GREEN,
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                }}
              >
                Marcar todas como lidas
              </button>
            )}
          </div>
          <div style={{ maxHeight: 360, overflowY: "auto" }}>
            {pendentesFarmacias.length > 0 && (
              <div style={{ padding: "8px 0", borderBottom: "1px solid #f0f5f0" }}>
                <button
                  type="button"
                  onClick={() => irAprovacoes("farmacia")}
                  style={{
                    width: "100%",
                    padding: "12px 16px",
                    textAlign: "left",
                    border: "none",
                    background: "none",
                    cursor: "pointer",
                    fontFamily: "'Roboto',sans-serif",
                    fontSize: 13,
                    color: "#2c3e2c",
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = "#f0f8f0";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = "transparent";
                  }}
                >
                  <span style={{ fontSize: 20 }}>🏥</span>
                  <div>
                    <strong>Nova farmácia solicita cadastro</strong>
                    <p style={{ margin: "2px 0 0", color: "#7a8a7a", fontSize: 12 }}>
                      {pendentesFarmacias.length} aguardam aprovação. Ver documentos no painel Aprovações.
                    </p>
                  </div>
                </button>
              </div>
            )}
            {pendentesEntregadores.length > 0 && (
              <div style={{ padding: "8px 0", borderBottom: "1px solid #f0f5f0" }}>
                <button
                  type="button"
                  onClick={() => irAprovacoes("entregador")}
                  style={{
                    width: "100%",
                    padding: "12px 16px",
                    textAlign: "left",
                    border: "none",
                    background: "none",
                    cursor: "pointer",
                    fontFamily: "'Roboto',sans-serif",
                    fontSize: 13,
                    color: "#2c3e2c",
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = "#f0f8f0";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = "transparent";
                  }}
                >
                  <span style={{ fontSize: 20 }}>🏍️</span>
                  <div>
                    <strong>Novo entregador solicita cadastro</strong>
                    <p style={{ margin: "2px 0 0", color: "#7a8a7a", fontSize: 12 }}>
                      {pendentesEntregadores.length} aguardam aprovação. Ver documentos no painel Aprovações.
                    </p>
                  </div>
                </button>
              </div>
            )}
            {notificacoes.slice(0, 10).map((n) => (
              <div
                key={n.id}
                style={{
                  padding: "10px 16px",
                  borderBottom: "1px solid #f0f5f0",
                  backgroundColor: n.lida ? "#fff" : "rgba(44,85,48,0.04)",
                }}
              >
                <div
                  style={{
                    fontFamily: "'Roboto',sans-serif",
                    fontSize: 12,
                    color: "#2c3e2c",
                  }}
                >
                  {n.titulo}: <strong>{n.nomeRef}</strong>
                </div>
                <div
                  style={{
                    fontSize: 11,
                    color: "#9aa89a",
                    marginTop: 2,
                  }}
                >
                  {n.data}
                </div>
              </div>
            ))}
            {totalPendentes === 0 && notificacoes.length === 0 && (
              <div
                style={{
                  padding: 24,
                  textAlign: "center",
                  color: "#9aa89a",
                  fontFamily: "'Roboto',sans-serif",
                  fontSize: 13,
                }}
              >
                Nenhuma notificação
              </div>
            )}
          </div>
          <div
            style={{
              padding: "8px 16px",
              borderTop: "1px solid #f0f5f0",
              backgroundColor: "#fafdf9",
            }}
          >
            <button
              type="button"
              onClick={() => irAprovacoes()}
              style={{
                width: "100%",
                padding: "8px",
                fontFamily: "'Roboto',sans-serif",
                fontSize: 12,
                fontWeight: 600,
                color: GREEN,
                background: "none",
                border: "none",
                cursor: "pointer",
              }}
            >
              Ver Aprovações →
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
