import type { ReactNode } from "react";

const G = "#2c5530";
const GOLD = "#c7a252";

export type StatusAprovacao = "PENDENTE" | "APROVADO" | "REJEITADO";

export interface DocumentoParaAdmin {
  label: string;
  preview?: string | null;
  url?: string;
  fileName?: string;
}

export interface AprovacaoCardProps {
  titulo: string;
  status: StatusAprovacao;
  children: ReactNode;
  documentos?: DocumentoParaAdmin[];
  onAprovar?: () => void;
  onRejeitar?: () => void;
  loading?: boolean;
}

export function AprovacaoCard({
  titulo,
  status,
  children,
  documentos = [],
  onAprovar,
  onRejeitar,
  loading = false,
}: AprovacaoCardProps) {
  const statusConfig: Record<
    StatusAprovacao,
    { label: string; bg: string; color: string }
  > = {
    PENDENTE: { label: "Pendente", bg: "rgba(199,162,82,0.12)", color: "#8a6e25" },
    APROVADO: { label: "Aprovado", bg: "rgba(44,85,48,0.1)", color: G },
    REJEITADO: { label: "Rejeitado", bg: "rgba(212,90,90,0.1)", color: "#a03030" },
  };
  const sc = statusConfig[status];

  return (
    <div
      style={{
        backgroundColor: "#fff",
        borderRadius: 14,
        border: "1px solid #e8f0e8",
        overflow: "hidden",
        boxShadow: "0 2px 8px rgba(44,85,48,0.06)",
      }}
    >
      <div
        style={{
          padding: "16px 20px",
          borderBottom: "1px solid #f0f5f0",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: 10,
        }}
      >
        <h3
          style={{
            fontFamily: "'Poppins',sans-serif",
            fontWeight: 600,
            fontSize: 15,
            color: "#1a3320",
            margin: 0,
          }}
        >
          {titulo}
        </h3>
        <span
          style={{
            padding: "3px 10px",
            borderRadius: 20,
            backgroundColor: sc.bg,
            color: sc.color,
            fontFamily: "'Roboto',sans-serif",
            fontSize: 11,
            fontWeight: 600,
          }}
        >
          {sc.label}
        </span>
      </div>
      <div style={{ padding: "18px 20px" }}>
        {children}
        {documentos.length > 0 && (
          <div style={{ marginTop: 16 }}>
            <p
              style={{
                fontFamily: "'Roboto',sans-serif",
                fontWeight: 600,
                fontSize: 11,
                color: "#7a8a7a",
                textTransform: "uppercase",
                letterSpacing: "0.06em",
                margin: "0 0 10px",
              }}
            >
              Documentos enviados no cadastro (imagens / ficheiros)
            </p>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))",
                gap: 12,
              }}
            >
              {documentos.map((d, i) => (
                <div
                  key={i}
                  style={{
                    border: "1px solid #e8f0e8",
                    borderRadius: 10,
                    overflow: "hidden",
                    backgroundColor: "#fafdf9",
                  }}
                >
                  <p style={{ padding: "6px 10px", margin: 0, fontFamily: "'Roboto',sans-serif", fontSize: 11, fontWeight: 600, color: "#2c3e2c", borderBottom: "1px solid #e8f0e8" }}>
                    {d.label}
                    {d.fileName && <span style={{ display: "block", fontWeight: 400, color: "#7a8a7a", fontSize: 10 }}>{d.fileName}</span>}
                  </p>
                  {(d.preview || d.url) ? (
                    <a
                      href={d.preview ?? d.url ?? "#"}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ display: "block", padding: 8 }}
                    >
                      {d.preview && (d.preview.startsWith("data:image") || d.preview.startsWith("http")) ? (
                        <img
                          src={d.preview}
                          alt={d.label}
                          style={{ width: "100%", height: 120, objectFit: "cover", borderRadius: 6 }}
                        />
                      ) : (
                        <span style={{ fontFamily: "'Roboto',sans-serif", fontSize: 12, color: G }}>Abrir documento →</span>
                      )}
                    </a>
                  ) : (
                    <p style={{ padding: 8, margin: 0, fontFamily: "'Roboto',sans-serif", fontSize: 11, color: "#9aa89a" }}>Sem preview</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
        {status === "PENDENTE" && (onAprovar || onRejeitar) && (
          <div
            style={{
              display: "flex",
              gap: 10,
              marginTop: 18,
              paddingTop: 16,
              borderTop: "1px solid #f0f5f0",
            }}
          >
            {onRejeitar && (
              <button
                type="button"
                onClick={onRejeitar}
                disabled={loading}
                style={{
                  padding: "8px 16px",
                  borderRadius: 8,
                  border: "1.5px solid #d45a5a",
                  backgroundColor: "#fff",
                  color: "#d45a5a",
                  fontFamily: "'Poppins',sans-serif",
                  fontWeight: 600,
                  fontSize: 12,
                  cursor: loading ? "wait" : "pointer",
                }}
              >
                Rejeitar
              </button>
            )}
            {onAprovar && (
              <button
                type="button"
                onClick={onAprovar}
                disabled={loading}
                style={{
                  padding: "8px 18px",
                  borderRadius: 8,
                  border: "none",
                  backgroundColor: G,
                  color: "#fff",
                  fontFamily: "'Poppins',sans-serif",
                  fontWeight: 600,
                  fontSize: 12,
                  cursor: loading ? "wait" : "pointer",
                }}
              >
                ✓ Aprovar
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
