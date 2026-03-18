import { useAdminLogsStore } from "../../store/adminLogsStore";

const G = "#2c5530";

export function AdminLogs() {
  const { logs } = useAdminLogsStore();

  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <h1
          style={{
            fontFamily: "'Poppins',sans-serif",
            fontWeight: 700,
            fontSize: "clamp(1.2rem, 3vw, 1.6rem)",
            color: "#1a3320",
            margin: "0 0 4px",
          }}
        >
          Logs Administrativos
        </h1>
        <p
          style={{
            fontFamily: "'Roboto',sans-serif",
            fontSize: 13,
            color: "#7a8a7a",
            margin: 0,
          }}
        >
          Histórico de ações importantes realizadas pelo administrador.
        </p>
      </div>

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
            padding: "14px 20px",
            borderBottom: "1px solid #f0f5f0",
            backgroundColor: "#fafdf9",
            display: "grid",
            gridTemplateColumns: "120px 1fr 1fr",
            gap: 16,
            fontFamily: "'Roboto',sans-serif",
            fontWeight: 600,
            fontSize: 11,
            color: "#7a8a7a",
            textTransform: "uppercase",
            letterSpacing: "0.05em",
          }}
        >
          <span>Data</span>
          <span>Ação realizada</span>
          <span>Usuário afetado</span>
        </div>
        <div style={{ maxHeight: "60vh", overflowY: "auto" }}>
          {logs.length === 0 ? (
            <div
              style={{
                padding: 48,
                textAlign: "center",
                color: "#9aa89a",
                fontFamily: "'Roboto',sans-serif",
                fontSize: 14,
              }}
            >
              Nenhuma ação registada ainda.
            </div>
          ) : (
            logs.map((log, i) => (
              <div
                key={log.id}
                style={{
                  display: "grid",
                  gridTemplateColumns: "120px 1fr 1fr",
                  gap: 16,
                  padding: "14px 20px",
                  borderTop: i === 0 ? "none" : "1px solid #f0f5f0",
                  backgroundColor: i % 2 === 0 ? "#fff" : "#fafdf9",
                  fontFamily: "'Roboto',sans-serif",
                  fontSize: 13,
                  color: "#2c3e2c",
                  alignItems: "center",
                }}
              >
                <span style={{ color: "#7a8a7a", whiteSpace: "nowrap" }}>{log.data}</span>
                <span>{log.acao}</span>
                <span style={{ fontWeight: 500 }}>{log.usuarioAfetado}</span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
